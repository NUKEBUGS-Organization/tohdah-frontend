import {
  Alert,
  Badge,
  Box,
  Button,
  Grid,
  Group,
  Paper,
  SimpleGrid,
  Stack,
  Table,
  Text,
  TextInput,
  Title,
} from '@mantine/core';
import { adminUi as AU } from '../../theme';

export function AdminSponsorshipPartnersPage() {
  return (
    <Stack gap="lg">
      <div>
        <Title order={2} fz={24} fw={800}>
          Sponsorship & nonprofit partners
        </Title>
        <Text fz={14} c="dimmed" mt={4}>
          Partner onboarding and ledger tools.
        </Text>
      </div>

      <Alert color="blue" title="Coming soon">
        Sponsorship and partner management is coming in Phase 2. The backend schema and endpoints are ready — frontend
        integration will follow once partner onboarding is defined.
      </Alert>

      <Grid gap="md">
        <Grid.Col span={{ base: 12, lg: 8 }}>
          <Paper p="xl" radius="lg" shadow="xs" withBorder bg="#fff" h="100%">
            <Group justify="space-between" align="flex-start" mb="xs">
              <div>
                <Text fz={12} fw={700} tt="uppercase" c="dimmed" mb={6}>
                  Total sponsorships
                </Text>
                <Text fz={36} fw={900} c="dimmed">
                  —
                </Text>
              </div>
              <Badge variant="light" color="gray" size="lg">
                Disabled
              </Badge>
            </Group>
            <Text fz={13} c="dimmed" mb="md">
              Summary metrics will populate from the API once live.
            </Text>
            <Paper h={200} radius="md" bg={AU.pageBg} />
            <Text fz={11} c="dimmed" mt={6}>
              This form will be active in Phase 2.
            </Text>
          </Paper>
        </Grid.Col>
        <Grid.Col span={{ base: 12, lg: 4 }}>
          <Paper
            p="xl"
            radius="lg"
            shadow="md"
            h="100%"
            style={{
              background: `linear-gradient(160deg, ${AU.sidebarBg} 0%, #1e293b 100%)`,
              color: '#fff',
              opacity: 0.85,
            }}
          >
            <Text fz={12} fw={700} tt="uppercase" c="rgba(255,255,255,0.7)" mb={8}>
              Active sponsors
            </Text>
            <Text fz={42} fw={900}>
              —
            </Text>
            <Text fz={13} c="rgba(255,255,255,0.82)" mt="sm">
              Placeholder until partner API is connected.
            </Text>
          </Paper>
        </Grid.Col>
      </Grid>

      <Paper p={0} radius="md" withBorder shadow="xs" bg="#fff">
        <Group justify="space-between" px="lg" py="md" style={{ borderBottom: '1px solid #eceef3' }}>
          <Text fw={700}>Partnership ledger</Text>
          <Badge variant="outline" color="gray" size="sm">
            Disabled
          </Badge>
        </Group>
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th fz={11} fw={700} tt="uppercase">
                Partner name
              </Table.Th>
              <Table.Th fz={11} fw={700} tt="uppercase">
                Category
              </Table.Th>
              <Table.Th fz={11} fw={700} tt="uppercase" ta="right">
                Amount
              </Table.Th>
              <Table.Th fz={11} fw={700} tt="uppercase">
                Status
              </Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            <Table.Tr>
              <Table.Td colSpan={4}>
                <Text fz={13} c="dimmed" py="md" ta="center">
                  No rows — connect API in a later release.
                </Text>
              </Table.Td>
            </Table.Tr>
          </Table.Tbody>
        </Table>
      </Paper>

      <div>
        <Title order={4} fz={16} fw={800} mb="md">
          Partner intake (disabled)
        </Title>
        <SimpleGrid cols={{ base: 1, sm: 2, xl: 4 }} spacing="md">
          {['Org A', 'Org B', 'Org C', 'Org D'].map((o) => (
            <Paper key={o} p="lg" radius="md" withBorder shadow="xs" bg="#fff">
              <Box fz={36} lh={1} mb="sm" c="dimmed">
                —
              </Box>
              <Text fw={800} fz={16}>
                {o}
              </Text>
              <TextInput label="Contact email" disabled mt="md" placeholder="partner@example.org" />
              <TextInput label="Annual commitment (USD)" disabled mt="sm" placeholder="0" />
              <Button fullWidth mt="md" disabled>
                Save draft
              </Button>
            </Paper>
          ))}
        </SimpleGrid>
      </div>
    </Stack>
  );
}
