import { Feather } from '@expo/vector-icons';
import { useGetMonthlyProgress } from '@workspace/api-client-react';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

function monthKey(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

function dateLabel(value: string) {
  const [year, month, day] = value.split('-').map(Number);
  return new Intl.DateTimeFormat('es-CR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(year, month - 1, day));
}

export default function ProgressScreen() {
  const colors = useColors();
  const { stats } = useBodyFit();
  const [mode, setMode] = useState<'week' | 'month' | 'workouts'>('month');
  const [monthOffset, setMonthOffset] = useState<number>(0);

  const monthDate = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    d.setMonth(d.getMonth() + monthOffset);
    return d;
  }, [monthOffset]);

  const month = monthKey(monthDate);
  const query = useGetMonthlyProgress({ month }, { query: { queryKey: ['getMonthlyProgress', month] } });
  const rawDays = query.data?.days ?? [];
  const workouts = query.data?.workouts ?? [];
  const currentMonth = monthOffset === 0;

  // Lista de últimos 6 meses para selección rápida
  const pastMonthsList = useMemo(() => {
    const list: Array<{ offset: number; label: string; year: number }> = [];
    for (let i = 0; i >= -5; i--) {
      const d = new Date();
      d.setDate(1);
      d.setMonth(d.getMonth() + i);
      const name = new Intl.DateTimeFormat('es-CR', { month: 'short', year: 'numeric' }).format(d);
      list.push({ offset: i, label: name, year: d.getFullYear() });
    }
    return list;
  }, []);

  const visibleDays = useMemo(() => {
    if (mode !== 'week') return rawDays;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - 6);
    cutoff.setHours(0, 0, 0, 0);
    return rawDays.filter((entry) => {
      const [year, monthNumber, day] = entry.day.split('-').map(Number);
      return new Date(year, monthNumber - 1, day) >= cutoff;
    });
  }, [rawDays, mode]);

  const totals = visibleDays.reduce(
    (result, day) => ({
      days: result.days + 1,
      calories: result.calories + day.values.calories,
      steps: result.steps + day.values.steps,
    }),
    { days: 0, calories: 0, steps: 0 }
  );

  const monthName = new Intl.DateTimeFormat('es-CR', { month: 'long', year: 'numeric' }).format(monthDate);

  return (
    <Screen>
      <TopBar title="Progreso" subtitle="Historial semanal y mensual de tu constancia" />

      {/* Selector de Modo */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 14 }}>
        {([
          ['week', 'Semana Actual'],
          ['month', 'Historial Mensual'],
          ['workouts', 'Entrenos Realizados'],
        ] as const).map(([key, label]) => (
          <Pressable
            key={key}
            onPress={() => setMode(key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              borderRadius: 14,
              backgroundColor: mode === key ? colors.primary : colors.card,
              borderWidth: 1,
              borderColor: mode === key ? colors.primary : colors.border,
            }}
          >
            <Text style={{ color: mode === key ? '#FFFFFF' : colors.mutedForeground, fontWeight: '700', fontSize: 11 }}>
              {label}
            </Text>
          </Pressable>
        ))}
      </View>

      {/* Selector de Meses Anteriores con Pills horizontales */}
      <View style={{ marginBottom: 14 }}>
        <Text style={{ color: colors.mutedForeground, fontSize: 10, fontWeight: '700', marginBottom: 6, letterSpacing: 0.5 }}>
          REVISAR HISTORIAL DE MESES
        </Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
          {pastMonthsList.map((m) => {
            const isSelected = monthOffset === m.offset;
            return (
              <Pressable
                key={m.offset}
                onPress={() => setMonthOffset(m.offset)}
                style={{
                  paddingVertical: 7,
                  paddingHorizontal: 13,
                  borderRadius: 16,
                  borderWidth: 1.5,
                  borderColor: isSelected ? colors.gold : colors.border,
                  backgroundColor: isSelected ? `${colors.gold}22` : colors.card,
                }}
              >
                <Text style={{ color: isSelected ? colors.gold : colors.foreground, fontSize: 11, fontWeight: isSelected ? '800' : '600', textTransform: 'capitalize' }}>
                  {m.label}
                </Text>
              </Pressable>
            );
          })}
        </ScrollView>
      </View>

      {/* Tarjeta de Resumen del Mes Seleccionado */}
      <View style={[styles.card, { backgroundColor: '#1A1424', borderColor: `${colors.gold}60`, borderWidth: 1.5, marginBottom: 16 }]}>
        <View style={[styles.row, styles.spaceBetween]}>
          <Pressable
            accessibilityLabel="Mes anterior"
            onPress={() => setMonthOffset((v) => v - 1)}
            style={{ padding: 8, backgroundColor: `${colors.gold}15`, borderRadius: 10 }}
          >
            <Feather name="chevron-left" size={20} color={colors.gold} />
          </Pressable>

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 1.2 }}>MES EN REVISIÓN</Text>
            <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800', textTransform: 'capitalize', marginTop: 2 }}>
              {monthName}
            </Text>
          </View>

          <Pressable
            accessibilityLabel="Mes siguiente"
            disabled={currentMonth}
            onPress={() => setMonthOffset((v) => v + 1)}
            style={{ padding: 8, backgroundColor: currentMonth ? 'transparent' : `${colors.gold}15`, borderRadius: 10, opacity: currentMonth ? 0.2 : 1 }}
          >
            <Feather name="chevron-right" size={20} color={colors.gold} />
          </Pressable>
        </View>

        <View style={{ flexDirection: 'row', gap: 10, marginTop: 14 }}>
          <View style={{ flex: 1, borderRadius: 14, padding: 12, backgroundColor: '#231B30', borderWidth: 1, borderColor: '#332746' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="calendar" size={15} color={colors.primary} />
              <Text style={{ color: colors.mutedForeground, fontSize: 10, fontWeight: '700' }}>DÍAS ACTIVOS</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 20, marginTop: 6 }}>
              {totals.days || (currentMonth ? 1 : 0)}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Registrados</Text>
          </View>

          <View style={{ flex: 1, borderRadius: 14, padding: 12, backgroundColor: '#231B30', borderWidth: 1, borderColor: '#332746' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Feather name="activity" size={15} color={colors.gold} />
              <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700' }}>ENTRENOS</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 20, marginTop: 6 }}>
              {workouts.length}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Sesiones completas</Text>
          </View>

          <View style={{ flex: 1, borderRadius: 14, padding: 12, backgroundColor: '#231B30', borderWidth: 1, borderColor: '#332746' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text style={{ fontSize: 13 }}>🔥</Text>
              <Text style={{ color: '#FF6B00', fontSize: 10, fontWeight: '700' }}>RACHA</Text>
            </View>
            <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 20, marginTop: 6 }}>
              {stats.streak}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 2 }}>Días seguidos</Text>
          </View>
        </View>
      </View>

      {/* Contenido según modo */}
      {mode !== 'workouts' ? (
        <>
          <SectionHeader
            title={mode === 'week' ? 'Actividad Semanal' : `Desglose de ${monthName}`}
            action={currentMonth ? undefined : 'Volver a Mes Actual'}
            onPress={currentMonth ? undefined : () => setMonthOffset(0)}
          />

          {query.isLoading ? (
            <Text style={{ color: colors.mutedForeground, paddingVertical: 26, textAlign: 'center' }}>
              Cargando historial...
            </Text>
          ) : visibleDays.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 28 }]}>
              <Feather name="bar-chart-2" size={32} color={colors.mutedForeground} />
              <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 12 }}>
                Sin registros guardados para {monthName}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, textAlign: 'center', marginTop: 4, paddingHorizontal: 20 }}>
                {currentMonth
                  ? 'Tus comidas y entrenamientos de hoy se sumarán automáticamente a este mes.'
                  : 'En este mes anterior no se registraron sesiones activas en tu cuenta.'}
              </Text>
            </View>
          ) : (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 14 }]}>
              <View style={[styles.row, { gap: 8, marginBottom: 12 }]}>
                <Feather name="trending-up" size={16} color={colors.gold} />
                <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14 }}>
                  Actividad diaria de {monthName}
                </Text>
              </View>

              {visibleDays.slice(-10).map((day) => (
                <View key={day.day} style={{ marginBottom: 12 }}>
                  <View style={[styles.row, styles.spaceBetween, { marginBottom: 6 }]}>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11, textTransform: 'capitalize' }}>
                      {dateLabel(day.day)}
                    </Text>
                    <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '700' }}>
                      {day.values.calories ? `${day.values.calories} kcal` : 'Entrenamiento registrado'}
                    </Text>
                  </View>
                  <View style={{ height: 6, backgroundColor: colors.muted, borderRadius: 3, overflow: 'hidden' }}>
                    <View
                      style={{
                        height: 6,
                        width: `${Math.min((day.values.calories / (stats.calorieGoal || 2500)) * 100, 100)}%`,
                        backgroundColor: colors.primary,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      ) : (
        <>
          <SectionHeader title={`Entrenamientos en ${monthName}`} />
          {query.isLoading ? (
            <Text style={{ color: colors.mutedForeground, paddingVertical: 26, textAlign: 'center' }}>
              Cargando entrenamientos...
            </Text>
          ) : workouts.length === 0 ? (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 32 }]}>
              <Feather name="activity" size={32} color={colors.mutedForeground} />
              <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 12 }}>
                No hay entrenamientos guardados en {monthName}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>
                Completa una rutina en la pestaña "Entreno" para verla reflejada aquí.
              </Text>
            </View>
          ) : (
            workouts.map((workout) => (
              <View key={workout.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 10 }]}>
                <View style={[styles.row, styles.spaceBetween]}>
                  <View style={{ flex: 1, paddingRight: 10 }}>
                    <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14 }}>{workout.routineName}</Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4, textTransform: 'capitalize' }}>
                      {new Intl.DateTimeFormat('es-CR', { weekday: 'short', day: 'numeric', month: 'short' }).format(new Date(workout.completedAt))} · {workout.location === 'home' ? 'Casa' : 'Gimnasio'}
                    </Text>
                  </View>
                  <View style={{ backgroundColor: `${colors.primary}20`, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 }}>
                    <Text style={{ color: colors.primary, fontWeight: '800', fontSize: 12 }}>{workout.durationMinutes} min</Text>
                  </View>
                </View>
              </View>
            ))
          )}
        </>
      )}

      {/* Métricas Principales (Sin Agua - Con Calorías, Proteína, Minutos y Racha) */}
      <SectionHeader title="Métricas Principales de Hoy" />
      {[
        { label: 'Calorías Quemadas / Consumidas', value: stats.calories, goal: stats.calorieGoal, icon: 'activity' as const, color: colors.primary, suffix: ' kcal' },
        { label: 'Proteína Acumulada', value: stats.protein, goal: stats.proteinGoal, icon: 'shield' as const, color: colors.blue, suffix: ' g' },
        { label: 'Racha Activa', value: stats.streak, goal: Math.max(stats.streak, 7), icon: 'zap' as const, color: '#FF6B00', suffix: ' días' },
      ].map((goal) => (
        <View key={goal.label} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 10, paddingVertical: 14 }]}>
          <View style={[styles.row, styles.spaceBetween, { marginBottom: 8 }]}>
            <View style={styles.row}>
              <Feather name={goal.icon} size={15} color={goal.color} />
              <Text style={{ color: colors.foreground, fontSize: 12, marginLeft: 9, fontWeight: '700' }}>{goal.label}</Text>
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>
              {goal.value}{goal.suffix} / {goal.goal}{goal.suffix}
            </Text>
          </View>
          <View style={{ height: 6, borderRadius: 3, backgroundColor: colors.muted }}>
            <View
              style={{
                height: 6,
                borderRadius: 3,
                width: `${Math.min((goal.value / (goal.goal || 1)) * 100, 100)}%`,
                backgroundColor: goal.color,
              }}
            />
          </View>
        </View>
      ))}
    </Screen>
  );
}