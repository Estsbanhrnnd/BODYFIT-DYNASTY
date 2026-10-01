import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { membershipPlans } from '@/constants/membership';
import { MEMBERSHIP_CONFIG } from '@/constants/membershipConfig';
import { Screen, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function PlansScreen() {
  const colors = useColors();
  const { membership, redeemGiftCode, membershipLabel, isOwner, previewTier, setPreviewTier } = useBodyFit();
  const [selected, setSelected] = useState(membership || 'standard');

  // Modal Canjear Código de Regalía
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [redeemCode, setRedeemCode] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemFeedback, setRedeemFeedback] = useState<{ success: boolean; message: string } | null>(null);

  const handleRedeem = async () => {
    const code = redeemCode.trim();
    if (!code) {
      setRedeemFeedback({ success: false, message: 'Ingresa un código para canjear.' });
      return;
    }
    setRedeeming(true);
    setRedeemFeedback(null);
    try {
      const res = await redeemGiftCode(code);
      setRedeemFeedback(res);
      if (res.success) {
        setRedeemCode('');
        Alert.alert('¡Membresía Activada!', res.message);
      }
    } finally {
      setRedeeming(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Membresías" subtitle="Elige tu próximo nivel" onPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* PANEL DE SIMULACIÓN Y TESTEO DE MEMBRESÍAS (Para el Propietario / Esteban) */}
        {isOwner && (
          <View
            style={{
              backgroundColor: '#1E112E',
              borderRadius: 20,
              padding: 15,
              borderWidth: 1.5,
              borderColor: colors.gold,
              marginBottom: 16,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
                <Feather name="shield" size={17} color={colors.gold} />
                <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800', letterSpacing: 0.8 }}>
                  SIMULADOR DE MEMBRESÍAS (DUEÑO)
                </Text>
              </View>
              {previewTier !== 'none' && (
                <Pressable
                  onPress={() => setPreviewTier('none')}
                  style={{
                    backgroundColor: 'rgba(239, 68, 68, 0.2)',
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: '#EF4444',
                  }}
                >
                  <Text style={{ color: '#F87171', fontSize: 10, fontWeight: '800' }}>RESTABLECER</Text>
                </Pressable>
              )}
            </View>

            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 10, lineHeight: 16 }}>
              Prueba y valida en tiempo real la experiencia y el catálogo de cada membresía:
            </Text>

            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              {(
                [
                  { id: 'standard', label: 'STANDARD (30%)', color: '#9CA3AF' },
                  { id: 'bronze', label: 'BRONZE (60%)', color: '#CD7F32' },
                  { id: 'platinum', label: 'PLATINUM (90%)', color: '#A855F7' },
                  { id: 'golden', label: 'GOLDEN (100%)', color: colors.gold },
                ] as const
              ).map((tier) => {
                const isActive = previewTier === tier.id;
                return (
                  <Pressable
                    key={tier.id}
                    onPress={() => {
                      setPreviewTier(tier.id);
                      setSelected(tier.id);
                    }}
                    style={{
                      flex: 1,
                      minWidth: 70,
                      paddingVertical: 8,
                      paddingHorizontal: 6,
                      borderRadius: 10,
                      alignItems: 'center',
                      backgroundColor: isActive ? tier.color : '#29183E',
                      borderWidth: 1.5,
                      borderColor: tier.color,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 9.5,
                        fontWeight: '900',
                        color: isActive ? '#0B0710' : '#FFFFFF',
                      }}
                      numberOfLines={1}
                    >
                      {tier.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {previewTier !== 'none' && (
              <View
                style={{
                  marginTop: 9,
                  backgroundColor: 'rgba(255, 215, 0, 0.12)',
                  paddingVertical: 6,
                  paddingHorizontal: 10,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: `${colors.gold}60`,
                }}
              >
                <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '700', textAlign: 'center' }}>
                  ✓ Simulando modo {previewTier.toUpperCase()}: Rutinas, recetas y desbloqueos adaptados a este plan.
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Banner de Estado de Membresía Actual */}
        <View style={{ backgroundColor: '#171020', borderRadius: 20, padding: 17, borderWidth: 1.5, borderColor: colors.gold, marginBottom: 16 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="award" color={colors.gold} size={22} />
              <View>
                <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }}>TU PLAN ACTUAL</Text>
                <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 18, marginTop: 2 }}>{membershipLabel}</Text>
              </View>
            </View>
            <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8, borderWidth: 1, borderColor: `${colors.gold}60` }}>
              <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>ACTIVO</Text>
            </View>
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 17, marginTop: 10 }}>
            Planes oficiales BodyFit Dynasty. Accede al catálogo de ejercicios, IA de nutrición y recetas según tu nivel.
          </Text>
        </View>

        {/* Banner Canjear Código de Regalía */}
        <Pressable
          onPress={() => {
            setRedeemFeedback(null);
            setRedeemModalOpen(true);
          }}
          style={({ pressed }) => [
            styles.card,
            {
              backgroundColor: '#1E1428',
              borderColor: `${colors.gold}80`,
              borderWidth: 1.5,
              marginBottom: 18,
              padding: 16,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: `${colors.gold}25`, alignItems: 'center', justifyContent: 'center' }}>
              <Feather name="gift" size={20} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>¿Tienes un código de regalía?</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>Canjea tu membresía de regalo aquí</Text>
            </View>
          </View>
          <View style={{ backgroundColor: `${colors.gold}20`, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, borderWidth: 1, borderColor: colors.gold }}>
            <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>Canjear</Text>
          </View>
        </Pressable>

        {/* Botón para volver a cuenta real si se está en simulación */}
        {isOwner && previewTier !== 'none' && (
          <Pressable
            onPress={() => {
              setPreviewTier('none');
              setSelected('golden');
            }}
            style={({ pressed }) => [
              {
                backgroundColor: `${colors.gold}20`,
                borderWidth: 1.5,
                borderColor: colors.gold,
                borderRadius: 14,
                padding: 12,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name="shield" size={16} color={colors.gold} />
            <Text style={{ color: colors.gold, fontWeight: '800', fontSize: 13 }}>
              👑 Volver a Cuenta Real (Dueño Total)
            </Text>
          </Pressable>
        )}

        {/* Tarjetas de Planes con Precios Protagonistas */}
        {membershipPlans.map((plan) => {
          const isCurrentlyPreviewed = isOwner && previewTier === plan.id;
          const isCurrentActive = isOwner ? isCurrentlyPreviewed : membership === plan.id;
          const active = selected === plan.id || isCurrentlyPreviewed;
          const config = MEMBERSHIP_CONFIG[plan.id];
          const isGolden = plan.id === 'golden';
          const isFree = plan.id === 'standard';

          return (
            <Pressable
              key={plan.id}
              onPress={() => {
                setSelected(plan.id);
                if (isOwner) setPreviewTier(plan.id);
              }}
              style={[
                {
                  backgroundColor: isGolden ? '#1B1424' : colors.card,
                  borderColor: active
                    ? isGolden
                      ? colors.gold
                      : colors.primary
                    : isGolden
                    ? `${colors.gold}50`
                    : colors.border,
                  borderWidth: active ? 2 : 1,
                  borderRadius: 22,
                  padding: 18,
                  marginBottom: 16,
                },
              ]}
            >
              {/* Encabezado: Icono, Nombre y Badge */}
              <View style={[styles.row, styles.spaceBetween, { alignItems: 'center' }]}>
                <View style={[styles.row, { alignItems: 'center', gap: 10 }]}>
                  <View
                    style={{
                      width: 42,
                      height: 42,
                      borderRadius: 14,
                      backgroundColor: plan.color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: isGolden ? colors.gold : 'transparent',
                    }}
                  >
                    <Feather
                      name={plan.icon}
                      color={isGolden ? colors.gold : colors.primary}
                      size={20}
                    />
                  </View>
                  <View>
                    <Text style={{ color: colors.foreground, fontWeight: '800', fontSize: 18 }}>
                      {plan.name}
                    </Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                      {plan.description}
                    </Text>
                  </View>
                </View>

                {/* Badge de Nivel */}
                <View
                  style={{
                    backgroundColor: isGolden
                      ? `${colors.gold}25`
                      : plan.id === 'platinum'
                      ? `${colors.primary}25`
                      : 'rgba(255,255,255,0.08)',
                    paddingHorizontal: 10,
                    paddingVertical: 5,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: isGolden
                      ? colors.gold
                      : plan.id === 'platinum'
                      ? colors.primary
                      : 'transparent',
                  }}
                >
                  <Text
                    style={{
                      color: isGolden ? colors.gold : plan.id === 'platinum' ? colors.primary : colors.mutedForeground,
                      fontSize: 10,
                      fontWeight: '800',
                      letterSpacing: 0.8,
                    }}
                  >
                    {isGolden
                      ? 'DYNASTY VIP'
                      : plan.id === 'platinum'
                      ? 'POPULAR'
                      : isFree
                      ? 'GRATIS'
                      : 'ESENCIAL'}
                  </Text>
                </View>
              </View>

              {/* SECCIÓN PROTAGONISTA DE PRECIO (Responsive Móvil Protegido) */}
              <View
                style={{
                  marginTop: 14,
                  marginBottom: 12,
                  backgroundColor: isGolden ? '#281A36' : '#1A1224',
                  borderRadius: 16,
                  paddingVertical: 14,
                  paddingHorizontal: 14,
                  borderWidth: 1,
                  borderColor: isGolden ? `${colors.gold}40` : `${colors.border}80`,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: 8,
                }}
              >
                <View style={{ flex: 1, minWidth: 150 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'baseline', gap: 4, flexWrap: 'wrap' }}>
                    <Text
                      style={{
                        fontSize: 28,
                        fontWeight: '900',
                        color: isGolden ? colors.gold : '#FFFFFF',
                        letterSpacing: -0.5,
                      }}
                    >
                      {isFree ? '$0.00' : `$${config.priceUsd.toFixed(2)}`}
                    </Text>
                    <Text
                      style={{
                        fontSize: 13,
                        fontWeight: '700',
                        color: isGolden ? colors.gold : colors.mutedForeground,
                      }}
                    >
                      {isFree ? '— GRATIS' : '/ mes'}
                    </Text>
                  </View>
                  <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                    {isFree ? 'Acceso esencial de por vida' : 'Facturación mensual en USD · Sin permanencia'}
                  </Text>
                </View>

                {/* Píldora de catálogo con flexShrink: 0 para evitar desbordes en teléfonos */}
                <View
                  style={{
                    backgroundColor: isGolden ? `${colors.gold}25` : `${colors.primary}20`,
                    paddingHorizontal: 9,
                    paddingVertical: 6,
                    borderRadius: 8,
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                    alignSelf: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: isGolden ? colors.gold : colors.primary,
                      fontSize: 10.5,
                      fontWeight: '800',
                    }}
                    numberOfLines={1}
                  >
                    {config.catalogPercentTarget}% CATÁLOGO
                  </Text>
                </View>
              </View>

              {/* Lista de Beneficios */}
              <View style={{ marginTop: 6, gap: 7 }}>
                {plan.features.map((feature) => (
                  <View key={feature} style={styles.row}>
                    <Feather
                      name="check"
                      size={15}
                      color={isGolden ? colors.gold : colors.green}
                    />
                    <Text style={{ color: colors.mutedForeground, fontSize: 12, marginLeft: 8, flex: 1, lineHeight: 17 }}>
                      {feature}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Botón directo de Chat 24/7 si es Golden */}
              {isGolden && (
                <Pressable
                  onPress={() => router.push('/trainer-chat' as never)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: `${colors.gold}20`,
                      borderColor: colors.gold,
                      borderWidth: 1,
                      borderRadius: 12,
                      paddingVertical: 9,
                      paddingHorizontal: 12,
                      marginTop: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      opacity: pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Feather name="message-circle" size={14} color={colors.gold} />
                  <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800' }}>
                    Conoce a tus Coaches & Chat 24/7 →
                  </Text>
                </Pressable>
              )}

              {/* Botón de Selección e Información de Estado */}
              {isOwner ? (
                isCurrentlyPreviewed ? (
                  <View
                    style={{
                      marginTop: 15,
                      borderRadius: 12,
                      backgroundColor: isGolden ? `${colors.gold}25` : '#211134',
                      borderWidth: 1.5,
                      borderColor: isGolden ? colors.gold : colors.primary,
                      paddingVertical: 10,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: isGolden ? colors.gold : colors.primary, fontSize: 12, fontWeight: '800' }}>
                      ✓ VISUALIZANDO ACTUALMENTE ESTE PLAN
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    onPress={() => {
                      setPreviewTier(plan.id);
                      setSelected(plan.id);
                    }}
                    style={({ pressed }) => [
                      {
                        marginTop: 15,
                        borderRadius: 12,
                        backgroundColor: '#1E1428',
                        borderWidth: 1.2,
                        borderColor: isGolden ? `${colors.gold}80` : `${colors.primary}80`,
                        paddingVertical: 10,
                        alignItems: 'center',
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Text style={{ color: isGolden ? colors.gold : colors.primary, fontSize: 12, fontWeight: '800' }}>
                      👁️ Seleccionar y Visualizar este Plan
                    </Text>
                  </Pressable>
                )
              ) : isCurrentActive ? (
                <View
                  style={{
                    marginTop: 15,
                    borderRadius: 12,
                    backgroundColor: isGolden ? `${colors.gold}25` : '#211134',
                    borderWidth: 1,
                    borderColor: isGolden ? colors.gold : colors.primary,
                    paddingVertical: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: isGolden ? colors.gold : colors.primary, fontSize: 12, fontWeight: '800' }}>
                    ✓ TU PLAN ACTUAL
                  </Text>
                </View>
              ) : active ? (
                <View
                  style={{
                    marginTop: 15,
                    borderRadius: 12,
                    backgroundColor: isGolden ? `${colors.gold}25` : '#211134',
                    borderWidth: 1,
                    borderColor: isGolden ? colors.gold : colors.primary,
                    paddingVertical: 10,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: isGolden ? colors.gold : colors.primary, fontSize: 12, fontWeight: '800' }}>
                    PLAN SELECCIONADO
                  </Text>
                </View>
              ) : (
                <Pressable
                  onPress={() => setSelected(plan.id)}
                  style={({ pressed }) => [
                    {
                      marginTop: 15,
                      borderRadius: 12,
                      backgroundColor: `${colors.primary}18`,
                      borderWidth: 1,
                      borderColor: `${colors.primary}50`,
                      paddingVertical: 10,
                      alignItems: 'center',
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '800' }}>
                    Elegir este Plan
                  </Text>
                </Pressable>
              )}
            </Pressable>
          );
        })}

        <Pressable onPress={() => Alert.alert('RevenueCat configurado', 'La selección visual está lista y los códigos de regalo funcionan de inmediato.')} style={{ alignItems: 'center', paddingVertical: 13 }}>
          <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>Ver detalles de suscripción</Text>
        </Pressable>
      </ScrollView>

      {/* Modal Canjear Código */}
      <Modal visible={redeemModalOpen} animationType="slide" transparent onRequestClose={() => setRedeemModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.82)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#160F20', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, borderTopWidth: 1.5, borderColor: colors.gold }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name="gift" size={20} color={colors.gold} />
                <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800' }}>Canjear Código de Regalía</Text>
              </View>
              <Pressable onPress={() => setRedeemModalOpen(false)} hitSlop={10}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 18, marginBottom: 14 }}>
              Ingresa el código proporcionado por tu entrenador para activar tu membresía Pro o Platinum de cortesía.
            </Text>

            <TextInput
              value={redeemCode}
              onChangeText={setRedeemCode}
              autoCapitalize="characters"
              placeholder="Ej. REGALO-GOLD-30D"
              placeholderTextColor="#776E85"
              style={{
                backgroundColor: '#231535',
                borderColor: colors.gold,
                borderWidth: 1.2,
                borderRadius: 14,
                paddingHorizontal: 16,
                paddingVertical: 14,
                color: '#FFFFFF',
                fontSize: 16,
                fontWeight: '800',
                letterSpacing: 1.2,
                marginBottom: 12,
              }}
            />

            {redeemFeedback ? (
              <View
                style={{
                  backgroundColor: redeemFeedback.success ? 'rgba(16, 185, 129, 0.15)' : 'rgba(239, 68, 68, 0.15)',
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: redeemFeedback.success ? '#10B981' : '#EF4444',
                  marginBottom: 14,
                }}
              >
                <Text style={{ color: redeemFeedback.success ? '#10B981' : '#EF4444', fontSize: 12, fontWeight: '700' }}>
                  {redeemFeedback.message}
                </Text>
              </View>
            ) : null}

            <Pressable
              onPress={handleRedeem}
              disabled={redeeming}
              style={{
                backgroundColor: colors.gold,
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              {redeeming ? <ActivityIndicator color="#000000" /> : <Feather name="check-circle" size={18} color="#000000" />}
              <Text style={{ color: '#000000', fontSize: 14, fontWeight: '800' }}>
                {redeeming ? 'Validando...' : 'Activar Membresía'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}