import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { GradientCard, images, MetricCard, MiniChart, PrimaryButton, ProgressBar, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function DashboardScreen() {
  const colors = useColors();
  const { stats, addWater } = useBodyFit();

  return (
    <Screen>
      <TopBar title="Hola, Esteban" subtitle="Miércoles, 26 de agosto" />
      <GradientCard colors={[colors.primary, colors.purpleBright]}>
        <View style={[styles.row, styles.spaceBetween]}>
          <View>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '600' }}>Tu consistencia habla</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '700', marginTop: 5 }}>{stats.streak} días</Text>
            <Text style={{ color: '#E8C8FF', fontSize: 12, marginTop: 3 }}>de racha activa</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <View style={{ width: 86, height: 86, borderRadius: 43, borderWidth: 8, borderColor: '#FFFFFF55', borderTopColor: '#FFFFFF', transform: [{ rotate: '-35deg' }], alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#FFFFFF', fontSize: 18, fontWeight: '700', transform: [{ rotate: '35deg' }] }}>48%</Text>
            </View>
          </View>
        </View>
      </GradientCard>

      <SectionHeader title="Resumen de hoy" action="Editar objetivos" onPress={() => router.push('/profile')} />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <MetricCard icon="activity" label="Calorías" value={`${stats.calories}`} goal={`/ ${stats.calorieGoal} kcal`} color={colors.primary} />
        <MetricCard icon="droplet" label="Agua" value={`${stats.water.toFixed(1)} L`} goal={`/ ${stats.waterGoal} L`} color={colors.blue} />
        <MetricCard icon="navigation" label="Pasos" value={`${(stats.steps / 1000).toFixed(1)}k`} goal="objetivo 10k" color={colors.gold} />
      </View>

      <SectionHeader title="Macros de hoy" action="Ver detalle" onPress={() => router.push('/food-analysis')} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.row, styles.spaceBetween, { marginBottom: 12 }]}>
          <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Distribución nutricional</Text>
          <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>{stats.calories} kcal</Text>
        </View>
        {[
          { label: 'Proteína', value: stats.protein, goal: stats.proteinGoal, color: colors.primary },
          { label: 'Carbohidratos', value: stats.carbs, goal: stats.carbsGoal, color: colors.green },
          { label: 'Grasas', value: stats.fats, goal: stats.fatsGoal, color: colors.gold },
        ].map((macro) => (
          <View key={macro.label} style={{ marginBottom: 11 }}>
            <View style={[styles.row, styles.spaceBetween, { marginBottom: 6 }]}>
              <Text style={{ color: colors.foreground, fontSize: 12 }}>{macro.label}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{macro.value} / {macro.goal} g</Text>
            </View>
            <ProgressBar value={macro.value} goal={macro.goal} color={macro.color} />
          </View>
        ))}
      </View>

      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <Pressable testID="analyze-food-shortcut" onPress={() => router.push('/food-analysis')} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.75 : 1 }]}>
          <View style={[styles.card, { backgroundColor: '#171020', borderColor: '#44215E', minHeight: 118 }]}>
            <Feather name="camera" size={22} color={colors.primary} />
            <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14, marginTop: 18 }}>Analizar comida</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>Con IA y cámara</Text>
          </View>
        </Pressable>
        <Pressable testID="add-water-shortcut" onPress={addWater} style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.75 : 1 }]}>
          <View style={[styles.card, { backgroundColor: '#0E1B25', borderColor: '#1E4054', minHeight: 118 }]}>
            <Feather name="plus-circle" size={22} color={colors.blue} />
            <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14, marginTop: 18 }}>Sumar agua</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>+ 250 ml registrados</Text>
          </View>
        </Pressable>
      </View>

      <SectionHeader title="Actividad semanal" action="Ver progreso" onPress={() => router.push('/progress')} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.row, styles.spaceBetween, { marginBottom: 10 }]}>
          <View style={styles.row}><View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: colors.primary, marginRight: 8 }} /><Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '600' }}>Calorías quemadas</Text></View>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>{stats.burned} kcal</Text>
        </View>
        <MiniChart color={colors.primary} />
        <View style={[styles.row, styles.spaceBetween, { marginTop: 7 }]}>
          {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map((day) => <Text key={day} style={{ color: colors.mutedForeground, fontSize: 10 }}>{day}</Text>)}
        </View>
      </View>

      <SectionHeader title="Siguiente entrenamiento" action="Ver rutina" onPress={() => router.push('/routines')} />
      <Pressable onPress={() => router.push('/routines')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
          <Image source={images.workout} contentFit="cover" style={{ height: 130, width: '100%' }} />
          <View style={{ padding: 15 }}>
            <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '700', letterSpacing: 1 }}>PLAN ACTUAL</Text>
            <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '700', marginTop: 5 }}>Pecho & Tríceps</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 5 }}>6 ejercicios · 42 minutos</Text>
          </View>
        </View>
      </Pressable>
      <View style={{ marginTop: 16 }}><PrimaryButton title="Registrar una comida" icon="plus" onPress={() => router.push('/food-analysis')} /></View>
    </Screen>
  );
}
