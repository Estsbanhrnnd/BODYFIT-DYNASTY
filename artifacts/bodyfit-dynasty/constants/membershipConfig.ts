/**
 * Configuración Central Oficial de Membresías - BodyFit Dynasty ®
 * Fuente única de verdad para precios, porcentajes de catálogo, recetas, límites y beneficios.
 */

export type MembershipTierId = 'standard' | 'bronze' | 'platinum' | 'golden';

export interface MembershipConfigItem {
  id: MembershipTierId;
  name: string;
  badge: string;
  priceUsd: number;
  priceFormatted: string;
  billingPeriod: string;
  description: string;
  catalogPercentTarget: number; // Porcentaje objetivo oficial
  recipesPerCategory: number;   // Recetas por cada una de las 4 categorías (Desayuno, Almuerzo, Cena, Snack)
  totalRecipes: number;         // recipesPerCategory * 4
  foodScannerDailyLimit: number; // Cantidad de análisis diarios (Infinity = ilimitado)
  maxExtraAdScans: number;       // Cantidad máxima de escaneos extras por anuncios al día
  adsPerExtraScan: number;       // Anuncios necesarios por cada escaneo extra
  hasTrainerChat24_7: boolean;   // Chat de atención con entrenadores designados
  hasAds: boolean;
  adsPerStreakSave: number;      // Anuncios para salvar racha diaria (máx 1 vez al día)
  accentColor: string;
  badgeBg: string;
  features: string[];
}

export const MEMBERSHIP_CONFIG: Record<MembershipTierId, MembershipConfigItem> = {
  standard: {
    id: 'standard',
    name: 'STANDARD',
    badge: 'GRATIS',
    priceUsd: 0.0,
    priceFormatted: '$0.00 — GRATIS',
    billingPeriod: 'Para siempre',
    description: 'Acceso esencial para iniciar tu disciplina en la dinastía',
    catalogPercentTarget: 15, // 15% del catálogo
    recipesPerCategory: 6,
    totalRecipes: 24, // 6 x 4 categorías
    foodScannerDailyLimit: 1,
    maxExtraAdScans: 3,
    adsPerExtraScan: 3,
    hasTrainerChat24_7: false,
    hasAds: true,
    adsPerStreakSave: 3,
    accentColor: '#8C7A6B',
    badgeBg: 'rgba(140, 122, 107, 0.2)',
    features: [
      'Aproximadamente 15% del catálogo de ejercicios',
      'Representación de TODOS los grupos musculares',
      'Rutina personalizada opcional (hasta 3 ejercicios por grupo)',
      '24 recetas saludables (6 por categoría)',
      '1 escaneo diario gratis + hasta 3 extras con 3 anuncios c/u',
      'Conteo de pasos, racha diaria y progreso',
      'Salva-rachas diario disponible viendo 3 anuncios',
    ],
  },
  bronze: {
    id: 'bronze',
    name: 'BRONZE',
    badge: 'BRONZE',
    priceUsd: 10.99,
    priceFormatted: '$10.99 / mes',
    billingPeriod: 'Facturación mensual',
    description: 'Mayor variedad de ejercicios para optimizar tus cargas',
    catalogPercentTarget: 40, // 40% del catálogo
    recipesPerCategory: 6,
    totalRecipes: 24,
    foodScannerDailyLimit: 2,
    maxExtraAdScans: 3,
    adsPerExtraScan: 3,
    hasTrainerChat24_7: false,
    hasAds: true,
    adsPerStreakSave: 3,
    accentColor: '#CD7F32',
    badgeBg: 'rgba(205, 127, 50, 0.22)',
    features: [
      '40% del catálogo total de ejercicios',
      'Opciones ampliadas en TODOS los grupos musculares',
      'Rutina personalizada opcional con mayor repertorio',
      '24 recetas saludables balanceadas',
      '3 escaneos de alimentos al día con estimación de macros',
      'Registro de PRs y métricas multi-área',
      'Salva-rachas diario viendo 3 anuncios',
    ],
  },
  platinum: {
    id: 'platinum',
    name: 'PLATINUM',
    badge: 'PLATINUM',
    priceUsd: 20.99,
    priceFormatted: '$20.99 / mes',
    billingPeriod: 'Facturación mensual',
    description: 'Variedad amplia de variantes avanzadas y nutrición de alto nivel',
    catalogPercentTarget: 65, // 65% del catálogo
    recipesPerCategory: 20,
    totalRecipes: 80, // 20 x 4 categorías
    foodScannerDailyLimit: 10,
    maxExtraAdScans: 0,
    adsPerExtraScan: 0,
    hasTrainerChat24_7: false,
    hasAds: false,
    adsPerStreakSave: 0,
    accentColor: '#38BDF8',
    badgeBg: 'rgba(56, 189, 248, 0.2)',
    features: [
      '65% del catálogo total de ejercicios y variantes',
      'Acceso a ejercicios compuestos y aislados de élite',
      'Rutina personalizada avanzada de múltiples días',
      '80 recetas de alta nutrición (20 por categoría)',
      '10 escaneos de comida al día con desglose nutricional',
      'Experiencia 100% limpia SIN anuncios',
      'Desbloqueo acelerado de medallas de la dinastía',
    ],
  },
  golden: {
    id: 'golden',
    name: 'GOLDEN',
    badge: 'DYNASTY ELITE',
    priceUsd: 30.99,
    priceFormatted: '$30.99 / mes',
    billingPeriod: 'Facturación mensual',
    description: 'Acceso total sin límites con atención personalizada de entrenadores',
    catalogPercentTarget: 100, // 100% del catálogo
    recipesPerCategory: 50,
    totalRecipes: 200, // 50 x 4 categorías
    foodScannerDailyLimit: Infinity,
    maxExtraAdScans: 0,
    adsPerExtraScan: 0,
    hasTrainerChat24_7: true, // Atención 24/7 con entrenadores designados
    hasAds: false,
    adsPerStreakSave: 0,
    accentColor: '#E5A93C',
    badgeBg: 'rgba(229, 169, 60, 0.25)',
    features: [
      '100% del catálogo completo de ejercicios y todas sus variantes',
      'Atención y orientación 24/7 con entrenadores designados de BodyFit Dynasty',
      '200 recetas fitness completas (50 por categoría)',
      'Rutina personalizada sin restricciones de catálogo',
      'Food Scanner con análisis ILIMITADO de platillos',
      'Protección automática de racha y SIN anuncios',
      'Comunidad Dynasty VIP y medallas exclusivas de oro y diamante',
    ],
  },
};

/**
 * Jerarquía numérica de membresías para comparaciones de permisos
 */
export const MEMBERSHIP_TIER_RANK: Record<MembershipTierId, number> = {
  standard: 0,
  bronze: 1,
  platinum: 2,
  golden: 3,
};

/**
 * Comprueba si un usuario con `userTier` tiene acceso a una característica de `requiredTier`
 */
export function hasTierAccess(userTier: MembershipTierId | string | undefined, requiredTier: MembershipTierId): boolean {
  const normalizedUser = (userTier?.toLowerCase() as MembershipTierId) || 'standard';
  const userRank = MEMBERSHIP_TIER_RANK[normalizedUser] ?? 0;
  const requiredRank = MEMBERSHIP_TIER_RANK[requiredTier] ?? 0;
  return userRank >= requiredRank;
}

export function getMembershipConfig(tierId: MembershipTierId | string | undefined): MembershipConfigItem {
  const normalized = (tierId?.toLowerCase() as MembershipTierId) || 'standard';
  return MEMBERSHIP_CONFIG[normalized] || MEMBERSHIP_CONFIG.standard;
}
