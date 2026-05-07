import {
  Avatar,
  Badge,
  Button,
  Group,
  Paper,
  Progress,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { adminService, type ImpactReport } from '../../api/services/admin.service';
import { adminUi as AU } from '../../theme';

function exportByTypeCsv(byType: ImpactReport['byType']) {
  const header = 'type,count,fulfilled,fulfillmentPct\n';
  const body = byType
    .map((row) => {
      const pct = row.count ? Math.round((row.fulfilled / row.count) * 10000) / 100 : 0;
      return `${JSON.stringify(row.type)},${row.count},${row.fulfilled},${pct}`;
    })
    .join('\n');
  const blob = new Blob([header + body], { type: 'text/csv;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'impact-by-type.csv';
  a.click();
  URL.revokeObjectURL(url);
}

export function AdminCommunityImpactPage() {
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const { data: impact, isLoading, error } = useApi(
    () =>
      adminService.getImpact({
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    [dateFrom, dateTo],
  );

  const ov = impact?.overview;

  return (
    <Stack gap="lg">
      <Title order={2} fz={24} fw={800}>
        Community impact
      </Title>
      <Text fz={14} c="dimmed">
        Support deliveries, beneficiaries, and top community travelers.
      </Text>

      <Paper p="md" radius="md" withBorder>
        <Group wrap="wrap" gap="sm" align="flex-end">
          <TextInput type="date" label="From" value={dateFrom} onChange={(e) => setDateFrom(e.currentTarget.value)} w={160} />
          <TextInput type="date" label="To" value={dateTo} onChange={(e) => setDateTo(e.currentTarget.value)} w={160} />
          <Button
            variant="outline"
            disabled={!impact?.byType?.length}
            onClick={() => impact && exportByTypeCsv(impact.byType)}
          >
            Export CSV (by type)
          </Button>
        </Group>
      </Paper>

      {error ? (
        <Text c="red" fz={14}>
          {error}
        </Text>
      ) : null}

      <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => <Skeleton key={i} height={88} />)
        ) : (
          <>
            <Paper p="lg" radius="md" withBorder>
              <Text fz={12} fw={700} tt="uppercase" c="dimmed">
                Support requests fulfilled
              </Text>
              <Text fz={28} fw={800} c={AU.accentTeal}>
                {ov?.supportRequestsFulfilled ?? 0}
              </Text>
            </Paper>
            <Paper p="lg" radius="md" withBorder>
              <Text fz={12} fw={700} tt="uppercase" c="dimmed">
                Elderly assisted
              </Text>
              <Text fz={28} fw={800} c={AU.accentTeal}>
                {ov?.elderlyAssisted ?? 0}
              </Text>
            </Paper>
            <Paper p="lg" radius="md" withBorder>
              <Text fz={12} fw={700} tt="uppercase" c="dimmed">
                Volunteer deliveries
              </Text>
              <Text fz={28} fw={800} c={AU.accentTeal}>
                {ov?.volunteerDeliveries ?? 0}
              </Text>
            </Paper>
            <Paper p="lg" radius="md" withBorder>
              <Text fz={12} fw={700} tt="uppercase" c="dimmed">
                Community champions
              </Text>
              <Text fz={28} fw={800} c={AU.accentTeal}>
                {ov?.communityChampions ?? 0}
              </Text>
            </Paper>
          </>
        )}
      </SimpleGrid>

      <Paper p="lg" radius="md" withBorder>
        <Text fw={700} mb="md">
          By beneficiary type
        </Text>
        {isLoading ? (
          <Skeleton height={120} />
        ) : (
          <Table striped>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Type</Table.Th>
                <Table.Th>Count</Table.Th>
                <Table.Th>Fulfilled</Table.Th>
                <Table.Th>Fulfillment</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(impact?.byType ?? []).map((row) => {
                const pct = row.count ? Math.round((row.fulfilled / row.count) * 1000) / 10 : 0;
                return (
                  <Table.Tr key={row.type}>
                    <Table.Td>{row.type}</Table.Td>
                    <Table.Td>{row.count}</Table.Td>
                    <Table.Td>{row.fulfilled}</Table.Td>
                    <Table.Td>
                      <Progress value={pct} size="lg" color="teal" />
                      <Text fz={12} c="dimmed" mt={4}>
                        {pct}%
                      </Text>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
      </Paper>

      <Paper p="lg" radius="md" withBorder>
        <Text fw={700} mb="md">
          By payment type
        </Text>
        <Group gap="sm">
          {(impact?.byPaymentType ?? []).map((p) => (
            <Badge key={p.paymentType} size="lg" variant="light" color="gray">
              {p.paymentType}: {p.count}
            </Badge>
          ))}
          {!isLoading && (impact?.byPaymentType ?? []).length === 0 ? <Text c="dimmed">No data</Text> : null}
        </Group>
      </Paper>

      <Paper p="lg" radius="md" withBorder>
        <Text fw={700} mb="md">
          Top travelers (support deliveries)
        </Text>
        {isLoading ? (
          <Skeleton height={160} />
        ) : (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Traveler</Table.Th>
                <Table.Th>Deliveries</Table.Th>
                <Table.Th>Badge</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {(impact?.topTravelers ?? []).map((t) => (
                <Table.Tr key={t.travelerId}>
                  <Table.Td>
                    <Group gap="sm">
                      <Avatar src={t.profilePhoto ?? undefined} radius="xl" size={36}>
                        {t.fullName?.charAt(0)}
                      </Avatar>
                      <Text fw={600}>{t.fullName}</Text>
                    </Group>
                  </Table.Td>
                  <Table.Td>{t.supportDeliveries}</Table.Td>
                  <Table.Td>
                    {t.supportDeliveries >= 5 ? (
                      <Badge color="teal" variant="light">
                        community_champion
                      </Badge>
                    ) : (
                      <Text fz={13} c="dimmed">
                        —
                      </Text>
                    )}
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        )}
      </Paper>
    </Stack>
  );
}
