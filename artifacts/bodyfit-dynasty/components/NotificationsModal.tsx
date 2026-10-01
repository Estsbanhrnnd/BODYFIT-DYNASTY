import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { customFetch } from '@workspace/api-client-react';
import { useColors } from '@/hooks/useColors';

export interface AppNotification {
  id: string;
  type: 'like' | 'comment' | 'reaction' | 'award' | 'follow' | 'gift_code';
  actorId?: string;
  actorName: string;
  actorUsername?: string;
  avatarUrl: string;
  actionText: string;
  detailText?: string;
  targetId?: string;
  targetPreview?: string;
  targetImage?: string;
  timeAgo: string;
  read: boolean;
  createdAt?: string;
}

function formatTimeAgo(dateString?: string): string {
  if (!dateString) return 'Reciente';
  const timestamp = new Date(dateString).getTime();
  if (isNaN(timestamp)) return 'Reciente';
  const elapsedMinutes = Math.max(0, Math.floor((Date.now() - timestamp) / 60_000));
  if (elapsedMinutes < 1) return 'Ahora';
  if (elapsedMinutes < 60) return `Hace ${elapsedMinutes} min`;
  const elapsedHours = Math.floor(elapsedMinutes / 60);
  if (elapsedHours < 24) return `Hace ${elapsedHours} h`;
  const elapsedDays = Math.floor(elapsedHours / 24);
  if (elapsedDays === 1) return 'Ayer';
  if (elapsedDays < 7) return `Hace ${elapsedDays} d`;
  return new Intl.DateTimeFormat('es-CR', { day: 'numeric', month: 'short' }).format(new Date(timestamp));
}

export const initialNotifications: AppNotification[] = [
  {
    id: 'notif-seed-1',
    type: 'comment',
    actorId: 'user_valeria',
    actorName: 'Valeria Montero',
    actorUsername: 'valeria_fit',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
    actionText: 'comentó en tu entrenamiento de hoy',
    detailText: '¡Increíble la técnica y el volumen de carga! A seguir con todo 💪🔥',
    targetId: 'post-demo-3',
    targetPreview: 'Full Body Dynasty · 60 min',
    timeAgo: 'Hace 10 min',
    read: false,
  },
  {
    id: 'notif-seed-2',
    type: 'like',
    actorId: 'user_carlos',
    actorName: 'Carlos Mora',
    actorUsername: 'carlos_dynasty',
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200',
    actionText: 'le dio me gusta a tu publicación',
    targetId: 'post-demo-3',
    targetPreview: 'Full Body Dynasty · 60 min',
    timeAgo: 'Hace 25 min',
    read: false,
  },
  {
    id: 'notif-seed-3',
    type: 'follow',
    actorId: 'user_davidlaid',
    actorName: 'David Laid',
    actorUsername: 'davidlaid',
    avatarUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=200',
    actionText: 'comenzó a seguirte en BodyFit Dynasty',
    detailText: '¡Visita su perfil para ver sus entrenos de estética y fuerza!',
    targetId: 'user_davidlaid',
    timeAgo: 'Hace 1 h',
    read: false,
  },
  {
    id: 'notif-seed-4',
    type: 'award',
    actorId: 'user_cbum',
    actorName: 'Chris Bumstead',
    actorUsername: 'cbum',
    avatarUrl: 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=200',
    actionText: 'te desbloqueó la medalla "Classic Discipline"',
    detailText: 'Has registrado tus entrenamientos con disciplina estricta de campeonato.',
    targetId: 'cbum_classic',
    timeAgo: 'Hace 3 h',
    read: true,
  },
  {
    id: 'notif-seed-5',
    type: 'gift_code',
    actorId: 'admin',
    actorName: 'BodyFit Dynasty Admin',
    actorUsername: 'admin_dynasty',
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200',
    actionText: 'te otorgó una Membresía de Regalía Platinum',
    detailText: 'Todos los beneficios y módulos avanzados han sido desbloqueados para tu cuenta.',
    targetId: 'membership',
    timeAgo: 'Hace 6 h',
    read: true,
  },
];

let globalNotifications = [...initialNotifications];
let globalUnreadCount = initialNotifications.filter((n) => !n.read).length;
const listeners = new Set<() => void>();

