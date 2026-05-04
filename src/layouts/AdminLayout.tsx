import {
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  NavLink,
  ScrollArea,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconActivity,
  IconAffiliate,
  IconBuildingCommunity,
  IconCreditCard,
  IconLayoutDashboard,
  IconScale,
  IconSearch,
  IconSettings,
  IconUsers,
  IconWorld,
  IconHeadset,
} from '@tabler/icons-react';
import { Link as RouterLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { adminUi as AU } from '../theme';

function navActive(pathname: string, path: string, exact: boolean) {
  return exact ? pathname === path : pathname === path || pathname.startsWith(`${path}/`);
}

type NavSpec = { path: string; label: string; icon: typeof IconLayoutDashboard; exact: boolean };

function AdminNavLinks() {
  const location = useLocation();
  const core: NavSpec[] = [
    { path: '/admin', label: 'Dashboard', icon: IconLayoutDashboard, exact: true },
    { path: '/admin/users', label: 'Users', icon: IconUsers, exact: false },
    { path: '/admin/payments', label: 'Payments', icon: IconCreditCard, exact: false },
    { path: '/admin/monitor', label: 'Monitoring', icon: IconActivity, exact: false },
    { path: '/admin/settings', label: 'Settings', icon: IconSettings, exact: false },
  ];
  const programs: NavSpec[] = [
    { path: '/admin/disputes', label: 'Disputes', icon: IconScale, exact: true },
    { path: '/admin/support', label: 'Support moderation', icon: IconHeadset, exact: true },
    { path: '/admin/community-impact', label: 'Community impact', icon: IconWorld, exact: true },
    { path: '/admin/referrals', label: 'Referrals & loyalty', icon: IconAffiliate, exact: true },
    { path: '/admin/partners', label: 'Partners & sponsors', icon: IconBuildingCommunity, exact: true },
  ];

  const linkStyles = {
    root: {
      borderRadius: 10,
      fontWeight: 500,
      fontSize: 14,
      color: '#cbd5e1',
      '&[data-active]': {
        backgroundColor: AU.sidebarActive,
        color: '#f8fafc',
        borderLeft: `3px solid ${AU.accentTeal}`,
        paddingLeft: 'calc(var(--mantine-spacing-sm) - 3px)',
        fontWeight: 600,
      },
    },
    section: { '&[data-position="left"]': { marginRight: 10 } },
  } as const;

  const render = (items: NavSpec[]) =>
    items.map((item) => {
      const active = navActive(location.pathname, item.path, item.exact);
      return (
        <NavLink
          key={item.path}
          component={RouterLink}
          to={item.path}
          label={item.label}
          leftSection={<item.icon size={18} stroke={1.5} />}
          active={active}
          mb={4}
          styles={linkStyles}
        />
      );
    });

  return (
    <>
      {render(core)}
      <Text fz={11} fw={700} tt="uppercase" c="#64748b" mt="lg" mb="xs" px={4}>
        Programs
      </Text>
      {render(programs)}
    </>
  );
}

export function AdminLayout() {
  const [opened, { toggle }] = useDisclosure();
  const navigate = useNavigate();

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 264,
        breakpoint: 'sm',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        navbar: {
          backgroundColor: AU.sidebarBg,
          borderRight: `1px solid rgba(148,163,184,0.12)`,
        },
        header: {
          backgroundColor: AU.headerSurface,
          borderBottom: '1px solid #e2e8f0',
        },
        main: {
          backgroundColor: AU.pageBg,
        },
      }}
    >
      <AppShell.Navbar p="md">
        <Group justify="space-between" mb="lg" px={4}>
          <Box>
            <Title order={5} c="#f8fafc" fz={16} lh={1.25}>
              Tohdah
            </Title>
            <Text fz={11} c="slate.4">
              Admin
            </Text>
          </Box>
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" color="#94a3b8" />
        </Group>
        <ScrollArea h="calc(100vh - 120px)" type="never">
          <AdminNavLinks />
        </ScrollArea>
        <Box mt="auto" pt="md" px={4}>
          <Text
            fz={11}
            c="slate.5"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate('/admin/login')}
          >
            Sign out (demo)
          </Text>
        </Box>
      </AppShell.Navbar>

      <AppShell.Header px="lg" py={0}>
        <Group justify="space-between" h="100%" wrap="nowrap">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          <TextInput
            placeholder="Search users, payouts, bookings…"
            leftSection={<IconSearch size={16} stroke={1.5} />}
            radius="md"
            size="sm"
            maw={440}
            style={{ flex: 1 }}
            visibleFrom="sm"
          />
          <Box hiddenFrom="sm" style={{ flex: 1 }} />
          <Avatar radius="xl" size="md" style={{ background: AU.accentTeal }}>
            AD
          </Avatar>
        </Group>
      </AppShell.Header>

      <AppShell.Main>
        <Box maw={1400} mx="auto" w="100%">
          <Outlet />
        </Box>
      </AppShell.Main>
    </AppShell>
  );
}
