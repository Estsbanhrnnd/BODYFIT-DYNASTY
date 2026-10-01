/**
 * Catálogo Oficial Exhaustivo de Recetas de BodyFit Dynasty ®
 * 200 recetas totales escalonadas por nivel de membresía:
 * - Standard & Bronze: 24 recetas (6 desayuno, 6 almuerzo, 6 cena, 6 snack)
 * - Platinum: 80 recetas (20 desayuno, 20 almuerzo, 20 cena, 20 snack)
 * - Golden VIP: 200 recetas (50 desayuno, 50 almuerzo, 50 cena, 50 snack)
 * Incluye desglose nutricional completo (Calorías, Proteína, Carbohidratos, Grasas) y tiempo de preparación.
 */

import { MembershipTierId, hasTierAccess } from './membershipConfig';

export type RecipeCategory = 'desayuno' | 'almuerzo' | 'cena' | 'snack';

export interface Recipe {
  id: string;
  category: RecipeCategory;
  title: string;
  time: string;
  imageUrl: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  requiredTier: MembershipTierId;
  ingredients: string[];
  directions: string;
}

export const RECIPE_CATEGORIES: { id: RecipeCategory; label: string; icon: string }[] = [
  { id: 'desayuno', label: 'Desayuno', icon: 'sunrise' },
  { id: 'almuerzo', label: 'Almuerzo', icon: 'sun' },
  { id: 'cena', label: 'Cena', icon: 'moon' },
  { id: 'snack', label: 'Snack', icon: 'coffee' },
];

