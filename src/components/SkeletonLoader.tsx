import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef } from "react";
import {
    Animated,
    Dimensions,
    StyleSheet,
    View,
    ViewStyle,
} from "react-native";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

// ─── Base Skeleton Block ───────────────────────────────────────────────────────
interface SkeletonProps {
  width?: number | string;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle;
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius = 8,
  style,
}: SkeletonProps) {
  const shimmer = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(shimmer, {
        toValue: 1,
        duration: 1200,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  const translateX = shimmer.interpolate({
    inputRange: [-1, 1],
    outputRange: [-SCREEN_WIDTH, SCREEN_WIDTH],
  });

  return (
    <View
      style={[
        {
          width: width as any,
          height,
          borderRadius,
          backgroundColor: "#E8EDF2",
          overflow: "hidden",
        },
        style,
      ]}
    >
      <Animated.View
        style={[StyleSheet.absoluteFill, { transform: [{ translateX }] }]}
      >
        <LinearGradient
          colors={["transparent", "rgba(255,255,255,0.55)", "transparent"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={StyleSheet.absoluteFill}
        />
      </Animated.View>
    </View>
  );
}

// ─── Home Screen Skeleton ──────────────────────────────────────────────────────
export function HomeScreenSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#14532D",
          paddingTop: 52,
          paddingBottom: 16,
          paddingHorizontal: 20,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Skeleton width={120} height={28} borderRadius={6} />
        <Skeleton width={32} height={32} borderRadius={16} />
      </View>

      {/* Hero image */}
      <Skeleton width="100%" height={220} borderRadius={0} />

      {/* Greeting card */}
      <View
        style={{
          margin: 16,
          padding: 16,
          backgroundColor: "#F8FAFC",
          borderRadius: 16,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton width={160} height={20} borderRadius={6} />
          <Skeleton width={60} height={20} borderRadius={10} />
        </View>
        <Skeleton width={100} height={14} borderRadius={6} />
        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <Skeleton width={80} height={32} borderRadius={8} />
          <Skeleton width={80} height={32} borderRadius={8} />
          <Skeleton width={80} height={32} borderRadius={8} />
        </View>
      </View>

      {/* Section title */}
      <View style={{ paddingHorizontal: 16, marginBottom: 12, gap: 6 }}>
        <Skeleton width={140} height={20} borderRadius={6} />
        <Skeleton width={200} height={14} borderRadius={6} />
      </View>

      {/* Room cards horizontal */}
      <View style={{ flexDirection: "row", gap: 12, paddingHorizontal: 16 }}>
        {[1, 2, 3].map((i) => (
          <View key={i} style={{ width: 160, gap: 8 }}>
            <Skeleton width={160} height={110} borderRadius={12} />
            <Skeleton width={120} height={14} borderRadius={6} />
            <Skeleton width={80} height={12} borderRadius={6} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Rooms Screen Skeleton ─────────────────────────────────────────────────────
export function RoomsScreenSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#14532D",
          paddingTop: 52,
          paddingBottom: 16,
          paddingHorizontal: 20,
          gap: 8,
        }}
      >
        <Skeleton width={100} height={26} borderRadius={6} />
        <Skeleton width={180} height={14} borderRadius={6} />
      </View>

      {/* Room cards list */}
      <View style={{ padding: 16, gap: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <View
            key={i}
            style={{
              borderRadius: 16,
              overflow: "hidden",
              backgroundColor: "#F8FAFC",
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <Skeleton width="100%" height={180} borderRadius={0} />
            <View style={{ padding: 14, gap: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Skeleton width={150} height={18} borderRadius={6} />
                <Skeleton width={70} height={18} borderRadius={6} />
              </View>
              <View style={{ flexDirection: "row", gap: 8 }}>
                <Skeleton width={70} height={24} borderRadius={12} />
                <Skeleton width={70} height={24} borderRadius={12} />
                <Skeleton width={50} height={24} borderRadius={12} />
              </View>
              <Skeleton width="100%" height={14} borderRadius={6} />
              <Skeleton width="60%" height={14} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── Profile Screen Skeleton ───────────────────────────────────────────────────
export function ProfileScreenSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#14532D",
          paddingTop: 52,
          paddingBottom: 32,
          paddingHorizontal: 20,
          alignItems: "center",
          gap: 12,
        }}
      >
        <Skeleton width={80} height={80} borderRadius={40} />
        <Skeleton width={140} height={22} borderRadius={6} />
        <Skeleton width={100} height={14} borderRadius={6} />
        <View style={{ flexDirection: "row", gap: 8, marginTop: 4 }}>
          <Skeleton width={90} height={28} borderRadius={14} />
          <Skeleton width={90} height={28} borderRadius={14} />
        </View>
      </View>

      {/* Points card */}
      <View
        style={{
          margin: 16,
          padding: 16,
          backgroundColor: "#F8FAFC",
          borderRadius: 16,
          gap: 10,
          borderWidth: 1,
          borderColor: "#E2E8F0",
        }}
      >
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton width={80} height={14} borderRadius={6} />
          <Skeleton width={60} height={14} borderRadius={6} />
        </View>
        <Skeleton width={120} height={32} borderRadius={6} />
        <Skeleton width="100%" height={8} borderRadius={4} />
      </View>

      {/* Menu items */}
      <View style={{ paddingHorizontal: 16, gap: 2 }}>
        {[1, 2, 3, 4, 5].map((i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: 14,
              gap: 12,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F5F9",
            }}
          >
            <Skeleton width={36} height={36} borderRadius={18} />
            <View style={{ flex: 1, gap: 6 }}>
              <Skeleton width={140} height={14} borderRadius={6} />
              <Skeleton width={200} height={11} borderRadius={6} />
            </View>
            <Skeleton width={16} height={16} borderRadius={4} />
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── VS Screen Skeleton ────────────────────────────────────────────────────────
export function VSScreenSkeleton() {
  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
      <View
        style={{
          backgroundColor: "#14532D",
          paddingTop: 52,
          paddingBottom: 16,
          paddingHorizontal: 20,
          gap: 8,
        }}
      >
        <Skeleton width={80} height={26} borderRadius={6} />
        <Skeleton width={200} height={14} borderRadius={6} />
      </View>

      {/* Carousel */}
      <Skeleton width="100%" height={200} borderRadius={0} />

      {/* Category chips */}
      <View style={{ flexDirection: "row", gap: 8, padding: 16 }}>
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} width={80} height={32} borderRadius={16} />
        ))}
      </View>

      {/* Partner cards */}
      <View style={{ paddingHorizontal: 16, gap: 12 }}>
        {[1, 2, 3].map((i) => (
          <View
            key={i}
            style={{
              flexDirection: "row",
              gap: 12,
              padding: 14,
              backgroundColor: "#F8FAFC",
              borderRadius: 14,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              alignItems: "center",
            }}
          >
            <Skeleton width={52} height={52} borderRadius={10} />
            <View style={{ flex: 1, gap: 8 }}>
              <Skeleton width={130} height={15} borderRadius={6} />
              <Skeleton width={180} height={12} borderRadius={6} />
              <Skeleton width={100} height={12} borderRadius={6} />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

// ─── RoomCard Skeleton (for horizontal scroll previews) ────────────────────────
export function RoomCardSkeleton() {
  return (
    <View style={{ width: 160, gap: 8 }}>
      <Skeleton width={160} height={110} borderRadius={12} />
      <Skeleton width={120} height={14} borderRadius={6} />
      <Skeleton width={80} height={12} borderRadius={6} />
    </View>
  );
}
