// src/components/MembershipBanner.tsx
import { FontAwesome5 } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const C = {
  green: "#14532D",
  gold: "#C89B3C",
  goldDim: "#D4A017",
  white: "#FFFFFF",
  dark: "#0F172A",
  darkCard: "#1E293B",
  darkBorder: "#334155",
  muted: "#94A3B8",
  mutedDark: "#64748B",
};

const PERKS = [
  { icon: "coins", label: "Earn Points" },
  { icon: "percentage", label: "Member Rates" },
  { icon: "gift", label: "Rewards" },
];

const DEALS = [
  {
    iconName: "bolt",
    label: "Flash Sale",
    title: "20% Off All Rooms",
    subtitle: "This weekend only • Ends May 18",
  },
  {
    iconName: "moon",
    label: "Night Owl Deal",
    title: "Book After 9PM, Save 15%",
    subtitle: "App exclusive • Limited slots",
  },
  {
    iconName: "gift",
    label: "Anniversary Promo",
    title: "Stay 2 Nights, Get 1 Free",
    subtitle: "Valid May 20–31 only",
  },
];

interface Props {
  userName?: string | null;
  userPoints?: number | null;
  memberRank?: string;
}

export default function MembershipBanner({
  userName,
  userPoints,
  memberRank = "Silver Member",
}: Props) {
  const isLoggedIn = !!userName;

  // ── LOGGED IN: show member perks + deals ──────────────────────────────────
  if (isLoggedIn) {
    return (
      <View style={s.container}>
        {/* Member header */}
        <View style={s.memberHeader}>
          <View style={s.memberBadge}>
            <FontAwesome5 name="star" size={12} color={C.gold} solid />
            <Text style={s.memberBadgeText}>{memberRank}</Text>
          </View>
          <View style={s.pointsChip}>
            <FontAwesome5 name="coins" size={11} color={C.gold} />
            <Text style={s.pointsChipText}>{userPoints ?? 0} VS Points</Text>
          </View>
        </View>

        <Text style={s.memberTitle}>
          Welcome back,{"\n"}
          <Text style={s.memberName}>{userName}! 👋</Text>
        </Text>
        <Text style={s.memberSub}>
          Your exclusive member deals are unlocked below.
        </Text>

        {/* Deals */}
        <View style={s.dealsWrap}>
          {DEALS.map((deal, i) => (
            <View key={i} style={s.dealCard}>
              <View style={s.dealIconWrap}>
                <FontAwesome5 name={deal.iconName} size={16} color={C.gold} />
              </View>
              <View style={s.dealInfo}>
                <Text style={s.dealLabel}>{deal.label}</Text>
                <Text style={s.dealTitle}>{deal.title}</Text>
                <Text style={s.dealSubtitle}>{deal.subtitle}</Text>
              </View>
              <FontAwesome5
                name="chevron-right"
                size={12}
                color={C.mutedDark}
              />
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={s.bookBtn}
          onPress={() => router.push("/booking")}
          activeOpacity={0.85}
        >
          <FontAwesome5 name="calendar-check" size={13} color={C.white} />
          <Text style={s.bookBtnText}>Book Now with Member Rate</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── GUEST: show join CTA + deals preview (blurred/locked) ─────────────────
  return (
    <View style={s.container}>
      {/* Lock badge */}
      <View style={s.lockBadge}>
        <FontAwesome5 name="lock" size={10} color={C.gold} />
        <Text style={s.lockBadgeText}>MEMBERS ONLY</Text>
      </View>

      <Text style={s.guestTitle}>Earn Points.{"\n"}Unlock Rewards.</Text>
      <Text style={s.guestSub}>
        Join the VS Hotel loyalty program and get exclusive perks, member-only
        rates, and flash sales before they go public.
      </Text>

      {/* Perks row */}
      <View style={s.perksRow}>
        {PERKS.map((perk) => (
          <View key={perk.label} style={s.perk}>
            <View style={s.perkIcon}>
              <FontAwesome5 name={perk.icon} size={13} color={C.gold} />
            </View>
            <Text style={s.perkLabel}>{perk.label}</Text>
          </View>
        ))}
      </View>

      {/* Locked deals preview */}
      <View style={s.dealsWrap}>
        {DEALS.map((deal, i) => (
          <View key={i} style={[s.dealCard, s.dealCardLocked]}>
            <View style={s.dealIconWrap}>
              <FontAwesome5
                name={deal.iconName}
                size={16}
                color={C.mutedDark}
              />
            </View>
            <View style={s.dealInfo}>
              <Text style={[s.dealLabel, { color: C.mutedDark }]}>
                {deal.label}
              </Text>
              <Text style={[s.dealTitle, { color: C.muted }]}>
                {deal.title}
              </Text>
            </View>
            <FontAwesome5 name="lock" size={12} color={C.mutedDark} />
          </View>
        ))}
      </View>

      {/* CTA buttons */}
      <TouchableOpacity
        style={s.joinBtn}
        onPress={() => router.push("/signup")}
        activeOpacity={0.85}
      >
        <FontAwesome5 name="user-plus" size={13} color={C.white} />
        <Text style={s.joinBtnText}>Join Free to Unlock Deals</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={s.signInBtn}
        onPress={() => router.push("/signin")}
        activeOpacity={0.85}
      >
        <FontAwesome5 name="sign-in-alt" size={12} color={C.muted} />
        <Text style={s.signInText}>
          Already a member?{" "}
          <Text style={{ color: C.gold, fontWeight: "bold" }}>Sign In</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const s = StyleSheet.create({
  container: {
    backgroundColor: C.dark,
    paddingHorizontal: 20,
    paddingVertical: 30,
    marginTop: 20,
  },

  // ── Logged in ──
  memberHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 14,
  },
  memberBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.darkCard,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: C.gold + "55",
  },
  memberBadgeText: {
    color: C.gold,
    fontSize: 12,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
  pointsChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.darkCard,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: C.darkBorder,
  },
  pointsChipText: {
    color: C.white,
    fontSize: 12,
    fontWeight: "700",
  },
  memberTitle: {
    fontSize: 16,
    color: C.muted,
    marginBottom: 2,
  },
  memberName: {
    fontSize: 26,
    fontWeight: "900",
    color: C.white,
  },
  memberSub: {
    color: C.mutedDark,
    fontSize: 13,
    marginBottom: 20,
    lineHeight: 20,
  },
  bookBtn: {
    backgroundColor: C.gold,
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 4,
  },
  bookBtnText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 15,
  },

  // ── Guest ──
  lockBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    marginBottom: 12,
  },
  lockBadgeText: {
    color: C.gold,
    fontWeight: "800",
    fontSize: 12,
    letterSpacing: 1.2,
  },
  guestTitle: {
    fontSize: 28,
    fontWeight: "900",
    color: C.white,
    lineHeight: 36,
    marginBottom: 10,
  },
  guestSub: {
    color: C.muted,
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 20,
  },
  perksRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  perk: {
    flex: 1,
    alignItems: "center",
    gap: 8,
  },
  perkIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: C.darkCard,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: C.darkBorder,
  },
  perkLabel: {
    color: C.white,
    fontSize: 11,
    fontWeight: "700",
    textAlign: "center",
  },
  joinBtn: {
    backgroundColor: C.gold,
    borderRadius: 30,
    paddingVertical: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: 8,
  },
  joinBtnText: {
    color: C.white,
    fontWeight: "800",
    fontSize: 15,
  },
  signInBtn: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  signInText: {
    color: C.muted,
    fontSize: 14,
  },

  // ── Shared deals ──
  dealsWrap: {
    gap: 10,
    marginBottom: 16,
  },
  dealCard: {
    backgroundColor: C.darkCard,
    borderRadius: 14,
    padding: 14,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderWidth: 1,
    borderColor: C.darkBorder,
  },
  dealCardLocked: {
    opacity: 0.5,
  },
  dealIconWrap: {
    backgroundColor: "#334155",
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  dealInfo: { flex: 1 },
  dealLabel: {
    color: C.gold,
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
    marginBottom: 2,
  },
  dealTitle: {
    color: C.white,
    fontWeight: "700",
    fontSize: 14,
  },
  dealSubtitle: {
    color: C.mutedDark,
    fontSize: 11,
    marginTop: 2,
  },
});
