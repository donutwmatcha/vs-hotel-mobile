import { FontAwesome5 } from "@expo/vector-icons";
import React from "react";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Room } from "../constants/rooms";

const C = {
  green: "#1B4332",
  gold: "#C89B3C",
  white: "#FFFFFF",
  offWhite: "#F8FAFC",
  gray: "#64748B",
  grayLight: "#E5E7EB",
  lavender: "#F0EEF5",
  dark: "#0D1B12",
};

interface RoomCardProps {
  room: Room;
  onPress: () => void;
}

export function RoomCard({ room, onPress }: RoomCardProps) {
  const lowestRate = Math.min(...room.rates.map((r) => r.pricePerNight));

  return (
    <TouchableOpacity style={s.card} onPress={onPress} activeOpacity={0.88}>
      {/* Room Image */}
      <Image source={room.image} style={s.image} resizeMode="cover" />

      {/* Capacity badge */}
      <View style={s.badge}>
        <FontAwesome5 name="user" size={10} color={C.white} />
        <Text style={s.badgeText}>{room.capacity}</Text>
      </View>

      {/* Info */}
      <View style={s.info}>
        <View style={s.row}>
          <Text style={s.name}>{room.name}</Text>
          <View style={s.priceWrap}>
            <Text style={s.priceFrom}>from</Text>
            <Text style={s.price}>₱{lowestRate.toLocaleString()}</Text>
            <Text style={s.priceNight}>/night</Text>
          </View>
        </View>

        <Text style={s.description} numberOfLines={2}>
          {room.description}
        </Text>

        {/* Pills */}
        <View style={s.pillsRow}>
          <View style={s.pill}>
            <FontAwesome5 name="expand" size={10} color={C.gray} />
            <Text style={s.pillText}>{room.size}</Text>
          </View>
          <View style={s.pill}>
            <FontAwesome5 name="bed" size={10} color={C.gray} />
            <Text style={s.pillText}>{room.bedding}</Text>
          </View>
        </View>

        <View style={s.footer}>
          <Text style={s.explore}>View details →</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const s = StyleSheet.create({
  card: {
    backgroundColor: C.white,
    borderRadius: 20,
    marginBottom: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
  },
  image: {
    width: "100%",
    height: 200,
  },
  badge: {
    position: "absolute",
    top: 14,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  badgeText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "600",
  },
  info: {
    padding: 16,
    gap: 8,
  },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
  },
  name: {
    flex: 1,
    fontSize: 18,
    fontWeight: "800",
    color: C.dark,
    marginRight: 8,
  },
  priceWrap: {
    alignItems: "flex-end",
  },
  priceFrom: {
    fontSize: 10,
    color: C.gray,
  },
  price: {
    fontSize: 18,
    fontWeight: "900",
    color: C.green,
  },
  priceNight: {
    fontSize: 10,
    color: C.gray,
  },
  description: {
    fontSize: 13,
    color: C.gray,
    lineHeight: 18,
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
    flexWrap: "wrap",
  },
  pill: {
    backgroundColor: C.offWhite,
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: C.grayLight,
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  pillText: {
    fontSize: 12,
    color: C.gray,
    fontWeight: "600",
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: C.grayLight,
    paddingTop: 10,
    marginTop: 2,
  },
  explore: {
    fontSize: 13,
    fontWeight: "700",
    color: C.green,
  },
});
