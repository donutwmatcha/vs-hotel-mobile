// src/components/RoomsSection.tsx
import { FontAwesome5 } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  Image,
  Linking,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Room, ROOMS } from "../constants/rooms";
import RoomDetailModal from "./RoomDetailModal";

const C = {
  green: "#14532D",
  gold: "#C89B3C",
  white: "#FFFFFF",
  offWhite: "#F5F5F5",
  gray: "#64748B",
  grayLight: "#E2E8F0",
  dark: "#0F172A",
};

const PREVIEW_ROOMS = ROOMS;

export default function RoomsSection() {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  function handleRoomPress(room: Room) {
    setSelectedRoom(room);
    setModalVisible(true);
  }

  return (
    <View style={s.container}>
      {/* Section header */}
      <View style={s.header}>
        <View>
          <Text style={s.eyebrow}>Accommodations</Text>
          <Text style={s.title}>Our Rooms</Text>
        </View>
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
              onPress={() => handleRoomPress(room)}
              activeOpacity={0.88}
            >
              <Image
                source={room.image}
                style={s.cardImage}
                resizeMode="cover"
              />

              <View style={s.badge}>
                <FontAwesome5 name="user" size={9} color={C.white} />
                <Text style={s.badgeText}>{room.capacity}</Text>
              </View>

              <View style={s.cardInfo}>
                <Text style={s.cardName} numberOfLines={1}>
                  {room.name}
                </Text>
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
      </ScrollView>

      {/* Room Detail Modal */}
      <RoomDetailModal
        room={selectedRoom}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
}

const s = StyleSheet.create({
  container: { paddingVertical: 24, backgroundColor: "#FFFFFF" },
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
    color: "#64748B",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    marginBottom: 2,
  },
  title: { fontSize: 26, fontWeight: "900", color: "#14532D" },
  scrollContent: { paddingHorizontal: 20, gap: 14, paddingBottom: 4 },
  card: {
    width: 220,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  cardImage: { width: "100%", height: 140 },
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
  badgeText: { color: "#FFFFFF", fontSize: 11, fontWeight: "700" },
  cardInfo: { padding: 12, gap: 7 },
  cardName: { fontSize: 15, fontWeight: "800", color: "#0F172A" },
  pillsRow: { flexDirection: "row", gap: 6, flexWrap: "wrap" },
  pill: {
    backgroundColor: "#F5F5F5",
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#E2E8F0",
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  pillText: { fontSize: 10, color: "#64748B", fontWeight: "600" },
  cardFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 2,
    borderTopWidth: 1,
    borderTopColor: "#E2E8F0",
    paddingTop: 8,
  },
  fromText: { fontSize: 10, color: "#64748B" },
  price: { fontSize: 16, fontWeight: "900", color: "#14532D" },
  perNight: { fontSize: 10, fontWeight: "400", color: "#64748B" },
  bookChip: {
    backgroundColor: "#C89B3C",
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
  },
  bookChipText: { color: "#FFFFFF", fontSize: 12, fontWeight: "800" },
});
