import { getAuth } from "@clerk/express";
import { CreateCommunityPostBody, CreateCommunityPostCommentBody } from "@workspace/api-zod";
import { and, count, desc, eq, inArray } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { communityComments, communityLikes, communityPosts, db, profiles } from "@workspace/db";
import { getOrCreateProfile } from "./profile-service";
import { getAuthenticatedUserId } from "../lib/auth";
import { inMemoryFollows } from "./social";
import { createNotification } from "./notifications";

const router: IRouter = Router();

function authenticatedUserId(req: Parameters<typeof getAuth>[0]) {
  return getAuthenticatedUserId(req);
}

// Publicaciones interactivas iniciales para mantener la comunidad activa y viva
let inMemoryPosts: any[] = [
  {
    id: "post-demo-medal-1",
    userId: "user_jesus_david",
    postType: "achievement",
    caption: "¡Nueva medalla Dynasty desbloqueada! La disciplina y el esfuerzo diario dan sus frutos. Sigamos construyendo la dinastía 🏆⚡",
    workoutSummary: null,
    achievementData: {
      medalId: "dynasty_titan_1",
      legend: "Dynasty Élite",
      legendAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80",
      title: "Titán de la Fuerza",
      quote: "La fuerza no viene de ganar. Tus luchas diarias forjan tu verdadero poder.",
      tier: "Diamante",
      tierColor: "#38BDF8",
      points: 2500,
    },
    mediaUrl: null,
    username: "jesus_david_fit",
    displayName: "Jesús David",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    likeCount: 95,
    commentCount: 18,
    liked: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  },
  {
    id: "post-demo-1",
    userId: "user_valeria",
    postType: "workout",
    caption: "¡Día de pierna superado! Nueva marca personal en sentadilla libre (4x8 con 80kg). La disciplina y la constancia no se negocian 💪🔥",
    workoutSummary: "Pierna & Glúteos · 52 min",
    mediaUrl: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80",
    username: "valeria_fit",
    displayName: "Valeria Montero",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    likeCount: 24,
    commentCount: 4,
    liked: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: "post-demo-2",
    userId: "user_carlos",
    postType: "meal",
    caption: "Almuerzo post-entreno listo: 150g de salmón salvaje al horno con arroz integral y brócoli al vapor. Cumpliendo los macros del plan Platinum 🥗🥑",
    workoutSummary: null,
    mediaUrl: "https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80",
    username: "carlos_dynasty",
    displayName: "Carlos Mora",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    likeCount: 42,
    commentCount: 6,
    liked: true,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: "post-demo-3",
    userId: "dev_user_bodyfit",
    postType: "progress",
    caption: "¡Bienvenidos a la comunidad oficial de BodyFit Dynasty! Aquí compartimos nuestros entrenos, comidas saludables y motivación diaria. ¡A romperla equipo!",
    workoutSummary: "Full Body Dynasty · 60 min",
    mediaUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80",
    username: "esteban_coach",
    displayName: "Esteban Entrenador",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    likeCount: 68,
    commentCount: 15,
    liked: true,
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
  },
  {
    id: "post-demo-4",
    userId: "user_sofi",
    postType: "workout",
    caption: "Rutina de Hombro y Tríceps completada en 42 minutos. Sentir el progreso semana a semana no tiene precio ⚡️",
    workoutSummary: "Hombro & Tríceps · 42 min",
    mediaUrl: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80",
    username: "sofi_cross",
    displayName: "Sofía Navarro",
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
    likeCount: 19,
    commentCount: 3,
    liked: false,
    createdAt: new Date(Date.now() - 720 * 60 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 720 * 60 * 1000).toISOString(),
  },
];

let inMemoryComments: Record<string, any[]> = {
  "post-demo-1": [
    { id: "c1", postId: "post-demo-1", userId: "dev_user_bodyfit", displayName: "Esteban Entrenador", username: "esteban_coach", body: "¡Esa es la actitud, Valeria! Excelente peso y técnica.", createdAt: new Date(Date.now() - 20 * 60 * 1000).toISOString() },
    { id: "c2", postId: "post-demo-1", userId: "user_carlos", displayName: "Carlos Mora", username: "carlos_dynasty", body: "¡Bestial marca! A seguir sumando.", createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString() },
  ],
  "post-demo-2": [
    { id: "c3", postId: "post-demo-2", userId: "user_valeria", displayName: "Valeria Montero", username: "valeria_fit", body: "Ese salmón se ve increíble, qué buena receta.", createdAt: new Date(Date.now() - 80 * 60 * 1000).toISOString() },
  ],
  "post-demo-3": [
    { id: "c4", postId: "post-demo-3", userId: "user_sofi", displayName: "Sofía Navarro", username: "sofi_cross", body: "¡Con toda coach! El mejor plan de entrenamiento.", createdAt: new Date(Date.now() - 250 * 60 * 1000).toISOString() },
  ],
};

