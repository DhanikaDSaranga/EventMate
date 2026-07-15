import { View, ActivityIndicator, StyleSheet, Text, StatusBar as RNStatusBar } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import useAuth from '@/hooks/useAuth';
import { Redirect } from 'expo-router';

const index = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar style="light" />
        
        <View style={styles.contentContainer}>

          <Text style={[styles.appName, { color: '#6366F1' }]}>EventMate</Text>
          <Text style={styles.tagline}>Plan your next event</Text>

          <View style={styles.indicatorWrapper}>

            <ActivityIndicator size="large" color="#6366F1" /> 
          </View>
        </View>
      </View>
    );
}

  return user ? <Redirect href="/home" /> : <Redirect href="/login" />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A', 
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 42,
    fontWeight: 'bold',
    color: '#F43F5E', 
    marginBottom: 5,
    letterSpacing: 1,
  },
  tagline: {
    fontSize: 16,
    color: '#94A3B8', 
    marginBottom: 40,
  },
  indicatorWrapper: {
    marginBottom: 150,
  }
});

export default index;