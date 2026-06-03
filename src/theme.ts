import {
  Badge,
  Button,
  Card,
  NavLink,
  Paper,
  PasswordInput,
  Select,
  TextInput,
  createTheme,
} from '@mantine/core';
import type { MantineColorsTuple, MantineTheme } from '@mantine/core';

const teal: MantineColorsTuple = [
  '#E6FFF9',
  '#B3FFE8',
  '#80FFD7',
  '#4DFFC6',
  '#1AFFB5',
  '#00E5A0',
  '#00C9A7',
  '#00A88C',
  '#008771',
  '#006656',
];

export const appTheme = createTheme({
  primaryColor: 'teal',
  primaryShade: 6,
  fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, sans-serif',
  headings: {
    fontFamily: 'Inter, sans-serif',
    fontWeight: '700',
  },
  colors: {
    teal,
    brandTeal: teal,
  },
  radius: {
    xs: '6px',
    sm: '10px',
    md: '14px',
    lg: '18px',
    xl: '24px',
  },
  shadows: {
    xs: '0 1px 3px rgba(0,0,0,0.05)',
    sm: '0 2px 8px rgba(0,0,0,0.06)',
    md: '0 4px 16px rgba(0,0,0,0.08)',
    lg: '0 8px 32px rgba(0,0,0,0.10)',
    xl: '0 16px 48px rgba(0,0,0,0.12)',
  },
  components: {
    Card: Card.extend({
      defaultProps: { radius: 'lg', shadow: 'sm' },
      styles: {
        root: {
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.6)',
          transition: 'box-shadow 0.2s ease, transform 0.2s ease',
        },
      },
    }),
    Paper: Paper.extend({
      defaultProps: { radius: 'lg', shadow: 'sm' },
      styles: {
        root: {
          background: 'rgba(255,255,255,0.75)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          border: '1px solid rgba(255,255,255,0.6)',
        },
      },
    }),
    Button: Button.extend({
      defaultProps: { radius: 'xl' },
      styles: (_theme: MantineTheme, props: { variant?: string }) => ({
        root: {
          fontWeight: 600,
          letterSpacing: '0.01em',
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          ...(props.variant === 'filled' && {
            background: 'linear-gradient(135deg, #00C9A7, #2D86FF)',
            border: 'none',
            color: '#fff',
          }),
        },
        label: {
          fontFamily: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          ...(props.variant === 'filled' ? { color: '#fff' } : {}),
        },
      }),
    }),
    TextInput: TextInput.extend({
      defaultProps: { radius: 'md' },
      styles: {
        input: {
          background: 'rgba(255,255,255,0.8)',
          border: '1.5px solid rgba(0,0,0,0.08)',
          backdropFilter: 'blur(8px)',
        },
      },
    }),
    PasswordInput: PasswordInput.extend({
      defaultProps: { radius: 'md' },
      styles: {
        input: {
          background: 'rgba(255,255,255,0.8)',
          border: '1.5px solid rgba(0,0,0,0.08)',
        },
      },
    }),
    Select: Select.extend({
      defaultProps: { radius: 'md' },
    }),
    Badge: Badge.extend({
      defaultProps: { radius: 'xl' },
    }),
    NavLink: NavLink.extend({
      styles: {
        root: {
          borderRadius: '12px',
          fontWeight: 500,
        },
      },
    }),
  },
});

/** Shared glass tab styling for list pages */
export const glassTabsStyles = {
  tab: {
    fontWeight: 600,
    fontSize: 13,
    borderRadius: '10px 10px 0 0',
  },
  list: {
    borderBottom: '1px solid rgba(0,0,0,0.08)',
    gap: 4,
  },
} as const;

export const colors = {
  primaryTeal: '#00C9A7',
  blue: '#2D86FF',
  navyDark: '#1E2A4A',
  navyBg: '#1E2A4A',
  navyDeep: '#1E2A4A',
  lightBg: '#F0F4F8',
  glassCard: 'rgba(255,255,255,0.72)',
  glassBorder: 'rgba(255,255,255,0.55)',
  textPrimary: '#1A202C',
  textSecondary: '#64748B',
  mutedText: '#64748B',
  subtleText: '#94A3B8',
  inputBg: 'rgba(255,255,255,0.8)',
  border: 'rgba(0,0,0,0.08)',
  slate: '#94A3B8',
  gradientFrom: '#00C9A7',
  gradientTo: '#2D86FF',
} as const;

export const requesterUi = {
  standardBlue: '#2D86FF',
  communityMint: '#00C9A7',
  pageGray: '#F0F4F8',
} as const;

export const marketplaceUi = {
  teal: '#00C9A7',
  pageBg: '#F0F4F8',
  sidebarNavy: '#1E2A4A',
} as const;

export const paymentUi = {
  primaryBlue: '#2D86FF',
  savingsGreen: '#00C9A7',
  footerNavy: '#1E2A4A',
} as const;

export const commsUi = {
  teal: '#00C9A7',
  pageBg: '#F0F4F8',
} as const;

export const adminUi = {
  sidebarBg: '#0f172a',
  sidebarActive: '#1e293b',
  accentTeal: '#00C9A7',
  successGreen: '#2d6a4f',
  pageBg: '#f1f5f9',
  loginBg: '#0b1628',
  headerSurface: 'rgba(255,255,255,0.9)',
} as const;
