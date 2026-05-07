import {
  Alert,
  Badge,
  Grid,
  Group,
  Paper,
  Pagination,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { adminService } from '../../api/services/admin.service';
import type { Booking } from '../../api/types';
import { formatDateTime, populatedName } from './adminHelpers';

function statusBadge(status: string) {
  return (
    <Badge variant="light" size="sm" color="gray">
      {status}
    </Badge>
  );
}

export function AdminPaymentsPage() {
  const { page, limit, setPage } = usePagination(20);
  const [tableStatus, setTableStatus] = useState<string | null>(null);

  const { data: stats, isLoading: statsLoading } = useApi(() => adminService.getStats(), []);

  const bookParams = useMemo(
    () => ({
      status: tableStatus ?? undefined,
      page,
      limit,
    }),
    [tableStatus, page, limit],
  );

  const { data: bookingsPage, isLoading: bookLoading } = useApi(
    () => adminService.getBookings(bookParams),
    [bookParams],
  );

  const rows = bookingsPage?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((bookingsPage?.total ?? 0) / limit));

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Payment management
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Commission and booking financials (stub payments until Stripe is integrated).
        </Text>
      </div>

      <Alert color="blue" title="Payment processing">
        Payment processing is in stub mode. Stripe integration pending.
      </Alert>

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
            Total commission
          </Text>
          {statsLoading ? (
            <Skeleton height={28} w="50%" />
          ) : (
            <Text fz={24} fw={800}>
              ${(stats?.revenue.totalCommission ?? 0).toFixed(2)}
            </Text>
          )}
          <Text fz={11} c="dimmed" mt={4}>
            Platform commission on completed bookings (admin stats).
          </Text>
        </Paper>
        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
            This month
          </Text>
          {statsLoading ? (
            <Skeleton height={28} w="50%" />
          ) : (
            <Text fz={24} fw={800}>
              ${(stats?.revenue.thisMonth ?? 0).toFixed(2)}
            </Text>
          )}
        </Paper>
        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
            This week
          </Text>
          {statsLoading ? (
            <Skeleton height={28} w="50%" />
          ) : (
            <Text fz={24} fw={800}>
              ${(stats?.revenue.thisWeek ?? 0).toFixed(2)}
            </Text>
          )}
        </Paper>
        <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
          <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
            Disputed
          </Text>
          {statsLoading ? (
            <Skeleton height={28} w="30%" />
          ) : (
            <Text fz={24} fw={800}>
              {stats?.bookings.disputed ?? 0}
            </Text>
          )}
        </Paper>
      </SimpleGrid>

      <Grid gap="lg">
        <Grid.Col span={12}>
          <Paper radius="md" withBorder shadow="xs" bg="#fff" p="md">
            <Group justify="space-between" mb="md" wrap="wrap">
              <Text fw={700} fz={15}>
                Transactions (bookings)
              </Text>
              <Select
                placeholder="Filter by status"
                clearable
                data={[
                  { value: 'completed', label: 'Completed' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'disputed', label: 'Disputed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={tableStatus}
                onChange={(v) => {
                  setTableStatus(v);
                  setPage(1);
                }}
                w={200}
              />
            </Group>
            {bookLoading ? (
              <Stack gap="sm">
                {[1, 2, 3, 4, 5].map((i) => (
                  <Skeleton key={i} height={36} />
                ))}
              </Stack>
            ) : rows.length === 0 ? (
              <Text c="dimmed">No bookings for this filter.</Text>
            ) : (
              <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Ref</Table.Th>
                    <Table.Th>Requester</Table.Th>
                    <Table.Th>Traveler</Table.Th>
                    <Table.Th ta="right">Agreed fee</Table.Th>
                    <Table.Th ta="right">Commission</Table.Th>
                    <Table.Th ta="right">Traveler payout</Table.Th>
                    <Table.Th ta="right">Refund</Table.Th>
                    <Table.Th>Status</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {rows.map((b: Booking) => (
                    <Table.Tr key={b._id}>
                      <Table.Td fz={13} c="dimmed">
                        {formatDateTime(b.createdAt)}
                      </Table.Td>
                      <Table.Td fw={700}>{b.bookingRef}</Table.Td>
                      <Table.Td fz={13}>{populatedName(b.requesterId)}</Table.Td>
                      <Table.Td fz={13}>{populatedName(b.travelerId)}</Table.Td>
                      <Table.Td fz={13} fw={700} ta="right">
                        {b.agreedFee ?? b.offeredFee}
                      </Table.Td>
                      <Table.Td fz={13} ta="right">
                        {b.platformCommission ?? '—'}
                      </Table.Td>
                      <Table.Td fz={13} ta="right">
                        {b.travelerPayout ?? '—'}
                      </Table.Td>
                      <Table.Td fz={13} ta="right" c={b.refundAmount != null && b.refundAmount > 0 ? 'red' : undefined}>
                        {b.status === 'disputed' && b.refundAmount != null && b.refundAmount > 0 ? b.refundAmount : '—'}
                      </Table.Td>
                      <Table.Td>{statusBadge(b.status)}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            )}
            {!bookLoading && rows.length > 0 ? (
              <Group justify="center" mt="md">
                <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
              </Group>
            ) : null}
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
