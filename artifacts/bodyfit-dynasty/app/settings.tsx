import { Feather } from '@expo/vector-icons';
import { useClerk } from '@clerk/expo';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { Screen, TopBar, styles as bfStyles } from '@/components/bodyfit';
import { DynastyTermsModal } from '@/components/DynastyTermsModal';
import { DYNASTY_LOGOS_CATALOG, getDynastyLogo } from '@/constants/logosCatalog';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function SettingsScreen() {
  const c = useColors();
  const { signOut } = useClerk();
  const { profile, refreshProfile, updateProfile } = useBodyFit();
  const [notifications, setNotifications] = useState(false);
  const [savingLogo, setSavingLogo] = useState(false);
  const [showTermsReview, setShowTermsReview] = useState(false);

  const activeLogo = getDynastyLogo(profile?.logoKey);

  const handleSelectLogo = async (logoId: string) => {
    if (profile?.logoKey === logoId || savingLogo) return;
    setSavingLogo(true);
    try {
      await updateProfile({ logoKey: logoId });
      Alert.alert('¡Emblema Actualizado!', 'El logo oficial de la dinastía ha cambiado en tu aplicación.');
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el emblema.');
    } finally {
      setSavingLogo(false);
    }
  };

  return (
    <Screen>
      <TopBar title="Configuración" subtitle="Controla tu cuenta y preferencias" onPress={() => router.back()} />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        {/* Ficha de Cuenta */}
        <View style={{ backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 14 }}>
          <Text style={{ color: c.foreground, fontWeight: '700', fontSize: 16, marginBottom: 12 }}>Cuenta</Text>
          <Text style={{ color: c.mutedForeground, fontSize: 11, fontWeight: '700' }}>CÓDIGO ÚNICO DE ATLETA</Text>
          <Text selectable style={{ color: c.gold, fontWeight: '800', fontSize: 16, marginTop: 4, marginBottom: 14, letterSpacing: 0.5 }}>
            {profile?.userCode ?? 'BFD-001'}
          </Text>

          <Pressable
            onPress={() => router.push('/profile-edit' as never)}
            style={{ paddingVertical: 13, borderTopWidth: 1, borderTopColor: c.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={{ color: c.primary, fontWeight: '700', fontSize: 13 }}>Editar perfil y biometría</Text>
            <Feather name="chevron-right" size={16} color={c.primary} />
          </Pressable>

          <Pressable
            onPress={() => refreshProfile()}
            style={{ paddingVertical: 13, borderTopWidth: 1, borderTopColor: c.border, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}
          >
            <Text style={{ color: c.foreground, fontSize: 13 }}>Sincronizar y actualizar datos</Text>
            <Feather name="refresh-cw" size={15} color={c.mutedForeground} />
          </Pressable>
        </View>

        {/* Personalización de Emblemas Dinastía (Sección 15) */}
        <View style={{ backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: c.foreground, fontWeight: '700', fontSize: 16 }}>
              Emblema Oficial de la App
            </Text>
            <View style={{ backgroundColor: `${activeLogo.primaryColor}25`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8, borderWidth: 1, borderColor: `${activeLogo.primaryColor}60` }}>
              <Text style={{ color: activeLogo.primaryColor, fontSize: 10, fontWeight: '800' }}>{activeLogo.badgeLabel}</Text>
            </View>
          </View>
          <Text style={{ color: c.mutedForeground, fontSize: 11, marginBottom: 14, lineHeight: 16 }}>
            Elige el emblema que decorará el encabezado, sellos de marca y la identidad visual de tu aplicación:
          </Text>

          <View style={{ gap: 8 }}>
            {DYNASTY_LOGOS_CATALOG.map((item) => {
              const isSelected = (profile?.logoKey || 'gold-emperor') === item.id;
              return (
                <Pressable
                  key={item.id}
                  disabled={savingLogo}
                  onPress={() => handleSelectLogo(item.id)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: isSelected ? item.bgColor : '#1A1224',
                      borderColor: isSelected ? item.primaryColor : `${c.border}90`,
                      borderWidth: isSelected ? 1.5 : 1,
                      borderRadius: 14,
                      padding: 12,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 12,
                      backgroundColor: `${item.primaryColor}25`,
                      borderWidth: 1,
                      borderColor: item.primaryColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Feather name={item.iconName} size={20} color={item.primaryColor} />
                  </View>

                  <View style={{ flex: 1 }}>
                    <Text style={{ color: c.foreground, fontSize: 13, fontWeight: '800' }}>
                      {item.name}
                    </Text>
                    <Text style={{ color: c.mutedForeground, fontSize: 10.5, marginTop: 2 }} numberOfLines={1}>
                      {item.description}
                    </Text>
                  </View>

                  <View
                    style={{
                      width: 20,
                      height: 20,
                      borderRadius: 10,
                      borderWidth: 1.5,
                      borderColor: isSelected ? item.primaryColor : c.mutedForeground,
                      backgroundColor: isSelected ? item.primaryColor : 'transparent',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    {isSelected ? <Feather name="check" size={12} color="#0B0710" /> : null}
                  </View>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* Notificaciones */}
        <View style={{ backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 14 }}>
          <Text style={{ color: c.foreground, fontWeight: '700', fontSize: 16, marginBottom: 8 }}>Notificaciones</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flex: 1, paddingRight: 10 }}>
              <Text style={{ color: c.foreground, fontSize: 13, fontWeight: '600' }}>Avisos de entrenamiento</Text>
              <Text style={{ color: c.mutedForeground, fontSize: 11, marginTop: 4, lineHeight: 16 }}>
                Notificaciones locales para no perder tu racha y recordar tus comidas diarias.
              </Text>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: c.muted, true: c.primary }}
              thumbColor={c.foreground}
            />
          </View>
        </View>

        {/* Términos, Requerimientos & Permisos del Sistema */}
        <View style={{ backgroundColor: c.card, borderColor: c.border, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 14 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <Text style={{ color: c.foreground, fontWeight: '700', fontSize: 16 }}>Términos & Requerimientos</Text>
            <View style={{ backgroundColor: `${c.gold}25`, paddingHorizontal: 8, paddingVertical: 3, borderRadius: 6, borderWidth: 1, borderColor: `${c.gold}60` }}>
              <Text style={{ color: c.gold, fontSize: 10, fontWeight: '800' }}>✓ ACEPTADOS</Text>
            </View>
          </View>
          <Text style={{ color: c.mutedForeground, fontSize: 11, marginBottom: 12, lineHeight: 16 }}>
            Permisos de cámara para el Escáner AI de Comida, galería para fotos de progreso, notificaciones de racha y términos legales del Head Coach.
          </Text>
          <Pressable
            onPress={() => setShowTermsReview(true)}
            style={{
              paddingVertical: 11,
              paddingHorizontal: 12,
              borderRadius: 12,
              backgroundColor: '#1C1226',
              borderWidth: 1,
              borderColor: `${c.border}90`,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Feather name="file-text" size={16} color={c.gold} />
              <Text style={{ color: c.foreground, fontSize: 12.5, fontWeight: '700' }}>
                Consultar Términos y Permisos
              </Text>
            </View>
            <Feather name="chevron-right" size={16} color={c.mutedForeground} />
          </Pressable>
        </View>

        {/* Modal de Revisión de Términos */}
        <DynastyTermsModal
          forceVisible={showTermsReview}
          isReviewMode={true}
          onClose={() => setShowTermsReview(false)}
        />

        {/* Cerrar Sesión */}
        <Pressable
          onPress={() =>
            Alert.alert('Cerrar sesión', '¿Deseas salir de tu cuenta en este dispositivo?', [
              { text: 'Cancelar', style: 'cancel' },
              { text: 'Salir', style: 'destructive', onPress: () => signOut() },
            ])
          }
          style={({ pressed }) => [
            {
              padding: 15,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: c.destructive,
              alignItems: 'center',
              backgroundColor: 'rgba(239, 68, 68, 0.08)',
              opacity: pressed ? 0.75 : 1,
            },
          ]}
        >
          <Text style={{ color: c.destructive, fontWeight: '700', fontSize: 13 }}>Cerrar sesión</Text>
        </Pressable>
      </ScrollView>
    </Screen>
  );
}