export async function fetchNotificationsFromApi() {
  try {
    const res = await customFetch<{
      notifications: Array<{
        id: string;
        type: 'like' | 'comment' | 'follow' | 'gift_code' | 'award' | 'reaction';
        actorId: string;
        actorName: string;
        actorUsername?: string;
        avatarUrl?: string;
        actionText: string;
        detailText?: string;
        targetId?: string;
        targetPreview?: string;
        isRead: boolean;
        createdAt: string;
      }>;
      unreadCount: number;
    }>('/api/notifications');

    if (res && Array.isArray(res.notifications)) {
      globalNotifications = res.notifications.map((item) => ({
        id: item.id,
        type: item.type,
        actorId: item.actorId,
        actorName: item.actorName,
        actorUsername: item.actorUsername,
        avatarUrl: item.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200',
        actionText: item.actionText,
        detailText: item.detailText,
        targetId: item.targetId,
        targetPreview: item.targetPreview,
        timeAgo: formatTimeAgo(item.createdAt),
        read: Boolean(item.isRead),
        createdAt: item.createdAt,
      }));
      globalUnreadCount = typeof res.unreadCount === 'number' ? res.unreadCount : globalNotifications.filter((n) => !n.read).length;
      listeners.forEach((l) => l());
    }
  } catch {
    // Si la red o backend temporalmente falla, conservar estado local
  }
}

export function useNotifications() {
  const [notifications, setNotificationsState] = useState<AppNotification[]>(globalNotifications);
  const [unreadCount, setUnreadCountState] = useState<number>(globalUnreadCount);

  useEffect(() => {
    const listener = () => {
      setNotificationsState([...globalNotifications]);
      setUnreadCountState(globalNotifications.filter((n) => !n.read).length);
    };
    listeners.add(listener);

    // Consulta inicial en vivo al servidor
    fetchNotificationsFromApi();

    // Auto-recarga periódica ligera cada 25 segundos
    const interval = setInterval(fetchNotificationsFromApi, 25_000);

    return () => {
      listeners.delete(listener);
      clearInterval(interval);
    };
  }, []);

  const markAsRead = async (id: string) => {
    globalNotifications = globalNotifications.map((n) => (n.id === id ? { ...n, read: true } : n));
    globalUnreadCount = globalNotifications.filter((n) => !n.read).length;
    listeners.forEach((l) => l());

    try {
      await customFetch(`/api/notifications/${encodeURIComponent(id)}/read`, { method: 'POST' });
    } catch {}
  };

  const markAllAsRead = async () => {
    globalNotifications = globalNotifications.map((n) => ({ ...n, read: true }));
    globalUnreadCount = 0;
    listeners.forEach((l) => l());

    try {
      await customFetch('/api/notifications/read-all', { method: 'POST' });
    } catch {}
  };

  const addNotification = (notif: AppNotification) => {
    globalNotifications = [notif, ...globalNotifications];
    globalUnreadCount = globalNotifications.filter((n) => !n.read).length;
    listeners.forEach((l) => l());
  };

  const refresh = () => fetchNotificationsFromApi();

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    addNotification,
    refresh,
  };
}

