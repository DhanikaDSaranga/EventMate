import { getAllEvents } from '@/services/eventService' 
import { Feather, Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons'
import { useFocusEffect, useRouter } from 'expo-router'
import React, { useCallback, useState } from 'react'
import { 
  ActivityIndicator, 
  Dimensions, 
  FlatList, 
  StyleSheet, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  View 
} from 'react-native'
import Toast from 'react-native-toast-message'
import { StatusBar } from 'expo-status-bar';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#6366F1'; // Indigo

const EventList = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const loadEvents = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents(); 
      setEvents(data);
    } catch (error) {
      console.error("Error loading events:", error);
      Toast.show({
        type: 'error',
        text1: 'Failed to load events',
        text2: 'Please try again later.',
      });
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadEvents();
    }, [])
  );

  const filteredEvents = events.filter(event =>
    event.destination.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderEventCard = ({ item }: any) => {
    return (
      <TouchableOpacity
        onPress={() => router.push({ pathname: '/events/[id]', params: { id: item.id } })}
        style={styles.card}
      >
        <View style={styles.cardLeft}>
          <View style={styles.iconBox}>
             <MaterialIcons name="event" size={24} color={PRIMARY_COLOR} />
          </View>
          <View style={styles.info}>
            <Text style={styles.destinationText} numberOfLines={1} ellipsizeMode="tail">
                {item.destination}
            </Text>
            <Text style={styles.dateText}>{item.date || 'No date set'}</Text>
          </View>
        </View>

        <View style={styles.cardRight}>
          <Text style={styles.budgetText}>Rs. {Number(item.budget).toLocaleString()}</Text>
          <View style={[styles.statusBadge, { backgroundColor: item.status === 'Completed' ? '#1E293B' : 'rgba(99, 102, 241, 0.1)' }]}>
             <Text style={[styles.statusLabel, { color: item.status === 'Completed' ? '#94A3B8' : PRIMARY_COLOR }]}>
                {item.status || 'Upcoming'}
             </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* HEADER SECTION */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.brandTitle}>My <Text style={{ color: PRIMARY_COLOR }}>Events</Text></Text>
            <Text style={styles.headerSub}>PLAN EVERYTHING</Text>
          </View>
          <TouchableOpacity style={styles.profileBtn} onPress={() => router.push('/profile')}>
            <Ionicons name="person-circle-outline" size={32} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <Feather name="search" size={18} color="#64748B" />
          <TextInput
            placeholder="Search by event title/location..."
            placeholderTextColor="#64748B"
            style={styles.searchInput}
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* LIST SECTION */}
      <View style={styles.listContainer}>
        {loading ? (
          <View style={styles.loaderCenter}>
            <ActivityIndicator size="large" color={PRIMARY_COLOR} />
            <Text style={styles.loadingText}>Loading your events...</Text>
          </View>
        ) : (
          <FlatList
            data={filteredEvents}
            renderItem={renderEventCard}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.listContent}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.listHeader}>
                <Text style={styles.listHeaderTitle}>Your Planned Events</Text>
                <Text style={styles.listHeaderCount}>{filteredEvents.length} Total</Text>
              </View>
            }
            ListEmptyComponent={
              <View style={styles.emptyContainer}>
                <FontAwesome5 name="calendar-alt" size={60} color="#1E293B" />
                <Text style={styles.emptyText}>No events found. Start planning!</Text>
              </View>
            }
          />
        )}
      </View>

      {/* FLOATING ACTION BUTTON */}
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => router.push('/events/form')}
        style={styles.fab}
      >
        <Ionicons name="add" size={32} color="white" />
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  
  header: { paddingTop: 60, paddingBottom: 25, paddingHorizontal: 25, zIndex: 1 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  brandTitle: { fontSize: 28, fontWeight: '900', color: '#F8FAFC' },
  headerSub: { color: '#64748B', fontSize: 10, fontWeight: 'bold', letterSpacing: 1.5, marginTop: 2 },
  profileBtn: { padding: 5 },
  
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', borderRadius: 16, paddingHorizontal: 15, height: 52, borderWidth: 1, borderColor: '#1E293B' },
  searchInput: { flex: 1, marginLeft: 10, fontSize: 15, color: '#F1F5F9' },

  listContainer: { flex: 1 },
  listContent: { paddingHorizontal: 25, paddingTop: 10, paddingBottom: 100 },
  listHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15, alignItems: 'center' },
  listHeaderTitle: { color: '#64748B', fontSize: 11, fontWeight: '900', textTransform: 'uppercase', letterSpacing: 1 },
  listHeaderCount: { color: PRIMARY_COLOR, fontSize: 11, fontWeight: 'bold' },

  card: {
    backgroundColor: '#0F172A', 
    borderRadius: 24, 
    padding: 18,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 16, 
    borderWidth: 1, 
    borderColor: '#1E293B',
  },
  cardLeft: { 
    flexDirection: 'row', 
    alignItems: 'center',
    flex: 1, 
    marginRight: 10,
  },
  iconBox: { width: 48, height: 48, borderRadius: 14, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center' },
  info: { 
    marginLeft: 15,
    flex: 1,
  },
  destinationText: { fontSize: 16, fontWeight: 'bold', color: '#F1F5F9' },
  dateText: { color: '#64748B', fontSize: 13, marginTop: 3 },
  
  cardRight: { 
    alignItems: 'flex-end',
    minWidth: 80, 
  },
  budgetText: { fontSize: 15, fontWeight: '800', color: '#F1F5F9' },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, marginTop: 8 },
  statusLabel: { fontSize: 10, fontWeight: 'bold', textTransform: 'uppercase' },

  loaderCenter: { flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: 50 },
  loadingText: { color: '#64748B', marginTop: 10 },

  fab: { position: 'absolute', bottom: 30, right: 25, backgroundColor: PRIMARY_COLOR, width: 65, height: 65, borderRadius: 22, alignItems: 'center', justifyContent: 'center', elevation: 8, shadowColor: PRIMARY_COLOR, shadowOpacity: 0.4, shadowRadius: 10 },
  emptyContainer: { alignItems: 'center', marginTop: 80, opacity: 0.5 },
  emptyText: { color: '#64748B', fontSize: 15, fontWeight: '600', marginTop: 15 }
});

export default EventList;