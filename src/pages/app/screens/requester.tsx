import {
  ActionIcon,
  Affix,
  Anchor,
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
import {
  IconBasket,
  IconCalendar,
  IconCreditCard,
  IconMapPin,
  IconMessage,
  IconPackage,
  IconPlus,
} from '@tabler/icons-react';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Booking, DeliveryRequest, Trip } from '../../../api/types';
import { ApiRequestError } from '../../../api/client';
import {
  bookingPartyId,
  findBookingForRequest,
  normalizeMongoId,
  paginatedRows,
  paginatedTotal,
} from '../../../api/booking-utils';
import { bookingsService } from '../../../api/services/bookings.service';
import type { CreateRequestData } from '../../../api/services/requests.service';
import { requestsService } from '../../../api/services/requests.service';
import { tripsService } from '../../../api/services/trips.service';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import { useApi } from '../../../hooks/useApi';
import { usePagination } from '../../../hooks/usePagination';
import { notify } from '../../../utils/notify';
import {
  emptyPaginated,
  FRIENDLY_LOAD_ERROR,
  resolveUserId,
} from '../../../utils/screen-data';
import { colors, glassTabsStyles, requesterUi as RQ } from '../../../theme';
import { PageHeader } from '../../../components/PageHeader';

function requestDocId(r: DeliveryRequest): string {
  return r._id ?? (r as DeliveryRequest & { id?: string }).id ?? '';
}

function bookingDocId(b: Booking): string {
  return b._id ?? (b as Booking & { id?: string }).id ?? '';
}

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
  const queryClient = useQueryClient();
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
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
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
  const queryClient = useQueryClient();
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
      await queryClient.invalidateQueries({ queryKey: ['requests'] });
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

function requestStatusColor(status: DeliveryRequest['status']): string {
  if (status === 'matched' || status === 'confirmed') return 'teal';
  if (status === 'in_transit') return 'blue';
  if (status === 'completed') return 'green';
  if (status === 'cancelled') return 'red';
  return 'gray';
}

