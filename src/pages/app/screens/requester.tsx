import {
  ActionIcon,
  Affix,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Checkbox,
  Divider,
  FileInput,
  Grid,
  Group,
  Image,
  Menu,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Tabs,
  Text,
  Textarea,
  TextInput,
  Timeline,
  TimelineItem,
  Title,
  UnstyledButton,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import {
  IconBasket,
  IconCheck,
  IconDotsVertical,
  IconMapPin,
  IconPackage,
  IconPhotoUp,
  IconPlus,
  IconSend,
  IconStar,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, marketplaceUi as MU, requesterUi as RQ } from '../../../theme';
import { PageIntro, ShellCard, StatusBadge } from './shared';

function OrderSummaryPanel({
  variant,
  title,
  lines,
}: {
  variant: 'standard' | 'community';
  title: string;
  lines: { label: string; value: string }[];
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
            $88.50
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
  const summaryLines = [
    { label: 'Category', value: 'Community support' },
    { label: 'Pickup', value: 'Whole Foods · Chelsea' },
    { label: 'Drop-off', value: 'Home · SW3' },
    { label: 'Window', value: 'Today · 4–6 PM' },
  ];

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Post support request
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Request grocery or essential runs from verified community travelers.
        </Text>
      </Box>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper radius="md" p="lg" withBorder shadow="xs">
            <Stack gap="md">
              <TextInput label="Item name" placeholder="e.g. Weekly groceries" required />
              <TextInput
                label="Delivery from"
                placeholder="Store or pickup address"
                leftSection={<IconMapPin size={16} />}
                required
              />
              <TextInput
                label="Delivery to"
                placeholder="Your address"
                leftSection={<IconMapPin size={16} />}
                required
              />
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <TextInput label="Preferred date" type="date" required />
                <TextInput label="Time window" placeholder="4:00 PM – 6:00 PM" />
              </SimpleGrid>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <OrderSummaryPanel variant="community" title="Order summary" lines={summaryLines} />
          <Button
            component={Link}
            to="/app/requester/requests/review"
            fullWidth
            mt="md"
            size="md"
            radius="md"
            styles={{ root: { background: RQ.standardBlue } }}
          >
            Post support request
          </Button>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function RequesterPostDeliveryPage() {
  const summaryLines = [
    { label: 'Item', value: 'Laptop sleeve' },
    { label: 'Route', value: 'JFK → CDG' },
    { label: 'Weight', value: '1.8 kg' },
    { label: 'Dims (L×W×H)', value: '40 × 30 × 8 cm' },
  ];

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Post delivery request
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Describe your parcel so travelers can gauge fit and price accurately.
        </Text>
      </Box>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper radius="md" p="lg" withBorder shadow="xs">
            <Stack gap="md">
              <FileInput
                label="Upload image"
                placeholder="Click to upload parcel photo"
                accept="image/*"
                clearable
                leftSection={<IconPhotoUp size={18} />}
              />
              <TextInput label="Item title" placeholder="Brief name" required />
              <SimpleGrid cols={3} spacing="sm">
                <NumberInput label="Length (cm)" min={1} defaultValue={40} />
                <NumberInput label="Width (cm)" min={1} defaultValue={30} />
                <NumberInput label="Height (cm)" min={1} defaultValue={8} />
              </SimpleGrid>
              <NumberInput label="Weight (kg)" min={0.1} step={0.1} defaultValue={1.8} decimalScale={1} />
              <SimpleGrid cols={{ base: 1, sm: 2 }}>
                <TextInput label="Pickup city" placeholder="Airport / city" required />
                <TextInput label="Destination city" required />
              </SimpleGrid>
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 5 }}>
          <OrderSummaryPanel variant="standard" title="Order summary" lines={summaryLines} />
          <Button
            component={Link}
            to="/app/requester/requests/review"
            fullWidth
            mt="md"
            size="md"
            radius="md"
            styles={{ root: { background: RQ.standardBlue } }}
          >
            Post delivery request
          </Button>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

function CitySkylineFooter() {
  return (
    <Box
      mt="lg"
      h={100}
      style={{
        borderRadius: 12,
        background: `linear-gradient(180deg, #dbe7f5 0%, ${colors.navyDeep} 100%)`,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg viewBox="0 0 400 80" preserveAspectRatio="none" width="100%" height="100%" style={{ display: 'block' }}>
        <rect x="0" y="40" width="40" height="40" fill="rgba(255,255,255,0.15)" />
        <rect x="50" y="25" width="35" height="55" fill="rgba(255,255,255,0.12)" />
        <rect x="95" y="35" width="45" height="45" fill="rgba(255,255,255,0.18)" />
        <rect x="150" y="20" width="30" height="60" fill="rgba(255,255,255,0.14)" />
        <rect x="190" y="45" width="55" height="35" fill="rgba(255,255,255,0.1)" />
        <rect x="255" y="30" width="40" height="50" fill="rgba(255,255,255,0.16)" />
        <rect x="305" y="38" width="50" height="42" fill="rgba(255,255,255,0.11)" />
        <rect x="365" y="48" width="35" height="32" fill="rgba(255,255,255,0.13)" />
      </svg>
    </Box>
  );
}

export function RequesterReviewRequestPage() {
  return (
    <Box
      style={{
        background: RQ.pageGray,
        margin: 'calc(-1 * var(--mantine-spacing-md))',
        padding: 'var(--mantine-spacing-xl) var(--mantine-spacing-md)',
        minHeight: 'calc(100vh - 120px)',
      }}
    >
      <Paper maw={520} mx="auto" p="xl" radius="lg" shadow="md">
        <Title order={3} ta="center" fz={20} c={colors.navyDeep}>
          Review your request
        </Title>
        <Text ta="center" fz={14} c={colors.mutedText} mt="xs" mb="lg">
          Confirm pickup, drop-off, and pricing before posting.
        </Text>
        <Stack gap="sm">
          <Group justify="space-between">
            <Text fz={14} c={colors.mutedText}>
              Item
            </Text>
            <Text fw={600}>Laptop sleeve · 1.8 kg</Text>
          </Group>
          <Group justify="space-between">
            <Text fz={14} c={colors.mutedText}>
              Pickup
            </Text>
            <Text fw={600}>JFK area</Text>
          </Group>
          <Group justify="space-between">
            <Text fz={14} c={colors.mutedText}>
              Drop-off
            </Text>
            <Text fw={600}>Paris (CDG)</Text>
          </Group>
          <Divider />
          <Group justify="space-between">
            <Text fw={700}>Total</Text>
            <Text fw={800} fz={22} c={RQ.standardBlue}>
              $186.00
            </Text>
          </Group>
        </Stack>
        <CitySkylineFooter />
        <Button
          component={Link}
          to="/app/requester/requests"
          fullWidth
          mt="xl"
          size="md"
          radius="md"
          styles={{ root: { background: RQ.standardBlue } }}
        >
          Post request
        </Button>
      </Paper>
    </Box>
  );
}

const requestRows = [
  {
    id: 'RQ-1092',
    item: 'Laptop sleeve',
    status: 'In Progress' as const,
    date: 'May 2, 2026',
  },
  {
    id: 'RQ-1088',
    item: 'Gift box',
    status: 'Pending' as const,
    date: 'Apr 28, 2026',
  },
  {
    id: 'RQ-1042',
    item: 'Documents',
    status: 'Completed' as const,
    date: 'Mar 11, 2026',
  },
  {
    id: 'RQ-0991',
    item: 'Fragile ceramics',
    status: 'Cancelled' as const,
    date: 'Feb 02, 2026',
  },
];

export function RequesterRequestsListPage() {
  return (
    <Stack gap="lg" pb={48}>
      <PageIntro
        title="My requests"
        subtitle="Track status, dates, and next actions for every request."
        actions={
          <Button
            component={Link}
            to="/app/requester/select-type"
            leftSection={<IconPackage size={16} />}
            radius="md"
            styles={{ root: { background: RQ.standardBlue } }}
          >
            New request
          </Button>
        }
      />

      <TabsRequestTable />
    </Stack>
  );
}

function TabsRequestTable() {
  const [tab, setTab] = useState<string | null>('active');

  const filter = (s: string) => {
    if (s === 'active') return requestRows.filter((r) => r.status === 'In Progress' || r.status === 'Pending');
    if (s === 'completed') return requestRows.filter((r) => r.status === 'Completed');
    return requestRows.filter((r) => r.status === 'Cancelled');
  };

  return (
    <ShellCard>
      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="active">Active</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="cancelled">Cancelled</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="active" pt="md">
          <RequestTable rows={filter('active')} />
        </Tabs.Panel>
        <Tabs.Panel value="completed" pt="md">
          <RequestTable rows={filter('completed')} />
        </Tabs.Panel>
        <Tabs.Panel value="cancelled" pt="md">
          <RequestTable rows={filter('cancelled')} />
        </Tabs.Panel>
      </Tabs>
    </ShellCard>
  );
}

function RequestTable({
  rows,
}: {
  rows: { id: string; item: string; status: typeof requestRows[number]['status']; date: string }[];
}) {
  if (!rows.length) {
    return (
      <Text c={colors.mutedText} fz={14}>
        Nothing in this tab yet.
      </Text>
    );
  }

  return (
    <Table striped highlightOnHover verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          <Table.Th>Request ID</Table.Th>
          <Table.Th>Item name</Table.Th>
          <Table.Th>Status</Table.Th>
          <Table.Th>Date</Table.Th>
          <Table.Th ta="right">Action</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((r) => (
          <Table.Tr key={r.id}>
            <Table.Td>{r.id}</Table.Td>
            <Table.Td>
              <Text fz={14} fw={500}>
                {r.item}
              </Text>
            </Table.Td>
            <Table.Td>
              <StatusBadge status={r.status} />
            </Table.Td>
            <Table.Td>{r.date}</Table.Td>
            <Table.Td ta="right">
              <Menu shadow="md" width={160}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDotsVertical size={18} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item component={Link} to="/app/requester/requests/detail">
                    View
                  </Menu.Item>
                  <Menu.Item component={Link} to="/app/requester/requests/edit">
                    Edit
                  </Menu.Item>
                  <Menu.Item color="red">Cancel</Menu.Item>
                </Menu.Dropdown>
              </Menu>
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export function RequesterRequestDetailPage() {
  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Box>
          <Title order={2} fz={24} c={colors.navyDeep}>
            Request details
          </Title>
          <Text fz={14} c={colors.mutedText} mt={6}>
            RQ-1092 · Laptop sleeve · JFK → CDG
          </Text>
        </Box>
        <Group>
          <Button component={Link} to="/app/requester/requests/edit" variant="outline">
            Edit
          </Button>
          <Button component={Link} to="/app/checkout" styles={{ root: { background: RQ.standardBlue } }}>
            Pay & book
          </Button>
        </Group>
      </Group>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper radius="md" p="lg" withBorder>
            <Text fw={700} mb="md">
              Timeline
            </Text>
            <Timeline active={1} bulletSize={26} lineWidth={2}>
              <TimelineItem bullet={<IconCheck size={14} />} title="Request posted" color="teal">
                <Text fz={13} c={colors.mutedText}>
                  May 4, 09:42 AM
                </Text>
              </TimelineItem>
              <TimelineItem bullet={<IconCheck size={14} />} title="Match found" color="blue">
                <Text fz={13} c={colors.mutedText}>
                  Aisha K. · $165 offer
                </Text>
              </TimelineItem>
              <TimelineItem title="Picked up" color="gray">
                <Text fz={13} c={colors.subtleText}>
                  Pending traveler update
                </Text>
              </TimelineItem>
            </Timeline>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md">
            <Paper radius="md" p="lg" withBorder>
              <Group>
                <Avatar size={56} radius="xl" color="brandTeal">
                  AK
                </Avatar>
                <div>
                  <Text fw={700} fz={18}>
                    Aisha K.
                  </Text>
                  <Group gap={4}>
                    <IconStar size={16} fill={RQ.communityMint} color={RQ.communityMint} />
                    <Text fz={14} fw={600}>
                      4.9 · 128 trips
                    </Text>
                  </Group>
                </div>
              </Group>
            </Paper>

            <Paper radius="md" p="md" withBorder bg={colors.inputBg}>
              <Text fw={700} fz={14} mb="sm">
                Chat
              </Text>
              <Stack gap="sm">
                <Paper p="sm" radius="md" withBorder bg="white">
                  <Text fz={13}>
                    Hi! I can pick up at T4 Friday morning. Does that work?
                  </Text>
                  <Text fz={11} c={colors.subtleText} mt={4}>
                    Aisha · 10:18 AM
                  </Text>
                </Paper>
                <Group align="flex-end" wrap="nowrap">
                  <TextInput
                    placeholder="Type a message…"
                    style={{ flex: 1 }}
                    radius="md"
                  />
                  <ActionIcon size={36} radius="md" variant="filled" color={RQ.standardBlue}>
                    <IconSend size={18} />
                  </ActionIcon>
                </Group>
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function RequesterEditRequestPage() {
  const [confirmOpen, { open: openConfirm, close: closeConfirm }] = useDisclosure(false);

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Edit request
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Updates may reset active matches — confirm before saving.
        </Text>
      </Box>

      <ShellCard>
        <Stack gap="md">
          <NumberInput label="Max payout (USD)" defaultValue={186} min={0} />
          <Textarea label="Updated notes" minRows={3} placeholder="Changes to timing, size, or contents…" />
          <Button
            onClick={openConfirm}
            styles={{ root: { background: RQ.communityMint } }}
            radius="md"
          >
            Save updates
          </Button>
        </Stack>
      </ShellCard>

      <Modal opened={confirmOpen} onClose={closeConfirm} centered radius="md" title="Confirm edit">
        <Stack gap="md">
          <Text fz={14} c={colors.mutedText}>
            Are you sure you want to edit? Matched travelers may need to re-confirm pricing and timing.
          </Text>
          <Group grow>
            <Button variant="outline" color="red" onClick={closeConfirm}>
              Cancel
            </Button>
            <Button
              component={Link}
              to="/app/requester/requests/detail"
              onClick={closeConfirm}
              styles={{ root: { background: RQ.communityMint } }}
            >
              Confirm
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Stack>
  );
}

const tripSearchResults = [
  {
    name: 'Marcus Holt',
    initials: 'MH',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&q=70',
    route: 'JFK → MAD',
    when: 'May 18 · 08:05',
    price: '$12.00',
  },
  {
    name: 'Yuki Tanaka',
    initials: 'YT',
    route: 'SFO → NRT',
    when: 'May 21 · 13:45',
    price: '$18.50',
  },
  {
    name: 'Aisha Khalil',
    initials: 'AK',
    route: 'LHR → JFK',
    when: 'Jun 03 · 19:30',
    price: '$42.00',
  },
];

export function RequesterBrowseTripsPage() {
  return (
    <Box pb={96}>
      <Stack gap="md" mb="lg">
        <div>
          <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
            Browse trips
          </Title>
          <Text fz={15} c={colors.mutedText} mt={4}>
            Published routes from verified travelers matching your corridors.
          </Text>
        </div>
      </Stack>

      <Paper radius="md" p="md" withBorder mb="lg" shadow="xs" bg="#fff">
        <Group align="flex-end" gap="sm" wrap="wrap" grow>
          <TextInput label="From" placeholder="Airport / city" style={{ flex: '1 1 120px', minWidth: 100 }} />
          <TextInput label="To" placeholder="Airport / city" style={{ flex: '1 1 120px', minWidth: 100 }} />
          <TextInput label="Date" type="date" style={{ flex: '1 1 140px', minWidth: 120 }} />
          <TextInput label="Weight" placeholder="kg" style={{ flex: '1 1 80px', minWidth: 70 }} />
          <Button radius="md" styles={{ root: { background: MU.teal } }}>
            Search
          </Button>
        </Group>
      </Paper>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 3 }}>
          <Paper radius="md" p="md" withBorder shadow="xs" bg="#fff" style={{ position: 'sticky', top: 88 }}>
            <Group justify="space-between" mb="md">
              <Text fw={700} fz={14}>
                Filters
              </Text>
              <Anchor fz={13} styles={{ root: { color: MU.teal } }}>
                Clear all
              </Anchor>
            </Group>
            <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText} mb={8}>
              Trip status
            </Text>
            <Stack gap="xs" mb="md">
              <Checkbox defaultChecked label="Active" color="brandTeal" styles={{ label: { fontSize: 14 } }} />
              <Checkbox label="Almost full" color="brandTeal" styles={{ label: { fontSize: 14 } }} />
              <Checkbox label="New" color="brandTeal" styles={{ label: { fontSize: 14 } }} />
            </Stack>
            <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText} mb={8}>
              Vehicle type
            </Text>
            <Stack gap="xs">
              <Checkbox defaultChecked label="Personal" color="brandTeal" styles={{ label: { fontSize: 14 } }} />
              <Checkbox label="Commercial" color="brandTeal" styles={{ label: { fontSize: 14 } }} />
            </Stack>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 9 }}>
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="md">
            {tripSearchResults.map((t) => (
              <Paper key={t.route + t.when} radius="md" p="lg" withBorder shadow="xs" bg="#fff">
                <Group gap="sm" mb="md">
                  <Avatar src={t.avatar} radius="xl" size={44} color="brandTeal">
                    {t.avatar ? undefined : t.initials}
                  </Avatar>
                  <div>
                    <Text fw={700} fz={15}>
                      {t.name}
                    </Text>
                    <Text fz={13} fw={600} c={colors.navyDeep}>
                      {t.route}
                    </Text>
                  </div>
                </Group>
                <Text fz={12} c={colors.mutedText} mb={4}>
                  {t.when}
                </Text>
                <Group justify="space-between" mt="lg" wrap="nowrap" align="center">
                  <Text fw={800} fz={18} c={MU.teal}>
                    {t.price}
                  </Text>
                  <Button component={Link} to="/app/booking/confirm" size="xs" radius="md" styles={{ root: { background: MU.teal } }}>
                    Book
                  </Button>
                </Group>
              </Paper>
            ))}
          </SimpleGrid>
          <Group justify="center" mt="xl">
            <Pagination total={8} siblings={1} size="sm" />
          </Group>
        </Grid.Col>
      </Grid>

      <Affix position={{ bottom: 32, right: 32 }}>
        <ActionIcon
          component={Link}
          to="/app/requester/select-type"
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

export function RequesterMatchDetailPage() {
  const imgSrc = 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800&q=80';

  return (
    <Stack gap="lg" pb={48}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Request match details
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Review the listing, corridor, and requester reputation before booking.
        </Text>
      </Box>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md">
            <Paper radius="md" withBorder p={0} style={{ overflow: 'hidden' }}>
              <Image alt="Parcel" fit="cover" h={340} src={imgSrc} />
            </Paper>
            <Paper radius="md" p="lg" withBorder shadow="xs">
              <Text fw={700} fz={16} mb="sm">
                Request summary
              </Text>
              <SimpleGrid cols={2} spacing="sm">
                <div>
                  <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
                    Weight
                  </Text>
                  <Text fz={14}>1.9 kg</Text>
                </div>
                <div>
                  <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
                    Dimensions
                  </Text>
                  <Text fz={14}>40 × 30 × 8 cm</Text>
                </div>
                <div>
                  <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
                    Pickup window
                  </Text>
                  <Text fz={14}>May 12–14 AM</Text>
                </div>
                <div>
                  <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
                    Delivery by
                  </Text>
                  <Text fz={14}>May 16 EOD Paris</Text>
                </div>
              </SimpleGrid>
            </Paper>
            <Paper radius="md" withBorder p={0} h={220} style={{ overflow: 'hidden' }}>
              <Box
                h="100%"
                style={{
                  background: `linear-gradient(135deg,#dfe9f5 0%,#c9daf0 50%, ${colors.inputBg} 100%)`,
                  position: 'relative',
                }}
              >
                <svg width="100%" height="120" style={{ marginTop: 48 }}>
                  <defs>
                    <linearGradient id="lg1" x1="0%" y1="0%" x2="100%" y2="0%">
                      <stop offset="0%" stopColor={MU.teal} />
                      <stop offset="100%" stopColor="#60a5fa" />
                    </linearGradient>
                  </defs>
                  <circle cx="80" cy="60" r="8" fill={colors.navyDeep} />
                  <circle cx="400" cy="40" r="8" fill={MU.teal} />
                  <path
                    d="M 88 62 Q 240 110 392 42"
                    fill="none"
                    stroke="url(#lg1)"
                    strokeWidth={4}
                    strokeLinecap="round"
                  />
                </svg>
                <Group pos="absolute" bottom={14} gap="xl" px="xl">
                  <Group gap={6}>
                    <IconMapPin size={16} />
                    <Text fz={13}>Pickup · JFK T4</Text>
                  </Group>
                  <Group gap={6}>
                    <IconMapPin size={16} color={MU.teal} />
                    <Text fz={13}>Drop · CDG</Text>
                  </Group>
                </Group>
              </Box>
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 5 }}>
          <Stack gap="md">
            <Paper radius="md" p="lg" withBorder shadow="xs" style={{ position: 'sticky', top: 88 }}>
              <Group justify="space-between" mb={4}>
                <Text fw={800} fz={18}>
                  Delivery request
                </Text>
                <Badge variant="light" color="teal">
                  Verified
                </Badge>
              </Group>
              <Text fz={22} fw={800} mb="xs">
                MacBook Pro 13&quot;
              </Text>
              <Text fz={13} c={colors.mutedText} mb="md">
                Listed by traveler · escrow protected
              </Text>
              <Divider />
              <Group justify="space-between" mt="md">
                <Text fz={14}>Traveler payout</Text>
                <Text fw={700}>$154.50</Text>
              </Group>
              <Group justify="space-between" mt="xs">
                <Text fz={14}>Platform fee</Text>
                <Text fw={700}>$18.50</Text>
              </Group>
              <Group justify="space-between" mt="md">
                <Text fw={800}>You pay</Text>
                <Text fw={800} fz={22} c={MU.teal}>
                  $173.00
                </Text>
              </Group>
              <Button
                component={Link}
                to="/app/booking/confirm"
                fullWidth
                mt="lg"
                radius="md"
                styles={{ root: { background: MU.teal } }}
              >
                Book request
              </Button>

              <Paper mt="xl" radius="md" withBorder p="sm" bg={colors.inputBg}>
                <Text fz={11} fw={700} tt="uppercase" c={colors.subtleText} mb={8}>
                  Requester profile
                </Text>
                <Group>
                  <Avatar radius="xl">JP</Avatar>
                  <div>
                    <Text fw={700}>Jordan P.</Text>
                    <Group gap={4}>
                      <IconStar size={14} fill={MU.teal} color={MU.teal} />
                      <Text fz={13}>4.8 · Member since 2024</Text>
                    </Group>
                  </div>
                </Group>
              </Paper>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
