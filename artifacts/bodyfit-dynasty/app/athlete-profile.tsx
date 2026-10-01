import { Feather, Ionicons } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { customFetch } from '@workspace/api-client-react';
import { Screen, styles } from '@/components/bodyfit';
import { useColors } from '@/hooks/useColors';
import {
  DYNASTY_MEDALS_CATALOG,
  type DynastyMedal,
  TIER_CONFIG,
} from '@/constants/medalsCatalog';

interface AthleteProfileResponse {
  userId: string;
  username: string;
  displayName: string;
  avatarUrl: string;
  bio: string;
  heightCm: string;
  weightKg: string;
  fitnessLevel: string;
  membershipTier: string;
  followersCount: number;
  followingCount: number;
  postsCount: number;
  isFollowing: boolean;
  isSelf: boolean;
  medals: Array<{
    id: string;
    legend: string;
    title: string;
    tier: string;
    tierColor: string;
    points: number;
    icon: string;
  }>;
  posts: Array<{
    id: string;
    postType: string;
    caption: string;
    mediaUrl?: string;
    likeCount: number;
    commentCount: number;
    liked?: boolean;
    createdAt: string;
  }>;
}

function formatSocialCount(count: number): string {
  if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(1)}M`;
  if (count >= 1_000) return `${(count / 1_000).toFixed(1)}k`;
  return String(count);
}

function timeAgo(value: string) {
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - new Date(value).getTime()) / 60_000));
  if (elapsedMinutes < 1) return 'Ahora';
  if (elapsedMinutes < 60) return `Hace ${elapsedMinutes} min`;
  if (elapsedMinutes < 1440) return `Hace ${Math.floor(elapsedMinutes / 60)} h`;
  return new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'short' }).format(new Date(value));
}

export default function AthleteProfileScreen() {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const params = useLocalSearchParams<{ userId?: string; username?: string }>();
  const targetIdOrUsername = params.userId || params.username || 'user_cbum';

  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState<AthleteProfileResponse | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followLoading, setFollowLoading] = useState(false);
  const [selectedMedal, setSelectedMedal] = useState<DynastyMedal | null>(null);

  // Cargar información del perfil de atleta
  useEffect(() => {
    let isMounted = true;
    async function fetchAthlete() {
      try {
        setLoading(true);
        const res = await customFetch<AthleteProfileResponse>(`/api/social/profile/${encodeURIComponent(targetIdOrUsername)}`);
        if (isMounted && res) {
          setProfile(res);
          setIsFollowing(res.isFollowing);
          setFollowersCount(res.followersCount);
        }
      } catch (err) {
        console.error('Error fetching athlete profile:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    fetchAthlete();
    return () => {
      isMounted = false;
    };
  }, [targetIdOrUsername]);

  const handleToggleFollow = async () => {
    if (!profile) return;
    try {
      setFollowLoading(true);
      const nextFollow = !isFollowing;
      setIsFollowing(nextFollow);
      setFollowersCount((prev) => Math.max(0, prev + (nextFollow ? 1 : -1)));

      const res = await customFetch<{ success: boolean; isFollowing: boolean; followersCount: number }>(
        `/api/social/follow/${encodeURIComponent(profile.userId)}`,
        { method: 'POST' }
      );

      if (res) {
        setIsFollowing(res.isFollowing);
        setFollowersCount(res.followersCount);
      }
    } catch {
      // Revertir en error
      setIsFollowing(!isFollowing);
      setFollowersCount((prev) => Math.max(0, prev + (isFollowing ? 1 : -1)));
      Alert.alert('Error', 'No se pudo actualizar el seguimiento. Intenta de nuevo.');
    } finally {
      setFollowLoading(false);
    }
  };

  const handleOpenMedal = (medalId: string) => {
    const fullMedal = DYNASTY_MEDALS_CATALOG.find((m) => m.id === medalId);
    if (fullMedal) {
      setSelectedMedal(fullMedal);
    }
  };

  if (loading) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.gold} size="large" />
          <Text style={{ color: colors.mutedForeground, marginTop: 14, fontSize: 13 }}>
            Cargando perfil del atleta...
          </Text>
        </View>
      </Screen>
    );
  }

  if (!profile) {
    return (
      <Screen>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Feather name="alert-circle" size={48} color={colors.destructive} />
          <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '700', marginTop: 16 }}>
            Atleta no encontrado
          </Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 13, textAlign: 'center', marginTop: 8 }}>
            No pudimos localizar la información de este perfil.
          </Text>
          <Pressable
            onPress={() => router.back()}
            style={{
              marginTop: 20,
              backgroundColor: colors.card,
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.border,
            }}
          >
            <Text style={{ color: colors.foreground, fontWeight: '700' }}>Volver atrás</Text>
          </Pressable>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      {/* Barra Superior con botón de retroceso */}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: 16,
          paddingTop: Math.max(insets.top, 10),
        }}
      >
        <Pressable
          testID="button-back-athlete"
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="arrow-left" size={20} color={colors.foreground} />
        </Pressable>

        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: colors.gold, fontSize: 10, fontWeight: '800', letterSpacing: 1.5 }}>
            PERFIL DE ATLETA
          </Text>
          <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '700' }}>
            @{profile.username}
          </Text>
        </View>

        <Pressable
          onPress={() => Alert.alert('Compartir Perfil', `Enlace de atleta: bodyfit.app/@${profile.username}`)}
          style={({ pressed }) => [
            styles.iconButton,
            { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <Feather name="share-2" size={18} color={colors.foreground} />
        </Pressable>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Cabecera del Atleta (Avatar + Nombres + Tier) */}
        <View style={{ alignItems: 'center', marginBottom: 18 }}>
          <View style={{ position: 'relative' }}>
            <Image
              source={{ uri: profile.avatarUrl }}
              style={{
                width: 96,
                height: 96,
                borderRadius: 48,
                borderWidth: 2.5,
                borderColor: colors.gold,
              }}
              contentFit="cover"
            />
            {profile.membershipTier === 'platinum' ? (
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  backgroundColor: '#E5A93C',
                  paddingHorizontal: 7,
                  paddingVertical: 2,
                  borderRadius: 10,
                  borderWidth: 2,
                  borderColor: '#0B0710',
                }}
              >
                <Text style={{ color: '#000', fontSize: 9, fontWeight: '900' }}>VIP</Text>
              </View>
            ) : null}
          </View>

          <Text style={{ color: colors.foreground, fontSize: 22, fontWeight: '800', marginTop: 12 }}>
            {profile.displayName}
          </Text>
          <Text style={{ color: colors.gold, fontSize: 13, fontWeight: '600', marginTop: 2 }}>
            @{profile.username}
          </Text>

          {profile.bio ? (
            <Text
              style={{
                color: colors.mutedForeground,
                fontSize: 13,
                textAlign: 'center',
                marginTop: 8,
                paddingHorizontal: 20,
                lineHeight: 19,
                fontStyle: 'italic',
              }}
            >
              "{profile.bio}"
            </Text>
          ) : null}
        </View>

        {/* Trío de Biometría Compacta (Altura, Peso, Nivel) */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: colors.card,
            borderColor: colors.border,
            borderWidth: 1,
            borderRadius: 16,
            paddingVertical: 12,
            paddingHorizontal: 8,
            marginBottom: 16,
          }}
        >
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '600' }}>ALTURA</Text>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '800', marginTop: 2 }}>
              {profile.heightCm} <Text style={{ fontSize: 11, fontWeight: '600', color: colors.gold }}>cm</Text>
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: colors.border }} />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '600' }}>PESO</Text>
            <Text style={{ color: colors.foreground, fontSize: 16, fontWeight: '800', marginTop: 2 }}>
              {profile.weightKg} <Text style={{ fontSize: 11, fontWeight: '600', color: colors.gold }}>kg</Text>
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: colors.border }} />

          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '600' }}>NIVEL</Text>
            <Text
              numberOfLines={1}
              style={{ color: colors.gold, fontSize: 14, fontWeight: '800', marginTop: 2, paddingHorizontal: 4 }}
            >
              {profile.fitnessLevel}
            </Text>
          </View>
        </View>

        {/* Contadores Sociales (Seguidores, Siguiendo, Publicaciones) */}
        <View
          style={{
            flexDirection: 'row',
            backgroundColor: '#161020',
            borderColor: `${colors.gold}40`,
            borderWidth: 1,
            borderRadius: 16,
            paddingVertical: 14,
            marginBottom: 16,
            justifyContent: 'space-around',
          }}
        >
          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800' }}>
              {formatSocialCount(followersCount)}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2, fontWeight: '600' }}>
              Seguidores
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: `${colors.gold}30` }} />

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800' }}>
              {formatSocialCount(profile.followingCount)}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2, fontWeight: '600' }}>
              Siguiendo
            </Text>
          </View>

          <View style={{ width: 1, backgroundColor: `${colors.gold}30` }} />

          <View style={{ alignItems: 'center' }}>
            <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800' }}>
              {profile.postsCount || profile.posts.length}
            </Text>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2, fontWeight: '600' }}>
              Entrenos
            </Text>
          </View>
        </View>

        {/* Botón de Acción Social (Seguir / Siguiendo o Editar si es propio) */}
        <View style={{ marginBottom: 22 }}>
          {profile.isSelf ? (
            <Pressable
              onPress={() => router.push('/profile-edit' as never)}
              style={({ pressed }) => [
                {
                  backgroundColor: colors.card,
                  borderColor: colors.gold,
                  borderWidth: 1.2,
                  borderRadius: 14,
                  paddingVertical: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                  opacity: pressed ? 0.75 : 1,
                },
              ]}
            >
              <Feather name="edit-2" size={16} color={colors.gold} />
              <Text style={{ color: colors.foreground, fontWeight: '800', fontSize: 14 }}>
                Editar Mi Perfil
              </Text>
            </Pressable>
          ) : (
            <Pressable
              onPress={handleToggleFollow}
              disabled={followLoading}
              style={({ pressed }) => [
                {
                  backgroundColor: isFollowing ? colors.card : colors.gold,
                  borderColor: isFollowing ? colors.border : colors.gold,
                  borderWidth: 1.5,
                  borderRadius: 14,
                  paddingVertical: 13,
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexDirection: 'row',
                  gap: 8,
                  opacity: pressed || followLoading ? 0.75 : 1,
                  shadowColor: isFollowing ? 'transparent' : colors.gold,
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 8,
                },
              ]}
            >
              {followLoading ? (
                <ActivityIndicator color={isFollowing ? colors.foreground : '#000'} size="small" />
              ) : isFollowing ? (
                <>
                  <Feather name="check" size={17} color={colors.gold} />
                  <Text style={{ color: colors.foreground, fontWeight: '800', fontSize: 14 }}>
                    Siguiendo
                  </Text>
                </>
              ) : (
                <>
                  <Feather name="user-plus" size={17} color="#000000" />
                  <Text style={{ color: '#000000', fontWeight: '900', fontSize: 14 }}>
                    Seguir Atleta
                  </Text>
                </>
              )}
            </Pressable>
          )}
        </View>

        {/* Vitrina de Medallas de Leyendas (Arnold, CBUM, David Laid) */}
        <View style={{ marginBottom: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
              <Ionicons name="medal" size={16} color={colors.gold} />
              <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800' }}>
                Vitrina de Medallas Dynasty
              </Text>
            </View>
            <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>
              {profile.medals?.length ?? 0} desbloqueadas
            </Text>
          </View>

          {profile.medals && profile.medals.length > 0 ? (
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 10 }}>
              {profile.medals.map((medal) => (
                <Pressable
                  key={medal.id}
                  onPress={() => handleOpenMedal(medal.id)}
                  style={({ pressed }) => [
                    {
                      backgroundColor: colors.card,
                      borderColor: `${medal.tierColor}60`,
                      borderWidth: 1.2,
                      borderRadius: 14,
                      padding: 12,
                      width: 148,
                      alignItems: 'center',
                      opacity: pressed ? 0.75 : 1,
                    },
                  ]}
                >
                  <View
                    style={{
                      width: 38,
                      height: 38,
                      borderRadius: 19,
                      backgroundColor: `${medal.tierColor}20`,
                      borderWidth: 1.5,
                      borderColor: medal.tierColor,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Feather name={(medal.icon as keyof typeof Feather.glyphMap) || 'award'} size={18} color={medal.tierColor} />
                  </View>
                  <Text numberOfLines={1} style={{ color: colors.foreground, fontSize: 12, fontWeight: '700', textAlign: 'center' }}>
                    {medal.title}
                  </Text>
                  <Text numberOfLines={1} style={{ color: colors.gold, fontSize: 10, fontWeight: '600', marginTop: 2 }}>
                    {medal.legend}
                  </Text>
                  <View
                    style={{
                      backgroundColor: `${medal.tierColor}25`,
                      paddingHorizontal: 6,
                      paddingVertical: 1,
                      borderRadius: 6,
                      marginTop: 6,
                    }}
                  >
                    <Text style={{ color: medal.tierColor, fontSize: 9, fontWeight: '800' }}>{medal.tier}</Text>
                  </View>
                </Pressable>
              ))}
            </ScrollView>
          ) : (
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 14,
                padding: 14,
                alignItems: 'center',
              }}
            >
              <Text style={{ color: colors.mutedForeground, fontSize: 12 }}>
                Este atleta está en camino de desbloquear sus primeras medallas.
              </Text>
            </View>
          )}
        </View>

        {/* Publicaciones del Atleta */}
        <View>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 12 }}>
            <Feather name="grid" size={16} color={colors.gold} />
            <Text style={{ color: colors.foreground, fontSize: 15, fontWeight: '800' }}>
              Publicaciones y Entrenos
            </Text>
          </View>

          {profile.posts && profile.posts.length > 0 ? (
            profile.posts.map((post) => (
              <View
                key={post.id}
                style={[
                  styles.card,
                  {
                    backgroundColor: colors.card,
                    borderColor: colors.border,
                    borderRadius: 18,
                    padding: 14,
                    marginBottom: 14,
                  },
                ]}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                    <View
                      style={{
                        backgroundColor: `${colors.primary}22`,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 6,
                      }}
                    >
                      <Text style={{ color: colors.primary, fontSize: 10, fontWeight: '800', textTransform: 'uppercase' }}>
                        {post.postType}
                      </Text>
                    </View>
                  </View>
                  <Text style={{ color: colors.mutedForeground, fontSize: 11 }}>
                    {timeAgo(post.createdAt)}
                  </Text>
                </View>

                <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 19, marginBottom: 10 }}>
                  {post.caption}
                </Text>

                {post.mediaUrl ? (
                  <Image
                    source={{ uri: post.mediaUrl }}
                    style={{ width: '100%', height: 210, borderRadius: 12, marginBottom: 10 }}
                    contentFit="cover"
                  />
                ) : null}

                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 16 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Ionicons name="flame" size={16} color="#FF5500" />
                    <Text style={{ color: colors.mutedForeground, fontSize: 12, fontWeight: '700' }}>
                      {post.likeCount}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5 }}>
                    <Feather name="message-square" size={14} color={colors.mutedForeground} />
                    <Text style={{ color: colors.mutedForeground, fontSize: 12, fontWeight: '700' }}>
                      {post.commentCount}
                    </Text>
                  </View>
                </View>
              </View>
            ))
          ) : (
            <View
              style={{
                backgroundColor: colors.card,
                borderColor: colors.border,
                borderWidth: 1,
                borderRadius: 16,
                padding: 24,
                alignItems: 'center',
              }}
            >
              <Feather name="camera" size={32} color={colors.mutedForeground} />
              <Text style={{ color: colors.mutedForeground, fontSize: 13, marginTop: 8 }}>
                Aún no ha compartido publicaciones en la comunidad.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      {/* Modal Detalle de Medalla */}
      <Modal
        visible={Boolean(selectedMedal)}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedMedal(null)}
      >
        <View style={athleteModalStyles.backdrop}>
          <View
            style={[
              athleteModalStyles.container,
              {
                backgroundColor: '#130C1E',
                borderColor: selectedMedal ? TIER_CONFIG[selectedMedal.tier].color : colors.gold,
              },
            ]}
          >
            {selectedMedal ? (
              <>
                <View style={{ alignItems: 'center', marginBottom: 14 }}>
                  <View
                    style={{
                      width: 60,
                      height: 60,
                      borderRadius: 30,
                      backgroundColor: TIER_CONFIG[selectedMedal.tier].bg,
                      borderWidth: 2,
                      borderColor: TIER_CONFIG[selectedMedal.tier].color,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <Feather
                      name={selectedMedal.icon as any}
                      size={26}
                      color={TIER_CONFIG[selectedMedal.tier].color}
                    />
                  </View>
                  <Text
                    style={{
                      color: TIER_CONFIG[selectedMedal.tier].color,
                      fontSize: 11,
                      fontWeight: '800',
                      letterSpacing: 1,
                    }}
                  >
                    MEDALLA OFICIAL {TIER_CONFIG[selectedMedal.tier].label.toUpperCase()}
                  </Text>
                  <Text style={{ color: colors.foreground, fontSize: 18, fontWeight: '800', marginTop: 4 }}>
                    {selectedMedal.title}
                  </Text>
                </View>

                <View style={{ backgroundColor: '#1C122C', padding: 12, borderRadius: 12, marginBottom: 12 }}>
                  <Text style={{ color: colors.foreground, fontStyle: 'italic', fontSize: 13, lineHeight: 18, textAlign: 'center' }}>
                    "{selectedMedal.loreQuote}"
                  </Text>
                </View>

                <Text style={{ color: colors.mutedForeground, fontSize: 12, textAlign: 'center', marginBottom: 16 }}>
                  {selectedMedal.detail}
                </Text>

                <Pressable
                  onPress={() => setSelectedMedal(null)}
                  style={{
                    backgroundColor: colors.primary,
                    paddingVertical: 11,
                    borderRadius: 12,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: '#FFFFFF', fontWeight: '800', fontSize: 13 }}>Entendido</Text>
                </Pressable>
              </>
            ) : null}
          </View>
        </View>
      </Modal>
    </Screen>
  );
}

const athleteModalStyles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.75)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  container: {
    width: '100%',
    maxWidth: 360,
    borderRadius: 22,
    borderWidth: 1.5,
    padding: 20,
  },
});
