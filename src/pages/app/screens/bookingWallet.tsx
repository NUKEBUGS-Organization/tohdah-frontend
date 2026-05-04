import {
  ActionIcon,
  Affix,
  Alert,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  NumberInput,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import {
  IconBrandFacebook,
  IconBrandInstagram,
  IconBrandMastercard,
  IconBrandVisa,
  IconHeartHandshake,
  IconLock,
  IconPlus,
  IconShieldCheck,
  IconStar,
} from '@tabler/icons-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { colors, marketplaceUi as MU, paymentUi as PU } from '../../../theme';
import { MockTable, ShellCard, StatusBadge } from './shared';

const tealBtn = {
  styles: { root: { background: MU.teal, border: 'none' } },
} as const;

function MarketplaceStepBar({ activeStep }: { activeStep: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Offer' },
    { n: 2, label: 'Pay' },
    { n: 3, label: 'Done' },
  ] as const;
  return (
    <Group gap={0} justify="center" wrap="nowrap" mb="xl">
      {steps.map((s, i) => (
        <Group key={s.n} gap={0} wrap="nowrap" align="center">
          <Box
            w={36}
            h={36}
            style={{
              borderRadius: '50%',
              background: activeStep >= s.n ? MU.teal : MU.pageBg,
              color: activeStep >= s.n ? '#fff' : colors.subtleText,
              border: `2px solid ${activeStep >= s.n ? MU.teal : colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontWeight: 800,
              fontSize: 14,
            }}
          >
            {s.n}
          </Box>
          {i < steps.length - 1 ? (
            <Box
              w={32}
              miw={20}
              h={4}
              mx={4}
              style={{
                borderRadius: 2,
                background:
                  activeStep > s.n ? MU.teal : `color-mix(in srgb, ${MU.teal} 35%, ${MU.pageBg})`,
              }}
            />
          ) : null}
        </Group>
      ))}
    </Group>
  );
}

/** Full-page modal treatment: dimmed blurred backdrop + centered card */
export function BookingConfirmPage() {
  return (
    <Box style={{ margin: 'calc(-1 * var(--mantine-spacing-md))', minHeight: 'calc(100vh - 96px)' }}>
      <Box
        pos="relative"
        style={{
          minHeight: 'calc(100vh - 96px)',
          background: MU.pageBg,
        }}
      >
        <Box
          pos="absolute"
          inset={0}
          style={{
            backdropFilter: 'blur(6px)',
            background: 'rgba(15, 23, 42, 0.45)',
          }}
        />
        <Box pos="relative" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 'calc(100vh - 140px)', padding: 16 }}>
          <Paper radius="lg" shadow="xl" p="xl" maw={480} w="100%" withBorder>
            <MarketplaceStepBar activeStep={2} />
            <Title order={3} ta="center" fz={22} mb="xs">
              Confirm your delivery offer
            </Title>
            <Text ta="center" fz={13} c={colors.mutedText} mb="lg">
              Set your payout to the traveler. Payment is authorized but held until milestones are met.
            </Text>
            <NumberInput
              label="Delivery offer"
              prefix="$"
              defaultValue={186}
              decimalScale={2}
              thousandSeparator=","
              min={1}
              radius="md"
              mb="lg"
            />
            <Stack gap="sm">
              <Button component={Link} to="/app/checkout" radius="md" {...tealBtn} fullWidth>
                Confirm & pay
              </Button>
              <Button component={Link} to="/app/requester/matches/detail" variant="outline" radius="md" fullWidth styles={{ root: { borderColor: MU.teal, color: MU.teal } }}>
                Cancel
              </Button>
            </Stack>
            <Divider label="Parties" labelPosition="center" my="xl" />
            <Group justify="center" gap="xl" wrap="wrap">
              <Group gap="sm">
                <Avatar radius="xl" src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=120&q=70" />
                <div>
                  <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText}>
                    Sender
                  </Text>
                  <Text fz={14} fw={600}>
                    Jordan P.
                  </Text>
                </div>
              </Group>
              <Group gap="sm">
                <Avatar radius="xl" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&q=70" />
                <div>
                  <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText}>
                    Courier
                  </Text>
                  <Text fz={14} fw={600}>
                    Aisha K.
                  </Text>
                </div>
              </Group>
            </Group>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export function BookingReceiptPage() {
  const activities = [
    { title: 'Payment confirmed', sub: 'May 5, 09:41 AM · Escrow funded' },
    { title: 'Booking created', sub: 'May 5, 09:39 AM · Reference issued' },
  ];

  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <div>
          <Group gap="md" align="center">
            <Title order={2} fz={24} c={colors.navyDeep}>
              Booking ID #TH-80254
            </Title>
            <Badge variant="light" color="teal">
              Paid
            </Badge>
          </Group>
          <Text fz={14} c={colors.mutedText} mt={6}>
            Receipt generated May 6, 2026 · Paid with Visa ·4242
          </Text>
        </div>
        <Group>
          <Button variant="default" radius="md">
            Download PDF
          </Button>
          <Button variant="light" color="brandTeal" radius="md">
            Email receipt
          </Button>
        </Group>
      </Group>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
        <Paper withBorder radius="md" p="lg" shadow="xs">
          <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText} mb="md">
            Sender
          </Text>
          <Group>
            <Avatar size={52} radius="xl" />
            <div>
              <Text fw={700}>Jordan P.</Text>
              <Text fz={13} c={colors.mutedText}>
                jordan.p@example.com
              </Text>
              <Button variant="light" size="xs" mt="xs" radius="md" color="gray">
                Contact
              </Button>
            </div>
          </Group>
        </Paper>
        <Paper withBorder radius="md" p="lg" shadow="xs">
          <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText} mb="md">
            Courier
          </Text>
          <Group>
            <Avatar size={52} radius="xl" color="brandTeal">
              AK
            </Avatar>
            <div>
              <Text fw={700}>Aisha K.</Text>
              <Group gap={4}>
                <IconStar size={14} fill={MU.teal} color={MU.teal} />
                <Text fz={13} fw={600}>
                  4.9 · Trusted traveler
                </Text>
              </Group>
              <Button variant="light" size="xs" mt="xs" radius="md" color="gray">
                Message
              </Button>
            </div>
          </Group>
        </Paper>
      </SimpleGrid>

      <Paper withBorder radius="md" p="lg" shadow="xs">
        <Grid gap="lg">
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box
              style={{
                aspectRatio: '4/3',
                borderRadius: 12,
                overflow: 'hidden',
                border: `1px solid ${colors.border}`,
              }}
            >
              <Box
                h="100%"
                style={{
                  background:
                    'url(https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=600&q=80) center/cover',
                }}
              />
            </Box>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Text fw={700} fz={18}>
              MacBook Pro 13&quot;
            </Text>
            <Text fz={14} c={colors.mutedText} mt={8}>
              1.9 kg · Classified fragile · Carry-on compliant
            </Text>
          </Grid.Col>
        </Grid>
      </Paper>

      <Paper withBorder radius="md" p="lg" shadow="xs">
        <Text fw={700} mb="md">
          Fulfillment timeline
        </Text>
        <SimpleGrid cols={{ base: 1, sm: 2 }} spacing={0}>
          <Stack gap={4}>
            <Text fz={12} fw={700} c={MU.teal}>
              Pickup
            </Text>
            <Text fz={14}>May 14 · Terminal 4, JFK</Text>
          </Stack>
          <Stack gap={4}>
            <Text fz={12} fw={700} c={colors.slate}>
              Delivery
            </Text>
            <Text fz={14}>May 15 · CDG arrivals</Text>
          </Stack>
        </SimpleGrid>
        <Box mt="lg" mx="xs">
          <Box h={6} style={{ borderRadius: 4, background: MU.pageBg, position: 'relative' }}>
            <Box
              w="55%"
              h="100%"
              style={{ borderRadius: 4, background: `linear-gradient(90deg, ${MU.teal}, #3b82f6)` }}
            />
          </Box>
          <Group justify="space-between" mt={8}>
            <Text fz={11} c={colors.subtleText}>
              In transit
            </Text>
            <Text fz={11} c={colors.subtleText}>
              ETA May 15
            </Text>
          </Group>
        </Box>
      </Paper>

      <Paper withBorder radius="md" p="lg" shadow="xs">
        <Text fw={700} mb="md">
          Payment breakdown
        </Text>
        <Stack gap="xs">
          <Group justify="space-between">
            <Text fz={14} c={colors.mutedText}>
              Service fee
            </Text>
            <Text fz={14} fw={500}>
              $24.00
            </Text>
          </Group>
          <Group justify="space-between">
            <Text fz={14} c={colors.mutedText}>
              Taxes
            </Text>
            <Text fz={14} fw={500}>
              $8.50
            </Text>
          </Group>
          <Divider />
          <Group justify="space-between">
            <Text fz={16} fw={800}>
              Total amount paid
            </Text>
            <Text fz={18} fw={800} c={MU.teal}>
              $186.00
            </Text>
          </Group>
        </Stack>
      </Paper>

      <Paper withBorder radius="md" p="lg" shadow="xs">
        <Text fw={700} mb="md">
          Activity log
        </Text>
        <Stack gap="md">
          {activities.map((a) => (
            <Group key={a.title} align="flex-start" wrap="nowrap">
              <Box w={8} h={8} mt={6} style={{ borderRadius: '50%', background: MU.teal, flexShrink: 0 }} />
              <div>
                <Text fw={600} fz={14}>
                  {a.title}
                </Text>
                <Text fz={12} c={colors.mutedText}>
                  {a.sub}
                </Text>
              </div>
            </Group>
          ))}
        </Stack>
      </Paper>
    </Stack>
  );
}

const bookingRows = [
  { id: 'TH-80254', date: 'May 5, 2026', route: 'JFK → CDG', status: 'Ongoing' as const, price: '$186' },
  { id: 'TH-79901', date: 'Apr 22, 2026', route: 'SFO → NRT', status: 'Pending' as const, price: '$412' },
  { id: 'TH-76500', date: 'Mar 01, 2026', route: 'BOS → LHR', status: 'Completed' as const, price: '$198' },
  { id: 'TH-71002', date: 'Jan 18, 2026', route: 'MIA → MAD', status: 'Cancelled' as const, price: '$120' },
];

export function BookingsListPage() {
  const [tab, setTab] = useState<string | null>('ongoing');

  const filter = (key: string) => {
    if (key === 'pending') return bookingRows.filter((b) => b.status === 'Pending');
    if (key === 'ongoing') return bookingRows.filter((b) => b.status === 'Ongoing');
    if (key === 'completed') return bookingRows.filter((b) => b.status === 'Completed');
    return bookingRows.filter((b) => b.status === 'Cancelled');
  };

  return (
    <Stack gap="lg" pb={88}>
      <Box>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          My bookings
        </Title>
        <Text fz={15} c={colors.mutedText} mt={4}>
          Track escrow, trips, and receipts in one place.
        </Text>
      </Box>

      <Tabs value={tab} onChange={setTab}>
        <Tabs.List>
          <Tabs.Tab value="pending">Pending</Tabs.Tab>
          <Tabs.Tab value="ongoing">Ongoing</Tabs.Tab>
          <Tabs.Tab value="completed">Completed</Tabs.Tab>
          <Tabs.Tab value="cancelled">Cancelled</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="pending" pt="md">
          <BookingRows rows={filter('pending')} />
        </Tabs.Panel>
        <Tabs.Panel value="ongoing" pt="md">
          <BookingRows rows={filter('ongoing')} />
        </Tabs.Panel>
        <Tabs.Panel value="completed" pt="md">
          <BookingRows rows={filter('completed')} />
        </Tabs.Panel>
        <Tabs.Panel value="cancelled" pt="md">
          <BookingRows rows={filter('cancelled')} />
        </Tabs.Panel>
      </Tabs>

      <Group justify="center" mt="md">
        <Pagination total={3} size="sm" />
      </Group>

      <Affix position={{ bottom: 32, right: 32 }}>
        <ActionIcon
          component={Link}
          to="/app/requester/select-type"
          size={56}
          radius="xl"
          variant="filled"
          style={{ background: MU.teal, boxShadow: '0 10px 25px rgba(20, 184, 166, 0.35)' }}
        >
          <IconPlus size={28} stroke={2} />
        </ActionIcon>
      </Affix>
    </Stack>
  );
}

function BookingRows({ rows }: { rows: typeof bookingRows }) {
  if (!rows.length) {
    return (
      <Text c={colors.mutedText} fz={14}>
        No bookings in this tab.
      </Text>
    );
  }
  return (
    <Stack gap="md">
      {rows.map((b) => (
        <Paper key={b.id} withBorder radius="md" p="md" shadow="xs" bg="#fff">
          <Group justify="space-between" align="center" wrap="wrap">
            <Group gap="xl" wrap="wrap">
              <div>
                <Text fw={700}>{b.id}</Text>
                <Text fz={12} c={colors.subtleText}>
                  {b.date}
                </Text>
              </div>
              <Text fw={600}>{b.route}</Text>
              <StatusBadge status={b.status === 'Cancelled' ? 'Cancelled' : b.status === 'Completed' ? 'Completed' : b.status === 'Pending' ? 'Pending' : 'Ongoing'} />
              <Text fw={700} c={MU.teal}>
                {b.price}
              </Text>
            </Group>
            <Button variant="light" color="brandTeal" size="xs" radius="md" component={Link} to="/app/booking/receipt">
              View
            </Button>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export function CheckoutPage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue, border: 'none' } } } as const;

  return (
    <Stack gap="lg" pb={48}>
      <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
        Secure checkout
      </Title>
      <Grid gap="lg">
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Paper radius="md" p="lg" withBorder shadow="sm" bg="#fff">
            <Text fw={700} fz={16} mb="md">
              Order summary
            </Text>
            <Group justify="space-between" mb="xs">
              <Text fz={14} c={colors.mutedText}>
                MacBook Pro 13 · Traveler delivery
              </Text>
              <Text fz={14} fw={600}>
                $52.00
              </Text>
            </Group>
            <Group justify="space-between" mb="xs">
              <Text fz={14} c={colors.mutedText}>
                Platform service fee
              </Text>
              <Text fz={14} fw={600}>
                $6.00
              </Text>
            </Group>
            <Divider my="sm" />
            <Group justify="space-between" mb="md">
              <Text fw={800} fz={16}>
                Total
              </Text>
              <Text fw={800} fz={22} c={colors.navyDeep}>
                $45.50
              </Text>
            </Group>
            <Alert color="green" variant="light" radius="md" title="You’re saving $12.50 on this order!">
              Matched route pricing is below typical courier quotes for this lane.
            </Alert>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Paper radius="md" p="lg" withBorder shadow="sm" bg="#fff">
            <Group gap="xs" mb="md">
              <IconShieldCheck color={PU.primaryBlue} />
              <Text fz={13} c={colors.mutedText}>
                Encrypted checkout · PCI tokenization in production
              </Text>
            </Group>
            <Text fw={700} fz={15} mb="md">
              Payment method
            </Text>
            <Stack gap="md">
              <TextInput label="Name on card" placeholder="Jordan Peralta" radius="md" />
              <TextInput label="Card number" placeholder="4242 4242 4242 4242" radius="md" />
              <Group grow>
                <TextInput label="Expiry" placeholder="MM/YY" radius="md" />
                <TextInput label="CVC" placeholder="123" radius="md" />
              </Group>
              <Group gap="xs">
                <IconLock size={16} />
                <Text fz={12} c={colors.subtleText}>
                  Charges appear as TOHDAH*ESCROW until delivery is confirmed.
                </Text>
              </Group>
              <Button component={Link} to="/app/booking/receipt" fullWidth radius="md" size="md" {...blueBtn}>
                Pay $45.50
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

export function WalletHistoryPage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue } } } as const;

  return (
    <Stack gap="lg" pb={48}>
      <div>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Transaction history
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Balances, holds, payouts, and wallet movements.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 2, md: 4 }} spacing="md">
        <Paper radius="md" p="md" withBorder shadow="xs">
          <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
            Total balance
          </Text>
          <Text fz={24} fw={800} mt={6}>
            $2,410.00
          </Text>
        </Paper>
        <Paper radius="md" p="md" withBorder shadow="xs">
          <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
            Pending
          </Text>
          <Text fz={24} fw={800} mt={6} c="orange.7">
            $186.00
          </Text>
        </Paper>
        <Paper radius="md" p="md" withBorder shadow="xs">
          <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
            Available
          </Text>
          <Text fz={24} fw={800} mt={6} c={PU.savingsGreen}>
            $1,842.00
          </Text>
        </Paper>
        <Paper radius="md" p="md" withBorder shadow="xs">
          <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
            Withdrawn
          </Text>
          <Text fz={24} fw={800} mt={6}>
            $14.2k
          </Text>
        </Paper>
      </SimpleGrid>

      <Paper radius="md" p="md" withBorder shadow="xs" bg="#fff">
        <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md" mb="md">
          <TextInput label="From date" type="date" />
          <TextInput label="To date" type="date" />
          <Select label="Status" placeholder="All" data={['All', 'Completed', 'Pending', 'Failed']} clearable />
        </SimpleGrid>
        <Button size="sm" radius="md" variant="light" {...blueBtn}>
          Apply filters
        </Button>
      </Paper>

      <ShellCard>
        <MockTable
          columns={['Date', 'Description', 'Status', 'Amount', 'Action']}
          rows={[
            [
              'May 6, 2026',
              'Trip payout · TH-80254',
              <StatusBadge key="s1" status="Completed" />,
              <Text key="a1" fw={600} c={PU.savingsGreen}>
                +$142.00
              </Text>,
              <Button key="b1" size="xs" variant="subtle" {...blueBtn}>
                Details
              </Button>,
            ],
            [
              'May 4, 2026',
              'Booking authorization hold',
              <StatusBadge key="s2" status="Pending" />,
              <Text key="a2" fw={600} c="red.7">
                -$186.00
              </Text>,
              <Button key="b2" size="xs" variant="subtle" {...blueBtn}>
                Details
              </Button>,
            ],
            [
              'Apr 28, 2026',
              'Bank withdrawal',
              <StatusBadge key="s3" status="Completed" />,
              <Text key="a3" c={colors.mutedText}>
                -$400.00
              </Text>,
              <Button key="b3" size="xs" variant="subtle" {...blueBtn}>
                Receipt
              </Button>,
            ],
          ]}
        />
      </ShellCard>
    </Stack>
  );
}

export function PaymentMethodsPage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue, border: 'none' } } } as const;

  return (
    <Stack gap={0} pb={0}>
      <Title order={2} fz={26} fw={700} mb={6} c={colors.navyDeep}>
        Payment methods
      </Title>
      <Text fz={15} c={colors.mutedText} mb="xl">
        Manage saved cards or add a new debit / credit payment method.
      </Text>

      <Grid gap="lg" pb={48}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Text fw={700} fz={16} mb="md">
            Your payment methods
          </Text>
          <Stack gap="md">
            <Paper radius="md" p="lg" withBorder shadow="xs">
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group gap="md">
                  <IconBrandVisa size={36} stroke={1.2} />
                  <div>
                    <Text fw={700}>Visa ending in 4242</Text>
                    <Text fz={13} c={colors.mutedText}>
                      Expires 09/27
                    </Text>
                  </div>
                </Group>
              </Group>
              <Switch label="Set as default" defaultChecked mt="md" color="blue" />
            </Paper>
            <Paper radius="md" p="lg" withBorder shadow="xs">
              <Group justify="space-between" align="flex-start" wrap="nowrap">
                <Group gap="md">
                  <IconBrandMastercard size={36} stroke={1.2} />
                  <div>
                    <Text fw={700}>Mastercard ending in 1881</Text>
                    <Text fz={13} c={colors.mutedText}>
                      Expires 04/26
                    </Text>
                  </div>
                </Group>
              </Group>
              <Switch label="Set as default" mt="md" color="blue" />
            </Paper>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper radius="md" p="lg" withBorder shadow="sm" bg={MU.pageBg}>
            <Text fw={700} fz={16} mb="md">
              Add new method
            </Text>
            <Stack gap="md">
              <TextInput label="Cardholder name" placeholder="Name as on card" radius="md" />
              <TextInput label="Card number" placeholder="0000 0000 0000 0000" radius="md" />
              <Group grow>
                <TextInput label="Expiry" placeholder="MM/YY" radius="md" />
                <TextInput label="CVV" placeholder="123" radius="md" />
              </Group>
              <Button radius="md" {...blueBtn}>
                Add method
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>

      <Box
        component="footer"
        py={40}
        px="md"
        mt="xl"
        style={{
          background: PU.footerNavy,
          marginLeft: 'calc(-1 * var(--mantine-spacing-md))',
          marginRight: 'calc(-1 * var(--mantine-spacing-md))',
          marginBottom: 'calc(-1 * var(--mantine-spacing-md))',
        }}
      >
        <SimpleGrid cols={{ base: 2, md: 4 }} spacing={32}>
          <div>
            <Text fw={800} fz={18} c="white">
              Tohdah
            </Text>
            <Text fz={13} mt={8} c="dimmed">
              Global traveler marketplace
            </Text>
          </div>
          <Stack gap={6}>
            <Text fz={13} fw={700} tt="uppercase" c="gray.5">
              Company
            </Text>
            <Anchor fz={13} style={{ color: 'rgba(255,255,255,0.8)' }}>
              About
            </Anchor>
            <Anchor fz={13} style={{ color: 'rgba(255,255,255,0.8)' }}>
              Careers
            </Anchor>
          </Stack>
          <Stack gap={6}>
            <Text fz={13} fw={700} tt="uppercase" c="gray.5">
              Support
            </Text>
            <Anchor fz={13} style={{ color: 'rgba(255,255,255,0.8)' }}>
              Help center
            </Anchor>
            <Anchor fz={13} style={{ color: 'rgba(255,255,255,0.8)' }}>
              Trust & safety
            </Anchor>
          </Stack>
          <Group gap="md" align="flex-end">
            <ActionIcon variant="subtle" c="gray.5" aria-label="Instagram">
              <IconBrandInstagram size={22} stroke={1.5} />
            </ActionIcon>
            <ActionIcon variant="subtle" c="gray.5" aria-label="Facebook">
              <IconBrandFacebook size={22} stroke={1.5} />
            </ActionIcon>
          </Group>
        </SimpleGrid>
      </Box>
    </Stack>
  );
}

