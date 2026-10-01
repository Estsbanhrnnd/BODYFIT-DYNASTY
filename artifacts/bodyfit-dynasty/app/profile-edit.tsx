import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { PrimaryButton, Screen, SectionHeader, styles, TopBar, images } from '@/components/bodyfit';
import {
  APP_THEMES,
  DEFAULT_SILHOUETTES,
  FITNESS_AVATARS,
  GYM_LEVELS,
  GYM_MACHINES_CATALOG,
  MACRO_OPTIONS,
  SPORT_DISCIPLINES,
} from '@/constants/gymCatalog';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { DYNASTY_LOGOS_CATALOG } from '@/constants/logosCatalog';

export default function ProfileEditScreen() {
  const c = useColors();
  const { profile, updateProfile } = useBodyFit();

  const [name, setName] = useState(profile?.displayName ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');
  const [avatar, setAvatar] = useState(profile?.avatarUrl ?? FITNESS_AVATARS[0]);
  const [theme, setTheme] = useState<string>(profile?.themeKey ?? 'purple');
  const [logoKey, setLogoKey] = useState<string>(profile?.logoKey ?? 'gold-emperor');
  const [heightCm, setHeightCm] = useState(profile?.heightCm ?? '178');
  const [weightKg, setWeightKg] = useState(profile?.weightKg ?? '78');
  const [age, setAge] = useState(profile?.age ?? '26');

  // Enfoque, Género y Foto de Gym
  const [gender, setGender] = useState<string>(profile?.gender ?? 'female');
  const [fitnessGoal, setFitnessGoal] = useState<string>(profile?.fitnessGoal ?? 'gluteos_piernas');
  const [gymPhoto, setGymPhoto] = useState<string | null>(profile?.gymPhotoUrl ?? null);

  // Nivel de gym
  const [level, setLevel] = useState<string>(
    GYM_LEVELS.find((l) => l.name === profile?.fitnessLevel)?.id ?? 'intermediate'
  );

  // Deportes
  const [selectedSports, setSelectedSports] = useState<string[]>(
    profile?.activities ?? ['Gimnasio / Musculación']
  );
  const [hasOtherSport, setHasOtherSport] = useState(Boolean(profile?.otherActivity));
  const [otherSportText, setOtherSportText] = useState(profile?.otherActivity ?? '');

  // Macros
  const [selectedMacros, setSelectedMacros] = useState<string[]>(
    profile?.preferredMacros ?? ['protein', 'calories']
  );

  // Máquinas favoritas
  const [selectedMachines, setSelectedMachines] = useState<string[]>(
    profile?.trainingPreferences ?? ['bench_press', 'lat_pulldown', 'leg_press_45']
  );
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);

  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

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

  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a tu biblioteca de fotos para seleccionar tu foto de perfil.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const avatarUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setAvatar(avatarUri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la galería de fotos.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar tu foto de perfil.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const avatarUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        setAvatar(avatarUri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara en este dispositivo.');
    }
  };

  const handleTakeGymPhoto = async () => {
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
        Alert.alert('¡Foto de tu Gym Registrada!', 'La fotografía de tus máquinas y gym ha sido vinculada.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara en este dispositivo.');
    }
  };

  const handlePickGymPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la biblioteca para seleccionar foto de tu gym.');
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
        Alert.alert('¡Foto de tu Gym Registrada!', 'La fotografía de tus máquinas y gym ha sido vinculada.');
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la biblioteca.');
    }
  };

  const save = async () => {
    setError('');
    if (!name.trim() || !username.trim()) {
      return setError('Nombre y usuario son obligatorios.');
    }
    if (!/^[a-z0-9_.-]{3,24}$/i.test(username.trim())) {
      return setError('El nombre de usuario debe tener 3 a 24 caracteres válidos.');
    }

    setSaving(true);
    try {
      const activeLevelObj = GYM_LEVELS.find((l) => l.id === level);
      const levelName = activeLevelObj?.name ?? 'Intermedio';

      const sportsToSave = [...selectedSports];
      if (hasOtherSport && otherSportText.trim() && !sportsToSave.includes(otherSportText.trim())) {
        sportsToSave.push(otherSportText.trim());
      }

      await updateProfile({
        displayName: name.trim(),
        username: username.trim().toLowerCase(),
        avatarUrl: avatar.trim() || null,
        themeKey: theme,
        logoKey: logoKey,
        fitnessLevel: levelName,
        fitnessGoal: fitnessGoal,
        gender: gender,
        gymPhotoUrl: gymPhoto ?? undefined,
        activities: sportsToSave,
        otherActivity: hasOtherSport ? otherSportText.trim() : null,
        trainingPreferences: selectedMachines,
        preferredMacros: selectedMacros,
        heightCm: heightCm.trim(),
        weightKg: weightKg.trim(),
        age: age.trim(),
      });

      Alert.alert('¡Perfil Guardado!', 'Tus preferencias han sido actualizadas con éxito.', [
        { text: 'Aceptar', onPress: () => router.back() },
      ]);
    } catch (e) {
      setError(String(e).toLowerCase().includes('username') ? 'Ese nombre de usuario ya está ocupado.' : 'No se pudo guardar el perfil.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Editar Perfil" subtitle="Ajusta tu configuración Dynasty" showProfileBubble={false} />

      {/* Selector de Foto de Perfil (Cámara, Biblioteca y Siluetas) */}
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, alignItems: 'center', paddingVertical: 18, marginBottom: 16 }]}>
        <View style={{ position: 'relative', marginBottom: 12 }}>
          <Image
            source={{ uri: avatar }}
            style={{ width: 92, height: 92, borderRadius: 46, borderWidth: 3, borderColor: c.gold }}
            contentFit="cover"
          />
          <View
            style={{
              position: 'absolute',
              bottom: 0,
              right: 0,
              backgroundColor: c.gold,
              width: 28,
              height: 28,
              borderRadius: 14,
              alignItems: 'center',
              justifyContent: 'center',
              borderWidth: 2,
              borderColor: '#0B0710',
            }}
          >
            <Feather name="camera" size={13} color="#0B0710" />
          </View>
        </View>

        <Text style={{ color: c.foreground, fontSize: 15, fontWeight: '800' }}>Foto de Perfil</Text>
        <Text style={{ color: c.mutedForeground, fontSize: 11.5, marginTop: 2, marginBottom: 14, textAlign: 'center' }}>
          Toma una foto en el momento o elígela de tu biblioteca
        </Text>

        {/* Botones de Cámara y Galería */}
        <View style={{ flexDirection: 'row', gap: 10, width: '100%', paddingHorizontal: 6, marginBottom: 16 }}>
          <Pressable
            onPress={handleTakePhoto}
            style={({ pressed }) => [
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                backgroundColor: `${c.gold}18`,
                borderWidth: 1.5,
                borderColor: c.gold,
                paddingVertical: 11,
                borderRadius: 14,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name="camera" size={16} color={c.gold} />
            <Text style={{ color: c.gold, fontSize: 12, fontWeight: '800' }}>Tomar Foto</Text>
          </Pressable>

          <Pressable
            onPress={handlePickFromGallery}
            style={({ pressed }) => [
              {
                flex: 1,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 7,
                backgroundColor: `${c.primary}18`,
                borderWidth: 1.5,
                borderColor: c.primary,
                paddingVertical: 11,
                borderRadius: 14,
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <Feather name="image" size={16} color={c.primary} />
            <Text style={{ color: c.primary, fontSize: 12, fontWeight: '800' }}>Biblioteca</Text>
          </Pressable>
        </View>

        {/* Avatares estéticos de la Dinastía */}
        <View style={{ width: '100%', borderTopWidth: 1, borderTopColor: `${c.border}80`, paddingTop: 12, alignItems: 'center' }}>
          <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 10, letterSpacing: 0.5 }}>
            O ELIGE UN AVATAR DYNASTY (MUJER, HOMBRE O GOLD):
          </Text>

          <View style={{ flexDirection: 'row', gap: 14, justifyContent: 'center' }}>
            {DEFAULT_SILHOUETTES.map((item) => {
              const isSelected = avatar === item.uri;
              return (
                <Pressable
                  key={item.id}
                  onPress={() => setAvatar(item.uri)}
                  style={{
                    alignItems: 'center',
                    padding: 6,
                    borderRadius: 16,
                    backgroundColor: isSelected ? `${c.gold}20` : 'transparent',
                    borderWidth: 1.5,
                    borderColor: isSelected ? c.gold : 'transparent',
                  }}
                >
                  <Image
                    source={{ uri: item.uri }}
                    style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 1.5, borderColor: isSelected ? c.gold : c.border }}
                    contentFit="cover"
                  />
                  <Text
                    style={{
                      color: isSelected ? c.gold : c.mutedForeground,
                      fontSize: 10.5,
                      fontWeight: '700',
                      marginTop: 4,
                    }}
                  >
                    {item.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      {/* Nombre y Usuario */}
      <View style={{ marginBottom: 14 }}>
        <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>NOMBRE PARA MOSTRAR</Text>
        <TextInput
          value={name}
          onChangeText={setName}
          placeholder="Tu nombre completo"
          placeholderTextColor={c.mutedForeground}
          style={{
            color: c.foreground,
            backgroundColor: c.input,
            borderColor: c.border,
            borderWidth: 1,
            borderRadius: 14,
            padding: 13,
            fontSize: 14,
          }}
        />
      </View>

      <View style={{ marginBottom: 16 }}>
        <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>USUARIO (@usuario)</Text>
        <TextInput
          value={username}
          onChangeText={(t) => setUsername(t.toLowerCase().replace(/[^a-z0-9_.-]/g, ''))}
          autoCapitalize="none"
          placeholder="tu_usuario"
          placeholderTextColor={c.mutedForeground}
          style={{
            color: c.foreground,
            backgroundColor: c.input,
            borderColor: c.border,
            borderWidth: 1,
            borderRadius: 14,
            padding: 13,
            fontSize: 14,
          }}
        />
      </View>

      {/* Datos Biométricos */}
      <SectionHeader title="Datos Biométricos (Perfil)" />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <View style={{ flex: 1 }}>
          <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>ALTURA (CM)</Text>
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
          <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>PESO (KG)</Text>
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
          <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>EDAD</Text>
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

      {/* Tema de Color */}
      <SectionHeader title="Tema de la App" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 }}>
        {APP_THEMES.map((t) => {
          const isSelected = theme === t.key;
          return (
            <Pressable
              key={t.key}
              onPress={() => setTheme(t.key)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 8,
                paddingHorizontal: 11,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: isSelected ? t.hex : c.border,
                backgroundColor: isSelected ? `${t.hex}22` : c.card,
              }}
            >
              <View style={{ width: 12, height: 12, borderRadius: 6, backgroundColor: t.hex }} />
              <Text style={{ color: c.foreground, fontSize: 11, fontWeight: isSelected ? '700' : '500' }}>{t.name}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Emblema / Logo Oficial de la Dinastía (Personalización de Color) */}
      <SectionHeader title="Color del Emblema Dinastía (Logo Oficial)" />
      <Text style={{ color: c.mutedForeground, fontSize: 11.5, marginBottom: 10, lineHeight: 16 }}>
        El logo oficial de la dinastía es constante; personaliza aquí el color imperial de su borde, resplandor y fondo.
      </Text>
      <View style={{ gap: 8, marginBottom: 20 }}>
        {DYNASTY_LOGOS_CATALOG.map((logo) => {
          const isSelected = logoKey === logo.id;
          return (
            <Pressable
              key={logo.id}
              onPress={() => setLogoKey(logo.id)}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? logo.bgColor : c.card,
                  borderColor: isSelected ? logo.primaryColor : c.border,
                  borderWidth: isSelected ? 1.5 : 1,
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                },
              ]}
            >
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 14,
                  backgroundColor: logo.bgColor,
                  borderWidth: 1.5,
                  borderColor: logo.primaryColor,
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                }}
              >
                <Image
                  source={images.logo}
                  style={{ width: 38, height: 38, borderRadius: 10 }}
                  contentFit="cover"
                />
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: c.foreground, fontSize: 13, fontWeight: '800' }}>
                    {logo.name}
                  </Text>
                  <View
                    style={{
                      backgroundColor: `${logo.primaryColor}25`,
                      paddingHorizontal: 6,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}
                  >
                    <Text style={{ color: logo.primaryColor, fontSize: 8.5, fontWeight: '800' }}>
                      {logo.badgeLabel}
                    </Text>
                  </View>
                </View>
                <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 2 }}>
                  {logo.description}
                </Text>
              </View>

              <View
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 11,
                  borderWidth: 1.5,
                  borderColor: isSelected ? logo.primaryColor : c.mutedForeground,
                  backgroundColor: isSelected ? logo.primaryColor : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                {isSelected ? <Feather name="check" size={13} color="#0B0710" /> : null}
              </View>
            </Pressable>
          );
        })}
      </View>

      {/* ========================================================================= */}
      {/* SECCIÓN OFICIAL: TU PERFIL DE ENTRENAMIENTO */}
      {/* ========================================================================= */}
      <View
        style={{
          marginTop: 10,
          marginBottom: 16,
          paddingVertical: 12,
          paddingHorizontal: 14,
          backgroundColor: '#1E1428',
          borderRadius: 16,
          borderWidth: 1.5,
          borderColor: c.gold,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: `${c.gold}25`, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="activity" size={18} color={c.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>
              Tu Perfil de Entrenamiento
            </Text>
            <Text style={{ color: c.gold, fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>
              ENFOQUE, MÁQUINAS DE TU GYM Y PREFERENCIAS BIOMECÁNICAS
            </Text>
          </View>
        </View>
      </View>

      {/* Selector de Género (Mujer / Hombre) */}
      <SectionHeader title="Género / Fisionomía" />
      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
        <Pressable
          onPress={() => setGender('female')}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: gender === 'female' ? c.gold : c.border,
            backgroundColor: gender === 'female' ? `${c.gold}20` : c.card,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 18 }}>👩</Text>
          <View>
            <Text style={{ color: gender === 'female' ? c.gold : c.foreground, fontSize: 13, fontWeight: '800' }}>
              Mujer
            </Text>
            <Text style={{ color: c.mutedForeground, fontSize: 9.5 }}>Enfoque glúteos & silueta</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => setGender('male')}
          style={{
            flex: 1,
            paddingVertical: 12,
            paddingHorizontal: 14,
            borderRadius: 14,
            borderWidth: 1.5,
            borderColor: gender === 'male' ? c.gold : c.border,
            backgroundColor: gender === 'male' ? `${c.gold}20` : c.card,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 8,
          }}
        >
          <Text style={{ fontSize: 18 }}>👨</Text>
          <View>
            <Text style={{ color: gender === 'male' ? c.gold : c.foreground, fontSize: 13, fontWeight: '800' }}>
              Hombre
            </Text>
            <Text style={{ color: c.mutedForeground, fontSize: 9.5 }}>Enfoque torso & fuerza</Text>
          </View>
        </Pressable>
      </View>

      {/* Selector de Enfoque Principal */}
      <SectionHeader title="Enfoque de Entrenamiento Principal" />
      <View style={{ gap: 8, marginBottom: 18 }}>
        {[
          {
            id: 'gluteos_piernas',
            title: '🍑 Glúteos y Piernas Estéticas',
            subtitle: 'Prioridad tren inferior (Exactamente 2 días de pierna/glúteo con 48–72h descanso)',
            recommended: gender === 'female',
          },
          {
            id: 'hipertrofia',
            title: '💪 Hipertrofia y Volumen Muscular',
            subtitle: 'Desarrollo muscular integral equilibrado',
            recommended: gender === 'male',
          },
          {
            id: 'definicion',
            title: '🔥 Definición y Tonificación',
            subtitle: 'Densidad muscular con alta quema calórica',
            recommended: false,
          },
          {
            id: 'fuerza',
            title: '⚡ Fuerza y Rendimiento Atlético',
            subtitle: 'Sobrecarga progresiva y levantamientos pesados',
            recommended: false,
          },
        ].map((item) => {
          const isSelected = fitnessGoal === item.id;
          return (
            <Pressable
              key={item.id}
              onPress={() => setFitnessGoal(item.id)}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? '#1E1428' : c.card,
                  borderColor: isSelected ? c.gold : c.border,
                  borderWidth: isSelected ? 1.5 : 1,
                  padding: 12,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: isSelected ? c.gold : c.foreground, fontSize: 13, fontWeight: '700', flex: 1 }}>
                  {item.title}
                </Text>
                {item.recommended ? (
                  <View style={{ backgroundColor: `${c.gold}25`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6 }}>
                    <Text style={{ color: c.gold, fontSize: 8.5, fontWeight: '800' }}>SUGERIDO</Text>
                  </View>
                ) : null}
              </View>
              <Text style={{ color: c.mutedForeground, fontSize: 10.5, marginTop: 4, lineHeight: 15 }}>
                {item.subtitle}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {/* Foto de tu Gimnasio y Equipamiento */}
      <SectionHeader title="Foto de tu Gimnasio o Máquinas" />
      <View style={[styles.card, { backgroundColor: c.card, borderColor: c.border, padding: 14, marginBottom: 18 }]}>
        {gymPhoto ? (
          <View style={{ marginBottom: 12 }}>
            <Image
              source={{ uri: gymPhoto }}
              style={{ width: '100%', height: 160, borderRadius: 12, borderWidth: 1, borderColor: c.gold }}
              contentFit="cover"
            />
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                <Feather name="check-circle" size={14} color="#10B981" />
                <Text style={{ color: '#10B981', fontSize: 11, fontWeight: '700' }}>Gimnasio vinculado</Text>
              </View>
              <Pressable onPress={() => setGymPhoto(null)}>
                <Text style={{ color: c.destructive, fontSize: 11, fontWeight: '700' }}>Eliminar foto</Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={{ alignItems: 'center', paddingVertical: 14 }}>
            <Feather name="camera" size={32} color={c.gold} />
            <Text style={{ color: c.foreground, fontSize: 13, fontWeight: '700', marginTop: 8 }}>
              Toma una foto a las máquinas de tu gym
            </Text>
            <Text style={{ color: c.mutedForeground, fontSize: 11, textAlign: 'center', marginTop: 4, paddingHorizontal: 12 }}>
              Registra tu espacio de entrenamiento para adaptar tus ejercicios recomendados.
            </Text>
          </View>
        )}

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
          <Pressable
            onPress={handleTakeGymPhoto}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: `${c.gold}20`,
              borderColor: c.gold,
              borderWidth: 1,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Feather name="camera" size={14} color={c.gold} />
            <Text style={{ color: c.gold, fontSize: 11.5, fontWeight: '800' }}>
              {gymPhoto ? 'Tomar otra' : 'Tomar Foto al Gym'}
            </Text>
          </Pressable>

          <Pressable
            onPress={handlePickGymPhoto}
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
              backgroundColor: `${c.primary}20`,
              borderColor: c.primary,
              borderWidth: 1,
              paddingVertical: 10,
              borderRadius: 12,
            }}
          >
            <Feather name="image" size={14} color={c.primary} />
            <Text style={{ color: c.primary, fontSize: 11.5, fontWeight: '800' }}>
              Desde Galería
            </Text>
          </Pressable>
        </View>
      </View>

      {/* Nivel en el Gym */}
      <SectionHeader title="Nivel de Experiencia en el Gimnasio" />
      <View style={{ gap: 8, marginBottom: 18 }}>
        {GYM_LEVELS.map((lvl) => {
          const isSelected = level === lvl.id;
          return (
            <Pressable
              key={lvl.id}
              onPress={() => setLevel(lvl.id)}
              style={[
                styles.card,
                {
                  backgroundColor: isSelected ? '#1A1424' : c.card,
                  borderColor: isSelected ? c.gold : c.border,
                  borderWidth: isSelected ? 1.5 : 1,
                  padding: 12,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ color: c.foreground, fontSize: 14, fontWeight: '700' }}>{lvl.name}</Text>
                <Text style={{ color: c.gold, fontSize: 10, fontWeight: '700' }}>{lvl.timeRange}</Text>
              </View>
              <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 4 }}>{lvl.description}</Text>
            </Pressable>
          );
        })}
      </View>

      {/* Deportes Practicados */}
      <SectionHeader title="Disciplinas y Deportes" />
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 7, marginBottom: 10 }}>
        {SPORT_DISCIPLINES.map((sport) => {
          const isSelected = selectedSports.includes(sport);
          return (
            <Pressable
              key={sport}
              onPress={() => toggleSport(sport)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 11,
                borderRadius: 12,
                borderWidth: 1.5,
                borderColor: isSelected ? c.primary : c.border,
                backgroundColor: isSelected ? `${c.primary}25` : c.card,
              }}
            >
              <Text style={{ color: isSelected ? '#FFFFFF' : c.foreground, fontSize: 11, fontWeight: isSelected ? '700' : '500' }}>
                {sport} {isSelected ? '✓' : ''}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => setHasOtherSport(!hasOtherSport)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 8, padding: 10, marginBottom: 8 }}
      >
        <Feather name={hasOtherSport ? 'check-square' : 'square'} size={16} color={hasOtherSport ? c.gold : c.mutedForeground} />
        <Text style={{ color: c.foreground, fontSize: 12 }}>Otro deporte</Text>
      </Pressable>

      {hasOtherSport && (
        <TextInput
          value={otherSportText}
          onChangeText={setOtherSportText}
          placeholder="Especifica tu deporte..."
          placeholderTextColor={c.mutedForeground}
          style={{
            color: c.foreground,
            backgroundColor: c.input,
            borderColor: c.border,
            borderWidth: 1,
            borderRadius: 12,
            padding: 11,
            fontSize: 12,
            marginBottom: 16,
          }}
        />
      )}

      {/* Macros Prioritarios */}
      <SectionHeader title="Macros Prioritarios en Dashboard" />
      <View style={{ gap: 8, marginBottom: 18 }}>
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
                  padding: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                },
              ]}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ color: c.foreground, fontWeight: '700', fontSize: 13 }}>{macro.name}</Text>
                <Text style={{ color: c.mutedForeground, fontSize: 10, marginTop: 2 }}>{macro.detail}</Text>
              </View>
              {isSelected ? <Feather name="check" size={16} color={c.primary} /> : null}
            </Pressable>
          );
        })}
      </View>

      {/* Máquinas y Ejercicios Favoritos */}
      <SectionHeader title={`Máquinas y Ejercicios Favoritos (${selectedMachines.length})`} />
      <View style={{ gap: 8, marginBottom: 24 }}>
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
                  padding: 13,
                  backgroundColor: isExpanded ? `${c.primary}18` : c.card,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: c.foreground, fontSize: 14, fontWeight: '700' }}>{group.name}</Text>
                  {selectedInGroup > 0 ? (
                    <View style={{ backgroundColor: c.primary, paddingHorizontal: 6, paddingVertical: 1, borderRadius: 8 }}>
                      <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800' }}>{selectedInGroup}</Text>
                    </View>
                  ) : null}
                </View>
                <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={17} color={c.mutedForeground} />
              </Pressable>

              {isExpanded && (
                <View style={{ padding: 10, borderTopWidth: 1, borderTopColor: c.border, gap: 5 }}>
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
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          borderRadius: 10,
                          backgroundColor: isMarked ? `${c.primary}20` : 'transparent',
                        }}
                      >
                        <Text style={{ color: isMarked ? c.primary : c.foreground, fontSize: 12, flex: 1, fontWeight: isMarked ? '700' : '400' }}>
                          {item.name}
                        </Text>
                        <Feather name={isMarked ? 'check-square' : 'square'} size={16} color={isMarked ? c.primary : c.mutedForeground} />
                      </Pressable>
                    );
                  })}
                </View>
              )}
            </View>
          );
        })}
      </View>

      {error ? <Text accessibilityRole="alert" style={{ color: c.destructive, marginBottom: 12 }}>{error}</Text> : null}
      <PrimaryButton title={saving ? 'Guardando cambios...' : 'Guardar y Actualizar'} onPress={save} disabled={saving} />
    </Screen>
  );
}