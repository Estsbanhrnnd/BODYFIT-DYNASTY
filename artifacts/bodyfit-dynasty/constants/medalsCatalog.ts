/**
 * Catálogo Oficial de 35 Medallas - BodyFit Dynasty ®
 * Exactamente 35 medallas:
 * 🥉 9 Bronze
 * 💠 9 Platinum
 * 🥇 9 Golden
 * 💎 8 Diamond
 * Incluye motor de evaluación de desbloqueo por MAYORÍA multi-área.
 */

import { Feather } from '@expo/vector-icons';

export type MedalTier = 'BRONZE' | 'PLATINUM' | 'GOLDEN' | 'DIAMOND';

export interface MedalObjective {
  key: 'workouts' | 'nutrition' | 'steps' | 'cardio' | 'streak' | 'prs' | 'activeDays';
  label: string;
  target: number;
  unit: string;
}

export interface DynastyMedal {
  id: string;
  title: string;
  tier: MedalTier;
  tierLabel: 'Bronce' | 'Platino' | 'Oro' | 'Diamante';
  tierColor: string;
  badgeConcept: string; // Murciélago genérico, Bestia, Titán, Guerrero, Corona, etc.
  icon: keyof typeof Feather.glyphMap;
  loreQuote: string;
  detail: string;
  points: number;
  objectives: MedalObjective[];
  requiredMajorityCount: number; // Cantidad mínima de objetivos para desbloquear
}

export interface DynastyUserStats {
  workouts: number;
  nutrition: number;
  steps: number;
  cardio: number;
  streak: number;
  prs: number;
  activeDays: number;
}

export const TIER_CONFIG: Record<
  MedalTier,
  { label: 'Bronce' | 'Platino' | 'Oro' | 'Diamante'; color: string; bg: string; border: string; glow: string }
> = {
  BRONZE: {
    label: 'Bronce',
    color: '#CD7F32',
    bg: 'rgba(205, 127, 50, 0.12)',
    border: 'rgba(205, 127, 50, 0.45)',
    glow: '#CD7F3233',
  },
  PLATINUM: {
    label: 'Platino',
    color: '#94A3B8',
    bg: 'rgba(148, 163, 184, 0.12)',
    border: 'rgba(148, 163, 184, 0.45)',
    glow: '#94A3B833',
  },
  GOLDEN: {
    label: 'Oro',
    color: '#F59E0B',
    bg: 'rgba(245, 158, 11, 0.12)',
    border: 'rgba(245, 158, 11, 0.55)',
    glow: '#F59E0B44',
  },
  DIAMOND: {
    label: 'Diamante',
    color: '#00E5FF',
    bg: 'rgba(0, 229, 255, 0.12)',
    border: 'rgba(0, 229, 255, 0.6)',
    glow: '#00E5FF44',
  },
};

