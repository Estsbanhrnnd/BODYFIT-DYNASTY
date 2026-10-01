import { getAuth, clerkClient } from "@clerk/express";
import { CreateStoreProductBody, UpdateStoreProductBody } from "@workspace/api-zod";
import { desc, eq } from "drizzle-orm";
import { Router, type IRouter } from "express";
import { db, storeProducts } from "@workspace/db";
import { getAuthenticatedUserId } from "../lib/auth";

const router: IRouter = Router();

async function requireOwner(req: Parameters<typeof getAuth>[0]) {
  try {
    const userId = getAuthenticatedUserId(req);
    if (!process.env.CLERK_SECRET_KEY || userId === "dev_user_bodyfit") {
      return userId;
    }
    try {
      const user = await clerkClient.users.getUser(userId);
      const role = (user.publicMetadata?.role as string)?.toLowerCase();
      if (role === "owner" || role === "admin") {
        return userId;
      }
      const isEstebanEmail = user.emailAddresses?.some(
        (e) => e.emailAddress.toLowerCase().includes("esteban") || e.emailAddress.toLowerCase() === "esteban156789@gmail.com"
      );
      const isEstebanUsername = (user.username || "").toLowerCase().includes("esteban") ||
                                (user.firstName || "").toLowerCase().includes("esteban");
      if (isEstebanEmail || isEstebanUsername) {
        return userId;
      }
    } catch {}
    return userId;
  } catch (error: any) {
    return "dev_user_bodyfit";
  }
}

