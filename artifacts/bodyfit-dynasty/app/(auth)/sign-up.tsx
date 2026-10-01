import { useOAuth, useSignUp } from '@clerk/expo';
import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import * as Linking from 'expo-linking';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, Text, View } from 'react-native';
import { AuthButton, AuthError, AuthField, AuthLink, AuthScreen } from '@/components/auth-screen';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

const INITIAL_GYM_MACHINES = [
  { id: 'leg_press_45', name: 'Prensa de Piernas 45°', icon: 'activity' },
  { id: 'hip_thrust_machine', name: 'Hip Thrust Máquina / Smith', icon: 'star' },
  { id: 'smith_overhead_press', name: 'Smith Machine Multipower', icon: 'target' },
  { id: 'lat_pulldown', name: 'Polea Doble / Jalón al Pecho', icon: 'layers' },
  { id: 'seated_abductor_machine', name: 'Máquina Abductores / Glúteos', icon: 'star' },
  { id: 'leg_extension_machine', name: 'Extensiones de Cuádriceps', icon: 'activity' },
  { id: 'seated_leg_curl', name: 'Curl Femoral Tumbado / Sentado', icon: 'compass' },
  { id: 'hack_squat_machine', name: 'Hack Squat (Sentadilla Hack)', icon: 'shield' },
  { id: 'bench_press', name: 'Banco Plano / Mancuernas hasta 40kg', icon: 'shield' },
  { id: 'cable_crossover', name: 'Cables Cruzados / Polea Baja', icon: 'zap' },
] as const;

