import { Box, Button, Grid, Group, Paper, SimpleGrid, Stack, Text, Title } from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { adminUi as AU } from '../../theme';

function ImpactDonut() {
  const segments = [
    { pct: 42, color: AU.successGreen },
    { pct: 28, color: AU.accentTeal },
    { pct: 18, color: '#3b82f6' },
    { pct: 12, color: '#94a3b8' },
  ];
  let cum = 0;
  const grad = segments
    .map((s) => {
      const start = (cum / 100) * 360;
      cum += s.pct;
      const end = (cum / 100) * 360;
      return `${s.color} ${start}deg ${end}deg`;
    })
    .join(', ');
  const labels = ['Travel stipends', 'Regional hubs', 'Emergency relief', 'Awareness'];
  return (
    <Group justify="center" gap="lg" wrap="wrap">
      <Box
        w={168}
        h={168}
        style={{
          borderRadius: '50%',
          background: `conic-gradient(${grad})`,
          position: 'relative',
          boxShadow: '0 14px 36px rgba(15,23,42,0.1)',
        }}
      >
        <Box
          style={{
            position: 'absolute',
            inset: 46,
            borderRadius: '50%',
            background: '#fff',
            display: 'grid',
            placeItems: 'center',
          }}
        >
          <Text fz={22} fw={800}>
            100%
          </Text>
          <Text fz={11} c="dimmed">
            Allocated
          </Text>
        </Box>
      </Box>
      <Stack gap={6} miw={160}>
        {segments.map((s, i) => (
          <Group key={labels[i]} gap={8} wrap="nowrap">
            <Box w={10} h={10} style={{ borderRadius: 4, background: s.color }} />
            <Text fz={13} truncate>
              {labels[i]}
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

/** Stylized dots on a simple world silhouette (approximate UX, not geographic GIS). */
function ImpactMapSvg() {
  const markers = [
    { cx: 120, cy: 88, label: 'NA' },
    { cx: 232, cy: 112, label: 'EU' },
    { cx: 302, cy: 168, label: 'AF' },
    { cx: 388, cy: 200, label: 'APAC' },
    { cx: 168, cy: 198, label: 'LATAM' },
  ];
  return (
    <svg viewBox="0 0 480 240" width="100%" height={220} style={{ display: 'block' }}>
      <defs>
        <linearGradient id="mapOcean" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ecfdf5" />
          <stop offset="100%" stopColor="#d1fae5" />
        </linearGradient>
      </defs>
      <rect width="480" height="240" fill="url(#mapOcean)" rx={12} />
      <path
        fill="#bbf7d0"
        opacity={0.85}
        d="M40 120 Q80 60 140 80 T260 70 T400 100 T420 160 T320 200 T180 190 T60 160 Z"
      />
      <path
        fill="#86efac"
        opacity={0.55}
        d="M280 140 Q340 120 380 150 T440 180 T360 210 T280 180 Z"
      />
      {markers.map((m) => (
        <g key={m.label}>
          <circle cx={m.cx} cy={m.cy} r={14} fill={AU.successGreen} opacity={0.2} />
          <circle cx={m.cx} cy={m.cy} r={6} fill={AU.successGreen} stroke="#fff" strokeWidth={2} />
        </g>
      ))}
    </svg>
  );
}

export function AdminCommunityImpactPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Community impact overview
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Where funds flow, which regions are active, and who is driving outcomes.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
        {[
          { t: 'Total impact score', v: '8.4', h: 'Composite index · normalized' },
          { t: 'Active projects', v: '1,284', h: 'Open initiatives' },
          { t: 'Volunteers', v: '432', h: 'Hours logged · 30d' },
          { t: 'Total donations', v: '$24,500', h: 'Verified contributions' },
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
        <Grid.Col span={{ base: 12, lg: 5 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" h="100%">
            <Text fw={700} fz={15} mb="md">
              Payment distribution
            </Text>
            <ImpactDonut />
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 7 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" h="100%">
            <Text fw={700} fz={15} mb="sm">
              Causes impacted by region
            </Text>
            <Text fz={13} c="dimmed" mb="md">
              Green markers highlight active programs with verified disbursements.
            </Text>
            <ImpactMapSvg />
          </Paper>
        </Grid.Col>
      </Grid>

      <Grid gap="md" align="stretch">
        <Grid.Col span={{ base: 12, md: 8 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Text fw={700} fz={15} mb="md">
              Program milestones
            </Text>
            <SimpleGrid cols={{ base: 1, sm: 2 }}>
              {['Scholarships · Nairobi hub', 'Meals · NYC mutual aid', 'Reforestation · Andes corridor'].map(
                (label) => (
                  <Paper key={label} p="md" radius="md" bg={AU.pageBg}>
                    <Text fz={13} fw={700}>
                      {label}
                    </Text>
                    <Text fz={12} c="dimmed" mt={6}>
                      Dashboard syncs nightly from disbursement rails.
                    </Text>
                  </Paper>
                ),
              )}
            </SimpleGrid>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 4 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" h="100%">
            <Text fw={700} fz={15} mb="md">
              Top contributors
            </Text>
            <Stack gap={0}>
              {[
                { n: 'Jordan Lee', proj: 'Youth STEM · 14 sites', amt: '$4,200' },
                { n: 'Partnership Fund', proj: 'Logistics subsidy', amt: '$3,850' },
                { n: 'Ana Morales', proj: 'Local chapters', amt: '$1,910' },
                { n: 'Northwind Grants', proj: 'Field ops stipend', amt: '$980' },
              ].map((row, i, arr) => (
                <div key={row.n} style={{ padding: '12px 0', borderBottom: i < arr.length - 1 ? '1px solid #eceef3' : 'none' }}>
                  <Group justify="space-between" wrap="nowrap">
                    <div style={{ minWidth: 0 }}>
                      <Text fz={13} fw={700} truncate>
                        {row.n}
                      </Text>
                      <Text fz={12} c="dimmed" lineClamp={1}>
                        {row.proj}
                      </Text>
                    </div>
                    <Text fz={13} fw={800} style={{ flexShrink: 0 }}>
                      {row.amt}
                    </Text>
                  </Group>
                </div>
              ))}
            </Stack>
            <Button fullWidth mt="lg" radius="md" leftSection={<IconPlus size={18} />} {...tealBtn}>
              Add new project
            </Button>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

const tealBtn = {
  styles: { root: { backgroundColor: AU.accentTeal, border: 'none', color: '#fff' } },
} as const;