function formatRequestDate(iso: string | undefined): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export function RequesterRequestsListPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const userId = resolveUserId(user);
  const authReady = isAuthenticated && !isRestoring && !!userId;
  const [tab, setTab] = useState('all');
  const { page, limit, setPage } = usePagination(10);

  const st = statusTab(tab);

  const { data, isFetching, error, refetch } = useQuery({
    queryKey: ['requests', 'my', tab, userId, page, limit],
    queryFn: () =>
      requestsService.getMy({
        status: st,
        page,
        limit,
      }),
    enabled: authReady,
  });

  const rows = paginatedRows(data);
  const total = paginatedTotal(data);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const showLoading = !authReady || isFetching;

  return (
    <Stack gap="lg" pb={48}>
      <PageHeader section="Requester" title="My requests" />

      <Tabs
        value={tab}
        onChange={(v) => {
          setTab(v ?? 'all');
          setPage(1);
        }}
        styles={glassTabsStyles}
      >
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="matched">Matched</Tabs.Tab>
          <Tabs.Tab value="in_transit">In transit</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {showLoading ? (
        <Stack gap="sm">
          <Skeleton height={88} radius="xl" />
          <Skeleton height={88} radius="xl" />
        </Stack>
      ) : error ? (
        <Stack gap="sm">
          <Text c={colors.textSecondary} size="sm">
            {FRIENDLY_LOAD_ERROR}
          </Text>
          <Button variant="light" size="xs" radius="xl" onClick={() => void refetch()}>
            Retry
          </Button>
        </Stack>
      ) : rows.length === 0 ? (
        <Paper className="glass-card" p="xl" radius="xl">
          <Stack align="center" py="md" gap="sm">
            <IconPackage size={32} color={colors.subtleText} stroke={1.5} />
            <Text c={colors.subtleText} size="sm">
              No requests yet. Create one to get matched with travelers.
            </Text>
          </Stack>
        </Paper>
      ) : (
        <Stack gap="sm">
          {rows.map((r: DeliveryRequest) => (
            <Paper key={requestDocId(r)} className="glass-card glass-card-hover" p="lg" radius="xl">
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Stack gap={4} style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={700} size="md" c={colors.textPrimary}>
                    {r.itemName}
                  </Text>
                  <Group gap={6}>
                    <IconMapPin size={13} color={colors.subtleText} />
                    <Text size="sm" c={colors.textSecondary}>
                      {r.origin} → {r.destination}
                    </Text>
                  </Group>
                  <Group gap={6} mt={2}>
                    <IconCalendar size={13} color={colors.subtleText} />
                    <Text size="xs" c={colors.subtleText}>
                      Due {formatRequestDate(r.deliveryDeadline)}
                    </Text>
                    {r.budget != null && r.budget > 0 ? (
                      <>
                        <Text size="xs" c={colors.subtleText}>
                          ·
                        </Text>
                        <Text size="xs" c={colors.subtleText}>
                          Budget ${r.budget}
                        </Text>
                      </>
                    ) : null}
                  </Group>
                </Stack>
                <Stack align="flex-end" gap={8}>
                  <Badge
                    radius="xl"
                    size="sm"
                    color={requestStatusColor(r.status)}
                    variant="light"
                    styles={{
                      root: { textTransform: 'uppercase', fontWeight: 700, letterSpacing: '0.05em' },
                    }}
                  >
                    {r.status.replace(/_/g, ' ')}
                  </Badge>
                  <Button
                    size="xs"
                    radius="xl"
                    color="teal"
                    onClick={() => {
                      const rid = requestDocId(r);
                      navigate(`/app/requester/requests/detail?requestId=${encodeURIComponent(rid)}`, {
                        state: { requestId: rid },
                      });
                    }}
                  >
                    Details
                  </Button>
                </Stack>
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
  const fromState = st?.requestId ? normalizeMongoId(st.requestId) : '';
  const fromQuery = sp.get('requestId') ? normalizeMongoId(sp.get('requestId')) : '';
  return fromState || fromQuery || null;
}

export function RequesterRequestDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [sp] = useSearchParams();
  const { user } = useAuth();
  const userId = resolveUserId(user);
  const requestId = requestIdFromLoc(location, sp);

  const { data: req, isLoading, error: reqError } = useApi(
    () => (requestId ? requestsService.getById(requestId) : Promise.resolve(null)),
    [requestId],
  );

  const {
    data: bookingsPage,
    isLoading: bookingsLoading,
  } = useApi(
    () =>
      userId
        ? bookingsService.getMyForRequester(userId, { limit: 100 })
        : Promise.resolve(emptyPaginated<Booking>(100)),
    [userId],
  );

  const linkedBooking = useMemo(() => {
    const target =
      normalizeMongoId(requestId) ||
      (req ? normalizeMongoId(requestDocId(req)) : '');
    if (!target) return null;
    return findBookingForRequest(bookingsPage?.data ?? [], target);
  }, [bookingsPage, requestId, req]);

  if (!requestId) return <Text>Missing request.</Text>;
  if (isLoading) {
    return (
      <Stack gap="sm">
        <Skeleton height={40} />
        <Skeleton height={120} />
      </Stack>
    );
  }
  if (reqError || !req) {
    return (
      <Text c="dimmed" size="sm">
        {reqError ? FRIENDLY_LOAD_ERROR : 'Request not found.'}
      </Text>
    );
  }

  const paidViaBooking =
    linkedBooking != null &&
    ['paid', 'in_transit', 'delivered', 'completed'].includes(linkedBooking.status);

  const steps = [
    { label: 'Posted', done: true },
    {
      label: 'Matched',
      done: ['matched', 'confirmed', 'in_transit', 'delivered', 'completed'].includes(req.status),
    },
    {
      label: 'Confirmed',
      done: ['confirmed', 'in_transit', 'delivered', 'completed'].includes(req.status),
    },
    { label: 'Paid', done: paidViaBooking },
    {
      label: 'In transit',
      done: ['in_transit', 'delivered', 'completed'].includes(req.status),
    },
    { label: 'Delivered', done: ['delivered', 'completed'].includes(req.status) },
    { label: 'Completed', done: req.status === 'completed' },
  ];

  const timelineActive = Math.max(0, steps.filter((s) => s.done).length - 1);

  return (
    <Stack gap="lg">
      <Title order={2}>{req.itemName}</Title>
      <Badge>{req.status}</Badge>
      <Text>
        {req.origin} → {req.destination}
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

      {bookingsLoading ? (
        <Skeleton height={140} mt="xl" />
      ) : linkedBooking ? (
        <Paper withBorder mt="xl" p="lg" radius="md">
          <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
            <Stack gap="xs">
              <Text fw={700} size="lg">
                {linkedBooking.bookingRef}
              </Text>
              <Badge
                color={
                  linkedBooking.status === 'confirmed'
                    ? 'teal'
                    : linkedBooking.status === 'paid'
                      ? 'blue'
                      : linkedBooking.status === 'completed'
                        ? 'green'
                        : 'gray'
                }
                size="md"
              >
                {linkedBooking.status.replace(/_/g, ' ').toUpperCase()}
              </Badge>
              {(linkedBooking.agreedFee ?? linkedBooking.offeredFee) != null && (
                <Text size="sm" c="dimmed">
                  Agreed fee: ${linkedBooking.agreedFee ?? linkedBooking.offeredFee}
                </Text>
              )}
              {linkedBooking.podConfirmationCode ? (
                <Text size="sm" fw={500}>
                  POD Code: {linkedBooking.podConfirmationCode}
                </Text>
              ) : null}
            </Stack>
            <Stack gap="sm">
              {linkedBooking.status === 'confirmed' && (
                <Button
                  color="teal"
                  size="md"
                  leftSection={<IconCreditCard size={16} />}
                  onClick={() =>
                    navigate(
                      `/app/checkout?bookingId=${encodeURIComponent(bookingDocId(linkedBooking))}`,
                      { state: { bookingId: bookingDocId(linkedBooking) } },
                    )
                  }
                >
                  Pay Now — ${linkedBooking.agreedFee ?? linkedBooking.offeredFee}
                </Button>
              )}
              <Button
                variant="outline"
                size="sm"
                leftSection={<IconMessage size={16} />}
                onClick={() =>
                  navigate('/app/chat/thread', {
                    state: {
                      bookingId: bookingDocId(linkedBooking),
                      otherUserId: bookingPartyId(linkedBooking.travelerId),
                    },
                  })
                }
              >
                Message Traveler
              </Button>
              <Button variant="subtle" size="sm" onClick={() => navigate('/app/bookings')}>
                View All Bookings
              </Button>
              {['paid', 'in_transit', 'delivered', 'completed'].includes(linkedBooking.status) && (
                <Button
                  variant="light"
                  size="sm"
                  component={Link}
                  to={`/app/tracking/live?bookingId=${encodeURIComponent(bookingDocId(linkedBooking))}`}
                >
                  Track delivery
                </Button>
              )}
            </Stack>
          </Group>
        </Paper>
      ) : (
        <Paper withBorder mt="xl" p="md" radius="md">
          <Text c="dimmed" size="sm" mb="sm">
            Booking details not loaded yet.
          </Text>
          <Button variant="outline" size="sm" onClick={() => navigate('/app/bookings')}>
            View My Bookings
          </Button>
        </Paper>
      )}
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
      navigate(`/app/requester/requests/detail?requestId=${encodeURIComponent(requestId)}`, {
        state: { requestId },
      });
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

  const { data, isLoading, error: browseError, refetch } = useApi(() => tripsService.browse(params), [
    origin,
    destination,
    socialImpact,
    page,
    limit,
  ]);

  const [modal, setModal] = useState<{ trip: Trip } | null>(null);
  const [pendingRequests, setPendingRequests] = useState<DeliveryRequest[]>([]);
  const [pendingLoading, setPendingLoading] = useState(false);
  const [selectedRequestId, setSelectedRequestId] = useState('');
  const [offeredFee, setOfferedFee] = useState(20);
  const [matchLoading, setMatchLoading] = useState(false);

  const closeMatchModal = () => {
    setModal(null);
    setSelectedRequestId('');
    setPendingRequests([]);
    setOfferedFee(20);
  };

  const openMatchModal = async (trip: Trip) => {
    setModal({ trip });
    setSelectedRequestId('');
    setOfferedFee(20);
    setPendingLoading(true);
    try {
      const result = await requestsService.getMy({ status: 'pending', limit: 50 });
      setPendingRequests(result.data.filter((r) => r.status === 'pending'));
    } catch {
      setPendingRequests([]);
      notify.error('Failed to load your requests');
    } finally {
      setPendingLoading(false);
    }
  };

  const requestOptions = pendingRequests.map((r) => ({
    value: requestDocId(r),
    label: `${r.itemName} — ${r.origin} → ${r.destination}`,
  }));

  const handleConfirmMatch = async () => {
    if (!modal) return;
    if (!selectedRequestId) {
      notify.error('Select one of your pending requests');
      return;
    }
    if (!offeredFee || offeredFee <= 0) {
      notify.error('Enter a valid fee');
      return;
    }
    const tripId = modal.trip._id ?? (modal.trip as Trip & { id?: string }).id;
    if (!tripId) {
      notify.error('Trip is missing an id');
      return;
    }
    setMatchLoading(true);
    try {
      await bookingsService.match({
        requestId: selectedRequestId,
        tripId,
        offeredFee,
      });
      notify.success('Request sent to traveler!');
      closeMatchModal();
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed to send request');
    } finally {
      setMatchLoading(false);
    }
  };

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

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
        <Stack gap="sm">
          <Skeleton height={88} />
          <Skeleton height={88} />
        </Stack>
      ) : browseError ? (
        <Text c="dimmed" size="sm">
          {FRIENDLY_LOAD_ERROR}
        </Text>
      ) : rows.length === 0 ? (
        <Text c="dimmed" size="sm">
          No trips match your filters. Try different origin or destination, or check back later.
        </Text>
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
              <Button size="xs" onClick={() => void openMatchModal(t)}>
                Send request
              </Button>
            </Group>
          </Paper>
        ))
      )}

      <Pagination value={page} onChange={setPage} total={totalPages} />

      <Modal opened={!!modal} onClose={closeMatchModal} title="Match to your request">
        <Stack gap="sm">
          {pendingLoading ? (
            <Skeleton height={36} />
          ) : pendingRequests.length === 0 ? (
            <Text size="sm" c="dimmed">
              You have no pending requests.{' '}
              <Anchor component={Link} to="/app/requester/delivery/new">
                Post a request first.
              </Anchor>
            </Text>
          ) : (
            <Select
              label="Your pending request"
              placeholder="Select a request"
              data={requestOptions}
              value={selectedRequestId}
              onChange={(val) => setSelectedRequestId(val ?? '')}
              required
            />
          )}
          <NumberInput
            label="Offered fee"
            min={1}
            value={offeredFee}
            onChange={(v) => setOfferedFee(Number(v) || 0)}
          />
          <Button
            loading={matchLoading}
            disabled={pendingLoading || pendingRequests.length === 0}
            onClick={() => void handleConfirmMatch()}
          >
            Confirm match
          </Button>
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
