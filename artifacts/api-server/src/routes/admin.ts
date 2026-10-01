import { getAuth, clerkClient } from "@clerk/express";
import { eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, profiles } from "@workspace/db";

const router: IRouter = Router();

router.get("/admin/users/search", async (req, res) => {
  try {
    const userId = getAuth(req).userId;
    if (!userId) return res.status(401).json({ error: "Debes iniciar sesión." });
    const user = await clerkClient.users.getUser(userId);
    if (user.publicMetadata?.role !== "owner") return res.status(403).json({ error: "Solo el dueño puede buscar cuentas." });

    const code = typeof req.query.code === "string" ? req.query.code.trim().toUpperCase() : "";
    if (code.length < 5 || code.length > 24) return res.status(400).json({ error: "El código de usuario no es válido." });
    const [profile] = await db.select().from(profiles).where(eq(profiles.userCode, code)).limit(1);
    if (!profile) return res.status(404).json({ error: "No se encontró una cuenta con ese código." });
    return res.json({
      userCode: profile.userCode,
      username: profile.username,
      displayName: profile.displayName,
      fitnessGoal: profile.fitnessGoal,
      fitnessLevel: profile.fitnessLevel,
      createdAt: profile.createdAt,
    });
  } catch (error) {
    req.log.error({ errorName: error instanceof Error ? error.name : "UnknownError" }, "Admin user search failed");
    return res.status(500).json({ error: "No se pudo buscar la cuenta." });
  }
});

export default router;