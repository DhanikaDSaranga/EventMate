import useLoader from '@/hooks/useLoader';
import { register } from '@/services/auth';
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
  ScrollView,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');

const PRIMARY_COLOR = '#6366F1'; // Premium Indigo

const Register = () => {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  // States for inputs
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // States for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
  
    if (!fullName || !email || !password || !confirmPassword) {
      Toast.show({ type: 'error', text1: 'Missing Info', text2: 'Please fill in all fields to join!' });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Passwords mismatch', text2: 'Your passwords do not match.' });
      return;
    }

    showLoader();
    try {
      await register(fullName, email, password);
      Toast.show({ type: 'success', text1: 'Welcome!', text2: 'Account created successfully.' });
      router.replace('/login');
    } catch (error: any) {
      Toast.show({ type: 'error', text1: 'Registration Failed', text2: error.message || 'Something went wrong.' });
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Decorative Background Glows */}
      <View style={styles.circle1} />
      <View style={styles.circle2} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.content}
      >
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ flexGrow: 1, justifyContent: 'center' }}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={styles.inner}>

              {/* Header Section */}
              <View style={styles.header}>
                <View style={styles.iconBadge}>
                  <MaterialCommunityIcons name="account-plus-outline" size={40} color={PRIMARY_COLOR} />
                </View>
                <Text style={styles.title}>Join TripMate</Text>
                <Text style={styles.subtitle}>Create an account to start tracking your journeys</Text>
              </View>

              {/* Register Card */}
              <View style={styles.card}>
                <View style={styles.inputGroup}>

                  {/* Full Name */}
                  <View style={styles.inputBox}>
                    <Ionicons name="person-outline" size={20} color="#94A3B8" />
                    <TextInput
                      placeholder="Full Name"
                      placeholderTextColor="#64748B"
                      style={styles.textInput}
                      value={fullName}
                      onChangeText={setFullName}
                    />
                  </View>

                  {/* Email */}
                  <View style={styles.inputBox}>
                    <Ionicons name="mail-outline" size={20} color="#94A3B8" />
                    <TextInput
                      placeholder="Email address"
                      placeholderTextColor="#64748B"
                      style={styles.textInput}
                      value={email}
                      onChangeText={setEmail}
                      autoCapitalize="none"
                      keyboardType="email-address"
                    />
                  </View>

                  {/* Password */}
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

                  {/* Confirm Password */}
                  <View style={styles.inputBox}>
                    <Ionicons name="shield-checkmark-outline" size={20} color="#94A3B8" />
                    <TextInput
                      placeholder="Confirm Password"
                      placeholderTextColor="#64748B"
                      secureTextEntry={!showConfirmPassword}
                      style={styles.textInput}
                      value={confirmPassword}
                      onChangeText={setConfirmPassword}
                    />
                    <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                      <Ionicons name={showConfirmPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>

                <TouchableOpacity style={styles.signUpBtn} onPress={handleRegister} activeOpacity={0.9}>
                  <Text style={styles.signUpBtnText}>Create Account</Text>
                  <Ionicons name="rocket-outline" size={20} color="#fff" />
                </TouchableOpacity>
              </View>

              {/* Footer */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>Already a member? </Text>
                <TouchableOpacity onPress={() => router.push('/login')}>
                  <Text style={styles.signInText}>Sign In</Text>
                </TouchableOpacity>
              </View>

            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#020617', // Deep Dark Navy
  },
  content: {
    flex: 1,
  },
  inner: {
    paddingHorizontal: 30,
    paddingVertical: 50,
  },
  circle1: {
    position: 'absolute',
    top: -40,
    left: -40,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: PRIMARY_COLOR,
    opacity: 0.12,
  },
  circle2: {
    position: 'absolute',
    bottom: 40,
    right: -30,
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#3B82F6',
    opacity: 0.08,
  },
  header: {
    alignItems: 'center',
    marginBottom: 35,
  },
  iconBadge: {
    width: 75,
    height: 75,
    borderRadius: 22,
    backgroundColor: 'rgba(99, 102, 241, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.2)',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: '#F8FAFC',
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 14,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 20,
    lineHeight: 20,
  },
  card: {
    backgroundColor: '#0F172A',
    borderRadius: 28,
    padding: 24,
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 8,
  },
  inputGroup: {
    gap: 14,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#020617',
    borderRadius: 14,
    paddingHorizontal: 15,
    height: 54,
    borderWidth: 1,
    borderColor: '#1E293B',
  },
  textInput: {
    flex: 1,
    color: '#F1F5F9',
    marginLeft: 10,
    fontSize: 15,
  },
  signUpBtn: {
    backgroundColor: PRIMARY_COLOR,
    height: 54,
    borderRadius: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginTop: 25,
    shadowColor: PRIMARY_COLOR,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signUpBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 30,
    paddingBottom: 20,
  },
  footerText: {
    color: '#64748B',
    fontSize: 15,
  },
  signInText: {
    color: PRIMARY_COLOR,
    fontSize: 15,
    fontWeight: 'bold',
  },
});

export default Register;



