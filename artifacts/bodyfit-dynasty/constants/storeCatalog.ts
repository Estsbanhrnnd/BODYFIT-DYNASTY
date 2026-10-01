export interface ProductHighlight {
  icon: string;
  label: string;
  value: string;
}

export interface ProductSpecification {
  id: string;
  name: string;
  category: string;
  tagline: string;
  summary: string;
  highlights: ProductHighlight[];
  servingInfo: {
    servingSize: string;
    servingsPerContainer: string;
    presentation: string;
    protein?: string;
    bcaa?: string;
    leucine?: string;
    glutamine?: string;
    sugar?: string;
    fat?: string;
    calories?: string;
  };
  usageInstructions: {
    directions: string;
    timing: string;
    preparation: string;
  };
  healthNotice: {
    ingredientsSummary: string;
    allergens: string;
    storage: string;
    warnings: string;
    registrationCR?: string;
    origin?: string;
  };
}

export const PRODUCT_SPECIFICATIONS: Record<string, ProductSpecification> = {
  'prod-iso100': {
    id: 'prod-iso100',
    name: 'Dymatize ISO 100 Hydrolyzed Whey',
    category: 'Proteínas',
    tagline: 'Máxima Pureza & Absorción Inmediata',
    summary:
      'Si tu objetivo es aumentar el tamaño y la fuerza muscular magra, ISO 100 es tu compañero ideal. Formulado con 100% aislado de proteína de suero hidrolizada, procesada mediante microfiltración de flujo cruzado (CFM en frío) para preservar fracciones clave como lactoferrina e inmunoglobulinas sin grasa, gluten ni lactosa. Ideal al despertar para frenar el catabolismo o tras un entreno exigente para acelerar la síntesis proteica.',
    highlights: [
      { icon: 'zap', label: 'Tipo', value: '100% Whey Aislada Hidrolizada' },
      { icon: 'activity', label: 'Proteína', value: '25 g por Porción' },
      { icon: 'shield', label: 'BCAAs', value: '5.5 g (2.6g L-Leucina)' },
      { icon: 'heart', label: 'Glutamina', value: '4.4 g Glutamina & Ácido Glutámico' },
      { icon: 'check-circle', label: 'Pureza', value: 'Libre de Gluten & Lactosa' },
      { icon: 'package', label: 'Rendimiento', value: '76 Servidas (5 Lbs)' },
    ],
    servingInfo: {
      servingSize: '1 copa (30g - 32g según sabor)',
      servingsPerContainer: '76 servidas aprox.',
      presentation: 'Bote de 5 Libras (2.3 kg)',
      protein: '25 g',
      bcaa: '5.5 g',
      leucine: '2.6 g',
      glutamine: '4.4 g',
      sugar: '< 1 g',
      fat: '< 1 g',
      calories: '110 - 120 kcal',
    },
    usageInstructions: {
      directions:
        'Vía oral. Añadir 1 copa dosificadora en 5 a 6 onzas (150-180 ml) de agua fría, leche vegetal o tu bebida favorita. Revolver con agitador o licuadora durante 15-20 segundos hasta su completa disolución.',
      timing:
        'Momento clave: Dentro de los 30 minutos posteriores a tu sesión de entrenamiento para detonar la síntesis de proteína (mTOR), o a primera hora en la mañana para detener el catabolismo nocturno.',
      preparation: 'Excelente solubilidad instantánea en frío sin grumos.',
    },
    healthNotice: {
      ingredientsSummary:
        'Aislado de proteína de suero hidrolizado, aislado de proteína de suero de leche CFM, glutamina, lecitina de soya, sal marina, sabores naturales y artificiales, sucralosa, glucósidos de esteviol (Stevia), calcio y potasio.',
      allergens: 'Contiene derivados de LECHE y SOYA. Elaborado en instalaciones certificadas GMP.',
      storage: 'Conservar en un lugar fresco, seco y protegido de la luz solar directa.',
      warnings:
        'Suplemento dietético para personas sanas. Mantener fuera del alcance de los niños. No utilizar en mujeres embarazadas ni en periodo de lactancia sin previa autorización médica. Descontinuar su uso dos semanas antes de cualquier intervención quirúrgica. Este producto no previene ni cura ninguna enfermedad.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-19-04018',
      origin: 'Fabricado en EE.UU. Distribuidor autorizado Dynasty Costa Rica.',
    },
  },

  'prod-gold-standard': {
    id: 'prod-gold-standard',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    category: 'Proteínas',
    tagline: 'El Estándar de Oro Mundial en Recuperación',
    summary:
      'La proteína más premiada del mundo. Combina aislado de suero de leche como ingrediente principal con concentrado ultrafiltrado y péptidos de suero para un perfil de aminoácidos completo que apoya la construcción de masa magra y la recuperación muscular integral.',
    highlights: [
      { icon: 'award', label: 'Estándar', value: 'Whey Isolate #1 Principal' },
      { icon: 'activity', label: 'Proteína', value: '24 g por Porción' },
      { icon: 'shield', label: 'BCAAs', value: '5.5 g Naturales' },
      { icon: 'heart', label: 'Glutamina', value: '4 g Glutamina Natural' },
      { icon: 'package', label: 'Rendimiento', value: '74 Servidas (5 Lbs)' },
    ],
    servingInfo: {
      servingSize: '1 copa (30.4 g)',
      servingsPerContainer: '74 servidas',
      presentation: 'Bote de 5 Libras (2.27 kg)',
      protein: '24 g',
      bcaa: '5.5 g',
      glutamine: '4.0 g',
      sugar: '1 g',
      fat: '1.5 g',
      calories: '120 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 copa en 6 a 8 oz de agua o leche descremada. Batir durante 30 segundos hasta obtener una textura suave y homogénea.',
      timing:
        'Consumir 30 a 60 minutos después del entrenamiento, o entre comidas para mantener una ingesta proteica elevada.',
      preparation: 'Instantánea: se mezcla fácilmente con cuchara o vaso mezclador.',
    },
    healthNotice: {
      ingredientsSummary:
        'Mezcla de proteínas (aislado de proteína de suero, concentrado de proteína de suero, péptidos de suero), lecitina de soya, aromas, acesulfamo potásico, sucralosa.',
      allergens: 'Contiene LECHE y SOYA.',
      storage: 'Almacenar en lugar seco a temperatura ambiente.',
      warnings:
        'Usar como suplemento nutricional. No sustituye una dieta balanceada. Consultar a su médico antes de usar si tiene alguna condición médica previa.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-17-02451',
      origin: 'Estados Unidos.',
    },
  },

  'prod-nitro-tech': {
    id: 'prod-nitro-tech',
    name: 'MuscleTech Nitro-Tech 100% Whey Gold',
    category: 'Proteínas',
    tagline: 'Péptidos Bioactivos de Suero Ultra Puro',
    summary:
      'Durante más de 20 años, Nitro-Tech ha sido líder en innovación proteica. Esta fórmula 100% Whey Gold aporta péptidos de suero de rápida absorción combinados con aislado microfiltrado para una biodisponibilidad y retención de nitrógeno superiores.',
    highlights: [
      { icon: 'zap', label: 'Tecnología', value: 'Péptidos de Suero Bioactivos' },
      { icon: 'activity', label: 'Proteína', value: '24 g por Porción' },
      { icon: 'shield', label: 'BCAAs', value: '5.5 g de Cadena Ramificada' },
      { icon: 'heart', label: 'Glutamina', value: '4 g Precursores Clave' },
      { icon: 'check-circle', label: 'Sin Relleno', value: '0 g Sustancias Prohibidas' },
    ],
    servingInfo: {
      servingSize: '1 copa (33 g)',
      servingsPerContainer: '69 - 77 servidas según sabor',
      presentation: 'Bote de 5 Libras (2.27 kg)',
      protein: '24 g',
      bcaa: '5.5 g',
      glutamine: '4.0 g',
      sugar: '2 g',
      fat: '2 g',
      calories: '130 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 servicio en 6 oz de agua fría o leche descremada en un shaker vaso batidor.',
      timing:
        'Ideal entre las comidas principales e inmediatamente después del entrenamiento con pesas.',
      preparation: 'Rápida solubilidad con microfiltración avanzada.',
    },
    healthNotice: {
      ingredientsSummary:
        'Mezcla de péptidos y aislados de suero (péptidos de suero, aislado de suero, aislado de suero al 97%), concentrado de suero, cacao, sal, lecitina de soya y girasol.',
      allergens: 'Contiene derivados de LECHE y SOYA.',
      storage: 'Manténgase en ambiente templado, seco y cerrado herméticamente.',
      warnings:
        'Consulte a un profesional de la salud antes de iniciar cualquier plan nutricional o de ejercicio.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-18-05119',
      origin: 'Estados Unidos.',
    },
  },

  'prod-cbum-whey': {
    id: 'prod-cbum-whey',
    name: 'Raw Nutrition Whey Isolate (CBUM Series)',
    category: 'Proteínas',
    tagline: 'Fórmula Oficial 5x Mr. Olympia Chris Bumstead',
    summary:
      'El aislado de suero de grado olímpico creado bajo las especificaciones exactas de Chris Bumstead. Cada lote es microfiltrado para brindar la proteína más digerible, ligera para el estómago y con un sabor gourmet inigualable.',
    highlights: [
      { icon: 'award', label: 'Edición', value: 'CBUM Signature Series' },
      { icon: 'activity', label: 'Proteína', value: '25 g 100% Isolate' },
      { icon: 'check-circle', label: 'Digestión', value: 'Fácil Digestión Sin Hinchazón' },
      { icon: 'package', label: 'Servidas', value: '25 Servidas Gourmet' },
    ],
    servingInfo: {
      servingSize: '1 scoop (31.5 g)',
      servingsPerContainer: '25 servidas',
      presentation: 'Bote de 1.8 Libras (825 g)',
      protein: '25 g',
      sugar: '1 g',
      fat: '0.5 g',
      calories: '110 kcal',
    },
    usageInstructions: {
      directions: 'Añadir 1 scoop en 6-8 oz de agua fría o leche de almendras y batir bien.',
      timing: 'Post-entrenamiento o como snack anabólico entre comidas.',
      preparation: 'Cero grumos, textura suave y sedosa.',
    },
    healthNotice: {
      ingredientsSummary:
        'Aislado de proteína de suero microfiltrado, saborizantes naturales, sucralosa, sal rosa del Himalaya, enzimas digestivas.',
      allergens: 'Contiene LECHE.',
      storage: 'Conservar en lugar fresco y seco.',
      warnings: 'Manténgase fuera del alcance de menores de edad.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-22-07892',
      origin: 'Estados Unidos.',
    },
  },

  'prod-syntha-6': {
    id: 'prod-syntha-6',
    name: 'BSN Syntha-6 Ultra-Premium Protein Matrix',
    category: 'Proteínas',
    tagline: 'Matriz Proteica Multifase con Sabor Excepcional',
    summary:
      'Una fórmula multifase que combina 6 fuentes de proteínas de asimilación rápida, media y sostenida. Aporta nutrientes constantes a tus fibras musculares hasta por 6 horas, ideal para atletas que buscan masa muscular consistente y saciedad prolongada.',
    highlights: [
      { icon: 'layers', label: 'Matriz', value: '6 Fuentes de Proteína' },
      { icon: 'activity', label: 'Proteína', value: '22 g por Porción' },
      { icon: 'shield', label: 'BCAAs', value: '10 g Aminoácidos Esenciales' },
      { icon: 'heart', label: 'Textura', value: 'Sabor Malteada Cremosa' },
    ],
    servingInfo: {
      servingSize: '1 copa (47 g)',
      servingsPerContainer: '48 servidas (5 Lbs)',
      presentation: 'Bote de 5 Libras (2.27 kg)',
      protein: '22 g',
      sugar: '2 - 3 g',
      fat: '6 g',
      calories: '200 kcal',
    },
    usageInstructions: {
      directions: 'Mezclar 1 copa en 8-10 oz de agua fría o leche descremada.',
      timing: 'A cualquier hora del día: entre comidas, antes de dormir o como reemplazo proteico.',
      preparation: 'Textura ultra cremosa tipo batido americano.',
    },
    healthNotice: {
      ingredientsSummary:
        'Matriz de proteínas (concentrado de suero, aislado de suero, caseinato de calcio, caseína micelar, aislado de proteína de leche, albúmina de huevo, péptidos de glutamina), crema de girasol, MCTs.',
      allergens: 'Contiene LECHE, HUEVO, SOYA y derivados de TRIGO.',
      storage: 'Lugar fresco y seco.',
      warnings: 'Consumir como parte de una dieta equilibrada.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-16-01890',
      origin: 'Estados Unidos.',
    },
  },

  'prod-cbum-creatine': {
    id: 'prod-cbum-creatine',
    name: 'Raw Nutrition CBUM Thavage Creatine',
    category: 'Creatinas',
    tagline: 'Monohidrato Micronizado Oficial Chris Bumstead',
    summary:
      '100% monohidrato de creatina pura sin sabor, calibrada para saturar los depósitos intramusculares de fosfocreatina. Aumenta drásticamente la fuerza explosiva en series pesadas, acelera la resíntesis de ATP y optimiza la hidratación y volumen intracelular.',
    highlights: [
      { icon: 'zap', label: 'Potencia', value: '5 g Monohidrato Puro' },
      { icon: 'shield', label: 'Absorción', value: 'Micronización Instantánea' },
      { icon: 'check-circle', label: 'Pureza', value: '0 Rellenos · 0 Sabores' },
      { icon: 'package', label: 'Rendimiento', value: '100 Servidas Completas' },
    ],
    servingInfo: {
      servingSize: '1 scoop (5 g)',
      servingsPerContainer: '100 servidas',
      presentation: 'Bote de 500 gramos',
      calories: '0 kcal',
      fat: '0 g',
      sugar: '0 g',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 scoop (5g) en 8 oz de agua, jugo de frutas o directamente en tu batido de proteína post-entreno.',
      timing:
        'Todos los días de manera constante (con o sin entreno) a cualquier hora. La clave de la creatina es la saturación diaria sostenida.',
      preparation: 'Se disuelve limpiamente sin alterar el sabor de tu bebida.',
    },
    healthNotice: {
      ingredientsSummary: '100% Monohidrato de Creatina Micronizado Grado Farmacéutico.',
      allergens: 'Libre de alérgenos comunes.',
      storage: 'Mantener bien sellado en ambiente seco para evitar apelmazamiento.',
      warnings:
        'Mantener una adecuada hidratación diaria (mínimo 2.5 a 3 litros de agua al día). No exceder la dosis recomendada.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-21-06712',
      origin: 'Estados Unidos.',
    },
  },

  'prod-on-creatine': {
    id: 'prod-on-creatine',
    name: 'Optimum Nutrition Micronized Creatine',
    category: 'Creatinas',
    tagline: 'Fuerza Muscular y Regeneración de ATP Comprobada',
    summary:
      'Monohidrato de creatina micronizado por Optimum Nutrition. Sus partículas ultrafinas garantizan una solubilidad superior sin asentarse en el fondo del vaso, facilitando la absorción intestinal y la voluminización muscular.',
    highlights: [
      { icon: 'shield', label: 'Dosis', value: '5 g por Servicio' },
      { icon: 'zap', label: 'Eficacia', value: 'Resíntesis Inmediata de ATP' },
      { icon: 'check-circle', label: 'Sin Sabor', value: 'Fácilmente Combinable' },
      { icon: 'package', label: 'Rendimiento', value: '60 - 120 Servidas' },
    ],
    servingInfo: {
      servingSize: '1 cucharadita dosificadora (5 g)',
      servingsPerContainer: '60 / 120 servidas según tamaño',
      presentation: 'Envase de 300g / 600g',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions: 'Añadir 1 porción a tu bebida favorita y agitar durante 15 segundos.',
      timing: 'Post-entreno junto con carbohidratos o proteína para maximizar la captación vía insulina.',
      preparation: 'Partículas micronizadas que quedan suspendidas en el líquido.',
    },
    healthNotice: {
      ingredientsSummary: 'Monohidrato de Creatina Micronizado 100% puro.',
      allergens: 'No contiene alérgenos declarados.',
      storage: 'Almacenar en lugar seco y fresco.',
      warnings: 'Beba abundante agua durante el día. Consulte a su médico.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-15-00431',
      origin: 'Estados Unidos.',
    },
  },

  'prod-universal-creapure': {
    id: 'prod-universal-creapure',
    name: 'Universal Nutrition Creatina Creapure',
    category: 'Creatinas',
    tagline: 'El Patrón Oro Alemán Creapure® al 99.9% de Pureza',
    summary:
      'Fabricada en Alemania bajo los controles más rigurosos del mundo, Creapure® es sinónimo del monohidrato de creatina más puro y libre de impurezas como DCD o DHT. Garantía total para atletas de alto rendimiento.',
    highlights: [
      { icon: 'award', label: 'Certificación', value: 'Sello Oficial Creapure® Alemania' },
      { icon: 'check-circle', label: 'Pureza', value: '99.9% Monohidrato Testeado' },
      { icon: 'zap', label: 'Rendimiento', value: 'Fuerza Explosiva Máxima' },
    ],
    servingInfo: {
      servingSize: '1 scoop (5 g)',
      servingsPerContainer: '100 servidas (500g)',
      presentation: 'Bote de 500 gramos',
    },
    usageInstructions: {
      directions: 'Disolver 5g en agua fresca o tu jugo preferido.',
      timing: 'Diariamente antes o después del entrenamiento.',
      preparation: 'Excelente miscibilidad y digestión ligera.',
    },
    healthNotice: {
      ingredientsSummary: 'Creapure® Creatine Monohydrate patentado.',
      allergens: 'Libre de alérgenos.',
      storage: 'Conservar en ambiente fresco.',
      warnings: 'Mantener fuera del alcance de los niños.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-DE-18-03221',
      origin: 'Alemania / Envasado en EE.UU.',
    },
  },

  'prod-xtend-bcaa': {
    id: 'prod-xtend-bcaa',
    name: 'Scivation Xtend BCAA Original',
    category: 'Aminoácidos',
    tagline: 'Líder Mundial en Intra-Entreno e Hidratación Anabólica',
    summary:
      'La fórmula de intra-entrenamiento más consumida en Costa Rica y el mundo. Aporta 7 gramos de aminoácidos de cadena ramificada en proporción clínica 2:1:1, combinados con glutamina, malato de citrulina y una matriz de electrolitos para mantener la hidratación celular y proteger la masa muscular durante el ejercicio intenso.',
    highlights: [
      { icon: 'zap', label: 'BCAAs', value: '7 g en Proporción 2:1:1' },
      { icon: 'heart', label: 'Glutamina', value: '2.5 g para Recuperación' },
      { icon: 'activity', label: 'Citrulina', value: '1 g Malato de Citrulina' },
      { icon: 'shield', label: 'Hidratación', value: 'Matriz Completa de Electrolitos' },
      { icon: 'check-circle', label: 'Azúcar', value: '0 g Calorías · 0 g Carbohidratos' },
    ],
    servingInfo: {
      servingSize: '1 scoop (14 g)',
      servingsPerContainer: '30 / 90 servidas',
      presentation: 'Bote de 420g / 1260g',
      calories: '0 kcal',
      sugar: '0 g',
      fat: '0 g',
    },
    usageInstructions: {
      directions: 'Mezclar 1 scoop en 10-14 oz (300-400 ml) de agua muy fría. Agitar vigorosamente.',
      timing:
        'Sorbos continuos durante el entrenamiento (intra-workout), o a lo largo del día entre comidas en etapas de definición.',
      preparation: 'Sabor refrescante y solubilidad completa instantánea.',
    },
    healthNotice: {
      ingredientsSummary:
        'L-Leucina, L-Isoleucina, L-Valina, L-Glutamina, Malato de Citrulina, citrato de sodio, cloruro de potasio, cloruro de sodio, ácido cítrico, sabores naturales y artificiales, sucralosa.',
      allergens: 'Fabricado en equipo que procesa leche y soya.',
      storage: 'Conservar en lugar fresco y seco bien cerrado.',
      warnings:
        'Diseñado para adultos activos sanos. No apto para mujeres embarazadas o en periodo de lactancia. Consulte a su médico.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-16-09210',
      origin: 'Estados Unidos.',
    },
  },
};

