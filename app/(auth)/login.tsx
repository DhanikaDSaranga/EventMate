import useLoader from '@/hooks/useLoader';
import { login } from '@/services/auth';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const PRIMARY_COLOR = '#6366F1'; // Premium Indigo

const Login = () => {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Toast.show({ type: 'error', text1: 'Missing fields', text2: 'Fill in everything to start your journey!' });
      return;
    }
    showLoader();
    try {
      await login(email, password);
      router.replace('/home');
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Oops!', text2: 'Check your email and password again.' });
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative Circles (Background Vibe) */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>

            {/* Header Section */}
            <View style={styles.header}>
              <View style={styles.iconBadge}>
                <MaterialCommunityIcons name="map-marker-radius" size={40} color={PRIMARY_COLOR} />
              </View>
              <Text style={styles.title}>TripMate</Text>
              <Text style={styles.subtitle}>Let's plan your next adventure together</Text>
            </View>

            {/* Input Card */}
            <View style={styles.card}>
              <Text style={styles.cardLabel}>Login to your account</Text>

              <View style={styles.inputGroup}>
                <View style={styles.inputBox}>
                  <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                  <TextInput
                    placeholder="Email address"
                    placeholderTextColor="#64748B"
                    style={styles.textInput}
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                  />
                </View>

                <View style={styles.inputBox}>
                  <Ionicons name="lock-closed-outline" size={20} color="#94A3B8" />
                  <TextInput
                    placeholder="Password"
                    placeholderTextColor="#64748B"
                    secureTextEntry={!showPassword}
                    style={styles.textInput}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Ionicons name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.forgotPass}>
                <Text style={styles.forgotText}>Forgot Password?</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.loginBtn} onPress={handleLogin} activeOpacity={0.9}>
                <Text style={styles.loginBtnText}>Sign In</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>
            </View>

            {/* Footer */}
            <View style={styles.footer}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <TouchableOpacity onPress={() => router.push('/register')}>
                <Text style={styles.signUpText}>Join Now</Text>
              </TouchableOpacity>
            </View>

          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', 
  },
  content: {
    flex: 1,
  },
  inner: {
    flex: 1,
    paddingHorizontal: 30,
    justifyContent: 'center',
  },
  circle1: {
    position: 'absolute',
    top: -50,
    right: -50,
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: PRIMARY_COLOR,
    opacity: 0.15,
  },
  circle2: {
    position: 'absolute',
    bottom: 50,
    left: -50,
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#3B82F6',
    opacity: 0.1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  iconBadge: {
    width: 80,
    height: 80,
    borderRadius: 25,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  title: {
    fontSize: 32,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 15,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 22,
  },
  card: {
    backgroundColor: '#0F172A', // Slate-900
    borderRadius: 30,
    padding: 25,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 10,
  },
  cardLabel: {
    color: '#F1F5F9',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'center',
  },
  inputGroup: {
    gap: 15,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderRadius: 15,
    paddingHorizontal: 15,
    height: 55,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  textInput: {
    flex: 1,
    color: '#F1F5F9',
    marginLeft: 10,
    fontSize: 15,
  },
  forgotPass: {
    alignSelf: 'flex-end',
    marginTop: 15,
    marginBottom: 25,
  },
  forgotText: {
    color: PRIMARY_COLOR,
    fontSize: 13,
    fontWeight: '500',
  },
  loginBtn: {
    backgroundColor: PRIMARY_COLOR,
    height: 55,
    borderRadius: 15,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.4,
    shadowRadius: 10,
    elevation: 5,
  },
  loginBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 35,
  },
  footerText: {
    color: '#64748B',
    fontSize: 15,
  },
  signUpText: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Login;