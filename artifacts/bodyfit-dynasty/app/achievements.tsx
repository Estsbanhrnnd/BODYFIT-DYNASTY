import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import {
  DYNASTY_MEDALS_CATALOG,
  type MedalTier,
  getMedalsStats,
} from '@/constants/medalsCatalog';
import { MedalCard } from '@/components/MedalCard';

export default function AchievementsScreen() {
  const colors = useColors();
  const { dynastyStats, unlockedMedals } = useBodyFit();

  const [selectedTier, setSelectedTier] = useState<MedalTier | 'ALL'>('ALL');

  const medalsStats = useMemo(() => {
    return getMedalsStats(unlockedMedals);
  }, [unlockedMedals]);

  const visibleOfficialMedals = useMemo(() => {
    if (selectedTier === 'ALL') return DYNASTY_MEDALS_CATALOG;
    return DYNASTY_MEDALS_CATALOG.filter((m) => m.tier === selectedTier);
  }, [selectedTier]);

  return (
    <Screen>
      <TopBar title="Medallas y Logros" subtitle="Vitrina Oficial BodyFit Dynasty (35 Medallas)" />

      {/* Tarjeta Hero de la Vitrina Oficial */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: '#181320',
            borderColor: `${colors.gold}60`,
            padding: 18,
            marginBottom: 16,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flex: 1, paddingRight: 8 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1.5 }}>
                DYNASTY OFFICIAL MEDALS
              </Text>
              <Feather name="shield" size={13} color={colors.gold} />
            </View>
            <Text style={{ color: colors.foreground, fontSize: 24, fontWeight: '800' }}>
              {medalsStats.unlocked}{' '}
              <Text style={{ fontSize: 15, color: colors.mutedForeground, fontWeight: '500' }}>
                de {medalsStats.total} medallas
              </Text>
            </Text>
            <Text style={{ color: '#D5C8DF', fontSize: 11, marginTop: 4 }}>
              Desbloqueo por sistema de Mayoría multi-área
            </Text>
          </View>

          <View
            style={{
              backgroundColor: `${colors.gold}20`,
              borderRadius: 16,
              paddingVertical: 10,
              paddingHorizontal: 14,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: `${colors.gold}50`,
            }}
          >
            <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800' }}>PUNTOS TOTALES</Text>
            <Text style={{ color: '#FBBF24', fontSize: 20, fontWeight: '800', marginTop: 2 }}>
              {medalsStats.totalPoints.toLocaleString()}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 9 }}>DYNASTY PTS</Text>
          </View>
        </View>

        {/* Desglose por Tier */}
        <View style={{ flexDirection: 'row', gap: 6 }}>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(205, 127, 50, 0.15)',
              paddingVertical: 6,
              borderRadius: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(205, 127, 50, 0.4)',
            }}
          >
            <Text style={{ color: '#CD7F32', fontSize: 9, fontWeight: '800' }}>🥉 BRONCE</Text>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800', marginTop: 2 }}>
              {medalsStats.bronzeUnlocked} / {medalsStats.bronzeTotal}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(148, 163, 184, 0.15)',
              paddingVertical: 6,
              borderRadius: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(148, 163, 184, 0.4)',
            }}
          >
            <Text style={{ color: '#94A3B8', fontSize: 9, fontWeight: '800' }}>💠 PLATINO</Text>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800', marginTop: 2 }}>
              {medalsStats.platinumUnlocked} / {medalsStats.platinumTotal}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(245, 158, 11, 0.15)',
              paddingVertical: 6,
              borderRadius: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(245, 158, 11, 0.4)',
            }}
          >
            <Text style={{ color: '#F59E0B', fontSize: 9, fontWeight: '800' }}>🥇 ORO</Text>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800', marginTop: 2 }}>
              {medalsStats.goldenUnlocked} / {medalsStats.goldenTotal}
            </Text>
          </View>
          <View
            style={{
              flex: 1,
              backgroundColor: 'rgba(0, 229, 255, 0.15)',
              paddingVertical: 6,
              borderRadius: 8,
              alignItems: 'center',
              borderWidth: 1,
              borderColor: 'rgba(0, 229, 255, 0.4)',
            }}
          >
            <Text style={{ color: '#00E5FF', fontSize: 9, fontWeight: '800' }}>💎 DIAMANTE</Text>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800', marginTop: 2 }}>
              {medalsStats.diamondUnlocked} / {medalsStats.diamondTotal}
            </Text>
          </View>
        </View>
      </View>

      {/* Filtro horizontal por Rareza / Tier */}
      <View style={{ marginBottom: 14 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {[
            { id: 'ALL', label: `Todas (35)` },
            { id: 'BRONZE', label: `🥉 Bronce (${medalsStats.bronzeTotal})` },
            { id: 'PLATINUM', label: `💠 Platino (${medalsStats.platinumTotal})` },
            { id: 'GOLDEN', label: `🥇 Oro (${medalsStats.goldenTotal})` },
            { id: 'DIAMOND', label: `💎 Diamante (${medalsStats.diamondTotal})` },
          ].map((tierItem) => {
            const isSelected = selectedTier === tierItem.id;
            return (
              <Pressable
                key={tierItem.id}
                onPress={() => setSelectedTier(tierItem.id as any)}
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 12,
                  borderRadius: 20,
                  backgroundColor: isSelected ? colors.primary : colors.card,
                  borderColor: isSelected ? colors.primary : colors.border,
                  borderWidth: 1,
                }}
              >
                <Text style={{ color: isSelected ? '#FFFFFF' : colors.foreground, fontSize: 11, fontWeight: '700' }}>
                  {tierItem.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      <SectionHeader title={`Medallas Oficiales (${visibleOfficialMedals.length})`} />
      {visibleOfficialMedals.map((medal) => (
        <MedalCard
          key={medal.id}
          medal={medal}
          stats={dynastyStats}
          isUnlocked={unlockedMedals.includes(medal.id)}
        />
      ))}
    </Screen>
  );
}