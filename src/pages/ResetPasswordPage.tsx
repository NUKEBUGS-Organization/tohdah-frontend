import { Anchor, Box, PasswordInput, Stack, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../api/client';
import { PrimaryGradientButton } from '../components/ScreenScaffold';
import { notify } from '../utils/notify';
import { colors } from '../theme';

type LocationState = { passwordResetToken?: string };

export function ResetPasswordPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const token = state?.passwordResetToken ?? '';

  useEffect(() => {
    if (!token) {
      notify.error('Reset link is missing or expired. Request a new code.', 'Session');
      navigate('/forgot-password', { replace: true });
    }
  }, [token, navigate]);

  const form = useForm({
    initialValues: { newPassword: '', confirmPassword: '' },
    validate: {
      newPassword: (v) =>
        v.length < 8
          ? 'At least 8 characters'
          : !/[A-Za-z]/.test(v) || !/[0-9]/.test(v)
            ? 'Include at least one letter and one number'
            : null,
      confirmPassword: (v, values) => (v !== values.newPassword ? 'Passwords do not match' : null),
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    if (!token) return;
    try {
      await api.post<{ message: string }>(
        '/auth/reset-password',
        {
          passwordResetToken: token,
          newPassword: values.newPassword,
        },
        { skipAuth: true },
      );
      notify.success('Your password was updated. You can sign in now.');
      navigate('/login', { replace: true });
    } catch (e) {
      const msg = e instanceof ApiRequestError ? e.message : 'Could not reset password';
      notify.error(msg);
    }
  });

  if (!token) {
    return null;
  }

  return (
    <Box mih="100vh" bg="#eceef2" py={80} px={24}>
      <Box
        mx="auto"
        maw={440}
        p={{ base: 32, sm: 40 }}
        style={{
          borderRadius: 16,
          background: 'white',
          boxShadow: '0 20px 40px rgba(8,21,52,0.08)',
          border: `1px solid ${colors.border}`,
        }}
      >
        <Box component="form" onSubmit={onSubmit}>
        <Stack gap="lg">
          <Title order={2} ta="center" fz={22} c={colors.navyDeep}>
            Choose a new password
          </Title>
          <Text ta="center" c={colors.mutedText} fz={14}>
            Use at least 8 characters with a letter and a number.
          </Text>
          <PasswordInput
            label="New password"
            placeholder="••••••••"
            styles={{ input: { background: colors.inputBg, borderColor: colors.border } }}
            {...form.getInputProps('newPassword')}
          />
          <PasswordInput
            label="Confirm password"
            placeholder="••••••••"
            styles={{ input: { background: colors.inputBg, borderColor: colors.border } }}
            {...form.getInputProps('confirmPassword')}
          />
          <PrimaryGradientButton type="submit" fullWidth radius="md" size="md">
            Update password
          </PrimaryGradientButton>
          <Anchor component={Link} to="/login" fz={14} c={colors.mutedText} ta="center">
            Back to log in
          </Anchor>
        </Stack>
        </Box>
      </Box>
    </Box>
  );
}
