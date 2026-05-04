import { Avatar, Badge, Grid, Group, Paper, SimpleGrid, Stack, Table, Text } from '@mantine/core';
import { adminUi as AU } from '../../theme';

const REF_ROWS = [
  { user: 'Nina Kouassi', referred: 'Luis V.', status: 'Active', comm: '$120' },
  { user: 'Rowan Kelley', referred: 'Samira A.', status: 'Pending payout', comm: '$0' },
  { user: 'Imani Brooks', referred: 'Theo Müller', status: 'Active', comm: '$340' },
  { user: 'Kenji Wu', referred: 'Olivia Tran', status: 'Active', comm: '$55' },
] as const;

const LEADERBOARD = [
  { n: 'Imani Brooks', c: '186', avatar: 'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=96&q=70' },
  { n: 'Rowan Kelley', c: '142', avatar: 'https://images.unsplash.com/photo-1507591064344-4c6ce005b128?w=96&q=70' },
  { n: 'Nina Kouassi', c: '128', avatar: 'https://images.unsplash.com/photo-1574158622682-e40e69881006?w=96&q=70' },
] as const;

const ACTIVITY = [
  { ts: '10:41', evt: 'Referral payout approved', actor: 'Imani Brooks → Theo Müller', amt: '+$340' },
  { ts: 'Yesterday', evt: 'Tier upgrade', actor: 'Rowan Kelley → Silver', amt: '' },
  { ts: 'May 03', evt: 'Code redeemed', actor: 'WELCOME24 batch #882', amt: '+24 users' },
] as const;

export function AdminReferralLoyaltyPage() {
  return (
    <Stack gap="lg">
      <SimpleGrid cols={{ base: 1, md: 3 }} spacing="md">
        {[
          { t: 'Total referrals', v: '12,482' },
          { t: 'Active referrals', v: '5,123' },
          { t: 'Total commissions', v: '$642,500' },
        ].map((c) => (
          <Paper key={c.t} p="xl" radius="md" withBorder shadow="xs" bg="#fff">
            <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
              {c.t}
            </Text>
            <Text fz={{ base: 28, md: 34 }} fw={900} lh={1.1}>
              {c.v}
            </Text>
          </Paper>
        ))}
      </SimpleGrid>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, xl: 8 }}>
          <Paper p={0} radius="md" withBorder shadow="xs" bg="#fff" mb="md">
            <Group justify="space-between" px="lg" py="md" style={{ borderBottom: '1px solid #eceef3' }}>
              <Text fw={700} fz={15}>
                Recent referrals
              </Text>
              <Badge variant="outline" color="gray" size="sm">
                Paid + pending
              </Badge>
            </Group>
            <Table verticalSpacing="md" horizontalSpacing="lg">
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Referrer
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Invite
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Status
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase" ta="right">
                    Commission
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {REF_ROWS.map((row) => (
                  <Table.Tr key={row.user}>
                    <Table.Td fw={700} fz={14}>
                      {row.user}
                    </Table.Td>
                    <Table.Td fz={14} c="dimmed">
                      {row.referred}
                    </Table.Td>
                    <Table.Td>
                      <Badge color={row.status === 'Active' ? 'green' : 'orange'} variant="light" size="sm">
                        {row.status}
                      </Badge>
                    </Table.Td>
                    <Table.Td fz={14} fw={800} ta="right">
                      {row.comm}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>

          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff">
            <Text fw={700} fz={15} mb="md">
              Loyalty tier overview
            </Text>
            <SimpleGrid cols={{ base: 1, md: 3 }}>
              {[
                {
                  name: 'Bronze',
                  need: '0–4 completed referrals',
                  perk: 'Base commission rate · email digests',
                  color: '#b45309',
                },
                {
                  name: 'Silver',
                  need: '5–14 completions / quarter',
                  perk: '+8% accelerator · expedited payouts',
                  color: '#64748b',
                },
                {
                  name: 'Gold',
                  need: '15+ completions · NPS gate',
                  perk: '+15% accelerator · concierge support lane',
                  color: '#ca8a04',
                },
              ].map((t) => (
                <Paper key={t.name} p="lg" radius="md" bg={AU.pageBg} style={{ borderTop: `3px solid ${t.color}` }}>
                  <Text fz={13} fw={900} tt="uppercase" mb={6} style={{ color: t.color }}>
                    {t.name}
                  </Text>
                  <Text fz={13} fw={600} mb={8}>
                    {t.need}
                  </Text>
                  <Text fz={12} c="dimmed">
                    {t.perk}
                  </Text>
                </Paper>
              ))}
            </SimpleGrid>
          </Paper>

          <Paper p={0} radius="md" withBorder shadow="xs" bg="#fff" mt="md">
            <Text fw={700} fz={15} px="lg" py="md" style={{ borderBottom: '1px solid #eceef3' }}>
              Recent activity
            </Text>
            <Table>
              <Table.Thead>
                <Table.Tr>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Time
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Event
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase">
                    Subject
                  </Table.Th>
                  <Table.Th fz={11} fw={700} tt="uppercase" ta="right">
                    Delta
                  </Table.Th>
                </Table.Tr>
              </Table.Thead>
              <Table.Tbody>
                {ACTIVITY.map((a) => (
                  <Table.Tr key={a.evt}>
                    <Table.Td fz={13} c="dimmed">
                      {a.ts}
                    </Table.Td>
                    <Table.Td fz={13} fw={700}>
                      {a.evt}
                    </Table.Td>
                    <Table.Td fz={13}>
                      {a.actor}
                    </Table.Td>
                    <Table.Td fz={13} fw={700} ta="right">
                      {a.amt || '—'}
                    </Table.Td>
                  </Table.Tr>
                ))}
              </Table.Tbody>
            </Table>
          </Paper>
        </Grid.Col>

        <Grid.Col span={{ base: 12, xl: 4 }}>
          <Paper p="lg" radius="md" withBorder shadow="xs" bg="#fff" style={{ position: 'sticky', top: 88 }}>
            <Text fw={700} fz={15} mb="md">
              Top referrers
            </Text>
            <Stack gap={0}>
              {LEADERBOARD.map((row, idx) => (
                <Group key={row.n} gap="sm" wrap="nowrap" mb="lg">
                  <Text fw={900} fz={18} w={28} c="dimmed">
                    #{idx + 1}
                  </Text>
                  <Avatar src={row.avatar} radius="xl" />
                  <div style={{ flex: 1 }}>
                    <Text fz={14} fw={700}>
                      {row.n}
                    </Text>
                    <Text fz={12} c="dimmed">
                      {row.c} referrals
                    </Text>
                  </div>
                </Group>
              ))}
            </Stack>
          </Paper>
        </Grid.Col>
      </Grid>
    </Stack>
  );
}
