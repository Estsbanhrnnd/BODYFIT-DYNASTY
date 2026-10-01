import { Feather } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

interface DynastyAdModalProps {
  visible: boolean;
  onClose: () => void;
  onAdCompleted?: () => void;
  onRewardClaimed?: () => void;
  targetName?: string;
  title?: string;
  subtitle?: string;
  adProgress?: number;
  totalRequired?: number;
}

const DYNASTY_SPONSORS = [
  {
    tag: 'SUPLEMENTACIÓN DE ÉLITE',
    title: 'Dynasty 100% Whey Isolate',
    description: '27g de proteína aislada pura por servicio, 0 azúcares y absorción ultra rápida para maximizar tu síntesis proteica.',
    badge: 'Fórmula Oficial Coach Esteban',
    icon: 'award',
    color: '#FFD700',
  },
  {
    tag: 'MÁXIMO RENDIMIENTO & PUMP',
    title: 'Dynasty Blood Surge Pre-Workout',
    description: 'Beta-alanina, citrulina malato y cafeína anhidra dosificadas para entrenar con enfoque de hierro y fuerza explosiva.',
    badge: 'Energía Limpia sin Bajón',
    icon: 'zap',
    color: '#C084FC',
  },
  {
    tag: 'EQUIPAMIENTO DE COMPETENCIA',
    title: 'Dynasty Lever Belts & Straps',
    description: 'Cinturones de palanca de 10mm en cuero genuino y correas de agarre reforzadas para proteger tu columna en levantamientos pesados.',
    badge: 'Garantía de Resistencia Vitalicia',
    icon: 'shield',
    color: '#60A5FA',
  },
];

export function DynastyAdModal({
  visible,
  onClose,
  onAdCompleted,
  onRewardClaimed,
  targetName,
  title,
  subtitle,
  adProgress,
  totalRequired,
}: DynastyAdModalProps) {
  const colors = useColors();
  const [secondsRemaining, setSecondsRemaining] = useState(5);
  const [canClaim, setCanClaim] = useState(false);
  const [sponsorIndex, setSponsorIndex] = useState(0);

  useEffect(() => {
    if (!visible) {
      setSecondsRemaining(5);
      setCanClaim(false);
      return;
    }

    setSponsorIndex(Math.floor(Math.random() * DYNASTY_SPONSORS.length));
    setSecondsRemaining(5);
    setCanClaim(false);

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanClaim(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [visible]);

  const sponsor = DYNASTY_SPONSORS[sponsorIndex] || DYNASTY_SPONSORS[0];
  const progressPercent = Math.min(100, Math.round(((5 - secondsRemaining) / 5) * 100));

  const effectiveTotalRequired = totalRequired ?? 1;
  const effectiveAdProgress = adProgress ?? 0;

  const handleClaim = () => {
    if (onRewardClaimed) onRewardClaimed();
    if (onAdCompleted) onAdCompleted();
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View style={[modalStyles.card, { backgroundColor: '#140D1D', borderColor: colors.gold }]}>
          {/* Header */}
          <View style={modalStyles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <View style={{ backgroundColor: `${colors.gold}25`, padding: 5, borderRadius: 6 }}>
                <Feather name="tv" size={13} color={colors.gold} />
              </View>
              <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8 }}>
                PATROCINADOR OFICIAL DYNASTY ®
              </Text>
            </View>

            <Pressable onPress={onClose} style={{ padding: 4 }}>
              <Feather name="x" size={16} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {/* Barra de progreso del Video / Anuncio */}
          <View style={{ height: 4, backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, overflow: 'hidden', marginVertical: 10 }}>
            <View
              style={{
                height: '100%',
                width: `${progressPercent}%`,
                backgroundColor: colors.gold,
              }}
            />
          </View>

          {/* Contador y Estado */}
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
              Desbloqueando: <Text style={{ color: '#FFFFFF', fontWeight: '700' }} numberOfLines={1}>{targetName}</Text>
            </Text>
            <View style={{ backgroundColor: canClaim ? 'rgba(74, 222, 128, 0.2)' : 'rgba(255, 215, 0, 0.15)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
              <Text style={{ color: canClaim ? '#4ADE80' : colors.gold, fontSize: 10, fontWeight: '800' }}>
                {canClaim ? '¡Completado!' : `Quedan ${secondsRemaining}s`}
              </Text>
            </View>
          </View>

          {/* Tarjeta del Patrocinador */}
          <View
            style={{
              backgroundColor: '#1E1428',
              borderRadius: 14,
              borderWidth: 1.5,
              borderColor: `${sponsor.color}60`,
              padding: 14,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <View style={{ backgroundColor: `${sponsor.color}25`, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                <Text style={{ color: sponsor.color, fontSize: 9, fontWeight: '900', letterSpacing: 0.5 }}>
                  {sponsor.tag}
                </Text>
              </View>
              <Feather name={sponsor.icon as any} size={15} color={sponsor.color} />
            </View>

            <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 4 }}>
              {sponsor.title}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 16, marginBottom: 8 }}>
              {sponsor.description}
            </Text>

            <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, alignSelf: 'flex-start' }}>
              <Text style={{ color: colors.gold, fontSize: 9.5, fontWeight: '700' }}>
                ✓ {sponsor.badge}
              </Text>
            </View>
          </View>

          {/* Resumen de Progreso de Desbloqueo */}
          <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.04)', borderRadius: 10, padding: 10, marginBottom: 14 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '700' }}>
                Progreso de anuncios:
              </Text>
              <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800' }}>
                {canClaim ? Math.min(effectiveTotalRequired, effectiveAdProgress + 1) : effectiveAdProgress} de {effectiveTotalRequired} anuncios
              </Text>
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 3 }}>
              {canClaim && effectiveAdProgress + 1 >= effectiveTotalRequired
                ? '🎉 ¡Al reclamar, este contenido se desbloqueará durante 7 días!'
                : `Al terminar este video registrarás 1 anuncio de los ${effectiveTotalRequired} requeridos para tu plan.`}
            </Text>
          </View>

          {/* Botón de Acción */}
          {canClaim ? (
            <Pressable
              onPress={handleClaim}
              style={{
                backgroundColor: colors.gold,
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 7,
              }}
            >
              <Feather name="check-circle" size={16} color="#0B0710" />
              <Text style={{ color: '#0B0710', fontSize: 13, fontWeight: '800' }}>
                Reclamar Recompensa y Desbloquear
              </Text>
            </Pressable>
          ) : (
            <View
              style={{
                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Feather name="clock" size={14} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, fontSize: 12, fontWeight: '700' }}>
                Reproduciendo anuncio ({secondsRemaining}s)...
              </Text>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  card: {
    width: '100%',
    maxWidth: 380,
    borderRadius: 20,
    borderWidth: 1.5,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
