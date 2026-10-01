import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { customFetch } from '@workspace/api-client-react';
import { PrimaryButton, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit, type ScannedFoodHistoryItem, type ScannedFoodItem } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

type FoodAnalysisResponse = {
  scanId: string;
  model: string;
  foods: ScannedFoodItem[];
  notes: string | null;
};

export default function FoodAnalysisScreen() {
  const colors = useColors();
  const {
    addMeal,
    canUseFoodAI,
    membership,
    membershipLabel,
    foodScanLimits,
    consumeFoodScan,
    watchAdForExtraScan,
    foodScansHistory,
    saveScanToHistory,
    repeatScanMeal,
  } = useBodyFit();

  const [activeTab, setActiveTab] = useState<'escanear' | 'historial'>('escanear');

  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [foods, setFoods] = useState<ScannedFoodItem[]>([]);
  const [notes, setNotes] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<ScannedFoodItem | null>(null);
  const [savingCorrection, setSavingCorrection] = useState(false);

  // Simulación de visualización de anuncio
  const [watchingAd, setWatchingAd] = useState(false);

  const isGolden = membership === 'golden';

  const pickImage = async (camera: boolean) => {
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        camera
          ? 'Activa el acceso a la cámara para tomar una foto.'
          : 'Activa el acceso a tus fotos para seleccionar una comida.'
      );
      return;
    }

    const result = camera
      ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8, base64: true })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8, base64: true });
    if (result.canceled) return;

    const asset = result.assets[0];
    if (!asset.base64) {
      Alert.alert('No se pudo leer la imagen', 'Selecciona otra imagen e inténtalo de nuevo.');
      return;
    }

    const mimeType = asset.mimeType ?? 'image/jpeg';
    const dataUrl = asset.base64.startsWith('data:')
      ? asset.base64
      : `data:${mimeType};base64,${asset.base64}`;
    setImageUri(asset.uri);
    setImageData(dataUrl);
    setAnalyzed(false);
    setScanId(null);
    setFoods([]);
    setNotes(null);
    setEditingIndex(null);
    setDraft(null);
  };

  const handleSimulateWatchAd = async () => {
    setWatchingAd(true);
    setTimeout(async () => {
      setWatchingAd(false);
      const res = await watchAdForExtraScan();
      if (res.unlocked) {
        Alert.alert(
          '🎉 ¡Escaneo Extra Desbloqueado!',
          `Has completado los 3 anuncios. Ahora tienes un escaneo adicional disponible hoy (Extras hoy: ${res.extraScans}/3).`
        );
      } else {
        Alert.alert(
          'Anuncio Completado',
          `Progreso guardado: ${res.progress} de 3 anuncios vistos para tu próximo escaneo extra.`
        );
      }
    }, 2200);
  };

  const analyze = async () => {
    if (!imageData) {
      Alert.alert('Selecciona una imagen', 'Toma una foto o elige una imagen antes de analizar.');
      return;
    }

    if (!foodScanLimits.canScan) {
      if (foodScanLimits.canWatchAdForExtra) {
        Alert.alert(
          'Límite diario alcanzado',
          'Has utilizado tus escaneos gratuitos de hoy. Puedes ver 3 anuncios para desbloquear un escaneo extra o mejorar tu membresía.',
          [
            { text: 'Ver anuncio', onPress: handleSimulateWatchAd },
            { text: 'Ver Planes', onPress: () => router.push('/plans') },
            { text: 'Cancelar', style: 'cancel' },
          ]
        );
      } else {
        Alert.alert(
          'Límite de escaneos alcanzado',
          'Has completado todos tus escaneos permitidos hoy. Vuelve mañana o mejora a Golden VIP para escaneos ilimitados.',
          [
            { text: 'Ver Planes', onPress: () => router.push('/plans') },
            { text: 'Entendido', style: 'cancel' },
          ]
        );
      }
      return;
    }

    setAnalyzing(true);
    setAnalyzed(false);
    setFoods([]);
    setNotes(null);
    setScanId(null);

    try {
      // Consumir cupo de escaneo
      await consumeFoodScan();

      const result = await customFetch<FoodAnalysisResponse>('/api/food-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData }),
      });

      setFoods(result.foods);
      setNotes(result.notes);
      setScanId(result.scanId);
      setAnalyzed(true);

      // Guardar automáticamente en el historial de escaneos
      const totals = result.foods.reduce(
        (sum, food) => ({
          calories: sum.calories + food.calorias,
          protein: sum.protein + food.proteina,
          carbs: sum.carbs + food.carbohidratos,
          fats: sum.fats + food.grasas,
        }),
        { calories: 0, protein: 0, carbs: 0, fats: 0 }
      );

      await saveScanToHistory({
        imageUrl: imageUri ?? undefined,
        foods: result.foods,
        totals,
        notes: result.notes,
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Inténtalo de nuevo con otra imagen.';
      Alert.alert('No se pudo analizar', message);
    } finally {
      setAnalyzing(false);
    }
  };

  const startCorrection = (index: number) => {
    setEditingIndex(index);
    setDraft({ ...foods[index] });
  };

  const cancelCorrection = () => {
    setEditingIndex(null);
    setDraft(null);
  };

  const updateDraft = (key: keyof ScannedFoodItem, value: string) => {
    if (!draft) return;
    setDraft({
      ...draft,
      [key]: key === 'nombre' ? value : Number(value),
    });
  };

  const applyCorrection = async () => {
    if (editingIndex === null || !draft || !scanId) return;
    if (
      !draft.nombre.trim() ||
      Object.entries(draft)
        .filter(([key]) => key !== 'nombre')
        .some(([, value]) => typeof value !== 'number' || !Number.isFinite(value) || (value as number) < 0)
    ) {
      Alert.alert('Revisa los datos', 'Completa el nombre y usa valores numéricos iguales o mayores que cero.');
      return;
    }

    setSavingCorrection(true);
    try {
      await customFetch(`/api/food-analysis/${scanId}/corrections`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ foodIndex: editingIndex, afterFood: draft }),
      });
      setFoods((current) => current.map((food, index) => (index === editingIndex ? draft : food)));
      cancelCorrection();
    } catch (error) {
      const message = error instanceof Error ? error.message : 'No se pudo guardar la corrección.';
      Alert.alert('Corrección no guardada', message);
    } finally {
      setSavingCorrection(false);
    }
  };

  const saveMeal = () => {
    if (foods.length === 0) {
      Alert.alert('Sin alimentos identificados', 'Corrige o registra manualmente la comida antes de guardarla.');
      return;
    }
    const totals = foods.reduce(
      (sum, food) => ({
        calories: sum.calories + food.calorias,
        protein: sum.protein + food.proteina,
        carbs: sum.carbs + food.carbohidratos,
        fats: sum.fats + food.grasas,
      }),
      { calories: 0, protein: 0, carbs: 0, fats: 0 }
    );
    addMeal(totals.calories, totals.protein, totals.carbs, totals.fats);
    Alert.alert(
      '¡Comida Registrada!',
      `Se sumaron aproximadamente ${Math.round(totals.calories)} kcal y tus macros al balance de hoy.\n\n💡 Consejo Head Coach (Fin de Día):\nAl completar tus calorías de hoy, recuerda recortar calorías y azúcares en la cena para optimizar la pérdida de grasa, pero mantén intacta la proteína (100%) para proteger tu masa muscular.`,
      [{ text: 'Entendido Coach', onPress: () => router.back() }]
    );
  };

  const handleRepeatMeal = (item: ScannedFoodHistoryItem) => {
    repeatScanMeal(item);
    Alert.alert(
      '¡Comida Sumada a Hoy!',
      `Se registraron ${Math.round(item.totals.calories)} kcal y los macros correspondientes a tu día actual.`
    );
  };

  return (
    <Screen>
      <TopBar title="Food Scanner AI" subtitle="Análisis nutricional visual con Inteligencia Artificial" onPress={() => router.back()} />

      {/* Selector de Pestañas: Escanear vs Historial */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 5, marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row' }}>
          {(['escanear', 'historial'] as const).map((tab) => {
            const isTabActive = activeTab === tab;
            const label = tab === 'escanear' ? 'Escanear Comida' : `Historial (${foodScansHistory.length})`;
            return (
              <Pressable
                key={tab}
                onPress={() => setActiveTab(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: isTabActive ? colors.primary : 'transparent',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: isTabActive ? colors.primaryForeground : colors.mutedForeground,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {label}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Pestaña: ESCANEAR COMIDA */}
      {activeTab === 'escanear' ? (
        <>
          {/* Tarjeta de Cuota Diaria y Membresía */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: isGolden ? '#1F1728' : colors.card,
                borderColor: isGolden ? colors.gold : colors.border,
                borderWidth: 1.5,
                padding: 14,
                marginBottom: 14,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: isGolden ? `${colors.gold}25` : `${colors.primary}25`, padding: 7, borderRadius: 10 }}>
                  <Feather name="zap" size={16} color={isGolden ? colors.gold : colors.primary} />
                </View>
                <View>
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '800' }}>
                    Plan {membershipLabel}
                  </Text>
                  <Text style={{ color: isGolden ? colors.gold : colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
                    {isGolden
                      ? 'Escaneos Ilimitados VIP'
                      : `Escaneos disponibles hoy: ${foodScanLimits.remainingScans} de ${foodScanLimits.totalAllowedToday}`}
                  </Text>
                </View>
              </View>

              <View
                style={{
                  backgroundColor: foodScanLimits.canScan ? `${colors.primary}25` : `${colors.gold}25`,
                  paddingHorizontal: 9,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    color: foodScanLimits.canScan ? colors.primary : colors.gold,
                    fontSize: 11,
                    fontWeight: '800',
                  }}
                >
                  {isGolden
                    ? 'ILIMITADO'
                    : foodScanLimits.canScan
                    ? `${foodScanLimits.remainingScans} RESTANTES`
                    : 'AGOTADOS'}
                </Text>
              </View>
            </View>

            {/* Banner interactivo de escaneos extras con anuncios cuando se agotan los gratuitos */}
            {!isGolden && foodScanLimits.remainingScans === 0 && foodScanLimits.canWatchAdForExtra ? (
              <View
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTopWidth: 1,
                  borderTopColor: colors.border,
                }}
              >
                <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '700', marginBottom: 4 }}>
                  📺 Desbloquea 1 escaneo extra viendo anuncios
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 16, marginBottom: 10 }}>
                  Progreso actual: {foodScanLimits.adProgress} de 3 anuncios vistos. (Extras hoy: {foodScanLimits.extraAdScans}/3).
                </Text>

                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <Pressable
                    onPress={handleSimulateWatchAd}
                    disabled={watchingAd}
                    style={{
                      flex: 1,
                      backgroundColor: colors.gold,
                      paddingVertical: 9,
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Feather name="play-circle" size={14} color="#000000" />
                    <Text style={{ color: '#000000', fontSize: 12, fontWeight: '800' }}>
                      {watchingAd ? 'Viendo anuncio...' : `Ver anuncio (${foodScanLimits.adProgress}/3)`}
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => router.push('/plans')}
                    style={{
                      backgroundColor: `${colors.primary}20`,
                      borderColor: colors.primary,
                      borderWidth: 1,
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      borderRadius: 10,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>Mejorar Plan</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}
          </View>

          {/* Tarjeta de Captura / Selección de Foto */}
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
            {imageUri ? (
              <Image source={{ uri: imageUri }} contentFit="cover" style={{ height: 230, width: '100%' }} />
            ) : (
              <View style={{ height: 230, alignItems: 'center', justifyContent: 'center', backgroundColor: '#15111A' }}>
                <View style={{ width: 66, height: 66, borderRadius: 22, backgroundColor: '#2A163A', alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="camera" size={28} color={colors.primary} />
                </View>
                <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 15 }}>Captura tu comida</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 6 }}>
                  Asegúrate de mostrar los alimentos claramente iluminados
                </Text>
              </View>
            )}
            <View style={{ flexDirection: 'row', gap: 10, padding: 14 }}>
              <Pressable
                testID="camera-button"
                onPress={() => pickImage(true)}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  backgroundColor: colors.secondary,
                  paddingVertical: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 7,
                }}
              >
                <Feather name="camera" size={16} color={colors.foreground} />
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Cámara</Text>
              </Pressable>
              <Pressable
                testID="gallery-button"
                onPress={() => pickImage(false)}
                style={{
                  flex: 1,
                  borderRadius: 12,
                  backgroundColor: colors.secondary,
                  paddingVertical: 12,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 7,
                }}
              >
                <Feather name="image" size={16} color={colors.foreground} />
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Galería</Text>
              </Pressable>
            </View>
          </View>

          {/* Botón Analizar con IA */}
          {imageData && !analyzed ? (
            <View style={{ marginTop: 14 }}>
              <PrimaryButton
                title={analyzing ? 'Analizando con IA...' : 'Analizar Platillo'}
                icon="zap"
                onPress={analyze}
                disabled={analyzing}
              />
            </View>
          ) : null}

          {/* Resultados del Análisis */}
          {analyzed ? (
            <View style={{ marginTop: 18 }}>
              <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
                <View style={[styles.row, styles.spaceBetween]}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>
                      RESULTADO ANALIZADO
                    </Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>
                      Revisa porciones y macros estimados antes de confirmar.
                    </Text>
                  </View>
                  <View style={{ backgroundColor: '#183223', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 5, marginLeft: 8 }}>
                    <Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>Completado</Text>
                  </View>
                </View>

                {notes ? <Text style={{ color: colors.gold, fontSize: 11, lineHeight: 16, marginTop: 10 }}>{notes}</Text> : null}

                <SectionHeader title={foods.length ? 'Alimentos detectados' : 'No se identificaron alimentos'} />
                <View style={{ gap: 10 }}>
                  {foods.map((food, index) => (
                    <FoodCard
                      key={`${scanId}-${index}`}
                      food={food}
                      index={index}
                      editing={editingIndex === index}
                      draft={editingIndex === index ? draft : null}
                      colors={colors}
                      saving={savingCorrection}
                      onEdit={() => startCorrection(index)}
                      onCancel={cancelCorrection}
                      onApply={applyCorrection}
                      onChange={updateDraft}
                    />
                  ))}
                </View>

                {/* Recomendación de Fin de Día (Head Coach Esteban) */}
                <View
                  style={{
                    marginTop: 14,
                    backgroundColor: '#1C1226',
                    borderColor: '#D4AF3770',
                    borderWidth: 1.2,
                    borderRadius: 14,
                    padding: 13,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                    <View style={{ backgroundColor: '#D4AF3725', padding: 6, borderRadius: 8 }}>
                      <Feather name="moon" size={15} color="#FFD700" />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: '#FFD700', fontSize: 11.5, fontWeight: '800' }}>
                        RECOMENDACIÓN NUTRICIONAL FIN DE DÍA
                      </Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 9.5 }}>
                        Pauta Dynasty para corte, saciedad y composición corporal
                      </Text>
                    </View>
                  </View>

                  <View style={{ gap: 6 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                      <Text style={{ color: '#FFD700', fontSize: 11, fontWeight: '700' }}>•</Text>
                      <Text style={{ color: colors.foreground, fontSize: 11, flex: 1, lineHeight: 16 }}>
                        <Text style={{ fontWeight: '700', color: '#FFD700' }}>Disminución de calorías y azúcares:</Text> Si estás cerrando tu día o cenando, recorta carbohidratos simples, salsas y azúcares para favorecer la quema de grasa y evitar picos de insulina previos al sueño.
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
                      <Text style={{ color: '#2ED573', fontSize: 11, fontWeight: '700' }}>•</Text>
                      <Text style={{ color: colors.foreground, fontSize: 11, flex: 1, lineHeight: 16 }}>
                        <Text style={{ fontWeight: '800', color: '#2ED573' }}>¡La proteína NO se disminuye (100% Sagrada)!</Text> Es el macronutriente innegociable que debes cumplir siempre en tu meta diaria para reparar fibras musculares, evitar el catabolismo nocturno y sostener la tasa metabólica.
                      </Text>
                    </View>
                  </View>
                </View>
              </View>

              {foods.length ? (
                <View style={{ marginTop: 13, marginBottom: 20 }}>
                  <PrimaryButton title="Guardar comida en mi progreso" icon="check" onPress={saveMeal} />
                </View>
              ) : null}
            </View>
          ) : null}

          {!imageUri ? (
            <View style={[styles.card, { backgroundColor: '#111116', borderColor: colors.border, marginTop: 18 }]}>
              <View style={styles.row}>
                <Feather name="info" size={17} color={colors.gold} />
                <Text style={{ color: colors.foreground, fontWeight: '700', marginLeft: 9, fontSize: 13 }}>
                  Consejo de precisión Dynasty
                </Text>
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, marginTop: 8 }}>
                Toma la foto desde un ángulo cenital (arriba), con buena luz natural o artificial y sin obstrucciones para una estimación milimétrica de macros.
              </Text>
            </View>
          ) : null}
        </>
      ) : (
        /* Pestaña: HISTORIAL VISUAL DE ESCANEOS */
        <View style={{ marginTop: 4 }}>
          <SectionHeader title={`Comidas Escaneadas (${foodScansHistory.length})`} />

          {foodScansHistory.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 40 }]}>
              <Feather name="camera" size={38} color={colors.mutedForeground} />
              <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 15, marginTop: 12 }}>
                Sin escaneos registrados aún
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 4, textAlign: 'center', paddingHorizontal: 24, lineHeight: 18 }}>
                Toma una foto de tu plato con la cámara o súbela desde tu galería para que aparezca aquí tu historial con macros y fotos.
              </Text>
              <Pressable
                onPress={() => setActiveTab('escanear')}
                style={{
                  marginTop: 16,
                  backgroundColor: colors.primary,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 12,
                }}
              >
                <Text style={{ color: colors.primaryForeground, fontSize: 12, fontWeight: '800' }}>
                  Escanear mi primera comida
                </Text>
              </Pressable>
            </View>
          ) : (
            foodScansHistory.map((item, idx) => (
              <View
                key={item.id || idx}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    marginBottom: 12,
                    padding: 12,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  {item.imageUrl ? (
                    <View style={{ width: 68, height: 68, borderRadius: 12, overflow: 'hidden', backgroundColor: colors.border }}>
                      <Image source={{ uri: item.imageUrl }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
                    </View>
                  ) : (
                    <View style={{ width: 68, height: 68, borderRadius: 12, backgroundColor: `${colors.primary}25`, alignItems: 'center', justifyContent: 'center' }}>
                      <Feather name="pie-chart" size={24} color={colors.primary} />
                    </View>
                  )}

                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: colors.mutedForeground, fontSize: 10, fontWeight: '700' }}>
                        {new Date(item.timestamp).toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' })}
                      </Text>
                      <View style={{ backgroundColor: `${colors.primary}22`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                        <Text style={{ color: colors.primary, fontSize: 9, fontWeight: '800' }}>
                          {item.foods.length} ALIMENTOS
                        </Text>
                      </View>
                    </View>

                    <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700', marginTop: 3 }} numberOfLines={1}>
                      {item.foods.map((f) => f.nombre).join(', ')}
                    </Text>

                    {/* Fila de Macros Totales */}
                    <View style={{ flexDirection: 'row', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
                      <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
                        🔥 {Math.round(item.totals.calories)} kcal
                      </Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
                        🥩 {Math.round(item.totals.protein)}g P
                      </Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
                        🌾 {Math.round(item.totals.carbs)}g C
                      </Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
                        🥑 {Math.round(item.totals.fats)}g G
                      </Text>
                    </View>
                  </View>
                </View>

                {/* Botón para volver a sumar a hoy */}
                <Pressable
                  onPress={() => handleRepeatMeal(item)}
                  style={{
                    marginTop: 10,
                    paddingTop: 8,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Feather name="plus-circle" size={13} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '800' }}>
                    Volver a sumar a hoy
                  </Text>
                </Pressable>
              </View>
            ))
          )}
        </View>
      )}

      {/* Modal simulador de anuncio */}
      <Modal visible={watchingAd} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
          <View style={{ width: 64, height: 64, borderRadius: 20, backgroundColor: `${colors.gold}25`, alignItems: 'center', justifyContent: 'center', marginBottom: 16 }}>
            <Feather name="video" size={30} color={colors.gold} />
          </View>
          <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '800', marginBottom: 8, textAlign: 'center' }}>
            Reproduciendo anuncio patrocinado...
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, textAlign: 'center', marginBottom: 20 }}>
            Por favor espera unos segundos para desbloquear tu escaneo adicional.
          </Text>
          <ActivityIndicator size="large" color={colors.gold} />
        </View>
      </Modal>
    </Screen>
  );
}

