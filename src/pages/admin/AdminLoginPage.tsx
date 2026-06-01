import {
  Anchor,
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Paper,
  PasswordInput,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconLock, IconMail, IconShieldLock } from '@tabler/icons-react';
import { useNavigate } from 'react-router-dom';
import { adminUi as AU } from '../../theme';

export function AdminLoginPage() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: { email: '', password: '', remember: false },
    validate: {
      email: (v) => (/^\S+@\S+\.\S+$/.test(v.trim()) ? null : 'Valid email required'),
      password: (v) => (v.length < 1 ? 'Required' : null),
    },
  });

  return (
    <Box
      mih="100vh"
      style={{
        background: AU.loginBg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <Paper
        maw={420}
        w="100%"
        p={{ base: 'lg', sm: 'xl' }}
        radius="lg"
        shadow="xl"
        withBorder={false}
      >
        <Stack gap="lg" align="stretch">
          <Stack align="center" gap={4}>
            <Box
              w={52}
              h={52}
              style={{
                borderRadius: '50%',
                background: AU.accentTeal,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconShieldLock size={28} stroke={1.5} color="#fff" />
            </Box>
            <Title order={2} fz={24} fw={800} ta="center">
              Admin login
            </Title>
            <Text fz={14} c="dimmed" ta="center">
              Sign in with your administrator credentials.
            </Text>
          </Stack>

          <form
            onSubmit={form.onSubmit(() => {
              navigate('/admin');
            })}
          >
            <Stack gap="md">
              <TextInput
                label="Email address"
                placeholder="you@organization.com"
                radius="md"
                leftSection={<IconMail size={16} stroke={1.5} />}
                leftSectionPointerEvents="none"
                {...form.getInputProps('email')}
              />
              <PasswordInput
                label="Password"
                placeholder="••••••••"
                radius="md"
                leftSection={<IconLock size={16} stroke={1.5} />}
                leftSectionPointerEvents="none"
                {...form.getInputProps('password')}
              />
              <Checkbox label="Remember me" {...form.getInputProps('remember', { type: 'checkbox' })} />
              <Button type="submit" fullWidth radius="md" size="md" fz={14} fw={600} {...adminLoginBtn}>
                Login
              </Button>
              <Divider />
              <Group justify="center">
                <Anchor href="#" fz={13}>
                  Forgot password?
                </Anchor>
              </Group>
            </Stack>
          </form>
        </Stack>
      </Paper>
    </Box>
  );
}

const adminLoginBtn = {
  styles: { root: { backgroundColor: AU.accentTeal, border: 'none', color: '#fff' } },
} as const;
