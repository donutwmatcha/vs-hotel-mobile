// src/components/MemberCard.tsx
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import QRCode from "react-native-qrcode-svg";

const C = {
  green: "#14532D",
  greenLight: "#1a6b3c",
  gold: "#C89B3C",
  goldLight: "#D4A017",
  white: "#FFFFFF",
  offWhite: "#F8FAFC",
  gray: "#64748B",
  grayLight: "#E5E7EB",
};

interface CheckIn {
  id: string;
  checked_in_at: string;
  points_awarded: number;
  action: string;
}

interface Props {
  userId: string;
  userName: string;
  memberRank: string;
  points: number;
  lastCheckIn?: CheckIn | null;
}

export default function MemberCard({
  userId,
  userName,
  memberRank,
  points,
  lastCheckIn,
}: Props) {
  const qrData = JSON.stringify({
    id: userId,
    name: userName,
    rank: memberRank,
  });

  const shortId = userId.slice(0, 8).toUpperCase();

  const checkInTime = lastCheckIn
    ? new Date(lastCheckIn.checked_in_at).toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    : null;

  const checkInDate = lastCheckIn
    ? new Date(lastCheckIn.checked_in_at).toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <View style={s.card}>
      {/* Top row */}
      <View style={s.topRow}>
        <View>
          <Text style={s.hotelLabel}>VS HOTEL</Text>
          <Text style={s.cardTitle}>Member Card</Text>
        </View>
        <View style={s.rankBadge}>
          <FontAwesome5 name="star" size={10} color={C.gold} solid />
          <Text style={s.rankText}>{memberRank}</Text>
        </View>
      </View>

      {/* Check-in status banner */}
      {lastCheckIn ? (
        <View style={s.checkedInBanner}>
          <View style={s.checkedInDot} />
          <View style={{ flex: 1 }}>
            <Text style={s.checkedInLabel}>
              {lastCheckIn.action ?? "Check-In"} Today
            </Text>
            <Text style={s.checkedInTime}>
              {checkInDate} {"•"} {checkInTime} {"•"} +
              {lastCheckIn.points_awarded} pts
            </Text>
          </View>
          <Ionicons name="checkmark-circle" size={20} color="#86EFAC" />
        </View>
      ) : (
        <View style={s.notCheckedInBanner}>
          <Ionicons
            name="time-outline"
            size={14}
            color="rgba(255,255,255,0.4)"
          />
          <Text style={s.notCheckedInText}>Not yet checked in today</Text>
        </View>
      )}

      {/* Divider */}
      <View style={s.divider} />

      {/* Middle row */}
      <View style={s.middleRow}>
        <View style={s.memberInfo}>
          <Text style={s.memberLabel}>MEMBER NAME</Text>
          <Text style={s.memberName}>{userName}</Text>
          <Text style={[s.memberLabel, { marginTop: 12 }]}>MEMBER ID</Text>
          <Text style={s.memberId}>VS-{shortId}</Text>
          <View style={s.pointsRow}>
            <Ionicons name="star" size={13} color={C.gold} />
            <Text style={s.pointsText}>
              {points.toLocaleString()} VS Points
            </Text>
          </View>
        </View>

        <View style={s.qrWrap}>
          <QRCode
            value={qrData}
            size={100}
            color={C.green}
            backgroundColor={C.white}
          />
          <Text style={s.qrHint}>Show at front desk</Text>
        </View>
      </View>

      {/* Bottom strip */}
      <View style={s.bottomStrip}>
        <FontAwesome5 name="hotel" size={11} color="rgba(255,255,255,0.5)" />
        <Text style={s.stripText}>Victoria Sports Hotel Convention Center</Text>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  card: {
    marginHorizontal: 16,
    marginTop: 20,
    borderRadius: 20,
    backgroundColor: C.green,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  topRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 12,
  },
  hotelLabel: {
    fontSize: 10,
    fontWeight: "800",
    color: C.goldLight,
    letterSpacing: 2,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.white,
    marginTop: 2,
  },
  rankBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: "rgba(255,255,255,0.15)",
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: "rgba(200,155,60,0.4)",
  },
  rankText: {
    color: C.gold,
    fontSize: 12,
    fontWeight: "800",
  },
  checkedInBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(34,197,94,0.2)",
    borderWidth: 1,
    borderColor: "rgba(134,239,172,0.3)",
    marginHorizontal: 16,
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    marginBottom: 10,
  },
  checkedInDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#86EFAC",
  },
  checkedInLabel: {
    color: "#86EFAC",
    fontSize: 12,
    fontWeight: "700",
  },
  checkedInTime: {
    color: "rgba(134,239,172,0.7)",
    fontSize: 11,
    marginTop: 1,
  },
  notCheckedInBanner: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginHorizontal: 16,
    marginBottom: 10,
    opacity: 0.5,
  },
  notCheckedInText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 11,
    fontStyle: "italic",
  },
  divider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginHorizontal: 20,
  },
  middleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 18,
    gap: 16,
  },
  memberInfo: { flex: 1 },
  memberLabel: {
    fontSize: 9,
    fontWeight: "700",
    color: "rgba(255,255,255,0.5)",
    letterSpacing: 1.5,
    marginBottom: 3,
  },
  memberName: {
    fontSize: 17,
    fontWeight: "800",
    color: C.white,
  },
  memberId: {
    fontSize: 13,
    fontWeight: "600",
    color: "rgba(255,255,255,0.7)",
    fontFamily: "monospace",
    marginTop: 3,
  },
  pointsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 14,
    backgroundColor: "rgba(255,255,255,0.1)",
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
  },
  pointsText: {
    color: C.gold,
    fontSize: 12,
    fontWeight: "700",
  },
  qrWrap: {
    alignItems: "center",
    gap: 6,
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 10,
  },
  qrHint: {
    fontSize: 9,
    color: C.gray,
    fontWeight: "600",
    textAlign: "center",
  },
  bottomStrip: {
    backgroundColor: "rgba(0,0,0,0.2)",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 8,
  },
  stripText: {
    color: "rgba(255,255,255,0.5)",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
