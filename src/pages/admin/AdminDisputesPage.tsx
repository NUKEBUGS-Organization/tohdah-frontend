import {
  Badge,
  Button,
  Group,
  Modal,
  NumberInput,
  Pagination,
  Paper,
  Radio,
  Skeleton,
  Stack,
  Table,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { adminService, type ResolveDisputeData } from '../../api/services/admin.service';
import type { Booking, DeliveryRequest } from '../../api/types';
import { notify } from '../../utils/notify';
import { formatDateTime, populatedName } from './adminHelpers';

function disputeTypeLabel(b: Booking): string {
  const req = typeof b.requestId === 'object' && b.requestId && 'type' in b.requestId ? (b.requestId as DeliveryRequest) : null;
  return req?.type === 'support' ? 'Support' : 'Standard';
}

function priorityFromAge(raisedAt: string | null | undefined): { label: string; color: string } {
  if (!raisedAt) return { label: 'Pending', color: 'yellow' };
  const days = (Date.now() - new Date(raisedAt).getTime()) / 86400000;
  if (days < 1) return { label: 'Urgent', color: 'red' };
  if (days <= 3) return { label: 'Pending', color: 'yellow' };
  return { label: 'Overdue', color: 'gray' };
}

export function AdminDisputesPage() {
  const { page, limit, setPage } = usePagination(20);
  const { data, isLoading, error, refetch } = useApi(
    () => adminService.getDisputes({ page, limit }),
    [page, limit],
  );

  const [resolveOpen, setResolveOpen] = useState(false);
  const [activeBooking, setActiveBooking] = useState<Booking | null>(null);
  const [resolution, setResolution] = useState<ResolveDisputeData['resolution']>('no_action');
  const [refundAmount, setRefundAmount] = useState<number | ''>('');
  const [notes, setNotes] = useState('');

  const openResolve = (b: Booking) => {
    setActiveBooking(b);
    setResolution('no_action');
    setRefundAmount('');
    setNotes('');
    setResolveOpen(true);
  };

  const submitResolve = async () => {
    if (!activeBooking || !notes.trim()) {
      notify.error('Notes are required');
      return;
    }
    if (resolution === 'partial_refund' && (refundAmount === '' || refundAmount == null)) {
      notify.error('Refund amount required for partial refund');
      return;
    }
    try {
      const payload: ResolveDisputeData = {
        resolution,
        notes: notes.trim(),
        ...(resolution === 'partial_refund' ? { refundAmount: Number(refundAmount) } : {}),
        ...(resolution === 'refund_requester' && refundAmount !== '' && refundAmount != null
          ? { refundAmount: Number(refundAmount) }
          : {}),
      };
      await adminService.resolveDispute(activeBooking._id, payload);
      notify.success('Dispute resolved');
      setResolveOpen(false);
      setActiveBooking(null);
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const rows = data?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Dispute management
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Open disputes are sorted oldest first. Resolve with an auditable resolution.
        </Text>
      </div>

      {error ? (
        <Text c="red" fz={14}>
          {error}
        </Text>
      ) : null}

      <Paper radius="md" withBorder shadow="xs" bg="#fff" p={0}>
        {isLoading ? (
          <Stack p="lg" gap="sm">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} height={40} />
            ))}
          </Stack>
        ) : rows.length === 0 ? (
          <Text p="xl" c="dimmed" ta="center">
            No disputes in the queue.
          </Text>
        ) : (
          <Table striped highlightOnHover verticalSpacing="sm">
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Ref</Table.Th>
                <Table.Th>Requester</Table.Th>
                <Table.Th>Traveler</Table.Th>
                <Table.Th>Type</Table.Th>
                <Table.Th>Reason</Table.Th>
                <Table.Th>Raised</Table.Th>
                <Table.Th>Priority</Table.Th>
                <Table.Th />
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {rows.map((b: Booking) => {
                const pr = priorityFromAge(b.disputeRaisedAt);
                const reason = (b.disputeReason ?? '').slice(0, 60) + ((b.disputeReason?.length ?? 0) > 60 ? '…' : '');
                return (
                  <Table.Tr key={b._id}>
                    <Table.Td fw={700}>{b.bookingRef}</Table.Td>
                    <Table.Td fz={13}>{populatedName(b.requesterId)}</Table.Td>
                    <Table.Td fz={13}>{populatedName(b.travelerId)}</Table.Td>
                    <Table.Td fz={13}>{disputeTypeLabel(b)}</Table.Td>
                    <Table.Td fz={13} maw={280}>
                      {reason || '—'}
                    </Table.Td>
                    <Table.Td fz={13} c="dimmed">
                      {formatDateTime(b.disputeRaisedAt)}
                    </Table.Td>
                    <Table.Td>
                      <Badge color={pr.color} variant="light" size="sm">
                        {pr.label}
                      </Badge>
                    </Table.Td>
                    <Table.Td>
                      <Button size="xs" variant="light" onClick={() => openResolve(b)}>
                        Resolve
                      </Button>
                    </Table.Td>
                  </Table.Tr>
                );
              })}
            </Table.Tbody>
          </Table>
        )}
        {!isLoading && rows.length > 0 ? (
          <Group justify="center" py="md">
            <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
          </Group>
        ) : null}
      </Paper>

      <Modal opened={resolveOpen} onClose={() => setResolveOpen(false)} title="Resolve dispute" size="md">
        <Stack gap="md">
          <Text fz={13} c="dimmed">
            Booking {activeBooking?.bookingRef}
          </Text>
          <Radio.Group
            label="Resolution"
            value={resolution}
            onChange={(v) => setResolution(v as ResolveDisputeData['resolution'])}
          >
            <Stack gap="xs" mt={4}>
              <Radio value="refund_requester" label="Refund requester" />
              <Radio value="release_traveler" label="Release to traveler" />
              <Radio value="partial_refund" label="Partial refund" />
              <Radio value="no_action" label="No action" />
            </Stack>
          </Radio.Group>
          {resolution === 'partial_refund' ? (
            <NumberInput label="Refund amount" value={refundAmount === '' ? undefined : refundAmount} onChange={(v) => setRefundAmount(typeof v === 'number' ? v : '')} min={0} />
          ) : null}
          {resolution === 'refund_requester' ? (
            <NumberInput
              label="Optional explicit refund amount (defaults to agreed/counter/offered fee)"
              value={refundAmount === '' ? undefined : refundAmount}
              onChange={(v) => setRefundAmount(typeof v === 'number' ? v : '')}
              min={0}
            />
          ) : null}
          <Textarea label="Notes" required placeholder="Required audit notes" value={notes} onChange={(e) => setNotes(e.currentTarget.value)} minRows={3} />
          <Button onClick={() => void submitResolve()}>Submit resolution</Button>
        </Stack>
      </Modal>
    </Stack>
  );
}
