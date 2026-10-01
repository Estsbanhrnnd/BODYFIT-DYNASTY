import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import { router } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Linking, Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as WebBrowser from 'expo-web-browser';
import { PrimaryButton, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { CustomRoutineWizard, type RoutineDay } from '@/components/CustomRoutineWizard';
import { DynastyAdModal } from '@/components/DynastyAdModal';
import {
  muscleCategories,
  type Exercise,
  type MuscleCategory,
  type MuscleSubfocus,
} from '@/constants/muscleCategories';
import { RAW_CATALOG_EXERCISES } from '@/constants/exerciseCatalog';
import { generateSuggestedRoutine } from '@/constants/routineSuggestionEngine';
import { DYNASTY_PREBUILT_ROUTINES, type PrebuiltRoutine } from '@/constants/routinesDatabase';
import { hasTierAccess, type MembershipTierId } from '@/constants/membershipConfig';
import {
  groupExercisesIntoFamilies,
  extractVariantLabel,
  type ExerciseFamily,
} from '@/constants/exerciseFamilies';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { useCreateWorkoutLog, useListWorkoutLogs } from '@workspace/api-client-react';

function localDay(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function RoutinesScreen() {
  const colors = useColors();
  const {
    membership,
    profile,
    customRoutine,
    saveCustomRoutine,
    resetCustomRoutine,
    isItemUnlocked,
    watchAdForItem,
    getRequiredAdsForItem,
    getAdProgressForItem,
    isItemUnlockedWithAd,
    getItemAdRemainingDays,
    isOwner,
    routineVideos,
    setRoutineVideo,
    removeRoutineVideo,
  } = useBodyFit();

  const [activeCategoryId, setActiveCategoryId] = useState('pecho');
  const [selectedLocation, setSelectedLocation] = useState<'gym' | 'home'>('gym');
  const [selectedSubfocus, setSelectedSubfocus] = useState('todos');
  const [selectedDay, setSelectedDay] = useState<'Hoy' | 'Mi Rutina' | 'Historial'>('Hoy');
  const [startedAt, setStartedAt] = useState<number | null>(null);
  const [activeWorkoutTitle, setActiveWorkoutTitle] = useState<string>('');
  const [elapsedMinutes, setElapsedMinutes] = useState(0);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [selectedFamily, setSelectedFamily] = useState<ExerciseFamily | null>(null);
  const [showSuggestionExpanded, setShowSuggestionExpanded] = useState(false);
  const [adModalVisible, setAdModalVisible] = useState(false);
  const [adTargetItem, setAdTargetItem] = useState<{ id: string; title: string; type: 'exercise' | 'routine'; requiredTier?: MembershipTierId } | null>(null);

  // Estados y funciones para asignación de videos a rutinas (Solo Administrador puede editar, todos pueden ver)
  const [adminVideoModalTarget, setAdminVideoModalTarget] = useState<{ id: string; title: string; currentUrl?: string } | null>(null);
  const [adminVideoInputUrl, setAdminVideoInputUrl] = useState('');

  const handleOpenRoutineVideo = async (url?: string) => {
    if (!url) return;
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        await WebBrowser.openBrowserAsync(url);
      } else {
        await Linking.openURL(url);
      }
    } catch {
      Alert.alert('No se pudo abrir el video', 'Por favor verifica el enlace o tu conexión a internet.');
    }
  };

  const handleOpenAdminVideoModal = (routineId: string, routineTitle: string) => {
    const existing = routineVideos?.[routineId] || '';
    setAdminVideoInputUrl(existing);
    setAdminVideoModalTarget({ id: routineId, title: routineTitle, currentUrl: existing });
  };

  const handleSaveAdminVideo = async () => {
    if (!adminVideoModalTarget) return;
    const cleanUrl = adminVideoInputUrl.trim();
    if (!cleanUrl) {
      Alert.alert('URL requerida', 'Ingresa una URL válida de YouTube, Vimeo, MP4 o Drive, o presiona Quitar Video.');
      return;
    }
    await setRoutineVideo(adminVideoModalTarget.id, cleanUrl);
    Alert.alert(
      '¡Video Vinculado!',
      `Se ha asignado el video a "${adminVideoModalTarget.title}". Ahora todos tus atletas y clientes pueden reproducirlo.`
    );
    setAdminVideoModalTarget(null);
  };

  const handleRemoveAdminVideo = async () => {
    if (!adminVideoModalTarget) return;
    await removeRoutineVideo(adminVideoModalTarget.id);
    Alert.alert('Video Quitado', `Se ha desvinculado el video de "${adminVideoModalTarget.title}".`);
    setAdminVideoModalTarget(null);
  };

  // Wizard para Rutina Personalizada
  const [wizardVisible, setWizardVisible] = useState(false);
  // Visualizar un día específico de la rutina personalizada
  const [selectedCustomDay, setSelectedCustomDay] = useState<RoutineDay | null>(null);
  // Desglose de día de sugerencia inicial
  const [selectedSuggestedDay, setSelectedSuggestedDay] = useState<string | null>(null);

  // Días por semana seleccionados para la sugerencia inicial (3, 4, 5 o 6)
  const defaultDaysCount = useMemo<3 | 4 | 5 | 6>(() => {
    const lvl = (profile?.fitnessLevel || '').toLowerCase();
    if (lvl.includes('principiante') || lvl.includes('novato') || lvl.includes('inicial')) return 3;
    if (lvl.includes('avanzado') || lvl.includes('pro') || lvl.includes('atleta')) return 5;
    return 4;
  }, [profile?.fitnessLevel]);

  const [selectedDaysCount, setSelectedDaysCount] = useState<3 | 4 | 5 | 6>(defaultDaysCount);

  // Sugerencia de Rutina Inicial Inteligente (Gimnasio vs Casa adaptada al perfil, género y días)
  const suggestedRoutine = useMemo(() => {
    return generateSuggestedRoutine({
      location: selectedLocation,
      fitnessLevel: profile?.fitnessLevel,
      fitnessGoal: profile?.fitnessGoal,
      gender: profile?.gender,
      membership,
      daysCount: selectedDaysCount,
    });
  }, [selectedLocation, profile?.fitnessLevel, profile?.fitnessGoal, profile?.gender, membership, selectedDaysCount]);

  const handleAdoptSuggestion = () => {
    Alert.alert(
      'Adoptar Rutina Sugerida',
      `¿Deseas activar "${suggestedRoutine.title}" (${suggestedRoutine.days.length} días) como tu rutina semanal? Se guardará en tus días de entrenamiento activos y podrás personalizarla cuando quieras.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adoptar Rutina',
          style: 'default',
          onPress: async () => {
            await saveCustomRoutine(suggestedRoutine.allExerciseIds, suggestedRoutine.days);
            if (suggestedRoutine.days.length > 0) {
              setSelectedCustomDay(suggestedRoutine.days[0]);
            }
            setShowSuggestionExpanded(false);
            Alert.alert(
              '¡Rutina Activada!',
              `Se ha configurado "${suggestedRoutine.title}" con ${suggestedRoutine.days.length} días de entreno en tu biblioteca personal.`
            );
          },
        },
      ]
    );
  };

  // Subpestaña en "Mi Rutina" ('suggestion' = Generador IA, 'prebuilt' = Catálogo de Rutinas Dinastía)
  const [miRutinaSubTab, setMiRutinaSubTab] = useState<'suggestion' | 'prebuilt'>('suggestion');
  const [expandedPrebuiltId, setExpandedPrebuiltId] = useState<string | null>('dynasty-ppl-6d');
  const [expandedPrebuiltDayId, setExpandedPrebuiltDayId] = useState<string | null>(null);

  const handleAdoptPrebuilt = (routine: PrebuiltRoutine) => {
    Alert.alert(
      'Adoptar Rutina Oficial Dinastía',
      `¿Deseas activar "${routine.title}" (${routine.days.length} días) como tu rutina semanal activa? Se cargará de inmediato para tus entrenamientos diarios en "Hoy".`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Adoptar Programa',
          style: 'default',
          onPress: async () => {
            const customDays: RoutineDay[] = routine.days.map((d) => ({
              dayId: d.dayId,
              dayName: d.dayName,
              focus: d.focus,
              exerciseIds: d.exercises.map((e) => e.id),
            }));
            await saveCustomRoutine(routine.allExerciseIds, customDays);
            if (customDays.length > 0) {
              setSelectedCustomDay(customDays[0]);
            }
            setShowSuggestionExpanded(false);
            Alert.alert(
              '¡Programa Dinastía Activado!',
              `Se ha configurado "${routine.title}" (${routine.days.length} días) en tu perfil de la Dinastía.`
            );
          },
        },
      ]
    );
  };

  const handleAdRewardClaimed = async () => {
    if (!adTargetItem) return;
    const res = await watchAdForItem(adTargetItem.id);
    if (res.completed) {
      Alert.alert(
        '👑 ¡Desbloqueado con Éxito!',
        `Has completado la cuota de anuncios para "${adTargetItem.title}". Tienes acceso completo e ilimitado durante los próximos 7 días.`
      );
    } else {
      Alert.alert(
        '🔥 Progreso Registrado',
        `Has visto un anuncio. Te falta(n) ${res.remaining} anuncio(s) para desbloquear "${adTargetItem.title}" por 7 días.`
      );
    }
  };

  const activeCategory = useMemo(() => {
    return muscleCategories.find((c) => c.id === activeCategoryId) ?? muscleCategories[0];
  }, [activeCategoryId]);

  // Al cambiar de categoría, reiniciar el subenfoque a 'todos'
  const handleSelectCategory = (id: string) => {
    setActiveCategoryId(id);
    setSelectedSubfocus('todos');
    setSelectedExercise(null);
    setSelectedFamily(null);
  };

  const currentExercises = useMemo(() => {
    const list = selectedLocation === 'gym' ? activeCategory.gymExercises : activeCategory.homeExercises;
    if (selectedSubfocus === 'todos') return list;
    return list.filter((ex) => ex.subfocus === selectedSubfocus);
  }, [selectedLocation, activeCategory, selectedSubfocus]);

  const currentFamilies = useMemo(() => {
    return groupExercisesIntoFamilies(currentExercises);
  }, [currentExercises]);

  // Día activo para "Hoy" (tomado de la rutina activa o por defecto el día 1)
  const todayActiveDay = useMemo(() => {
    if (!customRoutine?.days || customRoutine.days.length === 0) return null;
    if (selectedCustomDay) return selectedCustomDay;
    return customRoutine.days[0];
  }, [customRoutine?.days, selectedCustomDay]);

  // Ejercicios del día activo en "Hoy" o en la rutina personalizada
  const activeDayExercises = useMemo(() => {
    if (!todayActiveDay) return [];
    return todayActiveDay.exerciseIds
      .map((id) => RAW_CATALOG_EXERCISES.find((ex) => ex.id === id))
      .filter((ex): ex is NonNullable<typeof ex> => Boolean(ex));
  }, [todayActiveDay]);

  const queryClient = useQueryClient();
  const workoutQuery = useListWorkoutLogs({ query: { queryKey: ['listWorkoutLogs'] } });
  const createWorkout = useCreateWorkoutLog();
  const workouts = workoutQuery.data?.workouts ?? [];

  useEffect(() => {
    if (startedAt === null) return;
    const update = () => setElapsedMinutes(Math.floor((Date.now() - startedAt) / 60_000));
    update();
    const timer = setInterval(update, 15_000);
    return () => clearInterval(timer);
  }, [startedAt]);

  const toggleWorkoutTimer = async (forcedTitle?: string) => {
    if (startedAt === null) {
      const title = forcedTitle || `${activeCategory.name} (${selectedLocation === 'gym' ? 'Gimnasio' : 'Casa'})`;
      setActiveWorkoutTitle(title);
      setStartedAt(Date.now());
      return;
    }
    const titleToSave = activeWorkoutTitle || `${activeCategory.name} (${selectedLocation === 'gym' ? 'Gimnasio' : 'Casa'})`;
    try {
      await createWorkout.mutateAsync({
        data: {
          routineName: titleToSave,
          location: selectedLocation,
          durationMinutes: Math.max(1, elapsedMinutes),
        },
      });
      await queryClient.invalidateQueries({ queryKey: ['listWorkoutLogs'] });
      setStartedAt(null);
      setElapsedMinutes(0);
      setActiveWorkoutTitle('');
      Alert.alert('¡Sesión Registrada!', `Entrenamiento "${titleToSave}" guardado en tu historial.`);
    } catch {
      setStartedAt(null);
      setElapsedMinutes(0);
      setActiveWorkoutTitle('');
      Alert.alert('¡Entrenamiento Finalizado!', `Completaste tu sesión.`);
    }
  };

  const handleStartCustomDay = (day: RoutineDay) => {
    setSelectedCustomDay(day);
    const title = `Rutina Dynasty: ${day.dayName} (${day.focus})`;
    setActiveWorkoutTitle(title);
    setStartedAt(Date.now());
    Alert.alert('¡Entrenamiento Iniciado!', `Iniciaste ${day.dayName} con foco en ${day.focus}.`);
  };

  const hasActiveRoutine = Boolean(customRoutine && customRoutine.days && customRoutine.days.length > 0);

  const renderActiveRoutineSection = () => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: customRoutine ? colors.primary : colors.border,
          borderWidth: 1.5,
          padding: 14,
          marginBottom: 16,
        },
      ]}
    >
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
          <View style={{ backgroundColor: `${colors.primary}25`, padding: 7, borderRadius: 10 }}>
            <Feather name="sliders" size={17} color={colors.gold} />
          </View>
          <View>
            <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '800' }}>
              Mi Rutina Semanal Activa
            </Text>
            <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700' }}>
              REGLA OFICIAL: HASTA 3 EJERCICIOS POR GRUPO
            </Text>
          </View>
        </View>
        <View style={{ backgroundColor: `${colors.primary}20`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800' }}>
            {customRoutine ? `${customRoutine.days?.length || 0} DÍAS` : 'SIN ASIGNAR'}
          </Text>
        </View>
      </View>

      {customRoutine && customRoutine.days?.length > 0 ? (
        <>
          {/* Botón de Video para la Rutina Activa y Acción de Admin */}
          {routineVideos?.['active-custom-routine'] ? (
            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
              <Pressable
                onPress={() => handleOpenRoutineVideo(routineVideos['active-custom-routine'])}
                style={{
                  flex: 1,
                  backgroundColor: '#2A173B',
                  borderColor: colors.gold,
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 10,
                  borderRadius: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Feather name="video" size={13} color={colors.gold} />
                <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800' }}>
                  Ver Video de Mi Rutina
                </Text>
              </Pressable>
              {isOwner ? (
                <Pressable
                  onPress={() => handleOpenAdminVideoModal('active-custom-routine', 'Mi Rutina Semanal Activa')}
                  style={{
                    backgroundColor: `${colors.primary}25`,
                    borderColor: colors.primary,
                    borderWidth: 1,
                    paddingVertical: 8,
                    paddingHorizontal: 12,
                    borderRadius: 10,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Feather name="edit-3" size={13} color={colors.primary} />
                </Pressable>
              ) : null}
            </View>
          ) : isOwner ? (
            <Pressable
              onPress={() => handleOpenAdminVideoModal('active-custom-routine', 'Mi Rutina Semanal Activa')}
              style={{
                backgroundColor: `${colors.gold}15`,
                borderColor: `${colors.gold}60`,
                borderWidth: 1,
                borderStyle: 'dashed',
                paddingVertical: 8,
                paddingHorizontal: 10,
                borderRadius: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 6,
                marginBottom: 10,
              }}
            >
              <Feather name="plus-circle" size={13} color={colors.gold} />
              <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
                + Asignar Video a mi Rutina Activa (Admin)
              </Text>
            </Pressable>
          ) : null}

          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 10 }}>
            Tu división semanal estructurada a medida:
          </Text>
          <View style={{ gap: 8, marginBottom: 12 }}>
            {customRoutine.days.map((day, dIdx) => {
              const isSelected = selectedCustomDay?.dayId === day.dayId;
              const dayExList = day.exerciseIds
                .map((id) => RAW_CATALOG_EXERCISES.find((ex) => ex.id === id))
                .filter((ex): ex is NonNullable<typeof ex> => Boolean(ex));

              return (
                <View
                  key={day.dayId || dIdx}
                  style={{
                    backgroundColor: isSelected ? `${colors.primary}18` : `${colors.border}22`,
                    borderColor: isSelected ? colors.primary : colors.border,
                    borderWidth: 1,
                    padding: 10,
                    borderRadius: 12,
                  }}
                >
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Pressable
                      onPress={() => setSelectedCustomDay(isSelected ? null : day)}
                      style={{ flex: 1, paddingRight: 8 }}
                    >
                      <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>
                        {day.dayName} · <Text style={{ color: colors.gold }}>{day.focus}</Text>
                      </Text>
                      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                        {day.exerciseIds?.length || 0} ejercicios · {isSelected ? 'Ocultar' : 'Ver ejercicios'}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => handleStartCustomDay(day)}
                      style={{
                        backgroundColor: colors.primary,
                        paddingHorizontal: 12,
                        paddingVertical: 7,
                        borderRadius: 10,
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                      }}
                    >
                      <Feather name="play" size={12} color={colors.primaryForeground} />
                      <Text style={{ color: colors.primaryForeground, fontSize: 11, fontWeight: '800' }}>
                        Entrenar
                      </Text>
                    </Pressable>
                  </View>

                  {/* Desplegable de ejercicios si está seleccionado */}
                  {isSelected && dayExList.length > 0 ? (
                    <View style={{ marginTop: 10, paddingTop: 10, borderTopWidth: 1, borderTopColor: colors.border, gap: 6 }}>
                      <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                        Ejercicios asignados a este día:
                      </Text>
                      {dayExList.map((cEx, cIdx) => (
                        <View
                          key={`${cEx.id}-${cIdx}`}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            backgroundColor: colors.card,
                            padding: 8,
                            borderRadius: 8,
                          }}
                        >
                          <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                            <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>
                              {cIdx + 1}. {cEx.name}
                            </Text>
                            <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
                              {cEx.zone} · {cEx.equipment} ({cEx.movementType})
                            </Text>
                          </View>
                          <View style={{ backgroundColor: `${colors.primary}20`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, flexShrink: 0 }}>
                            <Text style={{ color: colors.primary, fontSize: 9, fontWeight: '700' }}>
                              {cEx.modality}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : null}
                </View>
              );
            })}
          </View>

          <View style={{ flexDirection: 'row', gap: 8 }}>
            <Pressable
              onPress={() => setWizardVisible(true)}
              style={{
                flex: 1,
                backgroundColor: `${colors.primary}20`,
                borderColor: colors.primary,
                borderWidth: 1,
                paddingVertical: 10,
                borderRadius: 12,
                alignItems: 'center',
                flexDirection: 'row',
                justifyContent: 'center',
                gap: 6,
              }}
            >
              <Feather name="edit-2" size={13} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
                Reconfigurar Rutina
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                Alert.alert(
                  'Restablecer Rutina',
                  '¿Deseas reiniciar tu rutina personalizada y empezar desde cero?',
                  [
                    { text: 'Cancelar', style: 'cancel' },
                    {
                      text: 'Restablecer',
                      style: 'destructive',
                      onPress: () => {
                        resetCustomRoutine();
                        setSelectedCustomDay(null);
                      },
                    },
                  ]
                );
              }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 12,
                backgroundColor: `${colors.border}44`,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="trash-2" size={15} color={colors.mutedForeground} />
            </Pressable>
          </View>
        </>
      ) : (
        <>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 12, lineHeight: 18 }}>
            Diseña tu plan a medida seleccionando hasta 3 ejercicios por grupo muscular y distribúyelos en tus días semanales con técnica y control profesional.
          </Text>
          <PrimaryButton
            title="Crear Rutina Personalizada"
            icon="plus-circle"
            onPress={() => setWizardVisible(true)}
          />
        </>
      )}
    </View>
  );

  const renderSuggestionDashBanner = () => (
    <Pressable
      onPress={() => setShowSuggestionExpanded((prev) => !prev)}
      style={{
        backgroundColor: '#1C1226',
        borderColor: `${colors.gold}70`,
        borderWidth: 1.5,
        borderRadius: 14,
        padding: 13,
        marginBottom: 16,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, minWidth: 0, paddingRight: 8 }}>
        <View style={{ backgroundColor: `${colors.gold}25`, padding: 8, borderRadius: 10, borderWidth: 1, borderColor: `${colors.gold}70`, flexShrink: 0 }}>
          <Feather name="zap" size={17} color={colors.gold} />
        </View>
        <View style={{ flex: 1, minWidth: 0 }}>
          <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }} numberOfLines={1}>
            ⚡ Sugerencia IA · {suggestedRoutine.title}
          </Text>
          <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '600', marginTop: 1 }} numberOfLines={1}>
            {showSuggestionExpanded ? 'Toca para colapsar recomendación' : 'Toca para ver o reconfigurar recomendación'}
          </Text>
        </View>
      </View>
      <View style={{ backgroundColor: `${colors.gold}20`, padding: 6, borderRadius: 8, flexShrink: 0 }}>
        <Feather name={showSuggestionExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.gold} />
      </View>
    </Pressable>
  );

  const renderSuggestionDetailsCard = () => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: '#1C1226',
          borderColor: colors.gold,
          borderWidth: 1.5,
          padding: 15,
          marginBottom: 16,
        },
      ]}
    >
      {/* Encabezado y Selector Gimnasio / Casa */}
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 8 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 180 }}>
          <View style={{ backgroundColor: `${colors.gold}25`, padding: 7, borderRadius: 10, borderWidth: 1, borderColor: `${colors.gold}70`, flexShrink: 0 }}>
            <Feather name="compass" size={17} color={colors.gold} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ color: colors.foreground, fontSize: 13.5, fontWeight: '800' }}>
              Sugerencia Inicial Dynasty
            </Text>
            <Text style={{ color: colors.gold, fontSize: 9.5, fontWeight: '800', letterSpacing: 0.5 }}>
              ADAPTADA A TU PERFIL · REVISABLE POR COACH
            </Text>
          </View>
        </View>

        {/* Selector Rápido Gimnasio / Casa */}
        <View style={{ flexDirection: 'row', backgroundColor: '#0F0916', borderRadius: 10, padding: 3, borderWidth: 1, borderColor: `${colors.gold}40`, flexShrink: 0 }}>
          <Pressable
            onPress={() => setSelectedLocation('gym')}
            style={{
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 7,
              backgroundColor: selectedLocation === 'gym' ? colors.gold : 'transparent',
            }}
          >
            <Text style={{ color: selectedLocation === 'gym' ? '#0B0710' : colors.mutedForeground, fontSize: 10, fontWeight: '800' }}>
              🏋️ Gym
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setSelectedLocation('home')}
            style={{
              paddingHorizontal: 9,
              paddingVertical: 5,
              borderRadius: 7,
              backgroundColor: selectedLocation === 'home' ? colors.gold : 'transparent',
            }}
          >
            <Text style={{ color: selectedLocation === 'home' ? '#0B0710' : colors.mutedForeground, fontSize: 10, fontWeight: '800' }}>
              🏠 Casa
            </Text>
          </Pressable>
        </View>
      </View>

      {/* SELECTOR DE DÍAS A ENTRENAR (3, 4, 5, 6) */}
      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 10.5, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 7 }}>
          ¿Cuántos días por semana deseas entrenar?
        </Text>
        <View style={{ flexDirection: 'row', gap: 6 }}>
          {([3, 4, 5, 6] as const).map((days) => {
            const isDaySelected = selectedDaysCount === days;
            return (
              <Pressable
                key={days}
                onPress={() => setSelectedDaysCount(days)}
                style={{
                  flex: 1,
                  paddingVertical: 7,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: isDaySelected ? colors.gold : `${colors.border}80`,
                  backgroundColor: isDaySelected ? `${colors.gold}25` : '#130C1C',
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: isDaySelected ? colors.gold : colors.mutedForeground,
                    fontSize: 11,
                    fontWeight: isDaySelected ? '800' : '600',
                  }}
                >
                  {days} Días
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Título de la Rutina y Nivel */}
      <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 2 }}>
        {suggestedRoutine.title}
      </Text>
      <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700', marginBottom: 8 }}>
        {suggestedRoutine.subtitle}
      </Text>

      <Text style={{ color: colors.mutedForeground, fontSize: 11.5, lineHeight: 17, marginBottom: 12 }}>
        {suggestedRoutine.description}
      </Text>

      {/* Píldoras informativas del algoritmo */}
      <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 12 }}>
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Nivel: <Text style={{ color: colors.foreground, fontWeight: '700' }}>{suggestedRoutine.levelLabel}</Text></Text>
        </View>
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Entorno: <Text style={{ color: colors.gold, fontWeight: '700' }}>{suggestedRoutine.locationLabel}</Text></Text>
        </View>
        <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
          <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Sesiones: <Text style={{ color: colors.primary, fontWeight: '700' }}>{suggestedRoutine.daysPerWeek} días</Text></Text>
        </View>
      </View>

      {/* ================= TARJETA GUÍA DEL HEAD COACH ESTEBAN (SERIES & REPS) ================= */}
      <View
        style={{
          backgroundColor: '#20152B',
          borderColor: `${colors.gold}50`,
          borderWidth: 1,
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 8 }}>
          <Feather name="award" size={14} color={colors.gold} />
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 0.5, flex: 1, minWidth: 0 }}>
            PAUTA OFICIAL HEAD COACH ESTEBAN · {suggestedRoutine.guidance.levelTitle.toUpperCase()}
          </Text>
        </View>
        <View style={{ gap: 5 }}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
            <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', flexShrink: 0 }}>• Series:</Text>
            <Text style={{ color: colors.foreground, fontSize: 11, flex: 1, minWidth: 0 }}>{suggestedRoutine.guidance.recommendedSets}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
            <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', flexShrink: 0 }}>• Repeticiones:</Text>
            <Text style={{ color: colors.foreground, fontSize: 11, flex: 1, minWidth: 0 }}>{suggestedRoutine.guidance.recommendedReps}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 6 }}>
            <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', flexShrink: 0 }}>• Descanso:</Text>
            <Text style={{ color: colors.foreground, fontSize: 11, flex: 1, minWidth: 0 }}>{suggestedRoutine.guidance.restTime}</Text>
          </View>
          <Text style={{ color: colors.mutedForeground, fontSize: 10.5, fontStyle: 'italic', marginTop: 4, lineHeight: 15 }}>
            "{suggestedRoutine.guidance.focusNotes}"
          </Text>
        </View>
      </View>

      {/* Desglose de Días de la Sugerencia con Series y Repeticiones recomendadas */}
      <View style={{ gap: 6, marginBottom: 12 }}>
        {suggestedRoutine.days.map((day) => {
          const isOpen = selectedSuggestedDay === day.dayId;
          return (
            <View
              key={day.dayId}
              style={{
                backgroundColor: isOpen ? '#251733' : '#140C1D',
                borderColor: isOpen ? colors.gold : `${colors.border}60`,
                borderWidth: 1,
                borderRadius: 10,
                padding: 10,
              }}
            >
              <Pressable
                onPress={() => setSelectedSuggestedDay(isOpen ? null : day.dayId)}
                style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}
              >
                <View style={{ flex: 1, minWidth: 0, paddingRight: 6 }}>
                  <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }} numberOfLines={2}>
                    {day.dayName} · <Text style={{ color: colors.gold }}>{day.focus}</Text>
                  </Text>
                  <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>
                    {day.exercises.length} ejercicios con series/reps · {isOpen ? 'Ocultar' : 'Ver ejercicios'}
                  </Text>
                </View>
                <Feather name={isOpen ? 'chevron-up' : 'chevron-down'} size={15} color={colors.gold} />
              </Pressable>

              {isOpen ? (
                <View style={{ marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: `${colors.border}60`, gap: 6 }}>
                  {day.exercises.map((ex, exIdx) => (
                    <View
                      key={`${ex.id}-${exIdx}`}
                      style={{
                        backgroundColor: '#191124',
                        borderRadius: 8,
                        padding: 8,
                        borderWidth: 1,
                        borderColor: `${colors.border}40`,
                      }}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8, marginBottom: 4 }}>
                        <Text style={{ color: colors.foreground, fontSize: 11.5, fontWeight: '700', flex: 1, minWidth: 0 }}>
                          {exIdx + 1}. {ex.name}
                        </Text>
                        <View style={{ backgroundColor: `${colors.gold}20`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, flexShrink: 0 }}>
                          <Text style={{ color: colors.gold, fontSize: 9.5, fontWeight: '800' }}>
                            {ex.targetSets} series × {ex.targetReps}
                          </Text>
                        </View>
                      </View>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 4 }}>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10, flex: 1, minWidth: 120 }}>
                          {ex.zone} · {ex.equipment} ({ex.movementType})
                        </Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 9.5, flexShrink: 0 }}>
                          ⏱ Descanso: {ex.restSeconds}s
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ) : null}
            </View>
          );
        })}
      </View>

      {/* Aviso de Discrecionalidad del Entrenador */}
      <View style={{ backgroundColor: 'rgba(255, 215, 0, 0.08)', padding: 8, borderRadius: 8, marginBottom: 12, borderWidth: 1, borderColor: `${colors.gold}30` }}>
        <Text style={{ color: colors.gold, fontSize: 10, lineHeight: 14 }}>
          ℹ️ {suggestedRoutine.trainerDisclaimer}
        </Text>
      </View>

      {/* ================= RECOMENDACIÓN DE CARDIO HIIT (CORE & METABOLISMO) ================= */}
      {suggestedRoutine.cardioRecommendation ? (
        <View
          style={{
            backgroundColor: '#191124',
            borderColor: '#FF475780',
            borderWidth: 1.2,
            borderRadius: 12,
            padding: 12,
            marginBottom: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, marginBottom: 8 }}>
            <View style={{ backgroundColor: '#FF475725', padding: 6, borderRadius: 8, marginTop: 1, flexShrink: 0 }}>
              <Feather name="zap" size={14} color="#FF4757" />
            </View>
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>
                {suggestedRoutine.cardioRecommendation.title}
              </Text>
              <Text style={{ color: '#FF4757', fontSize: 9.5, fontWeight: '800', letterSpacing: 0.5, marginTop: 2 }}>
                INTERVALOS 2x1 · QUEMA DE PESO & DEFINICIÓN
              </Text>
            </View>
          </View>

          <View style={{ backgroundColor: '#0D0814', padding: 10, borderRadius: 10, marginBottom: 8, gap: 6 }}>
            <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
              ⏱️ Variaciones de velocidad (Intervalos 2x1):
            </Text>
            <Text style={{ color: colors.foreground, fontSize: 10.5, lineHeight: 15 }}>
              {suggestedRoutine.cardioRecommendation.protocol}
            </Text>
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 4 }}>
              <View style={{ backgroundColor: '#2ED57322', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ color: '#2ED573', fontSize: 9.5, fontWeight: '700' }}>🟢 2 min Trote Regular</Text>
              </View>
              <View style={{ backgroundColor: '#FF475722', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                <Text style={{ color: '#FF4757', fontSize: 9.5, fontWeight: '700' }}>🔴 1 min Sprint Intenso</Text>
              </View>
            </View>
          </View>

          <View style={{ gap: 4 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, lineHeight: 14 }}>
              🔥 <Text style={{ color: colors.foreground, fontWeight: '700' }}>Mejora del Core:</Text> {suggestedRoutine.cardioRecommendation.coreTip}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, lineHeight: 14, marginTop: 2 }}>
              ⏳ <Text style={{ color: colors.foreground, fontWeight: '700' }}>Duración:</Text> {suggestedRoutine.cardioRecommendation.duration}
            </Text>
          </View>
        </View>
      ) : null}

      {/* Botón de Video para la Rutina Sugerida y Acción Admin */}
      {routineVideos?.['dynasty-sugerencia-ia'] ? (
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
          <Pressable
            onPress={() => handleOpenRoutineVideo(routineVideos['dynasty-sugerencia-ia'])}
            style={{
              flex: 1,
              backgroundColor: '#2A173B',
              borderColor: colors.gold,
              borderWidth: 1,
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 6,
            }}
          >
            <Feather name="video" size={13} color={colors.gold} />
            <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800' }}>
              Ver Video de la Sugerencia
            </Text>
          </Pressable>
          {isOwner ? (
            <Pressable
              onPress={() => handleOpenAdminVideoModal('dynasty-sugerencia-ia', 'Sugerencia Inicial Dynasty')}
              style={{
                backgroundColor: `${colors.primary}25`,
                borderColor: colors.primary,
                borderWidth: 1,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 10,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="edit-3" size={13} color={colors.primary} />
            </Pressable>
          ) : null}
        </View>
      ) : isOwner ? (
        <Pressable
          onPress={() => handleOpenAdminVideoModal('dynasty-sugerencia-ia', 'Sugerencia Inicial Dynasty')}
          style={{
            backgroundColor: `${colors.gold}15`,
            borderColor: `${colors.gold}60`,
            borderWidth: 1,
            borderStyle: 'dashed',
            paddingVertical: 8,
            paddingHorizontal: 10,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            marginBottom: 10,
          }}
        >
          <Feather name="plus-circle" size={13} color={colors.gold} />
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
            + Asignar Video a la Sugerencia (Admin)
          </Text>
        </Pressable>
      ) : null}

      {/* Botón Principal: Adoptar como mi Rutina Activa */}
      <Pressable
        onPress={handleAdoptSuggestion}
        style={({ pressed }) => [
          {
            backgroundColor: colors.gold,
            borderRadius: 12,
            paddingVertical: 12,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 7,
            opacity: pressed ? 0.8 : 1,
          },
        ]}
      >
        <Feather name="check-circle" size={15} color="#0B0710" />
        <Text style={{ color: '#0B0710', fontSize: 12.5, fontWeight: '800' }}>
          Adoptar como mi Rutina Activa
        </Text>
      </Pressable>
    </View>
  );

  return (
    <Screen>
      <TopBar title="Entrenamientos" subtitle="Categorías anatómicas con técnica estricta" />

      {/* Pestañas: Hoy / Mi Rutina / Historial */}
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 5, marginBottom: 14 }]}>
        <View style={{ flexDirection: 'row' }}>
          {(['Hoy', 'Mi Rutina', 'Historial'] as const).map((tab) => {
            const isTabActive = selectedDay === tab;
            return (
              <Pressable
                key={tab}
                onPress={() => setSelectedDay(tab)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  borderRadius: 12,
                  backgroundColor: isTabActive ? colors.primary : 'transparent',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: isTabActive ? colors.primaryForeground : colors.mutedForeground,
                    fontSize: 12,
                    fontWeight: isTabActive ? '800' : '600',
                  }}
                >
                  {tab}
                </Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* ======================= PESTAÑA: HOY ======================= */}
      {selectedDay === 'Hoy' ? (
        <>
          {/* ================= CARRUSEL HORIZONTAL DE GRUPOS MUSCULARES ================= */}
          <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 8 }}>
            Explorador Anatómico por Músculo
          </Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 14 }}>
            {muscleCategories.map((cat) => {
              const isSelected = cat.id === activeCategoryId;
              return (
                <Pressable
                  key={cat.id}
                  onPress={() => handleSelectCategory(cat.id)}
                  style={{
                    width: 140,
                    height: 160,
                    borderRadius: 18,
                    overflow: 'hidden',
                    borderWidth: 2,
                    borderColor: isSelected ? colors.primary : colors.border,
                    backgroundColor: colors.card,
                  }}
                >
                  <Image source={{ uri: cat.imageUrl }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
                  <View
                    style={{
                      ...StyleSheet.absoluteFill,
                      backgroundColor: isSelected ? 'rgba(23, 14, 2, 0.45)' : 'rgba(0,0,0,0.65)',
                      justifyContent: 'flex-end',
                      padding: 10,
                    }}
                  >
                    <Text style={{ color: isSelected ? colors.gold : '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                      {cat.name}
                    </Text>
                    <Text style={{ color: '#E0E0E0', fontSize: 9, marginTop: 2 }} numberOfLines={1}>
                      {cat.focus}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          {/* ================= TARJETA HERO DEL GRUPO ACTIVO ================= */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: colors.card,
                borderColor: colors.border,
                padding: 0,
                overflow: 'hidden',
                marginBottom: 14,
              },
            ]}
          >
            <View style={{ height: 160, width: '100%', position: 'relative' }}>
              <Image source={{ uri: activeCategory.imageUrl }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
              <View
                style={{
                  ...StyleSheet.absoluteFill,
                  backgroundColor: 'rgba(10, 6, 2, 0.58)',
                  justifyContent: 'space-between',
                  padding: 16,
                }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View style={{ backgroundColor: `${colors.primary}D9`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '800', letterSpacing: 0.5 }}>
                      ENFOQUE: {activeCategory.name.toUpperCase()}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 }}>
                    <Feather name="clock" size={12} color={colors.gold} />
                    <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700' }}>{activeCategory.timeEstimate}</Text>
                  </View>
                </View>

                <View>
                  <Text style={{ color: '#FFFFFF', fontSize: 22, fontWeight: '800' }}>{activeCategory.name}</Text>
                  <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '600', marginTop: 2 }}>
                    {activeCategory.subtitle} · {currentExercises.length} ejercicios disponibles
                  </Text>
                </View>
              </View>
            </View>

            {/* Alternar Gimnasio vs Casa */}
            <View style={{ padding: 12, flexDirection: 'row', gap: 8, borderTopWidth: 1, borderTopColor: colors.border }}>
              <Pressable
                onPress={() => setSelectedLocation('gym')}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 12,
                  backgroundColor: selectedLocation === 'gym' ? colors.primary : colors.card,
                  borderColor: selectedLocation === 'gym' ? colors.primary : colors.border,
                  borderWidth: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Feather name="anchor" size={14} color={selectedLocation === 'gym' ? colors.primaryForeground : colors.foreground} />
                <Text style={{ color: selectedLocation === 'gym' ? colors.primaryForeground : colors.foreground, fontSize: 12, fontWeight: '700' }}>
                  Gimnasio
                </Text>
              </Pressable>

              <Pressable
                onPress={() => setSelectedLocation('home')}
                style={{
                  flex: 1,
                  paddingVertical: 9,
                  borderRadius: 12,
                  backgroundColor: selectedLocation === 'home' ? colors.primary : colors.card,
                  borderColor: selectedLocation === 'home' ? colors.primary : colors.border,
                  borderWidth: 1,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Feather name="home" size={14} color={selectedLocation === 'home' ? colors.primaryForeground : colors.foreground} />
                <Text style={{ color: selectedLocation === 'home' ? colors.primaryForeground : colors.foreground, fontSize: 12, fontWeight: '700' }}>
                  En Casa
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ================= BARRA DE SUBENFOQUES ANATÓMICOS ================= */}
          <View style={{ marginBottom: 12 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 8 }}>
              Enfoque Anatómico ({activeCategory.subfocuses.length - 1} zonas)
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 4 }}>
              {activeCategory.subfocuses.map((sub) => {
                const active = selectedSubfocus === sub.id;
                return (
                  <Pressable
                    key={sub.id}
                    onPress={() => setSelectedSubfocus(sub.id)}
                    style={{
                      paddingHorizontal: 13,
                      paddingVertical: 8,
                      borderRadius: 13,
                      backgroundColor: active ? colors.primary : colors.card,
                      borderWidth: 1,
                      borderColor: active ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: active ? colors.primaryForeground : colors.foreground,
                        fontSize: 12,
                        fontWeight: '700',
                      }}
                    >
                      {sub.label}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>



          {/* ================= LISTA DE EJERCICIOS AGRUPADOS POR FAMILIA ================= */}
          <SectionHeader
            title={`Ejercicios: ${activeCategory.name} (${currentFamilies.length} bases · ${currentExercises.length} variantes)`}
            action={startedAt ? `⏱ En curso (${elapsedMinutes} min)` : 'Iniciar sesión'}
            onPress={() => toggleWorkoutTimer()}
          />

          {currentFamilies.map((family) => {
            const familyReqTier: MembershipTierId = family.defaultExercise.requiredTier || 'standard';
            const isLocked = !isItemUnlocked(familyReqTier, family.defaultExercise.id);
            const isSelected = selectedFamily?.id === family.id;
            const hasMultipleVariants = family.variants.length > 1;

            return (
              <Pressable
                key={family.id}
                onPress={() => {
                  setSelectedFamily(family);
                  setSelectedExercise(family.defaultExercise);
                }}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: isSelected ? colors.primary : colors.border,
                    paddingVertical: 11,
                    paddingHorizontal: 12,
                    marginBottom: 10,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {family.imageUrl ? (
                    <View style={{ width: 50, height: 50, borderRadius: 10, overflow: 'hidden', marginRight: 12, backgroundColor: colors.border }}>
                      <Image source={{ uri: family.imageUrl }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
                    </View>
                  ) : null}
                  <View style={{ flex: 1, minWidth: 0, paddingRight: 8 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: colors.foreground, fontSize: 13.5, fontWeight: '700', flex: 1 }} numberOfLines={1}>
                        {family.familyName}
                      </Text>
                      {hasMultipleVariants ? (
                        <View style={{ backgroundColor: `${colors.primary}25`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 6, flexShrink: 0 }}>
                          <Text style={{ color: colors.primary, fontSize: 9, fontWeight: '800' }}>
                            {family.variants.length} var.
                          </Text>
                        </View>
                      ) : null}
                      {isLocked ? (
                        <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 5, paddingVertical: 2, borderRadius: 5, flexShrink: 0 }}>
                          <Feather name="lock" size={10} color={colors.gold} />
                        </View>
                      ) : null}
                    </View>
                    <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '600', marginTop: 2 }} numberOfLines={1}>
                      {family.target}
                    </Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 10.5, marginTop: 2 }} numberOfLines={1}>
                      {family.equipmentList.slice(0, 3).join(', ')} · {family.time}
                    </Text>
                  </View>
                  <Feather name={isLocked ? "lock" : "chevron-right"} size={18} color={isLocked ? colors.gold : colors.mutedForeground} />
                </View>
              </Pressable>
            );
          })}

          {/* Botón inferior de sesión de entreno */}
          <View style={{ marginTop: 10, marginBottom: 20 }}>
            <PrimaryButton
              title={startedAt ? `Terminar entrenamiento (${elapsedMinutes} min)` : `Comenzar sesión de ${activeCategory.name}`}
              icon={startedAt ? 'check-circle' : 'play'}
              onPress={() => toggleWorkoutTimer()}
            />
          </View>
        </>
      ) : selectedDay === 'Mi Rutina' ? (
        /* ======================= PESTAÑA: MI RUTINA ======================= */
        <>
          {/* Banner de Asesoría 24/7 con Entrenador Designado */}
          <Pressable
            onPress={() => router.push('/trainer-chat' as never)}
            style={({ pressed }) => [
              {
                backgroundColor: '#1E1428',
                borderColor: `${colors.gold}80`,
                borderWidth: 1.2,
                borderRadius: 16,
                padding: 12,
                marginBottom: 16,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: pressed ? 0.85 : 1,
              },
            ]}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View style={{ width: 36, height: 36, borderRadius: 12, backgroundColor: `${colors.gold}25`, alignItems: 'center', justifyContent: 'center' }}>
                <Feather name="message-circle" size={18} color={colors.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                    ¿Dudas con tu técnica o rutina?
                  </Text>
                  <View style={{ backgroundColor: `${colors.gold}30`, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                    <Text style={{ color: colors.gold, fontSize: 8.5, fontWeight: '800' }}>24/7</Text>
                  </View>
                </View>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
                  Chatea con Coach Esteban y el equipo de entrenadores
                </Text>
              </View>
            </View>
            <Feather name="chevron-right" size={16} color={colors.gold} />
          </Pressable>

          {/* SI TIENE RUTINA ACTIVA, MOSTRARLA AL INICIO */}
          {hasActiveRoutine ? renderActiveRoutineSection() : null}

          {/* ================= SELECTOR DE SUBPESTAÑAS EN MI RUTINA ================= */}
          <View style={{ flexDirection: 'row', backgroundColor: '#130C1C', borderRadius: 14, padding: 4, marginBottom: 14, borderWidth: 1, borderColor: `${colors.border}80` }}>
            <Pressable
              onPress={() => setMiRutinaSubTab('suggestion')}
              style={{
                flex: 1,
                paddingVertical: 9,
                borderRadius: 10,
                backgroundColor: miRutinaSubTab === 'suggestion' ? colors.gold : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: miRutinaSubTab === 'suggestion' ? '#0B0710' : colors.mutedForeground, fontSize: 11.5, fontWeight: '800' }}>
                ⚡ Generador IA Dinámico
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setMiRutinaSubTab('prebuilt')}
              style={{
                flex: 1,
                paddingVertical: 9,
                borderRadius: 10,
                backgroundColor: miRutinaSubTab === 'prebuilt' ? colors.gold : 'transparent',
                alignItems: 'center',
              }}
            >
              <Text style={{ color: miRutinaSubTab === 'prebuilt' ? '#0B0710' : colors.mutedForeground, fontSize: 11.5, fontWeight: '800' }}>
                📚 Catálogo de Rutinas ({DYNASTY_PREBUILT_ROUTINES.length})
              </Text>
            </Pressable>
          </View>

          {miRutinaSubTab === 'suggestion' ? (
            hasActiveRoutine ? (
              <>
                {renderSuggestionDashBanner()}
                {showSuggestionExpanded ? renderSuggestionDetailsCard() : null}
              </>
            ) : (
              renderSuggestionDetailsCard()
            )
          ) : (
            /* ================= CATÁLOGO DE RUTINAS PRE-ARMADAS OFICIALES ================= */
            <View style={{ gap: 14, marginBottom: 16 }}>
              {DYNASTY_PREBUILT_ROUTINES.map((routine) => {
                const isExpanded = expandedPrebuiltId === routine.id;
                const routineReqTier: MembershipTierId = routine.tierRequirement as MembershipTierId;
                const isRoutineUnlocked = isItemUnlocked(routineReqTier, routine.id);
                const isRoutineAdUnlocked = isItemUnlockedWithAd(routine.id);
                const routineRemainingDays = getItemAdRemainingDays(routine.id);
                const routineReqAds = getRequiredAdsForItem(routine.id);
                const routineCurAds = getAdProgressForItem(routine.id);

                return (
                  <View
                    key={routine.id}
                    style={[
                      styles.card,
                      {
                        backgroundColor: '#1C1226',
                        borderColor: isExpanded ? colors.gold : `${colors.border}70`,
                        borderWidth: 1.5,
                        padding: 14,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                        {routine.badge ? (
                          <View style={{ backgroundColor: colors.gold, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                            <Text style={{ color: '#0B0710', fontSize: 9, fontWeight: '900' }}>{routine.badge}</Text>
                          </View>
                        ) : null}
                        <View style={{ backgroundColor: `${colors.primary}25`, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6 }}>
                          <Text style={{ color: colors.primary, fontSize: 9, fontWeight: '800' }}>{routine.daysPerWeek} DÍAS / SEMANA</Text>
                        </View>
                      </View>

                      {!isRoutineUnlocked ? (
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: 'rgba(255, 215, 0, 0.15)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
                          <Feather name="lock" size={11} color={colors.gold} />
                          <Text style={{ color: colors.gold, fontSize: 9.5, fontWeight: '800' }}>{routine.tierRequirement.toUpperCase()}</Text>
                        </View>
                      ) : isRoutineAdUnlocked ? (
                        <View style={{ backgroundColor: `${colors.gold}30`, paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
                          <Text style={{ color: colors.gold, fontSize: 9.5, fontWeight: '800' }}>PATROCINIO ({routineRemainingDays}D)</Text>
                        </View>
                      ) : (
                        <View style={{ backgroundColor: 'rgba(46, 213, 115, 0.15)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
                          <Text style={{ color: '#2ED573', fontSize: 9.5, fontWeight: '800' }}>DISPONIBLE</Text>
                        </View>
                      )}
                    </View>

                    <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800', marginBottom: 3 }}>
                      {routine.title}
                    </Text>
                    <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700', marginBottom: 8 }}>
                      {routine.subtitle}
                    </Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11.5, lineHeight: 16, marginBottom: 10 }}>
                      {routine.description}
                    </Text>

                    {/* Píldoras informativas */}
                    <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap', marginBottom: 10 }}>
                      <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Nivel: <Text style={{ color: colors.foreground, fontWeight: '700' }}>{routine.level}</Text></Text>
                      </View>
                      <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Entorno: <Text style={{ color: colors.gold, fontWeight: '700' }}>{routine.location === 'gym' ? '🏋️ Gimnasio' : '🏠 Casa'}</Text></Text>
                      </View>
                      <View style={{ backgroundColor: 'rgba(255, 255, 255, 0.05)', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6 }}>
                        <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>Ejercicios: <Text style={{ color: colors.primary, fontWeight: '700' }}>{routine.allExerciseIds.length} totales</Text></Text>
                      </View>
                    </View>

                    {/* Pauta oficial de Esteban */}
                    <View style={{ backgroundColor: '#20152B', padding: 8, borderRadius: 8, marginBottom: 10, borderLeftWidth: 3, borderLeftColor: colors.gold }}>
                      <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800', marginBottom: 2 }}>PAUTA HEAD COACH ESTEBAN</Text>
                      <Text style={{ color: colors.foreground, fontSize: 10.5, lineHeight: 15, fontStyle: 'italic' }}>
                        "{routine.coachNotes}"
                      </Text>
                    </View>

                    {/* Botón de Video y Acción de Administrador */}
                    {routineVideos?.[routine.id] ? (
                      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
                        <Pressable
                          onPress={() => handleOpenRoutineVideo(routineVideos[routine.id])}
                          style={{
                            flex: 1,
                            backgroundColor: '#2A173B',
                            borderColor: colors.gold,
                            borderWidth: 1,
                            paddingVertical: 8,
                            paddingHorizontal: 10,
                            borderRadius: 9,
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                        >
                          <Feather name="video" size={13} color={colors.gold} />
                          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
                            Ver Video de la Rutina
                          </Text>
                        </Pressable>

                        {isOwner ? (
                          <Pressable
                            onPress={() => handleOpenAdminVideoModal(routine.id, routine.title)}
                            style={{
                              backgroundColor: `${colors.primary}25`,
                              borderColor: colors.primary,
                              borderWidth: 1,
                              paddingVertical: 8,
                              paddingHorizontal: 10,
                              borderRadius: 9,
                              flexDirection: 'row',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: 5,
                            }}
                          >
                            <Feather name="edit-3" size={13} color={colors.primary} />
                            <Text style={{ color: colors.primary, fontSize: 10.5, fontWeight: '800' }}>
                              Editar (Admin)
                            </Text>
                          </Pressable>
                        ) : null}
                      </View>
                    ) : isOwner ? (
                      <Pressable
                        onPress={() => handleOpenAdminVideoModal(routine.id, routine.title)}
                        style={{
                          backgroundColor: `${colors.gold}15`,
                          borderColor: `${colors.gold}60`,
                          borderWidth: 1,
                          borderStyle: 'dashed',
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          borderRadius: 9,
                          flexDirection: 'row',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: 6,
                          marginBottom: 10,
                        }}
                      >
                        <Feather name="plus-circle" size={13} color={colors.gold} />
                        <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
                          + Asignar Video a esta Rutina (Admin)
                        </Text>
                      </Pressable>
                    ) : null}

                    {/* Acordeón de días o Bloqueo Real */}
                    {!isRoutineUnlocked ? (
                      <View style={{ backgroundColor: '#140C1D', borderRadius: 10, padding: 12, borderWidth: 1, borderColor: `${colors.gold}60`, marginBottom: 12 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <Feather name="lock" size={14} color={colors.gold} />
                          <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '800' }}>
                            PROGRAMA COMPLETO BLOQUEADO
                          </Text>
                        </View>
                        <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 16 }}>
                          El desglose detallado de las {routine.days.length} sesiones, ejercicios y series/reps está reservado para miembros {routine.tierRequirement.toUpperCase()} o desbloqueable con anuncios patrocinados de la Dinastía.
                        </Text>
                      </View>
                    ) : (
                      <>
                        <Pressable
                          onPress={() => setExpandedPrebuiltId(isExpanded ? null : routine.id)}
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            paddingVertical: 8,
                            borderTopWidth: 1,
                            borderTopColor: `${colors.border}60`,
                            marginBottom: isExpanded ? 10 : 6,
                          }}
                        >
                          <Text style={{ color: colors.foreground, fontSize: 11.5, fontWeight: '700' }}>
                            {isExpanded ? 'Ocultar desglose de sesiones' : `Ver desglose de los ${routine.days.length} días`}
                          </Text>
                          <Feather name={isExpanded ? 'chevron-up' : 'chevron-down'} size={16} color={colors.gold} />
                        </Pressable>

                        {isExpanded ? (
                          <View style={{ gap: 8, marginBottom: 12 }}>
                            {routine.days.map((day) => {
                              const isDayOpen = expandedPrebuiltDayId === day.dayId;
                              return (
                                <View
                                  key={day.dayId}
                                  style={{
                                    backgroundColor: '#140C1D',
                                    borderRadius: 8,
                                    padding: 8,
                                    borderWidth: 1,
                                    borderColor: `${colors.border}50`,
                                  }}
                                >
                                  <Pressable
                                    onPress={() => setExpandedPrebuiltDayId(isDayOpen ? null : day.dayId)}
                                    style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
                                  >
                                    <View style={{ flex: 1, paddingRight: 6 }}>
                                      <Text style={{ color: colors.foreground, fontSize: 11.5, fontWeight: '700' }}>
                                        {day.dayName} · <Text style={{ color: colors.gold }}>{day.focus}</Text>
                                      </Text>
                                      <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1 }}>
                                        {day.exercises.length} ejercicios · {isDayOpen ? 'Ocultar' : 'Ver detalle'}
                                      </Text>
                                    </View>
                                    <Feather name={isDayOpen ? 'chevron-up' : 'chevron-down'} size={14} color={colors.mutedForeground} />
                                  </Pressable>

                                  {isDayOpen ? (
                                    <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: `${colors.border}40`, gap: 5 }}>
                                      {day.exercises.map((ex, exIdx) => (
                                        <View key={`${ex.id}-${exIdx}`} style={{ backgroundColor: '#191124', padding: 6, borderRadius: 6, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                                          <View style={{ flex: 1, paddingRight: 6 }}>
                                            <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '600' }}>
                                              {exIdx + 1}. {ex.name}
                                            </Text>
                                            <Text style={{ color: colors.mutedForeground, fontSize: 9.5 }}>
                                              {ex.zone} · {ex.equipment}
                                            </Text>
                                          </View>
                                          <View style={{ backgroundColor: `${colors.gold}20`, paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 }}>
                                            <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>
                                              {ex.targetSets} × {ex.targetReps}
                                            </Text>
                                          </View>
                                        </View>
                                      ))}
                                    </View>
                                  ) : null}
                                </View>
                              );
                            })}
                          </View>
                        ) : null}
                      </>
                    )}

                    {/* Botón de Adopción Directa o Desbloqueo por Membresía / Ads */}
                    {!isRoutineUnlocked ? (
                      <View style={{ gap: 8, marginTop: 4 }}>
                        <Pressable
                          onPress={() => router.push('/plans')}
                          style={{
                            backgroundColor: colors.gold,
                            borderRadius: 10,
                            paddingVertical: 10,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 6,
                          }}
                        >
                          <Feather name="lock" size={13} color="#0B0710" />
                          <Text style={{ color: '#0B0710', fontSize: 12, fontWeight: '800' }}>
                            Desbloquear con Plan {routine.tierRequirement.toUpperCase()}
                          </Text>
                        </Pressable>

                        {routineReqAds > 0 ? (
                          <Pressable
                            onPress={() => {
                              setAdTargetItem({
                                id: routine.id,
                                title: routine.title,
                                type: 'routine',
                                requiredTier: routineReqTier,
                              });
                              setAdModalVisible(true);
                            }}
                            style={{
                              backgroundColor: `${colors.gold}20`,
                              borderColor: colors.gold,
                              borderWidth: 1,
                              borderRadius: 10,
                              paddingVertical: 10,
                              alignItems: 'center',
                              flexDirection: 'row',
                              justifyContent: 'center',
                              gap: 6,
                            }}
                          >
                            <Feather name="video" size={14} color={colors.gold} />
                            <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '700' }}>
                              Ver Anuncio ({routineCurAds}/{routineReqAds} vistos) · Desbloqueo 7 Días
                            </Text>
                          </Pressable>
                        ) : null}
                      </View>
                    ) : (
                      <Pressable
                        onPress={() => handleAdoptPrebuilt(routine)}
                        style={({ pressed }) => [
                          {
                            backgroundColor: colors.gold,
                            borderRadius: 10,
                            paddingVertical: 10,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'center',
                            gap: 6,
                            opacity: pressed ? 0.8 : 1,
                          },
                        ]}
                      >
                        <Feather name="check-circle" size={14} color="#0B0710" />
                        <Text style={{ color: "#0B0710", fontSize: 12, fontWeight: '800' }}>
                          Adoptar este Programa Oficial
                        </Text>
                      </Pressable>
                    )}
                  </View>
                );
              })}
            </View>
          )}

          {/* SI NO TIENE RUTINA ACTIVA, MOSTRAR EL CREADOR MANUAL ABAJO */}
          {!hasActiveRoutine ? renderActiveRoutineSection() : null}
        </>
      ) : (
        /* ======================= PESTAÑA: HISTORIAL ======================= */
        <View style={{ marginTop: 6, marginBottom: 20 }}>
          <SectionHeader title="Historial reciente" />
          {workouts.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 40 }]}>
              <Feather name="calendar" size={36} color={colors.mutedForeground} />
              <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 15, marginTop: 12 }}>
                Sin registros aún
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 4, textAlign: 'center', paddingHorizontal: 20 }}>
                Completa una sesión de entrenamiento hoy para empezar a acumular tu racha.
              </Text>
            </View>
          ) : (
            workouts.map((w) => (
              <View key={w.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 10 }]}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <View>
                    <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14 }}>
                      {w.routineName}
                    </Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 3 }}>
                      {new Intl.DateTimeFormat('es-CR', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(w.completedAt))}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: `${colors.primary}22`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 }}>
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
                      {w.durationMinutes} min
                    </Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </View>
      )}

      {/* ================= MODAL WIZARD DE RUTINA PERSONALIZADA ================= */}
      <CustomRoutineWizard
        visible={wizardVisible}
        onClose={() => setWizardVisible(false)}
        userTier={membership}
        initialSelectedIds={customRoutine?.libraryIds ?? []}
        initialDays={customRoutine?.days ?? []}
        onSaveRoutine={async (libraryIds, days) => {
          await saveCustomRoutine(libraryIds, days);
          if (days.length > 0) {
            setSelectedCustomDay(days[0]);
          }
          setWizardVisible(false);
          Alert.alert('¡Rutina Guardada!', 'Tu rutina personalizada Dynasty ha sido configurada exitosamente.');
        }}
        onUpgradePress={() => {
          setWizardVisible(false);
          router.push('/plans');
        }}
      />

      {/* ================= MODAL DE ANUNCIOS PATROCINADOS DYNASTY ================= */}
      <DynastyAdModal
        visible={adModalVisible}
        onClose={() => setAdModalVisible(false)}
        onRewardClaimed={handleAdRewardClaimed}
        title={`Desbloquear ${adTargetItem?.title || 'Contenido'}`}
        subtitle="Mira este anuncio oficial para acumular progreso y desbloquear por 7 días"
      />

      {/* ================= MODAL DESLIZANTE DE DETALLE DE EJERCICIO ================= */}
      <Modal
        visible={Boolean(selectedExercise)}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setSelectedExercise(null)}
      >
        <View style={modalStyles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setSelectedExercise(null)} />
          <View
            style={[
              modalStyles.modalContent,
              {
                backgroundColor: '#160F20',
                borderColor: colors.gold,
              },
            ]}
          >
            {selectedExercise ? (
              (() => {
                const exerciseReqTier: MembershipTierId = selectedExercise.requiredTier || 'standard';
                const isExerciseUnlocked = isItemUnlocked(exerciseReqTier, selectedExercise.id);
                const isAdUnlocked = Boolean(selectedExercise.id && isItemUnlockedWithAd(selectedExercise.id));
                const remainingDays = selectedExercise.id ? getItemAdRemainingDays(selectedExercise.id) : 0;
                const reqAds = selectedExercise.id ? getRequiredAdsForItem(selectedExercise.id) : 0;
                const curAds = selectedExercise.id ? getAdProgressForItem(selectedExercise.id) : 0;

                return (
                  <>
                    {/* Header con botón X */}
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, flex: 1, minWidth: 0, paddingRight: 8 }}>
                        <View style={{ backgroundColor: `${colors.primary}25`, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 }}>
                          <Text style={{ color: colors.primary, fontSize: 10.5, fontWeight: '800' }}>
                            {selectedExercise.subfocus.toUpperCase()}
                          </Text>
                        </View>
                        {selectedExercise.requiredTier ? (
                          <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                            <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800' }}>
                              {selectedExercise.requiredTier.toUpperCase()}
                            </Text>
                          </View>
                        ) : null}
                        {isAdUnlocked ? (
                          <View style={{ backgroundColor: `${colors.gold}30`, paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8 }}>
                            <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800' }}>
                              PATROCINIO ({remainingDays}D)
                            </Text>
                          </View>
                        ) : null}
                      </View>
                      <Pressable
                        onPress={() => setSelectedExercise(null)}
                        style={{
                          width: 32,
                          height: 32,
                          borderRadius: 16,
                          backgroundColor: 'rgba(255,255,255,0.08)',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Feather name="x" size={18} color={colors.foreground} />
                      </Pressable>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                      {/* Imagen destacada en alta resolución */}
                      {selectedExercise.imageUrl ? (
                        <View style={{ height: 180, width: '100%', marginBottom: 14, borderRadius: 14, overflow: 'hidden', backgroundColor: '#100918' }}>
                          <Image source={{ uri: selectedExercise.imageUrl }} contentFit="cover" style={{ width: '100%', height: '100%' }} />
                        </View>
                      ) : null}

                      <Text style={{ color: colors.foreground, fontSize: 20, fontWeight: '800', lineHeight: 26, marginBottom: 4 }}>
                        {selectedExercise.name}
                      </Text>
                      <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '700', marginBottom: 10 }}>
                        🎯 Músculo diana: {selectedExercise.target}
                      </Text>

                      <View style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                          <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>
                            ⚡️ {selectedExercise.detail}
                          </Text>
                        </View>
                        <View style={{ backgroundColor: 'rgba(255,255,255,0.05)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                          <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>
                            ⏱ {selectedExercise.time}
                          </Text>
                        </View>
                      </View>

                      {/* BLOQUEO REAL: Si no está desbloqueado, ocultar secretos, variantes y técnica */}
                      {!isExerciseUnlocked ? (
                        <View
                          style={{
                            backgroundColor: '#1C1226',
                            borderColor: colors.gold,
                            borderWidth: 1.5,
                            borderRadius: 14,
                            padding: 14,
                            marginTop: 4,
                          }}
                        >
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                            <Feather name="lock" size={16} color={colors.gold} />
                            <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '800' }}>
                              EJERCICIO BLOQUEADO ({exerciseReqTier.toUpperCase()})
                            </Text>
                          </View>
                          <Text style={{ color: colors.mutedForeground, fontSize: 11.5, lineHeight: 16, marginBottom: 12 }}>
                            La técnica biomecánica completa, consejos de ejecución, ficha de agarre y variantes avanzadas requieren membresía {exerciseReqTier.toUpperCase()} o puedes desbloquearlo viendo anuncios de patrocinadores oficiales.
                          </Text>

                          <View style={{ gap: 8 }}>
                            <Pressable
                              onPress={() => {
                                setSelectedExercise(null);
                                router.push('/plans');
                              }}
                              style={{
                                backgroundColor: colors.gold,
                                paddingVertical: 11,
                                borderRadius: 10,
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                            >
                              <Text style={{ color: '#0B0710', fontSize: 12.5, fontWeight: '800' }}>
                                Mejorar a Membresía {exerciseReqTier.toUpperCase()}
                              </Text>
                            </Pressable>

                            {reqAds > 0 ? (
                              <Pressable
                                onPress={() => {
                                  const target = selectedExercise;
                                  setAdTargetItem({
                                    id: target.id || target.name,
                                    title: target.name,
                                    type: 'exercise',
                                    requiredTier: exerciseReqTier,
                                  });
                                  setAdModalVisible(true);
                                }}
                                style={{
                                  backgroundColor: `${colors.gold}20`,
                                  borderColor: colors.gold,
                                  borderWidth: 1,
                                  paddingVertical: 11,
                                  borderRadius: 10,
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  gap: 6,
                                }}
                              >
                                <Feather name="video" size={14} color={colors.gold} />
                                <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '700' }}>
                                  Ver Anuncio ({curAds}/{reqAds} vistos) · Desbloqueo 7 Días
                                </Text>
                              </Pressable>
                            ) : null}
                          </View>
                        </View>
                      ) : (
                        <>
                          {/* Selector Interactivo de Variantes */}
                          {selectedFamily && selectedFamily.variants.length > 1 ? (
                            <View style={{ marginTop: 6, marginBottom: 12 }}>
                              <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800', letterSpacing: 0.5, marginBottom: 8 }}>
                                VARIANTES DE EQUIPO Y AGARRE DISPONIBLES ({selectedFamily.variants.length}):
                              </Text>
                              <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6, paddingVertical: 2 }}>
                                {selectedFamily.variants.map((v) => {
                                  const isCurrent = selectedExercise.name === v.name;
                                  const chipLabel = extractVariantLabel(v.name, selectedFamily.familyName);
                                  return (
                                    <Pressable
                                      key={v.id || v.name}
                                      onPress={() => setSelectedExercise(v)}
                                      style={{
                                        paddingHorizontal: 12,
                                        paddingVertical: 7,
                                        borderRadius: 10,
                                        backgroundColor: isCurrent ? colors.primary : '#22152F',
                                        borderWidth: 1,
                                        borderColor: isCurrent ? colors.primary : `${colors.border}80`,
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: isCurrent ? colors.primaryForeground : colors.foreground,
                                          fontSize: 11,
                                          fontWeight: isCurrent ? '800' : '600',
                                        }}
                                      >
                                        {chipLabel}
                                      </Text>
                                    </Pressable>
                                  );
                                })}
                              </ScrollView>
                            </View>
                          ) : null}

                          {/* Ficha de Equipamiento Biomecánico */}
                          <View style={{ backgroundColor: '#1A1124', borderRadius: 12, padding: 12, borderWidth: 1, borderColor: `${colors.border}60`, marginBottom: 12 }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                              <Feather name="cpu" size={13} color={colors.gold} />
                              <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800', letterSpacing: 0.5 }}>
                                ESPECIFICACIÓN BIOMECÁNICA
                              </Text>
                            </View>
                            <Text style={{ color: colors.foreground, fontSize: 11.5, marginBottom: 4 }}>
                              • Equipamiento requerido: <Text style={{ color: colors.gold, fontWeight: '700' }}>{selectedExercise.equipment}</Text>
                            </Text>
                            <Text style={{ color: colors.foreground, fontSize: 11.5, marginBottom: 4 }}>
                              • Modalidad: <Text style={{ color: colors.primary, fontWeight: '700' }}>{selectedExercise.modality || (selectedLocation === 'gym' ? 'Gimnasio comercial / peso libre y poleas' : 'Entorno casero / mancuernas')}</Text>
                            </Text>

                            {/* Variantes alternativas compatibles */}
                            {selectedExercise.variants && selectedExercise.variants.length > 0 ? (
                              <View style={{ marginTop: 8, paddingTop: 6, borderTopWidth: 1, borderTopColor: `${colors.border}40` }}>
                                <Text style={{ color: colors.mutedForeground, fontSize: 10, marginBottom: 5 }}>Variantes compatibles en rutina:</Text>
                                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 5 }}>
                                  {selectedExercise.variants.map((v, vIdx) => (
                                    <View key={vIdx} style={{ backgroundColor: '#20152B', paddingHorizontal: 7, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: `${colors.border}50` }}>
                                      <Text style={{ color: colors.foreground, fontSize: 10 }}>{v}</Text>
                                    </View>
                                  ))}
                                </View>
                              </View>
                            ) : null}
                          </View>

                          {/* Guía de Técnica & Ejecución */}
                          {selectedExercise.instructions ? (
                            <View style={{ backgroundColor: '#140D1E', borderRadius: 12, padding: 14, borderWidth: 1, borderColor: `${colors.gold}40`, marginBottom: 12 }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                                <Feather name="check-circle" size={14} color={colors.gold} />
                                <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
                                  TÉCNICA DE EJECUCIÓN & BIOMECÁNICA
                                </Text>
                              </View>
                              <Text style={{ color: colors.foreground, fontSize: 12.5, lineHeight: 18, fontStyle: 'italic', opacity: 0.9 }}>
                                "{selectedExercise.instructions}"
                              </Text>
                            </View>
                          ) : null}
                        </>
                      )}

                      {/* Botón de cierre */}
                      <View style={{ marginTop: 8 }}>
                        <Pressable
                          onPress={() => setSelectedExercise(null)}
                          style={{
                            backgroundColor: 'rgba(255,255,255,0.08)',
                            paddingVertical: 12,
                            borderRadius: 12,
                            alignItems: 'center',
                          }}
                        >
                          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>
                            Cerrar Ficha de Ejercicio
                          </Text>
                        </Pressable>
                      </View>
                    </ScrollView>
                  </>
                );
              })()
            ) : null}
          </View>
        </View>
      </Modal>

      {/* ================= MODAL EXCLUSIVO DE ADMINISTRADOR: ASIGNACIÓN DE VIDEO ================= */}
      <Modal
        visible={Boolean(adminVideoModalTarget)}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setAdminVideoModalTarget(null)}
      >
        <View style={modalStyles.modalOverlay}>
          <Pressable style={StyleSheet.absoluteFill} onPress={() => setAdminVideoModalTarget(null)} />
          <View
            style={[
              modalStyles.modalContent,
              {
                backgroundColor: '#160F20',
                borderColor: colors.gold,
              },
            ]}
          >
            {adminVideoModalTarget ? (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 24 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1, minWidth: 0 }}>
                    <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 10, paddingVertical: 5, borderRadius: 8 }}>
                      <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
                        ADMINISTRADOR EXCLUSIVO
                      </Text>
                    </View>
                  </View>
                  <Pressable
                    onPress={() => setAdminVideoModalTarget(null)}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 16,
                      backgroundColor: 'rgba(255,255,255,0.08)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name="x" size={18} color={colors.foreground} />
                  </Pressable>
                </View>

                <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800', marginBottom: 4 }}>
                  Vincular Video Demostrativo
                </Text>
                <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '700', marginBottom: 12 }}>
                  Rutina: {adminVideoModalTarget.title}
                </Text>

                <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 18, marginBottom: 14 }}>
                  Como administrador, puedes asignar una URL de YouTube, Vimeo, Google Drive o MP4. Todos tus atletas y usuarios podrán ver este video al consultar esta rutina.
                </Text>

                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700', marginBottom: 6 }}>
                  Enlace / URL del Video:
                </Text>
                <TextInput
                  value={adminVideoInputUrl}
                  onChangeText={setAdminVideoInputUrl}
                  placeholder="https://www.youtube.com/watch?v=..."
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    color: colors.foreground,
                    fontSize: 13,
                    marginBottom: 10,
                  }}
                />

                {/* Botón para probar el enlace */}
                {adminVideoInputUrl.trim().length > 0 ? (
                  <Pressable
                    onPress={() => handleOpenRoutineVideo(adminVideoInputUrl.trim())}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      paddingHorizontal: 12,
                      paddingVertical: 9,
                      borderRadius: 10,
                      alignSelf: 'flex-start',
                      marginBottom: 16,
                    }}
                  >
                    <Feather name="external-link" size={14} color={colors.primary} />
                    <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>
                      Probar enlace en navegador
                    </Text>
                  </Pressable>
                ) : null}

                {/* Acciones de guardado / eliminación */}
                <View style={{ gap: 10, marginTop: 4 }}>
                  <Pressable
                    onPress={handleSaveAdminVideo}
                    style={{
                      backgroundColor: colors.gold,
                      paddingVertical: 12,
                      borderRadius: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 8,
                    }}
                  >
                    <Feather name="check" size={16} color="#000" />
                    <Text style={{ color: '#000', fontSize: 14, fontWeight: '800' }}>
                      Guardar y Publicar Video
                    </Text>
                  </Pressable>

                  {routineVideos?.[adminVideoModalTarget.id] ? (
                    <Pressable
                      onPress={handleRemoveAdminVideo}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        borderColor: '#EF4444',
                        borderWidth: 1,
                        paddingVertical: 12,
                        borderRadius: 12,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                      }}
                    >
                      <Feather name="trash-2" size={16} color="#EF4444" />
                      <Text style={{ color: '#EF4444', fontSize: 13, fontWeight: '700' }}>
                        Desvincular Video Actual
                      </Text>
                    </Pressable>
                  ) : null}

                  <Pressable
                    onPress={() => setAdminVideoModalTarget(null)}
                    style={{
                      backgroundColor: 'rgba(255,255,255,0.06)',
                      paddingVertical: 12,
                      borderRadius: 12,
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ color: colors.mutedForeground, fontSize: 13, fontWeight: '600' }}>
                      Cancelar
                    </Text>
                  </Pressable>
                </View>
              </ScrollView>
            ) : null}
          </View>
        </View>
      </Modal>

    </Screen>
  );
}
const modalStyles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '88%',
    borderTopWidth: 2,
  },
});
