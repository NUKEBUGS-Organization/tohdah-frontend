import {
  Anchor,
  AppShell,
  Avatar,
  Box,
  Burger,
  Group,
  Indicator,
  NavLink,
  ScrollArea,
  Text,
  TextInput,
  ThemeIcon,
  Tooltip,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBell,
  IconCalendar,
  IconClipboardList,
  IconLayoutDashboard,
  IconMessage,
  IconPlaneDeparture,
  IconSearch,
  IconSettings,
  IconUser,
  IconWallet,
  IconWifi,
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import { Outlet, Link as RouterLink, useLocation } from 'react-router-dom';
import { notificationsService } from '../api/services/notifications.service';
import { useAuth } from '../context/AuthContext';
import { useSocket } from '../context/SocketContext';
import { resolveUserId } from '../utils/screen-data';
import { colors } from '../theme';

const sidebarSectionLabel = {
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: '0.1em',
  color: colors.subtleText,
  textTransform: 'uppercase' as const,
  paddingLeft: 16,
  marginBottom: 4,
  marginTop: 20,
};

const shellHeaderStyle = {
  background: 'rgba(255,255,255,0.9)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderBottom: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '0 1px 12px rgba(0,0,0,0.05)',
};

const shellNavbarStyle = {
  background: 'rgba(255,255,255,0.85)',
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderRight: '1px solid rgba(0,0,0,0.06)',
  boxShadow: '2px 0 20px rgba(0,0,0,0.04)',
};

export function AppLayout() {
  const [opened, { toggle }] = useDisclosure();
  const location = useLocation();
  const { user, logout } = useAuth();
  const userId = resolveUserId(user);
  const queryClient = useQueryClient();
  const { socket, isConnected } = useSocket();

  const { data: notifPreview } = useQuery({
    queryKey: ['notifications', 'unread-preview', userId],
    queryFn: () => notificationsService.getAll({ isRead: false, limit: 1 }),
    enabled: !!userId,
  });

  const unreadCount = notifPreview?.unreadCount ?? 0;

  useEffect(() => {
    if (!socket) return;

    const handleNewNotification = () => {
      void queryClient.invalidateQueries({ queryKey: ['notifications'] });
    };

    socket.on('notification:new', handleNewNotification);
    return () => {
      socket.off('notification:new', handleNewNotification);
    };
  }, [socket, queryClient]);

  const initials =
    user?.fullName
      ?.split(/\s+/)
      .map((p) => p[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '?';

  const navActiveStyle = (active: boolean) =>
    active
      ? {
          background: 'linear-gradient(135deg, rgba(0,201,167,0.10), rgba(45,134,255,0.06))',
          color: colors.primaryTeal,
          fontWeight: 600,
          borderRadius: 12,
        }
      : { borderRadius: 12 };

  const travelerLinks = (
    <>
      <Text style={{ ...sidebarSectionLabel, marginTop: 8 }}>Traveler</Text>
      <NavLink
        component={RouterLink}
        to="/app/traveler"
        label="Dashboard"
        leftSection={<IconLayoutDashboard size={18} stroke={1.5} />}
        active={location.pathname === '/app/traveler'}
        style={navActiveStyle(location.pathname === '/app/traveler')}
      />
      <NavLink
        component={RouterLink}
        to="/app/traveler/trips"
        label="My Trips"
        leftSection={<IconPlaneDeparture size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/traveler/trips')}
        style={navActiveStyle(location.pathname.startsWith('/app/traveler/trips'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/bookings"
        label="My Bookings"
        leftSection={<IconCalendar size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/bookings')}
        style={navActiveStyle(location.pathname.startsWith('/app/bookings'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/chat"
        label="Messages"
        leftSection={<IconMessage size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/chat')}
        style={navActiveStyle(location.pathname.startsWith('/app/chat'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/wallet/history"
        label="Wallet"
        leftSection={<IconWallet size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/wallet')}
        style={navActiveStyle(location.pathname.startsWith('/app/wallet'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/settings/notifications"
        label="Settings"
        leftSection={<IconSettings size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/settings')}
        style={navActiveStyle(location.pathname.startsWith('/app/settings'))}
      />
    </>
  );

  const requesterLinks = (
    <>
      <Text style={sidebarSectionLabel}>Requester</Text>
      <NavLink
        component={RouterLink}
        to="/app/requester"
        label="Dashboard"
        leftSection={<IconLayoutDashboard size={18} stroke={1.5} />}
        active={location.pathname === '/app/requester'}
        style={navActiveStyle(location.pathname === '/app/requester')}
      />
      <NavLink
        component={RouterLink}
        to="/app/requester/requests"
        label="My Requests"
        leftSection={<IconClipboardList size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/requester/requests')}
        style={navActiveStyle(location.pathname.startsWith('/app/requester/requests'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/bookings"
        label="My Bookings"
        leftSection={<IconCalendar size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/bookings')}
        style={navActiveStyle(location.pathname.startsWith('/app/bookings'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/chat"
        label="Messages"
        leftSection={<IconMessage size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/chat')}
        style={navActiveStyle(location.pathname.startsWith('/app/chat'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/settings/my-profile"
        label="Profile"
        leftSection={<IconUser size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/settings/my-profile')}
        style={navActiveStyle(location.pathname.startsWith('/app/settings/my-profile'))}
      />
      <NavLink
        component={RouterLink}
        to="/app/settings/notifications"
        label="Settings"
        leftSection={<IconSettings size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/settings')}
        style={navActiveStyle(location.pathname.startsWith('/app/settings'))}
      />
    </>
  );

  return (
    <AppShell
      header={{ height: 64 }}
      navbar={{
        width: 300,
        breakpoint: 'md',
        collapsed: { mobile: !opened },
      }}
      padding="md"
      styles={{
        header: shellHeaderStyle,
        navbar: shellNavbarStyle,
        main: { background: 'transparent' },
      }}
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
              className="gradient-text"
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
            {!isConnected ? (
              <Tooltip label="Reconnecting...">
                <ThemeIcon color="gray" size="xs" radius="xl" variant="light">
                  <IconWifi size={10} />
                </ThemeIcon>
              </Tooltip>
            ) : null}
            <Anchor
              component="button"
              type="button"
              fz={14}
              fw={500}
              c={colors.textSecondary}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => void logout()}
            >
              Log out
            </Anchor>
            <UnstyledButton component={RouterLink} to="/app/notifications" aria-label="Notifications">
              <Indicator inline disabled={unreadCount <= 0} label={unreadCount > 99 ? '99+' : unreadCount} size={18}>
                <IconBell size={20} stroke={1.5} style={{ color: colors.textSecondary }} />
              </Indicator>
            </UnstyledButton>
            <Avatar radius="xl" size="sm" color="teal" src={user?.profilePhoto ?? undefined}>
              {initials}
            </Avatar>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea h="calc(100vh - 120px)">
          <Text style={{ ...sidebarSectionLabel, marginTop: 8 }}>Shortcuts</Text>
          {travelerLinks}
          {requesterLinks}
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
