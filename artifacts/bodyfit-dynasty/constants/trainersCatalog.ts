/**
 * Catálogo Oficial de Entrenadores Designados - BodyFit Dynasty ®
 * Módulo de Atención 24/7 exclusivo para usuarios Golden VIP.
 */

export interface Trainer {
  id: string;
  name: string;
  title: string;
  role: string;
  specialties: string[];
  avatarUrl: string;
  status: 'online' | 'busy' | 'offline';
  statusText: string;
  responseTime: string;
  experienceYears: number;
  bio: string;
  certifications: string[];
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'trainer' | 'system';
  trainerId?: string;
  text: string;
  timestamp: number;
  category?: 'training' | 'routine' | 'nutrition' | 'progress' | 'app';
}

export const DESIGNATED_TRAINERS: Trainer[] = [
  {
    id: 'coach-esteban',
    name: 'Coach Esteban',
    title: 'Head Coach & Fundador Dynasty',
    role: 'Máster en Biomecánica & Fuerza',
    specialties: ['Biomecánica aplicada', 'Sobrecarga progresiva', 'Diseño de rutinas', 'Powerbuilding'],
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: '🟢 En línea 24/7',
    responseTime: '< 3 min',
    experienceYears: 10,
    bio: 'Especialista en desarrollo muscular máximo sin lesiones. Mentor de cientos de atletas en BodyFit Dynasty.',
    certifications: ['CSCS - NSCA', 'Máster en Biomecánica Muscular', 'Especialista en Hipertrofia'],
  },
  {
    id: 'coach-valeria',
    name: 'Coach Valeria',
    title: 'Coach Élite Dynasty',
    role: 'Especialista en Glúteo & Recomposición',
    specialties: ['Hipertrofia de tren inferior', 'Recomposición corporal', 'Técnica de ejecución'],
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: '🟢 En línea 24/7',
    responseTime: '< 5 min',
    experienceYears: 7,
    bio: 'Enfocada en optimizar vectores de fuerza y curvas de resistencia para maximizar el desarrollo muscular femenino y masculino.',
    certifications: ['ISSA Certified Elite Trainer', 'Especialista en Glúteos y Cadera'],
  },
  {
    id: 'coach-carlos',
    name: 'Coach Carlos',
    title: 'Preparador Físico Élite',
    role: 'Fuerza, Potencia & Nutrición Deportiva',
    specialties: ['Periodización deportiva', 'Nutrición para hipertrofia', 'Movilidad & Longevidad'],
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    status: 'online',
    statusText: '🟢 En línea 24/7',
    responseTime: '< 5 min',
    experienceYears: 8,
    bio: 'Apasionado por la ciencia del rendimiento. Ayuda a los atletas Golden a sincronizar entrenamiento, macros y descanso.',
    certifications: ['ISSN Sports Nutritionist', 'FMS Nivel 2', 'Entrenamiento Funcional Avanzado'],
  },
];

export const QUICK_PROMPTS = [
  '¿Cómo optimizo mi técnica en sentadilla?',
  '¿Cuántas series por grupo muscular me recomiendas?',
  '¿Cómo puedo superar un estancamiento en press banca?',
  '¿Qué comer antes y después de entrenar para hipertrofia?',
  '¿Cómo divido mis días de rutina personalizada?',
];

export const TRAINER_DISCLAIMER =
  'Atención de orientación deportiva, técnica y de acondicionamiento físico brindada por entrenadores certificados de BodyFit Dynasty ®. No constituye diagnóstico ni asesoramiento médico.';

/**
 * Generador de respuesta inteligente y contextual para simulación 24/7
 */
export function generateTrainerResponse(
  userMessage: string,
  trainer: Trainer,
  userName?: string
): string {
  const nameGreeting = userName ? `Hola ${userName}` : '¡Hola, atleta!';
  const lower = userMessage.toLowerCase();

  if (lower.includes('sentadilla') || lower.includes('squat') || lower.includes('pierna')) {
    return `${nameGreeting}. Para la sentadilla te recomiendo enfocar en tres claves biomecánicas: 1) Mantén el trípode del pie firme (talón, base del primer y quinto metatarso), 2) Inicia el descenso abriendo rodillas en la misma dirección de la punta de tus pies, y 3) Mantén la columna neutra con la respiración diafragmática (maniobra de Valsalva). Si sientes tensión en lumbares, eleva ligeramente los talones o trabaja movilidad de tobillo. ¡La técnica manda sobre el peso! 💪`;
  }

  if (lower.includes('serie') || lower.includes('volumen') || lower.includes('repeticion') || lower.includes('reps')) {
    return `${nameGreeting}. La evidencia científica actual demuestra que entre 10 y 20 series efectivas semanales por grupo muscular cercano al fallo (RIR 1-2) es el rango óptimo de hipertrofia. Para tu rutina en BodyFit Dynasty, te sugiero 3 o 4 series por ejercicio con 2-3 minutos de descanso en ejercicios compuestos. ¡Calidad de contracción antes que fatiga innecesaria!`;
  }

  if (lower.includes('press') || lower.includes('pecho') || lower.includes('banca') || lower.includes('estanc')) {
    return `${nameGreeting}. Para romper estancamientos en empujes: 1) Asegura una retracción escapular sólida antes de sacar la barra, 2) Trabaja la porción estirada con una pausa de 1 segundo en el pecho, y 3) Fortalece los tríceps (cabeza lateral y medial) con fondos o pushdowns pesados. Recuerda que en Dynasty puedes alternar con mancuernas para mayor rango articular.`;
  }

  if (lower.includes('comer') || lower.includes('comida') || lower.includes('nutricion') || lower.includes('macro') || lower.includes('proteina')) {
    return `${nameGreeting}. Estrategia de nutrición Dynasty: Pre-entreno (1.5-2 horas antes): carbohidratos complejos de fácil digestión (avena, arroz) más 25-30g de proteína magra. Post-entreno: 30-40g de proteína de rápida asimilación (como whey ISO o claras con pollo) y carbohidratos para reponer glucógeno. En el módulo de Recetas tienes 200 opciones escalonadas ideales para tu meta.`;
  }

  if (lower.includes('rutina') || lower.includes('dia') || lower.includes('personaliz') || lower.includes('division')) {
    return `${nameGreeting}. Excelente consulta. Tu regla oficial en BodyFit Dynasty te permite hasta 3 ejercicios por grupo muscular. La mejor división depende de tus días disponibles: Si entrenas 4 días, la división Torso/Pierna es letal. Si tienes 5 o 6 días, la división Empuje / Tracción / Pierna (PPL) te dará una frecuencia 2 insuperable con recuperación garantizada.`;
  }

  // Respuesta general de apoyo Dynasty
  return `${nameGreeting}. Un placer asistirte como atleta Golden VIP de BodyFit Dynasty ®. Analizando tu consulta: el pilar fundamental es la sobrecarga progresiva controlada y la consistencia en tu racha diaria. Concéntrate en registrar tus cargas en cada sesión y mantener tu rango de movimiento limpio. Si necesitas que revisemos un ejercicio específico de tu catálogo, indícamelo y lo estructuramos de inmediato. ¡A romper marcas hoy! ⚡`;
}
