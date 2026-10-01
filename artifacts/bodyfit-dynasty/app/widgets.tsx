import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { images, PrimaryButton, ProgressBar, Screen, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';
import { getDailyDynastyQuote } from '@/constants/dynastyQuotes';

type WidgetTab = 'iphone' | 'android' | 'watch';

export default function WidgetsScreen() {
  const colors = useColors();
  const { stats, profile, customRoutine } = useBodyFit();
  const [platformTab, setPlatformTab] = useState<WidgetTab>('iphone');
  const quote = getDailyDynastyQuote();

  const activeRoutineDay = customRoutine?.days && customRoutine.days.length > 0 ? customRoutine.days[0] : null;

  const handleSimulateSync = () => {
    Alert.alert(
      '¡Widgets Sincronizados!',
      `Tus datos de racha (🔥 ${stats.streak} días), macros, frase del día ("${quote.author}") y rutina activa han sido preparados para los widgets del sistema operativo.`
    );
  };

  return (
    <Screen>
      <TopBar title="Widgets & Watch" subtitle="Tu progreso y motivación en la pantalla de inicio" />

      {/* Selector de Plataforma */}
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
        <Pressable
          onPress={() => setPlatformTab('iphone')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: platformTab === 'iphone' ? colors.primary : colors.card,
            borderColor: platformTab === 'iphone' ? colors.primary : colors.border,
            borderWidth: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Feather name="smartphone" size={14} color={platformTab === 'iphone' ? colors.primaryForeground : colors.foreground} />
          <Text style={{ color: platformTab === 'iphone' ? colors.primaryForeground : colors.foreground, fontSize: 12, fontWeight: '700' }}>
            iPhone iOS
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPlatformTab('android')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: platformTab === 'android' ? colors.primary : colors.card,
            borderColor: platformTab === 'android' ? colors.primary : colors.border,
            borderWidth: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Feather name="grid" size={14} color={platformTab === 'android' ? colors.primaryForeground : colors.foreground} />
          <Text style={{ color: platformTab === 'android' ? colors.primaryForeground : colors.foreground, fontSize: 12, fontWeight: '700' }}>
            Android
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setPlatformTab('watch')}
          style={{
            flex: 1,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: platformTab === 'watch' ? colors.primary : colors.card,
            borderColor: platformTab === 'watch' ? colors.primary : colors.border,
            borderWidth: 1,
            alignItems: 'center',
            flexDirection: 'row',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Feather name="watch" size={14} color={platformTab === 'watch' ? colors.primaryForeground : colors.foreground} />
          <Text style={{ color: platformTab === 'watch' ? colors.primaryForeground : colors.foreground, fontSize: 12, fontWeight: '700' }}>
            Apple Watch
          </Text>
        </Pressable>
      </View>

      {/* SECCIÓN 1: WIDGET PEQUEÑO (1x1) */}
      <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800', marginBottom: 6 }}>
        1. Widget Pequeño (Racha Activa 🔥)
      </Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 12 }}>
        Ideal para la esquina superior de tu pantalla principal. Te recuerda mantener la racha viva cada día.
      </Text>

      <View style={{ alignItems: 'center', marginBottom: 24 }}>
        <View
          style={{
            width: 165,
            height: 165,
            backgroundColor: '#120D1A',
            borderRadius: 28,
            borderWidth: 1.5,
            borderColor: '#3D2459',
            padding: 16,
            justifyContent: 'space-between',
            shadowColor: '#A855F7',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
            <Image source={images.logo} style={{ width: 28, height: 28, borderRadius: 7 }} />
            <Text style={{ color: '#FF6B00', fontSize: 18 }}>🔥</Text>
          </View>

          <View>
            <Text style={{ color: '#E9D5FF', fontSize: 10, fontWeight: '700', letterSpacing: 0.5 }}>
              RACHA BODYFIT
            </Text>
            <Text style={{ color: '#FFFFFF', fontSize: 28, fontWeight: '900', marginTop: 2 }}>
              {stats.streak} {stats.streak === 1 ? 'DÍA' : 'DÍAS'}
            </Text>
            <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '600', marginTop: 2 }}>
              {stats.calories} / {stats.calorieGoal} kcal
            </Text>
          </View>

          <View style={{ height: 4, backgroundColor: '#2C1B40', borderRadius: 2 }}>
            <View
              style={{
                height: 4,
                backgroundColor: '#A855F7',
                borderRadius: 2,
                width: `${Math.min((stats.calories / stats.calorieGoal) * 100, 100)}%`,
              }}
            />
          </View>
        </View>
      </View>

      {/* SECCIÓN 2: WIDGET MEDIANO (2x2) */}
      <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800', marginBottom: 6 }}>
        2. Widget Mediano (Panel Completo Fitness)
      </Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 12 }}>
        Muestra tu racha, tus calorías y las barras de progreso de tus macros sin necesidad de abrir la app.
      </Text>

      <View style={{ marginBottom: 24 }}>
        <View
          style={{
            width: '100%',
            height: 155,
            backgroundColor: '#120D1A',
            borderRadius: 28,
            borderWidth: 1.5,
            borderColor: '#3D2459',
            padding: 18,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            shadowColor: '#A855F7',
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.25,
            shadowRadius: 10,
            elevation: 8,
          }}
        >
          {/* Lado Izquierdo */}
          <View style={{ flex: 1, paddingRight: 14, justifyContent: 'space-between', height: '100%' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Image source={images.logo} style={{ width: 26, height: 26, borderRadius: 6 }} />
              <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '800' }}>BODYFIT DYNASTY</Text>
            </View>

            <View>
              <Text style={{ color: '#FF6B00', fontSize: 24, fontWeight: '900' }}>
                🔥 {stats.streak} {stats.streak === 1 ? 'día' : 'días'}
              </Text>
              <Text style={{ color: '#E9D5FF', fontSize: 11, marginTop: 2 }}>
                Racha activa en fuego
              </Text>
            </View>

            <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '700' }}>
              Nivel: {profile?.fitnessLevel || 'Avanzado'}
            </Text>
          </View>

          {/* Lado Derecho: Barras de Progreso */}
          <View style={{ width: 130, justifyContent: 'space-between', height: '100%' }}>
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: '#E9D5FF', fontSize: 10, fontWeight: '600' }}>Calorías</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>{stats.calories} kcal</Text>
              </View>
              <View style={{ height: 6, backgroundColor: '#2C1B40', borderRadius: 3 }}>
                <View style={{ height: 6, backgroundColor: '#A855F7', borderRadius: 3, width: `${Math.min((stats.calories / stats.calorieGoal) * 100, 100)}%` }} />
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: '#E9D5FF', fontSize: 10, fontWeight: '600' }}>Proteína</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>{stats.protein}g</Text>
              </View>
              <View style={{ height: 6, backgroundColor: '#2C1B40', borderRadius: 3 }}>
                <View style={{ height: 6, backgroundColor: '#38BDF8', borderRadius: 3, width: `${Math.min((stats.protein / stats.proteinGoal) * 100, 100)}%` }} />
              </View>
            </View>

            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 }}>
                <Text style={{ color: '#E9D5FF', fontSize: 10, fontWeight: '600' }}>Entreno</Text>
                <Text style={{ color: '#FFFFFF', fontSize: 10, fontWeight: '700' }}>45m</Text>
              </View>
              <View style={{ height: 6, backgroundColor: '#2C1B40', borderRadius: 3 }}>
                <View style={{ height: 6, backgroundColor: colors.gold, borderRadius: 3, width: '75%' }} />
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* SECCIÓN 3: WIDGET DE FRASE MOTIVACIONAL DIARIA DYNASTY (NUEVO) */}
      <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800', marginBottom: 6 }}>
        3. Widget Frase Motivacional Diaria Dynasty ⚡️
      </Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 12 }}>
        Inspiración y disciplina directa en tu pantalla de inicio, renovada automáticamente cada día.
      </Text>

      <View style={{ marginBottom: 24 }}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#150E22',
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: colors.gold,
            padding: 16,
            shadowColor: colors.gold,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <View style={{ backgroundColor: `${colors.gold}25`, padding: 5, borderRadius: 6 }}>
                <Feather name="zap" size={13} color={colors.gold} />
              </View>
              <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8 }}>
                DYNASTY MINDSET · DÍA #{new Date().getDate()}
              </Text>
            </View>
            <View style={{ backgroundColor: '#231336', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
                {quote.category}
              </Text>
            </View>
          </View>

          <Text style={{ color: '#FFFFFF', fontSize: 13, fontStyle: 'italic', lineHeight: 18, marginBottom: 10 }}>
            "{quote.text}"
          </Text>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', borderTopWidth: 1, borderTopColor: `${colors.border}60`, paddingTop: 8 }}>
            <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>
              — {quote.author}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>
              {quote.tag}
            </Text>
          </View>
        </View>
      </View>

      {/* SECCIÓN 4: WIDGET DE RUTINA ACTIVA (NUEVO) */}
      <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800', marginBottom: 6 }}>
        4. Widget de Rutina Semanal Activa 🏋️
      </Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 12 }}>
        Tu sesión de entrenamiento y foco del día a la vista para que nunca olvides entrenar.
      </Text>

      <View style={{ marginBottom: 24 }}>
        <View
          style={{
            width: '100%',
            backgroundColor: '#120D1A',
            borderRadius: 24,
            borderWidth: 1.5,
            borderColor: `${colors.primary}90`,
            padding: 16,
            shadowColor: colors.primary,
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.2,
            shadowRadius: 8,
            elevation: 6,
          }}
        >
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7 }}>
              <View style={{ backgroundColor: `${colors.primary}25`, padding: 5, borderRadius: 6 }}>
                <Feather name="activity" size={13} color={colors.primary} />
              </View>
              <Text style={{ color: colors.primary, fontSize: 10.5, fontWeight: '800', letterSpacing: 0.8 }}>
                SESIÓN ACTIVA · BODYFIT DYNASTY
              </Text>
            </View>
            <View style={{ backgroundColor: `${colors.gold}20`, paddingHorizontal: 7, paddingVertical: 2, borderRadius: 5 }}>
              <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>
                {customRoutine ? `${customRoutine.days?.length || 0} DÍAS` : 'PLAN INICIAL'}
              </Text>
            </View>
          </View>

          {activeRoutineDay ? (
            <>
              <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', marginBottom: 2 }}>
                {activeRoutineDay.dayName}
              </Text>
              <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '700', marginBottom: 8 }}>
                Foco: {activeRoutineDay.focus} · {activeRoutineDay.exerciseIds?.length || 0} ejercicios
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Feather name="check-circle" size={12} color={colors.primary} />
                <Text style={{ color: colors.mutedForeground, fontSize: 10.5 }}>
                  Toca para abrir y comenzar cronómetro en vivo
                </Text>
              </View>
            </>
          ) : (
            <>
              <Text style={{ color: '#FFFFFF', fontSize: 14, fontWeight: '700', marginBottom: 4 }}>
                Sugerencia Inteligente Lista
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>
                Entra a 'Mi Rutina' en la app para activar tu división semanal con IA.
              </Text>
            </>
          )}
        </View>
      </View>

      {/* SECCIÓN 5: PANTALLA DE BLOQUEO Y APPLE WATCH */}
      <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800', marginBottom: 6 }}>
        5. Pantalla de Bloqueo & Apple Watch
      </Text>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, marginBottom: 12 }}>
        Acceso instantáneo con un vistazo sin desbloquear tu teléfono o directamente en tu reloj inteligente.
      </Text>

      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 24 }}>
        {/* Lock Screen iOS */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#0F0F12',
            borderRadius: 22,
            borderWidth: 1,
            borderColor: '#2A2A33',
            padding: 14,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
          }}
        >
          <Text style={{ color: '#888', fontSize: 10, fontWeight: '700', marginBottom: 6 }}>LOCK SCREEN</Text>
          <Text style={{ color: '#FFF', fontSize: 18, fontWeight: '800' }}>🔥 {stats.streak} d</Text>
          <Text style={{ color: '#AAA', fontSize: 11, marginTop: 4 }}>{stats.calories} kcal</Text>
        </View>

        {/* Apple Watch Complication */}
        <View
          style={{
            flex: 1,
            backgroundColor: '#000000',
            borderRadius: 28,
            borderWidth: 2,
            borderColor: '#333333',
            padding: 14,
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 120,
          }}
        >
          <Text style={{ color: '#FF6B00', fontSize: 10, fontWeight: '800', letterSpacing: 1 }}>WATCH COMPLICATION</Text>
          <View style={{ width: 50, height: 50, borderRadius: 25, borderWidth: 4, borderColor: '#A855F7', borderTopColor: '#FF6B00', alignItems: 'center', justifyContent: 'center', marginVertical: 6 }}>
            <Text style={{ color: '#FFF', fontSize: 12, fontWeight: '800' }}>🔥{stats.streak}</Text>
          </View>
          <Text style={{ color: '#FFF', fontSize: 10 }}>BodyFit</Text>
        </View>
      </View>

      {/* Botón de Sincronización Manual */}
      <View style={{ marginBottom: 20 }}>
        <PrimaryButton title="Sincronizar Datos de Widgets" icon="refresh-cw" onPress={handleSimulateSync} />
      </View>

      {/* Guía Paso a Paso para la Pantalla Principal */}
      <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 30 }}>
        <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '800', marginBottom: 8 }}>
          📱 ¿Cómo agregarlo a tu pantalla principal?
        </Text>
        <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 18 }}>
          1. Mantén presionada cualquier área vacía en la pantalla de inicio de tu iPhone o Android.{'\n'}
          2. Toca el botón <Text style={{ color: colors.gold, fontWeight: '700' }}>"+"</Text> en la esquina superior.{'\n'}
          3. Busca <Text style={{ color: colors.primary, fontWeight: '700' }}>BodyFit Dynasty</Text> en la lista.{'\n'}
          4. Elige entre el widget pequeño (Racha 🔥), mediano (Macros), Frase Diaria ⚡️ o Rutina Semanal 🏋️ y toca "Agregar widget".
        </Text>
      </View>
    </Screen>
  );
}
