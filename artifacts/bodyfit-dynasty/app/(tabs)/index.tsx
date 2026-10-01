import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import { SymbolView } from 'expo-symbols';
import React, { useMemo, useState } from 'react';
import { Alert, Modal, Platform, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { GradientCard, images, MetricCard, PrimaryButton, ProgressBar, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { useListWorkoutLogs } from '@workspace/api-client-react';
import { StreakRescueModal } from '@/components/StreakRescueModal';
import { MonthlyActivityModal } from '@/components/MonthlyActivityModal';
import { getDailyDynastyQuote, getRandomDynastyQuote, type DynastyQuote } from '@/constants/dynastyQuotes';
import { LinearGradient } from 'expo-linear-gradient';
import { FITNESS_FOCUS_OPTIONS, getFitnessFocus, type FitnessFocusOption } from '@/constants/fitnessGoals';
import { AppleHealthMacroRings } from '@/components/AppleHealthMacroRings';

function AppleFitnessFlame({ size = 28, iconSize = 16 }: { size?: number; iconSize?: number }) {
  const isIOS = Platform.OS === 'ios';
  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2.6,
        backgroundColor: '#261208',
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#FF550055',
      }}
    >
      {isIOS ? (
        <SymbolView name="flame.fill" tintColor="#FF5500" size={iconSize} />
      ) : (
        <Ionicons name="flame" size={iconSize} color="#FF5500" />
      )}
    </View>
  );
}

const focusHeroImages: Record<string, string> = {
  hipertrofia: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=900&auto=format&fit=crop&q=80',
  gluteos_piernas: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=900&auto=format&fit=crop&q=80',
  estetica: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=900&auto=format&fit=crop&q=80',
  definicion: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&auto=format&fit=crop&q=80',
  fuerza: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=900&auto=format&fit=crop&q=80',
  volumen: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=900&auto=format&fit=crop&q=80',
};

const featuredMachines = [
  {
    id: 'm1',
    name: 'Prensa de Piernas 45°',
    category: 'Piernas',
    muscles: 'Cuádriceps, glúteos y femorales',
    type: 'Carga de discos',
    image: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=500&auto=format&fit=crop&q=80',
    description: 'Empuje con talones a 90 grados para máxima tensión en cuádriceps.',
  },
  {
    id: 'm2',
    name: 'Peck Deck / Aperturas',
    category: 'Pecho',
    muscles: 'Pectoral mayor y fibras medias',
    type: 'Placas guiadas',
    image: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=500&auto=format&fit=crop&q=80',
    description: 'Aislamiento pectoral estricto con retracción escapular completa.',
  },
  {
    id: 'm3',
    name: 'Hip Thrust en Máquina',
    category: 'Glúteos',
    muscles: 'Glúteo mayor y extensión de cadera',
    type: 'Placas / Palanca',
    image: 'https://images.unsplash.com/photo-1518611012118-696072aa579a?w=500&auto=format&fit=crop&q=80',
    description: 'Bloqueo arriba durante 1 segundo para hipertrofia de glúteo superior.',
  },
  {
    id: 'm4',
    name: 'Jalón al Pecho (Lat Pulldown)',
    category: 'Espalda',
    muscles: 'Dorsal ancho y espalda alta',
    type: 'Polea alta',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=500&auto=format&fit=crop&q=80',
    description: 'Tracción al pecho alto con codos apuntando hacia abajo.',
  },
  {
    id: 'm5',
    name: 'Hack Squat (Sentadilla Hack)',
    category: 'Piernas',
    muscles: 'Vasto externo y cuádriceps',
    type: 'Máquina inclinada',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=500&auto=format&fit=crop&q=80',
    description: 'Descenso profundo y controlado protegiendo la zona lumbar.',
  },
  {
    id: 'm6',
    name: 'Press Militar Smith',
    category: 'Hombro',
    muscles: 'Deltoides anterior y tríceps',
    type: 'Barra guiada Smith',
    image: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80',
    description: 'Empuje vertical estricto sin arqueo lumbar excesivo.',
  },
  {
    id: 'm7',
    name: 'Extensión de Tríceps Polea',
    category: 'Brazos',
    muscles: 'Cabeza lateral y larga del tríceps',
    type: 'Polea alta con cuerda',
    image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=500&auto=format&fit=crop&q=80',
    description: 'Apertura de la cuerda al final del recorrido para contracción máxima.',
  },
  {
    id: 'm8',
    name: 'Máquina Abductores Sentada',
    category: 'Glúteos',
    muscles: 'Glúteo medio y tensor de la fascia lata',
    type: 'Placas guiadas',
    image: 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=500&auto=format&fit=crop&q=80',
    description: 'Apertura controlada con torso ligeramente inclinado al frente.',
  },
];

const macroData = {
  protein: { label: 'Proteína', valueKey: 'protein' as const, goalKey: 'proteinGoal' as const },
  carbs: { label: 'Carbohidratos', valueKey: 'carbs' as const, goalKey: 'carbsGoal' as const },
  fats: { label: 'Grasas', valueKey: 'fats' as const, goalKey: 'fatsGoal' as const },
};

