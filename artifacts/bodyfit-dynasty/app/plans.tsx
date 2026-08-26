import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { Screen, styles, TopBar } from '@/components/bodyfit';
import { useColors } from '@/hooks/useColors';

const plans = [
  { name: 'Básico', price: 'Gratis', description: 'Empieza a construir el hábito', color: '#5A3B18', features: ['Dashboard y objetivos diarios', 'Registro manual de comidas', 'Rutinas básicas'] },
  { name: 'Premium', price: 'Próximamente', description: 'Todo para acelerar tu progreso', color: '#2C1550', features: ['Análisis de comida con IA', 'Rutinas personalizadas', 'Comunidad y grupos'] },
  { name: 'Élite', price: 'Próximamente', description: 'Acompañamiento de entrenador', color: '#173C36', features: ['Panel de entrenador', 'Planes 100% personalizados', 'Seguimiento avanzado'] },
];

export default function PlansScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState('Básico');
  return (
    <Screen>
      <TopBar title="Membresías" subtitle="Elige tu próximo nivel" onPress={() => router.back()} />
      <View style={{ backgroundColor: '#171020', borderRadius: 20, padding: 17, borderWidth: 1, borderColor: '#44215E', marginBottom: 18 }}>
        <Feather name="lock" color={colors.gold} size={19} />
        <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 16, marginTop: 12 }}>Pagos todavía desactivados</Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, marginTop: 6 }}>Esta pantalla es solo informativa. Apple Pay, compras dentro de la app y SINPE Móvil se activarán en una actualización futura.</Text>
      </View>
      {plans.map((plan) => {
        const active = selected === plan.name;
        return <Pressable key={plan.name} onPress={() => setSelected(plan.name)} style={[{ backgroundColor: colors.card, borderColor: active ? colors.primary : colors.border, borderWidth: active ? 2 : 1, borderRadius: 19, padding: 17, marginBottom: 12 }]}>
          <View style={[styles.row, styles.spaceBetween]}><View style={styles.row}><View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: plan.color, alignItems: 'center', justifyContent: 'center' }}><Feather name={plan.name === 'Básico' ? 'circle' : plan.name === 'Premium' ? 'zap' : 'award'} color={plan.name === 'Élite' ? colors.gold : colors.primary} size={18} /></View><View style={{ marginLeft: 11 }}><Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 16 }}>{plan.name}</Text><Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 3 }}>{plan.description}</Text></View></View><Text style={{ color: active ? colors.primary : colors.mutedForeground, fontWeight: '700', fontSize: 12 }}>{plan.price}</Text></View>
          <View style={{ marginTop: 15, gap: 8 }}>{plan.features.map((feature) => <View key={feature} style={styles.row}><Feather name="check" size={14} color={plan.name === 'Élite' ? colors.green : colors.primary} /><Text style={{ color: colors.mutedForeground, fontSize: 11, marginLeft: 8 }}>{feature}</Text></View>)}</View>
        </Pressable>;
      })}
      <Pressable onPress={() => Alert.alert('Próximamente', 'Las membresías estarán disponibles cuando se habiliten los pagos.')} style={{ alignItems: 'center', paddingVertical: 13 }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Avisarme cuando esté disponible</Text></Pressable>
    </Screen>
  );
}