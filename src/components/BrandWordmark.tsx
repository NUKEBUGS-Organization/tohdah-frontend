import { Text, type TextProps } from '@mantine/core';

type BrandWordmarkProps = {
  size?: TextProps['size'];
  fz?: TextProps['fz'];
};

export function BrandWordmark({ size = 'xl', fz }: BrandWordmarkProps) {
  return (
    <Text
      fw={800}
      size={size}
      fz={fz}
      variant="gradient"
      gradient={{ from: '#00C9A7', to: '#2D86FF', deg: 90 }}
      style={{ letterSpacing: '-0.02em', lineHeight: 1 }}
    >
      Tohdah
    </Text>
  );
}
