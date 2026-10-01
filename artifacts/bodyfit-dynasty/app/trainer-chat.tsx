import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Screen, TopBar, styles as bfStyles } from '@/components/bodyfit';
import {
  DESIGNATED_TRAINERS,
  QUICK_PROMPTS,
  TRAINER_DISCLAIMER,
  generateTrainerResponse,
  type ChatMessage,
  type Trainer,
} from '@/constants/trainersCatalog';
import { MEMBERSHIP_CONFIG, hasTierAccess } from '@/constants/membershipConfig';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

export default function TrainerChatScreen() {
  const colors = useColors();
  const { membership, profile, isOwner, designatedTrainers, isAdminModeActive } = useBodyFit();
  const isGolden = membership === 'golden' || (isAdminModeActive && isOwner);

  const trainersList = designatedTrainers && designatedTrainers.length > 0 ? designatedTrainers : DESIGNATED_TRAINERS;
  const [activeTrainerId, setActiveTrainerId] = useState<string>(trainersList[0]?.id || 'coach-esteban');
  const activeTrainer = trainersList.find((t) => t.id === activeTrainerId) || trainersList[0];

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [loadingHistory, setLoadingHistory] = useState(true);

  const flatListRef = useRef<FlatList>(null);

  // Clave de almacenamiento por entrenador
  const storageKey = `@bodyfit_trainer_chat_${activeTrainer.id}`;

  // Cargar historial de chat persistente
  useEffect(() => {
    let isMounted = true;
    const loadChat = async () => {
      setLoadingHistory(true);
      try {
        const stored = await AsyncStorage.getItem(storageKey);
        if (stored) {
          const parsed = JSON.parse(stored);
          if (isMounted) setMessages(parsed);
        } else {
          // Mensaje de bienvenida inicial del entrenador
          const welcomeMsg: ChatMessage = {
            id: `init-${Date.now()}`,
            sender: 'trainer',
            trainerId: activeTrainer.id,
            text: `¡Hola ${profile?.displayName || 'Atleta'}! Soy ${activeTrainer.name}, tu ${activeTrainer.title}. Estoy disponible 24/7 para apoyarte con tu técnica, rutinas personalizadas, distribución de cargas y cualquier duda sobre tu progreso. ¿En qué podemos mejorar hoy?`,
            timestamp: Date.now(),
          };
          if (isMounted) setMessages([welcomeMsg]);
          await AsyncStorage.setItem(storageKey, JSON.stringify([welcomeMsg]));
        }
      } catch (e) {
        console.error('Error cargando historial de chat', e);
      } finally {
        if (isMounted) setLoadingHistory(false);
      }
    };

    if (isGolden) {
      loadChat();
    } else {
      setLoadingHistory(false);
    }

    return () => {
      isMounted = false;
    };
  }, [activeTrainer.id, isGolden, profile?.displayName, storageKey]);

  // Guardar mensajes cuando cambian
  const saveMessages = async (newMessages: ChatMessage[]) => {
    try {
      await AsyncStorage.setItem(storageKey, JSON.stringify(newMessages));
    } catch (e) {
      console.error('Error guardando mensajes', e);
    }
  };

  const handleSendMessage = (textToSend?: string) => {
    const content = (textToSend || inputText).trim();
    if (!content) return;

    const userMessage: ChatMessage = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      sender: 'user',
      text: content,
      timestamp: Date.now(),
    };

    const updated = [...messages, userMessage];
    setMessages(updated);
    setInputText('');
    saveMessages(updated);

    // Simular que el entrenador está escribiendo
    setIsTyping(true);
    setTimeout(() => {
      const responseText = generateTrainerResponse(content, activeTrainer, profile?.displayName);
      const trainerReply: ChatMessage = {
        id: `reply-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        sender: 'trainer',
        trainerId: activeTrainer.id,
        text: responseText,
        timestamp: Date.now(),
      };
      const finalUpdated = [...updated, trainerReply];
      setMessages(finalUpdated);
      setIsTyping(false);
      saveMessages(finalUpdated);

      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 1200);
  };

  const handleClearHistory = () => {
    Alert.alert(
      'Vaciar Conversación',
      `¿Deseas borrar el historial de chat con ${activeTrainer.name}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Vaciar',
          style: 'destructive',
          onPress: async () => {
            const welcomeMsg: ChatMessage = {
              id: `init-${Date.now()}`,
              sender: 'trainer',
              trainerId: activeTrainer.id,
              text: `Historial reiniciado. Hola de nuevo ${profile?.displayName || ''}, ¿en qué puedo ayudarte hoy?`,
              timestamp: Date.now(),
            };
            setMessages([welcomeMsg]);
            await AsyncStorage.setItem(storageKey, JSON.stringify([welcomeMsg]));
          },
        },
      ]
    );
  };

  return (
    <Screen>
      <TopBar
        title="Atención 24/7 Golden"
        subtitle="Coaches Oficiales de la Dinastía"
        onPress={() => router.back()}
      />

      {/* Botón de Gestión para el Dueño (Solo en Modo Administrador Activo) */}
      {isAdminModeActive && (
        <Pressable
          onPress={() => router.push('/admin-trainers' as never)}
          style={({ pressed }) => [
            {
              backgroundColor: '#1E1428',
              borderColor: colors.gold,
              borderWidth: 1.5,
              borderRadius: 14,
              paddingVertical: 10,
              paddingHorizontal: 14,
              marginBottom: 12,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              opacity: pressed ? 0.8 : 1,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 9 }}>
            <Feather name="settings" size={16} color={colors.gold} />
            <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '800' }}>
              PANEL DE DUEÑO: Gestionar Nombres y Fotos de Entrenadores
            </Text>
          </View>
          <Feather name="chevron-right" size={16} color={colors.gold} />
        </Pressable>
      )}

      {!isGolden ? (
        /* VISTA BLOQUEADA PARA USUARIOS STANDARD, BRONZE O PLATINUM */
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
        >
          {/* Tarjeta de Candado VIP */}
          <View
            style={{
              backgroundColor: '#1E1428',
              borderRadius: 22,
              padding: 24,
              borderWidth: 1.5,
              borderColor: colors.gold,
              alignItems: 'center',
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 64,
                height: 64,
                borderRadius: 32,
                backgroundColor: `${colors.gold}25`,
                borderWidth: 1.5,
                borderColor: colors.gold,
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: 16,
              }}
            >
              <Feather name="lock" size={28} color={colors.gold} />
            </View>

            <View
              style={{
                backgroundColor: `${colors.gold}20`,
                paddingHorizontal: 12,
                paddingVertical: 5,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: `${colors.gold}60`,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  color: colors.gold,
                  fontSize: 11,
                  fontWeight: '800',
                  letterSpacing: 1.2,
                }}
              >
                EXCLUSIVO GOLDEN VIP
              </Text>
            </View>

            <Text
              style={{
                color: '#FFFFFF',
                fontSize: 20,
                fontWeight: '800',
                textAlign: 'center',
                marginBottom: 8,
              }}
            >
              Atención 24/7 con Entrenadores Designados
            </Text>

            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: 13,
                lineHeight: 20,
                textAlign: 'center',
                marginBottom: 20,
              }}
            >
              Los miembros Golden VIP disfrutan de un canal directo y continuo con el Head Coach
              Esteban y el equipo élite de preparadores físicos de BodyFit Dynasty ®. Resuelve dudas
              de técnica, rutinas, periodización y sobrecarga en tiempo real.
            </Text>

            <Pressable
              onPress={() => router.push('/plans')}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.gold,
                  paddingVertical: 14,
                  paddingHorizontal: 28,
                  borderRadius: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  opacity: pressed ? 0.85 : 1,
                  width: '100%',
                  justifyContent: 'center',
                },
              ]}
            >
              <Feather name="zap" size={18} color="#0B0710" />
              <Text style={{ color: '#0B0710', fontSize: 14, fontWeight: '800' }}>
                Mejorar a Golden VIP (${MEMBERSHIP_CONFIG.golden.priceUsd.toFixed(2)}/mes)
              </Text>
            </Pressable>
          </View>

          {/* Directorio de Entrenadores Designados */}
          <Text
            style={{
              color: colors.gold,
              fontSize: 12,
              fontWeight: '800',
              textTransform: 'uppercase',
              letterSpacing: 1,
              marginBottom: 12,
            }}
          >
            Conoce a tu Equipo de Entrenadores
          </Text>

          <View style={{ gap: 14 }}>
            {trainersList.map((trainer) => (
              <View
                key={trainer.id}
                style={{
                  backgroundColor: colors.card,
                  borderRadius: 18,
                  padding: 16,
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                <View style={{ flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                  <Image
                    source={{ uri: trainer.avatarUrl }}
                    style={{ width: 56, height: 56, borderRadius: 28, borderWidth: 1.5, borderColor: colors.gold }}
                    contentFit="cover"
                  />
                  <View style={{ flex: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                      <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800' }}>
                        {trainer.name}
                      </Text>
                      <Feather name="check-circle" size={14} color={colors.gold} />
                    </View>
                    <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '700', marginTop: 1 }}>
                      {trainer.title}
                    </Text>
                    <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
                      {trainer.role}
                    </Text>
                  </View>
                </View>

                <Text style={{ color: '#D5C8DF', fontSize: 11.5, lineHeight: 17, marginTop: 12 }}>
                  {trainer.bio}
                </Text>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                  {trainer.specialties.map((spec, sIdx) => (
                    <View
                      key={sIdx}
                      style={{
                        backgroundColor: `${colors.primary}18`,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 6,
                        borderWidth: 1,
                        borderColor: `${colors.primary}40`,
                      }}
                    >
                      <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '600' }}>
                        {spec}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        /* VISTA ACTIVA DEL CHAT 24/7 PARA GOLDEN VIP */
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
          style={{ flex: 1 }}
        >
          {/* Selector Horizontal de Entrenador */}
          <View style={{ marginBottom: 10 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 8 }}>
              {trainersList.map((trainer) => {
                const isSelected = activeTrainer.id === trainer.id;
                return (
                  <Pressable
                    key={trainer.id}
                    onPress={() => setActiveTrainerId(trainer.id)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      backgroundColor: isSelected ? '#251A36' : colors.card,
                      paddingVertical: 7,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      borderWidth: 1.5,
                      borderColor: isSelected ? colors.gold : colors.border,
                    }}
                  >
                    <Image
                      source={{ uri: trainer.avatarUrl }}
                      style={{ width: 28, height: 28, borderRadius: 14 }}
                      contentFit="cover"
                    />
                    <View>
                      <Text
                        style={{
                          color: isSelected ? '#FFFFFF' : colors.mutedForeground,
                          fontSize: 12,
                          fontWeight: '700',
                        }}
                      >
                        {trainer.name}
                      </Text>
                      <Text style={{ color: colors.gold, fontSize: 9.5 }}>{trainer.statusText}</Text>
                    </View>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>

          {/* Tarjeta de Encabezado del Entrenador Activo */}
          <View
            style={{
              backgroundColor: '#160F22',
              borderRadius: 16,
              padding: 12,
              borderWidth: 1,
              borderColor: `${colors.gold}50`,
              marginBottom: 10,
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <Image
                source={{ uri: activeTrainer.avatarUrl }}
                style={{ width: 40, height: 40, borderRadius: 20, borderWidth: 1, borderColor: colors.gold }}
                contentFit="cover"
              />
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <Text style={{ color: '#FFFFFF', fontSize: 13, fontWeight: '800' }}>
                    {activeTrainer.name}
                  </Text>
                  <View style={{ backgroundColor: `${colors.gold}25`, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                    <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>GOLDEN VIP</Text>
                  </View>
                </View>
                <Text style={{ color: colors.mutedForeground, fontSize: 10.5 }} numberOfLines={1}>
                  {activeTrainer.title} · Respuesta: {activeTrainer.responseTime}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={handleClearHistory}
              style={{
                padding: 6,
                borderRadius: 8,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
              }}
            >
              <Feather name="trash-2" size={14} color={colors.mutedForeground} />
            </Pressable>
          </View>

          {/* Disclaimer Médico Oficial */}
          <View
            style={{
              backgroundColor: 'rgba(229, 169, 60, 0.08)',
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 8,
              borderLeftWidth: 3,
              borderLeftColor: colors.gold,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: '#D5C8DF', fontSize: 9.5, lineHeight: 13 }}>
              ⚖️ {TRAINER_DISCLAIMER}
            </Text>
          </View>

          {/* Lista de Mensajes */}
          {loadingHistory ? (
            <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
              <ActivityIndicator color={colors.gold} />
            </View>
          ) : (
            <FlatList
              ref={flatListRef}
              data={messages}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 8, gap: 10 }}
              renderItem={({ item }) => {
                const isUser = item.sender === 'user';
                return (
                  <View
                    style={{
                      alignSelf: isUser ? 'flex-end' : 'flex-start',
                      maxWidth: '85%',
                      backgroundColor: isUser ? '#581C87' : '#1F152D',
                      paddingHorizontal: 14,
                      paddingVertical: 10,
                      borderRadius: 16,
                      borderBottomRightRadius: isUser ? 2 : 16,
                      borderBottomLeftRadius: isUser ? 16 : 2,
                      borderWidth: 1,
                      borderColor: isUser ? '#7E22CE' : `${colors.gold}40`,
                    }}
                  >
                    {!isUser && (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800' }}>
                          {activeTrainer.name}
                        </Text>
                        <Text style={{ color: colors.mutedForeground, fontSize: 9 }}>
                          {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </Text>
                      </View>
                    )}
                    <Text style={{ color: '#FFFFFF', fontSize: 13, lineHeight: 18 }}>
                      {item.text}
                    </Text>
                    {isUser && (
                      <Text style={{ color: '#E9D5FF', fontSize: 8.5, textAlign: 'right', marginTop: 4 }}>
                        {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </Text>
                    )}
                  </View>
                );
              }}
              ListFooterComponent={
                isTyping ? (
                  <View
                    style={{
                      alignSelf: 'flex-start',
                      backgroundColor: '#1F152D',
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: `${colors.gold}40`,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                      marginTop: 4,
                    }}
                  >
                    <ActivityIndicator size="small" color={colors.gold} />
                    <Text style={{ color: colors.gold, fontSize: 11, fontStyle: 'italic' }}>
                      {activeTrainer.name} está respondiendo...
                    </Text>
                  </View>
                ) : null
              }
            />
          )}

          {/* Chips de Preguntas Frecuentes / Rápidas */}
          <View style={{ marginVertical: 8 }}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              {QUICK_PROMPTS.map((prompt, pIdx) => (
                <Pressable
                  key={pIdx}
                  onPress={() => handleSendMessage(prompt)}
                  style={{
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: 'rgba(255, 255, 255, 0.1)',
                  }}
                >
                  <Text style={{ color: '#D5C8DF', fontSize: 11 }}>💬 {prompt}</Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>

          {/* Barra de Entrada de Mensaje */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#160F20',
              borderRadius: 16,
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderWidth: 1.5,
              borderColor: colors.gold,
              gap: 8,
            }}
          >
            <TextInput
              value={inputText}
              onChangeText={setInputText}
              placeholder={`Pregunta a ${activeTrainer.name}...`}
              placeholderTextColor={colors.mutedForeground}
              style={{
                flex: 1,
                color: '#FFFFFF',
                fontSize: 13,
                maxHeight: 80,
                paddingVertical: 6,
              }}
              multiline
            />
            <Pressable
              onPress={() => handleSendMessage()}
              disabled={!inputText.trim()}
              style={({ pressed }) => [
                {
                  width: 36,
                  height: 36,
                  borderRadius: 18,
                  backgroundColor: inputText.trim() ? colors.gold : 'rgba(229, 169, 60, 0.2)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: pressed ? 0.8 : 1,
                },
              ]}
            >
              <Feather
                name="send"
                size={16}
                color={inputText.trim() ? '#0B0710' : colors.mutedForeground}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      )}
    </Screen>
  );
}
