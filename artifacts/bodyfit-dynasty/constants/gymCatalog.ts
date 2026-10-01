export type GymLevel = {
  id: string;
  name: string;
  timeRange: string;
  description: string;
};

export const GYM_LEVELS: GymLevel[] = [
  {
    id: 'amateur',
    name: 'Principiante / Novato',
    timeRange: '0 - 6 meses',
    description: 'Aprendiendo técnica básica, creando el hábito y acondicionando el cuerpo.',
  },
  {
    id: 'intermediate',
    name: 'Intermedio / Constante',
    timeRange: '6 meses - 1.5 años',
    description: 'Entrenando con rutina estructurada, sobrecarga progresiva y buena constancia.',
  },
  {
    id: 'advanced',
    name: 'Avanzado / Dedicado',
    timeRange: '1.5 - 3 años',
    description: 'Dominio de intensidad, control de macros, periodización y técnica pulida.',
  },
  {
    id: 'pro',
    name: 'Pro / Culturista',
    timeRange: '3 - 5+ años',
    description: 'Entrenamientos pesados de hipertrofia, acondicionamiento y enfoque competitivo.',
  },
  {
    id: 'elite',
    name: 'Atleta Élite / Maestro de la Fuerza',
    timeRange: '5+ años',
    description: 'Rendimiento y fuerza máxima, estándar de élite y máxima disciplina.',
  },
];

export const SPORT_DISCIPLINES = [
  'Gimnasio / Musculación',
  'Calistenia / Gimnasia',
  'Basketball',
  'Yoga',
  'Pilates',
  'Ciclismo / Spinning',
  'Natación',
  'Boxeo / Artes Marciales',
  'Running / Atletismo',
  'CrossFit / Funcional',
  'Fútbol',
] as const;

export const MACRO_OPTIONS = [
  { id: 'protein', name: 'Proteína', detail: 'Construcción y recuperación muscular' },
  { id: 'calories', name: 'Calorías Totales', detail: 'Control de déficit o superávit calórico' },
  { id: 'carbs', name: 'Carbohidratos', detail: 'Combustible y energía de alta intensidad' },
  { id: 'fats', name: 'Grasas Saludables', detail: 'Salud hormonal y absorción de nutrientes' },
] as const;

export type MuscleGroupCatalog = {
  id: string;
  name: string;
  iconName: string;
  items: Array<{
    id: string;
    name: string;
    type: 'machine' | 'free_weight' | 'cable';
  }>;
};