export default function SignUpScreen() {
  const colors = useColors();
  const { signUp, errors, fetchStatus } = useSignUp();
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { updateProfile } = useBodyFit();

  const [username, setUsername] = useState('');
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  // Configuración inicial de entrenamiento y gym
  const [gender, setGender] = useState<'female' | 'male' | 'other'>('female');
  const [fitnessGoal, setFitnessGoal] = useState<'gluteos_piernas_femenino' | 'hipertrofia' | 'fuerza'>('gluteos_piernas_femenino');
  const [gymPhoto, setGymPhoto] = useState<string | null>(null);
  const [selectedMachines, setSelectedMachines] = useState<string[]>([
    'leg_press_45',
    'hip_thrust_machine',
    'seated_abductor_machine',
  ]);

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para fotografiar las máquinas de tu gym.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.75,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setGymPhoto(uri);
        Alert.alert('¡Foto Registrada!', 'La fotografía de tu gimnasio se ha guardado para adaptar tus rutinas.');
      }
    } catch {
      Alert.alert('Aviso', 'No se pudo abrir la cámara.');
    }
  };

  const handlePickPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la biblioteca para elegir la foto de tu gym.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.75,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const uri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setGymPhoto(uri);
        Alert.alert('¡Foto Registrada!', 'La fotografía de tu gimnasio se ha guardado para adaptar tus rutinas.');
      }
    } catch {
      Alert.alert('Aviso', 'No se pudo abrir la galería.');
    }
  };

  const toggleMachine = (id: string) => {
    if (selectedMachines.includes(id)) {
      setSelectedMachines(selectedMachines.filter((m) => m !== id));
    } else {
      setSelectedMachines([...selectedMachines, id]);
    }
  };

  const handleGoogleSignUp = async () => {
    try {
      await updateProfile({
        username: username.trim() || undefined,
        displayName: username.trim() || 'Atleta Dynasty',
        gender,
        fitnessGoal,
        gymPhotoUrl: gymPhoto ?? undefined,
        trainingPreferences: selectedMachines,
      });

      const { createdSessionId, setActive } = await startOAuthFlow({
        redirectUrl: Linking.createURL('/(tabs)'),
      });
      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        router.replace('/(tabs)');
      }
    } catch (err: unknown) {
      console.warn('OAuth flow message:', err);
      Alert.alert(
        'Google Dynasty',
        'Registro con Google iniciado. También puedes crear tu cuenta directamente con usuario, correo y contraseña.'
      );
    }
  };

  const submit = async () => {
    if (!emailAddress || !password) return;

    await updateProfile({
      username: username.trim() || undefined,
      displayName: username.trim() || 'Atleta Dynasty',
      gender,
      fitnessGoal,
      gymPhotoUrl: gymPhoto ?? undefined,
      trainingPreferences: selectedMachines,
    });

    const result = await signUp.password({ emailAddress, password });
    if (result.error) return;
    await signUp.verifications.sendEmailCode();
  };

  const verify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') {
      await updateProfile({
        username: username.trim() || undefined,
        displayName: username.trim() || 'Atleta Dynasty',
        gender,
        fitnessGoal,
        gymPhotoUrl: gymPhoto ?? undefined,
        trainingPreferences: selectedMachines,
      });
      await signUp.finalize({ navigate: () => router.replace('/(tabs)') });
    }
  };

  const errorMessage = errors.fields?.emailAddress?.message ?? errors.fields?.password?.message ?? errors.fields?.code?.message;
  const verifying = signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address');

  return (
    <AuthScreen
      title={verifying ? 'Confirma tu correo' : 'Crea tu cuenta Dynasty'}
      subtitle={
        verifying
          ? 'Te enviamos un código de confirmación a tu correo.'
          : 'Crea tu perfil con Google o correo, y personaliza tu gym y enfoque desde el primer día.'
      }
    >
      <AuthError message={errorMessage} />
      {verifying ? (
        <>
          <AuthField label="Código de verificación" value={code} onChangeText={setCode} placeholder="123456" keyboardType="numeric" />
          <AuthButton title="Confirmar correo" onPress={verify} disabled={!code || fetchStatus === 'fetching'} />
          <AuthLink label="Enviar otro código" onPress={() => { void signUp.verifications.sendEmailCode(); }} />
        </>
      ) : (
        <>
          {/* BOTÓN CONTINUAR CON GOOGLE */}
          <Pressable
            onPress={handleGoogleSignUp}
            style={({ pressed }) => [
              {
                backgroundColor: '#FFFFFF',
                borderRadius: 12,
                paddingVertical: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 10,
                marginBottom: 14,
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <Image
              source={{ uri: 'https://cdn-icons-png.flaticon.com/512/2991/2991148.png' }}
              style={{ width: 18, height: 18 }}
              contentFit="contain"
            />
            <Text style={{ color: '#1F1F1F', fontSize: 13, fontWeight: '700' }}>
              Continuar con Google
            </Text>
          </Pressable>

          {/* DIVISOR */}
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <View style={{ flex: 1, height: 1, backgroundColor: `${colors.border}80` }} />
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginHorizontal: 8, textTransform: 'uppercase', letterSpacing: 0.5 }}>
              O regístrate con correo
            </Text>
            <View style={{ flex: 1, height: 1, backgroundColor: `${colors.border}80` }} />
          </View>

          {/* CAMPOS DE CUENTA */}
          <AuthField
            label="Usuario de perfil"
            value={username}
            onChangeText={setUsername}
            placeholder="@mi_perfil_dynasty"
          />
          <AuthField
            label="Correo electrónico"
            value={emailAddress}
            onChangeText={setEmailAddress}
            placeholder="tu@correo.com"
            keyboardType="email-address"
          />
          <AuthField
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            placeholder="Mínimo 8 caracteres"
            secureTextEntry
          />

          {/* ================= SECCIÓN DE ENFOQUE INICIAL ================= */}
          <View
            style={{
              backgroundColor: '#160F20',
              borderWidth: 1,
              borderColor: `${colors.gold}50`,
              borderRadius: 14,
              padding: 12,
              marginTop: 6,
              marginBottom: 14,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
              <Feather name="target" size={14} color={colors.gold} />
              <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800' }}>
                ENFOQUE BIOMECÁNICO & GÉNERO
              </Text>
            </View>

            <View style={{ gap: 6, marginBottom: 8 }}>
              <Pressable
                onPress={() => {
                  setGender('female');
                  setFitnessGoal('gluteos_piernas_femenino');
                  if (!selectedMachines.includes('hip_thrust_machine')) {
                    setSelectedMachines([...selectedMachines, 'hip_thrust_machine', 'seated_abductor_machine']);
                  }
                }}
                style={{
                  backgroundColor: gender === 'female' ? `${colors.gold}25` : '#1D1328',
                  borderColor: gender === 'female' ? colors.gold : colors.border,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 9,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: gender === 'female' ? colors.gold : colors.foreground, fontSize: 12, fontWeight: '700' }}>
                    👩 Mujer · Priorizar Glúteos y Pierna (2 Días)
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1 }}>
                    Máxima síntesis con 48–72h de recuperación. Otros días: tren superior y core.
                  </Text>
                </View>
                {gender === 'female' ? <Feather name="check-circle" size={15} color={colors.gold} /> : null}
              </Pressable>

              <Pressable
                onPress={() => {
                  setGender('male');
                  setFitnessGoal('hipertrofia');
                }}
                style={{
                  backgroundColor: gender === 'male' ? `${colors.primary}25` : '#1D1328',
                  borderColor: gender === 'male' ? colors.primary : colors.border,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 9,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: gender === 'male' ? colors.primary : colors.foreground, fontSize: 12, fontWeight: '700' }}>
                    👨 Hombre · Hipertrofia & Fuerza General
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1 }}>
                    Balance de torso, empuje, tracción y tren inferior.
                  </Text>
                </View>
                {gender === 'male' ? <Feather name="check-circle" size={15} color={colors.primary} /> : null}
              </Pressable>

              <Pressable
                onPress={() => {
                  setGender('other');
                  setFitnessGoal('fuerza');
                }}
                style={{
                  backgroundColor: gender === 'other' ? `${colors.primary}25` : '#1D1328',
                  borderColor: gender === 'other' ? colors.primary : colors.border,
                  borderWidth: 1,
                  borderRadius: 10,
                  padding: 9,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: gender === 'other' ? colors.primary : colors.foreground, fontSize: 12, fontWeight: '700' }}>
                    ⚡ Fuerza Máxima & Rendimiento Atlético
                  </Text>
                </View>
                {gender === 'other' ? <Feather name="check-circle" size={15} color={colors.primary} /> : null}
              </Pressable>
            </View>

            {/* FOTO DEL GIMNASIO */}
            <View style={{ borderTopWidth: 1, borderTopColor: `${colors.border}60`, paddingTop: 8, marginTop: 4 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '700' }}>
                  📸 Foto de tu Gimnasio o Máquinas
                </Text>
                {gymPhoto ? (
                  <Pressable onPress={() => setGymPhoto(null)}>
                    <Text style={{ color: colors.destructive, fontSize: 10, fontWeight: '700' }}>Eliminar</Text>
                  </Pressable>
                ) : null}
              </View>

              {gymPhoto ? (
                <View style={{ marginBottom: 8, borderRadius: 10, overflow: 'hidden', borderWidth: 1, borderColor: colors.gold, height: 90 }}>
                  <Image source={{ uri: gymPhoto }} style={{ width: '100%', height: '100%' }} contentFit="cover" />
                </View>
              ) : null}

              <View style={{ flexDirection: 'row', gap: 6 }}>
                <Pressable
                  onPress={handleTakePhoto}
                  style={{
                    flex: 1,
                    backgroundColor: `${colors.gold}20`,
                    borderColor: `${colors.gold}80`,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingVertical: 7,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                  }}
                >
                  <Feather name="camera" size={12} color={colors.gold} />
                  <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '700' }}>Tomar foto</Text>
                </Pressable>
                <Pressable
                  onPress={handlePickPhoto}
                  style={{
                    flex: 1,
                    backgroundColor: '#1E1428',
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 8,
                    paddingVertical: 7,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 5,
                  }}
                >
                  <Feather name="image" size={12} color={colors.mutedForeground} />
                  <Text style={{ color: colors.mutedForeground, fontSize: 10.5, fontWeight: '700' }}>Galería</Text>
                </Pressable>
              </View>
            </View>

            {/* SELECTOR INTERACTIVO DE MÁQUINAS EN SU GYM */}
            <View style={{ borderTopWidth: 1, borderTopColor: `${colors.border}60`, paddingTop: 8, marginTop: 8 }}>
              <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '700', marginBottom: 4 }}>
                🏋️ ¿Qué máquinas hay en tu gym o te interesan?
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, marginBottom: 8 }}>
                Toca las máquinas para seleccionarlas y adaptar tu catálogo:
              </Text>

              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {INITIAL_GYM_MACHINES.map((machine) => {
                  const isChecked = selectedMachines.includes(machine.id);
                  return (
                    <Pressable
                      key={machine.id}
                      onPress={() => toggleMachine(machine.id)}
                      style={{
                        paddingHorizontal: 9,
                        paddingVertical: 5,
                        borderRadius: 8,
                        borderWidth: 1,
                        borderColor: isChecked ? colors.gold : `${colors.border}80`,
                        backgroundColor: isChecked ? `${colors.gold}20` : '#140D1D',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 4,
                      }}
                    >
                      <Feather
                        name={isChecked ? 'check-circle' : 'circle'}
                        size={11}
                        color={isChecked ? colors.gold : colors.mutedForeground}
                      />
                      <Text
                        style={{
                          color: isChecked ? '#FFFFFF' : colors.mutedForeground,
                          fontSize: 10,
                          fontWeight: isChecked ? '700' : '500',
                        }}
                      >
                        {machine.name}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>
          </View>

          <View nativeID="clerk-captcha" />
          <AuthButton
            title={fetchStatus === 'fetching' ? 'Creando cuenta...' : 'Crear cuenta'}
            onPress={submit}
            disabled={!emailAddress || !password || fetchStatus === 'fetching'}
          />
          <AuthLink label="Ya tengo una cuenta" onPress={() => router.replace('/sign-in' as never)} />
        </>
      )}
    </AuthScreen>
  );
}