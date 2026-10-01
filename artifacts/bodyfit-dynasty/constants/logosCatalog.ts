export interface DynastyLogo {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  primaryColor: string;
  accentColor: string;
  bgColor: string;
  badgeLabel: string;
  iconName: 'award' | 'zap' | 'shield' | 'star' | 'activity';
}

export const DYNASTY_LOGOS_CATALOG: DynastyLogo[] = [
  {
    id: 'gold-emperor',
    name: 'Oro Dinastía',
    subtitle: 'Predeterminado Oficial',
    description: 'Corona imperial en oro puro sobre negro noche. La insignia máxima de la dinastía.',
    primaryColor: '#FFD700',
    accentColor: '#FFA500',
    bgColor: '#1A1424',
    badgeLabel: 'OFICIAL',
    iconName: 'award',
  },
  {
    id: 'neon-dynasty',
    name: 'Morado Neón',
    subtitle: 'Cyberpunk Elite',
    description: 'Resplandor púrpura de alta frecuencia. Energía pura y modernidad implacable.',
    primaryColor: '#C084FC',
    accentColor: '#A855F7',
    bgColor: '#1D112C',
    badgeLabel: 'POPULAR',
    iconName: 'zap',
  },
  {
    id: 'obsidian-dark',
    name: 'Obsidiana Black',
    subtitle: 'Sigilo & Titanio',
    description: 'Escudo mate en carbón mineral y bordes platino. Minimalismo táctico para atletas dedicados.',
    primaryColor: '#E2E8F0',
    accentColor: '#94A3B8',
    bgColor: '#121216',
    badgeLabel: 'STEALTH',
    iconName: 'shield',
  },
  {
    id: 'crimson-warrior',
    name: 'Carmesí Guerrero',
    subtitle: 'Sangre & Fuego',
    description: 'Rojo combativo con destellos dorados. El emblema de quienes entrenan hasta el fallo.',
    primaryColor: '#EF4444',
    accentColor: '#DC2626',
    bgColor: '#220E14',
    badgeLabel: 'POTENCIA',
    iconName: 'activity',
  },
  {
    id: 'titan-emerald',
    name: 'Esmeralda Titán',
    subtitle: 'Fuerza Vital',
    description: 'Verde esmeralda y destellos áureos de victoria. Símbolo de longevidad y constancia física.',
    primaryColor: '#10B981',
    accentColor: '#059669',
    bgColor: '#0C1C16',
    badgeLabel: 'VITALIDAD',
    iconName: 'star',
  },
];

export function getDynastyLogo(id?: string | null): DynastyLogo {
  const found = DYNASTY_LOGOS_CATALOG.find((logo) => logo.id === id);
  return found || DYNASTY_LOGOS_CATALOG[0];
}
