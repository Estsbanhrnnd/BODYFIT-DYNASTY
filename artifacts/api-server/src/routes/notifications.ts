import { getAuth } from "@clerk/express";
import { Router, type IRouter } from "express";
import { db, notifications } from "@workspace/db";
import { and, desc, eq } from "drizzle-orm";
import { getAuthenticatedUserId } from "../lib/auth";

const router: IRouter = Router();

function authenticatedUserId(req: Parameters<typeof getAuth>[0]) {
  return getAuthenticatedUserId(req);
}

export interface AppNotificationItem {
  id: string;
  recipientId: string;
  actorId: string;
  actorName: string;
  actorUsername?: string;
  avatarUrl?: string;
  type: "like" | "comment" | "follow" | "gift_code" | "award";
  actionText: string;
  detailText?: string;
  targetId?: string;
  targetPreview?: string;
  isRead: boolean;
  createdAt: string;
}

// Almacén en memoria persistente durante la sesión del servidor
export let inMemoryNotifications: AppNotificationItem[] = [
  {
    id: "notif-seed-1",
    recipientId: "dev_user_bodyfit",
    actorId: "user_valeria",
    actorName: "Valeria Montero",
    actorUsername: "valeria_fit",
    avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
    type: "comment",
    actionText: "comentó en tu entrenamiento de hoy",
    detailText: "¡Increíble la técnica y el volumen de carga! A seguir con todo 💪🔥",
    targetId: "post-demo-3",
    targetPreview: "Full Body Dynasty · 60 min",
    isRead: false,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-seed-2",
    recipientId: "dev_user_bodyfit",
    actorId: "user_carlos",
    actorName: "Carlos Mora",
    actorUsername: "carlos_dynasty",
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200",
    type: "like",
    actionText: "le dio me gusta a tu publicación",
    targetId: "post-demo-3",
    targetPreview: "Full Body Dynasty · 60 min",
    isRead: false,
    createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-seed-3",
    recipientId: "dev_user_bodyfit",
    actorId: "user_davidlaid",
    actorName: "David Laid",
    actorUsername: "davidlaid",
    avatarUrl: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200",
    type: "follow",
    actionText: "comenzó a seguirte en BodyFit Dynasty",
    detailText: "¡Visita su perfil para ver sus entrenos de estética y fuerza!",
    targetId: "user_davidlaid",
    isRead: false,
    createdAt: new Date(Date.now() - 60 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-seed-4",
    recipientId: "dev_user_bodyfit",
    actorId: "user_cbum",
    actorName: "Chris Bumstead",
    actorUsername: "cbum",
    avatarUrl: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200",
    type: "award",
    actionText: "te desbloqueó la medalla 'Classic Discipline'",
    detailText: "Has registrado tus entrenamientos con disciplina estricta de campeonato.",
    targetId: "cbum_classic",
    isRead: true,
    createdAt: new Date(Date.now() - 180 * 60 * 1000).toISOString(),
  },
  {
    id: "notif-seed-5",
    recipientId: "dev_user_bodyfit",
    actorId: "admin",
    actorName: "BodyFit Dynasty Admin",
    actorUsername: "admin_dynasty",
    avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
    type: "gift_code",
    actionText: "te otorgó una Membresía de Regalía Platinum",
    detailText: "Todos los beneficios y módulos avanzados han sido desbloqueados para tu cuenta.",
    targetId: "membership",
    isRead: true,
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
  },
];

/**
 * Función global exportada para crear notificaciones desde cualquier módulo
 */
export async function createNotification(params: {
  recipientId: string;
  actorId: string;
  actorName: string;
  actorUsername?: string;
  avatarUrl?: string;
  type: "like" | "comment" | "follow" | "gift_code" | "award";
  actionText: string;
  detailText?: string;
  targetId?: string;
  targetPreview?: string;
}) {
  const newNotif: AppNotificationItem = {
    id: `notif-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    recipientId: params.recipientId,
    actorId: params.actorId,
    actorName: params.actorName,
    actorUsername: params.actorUsername,
    avatarUrl: params.avatarUrl,
    type: params.type,
    actionText: params.actionText,
    detailText: params.detailText,
    targetId: params.targetId,
    targetPreview: params.targetPreview,
    isRead: false,
    createdAt: new Date().toISOString(),
  };

  // Intentar guardar en base de datos PostgreSQL
  try {
    const [dbNotif] = await db
      .insert(notifications)
      .values({
        recipientId: params.recipientId,
        actorId: params.actorId,
        actorName: params.actorName,
        actorUsername: params.actorUsername,
        avatarUrl: params.avatarUrl,
        type: params.type,
        actionText: params.actionText,
        detailText: params.detailText,
        targetId: params.targetId,
        targetPreview: params.targetPreview,
        isRead: false,
      })
      .returning();

    if (dbNotif) {
      newNotif.id = dbNotif.id;
    }
  } catch (err) {
    // Continuar con memoria si la BD no está disponible
  }

  inMemoryNotifications.unshift(newNotif);
  return newNotif;
}

/**
 * GET /api/notifications
 * Retorna las notificaciones del usuario autenticado ordenadas por fecha
 */
router.get("/", async (req, res) => {
  const currentUserId = authenticatedUserId(req);

  let userNotifs: AppNotificationItem[] = [];

  try {
    const dbNotifs = await db
      .select()
      .from(notifications)
      .where(eq(notifications.recipientId, currentUserId))
      .orderBy(desc(notifications.createdAt))
      .limit(50);

    if (dbNotifs.length > 0) {
      userNotifs = dbNotifs.map((n) => ({
        id: n.id,
        recipientId: n.recipientId,
        actorId: n.actorId,
        actorName: n.actorName,
        actorUsername: n.actorUsername ?? undefined,
        avatarUrl: n.avatarUrl ?? undefined,
        type: n.type as any,
        actionText: n.actionText,
        detailText: n.detailText ?? undefined,
        targetId: n.targetId ?? undefined,
        targetPreview: n.targetPreview ?? undefined,
        isRead: n.isRead,
        createdAt: n.createdAt.toISOString(),
      }));
    }
  } catch (err) {
    // Fallback a memoria
  }

  if (userNotifs.length === 0) {
    userNotifs = inMemoryNotifications.filter(
      (n) => n.recipientId === currentUserId || n.recipientId === "dev_user_bodyfit"
    );
  }

  const unreadCount = userNotifs.filter((n) => !n.isRead).length;

  return res.json({
    notifications: userNotifs,
    unreadCount,
  });
});

/**
 * POST /api/notifications/:id/read
 * Marca una notificación específica como leída
 */
router.post("/:id/read", async (req, res) => {
  const currentUserId = authenticatedUserId(req);
  const { id } = req.params;

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(and(eq(notifications.id, id), eq(notifications.recipientId, currentUserId)));
  } catch {}

  const memoryItem = inMemoryNotifications.find((n) => n.id === id);
  if (memoryItem) {
    memoryItem.isRead = true;
  }

  return res.json({ success: true, id });
});

/**
 * POST /api/notifications/read-all
 * Marca todas las notificaciones del usuario como leídas
 */
router.post("/read-all", async (req, res) => {
  const currentUserId = authenticatedUserId(req);

  try {
    await db
      .update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.recipientId, currentUserId));
  } catch {}

  for (const n of inMemoryNotifications) {
    if (n.recipientId === currentUserId || n.recipientId === "dev_user_bodyfit") {
      n.isRead = true;
    }
  }

  return res.json({ success: true, unreadCount: 0 });
});

export default router;
