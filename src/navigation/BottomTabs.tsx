import { Ionicons } from "@expo/vector-icons";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import DiningScreen from "../screens/DiningScreen";
import HomeScreen from "../screens/HomeScreen";
import ProfileScreen from "../screens/ProfileScreen";
import { RoomsScreen } from "../screens/RoomsScreen"; // <- add this
import WellnessScreen from "../screens/WellnessScreen";

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#111827",
          borderTopWidth: 0,
        },
        tabBarActiveTintColor: "white",
        tabBarInactiveTintColor: "#6B7280",
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          if (route.name === "Home") {
            iconName = focused ? "home" : "home-outline";
          } else if (route.name === "Rooms") {
            iconName = focused ? "bed" : "bed-outline";
          } else if (route.name === "Dining") {
            iconName = focused ? "restaurant" : "restaurant-outline";
          } else if (route.name === "Wellness") {
            iconName = focused ? "fitness" : "fitness-outline";
          } else if (route.name === "Profile") {
            iconName = focused ? "person" : "person-outline";
          } else {
            iconName = "help-outline";
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Rooms" component={RoomsScreen} />
      <Tab.Screen name="Dining" component={DiningScreen} />
      <Tab.Screen name="Wellness" component={WellnessScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
