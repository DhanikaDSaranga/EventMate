import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import useAuth from '@/hooks/useAuth';
import { useRouter, useFocusEffect } from 'expo-router';
import { getAllEvents } from '@/services/eventService';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#6366F1';

const Home = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ count: 0, budget: 0 });

  const loadDashboardData = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data.slice(0, 3));

      let totalB = 0;
      data.forEach((t: any) => totalB += (Number(t.budget) || 0));

      setStats({ count: data.length, budget: totalB });
    } catch (error) {
      console.error("Home Data Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDashboardData();
    }, [])
  );

  const renderEventCard = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.tripCard}
      activeOpacity={0.8}
      onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
    >
      <View style={styles.tripIconBox}>
        <FontAwesome5 name={item.travelMode === 'Flight' ? 'plane' : 'map-marker-alt'} size={18} color={PRIMARY_COLOR} />
      </View>
      <View style={styles.tripInfo}>
        <Text style={styles.destinationText} numberOfLines={1}>{item.destination}</Text>
        <Text style={styles.dateText}>{item.date}</Text>
      </View>
      <Text style={styles.cardAmount}>Rs. {Number(item.budget).toLocaleString()}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* 1. Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.welcomeText}>Hello Organizer,</Text>
          <Text style={styles.userName}>{user?.email?.split('@')[0] || 'Member'}</Text>
        </View>
        <TouchableOpacity style={styles.profileIcon} onPress={() => router.push('/profile')}>
          <Ionicons name="person-outline" size={22} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

        {/* 2. Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{stats.count}</Text>
            <Text style={styles.statLabel}>Total Events</Text>
          </View>
          <View style={[styles.statCard, { backgroundColor: PRIMARY_COLOR, alignItems: 'center' }]}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ fontSize: 15, fontWeight: '800', color: 'rgba(255,255,255,0.7)' }}>Rs.</Text>
              <Text style={[styles.statNumber, { color: '#fff', fontSize: 22, marginTop: -2 }]} numberOfLines={1} adjustsFontSizeToFit>
                {stats.budget.toLocaleString()}
              </Text>
            </View>
            <Text style={[styles.statLabel, { color: 'rgba(255,255,255,0.8)', marginTop: 4 }]}>Total Budget</Text>
          </View>
        </View>

        {/* 3. QUICK ACTION CARDS  */}
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.actionRow}>
          {/* Card 1: My Events */}
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/events')}>
            <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(99, 102, 241, 0.1)' }]}>
              <Ionicons name="map-outline" size={24} color={PRIMARY_COLOR} />
            </View>
            <Text style={styles.actionLabel}>Event List</Text>
          </TouchableOpacity>

          {/* Card 2: Add New Event */}
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/events/form')}>
            <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(16, 185, 129, 0.1)' }]}>
              <Ionicons name="add-circle-outline" size={24} color="#10B981" />
            </View>
            <Text style={styles.actionLabel}>Plan Event</Text>
          </TouchableOpacity>

          {/* Card 3: Expenses */}
          <TouchableOpacity style={styles.actionCard} onPress={() => router.push('/expenses')}>
            <View style={[styles.actionIconCircle, { backgroundColor: 'rgba(245, 158, 11, 0.1)' }]}>
              <Ionicons name="wallet-outline" size={24} color="#F59E0B" />
            </View>
            <Text style={styles.actionLabel}>Budget</Text>
          </TouchableOpacity>
        </View>

        {/* 4. Recent Adventures */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Events</Text>
          <TouchableOpacity onPress={() => router.push('/events')}>
            <Text style={styles.viewAll}>View All</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <ActivityIndicator size="small" color={PRIMARY_COLOR} style={{ marginTop: 20 }} />
        ) : events.length > 0 ? (
          <FlatList
            data={events}
            renderItem={renderEventCard}
            keyExtractor={(item) => item.id}
            scrollEnabled={false}
          />
        ) : (
          <View style={styles.emptyState}>
            <MaterialCommunityIcons name="map-marker-off" size={50} color="#1E293B" />
            <Text style={styles.emptyText}>No events found.</Text>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 25, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  welcomeText: { color: '#64748B', fontSize: 16 },
  userName: { color: '#F8FAFC', fontSize: 24, fontWeight: '800', textTransform: 'capitalize' },
  profileIcon: { width: 45, height: 45, borderRadius: 15, backgroundColor: '#0F172A', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },

  scrollContent: { paddingHorizontal: 25 },

  statsRow: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  statCard: { flex: 1, backgroundColor: '#0F172A', borderRadius: 22, padding: 20, borderWidth: 1, borderColor: '#1E293B' },
  statNumber: { fontSize: 24, fontWeight: '800', color: PRIMARY_COLOR },
  statLabel: { fontSize: 12, color: '#64748B', marginTop: 4, fontWeight: '600', textTransform: 'uppercase' },

  // Quick Action Cards
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 30 },
  actionCard: { width: (width - 80) / 3, backgroundColor: '#0F172A', borderRadius: 20, paddingVertical: 20, alignItems: 'center', borderWidth: 1, borderColor: '#1E293B' },
  actionIconCircle: { width: 50, height: 50, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  actionLabel: { color: '#F1F5F9', fontSize: 12, fontWeight: '700' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#F1F5F9', marginBottom: 15 },
  viewAll: { color: PRIMARY_COLOR, fontSize: 14, fontWeight: '600' },

  tripCard: { backgroundColor: '#0F172A', borderRadius: 22, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1E293B' },
  tripIconBox: { width: 45, height: 45, borderRadius: 12, backgroundColor: 'rgba(99, 102, 241, 0.05)', justifyContent: 'center', alignItems: 'center' },
  tripInfo: { flex: 1, marginLeft: 15 },
  destinationText: { color: '#F1F5F9', fontSize: 15, fontWeight: '700' },
  dateText: { color: '#64748B', fontSize: 12, marginTop: 2 },
  cardAmount: { color: '#F1F5F9', fontSize: 15, fontWeight: '800' },

  emptyState: { alignItems: 'center', marginTop: 30, opacity: 0.5 },
  emptyText: { color: '#64748B', marginTop: 10 },
});

export default Home;