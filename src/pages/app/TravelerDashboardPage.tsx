import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Divider,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import {
  IconChartBar,
  IconMap,
  IconMapPin,
  IconPlane,
  IconPlus,
  IconStar,
  IconUserShare,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { colors } from '../../theme';

const TEAL = '#20B2AA';
const NAVY_REFERRAL = '#0A192F';

const trendWeeks = [18, 32, 24, 40, 28, 45, 36];

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

function SmallStat({ label, value, rating }: { label: string; value: string; rating?: boolean }) {
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

function ActiveTripCard() {
  return (
    <Card withBorder radius="md" p="lg" h="100%">
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
                LHR → JFK
              </Title>
              <Text fz={13} c={colors.mutedText}>
                British Airways · BA117
              </Text>
            </div>
          </Group>
        </div>
        <Badge variant="light" color="teal" size="lg" radius="sm">
          In transit
        </Badge>
      </Group>
      <Group gap="xs" c={colors.mutedText} fz={13} mb="md">
        <IconMapPin size={14} />
        <Text>Departs May 12 · Arrives May 12 · 1 matched request</Text>
      </Group>
      <Text fz={12} c={colors.subtleText} mb={6}>
        Trip progress
      </Text>
      <Progress value={62} size="md" color="brandTeal" radius="md" />
    </Card>
  );
}

function WalletCard() {
  return (
    <Card withBorder radius="md" p="lg">
      <Text fz={11} tt="uppercase" fw={700} c={colors.subtleText}>
        Wallet
      </Text>
      <Text fz={32} fw={800} c={colors.navyDeep} mt={4}>
        $1,250.00
      </Text>
      <Text fz={13} c={colors.mutedText} mt={4}>
        Available to withdraw
      </Text>
      <Button
        fullWidth
        mt="md"
        variant="outline"
        color="brandTeal"
        component={Link}
        to="/app/wallet/history"
      >
        Withdraw
      </Button>
    </Card>
  );
}

function MapWidget() {
  return (
    <Card withBorder radius="md" p={0} style={{ overflow: 'hidden' }} h={260}>
      <Box
        p="md"
        style={{
          background: `linear-gradient(160deg, ${colors.inputBg} 0%, #dce8f5 100%)`,
          minHeight: 220,
          position: 'relative',
        }}
      >
        <Group justify="space-between" mb="sm">
          <Text fw={700} fz={14} c={colors.navyDeep}>
            Your routes
          </Text>
          <IconMap size={18} color={colors.slate} />
        </Group>
        <svg viewBox="0 0 320 140" width="100%" height={140} style={{ display: 'block' }}>
          <defs>
            <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={colors.gradientFrom} />
              <stop offset="100%" stopColor={colors.gradientTo} />
            </linearGradient>
          </defs>
          <circle cx="48" cy="100" r="6" fill={colors.navyDeep} />
          <circle cx="272" cy="40" r="6" fill={TEAL} />
          <path
            d="M 54 96 Q 160 20 266 44"
            fill="none"
            stroke="url(#arcGrad)"
            strokeWidth="3"
            strokeLinecap="round"
          />
          <text x="40" y="122" fontSize="10" fill={colors.mutedText}>
            LHR
          </text>
          <text x="252" y="58" fontSize="10" fill={colors.mutedText}>
            JFK
          </text>
        </svg>
      </Box>
    </Card>
  );
}

function SavingsTrend() {
  return (
    <Card withBorder radius="md" p="lg" h="100%">
      <Group justify="space-between" mb="md">
        <Text fw={700} fz={14} c={colors.navyDeep}>
          Savings trend
        </Text>
        <IconChartBar size={18} color={colors.slate} />
      </Group>
      <Group align="flex-end" gap={8} h={140} justify="space-between" px={4}>
        {trendWeeks.map((h, i) => (
          <Box
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: 8,
              background: `linear-gradient(180deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
              opacity: 0.65 + i * 0.04,
              minHeight: 24,
            }}
          />
        ))}
      </Group>
      <Group justify="space-between" mt="sm" fz={11} c={colors.subtleText}>
        <Text>Mon</Text>
        <Text>Sun</Text>
      </Group>
    </Card>
  );
}

function UpcomingRequests() {
  const rows = [
    { name: 'Alex M.', route: 'Documents · 0.8 kg', offer: '$85' },
    { name: 'Sam R.', route: 'Electronics · 2 kg', offer: '$210' },
  ];
  return (
    <Card withBorder radius="md" p="lg">
      <Text fw={700} fz={16} c={colors.navyDeep} mb="md">
        Upcoming requests
      </Text>
      <Stack gap={0}>
        {rows.map((r, i) => (
          <Box key={r.name}>
            {i > 0 ? <Divider my="md" /> : null}
            <Group justify="space-between" align="flex-start" wrap="nowrap">
              <Group gap="sm">
                <Avatar radius="xl" color="brandTeal">
                  {r.name.charAt(0)}
                </Avatar>
                <div>
                  <Text fw={600} fz={14}>
                    {r.name}
                  </Text>
                  <Text fz={13} c={colors.mutedText}>
                    {r.route}
                  </Text>
                </div>
              </Group>
              <Text fw={700} fz={14} c={TEAL}>
                {r.offer}
              </Text>
            </Group>
            <Group gap="sm" mt="sm">
              <Button size="xs" variant="light" color="teal">
                Accept
              </Button>
              <Button size="xs" variant="default">
                Decline
              </Button>
            </Group>
          </Box>
        ))}
      </Stack>
    </Card>
  );
}

function ReferralCard() {
  return (
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
          <ThemeIconPlaceholder />
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
  );
}

function ThemeIconPlaceholder() {
  return (
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
  );
}

export function TravelerDashboardPage() {
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
          <ActiveTripCard />
        </Box>
        <Stack gap="md">
          <WalletCard />
          <Group grow>
            <SmallStat label="Total trips" value="24" />
            <SmallStat label="Rating" value="4.8" rating />
          </Group>
        </Stack>
      </SimpleGrid>

      <UpcomingRequests />

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <MapWidget />
        <SavingsTrend />
      </SimpleGrid>

      <ReferralCard />
    </Stack>
  );
}