function FoodCard({
  food,
  index,
  editing,
  draft,
  colors,
  saving,
  onEdit,
  onCancel,
  onApply,
  onChange,
}: {
  food: ScannedFoodItem;
  index: number;
  editing: boolean;
  draft: ScannedFoodItem | null;
  colors: ReturnType<typeof useColors>;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onApply: () => void;
  onChange: (key: keyof ScannedFoodItem, value: string) => void;
}) {
  const current = editing && draft ? draft : food;
  return (
    <View style={{ backgroundColor: colors.secondary, borderRadius: 13, borderWidth: 1, borderColor: colors.border, padding: 12 }}>
      {editing ? (
        <>
          <EditableField label="Nombre" value={current.nombre} onChangeText={(value) => onChange('nombre', value)} colors={colors} />
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
            <EditableField label="Gramos" value={String(current.gramos_estimados)} onChangeText={(value) => onChange('gramos_estimados', value)} colors={colors} numeric />
            <EditableField label="Calorías" value={String(current.calorias)} onChangeText={(value) => onChange('calorias', value)} colors={colors} numeric />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
            <EditableField label="Proteína (g)" value={String(current.proteina)} onChangeText={(value) => onChange('proteina', value)} colors={colors} numeric />
            <EditableField label="Carbohidratos (g)" value={String(current.carbohidratos)} onChangeText={(value) => onChange('carbohidratos', value)} colors={colors} numeric />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 9 }}>
            <EditableField label="Grasas (g)" value={String(current.grasas)} onChangeText={(value) => onChange('grasas', value)} colors={colors} numeric />
            <EditableField label="Fibra (g)" value={String(current.fibra || 0)} onChangeText={(value) => onChange('fibra', value)} colors={colors} numeric />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Pressable onPress={onCancel} style={{ flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: colors.card }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700' }}>Cancelar</Text>
            </Pressable>
            <Pressable
              onPress={onApply}
              disabled={saving}
              style={{
                flex: 1,
                borderRadius: 10,
                paddingVertical: 10,
                alignItems: 'center',
                backgroundColor: colors.primary,
                opacity: saving ? 0.5 : 1,
              }}
            >
              <Text style={{ color: colors.primaryForeground, fontSize: 11, fontWeight: '700' }}>
                {saving ? 'Guardando...' : 'Aplicar corrección'}
              </Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>{food.nombre}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 5 }}>
                {Math.round(food.gramos_estimados)} g · {Math.round(food.calorias)} kcal · P {Math.round(food.proteina)} g · C {Math.round(food.carbohidratos)} g · G {Math.round(food.grasas)} g
              </Text>
            </View>
            <Pressable onPress={onEdit} style={{ borderRadius: 9, backgroundColor: '#2A163A', paddingHorizontal: 10, paddingVertical: 7 }}>
              <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '700' }}>Corregir</Text>
            </Pressable>
          </View>
          {food.nivel_de_confianza !== undefined ? (
            <Text style={{ color: colors.gold, fontSize: 10, marginTop: 9 }}>
              Confianza estimada: {confidenceLabel(food.nivel_de_confianza)}
            </Text>
          ) : null}
        </>
      )}
    </View>
  );
}

function confidenceLabel(value: number) {
  if (value >= 0.75) return 'alta';
  if (value >= 0.45) return 'media';
  return 'baja';
}

function EditableField({
  label,
  value,
  onChangeText,
  colors,
  numeric = false,
}: {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  colors: ReturnType<typeof useColors>;
  numeric?: boolean;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text style={{ color: colors.mutedForeground, fontSize: 10, marginBottom: 5 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        keyboardType={numeric ? 'numeric' : 'default'}
        style={{
          color: colors.foreground,
          backgroundColor: colors.card,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 11,
          paddingHorizontal: 11,
          paddingVertical: 10,
          fontSize: 12,
        }}
        placeholderTextColor={colors.mutedForeground}
      />
    </View>
  );
}