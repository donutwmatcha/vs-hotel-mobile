// src/screens/ProfileScreen.tsx
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  Linking,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";

const TIERS = [
  {
    name: "Silver",
    minPoints: 0,
    maxPoints: 999,
    color: "#94A3B8",
    icon: <FontAwesome5 name="medal" size={22} color="#94A3B8" />,
    perks: [
      "Member-only rates",
      "Early check-in (subject to availability)",
      "Birthday discount",
    ],
  },
  {
    name: "Gold",
    minPoints: 1000,
    maxPoints: 4999,
    color: "#C89B3C",
    icon: <FontAwesome5 name="medal" size={22} color="#C89B3C" />,
    perks: [
      "All Silver perks",
      "Free late check-out",
      "Free drink at Bistro Bar",
      "Priority booking",
    ],
  },
  {
    name: "Platinum",
    minPoints: 5000,
    maxPoints: 999999,
    color: "#14532D",
    icon: (
      <MaterialCommunityIcons name="diamond-stone" size={22} color="#14532D" />
    ),
    perks: [
      "All Gold perks",
      "Free room upgrade",
      "Complimentary breakfast",
      "Dedicated concierge",
      "Free spa session",
    ],
  },
];

const REWARDS = [
  {
    id: "1",
    name: "Free Breakfast",
    points: 500,
    icon: <FontAwesome5 name="bread-slice" size={22} color="#C89B3C" />,
  },
  {
    id: "2",
    name: "Late Check-out",
    points: 300,
    icon: <FontAwesome5 name="clock" size={22} color="#C89B3C" />,
  },
  {
    id: "3",
    name: "Room Upgrade",
    points: 1000,
    icon: <FontAwesome5 name="bed" size={22} color="#C89B3C" />,
  },
  {
    id: "4",
    name: "Free Cinema Pass",
    points: 200,
    icon: <FontAwesome5 name="film" size={22} color="#C89B3C" />,
  },
  {
    id: "5",
    name: "Spa Discount 20%",
    points: 400,
    icon: (
      <MaterialCommunityIcons name="face-woman" size={24} color="#C89B3C" />
    ),
  },
  {
    id: "6",
    name: "Free Drink",
    points: 150,
    icon: <FontAwesome5 name="glass-martini-alt" size={22} color="#C89B3C" />,
  },
];

const EARN_ITEMS = [
  {
    icon: <FontAwesome5 name="bed" size={20} color="#14532D" />,
    action: "Book a Room",
    points: "+100 pts per night",
  },
  {
    icon: <FontAwesome5 name="utensils" size={20} color="#14532D" />,
    action: "Dine at VS To Go",
    points: "+20 pts per visit",
  },
  {
    icon: (
      <MaterialCommunityIcons name="face-woman" size={22} color="#14532D" />
    ),
    action: "Visit Victoria Skin",
    points: "+50 pts per session",
  },
  {
    icon: <FontAwesome5 name="swimming-pool" size={20} color="#14532D" />,
    action: "Use the Sports Club",
    points: "+30 pts per visit",
  },
  {
    icon: <FontAwesome5 name="star" size={20} color="#14532D" />,
    action: "Leave a Review",
    points: "+25 pts",
  },
  {
    icon: <FontAwesome5 name="mobile-alt" size={20} color="#14532D" />,
    action: "Book via App",
    points: "+10 pts bonus",
  },
  {
    icon: <FontAwesome5 name="birthday-cake" size={20} color="#14532D" />,
    action: "Birthday Bonus",
    points: "+200 pts",
  },
];

const ACCOUNT_ITEMS = [
  {
    label: "Personal Information",
    icon: <FontAwesome5 name="user" size={16} color="#64748B" />,
  },
  {
    label: "Member Benefits",
    icon: <FontAwesome5 name="star" size={16} color="#64748B" />,
  },
  {
    label: "Push Notifications",
    icon: <Ionicons name="notifications-outline" size={18} color="#64748B" />,
  },
  {
    label: "Email Subscriptions",
    icon: <Ionicons name="mail-outline" size={18} color="#64748B" />,
  },
];

