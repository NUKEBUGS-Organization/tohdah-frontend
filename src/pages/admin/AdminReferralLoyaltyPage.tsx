import {
  Avatar,
  Badge,
  Group,
  Pagination,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { adminService, type AdminReferralRow } from '../../api/services/admin.service';
import { formatDate } from './adminHelpers';

function tierFromPoints(points: number): { label: string; color: string } {
  if (points >= 500) return { label: 'Gold', color: 'yellow' };
  if (points >= 100) return { label: 'Silver', color: 'gray' };
  return { label: 'Bronze', color: 'orange' };
}

export function AdminReferralLoyaltyPage() {
  const [tab, setTab] = useState<string | null>('referrals');
  const { page, limit, setPage } = usePagination(20);

  const { data: refData, isLoading: refLoading } = useApi(
    () => adminService.getReferrals({ page, limit }),
    [page, limit],
  );

  const { data: loyalty, isLoading: loyLoading } = useApi(() => adminService.getLoyalty(), []);

  const refRows = refData?.data ?? [];
  const refTotalPages = Math.max(1, Math.ceil((refData?.total ?? 0) / limit));

  const tiers = loyalty?.tiers ?? [];
  const maxTier = Math.max(1, ...tiers.map((t) => t.count));

  return (
    <Stack gap="lg">
      <Title order={2} fz={24} fw={800}>
        Referrals & loyalty
      </Title>

      <Tabs value={tab} onChange={(v) => {
        setTab(v);
        setPage(1);
      }}>
        <Tabs.List>
          <Tabs.Tab value="referrals">Referrals</Tabs.Tab>
          <Tabs.Tab value="loyalty">Loyalty</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="referrals" pt="md">
          {refLoading ? (
            <Stack gap="sm">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} height={40} />
              ))}
            </Stack>
          ) : refRows.length === 0 ? (
            <Text c="dimmed">No referred users yet.</Text>
          ) : (
            <Paper radius="md" withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>User</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Referred by</Table.Th>
                    <Table.Th>Join date</Table.Th>
                    <Table.Th ta="right">Points</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {refRows.map((r: AdminReferralRow) => {
                    const rb =
                      r.referredBy && typeof r.referredBy === 'object'
                        ? `${(r.referredBy as { fullName?: string }).fullName ?? ''} · ${(r.referredBy as { email?: string }).email ?? ''}`
                        : '—';
                    return (
                      <Table.Tr key={r.id}>
                        <Table.Td fw={700}>{r.fullName}</Table.Td>
                        <Table.Td fz={13} c="dimmed">
                          {r.email}
                        </Table.Td>
                        <Table.Td fz={13}>{rb}</Table.Td>
                        <Table.Td fz={13}>{formatDate(r.createdAt)}</Table.Td>
                        <Table.Td fz={13} ta="right">
                          {r.loyaltyPoints ?? 0}
                        </Table.Td>
                      </Table.Tr>
                    );
                  })}
                </Table.Tbody>
              </Table>
              <Group justify="center" py="md">
                <Pagination total={refTotalPages} value={page} onChange={setPage} size="sm" />
              </Group>
            </Paper>
          )}
        </Tabs.Panel>

        <Tabs.Panel value="loyalty" pt="md">
          {loyLoading || !loyalty ? (
            <Stack gap="sm">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} height={80} />
              ))}
            </Stack>
          ) : (
            <>
              <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md" mb="lg">
                {['bronze', 'silver', 'gold'].map((tierName) => {
                  const row = tiers.find((t) => t.tier === tierName) ?? { tier: tierName, count: 0 };
                  const color = tierName === 'gold' ? 'yellow' : tierName === 'silver' ? 'gray' : 'orange';
                  return (
                    <Paper key={tierName} p="lg" radius="md" withBorder>
                      <Text fz={12} fw={700} tt="uppercase" c="dimmed">
                        {tierName}
                      </Text>
                      <Text fz={28} fw={800}>
                        {row.count}
                      </Text>
                      <Progress value={(row.count / maxTier) * 100} color={color} mt="md" size="lg" />
                    </Paper>
                  );
                })}
              </SimpleGrid>

              <Paper radius="md" withBorder p={0}>
                <Text fw={700} px="lg" py="md" style={{ borderBottom: '1px solid #eceef3' }}>
                  Top users by points
                </Text>
                <Table>
                  <Table.Thead>
                    <Table.Tr>
                      <Table.Th>#</Table.Th>
                      <Table.Th>User</Table.Th>
                      <Table.Th>Email</Table.Th>
                      <Table.Th ta="right">Points</Table.Th>
                      <Table.Th>Tier</Table.Th>
                    </Table.Tr>
                  </Table.Thead>
                  <Table.Tbody>
                    {(loyalty.topUsers ?? []).map((u, idx) => {
                      const t = tierFromPoints(u.points);
                      return (
                        <Table.Tr key={`${u.email}-${idx}`}>
                          <Table.Td>{idx + 1}</Table.Td>
                          <Table.Td>
                            <Group gap="sm">
                              <Avatar radius="xl" size={32}>
                                {u.fullName?.charAt(0)}
                              </Avatar>
                              <Text fw={600}>{u.fullName}</Text>
                            </Group>
                          </Table.Td>
                          <Table.Td fz={13} c="dimmed">
                            {u.email}
                          </Table.Td>
                          <Table.Td ta="right" fw={700}>
                            {u.points}
                          </Table.Td>
                          <Table.Td>
                            <Badge color={t.color} variant="light">
                              {t.label}
                            </Badge>
                          </Table.Td>
                        </Table.Tr>
                      );
                    })}
                  </Table.Tbody>
                </Table>
              </Paper>
            </>
          )}
        </Tabs.Panel>
      </Tabs>
    </Stack>
  );
}
