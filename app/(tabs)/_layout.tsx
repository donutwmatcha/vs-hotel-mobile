import { HapticTab } from "@/components/haptic-tab";
import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { Platform, StyleSheet } from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: "#14532D",
        tabBarInactiveTintColor: "#000000",
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: Platform.OS === "ios" ? 100 : 80,
          borderRadius: 0,
          backgroundColor: "#FFFFFF",
          borderTopWidth: StyleSheet.hairlineWidth,
          borderTopColor: "#DBDBDB",
          elevation: 0,
          shadowOpacity: 0,
          paddingBottom: Platform.OS === "ios" ? 36 : 24,
          paddingTop: 10,
          paddingHorizontal: 0,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="vs"
        options={{
          title: "VS",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "grid" : "grid-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Request",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "hand-left" : "hand-left-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color, focused }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={26}
              color={color}
            />
          ),
        }}
      />

      {/* Hidden screens */}
      <Tabs.Screen name="booking" options={{ href: null }} />
      <Tabs.Screen name="rooms" options={{ href: null }} />
      <Tabs.Screen name="dining" options={{ href: null }} />
      <Tabs.Screen name="wellness" options={{ href: null }} />
      <Tabs.Screen name="signup" options={{ href: null }} />
      <Tabs.Screen name="signin" options={{ href: null }} />
      <Tabs.Screen name="verify" options={{ href: null }} />
      <Tabs.Screen name="payment" options={{ href: null }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({});
