import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Linking, Platform, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import {
  customFetch,
  useCreateCommunityPost,
  useCreateCommunityPostComment,
  useListCommunityPostComments,
  useListCommunityPosts,
  useToggleCommunityPostLike,
  type CommunityPost,
} from '@workspace/api-client-react';
import { Screen, styles, TopBar } from '@/components/bodyfit';
import { NotificationsModal, useNotifications } from '@/components/NotificationsModal';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

type FeedFilter = 'Todos' | 'Entrenos' | 'Comidas';
const postTypes = [
  { id: 'workout', label: 'Entrenamiento', icon: 'activity' },
  { id: 'meal', label: 'Comida', icon: 'coffee' },
  { id: 'progress', label: 'Progreso', icon: 'trending-up' },
  { id: 'achievement', label: 'Logro 🏆', icon: 'award' },
  { id: 'other', label: 'Motivación', icon: 'zap' },
] as const;

function timeAgo(value: string) {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000));
  if (elapsedMinutes < 1) return 'Ahora';
  if (elapsedMinutes < 60) return `Hace ${elapsedMinutes} min`;
  if (elapsedMinutes < 1440) return `Hace ${Math.floor(elapsedMinutes / 60)} h`;
  return new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'short' }).format(new Date(value));
}

function isMediaVideo(url: string | null | undefined): boolean {
  if (!url) return false;
  return /(?:youtube\.com|youtu\.be|vimeo\.com|\.mp4|\.mov)/i.test(url);
}

