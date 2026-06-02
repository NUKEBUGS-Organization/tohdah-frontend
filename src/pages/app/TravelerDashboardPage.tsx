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
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ACTIVE_DELIVERY_STATUSES,
  INCOMING_BOOKING_STATUSES,
} from '../../api/booking-utils';
import { bookingsService } from '../../api/services/bookings.service';
import { tripsService } from '../../api/services/trips.service';
import { useAuth } from '../../context/AuthContext';
import { notify } from '../../utils/notify';
import { paginatedRows, paginatedTotal } from '../../api/booking-utils';
import { resolveUserId } from '../../utils/screen-data';
import { colors } from '../../theme';
import type { Booking, Trip } from '../../api/types';

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

function IncomingBookingRow({
  booking,
  busy,
  onAccept,
  onDecline,
}: {
  booking: Booking;
  busy: boolean;
  onAccept: (id: string) => void;
  onDecline: (id: string) => void;
}) {
  const req = typeof booking.requestId === 'object' ? booking.requestId : undefined;
  const reqName = requestLabel(req as Record<string, unknown>);
  const route =
    req && typeof req === 'object' && 'origin' in req
      ? `${String(req.origin)} → ${String(req.destination)}`
      : '—';
  const requester = userName(booking.requesterId as unknown as Record<string, unknown>);

  return (
    <>
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
            currency: booking.currency || 'USD',
          }).format(booking.offeredFee)}
        </Text>
      </Group>
      <Group gap="sm" mt="sm">
        <Button
          size="xs"
          variant="light"
          color="teal"
          loading={busy}
          disabled={busy}
          onClick={() => onAccept(booking._id)}
        >
          Accept
        </Button>
        <Button
          size="xs"
          variant="default"
          loading={busy}
          disabled={busy}
          onClick={() => onDecline(booking._id)}
        >
          Decline
        </Button>
      </Group>
    </>
  );
}

export function TravelerDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const userId = resolveUserId(user);
  const authReady = isAuthenticated && !isRestoring && !!userId;
  const [actionId, setActionId] = useState<string | null>(null);

  const { data: tripsData, isFetching: loadTrips } = useQuery({
    queryKey: ['trips', 'my', 'active', userId],
    queryFn: () => tripsService.getMy({ status: 'active', limit: 100 }),
    enabled: authReady,
  });

  const {
    data: travelerBookingsData,
    isFetching: loadBookings,
    error: bookingsError,
    refetch: refetchBookings,
  } = useQuery({
    queryKey: ['bookings', 'my', 'traveler', userId],
    queryFn: () => bookingsService.getMyForTraveler(userId!, { limit: 50 }),
    enabled: authReady,
  });

  const allTravelerBookings = paginatedRows(travelerBookingsData);

  const incoming = useMemo(
    () => allTravelerBookings.filter((b) => INCOMING_BOOKING_STATUSES.has(b.status)),
    [allTravelerBookings],
  );

  const activeDeliveries = useMemo(
    () => allTravelerBookings.filter((b) => ACTIVE_DELIVERY_STATUSES.has(b.status)),
    [allTravelerBookings],
  );

  const activeTrips: Trip[] = paginatedRows(tripsData);
  const activeTripCount = paginatedTotal(tripsData) || activeTrips.length;
  const pendingCount = incoming.length;

  const totalEarnings = useMemo(
    () =>
      allTravelerBookings
        .filter((b) => b.status === 'completed')
        .reduce((sum, b) => sum + (b.travelerPayout ?? 0), 0),
    [allTravelerBookings],
  );

  const ratingDisplay =
    user && user.reviewCount > 0 ? user.rating.toFixed(1) : 'No ratings yet';

  const handleAccept = async (id: string) => {
    setActionId(id);
    try {
      await bookingsService.accept(id);
      notify.success('Booking accepted');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      void refetchBookings();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Could not accept');
    } finally {
      setActionId(null);
    }
  };

  const handleDecline = async (id: string) => {
    setActionId(id);
    try {
      await bookingsService.decline(id);
      notify.success('Booking declined');
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      void refetchBookings();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Could not decline');
    } finally {
      setActionId(null);
    }
  };

  const tripsPreview = activeTrips.slice(0, 3);

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
          {(!authReady || loadTrips) ? (
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
                            Departs {new Date(t.departureDate).toLocaleDateString()}
                          </Text>
                        </div>
                      </Group>
                    </div>
                    <Badge variant="light" color="teal" size="lg" radius="sm">
                      {t.luggageSpace}
                    </Badge>
                  </Group>
                  <Group gap="xs" c={colors.mutedText} fz={13} mb="md">
                    <IconMapPin size={14} />
                    <Text>{t.matchedRequestsCount} matched request(s)</Text>
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
              {loadBookings
                ? '—'
                : new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: 'USD',
                  }).format(totalEarnings)}
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
        {loadBookings ? (
          <Skeleton height={80} />
        ) : bookingsError ? (
          <Text c="dimmed" size="sm">
            Unable to load requests right now. Please refresh.
          </Text>
        ) : incoming.length === 0 ? (
          <Text c={colors.mutedText}>No pending booking requests right now.</Text>
        ) : (
          <Stack gap={0}>
            {incoming.map((b, i) => (
              <Box key={b._id}>
                {i > 0 ? <Divider my="md" /> : null}
                <IncomingBookingRow
                  booking={b}
                  busy={actionId === b._id}
                  onAccept={(id) => void handleAccept(id)}
                  onDecline={(id) => void handleDecline(id)}
                />
              </Box>
            ))}
          </Stack>
        )}
      </Card>

      <Card withBorder radius="md" p="lg">
        <Text fw={700} fz={16} c={colors.navyDeep} mb="md">
          Active deliveries
        </Text>
        {loadBookings ? (
          <Skeleton height={60} />
        ) : activeDeliveries.length === 0 ? (
          <Text c={colors.mutedText}>No active deliveries yet.</Text>
        ) : (
          <Stack gap="sm">
            {activeDeliveries.map((b) => {
              const req = typeof b.requestId === 'object' ? b.requestId : undefined;
              const label = requestLabel(req as Record<string, unknown>);
              return (
                <Group key={b._id} justify="space-between" wrap="nowrap">
                  <div>
                    <Text fw={600} fz={14}>
                      {label}
                    </Text>
                    <Text fz={12} c={colors.mutedText}>
                      {b.bookingRef} · {b.status.replace(/_/g, ' ')}
                    </Text>
                  </div>
                  <Button
                    size="xs"
                    variant="light"
                    component={Link}
                    to="/app/bookings"
                  >
                    View
                  </Button>
                </Group>
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
            Completed deliveries:{' '}
            {allTravelerBookings.filter((b) => b.status === 'completed').length}. Browse open sender
            requests from
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
