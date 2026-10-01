import { getAuth } from "@clerk/express";
import { CreateWorkoutLogBody, SaveDailyProgressBody } from "@workspace/api-zod";
import { and, desc, eq, gte, lt } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { dailyProgress, db, workoutLogs } from "@workspace/db";

import { getAuthenticatedUserId } from "../lib/auth";

const router: IRouter = Router();
function authenticatedUserId(req: Parameters<typeof getAuth>[0]) {
  return getAuthenticatedUserId(req);
}

router.get("/activity/workouts", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    const workouts = await db
      .select()
      .from(workoutLogs)
      .where(eq(workoutLogs.userId, userId))
      .orderBy(desc(workoutLogs.completedAt))
      .limit(200);
    return res.json({ workouts });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return res.status(status).json({ error: "No se pudieron cargar los entrenamientos." });
  }
});

router.post("/activity/workouts", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    const body = CreateWorkoutLogBody.parse(req.body);
    if (!Number.isInteger(body.durationMinutes)) return res.status(400).json({ error: "La duración debe ser un número entero de minutos." });
    const [workout] = await db
      .insert(workoutLogs)
      .values({
        userId,
        routineName: body.routineName.trim(),
        location: body.location,
        durationMinutes: body.durationMinutes,
        completedAt: body.completedAt ? new Date(body.completedAt) : new Date(),
      })
      .returning();
    return res.status(201).json(workout);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    if (status >= 500) {
      req.log.error({ errorName: error instanceof Error ? error.name : "UnknownError" }, "Workout log creation failed");
    }
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo guardar el entrenamiento." });
  }
});

router.put("/progress/daily", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    const body = SaveDailyProgressBody.parse(req.body);
    const day = body.day;
    const [snapshot] = await db
      .insert(dailyProgress)
      .values({ userId, day, stats: body.values, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: [dailyProgress.userId, dailyProgress.day],
        set: { stats: body.values, updatedAt: new Date() },
      })
      .returning();
    return res.json({ day: snapshot.day, values: snapshot.stats });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo guardar el progreso." });
  }
});

router.get("/progress/monthly", async (req, res) => {
  try {
    const userId = authenticatedUserId(req);
    const month = typeof req.query.month === "string" ? req.query.month : "";
    if (!/^\d{4}-(0[1-9]|1[0-2])$/.test(month)) {
      return res.status(400).json({ error: "Indica el mes en formato AAAA-MM." });
    }
    const fromDay = `${month}-01`;
    const [yearPart, monthPart] = month.split("-").map(Number);
    const nextMonthDate = new Date(Date.UTC(yearPart, monthPart, 1));
    const toDay = `${nextMonthDate.getUTCFullYear()}-${String(nextMonthDate.getUTCMonth() + 1).padStart(2, "0")}-01`;
    const [days, workouts] = await Promise.all([
      db
        .select({ day: dailyProgress.day, values: dailyProgress.stats })
        .from(dailyProgress)
        .where(and(eq(dailyProgress.userId, userId), gte(dailyProgress.day, fromDay), lt(dailyProgress.day, toDay)))
        .orderBy(dailyProgress.day),
      db
        .select()
        .from(workoutLogs)
        .where(and(eq(workoutLogs.userId, userId), gte(workoutLogs.completedAt, new Date(`${fromDay}T00:00:00.000Z`)), lt(workoutLogs.completedAt, new Date(`${toDay}T00:00:00.000Z`))))
        .orderBy(desc(workoutLogs.completedAt)),
    ]);
    return res.json({ days, workouts });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return res.status(status).json({ error: "No se pudo cargar el historial." });
  }
});

export default router;