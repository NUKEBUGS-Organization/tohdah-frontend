import {
  Alert,
  Badge,
  Button,
  Center,
  Container,
  Group,
  Loader,
  NumberInput,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  ThemeIcon,
  Timeline,
  Title,
} from '@mantine/core';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { IconCheck, IconCreditCard, IconMessage } from '@tabler/icons-react';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import {
  bookingDocId,
  bookingItemName,
  bookingPartyName,
  bookingPartyId,
  bookingRouteLabel,
  bookingTimelineSteps,
  normalizeMongoId,
  paginatedRows,
  paginatedTotal,
} from '../../../api/booking-utils';
import { isSameId } from '../../../api/id-utils';
import type { Booking } from '../../../api/types';
import { ApiRequestError } from '../../../api/client';
import { bookingsService } from '../../../api/services/bookings.service';
import { paymentsService } from '../../../api/services/payments.service';
import { useAuth } from '../../../context/AuthContext';
import { FRIENDLY_LOAD_ERROR, resolveUserId } from '../../../utils/screen-data';
import { useApi } from '../../../hooks/useApi';
import { usePagination } from '../../../hooks/usePagination';
import { notify } from '../../../utils/notify';
import { colors } from '../../../theme';

function bookingIdFromLoc(location: ReturnType<typeof useLocation>, sp: URLSearchParams): string | null {
  const fromQuery = sp.get('bookingId');
  if (fromQuery) return normalizeMongoId(fromQuery);
  const st = location.state as { bookingId?: string } | null;
  if (st?.bookingId) return normalizeMongoId(st.bookingId);
  return null;
}

function statusBadgeColor(status: Booking['status']): string {
  if (status === 'confirmed') return 'teal';
  if (status === 'paid') return 'blue';
  if (status === 'completed') return 'green';
  if (status === 'disputed') return 'red';
  return 'gray';
}

