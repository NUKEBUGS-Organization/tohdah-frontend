import { Anchor, Group, Text } from '@mantine/core';

export function PublicFooter() {
  return (
    <Group
      justify="space-between"
      px={{ base: 24, sm: 48 }}
      py={32}
      wrap="wrap"
      gap="md"
      style={{
        borderTop: '1px solid #e2e8f0',
        background: '#f8fafc',
      }}
    >
      <Text fz={14} c="#64748b">
        © 2024 Tohdah Logistics. All rights reserved.
      </Text>
      <Group gap={24}>
        <Anchor fz={14} c="#64748b" href="#">
          Privacy Policy
        </Anchor>
        <Anchor fz={14} c="#64748b" href="#">
          Terms of Service
        </Anchor>
        <Anchor fz={14} c="#64748b" href="#">
          Contact Support
        </Anchor>
      </Group>
    </Group>
  );
}
