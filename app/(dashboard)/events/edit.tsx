import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Switch, KeyboardAvoidingView, Platform, StatusBar, Dimensions, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react'
import { MaterialIcons, FontAwesome6, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'
import { useRouter, useLocalSearchParams } from 'expo-router'
import useLoader from '@/hooks/useLoader'
import { getEventById, updateEvent } from '@/services/eventService' 
import Toast from 'react-native-toast-message';

const PRIMARY_COLOR = '#6366F1'; 

const EditEvent = () => {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  const { showLoader, hideLoader } = useLoader();

  // Form States
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  const [budget, setBudget] = useState('');
  const [travelMode, setTravelMode] = useState('Party');
  const [notes, setNotes] = useState('');
  const [isBooked, setIsBooked] = useState(false);
  const [fetching, setFetching] = useState(true);

  const eventTypes = [
    { name: 'Party', icon: 'wine' },
    { name: 'Meeting', icon: 'business' },
    { name: 'Workshop', icon: 'hammer' },
    { name: 'Concert', icon: 'musical-notes' },
    { name: 'Other', icon: 'star' },
  ];

  useEffect(() => {
    const loadEventDetails = async () => {
      try {
        const event: any = await getEventById(id as string);
        if (event) {
          setDestination(event.destination);
          setDate(event.date);
          setBudget(event.budget.toString());
          setTravelMode(event.travelMode || 'Party');
          setNotes(event.notes);
          setIsBooked(event.isBooked);
        }
      } catch (error) {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to load event data!' });
      } finally {
        setFetching(false);
      }
    };
    loadEventDetails();
  }, [id]);

  const handleUpdate = async () => {
    if (!destination || !date || !budget) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Required fields are missing!' });
      return;
    }

    showLoader();
    try {
      const updatedData = {
        destination,
        date,
        travelMode,
        budget: Number(budget),
        notes,
        isBooked,
      };

      await updateEvent(id as string, updatedData);
      Toast.show({ type: 'success', text1: 'Success', text2: 'Event updated successfully! ✨' });
      router.back();
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Error', text2: 'Update failed!' });
    } finally {
      hideLoader();
    }
  };

  if (fetching) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color={PRIMARY_COLOR} />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.glowTop} />

      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.navBtn}>
          <Ionicons name="chevron-back" size={24} color="#F8FAFC" />
        </TouchableOpacity>
        <Text style={styles.headerTitleText}>Edit <Text style={{ color: PRIMARY_COLOR }}>Event</Text></Text>
        <View style={{ width: 42 }} />
      </View>

      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          <View style={styles.formWrapper}>
            <View style={styles.card}>
              
              <View style={styles.cardHeader}>
                <MaterialCommunityIcons name="calendar-edit" size={40} color={PRIMARY_COLOR} />
                <Text style={styles.welcomeText}>Update Plan</Text>
                <Text style={styles.subText}>Refine your event details</Text>
              </View>

              <View style={styles.inputsArea}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EVENT TITLE / LOCATION</Text>
                  <View style={styles.inputContainer}>
                    <MaterialIcons name="place" size={20} color="#64748B" />
                    <TextInput style={styles.input} value={destination} onChangeText={setDestination} />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>EVENT DATE</Text>
                  <View style={styles.inputContainer}>
                    <Ionicons name="calendar-outline" size={20} color="#64748B" />
                    <TextInput style={styles.input} value={date} onChangeText={setDate} />
                  </View>
                </View>

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

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>BUDGET ($)</Text>
                  <View style={styles.inputContainer}>
                    <FontAwesome6 name="money-bill-1" size={18} color="#64748B" />
                    <TextInput style={styles.input} keyboardType="numeric" value={budget} onChangeText={setBudget} />
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>NOTES</Text>
                  <View style={[styles.inputContainer, { height: 80, alignItems: 'flex-start', paddingTop: 12 }]}>
                    <MaterialIcons name="note-add" size={20} color="#64748B" />
                    <TextInput style={[styles.input, { textAlignVertical: 'top' }]} multiline value={notes} onChangeText={setNotes} />
                  </View>
                </View>

                <View style={styles.switchRow}>
                  <Text style={styles.switchTitle}>Confirmed Booking</Text>
                  <Switch value={isBooked} onValueChange={setIsBooked} trackColor={{ false: "#1E293B", true: PRIMARY_COLOR }} />
                </View>
              </View>

              <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8} onPress={handleUpdate}>
                <Text style={styles.saveBtnText}>Update Event</Text>
                <Ionicons name="checkmark-circle-outline" size={22} color="white" />
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
  glowTop: { position: 'absolute', top: -80, right: -40, width: 200, height: 200, borderRadius: 100, backgroundColor: PRIMARY_COLOR, opacity: 0.1 },
  topBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 25, paddingTop: 60, paddingBottom: 15 },
  navBtn: { width: 42, height: 42, borderRadius: 12, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center', borderWidth: 1, borderColor: '#1E293B' },
  headerTitleText: { fontSize: 22, fontWeight: '900', color: '#F8FAFC' },
  scrollContent: { paddingBottom: 40 },
  formWrapper: { paddingHorizontal: 22, marginTop: 10 },
  card: { backgroundColor: '#0F172A', borderRadius: 35, paddingHorizontal: 25, paddingVertical: 30, borderWidth: 1, borderColor: '#1E293B' },
  cardHeader: { alignItems: 'center', marginBottom: 25 },
  welcomeText: { fontSize: 24, fontWeight: 'bold', color: '#F1F5F9', marginTop: 10 },
  subText: { fontSize: 14, color: '#64748B', marginTop: 5 },
  inputsArea: { gap: 15 },
  inputGroup: { marginBottom: 5 },
  label: { fontSize: 10, fontWeight: '900', color: '#475569', letterSpacing: 1.2, marginBottom: 8 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#020617', borderRadius: 16, paddingHorizontal: 15, height: 55, borderWidth: 1, borderColor: '#1E293B' },
  input: { flex: 1, marginLeft: 12, fontSize: 15, color: '#F1F5F9' },
  modeList: { flexDirection: 'row', marginBottom: 5 },
  modeItem: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 15, paddingVertical: 10, backgroundColor: '#020617', borderRadius: 12, marginRight: 10, borderWidth: 1, borderColor: '#1E293B' },
  modeItemActive: { backgroundColor: PRIMARY_COLOR, borderColor: PRIMARY_COLOR },
  modeText: { color: '#64748B', fontWeight: 'bold', fontSize: 13, marginLeft: 8 },
  modeTextActive: { color: '#fff' },
  switchRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 10, paddingTop: 15, borderTopWidth: 1, borderTopColor: '#1E293B' },
  switchTitle: { fontSize: 15, fontWeight: 'bold', color: '#F1F5F9' },
  saveBtn: { backgroundColor: PRIMARY_COLOR, flexDirection: 'row', height: 60, borderRadius: 18, alignItems: 'center', justifyContent: 'center', marginTop: 30, gap: 10 },
  saveBtnText: { color: 'white', fontSize: 17, fontWeight: 'bold' }
});

export default EditEvent;