/**
 * Semantic design tokens for the mobile app.
 *
 * These tokens mirror the naming conventions used in web artifacts (index.css)
 * so that multi-artifact projects share a cohesive visual identity.
 *
 * Replace the placeholder values below with values that match the project's
 * brand. If a sibling web artifact exists, read its index.css and convert the
 * HSL values to hex so both artifacts use the same palette.
 *
 * To add dark mode, add a `dark` key with the same token names.
 * The useColors() hook will automatically pick it up.
 */

const colors = {
  light: {
    text: '#FFFFFF',
    tint: '#A82BE2',
    background: '#08080B',
    foreground: '#FFFFFF',
    card: '#111116',
    cardForeground: '#FFFFFF',
    primary: '#A82BE2',
    primaryForeground: '#FFFFFF',
    secondary: '#19191F',
    secondaryForeground: '#FFFFFF',
    muted: '#1A1A20',
    mutedForeground: '#92929D',
    accent: '#D4AF37',
    accentForeground: '#08080B',
    destructive: '#EF5B6B',
    destructiveForeground: '#FFFFFF',
    border: '#28282F',
    input: '#2E2E36',
    purpleBright: '#5E17EB',
    gold: '#D4AF37',
    green: '#6FDE9A',
    blue: '#57B8FF',
    orange: '#FF9F5B',
  },
  radius: 8,
};

export default colors;
