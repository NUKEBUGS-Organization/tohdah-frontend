import { Grid, Group, Paper, Progress, SimpleGrid, Skeleton, Stack, Text, Title } from '@mantine/core';
import { adminUi as AU } from '../../theme';
import { useApi } from '../../hooks/useApi';
import { adminService } from '../../api/services/admin.service';
import { formatMoney } from './adminHelpers';

function MetricCard({
  title,
  value,
  subtitle,
  loading,
}: {
  title: string;
  value: string;
  subtitle?: string;
  loading?: boolean;
}) {
  return (
    <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
      <Text fz={12} tt="uppercase" fw={700} c="dimmed" mb={6}>
        {title}
      </Text>
      {loading ? (
        <Skeleton height={34} width="60%" mt={4} />
      ) : (
        <Text fz={28} fw={800} lh={1.2}>
          {value}
        </Text>
      )}
      {subtitle && !loading ? (
        <Text fz={12} c="dimmed" mt={4}>
          {subtitle}
        </Text>
      ) : null}
    </Paper>
  );
}

function pct(part: number, total: number): number {
  if (!total) return 0;
  return Math.round((part / total) * 1000) / 10;
}

export function AdminDashboardPage() {
  const { data: stats, isLoading } = useApi(() => adminService.getStats(), []);

  const tripsTotal = stats?.trips.total ?? 0;
  const tActive = stats?.trips.active ?? 0;
  const tDone = stats?.trips.completed ?? 0;
  const tCancel = stats?.trips.cancelled ?? 0;

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Dashboard overview
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Live metrics from the platform — refreshed when you open this page.
        </Text>
      </div>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <MetricCard
          title="Total users"
          value={String(stats?.users.total ?? 0)}
          subtitle={`+${stats?.users.newToday ?? 0} today · +${stats?.users.newThisWeek ?? 0} this week`}
          loading={isLoading}
        />
        <MetricCard
          title="Active bookings"
          value={String(stats?.bookings.active ?? 0)}
          subtitle="Confirmed, paid, or in transit"
          loading={isLoading}
        />
        <MetricCard
          title="Revenue this month"
          value={formatMoney(stats?.revenue.thisMonth ?? 0)}
          subtitle="Platform commission (completed)"
          loading={isLoading}
        />
        <MetricCard
          title="Open disputes"
          value={String(stats?.bookings.disputed ?? 0)}
          subtitle="Awaiting resolution"
          loading={isLoading}
        />
      </SimpleGrid>

      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="md">
        <MetricCard title="Travelers" value={String(stats?.users.travelers ?? 0)} loading={isLoading} />
        <MetricCard title="Requesters" value={String(stats?.users.requesters ?? 0)} loading={isLoading} />
        <MetricCard title="Support requests" value={String(stats?.requests.support ?? 0)} loading={isLoading} />
        <MetricCard title="Completed bookings" value={String(stats?.bookings.completed ?? 0)} loading={isLoading} />
      </SimpleGrid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Text fz={15} fw={700} mb="md">
              Trips breakdown
            </Text>
            {isLoading ? (
              <Stack gap="sm">
                <Skeleton height={8} />
                <Skeleton height={8} />
                <Skeleton height={8} />
              </Stack>
            ) : (
              <Stack gap="md">
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text fz={13}>Active</Text>
                    <Text fz={13} fw={600}>
                      {tActive} ({pct(tActive, tripsTotal)}%)
                    </Text>
                  </Group>
                  <Progress value={pct(tActive, tripsTotal)} color="teal" size="lg" />
                </div>
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text fz={13}>Completed</Text>
                    <Text fz={13} fw={600}>
                      {tDone} ({pct(tDone, tripsTotal)}%)
                    </Text>
                  </Group>
                  <Progress value={pct(tDone, tripsTotal)} color="blue" size="lg" />
                </div>
                <div>
                  <Group justify="space-between" mb={4}>
                    <Text fz={13}>Cancelled</Text>
                    <Text fz={13} fw={600}>
                      {tCancel} ({pct(tCancel, tripsTotal)}%)
                    </Text>
                  </Group>
                  <Progress value={pct(tCancel, tripsTotal)} color="gray" size="lg" />
                </div>
              </Stack>
            )}
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Text fz={15} fw={700} mb="md" c={AU.accentTeal}>
              Impact snapshot
            </Text>
            {isLoading ? (
              <SimpleGrid cols={2} spacing="md">
                {[1, 2, 3, 4].map((k) => (
                  <Skeleton key={k} height={56} />
                ))}
              </SimpleGrid>
            ) : (
              <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                <Paper p="md" radius="md" bg={`${AU.accentTeal}10`}>
                  <Text fz={11} tt="uppercase" fw={700} c="dimmed">
                    Support requests
                  </Text>
                  <Text fz={22} fw={800} c={AU.accentTeal}>
                    {stats?.impact.supportRequestsTotal ?? 0}
                  </Text>
                </Paper>
                <Paper p="md" radius="md" bg={`${AU.accentTeal}10`}>
                  <Text fz={11} tt="uppercase" fw={700} c="dimmed">
                    Fulfilled
                  </Text>
                  <Text fz={22} fw={800} c={AU.accentTeal}>
                    {stats?.impact.supportRequestsFulfilled ?? 0}
                  </Text>
                </Paper>
                <Paper p="md" radius="md" bg={`${AU.accentTeal}10`}>
                  <Text fz={11} tt="uppercase" fw={700} c="dimmed">
                    Volunteer deliveries
                  </Text>
                  <Text fz={22} fw={800} c={AU.accentTeal}>
                    {stats?.impact.volunteerDeliveries ?? 0}
                  </Text>
                </Paper>
                <Paper p="md" radius="md" bg={`${AU.accentTeal}10`}>
                  <Text fz={11} tt="uppercase" fw={700} c="dimmed">
                    Elderly assisted
                  </Text>
                  <Text fz={22} fw={800} c={AU.accentTeal}>
                    {stats?.impact.elderlyAssisted ?? 0}
                  </Text>
                </Paper>
              </SimpleGrid>
            )}
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
        <Text fz={15} fw={700} mb="sm">
          Revenue (commission)
        </Text>
        {isLoading ? (
          <Skeleton height={24} width="40%" />
        ) : (
          <Group gap="xl">
            <div>
              <Text fz={12} c="dimmed">
                All-time total
              </Text>
              <Text fz={20} fw={800}>
                {formatMoney(stats?.revenue.totalCommission ?? 0)}
              </Text>
            </div>
            <div>
              <Text fz={12} c="dimmed">
                This week
              </Text>
              <Text fz={20} fw={800}>
                {formatMoney(stats?.revenue.thisWeek ?? 0)}
              </Text>
            </div>
          </Group>
        )}
      </Paper>
    </Stack>
  );
}
