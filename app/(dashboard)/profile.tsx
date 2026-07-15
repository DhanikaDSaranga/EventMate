import { View, Text, StyleSheet, TouchableOpacity, StatusBar, Dimensions, Alert, ScrollView } from 'react-native'
import React from 'react'
import { MaterialIcons, Ionicons, FontAwesome6, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import { auth } from '@/services/firebaseConfig'
import { logout } from '@/services/auth'
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#6366F1'; // Premium Indigo

const Profile = () => {
  const router = useRouter();
  const user = auth.currentUser;

  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to end your session?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: async () => {
          try {
            await logout();
            Toast.show({
              type: 'success',
              text1: 'Logged Out',
              text2: 'Safe travels! See you soon. 👋',
            });
            router.replace('/login');
          } catch (error) {
            Toast.show({
              type: 'error',
              text1: 'Logout Failed',
              text2: 'Could not complete the request.',
            });
          }
        }
      }
    ]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* BACKGROUND GLOWS */}
      <View style={styles.glowTop} />
      <View style={styles.glowBottom} />

      {/* HEADER */}
      <View style={styles.header}>
        <Text style={styles.headerTitleText}>My <Text style={{ color: PRIMARY_COLOR }}>Profile</Text></Text>
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#F8FAFC" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* PROFILE INFO CARD */}
        <View style={styles.profileCard}>
          <View style={styles.avatarCircle}>
            <MaterialCommunityIcons name="account-tie-outline" size={50} color={PRIMARY_COLOR} />
          </View>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Organizer Name'}</Text>
          <Text style={styles.userEmail}>{user?.email}</Text>
          
          <View style={styles.badge}>
            <MaterialCommunityIcons name="shield-check" size={14} color="#fff" />
            <Text style={styles.badgeText}>PRO ORGANIZER</Text>
          </View>

          {/* Quick Stats inside card */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statVal}>12</Text>
              <Text style={styles.statLab}>Events</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statVal}>05</Text>
              <Text style={styles.statLab}>Countries</Text>
            </View>
          </View>
        </View>

        {/* SETTINGS OPTIONS */}
        <View style={styles.optionsContainer}>
          <SettingItem icon="notifications-none" label="App Notifications" />
          <SettingItem icon="history" label="Event History" />
          <SettingItem icon="help-outline" label="Help & Support" />
          <SettingItem icon="info-outline" label="About EventMate" />
        </View>

        {/* LOGOUT BUTTON */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <MaterialIcons name="logout" size={20} color="white" />
          <Text style={styles.logoutText}>LOGOUT</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>EventMate v1.0.0</Text>

      </ScrollView>
    </View>
  )
}

const SettingItem = ({ icon, label }: any) => (
  <TouchableOpacity style={styles.item}>
    <View style={styles.itemLeft}>
      <View style={styles.itemIconBg}>
        <MaterialIcons name={icon} size={20} color={PRIMARY_COLOR} />
      </View>
      <Text style={styles.itemLabel}>{label}</Text>
    </View>
    <MaterialIcons name="chevron-right" size={22} color="#334155" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },

  glowTop: { position: 'absolute', top: -100, right: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: PRIMARY_COLOR, opacity: 0.1 },
  glowBottom: { position: 'absolute', bottom: -100, left: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: PRIMARY_COLOR, opacity: 0.05 },

  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60, paddingBottom: 15 },
  headerTitleText: { fontSize: 26, fontWeight: '900', color: '#F8FAFC' },
  notifBtn: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E293B' },

  scrollContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 100, alignItems: 'center' },

  profileCard: {
    backgroundColor: '#0F172A', width: '100%', borderRadius: 35, padding: 30, alignItems: 'center',
    borderWidth: 1, borderColor: '#1E293B', marginBottom: 25
  },
  avatarCircle: { width: 90, height: 90, borderRadius: 30, backgroundColor: 'rgba(99, 102, 241, 0.1)', justifyContent: 'center', alignItems: 'center', marginBottom: 15, borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' },
  userName: { fontSize: 24, fontWeight: '900', color: '#F1F5F9', textTransform: 'capitalize' },
  userEmail: { fontSize: 14, color: '#64748B', marginTop: 4, fontWeight: '500' },
  badge: { backgroundColor: PRIMARY_COLOR, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, marginTop: 15, flexDirection: 'row', alignItems: 'center', gap: 6 },
  badgeText: { color: 'white', fontSize: 10, fontWeight: 'bold', letterSpacing: 1 },

  statsRow: { flexDirection: 'row', marginTop: 25, paddingTop: 20, borderTopWidth: 1, borderTopColor: '#1E293B', width: '100%', justifyContent: 'center', gap: 40 },
  statItem: { alignItems: 'center' },
  statVal: { color: '#F8FAFC', fontSize: 18, fontWeight: '800' },
  statLab: { color: '#64748B', fontSize: 12 },
  statDivider: { width: 1, height: 30, backgroundColor: '#1E293B' },

  optionsContainer: { width: '100%', gap: 12 },
  item: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    backgroundColor: '#0F172A', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: '#1E293B'
  },
  itemLeft: { flexDirection: 'row', alignItems: 'center' },
  itemIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: 'rgba(99, 102, 241, 0.08)', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  itemLabel: { fontSize: 15, fontWeight: '600', color: '#F1F5F9' },

  logoutBtn: {
    backgroundColor: '#EF4444', width: '100%', height: 60, borderRadius: 20,
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 30,
    shadowColor: '#EF4444', shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  logoutText: { color: 'white', fontSize: 16, fontWeight: 'bold', marginLeft: 10, letterSpacing: 1 },

  versionText: { marginTop: 30, color: '#334155', fontSize: 12, fontWeight: '600', letterSpacing: 1 }
});

export default Profile;