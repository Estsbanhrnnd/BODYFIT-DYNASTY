import type { Exercise } from './muscleCategories';

export interface ExerciseVariantChip {
  label: string;
  exercise: Exercise;
}

export interface ExerciseFamily {
  id: string;
  familyName: string;
  subfocus: string;
  target: string;
  time: string;
  imageUrl?: string;
  defaultExercise: Exercise;
  variants: Exercise[];
  equipmentList: string[];
}

/**
 * Normaliza el nombre de un ejercicio al nombre base de su familia fundamental
 */
export function getExerciseFamilyName(name: string): string {
  const lower = name.toLowerCase().trim();

  // Pecho
  if (lower.startsWith('press inclinado')) return 'Press Inclinado';
  if (
    lower.startsWith('press plano') ||
    (lower.startsWith('press ') &&
      !lower.includes('militar') &&
      !lower.includes('cerrado') &&
      !lower.includes('declinado') &&
      !lower.includes('inclinado') &&
      !lower.includes('hombro') &&
      !lower.includes('arnold') &&
      !lower.includes('banca'))
  ) {
    return 'Press Plano';
  }
  if (lower.startsWith('press declinado')) return 'Press Declinado';
  if (lower.startsWith('aperturas inclinadas')) return 'Aperturas Inclinadas';
  if (lower.startsWith('aperturas') || lower.includes('pec deck')) return 'Aperturas / Pec Deck';
  if (lower.startsWith('fondos para pecho') || (lower.startsWith('fondos') && lower.includes('pecho'))) return 'Fondos para Pecho';
  if (lower.startsWith('cruce de poleas')) return 'Cruce de Poleas';
  if (lower.startsWith('flexiones')) return 'Flexiones de Pecho';

  // Espalda
  if (lower.startsWith('dominadas')) return 'Dominadas';
  if (lower.startsWith('jalón') || lower.startsWith('jalon')) return 'Jalón al Pecho';
  if (lower.startsWith('pullover')) return 'Pullover';
  if (lower.startsWith('remo')) return 'Remo para Espalda';
  if (lower.startsWith('encogimientos')) return 'Encogimientos Trapecio';
  if (lower.startsWith('peso muerto') && lower.includes('rumano')) return 'Peso Muerto Rumano';
  if (lower.startsWith('peso muerto')) return 'Peso Muerto';
  if (lower.startsWith('hiperextensiones') || lower.includes('extensión lumbar') || lower.includes('extension lumbar')) {
    return 'Hiperextensiones / Lumbares';
  }
  if (lower.includes('bird dog') || lower.includes('superman')) return 'Erectores Espinales Suelo';

  // Hombros
  if (lower.startsWith('press militar') || lower.includes('arnold') || (lower.startsWith('press ') && lower.includes('hombro'))) {
    return 'Press Militar / Hombro';
  }
  if (lower.startsWith('elevaciones laterales') || lower.startsWith('elevación lateral') || lower.includes('elevacion lateral')) {
    return 'Elevaciones Laterales';
  }
  if (lower.startsWith('elevaciones frontales') || lower.startsWith('elevación frontal') || lower.includes('elevacion frontal')) {
    return 'Elevaciones Frontales';
  }
  if (
    lower.startsWith('pájaros') ||
    lower.startsWith('pajaros') ||
    lower.includes('reverse pec deck') ||
    lower.includes('deltoide posterior') ||
    lower.includes('elevación posterior')
  ) {
    return 'Pájaros / Deltoide Posterior';
  }
  if (lower.includes('face pull')) return 'Face Pull';

  // Bíceps
  if (lower.startsWith('curl predicador') || lower.includes('spider') || lower.includes('concentrado')) {
    return 'Curl Predicador / Aislamiento';
  }
  if (lower.startsWith('curl martillo') || lower.startsWith('curl inverso')) return 'Curl Martillo & Braquial';
  if (lower.startsWith('curl inclinado') || lower.includes('bayesian') || lower.includes('drag curl')) {
    return 'Curl Cabeza Larga';
  }
  if (lower.startsWith('curl')) return 'Curl de Bíceps';

  // Tríceps
  if (
    lower.startsWith('extensión sobre la cabeza') ||
    lower.startsWith('extension sobre la cabeza') ||
    lower.includes('francés') ||
    lower.includes('frances')
  ) {
    return 'Extensiones sobre la Cabeza';
  }
  if (lower.startsWith('pushdown')) return 'Pushdown de Tríceps';
  if (lower.startsWith('press cerrado')) return 'Press Cerrado';
  if (lower.startsWith('fondos en paralelas') || (lower.startsWith('fondos') && !lower.includes('pecho'))) {
    return 'Fondos de Tríceps';
  }
  if (lower.startsWith('patada de tríceps') || lower.startsWith('patada de triceps') || lower.startsWith('patada en polea')) {
    return 'Patada de Tríceps';
  }

  // Piernas
  if (
    lower.startsWith('sentadilla') &&
    !lower.includes('sumo') &&
    !lower.includes('búlgara') &&
    !lower.includes('bulgarian') &&
    !lower.includes('split')
  ) {
    return 'Sentadilla';
  }
  if (lower.startsWith('prensa')) return 'Prensa de Piernas';
  if (lower.startsWith('extensión de piernas') || lower.startsWith('extension de piernas') || lower.includes('extensión de rodilla')) {
    return 'Extensión de Cuádriceps';
  }
  if (lower.includes('split squat') || lower.includes('zancada') || lower.includes('step-up')) {
    return 'Zancadas & Split Squat';
  }
  if (lower.startsWith('curl femoral')) return 'Curl Femoral';
  if (lower.startsWith('hip thrust') || lower.includes('glute bridge')) return 'Hip Thrust & Puentes';
  if (lower.startsWith('patada de glúteo') || lower.startsWith('patada de gluteo') || (lower.startsWith('patada') && lower.includes('glúteo'))) {
    return 'Patada de Glúteo';
  }
  if (lower.includes('abducción') || lower.includes('abduccion') || lower.includes('abductor') || lower.includes('clamshell')) {
    return 'Abducción de Cadera';
  }
  if (lower.includes('aducción') || lower.includes('aduccion') || lower.includes('aductor') || lower.includes('copenhagen')) {
    return 'Aducción de Cadera';
  }
  if (lower.startsWith('elevación de talones de pie') || lower.includes('donkey') || lower.includes('calf press')) {
    return 'Elevación de Talones de Pie';
  }
  if (lower.startsWith('elevación de talones sentado') || lower.includes('seated calf') || lower.includes('sentado con')) {
    return 'Elevación de Talones Sentado';
  }

  // Core
  if (lower.startsWith('crunch') || lower.startsWith('sit-up') || lower.startsWith('v-ups')) {
    return 'Crunch & Flexiones Abdominales';
  }
  if (lower.startsWith('elevación de piernas') || lower.startsWith('elevación de rodillas') || lower.includes('elevacion de pierna')) {
    return 'Elevación de Piernas';
  }
  if (lower.startsWith('plancha') || lower.includes('plank') || lower.includes('hollow body') || lower.includes('isometría')) {
    return 'Planchas & Isometría';
  }
  if (lower.includes('twist') || lower.includes('woodchopper') || lower.includes('side bend')) {
    return 'Rotaciones & Oblicuos';
  }

  return name;
}

