import { Feather } from '@expo/vector-icons';
import { Pedometer } from 'expo-sensors';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Clipboard,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { BrandMark, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { NotificationsModal, useNotifications } from '@/components/NotificationsModal';
import { hasTierAccess } from '@/constants/membershipConfig';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { customFetch } from '@workspace/api-client-react';

interface AdminGiftCode {
  id: string;
  code: string;
  tier: 'pro' | 'platinum';
  durationDays: number;
  durationLabel: string;
  isActive: boolean;
  createdAt: string;
}

export default function ProfileScreen() {
  const colors = useColors();
  const {
    isOwner,
    isAdminModeActive,
    previewClientFree,
    setPreviewClientFree,
    stats,
    setSteps,
    profile,
    profileLoading,
    profileError,
    membership,
    membershipLabel,
    redeemGiftCode,
    streakDetails,
    unlockedMedals,
  } = useBodyFit();

  const { notifications, unreadCount } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [healthConnected, setHealthConnected] = useState(false);
  const [syncingHealth, setSyncingHealth] = useState(false);

  // Modal Canjear Código (Usuario)
  const [redeemModalOpen, setRedeemModalOpen] = useState(false);
  const [redeemInput, setRedeemInput] = useState('');
  const [redeeming, setRedeeming] = useState(false);
  const [redeemFeedback, setRedeemFeedback] = useState<{ success: boolean; message: string } | null>(null);

  // Modal Administrador Códigos de Regalía
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [adminCodes, setAdminCodes] = useState<AdminGiftCode[]>([]);
  const [loadingAdminCodes, setLoadingAdminCodes] = useState(false);
  const [creatingCode, setCreatingCode] = useState(false);
  const [newCodeCustom, setNewCodeCustom] = useState('');
  const [newCodeTier, setNewCodeTier] = useState<'pro' | 'platinum'>('pro');
  const [newCodeDuration, setNewCodeDuration] = useState<number>(30);
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const fetchAdminCodes = async () => {
    if (!isAdminModeActive) return;
    setLoadingAdminCodes(true);
    try {
      const data = await customFetch<AdminGiftCode[]>('/admin/gift-codes');
      if (Array.isArray(data)) setAdminCodes(data);
    } catch {
      // Ignorar si falla
    } finally {
      setLoadingAdminCodes(false);
    }
  };

  useEffect(() => {
    if (adminModalOpen && isAdminModeActive) {
      fetchAdminCodes();
    }
  }, [adminModalOpen, isAdminModeActive]);

  const handleCreateGiftCode = async () => {
    setCreatingCode(true);
    try {
      const durationLabels: Record<number, string> = {
        15: '15 días de cortesía',
        30: '1 mes (30 días)',
        90: '3 meses (90 días)',
        9999: 'Permanente (Honorario)',
      };

      const result = await customFetch<AdminGiftCode>('/admin/gift-codes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: newCodeCustom.trim() || undefined,
          tier: newCodeTier,
          durationDays: newCodeDuration,
          durationLabel: durationLabels[newCodeDuration] || `${newCodeDuration} días`,
        }),
      });

      if (result) {
        setAdminCodes((prev) => [result, ...prev]);
        setNewCodeCustom('');
        Alert.alert('¡Código Generado!', `Código: ${result.code} (${result.durationLabel})`);
      }
    } catch (err: any) {
      Alert.alert('Error al generar', err?.message || 'No se pudo crear el código.');
    } finally {
      setCreatingCode(false);
    }
  };

  const handleCopyCode = (code: string) => {
    Clipboard.setString(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  const handleRedeem = async () => {
    const code = redeemInput.trim();
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
        setRedeemInput('');
      }
    } finally {
      setRedeeming(false);
    }
  };

  const connectHealth = async () => {
    if (Platform.OS === 'web') {
      Alert.alert('Disponible en iPhone', 'La sincronización de pasos se activa al abrir la app en un iPhone.');
      return;
    }
    setSyncingHealth(true);
    try {
      const available = await Pedometer.isAvailableAsync();
      if (!available) {
        Alert.alert('No disponible', 'Este dispositivo no ofrece acceso al contador de pasos.');
        return;
      }
      const permission = await Pedometer.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permiso necesario', 'Permite el acceso a actividad para leer tus pasos.');
        return;
      }
      const end = new Date();
      const start = new Date(end);
      start.setHours(0, 0, 0, 0);
      const result = await Pedometer.getStepCountAsync(start, end);
      setSteps(result.steps);
      setHealthConnected(true);
    } catch {
      Alert.alert('No se pudo sincronizar', 'Intenta de nuevo desde un iPhone con permisos de actividad activados.');
    } finally {
      setSyncingHealth(false);
    }
  };

  // Métricas Biométricas acordadas en /grill-me (Altura, Peso, Edad)
  const statCards: Array<[string, string]> = [
    [`${profile?.heightCm || '178'} cm`, 'Altura'],
    [`${profile?.weightKg || '78'} kg`, 'Peso'],
    [`${profile?.age || '26'} años`, 'Edad'],
  ];

  return (
    <Screen>
      <TopBar
        title="Perfil"
        subtitle="Tu espacio personal"
        onPress={() => setNotificationsOpen(true)}
        notificationCount={unreadCount}
      />

      {/* Tarjeta de Usuario con Identidad Social @username */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 24 }]}>
        {profile?.avatarUrl ? (
          <Image source={{ uri: profile.avatarUrl }} contentFit="cover" style={{ width: 80, height: 80, borderRadius: 40, borderWidth: 3, borderColor: colors.gold }} />
        ) : (
          <View style={{ width: 80, height: 80, borderRadius: 40, backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center', borderWidth: 3, borderColor: colors.gold }}>
            <Feather name="user" size={34} color="#FFFFFF" />
          </View>
        )}
        <Text style={{ color: colors.foreground, fontSize: 19, fontWeight: '800', marginTop: 12 }}>
          {profileLoading ? 'Cargando perfil...' : profile?.displayName || 'Atleta BodyFit'}
        </Text>

        {/* Nombre de Usuario Único Social (@username) */}
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 4 }}>
          <Text selectable style={{ color: colors.gold, fontSize: 13, fontWeight: '700' }}>
            @{profile?.username || 'usuario_bodyfit'}
          </Text>
          <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: colors.gold, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="check" size={9} color="#000000" />
          </View>
        </View>

        {/* 3 Métricas Biométricas: Altura, Peso y Edad */}
        <View style={{ flexDirection: 'row', gap: 36, marginTop: 20 }}>
          {statCards.map(([value, label]) => (
            <View key={label} style={{ alignItems: 'center' }}>
              <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800' }}>{value}</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 3 }}>{label}</Text>
            </View>
          ))}
        </View>
      </View>

      {/* Botón Canjear Código de Regalía de Membresías */}
      <Pressable
        onPress={() => {
          setRedeemFeedback(null);
          setRedeemModalOpen(true);
        }}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: '#1E1428',
            borderColor: `${colors.gold}70`,
            borderWidth: 1.5,
            marginTop: 14,
            padding: 16,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12, flex: 1 }}>
          <View style={{ width: 42, height: 42, borderRadius: 14, backgroundColor: `${colors.gold}25`, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: `${colors.gold}60` }}>
            <Feather name="gift" size={20} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '800' }}>¿Tienes un código de regalía?</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>Activa membresías Pro o Platinum de cortesía</Text>
          </View>
        </View>
        <View style={{ backgroundColor: `${colors.gold}22`, paddingHorizontal: 13, paddingVertical: 7, borderRadius: 10, borderWidth: 1, borderColor: `${colors.gold}70` }}>
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>Canjear</Text>
        </View>
      </Pressable>



      {/* Membresía */}
      <SectionHeader title="Tu membresía" />
      <Pressable onPress={() => router.push('/plans')} style={({ pressed }) => [{ opacity: pressed ? 0.8 : 1 }]}>
        <View style={{ backgroundColor: '#2A1A0B', borderRadius: 19, padding: 17, borderWidth: 1, borderColor: '#654A17' }}>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={styles.row}>
              <View style={{ width: 36, height: 36, backgroundColor: colors.gold, borderRadius: 12, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="award" color={colors.accentForeground} size={18} />
              </View>
              <View style={{ marginLeft: 11 }}>
                <Text style={{ color: colors.gold, fontWeight: '700', fontSize: 10, letterSpacing: 1 }}>PLAN ACTUAL</Text>
                <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '700', marginTop: 3 }}>
                  {membershipLabel}
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" color={colors.gold} size={18} />
          </View>
          <Text style={{ color: '#C8BBA0', fontSize: 11, marginTop: 14 }}>
            {isAdminModeActive ? 'Tu cuenta de entrenador tiene acceso completo a todas las funciones.' : 'Plan activo en BodyFit Dynasty. Toca para ver beneficios y detalles.'}
          </Text>
        </View>
      </Pressable>

      {isAdminModeActive ? (
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginTop: 12, paddingVertical: 12 }]}>
          <View style={[styles.row, styles.spaceBetween]}>
            <View style={{ flex: 1, paddingRight: 12 }}>
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Previsualizar plan Gratis</Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 4 }}>Comprueba cómo verá la app un cliente sin suscripción.</Text>
            </View>
            <Switch testID="preview-free-switch" value={previewClientFree} onValueChange={setPreviewClientFree} trackColor={{ false: colors.muted, true: colors.primary }} thumbColor={colors.foreground} />
          </View>
        </View>
      ) : null}

      {/* Tarjeta de Racha y Constancia Dynasty */}
      <View style={[styles.card, { backgroundColor: '#1A1320', borderColor: `${colors.gold}50`, marginTop: 14, padding: 16 }]}>
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Feather name="zap" size={18} color="#FF5500" />
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '800' }}>
              Racha & Constancia Dynasty
            </Text>
          </View>
          <View style={{ backgroundColor: 'rgba(255, 85, 0, 0.2)', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 8, borderWidth: 1, borderColor: '#FF550066' }}>
            <Text style={{ color: '#FF5500', fontSize: 10, fontWeight: '800' }}>
              🔥 {streakDetails.currentStreak} {streakDetails.currentStreak === 1 ? 'DÍA' : 'DÍAS'}
            </Text>
          </View>
        </View>

        <View style={{ flexDirection: 'row', gap: 8 }}>
          <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ color: colors.gold, fontSize: 14, fontWeight: '800' }}>{streakDetails.bestStreak || streakDetails.currentStreak} d</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Mejor récord</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ color: '#00E5FF', fontSize: 14, fontWeight: '800' }}>{streakDetails.activeDays || 1} d</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Días activos</Text>
          </View>
          <View style={{ flex: 1, backgroundColor: 'rgba(255, 255, 255, 0.03)', padding: 10, borderRadius: 10, alignItems: 'center' }}>
            <Text style={{ color: '#10B981', fontSize: 14, fontWeight: '800' }}>{streakDetails.savedStreaksCount || 0}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Salvadas</Text>
          </View>
        </View>
      </View>

      {/* Tarjeta de Atención 24/7 Golden */}
      <Pressable
        onPress={() => router.push('/trainer-chat' as never)}
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: '#1C1326',
            borderColor: colors.gold,
            borderWidth: 1.5,
            marginTop: 14,
            padding: 16,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
            <View style={{ width: 40, height: 40, borderRadius: 14, backgroundColor: `${colors.gold}25`, alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: colors.gold }}>
              <Feather name="message-circle" size={20} color={colors.gold} />
            </View>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '800' }}>
                  Atención 24/7 Golden
                </Text>
                <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                  <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>COACHES VIP</Text>
                </View>
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
                Canal directo con entrenadores designados
              </Text>
            </View>
          </View>
          <Feather name="chevron-right" size={18} color={colors.gold} />
        </View>

        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: 'rgba(255, 255, 255, 0.03)', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#10B981' }} />
            <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>Head Coach Esteban en línea</Text>
          </View>
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700' }}>
            {hasTierAccess(membership, 'golden') || isAdminModeActive ? 'Chatear ahora →' : 'Ver detalles →'}
          </Text>
        </View>
      </Pressable>

      {/* Menú de Cuenta */}
      <SectionHeader title="Cuenta" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, paddingVertical: 4 }]}>
        {[
          ['edit-3' as const, 'Editar perfil (Nombre, usuario, biometría)', '/profile-edit'],
          ['bar-chart-2' as const, 'Mi progreso', '/progress'],
          ['message-circle' as const, 'Atención 24/7 Golden (Coaches)', '/trainer-chat'],
          ['award' as const, `Vitrina de Medallas (${unlockedMedals.length} de 35)`, '/achievements'],
          ['book-open' as const, 'Recetas', '/recipes'],
          ['grid' as const, 'Widgets & Apple Watch', '/widgets'],
          ['settings' as const, 'Configuración', '/settings'],
        ].map(([icon, label, route], index, items) => (
          <Pressable
            key={label}
            onPress={() => router.push(route as never)}
            style={[styles.row, { paddingVertical: 14, borderBottomWidth: index === items.length - 1 && !isAdminModeActive ? 0 : 1, borderBottomColor: colors.border }]}
          >
            <Feather name={icon as keyof typeof Feather.glyphMap} size={17} color={colors.mutedForeground} />
            <Text style={{ color: colors.foreground, fontSize: 13, flex: 1, marginLeft: 13 }}>{label}</Text>
            <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
          </Pressable>
        ))}

        {/* Panel de Administrador de Esteban (Solo visible en Modo Administrador Activo) */}
        {isAdminModeActive ? (
          <>
            {/* 1. Generador de Códigos de Regalía */}
            <Pressable
              onPress={() => setAdminModalOpen(true)}
              style={[
                styles.row,
                {
                  paddingVertical: 14,
                  backgroundColor: `${colors.gold}20`,
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  marginTop: 8,
                  borderWidth: 1.2,
                  borderColor: `${colors.gold}70`,
                },
              ]}
            >
              <Feather name="gift" size={18} color={colors.gold} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '800' }}>Generador de Códigos de Regalía</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1 }}>Crear y enviar membresías Pro/Platinum (15d, 30d, 90d, permanente)</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.gold} />
            </Pressable>

            {/* 2. Buscador de Usuarios tipo Código de Barras */}
            <Pressable
              onPress={() => router.push('/admin-users' as never)}
              style={[
                styles.row,
                {
                  paddingVertical: 14,
                  backgroundColor: '#1E1428',
                  borderRadius: 14,
                  paddingHorizontal: 12,
                  marginTop: 6,
                  borderWidth: 1,
                  borderColor: `${colors.primary}60`,
                },
              ]}
            >
              <Feather name="maximize" size={18} color={colors.primary} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '800' }}>Buscador de Atletas (Código Privado)</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1 }}>Localización tipo código de barras para recepción y auditoría</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>

            {/* 3. Panel de Administrador General */}
            <Pressable
              onPress={() => router.push('/admin-dashboard' as never)}
              style={[styles.row, { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <Feather name="sliders" size={17} color={colors.gold} />
              <Text style={{ color: colors.foreground, fontSize: 13, flex: 1, marginLeft: 13 }}>Panel de Control General</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>

            {/* 4. Gestión de Tienda */}
            <Pressable
              onPress={() => router.push('/admin-store' as never)}
              style={[styles.row, { paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: colors.border }]}
            >
              <Feather name="shopping-bag" size={17} color={colors.primary} />
              <Text style={{ color: colors.foreground, fontSize: 13, flex: 1, marginLeft: 13 }}>Gestión de Tienda y Suplementos</Text>
              <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
            </Pressable>

            {/* 5. Gestión de Entrenadores Designados */}
            <Pressable onPress={() => router.push('/admin-trainers' as never)} style={[styles.row, { paddingVertical: 14 }]}>
              <Feather name="users" size={17} color={colors.gold} />
              <View style={{ flex: 1, marginLeft: 13 }}>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Gestión de Entrenadores Designados</Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1 }}>Modificar nombres, fotos de perfil, biografías y especialidades</Text>
              </View>
              <Feather name="chevron-right" size={16} color={colors.gold} />
            </Pressable>
          </>
        ) : null}
      </View>

      {/* Conectividad */}
      <SectionHeader title="Conectividad" />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <Pressable testID="connect-health-button" onPress={connectHealth} style={styles.row}>
          <View style={{ width: 35, height: 35, borderRadius: 11, backgroundColor: '#1A1A1A', alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="heart" size={16} color={colors.destructive} />
          </View>
          <View style={{ flex: 1, marginLeft: 11 }}>
            <Text style={{ color: colors.foreground, fontWeight: '600', fontSize: 13 }}>Apple Health</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 3 }}>
              {healthConnected ? `${stats.steps.toLocaleString()} pasos sincronizados` : 'Pasos y actividad del iPhone'}
            </Text>
          </View>
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700' }}>
            {syncingHealth ? 'Leyendo...' : healthConnected ? 'Conectado' : 'Conectar'}
          </Text>
        </Pressable>
      </View>

      <View style={{ alignItems: 'center', marginTop: 25, paddingBottom: 12 }}>
        <BrandMark size={32} />
        <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 8 }}>BodyFit Dynasty® · v1.0</Text>
      </View>

      <NotificationsModal visible={notificationsOpen} onClose={() => setNotificationsOpen(false)} />

      {/* MODAL 1: Canjear Código de Regalía (Usuario) */}
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
              Ingresa el código promocional o de cortesía proporcionado por tu entrenador Esteban para activar tu membresía.
            </Text>

            <TextInput
              value={redeemInput}
              onChangeText={setRedeemInput}
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
              style={({ pressed }) => [
                {
                  backgroundColor: colors.gold,
                  borderRadius: 14,
                  paddingVertical: 15,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed || redeeming ? 0.75 : 1,
                  flexDirection: 'row',
                  gap: 8,
                },
              ]}
            >
              {redeeming ? <ActivityIndicator color="#000000" /> : <Feather name="check-circle" size={18} color="#000000" />}
              <Text style={{ color: '#000000', fontSize: 14, fontWeight: '800' }}>
                {redeeming ? 'Validando...' : 'Activar Membresía'}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* MODAL 2: Administrador - Generador de Códigos de Regalía */}
      <Modal visible={adminModalOpen} animationType="slide" transparent onRequestClose={() => setAdminModalOpen(false)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
          <View style={{ backgroundColor: '#130C1C', borderTopLeftRadius: 24, borderTopRightRadius: 24, maxHeight: '88%', padding: 20, borderTopWidth: 2, borderColor: colors.gold }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <Feather name="shield" size={20} color={colors.gold} />
                <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800' }}>Generar Códigos de Regalía</Text>
              </View>
              <Pressable onPress={() => setAdminModalOpen(false)} hitSlop={10}>
                <Feather name="x" size={20} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 25 }}>
              {/* Selector de Plan */}
              <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', marginBottom: 8, letterSpacing: 0.8 }}>
                1. SELECCIONA EL PLAN A REGALAR
              </Text>
              <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                <Pressable
                  onPress={() => setNewCodeTier('pro')}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: newCodeTier === 'pro' ? `${colors.gold}30` : '#1D1326',
                    borderWidth: 1.5,
                    borderColor: newCodeTier === 'pro' ? colors.gold : colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: newCodeTier === 'pro' ? colors.gold : '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Plan Pro</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Nutrición & Catálogo</Text>
                </Pressable>

                <Pressable
                  onPress={() => setNewCodeTier('platinum')}
                  style={{
                    flex: 1,
                    padding: 12,
                    borderRadius: 12,
                    backgroundColor: newCodeTier === 'platinum' ? `${colors.primary}30` : '#1D1326',
                    borderWidth: 1.5,
                    borderColor: newCodeTier === 'platinum' ? colors.primary : colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: newCodeTier === 'platinum' ? colors.primary : '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Plan Platinum</Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Acceso Total Sin Límites</Text>
                </Pressable>
              </View>

              {/* Selector de Vigencia acordado en /grill-me */}
              <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', marginBottom: 8, letterSpacing: 0.8 }}>
                2. VIGENCIA DEL CÓDIGO
              </Text>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
                {[
                  [15, '15 días'],
                  [30, '1 mes (30d)'],
                  [90, '3 meses (90d)'],
                  [9999, 'Permanente'],
                ].map(([days, label]) => (
                  <Pressable
                    key={String(days)}
                    onPress={() => setNewCodeDuration(Number(days))}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      borderRadius: 10,
                      backgroundColor: newCodeDuration === Number(days) ? colors.gold : '#1D1326',
                      borderWidth: 1,
                      borderColor: newCodeDuration === Number(days) ? colors.gold : colors.border,
                    }}
                  >
                    <Text style={{ color: newCodeDuration === Number(days) ? '#000000' : '#FFFFFF', fontSize: 11, fontWeight: '800' }}>
                      {label}
                    </Text>
                  </Pressable>
                ))}
              </View>

              {/* Código personalizado opcional */}
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 6 }}>
                Código personalizado (Opcional, déjalo vacío para generar automático):
              </Text>
              <TextInput
                value={newCodeCustom}
                onChangeText={(t) => setNewCodeCustom(t.toUpperCase())}
                autoCapitalize="characters"
                placeholder="Ej. VIP-CLIENTE-MARZO"
                placeholderTextColor="#776E85"
                style={{
                  backgroundColor: '#1E1428',
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 14,
                  paddingVertical: 11,
                  color: '#FFFFFF',
                  fontSize: 14,
                  fontWeight: '700',
                  marginBottom: 14,
                }}
              />

              <Pressable
                onPress={handleCreateGiftCode}
                disabled={creatingCode}
                style={{
                  backgroundColor: colors.gold,
                  borderRadius: 14,
                  paddingVertical: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                }}
              >
                {creatingCode ? <ActivityIndicator color="#000000" /> : <Feather name="plus-circle" size={17} color="#000000" />}
                <Text style={{ color: '#000000', fontSize: 13, fontWeight: '800' }}>
                  {creatingCode ? 'Generando...' : 'Crear y Guardar Código'}
                </Text>
              </Pressable>

              {/* Lista de Códigos Generados */}
              <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '800', marginTop: 22, marginBottom: 10, letterSpacing: 0.8 }}>
                CÓDIGOS ACTIVOS DISPONIBLES ({adminCodes.length})
              </Text>

              {loadingAdminCodes ? (
                <ActivityIndicator color={colors.gold} style={{ marginVertical: 20 }} />
              ) : (
                <View style={{ gap: 8 }}>
                  {adminCodes.map((item) => (
                    <View
                      key={item.id}
                      style={{
                        backgroundColor: '#1C1226',
                        borderColor: item.isActive ? `${colors.gold}60` : colors.border,
                        borderWidth: 1,
                        borderRadius: 12,
                        padding: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View style={{ flex: 1 }}>
                        <Text selectable style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800', letterSpacing: 1 }}>
                          {item.code}
                        </Text>
                        <Text style={{ color: colors.gold, fontSize: 10, marginTop: 2 }}>
                          {item.tier.toUpperCase()} · {item.durationLabel}
                        </Text>
                      </View>

                      <Pressable
                        onPress={() => handleCopyCode(item.code)}
                        style={{
                          backgroundColor: copiedCode === item.code ? '#10B981' : `${colors.gold}25`,
                          paddingHorizontal: 12,
                          paddingVertical: 7,
                          borderRadius: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 5,
                        }}
                      >
                        <Feather name={copiedCode === item.code ? 'check' : 'copy'} size={13} color={copiedCode === item.code ? '#FFFFFF' : colors.gold} />
                        <Text style={{ color: copiedCode === item.code ? '#FFFFFF' : colors.gold, fontSize: 11, fontWeight: '700' }}>
                          {copiedCode === item.code ? 'Copiado' : 'Copiar'}
                        </Text>
                      </Pressable>
                    </View>
                  ))}
                </View>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}
