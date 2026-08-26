import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ActivityIndicator, ImageSourcePropType, Platform, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useColors } from '@/hooks/useColors';

export const images = {
  logo: require('../assets/images/icon.png') as ImageSourcePropType,
  meal: require('../assets/images/food-bowl.jpg') as ImageSourcePropType,
  workout: require('../assets/images/bench-press.jpg') as ImageSourcePropType,
};

export function Screen({ children, scroll = true }: { children: React.ReactNode; scroll?: boolean }) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const topPadding = Platform.OS === 'web' ? 67 : insets.top + 12;
  const bottomPadding = Platform.OS === 'web' ? 34 : insets.bottom + 92;
  const content = (
    <View style={[styles.screen, { backgroundColor: colors.background, paddingTop: topPadding, paddingBottom: bottomPadding }]}>
      {children}
    </View>
  );
  if (!scroll) return content;
  return (
    <ScrollView
      style={{ backgroundColor: colors.background }}
      contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 34 : insets.bottom + 100 }}
      showsVerticalScrollIndicator={false}
      scrollEventThrottle={16}
    >
      {content}
    </ScrollView>
  );
}

export function TopBar({ title, subtitle, onPress }: { title: string; subtitle?: string; onPress?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.topBar}>
      <View>
        <Text style={[styles.eyebrow, { color: colors.gold }]}>BODYFIT DYNASTY</Text>
        <Text style={[styles.pageTitle, { color: colors.foreground }]}>{title}</Text>
        {subtitle ? <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>{subtitle}</Text> : null}
      </View>
      <Pressable testID="notifications-button" onPress={onPress} style={({ pressed }) => [styles.iconButton, { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 }]}>
        <Feather name="bell" size={18} color={colors.foreground} />
        <View style={[styles.notificationDot, { backgroundColor: colors.primary }]} />
      </Pressable>
    </View>
  );
}

export function BrandMark({ size = 48 }: { size?: number }) {
  const colors = useColors();
  return (
    <View style={[styles.brandMark, { width: size, height: size, borderColor: colors.gold, backgroundColor: colors.card }]}>
      <Image source={images.logo} contentFit="cover" style={{ width: size - 6, height: size - 6, borderRadius: 14 }} />
    </View>
  );
}

export function SectionHeader({ title, action, onPress }: { title: string; action?: string; onPress?: () => void }) {
  const colors = useColors();
  return (
    <View style={styles.sectionHeader}>
      <Text style={[styles.sectionTitle, { color: colors.foreground }]}>{title}</Text>
      {action ? (
        <Pressable testID={`section-action-${title}`} onPress={onPress}>
          <Text style={[styles.link, { color: colors.primary }]}>{action}</Text>
        </Pressable>
      ) : null}
    </View>
  );
}

export function MetricCard({ icon, label, value, goal, color }: { icon: keyof typeof Feather.glyphMap; label: string; value: string; goal?: string; color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.metricCard, { backgroundColor: colors.card, borderColor: colors.border }]}>
      <View style={[styles.metricIcon, { backgroundColor: `${color}22` }]}>
        <Feather name={icon} size={16} color={color} />
      </View>
      <Text style={[styles.metricLabel, { color: colors.mutedForeground }]}>{label}</Text>
      <Text style={[styles.metricValue, { color: colors.foreground }]}>{value}</Text>
      {goal ? <Text style={[styles.metricGoal, { color: colors.mutedForeground }]}>{goal}</Text> : null}
    </View>
  );
}

export function ProgressBar({ value, goal, color }: { value: number; goal: number; color: string }) {
  const colors = useColors();
  return (
    <View style={[styles.progressTrack, { backgroundColor: colors.muted }]}>
      <View style={[styles.progressFill, { width: `${Math.min((value / goal) * 100, 100)}%`, backgroundColor: color }]} />
    </View>
  );
}

