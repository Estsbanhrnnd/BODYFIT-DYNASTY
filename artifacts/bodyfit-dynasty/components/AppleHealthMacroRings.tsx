import { Feather, Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Svg, { Circle, G } from 'react-native-svg';

export interface MacroRingMetric {
  id: 'calories' | 'protein' | 'carbs' | 'fats';
  label: string;
  consumed: number;
  goal: number;
  unit: string;
  color: string;
  bgColor: string;
  iconName: keyof typeof Ionicons.glyphMap;
  foodEmoji: string;
}

interface AppleHealthMacroRingsProps {
  calories: number;
  calorieGoal: number;
  protein: number;
  proteinGoal: number;
  carbs: number;
  carbsGoal: number;
  fats: number;
  fatsGoal: number;
}

export function AppleHealthSingleRing({
  size = 46,
  strokeWidth = 5,
  progress = 0,
  color,
  bgColor,
  children,
}: {
  size?: number;
  strokeWidth?: number;
  progress: number;
  color: string;
  bgColor?: string;
  children?: React.ReactNode;
}) {
  const center = size / 2;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  // Limitar entre 0 y 1 para el arco visual principal
  const clampedProgress = Math.min(Math.max(progress, 0), 1);
  const strokeDashoffset = circumference * (1 - clampedProgress);

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Svg width={size} height={size}>
        {/* Track de fondo atenuado */}
        <Circle
          cx={center}
          cy={center}
          r={radius}
          stroke={bgColor || `${color}25`}
          strokeWidth={strokeWidth}
          fill="none"
        />
        {/* Arco de progreso estilo Apple Health con punta redondeada */}
        {progress > 0 && (
          <Circle
            cx={center}
            cy={center}
            r={radius}
            stroke={color}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={`${circumference} ${circumference}`}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform={`rotate(-90 ${center} ${center})`}
          />
        )}
      </Svg>
      {/* Contenido en el centro de la bolita */}
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        {children}
      </View>
    </View>
  );
}

