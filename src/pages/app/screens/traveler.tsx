import {
  ActionIcon,
  Affix,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Menu,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Radio,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import type { ReactNode } from 'react';
import { useDisclosure } from '@mantine/hooks';
import {
  IconAlertTriangle,
  IconBriefcase,
  IconBuildingCommunity,
  IconDotsVertical,
  IconHome,
  IconLeaf,
  IconLuggage,
  IconMapPin,
  IconMessage,
  IconPlane,
  IconPlus,
  IconSchool,
  IconSettings,
  IconShieldHeart,
} from '@tabler/icons-react';
import { useForm } from '@mantine/form';
import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import type { Booking, DeliveryRequest, Trip } from '../../../api/types';
import { ApiRequestError } from '../../../api/client';
import { bookingsService } from '../../../api/services/bookings.service';
import type { CreateTripData } from '../../../api/services/trips.service';
import { tripsService } from '../../../api/services/trips.service';
import { requestsService } from '../../../api/services/requests.service';
import { useApi } from '../../../hooks/useApi';
import { usePagination } from '../../../hooks/usePagination';
import { notify } from '../../../utils/notify';
import { colors, marketplaceUi as MU } from '../../../theme';
import { ShellCard, StatusBadge } from './shared';

const TEAL = '#20B2AA';

function gradientBtn() {
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

export type TripDraftForm = {
  origin: string;
  destination: string;
  departureDate: string;
  arrivalDate: string;
  luggageSpace: 'small' | 'medium' | 'large';
  pricingType: 'fixed' | 'negotiable';
  pricePerKg: number;
  notes: string;
};

export type TripSocialState = Pick<
  CreateTripData,
  | 'openToCommunitySupport'
  | 'willingToAssistElderly'
  | 'acceptReducedFee'
  | 'acceptVolunteer'
>;

function SectionCard({
  step,
  title,
  description,
  children,
}: {
  step: number;
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <Paper radius="md" p="lg" withBorder shadow="xs">
      <Group gap="sm" mb="md">
        <Badge variant="light" color="teal" circle>
          {step}
        </Badge>
        <div>
          <Text fw={700} fz={16}>
            {title}
          </Text>
          <Text fz={13} c={colors.mutedText}>
            {description}
          </Text>
        </div>
      </Group>
      {children}
    </Paper>
  );
}

function LuggageToggle({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <Paper
      withBorder
      radius="md"
      p="sm"
      onClick={onClick}
      style={{
        cursor: 'pointer',
        borderColor: selected ? TEAL : undefined,
        background: selected ? 'rgba(32,178,170,0.08)' : undefined,
      }}
    >
      <Group gap={6}>
        <IconLuggage size={label === 'S' ? 18 : label === 'M' ? 22 : 26} />
        <Text fw={600}>{label}</Text>
      </Group>
    </Paper>
  );
}

export function TravelerPostTripPage() {
  const navigate = useNavigate();
  const [lug, setLug] = useState<'small' | 'medium' | 'large'>('medium');

  const form = useForm<TripDraftForm>({
    initialValues: {
      origin: '',
      destination: '',
      departureDate: '',
      arrivalDate: '',
      luggageSpace: 'medium',
      pricingType: 'fixed',
      pricePerKg: 0,
      notes: '',
    },
    validate: {
      origin: (v) => (v.trim().length ? null : 'Required'),
      destination: (v) => (v.trim().length ? null : 'Required'),
      departureDate: (v) => (v ? null : 'Required'),
      arrivalDate: (v) => (v ? null : 'Required'),
      pricePerKg: (v, values) =>
        values.pricingType === 'fixed' && (!v || v <= 0)
          ? 'Enter price per kg for fixed pricing'
          : null,
    },
  });

  const nextStep = () => {
    const vals = form.values;
    const merged = { ...vals, luggageSpace: lug };
    navigate('/app/traveler/social-impact', { state: { draft: merged } });
  };

  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Box maw={560}>
          <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
            Post a new trip
          </Title>
          <Text mt={6} fz={15} c={colors.mutedText}>
            Share your route and spare luggage capacity with senders on Tohdah.
          </Text>
        </Box>
        <Button component={Link} to="/app/traveler/trips" variant="default">
          Cancel
        </Button>
      </Group>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Stack gap="xl">
            <SectionCard
              step={1}
              title="Route details"
              description="Where are you flying from and to?"
            >
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput label="Origin" placeholder="City or airport" {...form.getInputProps('origin')} />
                <TextInput
                  label="Destination"
                  placeholder="City or airport"
                  {...form.getInputProps('destination')}
                />
              </SimpleGrid>
            </SectionCard>

            <SectionCard step={2} title="Travel dates" description="Departure and arrival for this trip.">
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput label="Departure date" type="date" {...form.getInputProps('departureDate')} />
                <TextInput label="Arrival date" type="date" {...form.getInputProps('arrivalDate')} />
              </SimpleGrid>
            </SectionCard>

            <SectionCard
              step={3}
              title="Capacity"
              description="How much space can you offer?"
            >
              <Text fz={13} fw={600} mb={8}>
                Luggage capacity
              </Text>
              <Group gap="sm" mb="md">
                <LuggageToggle label="S" selected={lug === 'small'} onClick={() => setLug('small')} />
                <LuggageToggle label="M" selected={lug === 'medium'} onClick={() => setLug('medium')} />
                <LuggageToggle label="L" selected={lug === 'large'} onClick={() => setLug('large')} />
              </Group>
              <Radio.Group
                label="Pricing"
                {...form.getInputProps('pricingType')}
              >
                <Group mt="xs">
                  <Radio value="fixed" label="Fixed price per kg" />
                  <Radio value="negotiable" label="Negotiable" />
                </Group>
              </Radio.Group>
            </SectionCard>

            <SectionCard step={4} title="Pricing & notes" description="Set your price and optional notes.">
              <NumberInput
                label="Price per kg"
                prefix="$"
                min={0}
                disabled={form.values.pricingType !== 'fixed'}
                {...form.getInputProps('pricePerKg')}
              />
              <Textarea label="Notes" mt="md" minRows={2} {...form.getInputProps('notes')} />
            </SectionCard>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Paper radius="md" p="lg" withBorder pos="sticky" top={24} style={{ top: 24 }}>
            <Text fw={700} fz={16} c={colors.navyDeep} mb="md">
              Trip preview
            </Text>
            <Stack gap={6}>
              <Group gap={6}>
                <IconMapPin size={16} color={TEAL} />
                <Text fw={600}>
                  {form.values.origin || 'Origin'} → {form.values.destination || 'Destination'}
                </Text>
              </Group>
              <Text fz={13} c={colors.mutedText}>
                {form.values.departureDate || '—'} · {lug.toUpperCase()} ·{' '}
                {form.values.pricingType}
              </Text>
            </Stack>
            <Button fullWidth mt="lg" size="md" {...gradientBtn()} onClick={() => form.onSubmit(nextStep)()}>
              Continue to social impact
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function TravelerSocialImpactPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const draft = (location.state as { draft?: TripDraftForm } | null)?.draft;

  const [openToCommunitySupport, setOpenToCommunitySupport] = useState(false);
  const [willingToAssistElderly, setWillingToAssistElderly] = useState(false);
  const [acceptReducedFee, setAcceptReducedFee] = useState(false);
  const [acceptVolunteer, setAcceptVolunteer] = useState(false);

  if (!draft) {
    return (
      <Stack p="lg">
        <Text>Start by posting route details.</Text>
        <Button component={Link} to="/app/traveler/trips/new">
          Post a trip
        </Button>
      </Stack>
    );
  }

  const next = () => {
    const social: TripSocialState = {
      openToCommunitySupport,
      willingToAssistElderly,
      acceptReducedFee,
      acceptVolunteer,
    };
    navigate('/app/traveler/trips/review', { state: { draft, social } });
  };

  return (
    <Stack gap="xl" pb={48} maw={960} mx="auto">
      <Stack gap="xs" ta="center" mt="md">
        <Title order={2} fz={28} fw={700} c={colors.navyDeep}>
          Would you like to support your community?
        </Title>
        <Text fz={15} c={colors.mutedText} maw={560} mx="auto">
          Opt in to community-friendly delivery options. You can adjust later in settings.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        <Paper radius="md" p="lg" withBorder shadow="xs">
          <Group justify="space-between" align="flex-start">
            <Group gap="md">
              <IconSchool size={26} color="#6366f1" />
              <div>
                <Text fw={700}>Education & youth</Text>
                <Text fz={13} c={colors.mutedText}>
                  Support learning materials and student essentials when you travel.
                </Text>
              </div>
            </Group>
            <Switch checked={openToCommunitySupport} onChange={(e) => setOpenToCommunitySupport(e.currentTarget.checked)} />
          </Group>
        </Paper>
        <Paper radius="md" p="lg" withBorder shadow="xs">
          <Group justify="space-between" align="flex-start">
            <Group gap="md">
              <IconShieldHeart size={26} color="#ec4899" />
              <div>
                <Text fw={700}>Health access</Text>
                <Text fz={13} c={colors.mutedText}>
                  Help ship medical supplies where timing matters.
                </Text>
              </div>
            </Group>
            <Switch checked={willingToAssistElderly} onChange={(e) => setWillingToAssistElderly(e.currentTarget.checked)} />
          </Group>
        </Paper>
        <Paper radius="md" p="lg" withBorder shadow="xs">
          <Group justify="space-between" align="flex-start">
            <Group gap="md">
              <IconLeaf size={26} color="#22c55e" />
              <div>
                <Text fw={700}>Reduced fee deliveries</Text>
                <Text fz={13} c={colors.mutedText}>
                  Accept community-supported shipments at reduced fees.
                </Text>
              </div>
            </Group>
            <Switch checked={acceptReducedFee} onChange={(e) => setAcceptReducedFee(e.currentTarget.checked)} />
          </Group>
        </Paper>
        <Paper radius="md" p="lg" withBorder shadow="xs">
          <Group justify="space-between" align="flex-start">
            <Group gap="md">
              <IconBuildingCommunity size={26} color="#0ea5e9" />
              <div>
                <Text fw={700}>Volunteer carries</Text>
                <Text fz={13} c={colors.mutedText}>
                  Occasionally carry essential items without a fee.
                </Text>
              </div>
            </Group>
            <Switch checked={acceptVolunteer} onChange={(e) => setAcceptVolunteer(e.currentTarget.checked)} />
          </Group>
        </Paper>
      </SimpleGrid>

      <Group justify="center" mt="xl">
        <Button size="md" {...gradientBtn()} onClick={next}>
          Review trip
        </Button>
      </Group>
    </Stack>
  );
}

export function TravelerReviewTripPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as { draft?: TripDraftForm; social?: TripSocialState } | null;
  const [submitting, setSubmitting] = useState(false);

  if (!state?.draft || !state.social) {
    return (
      <Stack>
        <Text>Nothing to review.</Text>
        <Button component={Link} to="/app/traveler/trips/new">
          Start over
        </Button>
      </Stack>
    );
  }

  const { draft, social } = state;

  const publish = async () => {
    setSubmitting(true);
    try {
      const payload: CreateTripData = {
        origin: draft.origin.trim(),
        destination: draft.destination.trim(),
        departureDate: new Date(draft.departureDate).toISOString(),
        arrivalDate: new Date(draft.arrivalDate).toISOString(),
        luggageSpace: draft.luggageSpace,
        pricingType: draft.pricingType,
        pricePerKg: draft.pricingType === 'fixed' ? draft.pricePerKg : undefined,
        notes: draft.notes?.trim() || undefined,
        ...social,
      };
      await tripsService.create(payload);
      notify.success('Trip posted!');
      navigate('/app/traveler/trips', { replace: true });
    } catch (e) {
      notify.error(e instanceof ApiRequestError ? e.message : 'Could not create trip');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Stack gap="lg" pb={48}>
      <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
        Review your trip before publishing
      </Title>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <ShellCard>
            <Stack gap="md">
              <Group justify="space-between">
                <Group gap="sm">
                  <IconPlane color={TEAL} size={22} />
                  <Text fw={700} fz={18}>
                    {draft.origin} → {draft.destination}
                  </Text>
                </Group>
                <Badge variant="light" color="teal">
                  Preview
                </Badge>
              </Group>
              <Divider />
              <SimpleGrid cols={2} spacing="sm">
                <div>
                  <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
                    Departure
                  </Text>
                  <Text fz={14}>{draft.departureDate}</Text>
                </div>
                <div>
                  <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
                    Arrival
                  </Text>
                  <Text fz={14}>{draft.arrivalDate}</Text>
                </div>
                <div>
                  <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
                    Luggage
                  </Text>
                  <Text fz={14}>{draft.luggageSpace}</Text>
                </div>
                <div>
                  <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
                    Price / kg
                  </Text>
                  <Text fz={14} fw={700} c={TEAL}>
                    {draft.pricingType === 'fixed' ? `$${draft.pricePerKg}` : 'Negotiable'}
                  </Text>
                </div>
              </SimpleGrid>
            </Stack>
          </ShellCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper radius="md" p={0} withBorder style={{ overflow: 'hidden' }}>
            <Stack p="lg" gap="xs">
              <Text fw={700} fz={16}>
                Community opt-ins
              </Text>
              <Text fz={14} c={colors.mutedText}>
                Community support: {social.openToCommunitySupport ? 'Yes' : 'No'}
                <br />
                Assist elderly: {social.willingToAssistElderly ? 'Yes' : 'No'}
                <br />
                Reduced fee: {social.acceptReducedFee ? 'Yes' : 'No'}
                <br />
                Volunteer: {social.acceptVolunteer ? 'Yes' : 'No'}
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Group justify="space-between" mt="md">
        <Button component={Link} to="/app/traveler/social-impact" state={{ draft }} variant="default">
          Back
        </Button>
        <Button loading={submitting} onClick={() => void publish()} {...gradientBtn()}>
          Publish trip
        </Button>
      </Group>
    </Stack>
  );
}

function tripStatusTab(tab: string): 'active' | 'completed' | 'cancelled' | undefined {
  if (tab === 'active') return 'active';
  if (tab === 'completed') return 'completed';
  if (tab === 'cancelled') return 'cancelled';
  return undefined;
}

export function TravelerTripsListPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<string>('active');
  const { page, limit, setPage } = usePagination(10);

  const statusFilter = tripStatusTab(tab);

  const { data, isLoading } = useApi(
    () => tripsService.getMy({ status: statusFilter, page, limit }),
    [tab, page, limit],
  );

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  return (
    <Stack gap="lg" pb={88}>
      <Group justify="space-between" align="flex-end" wrap="wrap">
        <Box>
          <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
            My trips
          </Title>
          <Text fz={15} c={colors.mutedText} mt={4}>
            Filter, manage, and open details for every route you publish.
          </Text>
        </Box>
      </Group>

      <Tabs value={tab} onChange={(v) => { setTab(v ?? 'active'); setPage(1); }}>
        <Tabs.List>
          <Tabs.Tab value="active">Active</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="cancelled">Cancelled</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value={tab} pt="lg">
          {isLoading ? (
            <Skeleton height={120} />
          ) : rows.length === 0 ? (
            <Text c={colors.mutedText}>No trips in this view.</Text>
          ) : (
            <Stack gap="md">
              {rows.map((t: Trip) => (
                <Paper key={t._id} radius="md" p="md" withBorder shadow="xs">
                  <Group justify="space-between" align="center" wrap="nowrap">
                    <Group gap="md" wrap="wrap">
                      <div>
                        <Text fw={700} fz={16}>
                          {t.origin} → {t.destination}
                        </Text>
                        <Text fz={13} c={colors.mutedText}>
                          {new Date(t.departureDate).toLocaleDateString()} –{' '}
                          {new Date(t.arrivalDate).toLocaleDateString()}
                        </Text>
                      </div>
                      <Text fw={700} fz={15} c={TEAL}>
                        {t.pricingType === 'fixed' && t.pricePerKg != null
                          ? `$${t.pricePerKg}/kg`
                          : 'Negotiable'}
                      </Text>
                      <StatusBadge status={t.status} />
                    </Group>
                    <Menu shadow="md" width={200}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={20} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          onClick={() =>
                            navigate('/app/traveler/trips/detail', { state: { tripId: t._id } })
                          }
                        >
                          View details
                        </Menu.Item>
                        <Menu.Item
                          onClick={() =>
                            navigate('/app/traveler/trips/edit', { state: { tripId: t._id } })
                          }
                        >
                          Edit trip
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Paper>
              ))}
            </Stack>
          )}
        </Tabs.Panel>
      </Tabs>

      <Group justify="center" mt="md">
        <Pagination value={page} onChange={setPage} total={totalPages} size="sm" />
      </Group>

      <Affix position={{ bottom: 32, right: 32 }}>
        <ActionIcon
          component={Link}
          to="/app/traveler/trips/new"
          size={56}
          radius="xl"
          variant="filled"
          color="teal"
          style={{ boxShadow: '0 10px 25px rgba(0, 169, 135, 0.35)' }}
        >
          <IconPlus size={28} stroke={2} />
        </ActionIcon>
      </Affix>
    </Stack>
  );
}

function tripIdFromRoute(location: ReturnType<typeof useLocation>, searchParams: URLSearchParams): string | null {
  const st = location.state as { tripId?: string } | null;
  if (st?.tripId) return st.tripId;
  const q = searchParams.get('tripId');
  return q || null;
}

export function TravelerTripDetailPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tripId = tripIdFromRoute(location, searchParams);

  const { data: trip, isLoading } = useApi(
    () => (tripId ? tripsService.getById(tripId) : Promise.resolve(null as Trip | null)),
    [tripId],
  );

  const { data: bookingPage, refetch: refetchBookings } = useApi(
    () =>
      bookingsService.getMy({
        role: 'traveler',
        status: 'pending_acceptance',
        limit: 50,
      }),
    [tripId],
  );

  const pendingForTrip = useMemo(() => {
    const bids = bookingPage?.data ?? [];
    return bids.filter((b) => {
      const tid = typeof b.tripId === 'object' && b.tripId && '_id' in b.tripId ? (b.tripId as Trip)._id : b.tripId;
      return String(tid) === tripId;
    });
  }, [bookingPage, tripId]);

  const accept = async (id: string) => {
    try {
      await bookingsService.accept(id);
      notify.success('Accepted');
      void refetchBookings();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const decline = async (id: string) => {
    try {
      await bookingsService.decline(id);
      notify.success('Declined');
      void refetchBookings();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  if (!tripId) {
    return <Text>Select a trip from My Trips.</Text>;
  }

  if (isLoading || !trip) {
    return <Skeleton height={200} />;
  }

  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Group gap="sm" align="center">
            <Title order={2} fz={24} c={colors.navyDeep}>
              {trip.origin} → {trip.destination}
            </Title>
            <Badge variant="filled" color="teal" size="lg" radius="sm">
              {trip.status}
            </Badge>
          </Group>
          <Text fz={14} c={colors.mutedText} mt={6}>
            Published {new Date(trip.createdAt).toLocaleString()}
          </Text>
        </div>
        <Button
          variant="outline"
          onClick={() => navigate('/app/traveler/trips/edit', { state: { tripId } })}
        >
          Edit trip
        </Button>
      </Group>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper radius="md" p="lg" withBorder>
            <Text fw={700} fz={16} mb="md">
              Pending booking requests
            </Text>
            {pendingForTrip.length === 0 ? (
              <Text fz={14} c={colors.mutedText}>
                No pending offers for this trip.
              </Text>
            ) : (
              <Stack gap="md">
                {pendingForTrip.map((b) => {
                  const req = typeof b.requestId === 'object' ? b.requestId : null;
                  const title =
                    req && typeof req === 'object' && 'itemName' in req
                      ? String(req.itemName)
                      : 'Request';
                  const route =
                    req && typeof req === 'object' && 'origin' in req
                      ? `${String(req.origin)} → ${String(req.destination)}`
                      : '';
                  const requester = b.requesterId && typeof b.requesterId === 'object' ? b.requesterId.fullName : 'Sender';
                  return (
                    <Group key={b._id} justify="space-between" align="center">
                      <Group gap="sm">
                        <Avatar radius="xl" color="brandTeal">
                          {String(requester).charAt(0)}
                        </Avatar>
                        <div>
                          <Text fw={600}>{title}</Text>
                          <Text fz={13} c={colors.mutedText}>
                            {route} · offered{' '}
                            {new Intl.NumberFormat(undefined, {
                              style: 'currency',
                              currency: b.currency || 'USD',
                            }).format(b.offeredFee)}
                          </Text>
                        </div>
                      </Group>
                      <Group gap="xs">
                        <Button size="xs" variant="light" color="teal" onClick={() => void accept(b._id)}>
                          Accept
                        </Button>
                        <Button size="xs" variant="default" onClick={() => void decline(b._id)}>
                          Decline
                        </Button>
                      </Group>
                    </Group>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper radius="md" p="lg" withBorder pos="sticky" top={24}>
            <Text fw={700} fz={16} mb="md">
              Trip summary
            </Text>
            <Stack gap="sm">
              <Group justify="space-between">
                <Text fz={14} c={colors.mutedText}>
                  Pricing
                </Text>
                <Text fz={14} fw={600}>
                  {trip.pricingType === 'fixed' ? `$${trip.pricePerKg ?? 0}/kg` : 'Negotiable'}
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fz={14} c={colors.mutedText}>
                  Matches
                </Text>
                <Text fz={14} fw={600}>
                  {trip.matchedRequestsCount}
                </Text>
              </Group>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function TravelerEditTripPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const tripId = tripIdFromRoute(location, searchParams);
  const [cancelOpen, { open: openCancel, close: closeCancel }] = useDisclosure(false);

  const { data: trip, isLoading } = useApi(
    () => (tripId ? tripsService.getById(tripId) : Promise.resolve(null)),
    [tripId],
  );

  const form = useForm({
    initialValues: {
      origin: '',
      destination: '',
      departureDate: '',
      arrivalDate: '',
      pricePerKg: 0,
      notes: '',
      luggageSpace: 'medium' as 'small' | 'medium' | 'large',
      pricingType: 'fixed' as 'fixed' | 'negotiable',
    },
  });

  useEffect(() => {
    if (trip) {
      form.setValues({
        origin: trip.origin,
        destination: trip.destination,
        departureDate: trip.departureDate.slice(0, 10),
        arrivalDate: trip.arrivalDate.slice(0, 10),
        pricePerKg: trip.pricePerKg ?? 0,
        notes: trip.notes ?? '',
        luggageSpace: trip.luggageSpace,
        pricingType: trip.pricingType,
      });
    }
  }, [trip]);

  const save = async () => {
    if (!tripId) return;
    try {
      await tripsService.update(tripId, {
        origin: form.values.origin,
        destination: form.values.destination,
        departureDate: new Date(form.values.departureDate).toISOString(),
        arrivalDate: new Date(form.values.arrivalDate).toISOString(),
        luggageSpace: form.values.luggageSpace,
        pricingType: form.values.pricingType,
        pricePerKg: form.values.pricingType === 'fixed' ? form.values.pricePerKg : undefined,
        notes: form.values.notes || undefined,
      });
      notify.success('Trip updated');
      navigate('/app/traveler/trips/detail', { state: { tripId } });
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Update failed');
    }
  };

  const cancelTrip = async () => {
    if (!tripId) return;
    try {
      await tripsService.cancel(tripId);
      notify.success('Trip cancelled');
      closeCancel();
      navigate('/app/traveler/trips');
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Cancel failed');
    }
  };

  if (!tripId) return <Text>Missing trip.</Text>;
  if (isLoading || !trip) return <Skeleton height={240} />;

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Edit trip
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Update capacity and pricing, or cancel if your plans change.
        </Text>
      </Box>

      <ShellCard>
        <Stack gap="md">
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <TextInput label="Origin" {...form.getInputProps('origin')} />
            <TextInput label="Destination" {...form.getInputProps('destination')} />
            <TextInput label="Departure date" type="date" {...form.getInputProps('departureDate')} />
            <TextInput label="Arrival date" type="date" {...form.getInputProps('arrivalDate')} />
            <Select
              label="Luggage"
              data={[
                { value: 'small', label: 'Small' },
                { value: 'medium', label: 'Medium' },
                { value: 'large', label: 'Large' },
              ]}
              {...form.getInputProps('luggageSpace')}
            />
            <Radio.Group label="Pricing type" {...form.getInputProps('pricingType')}>
              <Group mt="xs">
                <Radio value="fixed" label="Fixed / kg" />
                <Radio value="negotiable" label="Negotiable" />
              </Group>
            </Radio.Group>
            <NumberInput label="Price per kg" prefix="$" min={0} {...form.getInputProps('pricePerKg')} />
          </SimpleGrid>
          <Textarea label="Notes" minRows={2} {...form.getInputProps('notes')} />
          <Group justify="space-between" mt="md">
            <Button color="red" variant="light" onClick={openCancel}>
              Cancel trip
            </Button>
            <Button onClick={() => void save()} {...gradientBtn()}>
              Save changes
            </Button>
          </Group>
        </Stack>
      </ShellCard>

      <Modal opened={cancelOpen} onClose={closeCancel} centered radius="md" size="md">
        <Stack gap="lg" align="center" ta="center" pt="xs">
          <IconAlertTriangle size={28} color="#fa5252" />
          <Title order={3} fz={20}>
            Cancel this trip?
          </Title>
          <Text fz={14} c={colors.mutedText}>
            Matched senders may be notified per platform rules.
          </Text>
          <Group grow w="100%" mt="sm">
            <Button fullWidth color="red" onClick={() => void cancelTrip()}>
              Cancel trip
            </Button>
            <Button fullWidth {...gradientBtn()} onClick={closeCancel}>
              Keep trip
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

export function TravelerMatchDetailPage() {
  return (
    <Stack>
      <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
        Trip match details
      </Title>
      <Text fz={15} c={colors.mutedText} mt={6}>
        Open a booking from your dashboard or bookings list for full escrow details.
      </Text>
      <Button component={Link} to="/app/bookings" variant="filled" color="teal">
        Go to bookings
      </Button>
    </Stack>
  );
}

export function TravelerBrowseRequestsPage() {
  const { page, limit, setPage } = usePagination(10);
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [tripId, setTripId] = useState<string>('');

  const filters = useMemo(
    () => ({
      origin: origin.trim() || undefined,
      destination: destination.trim() || undefined,
      itemCategory: category ?? undefined,
      page,
      limit,
    }),
    [origin, destination, category, page, limit],
  );

  const { data, isLoading, refetch } = useApi(
    () => requestsService.browse(filters),
    [filters.origin, filters.destination, filters.itemCategory, page, limit],
  );

  const { data: myTrips } = useApi(() => tripsService.getMy({ status: 'active', limit: 50 }), []);

  const tripOptions =
    myTrips?.data?.map((t: Trip) => ({
      value: t._id,
      label: `${t.origin} → ${t.destination}`,
    })) ?? [];

  const [feeModal, setFeeModal] = useState<{ requestId: string; itemLabel: string } | null>(null);
  const [offeredFee, setOfferedFee] = useState(25);

  const submitMatch = async () => {
    if (!feeModal || !tripId) {
      notify.error('Select your trip and enter a fee');
      return;
    }
    try {
      await bookingsService.match({
        requestId: feeModal.requestId,
        tripId,
        offeredFee,
      });
      notify.success('Match created');
      setFeeModal(null);
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Match failed');
    }
  };

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  return (
    <Box pb={96}>
      <Grid gap={{ base: 'md', md: 'lg' }}>
        <Grid.Col span={{ base: 12, md: 1 }}>
          <Paper
            visibleFrom="md"
            radius="md"
            p="xs"
            style={{ background: MU.sidebarNavy, height: '100%', minHeight: 420 }}
          >
            <Stack gap={6} align="center" pt="lg">
              <ActionIcon component={Link} to="/app/traveler" variant="subtle" aria-label="Home" styles={{ root: { color: 'rgba(255,255,255,0.75)' } }}>
                <IconHome size={20} stroke={1.5} />
              </ActionIcon>
              <ActionIcon component={Link} to="/app/traveler/browse/requests" variant="filled" color="grey" aria-label="Requests" style={{ background: 'rgba(20,184,166,0.25)' }}>
                <IconMessage size={20} stroke={1.5} style={{ color: MU.teal }} />
              </ActionIcon>
              <ActionIcon component={Link} to="/app/traveler/trips" variant="subtle" aria-label="Trips" styles={{ root: { color: 'rgba(255,255,255,0.65)' } }}>
                <IconPlane size={20} stroke={1.5} />
              </ActionIcon>
              <ActionIcon component={Link} to="/app/bookings" variant="subtle" aria-label="Bookings" styles={{ root: { color: 'rgba(255,255,255,0.65)' } }}>
                <IconBriefcase size={20} stroke={1.5} />
              </ActionIcon>
              <ActionIcon component={Link} to="/app/settings/notifications" variant="subtle" aria-label="Settings" styles={{ root: { color: 'rgba(255,255,255,0.65)' } }}>
                <IconSettings size={20} stroke={1.5} />
              </ActionIcon>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 11 }}>
          <Stack gap="md">
            <div>
              <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
                Browse requests
              </Title>
              <Text fz={15} c={colors.mutedText} mt={6}>
                Match sender requests to one of your active trips.
              </Text>
            </div>

            <Paper radius="md" p="md" withBorder shadow="xs" bg="#fff">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm">
                <TextInput label="From" placeholder="City / airport" value={origin} onChange={(e) => setOrigin(e.currentTarget.value)} />
                <TextInput label="To" placeholder="Destination" value={destination} onChange={(e) => setDestination(e.currentTarget.value)} />
                <Select
                  label="Category"
                  placeholder="documents…"
                  clearable
                  data={[
                    { value: 'documents', label: 'Documents' },
                    { value: 'electronics', label: 'Electronics' },
                    { value: 'clothing', label: 'Clothing' },
                    { value: 'other', label: 'Other' },
                  ]}
                  value={category}
                  onChange={setCategory}
                />
                <Select label="Your trip" placeholder="Select trip" data={tripOptions} value={tripId} onChange={(v) => setTripId(v ?? '')} />
              </SimpleGrid>
              <Button mt="md" radius="md" styles={{ root: { background: MU.teal } }} onClick={() => { setPage(1); void refetch(); }}>
                Search
              </Button>
            </Paper>

            {isLoading ? (
              <Skeleton height={140} />
            ) : (
              <Stack gap="md">
                {rows.map((r: DeliveryRequest) => (
                  <Paper key={r._id} radius="md" withBorder shadow="xs" bg="#fff">
                    <Group align="stretch" wrap="nowrap">
                      <Stack gap={6} p="md" style={{ flex: 1 }}>
                        <Group justify="space-between" align="flex-start" wrap="wrap">
                          <div>
                            <Text fw={800} fz={17}>
                              {r.itemName}
                            </Text>
                            <Group gap={6} mt={4}>
                              <IconMapPin size={14} color={colors.slate} />
                              <Text fz={13} c={colors.mutedText}>
                                {r.origin} → {r.destination}
                              </Text>
                            </Group>
                          </div>
                          <Text fw={800} fz={18} c={MU.teal}>
                            {r.budget != null
                              ? new Intl.NumberFormat(undefined, {
                                  style: 'currency',
                                  currency: r.currency || 'USD',
                                }).format(r.budget)
                              : 'Budget TBD'}
                          </Text>
                        </Group>
                        <Group justify="flex-end" mt="xs">
                          <Button
                            size="xs"
                            variant="filled"
                            radius="md"
                            styles={{ root: { background: MU.teal } }}
                            onClick={() => setFeeModal({ requestId: r._id, itemLabel: r.itemName })}
                          >
                            Propose match
                          </Button>
                        </Group>
                      </Stack>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}

            <Group justify="center">
              <Pagination value={page} onChange={setPage} total={totalPages} siblings={1} size="sm" />
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>

      <Modal opened={!!feeModal} onClose={() => setFeeModal(null)} title="Offer a fee" centered>
        <Stack gap="sm">
          <Text fz={14}>{feeModal?.itemLabel}</Text>
          <NumberInput label="Offered fee (USD)" min={1} value={offeredFee} onChange={(v) => setOfferedFee(Number(v) || 0)} />
          <Button onClick={() => void submitMatch()} styles={{ root: { background: MU.teal } }}>
            Submit match
          </Button>
        </Stack>
      </Modal>

      <Affix position={{ bottom: 32, right: 32 }}>
        <ActionIcon
          component={Link}
          to="/app/traveler/trips/new"
          size={56}
          radius="xl"
          variant="filled"
          style={{ background: MU.teal, boxShadow: '0 10px 25px rgba(20,184,166,0.35)' }}
        >
          <IconPlus size={28} stroke={2} />
        </ActionIcon>
      </Affix>
    </Box>
  );
}

export function TravelerPayoutsPage() {
  const { data, isLoading } = useApi(
    () => bookingsService.getMy({ role: 'traveler', status: 'completed', limit: 100 }),
    [],
  );

  const rows = data?.data ?? [];
  const balance = useMemo(
    () => rows.reduce((s, b) => s + (b.travelerPayout ?? 0), 0),
    [rows],
  );

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Traveler payouts
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Earnings from completed bookings (traveler payout after commission).
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText}>
            Total earned (completed)
          </Text>
          {isLoading ? (
            <Skeleton height={48} mt="md" />
          ) : (
            <Text fz={40} fw={900} my="md">
              {new Intl.NumberFormat(undefined, { style: 'currency', currency: 'USD' }).format(balance)}
            </Text>
          )}
        </Paper>
        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Text fw={700} fz={16} mb="md">
            Overview
          </Text>
          <Text fz={14} c={colors.mutedText}>
            Withdrawals and payout rails will connect in a future release. Use Wallet history for booking-level
            records.
          </Text>
        </Paper>
      </SimpleGrid>

      <Paper radius="md" withBorder shadow="xs" p="md">
        <Text fw={700} fz={16} mb="sm">
          Completed bookings
        </Text>
        {isLoading ? (
          <Skeleton height={100} />
        ) : rows.length === 0 ? (
          <Text c={colors.mutedText}>No completed bookings yet.</Text>
        ) : (
          <Stack gap="xs">
            {rows.map((b: Booking) => (
              <Group key={b._id} justify="space-between" wrap="nowrap">
                <Text fz={14}>
                  {b.bookingRef} · {new Date(b.createdAt).toLocaleDateString()}
                </Text>
                <Text fw={700}>
                  {new Intl.NumberFormat(undefined, {
                    style: 'currency',
                    currency: b.currency || 'USD',
                  }).format(b.travelerPayout ?? 0)}
                </Text>
              </Group>
            ))}
          </Stack>
        )}
      </Paper>
    </Stack>
  );
}
