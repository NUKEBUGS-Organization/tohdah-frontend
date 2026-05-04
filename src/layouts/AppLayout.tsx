import {
  Accordion,
  Anchor,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
  TextInput,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBell,
  IconClipboardList,
  IconLayoutDashboard,
  IconMessage,
  IconPlaneDeparture,
  IconSearch,
  IconSettings,
  IconUser,
  IconWallet,
} from '@tabler/icons-react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { APP_SCREEN_CATALOG, groupCatalogBySection } from '../app/catalog';
import { colors } from '../theme';

const grouped = groupCatalogBySection(APP_SCREEN_CATALOG);

function sectionTitle(key: string) {
  const labels: Record<string, string> = {
    traveler: 'Traveler',
    requester: 'Requester',
    booking: 'Booking',
    bookings: 'Bookings',
    checkout: 'Checkout',
    wallet: 'Wallet & payouts',
    tracking: 'Tracking',
    chat: 'Messages',
    settings: 'Settings',
    notifications: 'Notifications',
    profile: 'Profile',
    reviews: 'Reviews',
    'trust-score': 'Trust',
  };
  return labels[key] ?? key;
}

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();

  const travelerLinks = (
    <>
      <Text size="xs" fw={700} c={colors.subtleText} tt="uppercase" mb={4}>
        Traveler
      </Text>
      <NavLink
        component={RouterLink}
        to="/app/traveler"
        label="Dashboard"
        leftSection={<IconLayoutDashboard size={18} stroke={1.5} />}
        active={location.pathname === '/app/traveler'}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/traveler/trips"
        label="My Trips"
        leftSection={<IconPlaneDeparture size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/traveler/trips')}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/chat"
        label="Messages"
        leftSection={<IconMessage size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/chat')}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/wallet/history"
        label="Wallet"
        leftSection={<IconWallet size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/wallet')}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/settings/notifications"
        label="Settings"
        leftSection={<IconSettings size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/settings')}
        style={{ borderRadius: 8 }}
      />
    </>
  );

  const requesterLinks = (
    <>
      <Text size="xs" fw={700} c={colors.subtleText} tt="uppercase" mt="lg" mb={4}>
        Requester
      </Text>
      <NavLink
        component={RouterLink}
        to="/app/requester"
        label="Dashboard"
        leftSection={<IconLayoutDashboard size={18} stroke={1.5} />}
        active={location.pathname === '/app/requester'}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/requester/requests"
        label="My Requests"
        leftSection={<IconClipboardList size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/requester/requests')}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/chat"
        label="Messages"
        leftSection={<IconMessage size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/chat')}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/profile/public"
        label="Profile"
        leftSection={<IconUser size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/profile')}
        style={{ borderRadius: 8 }}
      />
      <NavLink
        component={RouterLink}
        to="/app/settings/notifications"
        label="Settings"
        leftSection={<IconSettings size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/settings')}
        style={{ borderRadius: 8 }}
      />
    </>
  );

  const mainLinks = (
    <>
      {travelerLinks}
      {requesterLinks}
    </>
  );

  const catalogNav = [...grouped.entries()].map(([section, items]) => (
    <Accordion.Item key={section} value={section}>
      <Accordion.Control>{sectionTitle(section)}</Accordion.Control>
      <Accordion.Panel>
        {items.map((item) => {
          const to = `/app/${item.path}`;
          return (
            <NavLink
              key={item.path}
              component={RouterLink}
              to={to}
              label={item.title}
              active={location.pathname === to}
              pl="md"
              style={{ borderRadius: 8 }}
            />
          );
        })}
      </Accordion.Panel>
    </Accordion.Item>
  ));

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="md"
    >
      <AppShell.Header px="md" style={{ display: 'flex', alignItems: 'center' }}>
        <Group justify="space-between" w="100%" wrap="nowrap" gap="md">
          <Group gap="sm" wrap="nowrap">
            <Burger opened={opened} onClick={toggle} hiddenFrom="md" size="sm" />
            <Text
              component={RouterLink}
              to="/"
              fw={800}
              fz={18}
              c={colors.navyDeep}
              style={{ textDecoration: 'none' }}
            >
              Tohdah
            </Text>
            <Text fz={12} c={colors.subtleText} visibleFrom="lg">
              Operations
            </Text>
          </Group>
          <TextInput
            placeholder="Search requests, travelers…"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            visibleFrom="sm"
            radius="xl"
            size="sm"
            miw={160}
            maw={440}
            style={{ flex: 1 }}
          />
          <Group gap="sm" wrap="nowrap">
            <Anchor component={RouterLink} to="/login" fz={14} fw={500} c={colors.mutedText}>
              Log out
            </Anchor>
            <IconBell size={20} stroke={1.5} style={{ color: colors.mutedText }} />
            <Avatar radius="xl" size="sm" color="brandTeal">
              QA
            </Avatar>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea h="calc(100vh - 120px)">
          <Text size="xs" fw={700} c={colors.subtleText} tt="uppercase" mb="sm">
            Shortcuts
          </Text>
          {mainLinks}
          <Text size="xs" fw={700} c={colors.subtleText} tt="uppercase" mt="lg" mb="sm">
            All screens (Figma map)
          </Text>
          <Accordion multiple defaultValue={[...grouped.keys()]}>
            {catalogNav}
          </Accordion>
        </ScrollArea>
      </AppShell.Navbar>

      <AppShell.Main>
        <Box maw={1280} mx="auto">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
