import {
  Anchor,
  Button,
  Center,
  PasswordInput,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  Title,
} from '@mantine/core';
import { IconLock, IconMail, IconShield } from '@tabler/icons-react';
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiRequestError, clearTokens } from '../../api/client';
import type { AuthResponse } from '../../api/types';
import { useAuth } from '../../context/AuthContext';
import { adminUi as AU } from '../../theme';
import { notify } from '../../utils/notify';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const { applyTokens } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => () => setIsSubmitting(false), []);

  const handleLogin = async () => {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail || !password) {
      notify.error('Please enter email and password');
      return;
    }

    setIsSubmitting(true);
    try {
      const data = await api.post<AuthResponse>(
        '/auth/login',
        { email: trimmedEmail, password },
        { skipAuth: true },
      );

      const user = await applyTokens(data.accessToken, data.refreshToken);
      const role = user.role ?? 'user';

      if (role !== 'admin' && role !== 'superadmin') {
        clearTokens();
        notify.error('Access denied. Admin accounts only.');
        window.location.assign('/admin/login');
        return;
      }

      navigate('/admin', { replace: true });
    } catch (err) {
      notify.error(
        err instanceof ApiRequestError
          ? err.message
          : err instanceof Error
            ? err.message
            : 'Login failed',
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Center
      mih="100vh"
      px="md"
      style={{
        background: AU.loginBg,
      }}
    >
      <Paper
        p="xl"
        radius="xl"
        w={420}
        maw="100%"
        style={{
          background: 'rgba(255,255,255,0.92)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
        }}
      >
        <Stack align="center" mb="xl">
          <ThemeIcon size={56} radius="xl" color="teal">
            <IconShield size={28} />
          </ThemeIcon>
          <Title order={2}>Admin login</Title>
          <Text c="dimmed" size="sm" ta="center">
            Sign in with your administrator credentials.
          </Text>
        </Stack>

        <Stack gap="md">
          <TextInput
            label="Email address"
            placeholder="admin@tohdah.com"
            leftSection={<IconMail size={16} />}
            value={email}
            onChange={(e) => setEmail(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleLogin();
            }}
          />
          <PasswordInput
            label="Password"
            placeholder="••••••••"
            leftSection={<IconLock size={16} />}
            value={password}
            onChange={(e) => setPassword(e.currentTarget.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') void handleLogin();
            }}
          />
          <Button
            fullWidth
            size="md"
            color="teal"
            radius="xl"
            disabled={isSubmitting}
            type="button"
            onClick={() => void handleLogin()}
          >
            {isSubmitting ? 'Signing in…' : 'Login'}
          </Button>
          <Text ta="center" size="sm">
            <Anchor component={Link} to="/forgot-password" c="teal">
              Forgot password?
            </Anchor>
          </Text>
        </Stack>
      </Paper>
    </Center>
  );
}