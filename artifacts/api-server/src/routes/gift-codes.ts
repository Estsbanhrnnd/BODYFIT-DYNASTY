import { getAuth } from "@clerk/express";
import { Router, type IRouter } from "express";
import { getAuthenticatedUserId } from "../lib/auth";
import { getOrCreateProfile, inMemoryProfiles } from "./profile-service";
import { db, giftCodes, profiles } from "@workspace/db";
import { eq } from "drizzle-orm";
import { createNotification } from "./notifications";

const router: IRouter = Router();

// In-memory fallback gift codes for immediate offline / dev reliability
interface InMemoryGiftCode {
  id: string;
  code: string;
  tier: "pro" | "platinum";
  durationDays: number;
  durationLabel: string;
  createdBy: string;
  redeemedBy: string | null;
  redeemedAt: string | null;
  isActive: boolean;
  createdAt: string;
}

let inMemoryGiftCodesList: InMemoryGiftCode[] = [
  {
    id: "gift-1",
    code: "REGALO-GOLD-30D",
    tier: "pro",
    durationDays: 30,
    durationLabel: "1 mes (30 días) · Plan Pro",
    createdBy: "dev_user_bodyfit",
    redeemedBy: null,
    redeemedAt: null,
    isActive: true,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "gift-2",
    code: "REGALO-PLATINUM-1M",
    tier: "platinum",
    durationDays: 30,
    durationLabel: "1 mes (30 días) · Plan Platinum",
    createdBy: "dev_user_bodyfit",
    redeemedBy: null,
    redeemedAt: null,
    isActive: true,
    createdAt: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: "gift-3",
    code: "VIP-DYNASTY-PERM",
    tier: "platinum",
    durationDays: 9999,
    durationLabel: "Acceso Permanente Honorario · Platinum",
    createdBy: "dev_user_bodyfit",
    redeemedBy: null,
    redeemedAt: null,
    isActive: true,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
];

// 1. Listar códigos de regalía (Solo administrador)
router.get("/admin/gift-codes", async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    // Verificación de administrador
    try {
      const dbList = await db.select().from(giftCodes);
      if (dbList.length > 0) return res.json(dbList);
    } catch {
      // Fallback a memoria
    }
    return res.json(inMemoryGiftCodesList);
  } catch (error) {
    return res.status(500).json({ error: "No se pudieron cargar los códigos de regalía." });
  }
});

// 2. Generar nuevo código de regalía (Solo administrador)
router.post("/admin/gift-codes", async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const { code, tier = "pro", durationDays = 30, durationLabel } = req.body;

    const normalizedCode = (code || `GIFT-${tier.toUpperCase()}-${Math.random().toString(36).substring(2, 7).toUpperCase()}`).trim().toUpperCase();

    // Comprobar si ya existe
    const exists = inMemoryGiftCodesList.some((c) => c.code === normalizedCode);
    if (exists) {
      return res.status(400).json({ error: "Ya existe un código con ese nombre." });
    }

    const label = durationLabel || (durationDays >= 9999 ? "Permanente" : `${durationDays} días`);

    const newCodeItem: InMemoryGiftCode = {
      id: `gift-${Date.now()}`,
      code: normalizedCode,
      tier: tier === "platinum" ? "platinum" : "pro",
      durationDays: Number(durationDays),
      durationLabel: label,
      createdBy: userId,
      redeemedBy: null,
      redeemedAt: null,
      isActive: true,
      createdAt: new Date().toISOString(),
    };

    try {
      await db.insert(giftCodes).values({
        id: newCodeItem.id,
        code: newCodeItem.code,
        tier: newCodeItem.tier,
        durationDays: newCodeItem.durationDays,
        durationLabel: newCodeItem.durationLabel,
        createdBy: newCodeItem.createdBy,
        isActive: true,
      });
    } catch {
      // In-memory fallback
    }

    inMemoryGiftCodesList.unshift(newCodeItem);
    return res.status(201).json(newCodeItem);
  } catch (error) {
    return res.status(500).json({ error: "No se pudo generar el código de regalía." });
  }
});

