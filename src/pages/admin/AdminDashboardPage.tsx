import { Badge, Box, Grid, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconAlertTriangle, IconChartLine } from '@tabler/icons-react';
import { adminUi as AU } from '../../theme';

const DAYS = Array.from({ length: 30 }, (_, i) => {
  const v = 40 + Math.sin(i / 4) * 22 + Math.cos(i / 2.2) * 12 + ((i % 7) + 7) % 9;
  return Math.max(8, Math.min(100, Math.round(v)));
});

function DashboardLineChart() {
  const w = 560;
  const h = 180;
  const pad = [16, 10, 16, 32] as const;
  const innerW = w - pad[1] - pad[3];
  const innerH = h - pad[0] - pad[2];
  const maxVal = Math.max(...DAYS, 1);
  const pts = DAYS.map((d, i) => {
    const x = pad[3] + (i / (DAYS.length - 1 || 1)) * innerW;
    const y = pad[0] + innerH - (d / maxVal) * innerH;
    return { x, y };
  });
  const lineD = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
  const areaD = `${lineD} L ${pts[pts.length - 1]!.x},${pad[0] + innerH} L ${pts[0]!.x},${pad[0] + innerH} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} width="100%" height={h} preserveAspectRatio="none" style={{ display: 'block' }}>
      <defs>
        <linearGradient id="adminLineGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={AU.accentTeal} stopOpacity={0.25} />
          <stop offset="100%" stopColor={AU.accentTeal} stopOpacity={0.02} />
        </linearGradient>
      </defs>
      <path d={areaD} fill="url(#adminLineGrad)" />
      <path d={lineD} fill="none" stroke={AU.accentTeal} strokeWidth={2.5} strokeLinecap="round" />
      {[0.25, 0.5, 0.75].map((pct) => {
        const gy = pad[0] + innerH * (1 - pct);
        return (
          <line
            key={pct}
            x1={pad[3]}
            y1={gy}
            x2={pad[3] + innerW}
            y2={gy}
            stroke="#e2e8f0"
            strokeWidth={1}
            strokeDasharray="4 4"
          />
        );
      })}
    </svg>
  );
}

function RequestTypeDonut() {
  const segments = [
    { label: 'Express', pct: 36, color: AU.accentTeal },
    { label: 'Standard', pct: 28, color: '#3b82f6' },
    { label: 'Community', pct: 22, color: '#8b5cf6' },
    { label: 'Other', pct: 14, color: '#94a3b8' },
  ] as const;
  let cum = 0;
  const gradStops = segments
    .map((s) => {
      const start = (cum / 100) * 360;
      cum += s.pct;
      const end = (cum / 100) * 360;
      return `${s.color} ${start}deg ${end}deg`;
    })
    .join(', ');
  return (
    <Group justify="center" gap="xl" wrap="nowrap" px="sm">
      <Box
        w={172}
        h={172}
        style={{
          borderRadius: '50%',
          background: `conic-gradient(${gradStops})`,
          flexShrink: 0,
          position: 'relative',
          boxShadow: '0 12px 32px rgba(15,23,42,0.08)',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            inset: 48,
            borderRadius: '50%',
            background: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Text fz={26} fw={800} lh={1.1}>
            100<span style={{ fontSize: 13, fontWeight: 600 }}>%</span>
          </Text>
          <Text fz={11} c="dimmed">
            Requests
          </Text>
        </Box>
      </Box>
      <Stack gap={8} miw={120}>
        {segments.map((s) => (
          <Group key={s.label} gap={8} wrap="nowrap">
            <Box w={10} h={10} style={{ borderRadius: 4, background: s.color }} />
            <Text fz={13} truncate>
              {s.label}
            </Text>
            <Text fz={13} fw={700} ml="auto">
              {s.pct}%
            </Text>
          </Group>
        ))}
      </Stack>
    </Group>
  );
}

function MetricCard({
  title,
  value,
  subtitle,
}: {
  title: string;
  value: string;
  subtitle?: string;
}) {
  return (
    <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
      <Text fz={12} tt="uppercase" fw={700} c="dimmed" mb={6}>
        {title}
      </Text>
      <Text fz={28} fw={800} lh={1.2}>
        {value}
      </Text>
      {subtitle ? (
        <Text fz={12} c="dimmed" mt={4}>
          {subtitle}
        </Text>
      ) : null}
    </Paper>
  );
}

export function AdminDashboardPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Dashboard overview
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Key metrics across users, bookings, and revenue — last refresh 12 min ago.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <MetricCard title="Total users" value="12,450" subtitle="+2.1% vs last month" />
        <MetricCard title="Active bookings" value="842" subtitle="Including en route orders" />
        <MetricCard title="Total revenue" value="$142,500" subtitle="Paid out + escrow" />
        <MetricCard title="New requests" value="14" subtitle="Submitted in last 24h" />
      </SimpleGrid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Group justify="space-between" mb="md">
              <Group gap={8}>
                <IconChartLine size={20} style={{ color: AU.accentTeal }} stroke={1.5} />
                <Text fz={15} fw={700}>
                  Daily bookings (30 days)
                </Text>
              </Group>
              <Badge variant="light" color="gray" size="sm">
                Unified
              </Badge>
            </Group>
            <DashboardLineChart />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" style={{ height: '100%', minHeight: 280 }}>
            <Text fz={15} fw={700} mb="md">
              Request types
            </Text>
            <RequestTypeDonut />
          </Paper>
        </Grid.Col>
      </Grid>

      <SimpleGrid cols={{ base: 1, md: 2 }} spacing="md">
        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fz={15} fw={700} mb="md">
            Recent activity
          </Text>
          <Stack gap={0}>
            {[
              { u: 'Liam Patel', a: 'Updated traveler profile verification', t: '2m ago' },
              { u: 'Maria Chen', a: 'Created booking TH-92814', t: '18m ago' },
              { u: 'Support bot', a: 'Escalated dispute #441 to finance', t: '1h ago' },
              { u: 'Aisha K.', a: 'Completed delivery · JFK→CDG', t: '2h ago' },
            ].map((row, i, arr) => (
              <div key={row.a} style={{ padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #e8ecf1' : 'none' }}>
                <Group justify="space-between" wrap="nowrap" gap="md">
                  <div style={{ minWidth: 0 }}>
                    <Text fz={13} fw={700} truncate>
                      {row.u}
                    </Text>
                    <Text fz={13} c="dimmed" lineClamp={2}>
                      {row.a}
                    </Text>
                  </div>
                  <Text fz={12} c="dimmed" style={{ flexShrink: 0 }}>
                    {row.t}
                  </Text>
                </Group>
              </div>
            ))}
          </Stack>
        </Paper>

        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Group justify="space-between" mb="md">
            <Text fz={15} fw={700}>
              System alerts
            </Text>
            <Badge color="orange" variant="light" size="sm" leftSection={<IconAlertTriangle size={12} />}>
              Attention
            </Badge>
          </Group>
          <Stack gap={0}>
            {[
              {
                severity: 'error' as const,
                t: 'Payout webhook latency',
                d: 'Provider response > 8s · US-East',
              },
              { severity: 'warning' as const, t: 'Queue backlog', d: 'Image moderation · 412 pending' },
              { severity: 'success' as const, t: 'Backup completed', d: 'Nightly Postgres snapshot ✓' },
            ].map((row, i, arr) => (
              <div key={row.t} style={{ padding: '14px 0', borderBottom: i < arr.length - 1 ? '1px solid #e8ecf1' : 'none' }}>
                <Group align="flex-start" wrap="nowrap" gap={10}>
                  <Badge color={row.severity === 'error' ? 'red' : row.severity === 'warning' ? 'orange' : 'teal'} size="xs" variant="filled" mt={4} style={{ flexShrink: 0 }}>
                    {row.severity === 'error' ? 'ERR' : row.severity === 'warning' ? 'WRN' : 'OK'}
                  </Badge>
                  <div style={{ minWidth: 0 }}>
                    <Text fz={13} fw={700}>
                      {row.t}
                    </Text>
                    <Text fz={12} c="dimmed">
                      {row.d}
                    </Text>
                  </div>
                </Group>
              </div>
            ))}
          </Stack>
        </Paper>
      </SimpleGrid>
    </Stack>
  );
}