export const GYM_MACHINES_CATALOG: MuscleGroupCatalog[] = [
  {
    id: 'chest',
    name: 'Pecho',
    iconName: 'shield',
    items: [
      { id: 'bench_press', name: 'Press de banca plano con barra', type: 'free_weight' },
      { id: 'incline_dumbbells', name: 'Press inclinado con mancuernas', type: 'free_weight' },
      { id: 'peck_deck', name: 'Peck Deck / Aperturas en máquina', type: 'machine' },
      { id: 'cable_crossover', name: 'Cruce de poleas (Cables cruzados)', type: 'cable' },
      { id: 'hammer_chest', name: 'Press de pecho en máquina Hammer', type: 'machine' },
      { id: 'parallel_dips', name: 'Fondos en paralelas (Dips)', type: 'free_weight' },
    ],
  },
  {
    id: 'back',
    name: 'Espalda',
    iconName: 'layers',
    items: [
      { id: 'lat_pulldown', name: 'Jalón al pecho en polea (Lat Pulldown)', type: 'cable' },
      { id: 'barbell_row', name: 'Remo con barra olímpica', type: 'free_weight' },
      { id: 'hammer_row', name: 'Remo en máquina de placas / Hammer', type: 'machine' },
      { id: 'seated_cable_row', name: 'Remo en polea baja (Gironda)', type: 'cable' },
      { id: 'pullups', name: 'Dominadas libres o asistidas', type: 'free_weight' },
      { id: 'cable_pullover', name: 'Pull-over en polea alta con cuerda', type: 'cable' },
    ],
  },
  {
    id: 'shoulders',
    name: 'Hombro',
    iconName: 'target',
    items: [
      { id: 'smith_overhead_press', name: 'Press militar en máquina Smith', type: 'machine' },
      { id: 'dumbbell_lateral_raises', name: 'Elevaciones laterales con mancuernas', type: 'free_weight' },
      { id: 'cable_lateral_raises', name: 'Elevaciones laterales en polea baja', type: 'cable' },
      { id: 'reverse_peck_deck', name: 'Pájaros en máquina posterior (Reverse Pec Deck)', type: 'machine' },
      { id: 'face_pulls', name: 'Face Pull con cuerda en polea', type: 'cable' },
      { id: 'arnold_press', name: 'Press Arnold con mancuernas', type: 'free_weight' },
    ],
  },
  {
    id: 'biceps',
    name: 'Bíceps',
    iconName: 'zap',
    items: [
      { id: 'scott_preacher_curl', name: 'Curl con barra Z en banco Scott (Predicador)', type: 'machine' },
      { id: 'incline_dumbbell_curl', name: 'Curl alterno con mancuernas', type: 'free_weight' },
      { id: 'cable_rope_hammer_curl', name: 'Curl martillo con cuerda en polea', type: 'cable' },
      { id: 'straight_bar_cable_curl', name: 'Curl en polea baja con barra recta', type: 'cable' },
      { id: 'concentration_curl', name: 'Curl concentrado a una mano', type: 'free_weight' },
    ],
  },
  {
    id: 'triceps',
    name: 'Tríceps',
    iconName: 'crosshair',
    items: [
      { id: 'tricep_rope_pushdown', name: 'Extensión de tríceps en polea con cuerda', type: 'cable' },
      { id: 'french_press_barbell', name: 'Press francés con barra Z', type: 'free_weight' },
      { id: 'assisted_dip_machine', name: 'Fondos en máquina de tríceps asistida', type: 'machine' },
      { id: 'overhead_katana_cable', name: 'Extensión Katana unilateral en polea', type: 'cable' },
      { id: 'close_grip_bench_press', name: 'Press de banca cerrado', type: 'free_weight' },
    ],
  },
  {
    id: 'quads',
    name: 'Cuádriceps',
    iconName: 'activity',
    items: [
      { id: 'leg_press_45', name: 'Prensa de piernas 45°', type: 'machine' },
      { id: 'leg_extension_machine', name: 'Máquina de extensiones de cuádriceps', type: 'machine' },
      { id: 'hack_squat_machine', name: 'Hack Squat (Sentadilla Hack en máquina)', type: 'machine' },
      { id: 'barbell_back_squat', name: 'Sentadilla libre con barra trasera', type: 'free_weight' },
      { id: 'bulgarian_split_smith', name: 'Sentadilla búlgara en máquina Smith', type: 'machine' },
    ],
  },
  {
    id: 'hamstrings',
    name: 'Isquiotibiales (Femoral)',
    iconName: 'compass',
    items: [
      { id: 'lying_leg_curl', name: 'Femoral tumbado en máquina (Lying Leg Curl)', type: 'machine' },
      { id: 'seated_leg_curl', name: 'Femoral sentado en máquina (Seated Leg Curl)', type: 'machine' },
      { id: 'romanian_deadlift', name: 'Peso muerto rumano con mancuernas o barra', type: 'free_weight' },
    ],
  },
  {
    id: 'glutes',
    name: 'Glúteos',
    iconName: 'star',
    items: [
      { id: 'hip_thrust_machine', name: 'Hip Thrust en máquina o barra', type: 'machine' },
      { id: 'cable_glute_kickback', name: 'Patada de glúteo en polea con tobillera', type: 'cable' },
      { id: 'seated_abductor_machine', name: 'Máquina de abductores sentada', type: 'machine' },
      { id: 'sumo_deadlift', name: 'Sentadilla Sumo pesada', type: 'free_weight' },
    ],
  },
  {
    id: 'calves',
    name: 'Pantorrillas',
    iconName: 'trending-up',
    items: [
      { id: 'standing_calf_raise', name: 'Elevación de talones de pie en máquina', type: 'machine' },
      { id: 'seated_calf_raise', name: 'Gemelos sentado en máquina (Costurera)', type: 'machine' },
      { id: 'leg_press_calf_raise', name: 'Elevación de pantorrillas en prensa 45°', type: 'machine' },
    ],
  },
  {
    id: 'core',
    name: 'Core / Abdomen',
    iconName: 'circle',
    items: [
      { id: 'cable_kneeling_crunch', name: 'Crunch en polea alta con cuerda', type: 'cable' },
      { id: 'machine_ab_crunch', name: 'Máquina de crunch abdominal con placas', type: 'machine' },
      { id: 'hanging_leg_raises', name: 'Elevación de piernas en torre romana', type: 'free_weight' },
      { id: 'weighted_plank', name: 'Plancha isométrica con sobrecarga', type: 'free_weight' },
    ],
  },
];

export interface SilhouetteAvatar {
  id: string;
  label: string;
  uri: string;
}

export const DEFAULT_SILHOUETTES: SilhouetteAvatar[] = [
  {
    id: 'female_athlete',
    label: 'Atleta Mujer',
    uri: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'female_glutes',
    label: 'Fitness Glúteo',
    uri: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'male_athlete',
    label: 'Atleta Hombre',
    uri: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&auto=format&fit=crop&q=80',
  },
  {
    id: 'dynasty_emperor',
    label: 'Corona Gold',
    uri: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&auto=format&fit=crop&q=80',
  },
];

export const FITNESS_AVATARS = DEFAULT_SILHOUETTES.map((s) => s.uri);

export const APP_THEMES = [
  { key: 'purple', name: 'Morado Dynasty (Oficial)', hex: '#A855F7' },
  { key: 'amber', name: 'Oro BFD Real', hex: '#F59E0B' },
  { key: 'crimson', name: 'Carmesí Fuego', hex: '#EF4444' },
  { key: 'ocean', name: 'Azul Cyber', hex: '#3B82F6' },
  { key: 'neon', name: 'Verde Neón', hex: '#10B981' },
  { key: 'graphite', name: 'Negro Grafito', hex: '#71717A' },
  { key: 'rose', name: 'Rosa Titán', hex: '#EC4899' },
  { key: 'ice', name: 'Hielo Glacial', hex: '#06B6D4' },
] as const;