export function NotificationsModal({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const colors = useColors();
  const insets = useSafeAreaInsets();
  const { notifications, unreadCount, markAsRead, markAllAsRead, refresh } = useNotifications();
  const [filter, setFilter] = useState<'all' | 'social' | 'dynasty'>('all');

  // Refrescar al abrir el modal
  useEffect(() => {
    if (visible) {
      refresh();
    }
  }, [visible]);

  const filtered = notifications.filter((n) => {
    if (filter === 'social') {
      return n.type === 'like' || n.type === 'comment' || n.type === 'follow' || n.type === 'reaction';
    }
    if (filter === 'dynasty') {
      return n.type === 'award' || n.type === 'gift_code';
    }
    return true;
  });

  const handlePressNotification = (item: AppNotification) => {
    markAsRead(item.id);
    onClose();

    // Navegación Inteligente según la tipología del evento
    if (item.type === 'follow' && (item.actorId || item.actorUsername)) {
      router.push({
        pathname: '/athlete-profile' as never,
        params: {
          userId: item.actorId || '',
          username: item.actorUsername || '',
        } as never,
      });
    } else if (item.type === 'award') {
      router.push('/achievements' as never);
    } else if (item.type === 'gift_code') {
      router.push('/plans' as never);
    } else if (item.type === 'like' || item.type === 'comment' || item.type === 'reaction') {
      router.push('/(tabs)/community' as never);
    }
  };

  const getTypeIcon = (type: AppNotification['type']) => {
    switch (type) {
      case 'like':
        return { name: 'heart' as const, bg: colors.destructive };
      case 'reaction':
        return { name: 'zap' as const, bg: '#F59E0B' };
      case 'comment':
        return { name: 'message-circle' as const, bg: '#3B82F6' };
      case 'follow':
        return { name: 'user-plus' as const, bg: '#10B981' };
      case 'award':
        return { name: 'award' as const, bg: colors.gold };
      case 'gift_code':
        return { name: 'gift' as const, bg: '#A855F7' };
      default:
        return { name: 'bell' as const, bg: colors.primary };
    }
  };

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={modalStyles.overlay}>
        <View
          style={[
            modalStyles.sheet,
            {
              backgroundColor: '#120D1A',
              borderColor: `${colors.gold}40`,
              paddingTop: insets.top > 0 ? insets.top + 8 : 20,
              paddingBottom: insets.bottom > 0 ? insets.bottom + 16 : 24,
            },
          ]}
        >
          {/* Header */}
          <View style={modalStyles.header}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 14,
                  backgroundColor: `${colors.gold}22`,
                  borderWidth: 1,
                  borderColor: `${colors.gold}60`,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Feather name="bell" size={20} color={colors.gold} />
              </View>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={[modalStyles.title, { color: colors.foreground }]}>Notificaciones</Text>
                  {unreadCount > 0 ? (
                    <View style={[modalStyles.badge, { backgroundColor: colors.destructive }]}>
                      <Text style={modalStyles.badgeText}>{unreadCount} nuevas</Text>
                    </View>
                  ) : null}
                </View>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                  Comunidad, seguidores y beneficios Dynasty
                </Text>
              </View>
            </View>

            <Pressable
              onPress={onClose}
              hitSlop={12}
              style={({ pressed }) => [
                modalStyles.closeButton,
                { backgroundColor: colors.card, borderColor: colors.border, opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Feather name="x" size={20} color={colors.foreground} />
            </Pressable>
          </View>

          {/* Action Row & Category Tabs */}
          <View style={modalStyles.actionRow}>
            {/* Filter pills: [Todos | Social | Dynasty] */}
            <View style={{ flexDirection: 'row', gap: 6, flex: 1 }}>
              {[
                { id: 'all', label: `Todos (${notifications.length})` },
                { id: 'social', label: 'Social 💬' },
                { id: 'dynasty', label: 'Dynasty 👑' },
              ].map((f) => {
                const active = filter === f.id;
                return (
                  <Pressable
                    key={f.id}
                    onPress={() => setFilter(f.id as typeof filter)}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 7,
                      borderRadius: 12,
                      backgroundColor: active ? colors.primary : colors.card,
                      borderWidth: 1,
                      borderColor: active ? colors.primary : colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: active ? colors.primaryForeground : colors.mutedForeground,
                        fontSize: 11.5,
                        fontWeight: '700',
                      }}
                    >
                      {f.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {unreadCount > 0 ? (
              <Pressable
                onPress={markAllAsRead}
                style={({ pressed }) => [
                  {
                    paddingVertical: 6,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: `${colors.gold}18`,
                    borderWidth: 1,
                    borderColor: `${colors.gold}50`,
                    opacity: pressed ? 0.7 : 1,
                  },
                ]}
              >
                <Text style={{ color: colors.gold, fontSize: 11, fontWeight: '800' }}>Marcar leídas</Text>
              </Pressable>
            ) : null}
          </View>

          {/* List of Notifications */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 18, paddingTop: 10, paddingBottom: 30 }}
          >
            {filtered.length === 0 ? (
              <View style={[modalStyles.emptyContainer, { borderColor: colors.border }]}>
                <Feather name="bell-off" size={32} color={colors.mutedForeground} />
                <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 14, marginTop: 12 }}>
                  Sin notificaciones en esta categoría
                </Text>
                <Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4, textAlign: 'center', paddingHorizontal: 20 }}>
                  Las interacciones de seguidores, comentarios y medallas aparecerán aquí en vivo.
                </Text>
              </View>
            ) : (
              filtered.map((item) => {
                const isUnread = !item.read;
                const iconInfo = getTypeIcon(item.type);

                return (
                  <Pressable
                    key={item.id}
                    onPress={() => handlePressNotification(item)}
                    style={({ pressed }) => [
                      modalStyles.itemCard,
                      {
                        backgroundColor: isUnread ? '#1F142E' : colors.card,
                        borderColor: isUnread ? `${colors.gold}80` : colors.border,
                        borderWidth: isUnread ? 1.5 : 1,
                        opacity: pressed ? 0.8 : 1,
                      },
                    ]}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 12 }}>
                      {/* Avatar with type badge */}
                      <View style={{ position: 'relative' }}>
                        <Image
                          source={{ uri: item.avatarUrl }}
                          contentFit="cover"
                          style={{ width: 44, height: 44, borderRadius: 22, borderWidth: 1.5, borderColor: colors.gold }}
                        />
                        <View style={[modalStyles.typeIconBubble, { backgroundColor: iconInfo.bg }]}>
                          <Feather name={iconInfo.name} size={10} color="#FFFFFF" />
                        </View>
                      </View>

                      {/* Content */}
                      <View style={{ flex: 1 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 5, flex: 1, paddingRight: 6 }}>
                            <Text style={{ color: colors.foreground, fontSize: 13, fontWeight: '800' }} numberOfLines={1}>
                              {item.actorName}
                            </Text>
                            {item.actorUsername ? (
                              <Text style={{ color: colors.mutedForeground, fontSize: 10.5 }} numberOfLines={1}>
                                @{item.actorUsername}
                              </Text>
                            ) : null}
                          </View>
                          <Text style={{ color: colors.mutedForeground, fontSize: 10 }}>{item.timeAgo}</Text>
                        </View>

                        <Text style={{ color: colors.mutedForeground, fontSize: 11.5, marginTop: 2, lineHeight: 16 }}>
                          <Text style={{ color: colors.foreground, fontWeight: '600' }}>{item.actionText}</Text>
                          {item.targetPreview ? `: "${item.targetPreview}"` : ''}
                        </Text>

                        {/* Comment, reaction or detail quote */}
                        {item.detailText ? (
                          <View
                            style={{
                              marginTop: 7,
                              backgroundColor: '#0F0916',
                              padding: 9,
                              borderRadius: 10,
                              borderLeftWidth: 3,
                              borderLeftColor: item.type === 'award' || item.type === 'gift_code' ? colors.gold : colors.primary,
                            }}
                          >
                            <Text style={{ color: colors.foreground, fontSize: 11.5, lineHeight: 16, fontStyle: 'italic' }}>
                              "{item.detailText}"
                            </Text>
                          </View>
                        ) : null}
                      </View>

                      {/* Right indicator: Unread dot or chevron */}
                      <View style={{ alignItems: 'center', justifyContent: 'center', alignSelf: 'center', paddingLeft: 4 }}>
                        {isUnread ? (
                          <View
                            style={{
                              width: 8,
                              height: 8,
                              borderRadius: 4,
                              backgroundColor: colors.gold,
                            }}
                          />
                        ) : (
                          <Feather name="chevron-right" size={16} color={colors.mutedForeground} />
                        )}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const modalStyles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.78)',
    justifyContent: 'flex-end',
  },
  sheet: {
    maxHeight: '90%',
    minHeight: '65%',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1.5,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 14,
  },
  title: {
    fontSize: 19,
    fontWeight: '800',
    letterSpacing: -0.3,
  },
  badge: {
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '800',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#281E36',
    gap: 8,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 45,
    borderWidth: 1,
    borderRadius: 18,
    borderStyle: 'dashed',
    marginTop: 20,
  },
  itemCard: {
    borderRadius: 16,
    padding: 13,
    marginBottom: 10,
  },
  typeIconBubble: {
    position: 'absolute',
    bottom: -2,
    right: -2,
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 1.5,
    borderColor: '#120D1A',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
