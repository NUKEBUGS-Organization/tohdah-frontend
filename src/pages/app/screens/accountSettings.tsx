import {
  Avatar,
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Image,
  NavLink,
  Paper,
  PasswordInput,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconBook2,
  IconBulb,
  IconCreditCard,
  IconDeviceDesktop,
  IconShield,
  IconHelpCircle,
  IconMail,
  IconMapPin,
  IconMessageCircle,
  IconPhone,
  IconSearch,
  IconShieldLock,
  IconTicket,
  IconUser,
  IconUsersGroup,
} from '@tabler/icons-react';
import type { ReactNode } from 'react';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import { colors, commsUi as CM } from '../../../theme';

const NAV_COL = { base: 12, md: 3 };
const MAIN_COL = { base: 12, md: 9 };

const tealBtn = {
  styles: { root: { backgroundColor: CM.teal, border: 'none', color: '#fff' } },
} as const;

const settingsAccountLinks: {
  to: string;
  label: string;
  Icon: typeof IconUser;
  match: (pathname: string) => boolean;
}[] = [
  {
    to: '/app/settings/my-profile',
    label: 'Profile',
    Icon: IconUser,
    match: (p) => p === '/app/settings/my-profile',
  },
  {
    to: '/app/settings/security',
    label: 'Security',
    Icon: IconShieldLock,
    match: (p) => p === '/app/settings/security',
  },
  {
    to: '/app/settings/notifications',
    label: 'Notifications',
    Icon: IconPhone,
    match: (p) => p === '/app/settings/notifications',
  },
  {
    to: '/app/wallet/payment-methods',
    label: 'Billing',
    Icon: IconCreditCard,
    match: (p) => p.startsWith('/app/wallet'),
  },
  {
    to: '/app/settings/privacy',
    label: 'Privacy & safety',
    Icon: IconShield,
    match: (p) => p === '/app/settings/privacy',
  },
  {
    to: '/app/settings/help-center',
    label: 'Help',
    Icon: IconHelpCircle,
    match: (p) => p.startsWith('/app/settings/help'),
  },
];

