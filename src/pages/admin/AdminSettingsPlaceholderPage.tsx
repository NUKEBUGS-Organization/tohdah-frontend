import { Paper, Stack, Text, Title } from '@mantine/core';

export function AdminSettingsPlaceholderPage() {
  return (
    <Paper p="xl" radius="lg" withBorder shadow="xs" bg="#fff" maw={640}>
      <Stack gap="xs">
        <Title order={2} fz={22}>
          Settings
        </Title>
        <Text fz={14} c="dimmed">
          Platform configuration, SSO, webhook endpoints, and feature flags — wire your admin API here during
          implementation.
        </Text>
      </Stack>
    </Paper>
  );
}
