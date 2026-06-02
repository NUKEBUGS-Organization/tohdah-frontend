import {
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Group,
  Paper,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  ThemeIcon,
} from '@mantine/core';
import {
  IconInbox,
  IconMapPin,
  IconPlane,
  IconPlus,
  IconStar,
  IconTruck,
  IconUserShare,
} from '@tabler/icons-react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useMemo, useState, type ReactNode } from 'react';
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
import { PageHeader } from '../../components/PageHeader';
import type { Booking, Trip } from '../../api/types';

function GlassStat({
  label,
  value,
  rating,
}: {
  label: string;
  value: string;
  rating?: boolean;
}) {
  return (
    <Paper className="glass-card" p="lg" radius="xl" h="100%">
      <Text size="xs" c={colors.subtleText} fw={600} tt="uppercase" lts="0.08em">
        {label}
      </Text>
      <Group align="center" gap={6} mt={4}>
        <Text fw={700} size="2rem" c={colors.textPrimary}>
          {value}
        </Text>
        {rating ? <IconStar size={18} color={colors.primaryTeal} fill={colors.primaryTeal} /> : null}
      </Group>
    </Paper>
  );
}

function EmptySection({ icon, message }: { icon: ReactNode; message: string }) {
  return (
    <Stack align="center" py="xl" gap="sm">
      <ThemeIcon size={48} radius="xl" variant="light" color="teal">
        {icon}
      </ThemeIcon>
      <Text c={colors.subtleText} size="sm" ta="center">
        {message}
      </Text>
    </Stack>
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
        <Text fw={700} fz={14} c={colors.primaryTeal}>
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
        <PageHeader
          section="Traveler"
          title="Dashboard"
          subtitle="Active trips, wallet, and requests at a glance."
        />
        <Button
          component={Link}
          to="/app/traveler/trips/new"
          leftSection={<IconPlus size={18} />}
          radius="xl"
        >
          Post a trip
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <Paper
          p="xl"
          radius="xl"
          style={{
            background: 'linear-gradient(135deg, #00C9A7, #2D86FF)',
            border: 'none',
            boxShadow: '0 8px 32px rgba(0,201,167,0.3)',
            gridColumn: 'span 1',
          }}
        >
          <Text size="xs" c="rgba(255,255,255,0.8)" fw={600} tt="uppercase" lts="0.1em">
            Wallet (earnings)
          </Text>
          <Text fw={800} size="2.5rem" c="white" mt={4}>
            {loadBookings
              ? '—'
              : new Intl.NumberFormat(undefined, {
                  style: 'currency',
                  currency: 'USD',
                }).format(totalEarnings)}
          </Text>
          <Button
            fullWidth
            mt="md"
            radius="xl"
            variant="white"
            color="dark"
            component={Link}
            to="/app/wallet/history"
          >
            Transaction history
          </Button>
        </Paper>
        <GlassStat label="Active trips" value={String(activeTripCount)} />
        <GlassStat label="Pending offers" value={String(pendingCount)} />
        <GlassStat label="Rating" value={ratingDisplay} rating />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, lg: 2 }} spacing="md">
        <Box>
          {(!authReady || loadTrips) ? (
            <Skeleton height={180} radius="xl" />
          ) : tripsPreview.length === 0 ? (
            <Paper className="glass-card" p="xl" radius="xl">
              <Text fw={700} size="lg" c={colors.textPrimary} mb="md">
                Active trips
              </Text>
              <EmptySection
                icon={<IconPlane size={24} />}
                message="You have no active trips. Post a route to start receiving requests."
              />
              <Button component={Link} to="/app/traveler/trips/new" radius="xl" fullWidth>
                Post a trip
              </Button>
            </Paper>
          ) : (
            <Stack gap="md">
              {tripsPreview.map((t) => (
                <Paper key={t._id} className="glass-card" p="xl" radius="xl">
                  <Group justify="space-between" align="flex-start" mb="md">
                    <div>
                      <Text size="xs" c={colors.subtleText} fw={600} tt="uppercase" lts="0.08em" mb={4}>
                        Active trip
                      </Text>
                      <Group gap="sm" align="center" wrap="nowrap">
                        <Avatar radius="sm" size={40} color="teal" variant="light">
                          <IconPlane size={22} />
                        </Avatar>
                        <div>
                          <Text fw={700} size="lg" c={colors.textPrimary}>
                            {t.origin} → {t.destination}
                          </Text>
                          <Text size="sm" c={colors.textSecondary}>
                            Departs {new Date(t.departureDate).toLocaleDateString()}
                          </Text>
                        </div>
                      </Group>
                    </div>
                    <Badge variant="light" color="teal" radius="xl">
                      {t.luggageSpace}
                    </Badge>
                  </Group>
                  <Group gap="xs" c={colors.textSecondary} fz={13} mb="md">
                    <IconMapPin size={14} />
                    <Text size="sm">{t.matchedRequestsCount} matched request(s)</Text>
                  </Group>
                  <Button
                    variant="light"
                    color="teal"
                    fullWidth
                    radius="xl"
                    onClick={() =>
                      navigate('/app/traveler/trips/detail', { state: { tripId: t._id } })
                    }
                  >
                    View details
                  </Button>
                </Paper>
              ))}
            </Stack>
          )}
        </Box>

        <Paper className="glass-card" p="xl" radius="xl">
          <Text fw={700} size="lg" c={colors.textPrimary} mb="md">
            Incoming requests
          </Text>
          {loadBookings ? (
            <Skeleton height={80} />
          ) : bookingsError ? (
            <Text c={colors.textSecondary} size="sm">
              Unable to load requests right now. Please refresh.
            </Text>
          ) : incoming.length === 0 ? (
            <EmptySection
              icon={<IconInbox size={24} />}
              message="No pending booking requests right now"
            />
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
        </Paper>
      </SimpleGrid>

      <Paper className="glass-card" p="xl" radius="xl">
        <Text fw={700} size="lg" c={colors.textPrimary} mb="md">
          Active deliveries
        </Text>
        {loadBookings ? (
          <Skeleton height={60} />
        ) : activeDeliveries.length === 0 ? (
          <EmptySection
            icon={<IconTruck size={24} />}
            message="No active deliveries yet"
          />
        ) : (
          <Stack gap="sm">
            {activeDeliveries.map((b) => {
              const req = typeof b.requestId === 'object' ? b.requestId : undefined;
              const label = requestLabel(req as Record<string, unknown>);
              return (
                <Group key={b._id} justify="space-between" wrap="nowrap">
                  <div>
                    <Text fw={600} size="sm" c={colors.textPrimary}>
                      {label}
                    </Text>
                    <Text size="xs" c={colors.textSecondary}>
                      {b.bookingRef} · {b.status.replace(/_/g, ' ')}
                    </Text>
                  </div>
                  <Button
                    size="xs"
                    radius="xl"
                    variant="light"
                    color="teal"
                    component={Link}
                    to={`/app/tracking/live?bookingId=${encodeURIComponent(b._id)}`}
                  >
                    Track
                  </Button>
                </Group>
              );
            })}
          </Stack>
        )}
      </Paper>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper className="glass-card" p="xl" radius="xl" h={260}>
          <Text fw={700} c={colors.textPrimary} mb="sm">
            Your routes
          </Text>
          <Text size="sm" c={colors.textSecondary}>
            {activeTripCount > 0
              ? 'Open My Trips to manage published routes and matches.'
              : 'Post a trip to see your corridor on the map.'}
          </Text>
        </Paper>
        <Paper className="glass-card" p="xl" radius="xl" h={260}>
          <Text fw={700} c={colors.textPrimary} mb="sm">
            Activity
          </Text>
          <Text size="sm" c={colors.textSecondary}>
            Completed deliveries:{' '}
            {allTravelerBookings.filter((b) => b.status === 'completed').length}. Browse open sender
            requests from the marketplace anytime.
          </Text>
          <Button
            component={Link}
            to="/app/traveler/browse/requests"
            variant="light"
            mt="md"
            color="teal"
            radius="xl"
          >
            Browse requests
          </Button>
        </Paper>
      </SimpleGrid>

      <Paper
        radius="xl"
        p="xl"
        style={{
          background: `linear-gradient(135deg, ${colors.navyDark}, #0D2137)`,
          color: 'white',
          border: 'none',
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
            radius="xl"
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
