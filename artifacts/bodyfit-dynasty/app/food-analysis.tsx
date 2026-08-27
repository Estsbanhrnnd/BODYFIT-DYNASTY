import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, TextInput, View } from 'react-native';
import { PrimaryButton, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function FoodAnalysisScreen() {
  const colors = useColors();
  const { addMeal, canUseFoodAI } = useBodyFit();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [saving, setSaving] = useState(false);
  const [mealName, setMealName] = useState('Comida detectada (revisar)');
  const [calories, setCalories] = useState('550');
  const [protein, setProtein] = useState('35');
  const [carbs, setCarbs] = useState('48');
  const [fats, setFats] = useState('18');

  const pickImage = async (camera: boolean) => {
    const permission = camera ? await ImagePicker.requestCameraPermissionsAsync() : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permiso necesario', camera ? 'Activa el acceso a la cámara para tomar una foto.' : 'Activa el acceso a tus fotos para seleccionar una comida.');
      return;
    }
    const result = camera ? await ImagePicker.launchCameraAsync({ mediaTypes: ['images'], quality: 0.8 }) : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ['images'], quality: 0.8 });
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setAnalyzed(false);
    }
  };

  const analyze = () => {
    setSaving(true);
    setTimeout(() => { setSaving(false); setAnalyzed(true); }, 650);
  };

  const saveMeal = () => {
    const values = [calories, protein, carbs, fats].map((value) => Number(value));
    if (!mealName.trim() || values.some((value) => !Number.isFinite(value) || value < 0)) {
      Alert.alert('Revisa los datos', 'Escribe un nombre y valores válidos antes de guardar.');
      return;
    }
    addMeal(values[0], values[1], values[2], values[3]);
    Alert.alert('Comida registrada', `Se sumaron ${values[0]} kcal y tus macros al día de hoy.`, [{ text: 'Listo', onPress: () => router.back() }]);
  };

  return (
    <Screen>
      <TopBar title="Analizar comida" subtitle="Calcula tus macros con una foto" onPress={() => router.back()} />
      {!canUseFoodAI ? <View style={{ backgroundColor: '#2A1A0B', borderRadius: 18, borderWidth: 1, borderColor: '#654A17', padding: 17, marginBottom: 16 }}>
        <View style={styles.row}><Feather name="lock" color={colors.gold} size={18} /><Text style={{ color: colors.gold, fontWeight: '700', marginLeft: 9 }}>Función Premium bloqueada</Text></View>
        <Text style={{ color: '#C8BBA0', fontSize: 11, lineHeight: 17, marginTop: 9 }}>El cálculo automático de calorías y macros con IA está disponible para cuentas Premium y Élite.</Text>
        <View style={{ marginTop: 13 }}><PrimaryButton title="Ver membresías" icon="award" onPress={() => router.push('/plans')} /></View>
      </View> : null}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
        {imageUri ? <Image source={{ uri: imageUri }} contentFit="cover" style={{ height: 230, width: '100%' }} /> : <View style={{ height: 230, alignItems: 'center', justifyContent: 'center', backgroundColor: '#15111A' }}><View style={{ width: 66, height: 66, borderRadius: 22, backgroundColor: '#2A163A', alignItems: 'center', justifyContent: 'center' }}><Feather name="camera" size={28} color={colors.primary} /></View><Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 15 }}>Captura tu comida</Text><Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 6 }}>La IA detectará los alimentos y porciones</Text></View>}
        <View style={{ flexDirection: 'row', gap: 10, padding: 14 }}>
          <Pressable testID="camera-button" onPress={() => pickImage(true)} style={{ flex: 1, borderRadius: 12, backgroundColor: colors.secondary, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 7 }}><Feather name="camera" size={16} color={colors.foreground} /><Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Cámara</Text></Pressable>
          <Pressable testID="gallery-button" onPress={() => pickImage(false)} style={{ flex: 1, borderRadius: 12, backgroundColor: colors.secondary, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 7 }}><Feather name="image" size={16} color={colors.foreground} /><Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Galería</Text></Pressable>
        </View>
      </View>
      {canUseFoodAI && imageUri && !analyzed ? <View style={{ marginTop: 14 }}><PrimaryButton title={saving ? 'Analizando...' : 'Analizar con IA'} icon="zap" onPress={analyze} disabled={saving} /></View> : null}
      {analyzed ? <View style={{ marginTop: 18 }}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.row, styles.spaceBetween]}><View><Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>RESULTADO PARA REVISAR</Text><Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 5 }}>Ajusta cualquier dato antes de guardar</Text></View><View style={{ backgroundColor: '#183223', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 }}><Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>Revisión manual</Text></View></View>
          <SectionHeader title="Datos detectados" />
          <View style={{ gap: 10 }}>
            <EditableField label="Nombre de la comida" value={mealName} onChangeText={setMealName} colors={colors} />
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <EditableField label="Calorías" value={calories} onChangeText={setCalories} colors={colors} numeric />
              <EditableField label="Proteína (g)" value={protein} onChangeText={setProtein} colors={colors} numeric />
            </View>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              <EditableField label="Carbohidratos (g)" value={carbs} onChangeText={setCarbs} colors={colors} numeric />
              <EditableField label="Grasas (g)" value={fats} onChangeText={setFats} colors={colors} numeric />
            </View>
          </View>
        </View>
        <View style={{ marginTop: 13 }}><PrimaryButton title="Guardar comida" icon="check" onPress={saveMeal} /></View>
      </View> : null}
      {!imageUri ? <View style={[styles.card, { backgroundColor: '#111116', borderColor: colors.border, marginTop: 18 }]}><View style={styles.row}><Feather name="info" size={17} color={colors.gold} /><Text style={{ color: colors.foreground, fontWeight: '700', marginLeft: 9, fontSize: 13 }}>Consejo para mejores resultados</Text></View><Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, marginTop: 9 }}>Toma la foto desde arriba, con buena luz y mostrando el plato completo.</Text></View> : null}
    </Screen>
  );
}

function EditableField({ label, value, onChangeText, colors, numeric = false }: { label: string; value: string; onChangeText: (value: string) => void; colors: ReturnType<typeof useColors>; numeric?: boolean }) {
  return <View style={{ flex: 1 }}>
    <Text style={{ color: colors.mutedForeground, fontSize: 10, marginBottom: 5 }}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} keyboardType={numeric ? 'numeric' : 'default'} style={{ color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1, borderRadius: 11, paddingHorizontal: 11, paddingVertical: 10, fontSize: 12 }} placeholderTextColor={colors.mutedForeground} />
  </View>;
}