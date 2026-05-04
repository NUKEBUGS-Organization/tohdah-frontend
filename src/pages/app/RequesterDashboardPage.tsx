import {
  Avatar,
  Box,
  Button,
  Card,
  Group,
  Paper,
  Progress,
  ScrollArea,
  SimpleGrid,
  Stack,
  Text,
  Title,
} from '@mantine/core';
import { IconPackage, IconPlus, IconStar } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { colors, requesterUi as RQ } from '../../theme';

const activeCards = [
  {
    title: 'Laptop sleeve',
    subtitle: 'JFK → CDG · In progress',
    progress: 55,
    statusLabel: 'In progress',
  },
  {
    title: 'Groceries',
    subtitle: 'Community support · En route',
    progress: 30,
    statusLabel: 'Picked up',
  },
];

const suggested = [
  { name: 'Aisha K.', rating: '4.9', trips: '128 trips', initials: 'AK' },
  { name: 'Leo M.', rating: '4.8', trips: '64 trips', initials: 'LM' },
  { name: 'M. Chen', rating: '4.7', trips: '201 trips', initials: 'MC' },
];

export function RequesterDashboardPage() {
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

      <Box>
        <Title order={4} fz={16} fw={700} mb="md" c={colors.navyDeep}>
          My active requests
        </Title>
        <ScrollArea type="never" scrollbarSize={0}>
          <Group gap="md" wrap="nowrap" pb={8} align="stretch">
            {activeCards.map((c) => (
              <Card
                key={c.title}
                withBorder
                radius="md"
                padding="lg"
                w={280}
                style={{ flex: '0 0 auto', boxShadow: '0 2px 12px rgba(0, 34, 80, 0.06)' }}
              >
                <Text fz={12} tt="uppercase" fw={700} c={colors.subtleText}>
                  {c.statusLabel}
                </Text>
                <Text fw={700} fz={17} mt={6}>
                  {c.title}
                </Text>
                <Text fz={13} c={colors.mutedText} mt={4} lineClamp={2}>
                  {c.subtitle}
                </Text>
                <Text fz={12} c={colors.subtleText} mt="lg" mb={6}>
                  Status
                </Text>
                <Progress value={c.progress} size="sm" radius="md" color="blue" />
                <Button
                  component={Link}
                  to="/app/requester/requests/detail"
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  size="xs"
                  radius="md"
                >
                  View details
                </Button>
              </Card>
            ))}
          </Group>
        </ScrollArea>
      </Box>

      <Box>
        <Title order={4} fz={16} fw={700} mb="md" c={colors.navyDeep}>
          Suggested matches
        </Title>
        <SimpleGrid cols={{ base: 1, xs: 2, md: 3 }} spacing="md">
          {suggested.map((s) => (
            <Paper
              key={s.name}
              withBorder
              radius="md"
              p="md"
              shadow="xs"
              style={{
                cursor: 'default',
              }}
            >
              <Group align="flex-start" wrap="nowrap">
                <Avatar size={52} radius="xl" color="brandTeal">
                  {s.initials}
                </Avatar>
                <div style={{ minWidth: 0 }}>
                  <Text fw={700} fz={16} truncate>
                    {s.name}
                  </Text>
                  <Group gap={4} mt={4}>
                    <IconStar size={16} fill={RQ.communityMint} color={RQ.communityMint} />
                    <Text fz={13} fw={600}>
                      {s.rating} · {s.trips}
                    </Text>
                  </Group>
                </div>
              </Group>
              <Button
                component={Link}
                to="/app/requester/matches/detail"
                variant="outline"
                color="blue"
                size="xs"
                mt="sm"
                radius="md"
                fullWidth
              >
                View match
              </Button>
            </Paper>
          ))}
        </SimpleGrid>
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
