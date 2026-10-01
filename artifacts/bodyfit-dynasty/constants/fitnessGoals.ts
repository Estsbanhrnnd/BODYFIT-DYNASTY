export interface FitnessFocusOption {
  id: string;
  name: string;
  shortName: string;
  icon: string;
  emoji: string;
  description: string;
  badge: string;
  cardioAdvice?: {
    title: string;
    protocol: string;
    coreTip: string;
    duration: string;
    intervals: string;
  };
}

export const FITNESS_FOCUS_OPTIONS: FitnessFocusOption[] = [
  {
    id: 'hipertrofia',
    name: 'Hipertrofia',
    shortName: 'Hipertrofia',
    icon: 'activity',
    emoji: '🏋️',
    description: 'Tensión mecánica y volumen óptimo de series (8-12 reps) para desarrollo muscular magro sostenido.',
    badge: 'Masa Muscular',
  },
  {
    id: 'gluteos_piernas',
    name: 'Glúteo y Pierna',
    shortName: 'Glúteos & Pierna',
    icon: 'target',
    emoji: '🍑',
    description: 'Especialización en tren inferior: 2 días intensivos de pierna/glúteo con 48 a 72 horas de recuperación biológica.',
    badge: 'Tren Inferior (2 Días)',
  },
  {
    id: 'estetica',
    name: 'Estética',
    shortName: 'Estética V-Taper',
    icon: 'award',
    emoji: '✨',
    description: 'Proporciones visuales clásicas: cintura estrecha, deltoides laterales redondos y densidad en espalda alta.',
    badge: 'Proporciones & Silueta',
  },
  {
    id: 'definicion',
    name: 'Definición y Tonificación',
    shortName: 'Definición & Tono',
    icon: 'zap',
    emoji: '🔥',
    description: 'Déficit controlado, cortes musculares profundos y aceleración metabólica con cardio fraccionado de alta intensidad.',
    badge: 'Quema Calórica + HIIT',
    cardioAdvice: {
      title: 'Protocolo Cardio HIIT Dynasty (Core & Metabolismo)',
      protocol: '2 minutos a velocidad regular (zona 2 aeróbica) + 1 minuto de sprint intenso, repetido sucesivamente.',
      coreTip: 'Mantén la pelvis neutra y el abdomen contraído (bracing) en cada sprint para tonificar el core mientras aceleras el metabolismo.',
      duration: '15 a 20 minutos totales al finalizar tu rutina o en ayunas.',
      intervals: '🟢 2 min Trote Regular / 🔴 1 min Sprint Intenso',
    },
  },
  {
    id: 'fuerza',
    name: 'Fuerza y Atlético',
    shortName: 'Fuerza & Rendimiento',
    icon: 'shield',
    emoji: '⚡',
    description: 'Potencia explosiva y levantamientos pesados (RPE 8-9) en ejercicios multiarticulares con descansos amplios.',
    badge: 'Fuerza & Potencia',
  },
  {
    id: 'volumen',
    name: 'Volumen',
    shortName: 'Volumen Anabólico',
    icon: 'trending-up',
    emoji: '💥',
    description: 'Superávit anabólico progresivo, series pesadas efectivas y sobrecarga constante para maximizar el tamaño corporal.',
    badge: 'Superávit & Carga Pesada',
  },
];

/**
 * Retorna la información del enfoque o el por defecto (Hipertrofia)
 */
export function getFitnessFocus(id?: string | null): FitnessFocusOption {
  if (!id) return FITNESS_FOCUS_OPTIONS[0];
  const found = FITNESS_FOCUS_OPTIONS.find(
    (f) => f.id === id || f.name.toLowerCase() === id.toLowerCase() || f.shortName.toLowerCase() === id.toLowerCase()
  );
  return found || FITNESS_FOCUS_OPTIONS[0];
}

/**
 * Protocolo de cardio interválico oficial Dynasty para core y metabolismo
 */
export const DYNASTY_CARDIO_PROTOCOL = {
  title: 'Protocolo Cardio HIIT Dynasty · Core & Metabolismo',
  subtitle: 'Acelerador de Grasa & Estabilización de Core en Intervalos 2x1',
  summary:
    'Estructura fraccionada de alta eficiencia: combina intervalos de 2 minutos a ritmo regular continuo con 1 minuto de máxima intensidad para elevar la tasa metabólica (EPOC) y quemar calorías hasta 24 horas después, mientras el bracing abdominal tonifica la cintura.',
  intervals: [
    {
      phase: 'Recuperación Activa Aeróbica',
      duration: '2 Minutos',
      speed: 'Velocidad regular / trote moderado',
      color: '#2ED573',
      icon: 'wind',
      detail: 'Mantiene las pulsaciones en zona 2 (60-70% FC máx) y prepara el cuerpo para el siguiente pico de esfuerzo.',
    },
    {
      phase: 'Sprint de Máxima Intensidad',
      duration: '1 Minuto',
      speed: 'Velocidad máxima / sprint o alta inclinación',
      color: '#FF4757',
      icon: 'zap',
      detail: 'Disparo glucolítico. Contrae fuertemente el abdomen (brace abdominal) para fijar el core y evitar oscilación pélvica.',
    },
  ],
  structure: 'Repetir de 5 a 6 ciclos continuos (15 a 20 minutos en total) al terminar la sesión de pesas.',
  coreActivationNote:
    '💡 Consejo de Técnica: En cada sprint de 1 minuto, aprieta el abdomen como si fueras a recibir un impacto, braceando el core y manteniendo el pecho erguido.',
};
