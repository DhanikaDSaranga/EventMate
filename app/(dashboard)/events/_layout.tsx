import { Stack } from "expo-router";

export default function EventsLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, 
        headerShadowVisible: false,
        headerStyle: { backgroundColor: '#020617' }, 
        headerTitleStyle: { 
          fontWeight: '800', 
          fontSize: 20, 
          color: '#F8FAFC' 
        },
        headerTintColor: '#6366F1', 
        animation: 'slide_from_right', 
      }}
    >

      <Stack.Screen name="index" options={{ title: 'My Events' }} />
      <Stack.Screen name="form" options={{ title: 'Plan New Event' }} />
      <Stack.Screen name="[id]" options={{ title: 'Event Details' }} />
      <Stack.Screen name="edit" options={{ title: 'Edit Event' }} />
    </Stack>
  );
}