export function AppleHealthConcentricRings({
  size = 140,
  strokeWidth = 10,
  gap = 4,
  metrics,
  centerCalories = 0,
}: {
  size?: number;
  strokeWidth?: number;
  gap?: number;
  metrics: MacroRingMetric[];
  centerCalories?: number;
}) {
  const center = size / 2;

  return (
    <View style={{ width: size, height: size, alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
      <Svg width={size} height={size}>
        {metrics.map((m, index) => {
          const radius = (size - strokeWidth) / 2 - index * (strokeWidth + gap);
          if (radius <= 0) return null;
          const circumference = 2 * Math.PI * radius;
          const progress = m.goal > 0 ? m.consumed / m.goal : 0;
          const clamped = Math.min(Math.max(progress, 0), 1);
          const offset = circumference * (1 - clamped);

          return (
            <G key={m.id}>
              {/* Track atenuado */}
              <Circle
                cx={center}
                cy={center}
                r={radius}
                stroke={m.bgColor}
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Arco frontal redondeado */}
              {progress > 0 && (
                <Circle
                  cx={center}
                  cy={center}
                  r={radius}
                  stroke={m.color}
                  strokeWidth={strokeWidth}
                  fill="none"
                  strokeDasharray={`${circumference} ${circumference}`}
                  strokeDashoffset={offset}
                  strokeLinecap="round"
                  transform={`rotate(-90 ${center} ${center})`}
                />
              )}
            </G>
          );
        })}
      </Svg>
      {/* Núcleo central del anillo concéntrico */}
      <View style={[StyleSheet.absoluteFill, { alignItems: 'center', justifyContent: 'center' }]}>
        <Ionicons name="flame" size={16} color="#FF3B30" />
        <Text style={{ color: '#FFFFFF', fontSize: 15, fontWeight: '800', lineHeight: 18, marginTop: 1 }}>
          {centerCalories}
        </Text>
        <Text style={{ color: '#A090B0', fontSize: 9, fontWeight: '700', textTransform: 'uppercase' }}>
          kcal
        </Text>
      </View>
    </View>
  );
}

export function AppleHealthMacroRings({
  calories,
  calorieGoal,
  protein,
  proteinGoal,
  carbs,
  carbsGoal,
  fats,
  fatsGoal,
}: AppleHealthMacroRingsProps) {
  // Configuración de marcadores con paleta auténtica de Apple Health / Fitness Rings
  const metrics: MacroRingMetric[] = [
    {
      id: 'calories',
      label: 'Calorías',
      consumed: calories,
      goal: calorieGoal,
      unit: 'kcal',
      color: '#FF3B30', // Rojo/Fuego Apple Health Move
      bgColor: '#3A1012',
      iconName: 'flame',
      foodEmoji: '🔥',
    },
    {
      id: 'protein',
      label: 'Proteína',
      consumed: protein,
      goal: proteinGoal,
      unit: 'g',
      color: '#00E096', // Verde/Cian neón Apple Health Exercise
      bgColor: '#0A3324',
      iconName: 'barbell',
      foodEmoji: '🥩',
    },
    {
      id: 'carbs',
      label: 'Carbohidratos',
      consumed: carbs,
      goal: carbsGoal,
      unit: 'g',
      color: '#FFCC00', // Ámbar dorado Apple Health Stand
      bgColor: '#3A3008',
      iconName: 'flash',
      foodEmoji: '🍚',
    },
    {
      id: 'fats',
      label: 'Grasas',
      consumed: fats,
      goal: fatsGoal,
      unit: 'g',
      color: '#AF52DE', // Violeta / Púrpura Dynasty
      bgColor: '#28103A',
      iconName: 'water',
      foodEmoji: '🥑',
    },
  ];

  return (
    <View style={styles.container}>
      {/* Cabecera / Visualizador Concéntrico + Resumen de Bolitas */}
      <View style={styles.topSection}>
        {/* Anillo Concéntrico Principal tipo Apple Health */}
        <View style={styles.concentricWrapper}>
          <AppleHealthConcentricRings
            size={132}
            strokeWidth={9}
            gap={4}
            metrics={metrics}
            centerCalories={calories}
          />
        </View>

        {/* Resumen lateral de marcadores por bolita */}
        <View style={styles.summaryList}>
          {metrics.map((m) => {
            const ratio = m.goal > 0 ? m.consumed / m.goal : 0;
            const remaining = Math.max(0, m.goal - m.consumed);
            const isCompleted = m.consumed >= m.goal;

            return (
              <View key={m.id} style={styles.summaryRow}>
                {/* Bolita circular individual tipo Apple Health */}
                <AppleHealthSingleRing
                  size={36}
                  strokeWidth={4}
                  progress={ratio}
                  color={m.color}
                  bgColor={m.bgColor}
                >
                  <Text style={{ fontSize: 11 }}>{m.foodEmoji}</Text>
                </AppleHealthSingleRing>

                {/* Etiquetas de valores */}
                <View style={{ flex: 1, minWidth: 0 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 12, fontWeight: '700' }}>
                      {m.label}
                    </Text>
                    <Text style={{ color: m.color, fontSize: 11, fontWeight: '800' }}>
                      {m.consumed} <Text style={{ color: '#8E8299', fontSize: 10, fontWeight: '600' }}>/ {m.goal} {m.unit}</Text>
                    </Text>
                  </View>
                  <Text style={{ color: isCompleted ? m.color : '#8E8299', fontSize: 9.5, marginTop: 1, fontWeight: '500' }}>
                    {isCompleted ? '✓ Objetivo cumplido' : `${remaining} ${m.unit} restantes`}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* Grid de Bolitas de Detalle para cada Marcador */}
      <View style={styles.gridSection}>
        {metrics.map((m) => {
          const ratio = m.goal > 0 ? m.consumed / m.goal : 0;
          const isCompleted = m.consumed >= m.goal;

          return (
            <View
              key={m.id}
              style={[
                styles.gridCard,
                {
                  borderColor: isCompleted ? `${m.color}70` : 'rgba(255, 255, 255, 0.08)',
                },
              ]}
            >
              {/* Bolita Apple Health */}
              <AppleHealthSingleRing
                size={46}
                strokeWidth={5}
                progress={ratio}
                color={m.color}
                bgColor={m.bgColor}
              >
                <Ionicons name={m.iconName} size={16} color={m.color} />
              </AppleHealthSingleRing>

              {/* Textos del marcador */}
              <View style={{ marginTop: 6, alignItems: 'center' }}>
                <Text style={{ color: '#FFFFFF', fontSize: 11.5, fontWeight: '700' }}>
                  {m.label}
                </Text>
                <Text style={{ color: m.color, fontSize: 12.5, fontWeight: '800', marginTop: 1 }}>
                  {m.consumed}
                  <Text style={{ color: '#9E92A9', fontSize: 9.5, fontWeight: '600' }}> {m.unit}</Text>
                </Text>
                <Text style={{ color: '#7E7289', fontSize: 9, marginTop: 1 }}>
                  Meta: {m.goal} {m.unit}
                </Text>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
  },
  topSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 12,
  },
  concentricWrapper: {
    padding: 6,
    backgroundColor: '#140D1E',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryList: {
    flex: 1,
    gap: 8,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  gridSection: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 4,
  },
  gridCard: {
    flex: 1,
    backgroundColor: '#140D1E',
    borderWidth: 1,
    borderRadius: 14,
    paddingVertical: 10,
    paddingHorizontal: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
