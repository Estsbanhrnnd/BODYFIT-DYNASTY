import { RAW_CATALOG_EXERCISES, type CatalogExercise, type MuscleGroupId } from './exerciseCatalog';
import { hasTierAccess, type MembershipTierId } from './membershipConfig';
import type { CustomRoutineDay } from '@/context/BodyFitContext';

export interface SuggestedExercise extends CatalogExercise {
  targetSets: number;
  targetReps: string;
  restSeconds: number;
}

export interface SuggestedRoutineDay extends CustomRoutineDay {
  exercises: SuggestedExercise[];
}

export interface LevelGuidance {
  levelTitle: string;
  recommendedSets: string;
  recommendedReps: string;
  restTime: string;
  focusNotes: string;
}

export interface SuggestedRoutine {
  title: string;
  subtitle: string;
  description: string;
  focusGoal: string;
  levelLabel: string;
  locationLabel: string;
  daysPerWeek: number;
  guidance: LevelGuidance;
  trainerDisclaimer: string;
  days: SuggestedRoutineDay[];
  allExerciseIds: string[];
  cardioRecommendation?: {
    title: string;
    protocol: string;
    coreTip: string;
    intervals: string;
    duration: string;
  };
}

export interface SuggestionParams {
  location?: 'gym' | 'home';
  fitnessLevel?: string | null;
  fitnessGoal?: string | null;
  gender?: string | null;
  membership?: MembershipTierId;
  daysCount?: 3 | 4 | 5 | 6;
}

/**
 * Filtra los ejercicios que el usuario tiene desbloqueados en su nivel de membresía
 * y que son aptos para el entorno elegido (Gimnasio o Casa).
 */
function getEligibleExercises(
  location: 'gym' | 'home',
  membership: MembershipTierId = 'standard'
): CatalogExercise[] {
  return RAW_CATALOG_EXERCISES.filter((ex) => {
    // 1. Validar nivel de membresía
    if (!hasTierAccess(membership, ex.requiredTier)) return false;

    // 2. Validar entorno
    if (location === 'home') {
      const equip = ex.equipment.toLowerCase();
      return (
        equip.includes('peso corporal') ||
        equip.includes('banda') ||
        equip.includes('mancuerna') ||
        equip.includes('suelo') ||
        equip.includes('libre')
      );
    }
    // Gimnasio: acceso a todo lo que esté desbloqueado
    return true;
  });
}

function decorateExerciseWithSetsReps(
  ex: CatalogExercise,
  isBeginner: boolean,
  isAdvanced: boolean
): SuggestedExercise {
  const isCompound = ex.movementType === 'Compuesto';

  if (isBeginner) {
    return {
      ...ex,
      targetSets: 3,
      targetReps: isCompound ? '10 - 12 reps' : '12 - 15 reps',
      restSeconds: 90,
    };
  }

  if (isAdvanced) {
    return {
      ...ex,
      targetSets: 4,
      targetReps: isCompound ? '6 - 8 reps pesadas' : '10 - 12 reps',
      restSeconds: isCompound ? 120 : 60,
    };
  }

  // Intermedio por defecto
  return {
    ...ex,
    targetSets: isCompound ? 4 : 3,
    targetReps: isCompound ? '8 - 10 reps' : '10 - 12 reps',
    restSeconds: isCompound ? 90 : 60,
  };
}

function pickExercisesForGroups(
  eligibleList: CatalogExercise[],
  targetGroups: MuscleGroupId[],
  countPerGroup = 2,
  isBeginner = false,
  isAdvanced = false
): SuggestedExercise[] {
  const chosen: SuggestedExercise[] = [];
  const chosenIds = new Set<string>();

  targetGroups.forEach((group) => {
    const matching = eligibleList.filter(
      (ex) => ex.muscleGroup === group && !chosenIds.has(ex.id)
    );
    // Priorizar compuestos primero
    const sorted = [...matching].sort((a, b) => {
      if (a.movementType === 'Compuesto' && b.movementType !== 'Compuesto') return -1;
      if (a.movementType !== 'Compuesto' && b.movementType === 'Compuesto') return 1;
      return 0;
    });

    const selected = sorted.slice(0, countPerGroup);
    selected.forEach((ex) => {
      chosen.push(decorateExerciseWithSetsReps(ex, isBeginner, isAdvanced));
      chosenIds.add(ex.id);
    });
  });

  return chosen;
}

