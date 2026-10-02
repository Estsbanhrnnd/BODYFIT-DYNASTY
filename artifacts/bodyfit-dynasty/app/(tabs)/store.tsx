import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Linking, Modal, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useListStoreProducts } from '@workspace/api-client-react';
import { Screen, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { getProductSpecification } from '@/constants/storeCatalog';

type StoreCategory = 'Todos' | 'Proteínas' | 'Creatinas' | 'Aminoácidos' | 'Pre-Entrenos' | 'Multivitamínicos';

const fallbackProducts = [
  // --- PROTEÍNAS ---
  {
    id: 'prod-iso100',
    name: 'Dymatize ISO 100 Hydrolyzed Whey',
    description: '100% aislado de proteína de suero hidrolizada con microfiltración de flujo cruzado. 25g de proteína, 5.5g de BCAAs y menos de 1g de grasa y azúcar por porción. Máxima absorción inmediata para desarrollo muscular magro.',
    category: 'Proteínas',
    imageUrl: 'https://dymatize.imgix.net/production/products/dym0001-8_ISO100_20s_PDPHero_D_3840x2156_GourmetVanilla.jpg?w=800',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-gold-standard',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    description: 'La proteína más vendida del planeta. 24g de aislado y concentrado ultrafiltrado de suero, 5.5g de BCAAs naturales y 4g de glutamina. Solubilidad instantánea y textura premium para alimentar la síntesis de proteína.',
    category: 'Proteínas',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/on-1154008_Image_01.png?width=800',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-nitro-tech',
    name: 'MuscleTech Nitro-Tech 100% Whey Gold',
    description: 'Péptidos de suero bioactivos de absorción rápida combinados con aislado de suero de máxima pureza. 24g de proteína de alto valor biológico y perfil enriquecido con BCAAs sin rellenos ni sustancias prohibidas.',
    category: 'Proteínas',
    imageUrl: 'https://www.muscletech.com/cdn/shop/files/mt-nitro-tech-100-whey-gold-french-vanilla-5lb_0a7fe571-2a38-4a63-b889-afc3dd6966bc.png?v=1753903525',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-cbum-whey',
    name: 'Raw Nutrition Whey Isolate (CBUM Series)',
    description: 'Aislado de suero 100% microfiltrado en frío de grado farmacéutico. 25g de proteína pura por porción sin grasas saturadas, bajo en sodio y con sabores legendarios como Itholate para definición y masa magra.',
    category: 'Proteínas',
    imageUrl: 'https://getrawnutrition.com/cdn/shop/files/BUM-Itholate-Chris_s_Secret_Whey_Blueberry_muffin_e931fece-6536-44bd-a62c-ed9ee5357932.png?v=1745899530',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-syntha-6',
    name: 'BSN Syntha-6 Ultra-Premium Protein Matrix',
    description: 'Matriz proteica multifase de 22g de proteína con 6 fuentes de liberación sostenida (rápida, media y lenta). Enriquecida con BCAAs, MCTs y ácidos grasos esenciales. Nutrición muscular continua durante varias horas.',
    category: 'Proteínas',
    imageUrl: 'https://www.gobsn.com/cdn/shop/files/S6_Blueberry_FR.png',
    priceCents: null,
    active: true,
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
  },
  {
    id: 'prod-on-creatine',
    name: 'Optimum Nutrition Micronized Creatine Powder',
    description: '5g de monohidrato de creatina micronizado para disolución ultra rápida sin sedimentación. Respaldado por estudios clínicos para aumentar el rendimiento en series pesadas y acelerar la recuperación muscular entre sets.',
    category: 'Creatinas',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/ON_DTC_PDP_Creatine60srv_6074352_4000x4000_8caf3a00-52f7-432d-857c-2cac79bb31a3.png?v=1784749814&width=800',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-universal-creapure',
    name: 'Universal Nutrition Creatina Creapure',
    description: 'Fabricada en Alemania bajo los controles más rigurosos del mundo. Libre de impurezas como DCD y DHT. Máxima biodisponibilidad y potencia para atletas que exigen el estándar más limpio del mercado.',
    category: 'Creatinas',
    imageUrl: 'https://www.animalpak.com/cdn/shop/files/Creatine_500g_Unflavored_1200x1200_96a0f2dc-3eaf-4be6-8a47-4e94d58c8f93.jpg?v=1762196608&width=800',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-platinum-creatine',
    name: 'MuscleTech Platinum 100% Creatine',
    description: '5000mg de monohidrato de creatina ultra-micronizada por porción testada por cromatografía líquida HPLC. Favorece la voluminización muscular y maximiza la regeneración de fosfocreatina.',
    category: 'Creatinas',
    imageUrl: 'https://www.muscletech.com/cdn/shop/files/mt-platinum-100-creatine-capsules.png',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-nutricost-creatine',
    name: 'Nutricost Pure Creatine Monohydrate 500g',
    description: '500 gramos de monohidrato de creatina pura sin aditivos, gluten ni organismos modificados genéticamente (Non-GMO). 100 servicios garantizados para soporte continuo de fuerza, potencia y rendimiento atlético.',
    category: 'Creatinas',
    imageUrl: 'https://nutricost.com/cdn/shop/files/NTC_CreatineMonohydrate_Unflavored_500G_Front_SQUARE_98526928-e1cc-4ff6-9918-430654760159_1200x1200.jpg',
    priceCents: null,
    active: true,
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
  },
  {
    id: 'prod-on-amino-energy',
    name: 'Optimum Nutrition Essential Amino Energy',
    description: '5g de aminoácidos micronizados de rápida absorción con 100mg de cafeína natural derivada de té verde y extracto de café verde. Energía sostenida, concentración mental y soporte muscular sin bajón calórico.',
    category: 'Aminoácidos',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/on-1132800_Image_01.png?v=1755790971&width=800',
    priceCents: null,
    active: true,
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
  },
  {
    id: 'prod-cbum-thavage-pre',
    name: 'Raw Nutrition CBUM Thavage Pre-Workout',
    description: 'Diseñado y calibrado personalmente por el 5x Mr. Olympia Chris Bumstead. Contiene 6g de L-Citrulina pura para vasodilatación extrema, 3.2g de Beta-Alanina, 2.5g de Betaína Anhidra, Alpha-GPC y 305mg de cafeína en matriz bifásica para concentración mental total.',
    category: 'Pre-Entrenos',
    imageUrl: 'https://getrawnutrition.com/cdn/shop/files/RAWSignatureThavagePreWorkout-CherryLimeSlush-WhiteBottle.png?v=1778770803&width=800',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-pre-jym',
    name: 'JYM Supplement Science Pre JYM High-Performance',
    description: 'Fórmula todo en uno formulada por el Dr. Jim Stoppani. 6g de Malato de Citrulina (2:1), 6g de BCAAs, 2g de Creatina HCl, 2g de Beta-Alanina, 1.5g de Betaína, 500mg de extracto de raíz de remolacha y 300mg de cafeína sin mezclas patentadas ocultas.',
    category: 'Pre-Entrenos',
    imageUrl: 'https://jymsupplementscience.com/cdn/shop/files/PRE30BP300_25954_091724_V1.1-Front-1200px.png?v=1775425736&width=800',
    priceCents: null,
    active: true,
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
  },
  {
    id: 'prod-opti-women',
    name: 'Optimum Nutrition Opti-Women Multivitamin',
    description: 'Diseñado específicamente para el metabolismo y las demandas físicas de la mujer activa. 40 ingredientes activos, 23 vitaminas y minerales esenciales, 150mg de calcio para salud ósea, 18mg de hierro quelado, ácido fólico y extractos botánicos antioxidantes en cápsulas Vcaps.',
    category: 'Multivitamínicos',
    imageUrl: 'https://www.optimumnutrition.com/cdn/shop/files/ON_OptiWomen_60ct_Main_Image.png?v=1777474313&width=800',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-animal-pak',
    name: 'Universal Nutrition Animal Pak The Complete Multi-Pack',
    description: 'Desde 1983, el suplemento base de los atletas de fuerza más exigentes del mundo. Cada pack individual aporta megadosis de vitaminas y minerales, complejo de aminoácidos, complejo de optimización de rendimiento, enzimas digestivas y complejo hepático protector.',
    category: 'Multivitamínicos',
    imageUrl: 'https://www.animalpak.com/cdn/shop/files/Pak_30packs_1200x1200_10ffb784-bf66-40fb-818d-0343c89d36c3.webp?v=1778247781&width=800',
    priceCents: null,
    active: true,
  },
];

export default function StoreScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { isOwner, isAdminModeActive } = useBodyFit();
  const [selectedCategory, setSelectedCategory] = useState<StoreCategory>('Todos');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);

  const productsQuery = useListStoreProducts();
  const apiProducts = productsQuery.data?.products && productsQuery.data.products.length > 0
    ? productsQuery.data.products
    : fallbackProducts;

  const filteredProducts = apiProducts.filter((product) => {
    if (selectedCategory === 'Todos') return true;
    return product.category?.toLowerCase() === selectedCategory.toLowerCase();
  });

  const handleWhatsAppQuote = (productName: string, presentation?: string) => {
    const phoneNumber = '50664765471';
    const detail = presentation ? ` (${presentation})` : '';
    const message = `Hola Coach Esteban, quisiera cotizar ${productName}${detail} que vi en la app Dynasty.`;
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    Linking.openURL(url).catch(() => {
      Alert.alert(
        'WhatsApp no disponible',
        'No pudimos abrir WhatsApp automáticamente. Puedes escribir directamente al número +506 6476 5471 para cotizar tu suplemento.'
      );
    });
  };

  return (
    <Screen scroll={false}>
      <TopBar title="Tienda Oficial" subtitle="Suplementación líder en Costa Rica" />

      {/* Banner de Administrador para Propietario (Solo en Modo Administrador Activo) */}
      {isAdminModeActive && (
        <Pressable
          onPress={() => router.push('/admin-store' as never)}
          style={({ pressed }) => [
            {
              backgroundColor: '#1E1428',
              borderColor: colors.gold,
              borderWidth: 1.5,
              borderRadius: 16,
              padding: 12,
              marginBottom: 8,
              marginTop: 4,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${colors.gold}25`, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="settings" size={18} color={colors.gold} />
            </View>
            <View>
              <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800', letterSpacing: 1 }}>PANEL DE ADMINISTRACIÓN</Text>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Gestionar Productos & Precios de Tienda</Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color={colors.gold} />
        </Pressable>
      )}

      {/* Selector de Categorías */}
      <View style={{ paddingVertical: 8 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingHorizontal: 2 }}>
          {(['Todos', 'Proteínas', 'Creatinas', 'Aminoácidos', 'Pre-Entrenos', 'Multivitamínicos'] as const).map((cat) => {
            const active = selectedCategory === cat;
            return (
              <Pressable
                key={cat}
                onPress={() => setSelectedCategory(cat)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 9,
                  borderRadius: 14,
                  backgroundColor: active ? colors.primary : colors.card,
                  borderColor: active ? colors.primary : colors.border,
                  borderWidth: 1,
                }}
              >
                <Text style={{ color: active ? colors.primaryForeground : colors.foreground, fontSize: 12, fontWeight: '700' }}>
                  {cat}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Lista de Suplementos */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={productsQuery.isRefetching}
            onRefresh={() => productsQuery.refetch()}
            tintColor={colors.primary}
          />
        }
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 40 : Math.max(insets.bottom + 120, 150), paddingTop: 6 }}
      >
        {filteredProducts.map((product) => (
          <Pressable
            key={product.id}
            onPress={() => setSelectedProduct(product)}
            style={({ pressed }) => [
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 22,
                overflow: 'hidden',
                marginBottom: 16,
                padding: 0,
                opacity: pressed ? 0.95 : 1,
              },
            ]}
          >
            {/* Foto del Suplemento Cuadrada (1:1) sin Cortes */}
            <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#130C1C', alignItems: 'center', justifyContent: 'center', padding: 12 }}>
              <Image
                source={{ uri: product.imageUrl ?? 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800' }}
                contentFit="contain"
                style={{ width: '100%', height: '100%' }}
              />
              <View
                style={{
                  position: 'absolute',
                  top: 12,
                  left: 12,
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
                  {product.category}
                </Text>
              </View>

              {/* Distintivo de Tocar para ver Ficha Completa */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 12,
                  right: 12,
                  backgroundColor: 'rgba(15, 10, 22, 0.85)',
                  borderColor: colors.gold,
                  borderWidth: 1,
                  paddingHorizontal: 10,
                  paddingVertical: 5,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                }}
              >
                <Feather name="eye" size={12} color={colors.gold} />
                <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800' }}>
                  Ver Ficha Completa
                </Text>
              </View>
            </View>

            {/* Contenido del Producto */}
            <View style={{ padding: 16 }}>
              <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '800', lineHeight: 22 }}>
                {product.name}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12.5, lineHeight: 18, marginTop: 7 }} numberOfLines={3}>
                {product.description}
              </Text>

              {/* Fila de Precio y Acción */}
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 10,
                  marginTop: 16,
                  paddingTop: 14,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <View style={{ minWidth: 110 }}>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10, textTransform: 'uppercase', fontWeight: '700' }}>
                    {(product as any).priceText ? 'PRECIO DYNASTY' : 'ESTADO'}
                  </Text>
                  <Text style={{ color: colors.gold, fontSize: (product as any).priceText ? 15 : 13, fontWeight: '800', marginTop: 2 }}>
                    {(product as any).priceText || 'Precio a consultar'}
                  </Text>
                </View>

                <Pressable
                  onPress={(e) => {
                    e.stopPropagation();
                    handleWhatsAppQuote(product.name);
                  }}
                  style={({ pressed }) => [
                    {
                      backgroundColor: '#25D366',
                      paddingHorizontal: 15,
                      paddingVertical: 10,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 7,
                      opacity: pressed ? 0.85 : 1,
                    },
                  ]}
                >
                  <Feather name="message-circle" size={15} color="#FFFFFF" />
                  <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                    Cotizar por WhatsApp
                  </Text>
                </Pressable>
              </View>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* ================= MODAL DESLIZANTE DE ESPECIFICACIÓN COMPLETA ================= */}
      <Modal
        visible={Boolean(selectedProduct)}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedProduct(null)}
      >
        <View style={storeModalStyles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedProduct(null)} />
          <View
            style={[
              storeModalStyles.modalContent,
              {
                backgroundColor: '#150E1F',
                borderColor: colors.gold,
              },
            ]}
          >
            {selectedProduct ? (
              (() => {
                const spec = getProductSpecification(selectedProduct);
                return (
                  <>
                    {/* Header con categoría y botón X */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0 }}>
                        <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', textTransform: 'uppercase' }}>
                            {spec.category}
                          </Text>
                        </View>
                        <View style={{ backgroundColor: `${colors.primary}25`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ color: colors.primary, fontSize: 10.5, fontWeight: '800' }}>
                            OFICIAL DYNASTY
                          </Text>
                        </View>
                      </View>
                      <Pressable
                        onPress={() => setSelectedProduct(null)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Feather name="x" size={18} color={colors.foreground} />
                      </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 28 }}>
                      {/* Foto Cuadrada 1:1 en Contenedor Oscuro */}
                      <View style={{ width: '100%', aspectRatio: 1, backgroundColor: '#0F0916', borderRadius: 18, borderWidth: 1, borderColor: `${colors.gold}40`, alignItems: 'center', justifyContent: 'center', padding: 16, marginBottom: 14 }}>
                        <Image
                          source={{ uri: selectedProduct.imageUrl ?? 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800' }}
                          contentFit="contain"
                          style={{ width: '100%', height: '100%' }}
                        />
                      </View>

                      {/* Nombre y Tagline */}
                      <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: 4 }}>
                        {spec.name}
                      </Text>
                      <Text style={{ color: colors.gold, fontSize: 12.5, fontWeight: '700', marginBottom: 10 }}>
                        {spec.tagline}
                      </Text>

                      {/* Precio y Presentación */}
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#1E1428', padding: 12, borderRadius: 12, borderWidth: 1, borderColor: `${colors.gold}50`, marginBottom: 14 }}>
                        <View>
                          <Text style={{ color: colors.mutedForeground, fontSize: 10, fontWeight: '700', textTransform: 'uppercase' }}>
                            PRECIO DYNASTY OFICIAL
                          </Text>
                          <Text style={{ color: colors.gold, fontSize: 16, fontWeight: '900', marginTop: 2 }}>
                            {selectedProduct.priceText || 'Consultar con Asesor'}
                          </Text>
                        </View>
                        {spec.servingInfo.presentation ? (
                          <View style={{ backgroundColor: `${colors.primary}20`, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 8, alignItems: 'flex-end' }}>
                            <Text style={{ color: colors.mutedForeground, fontSize: 9.5, fontWeight: '700' }}>PRESENTACIÓN</Text>
                            <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '700' }}>{spec.servingInfo.presentation}</Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Resumen de Propósito */}
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 6 }}>
                          DESCRIPCIÓN DEL SUPLEMENTO
                        </Text>
                        <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 19, opacity: 0.9 }}>
                          {spec.summary}
                        </Text>
                      </View>

                      {/* Píldoras de Beneficios Clave (Highlights) */}
                      <View style={{ marginBottom: 14 }}>
                        <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: 8 }}>
                          VALOR NUTRICIONAL & HIGHLIGHTS
                        </Text>
                        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7 }}>
                          {spec.highlights.map((h, hIdx) => (
                            <View
                              key={hIdx}
                              style={{
                                backgroundColor: '#1F152A',
                                borderWidth: 1,
                                borderColor: `${colors.primary}50`,
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 10,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 6,
                              }}
                            >
                              <Feather name={(h.icon as any) || 'check'} size={12} color={colors.gold} />
                              <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '700' }}>
                                {h.value}
                              </Text>
                            </View>
                          ))}
                        </View>
                      </View>

                      {/* Raciones y Ficha Nutricional */}
                      <View style={{ backgroundColor: '#181022', borderRadius: 14, padding: 12, borderWidth: 1, borderColor: `${colors.border}70`, marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Feather name="pie-chart" size={13} color={colors.gold} />
                          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
                            INFORMACIÓN POR PORCIÓN
                          </Text>
                        </View>
                        <View style={{ gap: 4 }}>
                          <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                            • Tamaño de porción: <Text style={{ fontWeight: '700' }}>{spec.servingInfo.servingSize}</Text>
                          </Text>
                          <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                            • Porciones por envase: <Text style={{ fontWeight: '700' }}>{spec.servingInfo.servingsPerContainer}</Text>
                          </Text>
                          {spec.servingInfo.protein ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Proteína: <Text style={{ color: colors.gold, fontWeight: '700' }}>{spec.servingInfo.protein}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.bcaa ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • BCAAs: <Text style={{ color: colors.primary, fontWeight: '700' }}>{spec.servingInfo.bcaa}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.glutamine ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Glutamina: <Text style={{ fontWeight: '700' }}>{spec.servingInfo.glutamine}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.creatine ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Creatina Pura: <Text style={{ color: colors.gold, fontWeight: '700' }}>{spec.servingInfo.creatine}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.caffeine ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Cafeína / Energía: <Text style={{ color: '#FF7700', fontWeight: '700' }}>{spec.servingInfo.caffeine}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.citrulline ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Citrulina / Bombeo: <Text style={{ color: colors.primary, fontWeight: '700' }}>{spec.servingInfo.citrulline}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.betaAlanine ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Beta-Alanina: <Text style={{ fontWeight: '700' }}>{spec.servingInfo.betaAlanine}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.vitamins ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Vitaminas Clave: <Text style={{ color: colors.gold, fontWeight: '700' }}>{spec.servingInfo.vitamins}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.minerals ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Minerales Esenciales: <Text style={{ fontWeight: '700' }}>{spec.servingInfo.minerals}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.keyActives ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Complejos Activos: <Text style={{ color: colors.primary, fontWeight: '700' }}>{spec.servingInfo.keyActives}</Text>
                            </Text>
                          ) : null}
                          {spec.servingInfo.sugar ? (
                            <Text style={{ color: colors.foreground, fontSize: 11.5 }}>
                              • Azúcar / Carbohidratos: <Text style={{ fontWeight: '700' }}>{spec.servingInfo.sugar}</Text>
                            </Text>
                          ) : null}
                        </View>
                      </View>

                      {/* Tarjeta: Modo de Empleo & Timing Óptimo */}
                      <View style={{ backgroundColor: '#21152C', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: `${colors.gold}60`, marginBottom: 14 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Feather name="clock" size={14} color={colors.gold} />
                          <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '800' }}>
                            INDICACIONES DE USO & TIMING
                          </Text>
                        </View>
                        <Text style={{ color: colors.foreground, fontSize: 12, lineHeight: 18, marginBottom: 8 }}>
                          {spec.usageInstructions.directions}
                        </Text>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', padding: 10, borderRadius: 8 }}>
                          <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 16 }}>
                            💡 <Text style={{ color: colors.gold, fontWeight: '700' }}>Momento recomendado:</Text> {spec.usageInstructions.timing}
                          </Text>
                        </View>
                      </View>

                      {/* Tarjeta: Ingredientes, Alérgenos y Advertencias Sanitarias */}
                      <View style={{ backgroundColor: '#170E20', borderRadius: 14, padding: 14, borderWidth: 1, borderColor: `${colors.border}80`, marginBottom: 16 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                          <Feather name="alert-circle" size={14} color="#FFA502" />
                          <Text style={{ color: '#FFA502', fontSize: 12, fontWeight: '800' }}>
                            ADVERTENCIAS, INGREDIENTES & REGISTRO SANITARIO
                          </Text>
                        </View>
                        <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 16, marginBottom: 8 }}>
                          <Text style={{ color: colors.foreground, fontWeight: '700' }}>Ingredientes:</Text> {spec.healthNotice.ingredientsSummary}
                        </Text>
                        <Text style={{ color: '#FFA502', fontSize: 11, fontWeight: '700', marginBottom: 8 }}>
                          ⚠️ Alérgenos: {spec.healthNotice.allergens}
                        </Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10.5, lineHeight: 15, fontStyle: 'italic', marginBottom: 8 }}>
                          "{spec.healthNotice.warnings}"
                        </Text>
                        {spec.healthNotice.registrationCR ? (
                          <View style={{ backgroundColor: 'rgba(255,255,255,0.04)', padding: 8, borderRadius: 6 }}>
                            <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700' }}>
                              🇨🇷 {spec.healthNotice.registrationCR}
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Botón WhatsApp de Acción Directa */}
                      <Pressable
                        onPress={() => handleWhatsAppQuote(spec.name, spec.servingInfo.presentation)}
                        style={({ pressed }) => [
                          {
                            backgroundColor: '#25D366',
                            paddingVertical: 14,
                            borderRadius: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            marginBottom: 10,
                            opacity: pressed ? 0.85 : 1,
                          },
                        ]}
                      >
                        <Feather name="message-circle" size={18} color="#FFFFFF" />
                        <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>
                          Cotizar / Comprar por WhatsApp
                        </Text>
                      </Pressable>

                      {/* Botón Cerrar */}
                      <Pressable
                        onPress={() => setSelectedProduct(null)}
                        style={{
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          paddingVertical: 11,
                          borderRadius: 12,
                          alignItems: 'center',
                        }}
                      >
                        <Text style={{ color: colors.foreground, fontSize: 12.5, fontWeight: '700' }}>
                          Cerrar Ficha del Producto
                        </Text>
                      </Pressable>
                    </ScrollView>
                  </>
                );
              })()
            ) : null}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const storeModalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
    borderTopWidth: 2,
  },
});