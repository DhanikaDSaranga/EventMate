import { View, Text } from 'react-native'
import React from 'react'
import { useSafeAreaInsets } from 'react-native-safe-area-context'
import { LoaderProvider } from '@/context/LoaderContext';
import { AuthProvider } from '@/context/AuthContext';
import { Slot } from 'expo-router';
import Toast, { BaseToast, ErrorToast } from 'react-native-toast-message';

// Custom Toast Config
const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: '#6366F1', backgroundColor: '#0F172A' }} // Indigo border, Dark background
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' }}
      text2Style={{ fontSize: 13, color: '#94A3B8' }}
    />
  ),
  error: (props: any) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: '#EF4444', backgroundColor: '#0F172A' }} // Red border, Dark background
      text1Style={{ fontSize: 16, fontWeight: 'bold', color: '#F8FAFC' }}
      text2Style={{ fontSize: 13, color: '#94A3B8' }}
    />
  ),
};

const RootLayout = () => {

  const insets = useSafeAreaInsets();

  return (
    <LoaderProvider>
      <AuthProvider>
        <View style={{ marginTop: insets.top, marginBottom: insets.bottom, flex: 1 }}>
          <Slot />
          <Toast config={toastConfig} />
        </View>
      </AuthProvider>
    </LoaderProvider>
  )
}

export default RootLayout