/**
 * Selector especializado para glúteos y piernas enfocado en cadena posterior o anterior
 */
function pickGluteLegExercises(
  eligibleList: CatalogExercise[],
  subfocus: 'gluteos_isquios' | 'cuadriceps_gluteo',
  count = 4,
  isBeginner = false,
  isAdvanced = false
): SuggestedExercise[] {
  const legs = eligibleList.filter((ex) => ex.muscleGroup === 'piernas');
  const chosen: SuggestedExercise[] = [];
  const chosenIds = new Set<string>();

  const prioritized = legs.filter((ex) => {
    const n = ex.name.toLowerCase();
    const z = ex.zone.toLowerCase();
    if (subfocus === 'gluteos_isquios') {
      return (
        n.includes('hip thrust') ||
        n.includes('rumano') ||
        n.includes('glute') ||
        n.includes('femoral') ||
        n.includes('patada') ||
        n.includes('abducci') ||
        z.includes('glúteo') ||
        z.includes('isquio')
      );
    } else {
      return (
        n.includes('sentadilla') ||
        n.includes('prensa') ||
        n.includes('búlgara') ||
        n.includes('bulgarian') ||
        n.includes('zancada') ||
        n.includes('extensi') ||
        n.includes('hack') ||
        z.includes('cuádriceps')
      );
    }
  });

  const pool = prioritized.length >= count ? prioritized : legs;
  pool.slice(0, count).forEach((ex) => {
    if (!chosenIds.has(ex.id)) {
      chosen.push(decorateExerciseWithSetsReps(ex, isBeginner, isAdvanced));
      chosenIds.add(ex.id);
    }
  });

  return chosen;
}

function getLevelGuidance(isBeginner: boolean, isAdvanced: boolean, isFemaleGlute = false): LevelGuidance {
  if (isFemaleGlute) {
    return {
      levelTitle: 'Enfoque Glúteos & Silueta Femenina · Descanso Óptimo',
      recommendedSets: '3 a 4 series de alta tensión mecánica',
      recommendedReps: '8 - 12 reps (compuestos glúteo) / 12 - 15 reps (aislamiento & abducciones)',
      restTime: '90 - 120 seg en básicos pesados / 60 seg en aislamiento',
      focusNotes:
        'Regla Oficial Dynasty: Glúteos y piernas se entrenan ÚNICAMENTE 2 días a la semana para garantizar 48 a 72 horas de recuperación y supercompensación biológica. Los otros días esculpen cintura, espalda y hombros sin sobrecargar las piernas.',
    };
  }

  if (isBeginner) {
    return {
      levelTitle: 'Principiante · Base y Control Motor',
      recommendedSets: '3 series por ejercicio',
      recommendedReps: '10 - 12 reps (básicos) / 12 - 15 reps (aislamiento)',
      restTime: '90 - 120 seg entre series',
      focusNotes: 'Prioriza cadencia controlada (2s bajada / 1s subida), rango articular completo y descanso adecuado para asimilar la técnica estricta.',
    };
  }
  if (isAdvanced) {
    return {
      levelTitle: 'Avanzado · Sobrecarga y Tensión Máxima',
      recommendedSets: '4 series en básicos / 3 - 4 series en accesorios',
      recommendedReps: '6 - 8 reps (fuerza e impacto) / 8 - 12 reps (hipertrofia y bombeo)',
      restTime: '90 - 120 seg en básicos pesados / 60 seg en accesorios',
      focusNotes: 'Aplica sobrecarga progresiva estricta, alta tensión mecánica y pausas de 1 segundo en el punto de máxima contracción concéntrica.',
    };
  }
  return {
    levelTitle: 'Intermedio · Hipertrofia y Rendimiento',
    recommendedSets: '3 a 4 series por ejercicio',
    recommendedReps: '8 - 10 reps (compuestos) / 10 - 12 reps (accesorios)',
    restTime: '60 - 90 seg entre series',
    focusNotes: 'Mantén 1 a 2 repeticiones en recámara (RIR 1-2). Céntrate en aumentar cargas o repeticiones de manera semanal consistente.',
  };
}