function CommunityPostCard({ post }: { post: CommunityPost }) {
  const colors = useColors();
  const queryClient = useQueryClient();
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');

  // Estado local reactivo de likes para retroalimentación instantánea
  const [liked, setLiked] = useState(post.liked ?? false);
  const [likeCount, setLikeCount] = useState(post.likeCount ?? 0);

  const commentsQuery = useListCommunityPostComments(post.id, {
    query: { queryKey: ['listCommunityPostComments', post.id], enabled: showComments },
  });

  const likeMutation = useToggleCommunityPostLike({
    mutation: {
      onSuccess: (data) => {
        if (data && typeof data.liked === 'boolean') {
          setLiked(data.liked);
          setLikeCount(data.likeCount);
        }
        queryClient.invalidateQueries({ queryKey: ['listCommunityPosts'] });
      },
    },
  });

  const commentMutation = useCreateCommunityPostComment({
    mutation: {
      onSuccess: () => {
        setCommentText('');
        setError('');
        queryClient.invalidateQueries({ queryKey: ['listCommunityPostComments', post.id] });
        queryClient.invalidateQueries({ queryKey: ['listCommunityPosts'] });
      },
      onError: () => setError('No se pudo publicar el comentario.'),
    },
  });

  const handleToggleLike = () => {
    const nextLiked = !liked;
    setLiked(nextLiked);
    setLikeCount((prev) => Math.max(0, prev + (nextLiked ? 1 : -1)));
    likeMutation.mutate({ postId: post.id });
  };

  const handleSendComment = () => {
    const body = commentText.trim();
    if (!body) return;
    setError('');
    commentMutation.mutate({ postId: post.id, data: { body } });
  };

  const isVideo = isMediaVideo(post.mediaUrl);
  const postTypeInfo = postTypes.find((item) => item.id === post.postType) ?? postTypes[0];

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.card,
          borderColor: colors.border,
          padding: 0,
          overflow: 'hidden',
          marginBottom: 16,
          borderRadius: 22,
        },
      ]}
    >
      {/* Cabecera del Post (Avatar + Autor + Tipo) */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 14, justifyContent: 'space-between' }}>
        <Pressable
          onPress={() => {
            router.push({
              pathname: '/athlete-profile' as never,
              params: { userId: post.userId, username: post.username },
            });
          }}
          style={({ pressed }) => [
            { flexDirection: 'row', alignItems: 'center', flex: 1, gap: 11, opacity: pressed ? 0.75 : 1 },
          ]}
        >
          {post.avatarUrl ? (
            <Image
              source={{ uri: post.avatarUrl }}
              contentFit="cover"
              style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: colors.gold }}
            />
          ) : (
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 22,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1.5,
                borderColor: colors.gold,
              }}
            >
              <Feather name="user" size={18} color="#FFFFFF" />
            </View>
          )}

          <View style={{ flex: 1 }}>
            <Text style={{ color: colors.foreground, fontWeight: '800', fontSize: 14 }}>{post.displayName}</Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
              {post.username ? `@${post.username} · ` : ''}
              {timeAgo(post.createdAt)}
            </Text>
          </View>
        </Pressable>

        <View
          style={{
            backgroundColor: `${colors.primary}22`,
            paddingHorizontal: 9,
            paddingVertical: 4,
            borderRadius: 10,
            flexDirection: 'row',
            alignItems: 'center',
            gap: 4,
          }}
        >
          <Feather name={postTypeInfo.icon as keyof typeof Feather.glyphMap} size={11} color={colors.primary} />
          <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
            {postTypeInfo.label}
          </Text>
        </View>
      </View>

      {/* Imagen del Post (Feed Social de Alta Definición) */}
      {post.mediaUrl ? (
        isVideo ? (
          <Pressable
            onPress={() => Linking.openURL(post.mediaUrl!)}
            style={{
              marginHorizontal: 14,
              marginBottom: 12,
              padding: 14,
              borderRadius: 14,
              backgroundColor: colors.background,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Feather name="play-circle" size={22} color={colors.primary} />
            <Text style={{ color: colors.primary, fontSize: 13, fontWeight: '700' }}>Ver video de entrenamiento</Text>
          </Pressable>
        ) : (
          <View style={{ width: '100%', height: 260, backgroundColor: '#1A1A1A' }}>
            <Image
              source={{ uri: post.mediaUrl }}
              contentFit="cover"
              style={{ width: '100%', height: '100%' }}
              transition={200}
            />
          </View>
        )
      ) : null}

      {/* Texto de la Publicación */}
      <View style={{ paddingHorizontal: 14, paddingTop: post.mediaUrl ? 12 : 4, paddingBottom: 10 }}>
        {/* Tarjeta Visual de Logro / Medalla Legendaria Compartida */}
        {(post as any).achievementData ? (
          <View
            style={{
              backgroundColor: '#170E22',
              borderColor: (post as any).achievementData.tierColor || colors.gold,
              borderWidth: 1.5,
              borderRadius: 18,
              padding: 14,
              marginBottom: 12,
              shadowColor: colors.gold,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.15,
              shadowRadius: 6,
            }}
          >
            {/* Header del Logro */}
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ position: 'relative' }}>
                <Image
                  source={{ uri: (post as any).achievementData.legendAvatar }}
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    borderWidth: 2,
                    borderColor: (post as any).achievementData.tierColor || colors.gold,
                  }}
                  contentFit="cover"
                />
                <View
                  style={{
                    position: 'absolute',
                    bottom: -2,
                    right: -2,
                    backgroundColor: colors.gold,
                    width: 18,
                    height: 18,
                    borderRadius: 9,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1.5,
                    borderColor: '#170E22',
                  }}
                >
                  <Feather name="award" size={10} color="#000000" />
                </View>
              </View>

              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                  <View
                    style={{
                      backgroundColor: `${(post as any).achievementData.tierColor || colors.gold}25`,
                      paddingHorizontal: 8,
                      paddingVertical: 2,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: (post as any).achievementData.tierColor || colors.gold,
                        fontSize: 9.5,
                        fontWeight: '800',
                        letterSpacing: 0.5,
                      }}
                    >
                      TIER {String((post as any).achievementData.tier || 'ORO').toUpperCase()} · +{(post as any).achievementData.points || 500} PTS
                    </Text>
                  </View>
                </View>

                <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '800', marginTop: 3 }}>
                  {(post as any).achievementData.title}
                </Text>
                <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '600' }}>
                  Entregada por {(post as any).achievementData.legend}
                </Text>
              </View>
            </View>

            {/* Cita motivacional de la leyenda */}
            {(post as any).achievementData.quote ? (
              <View
                style={{
                  backgroundColor: '#100918',
                  borderRadius: 12,
                  padding: 10,
                  marginTop: 10,
                  borderLeftWidth: 3,
                  borderLeftColor: (post as any).achievementData.tierColor || colors.gold,
                }}
              >
                <Text style={{ color: '#E8DDF0', fontSize: 11.5, fontStyle: 'italic', lineHeight: 16 }}>
                  "{(post as any).achievementData.quote}"
                </Text>
              </View>
            ) : null}
          </View>
        ) : null}

        {(post as any).workoutSummary ? (
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              backgroundColor: '#191122',
              borderColor: `${colors.gold}50`,
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 4.5,
              borderRadius: 8,
              alignSelf: 'flex-start',
              marginBottom: 8,
            }}
          >
            <Text style={{ fontSize: 12 }}>🏋️</Text>
            <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '700' }}>
              {(post as any).workoutSummary}
            </Text>
          </View>
        ) : null}
        <Text style={{ color: colors.foreground, fontSize: 13.5, lineHeight: 21 }}>{post.caption}</Text>
      </View>

      {/* Barra de Interacción (Like + Comentarios) */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 14,
          paddingVertical: 12,
          gap: 22,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={liked ? 'Quitar me gusta' : 'Me gusta'}
          onPress={handleToggleLike}
          hitSlop={8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <Feather
            name="heart"
            size={21}
            color={liked ? colors.destructive : colors.mutedForeground}
            style={{ transform: [{ scale: liked ? 1.08 : 1 }] }}
          />
          <Text style={{ color: liked ? colors.destructive : colors.mutedForeground, fontSize: 13, fontWeight: '700' }}>
            {likeCount}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setShowComments((value) => !value)}
          hitSlop={8}
          style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}
        >
          <Feather name="message-circle" size={20} color={colors.mutedForeground} />
          <Text style={{ color: colors.mutedForeground, fontSize: 13, fontWeight: '600' }}>
            {post.commentCount} {post.commentCount === 1 ? 'comentario' : 'comentarios'}
          </Text>
        </Pressable>
      </View>

      {/* Sección Desplegable de Comentarios */}
      {showComments ? (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14, borderTopWidth: 1, borderTopColor: colors.border, backgroundColor: `${colors.background}60` }}>
          {commentsQuery.isLoading ? (
            <Text style={{ color: colors.mutedForeground, fontSize: 11, paddingVertical: 10 }}>Cargando comentarios…</Text>
          ) : commentsQuery.data?.comments && commentsQuery.data.comments.length > 0 ? (
            commentsQuery.data.comments.map((item) => (
              <View key={item.id} style={{ paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: `${colors.border}80` }}>
                <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>
                  {item.displayName}
                  {item.username ? ` · @${item.username}` : ''}
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 12.5, lineHeight: 18, marginTop: 2 }}>
                  {item.body}
                </Text>
              </View>
            ))
          ) : (
            <Text style={{ color: colors.mutedForeground, fontSize: 11, paddingVertical: 10 }}>Sé el primero en comentar.</Text>
          )}

          {/* Caja para escribir comentario */}
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginTop: 10 }}>
            <TextInput
              value={commentText}
              onChangeText={setCommentText}
              maxLength={1000}
              placeholder="Escribe un comentario..."
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel="Comentario"
              style={{
                flex: 1,
                color: colors.foreground,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 12,
                paddingHorizontal: 12,
                paddingVertical: 9,
                fontSize: 12.5,
              }}
            />
            <Pressable
              accessibilityLabel="Enviar comentario"
              disabled={!commentText.trim() || commentMutation.isPending}
              onPress={handleSendComment}
              style={{
                backgroundColor: colors.primary,
                padding: 10,
                borderRadius: 12,
                opacity: !commentText.trim() || commentMutation.isPending ? 0.45 : 1,
              }}
            >
              <Feather name="send" size={15} color={colors.primaryForeground} />
            </Pressable>
          </View>
          {error ? <Text style={{ color: colors.destructive, fontSize: 11, marginTop: 6 }}>{error}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const fallbackCommunityPosts: CommunityPost[] = [
  {
    id: 'post-demo-medal-1',
    userId: 'user_jesusdavid',
    postType: 'achievement' as any,
    caption: '¡Nueva medalla oficial de la dinastía desbloqueada! La disciplina diaria y el esfuerzo constante dan sus frutos. Sigamos construyendo grandeza en BodyFit Dynasty 🏆⚡',
    mediaUrl: null,
    achievementData: {
      medalId: 'jesus_david_discipline',
      legend: 'Jesús David',
      legendAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=300&auto=format&fit=crop&q=80',
      title: 'Constancia & Superación',
      quote: 'No se trata de motivación pasajera, sino de disciplina inquebrantable cada día.',
      tier: 'Diamante',
      tierColor: '#38BDF8',
      points: 2000,
    } as any,
    username: 'jesus_david',
    displayName: 'Jesús David',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200',
    likeCount: 95,
    commentCount: 18,
    liked: true,
    createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
  } as any,
  {
    id: 'post-demo-1',
    userId: 'user_valeria',
    postType: 'workout',
    caption: '¡Día de pierna superado! Nueva marca personal en sentadilla libre profunda (4x8 con 80kg). La disciplina y la técnica estricta no se negocian 💪🔥',
    mediaUrl: 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=800&auto=format&fit=crop&q=80',
    username: 'valeria_fit',
    displayName: 'Valeria Montero',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    likeCount: 25,
    commentCount: 4,
    liked: false,
    createdAt: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-demo-2',
    userId: 'user_carlos',
    postType: 'meal',
    caption: 'Almuerzo post-entreno listo: 150g de salmón salvaje al horno con arroz integral y brócoli al vapor. Cumpliendo los macros del plan 🥗🥑',
    mediaUrl: 'https://images.unsplash.com/photo-1467003909585-2f8a72700288?w=800&auto=format&fit=crop&q=80',
    username: 'carlos_dynasty',
    displayName: 'Carlos Mora',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    likeCount: 42,
    commentCount: 6,
    liked: true,
    createdAt: new Date(Date.now() - 120 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-demo-camila',
    userId: 'user_camila',
    postType: 'meal',
    caption: 'Preparando mi smoothie de proteína y frutos rojos post-cardio matutino 🍓🥛 ¡Disciplina y constancia ante todo en la dinastía!',
    mediaUrl: 'https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=800&auto=format&fit=crop&q=80',
    username: 'camila_cordero',
    displayName: 'Camila Cordero',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    likeCount: 38,
    commentCount: 5,
    liked: false,
    createdAt: new Date(Date.now() - 240 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-demo-3',
    userId: 'dev_user_bodyfit',
    postType: 'progress',
    caption: '¡Bienvenidos a la comunidad oficial de BodyFit Dynasty! Aquí compartimos nuestros entrenos, comidas saludables y motivación diaria. ¡A romperla equipo!',
    mediaUrl: 'https://images.unsplash.com/photo-1517838277536-f5f99be501cd?w=800&auto=format&fit=crop&q=80',
    username: 'esteban_coach',
    displayName: 'Esteban Entrenador',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    likeCount: 68,
    commentCount: 15,
    liked: true,
    createdAt: new Date(Date.now() - 360 * 60 * 1000).toISOString(),
  },
  {
    id: 'post-demo-4',
    userId: 'user_sofi',
    postType: 'workout',
    caption: 'Rutina de Hombro y Tríceps completada en 42 minutos. Sentir el progreso semana a semana no tiene precio ⚡️',
    mediaUrl: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=800&auto=format&fit=crop&q=80',
    username: 'sofi_cross',
    displayName: 'Sofía Navarro',
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200',
    likeCount: 19,
    commentCount: 3,
    liked: false,
    createdAt: new Date(Date.now() - 720 * 60 * 1000).toISOString(),
  },
];

const recommendedAthletes = [
  {
    userId: 'user_cbum',
    username: 'cbum',
    displayName: 'Chris Bumstead',
    role: '5x Classic Olympia',
    avatarUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=500&auto=format&fit=crop&q=80',
  },
  {
    userId: 'user_camila',
    username: 'camila_cordero',
    displayName: 'Camila Cordero',
    role: 'Atleta Fitness BFD',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    userId: 'user_jesusdavid',
    username: 'jesus_david',
    displayName: 'Jesús David',
    role: 'Atleta Dynasty',
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=500&auto=format&fit=crop&q=80',
  },
  {
    userId: 'user_valeria',
    username: 'valeria_fit',
    displayName: 'Valeria Montero',
    role: 'Atleta Bikini BFD',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=500&auto=format&fit=crop&q=80',
  },
  {
    userId: 'user_carlos',
    username: 'carlos_dynasty',
    displayName: 'Carlos Mora',
    role: 'Powerbuilding Pro',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=500&auto=format&fit=crop&q=80',
  },
];

export default function CommunityScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { profile } = useBodyFit();
  const { notifications, unreadCount } = useNotifications();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const queryClient = useQueryClient();
  const postsQuery = useListCommunityPosts({ query: { queryKey: ['listCommunityPosts'] } });
  const createMutation = useCreateCommunityPost();
  const [filter, setFilter] = useState<FeedFilter>('Todos');
  const [composerOpen, setComposerOpen] = useState(false);
  const [caption, setCaption] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [postType, setPostType] = useState<(typeof postTypes)[number]['id']>('workout');
  const [error, setError] = useState('');
  const [localPosts, setLocalPosts] = useState<CommunityPost[]>([]);

  // Pestaña social dual: "Para ti" vs "Siguiendo"
  const [socialTab, setSocialTab] = useState<'forYou' | 'following'>('forYou');
  const [followingIds, setFollowingIds] = useState<string[]>(['user_valeria', 'user_carlos']);

  // Adjuntar resumen de entrenamiento al crear publicación
  const [workoutSummary, setWorkoutSummary] = useState<string | null>(null);
  const [workoutPickerOpen, setWorkoutPickerOpen] = useState(false);
  const [customWorkoutInput, setCustomWorkoutInput] = useState('');

  const refreshFollowing = async () => {
    try {
      const res = await customFetch<{ following: string[] }>('/api/social/following');
      if (res && Array.isArray(res.following)) {
        setFollowingIds(res.following);
      }
    } catch {}
  };

  React.useEffect(() => {
    refreshFollowing();
  }, []);

  const handleFollowRecommendation = async (targetUserId: string) => {
    try {
      const res = await customFetch<{ isFollowing: boolean }>(
        `/api/social/follow/${encodeURIComponent(targetUserId)}`,
        { method: 'POST' }
      );
      if (res) {
        if (res.isFollowing) {
          setFollowingIds((prev) => [...prev, targetUserId]);
        } else {
          setFollowingIds((prev) => prev.filter((id) => id !== targetUserId));
        }
        queryClient.invalidateQueries({ queryKey: ['listCommunityPosts'] });
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el seguimiento.');
    }
  };

  // Retos Semanales de la Comunidad
  const [challenges, setChallenges] = useState<any[]>([
    {
      id: 'challenge-week-1',
      title: 'Semana Legendaria: 5 Sesiones de Fuerza',
      badge: '🔥 RETO OFICIAL DYNASTY',
      description: 'Supera el umbral junto a la dinastía. Completa y registra al menos 5 entrenamientos esta semana.',
      category: 'strength',
      targetCount: 5,
      targetUnit: 'sesiones',
      rewardPoints: 500,
      rewardMedal: 'Disciplina de Hierro 🛡️',
      daysRemaining: 4,
      participantsCount: 1284,
      isJoined: true,
      userProgress: 3,
    },
    {
      id: 'challenge-week-2',
      title: 'Dynasty Cardio Burn: 70,000 Pasos',
      badge: '⚡ RETO DE RESISTENCIA',
      description: 'Activa tu gasto calórico diario. Alcanza 70,000 pasos acumulados de lunes a domingo.',
      category: 'steps',
      targetCount: 70000,
      targetUnit: 'pasos',
      rewardPoints: 400,
      rewardMedal: 'Caminante Dorado 👟',
      daysRemaining: 5,
      participantsCount: 896,
      isJoined: false,
      userProgress: 42500,
    },
  ]);
  const [activeChallengeIdx, setActiveChallengeIdx] = useState(0);
  const [joiningChallengeId, setJoiningChallengeId] = useState<string | null>(null);

  const refreshChallenges = async () => {
    try {
      const res = await customFetch<{ challenges: any[] }>('/api/community/challenges');
      if (res && Array.isArray(res.challenges) && res.challenges.length > 0) {
        setChallenges(res.challenges);
      }
    } catch {}
  };

  React.useEffect(() => {
    refreshChallenges();
  }, []);

  const handleJoinChallenge = async (challengeId: string) => {
    try {
      setJoiningChallengeId(challengeId);
      setChallenges((prev) =>
        prev.map((c) =>
          c.id === challengeId
            ? { ...c, isJoined: true, participantsCount: c.participantsCount + 1 }
            : c
        )
      );
      await customFetch(`/api/community/challenges/${encodeURIComponent(challengeId)}/join`, {
        method: 'POST',
      });
      Alert.alert(
        '¡Inscrito al Reto Semanal! 🔥',
        'Has aceptado el desafío de la dinastía. Registra tus progresos para reclamar puntos y gloria.'
      );
    } catch {
      Alert.alert('Error', 'No se pudo inscribir en el reto.');
    } finally {
      setJoiningChallengeId(null);
    }
  };

  // Búsqueda de atletas por @username o nombre en vivo
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async (text: string) => {
    setSearchQuery(text);
    const query = text.trim();
    if (!query) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }
    try {
      setIsSearching(true);
      const res = await customFetch<{ athletes: any[] }>(`/api/social/search?q=${encodeURIComponent(query)}`);
      if (res && res.athletes) {
        setSearchResults(res.athletes);
      }
    } catch {
      // Silencioso
    } finally {
      setIsSearching(false);
    }
  };

  const handleToggleFollowInSearch = async (athlete: any) => {
    try {
      const res = await customFetch<{ isFollowing: boolean; followersCount: number }>(
        `/api/social/follow/${encodeURIComponent(athlete.userId)}`,
        { method: 'POST' }
      );
      if (res) {
        setSearchResults((prev) =>
          prev.map((a) =>
            a.userId === athlete.userId
              ? { ...a, isFollowing: res.isFollowing, followersCount: res.followersCount }
              : a
          )
        );
        refreshFollowing();
      }
    } catch {
      Alert.alert('Error', 'No se pudo actualizar el seguimiento.');
    }
  };

  const rawPosts = postsQuery.data?.posts && postsQuery.data.posts.length > 0 ? postsQuery.data.posts : fallbackCommunityPosts;
  const allPosts = [...localPosts, ...rawPosts.filter((p) => !localPosts.some((lp) => lp.id === p.id))];

  const posts = allPosts.filter((post) => {
    if (socialTab === 'following') {
      const isMine = post.userId === profile?.userId || post.userId === 'dev_user_bodyfit';
      const isFollowed = followingIds.includes(post.userId);
      if (!isMine && !isFollowed) return false;
    }
    if (filter === 'Entrenos') return post.postType === 'workout' || post.postType === 'routine';
    if (filter === 'Comidas') return post.postType === 'meal' || post.postType === 'recipe';
    return true;
  });

  const handleTakePhoto = async () => {
    try {
      const perm = await ImagePicker.requestCameraPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso necesario', 'Permite el acceso a la cámara para tomar fotos de tu entrenamiento o comida.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara.');
    }
  };

  const handlePickFromGallery = async () => {
    try {
      const perm = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert('Permiso necesario', 'Permite el acceso a tu galería de fotos.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        quality: 0.8,
        allowsEditing: true,
      });
      if (!result.canceled && result.assets[0]?.uri) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  const publish = () => {
    const text = caption.trim();
    if (!text && !selectedImage) return setError('Escribe algo o agrega una foto antes de publicar.');
    setError('');

    const finalMedia = selectedImage || null;
    const newPost: CommunityPost = {
      id: `local-${Date.now()}`,
      userId: profile?.userId || 'dev_user_bodyfit',
      postType,
      caption: text,
      mediaUrl: finalMedia,
      workoutSummary,
      username: profile?.username || 'esteban_coach',
      displayName: profile?.displayName || 'Esteban Entrenador',
      avatarUrl: profile?.avatarUrl || null,
      likeCount: 0,
      commentCount: 0,
      liked: false,
      createdAt: new Date().toISOString(),
    } as any;

    setLocalPosts((prev) => [newPost, ...prev]);
    setCaption('');
    setSelectedImage(null);
    setWorkoutSummary(null);
    setComposerOpen(false);

    createMutation.mutate(
      { data: { postType, caption: text, mediaUrl: finalMedia, workoutSummary } as any },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ['listCommunityPosts'] });
        },
      },
    );
  };

  return (
    <Screen scroll={false}>
      <TopBar
        title="Comunidad"
        subtitle="Feed social oficial de atletas BodyFit"
        onPress={() => setNotificationsOpen(true)}
        notificationCount={unreadCount}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={postsQuery.isRefetching} onRefresh={() => postsQuery.refetch()} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: Platform.OS === 'web' ? 40 : Math.max(insets.bottom + 120, 150) }}
      >
        {/* Barra de Búsqueda Elegante de Atletas */}
        <View style={{ marginBottom: 14 }}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#160F22',
              borderColor: searchQuery ? colors.gold : `${colors.gold}40`,
              borderWidth: 1.2,
              borderRadius: 16,
              paddingHorizontal: 12,
              height: 46,
            }}
          >
            <Feather name="search" size={17} color={searchQuery ? colors.gold : colors.mutedForeground} />
            <TextInput
              value={searchQuery}
              onChangeText={handleSearch}
              placeholder="Buscar atletas por @usuario o nombre..."
              placeholderTextColor={colors.mutedForeground}
              style={{
                flex: 1,
                color: colors.foreground,
                fontSize: 13,
                paddingHorizontal: 10,
              }}
            />
            {searchQuery ? (
              <Pressable
                onPress={() => {
                  setSearchQuery('');
                  setSearchResults([]);
                }}
                hitSlop={10}
              >
                <Feather name="x-circle" size={16} color={colors.mutedForeground} />
              </Pressable>
            ) : null}
          </View>

          {/* Despliegue de Resultados en Vivo */}
          {searchQuery ? (
            <View
              style={{
                backgroundColor: '#191126',
                borderColor: `${colors.gold}60`,
                borderWidth: 1.2,
                borderRadius: 16,
                marginTop: 8,
                padding: 12,
              }}
            >
              {isSearching ? (
                <View style={{ paddingVertical: 12, alignItems: 'center' }}>
                  <ActivityIndicator color={colors.gold} size="small" />
                  <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 6 }}>
                    Buscando atletas en la dinastía...
                  </Text>
                </View>
              ) : searchResults.length > 0 ? (
                <View style={{ gap: 8 }}>
                  <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 1, marginBottom: 2 }}>
                    ATLETAS ENCONTRADOS ({searchResults.length})
                  </Text>
                  {searchResults.map((athlete) => (
                    <View
                      key={athlete.userId}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        paddingVertical: 8,
                        borderBottomWidth: 1,
                        borderBottomColor: `${colors.border}60`,
                      }}
                    >
                      <Pressable
                        onPress={() => {
                          router.push({
                            pathname: '/athlete-profile' as never,
                            params: { userId: athlete.userId, username: athlete.username },
                          });
                        }}
                        style={({ pressed }) => [
                          { flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1, opacity: pressed ? 0.75 : 1 },
                        ]}
                      >
                        <Image
                          source={{ uri: athlete.avatarUrl }}
                          style={{ width: 42, height: 42, borderRadius: 21, borderWidth: 1.5, borderColor: colors.gold }}
                          contentFit="cover"
                        />
                        <View style={{ flex: 1 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                            <Text numberOfLines={1} style={{ color: colors.foreground, fontSize: 13, fontWeight: '800' }}>
                              {athlete.displayName}
                            </Text>
                            <View style={{ backgroundColor: `${colors.gold}20`, paddingHorizontal: 5, paddingVertical: 1, borderRadius: 4 }}>
                              <Text style={{ color: colors.gold, fontSize: 9, fontWeight: '800' }}>{athlete.fitnessLevel}</Text>
                            </View>
                          </View>
                          <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 1 }}>
                            @{athlete.username} · {athlete.followersCount} seguidores
                          </Text>
                        </View>
                      </Pressable>

                      {!athlete.isSelf ? (
                        <Pressable
                          onPress={() => handleToggleFollowInSearch(athlete)}
                          style={({ pressed }) => [
                            {
                              backgroundColor: athlete.isFollowing ? colors.card : colors.gold,
                              borderColor: athlete.isFollowing ? colors.border : colors.gold,
                              borderWidth: 1.2,
                              borderRadius: 10,
                              paddingHorizontal: 12,
                              paddingVertical: 6,
                              opacity: pressed ? 0.75 : 1,
                            },
                          ]}
                        >
                          <Text
                            style={{
                              color: athlete.isFollowing ? colors.foreground : '#000',
                              fontSize: 11,
                              fontWeight: '800',
                            }}
                          >
                            {athlete.isFollowing ? 'Siguiendo' : 'Seguir'}
                          </Text>
                        </Pressable>
                      ) : null}
                    </View>
                  ))}
                </View>
              ) : (
                <Text style={{ color: colors.mutedForeground, fontSize: 12, textAlign: 'center', paddingVertical: 8 }}>
                  No se encontraron atletas con "@{searchQuery}".
                </Text>
              )}
            </View>
          ) : null}
        </View>

        {/* Sugerencia de Reto Oficial Dynasty */}
        {challenges.length > 0 ? (() => {
          const currentChallenge = challenges[activeChallengeIdx] || challenges[0];
          const pct = Math.min(100, Math.round((currentChallenge.userProgress / currentChallenge.targetCount) * 100));
          const isDone = currentChallenge.userProgress >= currentChallenge.targetCount;

          return (
            <View
              style={{
                backgroundColor: '#150E20',
                borderColor: `${colors.gold}50`,
                borderWidth: 1.2,
                borderRadius: 18,
                padding: 14,
                marginBottom: 14,
              }}
            >
              {/* Header Sugerencia Reto Oficial */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                <View
                  style={{
                    backgroundColor: `${colors.gold}20`,
                    borderColor: `${colors.gold}50`,
                    borderWidth: 1,
                    paddingHorizontal: 8,
                    paddingVertical: 2.5,
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 5,
                  }}
                >
                  <Text style={{ fontSize: 10 }}>💡</Text>
                  <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 0.8 }}>
                    SUGERENCIA · RETO OFICIAL DYNASTY
                  </Text>
                </View>

                {challenges.length > 1 ? (
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    {challenges.map((_, idx) => (
                      <Pressable
                        key={idx}
                        onPress={() => setActiveChallengeIdx(idx)}
                        style={{
                          width: activeChallengeIdx === idx ? 16 : 5,
                          height: 5,
                          borderRadius: 2.5,
                          backgroundColor: activeChallengeIdx === idx ? colors.gold : `${colors.gold}40`,
                        }}
                      />
                    ))}
                  </View>
                ) : null}
              </View>

              {/* Título y Descripción del Reto */}
              <Text style={{ color: colors.foreground, fontSize: 14.5, fontWeight: '800' }}>
                {currentChallenge.title}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 11.5, marginTop: 2, lineHeight: 16 }}>
                {currentChallenge.description}
              </Text>

              {/* Fila de Métricas / Recompensas */}
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8, flexWrap: 'wrap' }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="users" size={11} color={colors.gold} />
                  <Text style={{ color: colors.mutedForeground, fontSize: 10.5 }}>
                    <Text style={{ color: colors.foreground, fontWeight: '700' }}>{currentChallenge.participantsCount.toLocaleString()}</Text> atletas
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="award" size={11} color={colors.gold} />
                  <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '700' }}>
                    +{currentChallenge.rewardPoints} PTS & {currentChallenge.rewardMedal}
                  </Text>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                  <Feather name="clock" size={11} color={colors.mutedForeground} />
                  <Text style={{ color: colors.mutedForeground, fontSize: 10.5 }}>
                    {currentChallenge.daysRemaining} días restantes
                  </Text>
                </View>
              </View>

              {/* Barra de Progreso si está unido */}
              {currentChallenge.isJoined ? (
                <View style={{ marginTop: 10 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ color: colors.mutedForeground, fontSize: 10.5, fontWeight: '600' }}>
                      Tu progreso: <Text style={{ color: colors.gold, fontWeight: '800' }}>{currentChallenge.userProgress} / {currentChallenge.targetCount} {currentChallenge.targetUnit}</Text>
                    </Text>
                    <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800' }}>
                      {pct}%
                    </Text>
                  </View>
                  <View style={{ height: 6, borderRadius: 3, backgroundColor: '#261A34', overflow: 'hidden' }}>
                    <View
                      style={{
                        height: '100%',
                        width: `${pct}%`,
                        backgroundColor: colors.gold,
                        borderRadius: 3,
                      }}
                    />
                  </View>
                </View>
              ) : null}

              {/* Botón de Acción / Estado */}
              <View style={{ marginTop: 10 }}>
                {currentChallenge.isJoined ? (
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 6,
                      paddingVertical: 8,
                      borderRadius: 10,
                      backgroundColor: isDone ? `${colors.gold}25` : '#221535',
                      borderColor: isDone ? colors.gold : `${colors.gold}35`,
                      borderWidth: 1,
                    }}
                  >
                    <Feather name={isDone ? 'check-circle' : 'zap'} size={14} color={colors.gold} />
                    <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800' }}>
                      {isDone ? '¡Reto Completado! 🏆 (+500 PTS)' : 'En Progreso ⚡ · Sigamos sumando'}
                    </Text>
                  </View>
                ) : (
                  <Pressable
                    disabled={joiningChallengeId === currentChallenge.id}
                    onPress={() => handleJoinChallenge(currentChallenge.id)}
                    style={({ pressed }) => [
                      {
                        backgroundColor: colors.gold,
                        borderRadius: 10,
                        paddingVertical: 9,
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexDirection: 'row',
                        gap: 6,
                        opacity: pressed || joiningChallengeId === currentChallenge.id ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Feather name="plus-circle" size={14} color="#000000" />
                    <Text style={{ color: '#000000', fontSize: 12, fontWeight: '800' }}>
                      {joiningChallengeId === currentChallenge.id ? 'Inscribiendo…' : 'Unirme a la Sugerencia de Reto 🔥'}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          );
        })() : null}

        {/* Barra para Crear Publicación */}
        <Pressable
          onPress={() => setComposerOpen((value) => !value)}
          style={[
            styles.card,
            {
              backgroundColor: colors.card,
              borderColor: colors.border,
              marginBottom: 14,
              padding: 12,
              borderRadius: 18,
            },
          ]}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View
              style={{
                width: 38,
                height: 38,
                borderRadius: 19,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Feather name="edit-3" size={17} color="#FFFFFF" />
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 13, marginLeft: 12, flex: 1, fontWeight: '500' }}>
              {profile?.displayName ? `Comparte tu progreso hoy, ${profile.displayName.split(' ')[0]}…` : 'Comparte un avance con la comunidad…'}
            </Text>
            <Feather name={composerOpen ? 'x-circle' : 'plus-circle'} color={colors.primary} size={22} />
          </View>
        </Pressable>

        {/* Compositor Desplegable */}
        {composerOpen ? (
          <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.primary, borderWidth: 1.5, marginBottom: 16, borderRadius: 20 }]}>
            <Text style={{ color: colors.foreground, fontWeight: '800', fontSize: 15, marginBottom: 12 }}>
              Nueva Publicación
            </Text>
            <View style={{ flexDirection: 'row', gap: 7, marginBottom: 12, flexWrap: 'wrap' }}>
              {postTypes.map((item) => (
                <Pressable
                  key={item.id}
                  onPress={() => setPostType(item.id)}
                  style={{
                    borderRadius: 10,
                    paddingVertical: 7,
                    paddingHorizontal: 12,
                    backgroundColor: postType === item.id ? colors.primary : colors.background,
                    borderColor: postType === item.id ? colors.primary : colors.border,
                    borderWidth: 1,
                  }}
                >
                  <Text style={{ color: postType === item.id ? colors.primaryForeground : colors.mutedForeground, fontSize: 11, fontWeight: '700' }}>
                    {item.label}
                  </Text>
                </Pressable>
              ))}
            </View>
            <TextInput
              value={caption}
              onChangeText={setCaption}
              multiline
              maxLength={2000}
              placeholder="¿Qué entrenaste hoy o cuál fue tu comida favorita?"
              placeholderTextColor={colors.mutedForeground}
              accessibilityLabel="Texto de publicación"
              style={{
                minHeight: 85,
                color: colors.foreground,
                backgroundColor: colors.background,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 12,
                textAlignVertical: 'top',
                fontSize: 13,
              }}
            />
            {/* Selector de Foto: Cámara o Galería */}
            <View style={{ marginTop: 12 }}>
              {selectedImage ? (
                <View style={{ borderRadius: 16, overflow: 'hidden', borderWidth: 1, borderColor: colors.border, position: 'relative' }}>
                  <Image source={{ uri: selectedImage }} style={{ width: '100%', height: 200 }} contentFit="cover" />
                  <Pressable
                    onPress={() => setSelectedImage(null)}
                    hitSlop={8}
                    style={{
                      position: 'absolute',
                      top: 10,
                      right: 10,
                      backgroundColor: 'rgba(0,0,0,0.75)',
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 10,
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 5,
                    }}
                  >
                    <Feather name="trash-2" size={13} color="#EF4444" />
                    <Text style={{ color: '#FFFFFF', fontSize: 11, fontWeight: '700' }}>Quitar foto</Text>
                  </Pressable>
                </View>
              ) : (
                <View style={{ flexDirection: 'row', gap: 10 }}>
                  <Pressable
                    onPress={handleTakePhoto}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        backgroundColor: `${colors.primary}18`,
                        borderColor: `${colors.primary}50`,
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingVertical: 11,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Feather name="camera" size={16} color={colors.primary} />
                    <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Tomar foto</Text>
                  </Pressable>

                  <Pressable
                    onPress={handlePickFromGallery}
                    style={({ pressed }) => [
                      {
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        backgroundColor: '#1E1428',
                        borderColor: `${colors.gold}50`,
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingVertical: 11,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Feather name="image" size={16} color={colors.gold} />
                    <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }}>Elegir de galería</Text>
                  </Pressable>
                </View>
              )}
            </View>

            {/* Sección: Adjuntar Resumen de Entrenamiento */}
            <View style={{ marginTop: 12 }}>
              {workoutSummary ? (
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    backgroundColor: '#1E1428',
                    borderColor: colors.gold,
                    borderWidth: 1.2,
                    borderRadius: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 9,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 7, flex: 1 }}>
                    <Text style={{ fontSize: 14 }}>🏋️</Text>
                    <Text numberOfLines={1} style={{ color: colors.gold, fontSize: 12.5, fontWeight: '800' }}>
                      {workoutSummary}
                    </Text>
                  </View>
                  <Pressable onPress={() => setWorkoutSummary(null)} hitSlop={10}>
                    <Feather name="x-circle" size={16} color={colors.mutedForeground} />
                  </Pressable>
                </View>
              ) : (
                <View>
                  <Pressable
                    onPress={() => setWorkoutPickerOpen((v) => !v)}
                    style={({ pressed }) => [
                      {
                        flexDirection: 'row',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: 8,
                        backgroundColor: '#1A1224',
                        borderColor: `${colors.gold}50`,
                        borderWidth: 1,
                        borderRadius: 12,
                        paddingVertical: 10,
                        opacity: pressed ? 0.75 : 1,
                      },
                    ]}
                  >
                    <Feather name="activity" size={15} color={colors.gold} />
                    <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '700' }}>
                      {workoutPickerOpen ? 'Cerrar selector de entreno' : '🏋️ Adjuntar Entrenamiento'}
                    </Text>
                  </Pressable>

                  {workoutPickerOpen ? (
                    <View
                      style={{
                        backgroundColor: '#150E20',
                        borderColor: `${colors.gold}40`,
                        borderWidth: 1,
                        borderRadius: 14,
                        padding: 12,
                        marginTop: 8,
                        gap: 8,
                      }}
                    >
                      <Text style={{ color: colors.foreground, fontSize: 11.5, fontWeight: '800' }}>
                        Selecciona o escribe el resumen:
                      </Text>

                      {/* Botón rápido: Cargar entreno de hoy */}
                      <Pressable
                        onPress={() => {
                          setWorkoutSummary('Entreno Dynasty de Hoy · 50 min');
                          setWorkoutPickerOpen(false);
                        }}
                        style={{
                          backgroundColor: `${colors.gold}20`,
                          borderColor: colors.gold,
                          borderWidth: 1,
                          borderRadius: 10,
                          padding: 8,
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 6,
                        }}
                      >
                        <Feather name="zap" size={13} color={colors.gold} />
                        <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '800' }}>
                          ⚡ Cargar entreno de hoy (Entreno Dynasty · 50 min)
                        </Text>
                      </Pressable>

                      {/* Presets rápidos */}
                      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                        {[
                          'Pierna & Glúteos · 50 min',
                          'Pecho & Tríceps · 45 min',
                          'Espalda & Bíceps · 45 min',
                          'Hombro & Core · 35 min',
                        ].map((preset) => (
                          <Pressable
                            key={preset}
                            onPress={() => {
                              setWorkoutSummary(preset);
                              setWorkoutPickerOpen(false);
                            }}
                            style={{
                              backgroundColor: colors.background,
                              borderColor: colors.border,
                              borderWidth: 1,
                              borderRadius: 8,
                              paddingHorizontal: 9,
                              paddingVertical: 5,
                            }}
                          >
                            <Text style={{ color: colors.foreground, fontSize: 10.5, fontWeight: '600' }}>
                              {preset}
                            </Text>
                          </Pressable>
                        ))}
                      </View>

                      {/* Campo manual */}
                      <View style={{ flexDirection: 'row', gap: 6, marginTop: 4 }}>
                        <TextInput
                          value={customWorkoutInput}
                          onChangeText={setCustomWorkoutInput}
                          placeholder="O escribe (ej: Cuádriceps · 40 min)"
                          placeholderTextColor={colors.mutedForeground}
                          style={{
                            flex: 1,
                            backgroundColor: colors.background,
                            borderColor: colors.border,
                            borderWidth: 1,
                            borderRadius: 8,
                            paddingHorizontal: 10,
                            paddingVertical: 6,
                            fontSize: 11.5,
                            color: colors.foreground,
                          }}
                        />
                        <Pressable
                          disabled={!customWorkoutInput.trim()}
                          onPress={() => {
                            if (customWorkoutInput.trim()) {
                              setWorkoutSummary(customWorkoutInput.trim());
                              setCustomWorkoutInput('');
                              setWorkoutPickerOpen(false);
                            }
                          }}
                          style={{
                            backgroundColor: colors.primary,
                            borderRadius: 8,
                            paddingHorizontal: 12,
                            justifyContent: 'center',
                            opacity: !customWorkoutInput.trim() ? 0.4 : 1,
                          }}
                        >
                          <Text style={{ color: colors.primaryForeground, fontSize: 11, fontWeight: '800' }}>
                            Agregar
                          </Text>
                        </Pressable>
                      </View>
                    </View>
                  ) : null}
                </View>
              )}
            </View>
            {error ? <Text style={{ color: colors.destructive, fontSize: 11, marginTop: 8 }}>{error}</Text> : null}
            <Pressable
              onPress={publish}
              disabled={createMutation.isPending}
              style={{
                marginTop: 12,
                minHeight: 44,
                borderRadius: 12,
                backgroundColor: colors.primary,
                alignItems: 'center',
                justifyContent: 'center',
                opacity: createMutation.isPending ? 0.55 : 1,
              }}
            >
              <Text style={{ color: colors.primaryForeground, fontWeight: '800', fontSize: 13 }}>
                {createMutation.isPending ? 'Publicando…' : 'Publicar en Feed'}
              </Text>
            </Pressable>
          </View>
        ) : null}

        {/* Pestañas Superiores de Feed: [Para ti | Siguiendo] */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#140D1E',
            borderColor: `${colors.gold}45`,
            borderWidth: 1.2,
            borderRadius: 14,
            padding: 4,
            marginBottom: 14,
          }}
        >
          <Pressable
            onPress={() => setSocialTab('forYou')}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: socialTab === 'forYou' ? colors.gold : 'transparent',
            }}
          >
            <Text
              style={{
                color: socialTab === 'forYou' ? '#000000' : colors.mutedForeground,
                fontWeight: '800',
                fontSize: 13,
                letterSpacing: 0.3,
              }}
            >
              Para ti
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setSocialTab('following')}
            style={{
              flex: 1,
              paddingVertical: 10,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 10,
              backgroundColor: socialTab === 'following' ? colors.gold : 'transparent',
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Text
                style={{
                  color: socialTab === 'following' ? '#000000' : colors.mutedForeground,
                  fontWeight: '800',
                  fontSize: 13,
                  letterSpacing: 0.3,
                }}
              >
                Siguiendo
              </Text>
              {followingIds.length > 0 ? (
                <View
                  style={{
                    backgroundColor: socialTab === 'following' ? '#00000025' : `${colors.gold}25`,
                    paddingHorizontal: 6,
                    paddingVertical: 1,
                    borderRadius: 8,
                  }}
                >
                  <Text
                    style={{
                      color: socialTab === 'following' ? '#000000' : colors.gold,
                      fontSize: 10,
                      fontWeight: '800',
                    }}
                  >
                    {followingIds.length}
                  </Text>
                </View>
              ) : null}
            </View>
          </Pressable>
        </View>

        {/* Filtros de Categoría */}
        <View style={{ flexDirection: 'row', gap: 8, marginBottom: 16 }}>
          {(['Todos', 'Entrenos', 'Comidas'] as const).map((item) => (
            <Pressable
              key={item}
              accessibilityRole="button"
              accessibilityState={{ selected: filter === item }}
              onPress={() => setFilter(item)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 14,
                backgroundColor: filter === item ? colors.primary : colors.card,
                borderWidth: 1,
                borderColor: filter === item ? colors.primary : colors.border,
              }}
            >
              <Text style={{ color: filter === item ? colors.primaryForeground : colors.mutedForeground, fontSize: 12, fontWeight: '700' }}>
                {item}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Lista de Publicaciones */}
        {posts.length === 0 ? (
          socialTab === 'following' ? (
            <View
              style={[
                styles.card,
                {
                  backgroundColor: '#160E22',
                  borderColor: `${colors.gold}50`,
                  borderWidth: 1.5,
                  borderRadius: 22,
                  padding: 18,
                  marginBottom: 20,
                },
              ]}
            >
              <View style={{ alignItems: 'center', marginBottom: 14 }}>
                <View
                  style={{
                    width: 52,
                    height: 52,
                    borderRadius: 26,
                    backgroundColor: `${colors.gold}20`,
                    borderWidth: 1.5,
                    borderColor: colors.gold,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 10,
                  }}
                >
                  <Feather name="users" size={24} color={colors.gold} />
                </View>
                <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '800', textAlign: 'center' }}>
                  Descubre Atletas de la Dinastía
                </Text>
                <Text
                  style={{
                    color: colors.mutedForeground,
                    fontSize: 12.5,
                    textAlign: 'center',
                    marginTop: 6,
                    lineHeight: 18,
                    paddingHorizontal: 10,
                  }}
                >
                  Aún no sigues a atletas con publicaciones activas. Sigue a leyendas y coaches para activar tu feed personal.
                </Text>
              </View>

              {/* Lista de sugerencias */}
              <View style={{ gap: 10 }}>
                {recommendedAthletes.map((athlete) => (
                  <View
                    key={athlete.userId}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      backgroundColor: '#1E142B',
                      borderColor: `${colors.gold}30`,
                      borderWidth: 1,
                      borderRadius: 14,
                      padding: 10,
                    }}
                  >
                    <Pressable
                      onPress={() => {
                        router.push({
                          pathname: '/athlete-profile' as never,
                          params: { userId: athlete.userId, username: athlete.username },
                        });
                      }}
                      style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}
                    >
                      <Image
                        source={{ uri: athlete.avatarUrl }}
                        style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: colors.gold }}
                        contentFit="cover"
                      />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '800' }}>
                          {athlete.displayName}
                        </Text>
                        <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '600' }}>
                          @{athlete.username} · {athlete.role}
                        </Text>
                      </View>
                    </Pressable>

                    <Pressable
                      onPress={() => handleFollowRecommendation(athlete.userId)}
                      style={({ pressed }) => [
                        {
                          backgroundColor: followingIds.includes(athlete.userId) ? colors.card : colors.gold,
                          borderColor: colors.gold,
                          borderWidth: 1,
                          paddingHorizontal: 12,
                          paddingVertical: 7,
                          borderRadius: 10,
                          opacity: pressed ? 0.75 : 1,
                        },
                      ]}
                    >
                      <Text
                        style={{
                          color: followingIds.includes(athlete.userId) ? colors.foreground : '#000000',
                          fontSize: 11,
                          fontWeight: '800',
                        }}
                      >
                        {followingIds.includes(athlete.userId) ? 'Siguiendo' : 'Seguir'}
                      </Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          ) : (
            <View style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, alignItems: 'center', paddingVertical: 32 }]}>
              <Feather name="users" size={31} color={colors.mutedForeground} />
              <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 13 }}>
                {filter === 'Todos' ? 'Aún no hay publicaciones' : 'No hay publicaciones en esta categoría'}
              </Text>
              <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 5, textAlign: 'center' }}>
                Sé la primera persona en compartir un avance.
              </Text>
            </View>
          )
        ) : (
          posts.map((post) => <CommunityPostCard key={post.id} post={post} />)
        )}
      </ScrollView>

      <NotificationsModal visible={notificationsOpen} onClose={() => setNotificationsOpen(false)} />
    </Screen>
  );
}