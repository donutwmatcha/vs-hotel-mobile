// src/components/RoomsSection.tsx
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { ROOMS } from "../constants/rooms";

const C = {
  green: "#14532D",
  gold: "#C89B3C",
  white: "#FFFFFF",
  offWhite: "#F5F5F5",
  gray: "#64748B",
  grayLight: "#E2E8F0",
  lavender: "#f0eef5",
  dark: "#0F172A",
};

const PREVIEW_ROOMS = ROOMS.slice(0, 4);

export default function RoomsSection() {
  return (
    <View style={s.container}>
      {/* Section header */}
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>Accommodations</Text>
          <Text style={s.title}>Our Rooms</Text>
        </View>
        <TouchableOpacity
          style={s.seeAllBtn}
          onPress={() => router.push("/rooms")}
          activeOpacity={0.8}
        >
          <Text style={s.seeAllText}>See All</Text>
          <FontAwesome5 name="arrow-right" size={11} color={C.green} />
        </TouchableOpacity>
      </View>

      {/* Horizontal scroll of room cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={s.scrollContent}
      >
        {PREVIEW_ROOMS.map((room) => {
          const lowestRate = Math.min(
            ...room.rates.map((r) => r.pricePerNight),
          );
          return (
            <TouchableOpacity
              key={room.id}
              style={s.card}
              onPress={() => router.push("/rooms")}
              activeOpacity={0.88}
            >
              {/* Image */}
              <Image
                source={room.image}
                style={s.cardImage}
                resizeMode="cover"
              />

              {/* Capacity badge */}
              <View style={s.badge}>
                <FontAwesome5 name="user" size={9} color={C.white} />
                <Text style={s.badgeText}>{room.capacity}</Text>
              </View>

              {/* Info */}
              <View style={s.cardInfo}>
                <Text style={s.cardName} numberOfLines={1}>
                  {room.name}
                </Text>

                {/* Pills with icons instead of emojis */}
                <View style={s.pillsRow}>
                  <View style={s.pill}>
                    <FontAwesome5 name="expand" size={9} color={C.gray} />
                    <Text style={s.pillText}>{room.size}</Text>
                  </View>
                  <View style={s.pill}>
                    <FontAwesome5 name="bed" size={9} color={C.gray} />
                    <Text style={s.pillText}>{room.bedding}</Text>
                  </View>
                </View>

                <View style={s.cardFooter}>
                  <View>
                    <Text style={s.fromText}>from</Text>
                    <Text style={s.price}>
                      ₱{lowestRate.toLocaleString()}
                      <Text style={s.perNight}>/night</Text>
                    </Text>
                  </View>
                  <TouchableOpacity
                    style={s.bookChip}
                    onPress={() =>
                      Linking.openURL(
                        "https://www.swiftbook.io/inst/#home?propertyId=363MjIpd9DKOxXNT5Koe1JFI0MzQ=&JDRN=Y",
                      ).catch(() => {})
                    }
                  >
                    <Text style={s.bookChipText}>Book</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* "More rooms" end card */}
        <TouchableOpacity
          style={s.moreCard}
          onPress={() => router.push("/rooms")}
          activeOpacity={0.85}
        >
          <View style={s.moreInner}>
            <FontAwesome5 name="bed" size={28} color={C.white} />
            <Text style={s.moreText}>View All{"\n"}Rooms</Text>
            <FontAwesome5 name="arrow-right" size={14} color={C.white} />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    paddingVertical: 24,
    backgroundColor: C.white,
  },
  header: {
    flexDirection: "row",
    alignItems: "flex-end",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  eyebrow: {
    fontSize: 11,
    fontWeight: "800",
    color: C.gray,
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: {
    fontSize: 26,
    fontWeight: "900",
    color: C.green,
  },
  seeAllBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: C.green,
  },
  seeAllText: {
    fontSize: 13,
    fontWeight: "700",
    color: C.green,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 14,
    paddingBottom: 4,
  },
  card: {
    width: 220,
    backgroundColor: C.white,
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: C.grayLight,
  },
  cardImage: {
    width: "100%",
    height: 140,
  },
  badge: {
    position: "absolute",
    top: 10,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  badgeText: {
    color: C.white,
    fontSize: 11,
    fontWeight: "700",
  },
  cardInfo: {
    padding: 12,
    gap: 7,
  },
  cardName: {
    fontSize: 15,
    fontWeight: "800",
    color: C.dark,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 6,
    flexWrap: "wrap",
  },
  pill: {
    backgroundColor: C.offWhite,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: C.grayLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pillText: {
    fontSize: 10,
    color: C.gray,
    fontWeight: "600",
  },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: C.grayLight,
    paddingTop: 8,
  },
  fromText: {
    fontSize: 10,
    color: C.gray,
  },
  price: {
    fontSize: 16,
    fontWeight: "900",
    color: C.green,
  },
  perNight: {
    fontSize: 10,
    fontWeight: "400",
    color: C.gray,
  },
  bookChip: {
    backgroundColor: C.gold,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  bookChipText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "800",
  },
  moreCard: {
    width: 110,
    backgroundColor: C.green,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  moreInner: {
    alignItems: "center",
    gap: 10,
    padding: 16,
  },
  moreText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});
