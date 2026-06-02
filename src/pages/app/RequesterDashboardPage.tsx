import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  Group,
  Paper,
  ScrollArea,
  SimpleGrid,
  Skeleton,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconPackage, IconPlus, IconStar } from '@tabler/icons-react';
import { useQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { requestsService } from '../../api/services/requests.service';
import { tripsService } from '../../api/services/trips.service';
import { paginatedRows } from '../../api/booking-utils';
import { useAuth } from '../../context/AuthContext';
import { resolveUserId } from '../../utils/screen-data';
import { colors, requesterUi as RQ } from '../../theme';
import type { DeliveryRequest, Trip, User } from '../../api/types';

const ACTIVE_REQUEST_STATUSES = new Set([
  'pending',
  'matched',
  'confirmed',
  'in_transit',
  'delivered',
]);

function displayName(u: string | Partial<User> | undefined): string {
  if (u && typeof u === 'object' && 'fullName' in u && typeof u.fullName === 'string') {
    return u.fullName;
  }
  return 'Traveler';
}

export function RequesterDashboardPage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, isRestoring } = useAuth();
  const userId = resolveUserId(user);
  const authReady = isAuthenticated && !isRestoring && !!userId;

  const { data: requestsData, isFetching: lm } = useQuery({
    queryKey: ['requests', 'my', userId],
    queryFn: () => requestsService.getMy({ limit: 100 }),
    enabled: authReady,
  });

  const { data: browseTrips, isLoading: lb } = useQuery({
    queryKey: ['trips', 'browse', 'dashboard-preview'],
    queryFn: () => tripsService.browse({ limit: 3, page: 1 }),
  });

  const allRequests = paginatedRows(requestsData);

  const activeRequests = useMemo(
    () => allRequests.filter((r) => ACTIVE_REQUEST_STATUSES.has(r.status)),
    [allRequests],
  );

  const activeReqCount = activeRequests.length;
  const inTransitCount = allRequests.filter((r) => r.status === 'in_transit').length;
  const completedCount = allRequests.filter((r) => r.status === 'completed').length;

  const requests = activeRequests.slice(0, 5);
  const trips = browseTrips?.data ?? [];

  return (
    <Stack gap="xl" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Box>
          <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
            Welcome back, Requester
          </Title>
          <Text c={colors.mutedText} mt={6} fz={15}>
            Track deliveries and browse suggested travelers for your corridors.
          </Text>
        </Box>
        <Button
          component={Link}
          to="/app/requester/select-type"
          leftSection={<IconPlus size={18} />}
          radius="md"
          styles={{ root: { background: RQ.standardBlue } }}
        >
          New request
        </Button>
      </Group>

      <SimpleGrid cols={{ base: 1, sm: 3 }} spacing="md">
        <Card withBorder p="md" radius="md">
          <Text fz={12} tt="uppercase" fw={700} c={colors.subtleText}>
            Active requests
          </Text>
          {lm ? (
            <Skeleton h={28} mt={8} />
          ) : (
            <Text fz={28} fw={800}>
              {activeReqCount}
            </Text>
          )}
        </Card>
        <Card withBorder p="md" radius="md">
          <Text fz={12} tt="uppercase" fw={700} c={colors.subtleText}>
            In transit
          </Text>
          {lm ? (
            <Skeleton h={28} mt={8} />
          ) : (
            <Text fz={28} fw={800}>
              {inTransitCount}
            </Text>
          )}
        </Card>
        <Card withBorder p="md" radius="md">
          <Text fz={12} tt="uppercase" fw={700} c={colors.subtleText}>
            Completed
          </Text>
          {lm ? (
            <Skeleton h={28} mt={8} />
          ) : (
            <Text fz={28} fw={800}>
              {completedCount}
            </Text>
          )}
        </Card>
      </SimpleGrid>

      <Box>
        <Title order={4} fz={16} fw={700} mb="md" c={colors.navyDeep}>
          My active requests
        </Title>
        {lm ? (
          <Skeleton height={160} />
        ) : requests.length === 0 ? (
          <Text c={colors.mutedText}>No requests yet. Create one to get matched.</Text>
        ) : (
          <ScrollArea type="never" scrollbarSize={0}>
            <Group gap="md" wrap="nowrap" pb={8} align="stretch">
              {requests.map((r: DeliveryRequest) => {
                const traveler =
                  r.matchedTravelerId && typeof r.matchedTravelerId === 'object'
                    ? r.matchedTravelerId
                    : undefined;
                const name = displayName(traveler as Partial<User>);
                return (
                  <Card
                    key={r._id}
                    withBorder
                    radius="md"
                    padding="lg"
                    w={280}
                    style={{ flex: '0 0 auto', boxShadow: '0 2px 12px rgba(0, 34, 80, 0.06)' }}
                  >
                    <Badge variant="light" color="blue" size="sm" mb={6}>
                      {r.status.replace(/_/g, ' ')}
                    </Badge>
                    <Text fw={700} fz={17} mt={6}>
                      {r.itemName}
                    </Text>
                    <Text fz={13} c={colors.mutedText} mt={4} lineClamp={2}>
                      {r.origin} → {r.destination}
                    </Text>
                    {traveler ? (
                      <Group gap="xs" mt="sm">
                        <Avatar
                          size={28}
                          radius="xl"
                          src={(traveler as Partial<User>).profilePhoto ?? undefined}
                        >
                          {name.charAt(0)}
                        </Avatar>
                        <Text fz={13}>{name}</Text>
                      </Group>
                    ) : null}
                    <Button
                      variant="light"
                      color="blue"
                      fullWidth
                      mt="md"
                      size="xs"
                      radius="md"
                      onClick={() =>
                        navigate(
                          `/app/requester/requests/detail?requestId=${encodeURIComponent(r._id ?? '')}`,
                          { state: { requestId: r._id } },
                        )
                      }
                    >
                      View details
                    </Button>
                  </Card>
                );
              })}
            </Group>
          </ScrollArea>
        )}
      </Box>

      <Box>
        <Title order={4} fz={16} fw={700} mb="md" c={colors.navyDeep}>
          Suggested travelers
        </Title>
        {lb ? (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
            <Skeleton height={120} />
            <Skeleton height={120} />
            <Skeleton height={120} />
          </SimpleGrid>
        ) : trips.length === 0 ? (
          <Text c={colors.mutedText}>No published trips match your area yet.</Text>
        ) : (
          <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
            {trips.map((t: Trip) => {
              const tr = t.travelerId;
              const name = displayName(tr as Partial<User>);
              const rating =
                tr && typeof tr === 'object' && 'rating' in tr && typeof tr.rating === 'number'
                  ? tr.rating.toFixed(1)
                  : '—';
              const initials = name
                .split(' ')
                .map((x) => x[0])
                .join('')
                .slice(0, 2)
                .toUpperCase();
              return (
                <Paper
                  key={t._id}
                  withBorder
                  radius="md"
                  p="md"
                  shadow="xs"
                  style={{ cursor: 'default' }}
                >
                  <Group align="flex-start" wrap="nowrap">
                    <Avatar
                      size={52}
                      radius="xl"
                      color="brandTeal"
                      src={
                        typeof tr === 'object' && tr && 'profilePhoto' in tr
                          ? (tr.profilePhoto as string | null) ?? undefined
                          : undefined
                      }
                    >
                      {initials}
                    </Avatar>
                    <div style={{ minWidth: 0 }}>
                      <Text fw={700} fz={16} truncate>
                        {name}
                      </Text>
                      <Group gap={4} mt={4}>
                        <IconStar size={16} fill={RQ.communityMint} color={RQ.communityMint} />
                        <Text fz={13} fw={600}>
                          {rating} · {t.origin} → {t.destination}
                        </Text>
                      </Group>
                    </div>
                  </Group>
                  <Button
                    component={Link}
                    to="/app/requester/browse/trips"
                    variant="outline"
                    color="blue"
                    size="xs"
                    mt="sm"
                    radius="md"
                    fullWidth
                  >
                    View trips
                  </Button>
                </Paper>
              );
            })}
          </SimpleGrid>
        )}
      </Box>

      <Paper withBorder radius="md" p="lg" shadow="xs">
        <Group align="flex-start">
          <Box
            style={{
              padding: 10,
              borderRadius: 10,
              background: `color-mix(in srgb, ${RQ.standardBlue} 12%, white)`,
            }}
          >
            <IconPackage size={22} color={RQ.standardBlue} />
          </Box>
          <div>
            <Text fw={700}>Browse published trips</Text>
            <Text fz={14} c={colors.mutedText} mt={4}>
              Prefer to match existing traveler routes instead of posting first?
            </Text>
            <Button
              component={Link}
              to="/app/requester/browse/trips"
              variant="light"
              mt="sm"
              radius="md"
              color="blue"
            >
              Open browse
            </Button>
          </div>
        </Group>
      </Paper>
    </Stack>
  );
}
