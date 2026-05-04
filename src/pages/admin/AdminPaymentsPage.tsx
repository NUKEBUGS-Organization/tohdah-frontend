import { Badge, Button, Grid, Group, Paper, SimpleGrid, Stack, Table, Text, Title } from '@mantine/core';
import {
  IconDownload,
  IconFileSpreadsheet,
  IconRefresh,
  IconSpeakerphone,
} from '@tabler/icons-react';
import { adminUi as AU } from '../../theme';

type TxRow = {
  id: string;
  date: string;
  user: string;
  amount: string;
  status: 'Success' | 'Pending' | 'Refunded' | 'Failed';
};

const TX: TxRow[] = [
  { id: 'TX-882914', date: '2026-05-04', user: 'Sarah Jenkins', amount: '$120.00', status: 'Success' },
  { id: 'TX-882810', date: '2026-05-03', user: 'Omar Rivera', amount: '$890.40', status: 'Success' },
  { id: 'TX-881402', date: '2026-05-03', user: 'Chloe Nguyen', amount: '$64.99', status: 'Pending' },
  { id: 'TX-880991', date: '2026-05-02', user: 'Leo Martins', amount: '$45.10', status: 'Refunded' },
  { id: 'TX-880305', date: '2026-05-02', user: 'Priya Sharma', amount: '$2,050.00', status: 'Success' },
  { id: 'TX-879812', date: '2026-05-01', user: 'Aisha K.', amount: '$19.95', status: 'Failed' },
];

function TxBadge(status: TxRow['status']) {
  if (status === 'Success') return <Badge color="green" variant="light" size="sm">Success</Badge>;
  if (status === 'Pending') return <Badge color="orange" variant="light" size="sm">Pending</Badge>;
  if (status === 'Refunded') return <Badge color="gray" variant="light" size="sm">Refunded</Badge>;
  return <Badge color="red" variant="light" size="sm">Failed</Badge>;
}

function AmountCard({
  title,
  value,
  hint,
}: {
  title: string;
  value: string;
  hint?: string;
}) {
  return (
    <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
      <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
        {title}
      </Text>
      <Text fz={24} fw={800}>
        {value}
      </Text>
      {hint ? (
        <Text fz={11} c="dimmed" mt={4}>
          {hint}
        </Text>
      ) : null}
    </Paper>
  );
}

export function AdminPaymentsPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Payment management
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Revenue rollups and recent payouts with SLA-friendly filters.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
        <AmountCard title="Total revenue" value="$13,500.00" hint="Settled MTD · USD" />
        <AmountCard title="Pending payments" value="$2,200.00" hint="Including holds" />
        <AmountCard title="Successful payments" value="$11,410.00" hint="Net fees applied" />
        <AmountCard title="Refunded" value="$890.00" hint="Across 42 tickets" />
      </SimpleGrid>

      <Grid gap="lg">
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <Paper radius="md" withBorder shadow="xs" bg="#fff" p={{ base: 0, md: 0 }}>
            <Stack gap={0}>
              <Group justify="space-between" px="lg" py="md" wrap="nowrap" style={{ borderBottom: '1px solid #e8ecf1' }}>
                <Text fw={700} fz={15}>
                  Recent transactions
                </Text>
                <Badge variant="outline" color="gray" size="sm">
                  Last 180 days
                </Badge>
              </Group>
              <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th fz={11} fw={700} tt="uppercase">
                      ID
                    </Table.Th>
                    <Table.Th fz={11} fw={700} tt="uppercase">
                      Date
                    </Table.Th>
                    <Table.Th fz={11} fw={700} tt="uppercase">
                      User
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
                  {TX.map((row) => (
                    <Table.Tr key={row.id}>
                      <Table.Td>
                        <Text fz={13} fw={700}>
                          {row.id}
                        </Text>
                      </Table.Td>
                      <Table.Td fz={13} c="dimmed">
                        {row.date}
                      </Table.Td>
                      <Table.Td fz={13}>
                        {row.user}
                      </Table.Td>
                      <Table.Td fz={13} fw={700} ta="right">
                        {row.amount}
                      </Table.Td>
                      <Table.Td>{TxBadge(row.status)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Stack>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Stack gap="md">
            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Text fw={700} fz={15} mb="md">
                Quick actions
              </Text>
              <Stack gap="xs">
                <Button fullWidth leftSection={<IconDownload size={16} />} variant="outline" radius="md">
                  Export payouts CSV
                </Button>
                <Button fullWidth leftSection={<IconFileSpreadsheet size={16} />} variant="outline" radius="md">
                  Open reconciler
                </Button>
                <Button fullWidth leftSection={<IconRefresh size={16} />} variant="light" color="teal" radius="md">
                  Sync Stripe balance
                </Button>
                <Button fullWidth leftSection={<IconSpeakerphone size={16} />} variant="filled" {...tealFilled}>
                  Broadcast fee notice
                </Button>
              </Stack>
            </Paper>

            <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Text fw={700} fz={15} mb="md">
                Payment summary
              </Text>
              <Stack gap="sm">
                {[
                  { k: 'Net fees (MoM)', v: '+$842' },
                  { k: 'Chargeback rate', v: '0.12%' },
                  { k: 'Avg payout time', v: '1.8 days' },
                ].map((r) => (
                  <Group key={r.k} justify="space-between">
                    <Text fz={13} c="dimmed">
                      {r.k}
                    </Text>
                    <Text fz={13} fw={700}>
                      {r.v}
                    </Text>
                  </Group>
                ))}
              </Stack>
              <DividerLine />
              <Text fz={11} c="dimmed">
                Figures are illustrative placeholders for prototype review.
              </Text>
            </Paper>
          </Stack>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}

const tealFilled = {
  styles: { root: { backgroundColor: AU.accentTeal, border: 'none', color: '#fff' } },
} as const;

function DividerLine() {
  return <div style={{ height: 1, background: '#e8ecf1', margin: '12px 0' }} />;
}