/**
 * Extrae la etiqueta de variante legible para un botón pill (ej. "Barra", "Mancuernas", "Máquina", "Smith", "Polea", "Agarre Neutro")
 */
export function extractVariantLabel(exerciseName: string, familyName: string): string {
  const lower = exerciseName.toLowerCase();

  if (lower.includes('con barra') || lower.includes('barra recta')) return 'Barra';
  if (lower.includes('barra ez') || lower.includes('ez')) return 'Barra EZ';
  if (lower.includes('con mancuernas') || lower.includes('con mancuerna')) return 'Mancuernas';
  if (lower.includes('en máquina') || lower.includes('en maquina') || lower.includes('hammer strength')) return 'Máquina';
  if (lower.includes('en smith') || lower.includes('smith')) return 'Smith';
  if (lower.includes('en polea') || lower.includes('con polea') || lower.includes('con cuerda')) return 'Polea';
  if (lower.includes('agarre neutro')) return 'Agarre Neutro';
  if (lower.includes('agarre pronado')) return 'Agarre Pronado';
  if (lower.includes('agarre supino')) return 'Agarre Supino';
  if (lower.includes('agarre amplio')) return 'Agarre Amplio';
  if (lower.includes('agarre cerrado') || lower.includes('agarre estrecho')) return 'Agarre Cerrado';
  if (lower.includes('unilateral')) return 'Unilateral';
  if (lower.includes('asistidas') || lower.includes('asistido')) return 'Asistido';
  if (lower.includes('peso corporal') || lower.includes('libre')) return 'Corporal';
  if (lower.includes('con banda') || lower.includes('banda')) return 'Banda';

  // Si no coincide con las palabras clave anteriores, limpiar el nombre familiar
  const clean = exerciseName.replace(new RegExp(familyName, 'gi'), '').trim();
  if (clean.length > 0 && clean.length < 24) {
    return clean.replace(/^(con|en|de)\s+/i, '');
  }

  return exerciseName;
}

/**
 * Agrupa una lista de ejercicios en familias con sus respectivas variantes
 */
export function groupExercisesIntoFamilies(exercises: Exercise[]): ExerciseFamily[] {
  const map = new Map<string, Exercise[]>();

  exercises.forEach((ex) => {
    const familyName = getExerciseFamilyName(ex.name);
    if (!map.has(familyName)) {
      map.set(familyName, []);
    }
    map.get(familyName)!.push(ex);
  });

  const families: ExerciseFamily[] = [];

  map.forEach((variantList, familyName) => {
    const first = variantList[0];
    const equipmentSet = new Set<string>();
    variantList.forEach((v) => {
      if (v.equipment) equipmentSet.add(v.equipment);
    });

    families.push({
      id: `fam-${familyName.toLowerCase().replace(/[^a-z0-9]/g, '-')}`,
      familyName,
      subfocus: first.subfocus,
      target: first.target,
      time: first.time,
      imageUrl: first.imageUrl,
      defaultExercise: first,
      variants: variantList,
      equipmentList: Array.from(equipmentSet),
    });
  });

  return families;
}