export const DYNASTY_MEDALS_CATALOG: DynastyMedal[] = [
  // ===================== 🥉 BRONZE (9 MEDALLAS) =====================
  {
    id: 'bronze-01',
    title: 'The Begins',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Murciélago guardián genérico en las sombras',
    icon: 'shield',
    loreQuote: 'En la oscuridad de la rutina surge el primer llamado del héroe hacia la dinastía.',
    detail: 'Primeros pasos en la dinastía: entrena y da tus primeros pasos.',
    points: 100,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos registrados', target: 1, unit: 'sesión' },
      { key: 'activeDays', label: 'Días activos', target: 1, unit: 'día' },
      { key: 'steps', label: 'Pasos activos', target: 3000, unit: 'pasos' },
    ],
    requiredMajorityCount: 2,
  },
  {
    id: 'bronze-02',
    title: 'Primer Fuego',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Flama sagrada ascendente',
    icon: 'zap',
    loreQuote: 'Una chispa de disciplina basta para encender la forja interior.',
    detail: 'Mantén la constancia en tus primeros dos días de hábito.',
    points: 150,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 2, unit: 'días' },
      { key: 'steps', label: 'Pasos acumulados', target: 5000, unit: 'pasos' },
      { key: 'nutrition', label: 'Comidas registradas', target: 1, unit: 'comida' },
    ],
    requiredMajorityCount: 2,
  },
  {
    id: 'bronze-03',
    title: 'Nutrición Consciente',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Hoja de energía vital',
    icon: 'activity',
    loreQuote: 'La comida real es el combustible de los conquistadores.',
    detail: 'Combina alimentación estructurada con movimiento constante.',
    points: 150,
    objectives: [
      { key: 'nutrition', label: 'Comidas registradas', target: 3, unit: 'comidas' },
      { key: 'workouts', label: 'Entrenamientos completados', target: 2, unit: 'sesiones' },
      { key: 'cardio', label: 'Cardio ligero', target: 10, unit: 'min' },
    ],
    requiredMajorityCount: 2,
  },
  {
    id: 'bronze-04',
    title: 'Cardio Inicial',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Corazón blindado',
    icon: 'heart',
    loreQuote: 'Un corazón fuerte bombea la energía de los titanes.',
    detail: 'Despierta tu sistema cardiovascular sin sobreexigirte.',
    points: 175,
    objectives: [
      { key: 'cardio', label: 'Minutos de cardio', target: 15, unit: 'min' },
      { key: 'steps', label: 'Pasos activos', target: 6000, unit: 'pasos' },
      { key: 'activeDays', label: 'Días de actividad', target: 2, unit: 'días' },
    ],
    requiredMajorityCount: 2,
  },
  {
    id: 'bronze-05',
    title: 'Voluntad de Cobre',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Disco y barra de fundición',
    icon: 'disc',
    loreQuote: 'El cobre forja los cimientos de la armadura definitiva.',
    detail: 'Tres sesiones completas marcan el inicio de una transformación.',
    points: 200,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos registrados', target: 3, unit: 'sesiones' },
      { key: 'activeDays', label: 'Días activos', target: 3, unit: 'días' },
      { key: 'steps', label: 'Pasos acumulados', target: 10000, unit: 'pasos' },
      { key: 'nutrition', label: 'Comidas registradas', target: 2, unit: 'comidas' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'bronze-06',
    title: 'Pasos Firmes',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Huella de titanio en roca',
    icon: 'navigation',
    loreQuote: 'Cada paso construye el imperio donde nadie más quiso avanzar.',
    detail: 'Suma 15,000 pasos en tu registro de actividad.',
    points: 220,
    objectives: [
      { key: 'steps', label: 'Pasos totales', target: 15000, unit: 'pasos' },
      { key: 'activeDays', label: 'Días activos', target: 3, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos registrados', target: 1, unit: 'sesión' },
    ],
    requiredMajorityCount: 2,
  },
  {
    id: 'bronze-07',
    title: 'Poder del Hábito',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Engranajes de bronce en movimiento',
    icon: 'settings',
    loreQuote: 'La repetición vence al talento cuando el talento no es constante.',
    detail: 'Establece una rutina sin interrupciones durante 3 días.',
    points: 250,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 3, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 3, unit: 'comidas' },
      { key: 'workouts', label: 'Entrenamientos', target: 3, unit: 'sesiones' },
      { key: 'cardio', label: 'Cardio acumulado', target: 15, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'bronze-08',
    title: 'Explorador Dynasty',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Brújula y espada exploradora',
    icon: 'compass',
    loreQuote: 'Conocer el territorio es el primer arte de la victoria.',
    detail: 'Explora entrenamientos y nutrición de forma equilibrada.',
    points: 275,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos', target: 4, unit: 'sesiones' },
      { key: 'activeDays', label: 'Días activos', target: 4, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 4, unit: 'comidas' },
    ],
    requiredMajorityCount: 2,
  },
  {
    id: 'bronze-09',
    title: 'Primer PR',
    tier: 'BRONZE',
    tierLabel: 'Bronce',
    tierColor: '#CD7F32',
    badgeConcept: 'Flecha ascendente de cobre y piedra',
    icon: 'trending-up',
    loreQuote: 'El primer límite roto confirma que tus fronteras eran una ilusión.',
    detail: 'Alcanza tu primer récord personal o completa 5 entrenos con 20k pasos.',
    points: 300,
    objectives: [
      { key: 'prs', label: 'Récords personales (PR)', target: 1, unit: 'PR' },
      { key: 'workouts', label: 'Entrenamientos', target: 5, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos totales', target: 20000, unit: 'pasos' },
    ],
    requiredMajorityCount: 2,
  },

  // ===================== 💠 PLATINUM (9 MEDALLAS) =====================
  {
    id: 'platinum-01',
    title: 'Caballero Oscuro',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Murciélago alado de platino resplandeciente',
    icon: 'moon',
    loreQuote: 'Entrenar en la penumbra cuando todos duermen es el sello del héroe.',
    detail: 'Una semana completa de disciplina implacable.',
    points: 450,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 7, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos', target: 6, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos acumulados', target: 30000, unit: 'pasos' },
      { key: 'cardio', label: 'Cardio semanal', target: 25, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-02',
    title: 'Escudo Impenetrable',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Broquel de acero templado y platino',
    icon: 'shield',
    loreQuote: 'Ninguna excusa puede atravesar la disciplina blindada.',
    detail: 'Diez entrenamientos registrados y constancia en alimentación.',
    points: 500,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 10, unit: 'sesiones' },
      { key: 'activeDays', label: 'Días activos', target: 10, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 8, unit: 'comidas' },
      { key: 'steps', label: 'Pasos totales', target: 40000, unit: 'pasos' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-03',
    title: 'Guerrero de Hierro',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Yelmo espartano plateado',
    icon: 'user-check',
    loreQuote: 'La armadura no pesa cuando el alma es de hierro.',
    detail: 'Supera marcas de fuerza y mantén tu constancia semanal.',
    points: 550,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 15, unit: 'sesiones' },
      { key: 'prs', label: 'Récords personales', target: 2, unit: 'PRs' },
      { key: 'streak', label: 'Racha activa', target: 7, unit: 'días' },
      { key: 'cardio', label: 'Cardio acumulado', target: 30, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-04',
    title: 'Ritmo Implacable',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Doble rayo de platino entrelazado',
    icon: 'zap',
    loreQuote: 'Un paso tras otro, un ritmo que no admite claudicación.',
    detail: 'Alcanza los 10 días de racha activa y 50k pasos.',
    points: 600,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 10, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos', target: 12, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos acumulados', target: 50000, unit: 'pasos' },
      { key: 'nutrition', label: 'Comidas registradas', target: 10, unit: 'comidas' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-05',
    title: 'Forja de Titán',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Yunque de platino y mazo de forja',
    icon: 'cpu',
    loreQuote: 'Bajo la presión del hierro se moldean los cuerpos legendarios.',
    detail: 'Dieciocho sesiones registradas y al menos 3 récords personales.',
    points: 650,
    objectives: [
      { key: 'prs', label: 'Récords personales', target: 3, unit: 'PRs' },
      { key: 'workouts', label: 'Entrenamientos completados', target: 18, unit: 'sesiones' },
      { key: 'activeDays', label: 'Días activos', target: 15, unit: 'días' },
      { key: 'cardio', label: 'Cardio acumulado', target: 35, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-06',
    title: 'Nutrición de Élite',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Balanza balanceada de platino',
    icon: 'check-circle',
    loreQuote: 'El control absoluto sobre los macronutrientes esculpe el físico.',
    detail: '14 días registrando tus comidas con entrenamientos sólidos.',
    points: 700,
    objectives: [
      { key: 'nutrition', label: 'Días con nutrición registrada', target: 14, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos', target: 15, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos acumulados', target: 60000, unit: 'pasos' },
      { key: 'cardio', label: 'Cardio acumulado', target: 40, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-07',
    title: 'Resistencia de Acero',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Pulmón de fuego plateado',
    icon: 'wind',
    loreQuote: 'Cuando el aliento parece faltar, el carácter toma el mando.',
    detail: 'Cardio y pasos consistentes respaldados por una racha de 12 días.',
    points: 750,
    objectives: [
      { key: 'cardio', label: 'Cardio acumulado', target: 45, unit: 'min' },
      { key: 'steps', label: 'Pasos acumulados', target: 70000, unit: 'pasos' },
      { key: 'workouts', label: 'Entrenamientos', target: 16, unit: 'sesiones' },
      { key: 'streak', label: 'Racha activa', target: 12, unit: 'días' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-08',
    title: 'Guardia de la Dinastía',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Doble espada de platino cruzada',
    icon: 'crosshair',
    loreQuote: 'Custodio de los estándares supremos de BodyFit Dynasty.',
    detail: 'Veinte sesiones y cuatro PRs consolidan tu nivel competitivo.',
    points: 780,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 20, unit: 'sesiones' },
      { key: 'activeDays', label: 'Días activos', target: 20, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 16, unit: 'comidas' },
      { key: 'prs', label: 'Récords de fuerza', target: 4, unit: 'PRs' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'platinum-09',
    title: 'Mente Invicta',
    tier: 'PLATINUM',
    tierLabel: 'Platino',
    tierColor: '#94A3B8',
    badgeConcept: 'Corona de laureles de platino',
    icon: 'award',
    loreQuote: 'La mente se rinde antes que el cuerpo. El guerrero educa a su mente.',
    detail: 'Dos semanas ininterrumpidas de racha activa y 80k pasos.',
    points: 800,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 14, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos', target: 22, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos acumulados', target: 80000, unit: 'pasos' },
      { key: 'cardio', label: 'Cardio acumulado', target: 50, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },

  // ===================== 🥇 GOLDEN (9 MEDALLAS) =====================
  {
    id: 'golden-01',
    title: 'La Corona del Rey',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Corona dorada con gemas Dynasty',
    icon: 'award',
    loreQuote: 'La corona no se hereda; se forja con sudor en cada serie pesada.',
    detail: 'Veinticinco entrenamientos y racha de 15 días.',
    points: 1100,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos', target: 25, unit: 'sesiones' },
      { key: 'streak', label: 'Racha activa', target: 15, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 20, unit: 'comidas' },
      { key: 'steps', label: 'Pasos acumulados', target: 90000, unit: 'pasos' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-02',
    title: 'Fuego Olímpico',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Antorcha de flama dorada eterna',
    icon: 'sun',
    loreQuote: '21 días ininterrumpidos crean una transformación irreversible.',
    detail: 'Tres semanas consecutivas de disciplina y 100,000 pasos.',
    points: 1200,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 21, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos', target: 28, unit: 'sesiones' },
      { key: 'cardio', label: 'Cardio acumulado', target: 60, unit: 'min' },
      { key: 'steps', label: 'Pasos acumulados', target: 100000, unit: 'pasos' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-03',
    title: 'Águila Dorada',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Alas de águila imperial desplegadas',
    icon: 'feather',
    loreQuote: 'Desde la cima de la cordillera, el águila domina el horizonte.',
    detail: 'Treinta entrenamientos y 5 récords de fuerza rotos.',
    points: 1300,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 30, unit: 'sesiones' },
      { key: 'activeDays', label: 'Días activos', target: 30, unit: 'días' },
      { key: 'prs', label: 'Récords personales', target: 5, unit: 'PRs' },
      { key: 'steps', label: 'Pasos acumulados', target: 110000, unit: 'pasos' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-04',
    title: 'Titán de Oro',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Silueta hercúlea en lingote áureo',
    icon: 'shield',
    loreQuote: 'El músculo denso y la fuerza suprema pertenecen a los titanes.',
    detail: '35 entrenamientos registrados y 25 días de racha activa.',
    points: 1400,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos', target: 35, unit: 'sesiones' },
      { key: 'nutrition', label: 'Comidas registradas', target: 25, unit: 'comidas' },
      { key: 'cardio', label: 'Cardio acumulado', target: 70, unit: 'min' },
      { key: 'streak', label: 'Racha activa', target: 25, unit: 'días' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-05',
    title: 'Rayo Fulgurante',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Relámpago hendiendo el escudo dorado',
    icon: 'zap',
    loreQuote: 'Poder explosivo y velocidad implacable en cada levantamiento.',
    detail: '6 PRs de fuerza y 40 entrenamientos de pura potencia.',
    points: 1500,
    objectives: [
      { key: 'prs', label: 'Récords de fuerza', target: 6, unit: 'PRs' },
      { key: 'workouts', label: 'Entrenamientos completados', target: 40, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos acumulados', target: 120000, unit: 'pasos' },
      { key: 'activeDays', label: 'Días activos', target: 40, unit: 'días' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-06',
    title: 'Maestría Nutricional',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Cáliz dorado con espiga de trigo',
    icon: 'coffee',
    loreQuote: 'Dominar la nutrición es dominar el destino biológico de tu cuerpo.',
    detail: '30 días de macros registrados y 42 sesiones de entrenamiento.',
    points: 1600,
    objectives: [
      { key: 'nutrition', label: 'Días con nutrición registrada', target: 30, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos', target: 42, unit: 'sesiones' },
      { key: 'streak', label: 'Racha activa', target: 28, unit: 'días' },
      { key: 'cardio', label: 'Cardio acumulado', target: 80, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-07',
    title: 'Corazón de Dragón',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Dragón enroscado en oro pulido',
    icon: 'heart',
    loreQuote: 'El fuego interno quema el cansancio y transforma el dolor en combustible.',
    detail: '90 minutos de cardio y 45 entrenamientos de alta intensidad.',
    points: 1700,
    objectives: [
      { key: 'cardio', label: 'Cardio acumulado', target: 90, unit: 'min' },
      { key: 'workouts', label: 'Entrenamientos', target: 45, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos acumulados', target: 140000, unit: 'pasos' },
      { key: 'activeDays', label: 'Días activos', target: 45, unit: 'días' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-08',
    title: 'Señor de la Disciplina',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Escudo heráldico con león dorado',
    icon: 'award',
    loreQuote: 'Un mes completo de perfección operativa en la dinastía.',
    detail: 'Racha de 30 días seguidos y 50 entrenamientos registrados.',
    points: 1850,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 30, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos completados', target: 50, unit: 'sesiones' },
      { key: 'nutrition', label: 'Comidas registradas', target: 35, unit: 'comidas' },
      { key: 'steps', label: 'Pasos acumulados', target: 160000, unit: 'pasos' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'golden-09',
    title: 'Dinastía Consagrada',
    tier: 'GOLDEN',
    tierLabel: 'Oro',
    tierColor: '#F59E0B',
    badgeConcept: 'Emblema BFD bañado en oro líquido',
    icon: 'star',
    loreQuote: 'Consagrado en el salón de la gloria de BodyFit Dynasty.',
    detail: '55 entrenamientos, 8 récords de fuerza y 100 min de cardio.',
    points: 2000,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 55, unit: 'sesiones' },
      { key: 'prs', label: 'Récords de fuerza', target: 8, unit: 'PRs' },
      { key: 'activeDays', label: 'Días activos', target: 50, unit: 'días' },
      { key: 'cardio', label: 'Cardio acumulado', target: 100, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },

  // ===================== 💎 DIAMOND (8 MEDALLAS) =====================
  {
    id: 'diamond-01',
    title: 'Bestia Mítica',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'Quimera de diamante resplandeciente',
    icon: 'shield',
    loreQuote: 'Una fuerza sobrenatural que desafía las leyes ordinarias de la fatiga.',
    detail: '60 entrenamientos y 40 días de racha activa.',
    points: 2600,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 60, unit: 'sesiones' },
      { key: 'streak', label: 'Racha activa', target: 40, unit: 'días' },
      { key: 'steps', label: 'Pasos acumulados', target: 180000, unit: 'pasos' },
      { key: 'cardio', label: 'Cardio acumulado', target: 110, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'diamond-02',
    title: 'Titán Eterno',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'Atlas sosteniendo el orbe de diamante',
    icon: 'globe',
    loreQuote: 'Carga el peso del mundo sobre sus hombros sin doblar las rodillas.',
    detail: '70 entrenamientos y 10 récords personales superados.',
    points: 2900,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 70, unit: 'sesiones' },
      { key: 'prs', label: 'Récords de fuerza', target: 10, unit: 'PRs' },
      { key: 'activeDays', label: 'Días activos', target: 65, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 45, unit: 'comidas' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'diamond-03',
    title: 'Voluntad Indestructible',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'Prisma de diamante puro indestructible',
    icon: 'disc',
    loreQuote: 'El diamante es la sustancia más dura del planeta; tu voluntad lo supera.',
    detail: 'Racha inquebrantable de 50 días y 80 entrenamientos.',
    points: 3200,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 50, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos', target: 80, unit: 'sesiones' },
      { key: 'steps', label: 'Pasos acumulados', target: 200000, unit: 'pasos' },
      { key: 'cardio', label: 'Cardio acumulado', target: 120, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'diamond-04',
    title: 'Fuerza Inmortal',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'Maza divina con incrustaciones diamantinas',
    icon: 'target',
    loreQuote: 'Tus marcas en la barra quedarán grabadas en la historia de la dinastía.',
    detail: '12 récords personales y 90 entrenamientos pesados.',
    points: 3500,
    objectives: [
      { key: 'prs', label: 'Récords de fuerza', target: 12, unit: 'PRs' },
      { key: 'workouts', label: 'Entrenamientos', target: 90, unit: 'sesiones' },
      { key: 'activeDays', label: 'Días activos', target: 80, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 55, unit: 'comidas' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'diamond-05',
    title: 'El Coloso',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'Coloso esculpido en roca y diamante',
    icon: 'user',
    loreQuote: 'Centenario de batallas. Una estatua colosal erigida con disciplina.',
    detail: '100 entrenamientos completados y racha de 60 días.',
    points: 3900,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 100, unit: 'sesiones' },
      { key: 'streak', label: 'Racha activa', target: 60, unit: 'días' },
      { key: 'steps', label: 'Pasos acumulados', target: 240000, unit: 'pasos' },
      { key: 'cardio', label: 'Cardio acumulado', target: 140, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'diamond-06',
    title: 'Señor del Olimpo',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'Trono celestial de diamante cian',
    icon: 'sun',
    loreQuote: 'Sentado en el trono más alto donde solo el 0.1% llega.',
    detail: '75 días de racha activa y 115 entrenamientos registrados.',
    points: 4300,
    objectives: [
      { key: 'streak', label: 'Racha activa', target: 75, unit: 'días' },
      { key: 'workouts', label: 'Entrenamientos completados', target: 115, unit: 'sesiones' },
      { key: 'nutrition', label: 'Comidas registradas', target: 70, unit: 'comidas' },
      { key: 'cardio', label: 'Cardio acumulado', target: 160, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'diamond-07',
    title: 'Ascensión Absoluta',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'Alas cósmicas de diamante resplandeciente',
    icon: 'send',
    loreQuote: 'Trascendencia pura. Has superado tus propios límites una y otra vez.',
    detail: '130 entrenamientos y 15 récords de fuerza.',
    points: 4700,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 130, unit: 'sesiones' },
      { key: 'prs', label: 'Récords de fuerza', target: 15, unit: 'PRs' },
      { key: 'steps', label: 'Pasos acumulados', target: 300000, unit: 'pasos' },
      { key: 'activeDays', label: 'Días activos', target: 100, unit: 'días' },
    ],
    requiredMajorityCount: 3,
  },
  {
    id: 'diamond-08',
    title: 'Dynasty Supreme',
    tier: 'DIAMOND',
    tierLabel: 'Diamante',
    tierColor: '#00E5FF',
    badgeConcept: 'El blasón definitivo de BodyFit Dynasty',
    icon: 'star',
    loreQuote: 'El máximo galardón del universo BodyFit Dynasty. Leyenda imperecedera.',
    detail: '150 entrenamientos y racha épica de 90 días ininterrumpidos.',
    points: 5000,
    objectives: [
      { key: 'workouts', label: 'Entrenamientos completados', target: 150, unit: 'sesiones' },
      { key: 'streak', label: 'Racha activa', target: 90, unit: 'días' },
      { key: 'nutrition', label: 'Comidas registradas', target: 85, unit: 'comidas' },
      { key: 'cardio', label: 'Cardio acumulado', target: 180, unit: 'min' },
    ],
    requiredMajorityCount: 3,
  },
];

/**
 * Motor de Evaluación por MAYORÍA Multi-Área
 * Si un usuario cumple la mayoría requerida (ej. 3 de 4 objetivos), la medalla se desbloquea.
 * No requiere el 100% de las métricas.
 */
export interface MedalEvaluationResult {
  isUnlocked: boolean;
  completedObjectivesCount: number;
  totalObjectivesCount: number;
  requiredMajorityCount: number;
  progressPercent: number;
  objectivesStatus: Array<{
    key: MedalObjective['key'];
    label: string;
    current: number;
    target: number;
    unit: string;
    met: boolean;
    percent: number;
  }>;
}

export function evaluateMedalProgress(
  medal: DynastyMedal,
  stats: DynastyUserStats
): MedalEvaluationResult {
  const objectivesStatus = medal.objectives.map((obj) => {
    const current = Math.max(0, stats[obj.key] ?? 0);
    const met = current >= obj.target;
    const percent = Math.min(100, Math.round((current / obj.target) * 100));
    return {
      key: obj.key,
      label: obj.label,
      current,
      target: obj.target,
      unit: obj.unit,
      met,
      percent,
    };
  });

  const completedObjectivesCount = objectivesStatus.filter((o) => o.met).length;
  const isUnlocked = completedObjectivesCount >= medal.requiredMajorityCount;
  const progressPercent = Math.min(
    100,
    Math.round((completedObjectivesCount / medal.requiredMajorityCount) * 100)
  );

  return {
    isUnlocked,
    completedObjectivesCount,
    totalObjectivesCount: medal.objectives.length,
    requiredMajorityCount: medal.requiredMajorityCount,
    progressPercent,
    objectivesStatus,
  };
}

export function getMedalsStats(unlockedMedalIds: string[]) {
  const total = DYNASTY_MEDALS_CATALOG.length;
  const unlocked = unlockedMedalIds.length;
  const bronzeTotal = DYNASTY_MEDALS_CATALOG.filter((m) => m.tier === 'BRONZE').length;
  const bronzeUnlocked = DYNASTY_MEDALS_CATALOG.filter(
    (m) => m.tier === 'BRONZE' && unlockedMedalIds.includes(m.id)
  ).length;

  const platinumTotal = DYNASTY_MEDALS_CATALOG.filter((m) => m.tier === 'PLATINUM').length;
  const platinumUnlocked = DYNASTY_MEDALS_CATALOG.filter(
    (m) => m.tier === 'PLATINUM' && unlockedMedalIds.includes(m.id)
  ).length;

  const goldenTotal = DYNASTY_MEDALS_CATALOG.filter((m) => m.tier === 'GOLDEN').length;
  const goldenUnlocked = DYNASTY_MEDALS_CATALOG.filter(
    (m) => m.tier === 'GOLDEN' && unlockedMedalIds.includes(m.id)
  ).length;

  const diamondTotal = DYNASTY_MEDALS_CATALOG.filter((m) => m.tier === 'DIAMOND').length;
  const diamondUnlocked = DYNASTY_MEDALS_CATALOG.filter(
    (m) => m.tier === 'DIAMOND' && unlockedMedalIds.includes(m.id)
  ).length;

  const totalPoints = DYNASTY_MEDALS_CATALOG.reduce((acc, m) => {
    return unlockedMedalIds.includes(m.id) ? acc + m.points : acc;
  }, 0);

  return {
    total,
    unlocked,
    bronzeTotal,
    bronzeUnlocked,
    platinumTotal,
    platinumUnlocked,
    goldenTotal,
    goldenUnlocked,
    diamondTotal,
    diamondUnlocked,
    totalPoints,
  };
}
