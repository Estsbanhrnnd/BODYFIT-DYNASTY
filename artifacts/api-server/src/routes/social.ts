import { getAuth } from "@clerk/express";
import { Router, type IRouter } from "express";
import { db, profiles, socialFollows } from "@workspace/db";
import { and, eq, ilike, or } from "drizzle-orm";
import { getAuthenticatedUserId } from "../lib/auth";
import { createNotification } from "./notifications";

const router: IRouter = Router();

function authenticatedUserId(req: Parameters<typeof getAuth>[0]) {
  return getAuthenticatedUserId(req);
}

// Catálogo base de atletas y leyendas para interacción inmediata
export interface AthleteProfileData {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  heightCm: string;
  weightKg: string;
  fitnessLevel: string;
  membershipTier: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  medals: Array<{
    id: string;
    legend: string;
    title: string;
    tier: string;
    tierColor: string;
    points: number;
    icon: string;
  }>;
  posts: Array<{
    id: string;
    postType: string;
    caption: string;
    mediaUrl?: string;
    likeCount: number;
    commentCount: number;
    liked?: boolean;
    createdAt: string;
  }>;
}

const mockAthletes: Record<string, AthleteProfileData> = {
  user_cbum: {
    userId: "user_cbum",
    username: "cbum",
    displayName: "Chris Bumstead",
    avatarUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80",
    bio: "5x Classic Physique Olympia Champion. La disciplina vence a la motivación cada día del año. Thavage mindset.",
    heightCm: "185",
    weightKg: "108",
    fitnessLevel: "Olympia Champion",
    membershipTier: "platinum",
    followersCount: 14250,
    followingCount: 320,
    postsCount: 142,
    medals: [
      { id: "cbum_classic", legend: "Chris Bumstead", title: "Classic Discipline", tier: "Plata", tierColor: "#94A3B8", points: 350, icon: "award" },
      { id: "cbum_thavage", legend: "Chris Bumstead", title: "Thavage Champion", tier: "Oro", tierColor: "#F59E0B", points: 1000, icon: "zap" },
      { id: "arnold_conquest", legend: "Arnold Schwarzenegger", title: "Conquista del Hierro", tier: "Platino", tierColor: "#E2E8F0", points: 1500, icon: "shield" },
    ],
    posts: [
      {
        id: "post-cbum-1",
        postType: "workout",
        caption: "Sesión pesada de piernas a 6 semanas del torneo. Sentadillas con barra alta, control de tempo excéntrico. Sin excusas.",
        mediaUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
        likeCount: 1540,
        commentCount: 182,
        liked: false,
        createdAt: new Date(Date.now() - 4 * 3600 * 1000).toISOString(),
      },
      {
        id: "post-cbum-2",
        postType: "meal",
        caption: "Comida 4: Arroz blanco con carne magra y aceite de oliva virgen. Simple, nutritivo y enfocado en recuperación.",
        mediaUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
        likeCount: 920,
        commentCount: 65,
        liked: false,
        createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
    ],
  },
  user_davidlaid: {
    userId: "user_davidlaid",
    username: "davidlaid",
    displayName: "David Laid",
    avatarUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80",
    bio: "Aesthetic Icon & Visionary Athlete. Tu cuerpo es la única obra de arte que puedes esculpir con tu propia voluntad.",
    heightCm: "188",
    weightKg: "90",
    fitnessLevel: "Aesthetic Legend",
    membershipTier: "platinum",
    followersCount: 9840,
    followingCount: 185,
    postsCount: 88,
    medals: [
      { id: "laid_aesthetic", legend: "David Laid", title: "Aesthetic Vision", tier: "Plata", tierColor: "#94A3B8", points: 400, icon: "feather" },
      { id: "laid_intensity", legend: "David Laid", title: "Intensidad Pura", tier: "Oro", tierColor: "#F59E0B", points: 900, icon: "activity" },
    ],
    posts: [
      {
        id: "post-laid-1",
        postType: "workout",
        caption: "Press inclinado con mancuernas de 50kg. El bombeo y la simetría son el resultado de años de obsesión constructiva.",
        mediaUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
        likeCount: 1120,
        commentCount: 94,
        liked: false,
        createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
    ],
  },
  user_arnold: {
    userId: "user_arnold",
    username: "arnold_schwarzenegger",
    displayName: "Arnold Schwarzenegger",
    avatarUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=500&auto=format&fit=crop&q=80",
    bio: "7x Mr. Olympia · The Austrian Oak. La mente es el límite. Si tu mente puede visualizar que puedes hacer algo, lo harás.",
    heightCm: "188",
    weightKg: "107",
    fitnessLevel: "Leyenda Mr. Olympia",
    membershipTier: "platinum",
    followersCount: 28900,
    followingCount: 42,
    postsCount: 215,
    medals: [
      { id: "arnold_first", legend: "Arnold Schwarzenegger", title: "Primer Paso al Olimpo", tier: "Bronce", tierColor: "#CD7F32", points: 100, icon: "flag" },
      { id: "arnold_streak", legend: "Arnold Schwarzenegger", title: "El Roble de Hierro", tier: "Oro", tierColor: "#F59E0B", points: 750, icon: "zap" },
      { id: "arnold_conquest", legend: "Arnold Schwarzenegger", title: "Conquista del Hierro", tier: "Platino", tierColor: "#E2E8F0", points: 1500, icon: "shield" },
    ],
    posts: [
      {
        id: "post-arnold-1",
        postType: "progress",
        caption: "¡Recuerda siempre: los días difíciles son los que más cuentan! Nunca escuches a los que dicen que no se puede.",
        mediaUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        likeCount: 3410,
        commentCount: 310,
        liked: true,
        createdAt: new Date(Date.now() - 18 * 3600 * 1000).toISOString(),
      },
    ],
  },
  user_valeria: {
    userId: "user_valeria",
    username: "valeria_fit",
    displayName: "Valeria Montero",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80",
    bio: "Atleta bikini fitness BodyFit Dynasty. Amante del glute & leg day. La disciplina no se negocia 💪✨",
    heightCm: "165",
    weightKg: "58",
    fitnessLevel: "Avanzado",
    membershipTier: "platinum",
    followersCount: 1240,
    followingCount: 215,
    postsCount: 34,
    medals: [
      { id: "cbum_classic", legend: "Chris Bumstead", title: "Classic Discipline", tier: "Plata", tierColor: "#94A3B8", points: 350, icon: "award" },
      { id: "arnold_streak", legend: "Arnold Schwarzenegger", title: "El Roble de Hierro", tier: "Oro", tierColor: "#F59E0B", points: 750, icon: "zap" },
    ],
    posts: [
      {
        id: "post-demo-1",
        postType: "workout",
        caption: "¡Día de pierna superado! Nueva marca personal en sentadilla libre (4x8 con 80kg). La disciplina y la constancia no se negocian 💪🔥",
        mediaUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
        likeCount: 24,
        commentCount: 4,
        liked: false,
        createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
      },
    ],
  },
  user_carlos: {
    userId: "user_carlos",
    username: "carlos_dynasty",
    displayName: "Carlos Mora",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80",
    bio: "Powerbuilding & nutrición limpia. Miembro activo BodyFit Dynasty Platinum 🔥 Superando marcas cada semana.",
    heightCm: "178",
    weightKg: "82",
    fitnessLevel: "Intermedio",
    membershipTier: "platinum",
    followersCount: 890,
    followingCount: 140,
    postsCount: 22,
    medals: [
      { id: "arnold_first", legend: "Arnold Schwarzenegger", title: "Primer Paso al Olimpo", tier: "Bronce", tierColor: "#CD7F32", points: 100, icon: "flag" },
    ],
    posts: [
      {
        id: "post-demo-2",
        postType: "meal",
        caption: "Almuerzo post-entreno listo: 150g de salmón salvaje al horno con arroz integral y brócoli al vapor. Cumpliendo los macros del plan Platinum 🥗🥑",
        mediaUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
        likeCount: 42,
        commentCount: 6,
        liked: true,
        createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
      },
    ],
  },
  dev_user_bodyfit: {
    userId: "dev_user_bodyfit",
    username: "esteban_coach",
    displayName: "Esteban Entrenador",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop&q=80",
    bio: "Head Coach & Fundador de BodyFit Dynasty. Transformando el potencial de cada atleta a través de la excelencia.",
    heightCm: "182",
    weightKg: "86",
    fitnessLevel: "Master Coach",
    membershipTier: "platinum",
    followersCount: 3420,
    followingCount: 110,
    postsCount: 65,
    medals: [
      { id: "arnold_first", legend: "Arnold Schwarzenegger", title: "Primer Paso al Olimpo", tier: "Bronce", tierColor: "#CD7F32", points: 100, icon: "flag" },
      { id: "arnold_streak", legend: "Arnold Schwarzenegger", title: "El Roble de Hierro", tier: "Oro", tierColor: "#F59E0B", points: 750, icon: "zap" },
      { id: "arnold_conquest", legend: "Arnold Schwarzenegger", title: "Conquista del Hierro", tier: "Platino", tierColor: "#E2E8F0", points: 1500, icon: "shield" },
    ],
    posts: [
      {
        id: "post-demo-3",
        postType: "progress",
        caption: "¡Bienvenidos a la comunidad oficial de BodyFit Dynasty! Aquí compartimos nuestros entrenos, comidas saludables y motivación diaria. ¡A romperla equipo!",
        mediaUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
        likeCount: 68,
        commentCount: 15,
        liked: true,
        createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
      },
    ],
  },
  user_sofi: {
    userId: "user_sofi",
    username: "sofi_cross",
    displayName: "Sofía Navarro",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=500&auto=format&fit=crop&q=80",
    bio: "Entrenamiento funcional, fuerza y cross training. Cada repetición suma para tu mejor versión.",
    heightCm: "168",
    weightKg: "62",
    fitnessLevel: "Intermedio",
    membershipTier: "pro",
    followersCount: 650,
    followingCount: 190,
    postsCount: 18,
    medals: [
      { id: "arnold_first", legend: "Arnold Schwarzenegger", title: "Primer Paso al Olimpo", tier: "Bronce", tierColor: "#CD7F32", points: 100, icon: "flag" },
    ],
    posts: [
      {
        id: "post-demo-4",
        postType: "workout",
        caption: "Rutina de Hombro y Tríceps completada en 42 minutos. Sentir el progreso semana a semana no tiene precio ⚡️",
        mediaUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
        likeCount: 19,
        commentCount: 3,
        liked: false,
        createdAt: new Date(Date.now() - 720 * 60 * 1000).toISOString(),
      },
    ],
  },
};

// Registro de seguimiento en memoria para respuesta instantánea
export const inMemoryFollows = new Set<string>([
  "dev_user_bodyfit:user_valeria",
  "dev_user_bodyfit:user_carlos",
]);

/**
 * GET /api/social/search?q=
 * Busca atletas por @username, nombre o bio
 */
router.get("/search", async (req, res) => {
  const currentUserId = authenticatedUserId(req);
  const q = String(req.query.q ?? "").trim().toLowerCase();

  const results: any[] = [];

  // 1. Buscar en catálogo de leyendas y atletas mock
  for (const athlete of Object.values(mockAthletes)) {
    const matchesQ =
      !q ||
      athlete.username.toLowerCase().includes(q) ||
      athlete.displayName.toLowerCase().includes(q) ||
      athlete.bio.toLowerCase().includes(q) ||
      athlete.fitnessLevel.toLowerCase().includes(q);

    if (matchesQ) {
      const followKey = `${currentUserId}:${athlete.userId}`;
      const isFollowing = inMemoryFollows.has(followKey);
      results.push({
        userId: athlete.userId,
        username: athlete.username,
        displayName: athlete.displayName,
        avatarUrl: athlete.avatarUrl,
        bio: athlete.bio,
        fitnessLevel: athlete.fitnessLevel,
        followersCount: athlete.followersCount + (isFollowing ? 1 : 0),
        followingCount: athlete.followingCount,
        isFollowing,
        isSelf: athlete.userId === currentUserId,
      });
    }
  }

  // 2. Buscar en base de datos PostgreSQL si está conectada
  try {
    if (q) {
      const dbUsers = await db
        .select()
        .from(profiles)
        .where(
          or(
            ilike(profiles.username, `%${q}%`),
            ilike(profiles.displayName, `%${q}%`)
          )
        )
        .limit(10);

      for (const user of dbUsers) {
        if (!results.some((r) => r.userId === user.userId)) {
          const followKey = `${currentUserId}:${user.userId}`;
          const isFollowing = inMemoryFollows.has(followKey);
          results.push({
            userId: user.userId,
            username: user.username || user.userCode,
            displayName: user.displayName || "Atleta BFD",
            avatarUrl: user.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
            bio: user.fitnessGoal ? `Meta: ${user.fitnessGoal}` : "Atleta activo de BodyFit Dynasty",
            fitnessLevel: user.fitnessLevel || "Amateur",
            followersCount: isFollowing ? 1 : 0,
            followingCount: 0,
            isFollowing,
            isSelf: user.userId === currentUserId,
          });
        }
      }
    }
  } catch (err) {
    // Si la DB tiene error o no responde, los resultados en memoria ya están disponibles
  }

  return res.json({ athletes: results });
});

/**
 * GET /api/social/profile/:targetUserIdOrUsername
 * Retorna el perfil público detallado de un atleta
 */
router.get("/profile/:target", async (req, res) => {
  const currentUserId = authenticatedUserId(req);
  const target = req.params.target.toLowerCase();

  // Buscar en mockAthletes por userId o username
  let athlete = Object.values(mockAthletes).find(
    (a) => a.userId.toLowerCase() === target || a.username.toLowerCase() === target
  );

  // Si no está en mockAthletes, buscar en la tabla de perfiles de la DB
  if (!athlete) {
    try {
      const [dbUser] = await db
        .select()
        .from(profiles)
        .where(
          or(
            eq(profiles.userId, target),
            eq(profiles.username, target),
            eq(profiles.userCode, target)
          )
        )
        .limit(1);

      if (dbUser) {
        athlete = {
          userId: dbUser.userId,
          username: dbUser.username || dbUser.userCode,
          displayName: dbUser.displayName || "Atleta BFD",
          avatarUrl: dbUser.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400",
          bio: dbUser.fitnessGoal ? `Objetivo: ${dbUser.fitnessGoal}` : "Compromiso total con el estándar BodyFit Dynasty.",
          heightCm: dbUser.heightCm || "178",
          weightKg: dbUser.weightKg || "78",
          fitnessLevel: dbUser.fitnessLevel || "Intermedio",
          membershipTier: dbUser.membershipTier || "pro",
          followersCount: 15,
          followingCount: 8,
          postsCount: 2,
          medals: [
            { id: "arnold_first", legend: "Arnold Schwarzenegger", title: "Primer Paso al Olimpo", tier: "Bronce", tierColor: "#CD7F32", points: 100, icon: "flag" },
          ],
          posts: [],
        };
      }
    } catch {
      // Ignorar error de DB
    }
  }

  if (!athlete) {
    return res.status(404).json({ message: "Atleta no encontrado." });
  }

  const followKey = `${currentUserId}:${athlete.userId}`;
  const isFollowing = inMemoryFollows.has(followKey);
  const isSelf = athlete.userId === currentUserId;

  return res.json({
    ...athlete,
    followersCount: athlete.followersCount + (isFollowing ? 1 : 0),
    isFollowing,
    isSelf,
  });
});

/**
 * POST /api/social/follow/:targetUserId
 * Alterna el estado de seguimiento (Follow / Unfollow)
 */
router.post("/follow/:targetUserId", async (req, res) => {
  const currentUserId = authenticatedUserId(req);
  const { targetUserId } = req.params;

  if (currentUserId === targetUserId) {
    return res.status(400).json({ message: "No puedes seguirte a ti mismo." });
  }

  const followKey = `${currentUserId}:${targetUserId}`;
  const isCurrentlyFollowing = inMemoryFollows.has(followKey);

  let nowFollowing = false;
  if (isCurrentlyFollowing) {
    inMemoryFollows.delete(followKey);
    nowFollowing = false;
    // Intentar borrar de DB si existe
    try {
      await db
        .delete(socialFollows)
        .where(
          and(
            eq(socialFollows.followerId, currentUserId),
            eq(socialFollows.followingId, targetUserId)
          )
        );
    } catch {
      // Fallback memoria
    }
  } else {
    inMemoryFollows.add(followKey);
    nowFollowing = true;
    // Intentar insertar en DB
    try {
      await db.insert(socialFollows).values({
        followerId: currentUserId,
        followingId: targetUserId,
      });
    } catch {
      // Fallback memoria
    }
  }

  // Calcular nuevo conteo para el atleta objetivo
  const baseAthlete = mockAthletes[targetUserId];
  const baseFollowers = baseAthlete ? baseAthlete.followersCount : 10;
  const currentFollowersCount = baseFollowers + (nowFollowing ? 1 : 0);

  if (nowFollowing) {
    createNotification({
      recipientId: targetUserId,
      actorId: currentUserId,
      actorName: "Esteban Entrenador",
      actorUsername: "esteban_coach",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      type: "follow",
      actionText: "comenzó a seguirte en BodyFit Dynasty",
      detailText: "¡Visita su perfil para ver sus entrenamientos y progresos!",
      targetId: currentUserId,
    }).catch(() => {});
  }

  return res.json({
    success: true,
    isFollowing: nowFollowing,
    followersCount: currentFollowersCount,
    targetUserId,
  });
});

/**
 * GET /api/social/status/:targetUserId
 * Consulta rápida de estado de seguimiento
 */
router.get("/status/:targetUserId", (req, res) => {
  const currentUserId = authenticatedUserId(req);
  const { targetUserId } = req.params;
  const followKey = `${currentUserId}:${targetUserId}`;
  const isFollowing = inMemoryFollows.has(followKey);

  const baseAthlete = mockAthletes[targetUserId];
  const baseFollowers = baseAthlete ? baseAthlete.followersCount : 10;

  return res.json({
    isFollowing,
    followersCount: baseFollowers + (isFollowing ? 1 : 0),
    isSelf: currentUserId === targetUserId,
  });
});

/**
 * GET /api/social/following
 * Retorna la lista de IDs de usuarios a los que sigue el usuario actual
 */
router.get("/following", (req, res) => {
  const currentUserId = authenticatedUserId(req);
  const following: string[] = [];
  for (const follow of inMemoryFollows) {
    const [follower, target] = follow.split(":");
    if (follower === currentUserId) {
      following.push(target);
    }
  }
  return res.json({ following });
});

export default router;
