import { createHash } from "node:crypto";
import OpenAI from "openai";
import { getAuth } from "@clerk/express";
import { and, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, foodScanCorrections, foodScans, type FoodScanItem } from "@workspace/db";

const router: IRouter = Router();
const openai = process.env.OPENAI_API_KEY
  ? new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
  : null;
const model = process.env.OPENAI_FOOD_MODEL ?? "gpt-4o-mini";
const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

const FOOD_NUMBER_KEYS = [
  "gramos_estimados",
  "calorias",
  "proteina",
  "carbohidratos",
  "grasas",
  "fibra",
  "nivel_de_confianza",
] as const;

function getUserId(req: Parameters<typeof getAuth>[0]) {
  const userId = getAuth(req).userId;
  if (!userId) {
    const error = new Error("UNAUTHORIZED");
    error.name = "UnauthorizedError";
    throw error;
  }
  return userId;
}

function parseImageData(value: unknown) {
  if (typeof value !== "string") throw new Error("La imagen es obligatoria.");
  const match = /^data:(image\/(?:jpeg|jpg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!match) throw new Error("La imagen debe ser JPG, PNG o WEBP.");
  const [, mimeType, encoded] = match;
  const byteLength = Buffer.byteLength(encoded, "base64");
  if (byteLength > MAX_IMAGE_BYTES) throw new Error("La imagen supera el límite permitido de 8 MB.");
  return { dataUrl: value, mimeType, encoded };
}

function parseJsonResponse(content: string | null | undefined) {
  if (!content) throw new Error("OpenAI devolvió una respuesta vacía.");
  const withoutFence = content
    .trim()
    .replace(/^```(?:json)?\s*/i, "")
    .replace(/\s*```$/, "");
  try {
    return JSON.parse(withoutFence) as unknown;
  } catch {
    throw new Error("OpenAI devolvió un JSON inválido.");
  }
}

function validateFoodItem(value: unknown): FoodScanItem {
  if (!value || typeof value !== "object") throw new Error("La respuesta contiene un alimento inválido.");
  const item = value as Record<string, unknown>;
  if (typeof item.nombre !== "string" || !item.nombre.trim()) {
    throw new Error("La respuesta contiene un alimento sin nombre.");
  }

  for (const key of FOOD_NUMBER_KEYS) {
    const numberValue = item[key];
    if (typeof numberValue !== "number" || !Number.isFinite(numberValue) || numberValue < 0) {
      throw new Error(`La respuesta contiene un valor inválido para ${String(key)}.`);
    }
  }

  return {
    nombre: item.nombre.trim(),
    gramos_estimados: item.gramos_estimados as number,
    calorias: item.calorias as number,
    proteina: item.proteina as number,
    carbohidratos: item.carbohidratos as number,
    grasas: item.grasas as number,
    fibra: item.fibra as number,
    nivel_de_confianza: Math.min(1, item.nivel_de_confianza as number),
  };
}

function validateFoods(value: unknown) {
  if (!value || typeof value !== "object") throw new Error("La respuesta no tiene el formato esperado.");
  const result = value as { foods?: unknown; notes?: unknown };
  if (!Array.isArray(result.foods)) throw new Error("La respuesta no contiene la lista de alimentos.");
  const foods = result.foods.map(validateFoodItem);
  const notes = typeof result.notes === "string" ? result.notes.trim() : null;
  return { foods, notes };
}

function errorStatus(error: unknown) {
  if (error instanceof Error && error.name === "UnauthorizedError") return 401;
  if (error instanceof Error && /imagen|alimento|respuesta|JSON|valor inválido/.test(error.message)) return 400;
  const upstreamStatus = (error as { status?: unknown })?.status;
  if (upstreamStatus === 401 || upstreamStatus === 403 || upstreamStatus === 429) return 502;
  return 500;
}

function responseMessage(error: unknown, status: number) {
  if (status === 401) return "Debes iniciar sesión para analizar una comida.";
  if (status === 502) return "El servicio de visión no está disponible. Revisa la configuración del proveedor e inténtalo de nuevo.";
  if (status >= 500) return "No se pudo completar el análisis. Inténtalo de nuevo con la misma imagen.";
  return error instanceof Error ? error.message : "No se pudo procesar la solicitud.";
}

router.post("/food-analysis", async (req, res) => {
  try {
    const userId = getUserId(req);
    const { dataUrl, mimeType, encoded } = parseImageData(req.body?.imageData);
    if (!openai) return res.status(503).json({ error: "El servicio de análisis no está configurado." });

    const response = await openai.chat.completions.create({
      model,
      max_completion_tokens: 1800,
      response_format: { type: "json_object" },
      messages: [
        {
          role: "system",
          content: [
            "Eres un analista visual de alimentos para una app de nutrición.",
            "Devuelve únicamente alimentos claramente visibles en la imagen.",
            "No inventes ingredientes, cantidades ni alimentos ocultos.",
            "Si algo no puede identificarse con suficiente claridad, omítelo y explícalo en notes.",
            "Los gramos y nutrientes son estimaciones por porción visible, nunca afirmes precisión clínica.",
            "Responde exclusivamente JSON con esta forma: {\"foods\":[{\"nombre\":string,\"gramos_estimados\":number,\"calorias\":number,\"proteina\":number,\"carbohidratos\":number,\"grasas\":number,\"fibra\":number,\"nivel_de_confianza\":number}],\"notes\":string|null}.",
            "nivel_de_confianza debe ser un número entre 0 y 1.",
          ].join(" "),
        },
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Analiza esta imagen de comida como una solicitud independiente. No uses información de análisis anteriores.",
            },
            { type: "image_url", image_url: { url: dataUrl, detail: "high" } },
          ],
        },
      ],
    });

    const parsed = validateFoods(parseJsonResponse(response.choices[0]?.message?.content));
    const [scan] = await db
      .insert(foodScans)
      .values({
        userId,
        imageSha256: createHash("sha256").update(encoded, "base64").digest("hex"),
        imageMimeType: mimeType,
        model,
        foods: parsed.foods,
        notes: parsed.notes,
      })
      .returning({ id: foodScans.id });

    return res.json({ scanId: scan.id, model, foods: parsed.foods, notes: parsed.notes });
  } catch (error) {
    const status = errorStatus(error);
    if (status >= 500) {
      req.log.error(
        { errorName: error instanceof Error ? error.name : "UnknownError", upstreamStatus: (error as { status?: unknown })?.status },
        "Food analysis failed",
      );
    }
    return res.status(status).json({ error: responseMessage(error, status) });
  }
});

