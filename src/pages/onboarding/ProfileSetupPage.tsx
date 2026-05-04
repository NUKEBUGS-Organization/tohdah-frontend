import {
  ActionIcon,
  Avatar,
  Box,
  Button,
  Group,
  Select,
  SimpleGrid,
  Stack,
  Stepper,
  Text,
  TextInput,
} from '@mantine/core';
import { IconPlus } from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { colors } from '../../theme';

export function ProfileSetupPage() {
  return (
    <Box mih="100vh" bg="#f8fafc" py={40} px={24}>
      <Stack maw={900} mx="auto" gap="xl">
        <Stepper active={3} size="sm" color="brandTeal">
          <Stepper.Step label="Intro" description="How it works" />
          <Stepper.Step label="Safety" description="Trust & pay" />
          <Stepper.Step label="Role" description="Travel or send" />
          <Stepper.Step label="Profile" description="About you" />
        </Stepper>

        <Text fw={800} fz={{ base: 24, sm: 28 }} c={colors.navyDeep}>
          Complete Your Profile.
        </Text>
        <Text c={colors.mutedText} mt={-8}>
          This helps us verify your account and personalize matches.
        </Text>

        <SimpleGrid cols={{ base: 1, md: 2 }} spacing="xl">
          <Stack align="center">
            <Box pos="relative" style={{ width: 'fit-content' }}>
              <Avatar size={140} radius={999} color="gray.3">
                <Text c="dimmed" fz={12}>
                  Photo
                </Text>
              </Avatar>
              <ActionIcon
                pos="absolute"
                bottom={4}
                right={4}
                radius="xl"
                size="lg"
                variant="filled"
                color="brandTeal"
                aria-label="Upload photo"
              >
                <IconPlus size={18} />
              </ActionIcon>
            </Box>
            <Text fz={13} c={colors.subtleText} ta="center">
              JPG or PNG, max 5MB
            </Text>
          </Stack>

          <Stack gap="md">
            <Select
              label="Gender"
              placeholder="Select"
              data={['Female', 'Male', 'Non-binary', 'Prefer not to say']}
              styles={{ input: { borderColor: colors.border } }}
            />
            <TextInput
              label="Date of Birth"
              type="date"
              styles={{ input: { borderColor: colors.border } }}
            />
            <Select
              label="Country"
              placeholder="Select country"
              searchable
              data={['United States', 'United Kingdom', 'UAE', 'Canada', 'Other']}
              styles={{ input: { borderColor: colors.border } }}
            />
            <TextInput
              label="City"
              placeholder="Your city"
              styles={{ input: { borderColor: colors.border } }}
            />
            <TextInput
              label="Address"
              placeholder="Street, building, apartment"
              styles={{ input: { borderColor: colors.border } }}
            />
          </Stack>
        </SimpleGrid>

        <Group justify="flex-end" mt="md">
          <Button
            component={Link}
            to="/app/traveler"
            size="md"
            px={32}
            styles={{
              root: {
                background: `linear-gradient(134deg, ${colors.gradientFrom}, ${colors.gradientTo})`,
                border: 'none',
              },
            }}
          >
            Save and Continue
          </Button>
        </Group>
      </Stack>
    </Box>
  );
}
