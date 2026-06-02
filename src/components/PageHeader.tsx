import { Box, Text, Title } from '@mantine/core';
import { colors } from '../theme';

export function PageHeader({
  section,
  title,
  subtitle,
}: {
  section?: string;
  title: string;
  subtitle?: string;
}) {
  return (
    <Box mb="xl">
      {section ? (
        <Text size="xs" fw={700} tt="uppercase" lts="0.1em" c={colors.subtleText} mb={4}>
          {section}
        </Text>
      ) : null}
      <Title order={2} c={colors.textPrimary} fw={700}>
        {title}
      </Title>
      {subtitle ? (
        <Text c={colors.textSecondary} mt={4}>
          {subtitle}
        </Text>
      ) : null}
    </Box>
  );
}
