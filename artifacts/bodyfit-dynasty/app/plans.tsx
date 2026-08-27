import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { membershipPlans } from '@/constants/membership';
import { Screen, styles, TopBar } from '@/components/bodyfit';
import { useColors } from '@/hooks/useColors';

export default function PlansScreen() {
  const colors = useColors();
  const [selected, setSelected] = useState('standard');

  return (
    <Screen>
      <TopBar title="Membresías" subtitle="Elige tu próximo nivel" onPress={() => router.back()} />
      <View style={{ backgroundColor: '#171020', borderRadius: 20, padding: 17, borderWidth: 1, borderColor: '#44215E', marginBottom: 18 }}>
        <Feather name="award" color={colors.gold} size={19} />
        <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 16, marginTop: 12 }}>Elige tu nivel</Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, marginTop: 6 }}>Los precios oficiales aparecen aquí. La compra se habilitará cuando los productos estén publicados en RevenueCat.</Text>
      </View>
      {membershipPlans.map((plan) => {
        const active = selected === plan.id;
        return (
          <Pressable
            key={plan.id}
            onPress={() => setSelected(plan.id)}
            style={[{ backgroundColor: colors.card, borderColor: active ? colors.primary : colors.border, borderWidth: active ? 2 : 1, borderRadius: 19, padding: 17, marginBottom: 12 }]}
          >
            <View style={[styles.row, styles.spaceBetween]}>
              <View style={styles.row}>
                <View style={{ width: 38, height: 38, borderRadius: 13, backgroundColor: plan.color, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name={plan.icon} color={plan.id === 'golden' ? colors.gold : colors.primary} size={18} />
                </View>
                <View style={{ marginLeft: 11 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 16 }}>{plan.name}</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 3 }}>{plan.description}</Text>
                </View>
              </View>
              <Text style={{ color: active ? colors.primary : colors.mutedForeground, fontWeight: '700', fontSize: 12 }}>{plan.price}</Text>
            </View>
            <View style={{ marginTop: 15, gap: 8 }}>
              {plan.features.map((feature) => (
                <View key={feature} style={styles.row}>
                  <Feather name="check" size={14} color={plan.id === 'golden' ? colors.green : colors.primary} />
                  <Text style={{ color: colors.mutedForeground, fontSize: 11, marginLeft: 8, flex: 1 }}>{feature}</Text>
                </View>
              ))}
            </View>
            {active ? (
              <View style={{ marginTop: 15, borderRadius: 10, backgroundColor: '#211134', paddingVertical: 9, alignItems: 'center' }}>
                <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>PLAN SELECCIONADO</Text>
              </View>
            ) : null}
          </Pressable>
        );
      })}
      <Pressable onPress={() => Alert.alert('RevenueCat pendiente', 'La selección visual ya está lista. Las compras se activarán al configurar los productos reales de cada plan.')} style={{ alignItems: 'center', paddingVertical: 13 }}>
        <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Ver estado de compra</Text>
      </Pressable>
    </Screen>
  );
}