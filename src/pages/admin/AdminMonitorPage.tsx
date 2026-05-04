import { Badge, Divider, Drawer, Group, Image, Paper, Stack, Text, Title } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconFileInvoice } from '@tabler/icons-react';
import { useState } from 'react';
import { adminUi as AU } from '../../theme';

type QueueItem = {
  id: string;
  title: string;
  sub: string;
  status: 'Review' | 'Flagged' | 'Cleared' | 'Pending';
};

const ROWS: QueueItem[] = [
  { id: 'mon-01', title: 'PAY-98214 · Receipt mismatch', sub: 'User attached alternate invoice · $420', status: 'Review' },
  { id: 'mon-02', title: 'PAY-77201 · High velocity hold', sub: '3 payouts in 6 hours · AML rule', status: 'Flagged' },
  { id: 'mon-03', title: 'PAY-64038 · Automated review', sub: 'Standard clearance · escrow release', status: 'Cleared' },
  { id: 'mon-04', title: 'PAY-55290 · Stripe dispute', sub: 'Evidence window closes in 41h', status: 'Pending' },
];

function rowBadge(status: QueueItem['status']) {
  const colors: Record<QueueItem['status'], string> = {
    Review: 'yellow',
    Flagged: 'red',
    Cleared: 'teal',
    Pending: 'orange',
  };
  return (
    <Badge color={colors[status]} variant="light" size="sm">
      {status}
    </Badge>
  );
}

export function AdminMonitorPage() {
  const [opened, { open, close }] = useDisclosure(false);
  const [picked, setPicked] = useState<(typeof ROWS)[0] | null>(null);

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Monitoring
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Payment and compliance queues with receipt-level detail.
        </Text>
      </div>

      <Paper radius="md" withBorder shadow="xs" bg="#fff">
        <Stack gap={0}>
          {ROWS.map((row, idx) => (
            <Paper
              key={row.id}
              component="button"
              type="button"
              px="lg"
              py="md"
              radius={0}
              withBorder={false}
              onClick={() => {
                setPicked(row);
                open();
              }}
              style={{
                cursor: 'pointer',
                textAlign: 'left',
                borderBottom: idx < ROWS.length - 1 ? '1px solid #e8ecf1' : 'none',
                background: picked?.id === row.id ? `${AU.accentTeal}12` : 'transparent',
                transition: 'background 120ms ease',
              }}
            >
              <Group justify="space-between" wrap="nowrap" gap="md">
                <Group gap="md" wrap="nowrap" miw={0}>
                  <ThemeIconMuted />
                  <div style={{ minWidth: 0 }}>
                    <Text fw={700} fz={14} truncate>
                      {row.title}
                    </Text>
                    <Text fz={13} c="dimmed">
                      {row.sub}
                    </Text>
                  </div>
                </Group>
                {rowBadge(row.status)}
              </Group>
            </Paper>
          ))}
        </Stack>
      </Paper>

      <Drawer
        opened={opened}
        onClose={() => {
          close();
          setPicked(null);
        }}
        position="right"
        size="lg"
        offset={16}
        radius="lg"
        title={
          picked ? (
            <Text fz={13} fw={700} tt="uppercase" c="dimmed">
              Payment details
            </Text>
          ) : null
        }
      >
        {picked ? (
          <Stack gap="md">
            <Group justify="space-between">
              <Text fw={700} fz={18}>
                {picked.title.split(' · ')[0]}
              </Text>
              {rowBadge(picked.status)}
            </Group>

            <Stack gap={6}>
              <Text fz={12} fw={700} tt="uppercase" c="dimmed">
                Transaction ID
              </Text>
              <Text fz={15} fw={700}>
                {picked.title.split(' · ')[0]}
              </Text>
            </Stack>

            <Stack gap={6}>
              <Text fz={12} fw={700} tt="uppercase" c="dimmed">
                Amount
              </Text>
              <Text fz={22} fw={800}>
                $420.00
              </Text>
              <Text fz={13} c="dimmed">
                Held in escrow until delivery confirmation matched receipt below.
              </Text>
            </Stack>

            <Divider />

            <Text fz={12} fw={700} tt="uppercase" c="dimmed">
              Attachment preview
            </Text>
            <Paper radius="md" withBorder bg="#f8fafc" p={0} style={{ overflow: 'hidden' }}>
              <Image
                radius={0}
                h={200}
                src="https://images.unsplash.com/photo-1563986768494-10f6b4c5c4c9?w=800&q=70"
                alt="Receipt thumbnail"
              />
              <Group justify="space-between" p="sm" bg="#fff">
                <Text fz={12} truncate>
                  receipt-may-{picked.id.slice(-2)}.jpg
                </Text>
                <Text fz={12} c={AU.accentTeal} fw={600}>
                  View full size
                </Text>
              </Group>
            </Paper>
          </Stack>
        ) : null}
      </Drawer>
    </Stack>
  );
}

function ThemeIconMuted() {
  return (
    <Paper radius="md" w={42} h={42} bg={AU.pageBg} style={{ display: 'grid', placeItems: 'center', flexShrink: 0 }}>
      <IconFileInvoice size={22} stroke={1.5} style={{ color: AU.accentTeal }} />
    </Paper>
  );
}
