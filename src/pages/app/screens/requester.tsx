import {
  ActionIcon,
  Affix,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Timeline,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconBasket, IconMapPin, IconPackage, IconPlus } from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { DeliveryRequest, Trip } from '../../../api/types';
import { ApiRequestError } from '../../../api/client';
import { bookingsService } from '../../../api/services/bookings.service';
import type { CreateRequestData } from '../../../api/services/requests.service';
import { requestsService } from '../../../api/services/requests.service';
import { tripsService } from '../../../api/services/trips.service';
import { useApi } from '../../../hooks/useApi';
import { usePagination } from '../../../hooks/usePagination';
import { notify } from '../../../utils/notify';
import { colors, requesterUi as RQ } from '../../../theme';
import { ShellCard } from './shared';

function OrderSummaryPanel({
  variant,
  title,
  lines,
  estimate,
}: {
  variant: 'standard' | 'community';
  title: string;
  lines: { label: string; value: string }[];
  estimate: string;
}) {
  const headerBg = variant === 'standard' ? RQ.standardBlue : RQ.communityMint;
  return (
    <Paper radius="md" withBorder shadow="sm" style={{ overflow: 'hidden' }}>
      <Box py="sm" px="md" style={{ background: headerBg }}>
        <Text fw={700} c="white" fz={14}>
          {title}
        </Text>
      </Box>
      <Stack gap="xs" p="md">
        {lines.map((l) => (
          <Group key={l.label} justify="space-between">
            <Text fz={13} c={colors.mutedText}>
              {l.label}
            </Text>
            <Text fz={13} fw={600}>
              {l.value}
            </Text>
          </Group>
        ))}
        <Divider />
        <Group justify="space-between">
          <Text fw={700}>Estimated total</Text>
          <Text fw={800} fz={18} c={headerBg}>
            {estimate}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}

export function RequesterSelectTypePage() {
  const [kind, setKind] = useState<'standard' | 'community'>('standard');

  const nextPath =
    kind === 'standard' ? '/app/requester/delivery/new' : '/app/requester/support/new';

  return (
    <Box
      style={{
        background: RQ.pageGray,
        margin: 'calc(-1 * var(--mantine-spacing-md))',
        padding: 'var(--mantine-spacing-xl) var(--mantine-spacing-md)',
        minHeight: 'calc(100vh - 120px)',
      }}
    >
      <Paper maw={720} mx="auto" p={{ base: 'lg', sm: 'xl' }} radius="lg" shadow="md" withBorder={false}>
        <Title order={2} ta="center" fz={24} fw={700} c={colors.navyDeep}>
          What kind of delivery do you need?
        </Title>
        <Text ta="center" fz={14} c={colors.mutedText} mt="sm" mb="xl">
          Choose the option that best describes your shipment.
        </Text>

        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
          <UnstyledButton onClick={() => setKind('standard')}>
            <Paper
              radius="md"
              p="xl"
              withBorder
              h="100%"
              style={{
                borderColor: kind === 'standard' ? RQ.standardBlue : undefined,
                borderWidth: kind === 'standard' ? 2 : 1,
                background:
                  kind === 'standard' ? `color-mix(in srgb, ${RQ.standardBlue} 10%, white)` : undefined,
              }}
            >
              <Box
                mb="md"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: `color-mix(in srgb, ${RQ.standardBlue} 18%, white)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconPackage size={30} color={RQ.standardBlue} stroke={1.5} />
              </Box>
              <Text fw={700} fz={17} c={RQ.standardBlue}>
                Standard delivery
              </Text>
              <Text fz={13} c={colors.mutedText} mt={8}>
                For items like clothes, electronics, etc.
              </Text>
            </Paper>
          </UnstyledButton>

          <UnstyledButton onClick={() => setKind('community')}>
            <Paper
              radius="md"
              p="xl"
              withBorder
              h="100%"
              style={{
                borderColor: kind === 'community' ? RQ.communityMint : undefined,
                borderWidth: kind === 'community' ? 2 : 1,
                background:
                  kind === 'community'
                    ? `color-mix(in srgb, ${RQ.communityMint} 12%, white)`
                    : undefined,
              }}
            >
              <Box
                mb="md"
                style={{
                  width: 56,
                  height: 56,
                  borderRadius: 12,
                  background: `color-mix(in srgb, ${RQ.communityMint} 22%, white)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <IconBasket size={30} color={RQ.communityMint} stroke={1.5} />
              </Box>
              <Text fw={700} fz={17} c={RQ.communityMint}>
                Community support
              </Text>
              <Text fz={13} c={colors.mutedText} mt={8}>
                For groceries, medicine, etc.
              </Text>
            </Paper>
          </UnstyledButton>
        </SimpleGrid>

        <Button
          component={Link}
          to={nextPath}
          fullWidth
          mt="xl"
          size="md"
          radius="md"
          styles={{ root: { background: RQ.standardBlue } }}
        >
          Continue
        </Button>
      </Paper>
    </Box>
  );
}

export function RequesterPostSupportPage() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      itemName: '',
      itemDescription: '',
      origin: '',
      destination: '',
      deliveryDeadline: '',
      budget: 0,
      beneficiaryName: '',
      beneficiaryType: '' as '' | 'elderly' | 'limited_mobility' | 'essential_care' | 'community' | 'urgent',
      paymentType: 'reduced' as 'full' | 'reduced' | 'sponsored' | 'volunteer',
      supportingNotes: '',
    },
    validate: {
      itemName: (v) => (v.trim().length ? null : 'Required'),
      itemDescription: (v) => (v.trim().length ? null : 'Required'),
      origin: (v) => (v.trim().length ? null : 'Required'),
      destination: (v) => (v.trim().length ? null : 'Required'),
      deliveryDeadline: (v) => (v ? null : 'Required'),
    },
  });

  const submit = async (values: typeof form.values) => {
    try {
      const body: CreateRequestData = {
        type: 'support',
        itemName: values.itemName.trim(),
        itemDescription: values.itemDescription.trim(),
        itemCategory: 'other',
        itemSize: 'medium',
        origin: values.origin.trim(),
        destination: values.destination.trim(),
        deliveryDeadline: new Date(values.deliveryDeadline).toISOString(),
        budget: values.budget > 0 ? values.budget : undefined,
        currency: 'USD',
        paymentType: values.paymentType,
        beneficiaryName: values.beneficiaryName.trim() || undefined,
        beneficiaryType: values.beneficiaryType || undefined,
        urgencyLevel: 'medium',
        supportingNotes: values.supportingNotes.trim() || undefined,
      };
      await requestsService.create(body);
      notify.success('Support request posted');
      navigate('/app/requester/requests');
    } catch (e) {
      notify.error(e instanceof ApiRequestError ? e.message : 'Could not create request');
    }
  };

  const estimate =
    form.values.budget > 0
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(form.values.budget)
      : 'Set budget';

  const summaryLines = [
    { label: 'Pickup area', value: form.values.origin || '—' },
    { label: 'Drop-off', value: form.values.destination || '—' },
    { label: 'Deadline', value: form.values.deliveryDeadline || '—' },
  ];

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Post support request
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Request essential deliveries from verified travelers.
        </Text>
      </Box>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper radius="md" p="lg" withBorder shadow="xs" component="form" onSubmit={form.onSubmit(submit)}>
            <Stack gap="md">
              <TextInput label="Item name" {...form.getInputProps('itemName')} />
              <Textarea label="Description" minRows={2} {...form.getInputProps('itemDescription')} />
              <TextInput label="Pickup / origin" leftSection={<IconMapPin size={16} />} {...form.getInputProps('origin')} />
              <TextInput label="Drop-off / destination" leftSection={<IconMapPin size={16} />} {...form.getInputProps('destination')} />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput label="Deliver by (date)" type="date" {...form.getInputProps('deliveryDeadline')} />
                <NumberInput label="Budget (USD)" min={0} {...form.getInputProps('budget')} />
              </SimpleGrid>
              <Select
                label="Payment type"
                data={[
                  { value: 'reduced', label: 'Reduced fee' },
                  { value: 'full', label: 'Full fee' },
                  { value: 'sponsored', label: 'Sponsored' },
                  { value: 'volunteer', label: 'Volunteer' },
                ]}
                {...form.getInputProps('paymentType')}
              />
              <TextInput label="Beneficiary name (optional)" {...form.getInputProps('beneficiaryName')} />
              <Select
                label="Beneficiary type"
                clearable
                data={[
                  { value: 'elderly', label: 'Elderly' },
                  { value: 'limited_mobility', label: 'Limited mobility' },
                  { value: 'essential_care', label: 'Essential care' },
                  { value: 'community', label: 'Community' },
                  { value: 'urgent', label: 'Urgent' },
                ]}
                {...form.getInputProps('beneficiaryType')}
              />
              <Textarea label="Supporting notes" {...form.getInputProps('supportingNotes')} />
              <Button type="submit" styles={{ root: { background: RQ.communityMint } }}>
                Submit request
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <OrderSummaryPanel variant="community" title="Live summary" lines={summaryLines} estimate={estimate} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function RequesterPostDeliveryPage() {
  const navigate = useNavigate();
  const form = useForm({
    initialValues: {
      itemName: '',
      itemDescription: '',
      itemCategory: 'electronics' as CreateRequestData['itemCategory'],
      itemSize: 'medium' as CreateRequestData['itemSize'],
      origin: '',
      destination: '',
      deliveryDeadline: '',
      budget: 0,
      urgencyLevel: 'medium' as NonNullable<CreateRequestData['urgencyLevel']>,
    },
    validate: {
      itemName: (v) => (v.trim().length ? null : 'Required'),
      itemDescription: (v) => (v.trim().length ? null : 'Required'),
      origin: (v) => (v.trim().length ? null : 'Required'),
      destination: (v) => (v.trim().length ? null : 'Required'),
      deliveryDeadline: (v) => (v ? null : 'Required'),
    },
  });

  const submit = async (values: typeof form.values) => {
    try {
      const body: CreateRequestData = {
        type: 'standard',
        itemName: values.itemName.trim(),
        itemDescription: values.itemDescription.trim(),
        itemCategory: values.itemCategory,
        itemSize: values.itemSize,
        origin: values.origin.trim(),
        destination: values.destination.trim(),
        deliveryDeadline: new Date(values.deliveryDeadline).toISOString(),
        budget: values.budget > 0 ? values.budget : undefined,
        currency: 'USD',
        urgencyLevel: values.urgencyLevel,
      };
      await requestsService.create(body);
      notify.success('Request posted');
      navigate('/app/requester/requests');
    } catch (e) {
      notify.error(e instanceof ApiRequestError ? e.message : 'Could not create request');
    }
  };

  const estimate =
    form.values.budget > 0
      ? new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(form.values.budget)
      : '—';

  const summaryLines = [
    { label: 'Item', value: form.values.itemName || '—' },
    { label: 'Route', value: `${form.values.origin || '—'} → ${form.values.destination || '—'}` },
    { label: 'Size', value: form.values.itemSize },
  ];

  return (
    <Stack gap="lg" pb={48}>
      <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
        Post standard request
      </Title>
      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper radius="md" p="lg" withBorder component="form" onSubmit={form.onSubmit(submit)}>
            <Stack gap="md">
              <TextInput label="Item name" {...form.getInputProps('itemName')} />
              <Textarea label="Description" {...form.getInputProps('itemDescription')} />
              <Select
                label="Category"
                data={[
                  { value: 'documents', label: 'Documents' },
                  { value: 'electronics', label: 'Electronics' },
                  { value: 'clothing', label: 'Clothing' },
                  { value: 'food', label: 'Food' },
                  { value: 'gifts', label: 'Gifts' },
                  { value: 'other', label: 'Other' },
                ]}
                {...form.getInputProps('itemCategory')}
              />
              <Select
                label="Size"
                data={[
                  { value: 'small', label: 'Small' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'large', label: 'Large' },
                ]}
                {...form.getInputProps('itemSize')}
              />
              <TextInput label="Origin" {...form.getInputProps('origin')} />
              <TextInput label="Destination" {...form.getInputProps('destination')} />
              <TextInput label="Deliver by" type="date" {...form.getInputProps('deliveryDeadline')} />
              <NumberInput label="Budget (USD)" min={0} {...form.getInputProps('budget')} />
              <Select
                label="Urgency"
                data={[
                  { value: 'low', label: 'Low' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'high', label: 'High' },
                  { value: 'critical', label: 'Critical' },
                ]}
                {...form.getInputProps('urgencyLevel')}
              />
              <Button type="submit" styles={{ root: { background: RQ.standardBlue } }}>
                Submit request
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <OrderSummaryPanel variant="standard" title="Summary" lines={summaryLines} estimate={estimate} />
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function RequesterReviewRequestPage() {
  return (
    <Stack>
      <Text>You review requests on the detail page after posting.</Text>
      <Button component={Link} to="/app/requester/requests">
        Go to my requests
      </Button>
    </Stack>
  );
}

function statusTab(s: string): DeliveryRequest['status'] | undefined {
  if (s === 'all') return undefined;
  return s as DeliveryRequest['status'];
}

export function RequesterRequestsListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('all');
  const { page, limit, setPage } = usePagination(10);

  const st = statusTab(tab);

  const { data, isLoading } = useApi(
    () =>
      requestsService.getMy({
        status: st,
        page,
        limit,
      }),
    [tab, page, limit],
  );

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  return (
    <Stack gap="lg" pb={48}>
      <Title order={2}>My requests</Title>
      <Tabs value={tab} onChange={(v) => { setTab(v ?? 'all'); setPage(1); }}>
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="matched">Matched</Tabs.Tab>
          <Tabs.Tab value="in_transit">In transit</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {isLoading ? (
        <Skeleton height={100} />
      ) : rows.length === 0 ? (
        <Text c="dimmed">No requests yet.</Text>
      ) : (
        <Stack gap="sm">
          {rows.map((r: DeliveryRequest) => (
            <Paper key={r._id} p="md" withBorder>
              <Group justify="space-between">
                <div>
                  <Text fw={700}>{r.itemName}</Text>
                  <Text fz={13} c="dimmed">
                    {r.origin} → {r.destination}
                  </Text>
                </div>
                <Badge>{r.status}</Badge>
                <Button
                  size="xs"
                  variant="light"
                  onClick={() =>
                    navigate('/app/requester/requests/detail', { state: { requestId: r._id } })
                  }
                >
                  Details
                </Button>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      <Pagination value={page} onChange={setPage} total={totalPages} />
    </Stack>
  );
}

function requestIdFromLoc(location: ReturnType<typeof useLocation>, sp: URLSearchParams): string | null {
  const st = location.state as { requestId?: string } | null;
  if (st?.requestId) return st.requestId;
  return sp.get('requestId');
}

export function RequesterRequestDetailPage() {
  const location = useLocation();
  const [sp] = useSearchParams();
  const requestId = requestIdFromLoc(location, sp);

  const { data: req, isLoading } = useApi(
    () => (requestId ? requestsService.getById(requestId) : Promise.resolve(null)),
    [requestId],
  );

  const { data: bookings } = useApi(
    () => bookingsService.getMy({ role: 'requester', limit: 100 }),
    [requestId],
  );

  const booking = useMemo(() => {
    if (!requestId) return null;
    return (bookings?.data ?? []).find((b) => {
      const rid =
        typeof b.requestId === 'object' && b.requestId && '_id' in b.requestId
          ? String((b.requestId as DeliveryRequest)._id)
          : String(b.requestId);
      return rid === requestId;
    });
  }, [bookings, requestId]);

  if (!requestId) return <Text>Missing request.</Text>;
  if (isLoading || !req) return <Skeleton height={160} />;

  const steps = [
    { label: 'Posted', done: true },
    { label: 'Matched', done: ['matched', 'confirmed', 'paid', 'in_transit', 'delivered', 'completed'].includes(req.status) },
    { label: 'In transit', done: ['in_transit', 'delivered', 'completed'].includes(req.status) },
    { label: 'Completed', done: req.status === 'completed' },
  ];

  return (
    <Stack gap="lg">
      <Title order={2}>{req.itemName}</Title>
      <Badge>{req.status}</Badge>
      <Text>
        {req.origin} → {req.destination}
      </Text>

      <Timeline active={steps.filter((s) => s.done).length - 1} bulletSize={24} lineWidth={2}>
        {steps.map((s) => (
          <Timeline.Item key={s.label} title={s.label}>
            <Text c="dimmed" fz="sm" />
          </Timeline.Item>
        ))}
      </Timeline>

      {booking ? (
        <ShellCard>
          <Text fw={700}>Booking {booking.bookingRef}</Text>
          <Text fz={13}>Status: {booking.status}</Text>
          <Button component={Link} to="/app/tracking/live" state={{ bookingId: booking._id }}>
            Track
          </Button>
        </ShellCard>
      ) : null}
    </Stack>
  );
}

export function RequesterEditRequestPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const requestId = requestIdFromLoc(location, sp);

  const { data: req, isLoading } = useApi(
    () => (requestId ? requestsService.getById(requestId) : Promise.resolve(null)),
    [requestId],
  );

  const form = useForm({
    initialValues: {
      itemName: '',
      itemDescription: '',
      origin: '',
      destination: '',
      deliveryDeadline: '',
    },
  });

  useEffect(() => {
    if (req) {
      form.setValues({
        itemName: req.itemName,
        itemDescription: req.itemDescription,
        origin: req.origin,
        destination: req.destination,
        deliveryDeadline: req.deliveryDeadline.slice(0, 10),
      });
    }
  }, [req]);

  const save = async () => {
    if (!requestId) return;
    try {
      await requestsService.update(requestId, {
        itemName: form.values.itemName,
        itemDescription: form.values.itemDescription,
        origin: form.values.origin,
        destination: form.values.destination,
        deliveryDeadline: new Date(form.values.deliveryDeadline).toISOString(),
      });
      notify.success('Updated');
      navigate('/app/requester/requests/detail', { state: { requestId } });
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  if (!requestId) return <Text>Missing request id</Text>;
  if (isLoading || !req) return <Skeleton height={120} />;

  return (
    <Stack>
      <Title order={2}>Edit request</Title>
      <TextInput label="Item name" {...form.getInputProps('itemName')} />
      <Textarea label="Description" {...form.getInputProps('itemDescription')} />
      <TextInput label="Origin" {...form.getInputProps('origin')} />
      <TextInput label="Destination" {...form.getInputProps('destination')} />
      <TextInput label="Deadline" type="date" {...form.getInputProps('deliveryDeadline')} />
      <Button onClick={() => void save()}>Save</Button>
    </Stack>
  );
}

export function RequesterBrowseTripsPage() {
  const navigate = useNavigate();
  const { page, limit, setPage } = usePagination(10);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [socialImpact, setSocialImpact] = useState(false);

  const params = useMemo(
    () => ({
      origin: origin.trim() || undefined,
      destination: destination.trim() || undefined,
      socialImpact: socialImpact || undefined,
      page,
      limit,
    }),
    [origin, destination, socialImpact, page, limit],
  );

  const { data, isLoading, refetch } = useApi(() => tripsService.browse(params), [
    origin,
    destination,
    socialImpact,
    page,
    limit,
  ]);

  const { data: myRequests } = useApi(() => requestsService.getMy({ status: 'pending', limit: 20 }), []);

  const [modal, setModal] = useState<{ trip: Trip } | null>(null);
  const [pickReq, setPickReq] = useState('');
  const [fee, setFee] = useState(40);

  const match = async () => {
    if (!modal || !pickReq) {
      notify.error('Select one of your pending requests');
      return;
    }
    try {
      await bookingsService.match({
        requestId: pickReq,
        tripId: modal.trip._id,
        offeredFee: fee,
      });
      notify.success('Booking created');
      setModal(null);
      void refetch();
      navigate('/app/bookings');
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Match failed');
    }
  };

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  const pendingRequests = (myRequests?.data ?? []).filter((r) => r.status === 'pending');

  return (
    <Stack gap="md" pb={48}>
      <Title order={2}>Browse trips</Title>
      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="sm">
        <TextInput label="Origin" value={origin} onChange={(e) => setOrigin(e.currentTarget.value)} />
        <TextInput label="Destination" value={destination} onChange={(e) => setDestination(e.currentTarget.value)} />
        <Select
          label="Social impact"
          data={[
            { value: 'false', label: 'Any' },
            { value: 'true', label: 'Community-friendly only' },
          ]}
          value={socialImpact ? 'true' : 'false'}
          onChange={(v) => setSocialImpact(v === 'true')}
        />
      </SimpleGrid>
      <Button onClick={() => { setPage(1); void refetch(); }}>Apply filters</Button>

      {isLoading ? (
        <Skeleton height={120} />
      ) : (
        rows.map((t: Trip) => (
          <Paper key={t._id} p="md" withBorder>
            <Group justify="space-between">
              <div>
                <Text fw={700}>
                  {t.origin} → {t.destination}
                </Text>
                <Text fz={13} c="dimmed">
                  Departs {new Date(t.departureDate).toLocaleDateString()}
                </Text>
              </div>
              <Button size="xs" onClick={() => setModal({ trip: t })}>
                Send request
              </Button>
            </Group>
          </Paper>
        ))
      )}

      <Pagination value={page} onChange={setPage} total={totalPages} />

      <Modal opened={!!modal} onClose={() => setModal(null)} title="Match to your request">
        <Stack gap="sm">
          <Select
            label="Your pending request"
            data={pendingRequests.map((r) => ({ value: r._id, label: r.itemName }))}
            value={pickReq}
            onChange={(v) => setPickReq(v ?? '')}
          />
          <NumberInput label="Offered fee" value={fee} onChange={(v) => setFee(Number(v) || 0)} />
          <Button onClick={() => void match()}>Confirm match</Button>
        </Stack>
      </Modal>

      <Affix position={{ bottom: 24, right: 24 }}>
        <ActionIcon component={Link} to="/app/requester/select-type" size={48} radius="xl" color="blue">
          <IconPlus />
        </ActionIcon>
      </Affix>
    </Stack>
  );
}

export function RequesterMatchDetailPage() {
  return (
    <Stack>
      <Title order={2}>Match detail</Title>
      <Text fz={14} c="dimmed">
        Open bookings for live status.
      </Text>
      <Button component={Link} to="/app/bookings">
        My bookings
      </Button>
    </Stack>
  );
}
