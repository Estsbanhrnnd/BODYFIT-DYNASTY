import { Feather } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { PrimaryButton, Screen, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function FoodAnalysisScreen() {
  const colors = useColors();
  const { addMeal } = useBodyFit();
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [analyzed, setAnalyzed] = useState(false);
  const [saving, setSaving] = useState(false);

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
    addMeal(550, 35, 48, 18);
    Alert.alert('Comida registrada', 'Se sumaron 550 kcal y tus macros al día de hoy.', [{ text: 'Listo', onPress: () => router.back() }]);
  };

  return (
    <Screen>
      <TopBar title="Analizar comida" subtitle="Calcula tus macros con una foto" onPress={() => router.back()} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
        {imageUri ? <Image source={{ uri: imageUri }} contentFit="cover" style={{ height: 230, width: '100%' }} /> : <View style={{ height: 230, alignItems: 'center', justifyContent: 'center', backgroundColor: '#15111A' }}><View style={{ width: 66, height: 66, borderRadius: 22, backgroundColor: '#2A163A', alignItems: 'center', justifyContent: 'center' }}><Feather name="camera" size={28} color={colors.primary} /></View><Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 15 }}>Captura tu comida</Text><Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 6 }}>La IA detectará los alimentos y porciones</Text></View>}
        <View style={{ flexDirection: 'row', gap: 10, padding: 14 }}>
          <Pressable testID="camera-button" onPress={() => pickImage(true)} style={{ flex: 1, borderRadius: 12, backgroundColor: colors.secondary, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 7 }}><Feather name="camera" size={16} color={colors.foreground} /><Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Cámara</Text></Pressable>
          <Pressable testID="gallery-button" onPress={() => pickImage(false)} style={{ flex: 1, borderRadius: 12, backgroundColor: colors.secondary, paddingVertical: 12, alignItems: 'center', flexDirection: 'row', justifyContent: 'center', gap: 7 }}><Feather name="image" size={16} color={colors.foreground} /><Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Galería</Text></Pressable>
        </View>
      </View>
      {imageUri && !analyzed ? <View style={{ marginTop: 14 }}><PrimaryButton title={saving ? 'Analizando...' : 'Analizar con IA'} icon="zap" onPress={analyze} disabled={saving} /></View> : null}
      {analyzed ? <View style={{ marginTop: 18 }}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
          <View style={[styles.row, styles.spaceBetween]}><View><Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>RESULTADO DE IA</Text><Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '700', marginTop: 6 }}>Bowl de pollo</Text></View><View style={{ backgroundColor: '#183223', borderRadius: 10, paddingHorizontal: 9, paddingVertical: 6 }}><Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>94% preciso</Text></View></View>
          <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 8 }}>Pollo a la plancha, aguacate, camote y vegetales</Text>
          <View style={{ flexDirection: 'row', gap: 9, marginTop: 20 }}>{[['550', 'kcal', colors.primary], ['35g', 'proteína', colors.primary], ['48g', 'carbos', colors.green], ['18g', 'grasas', colors.gold]].map(([value, label, color]) => <View key={label as string} style={{ flex: 1, backgroundColor: colors.secondary, borderRadius: 12, paddingVertical: 11, alignItems: 'center' }}><Text style={{ color: color as string, fontSize: 16, fontWeight: '700' }}>{value}</Text><Text style={{ color: colors.mutedForeground, fontSize: 9, marginTop: 4 }}>{label}</Text></View>)}</View>
        </View>
        <View style={{ marginTop: 13 }}><PrimaryButton title="Guardar comida" icon="check" onPress={saveMeal} /></View>
      </View> : null}
      {!imageUri ? <View style={[styles.card, { backgroundColor: '#111116', borderColor: colors.border, marginTop: 18 }]}><View style={styles.row}><Feather name="info" size={17} color={colors.gold} /><Text style={{ color: colors.foreground, fontWeight: '700', marginLeft: 9, fontSize: 13 }}>Consejo para mejores resultados</Text></View><Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, marginTop: 9 }}>Toma la foto desde arriba, con buena luz y mostrando el plato completo.</Text></View> : null}
    </Screen>
  );
}