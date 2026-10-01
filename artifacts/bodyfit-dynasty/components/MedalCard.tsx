import { Feather } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import {
  DynastyMedal,
  DynastyUserStats,
  TIER_CONFIG,
  evaluateMedalProgress,
} from '@/constants/medalsCatalog';
import { useColors } from '@/hooks/useColors';

interface MedalCardProps {
  medal: DynastyMedal;
  stats: DynastyUserStats;
  isUnlocked: boolean;
}

export function MedalCard({ medal, stats, isUnlocked }: MedalCardProps) {
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);

  const tierStyle = TIER_CONFIG[medal.tier];
  const evalResult = evaluateMedalProgress(medal, stats);
  const effectivelyUnlocked = isUnlocked || evalResult.isUnlocked;

  return (
    <>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`Medalla ${medal.title}, ${tierStyle.label}, ${effectivelyUnlocked ? 'desbloqueada' : 'bloqueada'}`}
        onPress={() => setModalVisible(true)}
        style={[
          styles.card,
          {
            backgroundColor: effectivelyUnlocked ? colors.card : '#141217',
            borderColor: effectivelyUnlocked ? tierStyle.color : 'rgba(255,255,255,0.08)',
          },
        ]}
      >
        {/* Emblema Heráldico Dynasty */}
        <View
          style={[
            styles.heraldicFrame,
            {
              backgroundColor: effectivelyUnlocked ? tierStyle.bg : 'rgba(255,255,255,0.04)',
              borderColor: effectivelyUnlocked ? tierStyle.border : 'rgba(255,255,255,0.1)',
            },
          ]}
        >
          <Feather
            name={medal.icon as any}
            size={26}
            color={effectivelyUnlocked ? tierStyle.color : '#64748B'}
          />
          {effectivelyUnlocked && (
            <View style={[styles.glowStar, { backgroundColor: tierStyle.color }]}>
              <Feather name="check" size={10} color="#000" />
            </View>
          )}
        </View>

        {/* Info Central */}
        <View style={styles.cardInfo}>
          <View style={styles.headerRow}>
            <Text
              numberOfLines={1}
              style={[
                styles.title,
                { color: effectivelyUnlocked ? colors.foreground : colors.mutedForeground },
              ]}
            >
              {medal.title}
            </Text>
            <View
              style={[
                styles.tierBadge,
                {
                  backgroundColor: tierStyle.bg,
                  borderColor: tierStyle.border,
                },
              ]}
            >
              <Text style={[styles.tierBadgeText, { color: tierStyle.color }]}>
                {tierStyle.label.toUpperCase()}
              </Text>
            </View>
          </View>

          <Text numberOfLines={1} style={[styles.concept, { color: colors.mutedForeground }]}>
            {medal.badgeConcept}
          </Text>

          {/* Barra y Estado de Mayoría */}
          <View style={styles.progressRow}>
            <View style={styles.progressBarBg}>
              <View
                style={[
                  styles.progressBarFill,
                  {
                    width: `${evalResult.progressPercent}%`,
                    backgroundColor: effectivelyUnlocked ? tierStyle.color : colors.primary,
                  },
                ]}
              />
            </View>
            <Text style={[styles.progressText, { color: colors.mutedForeground }]}>
              {evalResult.completedObjectivesCount}/{medal.requiredMajorityCount} req.
            </Text>
          </View>

          {/* Estado inferior */}
          <View style={styles.footerRow}>
            <Text style={[styles.pointsText, { color: colors.gold }]}>
              +{medal.points} pts Dynasty
            </Text>
            {effectivelyUnlocked ? (
              <View style={styles.statusUnlocked}>
                <Feather name="award" size={12} color="#10B981" />
                <Text style={styles.statusUnlockedText}>DESBLOQUEADA</Text>
              </View>
            ) : (
              <View style={styles.statusLocked}>
                <Feather name="lock" size={12} color="#94A3B8" />
                <Text style={styles.statusLockedText}>BLOQUEADA</Text>
              </View>
            )}
          </View>
        </View>
      </Pressable>

      {/* Modal Detallado de Medalla y Regla de Mayoría */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalBackdrop}>
          <View style={[styles.modalCard, { backgroundColor: colors.card, borderColor: tierStyle.border }]}>
            {/* Header del Modal */}
            <View style={styles.modalHeader}>
              <View
                style={[
                  styles.modalInsignia,
                  {
                    backgroundColor: tierStyle.bg,
                    borderColor: tierStyle.border,
                  },
                ]}
              >
                <Feather
                  name={medal.icon as any}
                  size={36}
                  color={effectivelyUnlocked ? tierStyle.color : '#64748B'}
                />
              </View>
              <Pressable
                onPress={() => setModalVisible(false)}
                style={styles.modalCloseBtn}
                hitSlop={10}
              >
                <Feather name="x" size={20} color={colors.foreground} />
              </Pressable>
            </View>

            <View style={styles.modalTitleRow}>
              <Text style={[styles.modalTitle, { color: colors.foreground }]}>{medal.title}</Text>
              <View
                style={[
                  styles.tierBadge,
                  { backgroundColor: tierStyle.bg, borderColor: tierStyle.border },
                ]}
              >
                <Text style={[styles.tierBadgeText, { color: tierStyle.color }]}>
                  {tierStyle.label.toUpperCase()} · +{medal.points} PTS
                </Text>
              </View>
            </View>

            <Text style={[styles.modalConcept, { color: colors.gold }]}>
              Insignia: {medal.badgeConcept}
            </Text>
            <Text style={[styles.modalQuote, { color: colors.mutedForeground }]}>
              "{medal.loreQuote}"
            </Text>

            {/* Caja de Regla de Mayoría */}
            <View style={[styles.majorityRuleBox, { borderColor: `${colors.primary}55` }]}>
              <View style={styles.majorityRuleTitleRow}>
                <Feather name="info" size={14} color={colors.primary} />
                <Text style={[styles.majorityRuleTitle, { color: colors.foreground }]}>
                  Sistema de Desbloqueo por Mayoría
                </Text>
              </View>
              <Text style={[styles.majorityRuleDesc, { color: colors.mutedForeground }]}>
                Para conquistar esta medalla necesitas cumplir al menos{' '}
                <Text style={{ color: colors.foreground, fontWeight: '700' }}>
                  {medal.requiredMajorityCount} de los {medal.objectives.length} objetivos
                </Text>
                . No es necesario el 100% de todas las métricas.
              </Text>
            </View>

            {/* Lista de Objetivos con Checklist */}
            <View style={styles.objectivesList}>
              {evalResult.objectivesStatus.map((obj, index) => (
                <View key={index} style={[styles.objectiveItem, { borderColor: 'rgba(255,255,255,0.06)' }]}>
                  <View style={styles.objectiveLeft}>
                    <View
                      style={[
                        styles.checkCircle,
                        {
                          backgroundColor: obj.met ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
                          borderColor: obj.met ? '#10B981' : '#64748B',
                        },
                      ]}
                    >
                      <Feather
                        name={obj.met ? 'check' : 'circle'}
                        size={12}
                        color={obj.met ? '#10B981' : '#64748B'}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={[styles.objLabel, { color: colors.foreground }]}>{obj.label}</Text>
                      <Text style={[styles.objProgressText, { color: colors.mutedForeground }]}>
                        {obj.current} de {obj.target} {obj.unit} ({obj.percent}%)
                      </Text>
                    </View>
                  </View>
                  {obj.met && (
                    <Text style={styles.metTag}>CUMPLIDO</Text>
                  )}
                </View>
              ))}
            </View>

            {/* Botón de cierre */}
            <Pressable
              onPress={() => setModalVisible(false)}
              style={[styles.closeModalBtn, { backgroundColor: colors.primary }]}
            >
              <Text style={styles.closeModalBtnText}>ENTENDIDO</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: 16,
    borderWidth: 1.5,
    marginBottom: 12,
    gap: 14,
  },
  heraldicFrame: {
    width: 60,
    height: 60,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  glowStar: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    flex: 1,
    marginRight: 8,
  },
  tierBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    borderWidth: 1,
  },
  tierBadgeText: {
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  concept: {
    fontSize: 11,
    marginBottom: 8,
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  progressBarBg: {
    flex: 1,
    height: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 10,
    fontWeight: '700',
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pointsText: {
    fontSize: 11,
    fontWeight: '700',
  },
  statusUnlocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusUnlockedText: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  statusLocked: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusLockedText: {
    color: '#94A3B8',
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  modalCard: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  modalInsignia: {
    width: 68,
    height: 68,
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  modalCloseBtn: {
    padding: 6,
  },
  modalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
  },
  modalConcept: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  modalQuote: {
    fontSize: 12,
    fontStyle: 'italic',
    lineHeight: 18,
    marginBottom: 14,
  },
  majorityRuleBox: {
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    marginBottom: 14,
  },
  majorityRuleTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  majorityRuleTitle: {
    fontSize: 12,
    fontWeight: '800',
  },
  majorityRuleDesc: {
    fontSize: 11,
    lineHeight: 16,
  },
  objectivesList: {
    gap: 8,
    marginBottom: 18,
  },
  objectiveItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.02)',
    borderRadius: 10,
    borderWidth: 1,
  },
  objectiveLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  checkCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  objLabel: {
    fontSize: 12,
    fontWeight: '700',
  },
  objProgressText: {
    fontSize: 10,
    marginTop: 1,
  },
  metTag: {
    color: '#10B981',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  closeModalBtn: {
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  closeModalBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 1,
  },
});
