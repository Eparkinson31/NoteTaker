import Ionicons from "@expo/vector-icons/Ionicons";
import { Tabs } from "expo-router";

// The Layout component defines the structure of the app's navigation using the Tabs component from expo-router.
// It sets up a single tab for the "Home" screen, which is linked to the index.tsx file.
// The tab includes an icon from Ionicons and custom styling for the active tint color.
// The header is hidden for this screen.
export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: "#b03924",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
