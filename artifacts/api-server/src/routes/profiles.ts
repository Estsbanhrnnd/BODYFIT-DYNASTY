import { getAuth } from "@clerk/express";
import { UpdateMyProfileBody } from "@workspace/api-zod";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, profiles } from "@workspace/db";
import { getOrCreateProfile, inMemoryProfiles } from "./profile-service";

import { getAuthenticatedUserId } from "../lib/auth";

const router: IRouter = Router();
const THEMES = new Set(["purple", "crimson", "ocean", "forest", "amber", "rose", "ice", "neon", "lavender", "graphite"]);

function authenticatedUserId(req: Parameters<typeof getAuth>[0]) {
  return getAuthenticatedUserId(req);
}

router.get("/profile/me", async (req, res) => {
  try {
    const profile = await getOrCreateProfile(authenticatedUserId(req));
    return res.json(profile);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    req.log.error({ errorName: error instanceof Error ? error.name : "UnknownError" }, "Profile read failed");
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo cargar el perfil." });
  }
});

router.patch("/profile/me", async (req, res) => {
  let userId: string;
  let patch: ReturnType<typeof UpdateMyProfileBody.parse>;
  try {
    userId = authenticatedUserId(req);
    patch = UpdateMyProfileBody.parse(req.body);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return res.status(status).json({ error: error instanceof Error ? error.message : "Los datos del perfil no son válidos." });
  }

  try {
    const current = await getOrCreateProfile(userId);
    const changes = { ...patch, updatedAt: new Date() };

    if (patch.displayName !== undefined) changes.displayName = patch.displayName.trim();
    if (patch.username !== undefined) {
      const username = patch.username.trim().toLowerCase();
      if (!/^[a-z0-9_.-]{3,24}$/.test(username)) {
        return res.status(400).json({ error: "El nombre de usuario debe tener 3–24 caracteres: letras, números, punto o guion." });
      }
      changes.username = username;
    }
    if (patch.themeKey !== undefined && !THEMES.has(patch.themeKey)) {
      return res.status(400).json({ error: "El tema seleccionado no está disponible." });
    }
    if (patch.avatarUrl) {
      const trimmed = patch.avatarUrl.trim();
      const isAllowed =
        trimmed.startsWith('http://') ||
        trimmed.startsWith('https://') ||
        trimmed.startsWith('data:') ||
        trimmed.startsWith('file://') ||
        trimmed.startsWith('content://') ||
        trimmed.startsWith('blob:') ||
        trimmed.startsWith('ph://');
      if (!isAllowed) {
        return res.status(400).json({ error: "La foto debe ser una URL válida o imagen compatible." });
      }
    }

    const rawBody = req.body as Record<string, any>;
    if (typeof rawBody.heightCm === "string" && rawBody.heightCm.trim()) {
      (changes as any).heightCm = rawBody.heightCm.trim();
    }
    if (typeof rawBody.weightKg === "string" && rawBody.weightKg.trim()) {
      (changes as any).weightKg = rawBody.weightKg.trim();
    }
    if (typeof rawBody.age === "string" && rawBody.age.trim()) {
      (changes as any).age = rawBody.age.trim();
    }

    const nextProfile = { ...current, ...changes };
    if (patch.onboardingComplete === true) {
      const hasActivity = nextProfile.activities.length > 0 || Boolean(nextProfile.otherActivity?.trim());
      if (
        !nextProfile.displayName.trim() ||
        !nextProfile.username ||
        !nextProfile.fitnessGoal ||
        !nextProfile.fitnessLevel ||
        !hasActivity ||
        !nextProfile.trainingLocation ||
        nextProfile.preferredMacros.length === 0
      ) {
        return res.status(400).json({ error: "Completa nombre, usuario, meta, nivel, actividad, lugar de entrenamiento y macros antes de finalizar." });
      }
    }

    try {
      const [updated] = await db.update(profiles).set(changes).where(eq(profiles.userId, userId)).returning();
      if (updated) return res.json(updated);
    } catch (dbErr) {
      if ((dbErr as { code?: string }).code === "23505") {
        return res.status(409).json({ error: "Ese nombre de usuario ya está ocupado." });
      }
      // If DB fails, persist update into in-memory store
      inMemoryProfiles.set(userId, nextProfile);
      return res.json(nextProfile);
    }
    inMemoryProfiles.set(userId, nextProfile);
    return res.json(nextProfile);
  } catch (error) {
    if ((error as { code?: string }).code === "23505") {
      return res.status(409).json({ error: "Ese nombre de usuario ya está ocupado." });
    }
    req.log.error({ errorName: error instanceof Error ? error.name : "UnknownError" }, "Profile update failed");
    return res.status(500).json({ error: "No se pudo guardar el perfil." });
  }
});

export default router;