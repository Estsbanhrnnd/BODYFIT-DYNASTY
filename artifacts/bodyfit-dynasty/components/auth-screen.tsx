import { Feather } from '@expo/vector-icons';
import React from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { BrandMark } from '@/components/bodyfit';
import { useColors } from '@/hooks/useColors';

export function AuthScreen({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) {
  const colors = useColors();
  return (
    <KeyboardAvoidingView style={{ flex: 1, backgroundColor: colors.background }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 22 }} keyboardShouldPersistTaps="handled">
        <View style={{ alignItems: 'center', marginBottom: 28 }}>
          <BrandMark size={42} />
          <Text style={{ color: colors.gold, letterSpacing: 2, fontSize: 11, fontWeight: '700', marginTop: 12 }}>BODYFIT DYNASTY®</Text>
          <Text style={{ color: colors.foreground, fontSize: 25, fontWeight: '700', marginTop: 23, textAlign: 'center' }}>{title}</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, lineHeight: 18, marginTop: 8, textAlign: 'center', maxWidth: 300 }}>{subtitle}</Text>
        </View>
        <View style={{ backgroundColor: colors.card, borderWidth: 1, borderColor: colors.border, borderRadius: 22, padding: 18 }}>{children}</View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

export function AuthField({ label, value, onChangeText, placeholder, secureTextEntry = false, keyboardType = 'default' }: { label: string; value: string; onChangeText: (value: string) => void; placeholder: string; secureTextEntry?: boolean; keyboardType?: 'default' | 'email-address' | 'numeric' }) {
  const colors = useColors();
  return <View style={{ marginBottom: 14 }}>
    <Text style={{ color: colors.foreground, fontSize: 11, fontWeight: '600', marginBottom: 6 }}>{label}</Text>
    <TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor={colors.mutedForeground} autoCapitalize="none" secureTextEntry={secureTextEntry} keyboardType={keyboardType} style={{ color: colors.foreground, backgroundColor: colors.secondary, borderColor: colors.border, borderWidth: 1, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 12, fontSize: 13 }} />
  </View>;
}

export function AuthButton({ title, onPress, disabled = false }: { title: string; onPress: () => void; disabled?: boolean }) {
  const colors = useColors();
  return <Pressable onPress={onPress} disabled={disabled} style={({ pressed }) => ({ backgroundColor: colors.primary, borderRadius: 12, paddingVertical: 13, alignItems: 'center', opacity: disabled ? 0.45 : pressed ? 0.75 : 1 })}><Text style={{ color: colors.primaryForeground, fontSize: 13, fontWeight: '700' }}>{title}</Text></Pressable>;
}

export function AuthLink({ label, onPress }: { label: string; onPress: () => void }) {
  const colors = useColors();
  return <Pressable onPress={onPress} style={{ alignItems: 'center', paddingVertical: 15 }}><Text style={{ color: colors.primary, fontSize: 12, fontWeight: '700' }}>{label}</Text></Pressable>;
}

export function AuthError({ message }: { message?: string }) {
  const colors = useColors();
  if (!message) return null;
  return <View style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 7, backgroundColor: '#32151B', borderRadius: 10, padding: 10, marginBottom: 13 }}><Feather name="alert-circle" size={15} color={colors.destructive} /><Text style={{ color: '#F5B7BF', fontSize: 11, lineHeight: 16, flex: 1 }}>{message}</Text></View>;
}