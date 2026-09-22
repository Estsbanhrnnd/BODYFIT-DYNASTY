import { useSignUp } from '@clerk/expo';
import { router } from 'expo-router';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { AuthButton, AuthError, AuthField, AuthLink, AuthScreen } from '@/components/auth-screen';

export default function SignUpScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const [emailAddress, setEmailAddress] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const submit = async () => {
    const result = await signUp.password({ emailAddress, password });
    if (result.error) return;
    await signUp.verifications.sendEmailCode();
  };

  const verify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === 'complete') await signUp.finalize({ navigate: () => router.replace('/(tabs)') });
  };

  const errorMessage = errors.fields?.emailAddress?.message ?? errors.fields?.password?.message ?? errors.fields?.code?.message;
  const verifying = signUp.status === 'missing_requirements' && signUp.unverifiedFields.includes('email_address');
  return (
    <AuthScreen title={verifying ? 'Confirma tu correo' : 'Crea tu cuenta'} subtitle={verifying ? 'Te enviamos un código para proteger tu cuenta.' : 'Guarda tu progreso, rutinas y membresía en tu propia cuenta.'}>
      <AuthError message={errorMessage} />
      {verifying ? (
        <>
          <AuthField label="Código de verificación" value={code} onChangeText={setCode} placeholder="123456" keyboardType="numeric" />
          <AuthButton title="Confirmar correo" onPress={verify} disabled={!code || fetchStatus === 'fetching'} />
          <AuthLink label="Enviar otro código" onPress={() => { void signUp.verifications.sendEmailCode(); }} />
        </>
      ) : (
        <>
          <AuthField label="Correo electrónico" value={emailAddress} onChangeText={setEmailAddress} placeholder="tu@correo.com" keyboardType="email-address" />
          <AuthField label="Contraseña" value={password} onChangeText={setPassword} placeholder="Mínimo 8 caracteres" secureTextEntry />
          <View nativeID="clerk-captcha" />
          <AuthButton title={fetchStatus === 'fetching' ? 'Creando...' : 'Crear cuenta'} onPress={submit} disabled={!emailAddress || !password || fetchStatus === 'fetching'} />
          <AuthLink label="Ya tengo una cuenta" onPress={() => router.replace('/sign-in' as never)} />
        </>
      )}
    </AuthScreen>
  );
}