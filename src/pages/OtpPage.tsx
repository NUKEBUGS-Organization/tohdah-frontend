import { Anchor, Box, PinInput, Stack, Text, Title } from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { api, ApiRequestError } from '../api/client';
import { PrimaryGradientButton } from '../components/ScreenScaffold';
import { notify } from '../utils/notify';
import { colors } from '../theme';

type LocationState = { email?: string };

export function OtpPage() {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [value, setValue] = useState('');

  const email = useMemo(() => {
    const q = searchParams.get('email')?.trim().toLowerCase();
    if (q) return q;
    const s = (location.state as LocationState | null)?.email?.trim().toLowerCase();
    return s ?? '';
  }, [searchParams, location.state]);

  const verify = async () => {
    if (!email) {
      notify.error('Missing email. Start again from forgot password.');
      navigate('/forgot-password', { replace: true });
      return;
    }
    if (value.length !== 6) return;
    try {
      const res = await api.post<{ passwordResetToken: string }>(
        '/auth/verify-otp',
        { email, otp: value },
        { skipAuth: true },
      );
      if (!res?.passwordResetToken) {
        notify.error('Verification failed');
        return;
      }
      navigate('/reset-password', {
        replace: true,
        state: { passwordResetToken: res.passwordResetToken },
      });
    } catch (e) {
      const msg = e instanceof ApiRequestError ? e.message : 'Invalid or expired code';
      notify.error(msg);
    }
  };

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
        <Stack align="center" gap="lg">
          <Box
            w={56}
            h={56}
            style={{
              borderRadius: 14,
              background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <IconShieldCheck size={28} color="white" stroke={1.5} />
          </Box>
          <Stack gap="xs" align="center">
            <Title order={2} ta="center" fz={22} c={colors.navyDeep}>
              Verification Code
            </Title>
            <Text ta="center" c={colors.mutedText} maw={320} fz={14}>
              {email
                ? `Enter the 6-digit code sent to ${email}.`
                : 'Enter the code sent to your email.'}
            </Text>
          </Stack>
          <PinInput
            length={6}
            type="number"
            size="lg"
            value={value}
            onChange={setValue}
            styles={{
              input: {
                borderColor: colors.border,
                width: 44,
                height: 52,
                fontSize: 18,
                fontWeight: 600,
              },
            }}
          />
          <PrimaryGradientButton fullWidth disabled={value.length !== 6} onClick={() => void verify()}>
            Verify
          </PrimaryGradientButton>
          <Text fz={14} c={colors.subtleText} ta="center">
            Didn&apos;t receive code?{' '}
            <Anchor href="#" c={colors.gradientFrom} fw={500} onClick={(e) => e.preventDefault()}>
              Resend code
            </Anchor>
          </Text>
          <Anchor component={Link} to="/login" fz={14} c={colors.mutedText}>
            Back to log in
          </Anchor>
        </Stack>
      </Box>
    </Box>
  );
}
