import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import {
  IconBrandApple,
  IconLock,
  IconMail,
  IconPackage,
  IconPlaneTilt,
  IconWorld,
} from '@tabler/icons-react';
import { useState, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ApiRequestError } from '../api/client';
import { BrandWordmark } from '../components/BrandWordmark';
import { PublicFooter } from '../components/PublicFooter';
import { useAuth } from '../context/AuthContext';
import { colors } from '../theme';
import { notify } from '../utils/notify';

function LoginFeature({
  icon,
  title,
  description,
}: {
  icon: ReactNode;
  title: string;
  description: string;
}) {
  return (
    <Stack gap={6} align="center" maw={280}>
      {icon}
      <Text ta="center" c="white" fz={16} fw={700}>
        {title}
      </Text>
      <Text ta="center" c="rgba(255,255,255,0.55)" fz={14} lh={1.5}>
        {description}
      </Text>
    </Stack>
  );
}

export function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = (): void => {
    const base = import.meta.env.VITE_API_BASE_URL ?? '';
    window.location.href = `${base.replace(/\/$/, '')}/auth/google`;
  };

  const form = useForm({
    initialValues: { email: '', password: '', remember: false },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? null : 'Enter a valid email'),
      password: (v) => (v.length < 1 ? 'Required' : null),
    },
  });

  const onSubmit = form.onSubmit(async (values) => {
    setLoading(true);
    try {
      await login(values.email.trim().toLowerCase(), values.password);
    } catch (e) {
      const msg =
        e instanceof ApiRequestError
          ? e.message
          : e instanceof Error
            ? e.message
            : 'Sign in failed';
      notify.error(msg);
    } finally {
      setLoading(false);
    }
  });

  const inputStyles = {
    label: { color: colors.mutedText, letterSpacing: 0.28 },
    input: {
      background: '#f2f4f6',
      borderColor: colors.border,
    },
  } as const;

  return (
    <Flex direction="column" mih="100vh" bg="white">
      <Flex direction={{ base: 'column', md: 'row' }} style={{ flex: 1 }}>
        <Box
          pos="relative"
          flex={1}
          py={48}
          px={48}
          mih={{ base: 420, md: 'auto' }}
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
              top={-96}
              left={-96}
              w={384}
              h={384}
              style={{
                borderRadius: 9999,
                background: '#00C9A7',
                filter: 'blur(32px)',
              }}
            />
            <Box
              pos="absolute"
              bottom={-96}
              right={-96}
              w={384}
              h={384}
              style={{
                borderRadius: 9999,
                background: '#4b91ff',
                filter: 'blur(32px)',
              }}
            />
          </Box>
          <Stack
            pos="relative"
            maw={512}
            mx="auto"
            align="center"
            justify="center"
            gap="xl"
            mih={{ base: 360, md: '100%' }}
          >
            <Title order={2} ta="center" c="white" fz={{ base: 24, sm: 28 }} fw={700}>
              Seamless Global Logistics
            </Title>
            <Text ta="center" c={colors.slate} fz={{ base: 15, sm: 16 }} maw={420} lh={1.6}>
              Your gateway to a world of possibilities.
            </Text>
            <Stack gap="xl" mt="md">
              <LoginFeature
                icon={<IconPlaneTilt size={32} color="#00C9A7" />}
                title="Travel & Earn"
                description="Monetize empty luggage space on every trip."
              />
              <LoginFeature
                icon={<IconPackage size={32} color="#00C9A7" />}
                title="Ship with Trust"
                description="Verified travelers deliver your items safely."
              />
              <LoginFeature
                icon={<IconWorld size={32} color="#00C9A7" />}
                title="Global Network"
                description="Connect with senders and travelers worldwide."
              />
            </Stack>
          </Stack>
        </Box>

        <Box
          flex={1}
          px={{ base: 24, sm: 48 }}
          py={48}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box component="form" maw={448} w="100%" onSubmit={onSubmit}>
            <Stack gap={31}>
              <Stack gap={8}>
                <BrandWordmark fz={28} />
                <Title order={1} fz={40} fw={600} c={colors.navyDeep} lh={1.2}>
                  Welcome back
                </Title>
                <Text fz={16} c={colors.mutedText}>
                  Enter your details to manage your deliveries.
                </Text>
              </Stack>

              <Stack gap={23}>
                <TextInput
                  label="Email"
                  placeholder="name@company.com"
                  type="email"
                  fz={14}
                  leftSection={<IconMail size={16} stroke={1.5} />}
                  leftSectionPointerEvents="none"
                  styles={inputStyles}
                  {...form.getInputProps('email')}
                />
                <Stack gap={8}>
                  <PasswordInput
                    label="Password"
                    placeholder="••••••••"
                    fz={14}
                    leftSection={<IconLock size={16} stroke={1.5} />}
                    leftSectionPointerEvents="none"
                    styles={inputStyles}
                    {...form.getInputProps('password')}
                  />
                  <Group justify="space-between" wrap="nowrap" gap="xs">
                    <Checkbox
                      label="Remember me"
                      size="sm"
                      styles={{ label: { fontSize: 13 } }}
                      {...form.getInputProps('remember', { type: 'checkbox' })}
                    />
                    <Anchor
                      component={Link}
                      to="/forgot-password"
                      fz={12}
                      c={colors.gradientFrom}
                      style={{ whiteSpace: 'nowrap' }}
                    >
                      Forgot password?
                    </Anchor>
                  </Group>
                </Stack>
                <Button
                  type="submit"
                  fullWidth
                  radius={12}
                  py={17}
                  fz={18}
                  loading={loading}
                  styles={{
                    root: {
                      background: `linear-gradient(134deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                      border: 'none',
                      boxShadow:
                        '0 10px 15px -3px rgba(0,107,88,0.2), 0 4px 6px -4px rgba(0,107,88,0.2)',
                    },
                  }}
                >
                  Login
                </Button>
              </Stack>

              <Box pos="relative" pt={1}>
                <Divider color={colors.border} />
                <Box
                  pos="absolute"
                  top="50%"
                  left="50%"
                  style={{ transform: 'translate(-50%, -50%)' }}
                  bg="white"
                  px={16}
                >
                  <Text fz={14} c={colors.subtleText}>
                    or login with
                  </Text>
                </Box>
              </Box>

              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="sm" pt={1}>
                <Button
                  variant="default"
                  h={50}
                  type="button"
                  leftSection={
                    <img
                      src="https://www.google.com/favicon.ico"
                      width={16}
                      height={16}
                      alt=""
                    />
                  }
                  styles={{ root: { borderColor: colors.border } }}
                  onClick={handleGoogleLogin}
                >
                  Google
                </Button>
                <Button
                  variant="default"
                  h={50}
                  type="button"
                  leftSection={<IconBrandApple size={16} />}
                  styles={{ root: { borderColor: colors.border } }}
                  onClick={() => notify.info('Apple sign-in is not wired yet — use email login.')}
                >
                  Apple
                </Button>
              </SimpleGrid>

              <Text ta="center" fz={16} c={colors.mutedText} pt={17}>
                Don&apos;t have an account?{' '}
                <Anchor component={Link} to="/signup" c={colors.gradientFrom} fw={600}>
                  Sign Up
                </Anchor>
              </Text>
            </Stack>
          </Box>
        </Box>
      </Flex>
      <PublicFooter />
    </Flex>
  );
}
