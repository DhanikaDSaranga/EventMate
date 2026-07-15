import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, Dimensions } from 'react-native'
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react'
import { MaterialIcons, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'
import useLoader from '@/hooks/useLoader'
import { addEvent } from '@/services/eventService'
import Toast from 'react-native-toast-message';

const { width } = Dimensions.get('window');
const PRIMARY_COLOR = '#6366F1'; // Indigo

const AddEvent = () => {
  const router = useRouter();
  const { showLoader, hideLoader } = useLoader();

  // Form States
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [travelMode, setTravelMode] = useState('Party');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);

  const eventTypes = [
    { name: 'Party', icon: 'wine' },
    { name: 'Meeting', icon: 'business' },
    { name: 'Workshop', icon: 'hammer' },
    { name: 'Concert', icon: 'musical-notes' },
    { name: 'Other', icon: 'star' },
  ];

  const handleSave = async () => {
    if (!destination || !date || !budget) {
      Toast.show({ type: 'error', text1: 'Missing Info', text2: 'Please fill in all required fields!' })
      return;
    }

    if (isNaN(Number(budget)) || Number(budget) <= 0) {
      Toast.show({ type: 'error', text1: 'Invalid Budget', text2: 'Please enter a valid amount!' });
      return;
    }

    showLoader();
    try {
      const eventData = {
        destination,
        date,
        travelMode, // Storing Event Type here
        budget: Number(budget),
        notes,
        isBooked,
        status: 'Upcoming', 
        createdAt: new Date().toISOString(),
      };

      await addEvent(eventData);

      Toast.show({ type: 'success', text1: 'Success', text2: 'Event planned successfully! 🎉' });
      router.back();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to save event. Try again!' });
    } finally {
      hideLoader();
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <View style={styles.glowTop} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Plan Your <Text style={{ color: PRIMARY_COLOR }}>Event</Text></Text>
        <View style={{ width: 42 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>

          <View style={styles.formWrapper}>
            <View style={styles.card}>

              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="calendar-plus" size={40} color={PRIMARY_COLOR} />
                <Text style={styles.welcomeText}>New Event</Text>
                <Text style={styles.subText}>What are you planning?</Text>
              </View>

              <View style={styles.inputsArea}>
                {/* Event Title/Location (stored as destination) */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EVENT TITLE / LOCATION</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="place" size={20} color="#64748B" />
                    <TextInput
                      style={styles.input}
                      placeholder="Ex: Birthday Party at Hilton"
                      placeholderTextColor="#475569"
                      value={destination}
                      onChangeText={setDestination}
                    />
                  </View>
                </View>

                {/* Date */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EVENT DATE</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#64748B" />
                    <TextInput
                      style={styles.input}
                      placeholder="Oct 12, 6:00 PM"
                      placeholderTextColor="#475569"
                      value={date}
                      onChangeText={setDate}
                    />
                  </View>
                </View>

                {/* Event Type Selection */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EVENT TYPE</Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeList}>
                    {eventTypes.map((mode) => (
                      <TouchableOpacity
                        key={mode.name}
                        onPress={() => setTravelMode(mode.name)}
                        style={[styles.modeItem, travelMode === mode.name && styles.modeItemActive]}
                      >
                        <Ionicons name={mode.icon as any} size={18} color={travelMode === mode.name ? '#fff' : '#64748B'} />
                        <Text style={[styles.modeText, travelMode === mode.name && styles.modeTextActive]}>{mode.name}</Text>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>

                {/* Budget */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>ESTIMATED BUDGET ($)</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome6 name="money-bill-transfer" size={18} color="#64748B" />
                    <TextInput
                      style={styles.input}
                      placeholder="500"
                      placeholderTextColor="#475569"
                      keyboardType="numeric"
                      value={budget}
                      onChangeText={setBudget}
                    />
                  </View>
                </View>

                {/* Notes */}
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>SHORT NOTES</Text>
                  <View style={[styles.inputContainer, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                    <MaterialIcons name="note-add" size={20} color="#64748B" />
                    <TextInput
                      style={[styles.input, { textAlignVertical: 'top' }]}
                      placeholder="Remember to bring speakers..."
                      placeholderTextColor="#475569"
                      multiline
                      value={notes}
                      onChangeText={setNotes}
                    />
                  </View>
                </View>

                {/* Booking Switch */}
                <View style={styles.switchRow}>
                  <View>
                    <Text style={styles.switchTitle}>Venue Booked</Text>
                    <Text style={styles.switchSub}>Is your venue confirmed?</Text>
                  </View>
                  <Switch
                    value={isBooked}
                    onValueChange={setIsBooked}
                    trackColor={{ false: "#1E293B", true: "rgba(99, 102, 241, 0.4)" }}
                    thumbColor={isBooked ? PRIMARY_COLOR : "#64748B"}
                  />
                </View>
              </View>

              {/* SAVE BUTTON */}
              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleSave}>
                <Text style={styles.saveBtnText}>Create Event</Text>
                <Ionicons name="rocket-outline" size={22} color="white" />
              </TouchableOpacity>

            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' }, 
  glowTop: { position: 'absolute', top: -100, right: -50, width: 250, height: 250, borderRadius: 125, backgroundColor: PRIMARY_COLOR, opacity: 0.1 },

  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60, paddingBottom: 15 },
  navBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E293B' },
  headerTitleText: { fontSize: 22, fontWeight: '900', color: '#F8FAFC' },

  scrollContent: { paddingBottom: 40 },
  formWrapper: { paddingHorizontal: 22, marginTop: 10 },
  card: {
    backgroundColor: '#0F172A', borderRadius: 35, paddingHorizontal: 25, paddingVertical: 30,
    borderWidth: 1, borderColor: '#1E293B', shadowColor: '#000', shadowOpacity: 0.3, shadowRadius: 15, elevation: 10
  },
  cardHeader: { alignItems: 'center', marginBottom: 25 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#F1F5F9', marginTop: 10 },
  subText: { fontSize: 14, color: '#64748B', marginTop: 5 },

  inputsArea: { gap: 15 },
  inputGroup: { marginBottom: 5 },
  label: { fontSize: 10, fontWeight: '900', color: '#475569', letterSpacing: 1.2, marginBottom: 8, marginLeft: 4 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#020617', borderRadius: 16, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#1E293B' },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#F1F5F9' },

  modeList: { flexDirection: 'row', marginBottom: 5 },
  modeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#020617', borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: '#1E293B' },
  modeItemActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  modeText: { color: '#64748B', fontWeight: 'bold', fontSize: 13, marginLeft: 8 },
  modeTextActive: { color: '#fff' },

  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#1E293B' },
  switchTitle: { fontSize: 15, fontWeight: 'bold', color: '#F1F5F9' },
  switchSub: { fontSize: 12, color: '#64748B' },

  saveBtn: {
    backgroundColor: PRIMARY_COLOR, flexDirection: 'row', height: 60, borderRadius: 18,
    alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 10,
    shadowColor: PRIMARY_COLOR, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5
  },
  saveBtnText: { color: 'white', fontSize: 17, fontWeight: 'bold', letterSpacing: 0.5 }
});

export default AddEvent;