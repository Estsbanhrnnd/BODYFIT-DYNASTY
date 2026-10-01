import AsyncStorage from '@react-native-async-storage/async-storage';
import { Feather } from '@expo/vector-icons';
import { useUser } from '@clerk/expo';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Image, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { Screen, TopBar } from '@/components/bodyfit';
import { DynastyAdModal } from '@/components/DynastyAdModal';
import {
  RECIPES_CATALOG,
  RECIPE_CATEGORIES,
  isRecipeUnlocked,
  getRecipeCatalogStats,
  type Recipe,
  type RecipeCategory,
} from '@/constants/recipeCatalog';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import type { MembershipTierId } from '@/constants/membershipConfig';

const CATEGORY_COVERS: Record<RecipeCategory, any> = {
  desayuno: require('@/assets/images/dynasty_breakfast_cover.jpg'),
  almuerzo: require('@/assets/images/dynasty_lunch_cover.jpg'),
  cena: require('@/assets/images/dynasty_dinner_cover.jpg'),
  snack: require('@/assets/images/dynasty_snack_cover.jpg'),
};

const CATEGORY_BANNERS_INFO: Record<RecipeCategory, { title: string; subtitle: string; icon: string }> = {
  desayuno: {
    title: 'Desayunos Dynasty',
    subtitle: 'Energía limpia, proteínas de alto valor y vitalidad matutina · 50 Recetas',
    icon: 'sun',
  },
  almuerzo: {
    title: 'Almuerzos Dynasty',
    subtitle: 'Potencia anabólica, carbohidratos complejos y micronutrientes · 50 Recetas',
    icon: 'activity',
  },
  cena: {
    title: 'Cenas Dynasty',
    subtitle: 'Recuperación muscular nocturna, digestión ligera y saciedad · 50 Recetas',
    icon: 'moon',
  },
  snack: {
    title: 'Snacks & Batidos Dynasty',
    subtitle: 'Snacks proteicos rápidos, energía pre y post entreno · 50 Recetas',
    icon: 'coffee',
  },
};