function AccountSettingsSidebar() {
  const { pathname } = useLocation();
  return (
    <Paper radius="md" p="sm" withBorder shadow="xs" bg="#fff" h="fit-content">
      <Stack gap={4}>
        {settingsAccountLinks.map(({ to, label, Icon, match }) => (
          <NavLink
            key={to}
            component={RouterLink}
            to={to}
            label={label}
            leftSection={<Icon size={18} stroke={1.5} />}
            active={match(pathname)}
            styles={{
              root: {
                borderRadius: 10,
                fontWeight: 500,
                '&[data-active]': {
                  background: `${CM.teal}16`,
                  color: CM.teal,
                  fontWeight: 650,
                },
              },
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
}

function AccountShell({ children }: { children: ReactNode }) {
  return (
    <Grid gap="lg">
      <Grid.Col span={NAV_COL}>
        <AccountSettingsSidebar />
      </Grid.Col>
      <Grid.Col span={MAIN_COL}>{children}</Grid.Col>
    </Grid>
  );
}

const helpLinks: { to: string; label: string; Icon: typeof IconBook2 }[] = [
  { to: '/app/settings/help-center', label: 'Knowledge base', Icon: IconBook2 },
  { to: '/app/settings/help-tickets', label: 'My tickets', Icon: IconTicket },
  { to: '/app/settings/help-community', label: 'Community', Icon: IconUsersGroup },
  { to: '/app/settings/help-contact', label: 'Contact us', Icon: IconMail },
];

function HelpCenterSidebar() {
  const { pathname } = useLocation();
  return (
    <Paper radius="md" p="sm" withBorder shadow="xs" bg="#fff" h="fit-content">
      <Stack gap={4}>
        {helpLinks.map(({ to, label, Icon }) => (
          <NavLink
            key={to}
            component={RouterLink}
            to={to}
            label={label}
            leftSection={<Icon size={18} stroke={1.5} />}
            active={pathname === to}
            styles={{
              root: {
                borderRadius: 10,
                fontWeight: 500,
                '&[data-active]': {
                  background: `${CM.teal}16`,
                  color: CM.teal,
                  fontWeight: 650,
                },
              },
            }}
          />
        ))}
      </Stack>
    </Paper>
  );
}

function HelpShell({ children }: { children: ReactNode }) {
  return (
    <Grid gap="lg" align="flex-start">
      <Grid.Col span={NAV_COL}>
        <HelpCenterSidebar />
      </Grid.Col>
      <Grid.Col span={MAIN_COL}>{children}</Grid.Col>
    </Grid>
  );
}

function MockProductHeader() {
  return (
    <Paper radius="md" p="md" mb="lg" withBorder shadow="xs" bg="#fff">
      <Group justify="space-between" wrap="wrap" gap="md">
        <Group gap="lg" wrap="wrap">
          <Text fw={900} fz={18} c={colors.navyDeep}>
            Tohdah
          </Text>
          {['Tasks', 'Services', 'Inbox', 'Messages'].map((l) => (
            <Text
              key={l}
              component={RouterLink}
              to="/app/traveler"
              fz={14}
              fw={500}
              c="dimmed"
              style={{ textDecoration: 'none' }}
            >
              {l}
            </Text>
          ))}
        </Group>
        <TextInput
          placeholder="Search…"
          leftSection={<IconSearch size={16} />}
          size="sm"
          miw={200}
          maw={320}
          style={{ flex: 1 }}
        />
        <Avatar radius="xl" size="sm" color="teal">
          SJ
        </Avatar>
      </Group>
    </Paper>
  );
}

export function SettingsMyProfilePage() {
  return (
    <Stack gap="lg" pb={40}>
      <MockProductHeader />
      <Grid gap="lg" align="flex-start">
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Stack align="center" gap="md">
              <Avatar
                size={120}
                radius="xl"
                src="https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=240&q=70"
              />
              <div style={{ textAlign: 'center' }}>
                <Text fw={800} fz={22}>
                  Sarah Jenkins
                </Text>
                <Group gap={6} justify="center" c="dimmed" mt={4}>
                  <IconMapPin size={14} />
                  <Text fz={13}>London, United Kingdom</Text>
                </Group>
              </div>
              <Button fullWidth radius="md" variant="filled" {...tealBtn}>
                Edit profile
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Stack gap="lg">
            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Text fw={800} fz={16} mb="sm">
                About
              </Text>
              <Text fz={14} c="dimmed" lh={1.65}>
                Product designer and weekend traveler. I specialize in same-day airport handoffs and fragile electronics. Clear
                communication, photos at pickup and drop-off, and flexible timing around security lines.
              </Text>
            </Paper>
            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Text fw={800} fz={16} mb="sm">
                Languages
              </Text>
              <Group gap="xs">
                {['English', 'Italian', 'Spanish'].map((lang) => (
                  <Badge key={lang} variant="light" color="gray" size="lg" radius="sm">
                    {lang}
                  </Badge>
                ))}
              </Group>
            </Paper>
            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Text fw={800} fz={16} mb="sm">
                Trust & verification
              </Text>
              <Group gap="xs">
                <Badge variant="light" color="teal">
                  Phone verified
                </Badge>
                <Badge variant="light" color="teal">
                  Identity verified
                </Badge>
              </Group>
            </Paper>
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <Paper p="lg" radius="md" withBorder bg={CM.pageBg}>
                <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
                  Community impact
                </Text>
                <Text fz={28} fw={900}>
                  15
                </Text>
                <Text fz={13} c="dimmed">
                  Tasks completed
                </Text>
              </Paper>
              <Paper p="lg" radius="md" withBorder bg={CM.pageBg}>
                <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
                  Reputation
                </Text>
                <Text fz={28} fw={900}>
                  4.9
                </Text>
                <Text fz={13} c="dimmed">
                  Average rating
                </Text>
              </Paper>
            </SimpleGrid>
          </Stack>
        </Grid.Col>
      </Grid>

      <Paper
        p="lg"
        radius="md"
        style={{
          background: `linear-gradient(90deg, ${colors.navyDeep} 0%, #122456 100%)`,
          border: 'none',
        }}
      >
        <Group gap="md" wrap="nowrap" align="flex-start">
          <Paper w={44} h={44} radius="md" bg="rgba(255,255,255,0.12)" style={{ display: 'grid', placeItems: 'center', flexShrink: 0 }}>
            <IconBulb size={22} color="#fcd34d" stroke={1.5} />
          </Paper>
          <div>
            <Text c="#fff" fw={700} fz={15} mb={6}>
              Earn more as a Tasker on Tohdah
            </Text>
            <Text c="rgba(255,255,255,0.85)" fz={13} lh={1.6}>
              Complete your payout profile and keep response times low — travelers with verified badges rank higher in search.
            </Text>
          </div>
          <Button ml="auto" variant="white" radius="md" visibleFrom="md">
            Learn more
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}

export function SettingsSecurityPage() {
  return (
    <AccountShell>
      <Stack gap="lg">
        <div>
          <Title order={2} fz={24} fw={800} c={colors.navyDeep}>
            Security
          </Title>
          <Text fz={14} c="dimmed" mt={6}>
            Manage passwords, sessions, and how you sign in.
          </Text>
        </div>

        <Grid gap="md">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Text fw={800} fz={16} mb="md">
                Change password
              </Text>
              <Stack gap="md">
                <PasswordInput label="Current password" radius="md" />
                <PasswordInput label="New password" radius="md" />
                <PasswordInput label="Confirm new password" radius="md" />
                <Button radius="md" w={{ base: '100%', sm: 'auto' }} {...tealBtn}>
                  Update password
                </Button>
              </Stack>
            </Paper>

            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" mt="md">
              <Text fw={800} fz={16} mb="md">
                Linked accounts
              </Text>
              <Stack gap="md">
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    <Avatar radius="md" color="red">
                      G
                    </Avatar>
                    <div>
                      <Text fw={600}>Google</Text>
                      <Text fz={12} c="dimmed">
                        sarah.j@gmail.com
                      </Text>
                    </div>
                  </Group>
                  <Button variant="light" color="red" size="xs" radius="md">
                    Disconnect
                  </Button>
                </Group>
                <Group justify="space-between" wrap="nowrap">
                  <Group gap="sm">
                    <Avatar radius="md" color="dark">
                      
                    </Avatar>
                    <div>
                      <Text fw={600}>Apple</Text>
                      <Text fz={12} c="dimmed">
                        Not connected
                      </Text>
                    </div>
                  </Group>
                  <Button size="xs" radius="md" variant="default">
                    Connect
                  </Button>
                </Group>
              </Stack>
            </Paper>
          </Grid.Col>

          <Grid.Col span={{ base: 12, md: 5 }}>
            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" style={{ position: 'sticky', top: 88 }}>
              <Group justify="space-between" align="flex-start" mb="sm">
                <Text fw={800} fz={16}>
                  Two-factor authentication
                </Text>
                <Switch color="teal" defaultChecked size="md" />
              </Group>
              <Text fz={13} c="dimmed" lh={1.6}>
                Add a second step after your password. We recommend an authenticator app for the highest security.
              </Text>
            </Paper>
          </Grid.Col>
        </Grid>

        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fw={800} fz={16} mb="md">
            Active sessions
          </Text>
          <Stack gap={0}>
            {[
              { where: 'London, UK · Chrome on Mac', when: 'Current session', current: true as const },
              { where: 'Berlin · Safari on iPhone', when: 'May 03 · mobile', current: false as const },
            ].map((s, idx) => (
              <Group
                key={s.where}
                justify="space-between"
                py="md"
                style={{
                  borderTop: idx === 0 ? undefined : `1px solid rgba(198,198,207,0.45)`,
                }}
                wrap="wrap"
              >
                <Group gap="sm">
                  <IconDeviceDesktop size={20} color={colors.mutedText} />
                  <div>
                    <Text fw={600}>{s.where}</Text>
                    <Text fz={12} c="dimmed">
                      {s.when}
                      {s.current ? (
                        <>
                          {' · '}
                          <Badge size="xs" color="green" variant="light" ml={4}>
                            This device
                          </Badge>
                        </>
                      ) : null}
                    </Text>
                  </div>
                </Group>
                {!s.current ? (
                  <Button variant="subtle" color="red" size="xs">
                    End session
                  </Button>
                ) : (
                  <Text fz={12} c="dimmed">
                    Protected
                  </Text>
                )}
              </Group>
            ))}
          </Stack>
        </Paper>
      </Stack>
    </AccountShell>
  );
}

export function SettingsPrivacyPage() {
  return (
    <AccountShell>
      <Stack gap="lg" pb={32}>
        <div>
          <Title order={2} fz={24} fw={800} c={colors.navyDeep}>
            Safety & privacy
          </Title>
          <Text fz={14} c="dimmed" mt={6}>
            Shape who can reach you and how activity appears across the marketplace.
          </Text>
        </div>

        <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
          {[
            {
              title: 'Profile visibility',
              desc: 'Show your bio and stats to verified members only.',
              on: true,
            },
            { title: 'Last active', desc: 'Others can see when you were recently online.', on: true },
            { title: 'Read history', desc: 'Let teammates know when messages were read.', on: false },
          ].map((c) => (
            <Paper key={c.title} p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Group justify="space-between" mb="sm">
                <Text fw={700}>{c.title}</Text>
                <Switch color="teal" defaultChecked={c.on} />
              </Group>
              <Text fz={13} c="dimmed">
                {c.desc}
              </Text>
            </Paper>
          ))}
        </SimpleGrid>

        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fw={800} fz={16} mb="md">
            Blocked users
          </Text>
          <Stack gap="md">
            {[
              { n: 'Alex M.', src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&q=70' },
              { n: 'Priya S.', src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&q=70' },
            ].map((u) => (
              <Group key={u.n} justify="space-between">
                <Group gap="sm">
                  <Avatar src={u.src} radius="xl" />
                  <Text fw={600}>{u.n}</Text>
                </Group>
                <Button size="xs" variant="light" radius="md">
                  Unblock
                </Button>
              </Group>
            ))}
          </Stack>
        </Paper>

        <Paper radius="md" withBorder shadow="xs" bg="#fff" style={{ overflow: 'hidden' }}>
          <Text fw={800} fz={16} px="lg" py="md" style={{ borderBottom: '1px solid #eceef3' }}>
            Reported users
          </Text>
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  User
                </Table.Th>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  Reason
                </Table.Th>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  Date
                </Table.Th>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  Status
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              <Table.Tr>
                <Table.Td>J. Reeves</Table.Td>
                <Table.Td fz={13} c="dimmed">
                  Harassment
                </Table.Td>
                <Table.Td>Apr 30, 2026</Table.Td>
                <Table.Td>
                  <Badge color="orange" variant="light">
                    Pending
                  </Badge>
                </Table.Td>
              </Table.Tr>
              <Table.Tr>
                <Table.Td>Unknown · TH-928</Table.Td>
                <Table.Td fz={13} c="dimmed">
                  Scam attempt
                </Table.Td>
                <Table.Td>Apr 12, 2026</Table.Td>
                <Table.Td>
                  <Badge color="green" variant="light">
                    Resolved
                  </Badge>
                </Table.Td>
              </Table.Tr>
            </Table.Tbody>
          </Table>
        </Paper>

        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fw={800} fz={16} mb="md">
            Report a user
          </Text>
          <Stack gap="md">
            <SimpleGrid cols={{ base: 1, md: 2 }}>
              <Select label="Select a user" placeholder="Pick from recent chats" data={['J. Reeves · trip #881', 'Support bot']} radius="md" />
              <Select label="Reason" data={['Harassment', 'Spam', 'Policy violation']} radius="md" />
            </SimpleGrid>
            <Textarea label="Describe the issue" minRows={4} radius="md" placeholder="Facts, timestamps, screenshots…" />
            <Button radius="md" {...tealBtn} maw={220}>
              Send report
            </Button>
          </Stack>
        </Paper>

        <Paper p="lg" radius="lg" withBorder style={{ borderColor: '#fecaca', borderWidth: 2 }}>
          <Text fw={900} fz={15} c="red" mb={6}>
            Danger zone
          </Text>
          <Text fz={13} c="dimmed" mb="md">
            Permanently delete your account and scrub public profile content. Escrow settles before closure.
          </Text>
          <Button color="red" variant="filled" radius="md">
            Delete account
          </Button>
        </Paper>
      </Stack>
    </AccountShell>
  );
}

export function SettingsHelpCenterPage() {
  const categories = ['Getting started', 'Payments', 'Deliveries', 'Safety', 'Account', 'Community support'] as const;

  return (
    <HelpShell>
      <Stack gap="lg">
        <TextInput
          size="lg"
          radius="md"
          placeholder="Search for help…"
          leftSection={<IconSearch size={20} stroke={1.5} />}
        />

        <div>
          <Text fw={800} fz={16} mb="md">
            Browse by category
          </Text>
          <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="md">
            {categories.map((c) => (
              <Paper key={c} p="lg" radius="md" withBorder shadow="xs" bg="#fff" style={{ cursor: 'pointer' }}>
                <Text fw={700} fz={14}>
                  {c}
                </Text>
                <Text fz={12} c="dimmed" mt={6}>
                  Articles & tips
                </Text>
              </Paper>
            ))}
          </SimpleGrid>
        </div>

        <Grid gap="md">
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Text fw={800} fz={16} mb="md">
                Popular articles
              </Text>
              <Stack gap="sm">
                {[
                  'How payouts and holds work',
                  'Dispute timeline and evidence',
                  'Updating your travel availability',
                  'Privacy controls for your profile',
                ].map((t) => (
                  <Text key={t} fz={14} c={CM.teal} fw={600} style={{ cursor: 'pointer' }}>
                    {t} →
                  </Text>
                ))}
              </Stack>
            </Paper>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Stack gap="md">
              <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
                <Group gap="sm" mb="sm">
                  <IconMessageCircle size={20} color={CM.teal} stroke={1.5} />
                  <Text fw={800}>Live chat</Text>
                </Group>
                <Badge color="green" variant="light" mb="md">
                  Live chat available
                </Badge>
                <Button fullWidth radius="md" {...tealBtn}>
                  Start live chat
                </Button>
              </Paper>
              <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
                <Text fw={800} fz={16} mb="md">
                  Email support
                </Text>
                <Select label="Subject" data={['Billing', 'Safety', 'Technical issue']} radius="md" mb="sm" />
                <Textarea label="Message" minRows={4} radius="md" mb="md" />
                <Button fullWidth radius="md" variant="default">
                  Email support
                </Button>
              </Paper>
            </Stack>
          </Grid.Col>
        </Grid>

        <Paper p={0} radius="md" style={{ overflow: 'hidden' }}>
          <Box pos="relative">
            <Image
              src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1200&q=70"
              h={200}
              alt="Support team"
            />
            <Box
              pos="absolute"
              inset={0}
              style={{
                background: 'linear-gradient(90deg, rgba(8,21,52,0.85) 0%, rgba(8,21,52,0.45) 100%)',
                display: 'flex',
                alignItems: 'center',
                padding: '0 28px',
              }}
            >
              <Text fz={15} fw={650} c="#fff" maw={520} lh={1.55}>
                Can&apos;t find the answer? Our dedicated support team is here to help you with any questions or issues you
                may have.
              </Text>
            </Box>
          </Box>
        </Paper>
      </Stack>
    </HelpShell>
  );
}

export function SettingsHelpTicketsPage() {
  return (
    <HelpShell>
      <Paper p="xl" radius="md" withBorder bg="#fff">
        <Title order={3} fz={20} mb="sm">
          My tickets
        </Title>
        <Text fz={14} c="dimmed">
          Your open cases appear here once you submit chat or email transcripts from the hub.
        </Text>
      </Paper>
    </HelpShell>
  );
}

export function SettingsHelpCommunityPage() {
  return (
    <HelpShell>
      <Paper p="xl" radius="md" withBorder bg="#fff">
        <Title order={3} fz={20} mb="sm">
          Community
        </Title>
        <Text fz={14} c="dimmed">
          Discussions run in moderated channels linked from announcements — prototype placeholder.
        </Text>
      </Paper>
    </HelpShell>
  );
}

export function SettingsHelpContactPage() {
  return (
    <HelpShell>
      <Paper p="xl" radius="md" withBorder bg="#fff">
        <Title order={3} fz={20} mb="sm">
          Contact us
        </Title>
        <Text fz={14} c="dimmed" mb="md">
          Use the help center for search, live chat, and email — or jump back to the hub now.
        </Text>
        <Button component={RouterLink} to="/app/settings/help-center" radius="md" {...tealBtn}>
          Open help center
        </Button>
      </Paper>
    </HelpShell>
  );
}
