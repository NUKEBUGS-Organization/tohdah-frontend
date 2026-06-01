import {
  Anchor,
  Box,
  Button,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconMail } from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../api/client';
import type { ReactNode } from 'react';
import { BrandWordmark } from '../components/BrandWordmark';
import { PrimaryGradientButton } from '../components/ScreenScaffold';
import { PublicFooter } from '../components/PublicFooter';
import { notify } from '../utils/notify';
import { colors } from '../theme';

export function ForgotPasswordPage() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: { email: '' },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? null : 'Enter a valid email'),
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    const email = values.email.trim().toLowerCase();
    try {
      await api.post('/auth/forgot-password', { email }, { skipAuth: true });
      navigate(`/verify-otp?email=${encodeURIComponent(email)}`, { replace: true });
    } catch (e) {
      const msg = e instanceof ApiRequestError ? e.message : 'Something went wrong';
      notify.error(msg);
    }
  });

  return (
    <FlexColPublic>
      <Box
        component="header"
        px={32}
        py={20}
        style={{ borderBottom: '1px solid #e2e8f0' }}
      >
        <Group justify="space-between">
          <BrandWordmark fz={18} />
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
          component="form"
          onSubmit={onSubmit}
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
              Forgot password
            </Title>
            <Text ta="center" c={colors.mutedText}>
              Enter the email for your account. We&apos;ll send you a verification code.
            </Text>
            <TextInput
              label="Email"
              placeholder="you@example.com"
              type="email"
              leftSection={<IconMail size={16} stroke={1.5} />}
              leftSectionPointerEvents="none"
              styles={{
                input: { background: colors.inputBg, borderColor: colors.border },
              }}
              {...form.getInputProps('email')}
            />
            <PrimaryGradientButton type="submit" fullWidth radius="md" size="md">
              Send code
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
