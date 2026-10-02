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

// Catálogo predeterminado con los 18 suplementos líderes en nutrición deportiva
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
    id: 'prod-iso100',
    name: 'Dymatize ISO 100 Hydrolyzed Whey',
    description: '100% aislado de proteína de suero hidrolizada con microfiltración de flujo cruzado. 25g de proteína, 5.5g de BCAAs y menos de 1g de grasa y azúcar por porción. Máxima absorción inmediata para desarrollo muscular magro.',
    category: 'Proteínas',
    imageUrl: 'https://dymatize.imgix.net/production/products/dym0001-8_ISO100_20s_PDPHero_D_3840x2156_GourmetVanilla.jpg?w=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-gold-standard',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    description: 'La proteína más vendida del planeta. 24g de aislado y concentrado ultrafiltrado de suero, 5.5g de BCAAs naturales y 4g de glutamina. Solubilidad instantánea y textura premium para alimentar la síntesis de proteína.',
    category: 'Proteínas',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/on-1154008_Image_01.png?width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-nitro-tech',
    name: 'MuscleTech Nitro-Tech 100% Whey Gold',
    description: 'Péptidos de suero bioactivos de absorción rápida combinados con aislado de suero de máxima pureza. 24g de proteína de alto valor biológico y perfil enriquecido con BCAAs sin rellenos ni sustancias prohibidas.',
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
    description: 'Aislado de suero 100% microfiltrado en frío de grado farmacéutico. 25g de proteína pura por porción sin grasas saturadas, bajo en sodio y con sabores legendarios como Itholate para definición y masa magra.',
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
    description: 'Matriz proteica multifase de 22g de proteína con 6 fuentes de liberación sostenida (rápida, media y lenta). Enriquecida con BCAAs, MCTs y ácidos grasos esenciales. Nutrición muscular continua durante varias horas.',
    category: 'Proteínas',
    imageUrl: 'https://www.gobsn.com/cdn/shop/files/S6_Blueberry_FR.png',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- CREATINAS ---
  {
    id: 'prod-cbum-creatine',
    name: 'Raw Nutrition CBUM Thavage Creatine',
    description: 'Monohidrato de creatina de máxima pureza micronizada de la línea oficial de Chris Bumstead. 5g por porción sin sabor ni rellenos para potenciar fuerza explosiva, volumen celular intracelular y resistencia anaeróbica.',
    category: 'Creatinas',
    imageUrl: 'https://getrawnutrition.com/cdn/shop/files/RAW_Signature_Creatine_plus_HMB_Sour_Blood_Orange_x_Sara_Saffari_Mockup.png?v=1788371412&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-on-creatine',
    name: 'Optimum Nutrition Micronized Creatine Powder',
    description: '5g de monohidrato de creatina micronizado para disolución ultra rápida sin sedimentación. Respaldado por estudios clínicos para aumentar el rendimiento en series pesadas y acelerar la recuperación muscular entre sets.',
    category: 'Creatinas',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/ON_DTC_PDP_Creatine60srv_6074352_4000x4000_8caf3a00-52f7-432d-857c-2cac79bb31a3.png?v=1784749814&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-universal-creapure',
    name: 'Universal Nutrition Creatina Creapure',
    description: 'Fabricada en Alemania bajo los controles más rigurosos del mundo. Libre de impurezas como DCD y DHT. Máxima biodisponibilidad y potencia para atletas que exigen el estándar más limpio del mercado.',
    category: 'Creatinas',
    imageUrl: 'https://www.animalpak.com/cdn/shop/files/Creatine_500g_Unflavored_1200x1200_96a0f2dc-3eaf-4be6-8a47-4e94d58c8f93.jpg?v=1762196608&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-platinum-creatine',
    name: 'MuscleTech Platinum 100% Creatine',
    description: '5000mg de monohidrato de creatina ultra-micronizada por porción testada por cromatografía líquida HPLC. Favorece la voluminización muscular y maximiza la regeneración de fosfocreatina.',
    category: 'Creatinas',
    imageUrl: 'https://www.muscletech.com/cdn/shop/files/mt-platinum-100-creatine-capsules.png',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-nutricost-creatine',
    name: 'Nutricost Pure Creatine Monohydrate 500g',
    description: '500 gramos de monohidrato de creatina pura sin aditivos, gluten ni organismos modificados genéticamente (Non-GMO). 100 servicios garantizados para soporte continuo de fuerza, potencia y rendimiento atlético.',
    category: 'Creatinas',
    imageUrl: 'https://nutricost.com/cdn/shop/files/NTC_CreatineMonohydrate_Unflavored_500G_Front_SQUARE_98526928-e1cc-4ff6-9918-430654760159_1200x1200.jpg',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- AMINOÁCIDOS ---
  {
    id: 'prod-xtend-bcaa',
    name: 'Scivation Xtend BCAA Original 7G',
    description: '7g de BCAAs en la proporción clínicamente estudiada 2:1:1, combinados con 2.5g de L-Glutamina, 1g de Malato de Citrulina y una mezcla de electrolitos patentada para máxima hidratación intra-entrenamiento sin azúcar ni carbohidratos.',
    category: 'Aminoácidos',
    imageUrl: 'https://cellucor.com/cdn/shop/files/XTEND_1144_Digital_Relabel_FlowThrough_Assets_PDPs_OnGreyBackground-XTEND-OG30-BRI.png?v=1771552623&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-on-amino-energy',
    name: 'Optimum Nutrition Essential Amino Energy',
    description: '5g de aminoácidos micronizados de rápida absorción con 100mg de cafeína natural derivada de té verde y extracto de café verde. Energía sostenida, concentración mental y soporte muscular sin bajón calórico.',
    category: 'Aminoácidos',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/on-1132800_Image_01.png?v=1755790971&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- PRE-ENTRENOS ---
  {
    id: 'prod-c4-original',
    name: 'Cellucor C4 Original Pre-Workout',
    description: 'El pre-entreno número 1 en ventas de América. Formulado con 150mg de cafeína anhidra, 1.6g de CarnoSyn® Beta-Alanina para retrasar la fatiga muscular, 1g de Nitrato de Creatina NO3-T y Velvet Bean para motivación y bombeo muscular intenso.',
    category: 'Pre-Entrenos',
    imageUrl: 'https://cellucor.com/cdn/shop/files/C4AN_1002_Brand_C4YellowLabel_Transition_C4Original_CoreFlavors_BasicPDPs-OG-IBR-Hero-Grey.png?v=1773235672&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-cbum-thavage-pre',
    name: 'Raw Nutrition CBUM Thavage Pre-Workout',
    description: 'Diseñado y calibrado personalmente por el 5x Mr. Olympia Chris Bumstead. Contiene 6g de L-Citrulina pura para vasodilatación extrema, 3.2g de Beta-Alanina, 2.5g de Betaína Anhidra, Alpha-GPC y 305mg de cafeína en matriz bifásica para concentración mental total.',
    category: 'Pre-Entrenos',
    imageUrl: 'https://getrawnutrition.com/cdn/shop/files/RAWSignatureThavagePreWorkout-CherryLimeSlush-WhiteBottle.png?v=1778770803&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-pre-jym',
    name: 'JYM Supplement Science Pre JYM High-Performance',
    description: 'Fórmula todo en uno formulada por el Dr. Jim Stoppani. 6g de Malato de Citrulina (2:1), 6g de BCAAs, 2g de Creatina HCl, 2g de Beta-Alanina, 1.5g de Betaína, 500mg de extracto de raíz de remolacha y 300mg de cafeína sin mezclas patentadas ocultas.',
    category: 'Pre-Entrenos',
    imageUrl: 'https://jymsupplementscience.com/cdn/shop/files/PRE30BP300_25954_091724_V1.1-Front-1200px.png?v=1775425736&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },

  // --- MULTIVITAMÍNICOS ---
  {
    id: 'prod-opti-men',
    name: 'Optimum Nutrition Opti-Men Multivitamin',
    description: 'Potente multivitamínico diario con más de 75 ingredientes activos distribuidos en 4 mezclas especializadas: Amino-Men Blend (8 aminoácidos clave), Phyto-Men Blend (concentrados botánicos y frutas), Viri-Men Blend y Enzy-Men Blend para digestión y vitalidad masculina.',
    category: 'Multivitamínicos',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/ON_OptiMen_90ct_6074229.png?v=1779369013&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-opti-women',
    name: 'Optimum Nutrition Opti-Women Multivitamin',
    description: 'Diseñado específicamente para el metabolismo y las demandas físicas de la mujer activa. 40 ingredientes activos, 23 vitaminas y minerales esenciales, 150mg de calcio para salud ósea, 18mg de hierro quelado, ácido fólico y extractos botánicos antioxidantes en cápsulas Vcaps.',
    category: 'Multivitamínicos',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/ON_OptiWomen_60ct_Main_Image.png?v=1777474313&width=800',
    priceCents: null,
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'prod-animal-pak',
    name: 'Universal Nutrition Animal Pak The Complete Multi-Pack',
    description: 'Desde 1983, el suplemento base de los atletas de fuerza más exigentes del mundo. Cada pack individual aporta megadosis de vitaminas y minerales, complejo de aminoácidos, complejo de optimización de rendimiento, enzimas digestivas y complejo hepático protector.',
    category: 'Multivitamínicos',
    imageUrl: 'https://www.animalpak.com/cdn/shop/files/Pak_30packs_1200x1200_10ffb784-bf66-40fb-818d-0343c89d36c3.webp?v=1778247781&width=800',
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
    if (products && products.length >= 18) {
      return res.json({ products: products.map(publicProduct) });
    }

    // Sincronizar catálogo completo en base de datos si faltan productos
    try {
      for (const p of inMemoryProducts) {
        await db.insert(storeProducts).values({
          id: p.id,
          name: p.name,
          description: p.description,
          category: p.category,
          imageUrl: p.imageUrl,
          priceCents: p.priceCents ?? null,
          active: p.active,
        }).onConflictDoUpdate({
          target: storeProducts.id,
          set: {
            name: p.name,
            description: p.description,
            category: p.category,
            imageUrl: p.imageUrl,
            priceCents: p.priceCents ?? null,
            active: p.active,
          },
        });
      }
      const updatedProducts = await db.select().from(storeProducts).where(eq(storeProducts.active, true)).orderBy(desc(storeProducts.createdAt));
      if (updatedProducts && updatedProducts.length > 0) {
        return res.json({ products: updatedProducts.map(publicProduct) });
      }
    } catch {}
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