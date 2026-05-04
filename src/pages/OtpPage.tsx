import { Anchor, Box, PinInput, Stack, Text, Title } from '@mantine/core';
import { IconShieldCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { PrimaryGradientButton } from '../components/ScreenScaffold';
import { colors } from '../theme';

export function OtpPage() {
  const [value, setValue] = useState('');

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
              Enter the code sent to your email.
            </Text>
          </Stack>
          <PinInput
            length={4}
            type="number"
            size="lg"
            value={value}
            onChange={setValue}
            styles={{
              input: {
                borderColor: colors.border,
                width: 48,
                height: 52,
                fontSize: 20,
                fontWeight: 600,
              },
            }}
          />
          <PrimaryGradientButton fullWidth disabled={value.length !== 4}>
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
