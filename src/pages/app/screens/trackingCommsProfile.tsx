import {
  Accordion,
  Anchor,
  Avatar,
  Badge,
  Box,
  Button,
  Divider,
  Grid,
  Group,
  Image,
  Paper,
  Progress,
  Rating,
  ScrollArea,
  Select,
  SimpleGrid,
  Stack,
  Switch,
  Tabs,
  Text,
  Textarea,
  TextInput,
  ThemeIcon,
  Timeline,
  TimelineItem,
  Title,
  ActionIcon,
} from '@mantine/core';
import {
  IconBasket,
  IconBell,
  IconBrandLinkedin,
  IconCheck,
  IconMail,
  IconMapPin,
  IconMessage,
  IconMoodHappy,
  IconPackage,
  IconPaperclip,
  IconPhone,
  IconPhoto,
  IconPlane,
  IconPlus,
  IconShieldCheck,
  IconTrophy,
  IconUserPlus,
  IconUsers,
} from '@tabler/icons-react';
import type { CSSProperties, ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { colors, commsUi as CM, marketplaceUi as MU, paymentUi as PU } from '../../../theme';
import { MockTable } from './shared';

const navLinkStyle: CSSProperties = { color: colors.navyDeep, fontWeight: 500, fontSize: 13 };

const commsBtn = {
  styles: { root: { background: CM.teal, border: 'none', color: '#fff' } },
} as const;

const CONVERSATIONS: {
  name: string;
  last: string;
  time: string;
  avatar?: string;
  initials?: string;
}[] = [
  {
    name: 'Aisha K.',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&q=70',
    last: 'ETA updated to 18:10 — still good for handoff.',
    time: '2m ago',
  },
  {
    name: 'Tohdah Support',
    initials: 'TS',
    last: 'Ticket #4821 resolved.',
    time: '1h ago',
  },
  {
    name: 'Jordan P.',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=96&q=70',
    last: 'Thanks — see you at belt 6!',
    time: 'Yesterday',
  },
];

export function TrackingLivePage() {
  const steps = ['Order placed', 'Picked up', 'In transit', 'Out for delivery'];

  return (
    <Grid gap={{ base: 'md', xl: 'lg' }}>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper radius="md" p="lg" withBorder shadow="xs" bg="#fff">
          <Text fz={11} fw={700} tt="uppercase" c={colors.subtleText} mb="md">
            Progress
          </Text>
          <Stack gap={0}>
            {steps.map((label, i) => (
              <Group key={label} gap="sm" mb={i === steps.length - 1 ? 0 : 'lg'} wrap="nowrap" align="flex-start">
                <Box
                  w={12}
                  h={12}
                  mt={6}
                  style={{
                    borderRadius: '50%',
                    background: i <= 2 ? PU.primaryBlue : colors.border,
                    flexShrink: 0,
                  }}
                />
                <div>
                  <Text fw={700} fz={14}>
                    {label}
                  </Text>
                  <Text fz={12} c={colors.mutedText}>
                    {i === 0 && 'Thu 08:41'}
                    {i === 1 && 'Thu 09:52'}
                    {i === 2 && 'In progress'}
                    {i === 3 && 'Est. Fri 06:30'}
                  </Text>
                </div>
              </Group>
            ))}
          </Stack>
          <Divider my="lg" />
          <Button variant="outline" radius="md" component={Link} to="/app/chat/thread" leftSection={<IconMessage size={16} />}>
            Message traveler
          </Button>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 9 }}>
        <Box pos="relative" h={{ base: 360, md: 480 }} style={{ borderRadius: 12, overflow: 'hidden' }}>
          <Box
            pos="absolute"
            inset={0}
            style={{
              background:
                'radial-gradient(circle at 48% 60%, rgba(96,165,250,0.35) 0%, transparent 40%), radial-gradient(ellipse at center, #14532d 0%, #0f172a 45%, #020617 100%)',
            }}
          >
            <svg width="100%" height="70%" preserveAspectRatio="none" style={{ opacity: 0.9 }}>
              <defs>
                <linearGradient id="arcTrack" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#22d3ee" />
                  <stop offset="60%" stopColor="#3b82f6" />
                  <stop offset="100%" stopColor="#a855f7" />
                </linearGradient>
              </defs>
              <path
                d="M 8% 75% Q 52% 8% 94% 30%"
                fill="none"
                stroke="url(#arcTrack)"
                strokeWidth="4"
                strokeLinecap="round"
              />
              <circle cx="8%" cy="75%" r="7" fill="#22d3ee" />
              <circle cx="94%" cy="30%" r="7" fill="#c084fc" />
            </svg>
          </Box>

          <Text
            fz={{ base: 40, md: 56 }}
            fw={800}
            c="cyan.3"
            pos="absolute"
            top={{ base: 80, md: 120 }}
            left={0}
            right={0}
            ta="center"
            ff="ui-monospace, SFMono-Regular, monospace"
          >
            03:29:45
          </Text>
          <Text fz={13} ta="center" pos="absolute" top={{ base: 132, md: 188 }} left={0} right={0} c="rgba(226,232,240,0.75)">
            Estimated arrival at CDG
          </Text>

          <Paper
            pos="absolute"
            bottom={20}
            right={20}
            radius="md"
            p="md"
            shadow="lg"
            w={260}
          >
            <Group gap="sm">
              <Avatar src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=70" radius="xl" />
              <div>
                <Text fw={700}>Aisha K.</Text>
                <Group gap={4} fz={13}>
                  <Text fz={13} fw={600}>
                    4.9
                  </Text>
                  <Text fz={13} c={colors.mutedText}>
                    · Active trip
                  </Text>
                </Group>
              </div>
            </Group>
          </Paper>
        </Box>
      </Grid.Col>
    </Grid>
  );
}

