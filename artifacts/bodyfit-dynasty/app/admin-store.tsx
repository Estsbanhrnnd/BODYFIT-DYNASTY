import { Feather } from '@expo/vector-icons';
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import { router } from 'expo-router';
import { useQueryClient } from '@tanstack/react-query';
import React, { useState } from 'react';
import { Alert, Pressable, RefreshControl, ScrollView, Text, TextInput, View } from 'react-native';
import {
  useCreateStoreProduct,
  useDeleteStoreProduct,
  useListAdminStoreProducts,
  useUpdateStoreProduct,
  type StoreProduct,
  type StoreProductInput,
} from '@workspace/api-client-react';
import { Screen, TopBar } from '@/components/bodyfit';
import { useBodyFit } from '@/context/BodyFitContext';
import { useColors } from '@/hooks/useColors';

interface StoreProductWithPrice extends StoreProduct {
  priceText?: string | null;
}

const emptyForm = { name: '', description: '', category: '', imageUrl: '', priceText: '', active: true };
const categoryIcons: Record<string, keyof typeof Feather.glyphMap> = {
  ropa: 'shopping-bag',
  accesorios: 'watch',
  entrenamiento: 'activity',
  suplementos: 'heart',
  nutrición: 'coffee',
  nutricion: 'coffee',
  proteínas: 'zap',
  proteinas: 'zap',
  creatinas: 'shield',
  aminoácidos: 'activity',
  aminoacidos: 'activity',
  'pre-entrenos': 'zap',
  preentrenos: 'zap',
  multivitamínicos: 'shield',
  multivitaminicos: 'shield',
};