export default function ProfileScreen() {
  const { user, profile, signOut } = useAuth();
  const [activeTab, setActiveTab] = useState<"points" | "rewards" | "tiers">(
    "points",
  );

  const currentTier =
    TIERS.find(
      (t) =>
        (profile?.points ?? 0) >= t.minPoints &&
        (profile?.points ?? 0) <= t.maxPoints,
    ) || TIERS[0];
  const nextTier = TIERS[TIERS.indexOf(currentTier) + 1];
  const progressToNext = nextTier
    ? (((profile?.points ?? 0) - currentTier.minPoints) /
        (nextTier.minPoints - currentTier.minPoints)) *
      100
    : 100;

  async function handleSignOut() {
    Alert.alert("Sign Out", "Are you sure you want to sign out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Sign Out",
        style: "destructive",
        onPress: async () => {
          await signOut();
        },
      },
    ]);
  }

  // ── NOT LOGGED IN ──────────────────────────────────────────────────────────
  if (!user || !profile) {
    return (
      <SafeAreaView
        style={{ flex: 1, backgroundColor: "#14532D" }}
        edges={["top"]}
      >
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View
            style={{
              backgroundColor: "#14532D",
              paddingTop: 20,
              paddingBottom: 40,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            <View
              style={{
                backgroundColor: "rgba(255,255,255,0.15)",
                borderRadius: 50,
                width: 80,
                height: 80,
                alignItems: "center",
                justifyContent: "center",
                marginBottom: 12,
              }}
            >
              <FontAwesome5 name="user" size={36} color="white" />
            </View>
            <Text
              style={{
                color: "white",
                fontSize: 26,
                fontWeight: "bold",
                textAlign: "center",
              }}
            >
              Join VS Hotel
            </Text>
            <Text
              style={{
                color: "#86EFAC",
                marginTop: 8,
                fontSize: 14,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Create an account to unlock exclusive perks, earn VS Points, and
              enjoy member-only deals.
            </Text>
            <View
              style={{
                flexDirection: "row",
                gap: 12,
                marginTop: 24,
                width: "100%",
              }}
            >
              <TouchableOpacity
                onPress={() => router.push("/signup")}
                style={{
                  flex: 1,
                  backgroundColor: "#C89B3C",
                  paddingVertical: 14,
                  borderRadius: 30,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <FontAwesome5 name="user-plus" size={14} color="white" />
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Join for Free
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/signin")}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: "white",
                  paddingVertical: 14,
                  borderRadius: 30,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <FontAwesome5 name="sign-in-alt" size={14} color="white" />
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Earn Points */}
          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#0F172A",
                marginBottom: 4,
              }}
            >
              Earn VS Points
            </Text>
            <Text
              style={{
                color: "#64748B",
                fontSize: 13,
                marginBottom: 16,
                lineHeight: 20,
              }}
            >
              Every stay, every visit, every booking earns you points.
            </Text>
            {EARN_ITEMS.map((item, i) => (
              <View
                key={i}
                style={{
                  backgroundColor: "#F8FAFC",
                  borderRadius: 12,
                  padding: 16,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 12,
                  marginBottom: 10,
                  borderWidth: 1,
                  borderColor: "#E2E8F0",
                }}
              >
                <View style={{ width: 36, alignItems: "center" }}>
                  {item.icon}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontWeight: "bold", color: "#0F172A" }}>
                    {item.action}
                  </Text>
                </View>
                <Text
                  style={{ color: "#14532D", fontWeight: "bold", fontSize: 13 }}
                >
                  {item.points}
                </Text>
              </View>
            ))}
          </View>

          {/* Tiers */}
          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: "#0F172A",
                marginBottom: 16,
              }}
            >
              Member Tiers
            </Text>
            {TIERS.map((tier, i) => (
              <View
                key={i}
                style={{
                  borderRadius: 16,
                  padding: 16,
                  marginBottom: 12,
                  borderWidth: 2,
                  borderColor: tier.color,
                  backgroundColor: i === 2 ? "#F0FDF4" : "#fff",
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 8,
                  }}
                >
                  {tier.icon}
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: tier.color,
                      fontSize: 18,
                    }}
                  >
                    {tier.name}
                  </Text>
                </View>
                {tier.perks.map((perk, j) => (
                  <View
                    key={j}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 6,
                      marginBottom: 4,
                    }}
                  >
                    <Ionicons name="checkmark" size={14} color={tier.color} />
                    <Text style={{ color: "#4B5563", fontSize: 13 }}>
                      {perk}
                    </Text>
                  </View>
                ))}
              </View>
            ))}
          </View>

          {/* Secret Deals */}
          <View
            style={{
              margin: 20,
              backgroundColor: "#0F172A",
              borderRadius: 20,
              padding: 20,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 8,
                marginBottom: 4,
              }}
            >
              <FontAwesome5 name="lock" size={13} color="#C89B3C" />
              <Text
                style={{
                  color: "#C89B3C",
                  fontWeight: "bold",
                  fontSize: 13,
                  letterSpacing: 1,
                }}
              >
                MEMBERS ONLY
              </Text>
            </View>
            <Text
              style={{
                color: "white",
                fontSize: 20,
                fontWeight: "bold",
                marginTop: 4,
              }}
            >
              Secret Deals
            </Text>
            <Text
              style={{
                color: "#94A3B8",
                fontSize: 13,
                marginTop: 8,
                lineHeight: 20,
              }}
            >
              Sign in to unlock flash sales, night owl deals, and app-exclusive
              promos.
            </Text>
            <TouchableOpacity
              onPress={() => router.push("/signup")}
              style={{
                backgroundColor: "#C89B3C",
                paddingVertical: 14,
                borderRadius: 30,
                alignItems: "center",
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FontAwesome5 name="unlock" size={14} color="white" />
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 16 }}
              >
                Join Free to Unlock
              </Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={() => router.push("/signin")}
            style={{
              alignItems: "center",
              paddingVertical: 20,
              marginBottom: 120,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <FontAwesome5 name="sign-in-alt" size={13} color="#64748B" />
            <Text style={{ color: "#64748B", fontSize: 14 }}>
              Already a member?{" "}
              <Text style={{ color: "#14532D", fontWeight: "bold" }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── LOGGED IN ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#14532D" }}
      edges={["top"]}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#14532D",
            paddingTop: 20,
            paddingBottom: 30,
            paddingHorizontal: 20,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View>
              <Text
                style={{
                  color: "#86EFAC",
                  fontSize: 13,
                  fontWeight: "bold",
                  letterSpacing: 1,
                }}
              >
                VS HOTEL MEMBER
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 26,
                  fontWeight: "bold",
                  marginTop: 4,
                }}
              >
                Welcome back,{"\n"}
                {profile.first_name}!
              </Text>
              <Text style={{ color: "#86EFAC", fontSize: 13, marginTop: 4 }}>
                {profile.email}
              </Text>
            </View>
            <View
              style={{
                width: 60,
                height: 60,
                borderRadius: 30,
                backgroundColor: "#C89B3C",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="user" size={26} color="white" />
            </View>
          </View>

          {/* Tier badge */}
          <View
            style={{
              backgroundColor: "rgba(255,255,255,0.15)",
              borderRadius: 12,
              paddingVertical: 10,
              paddingHorizontal: 16,
              marginTop: 16,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            {currentTier.icon}
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 15 }}>
              {currentTier.name} Member
            </Text>
            <Text
              style={{ color: "#86EFAC", fontSize: 12, marginLeft: "auto" }}
            >
              #{profile.id.slice(0, 8).toUpperCase()}
            </Text>
          </View>
        </View>

        {/* Stats */}
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "white",
            marginHorizontal: 20,
            marginTop: -20,
            borderRadius: 16,
            padding: 20,
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 4,
          }}
        >
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#14532D" }}
            >
              {profile.points.toLocaleString()}
            </Text>
            <Text style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>
              VS Points
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#E2E8F0" }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{ fontSize: 24, fontWeight: "bold", color: "#14532D" }}
            >
              {profile.total_stays}
            </Text>
            <Text style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>
              Total Stays
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#E2E8F0" }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text
              style={{
                fontSize: 24,
                fontWeight: "bold",
                color: currentTier.color,
              }}
            >
              {currentTier.name}
            </Text>
            <Text style={{ color: "#64748B", fontSize: 12, marginTop: 2 }}>
              Current Tier
            </Text>
          </View>
        </View>

        {/* Progress */}
        {nextTier && (
          <View
            style={{
              marginHorizontal: 20,
              marginTop: 16,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginBottom: 8,
              }}
            >
              <Text style={{ color: "#0F172A", fontWeight: "bold" }}>
                Progress to {nextTier.name}
              </Text>
              <Text style={{ color: "#64748B", fontSize: 13 }}>
                {profile.points}/{nextTier.minPoints} pts
              </Text>
            </View>
            <View
              style={{
                backgroundColor: "#F1F5F9",
                borderRadius: 8,
                height: 10,
                overflow: "hidden",
              }}
            >
              <View
                style={{
                  width: `${Math.min(progressToNext, 100)}%`,
                  height: "100%",
                  backgroundColor: "#C89B3C",
                  borderRadius: 8,
                }}
              />
            </View>
            <Text style={{ color: "#64748B", fontSize: 12, marginTop: 6 }}>
              {nextTier.minPoints - profile.points} more points to reach{" "}
              {nextTier.name}
            </Text>
          </View>
        )}

        {/* Tabs */}
        <View
          style={{
            flexDirection: "row",
            marginHorizontal: 20,
            marginTop: 20,
            backgroundColor: "#F1F5F9",
            borderRadius: 12,
            padding: 4,
          }}
        >
          {(["points", "rewards", "tiers"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              onPress={() => setActiveTab(tab)}
              style={{
                flex: 1,
                paddingVertical: 10,
                borderRadius: 10,
                backgroundColor: activeTab === tab ? "white" : "transparent",
                alignItems: "center",
                shadowColor: activeTab === tab ? "#000" : "transparent",
                shadowOpacity: 0.06,
                shadowRadius: 4,
                elevation: activeTab === tab ? 2 : 0,
              }}
            >
              <Text
                style={{
                  color: activeTab === tab ? "#14532D" : "#64748B",
                  fontWeight: "bold",
                  fontSize: 12,
                }}
              >
                {tab === "points"
                  ? "How to Earn"
                  : tab === "rewards"
                    ? "Rewards"
                    : "Tier Perks"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Tab Content */}
        <View style={{ marginHorizontal: 20, marginTop: 16 }}>
          {activeTab === "points" && (
            <View style={{ gap: 10 }}>
              {EARN_ITEMS.map((item, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: "white",
                    borderRadius: 12,
                    padding: 16,
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 12,
                    elevation: 2,
                  }}
                >
                  <View style={{ width: 36, alignItems: "center" }}>
                    {item.icon}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontWeight: "bold", color: "#0F172A" }}>
                      {item.action}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: "#14532D",
                      fontWeight: "bold",
                      fontSize: 13,
                    }}
                  >
                    {item.points}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "rewards" && (
            <View style={{ gap: 10 }}>
              <Text style={{ color: "#64748B", fontSize: 13, marginBottom: 6 }}>
                You have{" "}
                <Text style={{ color: "#14532D", fontWeight: "bold" }}>
                  {profile.points.toLocaleString()} points
                </Text>{" "}
                to spend
              </Text>
              {REWARDS.map((reward) => {
                const canRedeem = profile.points >= reward.points;
                return (
                  <View
                    key={reward.id}
                    style={{
                      backgroundColor: "white",
                      borderRadius: 12,
                      padding: 16,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 12,
                      elevation: 2,
                      opacity: canRedeem ? 1 : 0.5,
                    }}
                  >
                    <View style={{ width: 36, alignItems: "center" }}>
                      {reward.icon}
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ fontWeight: "bold", color: "#0F172A" }}>
                        {reward.name}
                      </Text>
                      <Text
                        style={{ color: "#14532D", fontSize: 13, marginTop: 2 }}
                      >
                        {reward.points} points
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: canRedeem ? "#14532D" : "#E2E8F0",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                      }}
                      disabled={!canRedeem}
                    >
                      <Text
                        style={{
                          color: canRedeem ? "white" : "#94A3B8",
                          fontWeight: "bold",
                          fontSize: 13,
                        }}
                      >
                        {canRedeem ? "Redeem" : "Locked"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          )}

          {activeTab === "tiers" && (
            <View style={{ gap: 12 }}>
              {TIERS.map((tier, i) => {
                const isCurrentTier = tier.name === currentTier.name;
                return (
                  <View
                    key={i}
                    style={{
                      backgroundColor: isCurrentTier ? "#F0FDF4" : "white",
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: isCurrentTier ? 2 : 1,
                      borderColor: isCurrentTier ? "#14532D" : "#E2E8F0",
                    }}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 10,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 8,
                        }}
                      >
                        {tier.icon}
                        <Text
                          style={{
                            fontWeight: "bold",
                            color: tier.color,
                            fontSize: 16,
                          }}
                        >
                          {tier.name}
                        </Text>
                      </View>
                      {isCurrentTier && (
                        <View
                          style={{
                            backgroundColor: "#14532D",
                            borderRadius: 12,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 11,
                              fontWeight: "bold",
                            }}
                          >
                            YOUR TIER
                          </Text>
                        </View>
                      )}
                    </View>
                    <Text
                      style={{
                        color: "#64748B",
                        fontSize: 12,
                        marginBottom: 10,
                      }}
                    >
                      {tier.minPoints.toLocaleString()} –{" "}
                      {tier.maxPoints === 999999
                        ? "∞"
                        : tier.maxPoints.toLocaleString()}{" "}
                      points
                    </Text>
                    {tier.perks.map((perk, j) => (
                      <View
                        key={j}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                          marginBottom: 4,
                        }}
                      >
                        <Ionicons
                          name="checkmark"
                          size={14}
                          color={tier.color}
                        />
                        <Text style={{ color: "#4B5563", fontSize: 13 }}>
                          {perk}
                        </Text>
                      </View>
                    ))}
                  </View>
                );
              })}
            </View>
          )}
        </View>

        {/* Get in Touch */}
        <View
          style={{
            margin: 20,
            marginTop: 24,
            backgroundColor: "white",
            borderRadius: 16,
            padding: 20,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#0F172A",
              marginBottom: 16,
            }}
          >
            Get in touch
          </Text>
          <TouchableOpacity
            onPress={() => Linking.openURL("https://m.me/vshotelph")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 30,
              paddingVertical: 14,
              paddingHorizontal: 20,
              marginBottom: 12,
            }}
          >
            <FontAwesome5 name="facebook-messenger" size={20} color="#0084FF" />
            <Text
              style={{ fontWeight: "bold", color: "#0F172A", fontSize: 15 }}
            >
              Chat with us
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => Linking.openURL("tel:+639178259938")}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              borderWidth: 1,
              borderColor: "#E2E8F0",
              borderRadius: 30,
              paddingVertical: 14,
              paddingHorizontal: 20,
            }}
          >
            <FontAwesome5 name="phone" size={18} color="#14532D" />
            <Text
              style={{ fontWeight: "bold", color: "#0F172A", fontSize: 15 }}
            >
              Request a Call
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            backgroundColor: "white",
            borderRadius: 16,
            overflow: "hidden",
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: "#0F172A",
              padding: 16,
              paddingBottom: 8,
            }}
          >
            Account
          </Text>
          {ACCOUNT_ITEMS.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                padding: 16,
                borderTopWidth: 1,
                borderTopColor: "#F1F5F9",
              }}
            >
              <View style={{ width: 24, alignItems: "center" }}>
                {item.icon}
              </View>
              <Text style={{ flex: 1, color: "#0F172A", fontSize: 15 }}>
                {item.label}
              </Text>
              <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
            </TouchableOpacity>
          ))}
          <TouchableOpacity
            onPress={handleSignOut}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              padding: 16,
              borderTopWidth: 1,
              borderTopColor: "#F1F5F9",
            }}
          >
            <FontAwesome5 name="sign-out-alt" size={16} color="#DC2626" />
            <Text
              style={{
                flex: 1,
                color: "#DC2626",
                fontSize: 15,
                fontWeight: "bold",
              }}
            >
              Sign Out
            </Text>
          </TouchableOpacity>
        </View>

        {/* Bottom spacer for floating tab bar */}
        <View style={{ height: 120 }} />
      </ScrollView>
    </SafeAreaView>
  );
}
