import {
  Anchor,
  Box,
  Button,
  Group,
  PasswordInput,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { PublicFooter } from '../components/PublicFooter';
import { PrimaryGradientButton } from '../components/ScreenScaffold';
import { colors } from '../theme';

export function ForgotPasswordPage() {
  return (
    <FlexColPublic>
      <Box
        component="header"
        px={32}
        py={20}
        style={{ borderBottom: '1px solid #e2e8f0' }}
      >
        <Group justify="space-between">
          <Text fw={700} fz={18} c={colors.navyDeep}>
            Tohdah
          </Text>
          <Group gap="sm">
            <Button component={Link} to="/login" variant="default" size="sm">
              Log in
            </Button>
            <Button component={Link} to="/signup" size="sm">
              Sign up
            </Button>
          </Group>
        </Group>
      </Box>

      <Box py={72} px={24} style={{ flex: 1 }}>
        <Box
          mx="auto"
          maw={450}
          p={40}
          style={{
            borderRadius: 12,
            boxShadow: '0 25px 50px -12px rgba(0,0,0,0.12)',
            background: 'white',
            border: `1px solid ${colors.border}`,
          }}
        >
          <Stack align="stretch" gap="lg">
            <Title order={1} ta="center" fz={28} c={colors.navyDeep}>
              Reset your password
            </Title>
            <Text ta="center" c={colors.mutedText}>
              Enter your new password below.
            </Text>
            <PasswordInput
              label="New Password"
              placeholder="••••••••"
              styles={{
                input: { background: colors.inputBg, borderColor: colors.border },
              }}
            />
            <PasswordInput
              label="Confirm New Password"
              placeholder="••••••••"
              styles={{
                input: { background: colors.inputBg, borderColor: colors.border },
              }}
            />
            <PrimaryGradientButton fullWidth radius="md" size="md">
              Reset Password
            </PrimaryGradientButton>
            <Anchor component={Link} to="/login" fz={14} c={colors.gradientFrom} ta="center">
              ← Back to log in
            </Anchor>
          </Stack>
        </Box>
      </Box>
      <PublicFooter />
    </FlexColPublic>
  );
}

function FlexColPublic({ children }: { children: ReactNode }) {
  return (
    <Box mih="100vh" bg="#eceef2" style={{ display: 'flex', flexDirection: 'column' }}>
      {children}
    </Box>
  );
}