export function PrimaryButton({ title, onPress, icon, disabled = false }: { title: string; onPress?: () => void; icon?: keyof typeof Feather.glyphMap; disabled?: boolean }) {
  const colors = useColors();
  return (
    <Pressable testID={`button-${title}`} onPress={onPress} disabled={disabled} style={({ pressed }) => [styles.primaryButton, { backgroundColor: disabled ? colors.muted : colors.primary, opacity: pressed ? 0.78 : 1 }]}>
      {icon ? <Feather name={icon} size={17} color={colors.primaryForeground} /> : null}
      <Text style={[styles.primaryButtonText, { color: colors.primaryForeground }]}>{title}</Text>
    </Pressable>
  );
}

export function MiniChart({ color }: { color: string }) {
  const colors = useColors();
  const heights = [30, 44, 26, 58, 48, 66, 52, 82, 62, 92, 72, 98];
  return (
    <View style={styles.chart}>
      {heights.map((height, index) => (
        <View key={index} style={[styles.chartBar, { height, backgroundColor: index === heights.length - 1 ? color : `${color}66` }]} />
      ))}
      <View style={[styles.chartBaseline, { backgroundColor: colors.border }]} />
    </View>
  );
}

export function GradientCard({ children, colors: gradientColors = ['#211231', '#111116'] }: { children: React.ReactNode; colors?: readonly [string, string, ...string[]] }) {
  return <LinearGradient colors={gradientColors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={styles.gradientCard}>{children}</LinearGradient>;
}

export function LoadingState() {
  const colors = useColors();
  return <View style={styles.loading}><ActivityIndicator color={colors.primary} /></View>;
}

export const styles = StyleSheet.create({
  screen: { flex: 1, paddingHorizontal: 20 },
  topBar: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 26 },
  eyebrow: { fontSize: 10, fontWeight: '700', letterSpacing: 2.2, marginBottom: 7 },
  pageTitle: { fontSize: 28, fontWeight: '700', letterSpacing: -0.7 },
  subtitle: { fontSize: 13, marginTop: 5 },
  iconButton: { width: 42, height: 42, borderRadius: 15, borderWidth: 1, alignItems: 'center', justifyContent: 'center', position: 'relative' },
  notificationDot: { width: 6, height: 6, borderRadius: 3, position: 'absolute', top: 9, right: 10 },
  brandMark: { borderRadius: 16, borderWidth: 1, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  sectionHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 13, marginTop: 25 },
  sectionTitle: { fontSize: 18, fontWeight: '700', letterSpacing: -0.3 },
  link: { fontSize: 12, fontWeight: '700' },
  metricCard: { borderRadius: 18, borderWidth: 1, padding: 13, minHeight: 121, flex: 1 },
  metricIcon: { width: 30, height: 30, borderRadius: 10, alignItems: 'center', justifyContent: 'center', marginBottom: 10 },
  metricLabel: { fontSize: 11, marginBottom: 3 },
  metricValue: { fontSize: 20, fontWeight: '700' },
  metricGoal: { fontSize: 10, marginTop: 3 },
  progressTrack: { height: 5, borderRadius: 3, overflow: 'hidden' },
  progressFill: { height: '100%', borderRadius: 3 },
  primaryButton: { borderRadius: 14, minHeight: 50, paddingHorizontal: 19, flexDirection: 'row', gap: 9, justifyContent: 'center', alignItems: 'center' },
  primaryButtonText: { fontWeight: '700', fontSize: 14 },
  chart: { height: 104, flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', position: 'relative', paddingBottom: 6, paddingHorizontal: 4 },
  chartBar: { width: 13, borderRadius: 7, zIndex: 1 },
  chartBaseline: { height: 1, left: 0, right: 0, bottom: 6, position: 'absolute' },
  gradientCard: { borderRadius: 22, padding: 18, overflow: 'hidden' },
  loading: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  screenImage: { width: '100%', height: 190, borderRadius: 18 },
  row: { flexDirection: 'row', alignItems: 'center' },
  spaceBetween: { justifyContent: 'space-between' },
  card: { borderRadius: 18, borderWidth: 1, padding: 16 },
  smallText: { fontSize: 12 },
  mutedText: { fontSize: 12 },
  avatar: { width: 38, height: 38, borderRadius: 19 },
  avatarSmall: { width: 32, height: 32, borderRadius: 16 },
});