import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Drawer,
  Group,
  Menu,
  Modal,
  Pagination,
  Paper,
  Select,
  SimpleGrid,
  Skeleton,
  Stack,
  Table,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core';
import { useDebouncedValue, useDisclosure } from '@mantine/hooks';
import { IconDotsVertical, IconMail, IconMapPin, IconShieldCheck } from '@tabler/icons-react';
import { useState } from 'react';
import { adminUi as AU } from '../../theme';
import { useApi } from '../../hooks/useApi';
import { usePagination } from '../../hooks/usePagination';
import { useAuth } from '../../context/AuthContext';
import {
  adminService,
  type AdminListedUser,
  type AdminUserDetailResponse,
} from '../../api/services/admin.service';
import { notify } from '../../utils/notify';
import { formatDate, formatDateTime } from './adminHelpers';

function accountStatusBadge(status: string) {
  const s = (status ?? 'active').toLowerCase();
  if (s === 'active')
    return (
      <Badge color="green" variant="light" size="sm">
        Active
      </Badge>
    );
  if (s === 'suspended')
    return (
      <Badge color="yellow" variant="light" size="sm">
        Suspended
      </Badge>
    );
  if (s === 'banned')
    return (
      <Badge color="red" variant="light" size="sm">
        Banned
      </Badge>
    );
  return (
    <Badge color="gray" variant="light" size="sm">
      {status}
    </Badge>
  );
}

function roleBadge(role: string) {
  const r = role ?? 'user';
  if (r === 'superadmin')
    return (
      <Badge color="violet" variant="light" size="sm">
        Superadmin
      </Badge>
    );
  if (r === 'admin')
    return (
      <Badge color="blue" variant="light" size="sm">
        Admin
      </Badge>
    );
  return (
    <Badge color="gray" variant="light" size="sm">
      User
    </Badge>
  );
}