export function TrackingCompletedPage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue, border: 'none' } } } as const;

  return (
    <Stack gap="xl" pb={48} align="center">
      <Paper
        radius="999px"
        w={112}
        h={112}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'rgba(34,197,94,0.12)',
          border: `4px solid ${PU.savingsGreen}`,
          marginTop: 16,
        }}
      >
        <IconCheck size={52} stroke={2.25} color={PU.savingsGreen} />
      </Paper>
      <Title order={2} fz={28} ta="center" c={colors.navyDeep}>
        Delivery completed!
      </Title>
      <Text ta="center" fz={15} maw={480} c={colors.mutedText}>
        Booking TH-80254 was delivered successfully. payouts release after the cooldown window.
      </Text>

      <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="lg" maw={900} w="100%">
        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Group gap={8} mb="md">
            <IconBasket size={20} />
            <Text fw={700} fz={16}>
              Leave feedback
            </Text>
          </Group>
          <Text fz={13} c={colors.mutedText} mb="sm">
            How did this delivery go?
          </Text>
          <Rating defaultValue={4} size="xl" />
          <Textarea mt="sm" label="Comments (optional)" minRows={2} />
          <Button fullWidth mt="md" radius="md" {...blueBtn} component={Link} to="/app/reviews/new">
            Submit review
          </Button>
        </Paper>

        <Paper radius="md" p="xl" withBorder shadow="xs">
          <Group gap={8} mb="md">
            <IconPackage size={20} />
            <Text fw={700} fz={16}>
              Start new order
            </Text>
          </Group>
          <Text fz={14} c={colors.mutedText} mb="lg">
            Post another request or browse trips matched to your schedule.
          </Text>
          <Button
            variant="outline"
            radius="md"
            component={Link}
            to="/app/requester/select-type"
            fullWidth
            styles={{ root: { borderWidth: 2, borderStyle: 'solid', borderColor: PU.primaryBlue, color: PU.primaryBlue } }}
          >
            New request
          </Button>
        </Paper>
      </SimpleGrid>

      <Paper radius="md" withBorder px="xl" py="md" shadow="xs" maw={640}>
        <SimpleGrid cols={2} spacing="xs">
          <div>
            <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
              Item
            </Text>
            <Text fz={14}>Laptop sleeve</Text>
          </div>
          <div>
            <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
              Route
            </Text>
            <Text fz={14}>JFK → CDG</Text>
          </div>
          <div>
            <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
              Courier
            </Text>
            <Text fz={14}>Aisha K.</Text>
          </div>
          <div>
            <Text fz={12} c={colors.subtleText} tt="uppercase" fw={700}>
              Total
            </Text>
            <Text fz={14} fw={700}>
              $186.00 paid
            </Text>
          </div>
        </SimpleGrid>
      </Paper>
    </Stack>
  );
}

