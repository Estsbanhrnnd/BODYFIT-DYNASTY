import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { PrimaryButton, Screen, TopBar, styles as bfStyles } from '@/components/bodyfit';
import { DESIGNATED_TRAINERS, type Trainer } from '@/constants/trainersCatalog';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function AdminTrainersScreen() {
  const colors = useColors();
  const { isOwner, designatedTrainers, updateDesignatedTrainer } = useBodyFit();

  const trainersList = designatedTrainers && designatedTrainers.length > 0 ? designatedTrainers : DESIGNATED_TRAINERS;
  const [selectedId, setSelectedId] = useState<string>(trainersList[0]?.id || 'coach-esteban');

  const selectedTrainer = trainersList.find((t) => t.id === selectedId) || trainersList[0];

  const [name, setName] = useState(selectedTrainer?.name || '');
  const [title, setTitle] = useState(selectedTrainer?.title || '');
  const [role, setRole] = useState(selectedTrainer?.role || '');
  const [bio, setBio] = useState(selectedTrainer?.bio || '');
  const [avatarUrl, setAvatarUrl] = useState(selectedTrainer?.avatarUrl || '');
  const [statusText, setStatusText] = useState(selectedTrainer?.statusText || '🟢 En línea 24/7');
  const [specialtiesText, setSpecialtiesText] = useState(selectedTrainer?.specialties?.join(', ') || '');
  const [saving, setSaving] = useState(false);

  // Sincronizar estado cuando se selecciona otro entrenador
  const handleSelectTrainer = (t: Trainer) => {
    setSelectedId(t.id);
    setName(t.name);
    setTitle(t.title);
    setRole(t.role);
    setBio(t.bio);
    setAvatarUrl(t.avatarUrl);
    setStatusText(t.statusText);
    setSpecialtiesText(t.specialties?.join(', ') || '');
  };

  const handlePickFromGallery = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para cambiar la foto del entrenador.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setAvatarUrl(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  const handleTakePhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para tomar la foto del entrenador.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.85,
      });
      if (!result.canceled && result.assets && result.assets[0]?.uri) {
        setAvatarUrl(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara.');
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Campo requerido', 'El nombre del entrenador no puede estar vacío.');
      return;
    }

    setSaving(true);
    try {
      const specialtiesArray = specialtiesText
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);

      await updateDesignatedTrainer(selectedId, {
        name: name.trim(),
        title: title.trim(),
        role: role.trim(),
        bio: bio.trim(),
        avatarUrl: avatarUrl.trim(),
        statusText: statusText.trim(),
        specialties: specialtiesArray.length > 0 ? specialtiesArray : selectedTrainer.specialties,
      });

      Alert.alert('¡Entrenador Actualizado!', `Los datos de "${name}" se guardaron correctamente y ya están visibles en toda la aplicación.`);
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el entrenador.');
    } finally {
      setSaving(false);
    }
  };

  const handleResetDefaults = () => {
    const defaultTrainer = DESIGNATED_TRAINERS.find((t) => t.id === selectedId);
    if (!defaultTrainer) return;

    Alert.alert(
      'Restablecer a Valores Oficiales',
      `¿Deseas restaurar la información predeterminada de ${defaultTrainer.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Restablecer',
          style: 'destructive',
          onPress: async () => {
            await updateDesignatedTrainer(selectedId, defaultTrainer);
            handleSelectTrainer(defaultTrainer);
            Alert.alert('Restablecido', 'Información oficial restaurada con éxito.');
          },
        },
      ]
    );
  };

  if (!isOwner) {
    return (
      <Screen>
        <TopBar title="Entrenadores" subtitle="Panel de Administración" onPress={() => router.back()} />
        <View style={{ alignItems: 'center', paddingVertical: 80, paddingHorizontal: 20 }}>
          <Feather name="lock" size={44} color={colors.destructive} />
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800', marginTop: 16 }}>
            Acceso Exclusivo de Dueño
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
            Solo el propietario y fundador de BodyFit Dynasty puede modificar el staff de entrenadores oficiales.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <TopBar title="Staff de Entrenadores" subtitle="Gestión Oficial BodyFit Dynasty" onPress={() => router.back()} />

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : undefined} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Banner Explicativo */}
          <View
            style={{
              backgroundColor: '#1C1226',
              borderRadius: 18,
              padding: 15,
              borderWidth: 1.5,
              borderColor: colors.gold,
              marginBottom: 16,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 12,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 12,
                backgroundColor: `${colors.gold}20`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="users" size={20} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 0.8 }}>
                CONTROL MAESTRO DE STAFF
              </Text>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginTop: 2 }}>
                Edita nombres, fotos, credenciales y biografías
              </Text>
            </View>
          </View>

          {/* Selector de Entrenadores */}
          <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '800', marginBottom: 8, letterSpacing: 1 }}>
            SELECCIONA EL ENTRENADOR A MODIFICAR
          </Text>
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
            {trainersList.map((trainer) => {
              const isSelected = trainer.id === selectedId;
              return (
                <Pressable
                  key={trainer.id}
                  onPress={() => handleSelectTrainer(trainer)}
                  style={{
                    flex: 1,
                    backgroundColor: isSelected ? '#2A183E' : colors.card,
                    borderColor: isSelected ? colors.gold : colors.border,
                    borderWidth: isSelected ? 2 : 1,
                    borderRadius: 14,
                    padding: 10,
                    alignItems: 'center',
                  }}
                >
                  <Image
                    source={{ uri: trainer.avatarUrl }}
                    style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: isSelected ? colors.gold : 'transparent', marginBottom: 6 }}
                    contentFit="cover"
                  />
                  <Text
                    style={{
                      color: isSelected ? colors.gold : colors.foreground,
                      fontSize: 11.5,
                      fontWeight: '800',
                      textAlign: 'center',
                    }}
                    numberOfLines={1}
                  >
                    {trainer.name}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* TARJETA DE EDICIÓN DEL ENTRENADOR SELECCIONADO */}
          <View style={[bfStyles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 16, marginBottom: 18 }]}>
            {/* Foto de Perfil y Botones de Cámara / Galería */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Image
                source={{ uri: avatarUrl }}
                style={{ width: 88, height: 88, borderRadius: 44, borderWidth: 3, borderColor: colors.gold, marginBottom: 10 }}
                contentFit="cover"
              />
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '800' }}>
                Foto de Perfil del Entrenador
              </Text>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
                <Pressable
                  onPress={handleTakePhoto}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: `${colors.gold}20`,
                    borderColor: colors.gold,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingVertical: 7,
                    paddingHorizontal: 12,
                  }}
                >
                  <Feather name="camera" size={14} color={colors.gold} />
                  <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>Tomar Foto</Text>
                </Pressable>

                <Pressable
                  onPress={handlePickFromGallery}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                    backgroundColor: `${colors.primary}20`,
                    borderColor: colors.primary,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingVertical: 7,
                    paddingHorizontal: 12,
                  }}
                >
                  <Feather name="image" size={14} color={colors.primary} />
                  <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '800' }}>Galería</Text>
                </Pressable>
              </View>
            </View>

            {/* Campo: URL de la foto (opcional directa) */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 5 }}>
                O PEGAR URL DE IMAGEN DIRECTA
              </Text>
              <TextInput
                value={avatarUrl}
                onChangeText={setAvatarUrl}
                placeholder="https://..."
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 9,
                  fontSize: 12,
                }}
              />
            </View>

            {/* Campo: Nombre */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 5 }}>
                NOMBRE COMPLETO DEL ENTRENADOR
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Ej. Coach Esteban"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 14,
                  fontWeight: '700',
                }}
              />
            </View>

            {/* Campo: Título / Rango */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 5 }}>
                TÍTULO / RANGO OFICIAL
              </Text>
              <TextInput
                value={title}
                onChangeText={setTitle}
                placeholder="Ej. Head Coach & Fundador Dynasty"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.gold,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 13,
                  fontWeight: '700',
                }}
              />
            </View>

            {/* Campo: Rol / Especialidad principal */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 5 }}>
                ROL & ENFOQUE
              </Text>
              <TextInput
                value={role}
                onChangeText={setRole}
                placeholder="Ej. Máster en Biomecánica & Fuerza"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 13,
                }}
              />
            </View>

            {/* Campo: Estado en línea */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 5 }}>
                INDICADOR DE DISPONIBILIDAD
              </Text>
              <TextInput
                value={statusText}
                onChangeText={setStatusText}
                placeholder="Ej. 🟢 En línea 24/7"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 13,
                }}
              />
            </View>

            {/* Campo: Biografía */}
            <View style={{ marginBottom: 12 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 5 }}>
                BIOGRAFÍA DEL ENTRENADOR
              </Text>
              <TextInput
                value={bio}
                onChangeText={setBio}
                multiline
                numberOfLines={3}
                placeholder="Describe la experiencia y filosofía del entrenador..."
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 13,
                  minHeight: 80,
                  textAlignVertical: 'top',
                }}
              />
            </View>

            {/* Campo: Especialidades separadas por comas */}
            <View style={{ marginBottom: 18 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 5 }}>
                ESPECIALIDADES (separadas por coma)
              </Text>
              <TextInput
                value={specialtiesText}
                onChangeText={setSpecialtiesText}
                placeholder="Biomecánica aplicada, Sobrecarga progresiva, Powerbuilding"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  color: colors.foreground,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 12,
                  paddingHorizontal: 12,
                  paddingVertical: 10,
                  fontSize: 12,
                }}
              />
            </View>

            {/* Botón Guardar */}
            <PrimaryButton
              title={saving ? 'Guardando...' : `Guardar Cambios de ${name}`}
              icon="check"
              onPress={handleSave}
            />

            {/* Botón Restablecer */}
            <Pressable
              onPress={handleResetDefaults}
              style={{
                alignItems: 'center',
                paddingVertical: 12,
                marginTop: 6,
              }}
            >
              <Text style={{ color: colors.mutedForeground, fontSize: 11.5, fontWeight: '600' }}>
                Restablecer a valores de fábrica Dynasty
              </Text>
            </Pressable>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
}
