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
        to="/app/bookings"
        label="My Bookings"
        leftSection={<IconCalendar size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/bookings')}
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
        to="/app/bookings"
        label="My Bookings"
        leftSection={<IconCalendar size={18} stroke={1.5} />}
        active={location.pathname.startsWith('/app/bookings')}
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
              c={colors.mutedText}
              style={{ background: 'none', border: 'none', cursor: 'pointer' }}
              onClick={() => void logout()}
            >
              Log out
            </Anchor>
            <UnstyledButton component={RouterLink} to="/app/notifications" aria-label="Notifications">
              <Indicator inline disabled={unreadCount <= 0} label={unreadCount > 99 ? '99+' : unreadCount} size={18}>
                <IconBell size={20} stroke={1.5} style={{ color: colors.mutedText }} />
              </Indicator>
            </UnstyledButton>
            <Avatar radius="xl" size="sm" color="brandTeal" src={user?.profilePhoto ?? undefined}>
              {initials}
            </Avatar>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <ScrollArea h="calc(100vh - 120px)">
          <Text size="xs" fw={700} c={colors.subtleText} tt="uppercase" mb="sm">
            Shortcuts
          </Text>
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
