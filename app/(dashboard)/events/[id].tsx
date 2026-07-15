import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Dimensions } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { MaterialIcons, FontAwesome6, Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons'
import { getEventById, deleteEvent, updateEvent, markAsCompleted } from '@/services/eventService'
import useLoader from '@/hooks/useLoader'
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');
const PRIMARY_COLOR = '#6366F1';

const EventDetails = () => {
  const { id } = useLocalSearchParams();
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();
  const [event, setEvent] = useState<any>(null);

  const loadEvent = async () => {
    if (!id) return;
    showLoader();
    try {
      const data = await getEventById(id as string);
      setEvent(data);
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Could not load event details.' });
    } finally {
      hideLoader();
    }
  };

  useEffect(() => { loadEvent(); }, [id]);

  const handleDelete = async () => {
    Alert.alert("Delete Event", "Are you sure you want to cancel this event?", [
      { text: "No" },
      {
        text: "Yes, Delete",
        style: 'destructive',
        onPress: async () => {
          showLoader();
          try {
            await deleteEvent(id as string);
            Toast.show({ type: 'success', text1: 'Event Removed', text2: 'Event deleted successfully 🗑️' });
            router.back();
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to delete event ❌' });
          } finally {
            hideLoader();
          }
        }
      }
    ]);
  };

  const handleComplete = async () => {
    Alert.alert("Complete Event", "Did you finish this event? Mark it as completed!", [
      { text: "No" },
      {
        text: "Yes, Completed",
        onPress: async () => {
          showLoader();
          try {
            await markAsCompleted(id as string);

            Toast.show({
              type: 'success',
              text1: 'Event Finished! 🎊',
              text2: 'Event marked as completed successfully.'
            });

            router.back();
          } catch (error) {
            Toast.show({ type: 'error', text1: 'Error', text2: 'Something went wrong!' });
          } finally {
            hideLoader();
          }
        }
      }
    ]);
  };


  if (!event) return (
    <View style={[styles.container, { justifyContent: 'center' }]}>
      <StatusBar style="light" />
      <Text style={{ color: '#64748B', textAlign: 'center' }}>Loading event details...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.glowTop} />

      {/* TOP NAVIGATION BAR */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Event <Text style={{ color: PRIMARY_COLOR }}>Details</Text></Text>
        <TouchableOpacity
          onPress={() => router.push({ pathname: '/events/edit', params: { id: id } })}
          style={styles.navBtn}
        >
          <Feather name="edit-3" size={20} color={PRIMARY_COLOR} />
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>

        {/* PROFILE/HEADER SECTION */}
        <View style={styles.tripHeader}>
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={'calendar-star'}
              size={45} color={PRIMARY_COLOR}
            />
          </View>
          <Text style={styles.destinationName}>{event.destination}</Text>
          <View style={styles.dateBadge}>
            <Ionicons name="calendar-outline" size={14} color="#94A3B8" />
            <Text style={styles.dateText}>{event.date}</Text>
          </View>
        </View>

        {/* INFO CARD */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>EVENT SUMMARY</Text>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <Text style={styles.rowTitle}>Budget</Text>
              <Text style={styles.rowValue}>${event.budget}</Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.rowTitle}>Event Type</Text>
              <Text style={styles.rowValue}>{event.travelMode || 'General'}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          <View style={styles.statusRow}>
            <View style={styles.statusInfo}>
              <Text style={styles.rowTitle}>Status</Text>
              <Text style={[styles.statusText, { color: event.isBooked ? '#10B981' : '#F59E0B' }]}>
                {event.isBooked ? 'Confirmed' : 'Pending'}
              </Text>
            </View>
            <Ionicons
              name={event.isBooked ? "checkmark-circle" : "time-outline"}
              size={24} color={event.isBooked ? '#10B981' : '#F59E0B'}
            />
          </View>
        </View>

        {/* NOTES CARD */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>EVENT NOTES</Text>
          <Text style={styles.notesText}>
            {event.notes || "No special notes for this event. Add some reminders to stay organized!"}
          </Text>
        </View>

        {/* ACTION BUTTONS */}
        <TouchableOpacity
          style={styles.completeBtn}
          activeOpacity={0.8}
          onPress={handleComplete}
        >
          <MaterialIcons name="verified" size={20} color="white" />
          <Text style={styles.completeBtnText}>MARK AS COMPLETED</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Text style={styles.deleteBtnText}>Remove this Event Plan</Text>
        </TouchableOpacity>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  glowTop: { position: 'absolute', top: -50, right: -50, width: 200, height: 200, borderRadius: 100, backgroundColor: PRIMARY_COLOR, opacity: 0.1 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60, marginBottom: 20 },
  navBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E293B' },
  headerTitle: { fontSize: 22, fontWeight: '800', color: '#F8FAFC' },

  scrollContent: { paddingHorizontal: 25, paddingBottom: 50 },

  // Header Section
  tripHeader: { alignItems: 'center', marginBottom: 30, marginTop: 10 },
  iconCircle: { width: 90, height: 90, borderRadius: 30, backgroundColor: 'rgba(99, 102, 241, 0.1)', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: 'rgba(99, 102, 241, 0.2)' },
  destinationName: { fontSize: 28, fontWeight: '900', color: '#F1F5F9', marginTop: 15, textAlign: 'center' },
  dateBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#0F172A', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10, marginTop: 10, gap: 6 },
  dateText: { color: '#94A3B8', fontSize: 13, fontWeight: '600' },

  // Card Styles
  card: { backgroundColor: '#0F172A', borderRadius: 28, padding: 22, marginBottom: 20, borderWidth: 1, borderColor: '#1E293B' },
  cardLabel: { fontSize: 10, fontWeight: '900', color: '#475569', letterSpacing: 1.5, marginBottom: 15 },
  infoRow: { flexDirection: 'row', justifyContent: 'space-between' },
  infoItem: { flex: 1 },
  rowTitle: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  rowValue: { fontSize: 18, color: '#F1F5F9', fontWeight: 'bold' },
  divider: { height: 1, backgroundColor: '#1E293B', marginVertical: 18 },
  statusRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  statusInfo: { flex: 1 },
  statusText: { fontSize: 16, fontWeight: '700' },

  notesText: { fontSize: 15, color: '#94A3B8', lineHeight: 22 },

  // Action Buttons
  completeBtn: { backgroundColor: PRIMARY_COLOR, height: 60, borderRadius: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: 10, gap: 10 },
  completeBtnText: { color: 'white', fontSize: 16, fontWeight: 'bold', letterSpacing: 0.5 },
  deleteBtn: { marginTop: 25, padding: 10, alignItems: 'center' },
  deleteBtnText: { color: '#475569', fontSize: 14, fontWeight: '600', textDecorationLine: 'underline' }
});

export default EventDetails;