router.post("/food-analysis/:scanId/corrections", async (req, res) => {
  try {
    const userId = getUserId(req);
    const scanId = req.params.scanId;
    const foodIndex = Number(req.body?.foodIndex);
    if (!Number.isInteger(foodIndex) || foodIndex < 0) {
      return res.status(400).json({ error: "El índice del alimento no es válido." });
    }

    const [scan] = await db
      .select()
      .from(foodScans)
      .where(and(eq(foodScans.id, scanId), eq(foodScans.userId, userId)))
      .limit(1);
    if (!scan) return res.status(404).json({ error: "No se encontró ese escaneo." });

    const beforeFood = scan.foods[foodIndex];
    if (!beforeFood) return res.status(404).json({ error: "No se encontró ese alimento." });
    const afterFood = validateFoodItem(req.body?.afterFood);

    const updatedFoods = [...scan.foods];
    updatedFoods[foodIndex] = afterFood;
    const [correction] = await db.transaction(async (tx) => {
      await tx
        .update(foodScans)
        .set({ foods: updatedFoods })
        .where(and(eq(foodScans.id, scanId), eq(foodScans.userId, userId)));
      return tx
        .insert(foodScanCorrections)
        .values({ scanId, userId, foodIndex, beforeFood, afterFood })
        .returning({ id: foodScanCorrections.id, createdAt: foodScanCorrections.createdAt });
    });

    return res.json({ correctionId: correction.id, createdAt: correction.createdAt, food: afterFood });
  } catch (error) {
    const status = errorStatus(error);
    if (status >= 500) {
      req.log.error({ errorName: error instanceof Error ? error.name : "UnknownError" }, "Food correction failed");
    }
    return res.status(status).json({ error: responseMessage(error, status) });
  }
});

export default router;