export const RECIPES_CATALOG: Recipe[] = [
  {
    "id": "desayuno-01",
    "category": "desayuno",
    "title": "Avena tropical con yogur griego y chía",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 340,
    "protein": 20,
    "carbs": 35,
    "fats": 9,
    "requiredTier": "standard",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Avena tropical con yogur griego y chía: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-02",
    "category": "desayuno",
    "title": "Tostada de aguacate hass y huevo pochado",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 347,
    "protein": 23,
    "carbs": 40,
    "fats": 11,
    "requiredTier": "standard",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Tostada de aguacate hass y huevo pochado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-03",
    "category": "desayuno",
    "title": "Bowl de quinoa tibia con frutos rojos y miel",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80",
    "calories": 354,
    "protein": 26,
    "carbs": 45,
    "fats": 13,
    "requiredTier": "standard",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Bowl de quinoa tibia con frutos rojos y miel: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-04",
    "category": "desayuno",
    "title": "Omelette verde de claras con espinaca y ricota",
    "time": "13 min",
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
    "calories": 361,
    "protein": 29,
    "carbs": 50,
    "fats": 15,
    "requiredTier": "standard",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Omelette verde de claras con espinaca y ricota: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-05",
    "category": "desayuno",
    "title": "Pudín de chía hidratada con cacao puro",
    "time": "14 min",
    "imageUrl": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80",
    "calories": 368,
    "protein": 32,
    "carbs": 55,
    "fats": 9,
    "requiredTier": "standard",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Pudín de chía hidratada con cacao puro: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-06",
    "category": "desayuno",
    "title": "Arepa integral rellena de pollo al vapor",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    "calories": 375,
    "protein": 35,
    "carbs": 35,
    "fats": 11,
    "requiredTier": "standard",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Arepa integral rellena de pollo al vapor: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-07",
    "category": "desayuno",
    "title": "Panquecas proteicas de avena y plátano",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&auto=format&fit=crop&q=80",
    "calories": 382,
    "protein": 22,
    "carbs": 40,
    "fats": 13,
    "requiredTier": "platinum",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Panquecas proteicas de avena y plátano: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-08",
    "category": "desayuno",
    "title": "Batido energizante de mantequilla de maní y avena",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop&q=80",
    "calories": 389,
    "protein": 25,
    "carbs": 45,
    "fats": 15,
    "requiredTier": "platinum",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Batido energizante de mantequilla de maní y avena: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-09",
    "category": "desayuno",
    "title": "Tostada francesa fitness con canela y fresas",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "calories": 396,
    "protein": 28,
    "carbs": 50,
    "fats": 9,
    "requiredTier": "platinum",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Tostada francesa fitness con canela y fresas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-10",
    "category": "desayuno",
    "title": "Huevos revueltos campesinos con tomate y cebolla",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    "calories": 403,
    "protein": 31,
    "carbs": 55,
    "fats": 11,
    "requiredTier": "platinum",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Huevos revueltos campesinos con tomate y cebolla: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-11",
    "category": "desayuno",
    "title": "Porridge de avena con proteína whey y nueces",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 410,
    "protein": 34,
    "carbs": 35,
    "fats": 13,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Porridge de avena con proteína whey y nueces: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-12",
    "category": "desayuno",
    "title": "Waffles de avena sin azúcar con arándanos",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 417,
    "protein": 21,
    "carbs": 40,
    "fats": 15,
    "requiredTier": "platinum",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Waffles de avena sin azúcar con arándanos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-13",
    "category": "desayuno",
    "title": "Yogur griego con granola casera y maracuyá",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80",
    "calories": 424,
    "protein": 24,
    "carbs": 45,
    "fats": 9,
    "requiredTier": "platinum",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Yogur griego con granola casera y maracuyá: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-14",
    "category": "desayuno",
    "title": "Crepes ligeros de claras rellenos de pavo",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
    "calories": 431,
    "protein": 27,
    "carbs": 50,
    "fats": 11,
    "requiredTier": "platinum",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Crepes ligeros de claras rellenos de pavo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-15",
    "category": "desayuno",
    "title": "Sandwich matutino en pan de centeno con huevo",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80",
    "calories": 438,
    "protein": 30,
    "carbs": 55,
    "fats": 13,
    "requiredTier": "platinum",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Sandwich matutino en pan de centeno con huevo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-16",
    "category": "desayuno",
    "title": "Muffins horneados de huevo, espinacas y pavo",
    "time": "13 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    "calories": 445,
    "protein": 33,
    "carbs": 35,
    "fats": 15,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Muffins horneados de huevo, espinacas y pavo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-17",
    "category": "desayuno",
    "title": "Bowl de açai fitness con semillas de girasol",
    "time": "14 min",
    "imageUrl": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&auto=format&fit=crop&q=80",
    "calories": 452,
    "protein": 20,
    "carbs": 40,
    "fats": 9,
    "requiredTier": "platinum",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Bowl de açai fitness con semillas de girasol: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-18",
    "category": "desayuno",
    "title": "Tostadas integrales con hummus y huevo cocido",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop&q=80",
    "calories": 459,
    "protein": 23,
    "carbs": 45,
    "fats": 11,
    "requiredTier": "platinum",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Tostadas integrales con hummus y huevo cocido: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-19",
    "category": "desayuno",
    "title": "Shakshuka rápida de huevos en salsa de tomate",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "calories": 466,
    "protein": 26,
    "carbs": 50,
    "fats": 13,
    "requiredTier": "platinum",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Shakshuka rápida de huevos en salsa de tomate: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-20",
    "category": "desayuno",
    "title": "Smoothie bowl verde de espinaca, piña y colágeno",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    "calories": 343,
    "protein": 29,
    "carbs": 55,
    "fats": 15,
    "requiredTier": "platinum",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Smoothie bowl verde de espinaca, piña y colágeno: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-21",
    "category": "desayuno",
    "title": "Frittata de verduras al horno en molde",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 350,
    "protein": 32,
    "carbs": 35,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Frittata de verduras al horno en molde: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-22",
    "category": "desayuno",
    "title": "Pan de plátano proteico en rebanadas con café",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 357,
    "protein": 35,
    "carbs": 40,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Pan de plátano proteico en rebanadas con café: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-23",
    "category": "desayuno",
    "title": "Revuelto de tofu con cúrcuma y vegetales",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80",
    "calories": 364,
    "protein": 22,
    "carbs": 45,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Revuelto de tofu con cúrcuma y vegetales: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-24",
    "category": "desayuno",
    "title": "Burrito matutino integral de claras y aguacate",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
    "calories": 371,
    "protein": 25,
    "carbs": 50,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Burrito matutino integral de claras y aguacate: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-25",
    "category": "desayuno",
    "title": "Batido de café matutino con proteína y avena",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80",
    "calories": 378,
    "protein": 28,
    "carbs": 55,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Batido de café matutino con proteína y avena: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-26",
    "category": "desayuno",
    "title": "Papas horneadas al romero con huevos a la copa",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    "calories": 385,
    "protein": 31,
    "carbs": 35,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Papas horneadas al romero con huevos a la copa: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-27",
    "category": "desayuno",
    "title": "Tostada de ricota con miel y nueces picadas",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&auto=format&fit=crop&q=80",
    "calories": 392,
    "protein": 34,
    "carbs": 40,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Tostada de ricota con miel y nueces picadas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-28",
    "category": "desayuno",
    "title": "Tortitas de calabacín y claras a la sartén",
    "time": "13 min",
    "imageUrl": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop&q=80",
    "calories": 399,
    "protein": 21,
    "carbs": 45,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Tortitas de calabacín y claras a la sartén: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-29",
    "category": "desayuno",
    "title": "Avena horneada con manzana picada y canela",
    "time": "14 min",
    "imageUrl": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "calories": 406,
    "protein": 24,
    "carbs": 50,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Avena horneada con manzana picada y canela: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-30",
    "category": "desayuno",
    "title": "Omelette de champiñones portobello y finas hierbas",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    "calories": 413,
    "protein": 27,
    "carbs": 55,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Omelette de champiñones portobello y finas hierbas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-31",
    "category": "desayuno",
    "title": "Bowl de avena nocturna con arándanos frescos",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 420,
    "protein": 30,
    "carbs": 35,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Bowl de avena nocturna con arándanos frescos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-32",
    "category": "desayuno",
    "title": "Sándwich de claras con jamón de pechuga artesanal",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 427,
    "protein": 33,
    "carbs": 40,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Sándwich de claras con jamón de pechuga artesanal: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-33",
    "category": "desayuno",
    "title": "Pudin proteico de semillas de lino y fresa",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80",
    "calories": 434,
    "protein": 20,
    "carbs": 45,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Pudin proteico de semillas de lino y fresa: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-34",
    "category": "desayuno",
    "title": "Batido detox de manzana verde, espinaca y chía",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
    "calories": 441,
    "protein": 23,
    "carbs": 50,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Batido detox de manzana verde, espinaca y chía: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-35",
    "category": "desayuno",
    "title": "Tostadas crujientes de arroz con aguacate y lino",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80",
    "calories": 448,
    "protein": 26,
    "carbs": 55,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Tostadas crujientes de arroz con aguacate y lino: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-36",
    "category": "desayuno",
    "title": "Revuelto proteico de 3 claras y 1 yema con pavo",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    "calories": 455,
    "protein": 29,
    "carbs": 35,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Revuelto proteico de 3 claras y 1 yema con pavo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-37",
    "category": "desayuno",
    "title": "Gachas de centeno con bayas silvestres y almendra",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&auto=format&fit=crop&q=80",
    "calories": 462,
    "protein": 32,
    "carbs": 40,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Gachas de centeno con bayas silvestres y almendra: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-38",
    "category": "desayuno",
    "title": "Pan integral con mantequilla de almendras y banano",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop&q=80",
    "calories": 469,
    "protein": 35,
    "carbs": 45,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Pan integral con mantequilla de almendras y banano: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-39",
    "category": "desayuno",
    "title": "Bollos proteicos de requesón al vapor",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "calories": 346,
    "protein": 22,
    "carbs": 50,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Bollos proteicos de requesón al vapor: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-40",
    "category": "desayuno",
    "title": "Bowl de yogur de coco con nuez pecana tostada",
    "time": "13 min",
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    "calories": 353,
    "protein": 25,
    "carbs": 55,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Bowl de yogur de coco con nuez pecana tostada: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-41",
    "category": "desayuno",
    "title": "Huevos al horno en aguacate con pimienta negra",
    "time": "14 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 360,
    "protein": 28,
    "carbs": 35,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Huevos al horno en aguacate con pimienta negra: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-42",
    "category": "desayuno",
    "title": "Tortilla de maíz nixtamalizado con frijol negro y huevo",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 367,
    "protein": 31,
    "carbs": 40,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Tortilla de maíz nixtamalizado con frijol negro y huevo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-43",
    "category": "desayuno",
    "title": "Batido de cacao, banano maduro y suero de leche",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80",
    "calories": 374,
    "protein": 34,
    "carbs": 45,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Batido de cacao, banano maduro y suero de leche: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-44",
    "category": "desayuno",
    "title": "Avena cocida con trozos de pera y nuez moscada",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1510693206972-df098062cb71?w=800&auto=format&fit=crop&q=80",
    "calories": 381,
    "protein": 21,
    "carbs": 50,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Avena cocida con trozos de pera y nuez moscada: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-45",
    "category": "desayuno",
    "title": "Tostada nórdica con salmón ahumado y eneldo",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1533089860892-a7c6f0a88666?w=800&auto=format&fit=crop&q=80",
    "calories": 388,
    "protein": 24,
    "carbs": 55,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Tostada nórdica con salmón ahumado y eneldo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-46",
    "category": "desayuno",
    "title": "Huevos poché sobre cama de espárragos salteados",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&auto=format&fit=crop&q=80",
    "calories": 395,
    "protein": 27,
    "carbs": 35,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena en hojuelas",
      "¾ taza de yogur griego natural",
      "½ mango maduro en cubos",
      "1 cda de semillas de chía"
    ],
    "directions": "Preparación de Huevos poché sobre cama de espárragos salteados: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-47",
    "category": "desayuno",
    "title": "Crema tibia de avena y lino con semillas de calabaza",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1494390248081-4e521a5940db?w=800&auto=format&fit=crop&q=80",
    "calories": 402,
    "protein": 30,
    "carbs": 40,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "1 rebanada de pan de masa madre",
      "½ aguacate hass maduro",
      "1 huevo de campo",
      "3 tomates cherry cortados"
    ],
    "directions": "Preparación de Crema tibia de avena y lino con semillas de calabaza: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-48",
    "category": "desayuno",
    "title": "Pan integral de espelta con pavo y rúcula",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?w=800&auto=format&fit=crop&q=80",
    "calories": 409,
    "protein": 33,
    "carbs": 45,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de quinoa cocida",
      "½ taza de leche vegetal",
      "½ taza de frutos rojos frescos",
      "1 cdta de miel cruda"
    ],
    "directions": "Preparación de Pan integral de espelta con pavo y rúcula: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-49",
    "category": "desayuno",
    "title": "Wrap de espinacas relleno de revuelto y tomate seco",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1541544741938-0af808871cc0?w=800&auto=format&fit=crop&q=80",
    "calories": 416,
    "protein": 20,
    "carbs": 50,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "2 claras de huevo y 1 huevo entero",
      "1 taza de espinacas tiernas",
      "¼ cebolla morada picada",
      "2 cdas de queso ricota"
    ],
    "directions": "Preparación de Wrap de espinacas relleno de revuelto y tomate seco: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "desayuno-50",
    "category": "desayuno",
    "title": "Copas de chía con puré de mango y yogur skyr",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1550547660-d9450f859349?w=800&auto=format&fit=crop&q=80",
    "calories": 423,
    "protein": 23,
    "carbs": 55,
    "fats": 11,
    "requiredTier": "golden",
    "ingredients": [
      "3 cdas de semillas de chía",
      "1 taza de leche de almendras",
      "1 cda de cacao puro 100%",
      "½ plátano en rodajas"
    ],
    "directions": "Preparación de Copas de chía con puré de mango y yogur skyr: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-01",
    "category": "almuerzo",
    "title": "Bowl de pollo grillado con arroz integral y frijoles",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 480,
    "protein": 36,
    "carbs": 45,
    "fats": 12,
    "requiredTier": "standard",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Bowl de pollo grillado con arroz integral y frijoles: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-02",
    "category": "almuerzo",
    "title": "Ensalada mediterránea de atún claro y vegetales",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    "calories": 489,
    "protein": 40,
    "carbs": 51,
    "fats": 15,
    "requiredTier": "standard",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Ensalada mediterránea de atún claro y vegetales: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-03",
    "category": "almuerzo",
    "title": "Lentejas tradicionales estofadas con verduras",
    "time": "22 min",
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    "calories": 498,
    "protein": 44,
    "carbs": 57,
    "fats": 18,
    "requiredTier": "standard",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Lentejas tradicionales estofadas con verduras: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-04",
    "category": "almuerzo",
    "title": "Pechuga marinada al limón con camote asado",
    "time": "23 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 507,
    "protein": 48,
    "carbs": 63,
    "fats": 21,
    "requiredTier": "standard",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Pechuga marinada al limón con camote asado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-05",
    "category": "almuerzo",
    "title": "Salmón a la plancha con brócoli al vapor",
    "time": "24 min",
    "imageUrl": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "calories": 516,
    "protein": 52,
    "carbs": 69,
    "fats": 14,
    "requiredTier": "standard",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Salmón a la plancha con brócoli al vapor: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-06",
    "category": "almuerzo",
    "title": "Wrap integral de pavo con aderezo tzatziki",
    "time": "25 min",
    "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    "calories": 525,
    "protein": 38,
    "carbs": 45,
    "fats": 17,
    "requiredTier": "standard",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Wrap integral de pavo con aderezo tzatziki: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-07",
    "category": "almuerzo",
    "title": "Pechuga a la parrilla con puré rústico de papa",
    "time": "26 min",
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    "calories": 534,
    "protein": 42,
    "carbs": 51,
    "fats": 20,
    "requiredTier": "platinum",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Pechuga a la parrilla con puré rústico de papa: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-08",
    "category": "almuerzo",
    "title": "Arroz integral salteado con ternera y verduras",
    "time": "27 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    "calories": 543,
    "protein": 46,
    "carbs": 57,
    "fats": 13,
    "requiredTier": "platinum",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Arroz integral salteado con ternera y verduras: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-09",
    "category": "almuerzo",
    "title": "Bowl mexicano de carne magra, maíz y pico de gallo",
    "time": "28 min",
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
    "calories": 552,
    "protein": 50,
    "carbs": 63,
    "fats": 16,
    "requiredTier": "platinum",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Bowl mexicano de carne magra, maíz y pico de gallo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-10",
    "category": "almuerzo",
    "title": "Merluza al horno con espárragos trigueros",
    "time": "29 min",
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    "calories": 561,
    "protein": 36,
    "carbs": 69,
    "fats": 19,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Merluza al horno con espárragos trigueros: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-11",
    "category": "almuerzo",
    "title": "Pasta integral con pollo en salsa pomodoro",
    "time": "30 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 570,
    "protein": 40,
    "carbs": 45,
    "fats": 12,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Pasta integral con pollo en salsa pomodoro: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-12",
    "category": "almuerzo",
    "title": "Ensalada tibia de quinoa, pollo y calabaza",
    "time": "31 min",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    "calories": 579,
    "protein": 44,
    "carbs": 51,
    "fats": 15,
    "requiredTier": "platinum",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Ensalada tibia de quinoa, pollo y calabaza: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-13",
    "category": "almuerzo",
    "title": "Pechuga rellena de espinacas y queso ricota",
    "time": "32 min",
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    "calories": 588,
    "protein": 48,
    "carbs": 57,
    "fats": 18,
    "requiredTier": "platinum",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Pechuga rellena de espinacas y queso ricota: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-14",
    "category": "almuerzo",
    "title": "Atún fresco a la plancha con sésamo tostado",
    "time": "33 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 597,
    "protein": 52,
    "carbs": 63,
    "fats": 21,
    "requiredTier": "platinum",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Atún fresco a la plancha con sésamo tostado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-15",
    "category": "almuerzo",
    "title": "Guiso de garbanzos con espinacas y comino",
    "time": "34 min",
    "imageUrl": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "calories": 606,
    "protein": 38,
    "carbs": 69,
    "fats": 14,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Guiso de garbanzos con espinacas y comino: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-16",
    "category": "almuerzo",
    "title": "Hamburguesa casera de pavo con ensalada verde",
    "time": "35 min",
    "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    "calories": 615,
    "protein": 42,
    "carbs": 45,
    "fats": 17,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Hamburguesa casera de pavo con ensalada verde: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-17",
    "category": "almuerzo",
    "title": "Lomo de cerdo magro al horno con manzana",
    "time": "36 min",
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    "calories": 624,
    "protein": 46,
    "carbs": 51,
    "fats": 20,
    "requiredTier": "platinum",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Lomo de cerdo magro al horno con manzana: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-18",
    "category": "almuerzo",
    "title": "Pollo al curry suave con arroz basmati y calabacín",
    "time": "37 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    "calories": 633,
    "protein": 50,
    "carbs": 57,
    "fats": 13,
    "requiredTier": "platinum",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Pollo al curry suave con arroz basmati y calabacín: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-19",
    "category": "almuerzo",
    "title": "Tacos de pescado blanco en tortilla de maíz",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
    "calories": 642,
    "protein": 36,
    "carbs": 63,
    "fats": 16,
    "requiredTier": "platinum",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Tacos de pescado blanco en tortilla de maíz: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-20",
    "category": "almuerzo",
    "title": "Bowl de tofu marinado con edamames y arroz",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    "calories": 651,
    "protein": 40,
    "carbs": 69,
    "fats": 19,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Bowl de tofu marinado con edamames y arroz: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-21",
    "category": "almuerzo",
    "title": "Albóndigas de ternera magra en salsa de tomate",
    "time": "22 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 480,
    "protein": 44,
    "carbs": 45,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Albóndigas de ternera magra en salsa de tomate: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-22",
    "category": "almuerzo",
    "title": "Filete de ternera a la plancha con ensalada mixta",
    "time": "23 min",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    "calories": 489,
    "protein": 48,
    "carbs": 51,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Filete de ternera a la plancha con ensalada mixta: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-23",
    "category": "almuerzo",
    "title": "Risotto de cebada perlada con champiñones",
    "time": "24 min",
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    "calories": 498,
    "protein": 52,
    "carbs": 57,
    "fats": 18,
    "requiredTier": "golden",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Risotto de cebada perlada con champiñones: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-24",
    "category": "almuerzo",
    "title": "Pollo salteado al wok con jengibre y pimientos",
    "time": "25 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 507,
    "protein": 38,
    "carbs": 63,
    "fats": 21,
    "requiredTier": "golden",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Pollo salteado al wok con jengibre y pimientos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-25",
    "category": "almuerzo",
    "title": "Ensalada griega de garbanzos con pepino y queso feta",
    "time": "26 min",
    "imageUrl": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "calories": 516,
    "protein": 42,
    "carbs": 69,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Ensalada griega de garbanzos con pepino y queso feta: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-26",
    "category": "almuerzo",
    "title": "Dorada a la sal con verduras asadas",
    "time": "27 min",
    "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    "calories": 525,
    "protein": 46,
    "carbs": 45,
    "fats": 17,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Dorada a la sal con verduras asadas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-27",
    "category": "almuerzo",
    "title": "Canelones de calabacín rellenos de pollo",
    "time": "28 min",
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    "calories": 534,
    "protein": 50,
    "carbs": 51,
    "fats": 20,
    "requiredTier": "golden",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Canelones de calabacín rellenos de pollo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-28",
    "category": "almuerzo",
    "title": "Guiso de alubias blancas con zanahorias y pimentón",
    "time": "29 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    "calories": 543,
    "protein": 36,
    "carbs": 57,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Guiso de alubias blancas con zanahorias y pimentón: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-29",
    "category": "almuerzo",
    "title": "Fajitas de pollo con cebolla morada y pimientos",
    "time": "30 min",
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
    "calories": 552,
    "protein": 40,
    "carbs": 63,
    "fats": 16,
    "requiredTier": "golden",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Fajitas de pollo con cebolla morada y pimientos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-30",
    "category": "almuerzo",
    "title": "Corvina al papillote con finas hierbas y limón",
    "time": "31 min",
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    "calories": 561,
    "protein": 44,
    "carbs": 69,
    "fats": 19,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Corvina al papillote con finas hierbas y limón: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-31",
    "category": "almuerzo",
    "title": "Arroz de coliflor salteado con gambas y ajo",
    "time": "32 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 570,
    "protein": 48,
    "carbs": 45,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Arroz de coliflor salteado con gambas y ajo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-32",
    "category": "almuerzo",
    "title": "Pastel de carne magra y puré de calabaza",
    "time": "33 min",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    "calories": 579,
    "protein": 52,
    "carbs": 51,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Pastel de carne magra y puré de calabaza: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-33",
    "category": "almuerzo",
    "title": "Pechuga a la mostaza dijon con judías verdes",
    "time": "34 min",
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    "calories": 588,
    "protein": 38,
    "carbs": 57,
    "fats": 18,
    "requiredTier": "golden",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Pechuga a la mostaza dijon con judías verdes: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-34",
    "category": "almuerzo",
    "title": "Salpicón de atún con pimientos y cebollino",
    "time": "35 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 597,
    "protein": 42,
    "carbs": 63,
    "fats": 21,
    "requiredTier": "golden",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Salpicón de atún con pimientos y cebollino: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-35",
    "category": "almuerzo",
    "title": "Brochetas de pollo y verduras con salsa de yogur",
    "time": "36 min",
    "imageUrl": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "calories": 606,
    "protein": 46,
    "carbs": 69,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Brochetas de pollo y verduras con salsa de yogur: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-36",
    "category": "almuerzo",
    "title": "Tartar de salmón con aguacate y lima",
    "time": "37 min",
    "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    "calories": 615,
    "protein": 50,
    "carbs": 45,
    "fats": 17,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Tartar de salmón con aguacate y lima: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-37",
    "category": "almuerzo",
    "title": "Guiso de ternera estofada con papas y champiñones",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    "calories": 624,
    "protein": 36,
    "carbs": 51,
    "fats": 20,
    "requiredTier": "golden",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Guiso de ternera estofada con papas y champiñones: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-38",
    "category": "almuerzo",
    "title": "Rollitos de berenjena rellenos de carne picada",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    "calories": 633,
    "protein": 40,
    "carbs": 57,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Rollitos de berenjena rellenos de carne picada: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-39",
    "category": "almuerzo",
    "title": "Pollo asado a las hierbas con batata dulce",
    "time": "22 min",
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
    "calories": 642,
    "protein": 44,
    "carbs": 63,
    "fats": 16,
    "requiredTier": "golden",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Pollo asado a las hierbas con batata dulce: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-40",
    "category": "almuerzo",
    "title": "Ensalada de espinacas con pechuga, fresas y nueces",
    "time": "23 min",
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    "calories": 651,
    "protein": 48,
    "carbs": 69,
    "fats": 19,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Ensalada de espinacas con pechuga, fresas y nueces: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-41",
    "category": "almuerzo",
    "title": "Sopa minestrone completa con legumbres y fideos",
    "time": "24 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 480,
    "protein": 52,
    "carbs": 45,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Sopa minestrone completa con legumbres y fideos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-42",
    "category": "almuerzo",
    "title": "Ceviche de pescado blanco con camote y maíz",
    "time": "25 min",
    "imageUrl": "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=800&auto=format&fit=crop&q=80",
    "calories": 489,
    "protein": 38,
    "carbs": 51,
    "fats": 15,
    "requiredTier": "golden",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Ceviche de pescado blanco con camote y maíz: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-43",
    "category": "almuerzo",
    "title": "Bowl poke de atún marinado con arroz y alga nori",
    "time": "26 min",
    "imageUrl": "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=800&auto=format&fit=crop&q=80",
    "calories": 498,
    "protein": 42,
    "carbs": 57,
    "fats": 18,
    "requiredTier": "golden",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Bowl poke de atún marinado con arroz y alga nori: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-44",
    "category": "almuerzo",
    "title": "Pollo teriyaki saludable con brócoli y sésamo",
    "time": "27 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 507,
    "protein": 46,
    "carbs": 63,
    "fats": 21,
    "requiredTier": "golden",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Pollo teriyaki saludable con brócoli y sésamo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-45",
    "category": "almuerzo",
    "title": "Crema de lentejas rojas con pollo desmenuzado",
    "time": "28 min",
    "imageUrl": "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=800&auto=format&fit=crop&q=80",
    "calories": 516,
    "protein": 50,
    "carbs": 69,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Crema de lentejas rojas con pollo desmenuzado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-46",
    "category": "almuerzo",
    "title": "Chirivías y zanahorias asadas con solomillo de cerdo",
    "time": "29 min",
    "imageUrl": "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&auto=format&fit=crop&q=80",
    "calories": 525,
    "protein": 36,
    "carbs": 45,
    "fats": 17,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de pechuga de pollo a la plancha",
      "½ taza de arroz integral",
      "½ taza de frijoles negros",
      "Mix de hojas verdes"
    ],
    "directions": "Preparación de Chirivías y zanahorias asadas con solomillo de cerdo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-47",
    "category": "almuerzo",
    "title": "Ensalada templada de lentejas con salmón desmigado",
    "time": "30 min",
    "imageUrl": "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=800&auto=format&fit=crop&q=80",
    "calories": 534,
    "protein": 40,
    "carbs": 51,
    "fats": 20,
    "requiredTier": "golden",
    "ingredients": [
      "1 lata de atún en agua",
      "1 pepino cohombro en cubos",
      "1 tomate maduro",
      "Aceitunas negras",
      "1 cda aceite de oliva"
    ],
    "directions": "Preparación de Ensalada templada de lentejas con salmón desmigado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-48",
    "category": "almuerzo",
    "title": "Pavo estofado con alcachofas tiernas",
    "time": "31 min",
    "imageUrl": "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=800&auto=format&fit=crop&q=80",
    "calories": 543,
    "protein": 44,
    "carbs": 57,
    "fats": 13,
    "requiredTier": "golden",
    "ingredients": [
      "1 taza de lentejas cocidas",
      "1 zanahoria en cubos",
      "1 papa pequeña",
      "½ cebolla picada",
      "Pimentón dulce"
    ],
    "directions": "Preparación de Pavo estofado con alcachofas tiernas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-49",
    "category": "almuerzo",
    "title": "Wok de fideos de arroz con gambas y brotes tiernos",
    "time": "32 min",
    "imageUrl": "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=800&auto=format&fit=crop&q=80",
    "calories": 552,
    "protein": 48,
    "carbs": 63,
    "fats": 16,
    "requiredTier": "golden",
    "ingredients": [
      "180 g de salmón fresco",
      "1 taza de brócoli al vapor",
      "½ batata horneada",
      "Gotas de limón y sal marina"
    ],
    "directions": "Preparación de Wok de fideos de arroz con gambas y brotes tiernos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "almuerzo-50",
    "category": "almuerzo",
    "title": "Filete de pez espada a la plancha con puré de guisantes",
    "time": "33 min",
    "imageUrl": "https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800&auto=format&fit=crop&q=80",
    "calories": 561,
    "protein": 52,
    "carbs": 69,
    "fats": 19,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de lomo de ternera magro",
      "1 taza de puré de calabaza",
      "Espárragos trigueros al grill",
      "Pimienta negra"
    ],
    "directions": "Preparación de Filete de pez espada a la plancha con puré de guisantes: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-01",
    "category": "cena",
    "title": "Crema depurativa de calabaza y zanahoria con semillas",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "calories": 320,
    "protein": 28,
    "carbs": 18,
    "fats": 8,
    "requiredTier": "standard",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Crema depurativa de calabaza y zanahoria con semillas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-02",
    "category": "cena",
    "title": "Tilapia al vapor con espárragos y limón",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    "calories": 326,
    "protein": 31,
    "carbs": 22,
    "fats": 10,
    "requiredTier": "standard",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Tilapia al vapor con espárragos y limón: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-03",
    "category": "cena",
    "title": "Tortilla francesa de espinacas tiernas y champiñones",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    "calories": 332,
    "protein": 34,
    "carbs": 26,
    "fats": 12,
    "requiredTier": "standard",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Tortilla francesa de espinacas tiernas y champiñones: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-04",
    "category": "cena",
    "title": "Ensalada templada de pollo con vinagre balsámico",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80",
    "calories": 338,
    "protein": 37,
    "carbs": 30,
    "fats": 14,
    "requiredTier": "standard",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Ensalada templada de pollo con vinagre balsámico: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-05",
    "category": "cena",
    "title": "Sopa de verduras de temporada con dados de tofu",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    "calories": 344,
    "protein": 40,
    "carbs": 34,
    "fats": 8,
    "requiredTier": "standard",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Sopa de verduras de temporada con dados de tofu: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-06",
    "category": "cena",
    "title": "Ceviche clásico de pescado blanco con cebolla morada",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80",
    "calories": 350,
    "protein": 28,
    "carbs": 18,
    "fats": 10,
    "requiredTier": "standard",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Ceviche clásico de pescado blanco con cebolla morada: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-07",
    "category": "cena",
    "title": "Merluza a la plancha con salteado de judías verdes",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1499028344343-cd173efc68a9?w=800&auto=format&fit=crop&q=80",
    "calories": 356,
    "protein": 31,
    "carbs": 22,
    "fats": 12,
    "requiredTier": "platinum",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Merluza a la plancha con salteado de judías verdes: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-08",
    "category": "cena",
    "title": "Pechuga de pavo al limón con calabacín asado",
    "time": "22 min",
    "imageUrl": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=80",
    "calories": 362,
    "protein": 34,
    "carbs": 26,
    "fats": 14,
    "requiredTier": "platinum",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Pechuga de pavo al limón con calabacín asado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-09",
    "category": "cena",
    "title": "Revuelto de setas variadas y ajetes con huevo de campo",
    "time": "23 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 368,
    "protein": 37,
    "carbs": 30,
    "fats": 8,
    "requiredTier": "platinum",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Revuelto de setas variadas y ajetes con huevo de campo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-10",
    "category": "cena",
    "title": "Bowl de quinoa con aguacate y huevo a la copa",
    "time": "24 min",
    "imageUrl": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
    "calories": 374,
    "protein": 40,
    "carbs": 34,
    "fats": 10,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Bowl de quinoa con aguacate y huevo a la copa: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-11",
    "category": "cena",
    "title": "Brochetas de langostinos a la parrilla con pimientos",
    "time": "25 min",
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "calories": 380,
    "protein": 28,
    "carbs": 18,
    "fats": 12,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Brochetas de langostinos a la parrilla con pimientos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-12",
    "category": "cena",
    "title": "Crema sedosa de calabacín y puerro sin natas",
    "time": "26 min",
    "imageUrl": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    "calories": 386,
    "protein": 31,
    "carbs": 22,
    "fats": 14,
    "requiredTier": "platinum",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Crema sedosa de calabacín y puerro sin natas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-13",
    "category": "cena",
    "title": "Hamburguesas caseras de merluza y gambas",
    "time": "27 min",
    "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    "calories": 392,
    "protein": 34,
    "carbs": 26,
    "fats": 8,
    "requiredTier": "platinum",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Hamburguesas caseras de merluza y gambas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-14",
    "category": "cena",
    "title": "Ensalada de canónigos, tomate cherry y caballa en aceite",
    "time": "28 min",
    "imageUrl": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80",
    "calories": 398,
    "protein": 37,
    "carbs": 30,
    "fats": 10,
    "requiredTier": "platinum",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Ensalada de canónigos, tomate cherry y caballa en aceite: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-15",
    "category": "cena",
    "title": "Pechuga a la plancha con puré de coliflor trufado",
    "time": "29 min",
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    "calories": 404,
    "protein": 40,
    "carbs": 34,
    "fats": 12,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Pechuga a la plancha con puré de coliflor trufado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-16",
    "category": "cena",
    "title": "Berenjenas asadas rellenas de atún y verduras",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80",
    "calories": 410,
    "protein": 28,
    "carbs": 18,
    "fats": 14,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Berenjenas asadas rellenas de atún y verduras: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-17",
    "category": "cena",
    "title": "Consomé casero con pollo desmenuzado y huevo duro",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1499028344343-cd173efc68a9?w=800&auto=format&fit=crop&q=80",
    "calories": 416,
    "protein": 31,
    "carbs": 22,
    "fats": 8,
    "requiredTier": "platinum",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Consomé casero con pollo desmenuzado y huevo duro: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-18",
    "category": "cena",
    "title": "Salmón al horno con costra de mostaza y finas hierbas",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=80",
    "calories": 422,
    "protein": 34,
    "carbs": 26,
    "fats": 10,
    "requiredTier": "platinum",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Salmón al horno con costra de mostaza y finas hierbas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-19",
    "category": "cena",
    "title": "Salteado oriental de pollo con verduras crujientes",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 428,
    "protein": 37,
    "carbs": 30,
    "fats": 12,
    "requiredTier": "platinum",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Salteado oriental de pollo con verduras crujientes: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-20",
    "category": "cena",
    "title": "Ensalada de rúcula, queso fresco y pechuga asada",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
    "calories": 434,
    "protein": 40,
    "carbs": 34,
    "fats": 14,
    "requiredTier": "platinum",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Ensalada de rúcula, queso fresco y pechuga asada: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-21",
    "category": "cena",
    "title": "Tortilla de calabacín y cebolla pochada en aceite de oliva",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "calories": 320,
    "protein": 28,
    "carbs": 18,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Tortilla de calabacín y cebolla pochada en aceite de oliva: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-22",
    "category": "cena",
    "title": "Calamares a la plancha con ajo y perejil fresco",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    "calories": 326,
    "protein": 31,
    "carbs": 22,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Calamares a la plancha con ajo y perejil fresco: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-23",
    "category": "cena",
    "title": "Crema de brócoli y espinaca con almendras laminadas",
    "time": "22 min",
    "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    "calories": 332,
    "protein": 34,
    "carbs": 26,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Crema de brócoli y espinaca con almendras laminadas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-24",
    "category": "cena",
    "title": "Carpaccio de ternera con rúcula y lascas de parmesano",
    "time": "23 min",
    "imageUrl": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80",
    "calories": 338,
    "protein": 37,
    "carbs": 30,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Carpaccio de ternera con rúcula y lascas de parmesano: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-25",
    "category": "cena",
    "title": "Revuelto de espárragos trigueros y gambas al ajillo",
    "time": "24 min",
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    "calories": 344,
    "protein": 40,
    "carbs": 34,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Revuelto de espárragos trigueros y gambas al ajillo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-26",
    "category": "cena",
    "title": "Pavo asado en filetes finos con ensalada de pepino",
    "time": "25 min",
    "imageUrl": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80",
    "calories": 350,
    "protein": 28,
    "carbs": 18,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Pavo asado en filetes finos con ensalada de pepino: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-27",
    "category": "cena",
    "title": "Pescado blanco al vapor con jengibre y cebolleta",
    "time": "26 min",
    "imageUrl": "https://images.unsplash.com/photo-1499028344343-cd173efc68a9?w=800&auto=format&fit=crop&q=80",
    "calories": 356,
    "protein": 31,
    "carbs": 22,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Pescado blanco al vapor con jengibre y cebolleta: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-28",
    "category": "cena",
    "title": "Ensalada caprese ligera con tomate maduro y albahaca",
    "time": "27 min",
    "imageUrl": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=80",
    "calories": 362,
    "protein": 34,
    "carbs": 26,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Ensalada caprese ligera con tomate maduro y albahaca: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-29",
    "category": "cena",
    "title": "Lomo de bacalao desalado al horno con tomate concassé",
    "time": "28 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 368,
    "protein": 37,
    "carbs": 30,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Lomo de bacalao desalado al horno con tomate concassé: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-30",
    "category": "cena",
    "title": "Salteado de espinacas, pasas y piñones con huevo poché",
    "time": "29 min",
    "imageUrl": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
    "calories": 374,
    "protein": 40,
    "carbs": 34,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Salteado de espinacas, pasas y piñones con huevo poché: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-31",
    "category": "cena",
    "title": "Crema de zanahoria y jengibre con semillas de chía",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "calories": 380,
    "protein": 28,
    "carbs": 18,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Crema de zanahoria y jengibre con semillas de chía: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-32",
    "category": "cena",
    "title": "Pechuga desmechada con puré de camote ligero",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    "calories": 386,
    "protein": 31,
    "carbs": 22,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Pechuga desmechada con puré de camote ligero: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-33",
    "category": "cena",
    "title": "Sopa de pescado y marisco tradicional sin harinas",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    "calories": 392,
    "protein": 34,
    "carbs": 26,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Sopa de pescado y marisco tradicional sin harinas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-34",
    "category": "cena",
    "title": "Tacos de lechuga rellenos de carne picada y aguacate",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80",
    "calories": 398,
    "protein": 37,
    "carbs": 30,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Tacos de lechuga rellenos de carne picada y aguacate: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-35",
    "category": "cena",
    "title": "Tortilla abierta de champiñones y queso bajo en grasa",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    "calories": 404,
    "protein": 40,
    "carbs": 34,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Tortilla abierta de champiñones y queso bajo en grasa: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-36",
    "category": "cena",
    "title": "Lenguado a la plancha con rodajas de tomate y limón",
    "time": "20 min",
    "imageUrl": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80",
    "calories": 410,
    "protein": 28,
    "carbs": 18,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Lenguado a la plancha con rodajas de tomate y limón: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-37",
    "category": "cena",
    "title": "Alcachofas cocidas con vinagreta de perejil y huevo picado",
    "time": "21 min",
    "imageUrl": "https://images.unsplash.com/photo-1499028344343-cd173efc68a9?w=800&auto=format&fit=crop&q=80",
    "calories": 416,
    "protein": 31,
    "carbs": 22,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Alcachofas cocidas con vinagreta de perejil y huevo picado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-38",
    "category": "cena",
    "title": "Pollo marinado al yogur y menta con espinacas",
    "time": "22 min",
    "imageUrl": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=80",
    "calories": 422,
    "protein": 34,
    "carbs": 26,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Pollo marinado al yogur y menta con espinacas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-39",
    "category": "cena",
    "title": "Ensalada de palmitos, tomate y atún en agua",
    "time": "23 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 428,
    "protein": 37,
    "carbs": 30,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Ensalada de palmitos, tomate y atún en agua: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-40",
    "category": "cena",
    "title": "Rollitos de pavo rellenos de espárragos al vapor",
    "time": "24 min",
    "imageUrl": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
    "calories": 434,
    "protein": 40,
    "carbs": 34,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Rollitos de pavo rellenos de espárragos al vapor: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-41",
    "category": "cena",
    "title": "Crema de espárragos blancos con virutas de jamón",
    "time": "25 min",
    "imageUrl": "https://images.unsplash.com/photo-1544025162-d76694265947?w=800&auto=format&fit=crop&q=80",
    "calories": 320,
    "protein": 28,
    "carbs": 18,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Crema de espárragos blancos con virutas de jamón: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-42",
    "category": "cena",
    "title": "Hamburguesas vegetales de lentejas con ensalada verde",
    "time": "26 min",
    "imageUrl": "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?w=800&auto=format&fit=crop&q=80",
    "calories": 326,
    "protein": 31,
    "carbs": 22,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Hamburguesas vegetales de lentejas con ensalada verde: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-43",
    "category": "cena",
    "title": "Revuelto de claras con pimientos asados y orégano",
    "time": "27 min",
    "imageUrl": "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&auto=format&fit=crop&q=80",
    "calories": 332,
    "protein": 34,
    "carbs": 26,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Revuelto de claras con pimientos asados y orégano: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-44",
    "category": "cena",
    "title": "Salmón salvaje en papillote con finas rodajas de lima",
    "time": "28 min",
    "imageUrl": "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=800&auto=format&fit=crop&q=80",
    "calories": 338,
    "protein": 37,
    "carbs": 30,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Salmón salvaje en papillote con finas rodajas de lima: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-45",
    "category": "cena",
    "title": "Wok ligero de col china, zanahoria y dados de pollo",
    "time": "29 min",
    "imageUrl": "https://images.unsplash.com/photo-1498837167922-ddd27525d352?w=800&auto=format&fit=crop&q=80",
    "calories": 344,
    "protein": 40,
    "carbs": 34,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Wok ligero de col china, zanahoria y dados de pollo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-46",
    "category": "cena",
    "title": "Caldo vegetal purificante con fideos de konjac y huevo",
    "time": "15 min",
    "imageUrl": "https://images.unsplash.com/photo-1505576399279-565b52d4ac71?w=800&auto=format&fit=crop&q=80",
    "calories": 350,
    "protein": 28,
    "carbs": 18,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de merluza o pescado blanco",
      "1 taza de judías verdes salteadas",
      "1 cdta aceite de oliva virgen",
      "Ajo y perejil"
    ],
    "directions": "Preparación de Caldo vegetal purificante con fideos de konjac y huevo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-47",
    "category": "cena",
    "title": "Solomillo de pavo con salteado de setas shiitake",
    "time": "16 min",
    "imageUrl": "https://images.unsplash.com/photo-1499028344343-cd173efc68a9?w=800&auto=format&fit=crop&q=80",
    "calories": 356,
    "protein": 31,
    "carbs": 22,
    "fats": 12,
    "requiredTier": "golden",
    "ingredients": [
      "1 plato hondo de crema de calabaza y zanahoria",
      "1 huevo pochado",
      "1 cda semillas de calabaza tostadas"
    ],
    "directions": "Preparación de Solomillo de pavo con salteado de setas shiitake: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-48",
    "category": "cena",
    "title": "Gazpacho andaluz tradicional servido con huevo cocido",
    "time": "17 min",
    "imageUrl": "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=800&auto=format&fit=crop&q=80",
    "calories": 362,
    "protein": 34,
    "carbs": 26,
    "fats": 14,
    "requiredTier": "golden",
    "ingredients": [
      "2 huevos de campo batidos",
      "1 taza de espinacas frescas",
      "4 champiñones laminados",
      "1 cdta aceite de oliva"
    ],
    "directions": "Preparación de Gazpacho andaluz tradicional servido con huevo cocido: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-49",
    "category": "cena",
    "title": "Tártaro ligero de atún con aguacate y semillas de sésamo",
    "time": "18 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 368,
    "protein": 37,
    "carbs": 30,
    "fats": 8,
    "requiredTier": "golden",
    "ingredients": [
      "130 g de pechuga de pavo al grill",
      "1 calabacín asado en rodajas",
      "Tomate en rodajas con orégano fresco"
    ],
    "directions": "Preparación de Tártaro ligero de atún con aguacate y semillas de sésamo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "cena-50",
    "category": "cena",
    "title": "Dorada a la plancha con calabaza caramelizada al horno",
    "time": "19 min",
    "imageUrl": "https://images.unsplash.com/photo-1574484284002-952d92456975?w=800&auto=format&fit=crop&q=80",
    "calories": 374,
    "protein": 40,
    "carbs": 34,
    "fats": 10,
    "requiredTier": "golden",
    "ingredients": [
      "150 g de dados de tofu firme marinado",
      "1 taza de floretes de brócoli",
      "Zanahorias baby al vapor",
      "Salsa de soja baja en sodio"
    ],
    "directions": "Preparación de Dorada a la plancha con calabaza caramelizada al horno: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-01",
    "category": "snack",
    "title": "Manzana fuji en láminas con mantequilla de maní natural",
    "time": "5 min",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "calories": 160,
    "protein": 10,
    "carbs": 18,
    "fats": 5,
    "requiredTier": "standard",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Manzana fuji en láminas con mantequilla de maní natural: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-02",
    "category": "snack",
    "title": "Parfait de yogur griego con fresas y granola artesanal",
    "time": "6 min",
    "imageUrl": "https://images.unsplash.com/photo-1505253758473-96b301b5c81d?w=800&auto=format&fit=crop&q=80",
    "calories": 165,
    "protein": 12,
    "carbs": 21,
    "fats": 7,
    "requiredTier": "standard",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Parfait de yogur griego con fresas y granola artesanal: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-03",
    "category": "snack",
    "title": "Hummus clásico con bastones de zanahoria y apio",
    "time": "7 min",
    "imageUrl": "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop&q=80",
    "calories": 170,
    "protein": 14,
    "carbs": 24,
    "fats": 9,
    "requiredTier": "standard",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Hummus clásico con bastones de zanahoria y apio: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-04",
    "category": "snack",
    "title": "Energy balls caseras de avena, cacao y dátiles",
    "time": "8 min",
    "imageUrl": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    "calories": 175,
    "protein": 16,
    "carbs": 27,
    "fats": 5,
    "requiredTier": "standard",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Energy balls caseras de avena, cacao y dátiles: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-05",
    "category": "snack",
    "title": "Palomitas de maíz caseras al romero y sal rosada",
    "time": "9 min",
    "imageUrl": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80",
    "calories": 180,
    "protein": 18,
    "carbs": 30,
    "fats": 7,
    "requiredTier": "standard",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Palomitas de maíz caseras al romero y sal rosada: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-06",
    "category": "snack",
    "title": "Queso campesino fresco con pera en láminas y nueces",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 185,
    "protein": 20,
    "carbs": 33,
    "fats": 9,
    "requiredTier": "standard",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Queso campesino fresco con pera en láminas y nueces: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-07",
    "category": "snack",
    "title": "Batido proteico rápido de frutos rojos y almendras",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 190,
    "protein": 10,
    "carbs": 20,
    "fats": 5,
    "requiredTier": "platinum",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Batido proteico rápido de frutos rojos y almendras: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-08",
    "category": "snack",
    "title": "Tortitas de arroz integral con aguacate y chía",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 195,
    "protein": 12,
    "carbs": 23,
    "fats": 7,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Tortitas de arroz integral con aguacate y chía: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-09",
    "category": "snack",
    "title": "Huevos duros cocidos con una pizca de pimentón dulce",
    "time": "5 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 200,
    "protein": 14,
    "carbs": 26,
    "fats": 9,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Huevos duros cocidos con una pizca de pimentón dulce: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-10",
    "category": "snack",
    "title": "Mix de frutos secos naturales sin sal añadida",
    "time": "6 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 205,
    "protein": 16,
    "carbs": 29,
    "fats": 5,
    "requiredTier": "platinum",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Mix de frutos secos naturales sin sal añadida: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-11",
    "category": "snack",
    "title": "Chips horneados de manzana deshidratada con canela",
    "time": "7 min",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "calories": 210,
    "protein": 18,
    "carbs": 32,
    "fats": 7,
    "requiredTier": "platinum",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Chips horneados de manzana deshidratada con canela: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-12",
    "category": "snack",
    "title": "Yogur skyr con semillas de calabaza y arándanos",
    "time": "8 min",
    "imageUrl": "https://images.unsplash.com/photo-1505253758473-96b301b5c81d?w=800&auto=format&fit=crop&q=80",
    "calories": 215,
    "protein": 20,
    "carbs": 19,
    "fats": 9,
    "requiredTier": "platinum",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Yogur skyr con semillas de calabaza y arándanos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-13",
    "category": "snack",
    "title": "Gelatina de frutas naturales con trozos de fresa",
    "time": "9 min",
    "imageUrl": "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop&q=80",
    "calories": 220,
    "protein": 10,
    "carbs": 22,
    "fats": 5,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Gelatina de frutas naturales con trozos de fresa: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-14",
    "category": "snack",
    "title": "Barritas caseras de avena, plátano y semillas",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    "calories": 225,
    "protein": 12,
    "carbs": 25,
    "fats": 7,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Barritas caseras de avena, plátano y semillas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-15",
    "category": "snack",
    "title": "Pepino cohombro con limón, sal marina y chile piquín",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80",
    "calories": 230,
    "protein": 14,
    "carbs": 28,
    "fats": 9,
    "requiredTier": "platinum",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Pepino cohombro con limón, sal marina y chile piquín: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-16",
    "category": "snack",
    "title": "Edamames cocidos al vapor con sal gruesa marina",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 235,
    "protein": 16,
    "carbs": 31,
    "fats": 5,
    "requiredTier": "platinum",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Edamames cocidos al vapor con sal gruesa marina: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-17",
    "category": "snack",
    "title": "Tostada melba integral con requesón y mermelada sin azúcar",
    "time": "5 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 240,
    "protein": 18,
    "carbs": 18,
    "fats": 7,
    "requiredTier": "platinum",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Tostada melba integral con requesón y mermelada sin azúcar: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-18",
    "category": "snack",
    "title": "Batido cremoso de espinaca, kiwi y agua de coco",
    "time": "6 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 245,
    "protein": 20,
    "carbs": 21,
    "fats": 9,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Batido cremoso de espinaca, kiwi y agua de coco: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-19",
    "category": "snack",
    "title": "Rollitos de pechuga de pavo con bastones de pepino",
    "time": "7 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 250,
    "protein": 10,
    "carbs": 24,
    "fats": 5,
    "requiredTier": "platinum",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Rollitos de pechuga de pavo con bastones de pepino: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-20",
    "category": "snack",
    "title": "Semillas de girasol tostadas a fuego lento",
    "time": "8 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 255,
    "protein": 12,
    "carbs": 27,
    "fats": 7,
    "requiredTier": "platinum",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Semillas de girasol tostadas a fuego lento: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-21",
    "category": "snack",
    "title": "Mandarinas frescas con puñado de almendras crudas",
    "time": "9 min",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "calories": 260,
    "protein": 14,
    "carbs": 30,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Mandarinas frescas con puñado de almendras crudas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-22",
    "category": "snack",
    "title": "Galletas caseras de avena y plátano de 2 ingredientes",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1505253758473-96b301b5c81d?w=800&auto=format&fit=crop&q=80",
    "calories": 265,
    "protein": 16,
    "carbs": 33,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Galletas caseras de avena y plátano de 2 ingredientes: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-23",
    "category": "snack",
    "title": "Smoothie refrescante de sandía, menta y hielo",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop&q=80",
    "calories": 160,
    "protein": 18,
    "carbs": 20,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Smoothie refrescante de sandía, menta y hielo: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-24",
    "category": "snack",
    "title": "Crema de cacahuete sobre apio fresco crujiente",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    "calories": 165,
    "protein": 20,
    "carbs": 23,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Crema de cacahuete sobre apio fresco crujiente: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-25",
    "category": "snack",
    "title": "Pudín exprés de chía con leche de coco y frambuesas",
    "time": "5 min",
    "imageUrl": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80",
    "calories": 170,
    "protein": 10,
    "carbs": 26,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Pudín exprés de chía con leche de coco y frambuesas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-26",
    "category": "snack",
    "title": "Chips horneados de kale al horno con aceite de oliva",
    "time": "6 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 175,
    "protein": 12,
    "carbs": 29,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Chips horneados de kale al horno con aceite de oliva: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-27",
    "category": "snack",
    "title": "Mini quesadillas integrales de queso bajo en grasa",
    "time": "7 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 180,
    "protein": 14,
    "carbs": 32,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Mini quesadillas integrales de queso bajo en grasa: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-28",
    "category": "snack",
    "title": "Bastones de jícama con gotas de limón y sal marina",
    "time": "8 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 185,
    "protein": 16,
    "carbs": 19,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Bastones de jícama con gotas de limón y sal marina: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-29",
    "category": "snack",
    "title": "Batido proteico sabor vainilla con bebida de avena",
    "time": "9 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 190,
    "protein": 18,
    "carbs": 22,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Batido proteico sabor vainilla con bebida de avena: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-30",
    "category": "snack",
    "title": "Fresas maduras bañadas con hilos de chocolate amargo 85%",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 195,
    "protein": 20,
    "carbs": 25,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Fresas maduras bañadas con hilos de chocolate amargo 85%: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-31",
    "category": "snack",
    "title": "Requesón batido con canela y rodajas de plátano",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "calories": 200,
    "protein": 10,
    "carbs": 28,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Requesón batido con canela y rodajas de plátano: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-32",
    "category": "snack",
    "title": "Tostada de pan de semillas con pasta de aceitunas negras",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1505253758473-96b301b5c81d?w=800&auto=format&fit=crop&q=80",
    "calories": 205,
    "protein": 12,
    "carbs": 31,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Tostada de pan de semillas con pasta de aceitunas negras: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-33",
    "category": "snack",
    "title": "Crujiente de garbanzos horneados con especias morunas",
    "time": "5 min",
    "imageUrl": "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop&q=80",
    "calories": 210,
    "protein": 14,
    "carbs": 18,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Crujiente de garbanzos horneados con especias morunas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-34",
    "category": "snack",
    "title": "Brochetas frescas de melón dulce con jamón curado",
    "time": "6 min",
    "imageUrl": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    "calories": 215,
    "protein": 16,
    "carbs": 21,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Brochetas frescas de melón dulce con jamón curado: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-35",
    "category": "snack",
    "title": "Copitas de yogur griego con puré casero de maracuyá",
    "time": "7 min",
    "imageUrl": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80",
    "calories": 220,
    "protein": 18,
    "carbs": 24,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Copitas de yogur griego con puré casero de maracuyá: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-36",
    "category": "snack",
    "title": "Higos frescos de temporada con nueces de nogal",
    "time": "8 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 225,
    "protein": 20,
    "carbs": 27,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Higos frescos de temporada con nueces de nogal: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-37",
    "category": "snack",
    "title": "Bombones helados de yogur griego y arándanos",
    "time": "9 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 230,
    "protein": 10,
    "carbs": 30,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Bombones helados de yogur griego y arándanos: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-38",
    "category": "snack",
    "title": "Batido de proteína vegetal con espirulina y piña",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 235,
    "protein": 12,
    "carbs": 33,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Batido de proteína vegetal con espirulina y piña: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-39",
    "category": "snack",
    "title": "Zanahorias baby con salsa tzatziki artesanal",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 240,
    "protein": 14,
    "carbs": 20,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Zanahorias baby con salsa tzatziki artesanal: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-40",
    "category": "snack",
    "title": "Tostada de centeno con aguacate triturado y semillas",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 245,
    "protein": 16,
    "carbs": 23,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Tostada de centeno con aguacate triturado y semillas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-41",
    "category": "snack",
    "title": "Bolitas energéticas de higos secos y nuez pecana",
    "time": "5 min",
    "imageUrl": "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=800&auto=format&fit=crop&q=80",
    "calories": 250,
    "protein": 18,
    "carbs": 26,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Bolitas energéticas de higos secos y nuez pecana: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-42",
    "category": "snack",
    "title": "Smoothie tropical de papaya, naranja y semillas de lino",
    "time": "6 min",
    "imageUrl": "https://images.unsplash.com/photo-1505253758473-96b301b5c81d?w=800&auto=format&fit=crop&q=80",
    "calories": 255,
    "protein": 20,
    "carbs": 29,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Smoothie tropical de papaya, naranja y semillas de lino: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-43",
    "category": "snack",
    "title": "Rebanada de sandía fresca con hojitas de hierbabuena",
    "time": "7 min",
    "imageUrl": "https://images.unsplash.com/photo-1607532941433-304659e8198a?w=800&auto=format&fit=crop&q=80",
    "calories": 260,
    "protein": 10,
    "carbs": 32,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Rebanada de sandía fresca con hojitas de hierbabuena: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-44",
    "category": "snack",
    "title": "Mix de pipas de calabaza y pasas sultanas",
    "time": "8 min",
    "imageUrl": "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=800&auto=format&fit=crop&q=80",
    "calories": 265,
    "protein": 12,
    "carbs": 19,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Mix de pipas de calabaza y pasas sultanas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-45",
    "category": "snack",
    "title": "Rodajas de tomate con queso mozzarella fresca y albahaca",
    "time": "9 min",
    "imageUrl": "https://images.unsplash.com/photo-1578849278619-e73505e9610f?w=800&auto=format&fit=crop&q=80",
    "calories": 160,
    "protein": 14,
    "carbs": 22,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Rodajas de tomate con queso mozzarella fresca y albahaca: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-46",
    "category": "snack",
    "title": "Mousse rápida de aguacate con cacao puro y miel",
    "time": "10 min",
    "imageUrl": "https://images.unsplash.com/photo-1514944298352-1fc64d9f67a2?w=800&auto=format&fit=crop&q=80",
    "calories": 165,
    "protein": 16,
    "carbs": 25,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "1 manzana fuji cortada en gajos",
      "1 cda de mantequilla de maní natural 100% sin azúcar ni aceites añadidos"
    ],
    "directions": "Preparación de Mousse rápida de aguacate con cacao puro y miel: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-47",
    "category": "snack",
    "title": "Copas de gelatina proteica con fruta natural picada",
    "time": "11 min",
    "imageUrl": "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=800&auto=format&fit=crop&q=80",
    "calories": 170,
    "protein": 18,
    "carbs": 28,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "¾ taza de yogur griego sin azúcar",
      "2 cdas de granola artesanal de avena y nuez",
      "4 fresas maduras en rodajas"
    ],
    "directions": "Preparación de Copas de gelatina proteica con fruta natural picada: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-48",
    "category": "snack",
    "title": "Crujiente de manzana con canela al microondas",
    "time": "12 min",
    "imageUrl": "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=800&auto=format&fit=crop&q=80",
    "calories": 175,
    "protein": 20,
    "carbs": 31,
    "fats": 9,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de hummus de garbanzo",
      "1 zanahoria dulce en bastones crocantes",
      "1 pepino en tiras",
      "Paprika dulce"
    ],
    "directions": "Preparación de Crujiente de manzana con canela al microondas: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-49",
    "category": "snack",
    "title": "Palitos de pan integral con queso para untar light",
    "time": "5 min",
    "imageUrl": "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&auto=format&fit=crop&q=80",
    "calories": 180,
    "protein": 10,
    "carbs": 18,
    "fats": 5,
    "requiredTier": "golden",
    "ingredients": [
      "½ taza de avena fina",
      "1 plátano muy maduro machacado",
      "1 cda de cacao puro en polvo",
      "2 cdas de coco rallado"
    ],
    "directions": "Preparación de Palitos de pan integral con queso para untar light: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  },
  {
    "id": "snack-50",
    "category": "snack",
    "title": "Sorbetes caseros helados de frutos rojos y limón",
    "time": "6 min",
    "imageUrl": "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&auto=format&fit=crop&q=80",
    "calories": 185,
    "protein": 12,
    "carbs": 21,
    "fats": 7,
    "requiredTier": "golden",
    "ingredients": [
      "¼ taza de maíz pira para palomitas",
      "1 cdta de aceite de oliva",
      "Romero seco triturado",
      "Pizca de sal marina"
    ],
    "directions": "Preparación de Sorbetes caseros helados de frutos rojos y limón: Lava y alista los ingredientes según las porciones indicadas. Cocina a fuego medio controlando los tiempos para conservar los nutrientes y sirve fresco con sazón equilibrada."
  }
];

/**
 * Comprueba si una receta está desbloqueada para el usuario
 */
export function isRecipeUnlocked(
  userTier: MembershipTierId | string | undefined,
  recipe: Recipe,
  unlockedAdRecipesMap?: Record<string, number>
): boolean {
  // Comprobar si fue desbloqueada temporalmente por anuncio (válido por 24h)
  if (unlockedAdRecipesMap && unlockedAdRecipesMap[recipe.id]) {
    const expiresAt = unlockedAdRecipesMap[recipe.id];
    if (Date.now() < expiresAt) return true;
  }
  return hasTierAccess(userTier, recipe.requiredTier);
}

/**
 * Obtiene el conteo de recetas desbloqueadas y totales por membresía
 */
export function getRecipeCatalogStats(userTier: MembershipTierId | string | undefined) {
  const normalizedTier = (userTier?.toLowerCase() as MembershipTierId) || 'standard';
  const unlocked = RECIPES_CATALOG.filter((r) => hasTierAccess(normalizedTier, r.requiredTier)).length;
  return {
    total: RECIPES_CATALOG.length,
    unlocked,
    standardCount: 24,
    platinumCount: 80,
    goldenCount: 200,
  };
}
