import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFonts } from "expo-font";
import { router, Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useRef, useState } from "react";
import { Animated, Image, Text, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import OfflineBanner from "../src/components/OfflineBanner";
import { AuthProvider, useAuth } from "../src/context/AuthContext";

SplashScreen.preventAutoHideAsync();

export function LoadingOverlay({ message }: { message: string }) {
  const barWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    barWidth.setValue(0);
    Animated.sequence([
      Animated.timing(barWidth, {
        toValue: 0.8,
        duration: 800,
        useNativeDriver: false,
      }),
      Animated.timing(barWidth, {
        toValue: 0.95,
        duration: 3000,
        useNativeDriver: false,
      }),
    ]).start();
  }, [message]);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#14532D",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Image
        source={require("../src/assets/images/main-logo-white.png")}
        style={{ width: 260, height: 80, marginBottom: 40 }}
        resizeMode="contain"
      />
      <Text
        style={{
          color: "rgba(255,255,255,0.85)",
          fontSize: 15,
          fontWeight: "600",
          marginBottom: 28,
          letterSpacing: 0.3,
          textAlign: "center",
          paddingHorizontal: 40,
        }}
      >
        {message}
      </Text>
      <View
        style={{
          width: 200,
          height: 4,
          backgroundColor: "rgba(255,255,255,0.2)",
          borderRadius: 2,
          overflow: "hidden",
        }}
      >
        <Animated.View
          style={{
            height: "100%",
            backgroundColor: "#C89B3C",
            borderRadius: 2,
            width: barWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
            }),
          }}
        />
      </View>
    </View>
  );
}

function RootLayout() {
  const { loading, loadingMessage } = useAuth();
  const [fontsLoaded] = useFonts({
    "KeplerStd-Italic": require("../src/assets/fonts/KeplerStd-Italic.otf"),
  });
  const [timedOut, setTimedOut] = useState(false);
  const onboardingChecked = useRef(false);

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  // Only check onboarding AFTER both fonts loaded AND auth loading is done
  useEffect(() => {
    if (!fontsLoaded || loading) return;
    if (onboardingChecked.current) return;
    onboardingChecked.current = true;

    AsyncStorage.getItem("vs_hotel_onboarding_done").then((val) => {
      if (val !== "true") router.replace("/(tabs)/onboarding" as any);
    });
  }, [fontsLoaded, loading]);

  // Timeout only for initial app open, not for action loading screens
  useEffect(() => {
    if (!loadingMessage) {
      const timer = setTimeout(() => setTimedOut(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [loadingMessage]);

  if (!fontsLoaded) return <LoadingOverlay message="Loading..." />;
  if (loading && (loadingMessage || !timedOut))
    return <LoadingOverlay message={loadingMessage ?? "Loading..."} />;

  return <Stack screenOptions={{ headerShown: false }} />;
}

export default function Layout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <RootLayout />
        <OfflineBanner />
      </AuthProvider>
    </SafeAreaProvider>
  );
}
