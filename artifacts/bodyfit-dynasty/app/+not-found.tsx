import { Feather } from '@expo/vector-icons';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';
import { useColors } from '@/hooks/useColors';

export default function NotFoundScreen() {
  const colors = useColors();

  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada', headerShown: false }} />
      <View style={[styles.container, { backgroundColor: '#0B0712' }]}>
        <View style={[styles.iconCircle, { backgroundColor: `${colors.gold}20`, borderColor: colors.gold }]}>
          <Feather name="compass" size={36} color={colors.gold} />
        </View>

        <Text style={[styles.title, { color: colors.foreground }]}>
          Pantalla no encontrada
        </Text>

        <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
          La ruta a la que intentas acceder no existe o fue reubicada en la dinastía.
        </Text>

        <Link href="/" style={[styles.linkBtn, { backgroundColor: colors.gold }]}>
          <Text style={styles.linkText}>
            Volver a la Dinastía
          </Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  iconCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 18,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 18,
    textAlign: 'center',
    maxWidth: 280,
    marginBottom: 24,
  },
  linkBtn: {
    paddingHorizontal: 22,
    paddingVertical: 12,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  linkText: {
    color: '#000000',
    fontSize: 13.5,
    fontWeight: '800',
  },
});
