import { createTheme } from '@mantine/core';
import type { MantineColorsTuple } from '@mantine/core';

const brandTeal: MantineColorsTuple = [
  '#e6faf6',
  '#ccf5ec',
  '#99ebd9',
  '#66e0c6',
  '#33d6b3',
  '#00c9a7',
  '#00a187',
  '#00725e',
  '#005447',
  '#003630',
];

export const appTheme = createTheme({
  primaryColor: 'brandTeal',
  fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif',
  headings: { fontFamily: '"Plus Jakarta Sans", system-ui, sans-serif' },
  colors: {
    brandTeal,
  },
  defaultRadius: 'md',
});

export const colors = {
  navyBg: '#1e2a4a',
  navyDeep: '#081534',
  mutedText: '#45464e',
  subtleText: '#76777f',
  inputBg: '#f7f9fb',
  border: '#c6c6cf',
  slate: '#8691b7',
  gradientFrom: '#00c9a7',
  gradientTo: '#2d86ff',
} as const;

/** Requester flow (standard delivery vs community support) */
export const requesterUi = {
  standardBlue: '#0047AB',
  communityMint: '#48C78E',
  pageGray: '#eceef2',
} as const;

/** Marketplace / booking shell (browse, confirmations) */
export const marketplaceUi = {
  teal: '#14B8A6',
  pageBg: '#F3F4F6',
  sidebarNavy: '#1E293B',
} as const;

/** Checkout, wallet, payment methods (blue CTAs, green savings) */
export const paymentUi = {
  primaryBlue: '#2563EB',
  savingsGreen: '#22c55e',
  footerNavy: '#0f172a',
} as const;

/** Chat / comms / profile (screenshot palette) */
export const commsUi = {
  teal: '#26A69A',
  pageBg: '#F5F5F5',
} as const;

/** Admin console — navy chrome + teal accents */
export const adminUi = {
  sidebarBg: '#0f172a',
  sidebarActive: '#1e293b',
  accentTeal: '#26A69A',
  /** Dark green banners / success chrome (community ops mockups) */
  successGreen: '#2d6a4f',
  pageBg: '#f1f5f9',
  loginBg: '#0b1628',
  headerSurface: '#ffffff',
} as const;
