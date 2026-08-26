import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { images, MiniChart, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function ProgressScreen() {
  const colors = useColors();
  const { stats } = useBodyFit();
  const [range, setRange] = useState('1M');
  return (
    <Screen>
      <TopBar title="Progreso" subtitle="Tu evolución, en números" />
      <View style={{ flexDirection: 'row', gap: 9, marginBottom: 19 }}>
        {['1S', '1M', '3M', '1A'].map((item) => (
          <Pressable key={item} onPress={() => setRange(item)} style={{ flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12, backgroundColor: range === item ? colors.primary : colors.card, borderWidth: 1, borderColor: range === item ? colors.primary : colors.border }}>
            <Text style={{ color: range === item ? colors.primaryForeground : colors.mutedForeground, fontWeight: '700', fontSize: 11 }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={[styles.row, styles.spaceBetween]}><View><Text style={{ color: colors.mutedForeground, fontSize: 12 }}>Peso corporal</Text><Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 28, marginTop: 5 }}>98.5 <Text style={{ fontSize: 13, color: colors.mutedForeground }}>kg</Text></Text></View><View style={{ backgroundColor: '#162A20', borderRadius: 12, paddingHorizontal: 10, paddingVertical: 7 }}><Text style={{ color: colors.green, fontSize: 11, fontWeight: '700' }}>− 2.4 kg</Text></View></View>
        <View style={{ marginTop: 18 }}><MiniChart color={colors.primary} /></View>
      </View>
      <SectionHeader title="Resumen corporal" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="percent" color={colors.gold} size={17} /><Text style={[styles.metricLabel, { color: colors.mutedForeground, marginTop: 14 }]}>Grasa corporal</Text><Text style={[styles.metricValue, { color: colors.foreground }]}>18.2%</Text><Text style={[styles.metricGoal, { color: colors.green }]}>− 1.1%</Text></View>
        <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}><Feather name="bar-chart-2" color={colors.primary} size={17} /><Text style={[styles.metricLabel, { color: colors.mutedForeground, marginTop: 14 }]}>Masa muscular</Text><Text style={[styles.metricValue, { color: colors.foreground }]}>42.8 kg</Text><Text style={[styles.metricGoal, { color: colors.green }]}>+ 0.8 kg</Text></View>
      </View>
      <SectionHeader title="Antes y después" action="Agregar foto" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {['Antes', 'Actual'].map((label, index) => (
          <View key={label} style={{ flex: 1 }}>
            <View style={{ borderRadius: 17, overflow: 'hidden', borderWidth: 1, borderColor: colors.border }}>
              <Image source={index === 0 ? images.workout : images.meal} contentFit="cover" style={{ width: '100%', height: 155, opacity: index === 0 ? 0.63 : 1 }} />
              <View style={{ position: 'absolute', left: 9, top: 9, backgroundColor: '#08080BCC', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 5 }}><Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>{label}</Text></View>
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 8 }}>{index === 0 ? '15 Ene 2026' : '26 Ago 2026'}</Text>
          </View>
        ))}
      </View>
      <SectionHeader title="Objetivos diarios" />
      {[
        { label: 'Calorías', value: stats.calories, goal: stats.calorieGoal, icon: 'activity' as const, color: colors.primary, suffix: 'kcal' },
        { label: 'Pasos', value: stats.steps, goal: 10000, icon: 'navigation' as const, color: colors.gold, suffix: '' },
        { label: 'Agua', value: stats.water, goal: stats.waterGoal, icon: 'droplet' as const, color: colors.blue, suffix: 'L' },
      ].map((goal) => (
        <View key={goal.label} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 9, paddingVertical: 13 }]}>
          <View style={[styles.row, styles.spaceBetween, { marginBottom: 8 }]}><View style={styles.row}><Feather name={goal.icon} size={15} color={goal.color} /><Text style={{ color: colors.foreground, fontSize: 12, marginLeft: 9 }}>{goal.label}</Text></View><Text style={{ color: colors.mutedForeground, fontSize: 11 }}>{goal.value}{goal.suffix} / {goal.goal}{goal.suffix}</Text></View><MiniProgress value={goal.value} goal={goal.goal} color={goal.color} />
        </View>
      ))}
    </Screen>
  );
}

function MiniProgress({ value, goal, color }: { value: number; goal: number; color: string }) {
  const colors = useColors();
  return <View style={{ height: 5, borderRadius: 4, backgroundColor: colors.muted }}><View style={{ height: 5, borderRadius: 4, width: `${Math.min(value / goal * 100, 100)}%`, backgroundColor: color }} /></View>;
}