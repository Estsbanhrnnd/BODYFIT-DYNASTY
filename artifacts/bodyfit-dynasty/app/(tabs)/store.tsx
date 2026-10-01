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

type StoreCategory = 'Todos' | 'Proteínas' | 'Creatinas' | 'Aminoácidos';

const fallbackProducts = [
  // --- PROTEÍNAS ---
  {
    id: 'prod-iso100',
    name: 'Dymatize ISO 100 Hydrolyzed Whey',
    description: '100% aislado de proteína de suero hidrolizada. 25g de proteína ultra pura, 5.5g de BCAAs y menos de 1g de azúcar y grasa por porción. Digestión y absorción inmediata.',
    category: 'Proteínas',
    imageUrl: 'https://images.unsplash.com/photo-1579722821273-0f6c7d44362f?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-gold-standard',
    name: 'Optimum Nutrition Gold Standard 100% Whey',
    description: 'La proteína de mayor venta en Costa Rica y el mundo. 24g de aislado de suero de leche, 5.5g de BCAAs naturales y 4g de glutamina para máxima recuperación.',
    category: 'Proteínas',
    imageUrl: 'https://images.unsplash.com/photo-1593095948071-474c5cc2989d?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-nitro-tech',
    name: 'MuscleTech Nitro-Tech 100% Whey Gold',
    description: 'Fórmula enriquecida con péptidos y aislado de suero con microfiltración extrema. 24g de proteína de valor biológico superior y excelente solubilidad.',
    category: 'Proteínas',
    imageUrl: 'https://www.muscletech.com/cdn/shop/files/mt-nitro-tech-100-whey-gold-french-vanilla-5lb_0a7fe571-2a38-4a63-b889-afc3dd6966bc.png?v=1753903525',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-cbum-whey',
    name: 'Raw Nutrition Whey Isolate (CBUM Series)',
    description: 'Aislado de suero premium oficial del 5x Mr. Olympia Chris Bumstead. Microfiltrado en frío sin rellenos para máxima biodisponibilidad y definición muscular limpia.',
    category: 'Proteínas',
    imageUrl: 'https://getrawnutrition.com/cdn/shop/files/BUM-Itholate-Chris_s_Secret_Whey_Blueberry_muffin_e931fece-6536-44bd-a62c-ed9ee5357932.png?v=1745899530',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-syntha-6',
    name: 'BSN Syntha-6 Ultra-Premium Protein Matrix',
    description: 'Matriz proteica multifase con 22g de proteína de digestión rápida, media y lenta. Sabor excepcional tipo malteada para nutrir tus músculos durante varias horas.',
    category: 'Proteínas',
    imageUrl: 'https://images.unsplash.com/photo-1579722822184-7a31f79a9ef1?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
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
  },
  {
    id: 'prod-on-creatine',
    name: 'Optimum Nutrition Micronized Creatine',
    description: 'Monohidrato de creatina micronizado para disolución instantánea sin grumos. Probado científicamente para regenerar ATP y aumentar masa muscular magra.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-universal-creapure',
    name: 'Universal Nutrition Creatina Creapure',
    description: 'La creatina alemana Creapure® con 99.9% de pureza certificada. El estándar más alto en potencia, resistencia y seguridad para atletas exigentes.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-platinum-creatine',
    name: 'MuscleTech Platinum 100% Creatine',
    description: '5000 mg de creatina ultra-micronizada por porción testada por cromatografía HPLC. Máxima saturación intramuscular y recuperación acelerada.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-nutricost-creatine',
    name: 'Nutricost Pure Creatine Monohydrate',
    description: 'Creatina monohidratada pura sin aditivos, gluten ni rellenos. 500g con 100 porciones garantizadas para soporte continuo de fuerza y potencia.',
    category: 'Creatinas',
    imageUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
  },

  // --- AMINOÁCIDOS ---
  {
    id: 'prod-xtend-bcaa',
    name: 'Scivation Xtend BCAA Original',
    description: 'Líder número 1 en aminoácidos de cadena ramificada en Costa Rica. 7g de BCAAs en proporción 2:1:1, glutamina, citrulina y electrolitos para hidratación sin calorías.',
    category: 'Aminoácidos',
    imageUrl: 'https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?w=800&auto=format&fit=crop&q=80',
    priceCents: null,
    active: true,
  },
  {
    id: 'prod-on-amino-energy',
    name: 'Optimum Nutrition Essential Amino Energy',
    description: 'Energía limpia y aminoácidos esenciales con 100 mg de cafeína natural de té verde y café verde. Ideal antes o durante el entreno para enfoque y recuperación.',
    category: 'Aminoácidos',
    imageUrl: 'https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=800&auto=format&fit=crop&q=80',
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
          {(['Todos', 'Proteínas', 'Creatinas', 'Aminoácidos'] as const).map((cat) => {
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