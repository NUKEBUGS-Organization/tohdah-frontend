import {
  ActionIcon,
  Affix,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Radio,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Title,
  UnstyledButton,
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
import { Link } from 'react-router-dom';
import { colors, marketplaceUi as MU, paymentUi as PU } from '../../../theme';
import { MockTable, ShellCard, StatusBadge } from './shared';

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

const cities = ['London (LHR)', 'New York (JFK)', 'Dubai (DXB)', 'Singapore (SIN)', 'Paris (CDG)'];

export function TravelerPostTripPage() {
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
              <Select label="Origin city" placeholder="Select origin" data={cities} searchable />
              <Select
                label="Destination city"
                placeholder="Select destination"
                data={cities}
                searchable
              />
            </SimpleGrid>
          </SectionCard>

          <SectionCard step={2} title="Travel dates" description="Departure and return for this trip.">
            <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
              <TextInput label="Departure date" type="date" required />
              <TextInput label="Return date" type="date" />
            </SimpleGrid>
          </SectionCard>

          <SectionCard
            step={3}
            title="Additional info"
            description="How much space can you offer, and what kind of trip is this?"
          >
            <Text fz={13} fw={600} mb={8}>
              Luggage capacity
            </Text>
            <Group gap="sm" mb="md">
              <LuggageToggle label="S" iconSize={18} />
              <LuggageToggle label="M" iconSize={22} selected />
              <LuggageToggle label="L" iconSize={26} />
            </Group>
            <Radio.Group label="Trip type" defaultValue="leisure">
              <Group mt="xs">
                <Radio value="leisure" label="Leisure" />
                <Radio value="business" label="Business" />
              </Group>
            </Radio.Group>
          </SectionCard>

          <SectionCard step={4} title="Pricing & permissions" description="Set your price and confirm terms.">
            <NumberInput
              label="Trip price"
              prefix="$"
              thousandSeparator
              defaultValue={240}
              min={0}
              mb="md"
            />
            <Checkbox
              label="I agree to Tohdah’s traveler terms, community guidelines, and cancellation policy."
              defaultChecked
            />
          </SectionCard>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Paper radius="md" p="lg" withBorder pos="sticky" top={24} style={{ top: 24 }}>
            <Text fw={700} fz={16} c={colors.navyDeep} mb="md">
              Trip preview
            </Text>
            <Box mb="md" style={{ overflow: 'hidden', borderRadius: 8 }}>
              <Image
                radius="md"
                h={180}
                src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80"
                alt="Destination"
              />
            </Box>
            <Stack gap={6}>
              <Group gap={6}>
                <IconMapPin size={16} color={TEAL} />
                <Text fw={600}>London → New York</Text>
              </Group>
              <Text fz={13} c={colors.mutedText}>
                Departure · May 12 · Medium luggage · Leisure
              </Text>
              <Text fz={22} fw={800} c={colors.navyDeep} mt={4}>
                $240.00
              </Text>
            </Stack>
            <Button
              component={Link}
              to="/app/traveler/social-impact"
              fullWidth
              mt="lg"
              size="md"
              {...gradientBtn()}
            >
              Publish your trip
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

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
      <Group gap="md" align="flex-start" wrap="nowrap" mb="md">
        <Box
          w={36}
          h={36}
          style={{
            borderRadius: 10,
            background: `linear-gradient(134deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
            color: 'white',
            fontWeight: 800,
            fontSize: 15,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}
        >
          {step}
        </Box>
        <div>
          <Text fw={700} fz={16} c={colors.navyDeep}>
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
  iconSize,
  selected,
}: {
  label: string;
  iconSize: number;
  selected?: boolean;
}) {
  return (
    <UnstyledButton>
      <Paper
        radius="md"
        p="md"
        withBorder
        style={{
          borderColor: selected ? TEAL : undefined,
          borderWidth: selected ? 2 : 1,
          background: selected ? 'rgba(32, 178, 170, 0.08)' : undefined,
        }}
      >
        <Stack gap={6} align="center">
          <IconLuggage size={iconSize} color={selected ? TEAL : colors.mutedText} />
          <Text fz={12} fw={600}>
            {label}
          </Text>
        </Stack>
      </Paper>
    </UnstyledButton>
  );
}

const causes = [
  {
    title: 'Education',
    description: 'Support students with supplies and learning materials sent via verified routes.',
    icon: IconSchool,
    color: '#6366f1',
  },
  {
    title: 'Environment',
    description: 'Offset carbon for community routes and fund green initiatives in partner cities.',
    icon: IconLeaf,
    color: '#22c55e',
  },
  {
    title: 'Health access',
    description: 'Help ship medical samples and aid to clinics with urgent delivery windows.',
    icon: IconShieldHeart,
    color: '#ec4899',
  },
  {
    title: 'Local communities',
    description: 'Fund neighborhood programs where your trips begin or end.',
    icon: IconBuildingCommunity,
    color: '#0ea5e9',
  },
];

export function TravelerSocialImpactPage() {
  return (
    <Stack gap="xl" pb={48} maw={960} mx="auto">
      <Stack gap="xs" ta="center" mt="md">
        <Title order={2} fz={28} fw={700} c={colors.navyDeep}>
          Would you like to support your community?
        </Title>
        <Text fz={15} c={colors.mutedText} maw={560} mx="auto">
          Opt in to causes you care about. You can adjust contributions anytime in settings.
        </Text>
      </Stack>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg">
        {causes.map((c) => {
          const CauseIcon = c.icon;
          return (
          <Paper key={c.title} radius="md" p="lg" withBorder shadow="xs">
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group gap="md" align="flex-start">
                <Box
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 12,
                    background: `${c.color}18`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <CauseIcon size={26} color={c.color} />
                </Box>
                <div>
                  <Text fw={700} fz={16}>
                    {c.title}
                  </Text>
                  <Text fz={13} c={colors.mutedText} mt={4}>
                    {c.description}
                  </Text>
                </div>
              </Group>
              <Switch size="md" color="teal" defaultChecked={c.title === 'Education'} />
            </Group>
          </Paper>
          );
        })}
      </SimpleGrid>

      <Group justify="center" mt="xl">
        <Button component={Link} to="/app/traveler/trips/review" size="md" {...gradientBtn()}>
          Next step
        </Button>
      </Group>
    </Stack>
  );
}

export function TravelerReviewTripPage() {
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
                  London (LHR) → New York (JFK)
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
                <Text fz={14}>May 12, 2026</Text>
              </div>
              <div>
                <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
                  Return
                </Text>
                <Text fz={14}>May 19, 2026</Text>
              </div>
              <div>
                <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
                  Luggage
                </Text>
                <Text fz={14}>Medium · Up to 23 kg</Text>
              </div>
              <div>
                <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
                  Price
                </Text>
                <Text fz={14} fw={700} c={TEAL}>
                  $240.00
                </Text>
              </div>
            </SimpleGrid>
            </Stack>
          </ShellCard>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper radius="md" p={0} withBorder style={{ overflow: 'hidden' }}>
            <Image
              h={200}
              src="https://images.unsplash.com/photo-1477959858617-67f85cf4f290?w=800&q=80"
              alt="City"
            />
            <Stack p="lg" gap="xs">
              <Text fw={700} fz={16}>
                Why it matters
              </Text>
              <Text fz={14} c={colors.mutedText}>
                Accurate routes help senders match faster and keep payouts predictable. Double-check
                dates and luggage before you publish.
              </Text>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Group justify="space-between" mt="md">
        <Button component={Link} to="/app/traveler/trips/new" variant="default">
          Back
        </Button>
        <Button component={Link} to="/app/traveler/trips" {...gradientBtn()}>
          Publish trip
        </Button>
      </Group>
    </Stack>
  );
}

const tripRows = [
  { route: 'LHR → JFK', dates: 'May 12 – May 19', price: '$240', status: 'Active' as const },
  { route: 'DXB → SIN', dates: 'Jun 02 – Jun 05', price: '$310', status: 'Pending' as const },
  { route: 'CDG → BOS', dates: 'Apr 18 – Apr 22', price: '$198', status: 'Completed' as const },
  { route: 'LGW → ATH', dates: 'Mar 03 – Mar 10', price: '$120', status: 'Cancelled' as const },
];

export function TravelerTripsListPage() {
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

      <Tabs defaultValue="active">
        <Tabs.List>
          <Tabs.Tab value="active">Active</Tabs.Tab>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="cancelled">Cancelled</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="active" pt="lg">
          <TripCardList filter="Active" />
        </Tabs.Panel>
        <Tabs.Panel value="pending" pt="lg">
          <TripCardList filter="Pending" />
        </Tabs.Panel>
        <Tabs.Panel value="completed" pt="lg">
          <TripCardList filter="Completed" />
        </Tabs.Panel>
        <Tabs.Panel value="cancelled" pt="lg">
          <TripCardList filter="Cancelled" />
        </Tabs.Panel>
      </Tabs>

      <Group justify="center" mt="md">
        <Pagination total={4} size="sm" />
      </Group>

      <Affix position={{ bottom: 32, right: 32 }}>
        <ActionIcon
          component={Link}
          to="/app/traveler/trips/new"
          size={56}
          radius="xl"
          variant="filled"
          color="teal"
          style={{
            boxShadow: '0 10px 25px rgba(0, 169, 135, 0.35)',
          }}
        >
          <IconPlus size={28} stroke={2} />
        </ActionIcon>
      </Affix>
    </Stack>
  );
}

function TripCardList({ filter }: { filter: string }) {
  const rows = tripRows.filter((t) => t.status === filter);
  const show = rows.length ? rows : tripRows.slice(0, 1);

  return (
    <Stack gap="md">
      {show.map((t) => (
        <Paper key={`${t.route}-${t.status}`} radius="md" p="md" withBorder shadow="xs">
          <Group justify="space-between" align="center" wrap="nowrap">
            <Group gap="md" wrap="wrap">
              <div>
                <Text fw={700} fz={16}>
                  {t.route}
                </Text>
                <Text fz={13} c={colors.mutedText}>
                  {t.dates}
                </Text>
              </div>
              <Text fw={700} fz={15} c={TEAL}>
                {t.price}
              </Text>
              <StatusBadge status={t.status} />
            </Group>
            <Group gap={4} wrap="nowrap">
              <Menu shadow="md" width={200}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={20} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to="/app/traveler/trips/detail">
                    View details
                  </Menu.Item>
                  <Menu.Item component={Link} to="/app/traveler/trips/edit">
                    Edit trip
                  </Menu.Item>
                  <Menu.Item color="red">Cancel trip</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Group>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export function TravelerTripDetailPage() {
  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Group gap="sm" align="center">
            <Title order={2} fz={24} c={colors.navyDeep}>
              LHR → JFK
            </Title>
            <Badge variant="filled" color="teal" size="lg" radius="sm">
              Live
            </Badge>
          </Group>
          <Text fz={14} c={colors.mutedText} mt={6}>
            British Airways · Published May 4, 2026
          </Text>
        </div>
        <Button component={Link} to="/app/traveler/trips/edit" variant="outline">
          Edit trip
        </Button>
      </Group>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Stack gap="lg">
          <Paper radius="md" withBorder p={0} style={{ overflow: 'hidden' }}>
            <Box
              h={240}
              style={{
                background: `linear-gradient(145deg, #dfe9f5 0%, #c5d8ec 50%, ${colors.inputBg} 100%)`,
                position: 'relative',
              }}
            >
              <svg viewBox="0 0 600 200" width="100%" height={200} preserveAspectRatio="none">
                <path
                  d="M 40 160 Q 300 20 560 80"
                  fill="none"
                  stroke={TEAL}
                  strokeWidth="4"
                  strokeLinecap="round"
                  opacity={0.9}
                />
                <circle cx="40" cy="160" r="8" fill={colors.navyDeep} />
                <circle cx="560" cy="80" r="8" fill={TEAL} />
              </svg>
              <Text fz={12} c={colors.mutedText} pos="absolute" bottom={12} left={16}>
                Route preview · Great circle path
              </Text>
            </Box>
          </Paper>

          <Paper radius="md" p="lg" withBorder>
            <Text fw={700} fz={16} mb="md">
              Pending requests
            </Text>
            <Stack gap="md">
              <RequestRow name="Jordan P." meta="Documents · 0.6 kg · $72" />
              <Divider />
              <RequestRow name="Taylor K." meta="Fragile art · 4 kg · $340" />
            </Stack>
          </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper radius="md" p="lg" withBorder pos="sticky" top={24}>
          <Text fw={700} fz={16} mb="md">
            Trip summary
          </Text>
          <Stack gap="sm">
            <Group justify="space-between">
              <Text fz={14} c={colors.mutedText}>
                Trip price
              </Text>
              <Text fw={800} fz={18}>
                $240.00
              </Text>
            </Group>
            <Group justify="space-between">
              <Text fz={14} c={colors.mutedText}>
                Luggage space
              </Text>
              <Text fz={14} fw={600}>
                18 kg left
              </Text>
            </Group>
            <Divider my="sm" />
            <Button fullWidth leftSection={<IconMessage size={18} />} variant="light" color="teal">
              Message traveler
            </Button>
          </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

function RequestRow({ name, meta }: { name: string; meta: string }) {
  return (
    <Group justify="space-between" align="center">
      <Group gap="sm">
        <Avatar radius="xl" color="brandTeal">
          {name.charAt(0)}
        </Avatar>
        <div>
          <Text fw={600}>{name}</Text>
          <Text fz={13} c={colors.mutedText}>
            {meta}
          </Text>
        </div>
      </Group>
      <Group gap="xs">
        <Button size="xs" variant="light" color="teal">
          Accept
        </Button>
        <Button size="xs" variant="default">
          Reject
        </Button>
      </Group>
    </Group>
  );
}

export function TravelerEditTripPage() {
  const [cancelOpen, { open: openCancel, close: closeCancel }] = useDisclosure(false);

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
            <Select label="Origin city" defaultValue="London (LHR)" data={cities} />
            <Select label="Destination city" defaultValue="New York (JFK)" data={cities} />
            <TextInput label="Departure date" type="date" defaultValue="2026-05-12" />
            <TextInput label="Return date" type="date" defaultValue="2026-05-19" />
            <NumberInput label="Trip price" prefix="$" defaultValue={240} min={0} />
            <NumberInput label="Available luggage (kg)" defaultValue={18} min={0} max={50} />
          </SimpleGrid>
          <Textarea label="Notes to senders" minRows={2} placeholder="Optional updates…" />
          <Group justify="space-between" mt="md">
            <Button color="red" variant="light" onClick={openCancel}>
              Cancel trip
            </Button>
            <Button component={Link} to="/app/traveler/trips/detail" {...gradientBtn()}>
              Save changes
            </Button>
          </Group>
        </Stack>
      </ShellCard>

      <Modal opened={cancelOpen} onClose={closeCancel} centered radius="md" size="md">
        <Stack gap="lg" align="center" ta="center" pt="xs">
          <Box
            style={{
              width: 56,
              height: 56,
              borderRadius: '50%',
              background: 'rgba(250, 82, 82, 0.12)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconAlertTriangle size={28} color="#fa5252" />
          </Box>
          <Title order={3} fz={20}>
            Cancel this trip?
          </Title>
          <Text fz={14} c={colors.mutedText}>
            Matched senders will be notified and any pending payouts may be adjusted per the
            cancellation policy. This cannot be undone from the mobile preview.
          </Text>
          <Group grow w="100%" mt="sm">
            <Button fullWidth color="red" component={Link} to="/app/traveler/trips" onClick={closeCancel}>
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
      <Box mb="lg">
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Trip match details
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Sender, parcel specs, and escrow status.
        </Text>
      </Box>
      <ShellCard>
        <Stack gap="md">
          <Group justify="space-between">
            <Text fw={600}>NYC → LHR · Mar 14</Text>
            <StatusBadge status="Matched" />
          </Group>
          <Text fz={14} c={colors.mutedText}>
            Review parcel list before confirming booking.
          </Text>
          <Button component={Link} to="/app/booking/confirm" fullWidth variant="filled" color="teal">
            Proceed to booking
          </Button>
        </Stack>
      </ShellCard>
    </Stack>
  );
}

const browseRequests = [
  {
    title: 'MacBook Pro 13',
    thumb: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&q=80',
    route: 'JFK → Paris (CDG)',
    price: '$265',
    highlight: true,
    mapStrip: true,
  },
  {
    title: 'Medical samples kit',
    thumb: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&q=80',
    route: 'BOS → London (LHR)',
    price: '$210',
    highlight: false,
    mapStrip: false,
  },
  {
    title: 'Vintage camera',
    thumb: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400&q=80',
    route: 'ATL → AMS',
    price: '$148',
    highlight: false,
    mapStrip: true,
  },
];

export function TravelerBrowseRequestsPage() {
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
                Match your upcoming trips with senders posting along your route.
              </Text>
            </div>

            <Paper radius="md" p="md" withBorder shadow="xs" bg="#fff">
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="sm">
                <TextInput label="From" placeholder="City / airport" />
                <TextInput label="To" placeholder="Destination" />
                <Select label="Category" placeholder="Electronics…" data={['Electronics', 'Documents', 'Fragile']} />
                <TextInput label="Weight (kg)" placeholder="e.g. 2" />
              </SimpleGrid>
              <Button mt="md" radius="md" styles={{ root: { background: MU.teal } }}>
                Search
              </Button>
            </Paper>

            <Stack gap="md">
              {browseRequests.map((r) => (
                <Paper key={r.title} radius="md" withBorder shadow="xs" bg="#fff">
                  <Group align="stretch" wrap="nowrap">
                    <Image src={r.thumb} w={118} mah={132} radius="sm" alt="" fit="cover" />
                    <Stack gap={6} p="md" style={{ flex: 1 }}>
                      <Group justify="space-between" align="flex-start" wrap="wrap">
                        <div>
                          <Text fw={800} fz={17}>
                            {r.title}
                          </Text>
                          <Group gap={6} mt={4}>
                            <IconMapPin size={14} color={colors.slate} />
                            <Text fz={13} c={colors.mutedText}>
                              {r.route}
                            </Text>
                          </Group>
                        </div>
                        <Text fw={800} fz={18} c={MU.teal}>
                          {r.price}
                        </Text>
                      </Group>
                      {r.mapStrip ? (
                        <Paper
                          h={64}
                          radius="sm"
                          mt={4}
                          withBorder={false}
                          style={{
                            background: `linear-gradient(90deg,#e2e8f0 0%, ${MU.teal}33 55%, #e2e8f0 100%)`,
                          }}
                        />
                      ) : null}
                      <Group justify="flex-end" mt="xs">
                        <Button
                          size="xs"
                          variant={r.highlight ? 'filled' : 'light'}
                          component={Link}
                          to="/app/requester/matches/detail"
                          radius="md"
                          styles={
                            r.highlight
                              ? { root: { background: MU.teal } }
                              : { root: { color: MU.teal } }
                          }
                        >
                          {r.highlight ? 'Match' : 'View details'}
                        </Button>
                      </Group>
                    </Stack>
                  </Group>
                </Paper>
              ))}
            </Stack>

            <Group justify="center">
              <Pagination total={6} siblings={1} size="sm" />
            </Group>
          </Stack>
        </Grid.Col>
      </Grid>

      <Affix position={{ bottom: 32, right: 32 }}>
        <ActionIcon
          component={Link}
          to="/app/traveler/trips/new"
          size={56}
          radius="xl"
          variant="filled"
          style={{
            background: MU.teal,
            boxShadow: '0 10px 25px rgba(20,184,166,0.35)',
          }}
        >
          <IconPlus size={28} stroke={2} />
        </ActionIcon>
      </Affix>
    </Box>
  );
}

export function TravelerPayoutsPage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue, border: 'none' } } } as const;

  const barHeights = [28, 45, 32, 60, 38, 52, 48, 72, 56, 64, 80, 70];

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Traveler payouts
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Current balance, earnings trend, and transfer history.
        </Text>
      </Box>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText}>
            Current balance
          </Text>
          <Text fz={40} fw={900} my="md">
            $1,842.80
          </Text>
          <Text fz={14} c={colors.mutedText} mb="lg">
            Includes $120 pending next settlement window (Tue UTC).
          </Text>
          <Button fullWidth size="md" radius="md" {...blueBtn}>
            Withdraw
          </Button>
        </Paper>

        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Text fw={700} fz={16} mb="md">
            Earnings overview
          </Text>
          <Group align="flex-end" gap={6} h={140} px={4}>
            {barHeights.map((h, i) => (
              <Box
                key={i}
                style={{
                  flex: 1,
                  height: `${h}%`,
                  minHeight: 20,
                  borderRadius: 6,
                  background: `linear-gradient(180deg, ${PU.primaryBlue}, #60a5fa)`,
                  opacity: 0.65 + i * 0.02,
                }}
              />
            ))}
          </Group>
          <Group justify="space-between" mt="sm" fz={11} c={colors.subtleText}>
            <Text>Jan</Text>
            <Text>Jun</Text>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper radius="md" withBorder shadow="xs" p={0}>
        <Text fw={700} fz={16} px="lg" pt="lg" pb={0}>
          Payout history
        </Text>
        <MockTable
          columns={['Date', 'Method', 'Status', 'Amount']}
          rows={[
            [
              'May 01',
              'ACH · Checking ·••891',
              <StatusBadge key="ph1" status="Completed" />,
              '+$620.00',
            ],
            [
              'Apr 17',
              'ACH · Checking ·••891',
              <StatusBadge key="ph2" status="Completed" />,
              '+$310.00',
            ],
            [
              'Apr 02',
              'Wire',
              <StatusBadge key="ph3" status="Pending" />,
              '$1,040.00',
            ],
          ]}
        />
      </Paper>
    </Stack>
  );
}