/**
 * Obtiene la especificación completa y enriquecida para un producto.
 * Si el producto fue creado en el panel de administración o no tiene ficha estática,
 * genera una especificación estructurada y atractiva con el estándar Dynasty.
 */
export function getProductSpecification(product: {
  id?: string;
  name: string;
  description?: string | null;
  category?: string;
  priceText?: string | null;
}): ProductSpecification {
  const staticSpec = product.id ? PRODUCT_SPECIFICATIONS[product.id] : undefined;
  if (staticSpec) {
    return staticSpec;
  }

  // Generador dinámico para productos personalizados
  const cat = (product.category || 'Suplementos').toLowerCase();
  const isProtein = cat.includes('prot');
  const isCreatine = cat.includes('crea');
  const isAmino = cat.includes('amino') || cat.includes('bcaa');

  return {
    id: product.id || 'custom-prod',
    name: product.name,
    category: product.category || 'Suplementos',
    tagline: isProtein
      ? 'Construcción Muscular & Recuperación de Alta Pureza'
      : isCreatine
      ? 'Fuerza Explosiva, Potencia & Volumen Celular'
      : isAmino
      ? 'Recuperación Muscular & Hidratación Superior'
      : 'Calidad Premium Certificada Dynasty',
    summary:
      product.description ||
      'Suplemento deportivo de grado premium formulado para potenciar el rendimiento físico, apoyar la síntesis muscular y acelerar la recuperación en atletas exigentes.',
    highlights: [
      {
        icon: isProtein ? 'activity' : isCreatine ? 'zap' : 'shield',
        label: isProtein ? 'Proteína' : isCreatine ? 'Potencia' : 'Calidad',
        value: isProtein ? 'Alta Biodisponibilidad' : isCreatine ? '100% Pura' : 'Grado Deportivo',
      },
      { icon: 'check-circle', label: 'Garantía', value: 'Sello Oficial Dynasty' },
      { icon: 'package', label: 'Presentación', value: 'Envase Original Sellado' },
    ],
    servingInfo: {
      servingSize: isCreatine ? '1 scoop (5g)' : '1 porción recomendada en etiqueta',
      servingsPerContainer: 'Ver envase',
      presentation: 'Empaque original sellado de fábrica',
      calories: isProtein ? '120 kcal aprox.' : '0 kcal',
    },
    usageInstructions: {
      directions:
        'Añadir 1 porción dosificadora en 6 a 10 onzas de agua fría o tu bebida favorita y mezclar bien.',
      timing: isCreatine
        ? 'Tomar diariamente de manera constante con tu batido o comida.'
        : isProtein
        ? 'Consumir inmediatamente después de entrenar o entre comidas.'
        : 'Consumir durante o después del entrenamiento.',
      preparation: 'Rápida disolución con agitador.',
    },
    healthNotice: {
      ingredientsSummary:
        'Ingredientes de grado alimentario aprobados. Consultar etiqueta del fabricante para lista completa.',
      allergens: isProtein ? 'Puede contener derivados de leche y soya.' : 'Ver envase.',
      storage: 'Almacenar en lugar seco y fresco fuera del alcance de los niños.',
      warnings:
        'Suplemento dietético para personas adultas sanas. No utilizar en embarazo o lactancia sin indicación médica.',
      registrationCR: 'Distribuido bajo normativa oficial de salud en Costa Rica.',
      origin: 'Importación autorizada.',
    },
  };
}
