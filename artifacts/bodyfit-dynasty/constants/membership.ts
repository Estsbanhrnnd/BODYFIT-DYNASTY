export type MembershipId = 'standard' | 'bronze' | 'platinum' | 'golden';

export type MembershipPlan = {
  id: MembershipId;
  name: 'STANDARD' | 'BRONZE' | 'PLATINUM' | 'GOLDEN';
  price: string;
  description: string;
  catalogPercent: number;
  features: string[];
  icon: 'circle' | 'award' | 'star';
  color: string;
};

export const membershipPlans: MembershipPlan[] = [
  {
    id: 'standard',
    name: 'STANDARD',
    price: 'Gratis · ₡0',
    description: 'Empieza a construir el hábito',
    catalogPercent: 5,
    icon: 'circle',
    color: '#5A3B18',
    features: ['5% inicial del catálogo', 'Aproximadamente 2 ejercicios por grupo', 'Conteo de pasos y streaks', '3 recetas gratuitas de muestra'],
  },
  {
    id: 'bronze',
    name: 'BRONZE',
    price: '₡5.500',
    description: 'Nutrición diaria para avanzar',
    catalogPercent: 25,
    icon: 'award',
    color: '#7A4321',
    features: ['25% del catálogo de ejercicios', '1 escaneo de comida por día', 'Calorías y macros estimados', '25 recetas iniciales'],
  },
  {
    id: 'platinum',
    name: 'PLATINUM',
    price: '₡14.590',
    description: 'Más entrenamiento, sin anuncios',
    catalogPercent: 50,
    icon: 'star',
    color: '#2C1550',
    features: ['50% del catálogo de ejercicios', 'Análisis y escaneo de platos', 'Estimaciones de calorías y macros', '75 recetas iniciales', 'Sin anuncios'],
  },
  {
    id: 'golden',
    name: 'GOLDEN',
    price: '₡22.500',
    description: 'La experiencia completa BodyFit',
    catalogPercent: 100,
    icon: 'award',
    color: '#173C36',
    features: ['100% del catálogo de ejercicios', 'Plan alimenticio personalizado', '125 recetas y recetas de comunidad', 'Gym Scan, cardio y medallas', 'Chat 24/7 y comunidad Golden', 'Sin anuncios'],
  },
];

export const getMembershipPlan = (id: MembershipId) => membershipPlans.find((plan) => plan.id === id) ?? membershipPlans[0];