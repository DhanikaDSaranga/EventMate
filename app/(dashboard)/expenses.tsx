import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  FlatList,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getAllEvents } from '@/services/eventService';
import { useFocusEffect } from 'expo-router';

const PRIMARY_COLOR = '#6366F1'; // Premium Indigo

const Expenses = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, booked: 0, count: 0 });

  const loadData = async () => {
    setLoading(true);
    try {
      const data = await getAllEvents();
      setEvents(data);

      // 🧮 Calculations:
      let totalBudget = 0;
      let bookedBudget = 0;

      data.forEach((event: any) => {
        const b = Number(event.budget) || 0;
        totalBudget += b;
        if (event.isBooked) {
          bookedBudget += b;
        }
      });

      setStats({
        total: totalBudget,
        booked: bookedBudget,
        count: data.length
      });
    } catch (error) {
      console.error("Error loading expense data:", error);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [])
  );

  const renderBudgetBreakdown = ({ item }: { item: any }) => (
    <View style={styles.expenseCard}>
      <View style={[styles.iconBox, { backgroundColor: item.isBooked ? 'rgba(16, 185, 129, 0.1)' : 'rgba(99, 102, 241, 0.1)' }]}>
        <MaterialCommunityIcons 
          name={item.isBooked ? "check-decagram" : "clock-outline"} 
          size={20} 
          color={item.isBooked ? "#10B981" : PRIMARY_COLOR} 
        />
      </View>
      <View style={styles.expenseInfo}>
        <Text style={styles.expenseTitle} numberOfLines={1}>{item.destination}</Text>
        <Text style={styles.expenseSub}>{item.isBooked ? 'Confirmed Stay' : 'Planning Stage'}</Text>
      </View>
      <Text style={styles.expenseAmount}>Rs. {Number(item.budget).toLocaleString()}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Budget <Text style={{ color: PRIMARY_COLOR }}>Overview</Text></Text>
      </View>

      {loading ? (
        <View style={styles.loaderBox}>
          <ActivityIndicator size="large" color={PRIMARY_COLOR} />
        </View>
      ) : (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
          
          {/* Main Stats Card */}
          <View style={styles.overviewCard}>
            <View style={styles.budgetRow}>
              <View>
                <Text style={styles.overviewLabel}>Total Planned</Text>
                <Text style={styles.totalSpentText}>Rs. {stats.total.toLocaleString()}</Text>
              </View>
              <View style={styles.budgetLeftBox}>
                <Text style={styles.overviewLabel}>Confirmed</Text>
                <Text style={styles.remainingText}>Rs. {stats.booked.toLocaleString()}</Text>
              </View>
            </View>

            {/* Simple Progress Bar (Confirmed vs Total) */}
            <View style={styles.progressBarBg}>
              <View 
                style={[
                    styles.progressBarFill, 
                    { width: stats.total > 0 ? `${(stats.booked / stats.total) * 100}%` : '0%' }
                ]} 
              />
            </View>
            <Text style={styles.progressText}>
                {stats.total > 0 ? ((stats.booked / stats.total) * 100).toFixed(0) : 0}% Budget Confirmed
            </Text>
          </View>

          {/* Budget Breakdown List */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Event Allocations</Text>
            <Text style={styles.tripCount}>{stats.count} Events</Text>
          </View>

          {events.length > 0 ? (
            <FlatList
              data={events}
              renderItem={renderBudgetBreakdown}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          ) : (
            <View style={styles.emptyBox}>
               <Ionicons name="wallet-outline" size={50} color="#1E293B" />
               <Text style={styles.emptyText}>No budgets planned yet.</Text>
            </View>
          )}

          <View style={{ height: 100 }} />
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#020617' },
  header: { paddingTop: 60, paddingHorizontal: 25, paddingBottom: 20 },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#F8FAFC' },
  scrollContent: { paddingHorizontal: 25 },
  loaderBox: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  
  overviewCard: { backgroundColor: '#0F172A', borderRadius: 30, padding: 25, borderWidth: 1, borderColor: '#1E293B', marginBottom: 30 },
  budgetRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  overviewLabel: { color: '#64748B', fontSize: 13, fontWeight: '600', textTransform: 'uppercase' },
  totalSpentText: { color: '#F8FAFC', fontSize: 26, fontWeight: '800', marginTop: 5 },
  budgetLeftBox: { alignItems: 'flex-end' },
  remainingText: { color: '#10B981', fontSize: 22, fontWeight: '800', marginTop: 5 },
  
  progressBarBg: { height: 10, backgroundColor: '#1E293B', borderRadius: 5, overflow: 'hidden' },
  progressBarFill: { height: '100%', backgroundColor: PRIMARY_COLOR },
  progressText: { color: '#64748B', fontSize: 12, marginTop: 10, textAlign: 'right' },

  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#F1F5F9' },
  tripCount: { color: PRIMARY_COLOR, fontSize: 13, fontWeight: 'bold' },

  expenseCard: { backgroundColor: '#0F172A', borderRadius: 22, padding: 15, flexDirection: 'row', alignItems: 'center', marginBottom: 12, borderWidth: 1, borderColor: '#1E293B' },
  iconBox: { width: 45, height: 45, borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  expenseInfo: { flex: 1, marginLeft: 15 },
  expenseTitle: { color: '#F1F5F9', fontSize: 15, fontWeight: '700' },
  expenseSub: { color: '#64748B', fontSize: 12, marginTop: 2 },
  expenseAmount: { color: '#F1F5F9', fontSize: 16, fontWeight: '800' },

  emptyBox: { alignItems: 'center', marginTop: 40, opacity: 0.5 },
  emptyText: { color: '#64748B', marginTop: 10, fontSize: 15 }
});

export default Expenses;