import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { images, Screen, SectionHeader, styles, TopBar } from '@/components/bodyfit';
import { useColors } from '@/hooks/useColors';

const posts = [
  { id: '1', name: 'Juan Pérez', time: 'Hace 2 horas', text: 'Nuevo PR en peso muerto. La constancia es la clave.', likes: 24, image: images.workout },
  { id: '2', name: 'María López', time: 'Hace 3 horas', text: '32 días de disciplina. Un día a la vez.', likes: 41, image: images.meal },
];

export default function CommunityScreen() {
  const colors = useColors();
  const [filter, setFilter] = useState('Todos');
  const [liked, setLiked] = useState<string[]>([]);
  const [following, setFollowing] = useState(false);
  return (
    <Screen>
      <TopBar title="Comunidad" subtitle="Comparte tu progreso" />
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 18 }}>
        {['Todos', 'Siguiendo', 'Grupos'].map((item) => (
          <Pressable key={item} onPress={() => setFilter(item)} style={{ paddingHorizontal: 15, paddingVertical: 9, borderRadius: 13, backgroundColor: filter === item ? colors.primary : colors.card, borderWidth: 1, borderColor: filter === item ? colors.primary : colors.border }}>
            <Text style={{ color: filter === item ? colors.primaryForeground : colors.mutedForeground, fontSize: 11, fontWeight: '700' }}>{item}</Text>
          </Pressable>
        ))}
      </View>
      <View style={[styles.card, { backgroundColor: '#171020', borderColor: '#44215E', marginBottom: 18, padding: 13 }]}>
        <View style={styles.row}>
          <View style={[styles.avatarSmall, { backgroundColor: colors.primary, alignItems: 'center', justifyContent: 'center' }]}><Feather name="user" size={16} color="#FFFFFF" /></View>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginLeft: 10, flex: 1 }}>Comparte un logro con la comunidad...</Text>
          <Feather name="plus-circle" color={colors.primary} size={20} />
        </View>
      </View>
      {filter === 'Grupos' ? (
        <View>
          <SectionHeader title="Grupos recomendados" action="Ver todos" />
          {['BodyFit Élite', 'Transformaciones', 'Principiantes', 'Motivación diaria'].map((group, index) => (
            <View key={group} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, marginBottom: 10, flexDirection: 'row', alignItems: 'center' }]}>
              <View style={{ width: 45, height: 45, borderRadius: 15, backgroundColor: index % 2 ? '#16262A' : '#261434', alignItems: 'center', justifyContent: 'center' }}><Feather name="users" size={20} color={index % 2 ? colors.green : colors.primary} /></View>
              <View style={{ flex: 1, marginLeft: 12 }}><Text style={{ color: colors.foreground, fontWeight: '700' }}>{group}</Text><Text style={{ color: colors.mutedForeground, fontSize: 11, marginTop: 4 }}>{index * 83 + 120} miembros</Text></View>
              <Pressable onPress={() => setFollowing(!following)}><Text style={{ color: colors.primary, fontWeight: '700', fontSize: 11 }}>{following ? 'Unido' : 'Unirme'}</Text></Pressable>
            </View>
          ))}
        </View>
      ) : posts.map((post) => {
        const isLiked = liked.includes(post.id);
        return (
          <View key={post.id} style={[styles.card, { backgroundColor: colors.card, borderColor: colors.border, padding: 0, overflow: 'hidden', marginBottom: 14 }]}>
            <View style={[styles.row, { padding: 14 }]}>
              <View style={[styles.avatarSmall, { backgroundColor: post.id === '1' ? colors.gold : colors.primary, alignItems: 'center', justifyContent: 'center' }]}><Feather name="user" size={15} color={colors.accentForeground} /></View>
              <View style={{ flex: 1, marginLeft: 10 }}><Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 13 }}>{post.name}</Text><Text style={{ color: colors.mutedForeground, fontSize: 10, marginTop: 3 }}>{post.time}</Text></View>
              <Feather name="more-horizontal" color={colors.mutedForeground} size={19} />
            </View>
            <Image source={post.image} contentFit="cover" style={{ width: '100%', height: 180 }} />
            <View style={{ padding: 14 }}>
              <Text style={{ color: colors.foreground, fontSize: 13, lineHeight: 19 }}>{post.text}</Text>
              <View style={[styles.row, { marginTop: 13, gap: 18 }]}>
                <Pressable testID={`like-${post.id}`} onPress={() => setLiked((current) => isLiked ? current.filter((id) => id !== post.id) : [...current, post.id])} style={styles.row}>
                  <Feather name={isLiked ? 'heart' : 'heart'} size={18} color={isLiked ? colors.destructive : colors.mutedForeground} />
                  <Text style={{ color: colors.mutedForeground, fontSize: 11, marginLeft: 6 }}>{post.likes + (isLiked ? 1 : 0)}</Text>
                </Pressable>
                <View style={styles.row}><Feather name="message-circle" size={17} color={colors.mutedForeground} /><Text style={{ color: colors.mutedForeground, fontSize: 11, marginLeft: 6 }}>Comentar</Text></View>
                <Feather name="send" size={17} color={colors.mutedForeground} />
              </View>
            </View>
          </View>
        );
      })}
    </Screen>
  );
}