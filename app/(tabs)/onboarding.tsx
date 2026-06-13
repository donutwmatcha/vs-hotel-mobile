import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Dimensions,
  FlatList,
  Image,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");

const G = "#14532D";
const DARK_G = "#0A2E18";
const GOLD = "#C89B3C";
const WHITE = "#FFFFFF";

const LOGO_URI =
  "https://res.cloudinary.com/dadshpos1/image/upload/v1780908235/vs-hotel-icon-logo_u30h0z.png";

const SLIDES = [
  {
    id: "1",
    tag: "BOOK WITH EASE",
    title: "Your Perfect\nRoom Awaits",
    subtitle:
      "Browse our elegant rooms and suites, pick your dates, and confirm your stay; all in minutes.",
    image:
      "https://res.cloudinary.com/dadshpos1/image/upload/f_auto,q_auto:good,w_800/v1781074876/slide-1_fnmwuv.png",
    icon: "bed-outline",
    iconLib: "Ionicons",
  },
  {
    id: "2",
    tag: "VS POINTS",
    title: "Every Stay\nRewarded",
    subtitle:
      "Earn VS Points on bookings, dining, and services. Redeem them for free nights, upgrades, and exclusive perks.",
    image:
      "https://res.cloudinary.com/dadshpos1/image/upload/v1781080627/slide-2_pcsx9i.jpg",
    icon: "star",
    iconLib: "FontAwesome5",
  },
  {
    id: "3",
    tag: "MEMBERS ONLY",
    title: "Unlock\nExclusive Deals",
    subtitle:
      "Join VS Hotel's loyalty program and get access to secret rates, flash sales, and birthday bonuses reserved just for members.",
    image:
      "https://res.cloudinary.com/dadshpos1/image/upload/f_auto,q_auto:good,w_800/v1781074875/slide-3_wexzqn.png",
    icon: "gift-outline",
    iconLib: "Ionicons",
  },
];

const ONBOARDING_KEY = "vs_hotel_onboarding_done";

export async function markOnboardingDone() {
  try {
    await AsyncStorage.setItem(ONBOARDING_KEY, "true");
  } catch {}
}

function SlideIcon({ slide }: { slide: (typeof SLIDES)[0] }) {
  if (slide.iconLib === "FontAwesome5") {
    return (
      <FontAwesome5 name={slide.icon as any} size={14} color={GOLD} solid />
    );
  }
  return <Ionicons name={slide.icon as any} size={16} color={GOLD} />;
}

