import { Feather } from '@expo/vector-icons';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  RAW_CATALOG_EXERCISES,
  MUSCLE_GROUPS_INFO,
  isExerciseUnlocked,
  type CatalogExercise,
  type MuscleGroupId,
} from '@/constants/exerciseCatalog';
import { getMembershipConfig, type MembershipTierId } from '@/constants/membershipConfig';
import { useColors } from '@/hooks/useColors';

export interface RoutineDay {
  dayId: string;
  dayName: string;
  focus: string;
  exerciseIds: string[];
}

export interface CustomRoutineWizardProps {
  visible: boolean;
  onClose: () => void;
  userTier: MembershipTierId;
  initialSelectedIds?: string[];
  initialDays?: RoutineDay[];
  onSaveRoutine: (libraryIds: string[], days: RoutineDay[]) => Promise<void>;
  onUpgradePress?: () => void;
}

export function CustomRoutineWizard({
  visible,
  onClose,
  userTier,
  initialSelectedIds = [],
  initialDays = [],
  onSaveRoutine,
  onUpgradePress,
}: CustomRoutineWizardProps) {
  const colors = useColors();
  const insets = useSafeAreaInsets();

  // Paso 1: Selección de hasta 3 ejercicios por grupo | Paso 2: Organización en días
  const [step, setStep] = useState<1 | 2>(1);

  // Ejercicios seleccionados para la biblioteca personal: Record<MuscleGroupId, string[]>
  const [selectedByGroup, setSelectedByGroup] = useState<Record<MuscleGroupId, string[]>>(() => {
    const initial: Record<MuscleGroupId, string[]> = {
      pecho: [],
      espalda: [],
      hombros: [],
      biceps: [],
      triceps: [],
      piernas: [],
      core: [],
      antebrazos: [],
      cuello: [],
    };
    if (initialSelectedIds.length > 0) {
      initialSelectedIds.forEach((id) => {
        const ex = RAW_CATALOG_EXERCISES.find((e) => e.id === id);
        if (ex && initial[ex.muscleGroup].length < 3) {
          initial[ex.muscleGroup].push(id);
        }
      });
    }
    return initial;
  });

  // Grupo muscular actualmente abierto en el acordeón/selector
  const [activeGroup, setActiveGroup] = useState<MuscleGroupId>('pecho');
  const [filterSearch, setFilterSearch] = useState('');

  // Días de entrenamiento configurados para el Paso 2
  const [days, setDays] = useState<RoutineDay[]>(() => {
    if (initialDays.length > 0) return initialDays;
    return [
      { dayId: 'day-1', dayName: 'Día 1: Empuje (Push)', focus: 'Pecho, Hombro & Tríceps', exerciseIds: [] },
      { dayId: 'day-2', dayName: 'Día 2: Tracción (Pull)', focus: 'Espalda, Bíceps & Antebrazo', exerciseIds: [] },
      { dayId: 'day-3', dayName: 'Día 3: Pierna & Core (Legs)', focus: 'Piernas completas & Abdomen', exerciseIds: [] },
    ];
  });

  const [saving, setSaving] = useState(false);

  // Lista plana de todos los ejercicios seleccionados
  const totalSelectedIds = useMemo(() => {
    const all: string[] = [];
    Object.values(selectedByGroup).forEach((ids) => all.push(...ids));
    return all;
  }, [selectedByGroup]);

  // Manejador estricto de la regla de máximo 3 ejercicios por grupo
  const handleToggleExercise = (exercise: CatalogExercise) => {
    const group = exercise.muscleGroup;
    const currentList = selectedByGroup[group] || [];
    const isAlreadySelected = currentList.includes(exercise.id);

    if (isAlreadySelected) {
      // Liberar espacio inmediatamente
      setSelectedByGroup((prev) => ({
        ...prev,
        [group]: prev[group].filter((id) => id !== exercise.id),
      }));
    } else {
      // Comprobar límite de 3 ejercicios
      if (currentList.length >= 3) {
        Alert.alert(
          'Límite de Grupo Alcanzado',
          `Ya has seleccionado 3 ejercicios de ${MUSCLE_GROUPS_INFO[group].label}. Para agregar este, primero elimina uno de los 3 seleccionados.`
        );
        return;
      }
      // Agregar a la biblioteca personal
      setSelectedByGroup((prev) => ({
        ...prev,
        [group]: [...prev[group], exercise.id],
      }));
    }
  };

  // Alternar ejercicio dentro de un día de entrenamiento (Paso 2)
  const handleToggleExerciseInDay = (dayId: string, exerciseId: string) => {
    setDays((prev) =>
      prev.map((d) => {
        if (d.dayId !== dayId) return d;
        const exists = d.exerciseIds.includes(exerciseId);
        return {
          ...d,
          exerciseIds: exists ? d.exerciseIds.filter((id) => id !== exerciseId) : [...d.exerciseIds, exerciseId],
        };
      })
    );
  };

  const handleSave = async () => {
    if (totalSelectedIds.length === 0) {
      Alert.alert('Selección requerida', 'Por favor selecciona al menos 1 ejercicio para conformar tu rutina.');
      return;
    }
    setSaving(true);
    try {
      await onSaveRoutine(totalSelectedIds, days);
      Alert.alert(
        '¡Rutina Personalizada Guardada! 🏆',
        `Has configurado ${totalSelectedIds.length} ejercicios en tu biblioteca personal distribuidos en ${days.length} días de entrenamiento.`
      );
      onClose();
    } catch {
      Alert.alert('Error', 'No se pudo guardar la rutina.');
    } finally {
      setSaving(false);
    }
  };

  const muscleGroupsList = Object.keys(MUSCLE_GROUPS_INFO) as MuscleGroupId[];

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View
          style={[
            styles.sheet,
            {
              backgroundColor: '#120D1A',
              borderColor: `${colors.gold}50`,
              paddingTop: insets.top > 0 ? insets.top + 8 : 18,
              paddingBottom: insets.bottom > 0 ? insets.bottom + 12 : 20,
            },
          ]}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800', letterSpacing: 1 }}>
                  DYNASTY CUSTOM WORKOUT
                </Text>
                <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 6, paddingVertical: 1.5, borderRadius: 5 }}>
                  <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>
                    PASO {step} DE 2
                  </Text>
                </View>
              </View>
              <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800', marginTop: 2 }}>
                {step === 1 ? 'Biblioteca de Ejercicios' : 'Distribución por Días'}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
                {step === 1
                  ? 'Elige máximo 3 ejercicios por grupo muscular (Regla Oficial Dynasty)'
                  : 'Asigna tus ejercicios seleccionados a cada día de entreno'}
              </Text>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={10}
              style={{
                width: 36,
                height: 36,
                borderRadius: 18,
                backgroundColor: colors.card,
                borderWidth: 1,
                borderColor: colors.border,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="x" size={18} color={colors.foreground} />
            </Pressable>
          </View>

          {/* PASO 1: SELECCIÓN DE HASTA 3 POR GRUPO MUSCULAR */}
          {step === 1 ? (
            <View style={{ flex: 1 }}>
              {/* Barra de Búsqueda y Filtros de Grupo Muscular */}
              <View style={{ paddingHorizontal: 18, marginBottom: 8 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    backgroundColor: '#1B1426',
                    borderColor: `${colors.gold}40`,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    height: 40,
                  }}
                >
                  <Feather name="search" size={15} color={colors.mutedForeground} />
                  <TextInput
                    value={filterSearch}
                    onChangeText={setFilterSearch}
                    placeholder="Filtrar ejercicio por nombre..."
                    placeholderTextColor={colors.mutedForeground}
                    style={{ flex: 1, color: colors.foreground, fontSize: 12, paddingHorizontal: 8 }}
                  />
                  {filterSearch ? (
                    <Pressable onPress={() => setFilterSearch('')}>
                      <Feather name="x-circle" size={14} color={colors.mutedForeground} />
                    </Pressable>
                  ) : null}
                </View>
              </View>

              {/* Selector Horizontal de Grupos Musculares con Indicador X/3 */}
              <View style={{ marginBottom: 10 }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 18, gap: 8 }}>
                  {muscleGroupsList.map((groupId) => {
                    const info = MUSCLE_GROUPS_INFO[groupId];
                    const selectedCount = (selectedByGroup[groupId] || []).length;
                    const isActive = activeGroup === groupId;
                    const isFull = selectedCount >= 3;

                    return (
                      <Pressable
                        key={groupId}
                        onPress={() => setActiveGroup(groupId)}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 7,
                          borderRadius: 12,
                          backgroundColor: isActive ? colors.gold : isFull ? '#2C1D42' : colors.card,
                          borderColor: isActive ? colors.gold : isFull ? `${colors.gold}70` : colors.border,
                          borderWidth: 1.2,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Text
                          style={{
                            color: isActive ? '#000000' : colors.foreground,
                            fontSize: 11.5,
                            fontWeight: '800',
                          }}
                        >
                          {info.label}
                        </Text>
                        <View
                          style={{
                            backgroundColor: isActive ? '#00000025' : isFull ? `${colors.gold}30` : '#312347',
                            paddingHorizontal: 5,
                            paddingVertical: 1,
                            borderRadius: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: isActive ? '#000000' : isFull ? colors.gold : colors.mutedForeground,
                              fontSize: 10,
                              fontWeight: '800',
                            }}
                          >
                            {selectedCount}/3
                          </Text>
                        </View>
                      </Pressable>
                    );
                  })}
                </ScrollView>
              </View>

              {/* Lista de Ejercicios del Grupo Activo */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
              >
                {/* Banner de Estado del Grupo Activo */}
                {(() => {
                  const currentCount = (selectedByGroup[activeGroup] || []).length;
                  const isGroupFull = currentCount >= 3;
                  const groupLabel = MUSCLE_GROUPS_INFO[activeGroup].label;

                  return (
                    <View
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        backgroundColor: isGroupFull ? '#26173A' : '#181122',
                        borderColor: isGroupFull ? `${colors.gold}70` : colors.border,
                        borderWidth: 1,
                        borderRadius: 14,
                        padding: 12,
                        marginBottom: 12,
                      }}
                    >
                      <View style={{ flex: 1, paddingRight: 8 }}>
                        <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '800' }}>
                          {groupLabel}: {currentCount} de 3 seleccionados
                        </Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
                          {isGroupFull
                            ? 'Has alcanzado el límite de 3. Deselecciona uno si deseas cambiarlo.'
                            : `Puedes seleccionar ${3 - currentCount} ejercicio(s) más para ${groupLabel}.`}
                        </Text>
                      </View>
                      <View
                        style={{
                          backgroundColor: isGroupFull ? colors.gold : `${colors.gold}20`,
                          paddingHorizontal: 9,
                          paddingVertical: 4,
                          borderRadius: 8,
                        }}
                      >
                        <Text style={{ color: isGroupFull ? '#000' : colors.gold, fontSize: 11, fontWeight: '800' }}>
                          {isGroupFull ? 'LÍMITE ALCANZADO' : `${currentCount}/3`}
                        </Text>
                      </View>
                    </View>
                  );
                })()}

                {/* Ejercicios del Grupo Filtrados */}
                {RAW_CATALOG_EXERCISES.filter((ex) => {
                  if (ex.muscleGroup !== activeGroup) return false;
                  if (filterSearch && !ex.name.toLowerCase().includes(filterSearch.toLowerCase())) return false;
                  return true;
                }).map((exercise) => {
                  const currentGroupList = selectedByGroup[exercise.muscleGroup] || [];
                  const isSelected = currentGroupList.includes(exercise.id);
                  const isGroupFull = currentGroupList.length >= 3;
                  const unlocked = isExerciseUnlocked(exercise, userTier);
                  const isSelectionBlocked = !isSelected && isGroupFull;
                  const tierConfig = getMembershipConfig(exercise.requiredTier);

                  return (
                    <Pressable
                      key={exercise.id}
                      disabled={isSelectionBlocked && unlocked}
                      onPress={() => {
                        if (!unlocked) {
                          Alert.alert(
                            `Membresía ${tierConfig.name} requerida`,
                            `Este ejercicio requiere membresía ${tierConfig.name}. Desbloquéala para acceder a más variantes.`,
                            [
                              { text: 'Entendido', style: 'cancel' },
                              onUpgradePress ? { text: 'Ver Planes', onPress: onUpgradePress } : undefined,
                            ].filter(Boolean) as any
                          );
                          return;
                        }
                        handleToggleExercise(exercise);
                      }}
                      style={({ pressed }) => [
                        {
                          backgroundColor: isSelected ? '#25163A' : '#160E22',
                          borderColor: isSelected
                            ? colors.gold
                            : isSelectionBlocked
                            ? '#2A2038'
                            : colors.border,
                          borderWidth: isSelected ? 1.5 : 1,
                          borderRadius: 14,
                          padding: 12,
                          marginBottom: 8,
                          opacity: pressed ? 0.8 : isSelectionBlocked ? 0.45 : 1,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 12,
                        },
                      ]}
                    >
                      {/* Checkbox / Indicador de Estado */}
                      <View
                        style={{
                          width: 26,
                          height: 26,
                          borderRadius: 8,
                          backgroundColor: isSelected ? colors.gold : '#241933',
                          borderWidth: 1.5,
                          borderColor: isSelected ? colors.gold : colors.border,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        {isSelected ? (
                          <Feather name="check" size={16} color="#000000" />
                        ) : !unlocked ? (
                          <Feather name="lock" size={13} color={tierConfig.accentColor} />
                        ) : null}
                      </View>

                      {/* Detalles del Ejercicio */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700', flex: 1 }} numberOfLines={1}>
                            {exercise.name}
                          </Text>
                          {!unlocked ? (
                            <View
                              style={{
                                backgroundColor: tierConfig.badgeBg,
                                borderColor: tierConfig.accentColor,
                                borderWidth: 1,
                                paddingHorizontal: 6,
                                paddingVertical: 1,
                                borderRadius: 6,
                              }}
                            >
                              <Text style={{ color: tierConfig.accentColor, fontSize: 9, fontWeight: '800' }}>
                                {tierConfig.name}
                              </Text>
                            </View>
                          ) : null}
                        </View>

                        <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                          {exercise.zone} · {exercise.equipment} {exercise.grip ? `· ${exercise.grip}` : ''}
                        </Text>
                      </View>

                      {/* Indicador lateral */}
                      {isSelected ? (
                        <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
                          <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800' }}>SELECCIONADO</Text>
                        </View>
                      ) : isSelectionBlocked ? (
                        <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Bloqueado</Text>
                      ) : (
                        <Feather name="plus" size={16} color={colors.mutedForeground} />
                      )}
                    </Pressable>
                  );
                })}
              </ScrollView>

              {/* Botón Inferior: Continuar al Paso 2 */}
              <View
                style={{
                  paddingHorizontal: 18,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: '#251A36',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Total seleccionados</Text>
                  <Text style={{ color: colors.gold, fontSize: 15, fontWeight: '800' }}>
                    {totalSelectedIds.length} ejercicios elegidos
                  </Text>
                </View>

                <Pressable
                  disabled={totalSelectedIds.length === 0}
                  onPress={() => setStep(2)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.gold,
                      paddingHorizontal: 20,
                      paddingVertical: 12,
                      borderRadius: 14,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      opacity: totalSelectedIds.length === 0 ? 0.4 : pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Text style={{ color: '#000000', fontSize: 13, fontWeight: '800' }}>Organizar Días</Text>
                  <Feather name="arrow-right" size={16} color="#000000" />
                </Pressable>
              </View>
            </View>
          ) : (
            /* PASO 2: ORGANIZACIÓN EN DÍAS DE ENTRENAMIENTO */
            <View style={{ flex: 1 }}>
              <ScrollView
                showsVerticalScrollIndicator={false}
                contentContainerStyle={{ paddingHorizontal: 18, paddingBottom: 20 }}
              >
                <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
                  Tus {totalSelectedIds.length} ejercicios seleccionados forman tu Biblioteca Personal. Asigna cuáles entrenarás cada día:
                </Text>

                {days.map((day, dayIndex) => {
                  return (
                    <View
                      key={day.dayId}
                      style={{
                        backgroundColor: '#181024',
                        borderColor: `${colors.gold}50`,
                        borderWidth: 1.2,
                        borderRadius: 16,
                        padding: 14,
                        marginBottom: 14,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                        <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800' }}>
                          {day.dayName}
                        </Text>
                        <View style={{ backgroundColor: `${colors.gold}20`, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800' }}>
                            {day.exerciseIds.length} ejercicios
                          </Text>
                        </View>
                      </View>
                      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 10 }}>
                        Enfoque: {day.focus}
                      </Text>

                      {/* Chips de selección de la biblioteca personal */}
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                        {totalSelectedIds.map((exId) => {
                          const ex = RAW_CATALOG_EXERCISES.find((e) => e.id === exId);
                          if (!ex) return null;
                          const inDay = day.exerciseIds.includes(exId);

                          return (
                            <Pressable
                              key={exId}
                              onPress={() => handleToggleExerciseInDay(day.dayId, exId)}
                              style={{
                                paddingHorizontal: 10,
                                paddingVertical: 6,
                                borderRadius: 10,
                                backgroundColor: inDay ? colors.gold : '#251A36',
                                borderColor: inDay ? colors.gold : '#36274C',
                                borderWidth: 1,
                                flexDirection: 'row',
                                alignItems: 'center',
                                gap: 5,
                              }}
                            >
                              <Feather name={inDay ? 'check' : 'plus'} size={12} color={inDay ? '#000' : colors.mutedForeground} />
                              <Text
                                style={{
                                  color: inDay ? '#000000' : colors.foreground,
                                  fontSize: 11,
                                  fontWeight: '700',
                                }}
                              >
                                {ex.name}
                              </Text>
                            </Pressable>
                          );
                        })}
                      </View>
                    </View>
                  );
                })}
              </ScrollView>

              {/* Botones de Acción del Paso 2 */}
              <View
                style={{
                  paddingHorizontal: 18,
                  paddingTop: 10,
                  borderTopWidth: 1,
                  borderTopColor: '#251A36',
                  flexDirection: 'row',
                  gap: 10,
                }}
              >
                <Pressable
                  onPress={() => setStep(1)}
                  style={{
                    paddingHorizontal: 16,
                    paddingVertical: 13,
                    borderRadius: 14,
                    backgroundColor: colors.card,
                    borderWidth: 1,
                    borderColor: colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Volver</Text>
                </Pressable>

                <Pressable
                  disabled={saving}
                  onPress={handleSave}
                  style={({ pressed }) => [
                    {
                      flex: 1,
                      backgroundColor: colors.gold,
                      paddingVertical: 13,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexDirection: 'row',
                      gap: 8,
                      opacity: saving ? 0.6 : pressed ? 0.8 : 1,
                    },
                  ]}
                >
                  <Feather name="check-circle" size={17} color="#000000" />
                  <Text style={{ color: '#000000', fontSize: 14, fontWeight: '800' }}>
                    {saving ? 'Guardando Rutina…' : 'Guardar y Activar Rutina 🏆'}
                  </Text>
                </Pressable>
              </View>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.82)',
    justifyContent: 'flex-end',
  },
  sheet: {
    height: '92%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#231834',
    marginBottom: 10,
  },
});
