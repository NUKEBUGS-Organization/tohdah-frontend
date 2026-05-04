import { Badge, Box, Group, Paper, Table, Text, Title } from '@mantine/core';
import type { ReactNode } from 'react';
import { colors } from '../../../theme';

export function PageIntro({
  title,
  subtitle,
  actions,
}: {
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}) {
  return (
    <Group justify="space-between" align="flex-start" wrap="wrap" mb="lg">
      <Box maw={720}>
        <Title order={2} fz={26} fw={700} c={colors.navyDeep}>
          {title}
        </Title>
        {subtitle ? (
          <Text mt={6} fz={15} c={colors.mutedText}>
            {subtitle}
          </Text>
        ) : null}
      </Box>
      {actions ? <Group gap="sm">{actions}</Group> : null}
    </Group>
  );
}

export function ShellCard({ children }: { children: ReactNode }) {
  return (
    <Paper radius="md" p="lg" withBorder shadow="xs">
      {children}
    </Paper>
  );
}

export function MockTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: (string | ReactNode)[][];
}) {
  return (
    <Table striped highlightOnHover verticalSpacing="sm">
      <Table.Thead>
        <Table.Tr>
          {columns.map((c) => (
            <Table.Th key={c}>{c}</Table.Th>
          ))}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {rows.map((r, i) => (
          <Table.Tr key={i}>
            {r.map((cell, j) => (
              <Table.Td key={j}>{cell}</Table.Td>
            ))}
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const color =
    status === 'Active' || status === 'Matched' || status === 'Paid'
      ? 'teal'
      : status === 'In Progress' || status === 'Ongoing'
        ? 'blue'
      : status === 'Pending'
        ? 'orange'
        : status === 'Completed'
          ? 'green'
          : status === 'Cancelled'
            ? 'red'
            : 'blue';
  return (
    <Badge variant="light" color={color}>
      {status}
    </Badge>
  );
}
