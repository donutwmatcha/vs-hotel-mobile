import { Ionicons } from "@expo/vector-icons";
import NetInfo from "@react-native-community/netinfo";
import { useEffect, useRef, useState } from "react";
import { Animated, Text, View } from "react-native";

export default function OfflineBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [wasOffline, setWasOffline] = useState(false);
  const translateY = useRef(new Animated.Value(-60)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      const offline = !state.isConnected || !state.isInternetReachable;
      setIsOffline((prev) => {
        if (!prev && offline) {
          // just went offline
          setWasOffline(true);
        }
        return offline;
      });
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (isOffline) {
      // slide down
      Animated.parallel([
        Animated.spring(translateY, {
          toValue: 0,
          useNativeDriver: true,
          tension: 80,
          friction: 10,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else if (wasOffline) {
      // briefly show "Back online" then slide up
      setTimeout(() => {
        Animated.parallel([
          Animated.timing(translateY, {
            toValue: -60,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      }, 2000);
    }
  }, [isOffline, wasOffline]);

  if (!isOffline && !wasOffline) return null;

  return (
    <Animated.View
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        transform: [{ translateY }],
        opacity,
      }}
    >
      <View
        style={{
          backgroundColor: isOffline ? "#1E293B" : "#14532D",
          paddingTop: 52,
          paddingBottom: 12,
          paddingHorizontal: 16,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
        }}
      >
        <Ionicons
          name={isOffline ? "cloud-offline-outline" : "cloud-done-outline"}
          size={18}
          color="#fff"
        />
        <View style={{ flex: 1 }}>
          <Text style={{ color: "#fff", fontWeight: "700", fontSize: 13 }}>
            {isOffline ? "No Internet Connection" : "Back Online"}
          </Text>
          <Text
            style={{
              color: "rgba(255,255,255,0.7)",
              fontSize: 12,
              marginTop: 1,
            }}
          >
            {isOffline
              ? "Check your connection and try again"
              : "You're connected again"}
          </Text>
        </View>
        {!isOffline && (
          <Ionicons name="checkmark-circle" size={18} color="#86EFAC" />
        )}
      </View>
    </Animated.View>
  );
}
