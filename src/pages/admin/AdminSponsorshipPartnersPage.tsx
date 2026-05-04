import { Badge, Box, Grid, Group, Paper, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core';
import { IconTrendingUp } from '@tabler/icons-react';
import { adminUi as AU } from '../../theme';

const MONTHS_DATA = [32, 36, 34, 44, 48, 52, 58, 56, 62, 68, 72, 78];

function SponsorshipTrendChart() {
  const w = 520;
  const h = 200;
  const pad = [16, 12, 24, 40] as const;
  const max = Math.max(...MONTHS_DATA, 1);
  const iw = w - pad[1] - pad[3];
  const ih = h - pad[0] - pad[2];
  const pts = MONTHS_DATA.map((d, i) => {
    const x = pad[3] + (i / (MONTHS_DATA.length - 1)) * iw;
    const y = pad[0] + ih - (d / max) * ih;
    return { x, y };
  });
  const line = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const area = `${line} L ${pts[pts.length - 1]!.x},${pad[0] + ih} L ${pts[0]!.x},${pad[0] + ih} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={200} preserveAspectRatio="none">
      <defs>
        <linearGradient id="sponsorTrend" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={AU.successGreen} stopOpacity={0.2} />
          <stop offset="100%" stopColor={AU.successGreen} stopOpacity={0} />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#sponsorTrend)" />
      <path d={line} fill="none" stroke={AU.successGreen} strokeWidth={2.5} strokeLinecap="round" />
      {MONTHS_DATA.map((_, i) => (
        <text
          key={i}
          x={pad[3] + (i / (MONTHS_DATA.length - 1)) * iw}
          y={h - 6}
          fontSize={10}
          fill="#64748b"
          textAnchor="middle"
        >
          {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'][i]}
        </text>
      ))}
    </svg>
  );
}

const PARTNER_ROWS = [
  { name: 'Helping Hands Foundation', cat: 'Disaster relief', amt: '$8,400', status: 'Active' },
  { name: 'Nature First Collective', cat: 'Environment', amt: '$5,120', status: 'Active' },
  { name: 'Open Kitchens Intl', cat: 'Food security', amt: '$2,200', status: 'Pending' },
] as const;

const ORG_CARDS = [
  {
    name: 'Helping Hands',
    desc: 'Rapid-response volunteers and logistics for underserved metros.',
    logo: '🤝',
  },
  {
    name: 'Nature First',
    desc: 'Reforestation + youth education partnerships in 14 countries.',
    logo: '🌿',
  },
  {
    name: 'RiverWatch',
    desc: 'Citizen monitoring + clean water infra micro-grants.',
    logo: '💧',
  },
  {
    name: 'Elevate Scholars',
    desc: 'STEM mentorship stipends routed through verified schools.',
    logo: '🎓',
  },
] as const;

export function AdminSponsorshipPartnersPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Sponsorship & nonprofit partners
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Financial exposure, covenant compliance, and public-facing partner catalogs.
        </Text>
      </div>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder bg="#fff" h="100%">
            <Group justify="space-between" align="flex-start" mb="xs">
              <div>
                <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
                  Total sponsorships
                </Text>
                <Group gap="sm" align="flex-end">
                  <Text fz={36} fw={900}>
                    $42,500.00
                  </Text>
                  <Badge
                    variant="light"
                    color="green"
                    leftSection={<IconTrendingUp size={12} />}
                    size="lg"
                    style={{ marginBottom: 8 }}
                  >
                    +14% YoY
                  </Badge>
                </Group>
              </div>
            </Group>
            <Text fz={13} c="dimmed" mb="md">
              Paid obligations across campaigns and rollover commitments this fiscal year.
            </Text>
            <SponsorshipTrendChart />
            <Text fz={11} c="dimmed" mt={6}>
              Index scale · illustrative totals for prototyping
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper
            p="xl"
            radius="lg"
            shadow="md"
            h="100%"
            style={{
              background: `linear-gradient(160deg, ${AU.sidebarBg} 0%, #1e293b 100%)`,
              color: '#fff',
            }}
          >
            <Text fz={12} fw={700} tt="uppercase" c="rgba(255,255,255,0.7)" mb={8}>
              Active sponsors
            </Text>
            <Text fz={42} fw={900}>
              12
            </Text>
            <Text fz={13} c="rgba(255,255,255,0.82)" mt="sm">
              Multi-year commitments with escrow milestones.
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper p={0} radius="md" withBorder shadow="xs" bg="#fff">
        <Group justify="space-between" px="lg" py="md" style={{ borderBottom: '1px solid #eceef3' }}>
          <Text fw={700}>Partnership ledger</Text>
          <Badge variant="outline" color="gray" size="sm">
            Fiscal 2026
          </Badge>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th fz={11} fw={700} tt="uppercase">
                Partner name
              </Table.Th>
              <Table.Th fz={11} fw={700} tt="uppercase">
                Category
              </Table.Th>
              <Table.Th fz={11} fw={700} tt="uppercase" ta="right">
                Amount
              </Table.Th>
              <Table.Th fz={11} fw={700} tt="uppercase">
                Status
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {PARTNER_ROWS.map((r) => (
              <Table.Tr key={r.name}>
                <Table.Td fw={700}>{r.name}</Table.Td>
                <Table.Td fz={14} c="dimmed">
                  {r.cat}
                </Table.Td>
                <Table.Td fz={14} fw={800} ta="right">
                  {r.amt}
                </Table.Td>
                <Table.Td>
                  <Badge color={r.status === 'Active' ? 'green' : 'orange'} variant="light" size="sm">
                    {r.status}
                  </Badge>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Paper>

      <div>
        <Title order={4} fz={16} fw={800} mb="md">
          Nonprofit partners
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
          {ORG_CARDS.map((o) => (
            <Paper key={o.name} p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Box fz={36} lh={1} mb="sm">
                {o.logo}
              </Box>
              <Text fw={800} fz={16}>
                {o.name}
              </Text>
              <Text fz={13} c="dimmed" mt={8} lineClamp={3}>
                {o.desc}
              </Text>
              <Text fz={13} fw={600} mt="md" c={AU.successGreen}>
                View details →
              </Text>
            </Paper>
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