async function formatPosts(userId: string, onlyPostId?: string) {
  try {
    const rows = await db
      .select({
        post: communityPosts,
        username: profiles.username,
        displayName: profiles.displayName,
        avatarUrl: profiles.avatarUrl,
      })
      .from(communityPosts)
      .leftJoin(profiles, eq(communityPosts.userId, profiles.userId))
      .orderBy(desc(communityPosts.createdAt))
      .limit(onlyPostId ? 1 : 50);

    const filtered = onlyPostId ? rows.filter(({ post }) => post.id === onlyPostId) : rows;
    if (filtered.length > 0) {
      const postIds = filtered.map(({ post }) => post.id);
      const [likeCounts, commentCounts, viewerLikes] = await Promise.all([
        db
          .select({ postId: communityLikes.postId, value: count() })
          .from(communityLikes)
          .where(inArray(communityLikes.postId, postIds))
          .groupBy(communityLikes.postId),
        db
          .select({ postId: communityComments.postId, value: count() })
          .from(communityComments)
          .where(inArray(communityComments.postId, postIds))
          .groupBy(communityComments.postId),
        db.select({ postId: communityLikes.postId }).from(communityLikes).where(
          and(inArray(communityLikes.postId, postIds), eq(communityLikes.userId, userId)),
        ),
      ]);
      const likesByPost = new Map(likeCounts.map((row) => [row.postId, row.value]));
      const commentsByPost = new Map(commentCounts.map((row) => [row.postId, row.value]));
      const likedPosts = new Set(viewerLikes.map((row) => row.postId));

      return filtered.map(({ post, username, displayName, avatarUrl }) => ({
        ...post,
        username: username ?? null,
        displayName: displayName?.trim() || "Miembro BodyFit",
        avatarUrl: avatarUrl ?? null,
        likeCount: likesByPost.get(post.id) ?? 0,
        commentCount: commentsByPost.get(post.id) ?? 0,
        liked: likedPosts.has(post.id),
      }));
    }
  } catch {
    // Si la BD no está disponible, cae de forma segura a inMemoryPosts
  }

  if (onlyPostId) {
    return inMemoryPosts.filter((p) => p.id === onlyPostId);
  }
  return inMemoryPosts;
}

router.get("/community/posts", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    try {
      await getOrCreateProfile(userId);
    } catch {}
    let posts = await formatPosts(userId);
    const feed = req.query.feed as string;
    if (feed === "following") {
      posts = posts.filter(
        (p) => p.userId === userId || inMemoryFollows.has(`${userId}:${p.userId}`)
      );
    }
    return res.json({ posts });
  } catch (error) {
    const userId = authenticatedUserId(req);
    let posts = inMemoryPosts;
    const feed = req.query.feed as string;
    if (feed === "following") {
      posts = posts.filter(
        (p) => p.userId === userId || inMemoryFollows.has(`${userId}:${p.userId}`)
      );
    }
    return res.json({ posts });
  }
});