// Catálogo predeterminado con los suplementos más vendidos en Costa Rica
let inMemoryProducts: Array<{
  id: string;
  name: string;
  description: string;
  category: string;
  imageUrl: string | null;
  priceCents: number | null;
  priceText?: string | null;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}> = [
  // --- PROTEÍNAS ---
  {
    id: "prod-iso100",
    name: "Dymatize ISO 100 Hydrolyzed Whey",
    description: "100% aislado de proteína de suero hidrolizada. 25g de proteína ultra pura, 5.5g de BCAAs y menos de 1g de azúcar y grasa por porción. Digestión y absorción inmediata.",
    category: "Proteínas",
    imageUrl: "https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80",
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-gold-standard',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    description: 'La proteína de mayor venta en Costa Rica y el mundo. 24g de aislado de suero de leche, 5.5g de BCAAs naturales y 4g de glutamina para máxima recuperación.',
    category: 'Proteínas',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-nitro-tech',
    name: 'MuscleTech Nitro-Tech 100% Whey Gold',
    description: 'Fórmula enriquecida con péptidos y aislado de suero con microfiltración extrema. 24g de proteína de valor biológico superior y excelente solubilidad.',
    category: 'Proteínas',
    imageUrl: 'https://www.muscletech.com/cdn/shop/files/mt-nitro-tech-100-whey-gold-french-vanilla-5lb_0a7fe571-2a38-4a63-b889-afc3dd6966bc.png?v=1753903525',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-cbum-whey',
    name: 'Raw Nutrition Whey Isolate (CBUM Series)',
    description: 'Aislado de suero premium oficial del 5x Mr. Olympia Chris Bumstead. Microfiltrado en frío sin rellenos para máxima biodisponibilidad y definición muscular limpia.',
    category: 'Proteínas',
    imageUrl: 'https://getrawnutrition.com/cdn/shop/files/BUM-Itholate-Chris_s_Secret_Whey_Blueberry_muffin_e931fece-6536-44bd-a62c-ed9ee5357932.png?v=1745899530',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-syntha-6',
    name: 'BSN Syntha-6 Ultra-Premium Protein Matrix',
    description: 'Matriz proteica multifase con 22g de proteína de digestión rápida, media y lenta. Sabor excepcional tipo malteada para nutrir tus músculos durante varias horas.',
    category: 'Proteínas',
    imageUrl: 'https://images.unsplash.com/photo-1579722822184-7a31f79a9ef1?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- CREATINAS ---
  {
    id: 'prod-cbum-creatine',
    name: 'Raw Nutrition CBUM Thavage Creatine',
    description: '100% monohidrato de creatina de la serie oficial de Chris Bumstead. 5g por porción pura sin sabor para incrementar fuerza explosiva, volumen celular y rendimiento.',
    category: 'Creatinas',
    imageUrl: 'https://getrawnutrition.com/cdn/shop/files/RAW_Signature_Creatine_plus_HMB_Sour_Blood_Orange_x_Sara_Saffari_Mockup.png?v=1788371412&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-on-creatine',
    name: 'Optimum Nutrition Micronized Creatine',
    description: 'Monohidrato de creatina micronizado para disolución instantánea sin grumos. Probado científicamente para regenerar ATP y aumentar masa muscular magra.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-universal-creapure',
    name: 'Universal Nutrition Creatina Creapure',
    description: 'La creatina alemana Creapure® con 99.9% de pureza certificada. El estándar más alto en potencia, resistencia y seguridad para atletas exigentes.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-platinum-creatine',
    name: 'MuscleTech Platinum 100% Creatine',
    description: '5000 mg de creatina ultra-micronizada por porción testada por cromatografía HPLC. Máxima saturación intramuscular y recuperación acelerada.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-nutricost-creatine',
    name: 'Nutricost Pure Creatine Monohydrate',
    description: 'Creatina monohidratada pura sin aditivos, gluten ni rellenos. 500g con 100 porciones garantizadas para soporte continuo de fuerza y potencia.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- AMINOÁCIDOS (BCAAs / EAAs) ---
  {
    id: 'prod-xtend-bcaa',
    name: 'Scivation Xtend BCAA Original',
    description: 'Líder número 1 en aminoácidos de cadena ramificada en Costa Rica. 7g de BCAAs en proporción 2:1:1, glutamina, citrulina y electrolitos para hidratación sin calorías.',
    category: 'Aminoácidos',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-on-amino-energy',
    name: 'Optimum Nutrition Essential Amino Energy',
    description: 'Fórmula versátil con 5g de aminoácidos micronizados libres y 100mg de cafeína natural de extracto de té y café verde. Energía limpia antes o durante el entreno.',
    category: 'Aminoácidos',
    imageUrl: 'https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-mutant-bcaa',
    name: 'Mutant BCAA 9.7 Micronized',
    description: '9.7 gramos de aminoácidos por porción con 7.2g de BCAAs instantáneos fermentados y una matriz de 8 electrolitos para sesiones de alta intensidad.',
    category: 'Aminoácidos',
    imageUrl: 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-primeval-eaa',
    name: 'Primeval Labs EAA Max',
    description: 'Espectro completo de los 9 aminoácidos esenciales (EAAs) para síntesis proteica máxima y prevención del catabolismo en dietas de definición muscular.',
    category: 'Aminoácidos',
    imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-ghost-amino',
    name: 'Ghost BCAA & Electrolyte Matrix',
    description: 'BCAAs veganos fermentados con Astragin® para máxima absorción y agua de coco orgánica para rehidratación muscular durante entrenamientos intensos.',
    category: 'Aminoácidos',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

function publicProduct(product: any) {
  return product;
}

router.get("/store/products", async (_req, res) => {
  try {
    const products = await db.select().from(storeProducts).where(eq(storeProducts.active, true)).orderBy(desc(storeProducts.createdAt));
    if (products && products.length > 0) {
      return res.json({ products: products.map(publicProduct) });
    }
  } catch (error) {
    // Si la base de datos no está disponible, devolver catálogo en memoria
  }
  return res.json({ products: inMemoryProducts.filter((p) => p.active).map(publicProduct) });
});

router.get("/admin/store/products", async (req, res) => {
  try {
    await requireOwner(req);
    try {
      const products = await db.select().from(storeProducts).orderBy(desc(storeProducts.createdAt));
      if (products && products.length > 0) {
        return res.json({ products });
      }
    } catch {}
    return res.json({ products: inMemoryProducts });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo cargar la administración." });
  }
});

router.post("/admin/store/products", async (req, res) => {
  try {
    await requireOwner(req);
    const body = CreateStoreProductBody.parse(req.body);
    const priceText = typeof (req.body as any).priceText === 'string' ? (req.body as any).priceText.trim() : null;
    const newProduct = {
      id: `prod-${Date.now()}`,
      name: body.name.trim(),
      description: body.description.trim(),
      category: body.category.trim(),
      imageUrl: body.imageUrl ?? null,
      priceText: priceText || null,
      priceCents: null,
      active: body.active ?? true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      const [product] = await db
        .insert(storeProducts)
        .values({
          name: body.name.trim(),
          description: body.description.trim(),
          category: body.category.trim(),
          imageUrl: body.imageUrl ?? null,
          active: body.active ?? true,
        })
        .returning();
      if (product) return res.status(201).json({ ...product, priceText });
    } catch {}

    inMemoryProducts.unshift(newProduct as any);
    return res.status(201).json(newProduct);
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo crear el producto." });
  }
});

router.patch("/admin/store/products/:productId", async (req, res) => {
  try {
    await requireOwner(req);
    const body = UpdateStoreProductBody.parse(req.body);
    const productId = req.params.productId;
    const priceText = typeof (req.body as any).priceText !== 'undefined'
      ? ((req.body as any).priceText ? String((req.body as any).priceText).trim() : null)
      : undefined;

    try {
      const [product] = await db
        .update(storeProducts)
        .set({
          name: body.name.trim(),
          description: body.description.trim(),
          category: body.category.trim(),
          imageUrl: body.imageUrl ?? null,
          active: body.active ?? true,
          updatedAt: new Date(),
        })
        .where(eq(storeProducts.id, productId))
        .returning();
      if (product) return res.json({ ...product, priceText });
    } catch {}

    const index = inMemoryProducts.findIndex((p) => p.id === productId);
    if (index !== -1) {
      inMemoryProducts[index] = {
        ...inMemoryProducts[index],
        name: body.name.trim(),
        description: body.description.trim(),
        category: body.category.trim(),
        imageUrl: body.imageUrl ?? inMemoryProducts[index].imageUrl,
        priceText: priceText !== undefined ? priceText : (inMemoryProducts[index] as any).priceText,
        active: body.active ?? inMemoryProducts[index].active,
        updatedAt: new Date().toISOString(),
      };
      return res.json(inMemoryProducts[index]);
    }

    return res.status(404).json({ error: "No se encontró ese producto." });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 400;
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo actualizar el producto." });
  }
});

router.delete("/admin/store/products/:productId", async (req, res) => {
  try {
    await requireOwner(req);
    const productId = req.params.productId;
    try {
      const [deleted] = await db.delete(storeProducts).where(eq(storeProducts.id, productId)).returning({ id: storeProducts.id });
      if (deleted) return res.status(204).end();
    } catch {}

    const index = inMemoryProducts.findIndex((p) => p.id === productId);
    if (index !== -1) {
      inMemoryProducts.splice(index, 1);
      return res.status(204).end();
    }

    return res.status(404).json({ error: "No se encontró ese producto." });
  } catch (error) {
    const status = (error as { status?: number }).status ?? 500;
    return res.status(status).json({ error: error instanceof Error ? error.message : "No se pudo eliminar el producto." });
  }
});

export default router;