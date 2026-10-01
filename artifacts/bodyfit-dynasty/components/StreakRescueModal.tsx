import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

interface StreakRescueModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function StreakRescueModal({ visible, onClose, onSuccess }: StreakRescueModalProps) {
  const colors = useColors();
  const {
    streakDetails,
    canRescueStreak,
    rescueStreakWithAds,
    rescueStreakFree,
    membership,
    isOwner,
    freeStreakSavesRemaining,
  } = useBodyFit();

  const isGolden = isOwner || membership === 'golden';
  const isPlatinum = membership === 'platinum';

  const [step, setStep] = useState<'intro' | 'ad_playing' | 'success'>('intro');
  const [adIndex, setAdIndex] = useState(1);
  const [countdown, setCountdown] = useState(3);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setStep('intro');
      setAdIndex(1);
      setCountdown(3);
      setLoading(false);
    }
  }, [visible]);

  useEffect(() => {
    let timer: any;
    if (step === 'ad_playing' && countdown > 0) {
      timer = setTimeout(() => setCountdown((c) => c - 1), 1000);
    }
    return () => clearTimeout(timer);
  }, [step, countdown]);

  const handleFreeRescue = async () => {
    setLoading(true);
    const res = await rescueStreakFree();
    setLoading(false);
    if (res.success) {
      setStep('success');
      onSuccess?.();
    } else {
      Alert.alert('Aviso', res.message);
      onClose();
    }
  };

  const startAdSequence = () => {
    if (!canRescueStreak) {
      Alert.alert(
        'Límite Diario Alcanzado',
        'Ya has utilizado tu salvamento de racha correspondiente a hoy. ¡A mantener la constancia con tu entreno!'
      );
      return;
    }
    setStep('ad_playing');
    setAdIndex(1);
    setCountdown(3);
  };

  const handleNextAd = async () => {
    if (adIndex < 3) {
      setAdIndex((prev) => prev + 1);
      setCountdown(3);
    } else {
      // Completó los 3 anuncios
      setLoading(true);
      const res = await rescueStreakWithAds();
      setLoading(false);
      if (res.success) {
        setStep('success');
        onSuccess?.();
      } else {
        Alert.alert('Aviso', res.message);
        onClose();
      }
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary }]}>
          {/* Header con botón cerrar */}
          <View style={styles.topRow}>
            <View style={styles.fireBadge}>
              <Text style={{ fontSize: 18 }}>🔥</Text>
              <Text style={[styles.fireBadgeText, { color: colors.gold }]}>SALVA-RACHAS DYNASTY</Text>
            </View>
            {step !== 'ad_playing' && (
              <Pressable onPress={onClose} hitSlop={10} style={styles.closeBtn}>
                <Feather name="x" size={20} color={colors.foreground} />
              </Pressable>
            )}
          </View>

          {/* VISTA 1: INTRO */}
          {step === 'intro' && (
            <View style={styles.body}>
              <View style={styles.iconCircle}>
                <Text style={{ fontSize: 44 }}>🔥</Text>
              </View>

              <Text style={[styles.title, { color: colors.foreground }]}>
                ¡No pierdas tu racha!
              </Text>
              <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
                Tu constancia construye tu grandeza. Si no pudiste completar tu objetivo hoy, puedes proteger tu racha mirando 3 anuncios patrocinados.
              </Text>

              {/* Estadísticas de Racha Actuales */}
              <View style={[styles.statsGrid, { backgroundColor: 'rgba(255,255,255,0.03)', borderColor: 'rgba(255,255,255,0.08)' }]}>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: colors.gold }]}>
                    {streakDetails.currentStreak} {streakDetails.currentStreak === 1 ? 'día' : 'días'}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Racha actual</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: '#00E5FF' }]}>
                    {streakDetails.bestStreak} días
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Mejor récord</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={[styles.statValue, { color: '#10B981' }]}>
                    {streakDetails.savedStreaksCount}
                  </Text>
                  <Text style={[styles.statLabel, { color: colors.mutedForeground }]}>Salvadas</Text>
                </View>
              </View>

              {/* Advertencia / Beneficio de Membresía */}
              <View style={[styles.ruleNotice, { borderColor: `${colors.gold}44` }]}>
                <Feather name={isGolden || isPlatinum ? 'award' : 'shield'} size={14} color={colors.gold} />
                <Text style={[styles.ruleNoticeText, { color: colors.foreground }]}>
                  {isGolden
                    ? 'Beneficio VIP Golden: Restauración de racha ilimitada y 100% gratuita.'
                    : isPlatinum
                    ? `Beneficio Platinum: 7 salvamentos gratuitos por mes. Disponibles: ${freeStreakSavesRemaining} de 7.`
                    : canRescueStreak
                    ? 'Plan Standard/Bronze: Máximo 1 salvamento diario viendo 3 anuncios.'
                    : 'Ya utilizaste tu salvamento de hoy. ¡Cumple tu objetivo entrenando!'}
                </Text>
              </View>

              {isGolden ? (
                <Pressable
                  onPress={handleFreeRescue}
                  disabled={loading}
                  style={[styles.primaryBtn, { backgroundColor: colors.gold }]}
                >
                  <Text style={[styles.primaryBtnText, { color: '#000000' }]}>
                    {loading ? 'RESTAURANDO...' : '👑 RESTABLECER RACHA GRATIS (GOLDEN VIP)'}
                  </Text>
                </Pressable>
              ) : isPlatinum ? (
                <Pressable
                  onPress={handleFreeRescue}
                  disabled={loading || freeStreakSavesRemaining <= 0}
                  style={[
                    styles.primaryBtn,
                    { backgroundColor: freeStreakSavesRemaining > 0 ? colors.primary : '#334155' },
                  ]}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading
                      ? 'RESTAURANDO...'
                      : freeStreakSavesRemaining > 0
                      ? `💎 RESTABLECER RACHA GRATIS (${freeStreakSavesRemaining} DISPONIBLES)`
                      : 'LÍMITE MENSUAL ALCANZADO (7/7)'}
                  </Text>
                </Pressable>
              ) : canRescueStreak ? (
                <Pressable
                  onPress={startAdSequence}
                  style={[styles.primaryBtn, { backgroundColor: '#FF5500' }]}
                >
                  <Feather name="play" size={16} color="#FFFFFF" />
                  <Text style={styles.primaryBtnText}>VER 3 ANUNCIOS (0 / 3)</Text>
                </Pressable>
              ) : (
                <Pressable onPress={onClose} style={[styles.primaryBtn, { backgroundColor: '#334155' }]}>
                  <Text style={styles.primaryBtnText}>ENTENDIDO, VOLVER</Text>
                </Pressable>
              )}
            </View>
          )}

          {/* VISTA 2: REPRODUCTOR DE ANUNCIOS SIMULADO */}
          {step === 'ad_playing' && (
            <View style={styles.body}>
              <View style={styles.adPlayerCard}>
                <View style={styles.adHeader}>
                  <View style={styles.adTag}>
                    <Text style={styles.adTagText}>ANUNCIO DYNASTY SHOP {adIndex} DE 3</Text>
                  </View>
                  <View style={styles.countdownPill}>
                    <Feather name="clock" size={12} color="#FFF" />
                    <Text style={styles.countdownText}>{countdown}s</Text>
                  </View>
                </View>

                {/* Contenido comercial simulado */}
                <View style={styles.adContent}>
                  <Text style={{ fontSize: 36, marginBottom: 8 }}>
                    {adIndex === 1 ? '🥤' : adIndex === 2 ? '⚡' : '🛡️'}
                  </Text>
                  <Text style={styles.adProductTitle}>
                    {adIndex === 1
                      ? 'ISO 100 Hydrolyzed Protein'
                      : adIndex === 2
                      ? 'Pre-Entreno C4 Dynasty Power'
                      : 'Creatina Creapure 100% Pura'}
                  </Text>
                  <Text style={styles.adProductDesc}>
                    {adIndex === 1
                      ? '25g de proteína hidrolizada pura para hipertrofia y recuperación instantánea.'
                      : adIndex === 2
                      ? 'Enfoque láser, bombeo muscular extremo y resistencia implacable.'
                      : 'Fuerza explosiva celular comprobada por la ciencia del deporte.'}
                  </Text>
                </View>

                {/* Barra de progreso de los 3 anuncios */}
                <View style={styles.adProgressTrack}>
                  <View
                    style={[
                      styles.adProgressBar,
                      { width: `${((adIndex - 1 + (3 - countdown) / 3) / 3) * 100}%` },
                    ]}
                  />
                </View>
              </View>

              <Text style={[styles.adStatusText, { color: colors.mutedForeground }]}>
                {countdown > 0
                  ? `Podrás avanzar al siguiente en ${countdown} segundos...`
                  : adIndex < 3
                  ? `¡Anuncio ${adIndex} completado! Pulsa continuar.`
                  : '¡Último anuncio completado! Pulsa para salvar tu racha.'}
              </Text>

              <Pressable
                onPress={handleNextAd}
                disabled={countdown > 0 || loading}
                style={[
                  styles.primaryBtn,
                  {
                    backgroundColor: countdown > 0 ? '#334155' : colors.primary,
                    opacity: countdown > 0 ? 0.6 : 1,
                  },
                ]}
              >
                <Feather name={adIndex < 3 ? 'chevron-right' : 'check'} size={18} color="#FFF" />
                <Text style={styles.primaryBtnText}>
                  {adIndex < 3
                    ? `SIGUIENTE ANUNCIO (${adIndex + 1} / 3)`
                    : 'FINALIZAR Y SALVAR RACHA'}
                </Text>
              </Pressable>
            </View>
          )}

          {/* VISTA 3: ÉXITO */}
          {step === 'success' && (
            <View style={styles.body}>
              <View style={[styles.iconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.15)' }]}>
                <Text style={{ fontSize: 44 }}>🎉</Text>
              </View>

              <Text style={[styles.title, { color: '#10B981' }]}>
                ¡Racha salvada!
              </Text>
              <Text style={[styles.subtitle, { color: colors.foreground }]}>
                Tu fuego sigue ardiendo. Tu racha actual se mantiene activa con{' '}
                <Text style={{ color: colors.gold, fontWeight: '800' }}>
                  {streakDetails.currentStreak} {streakDetails.currentStreak === 1 ? 'día' : 'días'}
                </Text>
                .
              </Text>

              <View style={[styles.ruleNotice, { borderColor: '#10B98155' }]}>
                <Feather name="check-circle" size={14} color="#10B981" />
                <Text style={[styles.ruleNoticeText, { color: colors.foreground }]}>
                  Salvamento registrado con éxito hoy. Recuerda entrenar mañana para mantenerla naturalmente.
                </Text>
              </View>

              <Pressable
                onPress={onClose}
                style={[styles.primaryBtn, { backgroundColor: colors.primary }]}
              >
                <Text style={styles.primaryBtnText}>CONTINUAR EN LA DINASTÍA</Text>
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    borderRadius: 24,
    padding: 22,
    borderWidth: 1.5,
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  fireBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  fireBadgeText: {
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 1,
  },
  closeBtn: {
    padding: 4,
  },
  body: {
    alignItems: 'center',
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 85, 0, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 19,
    textAlign: 'center',
    marginBottom: 18,
    paddingHorizontal: 8,
  },
  statsGrid: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: 14,
    borderWidth: 1,
    paddingVertical: 12,
    marginBottom: 16,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 2,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ruleNotice: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: 12,
    borderWidth: 1,
    padding: 12,
    width: '100%',
    marginBottom: 18,
  },
  ruleNoticeText: {
    flex: 1,
    fontSize: 11,
    lineHeight: 16,
    fontWeight: '500',
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    width: '100%',
    paddingVertical: 14,
    borderRadius: 14,
  },
  primaryBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  adPlayerCard: {
    width: '100%',
    backgroundColor: '#1E1B26',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#383244',
    padding: 16,
    marginBottom: 14,
  },
  adHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  adTag: {
    backgroundColor: '#FF5500',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  adTagText: {
    color: '#FFF',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  countdownPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  countdownText: {
    color: '#FFF',
    fontSize: 11,
    fontWeight: '700',
  },
  adContent: {
    alignItems: 'center',
    paddingVertical: 10,
  },
  adProductTitle: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 6,
  },
  adProductDesc: {
    color: '#CBD5E1',
    fontSize: 12,
    lineHeight: 17,
    textAlign: 'center',
    paddingHorizontal: 10,
    marginBottom: 14,
  },
  adProgressTrack: {
    width: '100%',
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 3,
    overflow: 'hidden',
  },
  adProgressBar: {
    height: '100%',
    backgroundColor: '#FF5500',
    borderRadius: 3,
  },
  adStatusText: {
    fontSize: 11,
    textAlign: 'center',
    marginBottom: 14,
  },
});