export function AdminUsersPage() {
  const { user: authUser } = useAuth();
  const { page, limit, setPage } = usePagination(20);
  const [search, setSearch] = useState('');
  const [debounced] = useDebouncedValue(search, 400);
  const [role, setRole] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isVerified, setIsVerified] = useState<string | null>(null);

  const listParams = {
    search: debounced.trim() || undefined,
    role: role ?? undefined,
    accountType: accountType ?? undefined,
    status: status ?? undefined,
    isVerified: isVerified === 'true' ? true : isVerified === 'false' ? false : undefined,
    page,
    limit,
  };

  const { data: listRes, isLoading, error, refetch } = useApi(
    () => adminService.getUsers(listParams),
    [debounced, role, accountType, status, isVerified, page, limit],
  );

  const [drawerOpened, drawerHandlers] = useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const { data: detail, isLoading: detailLoading } = useApi(
    () =>
      selectedId
        ? adminService.getUserDetail(selectedId)
        : Promise.resolve(null as unknown as AdminUserDetailResponse),
    [selectedId],
  );

  const [suspendOpen, suspendHandlers] = useDisclosure(false);
  const [banOpen, banHandlers] = useDisclosure(false);
  const [actionReason, setActionReason] = useState('');
  const [actionTarget, setActionTarget] = useState<AdminListedUser | null>(null);

  const openSuspend = (u: AdminListedUser) => {
    setActionTarget(u);
    setActionReason('');
    suspendHandlers.open();
  };

  const openBan = (u: AdminListedUser) => {
    setActionTarget(u);
    setActionReason('');
    banHandlers.open();
  };

  const doSuspend = async () => {
    if (!actionTarget || !actionReason.trim()) {
      notify.error('Reason is required');
      return;
    }
    try {
      await adminService.suspendUser(actionTarget.id, actionReason.trim());
      notify.success('User suspended');
      suspendHandlers.close();
      void refetch();
      drawerHandlers.close();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const doBan = async () => {
    if (!actionTarget || !actionReason.trim()) {
      notify.error('Reason is required');
      return;
    }
    try {
      await adminService.banUser(actionTarget.id, actionReason.trim());
      notify.success('User banned');
      banHandlers.close();
      void refetch();
      drawerHandlers.close();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const doReinstate = async (u: AdminListedUser) => {
    try {
      await adminService.reinstateUser(u.id);
      notify.success('User reinstated');
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  const rows = listRes?.data ?? [];
  const totalPages = Math.max(1, Math.ceil((listRes?.total ?? 0) / limit));

  const du = detail?.user;
  const isSuper = authUser?.role === 'superadmin';

  const changeRole = async (newRole: 'user' | 'admin') => {
    if (!selectedId) return;
    try {
      await adminService.updateUserRole(selectedId, newRole);
      notify.success('Role updated');
      drawerHandlers.close();
      void refetch();
    } catch (e) {
      notify.error(e instanceof Error ? e.message : 'Failed');
    }
  };

  return (
    <>
      <Stack gap="lg">
        <div>
          <Title order={2} fz={24} fw={800}>
            System users
          </Title>
          <Text fz={14} c="dimmed" mt={4}>
            Search, filter, suspend, ban, or reinstate accounts. Open a row for full detail.
          </Text>
        </div>

        {error ? (
          <Text c="red" fz={14}>
            {error}
          </Text>
        ) : null}

        <Paper radius="md" withBorder shadow="xs" bg="#fff" p="md">
          <Group align="flex-end" wrap="wrap" gap="sm">
            <TextInput
              label="Search"
              placeholder="Name or email"
              value={search}
              onChange={(e) => {
                setSearch(e.currentTarget.value);
                setPage(1);
              }}
              style={{ flex: '1 1 200px' }}
            />
            <Select
              label="Role"
              clearable
              placeholder="Any"
              data={[
                { value: 'user', label: 'User' },
                { value: 'admin', label: 'Admin' },
              ]}
              value={role}
              onChange={(v) => {
                setRole(v);
                setPage(1);
              }}
              w={140}
            />
            <Select
              label="Account type"
              clearable
              placeholder="Any"
              data={[
                { value: 'traveler', label: 'Traveler' },
                { value: 'requester', label: 'Requester' },
                { value: 'both', label: 'Both' },
              ]}
              value={accountType}
              onChange={(v) => {
                setAccountType(v);
                setPage(1);
              }}
              w={140}
            />
            <Select
              label="Status"
              clearable
              placeholder="Any"
              data={[
                { value: 'active', label: 'Active' },
                { value: 'suspended', label: 'Suspended' },
                { value: 'banned', label: 'Banned' },
              ]}
              value={status}
              onChange={(v) => {
                setStatus(v);
                setPage(1);
              }}
              w={140}
            />
            <Select
              label="Email verified"
              clearable
              placeholder="Any"
              data={[
                { value: 'true', label: 'Verified' },
                { value: 'false', label: 'Not verified' },
              ]}
              value={isVerified}
              onChange={(v) => {
                setIsVerified(v);
                setPage(1);
              }}
              w={160}
            />
          </Group>
        </Paper>

        <Paper radius="md" withBorder shadow="xs" bg="#fff">
          {isLoading ? (
            <Stack p="lg" gap="sm">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} height={40} />
              ))}
            </Stack>
          ) : rows.length === 0 ? (
            <Text p="xl" c="dimmed" ta="center">
              No users match these filters.
            </Text>
          ) : (
            <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
              <Table.Thead>
                <Table.Tr style={{ borderBottom: '1px solid #e8ecf1' }}>
                  <Table.Th>User</Table.Th>
                  <Table.Th>Email</Table.Th>
                  <Table.Th>Role</Table.Th>
                  <Table.Th>Type</Table.Th>
                  <Table.Th>Verification</Table.Th>
                  <Table.Th>Status</Table.Th>
                  <Table.Th>Joined</Table.Th>
                  <Table.Th w={48} />
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {rows.map((u) => (
                  <Table.Tr
                    key={u.id}
                    style={{
                      cursor: 'pointer',
                      ...(drawerOpened && selectedId === u.id ? { backgroundColor: `${AU.accentTeal}14` } : {}),
                    }}
                    onClick={() => {
                      setSelectedId(u.id);
                      drawerHandlers.open();
                    }}
                  >
                    <Table.Td>
                      <Group gap="sm" wrap="nowrap">
                        <Avatar radius="xl" size={36}>
                          {u.fullName?.charAt(0)}
                        </Avatar>
                        <Text fw={700} fz={14}>
                          {u.fullName}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>
                      <Text fz={14} c="dimmed">
                        {u.email}
                      </Text>
                    </Table.Td>
                    <Table.Td>{roleBadge(u.role)}</Table.Td>
                    <Table.Td>
                      <Text fz={14}>{u.accountType ?? '—'}</Text>
                    </Table.Td>
                    <Table.Td>
                      <Group gap={4}>
                        <IconMail size={16} color={u.isEmailVerified ? AU.accentTeal : '#cbd5e1'} />
                        <IconShieldCheck size={16} color={u.isPhoneVerified ? AU.accentTeal : '#cbd5e1'} />
                        <Text fz={11} c="dimmed">
                          ID
                        </Text>
                        <Text fz={11} c={u.isIdVerified ? AU.accentTeal : 'dimmed'}>
                          {u.isIdVerified ? '✓' : '—'}
                        </Text>
                      </Group>
                    </Table.Td>
                    <Table.Td>{accountStatusBadge(u.accountStatus)}</Table.Td>
                    <Table.Td fz={13} c="dimmed">
                      {formatDate(u.createdAt)}
                    </Table.Td>
                    <Table.Td onClick={(e) => e.stopPropagation()}>
                      <Menu shadow="md" width={200}>
                        <Menu.Target>
                          <ActionIcon variant="subtle" color="gray">
                            <IconDotsVertical size={18} stroke={1.5} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            onClick={() => {
                              setSelectedId(u.id);
                              drawerHandlers.open();
                            }}
                          >
                            View
                          </Menu.Item>
                          <Menu.Item onClick={() => openSuspend(u)}>Suspend</Menu.Item>
                          <Menu.Item color="red" onClick={() => openBan(u)}>
                            Ban
                          </Menu.Item>
                          {(u.accountStatus === 'suspended' || u.accountStatus === 'banned') && (
                            <Menu.Item onClick={() => void doReinstate(u)}>Reinstate</Menu.Item>
                          )}
                        </Menu.Dropdown>
                      </Menu>
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          )}
          {!isLoading && rows.length > 0 ? (
            <Group justify="center" py="md">
              <Pagination total={totalPages} value={page} onChange={setPage} size="sm" />
            </Group>
          ) : null}
        </Paper>
      </Stack>

      <Drawer
        opened={drawerOpened}
        onClose={() => {
          drawerHandlers.close();
          setSelectedId(null);
        }}
        position="right"
        size="lg"
        offset={16}
        radius="lg"
        title={<Text fw={800}>User detail</Text>}
      >
        {!selectedId ? null : detailLoading || !du ? (
          <Stack gap="sm">
            <Skeleton height={80} />
            <Skeleton height={120} />
          </Stack>
        ) : (
          <Stack gap="lg">
            <Group align="flex-start">
              <Avatar radius="xl" size={80} src={(du.profilePhoto as string) ?? undefined}>
                {du.fullName?.charAt(0)}
              </Avatar>
              <Stack gap={2}>
                <Title order={3} fz={22}>
                  {du.fullName}
                </Title>
                <Text fz={13} c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconMail size={14} stroke={1.5} /> {du.email}
                </Text>
                <Text fz={13} c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconMapPin size={14} stroke={1.5} /> {du.location ?? '—'}
                </Text>
                <Group mt="xs">
                  {roleBadge(String(du.role ?? 'user'))}
                  {accountStatusBadge(String(du.accountStatus ?? 'active'))}
                </Group>
                <Text fz={13}>
                  Rating {Number(du.rating ?? 0).toFixed(1)} · {du.reviewCount ?? 0} reviews
                </Text>
                <Group gap="xs">
                  <Text fz={12}>Email {du.isEmailVerified ? '✓' : '✗'}</Text>
                  <Text fz={12}>Phone {du.isPhoneVerified ? '✓' : '✗'}</Text>
                  <Text fz={12}>ID {du.isIdVerified ? '✓' : '✗'}</Text>
                </Group>
              </Stack>
            </Group>

            <Paper radius="md" bg={AU.pageBg} p="md">
              <Text fw={700} mb="xs">
                Stats
              </Text>
              {detail.stats && Object.keys(detail.stats).length > 0 ? (
                <SimpleGrid cols={2}>
                  {Object.entries(detail.stats).map(([k, v]) => (
                    <Stack key={k} gap={0} align="center">
                      <Text fz={20} fw={800}>
                        {typeof v === 'number' ? v : String(v)}
                      </Text>
                      <Text fz={11} c="dimmed" ta="center" tt="capitalize">
                        {k.replace(/([A-Z])/g, ' $1')}
                      </Text>
                    </Stack>
                  ))}
                </SimpleGrid>
              ) : (
                <Text fz={13} c="dimmed">
                  No stats returned
                </Text>
              )}
            </Paper>

            <div>
              <Text fw={700} mb="xs">
                Recent bookings
              </Text>
              <Stack gap={4}>
                {(detail.recentActivity?.bookings ?? []).map((b) => (
                  <Text key={b.id} fz={13}>
                    {b.status} · {formatDateTime(b.createdAt)}
                  </Text>
                ))}
                {(detail.recentActivity?.bookings ?? []).length === 0 ? (
                  <Text fz={13} c="dimmed">
                    None
                  </Text>
                ) : null}
              </Stack>
            </div>
            <div>
              <Text fw={700} mb="xs">
                Recent trips
              </Text>
              <Stack gap={4}>
                {(detail.recentActivity?.trips ?? []).map((t) => (
                  <Text key={t.id} fz={13}>
                    {t.status} · {formatDateTime(t.createdAt)}
                  </Text>
                ))}
                {(detail.recentActivity?.trips ?? []).length === 0 ? (
                  <Text fz={13} c="dimmed">
                    None
                  </Text>
                ) : null}
              </Stack>
            </div>
            <div>
              <Text fw={700} mb="xs">
                Recent requests
              </Text>
              <Stack gap={4}>
                {(detail.recentActivity?.requests ?? []).map((r) => (
                  <Text key={r.id} fz={13}>
                    {r.status} · {formatDateTime(r.createdAt)}
                  </Text>
                ))}
                {(detail.recentActivity?.requests ?? []).length === 0 ? (
                  <Text fz={13} c="dimmed">
                    None
                  </Text>
                ) : null}
              </Stack>
            </div>

            {isSuper && du.role !== 'superadmin' ? (
              <Select
                label="Change role (superadmin)"
                data={[
                  { value: 'user', label: 'User' },
                  { value: 'admin', label: 'Admin' },
                ]}
                value={du.role === 'admin' ? 'admin' : 'user'}
                onChange={(v) => {
                  if (v === 'user' || v === 'admin') void changeRole(v);
                }}
              />
            ) : null}

            <Group grow>
              <Button variant="outline" color="yellow" onClick={() => openSuspend({ ...du, id: selectedId! } as AdminListedUser)}>
                Suspend
              </Button>
              <Button variant="outline" color="red" onClick={() => openBan({ ...du, id: selectedId! } as AdminListedUser)}>
                Ban
              </Button>
              {(du.accountStatus === 'suspended' || du.accountStatus === 'banned') && (
                <Button variant="light" onClick={() => void doReinstate({ ...du, id: selectedId! } as AdminListedUser)}>
                  Reinstate
                </Button>
              )}
            </Group>
          </Stack>
        )}
      </Drawer>

      <Modal opened={suspendOpen} onClose={suspendHandlers.close} title="Suspend user">
        <Stack gap="sm">
          <Textarea label="Reason" required value={actionReason} onChange={(e) => setActionReason(e.currentTarget.value)} />
          <Button onClick={() => void doSuspend()}>Confirm suspend</Button>
        </Stack>
      </Modal>

      <Modal opened={banOpen} onClose={banHandlers.close} title="Ban user">
        <Stack gap="sm">
          <Textarea label="Reason" required value={actionReason} onChange={(e) => setActionReason(e.currentTarget.value)} />
          <Button color="red" onClick={() => void doBan()}>
            Confirm ban
          </Button>
        </Stack>
      </Modal>
    </>
  );
}
