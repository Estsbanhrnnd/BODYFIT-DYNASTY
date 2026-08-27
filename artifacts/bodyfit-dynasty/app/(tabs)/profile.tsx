import { Feather } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Platform, Pressable, Switch, Text, View } from 'react-native';
import { BrandMark, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

const menu = [
  { icon: 'edit-3' as const, label: 'Editar perfil' },
  { icon: 'bar-chart-2' as const, label: 'Mis estadísticas' },
  { icon: 'bell' as const, label: 'Notificaciones' },
  { icon: 'settings' as const, label: 'Configuración' },
];

export default function ProfileScreen() {
  const colors = useColors();
  const { isOwner, previewClientFree, setPreviewClientFree, stats, setSteps } = useBodyFit();
  const [healthConnected, setHealthConnected] = useState(false);
  const [syncingHealth, setSyncingHealth] = useState(false);

  const connectHealth = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Disponible en iPhone', 'La sincronización de pasos se activa al abrir la app en un iPhone.');
      return;
    }
    setSyncingHealth(true);
    try {
      const available = await Pedometer.isAvailableAsync();
      if (!available) {
        Alert.alert('No disponible', 'Este dispositivo no ofrece acceso al contador de pasos.');
        return;
      }
      const permission = await Pedometer.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso necesario', 'Permite el acceso a actividad para leer tus pasos.');
        return;
      }
      const end = new Date();
      const start = new Date(end);
      start.setHours(0, 0, 0, 0);
      const result = await Pedometer.getStepCountAsync(start, end);
      setSteps(result.steps);
      setHealthConnected(true);
    } catch {
      Alert.alert('No se pudo sincronizar', 'Intenta de nuevo desde un iPhone con permisos de actividad activados.');
    } finally {
      setSyncingHealth(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Perfil" subtitle="Tu espacio personal" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 24 }]}>
        <View style={{ width: 78, height: 78, borderRadius: 39, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.gold }}><Feather name="user" size={33} color="#FFFFFF" /></View>
        <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '700', marginTop: 13 }}>Esteban Hernández</Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>Miembro desde enero 2026</Text>
        <View style={{ flexDirection: 'row', gap: 32, marginTop: 20 }}>
          {[['12', 'Racha'], ['28', 'Entrenos'], ['45', 'Logros']].map(([value, label]) => <View key={label} style={{ alignItems: 'center' }}><Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '700' }}>{value}</Text><Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4 }}>{label}</Text></View>)}
        </View>
      </View>
      <SectionHeader title="Tu membresía" />
      <Pressable onPress={() => router.push('/plans')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: '#2A1A0B', borderRadius: 19, padding: 17, borderWidth: 1, borderColor: '#654A17' }}>
          <View style={[styles.row, styles.spaceBetween]}><View style={styles.row}><View style={{ width: 36, height: 36, backgroundColor: colors.gold, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}><Feather name="award" color={colors.accentForeground} size={18} /></View><View style={{ marginLeft: 11 }}><Text style={{ color: colors.gold, fontWeight: '700', fontSize: 10, letterSpacing: 1 }}>PLAN ACTUAL</Text><Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '700', marginTop: 3 }}>{isOwner && !previewClientFree ? 'Premium · Entrenador' : 'Gratis · Cliente'}</Text></View></View><Feather name="chevron-right" color={colors.gold} size={18} /></View>
          <Text style={{ color: '#C8BBA0', fontSize: 11, marginTop: 14 }}>{isOwner && !previewClientFree ? 'Tu cuenta de entrenador tiene acceso completo.' : 'El cálculo de comida IA y ejercicios extra requieren Premium.'}</Text>
        </View>
      </Pressable>
      {isOwner ? <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 12, paddingVertical: 12 }]}>
        <View style={[styles.row, styles.spaceBetween]}><View style={{ flex: 1, paddingRight: 12 }}><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Previsualizar plan Gratis</Text><Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4 }}>Comprueba cómo verá la app un cliente sin suscripción.</Text></View><Switch testID="preview-free-switch" value={previewClientFree} onValueChange={setPreviewClientFree} trackColor={{ false: colors.muted, true: colors.primary }} thumbColor={colors.foreground} /></View>
      </View> : null}
      <SectionHeader title="Cuenta" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, paddingVertical: 4 }]}>
        {menu.map((item, index) => <Pressable key={item.label} onPress={() => undefined} style={[styles.row, { paddingVertical: 14, borderBottomWidth: index === menu.length - 1 ? 0 : 1, borderBottomColor: colors.border }]}><Feather name={item.icon} size={17} color={colors.mutedForeground} /><Text style={{ color: colors.foreground, fontSize: 13, flex: 1, marginLeft: 13 }}>{item.label}</Text><Feather name="chevron-right" size={16} color={colors.mutedForeground} /></Pressable>)}
      </View>
      <SectionHeader title="Conectividad" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable testID="connect-health-button" onPress={connectHealth} style={styles.row}><View style={{ width: 35, height: 35, borderRadius: 11, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' }}><Feather name="heart" size={16} color={colors.destructive} /></View><View style={{ flex: 1, marginLeft: 11 }}><Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 13 }}>Apple Health</Text><Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 3 }}>{healthConnected ? `${stats.steps.toLocaleString()} pasos sincronizados` : 'Pasos y actividad del iPhone'}</Text></View><Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700' }}>{syncingHealth ? 'Leyendo...' : healthConnected ? 'Conectado' : 'Conectar'}</Text></Pressable>
        <Text style={{ color: colors.mutedForeground, fontSize: 10, lineHeight: 15, marginTop: 12 }}>Los datos compartidos con Apple Salud pueden incluir actividad del Apple Watch cuando Salud los consolida. La lectura completa de HealthKit se habilitará en el build nativo de iOS.</Text>
      </View>
      <View style={{ alignItems: 'center', marginTop: 25, paddingBottom: 12 }}><BrandMark size={32} /><Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 8 }}>BodyFit Dynasty® · v1.0</Text></View>
    </Screen>
  );
}