function localDay(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

export default function DashboardScreen() {
  const colors = useColors();
  const { stats, profile, updateGoals, streakDetails, canRescueStreak, updateProfile } = useBodyFit();
  const workoutQuery = useListWorkoutLogs({ query: { queryKey: ['listWorkoutLogs'] } });
  const name = profile?.displayName?.split(' ')[0] || 'Atleta';
  const dateLabel = new Intl.DateTimeFormat('es-CR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date());
  const [activeQuote, setActiveQuote] = useState<DynastyQuote>(() => getDailyDynastyQuote());

  // Estado del Modal de Edición de Objetivos y Enfoques de Entrenamiento
  const [modalVisible, setModalVisible] = useState(false);
  const [rescueModalVisible, setRescueModalVisible] = useState(false);
  const [monthlyActivityVisible, setMonthlyActivityVisible] = useState(false);
  const [focusModalVisible, setFocusModalVisible] = useState(false);
  const [editCalories, setEditCalories] = useState(String(stats.calorieGoal));
  const [editProtein, setEditProtein] = useState(String(stats.proteinGoal));
  const [editCarbs, setEditCarbs] = useState(String(stats.carbsGoal));
  const [editFats, setEditFats] = useState(String(stats.fatsGoal));
  const [editWorkoutMin, setEditWorkoutMin] = useState('60');
  const [selectedMachineCategory, setSelectedMachineCategory] = useState<string>('Todos');
  const [activeMachineModal, setActiveMachineModal] = useState<typeof featuredMachines[number] | null>(null);

  const activeFocus = useMemo<FitnessFocusOption>(() => {
    return getFitnessFocus(profile?.fitnessGoal);
  }, [profile?.fitnessGoal]);

  const handleSelectFocus = async (focusOption: FitnessFocusOption) => {
    try {
      await updateProfile({ fitnessGoal: focusOption.id });
      setFocusModalVisible(false);
      Alert.alert(
        '¡Enfoque Actualizado!',
        `Has cambiado tu función objetivo a: ${focusOption.name}.\n\nTu siguiente entrenamiento y recomendaciones se han sincronizado.`
      );
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el enfoque.');
    }
  };

  const macros = useMemo(() => {
    const preferred = profile?.preferredMacros ?? [];
    const ordered = [...preferred, 'protein', 'carbs', 'fats'].filter((key, index, all) => all.indexOf(key) === index);
    return ordered.map((key) => macroData[key as keyof typeof macroData]).filter(Boolean);
  }, [profile?.preferredMacros]);

  const weeklyMinutes = useMemo(() => {
    const days = Array.from({ length: 7 }, () => 0);
    const today = new Date();
    const mondayOffset = (today.getDay() + 6) % 7;
    const monday = new Date(today);
    monday.setDate(today.getDate() - mondayOffset);
    monday.setHours(0, 0, 0, 0);
    for (const workout of workoutQuery.data?.workouts ?? []) {
      const date = new Date(workout.completedAt);
      date.setHours(0, 0, 0, 0);
      const index = Math.round((date.getTime() - monday.getTime()) / 86_400_000);
      if (index >= 0 && index < 7) days[index] += workout.durationMinutes;
    }
    return days;
  }, [workoutQuery.data?.workouts]);

  const todayIndex = (new Date().getDay() + 6) % 7;
  const todayWorkoutMinutes = weeklyMinutes[todayIndex] || 0;
  const maxMinutes = Math.max(30, ...weeklyMinutes);
  const todayKey = localDay(new Date());

  const handleOpenEditGoals = () => {
    setEditCalories(String(stats.calorieGoal));
    setEditProtein(String(stats.proteinGoal));
    setEditCarbs(String(stats.carbsGoal));
    setEditFats(String(stats.fatsGoal));
    setModalVisible(true);
  };

  const handleSaveGoals = () => {
    const cal = parseInt(editCalories, 10);
    const prot = parseInt(editProtein, 10);
    const carb = parseInt(editCarbs, 10);
    const fat = parseInt(editFats, 10);

    if (isNaN(cal) || cal <= 0 || isNaN(prot) || prot <= 0) {
      Alert.alert('Datos inválidos', 'Por favor ingresa valores numéricos mayores a cero.');
      return;
    }

    updateGoals({
      calorieGoal: cal,
      proteinGoal: prot,
      carbsGoal: !isNaN(carb) && carb > 0 ? carb : stats.carbsGoal,
      fatsGoal: !isNaN(fat) && fat > 0 ? fat : stats.fatsGoal,
    });

    setModalVisible(false);
    Alert.alert('¡Objetivos Actualizados!', 'Tus nuevas metas diarias han sido guardadas correctamente.');
  };

  return (
    <Screen>
      <TopBar title={`Hola, ${name}`} subtitle={dateLabel} />

      {/* Banner Principal de Racha y Estado (Interactivo: abre Actividad Mensual) con fondo de Atleta haciendo Cardio en la Calle */}
      <Pressable onPress={() => setMonthlyActivityVisible(true)} style={{ marginTop: 2 }}>
        <View
          style={{
            borderRadius: 22,
            overflow: 'hidden',
            borderWidth: 1.5,
            borderColor: '#D4AF3760',
            position: 'relative',
            minHeight: 125,
            backgroundColor: '#160F20',
          }}
        >
          {/* Fotografía de atleta haciendo cardio en la calle */}
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1552674605-db6ffd4facb5?w=900&auto=format&fit=crop&q=80' }}
            contentFit="cover"
            style={StyleSheet.absoluteFill}
          />
          {/* Capa de contraste oscuro con gradiente Dynasty para máxima legibilidad */}
          <LinearGradient
            colors={['rgba(15, 9, 24, 0.88)', 'rgba(30, 16, 44, 0.82)', 'rgba(10, 6, 16, 0.92)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              padding: 16,
              justifyContent: 'center',
            }}
          >
            <View style={[styles.row, styles.spaceBetween]}>
              <View style={{ flex: 1, paddingRight: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '700' }}>Tu consistencia habla</Text>
                  <View style={{ backgroundColor: 'rgba(212, 175, 55, 0.25)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: '#D4AF3780' }}>
                    <Text style={{ color: '#FFD700', fontSize: 9, fontWeight: '800' }}>ACTIVIDAD 📅</Text>
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <AppleFitnessFlame size={32} iconSize={18} />
                  <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '800' }}>
                    {stats.streak} {stats.streak === 1 ? 'día' : 'días'}
                  </Text>
                </View>
                <Text style={{ color: '#F3E8FF', fontSize: 11, marginTop: 4 }}>
                  {stats.streak ? 'de racha activa BodyFit Dynasty' : 'Toca para ver actividad mensual o restablecer racha'}
                </Text>
                <Text style={{ color: colors.gold, fontSize: 10, marginTop: 3, fontWeight: '600' }}>
                  Récord: {streakDetails.bestStreak || stats.streak} d · Salvadas: {streakDetails.savedStreaksCount}
                </Text>
              </View>
              <View
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 36,
                  borderWidth: 7,
                  borderColor: '#FFFFFF33',
                  borderTopColor: colors.gold,
                  alignItems: 'center',
                  justifyContent: 'center',
                  transform: [{ rotate: '-35deg' }],
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', transform: [{ rotate: '35deg' }] }}>
                  {todayWorkoutMinutes ? `${todayWorkoutMinutes}m` : '0m'}
                </Text>
              </View>
            </View>
          </LinearGradient>
        </View>
      </Pressable>

      {/* Banner de Food Scanner AI con fondo de Ensalada con Pollo Grill */}
      <Pressable
        onPress={() => router.push('/food-analysis' as never)}
        style={{
          marginTop: 12,
          borderRadius: 18,
          overflow: 'hidden',
          borderWidth: 1.5,
          borderColor: `${colors.primary}80`,
          height: 115,
          position: 'relative',
          justifyContent: 'center',
        }}
      >
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=1000&auto=format&fit=crop&q=80' }}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
        />
        {/* Capa de contraste oscuro */}
        <View
          style={[
            StyleSheet.absoluteFill,
            { backgroundColor: 'rgba(11, 7, 16, 0.76)' },
          ]}
        />
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            paddingHorizontal: 16,
            zIndex: 2,
          }}
        >
          <View style={{ flex: 1, paddingRight: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <View
                style={{
                  backgroundColor: `${colors.gold}25`,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  borderRadius: 6,
                  borderWidth: 1,
                  borderColor: `${colors.gold}60`,
                }}
              >
                <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '900', letterSpacing: 0.8 }}>
                  FOOD SCANNER AI 📸
                </Text>
              </View>
            </View>
            <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '900' }}>
              Escáner Nutricional AI
            </Text>
            <Text style={{ color: '#E2D9EC', fontSize: 11, marginTop: 2 }} numberOfLines={1}>
              Fotografía tu platillo y calcula macros automáticamente
            </Text>
          </View>

          <View
            style={{
              backgroundColor: colors.primary,
              paddingVertical: 8,
              paddingHorizontal: 12,
              borderRadius: 12,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '900' }}>Escanear</Text>
            <Feather name="arrow-right" size={13} color="#FFFFFF" />
          </View>
        </View>
      </Pressable>

      {/* Frase Motivacional Diaria Dynasty con botón de barajar y acceso a widgets */}
      <View
        style={{
          backgroundColor: '#160F22',
          borderColor: `${colors.gold}45`,
          borderWidth: 1.2,
          borderRadius: 15,
          paddingVertical: 10,
          paddingHorizontal: 14,
          marginTop: 10,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
            <Feather name="zap" size={12} color={colors.gold} />
            <Text style={{ color: colors.gold, fontSize: 9.5, fontWeight: '800', letterSpacing: 0.8 }}>
              MOTIVACIÓN DYNASTY DEL DÍA
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Pressable
              onPress={() => setActiveQuote(getRandomDynastyQuote(activeQuote.id))}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: `${colors.gold}20`,
                borderColor: `${colors.gold}50`,
                borderWidth: 1,
                paddingHorizontal: 7,
                paddingVertical: 2.5,
                borderRadius: 6,
              }}
            >
              <Feather name="refresh-cw" size={10} color={colors.gold} />
              <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>Barajar</Text>
            </Pressable>
            <Pressable
              onPress={() => router.push('/widgets' as never)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                backgroundColor: `${colors.primary}25`,
                borderColor: `${colors.primary}60`,
                borderWidth: 1,
                paddingHorizontal: 7,
                paddingVertical: 2.5,
                borderRadius: 6,
              }}
            >
              <Feather name="grid" size={10} color={colors.primary} />
              <Text style={{ color: colors.primary, fontSize: 9, fontWeight: '800' }}>Widgets</Text>
            </Pressable>
          </View>
        </View>
        <Text style={{ color: colors.foreground, fontSize: 11.5, fontStyle: 'italic', lineHeight: 16 }}>
          "{activeQuote.text}"
        </Text>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 4 }}>
          <View style={{ backgroundColor: '#201230', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 5 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 8.5, fontWeight: '700', textTransform: 'uppercase' }}>
              {activeQuote.category}
            </Text>
          </View>
          <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700' }}>
            — {activeQuote.author} · <Text style={{ color: colors.mutedForeground, fontSize: 9 }}>{activeQuote.tag}</Text>
          </Text>
        </View>
      </View>

      {/* Resumen de Hoy (4 Métricas Clave en Grid 2x2) */}
      <SectionHeader title="Resumen de hoy" action="Editar objetivos" onPress={handleOpenEditGoals} />
      <View style={{ gap: 10 }}>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <MetricCard
              icon="activity"
              label="Calorías"
              value={`${stats.calories}`}
              goal={`/ ${stats.calorieGoal} kcal`}
              color={colors.primary}
            />
          </View>
          <View style={{ flex: 1 }}>
            <MetricCard
              icon="clock"
              label="Entreno"
              value={`${todayWorkoutMinutes} min`}
              goal={`/ ${editWorkoutMin} min`}
              color={colors.gold}
            />
          </View>
        </View>
        <View style={{ flexDirection: 'row', gap: 10 }}>
          <View style={{ flex: 1 }}>
            <MetricCard
              icon="shield"
              label="Proteína"
              value={`${stats.protein} g`}
              goal={`/ ${stats.proteinGoal} g`}
              color={colors.blue}
            />
          </View>
          <View style={{ flex: 1 }}>
            <MetricCard
              customIcon={<AppleFitnessFlame size={24} iconSize={15} />}
              label="Racha"
              value={`${stats.streak} días`}
              goal="Dynasty"
              color="#FF5500"
            />
          </View>
        </View>
      </View>

      {/* Fila Destacada: Tienda, Comunidad y Recetas (Lado a Lado) */}
      <SectionHeader title="Acceso Rápido" />
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {/* Tarjeta Tienda */}
        <Pressable
          onPress={() => router.push('/(tabs)/store')}
          style={({ pressed }) => [
            {
              flex: 1,
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 13,
              alignItems: 'center',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: `${colors.primary}18`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Feather name="shopping-bag" size={20} color={colors.primary} />
          </View>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Tienda</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Suplementos</Text>
        </Pressable>

        {/* Tarjeta Comunidad */}
        <Pressable
          onPress={() => router.push('/(tabs)/community')}
          style={({ pressed }) => [
            {
              flex: 1,
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 13,
              alignItems: 'center',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: `${colors.gold}20`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Feather name="users" size={20} color={colors.gold} />
          </View>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Comunidad</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Feed social</Text>
        </Pressable>

        {/* Tarjeta Recetas */}
        <Pressable
          onPress={() => router.push('/recipes')}
          style={({ pressed }) => [
            {
              flex: 1,
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 18,
              padding: 13,
              alignItems: 'center',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <View
            style={{
              width: 44,
              height: 44,
              borderRadius: 14,
              backgroundColor: `${colors.blue}20`,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 8,
            }}
          >
            <Feather name="book-open" size={20} color={colors.blue} />
          </View>
          <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Recetas</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Catálogo</Text>
        </Pressable>
      </View>

      {/* Banner de Entrenador 24/7 Golden */}
      <Pressable
        onPress={() => router.push('/trainer-chat' as never)}
        style={({ pressed }) => [
          {
            backgroundColor: '#1E1428',
            borderColor: `${colors.gold}70`,
            borderWidth: 1.2,
            borderRadius: 18,
            padding: 13,
            marginTop: 10,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
          <View style={{ width: 38, height: 38, borderRadius: 12, backgroundColor: `${colors.gold}25`, alignItems: 'center', justifyContent: 'center' }}>
            <Feather name="message-circle" size={18} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                Atención 24/7 Golden
              </Text>
              <View style={{ backgroundColor: `${colors.gold}30`, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                <Text style={{ color: colors.gold, fontSize: 8.5, fontWeight: '800' }}>COACHES VIP</Text>
              </View>
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
              Resuelve dudas de técnica y rutinas en tiempo real
            </Text>
          </View>
        </View>
        <Feather name="chevron-right" size={16} color={colors.gold} />
      </Pressable>

      {/* Sección Macros: Bolitas y Anillos Estilo Apple Health */}
      <SectionHeader title="Macros de hoy" action="Analizar comida" onPress={() => router.push('/food-analysis')} />
      <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 14 }]}>
        <View style={[styles.row, styles.spaceBetween, { marginBottom: 12 }]}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <View style={{ backgroundColor: 'rgba(255, 59, 48, 0.2)', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 6, borderWidth: 1, borderColor: 'rgba(255, 59, 48, 0.4)' }}>
              <Text style={{ color: '#FF3B30', fontSize: 9.5, fontWeight: '800' }}>ANILLOS DE ACTIVIDAD</Text>
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>Progreso Nutricional</Text>
          </View>
          <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>
            {stats.calories} / {stats.calorieGoal} kcal
          </Text>
        </View>

        {/* Visualizador de Anillos y Bolitas Apple Health por Marcador */}
        <AppleHealthMacroRings
          calories={stats.calories}
          calorieGoal={stats.calorieGoal}
          protein={stats.protein}
          proteinGoal={stats.proteinGoal}
          carbs={stats.carbs}
          carbsGoal={stats.carbsGoal}
          fats={stats.fats}
          fatsGoal={stats.fatsGoal}
        />
        {/* Consejo Nutricional de Fin de Día (Head Coach Esteban) */}
        <View
          style={{
            marginTop: 10,
            backgroundColor: '#1E1228',
            borderColor: `${colors.gold}50`,
            borderWidth: 1,
            borderRadius: 12,
            padding: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 9,
          }}
        >
          <View style={{ backgroundColor: `${colors.gold}20`, padding: 6, borderRadius: 8 }}>
            <Feather name="moon" size={14} color={colors.gold} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800' }}>
              RECOMENDACIÓN NUTRICIONAL FIN DE DÍA
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2, lineHeight: 14 }}>
              Al completar tu meta diaria, disminuye calorías, azúcares y grasas/carbohidratos en la cena. <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Mantén la proteína al 100%</Text> para proteger tu musculatura.
            </Text>
          </View>
        </View>
        <Pressable onPress={handleOpenEditGoals}>
          <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700', marginTop: 8 }}>
            Editar objetivos nutricionales
          </Text>
        </Pressable>
      </View>

      {/* Acciones Rápidas */}
      <View style={{ flexDirection: 'row', gap: 10, marginTop: 10 }}>
        <Pressable
          testID="analyze-food-shortcut"
          onPress={() => router.push('/food-analysis')}
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.75 : 1 }]}
        >
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, minHeight: 110 }]}>
            <Feather name="camera" size={22} color={colors.primary} />
            <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14, marginTop: 16 }}>
              Analizar comida
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>Con IA y foto</Text>
          </View>
        </Pressable>

        <Pressable
          onPress={() => router.push('/routines')}
          style={({ pressed }) => [{ flex: 1, opacity: pressed ? 0.75 : 1 }]}
        >
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, minHeight: 110 }]}>
            <Feather name="play-circle" size={22} color={colors.gold} />
            <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14, marginTop: 16 }}>
              Iniciar entreno
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>Rutinas completas</Text>
          </View>
        </Pressable>
      </View>

      {/* Siguiente Entrenamiento con Selector de 6 Funciones Dynasty */}
      <SectionHeader
        title="Siguiente entrenamiento"
        action="Elegir función"
        onPress={() => setFocusModalVisible(true)}
      />

      {/* Selector de Chips de las 6 Funciones */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 8, marginBottom: 12 }}
      >
        {FITNESS_FOCUS_OPTIONS.map((focus) => {
          const isSelected = activeFocus.id === focus.id;
          return (
            <Pressable
              key={focus.id}
              onPress={() => handleSelectFocus(focus)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
                paddingVertical: 7,
                paddingHorizontal: 12,
                borderRadius: 18,
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: 1,
              }}
            >
              <Text style={{ fontSize: 13 }}>{focus.emoji}</Text>
              <Text
                style={{
                  color: isSelected ? '#FFFFFF' : colors.foreground,
                  fontSize: 11,
                  fontWeight: '700',
                }}
              >
                {focus.shortName}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Tarjeta del Siguiente Entrenamiento Adaptada al Enfoque */}
      <Pressable
        onPress={() => router.push('/routines')}
        style={({ pressed }) => [{ opacity: pressed ? 0.88 : 1, marginBottom: 12 }]}
      >
        <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden' }]}>
          <Image
            source={focusHeroImages[activeFocus.id] ? { uri: focusHeroImages[activeFocus.id] } : images.workout}
            contentFit="cover"
            style={{ height: 140, width: '100%' }}
          />
          <LinearGradient
            colors={['transparent', 'rgba(16, 10, 24, 0.95)']}
            style={{
              position: 'absolute',
              top: 40,
              left: 0,
              right: 0,
              height: 100,
            }}
          />
          <View style={{ padding: 15 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <View style={{ backgroundColor: `${colors.primary}25`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6 }}>
                <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 }}>
                  {activeFocus.badge.toUpperCase()}
                </Text>
              </View>
              <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700' }}>
                {profile?.trainingLocation === 'home' ? '🏠 CASA' : '🏋️ GIMNASIO'}
              </Text>
            </View>

            <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '800', marginTop: 4 }}>
              {activeFocus.name}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11.5, lineHeight: 16, marginTop: 4 }}>
              {activeFocus.description}
            </Text>

            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <Pressable
                onPress={() => router.push('/routines')}
                style={{
                  flex: 1,
                  backgroundColor: colors.primary,
                  paddingVertical: 9,
                  borderRadius: 10,
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Feather name="play" size={13} color="#FFFFFF" />
                <Text style={{ color: '#FFFFFF', fontSize: 11.5, fontWeight: '800' }}>
                  Ver Catálogo de Rutina
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setFocusModalVisible(true)}
                style={{
                  paddingHorizontal: 12,
                  paddingVertical: 9,
                  borderRadius: 10,
                  backgroundColor: `${colors.gold}20`,
                  borderColor: `${colors.gold}50`,
                  borderWidth: 1,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '700' }}>
                  Cambiar
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Pressable>

      {/* Tarjeta de Recomendación de Cardio HIIT Dynasty (Core & Metabolismo) */}
      <View
        style={[
          styles.card,
          {
            backgroundColor: '#1B1124',
            borderColor: '#FF475770',
            borderWidth: 1.2,
            padding: 14,
            marginBottom: 16,
          },
        ]}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8, marginBottom: 8 }}>
          <View style={{ backgroundColor: '#FF475725', padding: 6, borderRadius: 8, marginTop: 2, flexShrink: 0 }}>
            <Feather name="zap" size={16} color="#FF4757" />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
              Cardio HIIT Dynasty · Core & Metabolismo
            </Text>
            <Text style={{ color: '#FF4757', fontSize: 9.5, fontWeight: '800', letterSpacing: 0.5, marginTop: 2 }}>
              INTERVALOS 2x1 · QUEMA DE PESO & DEFINICIÓN
            </Text>
          </View>
        </View>

        <Text style={{ color: colors.mutedForeground, fontSize: 11, lineHeight: 16, marginBottom: 10 }}>
          Diseñado para acelerar el metabolismo y endurecer el core mediante variaciones de velocidad fraccionada:
        </Text>

        <View style={{ backgroundColor: '#100A17', padding: 11, borderRadius: 10, marginBottom: 10, gap: 8 }}>
          {/* Intervalo 1: Regular */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#2ED573', marginTop: 4, flexShrink: 0 }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#2ED573', fontSize: 11.5, fontWeight: '800' }}>
                  2 minutos:
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 11.5, fontWeight: '700' }}>
                  Velocidad regular continua
                </Text>
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1, lineHeight: 14 }}>
                Trote moderado · Zona 2 aeróbica (recuperación activa)
              </Text>
            </View>
          </View>

          {/* Intervalo 2: Sprint */}
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}>
            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#FF4757', marginTop: 4, flexShrink: 0 }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', alignItems: 'center', gap: 4 }}>
                <Text style={{ color: '#FF4757', fontSize: 11.5, fontWeight: '800' }}>
                  1 minuto:
                </Text>
                <Text style={{ color: '#FFFFFF', fontSize: 11.5, fontWeight: '700' }}>
                  Sprint intenso continuo
                </Text>
              </View>
              <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 1, lineHeight: 14 }}>
                Máxima potencia · Quema calórica acelerada (EPOC)
              </Text>
            </View>
          </View>

          {/* Ciclos y duración */}
          <View style={{ borderTopWidth: 1, borderTopColor: 'rgba(255,255,255,0.08)', paddingTop: 7, marginTop: 2 }}>
            <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '700', lineHeight: 15 }}>
              ⏱️ Estructura: Repetir de 5 a 6 veces (15 a 20 min totales) al terminar pesas.
            </Text>
          </View>
        </View>

        <View style={{ backgroundColor: `${colors.gold}15`, padding: 9, borderRadius: 8, marginBottom: 10 }}>
          <Text style={{ color: colors.gold, fontSize: 10.5, lineHeight: 15 }}>
            💡 <Text style={{ fontWeight: '800' }}>Activación de Core:</Text> En cada minuto de sprint, aprieta el abdomen (bracing abdominal) para estabilizar la pelvis y trabajar transverso y oblicuos a máxima velocidad.
          </Text>
        </View>

        <Pressable
          onPress={() => router.push('/routines')}
          style={{
            backgroundColor: `${colors.gold}20`,
            borderColor: colors.gold,
            borderWidth: 1,
            paddingVertical: 8,
            borderRadius: 8,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700' }}>
            Ver recomendación en Mi Rutina
          </Text>
        </Pressable>
      </View>

      {/* Carrusel Interactivo de Máquinas Típicas del Gimnasio */}
      <SectionHeader title="Máquinas Típicas del Gimnasio" action="Ver rutinas" onPress={() => router.push('/routines')} />
      
      {/* Filtro por grupo muscular */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, marginBottom: 14 }}>
        {['Todos', 'Piernas', 'Pecho', 'Glúteos', 'Espalda', 'Hombro', 'Brazos'].map((category) => {
          const isSelected = selectedMachineCategory === category;
          return (
            <Pressable
              key={category}
              onPress={() => setSelectedMachineCategory(category)}
              style={{
                paddingVertical: 7,
                paddingHorizontal: 13,
                borderRadius: 18,
                backgroundColor: isSelected ? colors.primary : colors.card,
                borderColor: isSelected ? colors.primary : colors.border,
                borderWidth: 1,
              }}
            >
              <Text style={{ color: isSelected ? '#FFFFFF' : colors.foreground, fontSize: 11, fontWeight: '700' }}>
                {category}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      {/* Carrusel horizontal de tarjetas de máquinas */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingRight: 20, marginBottom: 16 }}>
        {(selectedMachineCategory === 'Todos' ? featuredMachines : featuredMachines.filter((m) => m.category === selectedMachineCategory)).map((machine) => (
          <Pressable
            key={machine.id}
            onPress={() => setActiveMachineModal(machine)}
            style={({ pressed }) => [
              styles.card,
              {
                width: 250,
                backgroundColor: colors.card,
                borderColor: colors.border,
                padding: 0,
                overflow: 'hidden',
                opacity: pressed ? 0.8 : 1,
              },
            ]}
          >
            <View style={{ position: 'relative' }}>
              <Image source={{ uri: machine.image }} style={{ height: 130, width: '100%' }} contentFit="cover" />
              <View
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  backgroundColor: 'rgba(15, 10, 25, 0.85)',
                  paddingHorizontal: 8,
                  paddingVertical: 3,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: `${colors.gold}50`,
                }}
              >
                <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>{machine.type}</Text>
              </View>
            </View>

            <View style={{ padding: 13 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 }}>
                  {machine.category.toUpperCase()}
                </Text>
                <Feather name="info" size={13} color={colors.mutedForeground} />
              </View>
              <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '700', marginTop: 2 }}>
                {machine.name}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }} numberOfLines={1}>
                🎯 {machine.muscles}
              </Text>
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* Modal de Detalle de Máquina del Gimnasio */}
      <Modal visible={Boolean(activeMachineModal)} transparent animationType="fade" onRequestClose={() => setActiveMachineModal(null)}>
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.8)', justifyContent: 'center', alignItems: 'center', padding: 20 }}>
          {activeMachineModal ? (
            <View style={{ width: '100%', maxWidth: 350, backgroundColor: colors.card, borderRadius: 24, borderWidth: 1, borderColor: colors.border, overflow: 'hidden' }}>
              <Image source={{ uri: activeMachineModal.image }} style={{ width: '100%', height: 170 }} contentFit="cover" />
              <View style={{ padding: 18 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>
                    {activeMachineModal.category.toUpperCase()} · {activeMachineModal.type.toUpperCase()}
                  </Text>
                  <Pressable onPress={() => setActiveMachineModal(null)}>
                    <Feather name="x" size={18} color={colors.foreground} />
                  </Pressable>
                </View>

                <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                  {activeMachineModal.name}
                </Text>

                <View style={{ backgroundColor: `${colors.gold}15`, padding: 10, borderRadius: 12, marginVertical: 12, borderWidth: 1, borderColor: `${colors.gold}40` }}>
                  <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700' }}>Músculos Estimulados:</Text>
                  <Text style={{ color: colors.foreground, fontSize: 12, marginTop: 2 }}>{activeMachineModal.muscles}</Text>
                </View>

                <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 18 }}>
                  {activeMachineModal.description}
                </Text>

                <View style={{ flexDirection: 'row', gap: 10, marginTop: 18 }}>
                  <Pressable
                    onPress={() => {
                      setActiveMachineModal(null);
                      router.push('/routines');
                    }}
                    style={{ flex: 1, backgroundColor: colors.primary, paddingVertical: 12, borderRadius: 14, alignItems: 'center' }}
                  >
                    <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Ver en Rutinas</Text>
                  </Pressable>
                  <Pressable
                    onPress={() => setActiveMachineModal(null)}
                    style={{ paddingVertical: 12, paddingHorizontal: 16, borderRadius: 14, borderWidth: 1, borderColor: colors.border }}
                  >
                    <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 13 }}>Cerrar</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          ) : null}
        </View>
      </Modal>

      <View style={{ marginTop: 6, marginBottom: 20 }}>
        <PrimaryButton title="Registrar una comida" icon="plus" onPress={() => router.push('/food-analysis')} />
      </View>

      {/* Modal Interactivo: Editar Objetivos Diarios */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={modalStyles.overlay}>
          <View style={[modalStyles.dialog, { backgroundColor: colors.card, borderColor: colors.border }]}>
            <View style={modalStyles.headerRow}>
              <Text style={[modalStyles.title, { color: colors.foreground }]}>Editar Objetivos</Text>
              <Pressable onPress={() => setModalVisible(false)} style={modalStyles.closeButton}>
                <Feather name="x" size={20} color={colors.foreground} />
              </Pressable>
            </View>
            <Text style={[modalStyles.subtitle, { color: colors.mutedForeground }]}>
              Ajusta tus metas diarias para sincronizarlas con tu plan de entrenamiento y nutrición.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 380 }}>
              <View style={modalStyles.fieldGroup}>
                <Text style={[modalStyles.fieldLabel, { color: colors.foreground }]}>Meta de Calorías (kcal)</Text>
                <TextInput
                  value={editCalories}
                  onChangeText={setEditCalories}
                  keyboardType="numeric"
                  placeholderTextColor={colors.mutedForeground}
                  style={[modalStyles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
                />
              </View>

              <View style={modalStyles.fieldGroup}>
                <Text style={[modalStyles.fieldLabel, { color: colors.foreground }]}>Meta de Proteína (gramos)</Text>
                <TextInput
                  value={editProtein}
                  onChangeText={setEditProtein}
                  keyboardType="numeric"
                  placeholderTextColor={colors.mutedForeground}
                  style={[modalStyles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
                />
              </View>

              <View style={modalStyles.fieldGroup}>
                <Text style={[modalStyles.fieldLabel, { color: colors.foreground }]}>Meta de Carbohidratos (gramos)</Text>
                <TextInput
                  value={editCarbs}
                  onChangeText={setEditCarbs}
                  keyboardType="numeric"
                  placeholderTextColor={colors.mutedForeground}
                  style={[modalStyles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
                />
              </View>

              <View style={modalStyles.fieldGroup}>
                <Text style={[modalStyles.fieldLabel, { color: colors.foreground }]}>Meta de Grasas (gramos)</Text>
                <TextInput
                  value={editFats}
                  onChangeText={setEditFats}
                  keyboardType="numeric"
                  placeholderTextColor={colors.mutedForeground}
                  style={[modalStyles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
                />
              </View>

              <View style={modalStyles.fieldGroup}>
                <Text style={[modalStyles.fieldLabel, { color: colors.foreground }]}>Meta de Minutos de Entreno (min)</Text>
                <TextInput
                  value={editWorkoutMin}
                  onChangeText={setEditWorkoutMin}
                  keyboardType="numeric"
                  placeholderTextColor={colors.mutedForeground}
                  style={[modalStyles.input, { color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border }]}
                />
              </View>
            </ScrollView>

            <View style={{ marginTop: 14 }}>
              <PrimaryButton title="Guardar objetivos" icon="check" onPress={handleSaveGoals} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal Simulador de Salva-Rachas con 3 Anuncios */}
      <StreakRescueModal
        visible={rescueModalVisible}
        onClose={() => setRescueModalVisible(false)}
      />

      {/* Modal de Actividad Mensual y Restablecimiento de Racha */}
      <MonthlyActivityModal
        visible={monthlyActivityVisible}
        onClose={() => setMonthlyActivityVisible(false)}
        onOpenAdRescue={() => setRescueModalVisible(true)}
      />

      {/* Modal de Selección de Funciones / Enfoques Dynasty */}
      <Modal
        visible={focusModalVisible}
        animationType="slide"
        transparent
        onRequestClose={() => setFocusModalVisible(false)}
      >
        <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
          <View
            style={{
              backgroundColor: '#160F20',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              borderWidth: 1.5,
              borderColor: colors.gold,
              maxHeight: '85%',
              padding: 20,
            }}
          >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <View style={{ backgroundColor: `${colors.gold}25`, padding: 7, borderRadius: 10 }}>
                  <Feather name="target" size={18} color={colors.gold} />
                </View>
                <View>
                  <Text style={{ color: '#FFFFFF', fontSize: 16, fontWeight: '800' }}>
                    Elige tu Enfoque Dynasty
                  </Text>
                  <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700' }}>
                    SELECCIONA QUÉ FUNCIÓN SE ADAPTA A TU OBJETIVO
                  </Text>
                </View>
              </View>
              <Pressable
                onPress={() => setFocusModalVisible(false)}
                style={{ padding: 6, borderRadius: 20, backgroundColor: '#251733' }}
              >
                <Feather name="x" size={18} color={colors.mutedForeground} />
              </Pressable>
            </View>

            <Text style={{ color: colors.mutedForeground, fontSize: 11.5, marginBottom: 14 }}>
              Tu elección adaptará automáticamente tu siguiente entrenamiento, sugerencias de ejercicios, descansos y volumen semanal.
            </Text>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 10, paddingBottom: 20 }}>
              {FITNESS_FOCUS_OPTIONS.map((option) => {
                const isSelected = activeFocus.id === option.id;
                return (
                  <Pressable
                    key={option.id}
                    onPress={() => handleSelectFocus(option)}
                    style={{
                      backgroundColor: isSelected ? '#2A1838' : '#1C1226',
                      borderColor: isSelected ? colors.gold : colors.border,
                      borderWidth: isSelected ? 1.8 : 1,
                      borderRadius: 14,
                      padding: 14,
                    }}
                  >
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
                        <Text style={{ fontSize: 24 }}>{option.emoji}</Text>
                        <View style={{ flex: 1 }}>
                          <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '800' }}>
                            {option.name}
                          </Text>
                          <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700', marginTop: 1 }}>
                            {option.badge}
                          </Text>
                        </View>
                      </View>
                      {isSelected ? (
                        <View style={{ backgroundColor: colors.gold, borderRadius: 12, padding: 5 }}>
                          <Feather name="check" size={14} color="#0B0710" />
                        </View>
                      ) : null}
                    </View>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 8, lineHeight: 15 }}>
                      {option.description}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  dialog: {
    borderWidth: 1,
    borderRadius: 22,
    padding: 20,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
  },
  closeButton: {
    padding: 4,
  },
  subtitle: {
    fontSize: 12,
    lineHeight: 18,
    marginBottom: 16,
  },
  fieldGroup: {
    marginBottom: 12,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 6,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 13,
    paddingVertical: 10,
    fontSize: 14,
  },
});