router.post("/community/posts", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    const body = CreateCommunityPostBody.parse(req.body);
    const workoutSummary = typeof (req.body as any).workoutSummary === "string" && (req.body as any).workoutSummary.trim()
      ? (req.body as any).workoutSummary.trim()
      : null;
    const achievementData = (req.body as any).achievementData ?? null;

    if (body.mediaUrl) {
      try {
        const url = new URL(body.mediaUrl);
        if (url.protocol !== "https:" && url.protocol !== "http:") throw new Error("unsupported protocol");
      } catch {
        return res.status(400).json({ error: "El medio debe ser una URL pública http o https." });
      }
    }

    let profile: any = null;
    try {
      profile = await getOrCreateProfile(userId);
    } catch {}

    const newPost = {
      id: `post-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId,
      postType: body.postType,
      caption: body.caption.trim(),
      mediaUrl: body.mediaUrl ?? null,
      workoutSummary,
      achievementData,
      username: profile?.username || "esteban_coach",
      displayName: profile?.displayName || "Esteban Entrenador",
      avatarUrl: profile?.avatarUrl || null,
      likeCount: 0,
      commentCount: 0,
      liked: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const [dbPost] = await db
        .insert(communityPosts)
        .values({
          userId,
          postType: body.postType,
          caption: body.caption.trim(),
          mediaUrl: body.mediaUrl ?? null,
          workoutSummary,
          achievementData,
        })
        .returning();
      if (dbPost) {
        const [formatted] = await formatPosts(userId, dbPost.id);
        if (formatted) {
          if (body.postType === "achievement" && achievementData) {
            createNotification({
              recipientId: userId,
              actorId: "system",
              actorName: "BodyFit Dynasty",
              actorUsername: "dynasty_hq",
              avatarUrl: achievementData.legendAvatar || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200",
              type: "award",
              actionText: `compartiste la medalla "${achievementData.title}" en la comunidad`,
              detailText: `+${achievementData.points} Puntos Dynasty celebrados con los atletas`,
              targetId: dbPost.id,
              targetPreview: achievementData.title,
            }).catch(() => {});
          }
          return res.status(201).json(formatted);
        }
      }
    } catch {
      // Guardar en memoria si la BD no está disponible
    }

    if (body.postType === "achievement" && achievementData) {
      createNotification({
        recipientId: userId,
        actorId: "system",
        actorName: "BodyFit Dynasty",
        actorUsername: "dynasty_hq",
        avatarUrl: achievementData.legendAvatar || "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200",
        type: "award",
        actionText: `compartiste la medalla "${achievementData.title}" en la comunidad`,
        detailText: `+${achievementData.points} Puntos Dynasty celebrados con los atletas`,
        targetId: newPost.id,
        targetPreview: achievementData.title,
      }).catch(() => {});
    }

    inMemoryPosts.unshift(newPost);
    return res.status(201).json(newPost);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo publicar." });
  }
});

router.post("/community/posts/:postId/likes", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    const postId = req.params.postId;

    // Intentar en base de datos
    try {
      const [existing] = await db
        .select({ postId: communityLikes.postId })
        .from(communityLikes)
        .where(and(eq(communityLikes.postId, postId), eq(communityLikes.userId, userId)))
        .limit(1);
      if (existing) {
        await db.delete(communityLikes).where(and(eq(communityLikes.postId, postId), eq(communityLikes.userId, userId)));
      } else {
        await db.insert(communityLikes).values({ postId, userId }).onConflictDoNothing();
      }
      const [{ value: likeCount }] = await db
        .select({ value: count() })
        .from(communityLikes)
        .where(eq(communityLikes.postId, postId));
      return res.json({ liked: !existing, likeCount });
    } catch {}

    // Fallback en memoria
    const post = inMemoryPosts.find((p) => p.id === postId);
    if (post) {
      post.liked = !post.liked;
      post.likeCount += post.liked ? 1 : -1;

      if (post.liked && post.userId !== userId) {
        getOrCreateProfile(userId).then((likerProfile) => {
          createNotification({
            recipientId: post.userId,
            actorId: userId,
            actorName: likerProfile?.displayName || "Atleta BodyFit",
            actorUsername: likerProfile?.username || "atleta",
            avatarUrl: likerProfile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
            type: "like",
            actionText: "le dio me gusta a tu publicación",
            targetId: postId,
            targetPreview: post.caption.slice(0, 50),
          }).catch(() => {});
        }).catch(() => {});
      }

      return res.json({ liked: post.liked, likeCount: Math.max(0, post.likeCount) });
    }

    return res.json({ liked: true, likeCount: 1 });
  } catch (error) {
    return res.status(200).json({ liked: true, likeCount: 1 });
  }
});

router.get("/community/posts/:postId/comments", async (req, res) => {
  try {
    authenticatedUserId(req);
    const postId = req.params.postId;

    try {
      const rows = await db
        .select({
          comment: communityComments,
          username: profiles.username,
          displayName: profiles.displayName,
        })
        .from(communityComments)
        .leftJoin(profiles, eq(communityComments.userId, profiles.userId))
        .where(eq(communityComments.postId, postId))
        .orderBy(desc(communityComments.createdAt))
        .limit(100);

      if (rows.length > 0) {
        return res.json({
          comments: rows.map(({ comment, username, displayName }) => ({
            ...comment,
            username: username ?? null,
            displayName: displayName?.trim() || "Miembro BodyFit",
          })),
        });
      }
    } catch {}

    return res.json({ comments: inMemoryComments[postId] || [] });
  } catch (error) {
    return res.json({ comments: [] });
  }
});

router.post("/community/posts/:postId/comments", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    const postId = req.params.postId;
    const body = CreateCommunityPostCommentBody.parse(req.body);

    let profile: any = null;
    try {
      profile = await getOrCreateProfile(userId);
    } catch {}

    const newComment = {
      id: `comment-${Date.now()}`,
      postId,
      userId,
      body: body.body.trim(),
      username: profile?.username || "esteban_coach",
      displayName: profile?.displayName || "Esteban Entrenador",
      createdAt: new Date().toISOString(),
    };

    try {
      const [comment] = await db
        .insert(communityComments)
        .values({ postId, userId, body: body.body.trim() })
        .returning();
      if (comment) {
        return res.status(201).json({
          ...comment,
          username: profile?.username ?? null,
          displayName: profile?.displayName?.trim() || "Miembro BodyFit",
        });
      }
    } catch {}

    if (!inMemoryComments[postId]) inMemoryComments[postId] = [];
    inMemoryComments[postId].unshift(newComment);
    const post = inMemoryPosts.find((p) => p.id === postId);
    if (post) {
      post.commentCount += 1;
      if (post.userId !== userId) {
        createNotification({
          recipientId: post.userId,
          actorId: userId,
          actorName: profile?.displayName || "Atleta BodyFit",
          actorUsername: profile?.username || "atleta",
          avatarUrl: profile?.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
          type: "comment",
          actionText: "comentó en tu publicación",
          detailText: body.body.trim().slice(0, 100),
          targetId: postId,
          targetPreview: post.caption.slice(0, 50),
        }).catch(() => {});
      }
    }

    return res.status(201).json(newComment);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo publicar el comentario." });
  }
});

export interface CommunityChallenge {
  id: string;
  title: string;
  badge: string;
  description: string;
  category: "strength" | "steps" | "streak" | "nutrition";
  targetCount: number;
  targetUnit: string;
  rewardPoints: number;
  rewardMedal: string;
  daysRemaining: number;
  participantsCount: number;
  isJoined: boolean;
  userProgress: number;
}

export let inMemoryChallenges: CommunityChallenge[] = [
  {
    id: "challenge-week-1",
    title: "Semana Legendaria: 5 Sesiones de Fuerza",
    badge: "🔥 RETO OFICIAL DYNASTY",
    description: "Supera el umbral junto a la dinastía. Completa y registra al menos 5 entrenamientos esta semana.",
    category: "strength",
    targetCount: 5,
    targetUnit: "sesiones",
    rewardPoints: 500,
    rewardMedal: "Disciplina de Hierro 🛡️",
    daysRemaining: 4,
    participantsCount: 1284,
    isJoined: true,
    userProgress: 3,
  },
  {
    id: "challenge-week-2",
    title: "Dynasty Cardio Burn: 70,000 Pasos",
    badge: "⚡ RETO DE RESISTENCIA",
    description: "Activa tu gasto calórico diario. Alcanza 70,000 pasos acumulados de lunes a domingo.",
    category: "steps",
    targetCount: 70000,
    targetUnit: "pasos",
    rewardPoints: 400,
    rewardMedal: "Caminante Dorado 👟",
    daysRemaining: 5,
    participantsCount: 896,
    isJoined: false,
    userProgress: 42500,
  },
];

/**
 * GET /api/community/challenges
 * Retorna los retos semanales activos de la comunidad
 */
router.get("/community/challenges", async (_req, res) => {
  return res.json({ challenges: inMemoryChallenges });
});

/**
 * POST /api/community/challenges/:id/join
 * Inscribe al atleta en el reto semanal de la dinastía
 */
router.post("/community/challenges/:id/join", async (req, res) => {
  const userId = authenticatedUserId(req);
  const { id } = req.params;
  const challenge = inMemoryChallenges.find((c) => c.id === id);
  if (!challenge) {
    return res.status(404).json({ error: "Reto no encontrado." });
  }

  if (!challenge.isJoined) {
    challenge.isJoined = true;
    challenge.participantsCount += 1;

    createNotification({
      recipientId: userId,
      actorId: "system",
      actorName: "BodyFit Dynasty",
      actorUsername: "dynasty_hq",
      avatarUrl: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=200",
      type: "award",
      actionText: "te has inscrito exitosamente al reto semanal",
      detailText: `¡Vas por ${challenge.rewardPoints} Puntos Dynasty y la medalla "${challenge.rewardMedal}"!`,
      targetId: challenge.id,
      targetPreview: challenge.title,
    }).catch(() => {});
  }

  return res.json({ success: true, challenge });
});

export default router;