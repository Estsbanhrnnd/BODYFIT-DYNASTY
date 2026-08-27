import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { images, PrimaryButton, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

const exercises = [
  { name: 'Press de banca', detail: '4 series · 8–12 reps', time: '12 min', image: images.workout },
  { name: 'Press inclinado con mancuernas', detail: '3 series · 10–12 reps', time: '10 min', image: images.workout },
  { name: 'Aperturas con mancuernas', detail: '3 series · 12–15 reps', time: '8 min', image: images.workout },
  { name: 'Fondos en paralelas', detail: '3 series · 10–12 reps', time: '8 min', image: images.workout },
];

export default function RoutinesScreen() {
  const colors = useColors();
  const { workoutDone, toggleWorkout, canAccessFullTraining } = useBodyFit();
  const [selectedDay, setSelectedDay] = useState('Hoy');
  const visibleExercises = canAccessFullTraining ? exercises : exercises.slice(0, 1);
  return (
    <Screen>
      <TopBar title="Rutinas" subtitle="Tu plan, a tu ritmo" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 6 }]}>
        <View style={{ flexDirection: 'row' }}>
          {['Hoy', 'Historial'].map((day) => (
            <Pressable key={day} onPress={() => setSelectedDay(day)} style={{ flex: 1, padding: 11, borderRadius: 13, backgroundColor: selectedDay === day ? colors.primary : 'transparent', alignItems: 'center' }}>
              <Text style={{ color: selectedDay === day ? colors.primaryForeground : colors.mutedForeground, fontSize: 12, fontWeight: '700' }}>{day}</Text>
            </Pressable>
          ))}
        </View>
      </View>
      <GradientRoutineHeader colors={colors} />
      <SectionHeader title={selectedDay === 'Hoy' ? 'Pecho & Tríceps' : 'Entrenamientos recientes'} action="Editar" />
      {selectedDay === 'Hoy' ? visibleExercises.map((exercise) => (
        <Pressable key={exercise.name} onPress={() => undefined} style={({ pressed }) => [{ opacity: pressed ? 0.75 : 1, marginBottom: 10 }]}>
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 10, flexDirection: 'row', alignItems: 'center' }]}>
            <View style={{ position: 'relative' }}>
              <Image source={exercise.image} contentFit="cover" style={{ width: 74, height: 74, borderRadius: 13 }} />
              <View style={{ position: 'absolute', bottom: 6, left: 6, width: 22, height: 22, borderRadius: 11, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}><Feather name="play" size={10} color="#FFFFFF" /></View>
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '700' }}>{exercise.name}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 5 }}>{exercise.detail}</Text>
              <Text style={{ color: colors.gold, fontSize: 10, marginTop: 6 }}>{exercise.time} · Técnica guiada</Text>
            </View>
            <Feather name="chevron-right" size={18} color={colors.mutedForeground} />
          </View>
        </Pressable>
      )) : (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 36 }]}>
          <Feather name="check-circle" size={34} color={colors.green} />
          <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 15 }}>Tu historial aparecerá aquí</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 6 }}>Completa tu primera rutina para comenzar.</Text>
        </View>
      )}
      {!canAccessFullTraining && selectedDay === 'Hoy' ? <Pressable onPress={() => undefined} style={{ marginBottom: 10 }}>
        <View style={{ backgroundColor: '#2A1A0B', borderRadius: 18, borderWidth: 1, borderColor: '#654A17', padding: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Feather name="lock" size={17} color={colors.gold} />
          <View style={{ flex: 1, marginLeft: 11 }}><Text style={{ color: colors.gold, fontWeight: '700', fontSize: 13 }}>3 ejercicios bloqueados</Text><Text style={{ color: '#C8BBA0', fontSize: 11, marginTop: 4 }}>Desbloquea el plan Premium para completar la rutina.</Text></View>
          <Feather name="chevron-right" size={17} color={colors.gold} />
        </View>
      </Pressable> : null}
      <View style={{ marginTop: 8 }}>
        <PrimaryButton title={workoutDone ? 'Rutina completada' : 'Iniciar rutina'} icon={workoutDone ? 'check' : 'play'} onPress={toggleWorkout} />
      </View>
      <SectionHeader title="Tus planes" action="Crear plan" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {['Fuerza', 'Definición'].map((plan, index) => (
          <View key={plan} style={[styles.card, { flex: 1, backgroundColor: colors.card, borderColor: colors.border }]}>
            <Feather name={index === 0 ? 'trending-up' : 'target'} size={19} color={index === 0 ? colors.gold : colors.primary} />
            <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 13 }}>{plan}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 5 }}>{index === 0 ? '4 días / semana' : '5 días / semana'}</Text>
          </View>
        ))}
      </View>
    </Screen>
  );
}

function GradientRoutineHeader({ colors }: { colors: ReturnType<typeof useColors> }) {
  return (
    <View style={{ backgroundColor: '#171020', borderRadius: 20, padding: 18, marginTop: 16, borderWidth: 1, borderColor: '#44215E' }}>
      <View style={styles.row}>
        <View style={{ width: 44, height: 44, borderRadius: 14, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }}><Feather name="zap" size={21} color="#FFFFFF" /></View>
        <View style={{ marginLeft: 13, flex: 1 }}>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '700' }}>Entrenamiento del día</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>Intensidad media · 42 minutos</Text>
        </View>
        <Text style={{ color: colors.gold, fontWeight: '700' }}>1/4</Text>
      </View>
    </View>
  );
}