import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useBodyFit } from '@/context/BodyFitContext';

const TIER_COLORS: Record<string, string> = {
  standard: '#9CA3AF',
  bronze: '#CD7F32',
  platinum: '#C084FC',
  golden: '#FFD700',
};

export function SimulationBanner() {
  const { isSimulatingClient, previewTier, previewClientFree, setPreviewTier, setPreviewClientFree } = useBodyFit();
  const insets = useSafeAreaInsets();

  if (!isSimulatingClient) return null;

  const currentTier = previewTier !== 'none' ? previewTier : (previewClientFree ? 'standard' : 'standard');
  const tierColor = TIER_COLORS[currentTier] || '#FFD700';

  const handleExitSimulation = () => {
    setPreviewTier('none');
    setPreviewClientFree(false);
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: Math.max(insets.top, 10),
        },
      ]}
      pointerEvents="box-none"
    >
      <View style={[styles.banner, { borderColor: tierColor }]}>
        <View style={styles.leftSection}>
          <View style={[styles.dot, { backgroundColor: tierColor }]} />
          <Text style={styles.title} numberOfLines={1}>
            MODO CLIENTE:{' '}
            <Text style={{ color: tierColor, fontWeight: '900' }}>
              {currentTier.toUpperCase()}
            </Text>
          </Text>
        </View>

        <Pressable
          onPress={handleExitSimulation}
          style={({ pressed }) => [
            styles.exitButton,
            {
              backgroundColor: `${tierColor}25`,
              borderColor: tierColor,
              opacity: pressed ? 0.75 : 1,
            },
          ]}
          hitSlop={8}
        >
          <Feather name="shield" size={12} color={tierColor} />
          <Text style={[styles.exitText, { color: tierColor }]}>Salir a Modo Admin</Text>
          <Feather name="x" size={13} color={tierColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 99999,
    alignItems: 'center',
    paddingHorizontal: 12,
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(15, 10, 22, 0.94)',
    borderWidth: 1.2,
    borderRadius: 14,
    paddingVertical: 7,
    paddingHorizontal: 12,
    width: '100%',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 8,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 7,
    flex: 1,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  exitButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    borderWidth: 1,
    borderRadius: 10,
    paddingVertical: 4,
    paddingHorizontal: 8,
  },
  exitText: {
    fontSize: 10.5,
    fontWeight: '800',
  },
});
