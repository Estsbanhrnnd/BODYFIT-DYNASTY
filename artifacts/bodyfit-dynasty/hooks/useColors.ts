import { useColorScheme } from 'react-native';
import colors from '@/constants/colors';
import { useBodyFitOptional } from '@/context/BodyFitContext';

const themes = {
  purple: { primary: '#A82BE2', deep: '#5E17EB' },
  crimson: { primary: '#E5484D', deep: '#9F1239' },
  ocean: { primary: '#2F80ED', deep: '#174EA6' },
  forest: { primary: '#38A169', deep: '#166534' },
  amber: { primary: '#D97706', deep: '#92400E' },
  rose: { primary: '#EC4899', deep: '#9D174D' },
  ice: { primary: '#06B6D4', deep: '#0E7490' },
  neon: { primary: '#84CC16', deep: '#365314' },
  lavender: { primary: '#8B7CF6', deep: '#5B21B6' },
  graphite: { primary: '#94A3B8', deep: '#475569' },
} as const;

/**
 * Returns the design tokens for the current color scheme.
 *
 * The returned object contains all color tokens for the active palette
 * plus scheme-independent values like `radius`.
 *
 * Falls back to the light palette when no dark key is defined in
 * constants/colors.ts (the scaffold ships light-only by default).
 * When a sibling web artifact's dark tokens are synced into a `dark`
 * key, this hook will automatically switch palettes based on the
 * device's appearance setting.
 */
export function useColors() {
  const scheme = useColorScheme();
  const themeKey = useBodyFitOptional()?.profile?.themeKey as keyof typeof themes | undefined;
  const accent = themes[themeKey ?? 'purple'] ?? themes.purple;
  const palette =
    scheme === 'dark' && 'dark' in colors
      ? (colors as Record<string, typeof colors.light>).dark
      : colors.light;
  return {
    ...palette,
    primary: accent.primary,
    tint: accent.primary,
    purpleBright: accent.deep,
    accent: accent.primary,
    radius: colors.radius,
  };
}
