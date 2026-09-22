import { useSignIn } from '@clerk/expo';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text } from 'react-native';
import { AuthButton, AuthError, AuthField, AuthLink, AuthScreen } from '@/components/auth-screen';
import { useColors } from '@/hooks/useColors';

export default function SignInScreen() {
  const colors = useColors();
  const { signIn, errors, fetchStatus } = useSignIn();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const submit = async () => {
    const result = await signIn.password({ emailAddress, password });
    if (result.error) return;
    if (signIn.status === 'complete') {
      await signIn.finalize({ navigate: () => router.replace('/(tabs)') });
    } else if (signIn.status === 'needs_client_trust') {
      await signIn.mfa.sendEmailCode();
    }
  };

  const verify = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === 'complete') await signIn.finalize({ navigate: () => router.replace('/(tabs)') });
  };

  const errorMessage = errors.fields?.identifier?.message ?? errors.fields?.password?.message ?? errors.fields?.code?.message;
  return (
    <AuthScreen title={signIn.status === 'needs_client_trust' ? 'Verifica tu cuenta' : 'Bienvenido de nuevo'} subtitle={signIn.status === 'needs_client_trust' ? 'Escribe el código que enviamos a tu correo.' : 'Inicia sesión para continuar con tu plan y tu progreso.'}>
      <AuthError message={errorMessage} />
      {signIn.status === 'needs_client_trust' ? (
        <>
          <AuthField label="Código de verificación" value={code} onChangeText={setCode} placeholder="123456" keyboardType="numeric" />
          <AuthButton title="Verificar cuenta" onPress={verify} disabled={!code || fetchStatus === 'fetching'} />
          <AuthLink label="Enviar otro código" onPress={() => { void signIn.mfa.sendEmailCode(); }} />
        </>
      ) : (
        <>
          <AuthField label="Correo electrónico" value={emailAddress} onChangeText={setEmailAddress} placeholder="tu@correo.com" keyboardType="email-address" />
          <AuthField label="Contraseña" value={password} onChangeText={setPassword} placeholder="Tu contraseña" secureTextEntry />
          <AuthButton title={fetchStatus === 'fetching' ? 'Entrando...' : 'Iniciar sesión'} onPress={submit} disabled={!emailAddress || !password || fetchStatus === 'fetching'} />
          <AuthLink label="Crear una cuenta nueva" onPress={() => router.push('/sign-up' as never)} />
        </>
      )}
      <Text style={{ color: colors.mutedForeground, fontSize: 10, lineHeight: 15, textAlign: 'center', marginTop: 7 }}>Tus datos de cuenta se gestionan de forma segura. Los clientes comienzan con STANDARD.</Text>
    </AuthScreen>
  );
}