export function CommunityWalletPage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue, border: 'none' } } } as const;

  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Box>
          <Title order={2} fz={28} fw={800} c={colors.navyDeep}>
            Community support wallet
          </Title>
          <Text fz={15} c={colors.mutedText} mt={8} maw={520}>
            Optional funding for groceries, medicine, and impact routes coordinated by travelers.
          </Text>
        </Box>
        <Box
          p="lg"
          style={{
            borderRadius: 16,
            background: `linear-gradient(135deg, rgba(37,99,235,0.12), rgba(20,184,166,0.15))`,
          }}
        >
          <IconHeartHandshake size={52} stroke={1.25} color={PU.primaryBlue} />
        </Box>
      </Group>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Paper radius="md" p="xl" withBorder shadow="xs">
            <Text fz={12} fw={700} tt="uppercase" c={colors.subtleText}>
              Wallet balance
            </Text>
            <Text fz={42} fw={900} lh={1.1} my="md">
              $540.00
            </Text>
            <Text fz={13} c={colors.mutedText} mb="lg">
              Usable toward community-impact deliveries on your routes.
            </Text>
            <NumberInput label="Add funds" prefix="$" defaultValue={25} min={5} mb="sm" radius="md" />
            <Button fullWidth radius="md" {...blueBtn}>
              Add funds
            </Button>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7 }}>
          <Stack gap="md">
            <Paper radius="md" p="lg" withBorder shadow="xs">
              <Text fw={700} fz={16} mb="md">
                Total impact
              </Text>
              <SimpleGrid cols={{ base: 2, sm: 3 }} spacing="sm">
                <Paper p="md" radius="md" bg={MU.pageBg}>
                  <Text fz={22} fw={800}>
                    128
                  </Text>
                  <Text fz={12} c={colors.mutedText}>
                    Orders funded
                  </Text>
                </Paper>
                <Paper p="md" radius="md" bg={MU.pageBg}>
                  <Text fz={22} fw={800}>
                    42
                  </Text>
                  <Text fz={12} c={colors.mutedText}>
                    Cities touched
                  </Text>
                </Paper>
                <Paper p="md" radius="md" bg={MU.pageBg}>
                  <Text fz={22} fw={800}>
                    $12.4k
                  </Text>
                  <Text fz={12} c={colors.mutedText}>
                    All-time pooled
                  </Text>
                </Paper>
              </SimpleGrid>
            </Paper>

            <Paper radius="md" p="lg" withBorder shadow="xs">
              <Text fw={700} fz={16} mb="md">
                Recent activity
              </Text>
              <Stack gap="sm">
                {[
                  ['Community grocery run · Brooklyn', '+$35.00', 'May 2'],
                  ['Student supplies · Nairobi route', '+$48.00', 'Apr 19'],
                  ['Emergency medicine · Heathrow', '+$22.50', 'Apr 04'],
                ].map(([title, amt, dt]) => (
                  <Group key={title as string} justify="space-between" py={6}>
                    <div>
                      <Text fz={14} fw={500}>
                        {title}
                      </Text>
                      <Text fz={12} c={colors.subtleText}>
                        {dt}
                      </Text>
                    </div>
                    <Text fw={700} fz={14} c={PU.savingsGreen}>
                      {amt}
                    </Text>
                  </Group>
                ))}
              </Stack>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>

      <Paper
        radius="md"
        p="xl"
        style={{
          background: `linear-gradient(90deg, ${PU.primaryBlue}, #0891b2)`,
          color: 'white',
        }}
      >
        <SimpleGrid cols={{ base: 1, md: 2 }}>
          <div>
            <Text fw={800} fz={20}>
              Double community match this June
            </Text>
            <Text fz={14} mt={8} style={{ opacity: 0.9 }}>
              Tohdah will match qualifying contributions up to $50 per traveler.
            </Text>
          </div>
          <Button
            variant="white"
            component={Link}
            to="/app/requester/browse/trips"
            fz={14}
            fw={700}
            color="dark"
            style={{ alignSelf: 'center' }}
          >
            Learn more
          </Button>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}
