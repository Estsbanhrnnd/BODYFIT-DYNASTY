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
    creatine?: string;
    caffeine?: string;
    citrulline?: string;
    betaAlanine?: string;
    sugar?: string;
    fat?: string;
    calories?: string;
    vitamins?: string;
    minerals?: string;
    keyActives?: string;
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
  // ==========================================
  // --- PROTEÍNAS ---
  // ==========================================
  'prod-iso100': {
    id: 'prod-iso100',
    name: 'Dymatize ISO 100 Hydrolyzed Whey',
    category: 'Proteínas',
    tagline: 'Máxima Pureza & Absorción Inmediata',
    summary:
      'Si tu objetivo es aumentar el tamaño y la fuerza muscular magra, ISO 100 es tu aliado definitivo. Formulado con 100% aislado de proteína de suero hidrolizada, procesada mediante microfiltración de flujo cruzado (CFM en frío) para preservar fracciones biológicas clave sin grasa, gluten ni lactosa. Ideal al despertar para frenar el catabolismo o tras un entreno exigente para acelerar la síntesis proteica.',
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
        'Añadir 1 copa dosificadora en 5 a 6 onzas (150-180 ml) de agua fría, leche vegetal o tu bebida favorita. Revolver con agitador o licuadora durante 15-20 segundos hasta su completa disolución.',
      timing:
        'Momento clave: Dentro de los 30 minutos posteriores a tu sesión de entrenamiento para detonar la síntesis de proteína (mTOR), o a primera hora en la mañana para detener el catabolismo nocturno.',
      preparation: 'Excelente solubilidad instantánea en frío sin grumos.',
    },
    healthNotice: {
      ingredientsSummary:
        'Aislado de proteína de suero hidrolizado, aislado de proteína de suero CFM, glutamina, lecitina de soya, sal marina, sabores naturales, sucralosa, glucósidos de esteviol (Stevia), calcio y potasio.',
      allergens: 'Contiene derivados de LECHE y SOYA. Elaborado en instalaciones certificadas GMP.',
      storage: 'Conservar en un lugar fresco, seco y protegido de la luz solar directa.',
      warnings:
        'Suplemento dietético para personas sanas. Mantener fuera del alcance de los niños. No utilizar en embarazo o lactancia sin autorización médica.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-19-04018',
      origin: 'Fabricado en EE.UU. Distribuidor autorizado Dynasty Costa Rica.',
    },
  },

  'prod-gold-standard': {
    id: 'prod-gold-standard',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    category: 'Proteínas',
    tagline: 'El Estándar de Oro Mundial en Recuperación Muscular',
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
        'Usar como suplemento nutricional. No sustituye una dieta balanceada. Consultar a su médico antes de usar.',
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
        'Mezclar 1 copa con 6 oz de agua fría o leche descremada en un vaso mezclador.',
      timing:
        'Ideal entre las comidas principales y después del entrenamiento de fuerza.',
      preparation: 'Microfiltración en frío para una disolución sin grumos.',
    },
    healthNotice: {
      ingredientsSummary:
        'Mezcla de proteína de suero aislada y péptidos, concentrado de proteína de suero, cacao, saborizantes naturales, mezcla de gomas, lecitina, sucralosa.',
      allergens: 'Contiene ingredientes de LECHE y SOYA.',
      storage: 'Mantener bien cerrado en lugar fresco y seco (15°C a 25°C).',
      warnings: 'No apto para menores de 18 años.',
      registrationCR: 'Reg. Sanitario Costa Rica: SD-US-20-01123',
      origin: 'Estados Unidos.',
    },
  },

  'prod-cbum-whey': {
    id: 'prod-cbum-whey',
    name: 'Raw Nutrition Whey Isolate (CBUM Series)',
    category: 'Proteínas',
    tagline: 'Fórmula Oficial del 5x Mr. Olympia Chris Bumstead',
    summary:
      'La línea insignia desarrollada bajo los estándares de Chris Bumstead. Cada porción contiene 100% aislado de proteína microfiltrada sin rellenos innecesarios, garantizando digestión liviana, definición muscular limpia y sabores gourmet premiados como Itholate Blueberry Muffin.',
    highlights: [
      { icon: 'award', label: 'Firma', value: 'Chris Bumstead Official Edition' },
      { icon: 'activity', label: 'Proteína', value: '25 g de Aislado Puro' },
      { icon: 'shield', label: 'Microfiltrado', value: 'Proceso en Frío CFM' },
      { icon: 'check-circle', label: 'Digestión', value: 'Cero Inflamación Gástrica' },
      { icon: 'package', label: 'Rendimiento', value: '25 Servidas' },
    ],
    servingInfo: {
      servingSize: '1 copa (31.5 g)',
      servingsPerContainer: '25 servidas',
      presentation: 'Bote de 1.7 Libras (787 g)',
      protein: '25 g',
      sugar: '1 g',
      fat: '0.5 g',
      calories: '110 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 porción con 6-8 oz de agua fría o tu leche preferida. Agitar durante 20 segundos.',
      timing:
        'Perfecto post-entreno inmediato o como snack proteico en dietas de definición estricta.',
      preparation: 'Se disuelve al instante sin espumas excesivas.',
    },
    healthNotice: {
      ingredientsSummary:
        'Aislado de proteína de suero de leche 100% microfiltrado, saborizantes naturales, sal rosa del Himalaya, sucralosa.',
      allergens: 'Contiene derivados de la LECHE.',
      storage: 'Conservar en ambiente seco y protegido de la humedad.',
      warnings: 'Manténgase fuera del alcance de los niños.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-syntha-6': {
    id: 'prod-syntha-6',
    name: 'BSN Syntha-6 Ultra-Premium Protein Matrix',
    category: 'Proteínas',
    tagline: 'Matriz Multifase con Sabor Excepcional de Malteada',
    summary:
      'Reconocida mundialmente como la proteína de mejor sabor del mercado. Su matriz multifase de 6 proteínas proporciona una liberación prolongada de aminoácidos durante hasta 6 horas, nutriendo el tejido muscular de día o de noche.',
    highlights: [
      { icon: 'clock', label: 'Liberación', value: 'Matriz Multifase Sostenida' },
      { icon: 'activity', label: 'Proteína', value: '22 g por Porción' },
      { icon: 'shield', label: 'BCAAs & EFAs', value: '10 g Aminoácidos Esenciales' },
      { icon: 'heart', label: 'Sabor', value: 'Textura Cremosa Tipo Milkshake' },
    ],
    servingInfo: {
      servingSize: '1 copa (47 g)',
      servingsPerContainer: '48 servidas (bote 5 Lbs)',
      presentation: 'Bote de 5 Libras (2.27 kg)',
      protein: '22 g',
      sugar: '2 - 3 g',
      fat: '6 g (MCTs saludables)',
      calories: '200 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 copa en 8-10 oz de agua fría o leche entera para una textura de batido gourmet.',
      timing:
        'Ideal entre comidas, como reemplazo de postre fitness o antes de dormir por su contenido de caseína micelar.',
      preparation: 'Excelente textura espesa y saciante.',
    },
    healthNotice: {
      ingredientsSummary:
        'Matriz de proteínas (concentrado de suero, aislado de suero, caseinato de calcio, caseína micelar, aislado de proteína de leche, albúmina de huevo), aceite de girasol, MCTs, lecitina, sucralosa.',
      allergens: 'Contiene LECHE, HUEVO y SOYA.',
      storage: 'Almacenar en lugar fresco y seco.',
      warnings: 'Consumir como parte de un estilo de vida saludable.',
      origin: 'Estados Unidos.',
    },
  },

  // ==========================================
  // --- CREATINAS ---
  // ==========================================
  'prod-cbum-creatine': {
    id: 'prod-cbum-creatine',
    name: 'Raw Nutrition CBUM Thavage Creatine',
    category: 'Creatinas',
    tagline: '100% Monohidrato de Creatina Pura de Grado Clínico',
    summary:
      'El suplemento ergogénico con mayor evidencia científica del mundo en la edición de campeonato de Chris Bumstead. Incrementa las reservas intramusculares de fosfocreatina para elevar tu fuerza máxima, velocidad de repetición y volumen celular.',
    highlights: [
      { icon: 'award', label: 'Calidad', value: 'Grado Farmacéutico HPLC' },
      { icon: 'zap', label: 'Dosis', value: '5 g Monohidrato Puro' },
      { icon: 'shield', label: 'Volumen', value: 'Hidratación Intracelular' },
      { icon: 'check-circle', label: 'Sin Sabor', value: 'Mezcla Invisible en Shakers' },
      { icon: 'package', label: 'Servidas', value: '100 Días de Potencia' },
    ],
    servingInfo: {
      servingSize: '1 copa (5 g)',
      servingsPerContainer: '100 servidas',
      presentation: 'Bote de 500 g',
      creatine: '5.0 g',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 copa dosificadora (5g) en 8 oz de agua, jugo o directamente en tu batido de proteína post-entreno.',
      timing:
        'Tomar diariamente sin descanso. Los días de entreno, consumir inmediatamente post-ejercicio con carbohidratos simples para maximizar absorción por picos de insulina.',
      preparation: 'Micronizada para disolución transparente y sin sabor residual.',
    },
    healthNotice: {
      ingredientsSummary: '100% Monohidrato de Creatina micronizado. Sin aditivos ni colorantes.',
      allergens: 'Libre de alérgenos comunes.',
      storage: 'Mantener bien tapado para evitar que absorba humedad ambiental.',
      warnings: 'Asegurar un consumo adecuado de agua (2 a 3 litros al día).',
      origin: 'Estados Unidos.',
    },
  },

  'prod-on-creatine': {
    id: 'prod-on-creatine',
    name: 'Optimum Nutrition Micronized Creatine Powder',
    category: 'Creatinas',
    tagline: 'Creatina Micronizada para Regeneración Rápida de ATP',
    summary:
      'Fórmula clásica de Optimum Nutrition micronizada a partículas microscópicas que permanecen suspendidas en líquido mucho más tiempo que la creatina estándar. Regenera ATP en esfuerzos de máxima intensidad.',
    highlights: [
      { icon: 'zap', label: 'Micronizado', value: 'Fácil Disolución Sin Asientos' },
      { icon: 'activity', label: 'Dosis', value: '5 g Creatina Monohidratada' },
      { icon: 'award', label: 'Certificación', value: 'Informed Choice Aprobado' },
      { icon: 'package', label: 'Rendimiento', value: '60 - 120 Servidas' },
    ],
    servingInfo: {
      servingSize: '1 cucharadita colmada (5 g)',
      servingsPerContainer: '60 servidas (bote 300g)',
      presentation: 'Bote de 300 g / 600 g',
      creatine: '5.0 g',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions:
        'Añadir 1 cucharadita (5g) en agua o tu bebida deportiva favorita y agitar.',
      timing:
        'La constancia diaria es la clave. Tomar todos los días a la misma hora para mantener la saturación muscular.',
      preparation: 'Se disuelve fácilmente sin grumos arenosos.',
    },
    healthNotice: {
      ingredientsSummary: 'Monohidrato de creatina 100% puro.',
      allergens: 'No contiene alérgenos principales.',
      storage: 'Conservar en lugar seco a temperatura ambiente.',
      warnings: 'Mantener fuera del alcance de los niños.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-universal-creapure': {
    id: 'prod-universal-creapure',
    name: 'Universal Nutrition Creatina Creapure',
    category: 'Creatinas',
    tagline: 'La Patente Alemana Creapure® con 99.9% de Pureza',
    summary:
      'Fabricada en Alemania bajo los controles de calidad más exigentes del mundo. Creapure® es sometida a pruebas continuas de cromatografía para certificar la ausencia total de subproductos indeseados como creatinina o diciandiamida.',
    highlights: [
      { icon: 'shield', label: 'Patente', value: 'Creapure® Made in Germany' },
      { icon: 'award', label: 'Pureza', value: '99.9% Certificada' },
      { icon: 'zap', label: 'Potencia', value: 'Fuerza & Recuperación ATP' },
      { icon: 'package', label: 'Presentación', value: '500 g de Calidad Médica' },
    ],
    servingInfo: {
      servingSize: '1 cucharadita (5 g)',
      servingsPerContainer: '100 servidas',
      presentation: 'Bote de 500 g',
      creatine: '5.0 g Creapure®',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions: 'Mezclar 1 porción en tu batido de proteína o zumo de frutas.',
      timing: 'Post-entrenamiento o junto con el desayuno los días de descanso.',
      preparation: 'Polvo micro-fino sin textura arenosa.',
    },
    healthNotice: {
      ingredientsSummary: 'Monohidrato de Creatina Creapure®.',
      allergens: 'Libre de gluten, lactosa y soya.',
      storage: 'Lugar fresco y oscuro.',
      warnings: 'Consulte a su médico antes de usar si tiene enfermedad renal.',
      origin: 'Materia prima de Alemania, empacado en EE.UU.',
    },
  },

  'prod-platinum-creatine': {
    id: 'prod-platinum-creatine',
    name: 'MuscleTech Platinum 100% Creatine',
    category: 'Creatinas',
    tagline: 'Creatina Ultra-Micronizada Testada por HPLC',
    summary:
      'Platinum 100% Creatine entrega a tus músculos la forma de creatina micronizada más clínicamente investigada. Estudios demuestran ganancias comprobadas de masa magra y mejoras en repeticiones bajo cargas submáximas.',
    highlights: [
      { icon: 'check-circle', label: 'Calidad HPLC', value: 'Pureza Analizada en Lote' },
      { icon: 'zap', label: 'Dosis', value: '5000 mg por Toma' },
      { icon: 'activity', label: 'Estudios', value: 'Ganancia de Masa Magra' },
      { icon: 'package', label: 'Rendimiento', value: '80 Servidas' },
    ],
    servingInfo: {
      servingSize: '1 scoop (5 g)',
      servingsPerContainer: '80 servidas',
      presentation: 'Bote de 400 g',
      creatine: '5.0 g',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions: 'Mezclar 1 scoop con 8 oz de agua.',
      timing: 'Tomar diariamente, idealmente pre o post entrenamiento.',
      preparation: 'Rápida solubilidad.',
    },
    healthNotice: {
      ingredientsSummary: 'Monohidrato de creatina micronizado.',
      allergens: 'Elaborado en instalaciones que procesan leche y soya.',
      storage: 'Conservar en ambiente seco.',
      warnings: 'Beber al menos 8 a 10 vasos de agua al día durante su uso.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-nutricost-creatine': {
    id: 'prod-nutricost-creatine',
    name: 'Nutricost Pure Creatine Monohydrate 500g',
    category: 'Creatinas',
    tagline: 'Pureza Certificada y Máximo Rendimiento por Envase',
    summary:
      'La mejor relación calidad-precio en nutrición deportiva. 500 gramos completos de monohidrato de creatina micronizada de pureza garantizada por laboratorios independientes certificados ISO.',
    highlights: [
      { icon: 'package', label: 'Cantidad', value: '500 g (100 Porciones)' },
      { icon: 'check-circle', label: 'Laboratorio', value: '3rd Party Lab Tested' },
      { icon: 'shield', label: 'Fórmula', value: 'Sin OGM (Non-GMO) & Sin Gluten' },
      { icon: 'zap', label: 'Eficacia', value: 'Fuerza Muscular y Potencia' },
    ],
    servingInfo: {
      servingSize: '1 scoop (5 g)',
      servingsPerContainer: '100 servidas',
      presentation: 'Bote de 500 g',
      creatine: '5.0 g',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions: 'Añadir 1 cucharada dosificadora a tu líquido de preferencia.',
      timing: 'Uso continuo todos los días del año.',
      preparation: 'Disolución instantánea sin sabor.',
    },
    healthNotice: {
      ingredientsSummary: 'Monohidrato de creatina puro.',
      allergens: 'Sin gluten, sin soya, apto para vegetarianos.',
      storage: 'Lugar fresco y seco.',
      warnings: 'No exceder la dosis recomendada.',
      origin: 'Estados Unidos.',
    },
  },

  // ==========================================
  // --- AMINOÁCIDOS ---
  // ==========================================
  'prod-xtend-bcaa': {
    id: 'prod-xtend-bcaa',
    name: 'Scivation Xtend BCAA Original 7G',
    category: 'Aminoácidos',
    tagline: 'Líder Mundial en Recuperación Intra-Entreno & Electrolitos',
    summary:
      'El suplemento intra-entrenamiento más vendido del planeta. 7 gramos de aminoácidos de cadena ramificada (BCAAs) en la proporción comprobada 2:1:1, combinados con 2.5g de glutamina y una mezcla de electrolitos hidratantes para entrenar con mayor intensidad y cero calorías.',
    highlights: [
      { icon: 'activity', label: 'BCAAs', value: '7 g Proporción 2:1:1' },
      { icon: 'heart', label: 'Glutamina', value: '2.5 g Recuperación Celular' },
      { icon: 'shield', label: 'Electrolitos', value: 'Mezcla Patentada de Hidratación' },
      { icon: 'check-circle', label: 'Cero Azúcar', value: '0 Calorías & 0 Carbs' },
      { icon: 'package', label: 'Servidas', value: '30 Porciones' },
    ],
    servingInfo: {
      servingSize: '1 scoop (14 g)',
      servingsPerContainer: '30 servidas',
      presentation: 'Bote de 420 g',
      bcaa: '7.0 g',
      leucine: '3.5 g',
      glutamine: '2.5 g',
      citrulline: '1.0 g',
      sugar: '0 g',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 scoop en 10-14 oz de agua fría en tu shaker y beber a sorbos continuos durante tu sesión de entrenamiento.',
      timing:
        'Durante el entrenamiento (intra-workout) para reducir la degradación muscular y reponer sales minerales.',
      preparation: 'Increíble sabor frutal refrescante y solubilidad total.',
    },
    healthNotice: {
      ingredientsSummary:
        'L-Leucina, L-Glutamina, L-Isoleucina, L-Valina, mezcla de electrolitos (citrato de sodio, cloruro de potasio, cloruro de sodio), malato de citrulina, ácido cítrico, sucralosa.',
      allergens: 'Elaborado en equipo que procesa productos con leche y soya.',
      storage: 'Conservar en un lugar fresco y seco.',
      warnings: 'Diseñado para adultos sanos durante actividad física.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-on-amino-energy': {
    id: 'prod-on-amino-energy',
    name: 'Optimum Nutrition Essential Amino Energy',
    category: 'Aminoácidos',
    tagline: 'Aminoácidos Esenciales + Energía Limpia con Cafeína Natural',
    summary:
      'Combina una proporción óptima de aminoácidos esenciales de absorción rápida con energizantes naturales como extracto de té verde y café verde. Te brinda concentración mental nítida, energía limpia y soporte muscular en cualquier momento del día.',
    highlights: [
      { icon: 'zap', label: 'Cafeína Natural', value: '100 mg (Té Verde & Café)' },
      { icon: 'activity', label: 'Amino Blend', value: '5 g Aminoácidos Micronizados' },
      { icon: 'shield', label: 'Enfoque', value: 'Claridad Mental Sin Temblores' },
      { icon: 'check-circle', label: 'Bajo en Calorías', value: 'Solo 10 kcal y Cero Azúcar' },
      { icon: 'package', label: 'Rendimiento', value: '30 Servidas' },
    ],
    servingInfo: {
      servingSize: '2 scoops (9 g)',
      servingsPerContainer: '30 servidas',
      presentation: 'Bote de 270 g',
      bcaa: '5.0 g Amino Blend',
      caffeine: '100 mg',
      sugar: '0 g',
      calories: '10 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 2 scoops en 10-12 oz de agua fría para un impulso de energía moderado, o 4 scoops para un pre-entreno intenso.',
      timing:
        'A primera hora de la mañana para sustituir el café, o 20 minutos antes de entrenar.',
      preparation: 'Fácil disolución con cuchara o shaker.',
    },
    healthNotice: {
      ingredientsSummary:
        'Mezcla de aminoácidos (taurina, L-glutamina, L-arginina, L-leucina, beta-alanina, L-citrulina, L-isoleucina, L-valina), mezcla energética (cafeína de té verde y extracto de café verde), ácido málico, sucralosa.',
      allergens: 'Contiene SOYA.',
      storage: 'Mantener bien cerrado en lugar fresco y seco.',
      warnings: 'Contiene 100mg de cafeína por porción. No consumir antes de dormir.',
      origin: 'Estados Unidos.',
    },
  },

  // ==========================================
  // --- PRE-ENTRENOS (NUEVOS) ---
  // ==========================================
  'prod-c4-original': {
    id: 'prod-c4-original',
    name: 'Cellucor C4 Original Pre-Workout',
    category: 'Pre-Entrenos',
    tagline: 'Energía Explosiva & Enfoque Legendario para Entrenar Pesado',
    summary:
      'El pre-entreno número 1 en ventas de América. Diseñado para desatar energía explosiva, resistencia muscular mejorada y congestiones musculares bombeadas. Con la dosis precisa de cafeína y CarnoSyn® Beta-Alanina para superar tus récords personales.',
    highlights: [
      { icon: 'zap', label: 'Cafeína', value: '150 mg Energía Explosiva' },
      { icon: 'activity', label: 'Resistencia', value: '1.6 g CarnoSyn® Beta-Alanina' },
      { icon: 'shield', label: 'Bombeo', value: '1 g Nitrato de Creatina (NO3-T)' },
      { icon: 'award', label: 'Popularidad', value: '#1 Pre-Entreno en Ventas' },
      { icon: 'package', label: 'Rendimiento', value: '30 Servidas' },
    ],
    servingInfo: {
      servingSize: '1 scoop (6.5 g)',
      servingsPerContainer: '30 servidas',
      presentation: 'Bote de 195 g',
      caffeine: '150 mg',
      betaAlanine: '1.6 g CarnoSyn®',
      creatine: '1.0 g Nitrato de Creatina',
      sugar: '0 g',
      calories: '0 kcal',
    },
    usageInstructions: {
      directions:
        'Tomar 1 porción (1 scoop) de C4 Original mezclada con 6 oz de agua 20-30 minutos antes de entrenar.',
      timing: '20 a 30 minutos previos a la sesión de fuerza o entrenamiento funcional.',
      preparation: 'Se disuelve inmediatamente en agua fría.',
    },
    healthNotice: {
      ingredientsSummary:
        'CarnoSyn® Beta-Alanina, Nitrato de Creatina (NO3-T), L-Arginina Alpha Cetoglutarato, Cafeína Anhidra, N-Acetil L-Tirosina, Velvet Bean (Mucuna pruriens), Teacrina (TeaCrine®).',
      allergens: 'Libre de alérgenos comunes.',
      storage: 'Almacenar en lugar seco y fresco.',
      warnings:
        'Puede provocar una sensación inofensiva de hormigueo en la piel debido a la beta-alanina. No combinar con otros estimulantes ni consumir dentro de las 5 horas previas al sueño.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-cbum-thavage-pre': {
    id: 'prod-cbum-thavage-pre',
    name: 'Raw Nutrition CBUM Thavage Pre-Workout',
    category: 'Pre-Entrenos',
    tagline: 'Fórmula Elite de Chris Bumstead para Bombeo, Potencia & Foco Láser',
    summary:
      'Desarrollado y probado exhaustivamente por el 5x Mr. Olympia Chris Bumstead. No es un pre-entreno común sobrecargado de cafeína barata: es una fórmula científica completa con 6g de L-Citrulina pura para vasodilatación máxima, hidratación celular y nootrópicos para concentración de campeonato.',
    highlights: [
      { icon: 'award', label: 'Edición', value: 'Fórmula Oficial de Chris Bumstead' },
      { icon: 'heart', label: 'Óxido Nítrico', value: '6 g L-Citrulina Pura' },
      { icon: 'activity', label: 'Fuerza & Resistencia', value: '3.2 g Beta-Alanina + 2.5 g Betaína' },
      { icon: 'zap', label: 'Matriz Energética', value: '305 mg Cafeína Total (Bifásica)' },
      { icon: 'shield', label: 'Enfoque Mental', value: 'Alpha-GPC & L-Tirosina' },
    ],
    servingInfo: {
      servingSize: '1 scoop (13.1 g) o 2 scoops completos (26.2 g)',
      servingsPerContainer: '40 servidas (1 scoop) / 20 servidas (2 scoops)',
      presentation: 'Bote de 524 g',
      caffeine: '305 mg (en dosis de 2 scoops)',
      citrulline: '6.0 g L-Citrulina Pura',
      betaAlanine: '3.2 g Beta-Alanina',
      sugar: '0 g',
      calories: '5 kcal',
    },
    usageInstructions: {
      directions:
        'Evaluar tolerancia con 1 scoop mezclado con 8 oz de agua 20-30 minutos antes del entrenamiento. Usuarios avanzados pueden consumir 2 scoops con 12-14 oz de agua.',
      timing: '20 a 30 minutos antes de entrenar.',
      preparation: 'Agitar enérgicamente en vaso mezclador con hielo.',
    },
    healthNotice: {
      ingredientsSummary:
        'L-Citrulina, CarnoSyn® Beta-Alanina, Betaína Anhidra, L-Tirosina, Alpha-GPC (50%), Cafeína Anhidra, Dicafeína Malato (Infinergy™), Extracto de naranja amarga (Advantra Z®), Huperzina A, sal del Himalaya.',
      allergens: 'Sin alérgenos comunes.',
      storage: 'Conservar en ambiente seco y fresco.',
      warnings:
        'Solo para atletas avanzados mayores de 18 años. No exceder 2 scoops en un período de 24 horas.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-pre-jym': {
    id: 'prod-pre-jym',
    name: 'JYM Supplement Science Pre JYM High-Performance',
    category: 'Pre-Entrenos',
    tagline: 'Pre-Entreno con Dosis Clínicas Completas y 13 Ingredientes Científicos',
    summary:
      'Formulado por el renombrado científico del deporte Dr. Jim Stoppani. Pre JYM revolucionó la industria al eliminar las mezclas propietarias engañosas: incluye 13 ingredientes en dosis clínicas completas para fuerza, bombeo vascular, resistencia muscular y recuperación activa.',
    highlights: [
      { icon: 'award', label: 'Fórmula', value: 'Dosis Clínicas Transparentes' },
      { icon: 'heart', label: 'Bombeo', value: '6 g Malato de Citrulina 2:1' },
      { icon: 'shield', label: 'Fuerza & Potencia', value: '2 g Creatina HCl + 2 g Beta-Alanina' },
      { icon: 'activity', label: 'Anti-Catabólico', value: '6 g BCAAs (3:1:1)' },
      { icon: 'zap', label: 'Energía Limpia', value: '300 mg Cafeína Anhidra' },
    ],
    servingInfo: {
      servingSize: '1 scoop grande (26 g)',
      servingsPerContainer: '30 servidas',
      presentation: 'Bote gigante de 780 g',
      caffeine: '300 mg',
      citrulline: '6.0 g Malato de Citrulina',
      bcaa: '6.0 g BCAAs',
      creatine: '2.0 g Creatina HCl',
      betaAlanine: '2.0 g Beta-Alanina',
      calories: '20 kcal',
    },
    usageInstructions: {
      directions:
        'Mezclar 1 scoop en 16-24 oz de agua fría y beber durante los 30-45 minutos previos a tu entrenamiento.',
      timing: '30 a 45 minutos antes del entreno de alta intensidad.',
      preparation: 'Requiere abundante agua para óptima hidratación celular.',
    },
    healthNotice: {
      ingredientsSummary:
        'Malato de Citrulina 2:1, mezcla de BCAAs (L-Leucina, L-Isoleucina, L-Valina), Creatina HCl, Beta-Alanina, L-Tirosina, Cafeína Anhidra, Extracto de raíz de remolacha, Alpha-GPC, Huperzina A, Bioperine®.',
      allergens: 'Libre de alérgenos principales.',
      storage: 'Mantener bien sellado en lugar fresco.',
      warnings: 'Pre-entreno ultra potente. No consumir personas sensibles a la cafeína.',
      origin: 'Estados Unidos.',
    },
  },

  // ==========================================
  // --- MULTIVITAMÍNICOS (NUEVOS) ---
  // ==========================================
  'prod-opti-men': {
    id: 'prod-opti-men',
    name: 'Optimum Nutrition Opti-Men Multivitamin',
    category: 'Multivitamínicos',
    tagline: 'Sistema Integral de Optimización Nutricional para Hombres Activos',
    summary:
      'Diseñado específicamente para las altas demandas metabólicas del hombre deportista. Aporta más de 75 ingredientes activos en 4 mezclas especializadas: Amino-Men Blend, Phyto-Men Blend (antioxidantes botánicos), Viri-Men Blend (vitalidad masculina) y Enzy-Men Blend para una asimilación digestiva óptima.',
    highlights: [
      { icon: 'shield', label: 'Complejo', value: '75+ Ingredientes Activos' },
      { icon: 'activity', label: 'Vitaminas & Minerales', value: '25 Vitaminas Clave en Alta Potencia' },
      { icon: 'heart', label: 'Amino Blend', value: '8 Aminoácidos en Forma Libre' },
      { icon: 'zap', label: 'Phyto Blend', value: 'Concentrado Botánico Antioxidante' },
      { icon: 'package', label: 'Rendimiento', value: '90 - 150 Tabletas' },
    ],
    servingInfo: {
      servingSize: '3 tabletas diarias',
      servingsPerContainer: '30 - 50 días de suministro',
      presentation: 'Frasco de 90 / 150 tabletas',
      vitamins: 'Vitamina C (300mg), D (1500 UI), Complejo B de Alta Potencia',
      minerals: 'Zinc (15mg), Magnesio (100mg), Selenio (200mcg)',
      keyActives: 'Amino-Men Blend (1g), Phyto-Men Blend (100mg), Enzimas',
    },
    usageInstructions: {
      directions:
        'Tomar 3 tabletas al día acompañadas de alimentos sólidos (por ejemplo, con el desayuno o el almuerzo) y abundante agua.',
      timing: 'Junto con las comidas principales para una absorción óptima de vitaminas liposolubles.',
      preparation: 'Tabletas recubiertas para fácil deglución.',
    },
    healthNotice: {
      ingredientsSummary:
        'Vitaminas A, C, D, E, K, Tiamina, Riboflavina, Niacina, B6, Folato, B12, Biotina, Calcio, Yodo, Magnesio, Zinc, Selenio, Cobre, Manganeso, Cromo, Mezcla de aminoácidos, Mezcla botánica, Enzimas digestivas.',
      allergens: 'Contiene derivados de Ostras (mariscos).',
      storage: 'Conservar en lugar fresco, seco y oscuro.',
      warnings: 'Mantener fuera del alcance de los niños.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-opti-women': {
    id: 'prod-opti-women',
    name: 'Optimum Nutrition Opti-Women Multivitamin',
    category: 'Multivitamínicos',
    tagline: 'Nutrientes Esenciales para Salud, Energía & Rendimiento Femenino',
    summary:
      'Formulado minuciosamente para las necesidades biológicas de la mujer activa. Contiene 40 ingredientes activos, incluyendo 23 vitaminas y minerales esenciales, 150mg de calcio para soporte óseo, 18mg de hierro quelado para reponer ferritina y extractos botánicos especiales como Dong Quai y Uva Ursi.',
    highlights: [
      { icon: 'heart', label: 'Salud Femenina', value: 'Hierro Quelado & Ácido Fólico' },
      { icon: 'shield', label: 'Huesos Fuertes', value: '150 mg Calcio + Vitamina D' },
      { icon: 'zap', label: 'Energía & Piel', value: 'Complejo B & Antioxidantes' },
      { icon: 'check-circle', label: 'Cápsulas Vegetarianas', value: 'Vcaps Fáciles de Digerir' },
      { icon: 'package', label: 'Suministro', value: '60 - 120 Cápsulas' },
    ],
    servingInfo: {
      servingSize: '2 cápsulas',
      servingsPerContainer: '30 - 60 días',
      presentation: 'Frasco de 60 / 120 cápsulas',
      vitamins: 'Vitamina A, C, D, E, K y Complejo B completo',
      minerals: 'Hierro (18mg), Calcio (150mg), Zinc (15mg)',
      keyActives: 'Dong Quai, Extracto de Baya de Sauzgatillo, Garcinia',
    },
    usageInstructions: {
      directions:
        'Tomar 2 cápsulas diarias con alimentos y un vaso grande de agua.',
      timing: 'Con el desayuno o la primera comida del día.',
      preparation: 'Cápsulas vegetales de disolución rápida.',
    },
    healthNotice: {
      ingredientsSummary:
        'Vitaminas y minerales quelados de alta biodisponibilidad, extractos botánicos estandarizados, celulosa vegetal, estearato de magnesio.',
      allergens: 'Libre de alérgenos comunes.',
      storage: 'Guardar en un lugar seco y fresco.',
      warnings:
        'La sobredosis accidental de productos con hierro es una de las principales causas de intoxicación en menores de 6 años. Mantener fuera del alcance de los niños.',
      origin: 'Estados Unidos.',
    },
  },

  'prod-animal-pak': {
    id: 'prod-animal-pak',
    name: 'Universal Nutrition Animal Pak The Complete Multi-Pack',
    category: 'Multivitamínicos',
    tagline: 'El Complejo de Entrenamiento Legendario del Fisicoculturismo Mundial',
    summary:
      'Desde 1983, Animal Pak es el suplemento base innegociable de campeones de fuerza y culturismo. Cada paquete individual (pack) aporta megadosis de vitaminas y minerales, complejo de aminoácidos esenciales, complejo antioxidante, enzimas digestivas y complejo de apoyo hepático para que tu cuerpo asimile cada gramo de proteína que ingieres.',
    highlights: [
      { icon: 'award', label: 'Leyenda', value: 'El Pack #1 del Fisicoculturismo' },
      { icon: 'shield', label: 'Packs Individuales', value: 'Fórmula Completa Todo en Uno' },
      { icon: 'activity', label: 'Mega-Vitaminas', value: 'Complejo de Rendimiento Atlético' },
      { icon: 'heart', label: 'Enzimas & Hígado', value: 'Soporte Digestivo & Hepático' },
      { icon: 'package', label: 'Duración', value: '30 - 44 Packs' },
    ],
    servingInfo: {
      servingSize: '1 pack diario (o 2 packs para atletas en preparación)',
      servingsPerContainer: '30 o 44 packs',
      presentation: 'Lata icónica de 30 o 44 packs',
      keyActives: 'Complejo de Vitaminas, Minerales, Complejo de Aminoácidos, Complejo Antioxidante y Enzimas',
    },
    usageInstructions: {
      directions:
        'Tomar 1 pack con el desayuno o cualquier comida sólida abundante, acompañado de suficiente agua.',
      timing:
        'Atletas de competición y entrenamiento extremo pueden tomar 2 packs diarios con 4 a 6 horas de separación entre comidas.',
      preparation: 'Packs individuales listos para llevar en tu maleta de gym.',
    },
    healthNotice: {
      ingredientsSummary:
        'Complejo multivitamínico y mineral, aislado de proteína de suero, concentrado de hígado de res argentino desecado, glutamina, leucina, enzimas digestivas (bromelina, papaína), extracto de cardo mariano.',
      allergens: 'Contiene LECHE y SOYA. Elaborado en instalaciones GMP.',
      storage: 'Almacenar en lugar fresco y seco, alejado de calor extremo.',
      warnings:
        'Suplemento para atletas adultos de alto rendimiento. Consulte a su médico antes de usar si tiene alguna condición médica previa.',
      origin: 'Estados Unidos.',
    },
  },
};

export function getProductSpecification(id: string): ProductSpecification {
  if (PRODUCT_SPECIFICATIONS[id]) {
    return PRODUCT_SPECIFICATIONS[id];
  }

  const isProtein = id.toLowerCase().includes('whey') || id.toLowerCase().includes('iso') || id.toLowerCase().includes('protein');
  const isCreatine = id.toLowerCase().includes('creatine') || id.toLowerCase().includes('creapure');
  const isPreWorkout = id.toLowerCase().includes('pre') || id.toLowerCase().includes('c4') || id.toLowerCase().includes('thavage');

  return {
    id,
    name: 'Suplemento Deportivo Dynasty',
    category: isProtein ? 'Proteínas' : isCreatine ? 'Creatinas' : isPreWorkout ? 'Pre-Entrenos' : 'Suplementos',
    tagline: 'Fórmula Premium Certificada BodyFit Dynasty',
    summary:
      'Suplemento nutricional formulado con ingredientes de pureza comprobada y calidad de exportación para atletas que buscan el máximo rendimiento físico y recuperación muscular.',
    highlights: [
      { icon: 'award', label: 'Grado', value: 'Farmacéutico Certificado' },
      { icon: 'shield', label: 'Seguridad', value: 'Libre de Sustancias Prohibidas' },
      { icon: 'check-circle', label: 'Pureza', value: '100% Garantizada' },
      { icon: 'zap', label: 'Eficacia', value: 'Respaldado por la Ciencia' },
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
        : isPreWorkout
        ? 'Consumir 20-30 minutos antes del entrenamiento.'
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