export function BookingConfirmPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const queryClient = useQueryClient();
  const [sp] = useSearchParams();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const userId = resolveUserId(user);
  const authReady = isAuthenticated && !isRestoring && !!userId;
  const bookingId = bookingIdFromLoc(location, sp);
  const [counterFee, setCounterFee] = useState<number>(0);

  const {
    data: booking,
    isFetching,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: ['booking', bookingId],
    queryFn: () => bookingsService.getById(bookingId!),
    enabled: authReady && !!bookingId,
  });

  const accept = async () => {
    if (!bookingId) return;
    try {
      await bookingsService.accept(bookingId);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      notify.success('Accepted');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const decline = async () => {
    if (!bookingId) return;
    try {
      await bookingsService.decline(bookingId);
      notify.success('Declined');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const counter = async () => {
    if (!bookingId || counterFee <= 0) return;
    try {
      await bookingsService.counter(bookingId, Number(counterFee));
      notify.success('Counter sent');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const acceptCounter = async () => {
    if (!bookingId) return;
    try {
      await bookingsService.acceptCounter(bookingId);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      notify.success('Counter accepted');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  if (!bookingId) {
    return (
      <Container py="xl">
        <Text c="dimmed">No booking selected.</Text>
        <Button mt="md" variant="light" onClick={() => navigate('/app/bookings')}>
          Go to My Bookings
        </Button>
      </Container>
    );
  }

  if (!authReady || isFetching) {
    return (
      <Stack gap="sm">
        <Skeleton height={40} />
        <Skeleton height={200} />
      </Stack>
    );
  }

  if (isError || !booking) {
    return (
      <Container py="xl">
        <Text c="dimmed">
          {error instanceof Error ? error.message : FRIENDLY_LOAD_ERROR}
        </Text>
        <Group mt="md">
          <Button variant="light" onClick={() => void refetch()}>
            Retry
          </Button>
          <Button variant="subtle" onClick={() => navigate('/app/bookings')}>
            My Bookings
          </Button>
        </Group>
      </Container>
    );
  }

  const id = bookingDocId(booking);
  const itemName = bookingItemName(booking);
  const route = bookingRouteLabel(booking);
  const requesterName = bookingPartyName(booking.requesterId, 'Requester');
  const travelerName = bookingPartyName(booking.travelerId, 'Traveler');
  const fee = booking.agreedFee ?? booking.offeredFee;
  const isTraveler = isSameId(booking.travelerId, userId);
  const isRequester = isSameId(booking.requesterId, userId);
  const steps = bookingTimelineSteps(booking);
  const timelineActive = Math.max(0, steps.filter((s) => s.done).length - 1);
  const canPay = booking.status === 'confirmed' && isRequester;
  const canTrack = ['paid', 'in_transit', 'delivered', 'completed'].includes(booking.status);
  const showTravelerActions =
    isTraveler &&
    (booking.status === 'pending_acceptance' || booking.status === 'countered');

  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Title order={2}>{booking.bookingRef}</Title>
          <Badge mt="xs" color={statusBadgeColor(booking.status)} size="lg">
            {booking.status.replace(/_/g, ' ').toUpperCase()}
          </Badge>
        </div>
        <Group gap="sm">
          {canPay ? (
            <Button
              color="teal"
              leftSection={<IconCreditCard size={16} />}
              onClick={() =>
                navigate(`/app/checkout?bookingId=${encodeURIComponent(id)}`, {
                  state: { bookingId: id },
                })
              }
            >
              Pay Now — ${fee}
            </Button>
          ) : null}
          <Button
            variant="outline"
            leftSection={<IconMessage size={16} />}
            onClick={() =>
              navigate('/app/chat/thread', {
                state: {
                  bookingId: id,
                  otherUserId: isRequester
                    ? bookingPartyId(booking.travelerId)
                    : bookingPartyId(booking.requesterId),
                },
              })
            }
          >
            Message
          </Button>
          {canTrack ? (
            <Button
              variant="light"
              onClick={() =>
                navigate(`/app/tracking/live?bookingId=${encodeURIComponent(id)}`)
              }
            >
              Track
            </Button>
          ) : null}
        </Group>
      </Group>

      <Paper withBorder p="lg" radius="md">
        <Text fw={700} fz={18}>
          {itemName}
        </Text>
        {route ? (
          <Text c="dimmed" mt={4}>
            {route}
          </Text>
        ) : null}
        <SimpleGrid cols={{ base: 1, sm: 2 }} mt="md">
          <div>
            <Text size="xs" c="dimmed" tt="uppercase">
              Requester
            </Text>
            <Text fw={600}>{requesterName}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" tt="uppercase">
              Traveler
            </Text>
            <Text fw={600}>{travelerName}</Text>
          </div>
          <div>
            <Text size="xs" c="dimmed" tt="uppercase">
              Agreed fee
            </Text>
            <Text fw={700} fz={20}>
              ${fee} {booking.currency ?? 'USD'}
            </Text>
          </div>
          {booking.podConfirmationCode ? (
            <div>
              <Text size="xs" c="dimmed" tt="uppercase">
                POD code
              </Text>
              <Text fw={600}>{booking.podConfirmationCode}</Text>
            </div>
          ) : null}
        </SimpleGrid>
      </Paper>

      <Paper withBorder p="lg" radius="md">
        <Text fw={700} mb="md">
          Delivery timeline
        </Text>
        <Timeline active={timelineActive} bulletSize={20} lineWidth={2}>
          {steps.map((s) => (
            <Timeline.Item
              key={s.label}
              title={s.label}
              color={s.done ? 'teal' : 'gray'}
            />
          ))}
        </Timeline>
      </Paper>

      {showTravelerActions ? (
        <Paper withBorder p="lg" radius="md">
          <Text fw={700} mb="md">
            Traveler actions
          </Text>
          {booking.status === 'pending_acceptance' ? (
            <Group mb="md">
              <Button onClick={() => void accept()}>Accept</Button>
              <Button variant="default" onClick={() => void decline()}>
                Decline
              </Button>
            </Group>
          ) : null}
          <Group align="flex-end">
            <NumberInput
              label="Counter offer"
              value={counterFee}
              onChange={(v) => setCounterFee(typeof v === 'number' ? v : 0)}
              min={1}
              style={{ flex: 1 }}
            />
            <Button variant="light" onClick={() => void counter()}>
              Send counter
            </Button>
          </Group>
          {booking.status === 'countered' ? (
            <Button mt="md" onClick={() => void acceptCounter()}>
              Accept counter
            </Button>
          ) : null}
        </Paper>
      ) : null}

      <Button variant="subtle" onClick={() => navigate('/app/bookings')}>
        ← Back to My Bookings
      </Button>
    </Stack>
  );
}

export function BookingReceiptPage() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const id = bookingIdFromLoc(location, sp);
  const { data: b, isLoading } = useApi(
    () => (id ? bookingsService.getById(id) : Promise.resolve(null)),
    [id],
  );

  if (!id) return <Text>Missing booking</Text>;
  if (isLoading) return <Skeleton height={180} />;
  if (!b) return <Text c="dimmed">Booking not found.</Text>;

  return (
    <Stack>
      <Title order={2}>Receipt {b.bookingRef}</Title>
      <Text>Agreed fee: {b.agreedFee ?? b.offeredFee}</Text>
      <Text>Commission: {b.platformCommission ?? '—'}</Text>
      <Text>Traveler payout: {b.travelerPayout ?? '—'}</Text>
    </Stack>
  );
}

function BookingListCard({
  booking,
  onOpen,
  onChat,
}: {
  booking: Booking;
  onOpen: () => void;
  onChat: () => void;
}) {
  const bookingId = normalizeMongoId(booking._id);
  const itemName = bookingItemName(booking);
  const route = bookingRouteLabel(booking);
  const requester = bookingPartyName(booking.requesterId, 'Requester');
  const traveler = bookingPartyName(booking.travelerId, 'Traveler');

  return (
    <Paper key={bookingId} p="md" withBorder>
      <Group justify="space-between" wrap="wrap">
        <div>
          <Text fw={700}>{booking.bookingRef}</Text>
          <Text fz={13} c="dimmed">
            {itemName}
            {route ? ` · ${route}` : ''}
          </Text>
          <Text fz={12} c="dimmed" mt={4}>
            {requester} · {traveler}
          </Text>
          <Badge mt="xs">{booking.status}</Badge>
        </div>
        <Group gap="xs">
          <Button
            variant="subtle"
            size="xs"
            leftSection={<IconMessage size={14} />}
            onClick={onChat}
          >
            Chat
          </Button>
          <Button size="xs" onClick={onOpen}>
            Open
          </Button>
        </Group>
      </Group>
      <Progress
        value={
          {
            pending_acceptance: 20,
            countered: 35,
            confirmed: 45,
            paid: 55,
            in_transit: 70,
            delivered: 85,
            completed: 100,
            cancelled: 0,
            disputed: 50,
          }[booking.status] ?? 10
        }
        mt="sm"
      />
    </Paper>
  );
}

export function BookingsListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const userId = resolveUserId(user);
  const authReady = isAuthenticated && !isRestoring && !!userId;
  const [role, setRole] = useState<'traveler' | 'requester' | 'all'>('all');
  const [statusTab, setStatusTab] = useState<string>('all');
  const { page, limit, setPage } = usePagination(10);

  const status =
    statusTab === 'all' ? undefined : (statusTab as Booking['status'] | undefined);

  const { data, isFetching, isError, error, refetch } = useQuery({
    queryKey: ['bookings', 'my', role, statusTab, userId, page, limit],
    queryFn: () =>
      bookingsService.getMy({
        role: role === 'all' ? undefined : role,
        status,
        page,
        limit,
      }),
    enabled: authReady,
  });

  const rows = paginatedRows(data);
  const total = paginatedTotal(data);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const showLoading = !authReady || isFetching;

  if (import.meta.env.DEV) {
    console.debug('[BookingsListPage]', {
      authReady,
      userId,
      total,
      rowCount: rows.length,
      role,
      statusTab,
    });
  }

  return (
    <Stack gap="md">
      <Title order={2}>My bookings</Title>
      <Tabs
        value={role}
        onChange={(v) => {
          setRole((v as typeof role) ?? 'all');
          setPage(1);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="all">All roles</Tabs.Tab>
          <Tabs.Tab value="traveler">As traveler</Tabs.Tab>
          <Tabs.Tab value="requester">As requester</Tabs.Tab>
        </Tabs.List>
      </Tabs>
      <Tabs
        value={statusTab}
        onChange={(v) => {
          setStatusTab(v ?? 'all');
          setPage(1);
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="pending_acceptance">Pending</Tabs.Tab>
          <Tabs.Tab value="confirmed">Confirmed</Tabs.Tab>
          <Tabs.Tab value="paid">Paid</Tabs.Tab>
          <Tabs.Tab value="in_transit">In transit</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="disputed">Disputed</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {showLoading ? (
        <Skeleton height={100} />
      ) : isError ? (
        <Stack gap="sm">
          <Text c="dimmed" size="sm">
            {error instanceof Error ? error.message : 'Unable to load bookings.'}
          </Text>
          <Button variant="light" size="xs" onClick={() => void refetch()}>
            Retry
          </Button>
        </Stack>
      ) : rows.length === 0 ? (
        <Text c="dimmed">No bookings found for this filter.</Text>
      ) : (
        rows.map((b) => {
          const bookingId = normalizeMongoId(b._id);
          return (
            <BookingListCard
              key={bookingId}
              booking={b}
              onChat={() =>
                navigate('/app/chat/thread', { state: { bookingId } })
              }
              onOpen={() =>
                navigate(`/app/booking/confirm?bookingId=${encodeURIComponent(bookingId)}`, {
                  state: { bookingId },
                })
              }
            />
          );
        })
      )}
      {total > 0 ? (
        <PageNumbers value={page} onChange={setPage} total={totalPages} />
      ) : null}
    </Stack>
  );
}

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;

function CheckoutPaymentForm({
  clientSecret,
  onPaid,
  disabled,
}: {
  clientSecret: string;
  onPaid: (paymentIntentId: string) => void;
  disabled?: boolean;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!stripe || !elements || disabled) return;
    const card = elements.getElement(CardElement);
    if (!card) {
      notify.error('Card details missing');
      return;
    }
    setBusy(true);
    try {
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card },
      });
      if (error) {
        notify.error(error.message ?? 'Stripe declined the payment');
        return;
      }
      if (paymentIntent?.status === 'succeeded' && paymentIntent.id) {
        onPaid(paymentIntent.id);
      } else {
        notify.error(`Unexpected status: ${paymentIntent?.status ?? 'unknown'}`);
      }
    } catch (e) {
      notify.error(e instanceof ApiRequestError ? e.message : 'Payment failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Stack>
      <div
        style={{
          border: '1px solid var(--mantine-color-gray-4)',
          borderRadius: 8,
          padding: 12,
        }}
      >
        <CardElement options={{ style: { base: { fontSize: '16px' } } }} />
      </div>
      <Button
        loading={busy}
        disabled={!stripe || disabled}
        onClick={() => void submit()}
      >
        Pay with card
      </Button>
    </Stack>
  );
}

const PAID_STATUSES = new Set<Booking['status']>(['paid', 'in_transit', 'delivered', 'completed']);

function isPaidStatus(status: Booking['status']): boolean {
  return PAID_STATUSES.has(status);
}

export function CheckoutPage() {
  const location = useLocation();
  const queryClient = useQueryClient();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = resolveUserId(user);

  const bookingId = bookingIdFromLoc(location, sp);

  const [booking, setBooking] = useState<Booking | null>(null);
  const [bookingLoading, setBookingLoading] = useState(true);
  const [bookingError, setBookingError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState('');
  const [paymentIntentId, setPaymentIntentId] = useState('');
  const [intentError, setIntentError] = useState<string | null>(null);
  const [intentLoading, setIntentLoading] = useState(false);
  const [paymentSucceeded, setPaymentSucceeded] = useState(false);
  const [confirmingPayment, setConfirmingPayment] = useState(false);

  const stripePromise = useMemo(
    () =>
      stripePublishableKey?.trim()
        ? loadStripe(stripePublishableKey.trim())
        : null,
    [],
  );

  useEffect(() => {
    if (!bookingId || !userId) {
      setBookingLoading(false);
      return;
    }

    let cancelled = false;
    setBookingLoading(true);
    setBookingError(null);

    void bookingsService
      .getById(bookingId)
      .then((b) => {
        if (!cancelled) {
          setBooking(b);
          setBookingLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setBooking(null);
          setBookingLoading(false);
          setBookingError(
            e instanceof ApiRequestError ? e.message : 'Failed to load booking',
          );
          notify.error('Failed to load booking');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bookingId, userId]);

  useEffect(() => {
    if (!bookingId || !booking || booking.status !== 'confirmed') {
      setClientSecret('');
      setIntentError(null);
      setIntentLoading(false);
      return;
    }

    let cancelled = false;
    setIntentLoading(true);
    setIntentError(null);

    void paymentsService
      .createIntent(bookingId)
      .then((data) => {
        if (!cancelled) {
          setClientSecret(data.clientSecret);
          setPaymentIntentId(data.paymentIntentId);
          setIntentLoading(false);
        }
      })
      .catch((e) => {
        if (!cancelled) {
          setClientSecret('');
          setIntentLoading(false);
          setIntentError(
            e instanceof ApiRequestError ? e.message : 'Failed to initialize payment',
          );
          notify.error('Failed to initialize payment');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [bookingId, booking?._id, booking?.status]);

  const finalizePaid = useCallback(
    async (latest: Booking) => {
      setBooking(latest);
      setPaymentSucceeded(true);
      await queryClient.invalidateQueries({ queryKey: ['bookings'] });
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
      await queryClient.invalidateQueries({ queryKey: ['booking', bookingId] });
      notify.success('Payment successful!');
    },
    [bookingId, queryClient],
  );

  const pollUntilPaid = useCallback(async (): Promise<Booking | null> => {
    if (!bookingId) return null;
    const maxAttempts = 10;
    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      const latest = await bookingsService.getById(bookingId);
      if (isPaidStatus(latest.status)) {
        return latest;
      }
      await new Promise((r) => setTimeout(r, 1500));
    }
    return null;
  }, [bookingId]);

  const handlePaymentSuccess = useCallback(
    async (intentId: string) => {
      if (!bookingId) return;
      setConfirmingPayment(true);
      try {
        const confirmed = await paymentsService.confirmPayment(intentId);
        if (isPaidStatus(confirmed.status)) {
          await finalizePaid(confirmed);
          return;
        }
        const polled = await pollUntilPaid();
        if (polled) {
          await finalizePaid(polled);
          return;
        }
        notify.error(
          'Payment received by Stripe but booking is still updating. Check My Bookings in a moment.',
        );
        navigate(`/app/booking/confirm?bookingId=${encodeURIComponent(bookingId)}`);
      } catch (e) {
        const polled = await pollUntilPaid();
        if (polled) {
          await finalizePaid(polled);
          return;
        }
        notify.error(
          e instanceof ApiRequestError
            ? e.message
            : 'Could not confirm payment with the server.',
        );
      } finally {
        setConfirmingPayment(false);
      }
    },
    [bookingId, finalizePaid, navigate, pollUntilPaid],
  );

  if (!bookingId) {
    return (
      <Stack gap="md">
        <Title order={2}>Checkout</Title>
        <Text c="dimmed">No booking found. Go to My Bookings.</Text>
        <Button variant="light" onClick={() => navigate('/app/bookings')}>
          My Bookings
        </Button>
      </Stack>
    );
  }

  if (bookingLoading) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="sm">
          <Loader color="teal" />
          <Text c="dimmed">Loading booking…</Text>
        </Stack>
      </Center>
    );
  }

  if (bookingError || !booking) {
    return (
      <Stack gap="md">
        <Title order={2}>Checkout</Title>
        <Text c="red">{bookingError ?? 'Booking not found.'}</Text>
        <Button variant="light" onClick={() => navigate('/app/bookings')}>
          My Bookings
        </Button>
      </Stack>
    );
  }

  const fee = booking.agreedFee ?? booking.offeredFee;

  if (paymentSucceeded || isPaidStatus(booking.status)) {
    const displayBooking = booking;
    return (
      <Container py="xl" maw={600}>
        <Stack align="center" gap="xl">
          <ThemeIcon size={80} radius="xl" color="teal" variant="light">
            <IconCheck size={40} />
          </ThemeIcon>
          <Title order={2} ta="center">
            Payment successful!
          </Title>
          <Text c="dimmed" ta="center">
            Your payment of ${fee} has been processed. The traveler will be notified to
            pick up your item.
          </Text>
          {displayBooking.podConfirmationCode ? (
            <>
              <Text fw={600}>POD code: {displayBooking.podConfirmationCode}</Text>
              <Text size="sm" c="dimmed" ta="center">
                Share this code with the traveler when they deliver your item as proof of
                delivery.
              </Text>
            </>
          ) : null}
          <Group>
            <Button
              color="teal"
              onClick={() =>
                navigate(`/app/tracking/live?bookingId=${encodeURIComponent(bookingId)}`)
              }
            >
              Track delivery
            </Button>
            <Button variant="outline" onClick={() => navigate('/app/bookings')}>
              My bookings
            </Button>
          </Group>
        </Stack>
      </Container>
    );
  }

  if (confirmingPayment) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="sm">
          <Loader color="teal" />
          <Text c="dimmed">Confirming your payment…</Text>
        </Stack>
      </Center>
    );
  }

  const preparingPayment =
    booking.status === 'confirmed' &&
    stripePublishableKey?.trim() &&
    (intentLoading || (!clientSecret && !intentError));

  if (preparingPayment) {
    return (
      <Center h="60vh">
        <Stack align="center" gap="sm">
          <Loader color="teal" />
          <Text c="dimmed">Preparing checkout…</Text>
        </Stack>
      </Center>
    );
  }

  return (
    <Stack>
      <Title order={2}>Checkout</Title>
      <Text>Amount due: ${booking.agreedFee ?? booking.offeredFee}</Text>
      <Text size="sm" c="dimmed">
        Ref {booking.bookingRef}
      </Text>
      {booking.status !== 'confirmed' ? (
        <Text c="dimmed">This booking must be confirmed before you can pay.</Text>
      ) : intentError ? (
        <Text c="red">{intentError}</Text>
      ) : !stripePromise ? (
        <Text c="dimmed">Add VITE_STRIPE_PUBLISHABLE_KEY to enable card checkout.</Text>
      ) : clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutPaymentForm
            clientSecret={clientSecret}
            disabled={confirmingPayment}
            onPaid={(intentId) => {
              void handlePaymentSuccess(intentId || paymentIntentId);
            }}
          />
        </Elements>
      ) : null}
    </Stack>
  );
}

function PageNumbers({
  value,
  onChange,
  total,
}: {
  value: number;
  onChange: (p: number) => void;
  total: number;
}) {
  return (
    <Group justify="center">
      {Array.from({ length: total }, (_, i) => i + 1).map((p) => (
        <Button key={p} size="xs" variant={p === value ? 'filled' : 'default'} onClick={() => onChange(p)}>
          {p}
        </Button>
      ))}
    </Group>
  );
}

export function WalletHistoryPage() {
  const { user } = useAuth();
  const role = user?.accountType === 'requester' ? 'requester' : 'traveler';
  const { data, isLoading } = useApi(
    () => bookingsService.getMy({ role, status: 'completed', limit: 100 }),
    [role],
  );

  const rows = data?.data ?? [];

  return (
    <Stack>
      <Title order={2}>Transaction history</Title>
      {isLoading ? (
        <Skeleton height={100} />
      ) : (
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Ref</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Amount</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {rows.map((b: Booking) => (
              <Table.Tr key={b._id}>
                <Table.Td>{b.bookingRef}</Table.Td>
                <Table.Td>{new Date(b.createdAt).toLocaleDateString()}</Table.Td>
                <Table.Td>
                  {role === 'traveler'
                    ? b.travelerPayout ?? 0
                    : b.agreedFee ?? b.offeredFee}
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
    </Stack>
  );
}

export function PaymentMethodsPage() {
  return (
    <Stack maw={560}>
      <Title order={2}>Payment methods</Title>
      <Alert color="blue" title="Payment methods">
        Card payments are processed securely via Stripe. To update your payment method, use the checkout flow
        when confirming a booking.
      </Alert>
      <TextInput label="Card (disabled)" disabled placeholder="4242…" />
      <Button disabled type="button">
        Save
      </Button>
    </Stack>
  );
}

export function CommunityWalletPage() {
  const { user } = useAuth();
  return (
    <Stack maw={560}>
      <Title order={2}>Community wallet</Title>
      <Paper p="lg" withBorder>
        <Text fz={12} tt="uppercase" fw={700} c={colors.subtleText}>
          Balance (loyalty points)
        </Text>
        <Text fz={36} fw={800}>
          {user?.loyaltyPoints ?? 0}
        </Text>
      </Paper>
      <Alert color="teal" title="Coming soon">
        Adding funds and community rewards redemption will be available in Phase 3.
      </Alert>
      <Button disabled>Add funds</Button>
    </Stack>
  );
}