export function TrackingHomePage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue, border: 'none' } } } as const;

  return (
    <Grid gap="lg">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper radius="md" p="lg" withBorder shadow="xs" style={{ background: MU.pageBg }}>
          <Text fz={11} fw={700} tt="uppercase" c={colors.subtleText} mb="md">
            Quick nav
          </Text>
          <Stack gap={8}>
            <Anchor component={Link} to="/app/requester/select-type" style={navLinkStyle} underline="never">
              New request
            </Anchor>
            <Anchor component={Link} to="/app/bookings" style={navLinkStyle} underline="never">
              My bookings
            </Anchor>
            <Anchor component={Link} to="/app/chat" style={navLinkStyle} underline="never">
              Messages
            </Anchor>
          </Stack>
          <Divider my="md" />
          <TextInput placeholder="Booking ID lookup" />
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 5 }}>
        <Paper radius="md" p="lg" withBorder shadow="xs">
          <Text fw={700} fz={16} mb="md">
            Booking TH-80254
          </Text>
          <Timeline active={3} bulletSize={28} lineWidth={2} color="blue">
            <TimelineItem title="Order placed" bullet={<IconPlane size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                May 04 · Sender confirmed escrow
              </Text>
            </TimelineItem>
            <TimelineItem title="Picked up" bullet={<IconCheck size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                May 06 · Terminal 4, JFK
              </Text>
            </TimelineItem>
            <TimelineItem title="In transit" bullet={<IconMapPin size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                May 06 · Departed UA902 · ETA May 07
              </Text>
            </TimelineItem>
            <TimelineItem title="Out for delivery" bullet={<IconBasket size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                Pending last-mile handoff · CDG
              </Text>
            </TimelineItem>
          </Timeline>
        </Paper>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 4 }}>
        <Stack gap="md">
          <Paper radius="md" p="lg" withBorder shadow="xs">
            <Text fw={700} fz={16} mb="md">
              Delivery summary
            </Text>
            <Badge variant="light" color="blue" mb="sm">
              Ongoing
            </Badge>
            <SimpleGrid cols={1} spacing={6}>
              <Group justify="space-between">
                <Text fz={13} c={colors.mutedText}>
                  Item
                </Text>
                <Text fz={13} fw={600}>
                  Electronics
                </Text>
              </Group>
              <Group justify="space-between">
                <Text fz={13} c={colors.mutedText}>
                  Handoff window
                </Text>
                <Text fz={13} fw={600}>
                  May 07 · 06–09
                </Text>
              </Group>
            </SimpleGrid>
            <Button mt="lg" radius="md" component={Link} to="/app/tracking/live" fullWidth {...blueBtn}>
              Open live tracking
            </Button>
          </Paper>
          <Paper radius="md" withBorder shadow="xs" p={0} h={220} style={{ overflow: 'hidden' }}>
            <Box
              h="100%"
              style={{
                background: `linear-gradient(155deg,#dbeafe 0%,#93c5fd 48%, ${colors.inputBg} 100%)`,
              }}
            >
              <svg viewBox="0 0 280 140" width="100%" preserveAspectRatio="none" height="140">
                <path
                  d="M 20 110 Q 140 40 260 65"
                  fill="none"
                  stroke={PU.primaryBlue}
                  strokeWidth="5"
                  strokeLinecap="round"
                />
                <circle cx="20" cy="110" r="8" fill={colors.navyDeep} />
                <circle cx="260" cy="65" r="8" fill={PU.primaryBlue} />
              </svg>
            </Box>
          </Paper>
        </Stack>
      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 12 }}>
        <MockTable
          columns={['Booking', 'Status', '']}
          rows={[
            ['TH-80254', 'In transit', <Button key="t1" size="xs" radius="md" {...blueBtn} component={Link} to="/app/tracking/live">Track</Button>],
            ['TH-9012', 'Delivered', <Button key="t2" size="xs" variant="outline" radius="md" component={Link} to="/app/tracking/completed">View</Button>],
          ]}
        />
      </Grid.Col>
    </Grid>
  );
}

