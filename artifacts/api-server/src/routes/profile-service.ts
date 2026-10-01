import { randomBytes } from "node:crypto";
import { eq } from "drizzle-orm";
import { clerkClient } from "@clerk/express";
import { db, profiles } from "@workspace/db";

export const inMemoryProfiles = new Map<string, any>();

export const defaultDevProfileData = {
  userId: "dev_user_bodyfit",
  userCode: "BFD-DEV001",
  displayName: "Esteban Entrenador",
  username: "esteban_coach",
  avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200",
  themeKey: "purple",
  fitnessGoal: "Ganar fuerza",
  fitnessLevel: "Avanzado / Pro",
  activities: ["Gimnasio", "CrossFit", "Ciclismo"],
  otherActivity: null,
  trainingLocation: "gym",
  trainingPreferences: ["Pecho: Press banca", "Piernas: Sentadilla libre", "Espalda: Jalón dorsal"],
  preferredMacros: ["protein", "carbs"],
  logoKey: "bodyfit-logo",
  heightCm: "178",
  weightKg: "78",
  age: "26",
  membershipTier: "platinum",
  membershipExpiresAt: null,
  onboardingComplete: true,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};

inMemoryProfiles.set("dev_user_bodyfit", defaultDevProfileData);

export async function getOrCreateProfile(userId: string) {
  try {
    const [existing] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
    if (existing) return existing;
  } catch (err) {
    if (inMemoryProfiles.has(userId)) {
      return inMemoryProfiles.get(userId);
    }
    const memProfile = {
      ...defaultDevProfileData,
      userId,
      userCode: `BFD-${randomBytes(4).toString("hex").toUpperCase()}`,
      displayName: userId === "dev_user_bodyfit" ? "Esteban Entrenador" : "Atleta BodyFit",
      username: userId === "dev_user_bodyfit" ? "esteban_coach" : `atleta_${userId.slice(-4)}`,
    };
    inMemoryProfiles.set(userId, memProfile);
    return memProfile;
  }

  let displayName = "";
  let avatarUrl: string | null = null;
  try {
    const user = await clerkClient.users.getUser(userId);
    displayName = user.fullName?.trim() ?? "";
    avatarUrl = user.imageUrl || null;
  } catch {
    // Profile creation still works if Clerk's optional profile lookup is unavailable.
  }

  for (let attempt = 0; attempt < 5; attempt += 1) {
    try {
      const [created] = await db
        .insert(profiles)
        .values({
          userId,
          userCode: `BFD-${randomBytes(4).toString("hex").toUpperCase()}`,
          displayName: displayName || (userId === "dev_user_bodyfit" ? "Esteban Entrenador" : "Atleta BodyFit"),
          avatarUrl,
        })
        .onConflictDoNothing()
        .returning();
      if (created) return created;

      const [raced] = await db.select().from(profiles).where(eq(profiles.userId, userId)).limit(1);
      if (raced) return raced;
    } catch {
      break;
    }
  }

  const fallback = {
    ...defaultDevProfileData,
    userId,
    userCode: `BFD-${randomBytes(4).toString("hex").toUpperCase()}`,
    displayName: displayName || (userId === "dev_user_bodyfit" ? "Esteban Entrenador" : "Atleta BodyFit"),
    avatarUrl,
  };
  inMemoryProfiles.set(userId, fallback);
  return fallback;
}