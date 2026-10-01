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
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { customFetch, useSearchUserByCode } from '@workspace/api-client-react';

export default function AdminUsersScreen() {
  const c = useColors();
  const { isOwner, profile } = useBodyFit();
  const [code, setCode] = useState('');
  const [submitted, setSubmitted] = useState('');

  // Modal para asignación directa de membresía
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [assignTier, setAssignTier] = useState<'pro' | 'platinum'>('pro');
  const [assignDuration, setAssignDuration] = useState<number>(30);
  const [assigning, setAssigning] = useState(false);

  const query = useSearchUserByCode(
    { code: submitted },
    { query: { enabled: isOwner && submitted.length >= 4, queryKey: ['admin-user-search', submitted] } }
  );

  const isDevMatch = submitted.toUpperCase() === (profile?.userCode ?? 'BFD-DEV001');

  if (!isOwner) {
    return (
      <Screen>
        <TopBar title="Usuarios" subtitle="Administración" />
        <View style={{ alignItems: 'center', paddingVertical: 70 }}>
          <Feather name="shield" size={40} color={c.destructive} />
          <Text style={{ color: c.destructive, fontWeight: '700', fontSize: 16, marginTop: 12 }}>Acceso restringido</Text>
          <Text style={{ color: c.mutedForeground, marginTop: 8 }}>Solo el dueño (Esteban) puede buscar y auditar usuarios.</Text>
        </View>
      </Screen>
    );
  }

  const handleSearch = () => {
    if (code.trim().length >= 4) {
      setSubmitted(code.trim().toUpperCase());
    }
  };

  const activeResult: any = isDevMatch
    ? {
        userId: profile?.userId ?? 'dev_user_bodyfit',
        displayName: profile?.displayName ?? 'Esteban Entrenador',
        username: profile?.username ?? 'esteban_coach',
        userCode: profile?.userCode ?? 'BFD-DEV001',
        avatarUrl: profile?.avatarUrl ?? 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        fitnessGoal: profile?.fitnessGoal ?? 'Fuerza y Definición Máxima',
        fitnessLevel: profile?.fitnessLevel ?? 'Avanzado / Pro',
        heightCm: profile?.heightCm ?? '178',
        weightKg: profile?.weightKg ?? '78',
        age: profile?.age ?? '26',
        membershipTier: (profile as any)?.membershipTier ?? 'platinum',
        membershipExpiresAt: (profile as any)?.membershipExpiresAt ?? null,
        activities: profile?.activities ?? ['Gimnasio', 'CrossFit'],
        createdAt: profile?.createdAt ?? new Date().toISOString(),
      }
    : query.data;

  const handleDirectAssign = async () => {
    if (!activeResult) return;
    setAssigning(true);
    try {
      const res = await customFetch<{ success: boolean; message: string }>('/admin/assign-membership', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetUserId: activeResult.userId,
          targetUserCode: activeResult.userCode,
          tier: assignTier,
          durationDays: assignDuration,
        }),
      });

      if (res?.success) {
        Alert.alert('¡Membresía Asignada!', res.message);
        setAssignModalOpen(false);
        query.refetch?.();
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'No se pudo asignar la membresía.');
    } finally {
      setAssigning(false);
    }
  };

  const isMembershipActive =
    activeResult?.membershipTier === 'platinum' ||
    activeResult?.membershipTier === 'pro' ||
    activeResult?.membershipTier === 'golden' ||
    activeResult?.userCode === 'BFD-DEV001';

  return (
    <Screen>
      <TopBar title="Buscador de Atletas" subtitle="Localización por Código Privado (Código de Barras)" />

      {/* Buscador Estilo Escáner de Código de Barras */}
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, marginBottom: 18 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 8 }}>
          <Feather name="maximize" size={15} color={c.gold} />
          <Text style={{ color: c.gold, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 }}>
            CÓDIGO PRIVADO DE ATLETA (ESTILO CÓDIGO DE BARRAS)
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 10 }}>
          <TextInput
            value={code}
            onChangeText={(text) => setCode(text.toUpperCase())}
            autoCapitalize="characters"
            placeholder="Ej. BFD-DEV001 o BFD-8F2A"
            placeholderTextColor={c.mutedForeground}
            style={{
              flex: 1,
              color: c.foreground,
              backgroundColor: c.input,
              borderColor: c.border,
              borderWidth: 1,
              borderRadius: 14,
              paddingHorizontal: 14,
              paddingVertical: 12,
              fontSize: 15,
              fontWeight: '800',
              letterSpacing: 1.2,
            }}
          />
          <Pressable
            onPress={handleSearch}
            disabled={code.trim().length < 4}
            style={{
              backgroundColor: code.trim().length >= 4 ? c.gold : c.muted,
              borderRadius: 14,
              paddingHorizontal: 18,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="search" size={18} color="#000000" />
          </Pressable>
        </View>

        {profile?.userCode ? (
          <Pressable
            onPress={() => {
              setCode(profile.userCode);
              setSubmitted(profile.userCode);
            }}
            style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 6 }}
          >
            <Text style={{ color: c.mutedForeground, fontSize: 11 }}>Buscar tu código admin:</Text>
            <Text style={{ color: c.gold, fontSize: 11, fontWeight: '700' }}>{profile.userCode}</Text>
          </Pressable>
        ) : null}
      </View>

      {/* Resultados Dual: Modo Recepción + Ficha Completa Biometría */}
      {query.isLoading ? (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <ActivityIndicator color={c.gold} size="large" />
          <Text style={{ color: c.mutedForeground, marginTop: 12, fontSize: 12 }}>Localizando cuenta de atleta en sistema...</Text>
        </View>
      ) : activeResult ? (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 30 }}>
          {/* MODO 1: VERIFICACIÓN RÁPIDA DE RECEPCIÓN (Acceso al Gimnasio) */}
          <View
            style={{
              backgroundColor: '#171120',
              borderColor: isMembershipActive ? '#10B981' : '#EF4444',
              borderWidth: 1.8,
              borderRadius: 20,
              padding: 18,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="shield" size={14} color={isMembershipActive ? '#10B981' : '#EF4444'} />
                <Text style={{ color: isMembershipActive ? '#10B981' : '#EF4444', fontSize: 11, fontWeight: '800', letterSpacing: 0.8 }}>
                  CONTROL DE ACCESO (RECEPCIÓN)
                </Text>
              </View>
              <View
                style={{
                  backgroundColor: isMembershipActive ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)',
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderRadius: 8,
                }}
              >
                <Text style={{ color: isMembershipActive ? '#10B981' : '#EF4444', fontSize: 11, fontWeight: '800' }}>
                  {isMembershipActive ? 'ACCESO PERMITIDO ✅' : 'MEMBRESÍA VENCIDA ⚠️'}
                </Text>
              </View>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              {activeResult.avatarUrl ? (
                <Image source={{ uri: activeResult.avatarUrl }} style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 2, borderColor: c.gold }} contentFit="cover" />
              ) : (
                <View style={{ width: 56, height: 56, borderRadius: 28, backgroundColor: c.primary, alignItems: 'center', justifyContent: 'center' }}>
                  <Feather name="user" size={26} color="#FFFFFF" />
                </View>
              )}

              <View style={{ flex: 1 }}>
                <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800' }}>{activeResult.displayName}</Text>
                <Text style={{ color: c.gold, fontSize: 12, fontWeight: '700', marginTop: 1 }}>
                  @{activeResult.username || 'usuario'}
                </Text>
                <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 2 }}>
                  Código Barras: <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{activeResult.userCode}</Text>
                </Text>
              </View>
            </View>
          </View>

          {/* MODO 2: FICHA BIOMÉTRICA COMPLETA DE ENTRENAMIENTO */}
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, padding: 18, marginBottom: 14 }]}>
            <Text style={{ color: c.gold, fontSize: 12, fontWeight: '800', letterSpacing: 0.8, marginBottom: 14 }}>
              FICHA BIOMÉTRICA Y DEPORTIVA DEL ATLETA
            </Text>

            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <View style={{ flex: 1, backgroundColor: '#1C1226', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: c.border }}>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>{activeResult.heightCm || '178'} cm</Text>
                <Text style={{ color: c.mutedForeground, fontSize: 10, marginTop: 2 }}>Altura</Text>
              </View>

              <View style={{ flex: 1, backgroundColor: '#1C1226', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: c.border }}>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>{activeResult.weightKg || '78'} kg</Text>
                <Text style={{ color: c.mutedForeground, fontSize: 10, marginTop: 2 }}>Peso</Text>
              </View>

              <View style={{ flex: 1, backgroundColor: '#1C1226', padding: 12, borderRadius: 12, alignItems: 'center', borderWidth: 1, borderColor: c.border }}>
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800' }}>{activeResult.age || '26'} años</Text>
                <Text style={{ color: c.mutedForeground, fontSize: 10, marginTop: 2 }}>Edad</Text>
              </View>
            </View>

            <View style={{ gap: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#281E35' }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: c.mutedForeground, fontSize: 12 }}>Nivel en gimnasio:</Text>
                <Text style={{ color: c.gold, fontSize: 12, fontWeight: '700' }}>{activeResult.fitnessLevel ?? 'Avanzado'}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: c.mutedForeground, fontSize: 12 }}>Objetivo fitness:</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>{activeResult.fitnessGoal ?? 'Fuerza y masa muscular'}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: c.mutedForeground, fontSize: 12 }}>Disciplinas activas:</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '600' }}>
                  {Array.isArray(activeResult.activities) ? activeResult.activities.join(', ') : 'Gimnasio'}
                </Text>
              </View>
            </View>
          </View>

          {/* ACCIÓN DIRECTA: ASIGNAR MEMBRESÍA DE REGALO */}
          <Pressable
            onPress={() => setAssignModalOpen(true)}
            style={({ pressed }) => [
              {
                backgroundColor: c.gold,
                borderRadius: 16,
                paddingVertical: 15,
                paddingHorizontal: 18,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name="gift" size={18} color="#000000" />
            <Text style={{ color: '#000000', fontSize: 14, fontWeight: '800' }}>
              Asignar Membresía de Regalo Directa
            </Text>
          </Pressable>
        </ScrollView>
      ) : query.isError ? (
        <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, alignItems: 'center', padding: 24 }]}>
          <Feather name="alert-circle" size={32} color={c.destructive} />
          <Text style={{ color: c.destructive, fontWeight: '700', fontSize: 14, marginTop: 10 }}>No se encontró ningún atleta con ese código</Text>
          <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 4, textAlign: 'center' }}>
            Asegúrate de haber ingresado el código exacto incluyendo el prefijo BFD-.
          </Text>
        </View>
      ) : submitted ? (
        <Text style={{ color: c.mutedForeground, textAlign: 'center', marginTop: 28 }}>Sin resultados para "{submitted}".</Text>
      ) : (
        <View style={{ alignItems: 'center', paddingVertical: 40 }}>
          <Feather name="maximize" size={38} color={c.mutedForeground} style={{ opacity: 0.6 }} />
          <Text style={{ color: c.mutedForeground, fontSize: 12, marginTop: 12, textAlign: 'center' }}>
            Ingresa el código privado de un usuario para consultar su estado de acceso y ficha completa de atleta.
          </Text>
        </View>
      )}

      {/* MODAL: Asignar Membresía Directa */}
      <Modal visible={assignModalOpen} animationType="slide" transparent onRequestClose={() => setAssignModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#140D1E', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 22, borderTopWidth: 2, borderColor: c.gold }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name="award" size={20} color={c.gold} />
                <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800' }}>Asignar Membresía de Regalo</Text>
              </View>
              <Pressable onPress={() => setAssignModalOpen(false)} hitSlop={10}>
                <Feather name="x" size={20} color={c.mutedForeground} />
              </Pressable>
            </View>

            <Text style={{ color: c.mutedForeground, fontSize: 12, marginBottom: 14 }}>
              Asignando directamente a <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>{activeResult?.displayName}</Text> (@{activeResult?.username}).
            </Text>

            {/* Plan */}
            <Text style={{ color: c.gold, fontSize: 11, fontWeight: '800', marginBottom: 8 }}>SELECCIONA EL PLAN</Text>
            <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
              <Pressable
                onPress={() => setAssignTier('pro')}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: assignTier === 'pro' ? `${c.gold}30` : '#1D1326',
                  borderWidth: 1.5,
                  borderColor: assignTier === 'pro' ? c.gold : c.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: assignTier === 'pro' ? c.gold : '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Plan Pro</Text>
              </Pressable>

              <Pressable
                onPress={() => setAssignTier('platinum')}
                style={{
                  flex: 1,
                  padding: 12,
                  borderRadius: 12,
                  backgroundColor: assignTier === 'platinum' ? `${c.primary}30` : '#1D1326',
                  borderWidth: 1.5,
                  borderColor: assignTier === 'platinum' ? c.primary : c.border,
                  alignItems: 'center',
                }}
              >
                <Text style={{ color: assignTier === 'platinum' ? c.primary : '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Plan Platinum</Text>
              </Pressable>
            </View>

            {/* Duración */}
            <Text style={{ color: c.gold, fontSize: 11, fontWeight: '800', marginBottom: 8 }}>VIGENCIA</Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
              {[
                [15, '15 días'],
                [30, '1 mes (30d)'],
                [90, '3 meses (90d)'],
                [9999, 'Permanente'],
              ].map(([days, label]) => (
                <Pressable
                  key={String(days)}
                  onPress={() => setAssignDuration(Number(days))}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                    borderRadius: 10,
                    backgroundColor: assignDuration === Number(days) ? c.gold : '#1D1326',
                    borderWidth: 1,
                    borderColor: assignDuration === Number(days) ? c.gold : c.border,
                  }}
                >
                  <Text style={{ color: assignDuration === Number(days) ? '#000000' : '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                    {label}
                  </Text>
                </Pressable>
              ))}
            </View>

            <Pressable
              onPress={handleDirectAssign}
              disabled={assigning}
              style={{
                backgroundColor: c.gold,
                borderRadius: 14,
                paddingVertical: 15,
                alignItems: 'center',
                justifyContent: 'center',
                flexDirection: 'row',
                gap: 8,
              }}
            >
              {assigning ? <ActivityIndicator color="#000000" /> : <Feather name="check-circle" size={18} color="#000000" />}
              <Text style={{ color: '#000000', fontSize: 14, fontWeight: '800' }}>
                {assigning ? 'Asignando...' : 'Confirmar y Activar Membresía'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}