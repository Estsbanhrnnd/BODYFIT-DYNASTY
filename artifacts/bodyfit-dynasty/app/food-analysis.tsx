import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { customFetch } from '@workspace/api-client-react';
import { PrimaryButton, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

type FoodItem = {
  nombre: string;
  gramos_estimados: number;
  calorias: number;
  proteina: number;
  carbohidratos: number;
  grasas: number;
  fibra: number;
  nivel_de_confianza: number;
};

type FoodAnalysisResponse = {
  scanId: string;
  model: string;
  foods: FoodItem[];
  notes: string | null;
};

export default function FoodAnalysisScreen() {
  const colors = useColors();
  const { addMeal, canUseFoodAI } = useBodyFit();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [imageData, setImageData] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [scanId, setScanId] = useState<string | null>(null);
  const [foods, setFoods] = useState<FoodItem[]>([]);
  const [notes, setNotes] = useState<string | null>(null);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<FoodItem | null>(null);
  const [savingCorrection, setSavingCorrection] = useState(false);

  const pickImage = async (camera: boolean) => {
    const permission = camera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Permiso necesario',
        camera
          ? 'Activa el acceso a la cámara para tomar una foto.'
          : 'Activa el acceso a tus fotos para seleccionar una comida.',
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

  const analyze = async () => {
    if (!imageData) {
      Alert.alert('Selecciona una imagen', 'Toma una foto o elige una imagen antes de analizar.');
      return;
    }

    setAnalyzing(true);
    setAnalyzed(false);
    setFoods([]);
    setNotes(null);
    setScanId(null);
    try {
      const result = await customFetch<FoodAnalysisResponse>('/api/food-analysis', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData }),
      });
      setFoods(result.foods);
      setNotes(result.notes);
      setScanId(result.scanId);
      setAnalyzed(true);
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

  const updateDraft = (key: keyof FoodItem, value: string) => {
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
        .some(([, value]) => typeof value !== 'number' || !Number.isFinite(value) || value < 0)
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
      { calories: 0, protein: 0, carbs: 0, fats: 0 },
    );
    addMeal(totals.calories, totals.protein, totals.carbs, totals.fats);
    Alert.alert(
      'Comida registrada',
      `Se sumaron aproximadamente ${Math.round(totals.calories)} kcal y tus macros al día de hoy.`,
      [{ text: 'Listo', onPress: () => router.back() }],
    );
  };

  return (
    <Screen>
      <TopBar title="Analizar comida" subtitle="Revisa alimentos y porciones con una foto" onPress={() => router.back()} />
      {!canUseFoodAI ? (
        <View style={{ backgroundColor: '#2A1A0B', borderRadius: 18, borderWidth: 1, borderColor: '#654A17', padding: 17, marginBottom: 16 }}>
          <View style={styles.row}>
            <Feather name="lock" color={colors.gold} size={18} />
            <Text style={{ color: colors.gold, fontWeight: '700', marginLeft: 9 }}>Función de análisis bloqueada</Text>
          </View>
          <Text style={{ color: '#C8BBA0', fontSize: 11, lineHeight: 17, marginTop: 9 }}>
            El análisis automático de alimentos está disponible según tu membresía.
          </Text>
          <View style={{ marginTop: 13 }}>
            <PrimaryButton title="Ver membresías" icon="award" onPress={() => router.push('/plans')} />
          </View>
        </View>
      ) : null}

      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} contentFit="cover" style={{ height: 230, width: '100%' }} />
        ) : (
          <View style={{ height: 230, alignItems: 'center', justifyContent: 'center', backgroundColor: '#15111A' }}>
            <View style={{ width: 66, height: 66, borderRadius: 22, backgroundColor: '#2A163A', alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="camera" size={28} color={colors.primary} />
            </View>
            <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 15 }}>Captura tu comida</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 6 }}>Solo se mostrarán alimentos visibles</Text>
          </View>
        )}
        <View style={{ flexDirection: 'row', gap: 10, padding: 14 }}>
          <Pressable testID="camera-button" onPress={() => pickImage(true)} style={{ flex: 1, borderRadius: 12, backgroundColor: colors.secondary, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
            <Feather name="camera" size={16} color={colors.foreground} />
            <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Cámara</Text>
          </Pressable>
          <Pressable testID="gallery-button" onPress={() => pickImage(false)} style={{ flex: 1, borderRadius: 12, backgroundColor: colors.secondary, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 7 }}>
            <Feather name="image" size={16} color={colors.foreground} />
            <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Galería</Text>
          </Pressable>
        </View>
      </View>

      {canUseFoodAI && imageData && !analyzed ? (
        <View style={{ marginTop: 14 }}>
          <PrimaryButton title={analyzing ? 'Analizando imagen...' : 'Analizar con IA'} icon="zap" onPress={analyze} disabled={analyzing} />
        </View>
      ) : null}

      {analyzed ? (
        <View style={{ marginTop: 18 }}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={[styles.row, styles.spaceBetween]}>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>RESULTADO PARA REVISAR</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 5 }}>Los gramos y macros son estimaciones. Corrige cada alimento antes de guardar.</Text>
              </View>
              <View style={{ backgroundColor: '#183223', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6, marginLeft: 8 }}>
                <Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>Revisión</Text>
              </View>
            </View>
            {notes ? <Text style={{ color: colors.gold, fontSize: 11, lineHeight: 16, marginTop: 13 }}>{notes}</Text> : null}
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
          </View>
          {foods.length ? <View style={{ marginTop: 13 }}><PrimaryButton title="Guardar comida" icon="check" onPress={saveMeal} /></View> : null}
        </View>
      ) : null}

      {!imageUri ? (
        <View style={[styles.card, { backgroundColor: '#111116', borderColor: colors.border, marginTop: 18 }]}>
          <View style={styles.row}>
            <Feather name="info" size={17} color={colors.gold} />
            <Text style={{ color: colors.foreground, fontWeight: '700', marginLeft: 9, fontSize: 13 }}>Consejo para mejores resultados</Text>
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, marginTop: 9 }}>Toma la foto desde arriba, con buena luz y mostrando el plato completo.</Text>
        </View>
      ) : null}
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
  food: FoodItem;
  index: number;
  editing: boolean;
  draft: FoodItem | null;
  colors: ReturnType<typeof useColors>;
  saving: boolean;
  onEdit: () => void;
  onCancel: () => void;
  onApply: () => void;
  onChange: (key: keyof FoodItem, value: string) => void;
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
            <EditableField label="Fibra (g)" value={String(current.fibra)} onChangeText={(value) => onChange('fibra', value)} colors={colors} numeric />
          </View>
          <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
            <Pressable onPress={onCancel} style={{ flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: colors.card }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700' }}>Cancelar</Text>
            </Pressable>
            <Pressable onPress={onApply} disabled={saving} style={{ flex: 1, borderRadius: 10, paddingVertical: 10, alignItems: 'center', backgroundColor: colors.primary, opacity: saving ? 0.5 : 1 }}>
              <Text style={{ color: colors.primaryForeground, fontSize: 11, fontWeight: '700' }}>{saving ? 'Guardando...' : 'Aplicar corrección'}</Text>
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>{food.nombre}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 5 }}>
                {Math.round(food.gramos_estimados)} g · {Math.round(food.calorias)} kcal · P {Math.round(food.proteina)} g · C {Math.round(food.carbohidratos)} g · G {Math.round(food.grasas)} g · Fibra {Math.round(food.fibra)} g
              </Text>
            </View>
            <Pressable onPress={onEdit} style={{ borderRadius: 9, backgroundColor: '#2A163A', paddingHorizontal: 10, paddingVertical: 7 }}>
              <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '700' }}>Corregir</Text>
            </Pressable>
          </View>
          <Text style={{ color: colors.gold, fontSize: 10, marginTop: 9 }}>Confianza estimada: {confidenceLabel(food.nivel_de_confianza)}</Text>
        </>
      )}
      {!editing && index === 0 ? <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 8 }}>Puedes ajustar gramos y todos los macros desde “Corregir”.</Text> : null}
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
        style={{ color: colors.foreground, backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 10, fontSize: 12 }}
        placeholderTextColor={colors.mutedForeground}
      />
    </View>
  );
}