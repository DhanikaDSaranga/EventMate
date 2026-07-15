import { Tabs } from "expo-router"
import { MaterialIcons } from "@expo/vector-icons"

const tabs = [
  { name: "home", icon: "grid-view", title: "Home" },
  { name: "events", icon: "event", title: "My Events" }, 
  { name: "expenses", icon: "account-balance-wallet", title: "Budget" }, 
  { name: "profile", icon: "person", title: "Profile" },
] as const

const DashboardLayout = () => {
  return (
    <Tabs 
      screenOptions={{ 
        headerShown: false,
        tabBarActiveTintColor: '#6366F1', 
        tabBarInactiveTintColor: '#64748B', 
        tabBarLabelStyle: {
            fontSize: 11, 
            fontWeight: '600',
            marginBottom: 8,
        },
        tabBarStyle: {
            backgroundColor: '#0F172A', 
            height: 70,
            paddingTop: 10,
            borderTopWidth: 1,
            borderTopColor: '#1E293B',
            elevation: 0,           
            shadowOpacity: 0,      
        }
      }}
    >
      {tabs.map((tab) => (
        <Tabs.Screen
          key={tab.name}
          name={tab.name}
          options={{
            title: tab.title,
            tabBarIcon: ({ color, focused }) => (
              <MaterialIcons 
                name={tab.icon as any} 
                size={26} 
                color={color} 
                style={{ marginBottom: focused ? 2 : 0 }}
              />
            ),
          }}
        />
      ))}

    </Tabs>
  )
}

export default DashboardLayout