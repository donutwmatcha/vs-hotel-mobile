// src/components/JoinBanner.tsx
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const C = {
  green: "#14532D",
  gold: "#C89B3C",
  white: "#FFFFFF",
  lavender: "#F0EEF5",
};

export default function JoinBanner() {
  return (
    <View style={s.container}>
      {/* Left accent bar */}
      <View style={s.accentBar} />

      <View style={s.content}>
        {/* Badge */}
        <View style={s.badge}>
          <FontAwesome5 name="star" size={10} color={C.gold} solid />
          <Text style={s.badgeText}>VS MEMBERSHIP</Text>
        </View>

        <Text style={s.title}>Earn Points.{"\n"}Unlock Rewards.</Text>
        <Text style={s.subtitle}>
          Join the VS Hotel loyalty program and get exclusive perks, member-only
          rates, and more with every stay.
        </Text>

        {/* Perks row */}
        <View style={s.perksRow}>
          {[
            { icon: "coins", label: "Earn Points" },
            { icon: "percentage", label: "Member Rates" },
            { icon: "gift", label: "Rewards" },
          ].map((perk) => (
            <View key={perk.label} style={s.perk}>
              <View style={s.perkIcon}>
                <FontAwesome5 name={perk.icon} size={12} color={C.green} />
              </View>
              <Text style={s.perkLabel}>{perk.label}</Text>
            </View>
          ))}
        </View>

        {/* CTA buttons */}
        <View style={s.btnRow}>
          <TouchableOpacity
            style={s.primaryBtn}
            onPress={() => router.push("/signup")}
            activeOpacity={0.85}
          >
            <FontAwesome5 name="user-plus" size={13} color={C.white} />
            <Text style={s.primaryBtnText}>Join Free</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={s.secondaryBtn}
            onPress={() => router.push("/signin")}
            activeOpacity={0.85}
          >
            <Text style={s.secondaryBtnText}>Sign In</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 8,
    backgroundColor: C.lavender,
    borderRadius: 20,
    flexDirection: "row",
    overflow: "hidden",
    borderWidth: 1.5,
    borderColor: "#D8D4E8",
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  accentBar: {
    width: 6,
    backgroundColor: C.green,
  },
  content: {
    flex: 1,
    padding: 18,
    gap: 10,
  },
  badge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.green + "18",
    alignSelf: "flex-start",
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: "800",
    color: C.green,
    letterSpacing: 1.2,
  },
  title: {
    fontSize: 22,
    fontWeight: "900",
    color: C.green,
    lineHeight: 28,
  },
  subtitle: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  perksRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  perk: {
    flex: 1,
    alignItems: "center",
    gap: 6,
  },
  perkIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: C.white,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#D8D4E8",
  },
  perkLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: C.green,
    textAlign: "center",
  },
  btnRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 4,
  },
  primaryBtn: {
    flex: 1,
    backgroundColor: C.green,
    borderRadius: 30,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  primaryBtnText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 14,
  },
  secondaryBtn: {
    flex: 1,
    borderRadius: 30,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: C.green,
  },
  secondaryBtnText: {
    color: C.green,
    fontWeight: "800",
    fontSize: 14,
  },
});