export function generateSuggestedRoutine({
  location = 'gym',
  fitnessLevel = 'Intermedio',
  fitnessGoal = 'Hipertrofia',
  gender,
  membership = 'standard',
  daysCount,
}: SuggestionParams): SuggestedRoutine {
  const eligible = getEligibleExercises(location, membership);
  const normalizedLevel = (fitnessLevel || 'intermedio').toLowerCase();

  const isBeginner =
    normalizedLevel.includes('principiante') ||
    normalizedLevel.includes('inicial') ||
    normalizedLevel.includes('novato');

  const isAdvanced =
    normalizedLevel.includes('avanzado') ||
    normalizedLevel.includes('pro') ||
    normalizedLevel.includes('atleta') ||
    normalizedLevel.includes('dedicado');

  // Determinar si es mujer o tiene enfoque prioritario en glúteos/tren inferior
  const isFemaleOrGlutes = Boolean(
    (gender && (gender.toLowerCase().includes('female') || gender.toLowerCase().includes('mujer'))) ||
    (fitnessGoal && (fitnessGoal.toLowerCase().includes('glute') || fitnessGoal.toLowerCase().includes('pierna')))
  );

  // Determinar los días a entrenar por semana
  let finalDaysCount: 3 | 4 | 5 | 6 = daysCount || (isBeginner ? 3 : isAdvanced ? 5 : 4);
  if (![3, 4, 5, 6].includes(finalDaysCount)) {
    finalDaysCount = 4;
  }

  const guidance = getLevelGuidance(isBeginner, isAdvanced, isFemaleOrGlutes);

  let routineTitle = '';
  let routineSubtitle = '';
  let description = '';
  const days: SuggestedRoutineDay[] = [];

  if (isFemaleOrGlutes) {
    /* ========================================================================= */
    /* RUTINA ESPECIALIZADA: MUJERES & ENFOQUE GLÚTEOS (ESTRICTAMENTE 2 DÍAS PIERNA/GLÚTEO) */
    /* ========================================================================= */
    const leg1 = pickGluteLegExercises(eligible, 'gluteos_isquios', 4, isBeginner, isAdvanced);
    const leg2 = pickGluteLegExercises(eligible, 'cuadriceps_gluteo', 4, isBeginner, isAdvanced);

    const upper1 = pickExercisesForGroups(eligible, ['espalda', 'hombros'], 2, isBeginner, isAdvanced);
    const upper2 = pickExercisesForGroups(eligible, ['pecho', 'triceps', 'biceps'], 1, isBeginner, isAdvanced);
    const coreEx = pickExercisesForGroups(eligible, ['core'], 2, isBeginner, isAdvanced);

    if (finalDaysCount === 3) {
      routineTitle = location === 'gym' ? 'Especialización Glúteos & Silueta · 3 Días' : 'Glúteos & Silueta Esculpida en Casa · 3 Días';
      routineSubtitle = '2 Días de Pierna/Glúteo con Descanso Óptimo + 1 Día Torso/Cintura';
      description =
        'Protocolo de alta especificidad: concentra el estímulo de piernas y glúteos en exactamente 2 sesiones intensivas separadas por 48 a 72 horas de recuperación muscular. El día intermedio trabaja espalda y postura para crear la silueta reloj de arena sin fatiga cruzada.';

      days.push(
        {
          dayId: 'fem-day-1',
          dayName: 'Día 1: Glúteos & Cadena Posterior',
          focus: 'Hip Thrust, Isquios & Glúteo Mayor',
          exerciseIds: leg1.map((e) => e.id),
          exercises: leg1,
        },
        {
          dayId: 'fem-day-2',
          dayName: 'Día 2: Torso Postural, Espalda & Cintura',
          focus: 'Dorsales, Deltoides Lateral & Core (Descanso Piernas)',
          exerciseIds: [...upper1, ...coreEx].map((e) => e.id),
          exercises: [...upper1, ...coreEx],
        },
        {
          dayId: 'fem-day-3',
          dayName: 'Día 3: Piernas Completo, Cuádriceps & Glúteo Medio',
          focus: 'Sentadilla, Prensa & Abducciones',
          exerciseIds: leg2.map((e) => e.id),
          exercises: leg2,
        }
      );
    } else if (finalDaysCount === 5) {
      routineTitle = location === 'gym' ? 'Glúteos & Silueta Bikini / Wellness · 5 Días' : 'Silueta Atlética & Glúteos en Casa · 5 Días';
      routineSubtitle = 'Estrictamente 2 Días Pierna/Glúteo + 3 Días Torso, Hombros y Core';
      description =
        'División estratégica de 5 días para atletas femeninas: concentra toda la intensidad de tren inferior en 2 días separados por descansos de 48 a 72 horas. Los otros 3 días esculpen espalda, cintura, deltoides y core para máxima definición estética.';

      days.push(
        {
          dayId: 'fem-day-1',
          dayName: 'Día 1: Glúteos & Femorales (Carga Alta)',
          focus: 'Hip Thrust, Peso Muerto Rumano & Patadas',
          exerciseIds: leg1.map((e) => e.id),
          exercises: leg1,
        },
        {
          dayId: 'fem-day-2',
          dayName: 'Día 2: Espalda & Postura Estética',
          focus: 'Jalones, Romboides & Cintura Reloj de Arena',
          exerciseIds: upper1.map((e) => e.id),
          exercises: upper1,
        },
        {
          dayId: 'fem-day-3',
          dayName: 'Día 3: Deltoides & Brazos Tonificados',
          focus: 'Hombro Lateral, Tríceps & Bíceps (0 Piernas)',
          exerciseIds: upper2.map((e) => e.id),
          exercises: upper2,
        },
        {
          dayId: 'fem-day-4',
          dayName: 'Día 4: Cuádriceps, Piernas & Glúteo Medio',
          focus: 'Prensa, Búlgaras, Extensiones & Abducción',
          exerciseIds: leg2.map((e) => e.id),
          exercises: leg2,
        },
        {
          dayId: 'fem-day-5',
          dayName: 'Día 5: Cintura, Core & Estabilidad Pélvica',
          focus: 'Planchas, Vacío Abdominal & Definición',
          exerciseIds: coreEx.map((e) => e.id),
          exercises: coreEx,
        }
      );
    } else if (finalDaysCount === 6) {
      routineTitle = location === 'gym' ? 'Alta Definición Femenina & Glúteos · 6 Días' : 'Escultura Corporal Dinastía · 6 Días';
      routineSubtitle = 'Estrictamente 2 Días Pierna/Glúteo + 4 Días Torso, Postura y Core';
      description =
        'Estructura de 6 días de alto rendimiento: protege las piernas y glúteos limitándolas estrictamente a 2 días por semana para evitar el sobreentrenamiento. Los otros 4 días se dedican a tonificación de tren superior, espalda, hombros y faja abdominal.';

      days.push(
        {
          dayId: 'fem-day-1',
          dayName: 'Día 1: Glúteo Mayor & Cadena Posterior',
          focus: 'Hip Thrust, RDL & Aislamiento Glúteo',
          exerciseIds: leg1.map((e) => e.id),
          exercises: leg1,
        },
        {
          dayId: 'fem-day-2',
          dayName: 'Día 2: Espalda Amplitud & Postura',
          focus: 'Jalón al Pecho & Remos (0 Piernas)',
          exerciseIds: upper1.map((e) => e.id),
          exercises: upper1,
        },
        {
          dayId: 'fem-day-3',
          dayName: 'Día 3: Deltoides 3D & Cintura Escapular',
          focus: 'Elevaciones Laterales & Hombros Redondos',
          exerciseIds: upper2.map((e) => e.id),
          exercises: upper2,
        },
        {
          dayId: 'fem-day-4',
          dayName: 'Día 4: Piernas Completo & Cuádriceps',
          focus: 'Sentadilla Hack, Prensa & Glúteo Medio',
          exerciseIds: leg2.map((e) => e.id),
          exercises: leg2,
        },
        {
          dayId: 'fem-day-5',
          dayName: 'Día 5: Espalda Media & Tonificación Brazos',
          focus: 'Remo Sentado, Tríceps & Bíceps Liviano',
          exerciseIds: upper1.map((e) => e.id),
          exercises: upper1,
        },
        {
          dayId: 'fem-day-6',
          dayName: 'Día 6: Blindaje Central & Core Firme',
          focus: 'Planchas, Oblicuos & Vacío Abdominal',
          exerciseIds: coreEx.map((e) => e.id),
          exercises: coreEx,
        }
      );
    } else {
      // 4 DÍAS (DEFAULT PARA MUJERES / GLÚTEOS)
      routineTitle = location === 'gym' ? 'Glúteos & Estética Femenina · 4 Días' : 'Silueta Femenina Dynasty en Casa · 4 Días';
      routineSubtitle = '2 Días de Pierna/Glúteo con Descanso Óptimo + 2 Días Torso y Core';
      description =
        'La división reina para esculpir glúteos y cintura: entrena glúteos y piernas exactamente 2 días por semana con 48 a 72 horas de recuperación muscular entre sesiones. Los días alternos fortalecen la espalda, hombros y abdomen para acentuar la forma estética.';

      days.push(
        {
          dayId: 'fem-day-1',
          dayName: 'Día 1: Glúteos Máximo & Femorales (Carga Alta)',
          focus: 'Hip Thrust, RDL & Patada en Polea',
          exerciseIds: leg1.map((e) => e.id),
          exercises: leg1,
        },
        {
          dayId: 'fem-day-2',
          dayName: 'Día 2: Espalda, Hombros & Postura A',
          focus: 'Dorsales, Elevación Lateral & Tríceps (0 Piernas)',
          exerciseIds: upper1.map((e) => e.id),
          exercises: upper1,
        },
        {
          dayId: 'fem-day-3',
          dayName: 'Día 3: Piernas Completo, Cuádriceps & Glúteo Medio',
          focus: 'Sentadilla, Prensa 45° & Abducciones',
          exerciseIds: leg2.map((e) => e.id),
          exercises: leg2,
        },
        {
          dayId: 'fem-day-4',
          dayName: 'Día 4: Cintura, Core & Tren Superior B',
          focus: 'Deltoides, Planchas & Definición Abdominal',
          exerciseIds: [...upper2, ...coreEx].map((e) => e.id),
          exercises: [...upper2, ...coreEx],
        }
      );
    }
  } else {
    /* ========================================================================= */
    /* RUTINA CLÁSICA / VARONES: FULL BODY, TORSO/PIERNA O PUSH/PULL/LEGS */
    /* ========================================================================= */
    if (finalDaysCount === 3) {
      routineTitle = location === 'gym' ? 'Full Body Dinastía · 3 Días' : 'Calistenia Full Body en Casa · 3 Días';
      routineSubtitle = '3 Días alternos · Máxima recuperación y frecuencia integral';
      description =
        'Enfoque en patrones de movimiento fundamentales (empuje, tracción, bisagra y rodilla). Ideal para construir masa magra y densidad muscular con alta eficiencia metabólica.';

      const day1Ex = pickExercisesForGroups(eligible, ['pecho', 'espalda', 'piernas', 'core'], 1, isBeginner, isAdvanced);
      const day2Ex = pickExercisesForGroups(eligible, ['hombros', 'biceps', 'triceps', 'core'], 1, isBeginner, isAdvanced);
      const day3Ex = pickExercisesForGroups(eligible, ['piernas', 'espalda', 'pecho', 'antebrazos'], 1, isBeginner, isAdvanced);

      days.push(
        {
          dayId: 'sug-day-1',
          dayName: 'Día 1: Cuerpo Completo A',
          focus: 'Pecho, Espalda & Piernas',
          exerciseIds: day1Ex.map((e) => e.id),
          exercises: day1Ex,
        },
        {
          dayId: 'sug-day-2',
          dayName: 'Día 2: Cuerpo Completo B',
          focus: 'Hombros, Brazos & Core',
          exerciseIds: day2Ex.map((e) => e.id),
          exercises: day2Ex,
        },
        {
          dayId: 'sug-day-3',
          dayName: 'Día 3: Cuerpo Completo C',
          focus: 'Piernas, Tracción & Estabilidad',
          exerciseIds: day3Ex.map((e) => e.id),
          exercises: day3Ex,
        }
      );
    } else if (finalDaysCount === 5) {
      routineTitle = location === 'gym' ? 'PPL + Upper/Lower Híbrido · 5 Días' : 'Fuerza Táctica & Dinámica en Casa · 5 Días';
      routineSubtitle = '5 Días de volumen estratégico · Máxima hipertrofia semanal';
      description =
        'La estructura definitiva que combina la potencia del bloque Empuje/Tracción/Piernas con una segunda rotación especializada de tren superior e inferior.';

      const day1Ex = pickExercisesForGroups(eligible, ['pecho', 'hombros', 'triceps'], 2, isBeginner, isAdvanced);
      const day2Ex = pickExercisesForGroups(eligible, ['espalda', 'biceps', 'antebrazos'], 2, isBeginner, isAdvanced);
      const day3Ex = pickExercisesForGroups(eligible, ['piernas', 'core'], 3, isBeginner, isAdvanced);
      const day4Ex = pickExercisesForGroups(eligible, ['pecho', 'espalda', 'hombros'], 2, isBeginner, isAdvanced);
      const day5Ex = pickExercisesForGroups(eligible, ['piernas', 'core', 'biceps', 'triceps'], 2, isBeginner, isAdvanced);

      days.push(
        {
          dayId: 'sug-day-1',
          dayName: 'Día 1: Empuje (Push A)',
          focus: 'Pecho, Deltoide Anterior & Tríceps',
          exerciseIds: day1Ex.map((e) => e.id),
          exercises: day1Ex,
        },
        {
          dayId: 'sug-day-2',
          dayName: 'Día 2: Tracción (Pull A)',
          focus: 'Espalda, Trapecios & Bíceps',
          exerciseIds: day2Ex.map((e) => e.id),
          exercises: day2Ex,
        },
        {
          dayId: 'sug-day-3',
          dayName: 'Día 3: Piernas & Core (Legs A)',
          focus: 'Cuádriceps, Femorales & Pantorrillas',
          exerciseIds: day3Ex.map((e) => e.id),
          exercises: day3Ex,
        },
        {
          dayId: 'sug-day-4',
          dayName: 'Día 4: Torso Superior Potencia',
          focus: 'Pectoral, Espalda Media & Deltoides',
          exerciseIds: day4Ex.map((e) => e.id),
          exercises: day4Ex,
        },
        {
          dayId: 'sug-day-5',
          dayName: 'Día 5: Pierna Posterior & Brazos',
          focus: 'Isquios, Glúteos, Bíceps & Tríceps',
          exerciseIds: day5Ex.map((e) => e.id),
          exercises: day5Ex,
        }
      );
    } else if (finalDaysCount === 6) {
      routineTitle = location === 'gym' ? 'Push · Pull · Legs Frecuencia 2 · 6 Días' : 'Sobrecarga Calisténica Extrema · 6 Días';
      routineSubtitle = '6 Días de alto rendimiento · Volumen y densidad extrema';
      description =
        'Estructura atlética de 6 días que estimula el cuerpo completo en dos rotaciones de alta intensidad, optimizando el estímulo muscular sin fatiga cruzada.';

      const p1 = pickExercisesForGroups(eligible, ['pecho', 'hombros', 'triceps'], 2, isBeginner, isAdvanced);
      const pl1 = pickExercisesForGroups(eligible, ['espalda', 'biceps', 'antebrazos'], 2, isBeginner, isAdvanced);
      const lg1 = pickExercisesForGroups(eligible, ['piernas', 'core'], 3, isBeginner, isAdvanced);
      const p2 = pickExercisesForGroups(eligible, ['hombros', 'pecho', 'triceps'], 2, isBeginner, isAdvanced);
      const pl2 = pickExercisesForGroups(eligible, ['espalda', 'antebrazos', 'biceps'], 2, isBeginner, isAdvanced);
      const lg2 = pickExercisesForGroups(eligible, ['piernas', 'core'], 3, isBeginner, isAdvanced);

      days.push(
        {
          dayId: 'sug-day-1',
          dayName: 'Día 1: Push A (Fuerza)',
          focus: 'Pecho Pesado, Deltoides & Tríceps',
          exerciseIds: p1.map((e) => e.id),
          exercises: p1,
        },
        {
          dayId: 'sug-day-2',
          dayName: 'Día 2: Pull A (Tracción)',
          focus: 'Dorsales, Espalda Alta & Bíceps',
          exerciseIds: pl1.map((e) => e.id),
          exercises: pl1,
        },
        {
          dayId: 'sug-day-3',
          dayName: 'Día 3: Legs A (Cuádriceps)',
          focus: 'Sentadilla, Prensa & Pantorrillas',
          exerciseIds: lg1.map((e) => e.id),
          exercises: lg1,
        },
        {
          dayId: 'sug-day-4',
          dayName: 'Día 4: Push B (Hipertrofia)',
          focus: 'Deltoides Lateral, Pecho Inclinado & Tríceps',
          exerciseIds: p2.map((e) => e.id),
          exercises: p2,
        },
        {
          dayId: 'sug-day-5',
          dayName: 'Día 5: Pull B (Densidad)',
          focus: 'Espalda Media, Romboides & Bíceps',
          exerciseIds: pl2.map((e) => e.id),
          exercises: pl2,
        },
        {
          dayId: 'sug-day-6',
          dayName: 'Día 6: Legs B (Cadena Posterior)',
          focus: 'Femorales, Hip Thrust, Glúteos & Core',
          exerciseIds: lg2.map((e) => e.id),
          exercises: lg2,
        }
      );
    } else {
      // 4 DÍAS (DEFAULT): TORSO / PIERNA FRECUENCIA 2
      routineTitle = location === 'gym' ? 'Torso / Pierna Frecuencia 2 · 4 Días' : 'Potencia Funcional Torso / Pierna · 4 Días';
      routineSubtitle = '4 Días balanceados · Hipertrofia & Fuerza Estructurada';
      description =
        'La división por excelencia para optimizar la síntesis proteica de 48 horas. Estimula cada grupo muscular 2 veces por semana con el volumen óptimo.';

      const torso1Ex = pickExercisesForGroups(eligible, ['pecho', 'espalda', 'hombros'], 2, isBeginner, isAdvanced);
      const pierna1Ex = pickExercisesForGroups(eligible, ['piernas', 'core'], 3, isBeginner, isAdvanced);
      const torso2Ex = pickExercisesForGroups(eligible, ['espalda', 'pecho', 'biceps', 'triceps'], 2, isBeginner, isAdvanced);
      const pierna2Ex = pickExercisesForGroups(eligible, ['piernas', 'core', 'antebrazos'], 2, isBeginner, isAdvanced);

      days.push(
        {
          dayId: 'sug-day-1',
          dayName: 'Día 1: Torso Potencia',
          focus: 'Pectoral, Dorsales & Hombros',
          exerciseIds: torso1Ex.map((e) => e.id),
          exercises: torso1Ex,
        },
        {
          dayId: 'sug-day-2',
          dayName: 'Día 2: Pierna & Glúteos',
          focus: 'Cuádriceps, Isquiotibiales & Abdomen',
          exerciseIds: pierna1Ex.map((e) => e.id),
          exercises: pierna1Ex,
        },
        {
          dayId: 'sug-day-3',
          dayName: 'Día 3: Torso Hipertrofia',
          focus: 'Espalda Media, Pecho Inclinado & Brazos',
          exerciseIds: torso2Ex.map((e) => e.id),
          exercises: torso2Ex,
        },
        {
          dayId: 'sug-day-4',
          dayName: 'Día 4: Pierna Posterior & Core',
          focus: 'Femorales, Glúteos, Pantorrillas & Core',
          exerciseIds: pierna2Ex.map((e) => e.id),
          exercises: pierna2Ex,
        }
      );
    }
  }

  // Ajuste para objetivo de Volumen
  const normGoal = (fitnessGoal || 'hipertrofia').toLowerCase();
  const isDefinition = normGoal.includes('definici') || normGoal.includes('tonific') || normGoal.includes('grasa') || normGoal.includes('peso');
  const isVolume = normGoal.includes('volumen');

  if (isVolume && !isFemaleOrGlutes) {
    routineTitle = location === 'gym' ? `Volumen Anabólico Pesado · ${finalDaysCount} Días` : `Volumen & Sobrecarga en Casa · ${finalDaysCount} Días`;
    routineSubtitle = 'Superávit calórico, ejercicios básicos pesados y sobrecarga progresiva';
    description = 'Protocolo de volumen muscular: prioriza ejercicios multiarticulares pesados en rangos de 6 a 10 repeticiones, complementado con descanso amplio (90-120s) y alta tensión mecánica para máxima ganancia de masa magra.';
  } else if (isDefinition && !isFemaleOrGlutes) {
    routineTitle = location === 'gym' ? `Definición & Tonificación Dynasty · ${finalDaysCount} Días` : `Definición Funcional en Casa · ${finalDaysCount} Días`;
    routineSubtitle = 'Densidad muscular, gasto calórico elevado y protocolo de cardio HIIT';
    description = 'Protocolo de corte y definición: combina series de pesas con descansos dinámicos y el protocolo HIIT de 2 minutos regulares por 1 minuto intenso para preservar masa muscular y detonar la oxidación de grasa.';
  }

  // Recolectar todos los exerciseIds únicos para la biblioteca personal
  const allIds = Array.from(new Set(days.flatMap((d) => d.exerciseIds)));

  const cardioRecommendation = {
    title: 'Protocolo Cardio HIIT Dynasty · Core & Metabolismo',
    protocol: 'Intervalos 2x1: 2 minutos a ritmo regular continuo + 1 minuto de sprint intenso.',
    coreTip: 'En cada sprint de 1 minuto, contrae fuertemente el abdomen (brace abdominal) para fijar el core y elevar el metabolismo.',
    intervals: '🟢 2 min Trote Regular / 🔴 1 min Sprint Intenso',
    duration: '15 a 20 minutos (5 a 6 ciclos continuos) al finalizar la sesión de pesas.',
  };

  return {
    title: routineTitle,
    subtitle: routineSubtitle,
    description,
    focusGoal: isFemaleOrGlutes
      ? 'Glúteos & Estética Femenina (2 Días Pierna)'
      : isVolume
      ? 'Volumen Anabólico'
      : isDefinition
      ? 'Definición y Tonificación'
      : (fitnessGoal || 'Hipertrofia & Fuerza'),
    levelLabel: fitnessLevel || 'Intermedio',
    locationLabel: location === 'gym' ? 'Gimnasio' : 'Casa',
    daysPerWeek: finalDaysCount,
    guidance,
    trainerDisclaimer: isFemaleOrGlutes
      ? 'Pauta biomecánica para mujeres / enfoque glúteo: Para máxima síntesis proteica e hipertrofia del glúteo y pierna, se programan estrictamente 2 días de tren inferior por semana con 48 a 72 horas de recuperación biológica. Los otros días optimizan postura, cintura y tren superior sin sobrecargar las piernas.'
      : 'Sugerencia inicial estructurada según tu nivel, días seleccionados y catálogo activo. Tu Head Coach Esteban puede personalizarla y ajustar tus cargas en cualquier momento.',
    days,
    allExerciseIds: allIds,
    cardioRecommendation,
  };
}
