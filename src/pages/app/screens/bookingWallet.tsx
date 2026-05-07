import {
  Alert,
  Badge,
  Button,
  Group,
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
  Title,
} from '@mantine/core';
import { Elements, CardElement, useElements, useStripe } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Booking } from '../../../api/types';
import { ApiRequestError } from '../../../api/client';
import { bookingsService } from '../../../api/services/bookings.service';
import { paymentsService } from '../../../api/services/payments.service';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { usePagination } from '../../../hooks/usePagination';
import { notify } from '../../../utils/notify';
import { colors } from '../../../theme';

function bookingIdFromLoc(location: ReturnType<typeof useLocation>, sp: URLSearchParams): string | null {
  const st = location.state as { bookingId?: string } | null;
  if (st?.bookingId) return st.bookingId;
  return sp.get('bookingId');
}

export function BookingConfirmPage() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const id = bookingIdFromLoc(location, sp);
  const [counterFee, setCounterFee] = useState<number>(0);

  const { data: b, isLoading, refetch } = useApi(
    () => (id ? bookingsService.getById(id) : Promise.resolve(null)),
    [id],
  );

  const accept = async () => {
    if (!id) return;
    try {
      await bookingsService.accept(id);
      notify.success('Accepted');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const decline = async () => {
    if (!id) return;
    try {
      await bookingsService.decline(id);
      notify.success('Declined');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const counter = async () => {
    if (!id || counterFee <= 0) return;
    try {
      await bookingsService.counter(id, Number(counterFee));
      notify.success('Counter sent');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const acceptCounter = async () => {
    if (!id) return;
    try {
      await bookingsService.acceptCounter(id);
      notify.success('Counter accepted');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  if (!id) return <Text>Missing booking id</Text>;
  if (isLoading || !b) return <Skeleton height={200} />;

  const req = typeof b.requestId === 'object' ? b.requestId : null;

  return (
    <Stack gap="md">
      <Title order={2}>Booking {b.bookingRef}</Title>
      <Text fz={14} c="dimmed">
        Status: {b.status}
      </Text>
      {req && typeof req === 'object' && 'itemName' in req ? (
        <Text fw={600}>{String(req.itemName)}</Text>
      ) : null}
      <SimpleGrid cols={2}>
        <Text>Offered fee</Text>
        <Text fw={700}>{b.offeredFee}</Text>
        {b.counterFee != null ? (
          <>
            <Text>Counter</Text>
            <Text fw={700}>{b.counterFee}</Text>
          </>
        ) : null}
      </SimpleGrid>

      <Group>
        <Button onClick={() => void accept()}>Accept</Button>
        <Button variant="default" onClick={() => void decline()}>
          Decline
        </Button>
      </Group>

      <Group align="flex-end">
        <NumberInput
          label="Counter offer"
          value={counterFee}
          onChange={(v) => setCounterFee(typeof v === 'number' ? v : 0)}
          min={1}
        />
        <Button variant="light" onClick={() => void counter()}>
          Send counter
        </Button>
      </Group>

      {b.status === 'countered' ? (
        <Button onClick={() => void acceptCounter()}>Accept counter</Button>
      ) : null}
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
  if (isLoading || !b) return <Skeleton height={180} />;

  return (
    <Stack>
      <Title order={2}>Receipt {b.bookingRef}</Title>
      <Text>Agreed fee: {b.agreedFee ?? b.offeredFee}</Text>
      <Text>Commission: {b.platformCommission ?? '—'}</Text>
      <Text>Traveler payout: {b.travelerPayout ?? '—'}</Text>
    </Stack>
  );
}

export function BookingsListPage() {
  const [role, setRole] = useState<'traveler' | 'requester' | 'all'>('all');
  const [statusTab, setStatusTab] = useState<string>('all');
  const { page, limit, setPage } = usePagination(10);

  const status =
    statusTab === 'all' ? undefined : (statusTab as Booking['status'] | undefined);

  const { data, isLoading } = useApi(
    () =>
      bookingsService.getMy({
        role: role === 'all' ? undefined : role,
        status,
        page,
        limit,
      }),
    [role, status, page, limit],
  );

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

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

      {isLoading ? (
        <Skeleton height={100} />
      ) : (
        rows.map((b: Booking) => (
          <Paper key={b._id} p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text fw={700}>{b.bookingRef}</Text>
                <Badge>{b.status}</Badge>
              </div>
              <Button component={Link} to="/app/booking/confirm" state={{ bookingId: b._id }} size="xs">
                Open
              </Button>
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
                }[b.status] ?? 10
              }
              mt="sm"
            />
          </Paper>
        ))
      )}
      <PageNumbers value={page} onChange={setPage} total={totalPages} />
    </Stack>
  );
}

const stripePublishableKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY as
  | string
  | undefined;

function CheckoutPaymentForm({
  clientSecret,
  onPaid,
}: {
  clientSecret: string;
  onPaid: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [busy, setBusy] = useState(false);

  const submit = async () => {
    if (!stripe || !elements) return;
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
      if (paymentIntent?.status === 'succeeded') {
        notify.success('Payment submitted — confirming with server…');
        onPaid();
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
      <Button loading={busy} disabled={!stripe} onClick={() => void submit()}>
        Pay with card
      </Button>
    </Stack>
  );
}

export function CheckoutPage() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const navigate = useNavigate();
  const id = bookingIdFromLoc(location, sp);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [intentError, setIntentError] = useState<string | null>(null);

  const stripePromise = useMemo(
    () =>
      stripePublishableKey?.trim()
        ? loadStripe(stripePublishableKey.trim())
        : null,
    [],
  );

  const { data: b, isLoading, refetch } = useApi(
    () => (id ? bookingsService.getById(id) : Promise.resolve(null)),
    [id],
  );

  useEffect(() => {
    if (!id || !b || b.status !== 'confirmed') {
      setClientSecret(null);
      setIntentError(null);
      return;
    }
    let cancelled = false;
    void (async () => {
      try {
        const res = await paymentsService.createIntent(id);
        if (!cancelled) {
          setClientSecret(res.clientSecret);
          setIntentError(null);
        }
      } catch (e) {
        if (!cancelled) {
          setClientSecret(null);
          setIntentError(
            e instanceof ApiRequestError ? e.message : 'Could not start checkout',
          );
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [id, b?.status, b?._id]);

  const waitForPaid = useCallback(async () => {
    if (!id) return;
    const deadline = Date.now() + 15_000;
    while (Date.now() < deadline) {
      const booking = await bookingsService.getById(id);
      if (booking.status === 'paid') {
        notify.success('Payment confirmed');
        navigate('/app/tracking/live', { state: { bookingId: id } });
        return;
      }
      await new Promise((r) => setTimeout(r, 2000));
    }
    notify.error('Booking is not paid yet — refresh in a moment or check your email.');
  }, [id, navigate]);

  if (!id) return <Text>Missing booking</Text>;
  if (isLoading || !b) return <Skeleton height={120} />;

  return (
    <Stack>
      <Title order={2}>Checkout</Title>
      <Text>Amount due: {b.agreedFee ?? b.offeredFee}</Text>
      <Alert color="gray" title="Stripe.js">
        Card payments use <code>@stripe/stripe-js</code> and <code>@stripe/react-stripe-js</code>{' '}
        (already added to this project). Set <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in{' '}
        <code>.env</code> for test mode.
      </Alert>
      {b.status !== 'confirmed' ? (
        <Text c="dimmed">This booking must be confirmed before you can pay.</Text>
      ) : intentError ? (
        <Text c="red">{intentError}</Text>
      ) : !stripePromise ? (
        <Text c="dimmed">Add VITE_STRIPE_PUBLISHABLE_KEY to enable card checkout.</Text>
      ) : !clientSecret ? (
        <Text c="dimmed">Preparing secure checkout…</Text>
      ) : (
        <Elements stripe={stripePromise}>
          <CheckoutPaymentForm
            clientSecret={clientSecret}
            onPaid={() => {
              refetch();
              void waitForPaid();
            }}
          />
        </Elements>
      )}
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
      <Alert color="blue" title="Coming soon">
        Payment provider integration is not enabled yet. Card and bank linking will appear here in a future
        release.
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
