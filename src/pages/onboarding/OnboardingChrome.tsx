import { Box, Button, Group, Progress, Stack, Text } from '@mantine/core';
import type { ReactNode } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { colors } from '../../theme';

type OnboardingChromeProps = {
  step: 1 | 2 | 3;
  title: string;
  subtitle?: string;
  children: ReactNode;
  nextTo?: string;
  prevTo?: string;
  nextLabel?: string;
  /** Align primary action (e.g. step 2 = end) */
  actionsJustify?: 'center' | 'flex-end' | 'space-between';
};

export function OnboardingChrome({
  step,
  title,
  subtitle,
  children,
  nextTo,
  prevTo,
  nextLabel = 'Next',
  actionsJustify = 'center',
}: OnboardingChromeProps) {
  const navigate = useNavigate();
  const pct = step === 1 ? 33 : step === 2 ? 66 : 100;

  return (
    <Box mih="100vh" bg="#f8fafc">
      <Box
        px={24}
        py={16}
        style={{
          borderBottom: '1px solid #e2e8f0',
          boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
        }}
      >
        <Group justify="space-between">
          <Text fw={700} fz={18} c={colors.navyDeep}>
            Tohdah
          </Text>
          <Button variant="subtle" color="gray" onClick={() => navigate('/app/traveler')}>
            Skip for now
          </Button>
        </Group>
      </Box>

      <Stack gap="xl" maw={960} mx="auto" px={24} py={48}>
        <Stack gap="xs" align="center">
          <Progress value={pct} w={{ base: '100%', sm: 280 }} size="sm" color="brandTeal" radius="xl" />
          <Text fz={12} c={colors.subtleText} tt="uppercase" fw={600}>
            Step {step} of 3
          </Text>
          <Text fw={700} fz={{ base: 22, sm: 28 }} ta="center" c={colors.navyDeep}>
            {title}
          </Text>
          {subtitle ? (
            <Text ta="center" maw={640} c={colors.mutedText}>
              {subtitle}
            </Text>
          ) : null}
        </Stack>
        {children}
        <Group
          justify={prevTo ? 'space-between' : actionsJustify}
          gap="md"
          mt="xl"
          wrap="wrap"
        >
          {prevTo ? (
            <Button component={Link} to={prevTo} variant="default">
              Back
            </Button>
          ) : null}
          {nextTo ? (
            <Button
              component={Link}
              to={nextTo}
              styles={{
                root: {
                  background: `linear-gradient(134deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                  border: 'none',
                  minWidth: 160,
                },
              }}
            >
              {nextLabel}
            </Button>
          ) : null}
        </Group>
      </Stack>
    </Box>
  );
}