function Field({
  label,
  value,
  onChange,
  multiline = false,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  multiline?: boolean;
  placeholder?: string;
}) {
  const colors = useColors();
  return (
    <View style={{ marginBottom: 13 }}>
      <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedForeground}
        multiline={multiline}
        style={{
          color: colors.foreground,
          backgroundColor: colors.input,
          borderColor: colors.border,
          borderWidth: 1,
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 11,
          minHeight: multiline ? 82 : 44,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </View>
  );
}

export default function AdminStoreScreen() {
  const colors = useColors();
  const { isOwner, isAdminModeActive } = useBodyFit();
  const queryClient = useQueryClient();
  const query = useListAdminStoreProducts({ query: { enabled: true, queryKey: ['admin-store-products'] } });
  const create = useCreateStoreProduct();
  const update = useUpdateStoreProduct();
  const remove = useDeleteStoreProduct();
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<StoreProductWithPrice | null>(null);
  const [formError, setFormError] = useState('');
  const busy = create.isPending || update.isPending || remove.isPending;
  const products = (query.data?.products ?? []) as StoreProductWithPrice[];
  const refresh = () => queryClient.invalidateQueries({ queryKey: query.queryKey });
  const set = (key: keyof typeof emptyForm, value: string | boolean) => setForm((current) => ({ ...current, [key]: value }));

  const handlePickProductImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la galería para seleccionar la foto del producto.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'],
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        set('imageUrl', dataUri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la galería.');
    }
  };

  const handleTakeProductPhoto = async () => {
    try {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permiso requerido', 'Se necesita acceso a la cámara para fotografiar el producto.');
        return;
      }
      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.75,
        base64: true,
      });
      if (!result.canceled && result.assets && result.assets[0]) {
        const asset = result.assets[0];
        const dataUri = asset.base64 ? `data:image/jpeg;base64,${asset.base64}` : asset.uri;
        set('imageUrl', dataUri);
      }
    } catch {
      Alert.alert('Error', 'No se pudo abrir la cámara.');
    }
  };

  const startEdit = (product: StoreProductWithPrice) => {
    setEditing(product);
    setForm({
      name: product.name,
      description: product.description,
      category: product.category,
      imageUrl: product.imageUrl ?? '',
      priceText: (product as any).priceText ?? '',
      active: product.active,
    });
    setFormError('');
  };

  const reset = () => {
    setEditing(null);
    setForm(emptyForm);
    setFormError('');
  };

  const save = () => {
    setFormError('');
    if (!form.name.trim() || !form.description.trim() || !form.category.trim()) {
      return setFormError('Completa nombre, descripción y categoría.');
    }
    if (form.imageUrl && !/^(https?:\/\/|data:image\/|file:\/\/|content:\/\/|blob:)\S+/i.test(form.imageUrl.trim())) {
      return setFormError('El formato de la imagen no es válido.');
    }

    const data: StoreProductInput & { priceText?: string | null } = {
      name: form.name.trim(),
      description: form.description.trim(),
      category: form.category.trim(),
      imageUrl: form.imageUrl.trim() || null,
      active: form.active,
      priceText: form.priceText.trim() || null,
    };

    const onDone = () => {
      refresh();
      reset();
      Alert.alert('Éxito', editing ? 'Producto y precio actualizados.' : 'Producto creado con éxito.');
    };

    if (editing) {
      update.mutate(
        { productId: editing.id, data: data as any },
        { onSuccess: onDone, onError: () => setFormError('No se pudo actualizar el producto.') }
      );
    } else {
      create.mutate(
        { data: data as any },
        { onSuccess: onDone, onError: () => setFormError('No se pudo crear el producto.') }
      );
    }
  };

  const deleteProduct = (product: StoreProductWithPrice) =>
    Alert.alert('Eliminar producto', `¿Eliminar “${product.name}”?`, [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: () =>
          remove.mutate(
            { productId: product.id },
            { onSuccess: refresh, onError: () => setFormError('No se pudo eliminar el producto.') }
          ),
      },
    ]);

  if (!isAdminModeActive) {
    return (
      <Screen>
        <TopBar title="Administración" subtitle="Tienda" onPress={() => router.back()} />
        <View style={{ alignItems: 'center', paddingVertical: 70 }}>
          <Feather name="lock" size={40} color={colors.destructive} />
          <Text style={{ color: colors.foreground, fontWeight: '700', marginTop: 15 }}>Acceso restringido</Text>
          <Text style={{ color: colors.mutedForeground, fontSize: 12, marginTop: 7 }}>
            Solo el propietario en Modo Administrador puede gestionar la tienda.
          </Text>
        </View>
      </Screen>
    );
  }

  return (
    <Screen scroll={false}>
      <TopBar
        title="Administración de Tienda"
        subtitle="Gestiona productos, suplementos y precios oficiales"
        onPress={() => router.back()}
      />
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={query.isRefetching} onRefresh={() => query.refetch()} tintColor={colors.primary} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Formulario de Creación / Edición */}
        <View style={{ backgroundColor: colors.card, borderColor: colors.border, borderWidth: 1, borderRadius: 18, padding: 16, marginBottom: 22 }}>
          <Text style={{ color: colors.foreground, fontSize: 17, fontWeight: '700', marginBottom: 15 }}>
            {editing ? 'Editar producto y precio' : 'Nuevo producto en tienda'}
          </Text>
          <Field label="Nombre del Producto" value={form.name} onChange={(v) => set('name', v)} placeholder="Ej. Dymatize ISO 100" />
          <Field
            label="Precio Oficial a mostrar (opcional)"
            value={form.priceText}
            onChange={(v) => set('priceText', v)}
            placeholder="Ej. ₡45,000 o $65 USD (vacío = Precio a consultar)"
          />
          <Field label="Descripción" value={form.description} onChange={(v) => set('description', v)} multiline placeholder="Describe el suplemento, porciones y beneficios" />
          <Field label="Categoría" value={form.category} onChange={(v) => set('category', v)} placeholder="Ej. Proteínas, Creatinas, Aminoácidos" />
          {/* Carga y Gestión de Imagen de Producto */}
          <View style={{ marginBottom: 14 }}>
            <Text style={{ color: colors.mutedForeground, fontSize: 11, fontWeight: '700', marginBottom: 6 }}>
              Imagen del Producto (Galería, Cámara o URL)
            </Text>

            {form.imageUrl ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                  marginBottom: 10,
                  backgroundColor: '#1E1428',
                  padding: 10,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: `${colors.gold}60`,
                }}
              >
                <Image
                  source={{ uri: form.imageUrl }}
                  style={{ width: 68, height: 68, borderRadius: 10, borderWidth: 1, borderColor: colors.gold, backgroundColor: '#130C1C' }}
                  contentFit="contain"
                />
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.foreground, fontSize: 12, fontWeight: '700' }} numberOfLines={1}>
                    Imagen seleccionada
                  </Text>
                  <Text style={{ color: colors.gold, fontSize: 10, marginTop: 2 }}>
                    {form.imageUrl.startsWith('data:') ? '✓ Desde tu dispositivo (Base64)' : '✓ URL web'}
                  </Text>
                  <Pressable
                    onPress={() => set('imageUrl', '')}
                    style={{ flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 5 }}
                  >
                    <Feather name="trash-2" size={13} color={colors.destructive} />
                    <Text style={{ color: colors.destructive, fontSize: 11, fontWeight: '700' }}>Quitar imagen</Text>
                  </Pressable>
                </View>
              </View>
            ) : null}

            <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
              <Pressable
                onPress={handlePickProductImage}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: `${colors.gold}20`,
                  borderColor: `${colors.gold}70`,
                  borderWidth: 1.2,
                  borderRadius: 12,
                  paddingVertical: 10,
                }}
              >
                <Feather name="image" size={15} color={colors.gold} />
                <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '800' }}>Elegir de Galería</Text>
              </Pressable>

              <Pressable
                onPress={handleTakeProductPhoto}
                style={{
                  flex: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 6,
                  backgroundColor: '#231535',
                  borderColor: `${colors.primary}70`,
                  borderWidth: 1.2,
                  borderRadius: 12,
                  paddingVertical: 10,
                }}
              >
                <Feather name="camera" size={15} color={colors.primary} />
                <Text style={{ color: colors.primary, fontSize: 12, fontWeight: '800' }}>Tomar Foto</Text>
              </Pressable>
            </View>

            <Field
              label="O escribir / pegar URL pública de imagen"
              value={form.imageUrl.startsWith('data:') ? '' : form.imageUrl}
              onChange={(v) => set('imageUrl', v)}
              placeholder={form.imageUrl.startsWith('data:') ? 'Imagen local cargada desde tu teléfono' : 'https://ejemplo.com/producto.jpg'}
            />
          </View>

          <Pressable onPress={() => set('active', !form.active)} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 14 }}>
            <Feather name={form.active ? 'check-square' : 'square'} size={20} color={form.active ? colors.primary : colors.mutedForeground} />
            <Text style={{ color: colors.foreground, fontSize: 13, marginLeft: 9 }}>
              {form.active ? 'Visible en la tienda' : 'Producto inactivo (oculto)'}
            </Text>
          </Pressable>

          {formError ? <Text style={{ color: colors.destructive, fontSize: 12, marginBottom: 12 }}>{formError}</Text> : null}

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <Pressable
              disabled={busy}
              onPress={save}
              style={{
                backgroundColor: colors.primary,
                borderRadius: 12,
                padding: 13,
                flex: 1,
                alignItems: 'center',
                opacity: busy ? 0.55 : 1,
              }}
            >
              <Text style={{ color: colors.primaryForeground, fontWeight: '700' }}>
                {editing ? 'Guardar cambios y precio' : 'Crear producto'}
              </Text>
            </Pressable>
            {editing ? (
              <Pressable
                onPress={reset}
                style={{ borderColor: colors.border, borderWidth: 1, borderRadius: 12, padding: 13, alignItems: 'center' }}
              >
                <Text style={{ color: colors.foreground, fontWeight: '700' }}>Cancelar</Text>
              </Pressable>
            ) : null}
          </View>
        </View>

        {/* Lista de Productos Existentes */}
        <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '800', textTransform: 'uppercase', marginBottom: 12, letterSpacing: 1 }}>
          Productos en Catálogo ({products.length})
        </Text>

        {query.isLoading ? (
          <Text style={{ color: colors.mutedForeground, textAlign: 'center', padding: 40 }}>Cargando catálogo...</Text>
        ) : query.isError ? (
          <Text style={{ color: colors.destructive, textAlign: 'center', padding: 30 }}>No se pudo cargar el catálogo. Intenta de nuevo.</Text>
        ) : products.length === 0 ? (
          <Text style={{ color: colors.mutedForeground, textAlign: 'center', padding: 35 }}>Aún no hay productos.</Text>
        ) : (
          products.map((product) => {
            const icon = categoryIcons[product.category?.toLowerCase()] ?? 'package';
            return (
              <View
                key={product.id}
                style={{
                  backgroundColor: colors.card,
                  borderColor: colors.border,
                  borderWidth: 1,
                  borderRadius: 16,
                  padding: 12,
                  marginBottom: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                {product.imageUrl ? (
                  <Image source={{ uri: product.imageUrl }} contentFit="contain" style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: '#130C1C', padding: 2 }} />
                ) : (
                  <View style={{ width: 54, height: 54, borderRadius: 12, backgroundColor: `${colors.primary}18`, alignItems: 'center', justifyContent: 'center' }}>
                    <Feather name={icon} size={23} color={colors.primary} />
                  </View>
                )}
                <View style={{ flex: 1, marginLeft: 11 }}>
                  <Text style={{ color: colors.foreground, fontWeight: '700', fontSize: 13 }} numberOfLines={1}>
                    {product.name}
                  </Text>
                  <Text style={{ color: colors.gold, fontSize: 12, fontWeight: '800', marginTop: 2 }}>
                    {(product as any).priceText || 'Precio a consultar'}
                  </Text>
                  <Text style={{ color: product.active ? colors.green : colors.mutedForeground, fontSize: 11, marginTop: 2 }}>
                    {product.active ? 'Visible' : 'Oculto'} · {product.category}
                  </Text>
                </View>
                <Pressable onPress={() => startEdit(product)} style={{ padding: 8 }}>
                  <Feather name="edit-2" size={17} color={colors.primary} />
                </Pressable>
                <Pressable onPress={() => deleteProduct(product)} style={{ padding: 8 }}>
                  <Feather name="trash-2" size={17} color={colors.destructive} />
                </Pressable>
              </View>
            );
          })
        )}
      </ScrollView>
    </Screen>
  );
}