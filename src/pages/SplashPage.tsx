import { Box, Button, Group, Stack, Text, Title } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

export function SplashPage() {
  const navigate = useNavigate();

  return (
    <Box
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0F1F3D 0%, #1E2A4A 50%, #0D2137 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <Box
        style={{
          position: 'absolute',
          top: '-20%',
          left: '-10%',
          width: '600px',
          height: '600px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(0,201,167,0.15) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          bottom: '-10%',
          right: '-5%',
          width: '500px',
          height: '500px',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(45,134,255,0.12) 0%, transparent 70%)',
          filter: 'blur(40px)',
          pointerEvents: 'none',
        }}
      />

      <Group justify="space-between" px={48} py={24} style={{ position: 'relative', zIndex: 1 }}>
        <Text fw={800} size="xl" c="white">
          Tohdah
        </Text>
        <Button variant="subtle" c="white" onClick={() => navigate('/login')}>
          Log in
        </Button>
      </Group>

      <Stack
        align="center"
        justify="center"
        style={{ minHeight: '80vh', position: 'relative', zIndex: 1 }}
        gap={0}
        px={24}
      >
        <Box
          mb={24}
          style={{
            background: 'rgba(0,201,167,0.15)',
            border: '1px solid rgba(0,201,167,0.3)',
            borderRadius: '999px',
            padding: '6px 16px',
            display: 'inline-block',
          }}
        >
          <Text size="sm" c="#00C9A7" fw={500}>
            ✈️ Travel · Earn · Impact
          </Text>
        </Box>

        <Title
          ta="center"
          style={{
            fontSize: 'clamp(40px, 6vw, 72px)',
            fontWeight: 800,
            lineHeight: 1.1,
            color: 'white',
            maxWidth: 800,
            marginBottom: 24,
          }}
        >
          Turn travel into{' '}
          <span className="gradient-text" style={{ WebkitTextFillColor: 'transparent' }}>
            opportunity
          </span>
        </Title>

        <Text c="rgba(255,255,255,0.65)" size="xl" ta="center" maw={520} mb={48} lh={1.7}>
          Earn money carrying items while you travel. Send packages with trusted travelers. Support
          your community.
        </Text>

        <Group gap={16} mb={80}>
          <Button
            size="lg"
            radius="xl"
            style={{
              background: 'linear-gradient(135deg, #00C9A7, #2D86FF)',
              border: 'none',
              padding: '14px 36px',
              fontSize: 16,
              fontWeight: 600,
              boxShadow: '0 8px 32px rgba(0,201,167,0.3)',
            }}
            onClick={() => navigate('/signup')}
          >
            Get Started →
          </Button>
          <Button
            size="lg"
            radius="xl"
            variant="outline"
            style={{
              borderColor: 'rgba(255,255,255,0.3)',
              color: 'white',
              padding: '14px 36px',
            }}
            onClick={() => navigate('/login')}
          >
            Log In
          </Button>
        </Group>

        <Group gap={48} justify="center">
          {[
            { value: '50K+', label: 'Travelers' },
            { value: '180+', label: 'Countries' },
            { value: '99%', label: 'Safe delivery' },
          ].map((stat) => (
            <Stack key={stat.label} align="center" gap={4}>
              <Text fw={700} size="xl" c="white">
                {stat.value}
              </Text>
              <Text size="sm" c="rgba(255,255,255,0.5)">
                {stat.label}
              </Text>
            </Stack>
          ))}
        </Group>
      </Stack>
    </Box>
  );
}
