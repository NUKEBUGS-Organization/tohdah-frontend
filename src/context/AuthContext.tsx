import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../api/client';
import {
  clearTokens,
  setAccessToken,
  setRefreshToken,
  getRefreshToken,
} from '../api/client';
import type { AuthResponse, User } from '../api/types';
import {
  onForegroundMessage,
  requestNotificationPermission,
} from '../lib/firebase';
import { disconnectSocket } from '../lib/socket';
import { usersService } from '../api/services';
import { notify } from '../utils/notify';

function normalizeUser(raw: User): User {
  return {
    ...raw,
    authProvider: raw.authProvider ?? 'local',
    role: raw.role ?? 'user',
    accountStatus: raw.accountStatus ?? 'active',
    loyaltyPoints: raw.loyaltyPoints ?? 0,
    loyaltyTier: raw.loyaltyTier ?? 'bronze',
    referralCode: raw.referralCode ?? null,
    languages: raw.languages ?? [],
    travelPreferences: raw.travelPreferences ?? [],
  };
}

function appHomeForUser(u: User): string {
  const t = u.accountType;
  if (t === 'requester') return '/app/requester';
  if (t === 'traveler' || t === 'both') return '/app/traveler';
  return '/app/traveler';
}

function postLoginPath(u: User): string {
  if (!u.onboardingCompleted) {
    return '/onboarding/step-1';
  }
  if (!u.accountType) {
    return '/onboarding/step-3';
  }
  return appHomeForUser(u);
}

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  /** Store tokens and load `/auth/me` (no navigation). Returns normalized user. */
  applyTokens: (accessToken: string, refreshToken: string) => Promise<User>;
  /** OAuth redirect flow: persist tokens, load profile, FCM, then navigate by onboarding. */
  applyTokensFromGoogle: (
    accessToken: string,
    refreshToken: string,
    isNewUser: boolean,
  ) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const fcmForegroundUnsubRef = useRef<(() => void) | null>(null);

  const registerPushNotifications = useCallback(async () => {
    if (typeof window === 'undefined') return;
    try {
      const token = await requestNotificationPermission();
      if (!token) return;

      await usersService.registerFcmToken(token);
      localStorage.setItem('tohdah_fcm_token', token);

      fcmForegroundUnsubRef.current?.();
      fcmForegroundUnsubRef.current = null;
      const unsub = await onForegroundMessage((payload) => {
        notify.info(payload.body, payload.title);
      });
      if (unsub) fcmForegroundUnsubRef.current = unsub;
    } catch (err) {
      console.warn('Push notification setup failed:', err);
    }
  }, []);

  const refreshUser = useCallback(async () => {
    const me = await api.get<User>('/auth/me');
    if (!me?.id) {
      setUser(null);
      return;
    }
    setUser(normalizeUser(me));
  }, []);

  const applyTokens = useCallback(async (accessToken: string, refreshToken: string) => {
    setAccessToken(accessToken);
    setRefreshToken(refreshToken);
    const me = await api.get<User>('/auth/me');
    if (!me?.id) {
      clearTokens();
      setUser(null);
      throw new Error('Could not load profile');
    }
    const nu = normalizeUser(me);
    setUser(nu);
    void registerPushNotifications();
    return nu;
  }, [registerPushNotifications]);

  const logout = useCallback(async () => {
    fcmForegroundUnsubRef.current?.();
    fcmForegroundUnsubRef.current = null;
    const fcmToken = localStorage.getItem('tohdah_fcm_token');
    if (fcmToken) {
      await usersService.removeFcmToken(fcmToken).catch(() => {});
      localStorage.removeItem('tohdah_fcm_token');
    }

    const rt = getRefreshToken();
    try {
      if (rt) {
        await api.post<{ message: string }>(
          '/auth/logout',
          { refreshToken: rt },
          { skipAuth: true },
        );
      }
    } catch {
      // still clear locally
    }
    clearTokens();
    setUser(null);
    disconnectSocket();
    navigate('/login', { replace: true });
  }, [navigate]);

  useEffect(() => {
    const onExpired = () => {
      void logout();
    };
    window.addEventListener('tohdah:session-expired', onExpired);
    return () => window.removeEventListener('tohdah:session-expired', onExpired);
  }, [logout]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const rt = getRefreshToken();
      if (!rt) {
        if (!cancelled) setIsLoading(false);
        return;
      }
      try {
        const data = await api.post<Pick<AuthResponse, 'accessToken' | 'refreshToken'>>(
          '/auth/refresh',
          { refreshToken: rt },
          { skipAuth: true },
        );
        if (!data?.accessToken) {
          if (!cancelled) {
            clearTokens();
            setUser(null);
            setIsLoading(false);
          }
          return;
        }
        setAccessToken(data.accessToken);
        setRefreshToken(data.refreshToken);
        const me = await api.get<User>('/auth/me');
        if (!cancelled) {
          if (me?.id) {
            setUser(normalizeUser(me));
            void registerPushNotifications();
          } else {
            clearTokens();
            setUser(null);
          }
        }
      } catch {
        if (!cancelled) {
          clearTokens();
          setUser(null);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [registerPushNotifications]);

  const login = useCallback(
    async (email: string, password: string) => {
      const data = await api.post<AuthResponse>(
        '/auth/login',
        { email, password },
        { skipAuth: true },
      );
      const nu = await applyTokens(data.accessToken, data.refreshToken);
      navigate(postLoginPath(nu), { replace: true });
    },
    [applyTokens, navigate],
  );

  const applyTokensFromGoogle = useCallback(
    async (
      accessToken: string,
      refreshToken: string,
      isNewUser: boolean,
    ): Promise<void> => {
      setAccessToken(accessToken);
      setRefreshToken(refreshToken);

      const me = await api.get<User>('/auth/me');
      if (!me?.id) {
        clearTokens();
        setUser(null);
        notify.error('Could not load your profile.');
        navigate('/login', { replace: true });
        return;
      }

      const nu = normalizeUser(me);
      setUser(nu);
      void registerPushNotifications();

      if (isNewUser || !nu.onboardingCompleted) {
        navigate('/onboarding/step-1', { replace: true });
      } else if (nu.accountType) {
        navigate(
          nu.accountType === 'requester'
            ? '/app/requester'
            : '/app/traveler',
          { replace: true },
        );
      } else {
        navigate('/onboarding/step-3', { replace: true });
      }
    },
    [navigate, registerPushNotifications],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: !!user,
      login,
      applyTokens,
      applyTokensFromGoogle,
      logout,
      refreshUser,
    }),
    [
      user,
      isLoading,
      login,
      applyTokens,
      applyTokensFromGoogle,
      logout,
      refreshUser,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return ctx;
}
