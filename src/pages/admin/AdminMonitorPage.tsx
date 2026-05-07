import {
  Badge,
  Group,
  Paper,
  Pagination,
  Select,
  Skeleton,
  Stack,
  Table,
  Tabs,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { useMemo, useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { adminService } from '../../api/services/admin.service';
import type { Booking, DeliveryRequest, PaginatedResponse, Trip } from '../../api/types';
import { formatDate, formatDateTime, populatedName } from './adminHelpers';

function tripRoute(t: Trip): string {
  return `${t.origin} → ${t.destination}`;
}

function bookingRoute(b: Booking): string {
  const trip = typeof b.tripId === 'object' && b.tripId && 'origin' in b.tripId ? b.tripId : null;
  if (trip) return `${trip.origin} → ${trip.destination}`;
  return '—';
}

function statusBadge(status: string) {
  return (
    <Badge variant="light" size="sm" color="gray">
      {status}
    </Badge>
  );
}

function urgencyColor(u: string) {
  if (u === 'critical') return 'red';
  if (u === 'high') return 'orange';
  if (u === 'medium') return 'yellow';
  return 'gray';
}

export function AdminMonitorPage() {
  const { page, limit, setPage } = usePagination(20);
  const [tab, setTab] = useState<'trips' | 'requests' | 'bookings'>('trips');

  const [tStatus, setTStatus] = useState<string | null>(null);
  const [tOrigin, setTOrigin] = useState('');
  const [tDest, setTDest] = useState('');
  const [tFrom, setTFrom] = useState('');
  const [tTo, setTTo] = useState('');

  const [rStatus, setRStatus] = useState<string | null>(null);
  const [rType, setRType] = useState<string | null>(null);
  const [rUrgency, setRUrgency] = useState<string | null>(null);

  const [bStatus, setBStatus] = useState<string | null>(null);
  const [bFrom, setBFrom] = useState('');
  const [bTo, setBTo] = useState('');

  const tripParams = useMemo(
    () => ({
      status: tStatus ?? undefined,
      origin: tOrigin.trim() || undefined,
      destination: tDest.trim() || undefined,
      dateFrom: tFrom || undefined,
      dateTo: tTo || undefined,
      page,
      limit,
    }),
    [tStatus, tOrigin, tDest, tFrom, tTo, page, limit],
  );

  const reqParams = useMemo(
    () => ({
      status: rStatus ?? undefined,
      type: rType ?? undefined,
      urgencyLevel: rUrgency ?? undefined,
      page,
      limit,
    }),
    [rStatus, rType, rUrgency, page, limit],
  );

  const bookParams = useMemo(
    () => ({
      status: bStatus ?? undefined,
      dateFrom: bFrom || undefined,
      dateTo: bTo || undefined,
      page,
      limit,
    }),
    [bStatus, bFrom, bTo, page, limit],
  );

  const { data, isLoading, error } = useApi<PaginatedResponse<Trip | DeliveryRequest | Booking>>(
    () => {
      if (tab === 'trips') return adminService.getTrips(tripParams) as Promise<PaginatedResponse<Trip | DeliveryRequest | Booking>>;
      if (tab === 'requests')
        return adminService.getRequests(reqParams) as Promise<PaginatedResponse<Trip | DeliveryRequest | Booking>>;
      return adminService.getBookings(bookParams) as Promise<PaginatedResponse<Trip | DeliveryRequest | Booking>>;
    },
    [tab, tripParams, reqParams, bookParams],
  );

  const onTabChange = (v: string | null) => {
    if (v === 'trips' || v === 'requests' || v === 'bookings') {
      setTab(v);
      setPage(1);
    }
  };

  const rows = data?.data ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / limit));

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Monitoring
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Trips, requests, and bookings across the platform.
        </Text>
      </div>

      {error ? (
        <Text c="red" fz={14}>
          {error}
        </Text>
      ) : null}

      <Tabs value={tab} onChange={onTabChange}>
        <Tabs.List>
          <Tabs.Tab value="trips">Trips</Tabs.Tab>
          <Tabs.Tab value="requests">Requests</Tabs.Tab>
          <Tabs.Tab value="bookings">Bookings</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="trips" pt="md">
          <Paper p="md" radius="md" withBorder mb="md">
            <Group wrap="wrap" gap="sm">
              <Select
                placeholder="Status"
                clearable
                data={[
                  { value: 'active', label: 'Active' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={tStatus}
                onChange={(v) => {
                  setTStatus(v);
                  setPage(1);
                }}
                w={160}
              />
              <TextInput label="Origin" value={tOrigin} onChange={(e) => setTOrigin(e.currentTarget.value)} w={160} />
              <TextInput label="Destination" value={tDest} onChange={(e) => setTDest(e.currentTarget.value)} w={160} />
              <TextInput type="date" label="From" value={tFrom} onChange={(e) => setTFrom(e.currentTarget.value)} w={160} />
              <TextInput type="date" label="To" value={tTo} onChange={(e) => setTTo(e.currentTarget.value)} w={160} />
            </Group>
          </Paper>
          {tab === 'trips' && isLoading ? (
            <Stack gap="sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={36} />
              ))}
            </Stack>
          ) : tab === 'trips' && rows.length === 0 ? (
            <Text c="dimmed">No trips found.</Text>
          ) : tab === 'trips' ? (
            <Paper radius="md" withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Traveler</Table.Th>
                    <Table.Th>Route</Table.Th>
                    <Table.Th>Departure</Table.Th>
                    <Table.Th>Space</Table.Th>
                    <Table.Th>Matched</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Created</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(rows as Trip[]).map((t) => (
                    <Table.Tr key={t._id}>
                      <Table.Td>{populatedName(t.travelerId)}</Table.Td>
                      <Table.Td fz={13}>{tripRoute(t)}</Table.Td>
                      <Table.Td fz={13}>{formatDate(t.departureDate)}</Table.Td>
                      <Table.Td>{t.luggageSpace}</Table.Td>
                      <Table.Td>{t.matchedRequestsCount ?? 0}</Table.Td>
                      <Table.Td>{statusBadge(t.status)}</Table.Td>
                      <Table.Td fz={13} c="dimmed">
                        {formatDateTime(t.createdAt)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          ) : null}
        </Tabs.Panel>

        <Tabs.Panel value="requests" pt="md">
          <Paper p="md" radius="md" withBorder mb="md">
            <Group wrap="wrap" gap="sm">
              <Select
                placeholder="Status"
                clearable
                data={[
                  { value: 'pending', label: 'Pending' },
                  { value: 'matched', label: 'Matched' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={rStatus}
                onChange={(v) => {
                  setRStatus(v);
                  setPage(1);
                }}
                w={160}
              />
              <Select
                placeholder="Type"
                clearable
                data={[
                  { value: 'standard', label: 'Standard' },
                  { value: 'support', label: 'Support' },
                ]}
                value={rType}
                onChange={(v) => {
                  setRType(v);
                  setPage(1);
                }}
                w={140}
              />
              <Select
                placeholder="Urgency"
                clearable
                data={[
                  { value: 'critical', label: 'Critical' },
                  { value: 'high', label: 'High' },
                  { value: 'medium', label: 'Medium' },
                  { value: 'low', label: 'Low' },
                ]}
                value={rUrgency}
                onChange={(v) => {
                  setRUrgency(v);
                  setPage(1);
                }}
                w={140}
              />
            </Group>
          </Paper>
          {tab === 'requests' && isLoading ? (
            <Stack gap="sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={36} />
              ))}
            </Stack>
          ) : tab === 'requests' && rows.length === 0 ? (
            <Text c="dimmed">No requests found.</Text>
          ) : tab === 'requests' ? (
            <Paper radius="md" withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Requester</Table.Th>
                    <Table.Th>Item</Table.Th>
                    <Table.Th>Route</Table.Th>
                    <Table.Th>Type</Table.Th>
                    <Table.Th>Urgency</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Deadline</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(rows as DeliveryRequest[]).map((r) => (
                    <Table.Tr key={r._id}>
                      <Table.Td>{populatedName(r.requesterId)}</Table.Td>
                      <Table.Td fz={13}>{r.itemName}</Table.Td>
                      <Table.Td fz={13}>
                        {r.origin} → {r.destination}
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" variant="light">
                          {r.type}
                        </Badge>
                      </Table.Td>
                      <Table.Td>
                        <Badge size="sm" color={urgencyColor(r.urgencyLevel)} variant="light">
                          {r.urgencyLevel}
                        </Badge>
                      </Table.Td>
                      <Table.Td>{statusBadge(r.status)}</Table.Td>
                      <Table.Td fz={13} c="dimmed">
                        {formatDateTime(r.deliveryDeadline)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          ) : null}
        </Tabs.Panel>

        <Tabs.Panel value="bookings" pt="md">
          <Paper p="md" radius="md" withBorder mb="md">
            <Group wrap="wrap" gap="sm">
              <Select
                placeholder="Status"
                clearable
                data={[
                  { value: 'pending_acceptance', label: 'Pending acceptance' },
                  { value: 'confirmed', label: 'Confirmed' },
                  { value: 'paid', label: 'Paid' },
                  { value: 'in_transit', label: 'In transit' },
                  { value: 'completed', label: 'Completed' },
                  { value: 'disputed', label: 'Disputed' },
                  { value: 'cancelled', label: 'Cancelled' },
                ]}
                value={bStatus}
                onChange={(v) => {
                  setBStatus(v);
                  setPage(1);
                }}
                w={200}
              />
              <TextInput type="date" label="From" value={bFrom} onChange={(e) => setBFrom(e.currentTarget.value)} w={160} />
              <TextInput type="date" label="To" value={bTo} onChange={(e) => setBTo(e.currentTarget.value)} w={160} />
            </Group>
          </Paper>
          {tab === 'bookings' && isLoading ? (
            <Stack gap="sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={36} />
              ))}
            </Stack>
          ) : tab === 'bookings' && rows.length === 0 ? (
            <Text c="dimmed">No bookings found.</Text>
          ) : tab === 'bookings' ? (
            <Paper radius="md" withBorder>
              <Table striped highlightOnHover>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Ref</Table.Th>
                    <Table.Th>Requester</Table.Th>
                    <Table.Th>Traveler</Table.Th>
                    <Table.Th>Route</Table.Th>
                    <Table.Th>Fee</Table.Th>
                    <Table.Th>Status</Table.Th>
                    <Table.Th>Created</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {(rows as Booking[]).map((b) => (
                    <Table.Tr key={b._id}>
                      <Table.Td fw={700}>{b.bookingRef}</Table.Td>
                      <Table.Td>{populatedName(b.requesterId)}</Table.Td>
                      <Table.Td>{populatedName(b.travelerId)}</Table.Td>
                      <Table.Td fz={13}>{bookingRoute(b)}</Table.Td>
                      <Table.Td>{b.agreedFee ?? b.offeredFee}</Table.Td>
                      <Table.Td>{statusBadge(b.status)}</Table.Td>
                      <Table.Td fz={13} c="dimmed">
                        {formatDateTime(b.createdAt)}
                      </Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            </Paper>
          ) : null}
        </Tabs.Panel>
      </Tabs>

      {!isLoading && rows.length > 0 ? (
        <Group justify="center">
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </Group>
      ) : null}
    </Stack>
  );
}
