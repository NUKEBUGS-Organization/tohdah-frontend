import {
  Avatar,
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconSearch, IconThumbDown, IconThumbUp } from '@tabler/icons-react';
import { useState } from 'react';
import { adminUi as AU } from '../../theme';

type Req = {
  id: string;
  name: string;
  avatar: string;
  category: string;
  snippet: string;
  full: string;
  joined: string;
};

const REQUESTS: Req[] = [
  {
    id: 'r1',
    name: 'Amir H.',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=96&q=70',
    category: 'Safety concern',
    snippet: 'Traveler asked to meet outside the airport secure zone…',
    full:
      'Traveler asked to meet outside the airport secure zone after I already accepted the booking. I declined and would like this profile reviewed for policy fit.',
    joined: 'Mar 2025',
  },
  {
    id: 'r2',
    name: 'Sofia L.',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=96&q=70',
    category: 'Spam / solicitation',
    snippet: 'Requester pasted external payment links in chat…',
    full:
      'Requester pasted external payment links in chat and insisted on cancelling on-platform escrow. Screenshots attached in the moderated thread.',
    joined: 'Jan 2024',
  },
  {
    id: 'r3',
    name: 'Devon Pierce',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=96&q=70',
    category: 'Harassment',
    snippet: 'Repeated pings after match was declined…',
    full:
      'After I declined capacity, the same account pinged four times within an hour referencing my public profile.',
    joined: 'Aug 2026',
  },
];

export function AdminSupportModerationPage() {
  const [sel, setSel] = useState(REQUESTS[0]!.id);
  const active = REQUESTS.find((r) => r.id === sel) ?? REQUESTS[0]!;
  const [query, setQuery] = useState('');

  const list = REQUESTS.filter(
    (r) =>
      !query.trim() ||
      r.name.toLowerCase().includes(query.toLowerCase()) ||
      r.category.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <Stack gap="lg">
      <Paper
        p={{ base: 'md', lg: 'lg' }}
        radius="lg"
        style={{
          background: `linear-gradient(135deg, ${AU.successGreen} 0%, #1b4332 100%)`,
          color: '#fff',
        }}
      >
        <Stack gap="md">
          <Title order={2} fz={{ base: 20, md: 24 }} c="#fff">
            Community support request moderation
          </Title>
          <Text fz={14} c="rgba(255,255,255,0.88)" maw={720}>
            Review flagged conversations and profile behavior. Actions here sync to audit logs.
          </Text>
          <Group gap="xl" mt="xs">
            <div>
              <Text fz={28} fw={800}>
                24
              </Text>
              <Text fz={13} c="rgba(255,255,255,0.82)">
                Active requests
              </Text>
            </div>
            <div>
              <Text fz={28} fw={800}>
                156
              </Text>
              <Text fz={13} c="rgba(255,255,255,0.82)">
                Resolved · 30d
              </Text>
            </div>
            <Badge size="lg" variant="light" color="gray" styles={{ root: { background: 'rgba(255,255,255,0.15)', color: '#fff' } }}>
              SLA target · 4h first touch
            </Badge>
          </Group>
        </Stack>
      </Paper>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 5, lg: 4 }}>
          <Paper p="md" radius="md" withBorder shadow="xs" bg="#fff">
            <TextInput
              placeholder="Search requests…"
              leftSection={<IconSearch size={16} stroke={1.5} />}
              mb="md"
              value={query}
              onChange={(e) => setQuery(e.currentTarget.value)}
            />
            <Stack gap={0}>
              {list.map((r, i) => (
                <Paper
                  key={r.id}
                  component="button"
                  type="button"
                  onClick={() => setSel(r.id)}
                  p="md"
                  radius={0}
                  withBorder={false}
                  style={{
                    cursor: 'pointer',
                    textAlign: 'left',
                    width: '100%',
                    borderBottom: i < list.length - 1 ? '1px solid #e8ecf1' : 'none',
                    background: sel === r.id ? `${AU.accentTeal}10` : 'transparent',
                  }}
                >
                  <Group gap="sm" wrap="nowrap" mb={6}>
                    <Avatar src={r.avatar} size={36} radius="xl" />
                    <div style={{ minWidth: 0 }}>
                      <Text fw={700} fz={14} truncate>
                        {r.name}
                      </Text>
                      <Badge size="xs" variant="light" color="teal" mt={4}>
                        {r.category}
                      </Badge>
                    </div>
                  </Group>
                  <Text fz={12} c="dimmed" lineClamp={2}>
                    {r.snippet}
                  </Text>
                </Paper>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 7, lg: 8 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Group align="flex-start" mb="lg">
              <Avatar src={active.avatar} radius="xl" size={72} />
              <div>
                <Text fw={900} fz={22}>
                  {active.name}
                </Text>
                <Text fz={13} c="dimmed">
                  Member since {active.joined} · Requests queue ID {active.id}
                </Text>
                <Badge mt="sm" variant="light" color="orange">
                  Awaiting moderator decision
                </Badge>
              </div>
            </Group>

            <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={8}>
              Full message
            </Text>
            <Paper p="md" radius="md" bg={AU.pageBg} mb="xl">
              <Text fz={15} lh={1.65}>
                {active.full}
              </Text>
            </Paper>

            <Group grow>
              <Button leftSection={<IconThumbUp size={18} />} radius="md" {...approveBtn}>
                Approve closure
              </Button>
              <Button leftSection={<IconThumbDown size={18} />} radius="md" variant="filled" color="red">
                Reject · warn user
              </Button>
              <Button radius="md" variant="outline">
                Request info
              </Button>
            </Group>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

const approveBtn = {
  styles: { root: { backgroundColor: AU.successGreen, border: 'none', color: '#fff' } },
} as const;
