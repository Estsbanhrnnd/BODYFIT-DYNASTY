import { Feather, Ionicons } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { useListWorkoutLogs } from '@workspace/api-client-react';

interface MonthlyActivityModalProps {
  visible: boolean;
  onClose: () => void;
  onOpenAdRescue?: () => void;
}

export function MonthlyActivityModal({ visible, onClose, onOpenAdRescue }: MonthlyActivityModalProps) {
  const colors = useColors();
  const {
    membership,
    isOwner,
    streakDetails,
    freeStreakSavesRemaining,
    rescueStreakFree,
  } = useBodyFit();

  const workoutQuery = useListWorkoutLogs({ query: { queryKey: ['listWorkoutLogs'] } });
  const [loadingAction, setLoadingAction] = useState(false);

  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth(); // 0-indexed
  const todayDate = now.getDate();

  const monthName = new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric' }).format(now);
  const capitalizedMonth = monthName.charAt(0).toUpperCase() + monthName.slice(1);

  // Set de días con entrenamiento en el mes actual
  const completedDaysMap = useMemo(() => {
    const map = new Map<number, number>(); // dayNumber -> durationMinutes
    const workouts = workoutQuery.data?.workouts || [];
    for (const w of workouts) {
      const d = new Date(w.completedAt);
      if (d.getFullYear() === currentYear && d.getMonth() === currentMonth) {
        const day = d.getDate();
        const prev = map.get(day) || 0;
        map.set(day, prev + (w.durationMinutes || 0));
      }
    }
    return map;
  }, [workoutQuery.data?.workouts, currentYear, currentMonth]);

  // Generar cuadrícula del calendario
  const calendarDays = useMemo(() => {
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // 0 is Sun
    const adjustedFirstDay = (firstDayIndex + 6) % 7; // 0 is Mon
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

    const blanks = Array.from({ length: adjustedFirstDay }, () => null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    return [...blanks, ...days];
  }, [currentYear, currentMonth]);

  const totalActiveDaysThisMonth = completedDaysMap.size;
  const isGolden = isOwner || membership === 'golden';
  const isPlatinum = membership === 'platinum';

  const handleFreeRescue = async () => {
    setLoadingAction(true);
    try {
      const res = await rescueStreakFree();
      Alert.alert(res.success ? '¡Operación Exitosa!' : 'Información', res.message);
    } catch {
      Alert.alert('Error', 'No se pudo restablecer la racha en este momento.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.sheet, { backgroundColor: '#130C1E', borderColor: colors.primary }]}>
          {/* Header */}
          <View style={modalStyles.headerRow}>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Ionicons name="calendar-outline" size={18} color={colors.gold} />
                <Text style={[modalStyles.eyebrow, { color: colors.gold }]}>REGISTRO DE CONSISTENCIA</Text>
              </View>
              <Text style={modalStyles.title}>{capitalizedMonth}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={12} style={modalStyles.closeBtn}>
              <Feather name="x" size={22} color="#FFFFFF" />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
            {/* Resumen de Métricas */}
            <View style={modalStyles.metricsRow}>
              <View style={modalStyles.metricCard}>
                <Text style={[modalStyles.metricValue, { color: '#00E5FF' }]}>{totalActiveDaysThisMonth}</Text>
                <Text style={modalStyles.metricLabel}>Días Activos Mes</Text>
              </View>
              <View style={modalStyles.metricCard}>
                <Text style={[modalStyles.metricValue, { color: colors.gold }]}>{streakDetails.currentStreak}</Text>
                <Text style={modalStyles.metricLabel}>Racha Actual</Text>
              </View>
              <View style={modalStyles.metricCard}>
                <Text style={[modalStyles.metricValue, { color: '#10B981' }]}>{streakDetails.bestStreak}</Text>
                <Text style={modalStyles.metricLabel}>Mejor Racha</Text>
              </View>
            </View>

            {/* Días de la semana */}
            <View style={modalStyles.weekHeader}>
              {['L', 'M', 'M', 'J', 'V', 'S', 'D'].map((d, i) => (
                <Text key={i} style={modalStyles.weekDayText}>
                  {d}
                </Text>
              ))}
            </View>

            {/* Cuadrícula de Días */}
            <View style={modalStyles.daysGrid}>
              {calendarDays.map((day, idx) => {
                if (day === null) {
                  return <View key={`blank-${idx}`} style={modalStyles.dayCellEmpty} />;
                }
                const hasWorkout = completedDaysMap.has(day);
                const isToday = day === todayDate;

                return (
                  <View
                    key={`day-${day}`}
                    style={[
                      modalStyles.dayCell,
                      hasWorkout && { backgroundColor: `${colors.primary}40`, borderColor: colors.primary },
                      isToday && { borderWidth: 1.5, borderColor: colors.gold },
                    ]}
                  >
                    <Text
                      style={[
                        modalStyles.dayText,
                        hasWorkout && { color: '#FFFFFF', fontWeight: '800' },
                        isToday && { color: colors.gold, fontWeight: '800' },
                      ]}
                    >
                      {day}
                    </Text>
                    {hasWorkout ? (
                      <Ionicons name="flame" size={11} color="#FF6A00" style={{ marginTop: 1 }} />
                    ) : (
                      <View style={{ height: 11 }} />
                    )}
                  </View>
                );
              })}
            </View>

            {/* Sección de Restablecimiento de Racha */}
            <View style={[modalStyles.rescueSection, { borderColor: `${colors.primary}60` }]}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <Ionicons name="shield-checkmark" size={20} color={colors.gold} />
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>
                  Restablecer o Salvar Racha
                </Text>
              </View>

              {isGolden ? (
                // Golden: 100% gratis e ilimitado
                <View>
                  <View style={[modalStyles.tierBadge, { backgroundColor: '#FFD70020', borderColor: '#FFD70060' }]}>
                    <Text style={{ color: '#FFD700', fontSize: 11, fontWeight: '800' }}>
                      👑 BENEFICIO EXCLUSIVO VIP GOLDEN
                    </Text>
                  </View>
                  <Text style={modalStyles.rescueDesc}>
                    Como miembro Golden o Propietario, tienes salvamento y restauración de racha ilimitados 100% gratis.
                  </Text>
                  <Pressable
                    disabled={loadingAction}
                    onPress={handleFreeRescue}
                    style={[modalStyles.actionButton, { backgroundColor: colors.gold }]}
                  >
                    <Text style={[modalStyles.actionButtonText, { color: '#000000' }]}>
                      {loadingAction ? 'Procesando...' : '👑 Restablecer Racha Gratis (Golden VIP)'}
                    </Text>
                  </Pressable>
                </View>
              ) : isPlatinum ? (
                // Platinum: 7 gratis por mes
                <View>
                  <View style={[modalStyles.tierBadge, { backgroundColor: '#A855F720', borderColor: '#A855F760' }]}>
                    <Text style={{ color: '#D8B4FE', fontSize: 11, fontWeight: '800' }}>
                      💎 BENEFICIO PLATINUM: 7 GRATIS AL MES
                    </Text>
                  </View>
                  <Text style={modalStyles.rescueDesc}>
                    Tu membresía Platinum incluye hasta 7 restauraciones gratuitas por mes calendario. Te quedan{' '}
                    <Text style={{ color: colors.gold, fontWeight: '800' }}>{freeStreakSavesRemaining} de 7</Text> este mes.
                  </Text>
                  <Pressable
                    disabled={loadingAction || freeStreakSavesRemaining <= 0}
                    onPress={handleFreeRescue}
                    style={[
                      modalStyles.actionButton,
                      { backgroundColor: freeStreakSavesRemaining > 0 ? colors.primary : '#334155' },
                    ]}
                  >
                    <Text style={[modalStyles.actionButtonText, { color: '#FFFFFF' }]}>
                      {loadingAction
                        ? 'Procesando...'
                        : freeStreakSavesRemaining > 0
                        ? `💎 Restablecer Racha Gratis (${freeStreakSavesRemaining} restantes)`
                        : 'Límite de 7 salvamentos mensuales alcanzado'}
                    </Text>
                  </Pressable>
                </View>
              ) : (
                // Standard o Bronze: con 3 anuncios
                <View>
                  <View style={[modalStyles.tierBadge, { backgroundColor: '#FF550020', borderColor: '#FF550060' }]}>
                    <Text style={{ color: '#FF7733', fontSize: 11, fontWeight: '800' }}>
                      🔥 PLAN {membership.toUpperCase()} · SALVAMENTO CON ANUNCIOS
                    </Text>
                  </View>
                  <Text style={modalStyles.rescueDesc}>
                    Protege tu consistencia visualizando 3 breves anuncios patrocinados (máximo 1 salvamento diario).
                  </Text>
                  <Pressable
                    onPress={() => {
                      onClose();
                      onOpenAdRescue?.();
                    }}
                    style={[modalStyles.actionButton, { backgroundColor: '#FF5500' }]}
                  >
                    <Text style={[modalStyles.actionButtonText, { color: '#FFFFFF' }]}>
                      🔥 Salvar Racha con Anuncios (3 videos)
                    </Text>
                  </Pressable>
                </View>
              )}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.82)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '88%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 1.2,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '900',
    marginTop: 2,
  },
  closeBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#1E1428',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    paddingVertical: 12,
    alignItems: 'center',
  },
  metricValue: {
    fontSize: 20,
    fontWeight: '900',
  },
  metricLabel: {
    color: '#9E94A8',
    fontSize: 10,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
  weekHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
    paddingHorizontal: 4,
  },
  weekDayText: {
    width: '14.28%',
    textAlign: 'center',
    color: '#9E94A8',
    fontSize: 11,
    fontWeight: '700',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayCell: {
    width: '14.28%',
    height: 44,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    backgroundColor: 'rgba(255,255,255,0.02)',
    marginVertical: 2,
  },
  dayCellEmpty: {
    width: '14.28%',
    height: 44,
    marginVertical: 2,
  },
  dayText: {
    color: '#D1C7D8',
    fontSize: 12,
    fontWeight: '600',
  },
  rescueSection: {
    backgroundColor: 'rgba(255,255,255,0.03)',
    borderRadius: 18,
    borderWidth: 1,
    padding: 16,
    marginTop: 6,
  },
  tierBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
    marginBottom: 8,
  },
  rescueDesc: {
    color: '#D1C7D8',
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 12,
  },
  actionButton: {
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionButtonText: {
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.4,
  },
});
