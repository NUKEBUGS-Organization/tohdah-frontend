import { Box, Button, type ButtonProps, Group, Paper, Stack, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { colors } from '../theme';

type ScreenScaffoldProps = {
  title: string;
  description?: string;
  actions?: ReactNode;
  children?: ReactNode;
};

export function ScreenScaffold({
  title,
  description,
  actions,
  children,
}: ScreenScaffoldProps) {
  return (
    <Stack gap="lg" pb={48}>
      <Group justify="space-between" align="flex-start" wrap="wrap">
        <Box maw={720}>
          <Title order={2} c={colors.navyDeep} fz={28} fw={700}>
            {title}
          </Title>
          {description ? (
            <Text mt="sm" c={colors.mutedText} fz={15} maw={640}>
              {description}
            </Text>
          ) : null}
        </Box>
        {actions ? <Group gap="sm">{actions}</Group> : null}
      </Group>
      <Paper radius="md" p="md" withBorder shadow="xs">
        {children ?? (
          <Text c={colors.subtleText} fz={14}>
            Interactive flows and API wiring can be layered here. Layout and
            navigation match the full Figma screen map.
          </Text>
        )}
      </Paper>
    </Stack>
  );
}

export function PrimaryGradientButton({ children, ...rest }: ButtonProps) {
  return (
    <Button
      {...rest}
      styles={{
        root: {
          background: `linear-gradient(134deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
          border: 'none',
          boxShadow:
            '0 10px 15px -3px rgba(0,107,88,0.2), 0 4px 6px -4px rgba(0,107,88,0.2)',
        },
      }}
    >
      {children}
    </Button>
  );
}
