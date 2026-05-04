import {
  Alert,
  Anchor,
  Box,
  Button,
  Divider,
  Flex,
  Group,
  Image,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconBrandFacebook } from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { registerUser } from '../api/client';
import { signupAssets } from '../figma/signupAssets';
import { colors } from '../theme';

function TrustItem({ icon, label }: { icon: string; label: string }) {
  return (
    <Group gap={6} wrap="nowrap">
      <Image src={icon} alt="" w={20} h={20} fit="contain" />
      <Text fz={16} c="rgba(255,255,255,0.6)" lh={1.5}>
        {label}
      </Text>
    </Group>
  );
}

export function SignUpPage() {
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState<string | null>(null);

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
    setDone(null);
    setSubmitting(true);
    try {
      const phoneNumber = `${values.countryCode} ${values.phoneLine}`.trim();
      const res = await registerUser({
        fullName: values.fullName.trim(),
        email: values.email.trim(),
        phoneNumber,
        password: values.password,
      });
      setDone(`Welcome, ${res.fullName}. You can sign in once login is ready.`);
      form.reset();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong');
    } finally {
      setSubmitting(false);
    }
  });

  const inputStyles = {
    input: {
      backgroundColor: colors.inputBg,
      borderColor: colors.border,
      minHeight: 57,
      paddingLeft: 40,
    },
  } as const;

  return (
    <Flex direction={{ base: 'column', md: 'row' }} mih="100vh" bg="#f7f9fb">
      <Box
        pos="relative"
        flex={{ md: 1 }}
        py={{ base: 48, md: 0 }}
        px={48}
        mih={{ base: 420, md: '100vh' }}
        style={{
          backgroundColor: colors.navyBg,
          overflow: 'hidden',
        }}
      >
        <Box pos="absolute" inset={0} opacity={0.2} style={{ pointerEvents: 'none' }}>
          <Box
            pos="absolute"
            top={40}
            left={40}
            w={256}
            h={256}
            style={{
              borderRadius: 9999,
              background: '#006b58',
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
          mih={{ base: 360, md: '100%' }}
          pos="relative"
          gap={16}
          maw={512}
          mx="auto"
        >
          <Box
            maw="100%"
            style={{
              aspectRatio: '1 / 1',
              boxShadow: '0 25px 25px rgba(0,0,0,0.15)',
              borderRadius: 8,
              overflow: 'hidden',
            }}
          >
            <Image
              src={signupAssets.travelIllustration}
              alt=""
              w="100%"
              h="100%"
              fit="cover"
            />
          </Box>
          <Text ta="center" c="white" fz={{ base: 17, sm: 18 }} fw={600} lh={1.45}>
            Join our global community.
          </Text>
          <Text ta="center" c={colors.slate} fz={15} lh={1.55} opacity={0.95} maw={420}>
            Connect with travelers and senders worldwide.
          </Text>
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
          <TrustItem icon={signupAssets.trust1} label="Secure & Verified" />
          <TrustItem icon={signupAssets.trust2} label="180+ Countries" />
          <TrustItem icon={signupAssets.trust3} label="24/7 Support" />
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
            <Image
              src={signupAssets.logo}
              alt="Tohdah"
              w={32}
              h={32}
              fit="contain"
            />

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
            {done ? (
              <Alert color="teal" title="Account created">
                {done}
              </Alert>
            ) : null}

            <Stack gap={24}>
              <TextInput
                label="Full Name"
                placeholder="John Doe"
                leftSection={
                  <Image
                    src={signupAssets.iconUser}
                    alt=""
                    w={16}
                    h={16}
                    fit="contain"
                  />
                }
                leftSectionPointerEvents="none"
                styles={inputStyles}
                {...form.getInputProps('fullName')}
              />
              <TextInput
                label="Email Address"
                placeholder="name@example.com"
                type="email"
                leftSection={
                  <Image
                    src={signupAssets.iconMail}
                    alt=""
                    w={20}
                    h={16}
                    fit="contain"
                  />
                }
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
                    leftSection={
                      <Image
                        src={signupAssets.iconPhone}
                        alt=""
                        w={18}
                        h={18}
                        fit="contain"
                      />
                    }
                    leftSectionPointerEvents="none"
                    styles={inputStyles}
                    {...form.getInputProps('phoneLine')}
                  />
                </Group>
              </Stack>
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                visibilityToggleIcon={({ reveal }) => (
                  <Image
                    src={signupAssets.iconEye}
                    alt={reveal ? 'Hide password' : 'Show password'}
                    w={22}
                    h={15}
                    fit="contain"
                  />
                )}
                leftSection={
                  <Image
                    src={signupAssets.iconLock}
                    alt=""
                    w={16}
                    h={21}
                    fit="contain"
                  />
                }
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
                rightSection={
                  <Image
                    src={signupAssets.ctaArrow}
                    alt=""
                    w={14}
                    h={14}
                    fit="contain"
                  />
                }
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

            <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
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
                  <Image
                    src={signupAssets.google}
                    alt=""
                    w={20}
                    h={20}
                    fit="contain"
                  />
                }
                onClick={() =>
                  setError('Google sign-in is not wired yet — use email registration.')
                }
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
                leftSection={
                  <Image
                    src={signupAssets.appleMark}
                    alt=""
                    w={16}
                    h={16}
                    fit="contain"
                  />
                }
                onClick={() =>
                  setError('Apple sign-in is not wired yet — use email registration.')
                }
              >
                Apple
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
                leftSection={<IconBrandFacebook size={22} />}
                onClick={() =>
                  setError('Facebook sign-in is not wired yet — use email registration.')
                }
              >
                Facebook
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
