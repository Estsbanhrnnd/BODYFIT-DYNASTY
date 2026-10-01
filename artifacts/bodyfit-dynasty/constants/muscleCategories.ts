import { MembershipTierId } from './membershipConfig';
import {
  RAW_CATALOG_EXERCISES,
  MUSCLE_GROUPS_INFO,
  type MuscleGroupId,
  type CatalogExercise,
} from './exerciseCatalog';

export type Exercise = {
  id?: string;
  name: string;
  subfocus: string;
  target: string;
  detail: string;
  time: string;
  requiredTier?: MembershipTierId;
  imageUrl?: string;
  instructions?: string;
  equipment?: string;
  grip?: string;
  position?: string;
  modality?: string;
  level?: string;
  variants?: string[];
  hasVideo?: boolean;
  hasImage?: boolean;
};

export type MuscleSubfocus = {
  id: string;
  label: string;
  description: string;
};

export type MuscleCategory = {
  id: string;
  name: string;
  subtitle: string;
  focus: string;
  timeEstimate: string;
  imageUrl: string;
  subfocuses: MuscleSubfocus[];
  gymExercises: Exercise[];
  homeExercises: Exercise[];
};

const CATEGORY_META: Record<
  MuscleGroupId,
  { subtitle: string; focus: string; timeEstimate: string; imageUrl: string }
> = {
  pecho: {
    subtitle: 'Pectoral Mayor y Menor',
    focus: 'Pecho Superior, Medio e Inferior',
    timeEstimate: '45–55 min',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
  },
  espalda: {
    subtitle: 'Dorsales, Romboides y Erectores',
    focus: 'Amplitud de Dorsal, Grosor y Espalda Baja',
    timeEstimate: '50–60 min',
    imageUrl: 'https://images.unsplash.com/photo-1603287681836-b174ce5074c2?w=800&auto=format&fit=crop&q=80',
  },
  hombros: {
    subtitle: 'Deltoides Anterior, Lateral y Posterior',
    focus: 'Hombros 3D y Cintura Escapular',
    timeEstimate: '40–50 min',
    imageUrl: 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=800&auto=format&fit=crop&q=80',
  },
  biceps: {
    subtitle: 'Bíceps Braquial y Braquiorradial',
    focus: 'Pico, Cabeza Larga, Corta y Braquial',
    timeEstimate: '35–45 min',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
  },
  triceps: {
    subtitle: 'Cabeza Larga, Lateral y Medial',
    focus: 'Volumen del Brazo y Extensión de Codo',
    timeEstimate: '35–45 min',
    imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=800&auto=format&fit=crop&q=80',
  },
  piernas: {
    subtitle: 'Cuádriceps, Isquios, Glúteos y Gemelos',
    focus: 'Potencia Inferior, Femorales y Cadena Posterior',
    timeEstimate: '55–65 min',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
  },
  core: {
    subtitle: 'Recto Abdominal, Oblicuos y Transverso',
    focus: 'Blindaje Central y Definición Abdominal',
    timeEstimate: '20–30 min',
    imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&auto=format&fit=crop&q=80',
  },
  antebrazos: {
    subtitle: 'Flexores, Extensores y Agarre',
    focus: 'Fuerza de Agarre y Densidad de Antebrazo',
    timeEstimate: '20–25 min',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
  },
  cuello: {
    subtitle: 'Musculatura Cervical',
    focus: 'Simetría Cervical y Salud Espinal',
    timeEstimate: '15–20 min',
    imageUrl: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=800&auto=format&fit=crop&q=80',
  },
};

function mapToExercise(ex: CatalogExercise): Exercise {
  const meta = CATEGORY_META[ex.muscleGroup];
  return {
    id: ex.id,
    name: ex.name,
    subfocus: ex.zone,
    target: `${ex.zone} · ${ex.equipment}`,
    detail: `${ex.movementType} · ${ex.level} · ${ex.modality}`,
    time: ex.movementType === 'Compuesto' ? '12–15 min' : '8–10 min',
    requiredTier: ex.requiredTier,
    imageUrl: meta?.imageUrl || ex.imageUrl,
    instructions: ex.instructions,
    equipment: ex.equipment,
    grip: ex.grip,
    position: ex.position,
    modality: ex.modality,
    level: ex.level,
    variants: ex.variants,
    hasVideo: ex.hasVideo,
    hasImage: ex.hasImage,
  };
}

export const muscleCategories: MuscleCategory[] = (
  Object.keys(MUSCLE_GROUPS_INFO) as MuscleGroupId[]
).map((groupId) => {
  const groupInfo = MUSCLE_GROUPS_INFO[groupId];
  const meta = CATEGORY_META[groupId];
  const exercisesInGroup = RAW_CATALOG_EXERCISES.filter((e) => e.muscleGroup === groupId);

  const uniqueZones = Array.from(new Set(exercisesInGroup.map((e) => e.zone)));
  const subfocuses: MuscleSubfocus[] = [
    { id: 'todos', label: 'Todos', description: `Todos los ejercicios de ${groupInfo.label}` },
    ...uniqueZones.map((zone) => ({
      id: zone,
      label: zone,
      description: `Ejercicios enfocados en ${zone}`,
    })),
  ];

  const gymExercises = exercisesInGroup.map(mapToExercise);
  const homeExercises = exercisesInGroup
    .filter((e) => {
      const eq = (e.equipment || '').toLowerCase();
      return (
        eq.includes('peso corporal') ||
        eq.includes('mancuerna') ||
        eq.includes('banda') ||
        eq.includes('suelo') ||
        eq.includes('libre') ||
        eq.includes('escalón') ||
        eq.includes('banco')
      );
    })
    .map(mapToExercise);

  return {
    id: groupId,
    name: groupInfo.label,
    subtitle: meta.subtitle,
    focus: meta.focus,
    timeEstimate: meta.timeEstimate,
    imageUrl: meta.imageUrl,
    subfocuses,
    gymExercises,
    homeExercises,
  };
});