export default function OnboardingScreen() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideUpAnim = useRef(new Animated.Value(0)).current;
  const dotScales = useRef(
    SLIDES.map((_, i) => new Animated.Value(i === 0 ? 1 : 0.6)),
  ).current;
  const dotWidths = useRef(
    SLIDES.map((_, i) => new Animated.Value(i === 0 ? 28 : 8)),
  ).current;

  useEffect(() => {
    Animated.spring(slideUpAnim, {
      toValue: 1,
      useNativeDriver: true,
      tension: 60,
      friction: 10,
    }).start();
  }, []);

  function animateTransition(nextIndex: number) {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();

    dotScales.forEach((scale, i) => {
      Animated.spring(scale, {
        toValue: i === nextIndex ? 1 : 0.6,
        useNativeDriver: true,
        tension: 80,
        friction: 8,
      }).start();
    });

    dotWidths.forEach((w, i) => {
      Animated.spring(w, {
        toValue: i === nextIndex ? 28 : 8,
        useNativeDriver: false,
        tension: 80,
        friction: 8,
      }).start();
    });
  }

  function goToNext() {
    if (currentIndex < SLIDES.length - 1) {
      const next = currentIndex + 1;
      animateTransition(next);
      setCurrentIndex(next);
      flatListRef.current?.scrollToIndex({ index: next, animated: true });
    } else {
      handleFinish();
    }
  }

  function goToSlide(index: number) {
    animateTransition(index);
    setCurrentIndex(index);
    flatListRef.current?.scrollToIndex({ index, animated: true });
  }

  async function handleFinish() {
    await markOnboardingDone();
    router.replace("/(tabs)/signin" as any);
  }

  async function handleSkip() {
    await markOnboardingDone();
    router.replace("/(tabs)/signin" as any);
  }

  const isLast = currentIndex === SLIDES.length - 1;
  const slide = SLIDES[currentIndex];

  return (
    <View style={{ flex: 1, backgroundColor: DARK_G }}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      {/* Full screen image slider — not interactive, controlled by buttons */}
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        scrollEnabled={false}
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={{ width, height }}>
            <Image
              source={{ uri: item.image }}
              style={{ width, height }}
              resizeMode="cover"
            />
          </View>
        )}
      />

      {/* Full screen gradient overlay on top of images */}
      <LinearGradient
        colors={[
          "rgba(10,46,24,0.45)",
          "rgba(10,46,24,0.15)",
          "rgba(10,46,24,0.1)",
          "rgba(10,46,24,0.75)",
          "rgba(10,46,24,0.97)",
        ]}
        locations={[0, 0.25, 0.45, 0.7, 1]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
      />

      {/* Top bar */}
      <SafeAreaView
        style={{ position: "absolute", top: 0, left: 0, right: 0 }}
        edges={["top"]}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            paddingHorizontal: 24,
            paddingTop: 8,
          }}
        >
          {/* Hotel logo */}
          <Image
            source={{ uri: LOGO_URI }}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
              overflow: "hidden",
            }}
            resizeMode="cover"
          />

          <TouchableOpacity
            onPress={handleSkip}
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 20,
              paddingHorizontal: 16,
              paddingVertical: 7,
              borderWidth: 1,
              borderColor: "rgba(255,255,255,0.2)",
            }}
          >
            <Text style={{ color: WHITE, fontSize: 13, fontWeight: "600" }}>
              Skip
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Bottom content */}
      <Animated.View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          opacity: fadeAnim,
          transform: [
            {
              translateY: slideUpAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [60, 0],
              }),
            },
          ],
        }}
      >
        <SafeAreaView edges={["bottom"]}>
          <View
            style={{
              paddingHorizontal: 28,
              paddingBottom: 36,
              paddingTop: 120,
            }}
          >
            {/* Tag pill */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
                backgroundColor: "rgba(200,155,60,0.18)",
                borderWidth: 1,
                borderColor: "rgba(200,155,60,0.45)",
                alignSelf: "flex-start",
                borderRadius: 20,
                paddingHorizontal: 12,
                paddingVertical: 6,
                marginBottom: 16,
              }}
            >
              <SlideIcon slide={slide} />
              <Text
                style={{
                  color: GOLD,
                  fontSize: 11,
                  fontWeight: "800",
                  letterSpacing: 1.5,
                }}
              >
                {slide.tag}
              </Text>
            </View>

            {/* Title */}
            <Text
              style={{
                color: WHITE,
                fontSize: 40,
                fontWeight: "900",
                lineHeight: 46,
                marginBottom: 14,
                letterSpacing: -0.5,
              }}
            >
              {slide.title}
            </Text>

            {/* Gold divider */}
            <View
              style={{
                width: 40,
                height: 3,
                backgroundColor: GOLD,
                borderRadius: 2,
                marginBottom: 14,
              }}
            />

            {/* Subtitle */}
            <Text
              style={{
                color: "rgba(255,255,255,0.75)",
                fontSize: 15,
                lineHeight: 23,
                marginBottom: 40,
              }}
            >
              {slide.subtitle}
            </Text>

            {/* Dots + CTA row */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              {/* Animated dots */}
              <View
                style={{ flexDirection: "row", gap: 6, alignItems: "center" }}
              >
                {SLIDES.map((_, i) => (
                  <TouchableOpacity key={i} onPress={() => goToSlide(i)}>
                    <Animated.View
                      style={{
                        height: 8,
                        borderRadius: 4,
                        backgroundColor:
                          i === currentIndex ? GOLD : "rgba(255,255,255,0.3)",
                        width: dotWidths[i],
                      }}
                    />
                  </TouchableOpacity>
                ))}
              </View>

              {/* Next / Get Started */}
              <TouchableOpacity
                onPress={goToNext}
                style={{
                  backgroundColor: isLast ? GOLD : G,
                  borderRadius: 30,
                  paddingHorizontal: 28,
                  paddingVertical: 14,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  shadowColor: isLast ? GOLD : "#000",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.35,
                  shadowRadius: 10,
                  elevation: 6,
                  borderWidth: isLast ? 0 : 1,
                  borderColor: "rgba(255,255,255,0.15)",
                }}
              >
                <Text
                  style={{
                    color: isLast ? DARK_G : WHITE,
                    fontWeight: "800",
                    fontSize: 15,
                  }}
                >
                  {isLast ? "Get Started" : "Next"}
                </Text>
                <Ionicons
                  name={isLast ? "sparkles" : "arrow-forward"}
                  size={16}
                  color={isLast ? DARK_G : WHITE}
                />
              </TouchableOpacity>
            </View>

            {/* Log in link on last slide */}
            {isLast && (
              <TouchableOpacity
                onPress={handleFinish}
                style={{ alignItems: "center", marginTop: 22 }}
              >
                <Text style={{ color: "rgba(255,255,255,0.5)", fontSize: 14 }}>
                  Already have an account?{" "}
                  <Text style={{ color: GOLD, fontWeight: "700" }}>Log In</Text>
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </SafeAreaView>
      </Animated.View>
    </View>
  );
}
