import { Feather, Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as ImagePicker from 'expo-image-picker';
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
import { useColors } from '@/hooks/useColors';

export const TERMS_STORAGE_KEY = '@bodyfit_dynasty_terms_accepted_v1';

interface DynastyTermsModalProps {
  forceVisible?: boolean;
  onClose?: () => void;
  isReviewMode?: boolean;
}

export function DynastyTermsModal({
  forceVisible = false,
  onClose,
  isReviewMode = false,
}: DynastyTermsModalProps) {
  const colors = useColors();
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [accepting, setAccepting] = useState(false);

  // Checkboxes de consentimiento obligatorio
  const [acceptedTerms, setAcceptedTerms] = useState(isReviewMode);
  const [acceptedCamera, setAcceptedCamera] = useState(isReviewMode);
  const [acceptedNotifications, setAcceptedNotifications] = useState(isReviewMode);

  useEffect(() => {
    if (forceVisible) {
      setModalVisible(true);
      setLoading(false);
      return;
    }

    const checkTermsAccepted = async () => {
      try {
        const stored = await AsyncStorage.getItem(TERMS_STORAGE_KEY);
        if (!stored) {
          setModalVisible(true);
        } else {
          setModalVisible(false);
        }
      } catch {
        setModalVisible(true);
      } finally {
        setLoading(false);
      }
    };

    checkTermsAccepted();
  }, [forceVisible]);

  const allChecked = acceptedTerms && acceptedCamera && acceptedNotifications;

  const handleToggleAll = () => {
    const nextState = !allChecked;
    setAcceptedTerms(nextState);
    setAcceptedCamera(nextState);
    setAcceptedNotifications(nextState);
  };

  const handleAcceptAndProceed = async () => {
    if (!allChecked) {
      Alert.alert(
        'Requerimientos Pendientes',
        'Para utilizar BodyFit Dynasty y su escáner inteligente de alimentos por IA, debes aceptar los términos y otorgar los permisos requeridos.'
      );
      return;
    }

    setAccepting(true);
    try {
      // 1. Solicitar permisos de cámara nativos del sistema operativo (iOS / Android)
      try {
        await ImagePicker.requestCameraPermissionsAsync();
      } catch (camErr) {
        console.warn('Error al solicitar permiso de cámara:', camErr);
      }

      // 2. Solicitar permisos de galería fotográfica nativos
      try {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      } catch (libErr) {
        console.warn('Error al solicitar permiso de galería:', libErr);
      }

      // 3. Persistir aceptación en almacenamiento local seguro
      const payload = {
        acceptedAt: new Date().toISOString(),
        version: '1.0',
        terms: true,
        camera: true,
        notifications: true,
      };
      await AsyncStorage.setItem(TERMS_STORAGE_KEY, JSON.stringify(payload));

      setModalVisible(false);
      if (onClose) onClose();

      Alert.alert(
        '¡Bienvenido a BodyFit Dynasty!',
        'Has aceptado los términos y habilitado los requerimientos del sistema. Ya puedes escanear tus comidas, registrar tus entrenos y superar tus marcas.'
      );
    } catch {
      Alert.alert('Error', 'No se pudo guardar la aceptación. Inténtalo de nuevo.');
    } finally {
      setAccepting(false);
    }
  };

  if (loading) return null;

  return (
    <Modal
      visible={modalVisible}
      animationType="fade"
      transparent={true}
      onRequestClose={() => {
        if (isReviewMode && onClose) {
          onClose();
        }
      }}
    >
      <View style={styles.overlay}>
        <View style={[styles.container, { backgroundColor: '#120B1C', borderColor: colors.gold }]}>
          {/* Header Visual Dynasty */}
          <View style={styles.header}>
            <View style={[styles.iconBadge, { backgroundColor: `${colors.gold}25` }]}>
              <Ionicons name="shield-checkmark" size={28} color={colors.gold} />
            </View>
            <View style={{ flex: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <Text style={{ color: colors.gold, fontSize: 10.5, fontWeight: '800', letterSpacing: 1 }}>
                  BODYFIT DYNASTY · REGLAMENTO OFICIAL
                </Text>
              </View>
              <Text style={{ color: '#FFFFFF', fontSize: 17, fontWeight: '800', marginTop: 2 }}>
                Términos, Condiciones & Permisos
              </Text>
            </View>
            {isReviewMode && (
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  if (onClose) onClose();
                }}
                style={styles.closeBtn}
              >
                <Feather name="x" size={20} color="#FFFFFF" />
              </Pressable>
            )}
          </View>

          {/* Subtítulo informativo */}
          <View style={styles.noticeBanner}>
            <Feather name="info" size={15} color={colors.gold} />
            <Text style={styles.noticeText}>
              Antes de ingresar a la app, es indispensable aceptar nuestras directrices de salud deportiva y otorgar los permisos necesarios como el <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>uso de la cámara</Text> para el escáner de comidas por IA.
            </Text>
          </View>

          {/* Documento Desplazable de Términos */}
          <ScrollView style={styles.bodyScroll} showsVerticalScrollIndicator={true} contentContainerStyle={{ paddingBottom: 20 }}>
            {/* Cláusula 1 */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="activity" size={15} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  1. Descargo de Responsabilidad Médica y Salud
                </Text>
              </View>
              <Text style={styles.sectionBody}>
                BodyFit Dynasty es una plataforma de musculación, biomecánica y optimización atlética fundada por el Head Coach Esteban. Los planes de entrenamiento y guías nutricionales son herramientas de acondicionamiento físico. Todo atleta es responsable de consultar con su médico antes de iniciar programas de alta intensidad o cambios radicales en su dieta.
              </Text>
            </View>

            {/* Cláusula 2: REQUERIMIENTO OBLIGATORIO DE CÁMARA */}
            <View style={[styles.sectionBlock, { borderColor: `${colors.gold}70`, backgroundColor: '#190E26' }]}>
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="camera" size={17} color={colors.gold} />
                <Text style={[styles.sectionTitle, { color: colors.gold }]}>
                  2. Requerimiento Obligatorio: Uso de la Cámara
                </Text>
              </View>
              <Text style={styles.sectionBody}>
                La aplicación utiliza la cámara de tu dispositivo para funciones esenciales:
              </Text>
              <View style={{ marginTop: 6, gap: 5 }}>
                <Text style={styles.bulletItem}>
                  • <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>Escáner de Comida por IA (Food Scanner AI):</Text> Analiza fotográficamente tus platos de comida para estimar calorías, proteínas, carbohidratos y grasas al instante.
                </Text>
                <Text style={styles.bulletItem}>
                  • <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>Escaneo de Códigos de Barra:</Text> Lee empaques de suplementos y productos nutricionales.
                </Text>
                <Text style={styles.bulletItem}>
                  • <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>Inspección de Máquinas del Gym:</Text> Identifica el equipamiento de tu gimnasio para adaptar tu rutina.
                </Text>
                <Text style={styles.bulletItem}>
                  • <Text style={{ fontWeight: '700', color: '#FFFFFF' }}>Registro de Evolución Corporal:</Text> Fotos privadas de progreso muscular visibles únicamente por ti.
                </Text>
              </View>
            </View>

            {/* Cláusula 3: Almacenamiento y Galería */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="image" size={15} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  3. Acceso a Galería Fotográfica y Almacenamiento
                </Text>
              </View>
              <Text style={styles.sectionBody}>
                Se requiere acceso a la galería para que puedas seleccionar tu avatar de perfil, adjuntar fotos de platillos ya tomadas y descargar reportes o medallas de rendimiento.
              </Text>
            </View>

            {/* Cláusula 4: Notificaciones y Constancia */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="bell" size={15} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  4. Notificaciones del Sistema y Rescate de Racha
                </Text>
              </View>
              <Text style={styles.sectionBody}>
                Se enviarán alertas para recordarte entrenar, evitar que pierdas tu racha Dynasty diaria y avisarte de nuevos retos deportivos o recomendaciones de tu Head Coach.
              </Text>
            </View>

            {/* Cláusula 5: Privacidad de Datos */}
            <View style={styles.sectionBlock}>
              <View style={styles.sectionHeaderRow}>
                <Feather name="lock" size={15} color={colors.primary} />
                <Text style={[styles.sectionTitle, { color: colors.primary }]}>
                  5. Privacidad y Seguridad de Tus Datos
                </Text>
              </View>
              <Text style={styles.sectionBody}>
                Tu información biométrica, fotos de comidas y registros de peso se almacenan bajo cifrado seguro y jamás serán vendidos ni compartidos con anunciantes externos.
              </Text>
            </View>
          </ScrollView>

          {/* Sección de Consentimientos y Checkboxes */}
          <View style={styles.consentSection}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', textTransform: 'uppercase' }}>
                Consentimiento de Requerimientos
              </Text>
              {!isReviewMode && (
                <Pressable onPress={handleToggleAll}>
                  <Text style={{ color: colors.gold, fontSize: 11.5, fontWeight: '700' }}>
                    {allChecked ? 'Desmarcar' : 'Marcar todos'}
                  </Text>
                </Pressable>
              )}
            </View>

            {/* Check 1 */}
            <Pressable
              onPress={() => !isReviewMode && setAcceptedTerms(!acceptedTerms)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkboxBox, acceptedTerms && { backgroundColor: colors.gold, borderColor: colors.gold }]}>
                {acceptedTerms && <Feather name="check" size={13} color="#000" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Acepto los <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Términos y Condiciones</Text> y las directrices de salud de BodyFit Dynasty.
              </Text>
            </Pressable>

            {/* Check 2 */}
            <Pressable
              onPress={() => !isReviewMode && setAcceptedCamera(!acceptedCamera)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkboxBox, acceptedCamera && { backgroundColor: colors.gold, borderColor: colors.gold }]}>
                {acceptedCamera && <Feather name="check" size={13} color="#000" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Autorizo el <Text style={{ color: colors.gold, fontWeight: '700' }}>uso de la Cámara y Galería</Text> para el escáner de comidas por IA y registro de máquinas.
              </Text>
            </Pressable>

            {/* Check 3 */}
            <Pressable
              onPress={() => !isReviewMode && setAcceptedNotifications(!acceptedNotifications)}
              style={styles.checkboxRow}
            >
              <View style={[styles.checkboxBox, acceptedNotifications && { backgroundColor: colors.gold, borderColor: colors.gold }]}>
                {acceptedNotifications && <Feather name="check" size={13} color="#000" />}
              </View>
              <Text style={styles.checkboxLabel}>
                Autorizo las <Text style={{ color: '#FFFFFF', fontWeight: '700' }}>Notificaciones</Text> de entrenamiento diario y constancia de racha.
              </Text>
            </Pressable>

            {/* Botón Principal */}
            {!isReviewMode ? (
              <Pressable
                disabled={!allChecked || accepting}
                onPress={handleAcceptAndProceed}
                style={[
                  styles.submitBtn,
                  {
                    backgroundColor: allChecked ? colors.gold : '#332616',
                    opacity: allChecked ? 1 : 0.6,
                  },
                ]}
              >
                {accepting ? (
                  <ActivityIndicator size="small" color="#000000" />
                ) : (
                  <>
                    <Ionicons name="checkmark-done" size={18} color={allChecked ? '#000000' : '#888888'} />
                    <Text style={[styles.submitBtnText, { color: allChecked ? '#000000' : '#888888' }]}>
                      Aceptar Requerimientos y Entrar
                    </Text>
                  </>
                )}
              </Pressable>
            ) : (
              <Pressable
                onPress={() => {
                  setModalVisible(false);
                  if (onClose) onClose();
                }}
                style={[styles.submitBtn, { backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1 }]}
              >
                <Text style={[styles.submitBtnText, { color: colors.foreground }]}>Cerrar Términos</Text>
              </Pressable>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.92)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  container: {
    width: '100%',
    maxHeight: '92%',
    borderRadius: 22,
    borderWidth: 1.5,
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  noticeBanner: {
    margin: 14,
    backgroundColor: '#1E1428',
    borderColor: 'rgba(212, 175, 55, 0.4)',
    borderWidth: 1,
    borderRadius: 12,
    padding: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  noticeText: {
    flex: 1,
    color: '#D5C8DF',
    fontSize: 11.5,
    lineHeight: 16,
  },
  bodyScroll: {
    paddingHorizontal: 16,
    flex: 1,
  },
  sectionBlock: {
    backgroundColor: '#160E22',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
    borderRadius: 14,
    padding: 12,
    marginBottom: 10,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  sectionTitle: {
    fontSize: 12.5,
    fontWeight: '800',
    flex: 1,
  },
  sectionBody: {
    color: '#C7B9D4',
    fontSize: 11.5,
    lineHeight: 17,
  },
  bulletItem: {
    color: '#C7B9D4',
    fontSize: 11,
    lineHeight: 16,
  },
  consentSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
    backgroundColor: '#0F0917',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 8,
  },
  checkboxBox: {
    width: 20,
    height: 20,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: '#665577',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
  },
  checkboxLabel: {
    flex: 1,
    color: '#D8CFE3',
    fontSize: 11.5,
    lineHeight: 16,
  },
  submitBtn: {
    marginTop: 10,
    paddingVertical: 13,
    borderRadius: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  submitBtnText: {
    fontSize: 13.5,
    fontWeight: '800',
    letterSpacing: 0.3,
  },
});
