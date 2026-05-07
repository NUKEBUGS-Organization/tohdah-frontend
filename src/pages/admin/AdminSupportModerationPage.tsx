import {
  Avatar,
  Badge,
  Button,
  Drawer,
  Group,
  Pagination,
  Paper,
  Skeleton,
  Stack,
  Tabs,
  Text,
  Textarea,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useState } from 'react';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { adminService } from '../../api/services/admin.service';
import type { DeliveryRequest, User } from '../../api/types';
import { notify } from '../../utils/notify';
import { formatDateTime, populatedName } from './adminHelpers';

function urgencyColor(u: string) {
  if (u === 'critical') return 'red';
  if (u === 'high') return 'orange';
  if (u === 'medium') return 'yellow';
  return 'gray';
}

function requestId(r: DeliveryRequest & { _id?: { toString?: () => string } }): string {
  const id = r._id as unknown;
  if (typeof id === 'string') return id;
  if (id && typeof (id as { toString?: () => string }).toString === 'function') return (id as { toString: () => string }).toString();
  return String(id);
}

export function AdminSupportModerationPage() {
  const [tab, setTab] = useState<'pending_review' | 'approved' | 'rejected'>('pending_review');
  const { page, limit, setPage } = usePagination(20);
  const [drawerOpen, drawer] = useDisclosure(false);
  const [selected, setSelected] = useState<(DeliveryRequest & Record<string, unknown>) | null>(null);
  const [approveNotes, setApproveNotes] = useState('');
  const [rejectNotes, setRejectNotes] = useState('');

  const { data, isLoading, error, refetch } = useApi(
    () =>
      adminService.getSupportRequests({
        adminApprovalStatus: tab,
        page,
        limit,
      }),
    [tab, page, limit],
  );

  const rows = (data?.data ?? []) as (DeliveryRequest & Record<string, unknown>)[];
  const totalPages = Math.max(1, Math.ceil((data?.total ?? 0) / limit));

  const openReview = (r: DeliveryRequest & Record<string, unknown>) => {
    setSelected(r);
    setApproveNotes('');
    setRejectNotes('');
    drawer.open();
  };

  const approve = async () => {
    if (!selected) return;
    try {
      await adminService.approveSupport(requestId(selected), approveNotes.trim() || undefined);
      notify.success('Request approved');
      drawer.close();
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const reject = async () => {
    if (!selected) return;
    if (!rejectNotes.trim()) {
      notify.error('Notes are required to reject');
      return;
    }
    try {
      await adminService.rejectSupport(requestId(selected), rejectNotes.trim());
      notify.success('Request rejected');
      drawer.close();
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const requester = selected?.requesterId as Partial<User> | string | undefined;

  return (
    <Stack gap="lg">
      <Title order={2} fz={24} fw={800}>
        Support request moderation
      </Title>
      <Text fz={14} c="dimmed">
        Community support deliveries require admin approval before travelers can match.
      </Text>

      {error ? (
        <Text c="red" fz={14}>
          {error}
        </Text>
      ) : null}

      <Tabs
        value={tab}
        onChange={(v) => {
          if (v === 'pending_review' || v === 'approved' || v === 'rejected') {
            setTab(v);
            setPage(1);
          }
        }}
      >
        <Tabs.List>
          <Tabs.Tab value="pending_review">Pending review</Tabs.Tab>
          <Tabs.Tab value="approved">Approved</Tabs.Tab>
          <Tabs.Tab value="rejected">Rejected</Tabs.Tab>
        </Tabs.List>
      </Tabs>

      {isLoading ? (
        <Stack gap="sm">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} height={72} />
          ))}
        </Stack>
      ) : rows.length === 0 ? (
        <Text c="dimmed">No requests in this queue.</Text>
      ) : (
        <Stack gap="sm">
          {rows.map((r) => {
            const rq = r.requesterId as Partial<User> | string | undefined;
            return (
              <Paper key={requestId(r)} p="md" radius="md" withBorder>
                <Group justify="space-between" align="flex-start" wrap="wrap">
                  <Group gap="md">
                    <Avatar src={typeof rq === 'object' && rq?.profilePhoto ? rq.profilePhoto : undefined} radius="xl">
                      {populatedName(rq).charAt(0)}
                    </Avatar>
                    <div>
                      <Text fw={700}>{populatedName(rq)}</Text>
                      <Group gap="xs" mt={4}>
                        {r.beneficiaryType ? (
                          <Badge size="sm" variant="light">
                            {String(r.beneficiaryType)}
                          </Badge>
                        ) : null}
                        <Badge size="sm" color={urgencyColor(r.urgencyLevel)} variant="light">
                          {r.urgencyLevel}
                        </Badge>
                      </Group>
                      <Text fz={13} c="dimmed" lineClamp={2} maw={560} mt={6}>
                        {(r.itemDescription as string)?.slice(0, 140)}
                        {(r.itemDescription as string)?.length > 140 ? '…' : ''}
                      </Text>
                      <Text fz={12} c="dimmed" mt={4}>
                        {formatDateTime(r.createdAt)}
                      </Text>
                    </div>
                  </Group>
                  <Button size="sm" variant="light" onClick={() => openReview(r)}>
                    {tab === 'pending_review' ? 'Review' : 'View'}
                  </Button>
                </Group>
              </Paper>
            );
          })}
        </Stack>
      )}

      {!isLoading && rows.length > 0 ? (
        <Group justify="center">
          <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
        </Group>
      ) : null}

      <Drawer opened={drawerOpen} onClose={drawer.close} title="Support request" size="lg" position="right">
        {selected ? (
          <Stack gap="md">
            <Paper p="md" withBorder radius="md">
              <Text fw={700} mb="sm">
                Requester
              </Text>
              <Group>
                <Avatar
                  src={typeof requester === 'object' && requester?.profilePhoto ? requester.profilePhoto : undefined}
                  radius="xl"
                  size={56}
                >
                  {populatedName(requester).charAt(0)}
                </Avatar>
                <div>
                  <Text fw={700}>{populatedName(requester)}</Text>
                  {typeof requester === 'object' && requester?.email ? (
                    <Text fz={13} c="dimmed">
                      {requester.email}
                    </Text>
                  ) : null}
                  <Group gap="xs" mt={4}>
                    <Text fz={12}>Rating {typeof requester === 'object' ? (requester.rating ?? '—') : '—'}</Text>
                    <Text fz={12}>Email {typeof requester === 'object' && requester?.isEmailVerified ? '✓' : '—'}</Text>
                    <Text fz={12}>Phone {typeof requester === 'object' && requester?.isPhoneVerified ? '✓' : '—'}</Text>
                  </Group>
                </div>
              </Group>
            </Paper>

            <Stack gap={6}>
              <Text fw={700}>Request details</Text>
              <Text fz={13}>
                <b>Item:</b> {selected.itemName}
              </Text>
              <Text fz={13}>
                <b>Description:</b> {selected.itemDescription}
              </Text>
              <Text fz={13}>
                <b>Route:</b> {selected.origin} → {selected.destination}
              </Text>
              <Text fz={13}>
                <b>Deadline:</b> {formatDateTime(selected.deliveryDeadline)}
              </Text>
              <Text fz={13}>
                <b>Type / payment:</b> {selected.type} · {selected.paymentType ?? '—'}
              </Text>
              <Text fz={13}>
                <b>Beneficiary:</b> {selected.beneficiaryName ?? '—'} ({selected.beneficiaryType ?? '—'})
              </Text>
              <Text fz={13}>
                <b>Supporting notes:</b> {selected.supportingNotes ?? '—'}
              </Text>
              <Text fz={13}>
                <b>Status:</b> {selected.status} · <b>Admin:</b> {selected.adminApprovalStatus ?? '—'}
              </Text>
            </Stack>

            {tab === 'pending_review' ? (
              <>
                <Textarea label="Approval notes (optional)" value={approveNotes} onChange={(e) => setApproveNotes(e.currentTarget.value)} />
                <Textarea label="Rejection notes (required to reject)" value={rejectNotes} onChange={(e) => setRejectNotes(e.currentTarget.value)} />
                <Group grow>
                  <Button color="teal" onClick={() => void approve()}>
                    Approve
                  </Button>
                  <Button color="red" variant="outline" onClick={() => void reject()}>
                    Reject
                  </Button>
                </Group>
              </>
            ) : null}
          </Stack>
        ) : null}
      </Drawer>
    </Stack>
  );
}
