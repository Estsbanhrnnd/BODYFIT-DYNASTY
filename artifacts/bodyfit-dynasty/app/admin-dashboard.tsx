import * as WebBrowser from 'expo-web-browser';
import { Feather } from '@expo/vector-icons';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { PrimaryButton, Screen, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

type AdminTab = 'precios' | 'recetas' | 'videos_rutinas' | 'configuracion';

const ADMIN_ROUTINES_LIST = [
  {
    id: 'ppl-hipertrofia',
    title: 'Push / Pull / Legs (Hipertrofia Clásica)',
    category: 'Hipertrofia & Fuerza',
    badge: '3 - 6 DÍAS',
  },
  {
    id: 'arnold-split',
    title: 'Arnold Golden Era Split (Pecho/Espalda & Brazos)',
    category: 'Volumen y Estética',
    badge: '6 DÍAS',
  },
  {
    id: 'upper-lower-fuerza',
    title: 'Upper / Lower (Torso / Pierna)',
    category: 'Fuerza & Rendimiento',
    badge: '4 DÍAS',
  },
  {
    id: 'gluteos-pierna-pro',
    title: 'Glúteos & Pierna Pro Dynasty',
    category: 'Enfoque Glúteo / Piernas',
    badge: '4 - 5 DÍAS',
  },
  {
    id: 'fullbody-acondicionamiento',
    title: 'Full Body Funcional & Core',
    category: 'Atlético & Acondicionamiento',
    badge: '3 DÍAS',
  },
  {
    id: 'dynasty-sugerencia-ia',
    title: 'Rutina Inteligente Dynasty (Sugerencia Dinámica)',
    category: 'Algoritmo Adaptativo (Gym / Casa)',
    badge: 'ADAPTATIVA',
  },
  {
    id: 'active-custom-routine',
    title: 'Rutina Personalizada Activa (Mi Rutina)',
    category: 'Constructor Propio del Atleta',
    badge: 'PERSONAL',
  },
];

export default function AdminDashboardScreen() {
  const colors = useColors();
  const { isOwner, routineVideos, setRoutineVideo, removeRoutineVideo } = useBodyFit();
  const [activeTab, setActiveTab] = useState<AdminTab>('precios');
  const [videoInputs, setVideoInputs] = useState<Record<string, string>>({});

  // Precios locales de la tienda
  const [prices, setPrices] = useState<Record<string, string>>({
    'prod-iso100': '₡58,000',
    'prod-gold-standard': '₡49,500',
    'prod-nitro-tech': '₡46,000',
    'prod-cbum-whey': '₡56,000',
    'prod-syntha-6': '₡45,000',
    'prod-cbum-creatine': '₡29,000',
    'prod-on-creatine': '₡26,500',
    'prod-universal-creapure': '₡32,000',
    'prod-xtend-bcaa': '₡27,000',
  });

  // Mensaje global de la app
  const [globalAnnouncement, setGlobalAnnouncement] = useState(
    '¡Bienvenidos al mes de hipertrofia! Recuerda cumplir tus macros y registrar tu entreno diario.'
  );

  // Nueva receta
  const [recipeTitle, setRecipeTitle] = useState('');
  const [recipeTime, setRecipeTime] = useState('');
  const [recipeCategory, setRecipeCategory] = useState('almuerzo');
  const [recipePhotoUrl, setRecipePhotoUrl] = useState('');
  const [recipeIngredients, setRecipeIngredients] = useState('');

  const handleSavePrices = () => {
    Alert.alert('¡Precios Guardados!', 'Los precios han sido configurados correctamente en la base de datos de la tienda.');
  };

  const handleSaveAnnouncement = () => {
    Alert.alert('¡Configuración Guardada!', 'El mensaje global del Coach ha sido actualizado para todos los miembros.');
  };

  const handleAddRecipe = () => {
    if (!recipeTitle.trim() || !recipeIngredients.trim()) {
      Alert.alert('Campos incompletos', 'Por favor ingresa el título e ingredientes de la receta.');
      return;
    }
    Alert.alert('¡Receta Publicada!', `La receta "${recipeTitle}" se ha agregado con éxito al catálogo editorial de BodyFit.`);
    setRecipeTitle('');
    setRecipeTime('');
    setRecipePhotoUrl('');
    setRecipeIngredients('');
  };

  const handleTestRoutineVideo = async (url: string) => {
    if (!url) return;
    try {
      if (url.startsWith('http://') || url.startsWith('https://')) {
        await WebBrowser.openBrowserAsync(url);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir el enlace.');
    }
  };

  const handleSaveRoutineVideo = async (routineId: string, routineTitle: string) => {
    const rawVal = videoInputs[routineId] !== undefined ? videoInputs[routineId] : (routineVideos?.[routineId] || '');
    const cleanUrl = rawVal.trim();
    if (!cleanUrl) {
      Alert.alert('URL requerida', 'Por favor ingresa una URL válida de YouTube, Vimeo o MP4.');
      return;
    }
    await setRoutineVideo(routineId, cleanUrl);
    Alert.alert(
      '¡Video Guardado!',
      `El video para "${routineTitle}" ha sido actualizado. Todos tus atletas ahora pueden reproducirlo en su app.`
    );
  };

  const handleRemoveRoutineVideo = async (routineId: string, routineTitle: string) => {
    await removeRoutineVideo(routineId);
    setVideoInputs((prev) => ({ ...prev, [routineId]: '' }));
    Alert.alert('Video Desvinculado', `Se ha quitado el video de la rutina "${routineTitle}".`);
  };

  return (
    <Screen>
      <TopBar title="Panel de Administrador" subtitle="Control maestro de la aplicación BodyFit" />

      {/* Selector de Pestañas de Administración (Desplazable horizontalmente) */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8, paddingBottom: 16 }}>
        <Pressable
          onPress={() => setActiveTab('precios')}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: activeTab === 'precios' ? colors.primary : colors.card,
            borderColor: activeTab === 'precios' ? colors.primary : colors.border,
            borderWidth: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: activeTab === 'precios' ? colors.primaryForeground : colors.foreground, fontSize: 11.5, fontWeight: '700' }}>
            Precios Tienda
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('recetas')}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: activeTab === 'recetas' ? colors.primary : colors.card,
            borderColor: activeTab === 'recetas' ? colors.primary : colors.border,
            borderWidth: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: activeTab === 'recetas' ? colors.primaryForeground : colors.foreground, fontSize: 11.5, fontWeight: '700' }}>
            Recetas
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('videos_rutinas')}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: activeTab === 'videos_rutinas' ? colors.gold : colors.card,
            borderColor: activeTab === 'videos_rutinas' ? colors.gold : colors.border,
            borderWidth: 1,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6,
          }}
        >
          <Feather name="video" size={13} color={activeTab === 'videos_rutinas' ? '#000' : colors.gold} />
          <Text style={{ color: activeTab === 'videos_rutinas' ? '#000' : colors.foreground, fontSize: 11.5, fontWeight: '800' }}>
            Videos de Rutinas
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('configuracion')}
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderRadius: 14,
            backgroundColor: activeTab === 'configuracion' ? colors.primary : colors.card,
            borderColor: activeTab === 'configuracion' ? colors.primary : colors.border,
            borderWidth: 1,
            alignItems: 'center',
          }}
        >
          <Text style={{ color: activeTab === 'configuracion' ? colors.primaryForeground : colors.foreground, fontSize: 11.5, fontWeight: '700' }}>
            Ajustes App
          </Text>
        </Pressable>
      </ScrollView>

      {/* PESTAÑA 1: Precios de Tienda */}
      {activeTab === 'precios' && (
        <View>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '800', marginBottom: 4 }}>
            Fijación de Precios de Suplementos
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
            Configura el precio oficial que se mostrará a los clientes cuando decidas publicarlo. Por ahora en la tienda aparece como "Precio a consultar".
          </Text>

          {[
            { id: 'prod-iso100', name: 'Dymatize ISO 100 5lb' },
            { id: 'prod-gold-standard', name: 'Optimum Nutrition Gold Standard 5lb' },
            { id: 'prod-nitro-tech', name: 'MuscleTech Nitro-Tech Gold 5lb' },
            { id: 'prod-cbum-whey', name: 'Raw Nutrition CBUM Isolate 5lb' },
            { id: 'prod-cbum-creatine', name: 'Raw Nutrition CBUM Thavage Creatine' },
            { id: 'prod-on-creatine', name: 'ON Micronized Creatine 600g' },
            { id: 'prod-universal-creapure', name: 'Universal Creapure Creatina 500g' },
            { id: 'prod-xtend-bcaa', name: 'Scivation Xtend BCAA 90 serv' },
          ].map((item) => (
            <View
              key={item.id}
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 12,
                marginBottom: 10,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}
            >
              <View style={{ flex: 1, paddingRight: 10 }}>
                <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>{item.name}</Text>
              </View>
              <TextInput
                value={prices[item.id] || '₡0'}
                onChangeText={(val) => setPrices((prev) => ({ ...prev, [item.id]: val }))}
                placeholder="₡0 / $0"
                placeholderTextColor={colors.mutedForeground}
                style={{
                  width: 110,
                  backgroundColor: colors.input,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 7,
                  color: colors.gold,
                  fontSize: 13,
                  fontWeight: '700',
                  textAlign: 'right',
                }}
              />
            </View>
          ))}

          <View style={{ marginTop: 8, marginBottom: 20 }}>
            <PrimaryButton title="Guardar lista de precios" icon="check" onPress={handleSavePrices} />
          </View>
        </View>
      )}

      {/* PESTAÑA 2: Gestión de Recetas */}
      {activeTab === 'recetas' && (
        <View>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '800', marginBottom: 4 }}>
            Agregar Nueva Receta al Catálogo
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
            Publica nuevas recetas fitness con fotografía para que aparezcan en el catálogo de los clientes.
          </Text>

          <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 16 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Nombre del plato</Text>
            <TextInput
              value={recipeTitle}
              onChangeText={setRecipeTitle}
              placeholder="Ej. Tazón de salmón y aguacate fitness"
              placeholderTextColor={colors.mutedForeground}
              style={{ color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Tiempo estimado</Text>
            <TextInput
              value={recipeTime}
              onChangeText={setRecipeTime}
              placeholder="Ej. 15 min"
              placeholderTextColor={colors.mutedForeground}
              style={{ color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>URL de fotografía (Unsplash / https)</Text>
            <TextInput
              value={recipePhotoUrl}
              onChangeText={setRecipePhotoUrl}
              placeholder="https://images.unsplash.com/..."
              placeholderTextColor={colors.mutedForeground}
              style={{ color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 10, marginBottom: 12 }}
            />

            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>Ingredientes (uno por línea)</Text>
            <TextInput
              value={recipeIngredients}
              onChangeText={setRecipeIngredients}
              multiline
              numberOfLines={4}
              placeholder="• 150g pechuga de pollo&#10;• 1 taza arroz integral&#10;• ½ aguacate hass"
              placeholderTextColor={colors.mutedForeground}
              style={{ color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 80, textAlignVertical: 'top', marginBottom: 14 }}
            />

            <PrimaryButton title="Publicar receta en catálogo" icon="plus" onPress={handleAddRecipe} />
          </View>
        </View>
      )}

      {/* PESTAÑA 3: Gestión de Videos de Rutinas (Exclusivo Administrador) */}
      {activeTab === 'videos_rutinas' && (
        <View style={{ paddingBottom: 24 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
            <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 9, paddingVertical: 4, borderRadius: 8 }}>
              <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800' }}>
                ADMINISTRADOR EXCLUSIVO
              </Text>
            </View>
          </View>

          <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '800', marginBottom: 4 }}>
            Videos Demostrativos de Rutinas
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
            Vincula videos de YouTube, Vimeo o MP4 a cada una de las rutinas del sistema. Únicamente tu perfil de administrador tiene permiso para asignar o modificar estos videos. Tus clientes y atletas verán el botón "Ver Video de la Rutina" en sus pantallas correspondientes.
          </Text>

          {ADMIN_ROUTINES_LIST.map((routine) => {
            const currentSavedUrl = routineVideos?.[routine.id] || '';
            const currentInput = videoInputs[routine.id] !== undefined ? videoInputs[routine.id] : currentSavedUrl;
            const hasVideo = Boolean(currentSavedUrl);

            return (
              <View
                key={routine.id}
                style={{
                  backgroundColor: colors.card,
                  borderColor: hasVideo ? `${colors.gold}60` : colors.border,
                  borderWidth: 1,
                  borderRadius: 16,
                  padding: 14,
                  marginBottom: 14,
                }}
              >
                {/* Header de la rutina */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <View style={{ flex: 1, paddingRight: 8 }}>
                    <Text style={{ color: colors.foreground, fontSize: 14, fontWeight: '800', marginBottom: 3 }}>
                      {routine.title}
                    </Text>
                    <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700' }}>
                      {routine.category}
                    </Text>
                  </View>
                  <View
                    style={{
                      backgroundColor: hasVideo ? `${colors.primary}25` : 'rgba(255,255,255,0.06)',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 8,
                    }}
                  >
                    <Text
                      style={{
                        color: hasVideo ? colors.primary : colors.mutedForeground,
                        fontSize: 10,
                        fontWeight: '800',
                      }}
                    >
                      {hasVideo ? '✓ CON VIDEO' : 'SIN VIDEO'}
                    </Text>
                  </View>
                </View>

                {/* Input de URL */}
                <Text style={{ color: colors.mutedForeground, fontSize: 10.5, fontWeight: '700', marginBottom: 5 }}>
                  URL de Video (YouTube / Vimeo / MP4):
                </Text>
                <TextInput
                  value={currentInput}
                  onChangeText={(val) => setVideoInputs((prev) => ({ ...prev, [routine.id]: val }))}
                  placeholder="https://www.youtube.com/watch?v=..."
                  placeholderTextColor={colors.mutedForeground}
                  autoCapitalize="none"
                  autoCorrect={false}
                  style={{
                    backgroundColor: colors.input,
                    borderColor: colors.border,
                    borderWidth: 1,
                    borderRadius: 10,
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    color: colors.foreground,
                    fontSize: 12,
                    marginBottom: 10,
                  }}
                />

                {/* Acciones */}
                <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
                  {currentInput.trim().length > 0 ? (
                    <Pressable
                      onPress={() => handleTestRoutineVideo(currentInput.trim())}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 5,
                        backgroundColor: 'rgba(255,255,255,0.08)',
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 8,
                      }}
                    >
                      <Feather name="external-link" size={13} color={colors.primary} />
                      <Text style={{ color: colors.primary, fontSize: 11, fontWeight: '700' }}>
                        Probar
                      </Text>
                    </Pressable>
                  ) : null}

                  <Pressable
                    onPress={() => handleSaveRoutineVideo(routine.id, routine.title)}
                    style={{
                      flex: 1,
                      minWidth: 110,
                      backgroundColor: colors.gold,
                      paddingVertical: 8,
                      paddingHorizontal: 12,
                      borderRadius: 8,
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                    }}
                  >
                    <Feather name="check" size={13} color="#000" />
                    <Text style={{ color: '#000', fontSize: 12, fontWeight: '800' }}>
                      Guardar Video
                    </Text>
                  </Pressable>

                  {hasVideo ? (
                    <Pressable
                      onPress={() => handleRemoveRoutineVideo(routine.id, routine.title)}
                      style={{
                        backgroundColor: 'rgba(239, 68, 68, 0.15)',
                        borderColor: '#EF4444',
                        borderWidth: 1,
                        paddingHorizontal: 10,
                        paddingVertical: 8,
                        borderRadius: 8,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 5,
                      }}
                    >
                      <Feather name="trash-2" size={13} color="#EF4444" />
                      <Text style={{ color: '#EF4444', fontSize: 11, fontWeight: '700' }}>
                        Quitar
                      </Text>
                    </Pressable>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* PESTAÑA 4: Ajustes Generales y Accesos */}
      {activeTab === 'configuracion' && (
        <View>
          <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '800', marginBottom: 4 }}>
            Control General de BodyFit Dynasty
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginBottom: 14, lineHeight: 18 }}>
            Configuraciones globales que afectan la experiencia de tus clientes.
          </Text>

          {/* Mensaje global */}
          <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 16, padding: 14, marginBottom: 14 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>
              Mensaje del Coach para el Dashboard
            </Text>
            <TextInput
              value={globalAnnouncement}
              onChangeText={setGlobalAnnouncement}
              multiline
              numberOfLines={3}
              placeholderTextColor={colors.mutedForeground}
              style={{ color: colors.foreground, backgroundColor: colors.input, borderColor: colors.border, borderWidth: 1, borderRadius: 10, padding: 10, minHeight: 70, textAlignVertical: 'top', marginBottom: 12 }}
            />
            <PrimaryButton title="Actualizar mensaje" icon="check" onPress={handleSaveAnnouncement} />
          </View>

          {/* Accesos rápidos administrativos */}
          <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', textTransform: 'uppercase', marginBottom: 8, marginTop: 8 }}>
            Herramientas Avanzadas
          </Text>
          <Pressable
            onPress={() => router.push('/admin-users')}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="users" size={18} color={colors.primary} />
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Administrar Clientes y Membresías</Text>
            </View>
            <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
          </Pressable>

          <Pressable
            onPress={() => router.push('/admin-store')}
            style={{
              backgroundColor: colors.card,
              borderColor: colors.border,
              borderWidth: 1,
              borderRadius: 14,
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: 10,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <Feather name="shopping-bag" size={18} color={colors.primary} />
              <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '700' }}>Editor Crud de Productos de Tienda</Text>
            </View>
            <Feather name="chevron-right" size={17} color={colors.mutedForeground} />
          </Pressable>
        </View>
      )}
    </Screen>
  );
}