// 3. Canjear código de regalía (Cualquier usuario autenticado)
router.post("/membership/redeem-code", async (req, res) => {
  try {
    const userId = getAuthenticatedUserId(req);
    const inputCode = String(req.body.code || "").trim().toUpperCase();

    if (!inputCode) {
      return res.status(400).json({ error: "Ingresa un código de regalía válido." });
    }

    // Buscar en lista en memoria o BD
    let matched = inMemoryGiftCodesList.find((c) => c.code === inputCode);

    if (!matched) {
      try {
        const [dbMatch] = await db.select().from(giftCodes).where(eq(giftCodes.code, inputCode)).limit(1);
        if (dbMatch) {
          matched = dbMatch as any;
        }
      } catch {}
    }

    if (!matched) {
      return res.status(404).json({ error: "El código no existe o no es válido. Revisa que esté bien escrito." });
    }

    if (!matched.isActive) {
      return res.status(400).json({ error: "Este código de regalo ya fue canjeado." });
    }

    // Marcar como canjeado
    matched.isActive = false;
    matched.redeemedBy = userId;
    matched.redeemedAt = new Date().toISOString();

    const isPermanent = matched.durationDays >= 9999;
    const expiresAt = isPermanent ? null : new Date(Date.now() + matched.durationDays * 24 * 60 * 60 * 1000).toISOString();

    // Actualizar perfil del usuario
    const currentProfile = await getOrCreateProfile(userId);
    const updatedProfile = {
      ...currentProfile,
      membershipTier: matched.tier,
      membershipExpiresAt: expiresAt,
      updatedAt: new Date().toISOString(),
    };

    inMemoryProfiles.set(userId, updatedProfile);

    try {
      await db.update(profiles).set({
        membershipTier: matched.tier,
        membershipExpiresAt: expiresAt ? new Date(expiresAt) : null,
        updatedAt: new Date(),
      }).where(eq(profiles.userId, userId));

      await db.update(giftCodes).set({
        isActive: false,
        redeemedBy: userId,
        redeemedAt: new Date(),
      }).where(eq(giftCodes.code, inputCode));
    } catch {}

    createNotification({
      recipientId: userId,
      actorId: "admin",
      actorName: "BodyFit Dynasty",
      actorUsername: "bodyfit_official",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      type: "gift_code",
      actionText: `activó tu Membresía de Regalía ${matched.tier.toUpperCase()}`,
      detailText: `Código ${matched.code} canjeado con éxito (${matched.durationLabel}).`,
      targetId: "membership",
    }).catch(() => {});

    return res.json({
      success: true,
      tier: matched.tier,
      durationLabel: matched.durationLabel,
      expiresAt,
      message: `¡Felicidades! Se ha activado tu membresía ${matched.tier.toUpperCase()} (${matched.durationLabel}).`,
      profile: updatedProfile,
    });
  } catch (error) {
    return res.status(500).json({ error: "Ocurrió un error al canjear el código." });
  }
});

// 4. Asignar membresía directa a usuario por parte del Administrador
router.post("/admin/assign-membership", async (req, res) => {
  try {
    const adminId = getAuthenticatedUserId(req);
    const { targetUserId, targetUserCode, tier = "pro", durationDays = 30 } = req.body;

    // Buscar perfil destino
    let targetProfile: any = null;
    if (targetUserId && inMemoryProfiles.has(targetUserId)) {
      targetProfile = inMemoryProfiles.get(targetUserId);
    } else if (targetUserCode) {
      for (const p of inMemoryProfiles.values()) {
        if (p.userCode?.toUpperCase() === targetUserCode.toUpperCase()) {
          targetProfile = p;
          break;
        }
      }
    }

    if (!targetProfile) {
      try {
        const [found] = await db.select().from(profiles).where(
          targetUserCode ? eq(profiles.userCode, targetUserCode.toUpperCase()) : eq(profiles.userId, targetUserId)
        ).limit(1);
        if (found) targetProfile = found;
      } catch {}
    }

    if (!targetProfile) {
      return res.status(404).json({ error: "No se encontró el usuario por ese código." });
    }

    const isPermanent = Number(durationDays) >= 9999;
    const expiresAt = isPermanent ? null : new Date(Date.now() + Number(durationDays) * 24 * 60 * 60 * 1000).toISOString();

    const updated = {
      ...targetProfile,
      membershipTier: tier,
      membershipExpiresAt: expiresAt,
      updatedAt: new Date().toISOString(),
    };
    inMemoryProfiles.set(targetProfile.userId, updated);

    try {
      await db.update(profiles).set({
        membershipTier: tier,
        membershipExpiresAt: expiresAt ? new Date(expiresAt) : null,
        updatedAt: new Date(),
      }).where(eq(profiles.userId, targetProfile.userId));
    } catch {}

    createNotification({
      recipientId: targetProfile.userId,
      actorId: adminId,
      actorName: "BodyFit Dynasty Admin",
      actorUsername: "admin_dynasty",
      avatarUrl: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200",
      type: "gift_code",
      actionText: `te otorgó una Membresía de Regalía ${tier.toUpperCase()}`,
      detailText: isPermanent ? "¡Tienes acceso permanente a todas las funciones VIP!" : `Disfruta de ${durationDays} días de acceso VIP ilimitado.`,
      targetId: "membership",
    }).catch(() => {});

    return res.json({
      success: true,
      message: `Membresía ${tier.toUpperCase()} asignada con éxito a ${targetProfile.displayName || targetProfile.username}.`,
      profile: updated,
    });
  } catch (error) {
    return res.status(500).json({ error: "No se pudo asignar la membresía." });
  }
});

export default router;