export default function RecipesScreen() {
  const colors = useColors();
  const {
    membership,
    membershipLabel,
    addMeal,
    isItemUnlocked,
    watchAdForItem,
    getRequiredAdsForItem,
    getAdProgressForItem,
    isItemUnlockedWithAd,
    getItemAdRemainingDays,
  } = useBodyFit();
  const { user } = useUser();

  const [category, setCategory] = useState<RecipeCategory>('desayuno');
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userKey, setUserKey] = useState('anonymous');
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adRecipeTarget, setAdRecipeTarget] = useState<Recipe | null>(null);

  const stats = useMemo(() => getRecipeCatalogStats(membership), [membership]);

  const selectedRecipe = useMemo(() => {
    if (!selectedRecipeId) return null;
    return RECIPES_CATALOG.find((r) => r.id === selectedRecipeId) ?? null;
  }, [selectedRecipeId]);

  useEffect(() => {
    const nextKey = user?.id ?? 'anonymous';
    setUserKey(nextKey);
    AsyncStorage.getItem(`bodyfit-recipes-favorites-${nextKey}`)
      .then((value) => {
        setFavorites(value ? JSON.parse(value) : []);
      })
      .catch(() => setFavorites([]));
  }, [user?.id]);

  useEffect(() => {
    AsyncStorage.setItem(`bodyfit-recipes-favorites-${userKey}`, JSON.stringify(favorites)).catch(() => undefined);
  }, [favorites, userKey]);

  const visibleRecipes = useMemo(
    () => RECIPES_CATALOG.filter((recipe) => recipe.category === category),
    [category]
  );

  const checkUnlocked = (recipe: Recipe) => {
    return isItemUnlocked(recipe.requiredTier as MembershipTierId, recipe.id);
  };

  const toggleFavorite = (id: string) => {
    setFavorites((current) => (current.includes(id) ? current.filter((item) => item !== id) : [...current, id]));
  };

  const openRecipe = (recipe: Recipe) => {
    setSelectedRecipeId(recipe.id);
  };

  const closeRecipe = () => {
    setSelectedRecipeId(null);
  };

  const handleRegisterMeal = (recipe: Recipe) => {
    addMeal(recipe.calories, recipe.protein, recipe.carbs, recipe.fats);
    Alert.alert(
      '¡Comida Registrada!',
      `Se han sumado ${recipe.calories} kcal, ${recipe.protein}g de proteína, ${recipe.carbs}g de carbohidratos y ${recipe.fats}g de grasas a tu progreso diario.`
    );
  };

  const handleAdRewardClaimed = async () => {
    if (!adRecipeTarget) return;
    const res = await watchAdForItem(adRecipeTarget.id);
    if (res.completed) {
      Alert.alert(
        '👑 ¡Receta Desbloqueada!',
        `Has completado la meta de anuncios para "${adRecipeTarget.title}". Tienes acceso completo e ilimitado a sus ingredientes y preparación durante los próximos 7 días.`
      );
    } else {
      Alert.alert(
        '🔥 Progreso Registrado',
        `Has visto un anuncio. Te falta(n) ${res.remaining} anuncio(s) para desbloquear "${adRecipeTarget.title}" por 7 días.`
      );
    }
  };

  return (
    <Screen>
      <TopBar title="Recetas" subtitle="Comida real para tu progreso" />
      <Text accessibilityRole="header" style={[styles.intro, { color: colors.foreground }]}>
        Tu catálogo BodyFit
      </Text>
      <Text style={[styles.caption, { color: colors.mutedForeground }]}>
        200 recetas saludables escalonadas con desglose nutricional, ingredientes y preparación paso a paso.
      </Text>

      {/* Selector de Categorías */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.categoryRow}>
        {RECIPE_CATEGORIES.map((item) => (
          <Pressable
            key={item.id}
            accessibilityRole="tab"
            accessibilityState={{ selected: category === item.id }}
            onPress={() => {
              setCategory(item.id);
              setSelectedRecipeId(null);
            }}
            style={[
              styles.category,
              {
                backgroundColor: category === item.id ? colors.primary : colors.card,
                borderColor: category === item.id ? colors.primary : colors.border,
              },
            ]}
          >
            <Feather name={item.icon as any} size={16} color={category === item.id ? colors.primaryForeground : colors.gold} />
            <Text
              style={{
                color: category === item.id ? colors.primaryForeground : colors.foreground,
                fontSize: 12,
                fontWeight: '700',
              }}
            >
              {item.label}
            </Text>
          </Pressable>
        ))}
      </ScrollView>

      {/* Banner Hero de Categoría Nano Banana */}
      <View style={[styles.heroBannerContainer, { borderColor: `${colors.gold}44` }]}>
        <Image
          source={CATEGORY_COVERS[category]}
          style={styles.heroBannerImage}
          resizeMode="cover"
        />
        <View style={styles.heroBannerOverlay}>
          <View style={styles.heroBannerTag}>
            <Feather name={CATEGORY_BANNERS_INFO[category].icon as any} size={14} color={colors.gold} />
            <Text style={[styles.heroBannerTagText, { color: colors.gold }]}>
              {CATEGORY_BANNERS_INFO[category].title.toUpperCase()}
            </Text>
          </View>
          <Text style={styles.heroBannerSubtitle}>
            {CATEGORY_BANNERS_INFO[category].subtitle}
          </Text>
        </View>
      </View>

      {/* Nota de Membresía y Cuotas */}
      <View style={[styles.membershipNote, { backgroundColor: `${colors.gold}18`, borderColor: `${colors.gold}55` }]}>
        <Feather name="award" size={16} color={colors.gold} />
        <View style={{ flex: 1 }}>
          <Text style={[styles.noteText, { color: colors.foreground }]}>
            Plan {membershipLabel}: {stats.unlocked} de {stats.total} recetas desbloqueadas
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>
            {membership === 'standard' || membership === 'bronze'
              ? '6 recetas por categoría · Mira un anuncio para desbloquear 24h'
              : membership === 'platinum'
              ? '20 recetas por categoría (80 en total)'
              : 'Acceso total VIP a las 200 recetas'}
          </Text>
        </View>
        <Pressable
          onPress={() => router.push('/plans')}
          style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 9, paddingVertical: 5, borderRadius: 8, borderWidth: 1, borderColor: colors.gold }}
        >
          <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800' }}>PLANES</Text>
        </Pressable>
      </View>

      {/* Lista de Tarjetas de Recetas */}
      {visibleRecipes.map((recipe) => {
        const unlocked = checkUnlocked(recipe);
        const favorite = favorites.includes(recipe.id);
        const isCurrentOpen = selectedRecipeId === recipe.id;
        return (
          <Pressable
            key={recipe.id}
            accessibilityRole="button"
            accessibilityLabel={`${recipe.title}${unlocked ? '' : ', bloqueada'}`}
            onPress={() => openRecipe(recipe)}
            style={[
              styles.recipe,
              {
                backgroundColor: colors.card,
                borderColor: isCurrentOpen ? colors.gold : unlocked ? colors.border : `${colors.gold}55`,
                opacity: unlocked ? 1 : 0.85,
              },
            ]}
          >
            <Image
              source={{ uri: recipe.imageUrl }}
              style={styles.recipeThumbnail}
              resizeMode="cover"
            />
            <View style={styles.recipeContent}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                <Text style={[styles.recipeTitle, { color: colors.foreground, flex: 1 }]} numberOfLines={1}>
                  {recipe.title}
                </Text>
                {!unlocked ? (
                  <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>
                      {recipe.requiredTier.toUpperCase()}
                    </Text>
                  </View>
                ) : null}
              </View>

              {/* Fila de Macros y Tiempo */}
              <View style={styles.recipeMetaRow}>
                <Feather name="clock" size={11} color={colors.gold} />
                <Text style={[styles.recipeMeta, { color: colors.mutedForeground, marginRight: 8 }]}>
                  {recipe.time}
                </Text>
                <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                  <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '700' }}>
                    🔥 {recipe.calories} kcal
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
                    🥩 {recipe.protein}g P
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
                    🌾 {recipe.carbs}g C
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
                    🥑 {recipe.fats}g G
                  </Text>
                </View>
              </View>
            </View>

            {unlocked ? (
              <Pressable
                accessibilityRole="button"
                accessibilityLabel={favorite ? `Quitar ${recipe.title} de favoritos` : `Guardar ${recipe.title} en favoritos`}
                onPress={() => toggleFavorite(recipe.id)}
                hitSlop={12}
                style={styles.favButton}
              >
                <Feather name="heart" size={18} color={favorite ? colors.destructive : colors.mutedForeground} />
              </Pressable>
            ) : (
              <View style={styles.lockBadge}>
                <Feather name="lock" size={16} color={colors.gold} />
              </View>
            )}
          </Pressable>
        );
      })}

      {/* Modal / Detalle de la Receta Seleccionada */}
      <Modal
        visible={Boolean(selectedRecipe)}
        animationType="slide"
        transparent={true}
        onRequestClose={closeRecipe}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={closeRecipe} />
          <View
            style={[
              styles.modalContent,
              {
                backgroundColor: '#160F20',
                borderColor: colors.gold,
              },
            ]}
          >
            {selectedRecipe ? (
              (() => {
                const isRecipeUnlockedState = isItemUnlocked(selectedRecipe.requiredTier as MembershipTierId, selectedRecipe.id);
                const isAdUnlocked = isItemUnlockedWithAd(selectedRecipe.id);
                const remainingDays = getItemAdRemainingDays(selectedRecipe.id);
                const reqAds = getRequiredAdsForItem(selectedRecipe.id);
                const curAds = getAdProgressForItem(selectedRecipe.id);

                return (
                  <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 16 }}>
                    <View style={styles.detailTopRow}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={[styles.detailBadgeContainer, { backgroundColor: `${colors.gold}22` }]}>
                          <Text style={[styles.detailCategoryBadge, { color: colors.gold }]}>
                            {selectedRecipe.category.toUpperCase()}
                          </Text>
                        </View>
                        {!isRecipeUnlockedState ? (
                          <View style={[styles.detailBadgeContainer, { backgroundColor: `${colors.primary}22` }]}>
                            <Text style={[styles.detailCategoryBadge, { color: colors.primary }]}>
                              PLAN {selectedRecipe.requiredTier.toUpperCase()}
                            </Text>
                          </View>
                        ) : isAdUnlocked ? (
                          <View style={[styles.detailBadgeContainer, { backgroundColor: `${colors.gold}30` }]}>
                            <Text style={[styles.detailCategoryBadge, { color: colors.gold }]}>
                              PATROCINIO ({remainingDays}D)
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Pressable
                        accessibilityRole="button"
                        accessibilityLabel="Cerrar detalle"
                        onPress={closeRecipe}
                        style={styles.close}
                        hitSlop={12}
                      >
                        <Feather name="x" size={22} color={colors.foreground} />
                      </Pressable>
                    </View>

                    <Image
                      source={{ uri: selectedRecipe.imageUrl }}
                      style={styles.detailBanner}
                      resizeMode="cover"
                    />

                    <Text style={[styles.detailTitle, { color: colors.foreground }]}>
                      {selectedRecipe.title}
                    </Text>

                    <View style={styles.detailMetaRow}>
                      <Feather name="clock" size={14} color={colors.gold} />
                      <Text style={[styles.time, { color: colors.gold }]}> {selectedRecipe.time} de preparación</Text>
                    </View>

                    {/* Desglose de Macronutrientes */}
                    <Text style={[styles.detailHeading, { color: colors.foreground, marginTop: 4 }]}>
                      Valores Nutricionales Estimados
                    </Text>
                    <View style={{ flexDirection: 'row', gap: 8, marginTop: 6, marginBottom: 12 }}>
                      <View style={{ flex: 1, backgroundColor: '#211530', padding: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: `${colors.primary}44` }}>
                        <Text style={{ color: colors.primary, fontSize: 14, fontWeight: '800' }}>{selectedRecipe.calories}</Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Calorías</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: '#211530', padding: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: `${colors.gold}44` }}>
                        <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '800' }}>{selectedRecipe.protein}g</Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Proteína</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: '#211530', padding: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: `${colors.border}88` }}>
                        <Text style={{ color: '#E0E0E0', fontSize: 14, fontWeight: '800' }}>{selectedRecipe.carbs}g</Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Carbs</Text>
                      </View>
                      <View style={{ flex: 1, backgroundColor: '#211530', padding: 10, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: `${colors.border}88` }}>
                        <Text style={{ color: '#E0E0E0', fontSize: 14, fontWeight: '800' }}>{selectedRecipe.fats}g</Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Grasas</Text>
                      </View>
                    </View>

                    {/* Si está desbloqueada: Botón interactivo para registrar en el día, ingredientes y preparación */}
                    {isRecipeUnlockedState ? (
                      <>
                        <Pressable
                          onPress={() => handleRegisterMeal(selectedRecipe)}
                          style={{
                            backgroundColor: colors.primary,
                            paddingVertical: 12,
                            borderRadius: 14,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 8,
                            marginBottom: 16,
                          }}
                        >
                          <Feather name="plus-circle" size={17} color={colors.primaryForeground} />
                          <Text style={{ color: colors.primaryForeground, fontSize: 13, fontWeight: '800' }}>
                            Registrar esta comida en mi día
                          </Text>
                        </Pressable>

                        <Text style={[styles.detailHeading, { color: colors.foreground }]}>Ingredientes</Text>
                        {selectedRecipe.ingredients.map((ingredient, idx) => (
                          <Text key={`${ingredient}-${idx}`} style={[styles.detailLine, { color: colors.mutedForeground }]}>
                            • {ingredient}
                          </Text>
                        ))}

                        <Text style={[styles.detailHeading, { color: colors.foreground }]}>Preparación Paso a Paso</Text>
                        <Text style={[styles.detailDirections, { color: colors.mutedForeground }]}>
                          {selectedRecipe.directions}
                        </Text>
                      </>
                    ) : (
                      /* Si está bloqueada: Ocultar ingredientes y preparación, mostrar tarjeta de Bloqueo Real */
                      <View
                        style={{
                          backgroundColor: '#261633',
                          borderColor: colors.gold,
                          borderWidth: 1.5,
                          borderRadius: 16,
                          padding: 16,
                          marginBottom: 16,
                        }}
                      >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                          <Feather name="lock" size={18} color={colors.gold} />
                          <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '800' }}>
                            Receta Bloqueada ({selectedRecipe.requiredTier.toUpperCase()})
                          </Text>
                        </View>
                        <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 17, marginBottom: 12 }}>
                          Los ingredientes exactos y la preparación paso a paso pertenecen al plan {selectedRecipe.requiredTier.toUpperCase()}. Puedes acceder mejorando tu membresía o desbloquearla por 7 días viendo anuncios patrocinados.
                        </Text>

                        <View style={{ gap: 8 }}>
                          <Pressable
                            onPress={() => {
                              closeRecipe();
                              router.push('/plans');
                            }}
                            style={{
                              backgroundColor: colors.gold,
                              paddingVertical: 11,
                              borderRadius: 12,
                              alignItems: 'center',
                              justifyContent: 'center',
                            }}
                          >
                            <Text style={{ color: '#000000', fontSize: 12, fontWeight: '800' }}>
                              Mejorar a Plan {selectedRecipe.requiredTier.toUpperCase()}
                            </Text>
                          </Pressable>

                          {reqAds > 0 ? (
                            <Pressable
                              onPress={() => {
                                setAdRecipeTarget(selectedRecipe);
                                setAdModalVisible(true);
                              }}
                              style={{
                                backgroundColor: `${colors.gold}20`,
                                borderColor: colors.gold,
                                borderWidth: 1,
                                paddingVertical: 10,
                                borderRadius: 12,
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 6,
                              }}
                            >
                              <Feather name="video" size={14} color={colors.gold} />
                              <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '700' }}>
                                Ver Anuncio ({curAds}/{reqAds} vistos) · Desbloqueo 7 Días
                              </Text>
                            </Pressable>
                          ) : null}
                        </View>
                      </View>
                    )}

                    <Pressable
                      onPress={closeRecipe}
                      style={[styles.closeBottomButton, { backgroundColor: colors.gold }]}
                    >
                      <Text style={styles.closeBottomButtonText}>Cerrar Receta</Text>
                    </Pressable>
                  </ScrollView>
                );
              })()
            ) : null}
          </View>
        </View>
      </Modal>

      {/* ================= MODAL DE ANUNCIOS PATROCINADOS DYNASTY ================= */}
      <DynastyAdModal
        visible={adModalVisible}
        onClose={() => setAdModalVisible(false)}
        onRewardClaimed={handleAdRewardClaimed}
        title={`Desbloquear ${adRecipeTarget?.title || 'Receta'}`}
        subtitle="Mira este anuncio patrocinado oficial para desbloquear los ingredientes y preparación por 7 días"
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  intro: { fontSize: 20, fontWeight: '700', marginBottom: 4 },
  caption: { fontSize: 12, lineHeight: 18 },
  categoryRow: { gap: 8, paddingVertical: 14 },
  category: {
    borderWidth: 1,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
  },
  membershipNote: {
    borderWidth: 1,
    borderRadius: 14,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 14,
  },
  noteText: { fontSize: 12, fontWeight: '700' },
  recipe: {
    minHeight: 88,
    borderWidth: 1,
    borderRadius: 18,
    padding: 10,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  recipeThumbnail: {
    width: 74,
    height: 74,
    borderRadius: 14,
    backgroundColor: '#222',
  },
  recipeContent: {
    flex: 1,
    justifyContent: 'center',
  },
  recipeTitle: {
    fontSize: 14,
    fontWeight: '700',
    lineHeight: 19,
  },
  recipeMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 3,
  },
  recipeMeta: {
    fontSize: 11,
    fontWeight: '600',
    marginLeft: 3,
  },
  favButton: {
    padding: 8,
  },
  lockBadge: {
    padding: 8,
  },
  detailTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  detailCategoryBadge: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  close: {
    padding: 4,
  },
  detailBanner: {
    width: '100%',
    height: 180,
    borderRadius: 15,
    marginBottom: 14,
    backgroundColor: '#222',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '800',
    lineHeight: 26,
    marginBottom: 4,
  },
  detailMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  time: {
    fontSize: 12,
    fontWeight: '600',
  },
  detailHeading: {
    fontSize: 14,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 8,
  },
  detailLine: {
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 3,
  },
  detailDirections: {
    fontSize: 13,
    lineHeight: 20,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 22,
    maxHeight: '88%',
    borderTopWidth: 1.5,
  },
  detailBadgeContainer: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  closeBottomButton: {
    marginTop: 20,
    marginBottom: 8,
    paddingVertical: 14,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBottomButtonText: {
    color: '#000000',
    fontSize: 13,
    fontWeight: '800',
  },
  heroBannerContainer: {
    width: '100%',
    height: 120,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    position: 'relative',
    backgroundColor: '#1E1A22',
  },
  heroBannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  heroBannerOverlay: {
    ...StyleSheet.absoluteFill,
    backgroundColor: 'rgba(10, 8, 16, 0.65)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    justifyContent: 'flex-end',
  },
  heroBannerTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  heroBannerTagText: {
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1,
  },
  heroBannerSubtitle: {
    color: '#E2E8F0',
    fontSize: 11,
    fontWeight: '500',
    lineHeight: 16,
  },
});