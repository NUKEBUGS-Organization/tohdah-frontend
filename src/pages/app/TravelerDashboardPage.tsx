import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconMapPin,
  IconPlane,
  IconPlus,
  IconStar,
  IconUserShare,
} from '@tabler/icons-react';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bookingsService } from '../../api/services/bookings.service';
import { tripsService } from '../../api/services/trips.service';
import { useAuth } from '../../context/AuthContext';
import { useApi } from '../../hooks/useApi';
import { notify } from '../../utils/notify';
import { colors } from '../../theme';
import type { Booking } from '../../api/types';

const TEAL = '#20B2AA';
const NAVY_REFERRAL = '#0A192F';

function gradientButtonProps() {
  return {
    styles: {
      root: {
        background: `linear-gradient(134deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
        border: 'none',
        color: 'white',
      },
    },
  } as const;
}

function SmallStat({
  label,
  value,
  rating,
}: {
  label: string;
  value: string;
  rating?: boolean;
}) {
  return (
    <Paper radius="md" p="md" withBorder h="100%">
      <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
        {label}
      </Text>
      <Group align="center" gap={6} mt={6}>
        <Text fz={22} fw={800} c={colors.navyDeep}>
          {value}
        </Text>
        {rating ? <IconStar size={18} color={TEAL} fill={TEAL} style={{ opacity: 0.9 }} /> : null}
      </Group>
    </Paper>
  );
}

function requestLabel(req: Record<string, unknown> | string | undefined): string {
  if (req && typeof req === 'object' && 'itemName' in req && typeof req.itemName === 'string') {
    return req.itemName;
  }
  return 'Delivery request';
}

function userName(u: Record<string, unknown> | string | undefined): string {
  if (u && typeof u === 'object' && 'fullName' in u && typeof u.fullName === 'string') {
    return u.fullName;
  }
  return 'Sender';
}

export function TravelerDashboardPage() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const { data: activeTrips, isLoading: loadTrips } = useApi(
    () => tripsService.getMy({ status: 'active', limit: 100 }),
    [],
  );

  const { data: pendingBookings, isLoading: loadPending, refetch: refetchPending } = useApi(
    () =>
      bookingsService.getMy({
        role: 'traveler',
        status: 'pending_acceptance',
        limit: 50,
      }),
    [],
  );

  const { data: completedBookings, isLoading: loadEarn } = useApi(
    () =>
      bookingsService.getMy({
        role: 'traveler',
        status: 'completed',
        limit: 500,
      }),
    [],
  );

  const activeTripCount = activeTrips?.total ?? 0;
  const pendingCount = useMemo(() => {
    const rows = pendingBookings?.data ?? [];
    return rows.filter((b) => b.status === 'pending_acceptance').length;
  }, [pendingBookings]);

  const totalEarnings = useMemo(() => {
    const rows = completedBookings?.data ?? [];
    return rows.reduce((sum, b) => sum + (b.travelerPayout ?? 0), 0);
  }, [completedBookings]);

  const ratingDisplay =
    user && user.reviewCount > 0 ? user.rating.toFixed(1) : 'No ratings yet';

  const handleAccept = async (id: string) => {
    try {
      await bookingsService.accept(id);
      notify.success('Booking accepted');
      void refetchPending();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Could not accept');
    }
  };

  const handleDecline = async (id: string) => {
    try {
      await bookingsService.decline(id);
      notify.success('Booking declined');
      void refetchPending();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Could not decline');
    }
  };

  const tripsPreview = activeTrips?.data?.slice(0, 3) ?? [];
  const incoming = pendingBookings?.data?.slice(0, 5) ?? [];

  const loadingAny = loadTrips || loadPending || loadEarn;

  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Box>
          <Title order={2} c={colors.navyDeep}>
            Dashboard
          </Title>
          <Text c={colors.mutedText} mt={4}>
            Active trips, wallet, and requests at a glance.
          </Text>
        </Box>
        <Button
          component={Link}
          to="/app/traveler/trips/new"
          leftSection={<IconPlus size={18} />}
          {...gradientButtonProps()}
        >
          Post a trip
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, lg: 3 }} spacing="md">
        <Box style={{ gridColumn: 'auto' }} maw={{ lg: '100%' }}>
          {loadingAny ? (
            <Skeleton height={180} radius="md" />
          ) : tripsPreview.length === 0 ? (
            <Card withBorder radius="md" p="lg" h="100%">
              <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
                Active trips
              </Text>
              <Text mt="md" c={colors.mutedText}>
                You have no active trips. Post a route to start receiving requests.
              </Text>
              <Button component={Link} to="/app/traveler/trips/new" mt="md" {...gradientButtonProps()}>
                Post a trip
              </Button>
            </Card>
          ) : (
            <Stack gap="md">
              {tripsPreview.map((t) => (
                <Card key={t._id} withBorder radius="md" p="lg" h="100%">
                  <Group justify="space-between" align="flex-start" mb="md">
                    <div>
                      <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText} mb={4}>
                        Active trip
                      </Text>
                      <Group gap="sm" align="center" wrap="nowrap">
                        <Avatar radius="sm" size={40} color="brandTeal" variant="light">
                          <IconPlane size={22} />
                        </Avatar>
                        <div>
                          <Title order={4} fz={20} c={colors.navyDeep}>
                            {t.origin} → {t.destination}
                          </Title>
                          <Text fz={13} c={colors.mutedText}>
                            {new Date(t.departureDate).toLocaleDateString()} →{' '}
                            {new Date(t.arrivalDate).toLocaleDateString()}
                          </Text>
                        </div>
                      </Group>
                    </div>
                    <Badge variant="light" color="teal" size="lg" radius="sm">
                      {t.status}
                    </Badge>
                  </Group>
                  <Group gap="xs" c={colors.mutedText} fz={13} mb="md">
                    <IconMapPin size={14} />
                    <Text>
                      {t.luggageSpace} · {t.matchedRequestsCount} matched
                    </Text>
                  </Group>
                  <Button
                    variant="light"
                    color="teal"
                    fullWidth
                    onClick={() =>
                      navigate('/app/traveler/trips/detail', { state: { tripId: t._id } })
                    }
                  >
                    View details
                  </Button>
                </Card>
              ))}
            </Stack>
          )}
        </Box>
        <Stack gap="md">
          <Card withBorder radius="md" p="lg">
            <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
              Wallet (earnings)
            </Text>
            <Text fz={32} fw={800} c={colors.navyDeep} mt={4}>
              {completedBookings
                ? new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                  }).format(totalEarnings)
                : '—'}
            </Text>
            <Text fz={13} c={colors.mutedText} mt={4}>
              Sum of completed booking payouts (USD).
            </Text>
            <Button
              fullWidth
              mt="md"
              variant="outline"
              color="brandTeal"
              component={Link}
              to="/app/wallet/history"
            >
              Transaction history
            </Button>
          </Card>
          <Group grow>
            <SmallStat label="Active trips" value={String(activeTripCount)} />
            <SmallStat label="Pending offers" value={String(pendingCount)} />
          </Group>
          <SmallStat label="Rating" value={ratingDisplay} rating />
        </Stack>
      </SimpleGrid>

      <Card withBorder radius="md" p="lg">
        <Text fw={700} fz={16} c={colors.navyDeep} mb="md">
          Incoming requests
        </Text>
        {loadPending ? (
          <Skeleton height={80} />
        ) : incoming.length === 0 ? (
          <Text c={colors.mutedText}>No pending booking requests right now.</Text>
        ) : (
          <Stack gap={0}>
            {incoming.map((b: Booking, i: number) => {
              const req = typeof b.requestId === 'object' ? b.requestId : undefined;
              const reqName = requestLabel(req as Record<string, unknown>);
              const route =
                req && typeof req === 'object' && 'origin' in req
                  ? `${String(req.origin)} → ${String(req.destination)}`
                  : '—';
              const requester = userName(
                b.requesterId as unknown as Record<string, unknown>,
              );
              return (
                <Box key={b._id}>
                  {i > 0 ? <Divider my="md" /> : null}
                  <Group justify="space-between" align="flex-start" wrap="nowrap">
                    <Group gap="sm">
                      <Avatar radius="xl" color="brandTeal">
                        {requester.charAt(0)}
                      </Avatar>
                      <div>
                        <Text fw={600} fz={14}>
                          {requester}
                        </Text>
                        <Text fz={13} c={colors.mutedText}>
                          {reqName} · {route}
                        </Text>
                      </div>
                    </Group>
                    <Text fw={700} fz={14} c={TEAL}>
                      {new Intl.NumberFormat(undefined, {
                        style: 'currency',
                        currency: b.currency || 'USD',
                      }).format(b.offeredFee)}
                    </Text>
                  </Group>
                  <Group gap="sm" mt="sm">
                    <Button
                      size="xs"
                      variant="light"
                      color="teal"
                      onClick={() => void handleAccept(b._id)}
                    >
                      Accept
                    </Button>
                    <Button
                      size="xs"
                      variant="default"
                      onClick={() => void handleDecline(b._id)}
                    >
                      Decline
                    </Button>
                  </Group>
                </Box>
              );
            })}
          </Stack>
        )}
      </Card>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Card withBorder radius="md" p="lg" h={260}>
          <Text fw={700} fz={14} c={colors.navyDeep} mb="sm">
            Your routes
          </Text>
          <Text fz={14} c={colors.mutedText}>
            {activeTripCount > 0
              ? 'Open My Trips to manage published routes and matches.'
              : 'Post a trip to see your corridor on the map.'}
          </Text>
        </Card>
        <Card withBorder radius="md" p="lg" h={260}>
          <Text fw={700} fz={14} c={colors.navyDeep} mb="sm">
            Activity
          </Text>
          <Text fz={14} c={colors.mutedText}>
            Completed deliveries: {completedBookings?.total ?? 0}. Browse open sender requests from
            the marketplace anytime.
          </Text>
          <Button component={Link} to="/app/traveler/browse/requests" variant="light" mt="md" color="teal">
            Browse requests
          </Button>
        </Card>
      </SimpleGrid>

      <Paper
        radius="md"
        p="xl"
        style={{
          background: NAVY_REFERRAL,
          color: 'white',
        }}
      >
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Group gap="md">
            <Box
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: 'rgba(255,255,255,0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconUserShare size={24} style={{ opacity: 0.95 }} />
            </Box>
            <div>
              <Text fw={700} fz={18}>
                Invite friends, earn rewards
              </Text>
              <Text fz={14} style={{ opacity: 0.85 }} mt={6} maw={480}>
                Share Tohdah with travelers and senders. You both get credit when they complete a first
                trip.
              </Text>
            </div>
          </Group>
          <Button
            leftSection={<IconUserShare size={18} />}
            variant="white"
            color="dark"
            component={Link}
            to="/signup"
          >
            Refer a friend
          </Button>
        </Group>
      </Paper>
    </Stack>
  );
}
