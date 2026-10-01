import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton, Screen, styles, TopBar } from '@/components/bodyfit';
import {
  APP_THEMES,
  FITNESS_AVATARS,
  GYM_LEVELS,
  GYM_MACHINES_CATALOG,
  MACRO_OPTIONS,
  SPORT_DISCIPLINES,
} from '@/constants/gymCatalog';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TERMS_STORAGE_KEY } from '@/components/DynastyTermsModal';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function OnboardingScreen() {
  const c = useColors();
  const { updateProfile } = useBodyFit();

  const [step, setStep] = useState<number>(1);
  const totalSteps = 5;

  // Step 1: Identidad
  const [displayName, setDisplayName] = useState('');
  const [username, setUsername] = useState('');
  const [avatarUrl, setAvatarUrl] = useState(FITNESS_AVATARS[0]);
  const [heightCm, setHeightCm] = useState('178');
  const [weightKg, setWeightKg] = useState('78');
  const [age, setAge] = useState('26');

  // Step 2: Color y Macros
  const [selectedTheme, setSelectedTheme] = useState<string>('purple');
  const [selectedMacros, setSelectedMacros] = useState<string[]>(['protein', 'calories']);

  // Step 3: Nivel de Gym
  const [selectedLevel, setSelectedLevel] = useState<string>('intermediate');

  // Step 4: Deportes
  const [selectedSports, setSelectedSports] = useState<string[]>(['Gimnasio / Musculación']);
  const [hasOtherSport, setHasOtherSport] = useState(false);
  const [otherSportText, setOtherSportText] = useState('');

  // Step 5: Máquinas Favoritas
  const [expandedGroup, setExpandedGroup] = useState<string | null>('chest');
  const [selectedMachines, setSelectedMachines] = useState<string[]>([
    'bench_press',
    'lat_pulldown',
    'leg_press_45',
    'hip_thrust_machine',
  ]);
  const [photoScanSimulated, setPhotoScanSimulated] = useState(false);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  const toggleSport = (sport: string) => {
    if (selectedSports.includes(sport)) {
      setSelectedSports(selectedSports.filter((s) => s !== sport));
    } else {
      setSelectedSports([...selectedSports, sport]);
    }
  };

  const toggleMacro = (macroId: string) => {
    if (selectedMacros.includes(macroId)) {
      if (selectedMacros.length > 1) {
        setSelectedMacros(selectedMacros.filter((m) => m !== macroId));
      }
    } else {
      setSelectedMacros([...selectedMacros, macroId]);
    }
  };

  const toggleMachine = (machineId: string) => {
    if (selectedMachines.includes(machineId)) {
      setSelectedMachines(selectedMachines.filter((m) => m !== machineId));
    } else {
      setSelectedMachines([...selectedMachines, machineId]);
    }
  };

  const simulatePhotoScan = () => {
    Alert.alert(
      '📸 Escáner de Máquinas BFD',
      'Cámara activada. Hemos detectado las máquinas típicas de tu gimnasio y pre-seleccionado tus favoritas.',
      [{ text: '¡Excelente!', onPress: () => setPhotoScanSimulated(true) }]
    );
  };

  const handleNext = () => {
    setError('');
    if (step === 1) {
      if (!displayName.trim()) return setError('Por favor ingresa tu nombre.');
      if (!username.trim() || !/^[a-z0-9_.-]{3,24}$/i.test(username.trim())) {
        return setError('El usuario debe tener 3 a 24 caracteres (letras, números, punto o guión).');
      }
    }
    if (step < totalSteps) {
      setStep(step + 1);
    } else {
      handleFinish();
    }
  };

  const handleFinish = async () => {
    setError('');
    setSaving(true);
    try {
      const activeLevelObj = GYM_LEVELS.find((l) => l.id === selectedLevel);
      const levelName = activeLevelObj?.name ?? 'Intermedio';

      const sportsToSave = [...selectedSports];
      if (hasOtherSport && otherSportText.trim()) {
        sportsToSave.push(otherSportText.trim());
      }

      await updateProfile({
        displayName: displayName.trim(),
        username: username.trim().toLowerCase(),
        avatarUrl: avatarUrl || null,
        themeKey: selectedTheme,
        fitnessGoal: 'Desarrollo muscular y fuerza',
        fitnessLevel: levelName,
        activities: sportsToSave,
        otherActivity: hasOtherSport ? otherSportText.trim() : null,
        trainingLocation: 'gym',
        trainingPreferences: selectedMachines,
        preferredMacros: selectedMacros,
        heightCm: heightCm.trim(),
        weightKg: weightKg.trim(),
        age: age.trim(),
        onboardingComplete: true,
      });

      await AsyncStorage.setItem(
        TERMS_STORAGE_KEY,
        JSON.stringify({
          acceptedAt: new Date().toISOString(),
          version: '1.0',
          terms: true,
          camera: true,
          notifications: true,
          source: 'onboarding',
        })
      );

      router.replace('/(tabs)' as never);
    } catch (e) {
      setError(String(e).toLowerCase().includes('username') ? 'Ese nombre de usuario ya está ocupado.' : 'No se pudo guardar tu perfil. Intenta de nuevo.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Configuración de Atleta" subtitle="Experiencia Dynasty Apple Care" showProfileBubble={false} />

      {/* Barra de progreso de pasos */}
      <View style={{ marginBottom: 20 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 }}>
          <Text style={{ color: c.gold, fontSize: 11, fontWeight: '800', letterSpacing: 1 }}>
            PASO {step} DE {totalSteps}
          </Text>
          <Text style={{ color: c.mutedForeground, fontSize: 11 }}>
            {step === 1 && 'Identidad y Avatar'}
            {step === 2 && 'Tema y Macros Prioritarios'}
            {step === 3 && 'Nivel de Experiencia'}
            {step === 4 && 'Deportes y Disciplinas'}
            {step === 5 && 'Máquinas y Ejercicios Favoritos'}
          </Text>
        </View>
        <View style={{ height: 6, backgroundColor: c.muted, borderRadius: 3, overflow: 'hidden' }}>
          <View style={{ height: 6, width: `${(step / totalSteps) * 100}%`, backgroundColor: c.primary, borderRadius: 3 }} />
        </View>
      </View>

      {/* PASO 1: Identidad y Avatar */}
      {step === 1 && (
        <View>
          <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, alignItems: 'center', paddingVertical: 20, marginBottom: 16 }]}>
            <Image
              source={{ uri: avatarUrl }}
              style={{ width: 90, height: 90, borderRadius: 45, borderWidth: 3, borderColor: c.gold, marginBottom: 12 }}
              contentFit="cover"
            />
            <Text style={{ color: c.foreground, fontSize: 16, fontWeight: '700' }}>Elige tu Avatar Fitness Oficial</Text>
            <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 2, marginBottom: 12 }}>
              Toca para seleccionar tu imagen de atleta
            </Text>

            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingHorizontal: 10 }}>
              {FITNESS_AVATARS.map((uri, idx) => (
                <Pressable
                  key={idx}
                  onPress={() => setAvatarUrl(uri)}
                  style={{
                    borderWidth: 2,
                    borderColor: avatarUrl === uri ? c.gold : 'transparent',
                    borderRadius: 24,
                    padding: 2,
                  }}
                >
                  <Image source={{ uri }} style={{ width: 44, height: 44, borderRadius: 22 }} contentFit="cover" />
                </Pressable>
              ))}
            </ScrollView>
          </View>

          <View style={{ marginBottom: 14 }}>
            <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>
              NOMBRE COMPLETO / ATLETA *
            </Text>
            <TextInput
              value={displayName}
              onChangeText={setDisplayName}
              placeholder="Ej. Esteban Hernández"
              placeholderTextColor={c.mutedForeground}
              style={{
                color: c.foreground,
                backgroundColor: c.input,
                borderColor: c.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 14,
                fontSize: 14,
              }}
            />
          </View>

          <View style={{ marginBottom: 14 }}>
            <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>
              NOMBRE DE USUARIO ÚNICO (@usuario) *
            </Text>
            <TextInput
              value={username}
              onChangeText={(t) => setUsername(t.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
              placeholder="Ej. esteban_bfd"
              placeholderTextColor={c.mutedForeground}
              autoCapitalize="none"
              style={{
                color: c.foreground,
                backgroundColor: c.input,
                borderColor: c.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 14,
                fontSize: 14,
              }}
            />
          </View>

          {/* Datos Biométricos */}
          <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 8, marginTop: 4 }}>
            DATOS BIOMÉTRICOS (ALTURA, PESO Y EDAD)
          </Text>
          <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ color: c.mutedForeground, fontSize: 10, marginBottom: 4 }}>ALTURA (CM)</Text>
              <TextInput
                value={heightCm}
                onChangeText={setHeightCm}
                keyboardType="numeric"
                placeholder="178"
                placeholderTextColor={c.mutedForeground}
                style={{
                  color: c.foreground,
                  backgroundColor: c.input,
                  borderColor: c.border,
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 13,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: c.mutedForeground, fontSize: 10, marginBottom: 4 }}>PESO (KG)</Text>
              <TextInput
                value={weightKg}
                onChangeText={setWeightKg}
                keyboardType="numeric"
                placeholder="78"
                placeholderTextColor={c.mutedForeground}
                style={{
                  color: c.foreground,
                  backgroundColor: c.input,
                  borderColor: c.border,
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 13,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text style={{ color: c.mutedForeground, fontSize: 10, marginBottom: 4 }}>EDAD</Text>
              <TextInput
                value={age}
                onChangeText={setAge}
                keyboardType="numeric"
                placeholder="26"
                placeholderTextColor={c.mutedForeground}
                style={{
                  color: c.foreground,
                  backgroundColor: c.input,
                  borderColor: c.border,
                  borderWidth: 1,
                  borderRadius: 14,
                  padding: 13,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              />
            </View>
          </View>
        </View>
      )}

      {/* PASO 2: Tema de Color y Macros Prioritarios */}
      {step === 2 && (
        <View>
          <Text style={{ color: c.foreground, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>
            Personaliza el Color de tu App
          </Text>
          <Text style={{ color: c.mutedForeground, fontSize: 12, marginBottom: 12 }}>
            Elige la estética que acompañará tus entrenamientos en BodyFit Dynasty.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 20 }}>
            {APP_THEMES.map((theme) => {
              const isSelected = selectedTheme === theme.key;
              return (
                <Pressable
                  key={theme.key}
                  onPress={() => setSelectedTheme(theme.key)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 8,
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: isSelected ? theme.hex : c.border,
                    backgroundColor: isSelected ? `${theme.hex}22` : c.card,
                  }}
                >
                  <View style={{ width: 14, height: 14, borderRadius: 7, backgroundColor: theme.hex }} />
                  <Text style={{ color: c.foreground, fontSize: 12, fontWeight: isSelected ? '700' : '500' }}>
                    {theme.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Text style={{ color: c.foreground, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>
            ¿Cuáles Macros son más Importantes para Ti?
          </Text>
          <Text style={{ color: c.mutedForeground, fontSize: 12, marginBottom: 12 }}>
            La app medirá todos tus nutrientes, pero destacará tus principales en tu Dashboard de inicio.
          </Text>

          <View style={{ gap: 8 }}>
            {MACRO_OPTIONS.map((macro) => {
              const isSelected = selectedMacros.includes(macro.id);
              return (
                <Pressable
                  key={macro.id}
                  onPress={() => toggleMacro(macro.id)}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isSelected ? '#1E1428' : c.card,
                      borderColor: isSelected ? c.primary : c.border,
                      borderWidth: isSelected ? 1.5 : 1,
                      padding: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    },
                  ]}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: c.foreground, fontWeight: '700', fontSize: 14 }}>{macro.name}</Text>
                    <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 2 }}>{macro.detail}</Text>
                  </View>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 1.5,
                      borderColor: isSelected ? c.primary : c.border,
                      backgroundColor: isSelected ? c.primary : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected ? <Feather name="check" size={13} color="#FFFFFF" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* PASO 3: Nivel de Experiencia en el Gimnasio (5 sugerencias) */}
      {step === 3 && (
        <View>
          <Text style={{ color: c.foreground, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>
            ¿Cuál es tu Progreso Actual en el Gym?
          </Text>
          <Text style={{ color: c.mutedForeground, fontSize: 12, marginBottom: 14 }}>
            Selecciona el nivel que mejor describe tu trayectoria con las pesas.
          </Text>

          <View style={{ gap: 10 }}>
            {GYM_LEVELS.map((level) => {
              const isSelected = selectedLevel === level.id;
              return (
                <Pressable
                  key={level.id}
                  onPress={() => setSelectedLevel(level.id)}
                  style={[
                    styles.card,
                    {
                      backgroundColor: isSelected ? '#1A1424' : c.card,
                      borderColor: isSelected ? c.gold : c.border,
                      borderWidth: isSelected ? 1.5 : 1,
                      padding: 15,
                    },
                  ]}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Text style={{ color: c.foreground, fontSize: 15, fontWeight: '800' }}>{level.name}</Text>
                    </View>
                    <View style={{ backgroundColor: `${c.gold}20`, paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 }}>
                      <Text style={{ color: c.gold, fontSize: 10, fontWeight: '700' }}>{level.timeRange}</Text>
                    </View>
                  </View>
                  <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 5, lineHeight: 16 }}>
                    {level.description}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* PASO 4: Deportes y Tipos de Ejercicios */}
      {step === 4 && (
        <View>
          <Text style={{ color: c.foreground, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>
            ¿Qué Deportes o Ejercicios has Hecho?
          </Text>
          <Text style={{ color: c.mutedForeground, fontSize: 12, marginBottom: 14 }}>
            Marca todos los que apliquen para personalizar tu plan y gasto metabólico.
          </Text>

          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 }}>
            {SPORT_DISCIPLINES.map((sport) => {
              const isSelected = selectedSports.includes(sport);
              return (
                <Pressable
                  key={sport}
                  onPress={() => toggleSport(sport)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    paddingVertical: 9,
                    paddingHorizontal: 12,
                    borderRadius: 14,
                    borderWidth: 1.5,
                    borderColor: isSelected ? c.primary : c.border,
                    backgroundColor: isSelected ? `${c.primary}25` : c.card,
                  }}
                >
                  <Text style={{ color: isSelected ? '#FFFFFF' : c.foreground, fontSize: 12, fontWeight: isSelected ? '700' : '500' }}>
                    {sport}
                  </Text>
                  {isSelected ? <Feather name="check" size={13} color={c.primary} /> : null}
                </Pressable>
              );
            })}
          </View>

          {/* Opción de Otro */}
          <Pressable
            onPress={() => setHasOtherSport(!hasOtherSport)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              padding: 12,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: hasOtherSport ? c.gold : c.border,
              backgroundColor: hasOtherSport ? `${c.gold}18` : c.card,
              marginBottom: 10,
            }}
          >
            <Feather name={hasOtherSport ? 'check-square' : 'square'} size={17} color={hasOtherSport ? c.gold : c.mutedForeground} />
            <Text style={{ color: c.foreground, fontWeight: '700', fontSize: 13 }}>Otra disciplina no listada</Text>
          </Pressable>

          {hasOtherSport && (
            <TextInput
              value={otherSportText}
              onChangeText={setOtherSportText}
              placeholder="Especifica tu deporte (ej. Remo, Jiu-Jitsu, Rugby...)"
              placeholderTextColor={c.mutedForeground}
              style={{
                color: c.foreground,
                backgroundColor: c.input,
                borderColor: c.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 13,
                fontSize: 13,
              }}
            />
          )}
        </View>
      )}

      {/* PASO 5: Máquinas y Ejercicios Favoritos por Categorías */}
      {step === 5 && (
        <View>
          <Text style={{ color: c.foreground, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>
            Máquinas y Ejercicios de Preferencia
          </Text>
          <Text style={{ color: c.mutedForeground, fontSize: 12, marginBottom: 12 }}>
            Organizado por grupo muscular. Puedes marcarlas manualmente o usar el escáner del gym.
          </Text>

          {/* Botón de Escáner por Foto */}
          <Pressable
            onPress={simulatePhotoScan}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 9,
              backgroundColor: photoScanSimulated ? '#10B981' : `${c.gold}20`,
              borderColor: photoScanSimulated ? '#10B981' : `${c.gold}70`,
              borderWidth: 1.5,
              borderRadius: 14,
              paddingVertical: 12,
              paddingHorizontal: 16,
              marginBottom: 16,
            }}
          >
            <Feather name="camera" size={17} color={photoScanSimulated ? '#FFFFFF' : c.gold} />
            <Text style={{ color: photoScanSimulated ? '#FFFFFF' : c.gold, fontSize: 13, fontWeight: '800' }}>
              {photoScanSimulated ? '✓ Máquinas detectadas por escáner' : 'Escanear máquinas del gym vía foto'}
            </Text>
          </Pressable>

          <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 8, letterSpacing: 0.5 }}>
            GRUPOS MUSCULARES ({selectedMachines.length} seleccionadas)
          </Text>

          {/* Acordeón de grupos musculares */}
          <View style={{ gap: 8, marginBottom: 20 }}>
            {GYM_MACHINES_CATALOG.map((group) => {
              const isExpanded = expandedGroup === group.id;
              const selectedInGroup = group.items.filter((item) => selectedMachines.includes(item.id)).length;

              return (
                <View key={group.id} style={{ borderRadius: 14, borderWidth: 1, borderColor: c.border, backgroundColor: c.card, overflow: 'hidden' }}>
                  <Pressable
                    onPress={() => setExpandedGroup(isExpanded ? null : group.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: 14,
                      backgroundColor: isExpanded ? `${c.primary}18` : c.card,
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                      <Text style={{ color: c.foreground, fontSize: 15, fontWeight: '700' }}>{group.name}</Text>
                      {selectedInGroup > 0 ? (
                        <View style={{ backgroundColor: c.primary, paddingHorizontal: 7, paddingVertical: 1, borderRadius: 10 }}>
                          <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>{selectedInGroup}</Text>
                        </View>
                      ) : null}
                    </View>
                    <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={18} color={c.mutedForeground} />
                  </Pressable>

                  {isExpanded && (
                    <View style={{ padding: 12, borderTopWidth: 1, borderTopColor: c.border, gap: 6 }}>
                      {group.items.map((item) => {
                        const isMarked = selectedMachines.includes(item.id);
                        return (
                          <Pressable
                            key={item.id}
                            onPress={() => toggleMachine(item.id)}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              paddingVertical: 9,
                              paddingHorizontal: 10,
                              borderRadius: 10,
                              backgroundColor: isMarked ? `${c.primary}20` : 'transparent',
                            }}
                          >
                            <Text style={{ color: isMarked ? c.primary : c.foreground, fontSize: 13, flex: 1, marginRight: 8, fontWeight: isMarked ? '700' : '400' }}>
                              {item.name}
                            </Text>
                            <View
                              style={{
                                width: 22,
                                height: 22,
                                borderRadius: 6,
                                borderWidth: 1.5,
                                borderColor: isMarked ? c.primary : c.mutedForeground,
                                backgroundColor: isMarked ? c.primary : 'transparent',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              {isMarked ? <Feather name="check" size={14} color="#FFFFFF" /> : null}
                            </View>
                          </Pressable>
                        );
                      })}
                    </View>
                  )}
                </View>
              );
            })}
          </View>
        </View>
      )}

      {/* Mensaje de error */}
      {error ? (
        <Text accessibilityRole="alert" style={{ color: c.destructive, fontSize: 12, marginBottom: 12, textAlign: 'center' }}>
          {error}
        </Text>
      ) : null}

      {/* Botones de navegación inferior */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10, marginBottom: 20 }}>
        {step > 1 && (
          <Pressable
            onPress={() => setStep(step - 1)}
            style={{
              paddingVertical: 14,
              paddingHorizontal: 18,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: c.border,
              backgroundColor: c.card,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Feather name="arrow-left" size={18} color={c.foreground} />
          </Pressable>
        )}
        <View style={{ flex: 1 }}>
          <PrimaryButton
            title={saving ? 'Guardando tu perfil...' : step === totalSteps ? 'Finalizar y Entrar' : 'Continuar'}
            onPress={handleNext}
            disabled={saving}
          />
        </View>
      </View>
    </Screen>
  );
}