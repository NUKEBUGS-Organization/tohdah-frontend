import {
  ActionIcon,
  Avatar,
  Badge,
  Button,
  Drawer,
  Group,
  Menu,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  Title,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { IconDotsVertical, IconMail, IconMapPin } from '@tabler/icons-react';
import { useState } from 'react';
import { adminUi as AU } from '../../theme';

type UserRow = {
  id: string;
  name: string;
  email: string;
  role: string;
  status: 'Active' | 'Suspended' | 'Pending';
};

const MOCK_USERS: UserRow[] = [
  { id: '1', name: 'Sarah Jenkins', email: 'sarah.jenkins@email.com', role: 'Traveler', status: 'Active' },
  { id: '2', name: 'Omar Rivera', email: 'omar.rivera@corp.io', role: 'Requester', status: 'Active' },
  { id: '3', name: 'Priya Sharma', email: 'priya.s@agency.net', role: 'Both', status: 'Pending' },
  { id: '4', name: 'Leo Martins', email: 'leo.m@gmail.com', role: 'Traveler', status: 'Suspended' },
  { id: '5', name: 'Chloe Nguyen', email: 'c.nguyen@firm.com', role: 'Requester', status: 'Active' },
];

function statusBadge(s: UserRow['status']) {
  if (s === 'Active')
    return (
      <Badge color="teal" variant="light" size="sm">
        Active
      </Badge>
    );
  if (s === 'Suspended') return <Badge color="red" variant="light" size="sm">Suspended</Badge>;
  return <Badge color="yellow" variant="light" size="sm">Pending</Badge>;
}

export function AdminUsersPage() {
  const [drawerOpened, drawerHandlers] = useDisclosure(false);
  const [selectedId, setSelectedId] = useState<string>('1');

  const detail = MOCK_USERS.find((u) => u.id === selectedId);
  const isSarah = selectedId === '1';

  return (
    <>
      <Stack gap="lg">
        <div>
          <Title order={2} fz={24} fw={800}>
            System users
          </Title>
          <Text fz={14} c="dimmed" mt={4}>
            Search roles, deactivate accounts, and open profile review from the inspector.
          </Text>
        </div>

        <Paper radius="md" withBorder shadow="xs" bg="#fff">
          <Table striped highlightOnHover verticalSpacing="md" horizontalSpacing="lg">
            <Table.Thead>
              <Table.Tr style={{ borderBottom: '1px solid #e8ecf1' }}>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  Name
                </Table.Th>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  Email
                </Table.Th>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  Role
                </Table.Th>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  Status
                </Table.Th>
                <Table.Th fz={11} fw={700} tt="uppercase">
                  {/* actions */}
                </Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {MOCK_USERS.map((user) => (
                <Table.Tr
                  key={user.id}
                  style={{
                    cursor: 'pointer',
                    ...(drawerOpened && selectedId === user.id
                      ? { backgroundColor: `${AU.accentTeal}14` }
                      : {}),
                  }}
                  onClick={() => {
                    setSelectedId(user.id);
                    drawerHandlers.open();
                  }}
                >
                  <Table.Td>
                    <Text fw={700} fz={14}>
                      {user.name}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fz={14} c="dimmed">
                      {user.email}
                    </Text>
                  </Table.Td>
                  <Table.Td>
                    <Text fz={14}>{user.role}</Text>
                  </Table.Td>
                  <Table.Td>{statusBadge(user.status)}</Table.Td>
                  <Table.Td onClick={(e) => e.stopPropagation()}>
                    <Menu shadow="md" width={160}>
                      <Menu.Target>
                        <ActionIcon variant="subtle" color="gray">
                          <IconDotsVertical size={18} stroke={1.5} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item
                          onClick={() => {
                            setSelectedId(user.id);
                            drawerHandlers.open();
                          }}
                        >
                          View profile
                        </Menu.Item>
                        <Menu.Item>Edit role</Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>
      </Stack>

      <Drawer
        opened={drawerOpened}
        onClose={drawerHandlers.close}
        position="right"
        size="lg"
        offset={16}
        radius="lg"
        title={
          detail ? (
            <Text fw={800} fz={16}>
              User profile
            </Text>
          ) : (
            ''
          )
        }
        styles={{ body: { paddingTop: 8 } }}
      >
        {detail ? (
          <Stack gap="lg">
            <Group align="flex-start">
              <Avatar
                radius="xl"
                size={80}
                src={
                  isSarah
                    ? 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?w=200&q=70'
                    : undefined
                }
                color="teal"
              >
                {!isSarah ? detail.name.slice(0, 2).toUpperCase() : null}
              </Avatar>
              <Stack gap={2}>
                <Title order={3} fz={22}>
                  {detail.name}
                </Title>
                <Text fz={13} c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconMail size={14} stroke={1.5} /> {detail.email}
                </Text>
                <Text fz={13} c="dimmed" style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <IconMapPin size={14} stroke={1.5} /> Austin, TX
                </Text>
                <Group mt="xs">{statusBadge(detail.status)}</Group>
              </Stack>
            </Group>

            <Paper radius="md" bg={AU.pageBg} p="md">
              <SimpleGrid cols={2}>
                <Stack gap={0} align="center">
                  <Text fz={26} fw={800}>
                    12
                  </Text>
                  <Text fz={12} c="dimmed" ta="center">
                    Total bookings
                  </Text>
                </Stack>
                <Stack gap={0} align="center">
                  <Text fz={26} fw={800}>
                    4.8
                  </Text>
                  <Text fz={12} c="dimmed" ta="center">
                    Avg rating
                  </Text>
                </Stack>
              </SimpleGrid>
            </Paper>
            <Group grow>
              <Button radius="md" variant="filled" {...tealFilled}>
                Edit profile
              </Button>
              <Button radius="md" variant="outline" color="red">
                Deactivate user
              </Button>
            </Group>
          </Stack>
        ) : null}
      </Drawer>
    </>
  );
}

const tealFilled = {
  styles: { root: { backgroundColor: AU.accentTeal, border: 'none', color: '#fff' } },
} as const;
