import { getAuth } from "@clerk/express";
import type { Request } from "express";

export function getAuthenticatedUserId(req: Request | Parameters<typeof getAuth>[0]): string {
  try {
    const auth = getAuth(req as any);
    if (auth?.userId) return auth.userId;
  } catch {}

  if (process.env.DEV_BYPASS_AUTH === "true" || !process.env.CLERK_SECRET_KEY) {
    return "dev_user_bodyfit";
  }

  throw Object.assign(new Error("Debes iniciar sesión."), { status: 401 });
}
