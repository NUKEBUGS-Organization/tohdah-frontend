import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Flex,
  Group,
  Image,
  PasswordInput,
  SimpleGrid,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBrandFacebook } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { PublicFooter } from '../components/PublicFooter';
import { colors } from '../theme';
import { loginAssets } from '../figma/loginAssets';

function validIdentifier(v: string) {
  const t = v.trim();
  if (/^\S+@\S+\.\S+$/.test(t)) return null;
  if (/^[\d\s+()-]{10,}$/.test(t)) return null;
  return 'Enter a valid email or phone number';
}

export function LoginPage() {
  const form = useForm({
    initialValues: { identifier: '', password: '', remember: false },
    validate: {
      identifier: validIdentifier,
      password: (v) => (v.length < 1 ? 'Required' : null),
    },
  });

  const onValid = () => {
    // Wire to POST /auth/login when backend is ready
  };

  return (
    <Flex direction="column" mih="100vh" bg="white">
      <Flex direction={{ base: 'column', md: 'row' }} style={{ flex: 1 }}>
        <Box
          pos="relative"
          flex={1}
          py={48}
          px={48}
          mih={{ base: 360, md: 'auto' }}
          style={{
            backgroundColor: colors.navyBg,
            overflow: 'hidden',
          }}
        >
          <Box pos="absolute" inset={0} opacity={0.2} style={{ pointerEvents: 'none' }}>
            <Box
              pos="absolute"
              top={-96}
              left={-96}
              w={384}
              h={384}
              style={{
                borderRadius: 9999,
                background: '#5ffbd6',
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
            gap={7}
            mih={{ base: 280, md: '100%' }}
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
                src={loginAssets.travelIllustration}
                alt=""
                w="100%"
                h="100%"
                fit="cover"
              />
            </Box>
            <Title order={2} ta="center" c="white" fz={{ base: 28, sm: 40 }} fw={600}>
              Seamless Global Logistics
            </Title>
            <Text ta="center" c={colors.slate} fz={{ base: 16, sm: 18 }} maw={508} lh={1.6}>
              Your gateway to a world of possibilities.
            </Text>
          </Stack>
        </Box>

        <Box
          flex={1}
          px={{ base: 24, sm: 48 }}
          py={48}
          style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Box
            component="form"
            maw={448}
            w="100%"
            onSubmit={form.onSubmit(onValid)}
          >
            <Stack gap={31}>
              <Stack gap={8}>
                <Image src={loginAssets.logo} alt="Tohdah" w={40} h={40} fit="contain" />
                <Title order={1} fz={40} fw={600} c={colors.navyDeep} lh={1.2}>
                  Welcome back
                </Title>
                <Text fz={16} c={colors.mutedText}>
                  Enter your details to manage your deliveries.
                </Text>
              </Stack>

              <Stack gap={23}>
                <TextInput
                  label="Email or Phone Number"
                  placeholder="name@company.com or +1 555 000 0000"
                  fz={14}
                  styles={{
                    label: { color: colors.mutedText, letterSpacing: 0.28 },
                    input: {
                      background: '#f2f4f6',
                      borderColor: colors.border,
                    },
                  }}
                  {...form.getInputProps('identifier')}
                />
                <Stack gap={8}>
                  <PasswordInput
                    label="Password"
                    placeholder="••••••••"
                    fz={14}
                    styles={{
                      label: { color: colors.mutedText, letterSpacing: 0.28 },
                      input: {
                        background: '#f2f4f6',
                        borderColor: colors.border,
                      },
                    }}
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

              <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm" pt={1}>
                <Button
                  variant="default"
                  h={50}
                  leftSection={
                    <Image src={loginAssets.google} alt="" w={20} h={20} fit="contain" />
                  }
                  styles={{ root: { borderColor: colors.border } }}
                >
                  Google
                </Button>
                <Button
                  variant="default"
                  h={50}
                  leftSection={
                    <Image src={loginAssets.apple} alt="" w={16} h={10} fit="contain" />
                  }
                  styles={{ root: { borderColor: colors.border } }}
                >
                  Apple
                </Button>
                <Button
                  variant="default"
                  h={50}
                  leftSection={<IconBrandFacebook size={20} />}
                  styles={{ root: { borderColor: colors.border } }}
                >
                  Facebook
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