export function ProofOfDeliveryPage() {
  const blueBtn = { styles: { root: { background: PU.primaryBlue, border: 'none' } } } as const;

  return (
    <Stack gap="lg" pb={48}>
      <div>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          Confirm delivery
        </Title>
        <Text fz={15} c={colors.mutedText} mt={6}>
          Attach proof photos and courier notes before releasing escrow.
        </Text>
      </div>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper radius="md" withBorder shadow="xs" p="md">
            <Text fw={600} fz={14} mb="sm">
              Proof of delivery photo
            </Text>
            <Image
              radius="md"
              src="https://images.unsplash.com/photo-1600267175161-cfaa547b7318?w=900&q=80"
              alt="Package at doorway"
              h={320}
            />
            <Button leftSection={<IconPhoto size={16} />} variant="outline" mt="md" radius="md" fullWidth>
              Replace upload
            </Button>
            <Textarea mt="xl" label="Delivery notes" minRows={5} placeholder="Drop-off recipient, concierge desk, locker code…" />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper radius="md" withBorder shadow="xs" p="lg" style={{ position: 'sticky', top: 88 }}>
            <Text fz={11} fw={700} tt="uppercase" c={colors.subtleText} mb="xs">
              Order summary
            </Text>
            <Text fw={800} fz={20} mb="md">
              TH-80254
            </Text>
            <Divider />
            <Group justify="space-between" mt="md">
              <Text fz={14}>Item</Text>
              <Text fw={600}>Parcel · 3.2 kg</Text>
            </Group>
            <Group justify="space-between" mt="xs">
              <Text fz={14}>Route</Text>
              <Text fw={600}>CDG arrivals</Text>
            </Group>
            <Divider my="md" />
            <Text fz={26} fw={900} mb="lg">
              $186.00
            </Text>
            <Button fullWidth radius="md" component={Link} to="/app/tracking/completed" {...blueBtn}>
              Confirm
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

const NOTIFICATION_ITEMS = [
  {
    title: 'New match',
    body: 'A traveler accepted your handoff window for route JFK → CDG.',
    time: '2h ago',
  },
  {
    title: 'Payout sent',
    body: '$420 was deposited to your linked account.',
    time: 'Yesterday',
  },
  {
    title: 'Verify your identity',
    body: 'Complete ID check before May 22 to keep matching enabled.',
    time: '3d ago',
  },
] as const;

const TRUST_TASKS = [
  {
    title: 'Verify phone number',
    desc: 'Get SMS codes for important trip updates.',
    done: true,
    icon: IconPhone,
  },
  {
    title: 'Verify email',
    desc: 'Confirm your primary email for receipts and disputes.',
    done: true,
    icon: IconMail,
  },
  {
    title: 'Connect LinkedIn',
    desc: 'Optional — helps travelers recognize your profile.',
    done: false,
    icon: IconBrandLinkedin,
  },
  {
    title: 'Identity verification',
    desc: 'Government ID — unlocks highest trust tier.',
    done: false,
    icon: IconShieldCheck,
  },
  {
    title: 'Add profile photo',
    desc: 'Profiles with photos get matched faster.',
    done: false,
    icon: IconPhoto,
  },
  {
    title: 'Complete 10 trips',
    desc: 'On-time deliveries build your community score.',
    done: false,
    icon: IconPlane,
  },
] as const;

function commsPageWrap(children: ReactNode) {
  return (
    <Box
      style={{
        margin: 'calc(-1 * var(--mantine-spacing-md))',
        minHeight: 'calc(100vh - 96px)',
        background: CM.pageBg,
        padding: 'var(--mantine-spacing-md)',
      }}
    >
      {children}
    </Box>
  );
}

function ConversationsSidebar({ activeName }: { activeName?: string }) {
  return (
    <Paper
      radius="md"
      p="md"
      withBorder
      shadow="xs"
      bg="#fff"
      style={{ minHeight: 360 }}
    >
      <Group justify="space-between" mb="md" wrap="nowrap">
        <Title order={4} fz={18}>
          Messages
        </Title>
        <Button size="xs" radius="md" leftSection={<IconPlus size={14} />} {...commsBtn}>
          New message
        </Button>
      </Group>
      <ScrollArea h={{ base: 300, md: 'calc(100vh - 240px)' }} type="auto">
        <Stack gap={8}>
          {CONVERSATIONS.map((c) => {
            const active = activeName === c.name;
            return (
              <Paper
                key={c.name}
                component={Link}
                to="/app/chat/thread"
                p="sm"
                radius="md"
                withBorder
                style={{
                  textDecoration: 'none',
                  color: 'inherit',
                  borderLeft: active ? `3px solid ${CM.teal}` : undefined,
                  background: active ? 'rgba(38, 166, 154, 0.08)' : undefined,
                }}
              >
                <Group wrap="nowrap" gap="sm">
                  <Avatar src={c.avatar} radius="xl" size={44} color="teal">
                    {c.initials ?? c.name.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                    <Group justify="space-between" wrap="nowrap" gap="xs">
                      <Text fw={700} fz={14} lineClamp={1}>
                        {c.name}
                      </Text>
                      <Text fz={11} c={colors.subtleText} style={{ flexShrink: 0 }}>
                        {c.time}
                      </Text>
                    </Group>
                    <Text fz={12} c={colors.mutedText} lineClamp={2}>
                      {c.last}
                    </Text>
                  </Stack>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      </ScrollArea>
    </Paper>
  );
}

function PreferenceCategoryRow({
  title,
  description,
  frequency,
}: {
  title: string;
  description: string;
  frequency?: boolean;
}) {
  return (
    <Paper p="md" radius="md" withBorder>
      <Stack gap="sm">
        <Group justify="space-between" align="flex-start" wrap="nowrap">
          <div style={{ minWidth: 0 }}>
            <Text fw={600} fz={14}>
              {title}
            </Text>
            <Text fz={12} c={colors.mutedText}>
              {description}
            </Text>
          </div>
          <Switch color="teal" defaultChecked size="md" style={{ flexShrink: 0 }} />
        </Group>
        {frequency ? (
          <Select
            size="xs"
            label="Frequency"
            defaultValue="realtime"
            data={[
              { value: 'realtime', label: 'Realtime' },
              { value: 'digest', label: 'Daily digest' },
              { value: 'weekly', label: 'Weekly summary' },
            ]}
          />
        ) : null}
      </Stack>
    </Paper>
  );
}

function NotificationFeed() {
  return (
    <Stack gap="sm" mt="md">
      {NOTIFICATION_ITEMS.map((n) => (
        <Paper key={n.title} p="md" withBorder radius="md" bg="#fff">
          <Group align="flex-start" wrap="nowrap" gap="md">
            <ThemeIcon size={44} radius="xl" variant="light" color="teal">
              <IconBell size={22} stroke={1.5} />
            </ThemeIcon>
            <Stack gap={6} style={{ flex: 1, minWidth: 0 }}>
              <Text fw={700} fz={15}>
                {n.title}
              </Text>
              <Text fz={13} c={colors.mutedText}>
                {n.body}
              </Text>
              <Group justify="space-between" wrap="nowrap" mt={4}>
                <Text fz={12} c={colors.subtleText}>
                  {n.time}
                </Text>
                <Anchor component="button" type="button" fz={13} c={CM.teal} underline="hover">
                  Mark as read
                </Anchor>
              </Group>
            </Stack>
          </Group>
        </Paper>
      ))}
    </Stack>
  );
}

export function ChatInboxPage() {
  return commsPageWrap(
    <Grid gap="md">
      <Grid.Col span={{ base: 12, md: 4 }}>
        <ConversationsSidebar />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 8 }}>
        <Paper
          radius="md"
          withBorder
          shadow="xs"
          bg="#fff"
          style={{ minHeight: 480, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <Stack align="center" gap="lg" px="xl" py="xl">
            <Box
              w={112}
              h={112}
              style={{
                borderRadius: 12,
                background: '#1d6b63',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconMessage size={48} color="#fff" stroke={1.5} />
            </Box>
            <Text fz={16} c={colors.mutedText} ta="center" maw={360}>
              Select a conversation to start chatting.
            </Text>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>,
  );
}

export function ChatThreadPage() {
  const peer = CONVERSATIONS[0];

  return commsPageWrap(
    <Grid gap="md" align="stretch">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <ConversationsSidebar activeName={peer.name} />
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper
          radius="md"
          p={0}
          withBorder
          shadow="xs"
          bg="#fff"
          style={{ minHeight: 520, display: 'flex', flexDirection: 'column' }}
        >
          <Box p="md" style={{ borderBottom: `1px solid ${colors.border}` }}>
            <Group wrap="nowrap">
              <Avatar src={peer.avatar} radius="xl" size={48} color="teal">
                {peer.initials ?? peer.name.slice(0, 2).toUpperCase()}
              </Avatar>
              <div style={{ minWidth: 0 }}>
                <Text fw={800} fz={17} lineClamp={1}>
                  {peer.name}
                </Text>
                <Badge size="sm" color="green" variant="light" mt={4}>
                  Online
                </Badge>
              </div>
            </Group>
          </Box>
          <Box style={{ flex: 1, minHeight: 220 }}>
            <ScrollArea h="100%" p="md" style={{ maxHeight: 420 }}>
              <Stack gap="md">
                <Group align="flex-end" wrap="nowrap" gap="sm">
                  <Avatar src={peer.avatar} radius="xl" size={32} color="teal">
                    {peer.initials ?? peer.name.slice(0, 2).toUpperCase()}
                  </Avatar>
                  <Paper p="sm" radius="lg" maw="78%" style={{ background: '#f1f3f5' }}>
                    <Text fz={14}>
                      Running ~10 minutes late at security — still good for our handoff window.
                    </Text>
                  </Paper>
                </Group>
                <Group align="flex-end" justify="flex-end" wrap="nowrap" gap="sm">
                  <Paper p="sm" radius="lg" maw="78%" style={{ background: CM.teal }}>
                    <Text fz={14} c="#fff">
                      Thanks for the heads-up — I&apos;ll be at belt 6 when you land.
                    </Text>
                  </Paper>
                  <Avatar radius="xl" size={32} color="teal">
                    You
                  </Avatar>
                </Group>
                <Group align="flex-end" wrap="nowrap" gap="sm">
                  <Avatar src={peer.avatar} radius="xl" size={32} color="teal">
                    AK
                  </Avatar>
                  <Paper p="sm" radius="lg" maw="78%" style={{ background: '#f1f3f5' }}>
                    <Text fz={14}>Perfect. I&apos;ll ping you once I&apos;m through customs.</Text>
                  </Paper>
                </Group>
              </Stack>
            </ScrollArea>
          </Box>
          <Box p="md" style={{ borderTop: `1px solid ${colors.border}` }}>
            <Group gap="xs" wrap="nowrap" align="flex-end">
              <TextInput flex={1} placeholder="Type a message…" radius="md" />
              <ActionIcon variant="default" radius="md" aria-label="Attach file">
                <IconPaperclip size={18} />
              </ActionIcon>
              <ActionIcon variant="default" radius="md" aria-label="Emoji">
                <IconMoodHappy size={18} />
              </ActionIcon>
              <Button radius="md" {...commsBtn}>
                Send
              </Button>
            </Group>
          </Box>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper radius="md" p="lg" withBorder shadow="xs" bg="#fff">
          <Stack gap="lg" align="stretch">
            <Stack align="center" gap="sm">
              <Avatar src={peer.avatar} radius="xl" size={112} color="teal">
                AK
              </Avatar>
              <Title order={4} ta="center" fz={20}>
                {peer.name}
              </Title>
              <Group gap={6} c={colors.mutedText}>
                <IconMapPin size={16} stroke={1.5} />
                <Text fz={13}>London, UK · Traveler</Text>
              </Group>
              <Button fullWidth radius="md" variant="filled" {...commsBtn}>
                View profile
              </Button>
            </Stack>
            <Accordion variant="contained" radius="md">
              <Accordion.Item value="media">
                <Accordion.Control fw={600}>Shared media</Accordion.Control>
                <Accordion.Panel>
                  <SimpleGrid cols={3} spacing={8}>
                    {[1, 2, 3].map((i) => (
                      <Box
                        key={i}
                        h={64}
                        style={{
                          borderRadius: 8,
                          background: '#e9ecef',
                          display: 'grid',
                          placeItems: 'center',
                        }}
                      >
                        <IconPhoto size={22} color={colors.mutedText} />
                      </Box>
                    ))}
                  </SimpleGrid>
                </Accordion.Panel>
              </Accordion.Item>
              <Accordion.Item value="groups">
                <Accordion.Control fw={600}>Common groups</Accordion.Control>
                <Accordion.Panel>
                  <Stack gap="xs">
                    <Text fz={13}>NYC ↔ Paris fast lane</Text>
                    <Text fz={13}>Verified travelers · EU</Text>
                  </Stack>
                </Accordion.Panel>
              </Accordion.Item>
            </Accordion>
          </Stack>
        </Paper>
      </Grid.Col>
    </Grid>,
  );
}

export function NotificationPrefsPage() {
  return commsPageWrap(
    <Paper mx="auto" maw={720} p="xl" radius="lg" withBorder shadow="xs" bg="#fff">
      <Title order={3} fz={22} mb="lg">
        Notification preferences
      </Title>
      <Tabs defaultValue="email">
        <Tabs.List grow>
          <Tabs.Tab value="email">Email</Tabs.Tab>
          <Tabs.Tab value="sms">SMS</Tabs.Tab>
          <Tabs.Tab value="push">Push</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="email" pt="lg">
          <Stack gap="md">
            <PreferenceCategoryRow
              title="New message"
              description="When someone sends you a direct message"
              frequency
            />
            <PreferenceCategoryRow
              title="Review received"
              description="After a trip, when your counterparty leaves feedback"
            />
            <PreferenceCategoryRow
              title="Account updates"
              description="Security, payouts, and policy changes"
              frequency
            />
            <PreferenceCategoryRow title="Marketing" description="Product news and community tips" />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="sms" pt="lg">
          <Stack gap="md">
            <PreferenceCategoryRow
              title="New message"
              description="SMS for urgent thread replies (carrier rates may apply)"
              frequency
            />
            <PreferenceCategoryRow title="Trip reminders" description="Pickup windows and delivery ETAs" />
            <PreferenceCategoryRow title="Payout alerts" description="When funds move to your bank" />
          </Stack>
        </Tabs.Panel>
        <Tabs.Panel value="push" pt="lg">
          <Stack gap="md">
            <PreferenceCategoryRow title="New message" description="Push notifications for messages" />
            <PreferenceCategoryRow title="Match activity" description="Requests and acceptances on your routes" />
            <PreferenceCategoryRow title="Trust & safety" description="Flags, holds, and verification prompts" />
          </Stack>
        </Tabs.Panel>
      </Tabs>
      <Divider my="xl" />
      <Group justify="center">
        <Button radius="md" px="xl" {...commsBtn}>
          Save changes
        </Button>
      </Group>
    </Paper>,
  );
}

export function NotificationsCenterPage() {
  return commsPageWrap(
    <Paper mx="auto" maw={800} p="xl" radius="lg" withBorder shadow="xs" bg="#fff">
      <Title order={3} fz={22} mb="md">
        Notifications
      </Title>
      <Tabs defaultValue="all">
        <Tabs.List>
          <Tabs.Tab value="all">All</Tabs.Tab>
          <Tabs.Tab value="unread">Unread</Tabs.Tab>
          <Tabs.Tab value="read">Read</Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value="all">
          <NotificationFeed />
        </Tabs.Panel>
        <Tabs.Panel value="unread">
          <NotificationFeed />
        </Tabs.Panel>
        <Tabs.Panel value="read">
          <NotificationFeed />
        </Tabs.Panel>
      </Tabs>
    </Paper>,
  );
}

export function ChampionBadgePage() {
  return commsPageWrap(
    <Stack gap="xl" py={{ base: 'md', md: 'xl' }} align="center" px="md">
      <ThemeIcon
        size={120}
        radius="xl"
        variant="filled"
        color="teal"
        style={{ borderRadius: '50%', width: 120, height: 120, background: CM.teal }}
      >
        <IconTrophy size={56} stroke={1.5} color="#fff" />
      </ThemeIcon>
      <Title order={2} ta="center" fz={28}>
        {"You're a Community Champion!"}
      </Title>
      <Text fz={15} c={colors.mutedText} ta="center" maw={520}>
        Consistent five-star trips and on-time handoffs keep the network safe. Here is what you have unlocked.
      </Text>
      <Grid gap="xl" maw={960} mx="auto" w="100%">
        <Grid.Col span={{ base: 12, md: 5 }}>
          <Timeline active={3} bulletSize={28} lineWidth={2} color="teal">
            <TimelineItem title="Trusted host badge" bullet={<IconCheck size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                Visible on your public profile.
              </Text>
            </TimelineItem>
            <TimelineItem title="Priority in matching" bullet={<IconCheck size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                Your offers surface earlier to requesters.
              </Text>
            </TimelineItem>
            <TimelineItem title="Reduced platform fees" bullet={<IconCheck size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                Applies on your next 10 completed deliveries.
              </Text>
            </TimelineItem>
            <TimelineItem title="Community spotlight" bullet={<IconUsers size={14} />}>
              <Text fz={13} c={colors.mutedText}>
                Eligible for monthly featured traveler stories.
              </Text>
            </TimelineItem>
          </Timeline>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 7 }}>
          <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
            <Paper p="lg" radius="md" withBorder>
              <Stack gap={6}>
                <Text fw={700}>Higher match rate</Text>
                <Text fz={13} c={colors.mutedText}>
                  Requesters filtered for trust see you first when routes align.
                </Text>
              </Stack>
            </Paper>
            <Paper p="lg" radius="md" withBorder>
              <Stack gap={6}>
                <Text fw={700}>Dedicated support lane</Text>
                <Text fz={13} c={colors.mutedText}>
                  Faster response on payouts and disputes.
                </Text>
              </Stack>
            </Paper>
            <Box style={{ gridColumn: '1 / -1' }}>
              <Paper p="lg" radius="md" withBorder>
                <Stack gap={6}>
                  <Text fw={700}>Reputation protection</Text>
                  <Text fz={13} c={colors.mutedText}>
                    One-off issues are reviewed with fuller trip context for champions.
                  </Text>
                </Stack>
              </Paper>
            </Box>
          </SimpleGrid>
        </Grid.Col>
      </Grid>
      <Button radius="md" size="md" px="xl" {...commsBtn}>
        Continue
      </Button>
    </Stack>,
  );
}

export function ReviewSubmissionPage() {
  return (
    <Box
      style={{
        margin: 'calc(-1 * var(--mantine-spacing-md))',
        minHeight: 'calc(100vh - 96px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(15, 23, 42, 0.45)',
          zIndex: 0,
        }}
      />
      <Box
        px="md"
        py="xl"
        style={{
          position: 'relative',
          zIndex: 1,
          minHeight: 'calc(100vh - 96px)',
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'center',
          background: CM.pageBg,
        }}
      >
        <Paper
          mx="auto"
          maw={480}
          w="100%"
          p="xl"
          radius="lg"
          withBorder
          shadow="md"
          bg="#fff"
          mt={{ base: 0, sm: 'md' }}
        >
          <Title order={4} fz={20} mb="lg">
            Rate your experience
          </Title>
          <Group gap="sm" mb="lg">
            <Avatar radius="xl" size={48} src={CONVERSATIONS[0].avatar} />
            <div>
              <Text fw={700}>{CONVERSATIONS[0].name}</Text>
              <Text fz={12} c={colors.mutedText}>
                Recent trip · JFK → CDG
              </Text>
            </div>
          </Group>
          <Text fz={13} fw={600} mb={6}>
            Overall rating
          </Text>
          <Rating mb="lg" size="lg" defaultValue={4} styles={{ symbolBody: { color: CM.teal } }} />
          <Textarea
            label="Written review"
            minRows={5}
            placeholder="Write your review here…"
            radius="md"
            mb="lg"
          />
          <Button fullWidth radius="md" {...commsBtn}>
            Submit review
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}

export function PublicProfilePage() {
  return commsPageWrap(
    <Grid gap="lg" align="flex-start">
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Paper radius="lg" p="xl" withBorder shadow="xs" bg="#fff">
          <Stack align="center" gap="md">
            <Avatar
              radius="xl"
              size={120}
              src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?w=240&q=70"
              color="teal"
            >
              QP
            </Avatar>
            <div style={{ textAlign: 'center' }}>
              <Text fw={900} fz={22}>
                Qais P.
              </Text>
              <Group gap={6} justify="center" c={colors.mutedText} mt={4}>
                <IconMapPin size={14} />
                <Text fz={13}>Austin · Traveler</Text>
              </Group>
            </div>
            <Group grow w="100%" gap="xs">
              <Button radius="md" component={Link} to="/app/chat/thread" variant="filled" {...commsBtn}>
                Message
              </Button>
              <Button radius="md" variant="default" leftSection={<IconUserPlus size={16} />}>
                Follow
              </Button>
            </Group>
            <Divider w="100%" />
            <SimpleGrid cols={3} spacing={4} w="100%">
              <Stack gap={0} align="center">
                <Text fw={800} fz={18}>
                  1.2k
                </Text>
                <Text fz={11} c={colors.mutedText}>
                  Followers
                </Text>
              </Stack>
              <Stack gap={0} align="center">
                <Text fw={800} fz={18}>
                  340
                </Text>
                <Text fz={11} c={colors.mutedText}>
                  Following
                </Text>
              </Stack>
              <Stack gap={0} align="center">
                <Badge color="teal" variant="light" size="lg" radius="sm">
                  4.9
                </Badge>
                <Text fz={11} c={colors.mutedText} mt={4}>
                  Trust
                </Text>
              </Stack>
            </SimpleGrid>
          </Stack>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 6 }}>
        <Paper radius="lg" p={0} withBorder shadow="xs" bg="#fff" style={{ overflow: 'hidden' }}>
          <Tabs defaultValue="about">
            <Tabs.List px="md" pt="md">
              <Tabs.Tab value="about">About</Tabs.Tab>
              <Tabs.Tab value="reviews">Reviews</Tabs.Tab>
              <Tabs.Tab value="posts">Posts</Tabs.Tab>
            </Tabs.List>
            <Tabs.Panel value="about" p="lg">
              <Stack gap="md">
                <Text fz={14} c={colors.mutedText}>
                  Full-time product designer; flying monthly between US and EU. Fast airport handoffs, clear
                  communication, and photos at pickup + drop-off.
                </Text>
                <Text fw={700} fz={13} tt="uppercase" c={colors.subtleText}>
                  Verified
                </Text>
                <Group gap="xs">
                  <Badge variant="light" color="teal">
                    ID verified
                  </Badge>
                  <Badge variant="light" color="teal">
                    Phone verified
                  </Badge>
                  <Badge variant="light" color="gray">
                    LinkedIn
                  </Badge>
                </Group>
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="reviews" p="lg">
              <Stack gap="md">
                {[1, 2].map((i) => (
                  <Paper key={i} p="md" withBorder radius="md">
                    <Group justify="space-between" mb={6}>
                      <Text fw={700}>Alex M.</Text>
                      <Text fz={12} c={colors.subtleText}>
                        {i === 1 ? 'May 2026' : 'Apr 2026'}
                      </Text>
                    </Group>
                    <Rating value={5} readOnly fractions={2} mb={6} styles={{ symbolBody: { color: CM.teal } }} />
                    <Text fz={14}>Clear updates, punctual handoff — would match again.</Text>
                  </Paper>
                ))}
              </Stack>
            </Tabs.Panel>
            <Tabs.Panel value="posts" p="lg">
              <Stack gap="sm">
                <Text fz={14} c={colors.mutedText}>
                  Community tips and airport notes you share will appear here.
                </Text>
              </Stack>
            </Tabs.Panel>
          </Tabs>
        </Paper>
      </Grid.Col>
      <Grid.Col span={{ base: 12, md: 3 }}>
        <Stack gap="md">
          <Paper radius="lg" p="lg" withBorder shadow="xs" bg="#fff">
            <Text fw={700} fz={14} mb="sm">
              Trust score breakdown
            </Text>
            <Stack gap="sm">
              {[
                { label: 'Identity', v: 92 },
                { label: 'Reliability', v: 88 },
                { label: 'Reviews', v: 95 },
              ].map((row) => (
                <div key={row.label}>
                  <Group justify="space-between" mb={4}>
                    <Text fz={12} c={colors.mutedText}>
                      {row.label}
                    </Text>
                    <Text fz={12} fw={700}>
                      {row.v}%
                    </Text>
                  </Group>
                  <Progress value={row.v} size="sm" radius="xl" styles={{ section: { background: CM.teal } }} />
                </div>
              ))}
            </Stack>
          </Paper>
          <Paper radius="lg" p="lg" withBorder shadow="xs" bg="#fff">
            <Text fw={700} fz={14} mb="md">
              Common connections
            </Text>
            <Avatar.Group spacing="sm">
              <Avatar radius="xl" src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&q=70" />
              <Avatar radius="xl" src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&q=70" />
              <Avatar radius="xl" src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&q=70" />
              <Avatar radius="xl">+8</Avatar>
            </Avatar.Group>
            <Text fz={12} c={colors.mutedText} mt="md">
              You both know travelers in the verified EU network.
            </Text>
          </Paper>
        </Stack>
      </Grid.Col>
    </Grid>,
  );
}

export function TrustScorePage() {
  return commsPageWrap(
    <Stack gap="lg">
      <Paper radius="lg" p="xl" withBorder shadow="xs" bg="#fff">
        <Text fw={700} fz={18} mb="xs">
          Your trust score
        </Text>
        <Text fz={14} c={colors.mutedText} mb="md">
          Complete verifications to rank higher in search and matching.
        </Text>
        <Group justify="space-between" mb="xs">
          <Text fz={14} fw={600}>
            Overall
          </Text>
          <Text fz={14} fw={800} c={CM.teal}>
            72%
          </Text>
        </Group>
        <Progress value={72} size="lg" radius="md" styles={{ section: { background: CM.teal } }} />
      </Paper>
      <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }} spacing="md">
        {TRUST_TASKS.map((task) => {
          const Icon = task.icon;
          return (
            <Paper key={task.title} p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <ThemeIcon size={44} radius="md" variant="light" color={task.done ? 'teal' : 'gray'} mb="md">
                <Icon size={22} stroke={1.5} />
              </ThemeIcon>
              <Text fw={700} fz={15} mb={6}>
                {task.title}
              </Text>
              <Text fz={13} c={colors.mutedText} mb="md">
                {task.desc}
              </Text>
              {task.done ? (
                <Group gap={6} c={CM.teal}>
                  <IconCheck size={18} />
                  <Text fz={13} fw={600}>
                    Complete
                  </Text>
                </Group>
              ) : (
                <Button size="xs" radius="md" variant="filled" {...commsBtn}>
                  Verify now
                </Button>
              )}
            </Paper>
          );
        })}
      </SimpleGrid>
      <Box
        style={{
          borderRadius: 12,
          background: '#156b63',
          padding: 'var(--mantine-spacing-xl)',
        }}
      >
        <Text c="#fff" fz={15} ta="center" maw={720} mx="auto">
          A higher trust score helps everyone: requesters hand off valuable items with confidence, and you get
          matched faster on competitive routes. Verifications are reviewed securely and never shown publicly in
          full.
        </Text>
      </Box>
    </Stack>,
  );
}
