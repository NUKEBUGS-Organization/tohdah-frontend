import {
  Avatar,
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  Select,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { IconArrowUpRight, IconSearch } from '@tabler/icons-react';
import { useMemo, useState } from 'react';
import { adminUi as AU } from '../../theme';

type Dispute = {
  id: string;
  user: string;
  avatar: string;
  type: string;
  status: 'Open' | 'Pending' | 'Resolved';
  priority: 'High' | 'Medium' | 'Low';
  date: string;
};

const ROWS: Dispute[] = [
  {
    id: 'DSP-20441',
    user: 'Maya Thompson',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=96&q=70',
    type: 'Delivery delay',
    status: 'Open',
    priority: 'High',
    date: '2026-05-04',
  },
  {
    id: 'DSP-20418',
    user: 'James Okoro',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=96&q=70',
    type: 'Item condition',
    status: 'Pending',
    priority: 'Medium',
    date: '2026-05-03',
  },
  {
    id: 'DSP-20390',
    user: 'Elena Rossi',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=96&q=70',
    type: 'Payout dispute',
    status: 'Resolved',
    priority: 'Low',
    date: '2026-05-01',
  },
  {
    id: 'DSP-20355',
    user: 'Chris Park',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=96&q=70',
    type: 'Verification',
    status: 'Open',
    priority: 'Medium',
    date: '2026-04-30',
  },
];

function statusBadge(s: Dispute['status']) {
  if (s === 'Resolved')
    return (
      <Badge color="green" variant="light" size="sm">
        Resolved
      </Badge>
    );
  if (s === 'Pending')
    return (
      <Badge color="orange" variant="light" size="sm">
        Pending
      </Badge>
    );
  return (
    <Badge color="blue" variant="light" size="sm">
      Open
    </Badge>
  );
}

function priorityBadge(p: Dispute['priority']) {
  const c = p === 'High' ? 'red' : p === 'Medium' ? 'yellow' : 'gray';
  return (
    <Badge color={c} variant="outline" size="sm">
      {p}
    </Badge>
  );
}

export function AdminDisputesPage() {
  const [selectedId, setSelectedId] = useState(ROWS[0]!.id);
  const [q, setQ] = useState('');
  const [statusF, setStatusF] = useState<string | null>('all');
  const [priorityF, setPriorityF] = useState<string | null>('all');

  const selected = useMemo(() => ROWS.find((r) => r.id === selectedId) ?? ROWS[0]!, [selectedId]);

  const filtered = useMemo(
    () =>
      ROWS.filter((r) => {
        const matchQ =
          !q.trim() ||
          r.id.toLowerCase().includes(q.toLowerCase()) ||
          r.user.toLowerCase().includes(q.toLowerCase());
        const matchS = !statusF || statusF === 'all' || r.status === statusF;
        const matchP = !priorityF || priorityF === 'all' || r.priority === priorityF;
        return matchQ && matchS && matchP;
      }),
    [q, statusF, priorityF],
  );

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Dispute management
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Triage booking issues, message both parties, and close with an auditable trail.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
        {[
          { t: 'Total disputes', v: '186', h: 'All time' },
          { t: 'Open disputes', v: '22', h: 'Awaiting first response' },
          { t: 'Resolved disputes', v: '141', h: 'Last 90 days' },
          { t: 'Avg resolution time', v: '4h 32m', h: 'Median across closed cases' },
        ].map((c) => (
          <Paper key={c.t} p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
              {c.t}
            </Text>
            <Text fz={26} fw={800}>
              {c.v}
            </Text>
            <Text fz={12} c="dimmed" mt={4}>
              {c.h}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper p="md" radius="md" withBorder shadow="xs" bg="#fff">
            <Group gap="sm" mb="md" wrap="wrap">
              <TextInput
                placeholder="Search ID or user…"
                leftSection={<IconSearch size={16} stroke={1.5} />}
                style={{ flex: '1 1 200px' }}
                value={q}
                onChange={(e) => setQ(e.currentTarget.value)}
              />
              <Select
                placeholder="Status"
                data={[
                  { value: 'all', label: 'All statuses' },
                  { value: 'Open', label: 'Open' },
                  { value: 'Pending', label: 'Pending' },
                  { value: 'Resolved', label: 'Resolved' },
                ]}
                value={statusF}
                onChange={setStatusF}
                w={{ base: '100%', sm: 160 }}
              />
              <Select
                placeholder="Priority"
                data={[
                  { value: 'all', label: 'All priorities' },
                  { value: 'High', label: 'High' },
                  { value: 'Medium', label: 'Medium' },
                  { value: 'Low', label: 'Low' },
                ]}
                value={priorityF}
                onChange={setPriorityF}
                w={{ base: '100%', sm: 160 }}
              />
            </Group>
            <Table striped highlightOnHover verticalSpacing="sm">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Dispute ID
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    User
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Type
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Status
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Priority
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Date
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {filtered.map((row) => (
                  <Table.Tr
                    key={row.id}
                    onClick={() => setSelectedId(row.id)}
                    style={{
                      cursor: 'pointer',
                      background: selectedId === row.id ? `${AU.accentTeal}12` : undefined,
                    }}
                  >
                    <Table.Td fz={13} fw={700}>
                      {row.id}
                    </Table.Td>
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar src={row.avatar} size={32} radius="xl" />
                        <Text fz={13}>{row.user}</Text>
                      </Group>
                    </Table.Td>
                    <Table.Td fz={13}>{row.type}</Table.Td>
                    <Table.Td>{statusBadge(row.status)}</Table.Td>
                    <Table.Td>{priorityBadge(row.priority)}</Table.Td>
                    <Table.Td fz={13} c="dimmed">
                      {row.date}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" style={{ position: 'sticky', top: 88 }}>
            <Group justify="space-between" mb="md">
              <Text fw={800} fz={16}>
                {selected.id}
              </Text>
              {statusBadge(selected.status)}
            </Group>
            <Text fz={13} c="dimmed" mb="lg">
              {selected.type} · opened {selected.date}
            </Text>
            <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb="sm">
              Communication log
            </Text>
            <Stack gap="sm" mb="lg">
              {[
                { who: 'User', text: 'Package arrived with visible corner damage on the retail box.' },
                { who: 'Traveler', text: 'Photos at handoff showed sealed packaging; happy to share EXIF metadata.' },
                { who: 'Support', text: 'Requested item photos from both parties within 24h.' },
              ].map((m, i) => (
                <Paper key={i} p="sm" radius="md" bg={AU.pageBg}>
                  <Text fz={11} fw={700} c="dimmed" mb={4}>
                    {m.who}
                  </Text>
                  <Text fz={13}>{m.text}</Text>
                </Paper>
              ))}
            </Stack>
            <Stack gap="xs">
              <Button fullWidth radius="md" leftSection={<IconArrowUpRight size={16} />} {...tealBtn}>
                Resolve dispute
              </Button>
              <Button fullWidth radius="md" variant="outline" color="orange">
                Escalate
              </Button>
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

const tealBtn = {
  styles: { root: { backgroundColor: AU.accentTeal, border: 'none', color: '#fff' } },
} as const;
