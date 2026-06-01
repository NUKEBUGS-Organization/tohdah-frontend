import {
  Alert,
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconBrandApple,
  IconHeadset,
  IconHeart,
  IconLock,
  IconMail,
  IconPackage,
  IconPhone,
  IconPlaneTilt,
  IconShieldCheck,
  IconUser,
  IconWorld,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useState, type ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api, ApiRequestError } from '../api/client';
import type { AuthResponse, RegisterResponse } from '../api/types';
import { useAuth } from '../context/AuthContext';
import { BrandWordmark } from '../components/BrandWordmark';
import { colors } from '../theme';

function TrustItem({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <Group gap={6} wrap="nowrap">
      {icon}
      <Text fz={16} c="rgba(255,255,255,0.6)" lh={1.5}>
        {label}
      </Text>
    </Group>
  );
}

function FeatureHighlight({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Stack gap={8} align="center" maw={320}>
      {icon}
      <Text ta="center" c="white" fz={18} fw={700}>
        {title}
      </Text>
      <Text ta="center" c="rgba(255,255,255,0.55)" fz={14} lh={1.55}>
        {description}
      </Text>
    </Stack>
  );
}

export function SignUpPage() {
  const navigate = useNavigate();
  const { applyTokens } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGoogleSignup = (): void => {
    const base = import.meta.env.VITE_API_BASE_URL ?? '';
    window.location.href = `${base.replace(/\/$/, '')}/auth/google`;
  };

  const form = useForm({
    initialValues: {
      fullName: '',
      email: '',
      countryCode: '+1',
      phoneLine: '',
      password: '',
    },
    validate: {
      fullName: (v) => (v.trim().length < 2 ? 'Enter your full name' : null),
      email: (v) => (/^\S+@\S+$/.test(v) ? null : 'Invalid email'),
      phoneLine: (v) =>
        v.replace(/\D/g, '').length < 7 ? 'Enter a valid phone number' : null,
      password: (v) =>
        v.length < 8
          ? 'At least 8 characters with a letter and a number'
          : !/[A-Za-z]/.test(v) || !/[0-9]/.test(v)
            ? 'Include at least one letter and one number'
            : null,
    },
  });

  const handleSubmit = form.onSubmit(async (values) => {
    setError(null);
    setSubmitting(true);
    const email = values.email.trim().toLowerCase();
    const phoneNumber = `${values.countryCode} ${values.phoneLine}`.trim();
    try {
      await api.post<RegisterResponse>(
        '/auth/register',
        {
          fullName: values.fullName.trim(),
          email,
          phoneNumber,
          password: values.password,
        },
        { skipAuth: true },
      );
      const auth = await api.post<AuthResponse>(
        '/auth/login',
        {
          email,
          password: values.password,
        },
        { skipAuth: true },
      );
      await applyTokens(auth.accessToken, auth.refreshToken);
      navigate('/onboarding/step-1', { replace: true });
    } catch (e) {
      if (e instanceof ApiRequestError && e.statusCode === 409) {
        setError('An account with this email already exists.');
      } else {
        setError(
          e instanceof ApiRequestError
            ? e.message
            : e instanceof Error
              ? e.message
              : 'Something went wrong',
        );
      }
    } finally {
      setSubmitting(false);
    }
  });

  const inputStyles = {
    input: {
      backgroundColor: colors.inputBg,
      borderColor: colors.border,
      minHeight: 57,
    },
  } as const;

  return (
    <Flex direction={{ base: 'column', md: 'row' }} mih="100vh" bg="#f7f9fb">
      <Box
        pos="relative"
        flex={{ md: 1 }}
        py={{ base: 48, md: 0 }}
        px={48}
        mih={{ base: 520, md: '100vh' }}
        style={{
          backgroundColor: '#1E2A4A',
          overflow: 'hidden',
        }}
      >
        <Box
          pos="absolute"
          inset={0}
          style={{
            pointerEvents: 'none',
            background:
              'linear-gradient(135deg, rgba(0,201,167,0.15) 0%, rgba(75,145,255,0.2) 100%)',
          }}
        />
        <Box pos="absolute" inset={0} opacity={0.25} style={{ pointerEvents: 'none' }}>
          <Box
            pos="absolute"
            top={40}
            left={40}
            w={256}
            h={256}
            style={{
              borderRadius: 9999,
              background: '#00C9A7',
              filter: 'blur(60px)',
            }}
          />
          <Box
            pos="absolute"
            bottom={80}
            right={80}
            w={320}
            h={320}
            style={{
              borderRadius: 9999,
              background: '#4b91ff',
              filter: 'blur(75px)',
            }}
          />
        </Box>

        <Flex
          direction="column"
          align="center"
          justify="center"
          mih={{ base: 480, md: '100%' }}
          pos="relative"
          gap="xl"
          maw={512}
          mx="auto"
          pb={{ base: 120, md: 80 }}
        >
          <Title order={2} ta="center" c="white" fz={{ base: 24, sm: 28 }} fw={700}>
            Join our global community
          </Title>

          <Stack gap="xl" align="center">
            <FeatureHighlight
              icon={<IconPlaneTilt size={32} color="#00C9A7" />}
              title="Earn While You Travel"
              description="Carry items along your route and get paid."
            />
            <FeatureHighlight
              icon={<IconPackage size={32} color="#00C9A7" />}
              title="Send with Confidence"
              description="Find trusted travelers going your way."
            />
            <FeatureHighlight
              icon={<IconHeart size={32} color="#00C9A7" />}
              title="Support Your Community"
              description="Help elderly and vulnerable people get what they need."
            />
          </Stack>
        </Flex>

        <Group
          justify="space-between"
          pos="absolute"
          bottom={48}
          left={48}
          right={48}
          visibleFrom="md"
          wrap="nowrap"
        >
          <TrustItem
            icon={<IconShieldCheck size={16} color="teal" />}
            label="Secure & Verified"
          />
          <TrustItem icon={<IconWorld size={16} color="teal" />} label="180+ Countries" />
          <TrustItem icon={<IconHeadset size={16} color="teal" />} label="24/7 Support" />
        </Group>
      </Box>

      <Box
        flex={{ md: 1 }}
        bg="white"
        py={48}
        px={{ base: 16, sm: 24 }}
        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
      >
        <Box component="form" onSubmit={handleSubmit} maw={448} w="100%">
          <Stack gap={32}>
            <BrandWordmark fz={28} />

            <Stack gap={4}>
              <Title order={2} fz={16} fw={600} c={colors.navyDeep}>
                Create your account
              </Title>
              <Text fz={16} c={colors.mutedText}>
                Start your journey with Tohdah today.
              </Text>
            </Stack>

            {error ? (
              <Alert color="red" title="Could not create account">
                {error}
              </Alert>
            ) : null}
            <Stack gap={24}>
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                leftSection={<IconUser size={16} stroke={1.5} />}
                leftSectionPointerEvents="none"
                styles={inputStyles}
                {...form.getInputProps('fullName')}
              />
              <TextInput
                label="Email Address"
                placeholder="name@example.com"
                type="email"
                leftSection={<IconMail size={16} stroke={1.5} />}
                leftSectionPointerEvents="none"
                styles={inputStyles}
                {...form.getInputProps('email')}
              />
              <Stack gap={6}>
                <Text fz={14} fw={500} c={colors.mutedText}>
                  Phone Number
                </Text>
                <Group align="flex-start" wrap="nowrap" gap="xs">
                  <Select
                    w={96}
                    data={['+1', '+44', '+971', '+33', '+49', '+61']}
                    styles={{ input: { borderColor: colors.border, minHeight: 57 } }}
                    {...form.getInputProps('countryCode')}
                  />
                  <TextInput
                    placeholder="(555) 000-0000"
                    style={{ flex: 1 }}
                    leftSection={<IconPhone size={16} stroke={1.5} />}
                    leftSectionPointerEvents="none"
                    styles={inputStyles}
                    {...form.getInputProps('phoneLine')}
                  />
                </Group>
              </Stack>
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                leftSection={<IconLock size={16} stroke={1.5} />}
                leftSectionPointerEvents="none"
                styles={inputStyles}
                {...form.getInputProps('password')}
              />

              <Button
                type="submit"
                size="md"
                radius="md"
                fullWidth
                loading={submitting}
                styles={{
                  root: {
                    background: `linear-gradient(135deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                    border: 'none',
                    boxShadow:
                      '0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.1)',
                    minHeight: 56,
                  },
                }}
              >
                Sign Up
              </Button>
            </Stack>

            <Box pos="relative">
              <Divider color={colors.border} />
              <Box
                pos="absolute"
                top="50%"
                left="50%"
                style={{ transform: 'translate(-50%, -50%)' }}
                bg="white"
                px={16}
              >
                <Text fz={16} c={colors.subtleText}>
                  Or sign up with
                </Text>
              </Box>
            </Box>

            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Button
                variant="default"
                fullWidth
                radius="md"
                h={58}
                styles={{
                  root: {
                    borderColor: colors.border,
                  },
                }}
                leftSection={
                  <img
                    src="https://www.google.com/favicon.ico"
                    width={16}
                    height={16}
                    alt=""
                  />
                }
                onClick={handleGoogleSignup}
              >
                Google
              </Button>
              <Button
                variant="default"
                fullWidth
                radius="md"
                h={58}
                styles={{
                  root: {
                    borderColor: colors.border,
                  },
                }}
                leftSection={<IconBrandApple size={16} />}
                onClick={() =>
                  setError('Apple sign-in is not wired yet — use email registration.')
                }
              >
                Apple
              </Button>
            </SimpleGrid>

            <Text ta="center" fz={16} c={colors.mutedText}>
              Already have an account?{' '}
              <Anchor component={Link} to="/login" c="#00725e" fw={500}>
                Log In
              </Anchor>
            </Text>

            <Text ta="center" fz={16} c={colors.subtleText} lh={1.6}>
              By creating an account, you agree to Tohdah&apos;s{' '}
              <Anchor href="#" underline="always">
                Terms of Service
              </Anchor>{' '}
              and{' '}
              <Anchor href="#" underline="always">
                Privacy Policy
              </Anchor>
              .
            </Text>
          </Stack>
        </Box>
      </Box>
    </Flex>
  );
}
