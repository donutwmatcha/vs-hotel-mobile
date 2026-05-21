// src/screens/ProfileScreen.tsx
import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Linking,
  Modal,
  ScrollView,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../lib/supabase";

// ─── Brand colors ─────────────────────────────────────────────────────────────
const C = {
  green: "#14532D",
  gold: "#C89B3C",
  white: "#FFFFFF",
  offWhite: "#F5F5F5",
  gray: "#64748B",
  grayLight: "#E2E8F0",
  dark: "#0F172A",
};

// ─── Preset Avatars ───────────────────────────────────────────────────────────
const PRESET_AVATARS = [
  { id: 1, source: require("../assets/avatars/avatar1.jpg") },
  { id: 2, source: require("../assets/avatars/avatar2.jpg") },
  { id: 3, source: require("../assets/avatars/avatar3.jpg") },
  { id: 4, source: require("../assets/avatars/avatar4.jpg") },
  { id: 5, source: require("../assets/avatars/avatar5.jpg") },
  { id: 6, source: require("../assets/avatars/avatar6.jpg") },
  { id: 7, source: require("../assets/avatars/avatar7.jpg") },
  { id: 8, source: require("../assets/avatars/avatar8.jpg") },
];

// ─── Tier / Rewards / Earn data ───────────────────────────────────────────────
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

// ─── Avatar Picker Modal ──────────────────────────────────────────────────────
function AvatarPickerModal({
  visible,
  currentAvatarId,
  onClose,
  onSelectPreset,
  onUploadCustom,
  saving,
}: {
  visible: boolean;
  currentAvatarId: number | null;
  onClose: () => void;
  onSelectPreset: (id: number) => void;
  onUploadCustom: () => void;
  saving: boolean;
}) {
  const [selected, setSelected] = useState<number | null>(currentAvatarId);

  useEffect(() => {
    if (visible) setSelected(currentAvatarId);
  }, [visible, currentAvatarId]);

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: C.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#DDD",
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: C.dark,
              marginBottom: 4,
            }}
          >
            Choose Avatar
          </Text>
          <Text style={{ fontSize: 13, color: C.gray, marginBottom: 20 }}>
            Pick a preset or upload your own photo
          </Text>

          <TouchableOpacity
            onPress={onUploadCustom}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              backgroundColor: C.offWhite,
              borderRadius: 12,
              padding: 14,
              marginBottom: 20,
              borderWidth: 1.5,
              borderColor: C.grayLight,
            }}
          >
            <View
              style={{
                width: 40,
                height: 40,
                borderRadius: 20,
                backgroundColor: C.green + "20",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Ionicons name="camera-outline" size={20} color={C.green} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontWeight: "700", color: C.dark, fontSize: 14 }}>
                Upload Your Own Photo
              </Text>
              <Text style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>
                Choose from your camera roll
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={C.gray} />
          </TouchableOpacity>

          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              marginBottom: 16,
            }}
          >
            <View
              style={{ flex: 1, height: 1, backgroundColor: C.grayLight }}
            />
            <Text style={{ color: C.gray, fontSize: 12 }}>
              or choose a preset
            </Text>
            <View
              style={{ flex: 1, height: 1, backgroundColor: C.grayLight }}
            />
          </View>

          <View
            style={{
              flexDirection: "row",
              flexWrap: "wrap",
              gap: 12,
              justifyContent: "center",
              marginBottom: 24,
            }}
          >
            {PRESET_AVATARS.map((avatar) => (
              <TouchableOpacity
                key={avatar.id}
                onPress={() => setSelected(avatar.id)}
                activeOpacity={0.8}
                style={{
                  borderRadius: 50,
                  borderWidth: selected === avatar.id ? 3 : 2,
                  borderColor: selected === avatar.id ? C.green : C.grayLight,
                  padding: 2,
                }}
              >
                <Image
                  source={avatar.source}
                  style={{ width: 72, height: 72, borderRadius: 36 }}
                  resizeMode="cover"
                />
                {selected === avatar.id && (
                  <View
                    style={{
                      position: "absolute",
                      bottom: 2,
                      right: 2,
                      backgroundColor: C.green,
                      borderRadius: 10,
                      width: 20,
                      height: 20,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <Ionicons name="checkmark" size={12} color={C.white} />
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>

          <TouchableOpacity
            onPress={() => {
              if (selected) onSelectPreset(selected);
            }}
            disabled={!selected || saving}
            style={{
              backgroundColor: selected && !saving ? C.green : C.grayLight,
              borderRadius: 30,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            {saving ? (
              <ActivityIndicator color={C.white} />
            ) : (
              <Text
                style={{
                  color: selected ? C.white : C.gray,
                  fontWeight: "800",
                  fontSize: 15,
                }}
              >
                Save Avatar
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{ paddingVertical: 10, alignItems: "center" }}
          >
            <Text style={{ color: C.gray, fontSize: 14 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Personal Info Modal ──────────────────────────────────────────────────────
function PersonalInfoModal({
  visible,
  profile,
  onClose,
  onSaved,
}: {
  visible: boolean;
  profile: any;
  onClose: () => void;
  onSaved: () => void;
}) {
  const [firstName, setFirstName] = useState(profile?.first_name ?? "");
  const [lastName, setLastName] = useState(profile?.last_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible) {
      setFirstName(profile?.first_name ?? "");
      setLastName(profile?.last_name ?? "");
      setPhone(profile?.phone ?? "");
    }
  }, [visible, profile]);

  async function handleSave() {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert("Missing Info", "First and last name are required.");
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({
          first_name: firstName.trim(),
          last_name: lastName.trim(),
          phone: phone.trim(),
        })
        .eq("id", profile.id);
      if (error) throw error;
      Alert.alert("Saved! ✅", "Your profile has been updated.", [
        {
          text: "OK",
          onPress: () => {
            onSaved();
            onClose();
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not save changes.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)",
          justifyContent: "flex-end",
        }}
      >
        <View
          style={{
            backgroundColor: C.white,
            borderTopLeftRadius: 28,
            borderTopRightRadius: 28,
            padding: 24,
            paddingBottom: 40,
          }}
        >
          <View
            style={{
              width: 40,
              height: 4,
              backgroundColor: "#DDD",
              borderRadius: 2,
              alignSelf: "center",
              marginBottom: 20,
            }}
          />
          <Text
            style={{
              fontSize: 20,
              fontWeight: "900",
              color: C.dark,
              marginBottom: 4,
            }}
          >
            Personal Information
          </Text>
          <Text style={{ fontSize: 13, color: C.gray, marginBottom: 24 }}>
            Update your profile details
          </Text>

          <Text style={labelStyle}>FIRST NAME</Text>
          <TextInput
            style={inputStyle}
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Juan"
            placeholderTextColor={C.gray}
          />

          <Text style={[labelStyle, { marginTop: 14 }]}>LAST NAME</Text>
          <TextInput
            style={inputStyle}
            value={lastName}
            onChangeText={setLastName}
            placeholder="Dela Cruz"
            placeholderTextColor={C.gray}
          />

          <Text style={[labelStyle, { marginTop: 14 }]}>EMAIL</Text>
          <View
            style={[
              inputStyle,
              { backgroundColor: "#F1F5F9", justifyContent: "center" },
            ]}
          >
            <Text style={{ color: C.gray, fontSize: 15 }}>
              {profile?.email}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 11,
              color: C.gray,
              marginTop: 4,
              marginBottom: 14,
            }}
          >
            Email cannot be changed here.
          </Text>

          <Text style={labelStyle}>PHONE NUMBER</Text>
          <TextInput
            style={inputStyle}
            value={phone}
            onChangeText={setPhone}
            placeholder="+63 917 000 0000"
            keyboardType="phone-pad"
            placeholderTextColor={C.gray}
          />

          <TouchableOpacity
            onPress={handleSave}
            disabled={loading}
            style={{
              backgroundColor: loading ? C.gray : C.green,
              borderRadius: 30,
              paddingVertical: 14,
              alignItems: "center",
              marginTop: 24,
              marginBottom: 10,
            }}
          >
            <Text style={{ color: C.white, fontWeight: "800", fontSize: 15 }}>
              {loading ? "Saving..." : "Save Changes"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={onClose}
            style={{ paddingVertical: 10, alignItems: "center" }}
          >
            <Text style={{ color: C.gray, fontSize: 14 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Avatar Display ───────────────────────────────────────────────────────────
function AvatarDisplay({
  avatarId,
  customUri,
  size = 80,
  onPress,
}: {
  avatarId: number | null;
  customUri: string | null;
  size?: number;
  onPress?: () => void;
}) {
  const preset = PRESET_AVATARS.find((a) => a.id === avatarId);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.85}
      style={{ position: "relative" }}
    >
      {customUri ? (
        <Image
          source={{ uri: customUri }}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: C.gold,
          }}
          resizeMode="cover"
        />
      ) : preset ? (
        <Image
          source={preset.source}
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: 2,
            borderColor: C.gold,
          }}
          resizeMode="cover"
        />
      ) : (
        <View
          style={{
            width: size,
            height: size,
            borderRadius: size / 2,
            backgroundColor: C.gold,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <FontAwesome5 name="user" size={size * 0.4} color={C.white} />
        </View>
      )}
      {onPress && (
        <View
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            backgroundColor: C.green,
            borderRadius: 12,
            width: 24,
            height: 24,
            alignItems: "center",
            justifyContent: "center",
            borderWidth: 2,
            borderColor: C.white,
          }}
        >
          <FontAwesome5 name="pen" size={10} color={C.white} />
        </View>
      )}
    </TouchableOpacity>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export default function ProfileScreen() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<"points" | "rewards" | "tiers">(
    "points",
  );
  const [avatarId, setAvatarId] = useState<number | null>(
    profile?.avatar_id ?? null,
  );
  const [customAvatarUri, setCustomAvatarUri] = useState<string | null>(
    profile?.avatar_url ?? null,
  );
  const [showAvatarPicker, setShowAvatarPicker] = useState(false);
  const [showPersonalInfo, setShowPersonalInfo] = useState(false);
  const [savingAvatar, setSavingAvatar] = useState(false);
  const [emailSubscribed, setEmailSubscribed] = useState(
    profile?.email_subscribed ?? false,
  );
  const [savingEmail, setSavingEmail] = useState(false);

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

  useEffect(() => {
    if (profile) {
      setAvatarId(profile.avatar_id ?? null);
      setCustomAvatarUri(profile.avatar_url ?? null);
      setEmailSubscribed(profile.email_subscribed ?? false);
    }
  }, [profile]);

  useFocusEffect(
    useCallback(() => {
      refreshProfile();
    }, []),
  );

  async function handleSavePresetAvatar(id: number) {
    setSavingAvatar(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ avatar_id: id, avatar_url: null })
        .eq("id", user!.id);
      if (error) throw error;
      setAvatarId(id);
      setCustomAvatarUri(null);
      setShowAvatarPicker(false);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not save avatar.");
    } finally {
      setSavingAvatar(false);
    }
  }

  async function handleUploadCustomPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (result.canceled) return;

    setSavingAvatar(true);
    setShowAvatarPicker(false);

    try {
      const uri = result.assets[0].uri;
      const fileName = `${user!.id}/avatar.jpg`;
      const response = await fetch(uri);
      const blob = await response.blob();
      const arrayBuffer = await new Response(blob).arrayBuffer();

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(fileName, arrayBuffer, {
          contentType: "image/jpeg",
          upsert: true,
        });
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(fileName);
      const publicUrl = `${urlData.publicUrl}?t=${Date.now()}`;

      const { error: updateError } = await supabase
        .from("profiles")
        .update({ avatar_url: publicUrl, avatar_id: null })
        .eq("id", user!.id);
      if (updateError) throw updateError;

      setCustomAvatarUri(publicUrl);
      setAvatarId(null);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not upload photo.");
    } finally {
      setSavingAvatar(false);
    }
  }

  async function handleEmailToggle(value: boolean) {
    setSavingEmail(true);
    try {
      const { error } = await supabase
        .from("profiles")
        .update({ email_subscribed: value })
        .eq("id", profile?.id);
      if (error) throw error;
      setEmailSubscribed(value);
    } catch {
      Alert.alert("Error", "Could not update email preference.");
    } finally {
      setSavingEmail(false);
    }
  }

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
        style={{ flex: 1, backgroundColor: C.green }}
        edges={["top"]}
      >
        <ScrollView style={{ flex: 1, backgroundColor: C.white }}>
          <View
            style={{
              backgroundColor: C.green,
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
              <FontAwesome5 name="user" size={36} color={C.white} />
            </View>
            <Text
              style={{
                color: C.white,
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
                  backgroundColor: C.gold,
                  paddingVertical: 14,
                  borderRadius: 30,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <FontAwesome5 name="user-plus" size={14} color={C.white} />
                <Text
                  style={{ color: C.white, fontWeight: "bold", fontSize: 16 }}
                >
                  Join for Free
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => router.push("/signin")}
                style={{
                  flex: 1,
                  borderWidth: 2,
                  borderColor: C.white,
                  paddingVertical: 14,
                  borderRadius: 30,
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                  gap: 8,
                }}
              >
                <FontAwesome5 name="sign-in-alt" size={14} color={C.white} />
                <Text
                  style={{ color: C.white, fontWeight: "bold", fontSize: 16 }}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{ padding: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: C.dark,
                marginBottom: 4,
              }}
            >
              Earn VS Points
            </Text>
            <Text
              style={{
                color: C.gray,
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
                  <Text style={{ fontWeight: "bold", color: C.dark }}>
                    {item.action}
                  </Text>
                </View>
                <Text
                  style={{ color: C.green, fontWeight: "bold", fontSize: 13 }}
                >
                  {item.points}
                </Text>
              </View>
            ))}
          </View>

          <View style={{ paddingHorizontal: 20, paddingBottom: 20 }}>
            <Text
              style={{
                fontSize: 22,
                fontWeight: "bold",
                color: C.dark,
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
                  backgroundColor: i === 2 ? "#F0FDF4" : C.white,
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

          <View
            style={{
              margin: 20,
              backgroundColor: C.dark,
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
              <FontAwesome5 name="lock" size={13} color={C.gold} />
              <Text
                style={{
                  color: C.gold,
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
                color: C.white,
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
                backgroundColor: C.gold,
                paddingVertical: 14,
                borderRadius: 30,
                alignItems: "center",
                marginTop: 16,
                flexDirection: "row",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FontAwesome5 name="unlock" size={14} color={C.white} />
              <Text
                style={{ color: C.white, fontWeight: "bold", fontSize: 16 }}
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
              marginBottom: 80,
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <FontAwesome5 name="sign-in-alt" size={13} color={C.gray} />
            <Text style={{ color: C.gray, fontSize: 14 }}>
              Already a member?{" "}
              <Text style={{ color: C.green, fontWeight: "bold" }}>
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
    <SafeAreaView style={{ flex: 1, backgroundColor: C.green }} edges={["top"]}>
      <ScrollView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: C.green,
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
            <View style={{ flex: 1, marginRight: 16 }}>
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
                  color: C.white,
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

            {savingAvatar ? (
              <View
                style={{
                  width: 80,
                  height: 80,
                  borderRadius: 40,
                  backgroundColor: "rgba(255,255,255,0.2)",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <ActivityIndicator color={C.white} />
              </View>
            ) : (
              <AvatarDisplay
                avatarId={avatarId}
                customUri={customAvatarUri}
                size={80}
                onPress={() => setShowAvatarPicker(true)}
              />
            )}
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
            <Text style={{ color: C.white, fontWeight: "bold", fontSize: 15 }}>
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
            backgroundColor: C.white,
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
            <Text style={{ fontSize: 24, fontWeight: "bold", color: C.green }}>
              {profile.points.toLocaleString()}
            </Text>
            <Text style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>
              VS Points
            </Text>
          </View>
          <View style={{ width: 1, backgroundColor: "#E2E8F0" }} />
          <View style={{ flex: 1, alignItems: "center" }}>
            <Text style={{ fontSize: 24, fontWeight: "bold", color: C.green }}>
              {profile.total_stays}
            </Text>
            <Text style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>
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
            <Text style={{ color: C.gray, fontSize: 12, marginTop: 2 }}>
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
              backgroundColor: C.white,
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
              <Text style={{ color: C.dark, fontWeight: "bold" }}>
                Progress to {nextTier.name}
              </Text>
              <Text style={{ color: C.gray, fontSize: 13 }}>
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
                  backgroundColor: C.gold,
                  borderRadius: 8,
                }}
              />
            </View>
            <Text style={{ color: C.gray, fontSize: 12, marginTop: 6 }}>
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
                backgroundColor: activeTab === tab ? C.white : "transparent",
                alignItems: "center",
                elevation: activeTab === tab ? 2 : 0,
              }}
            >
              <Text
                style={{
                  color: activeTab === tab ? C.green : C.gray,
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
                    backgroundColor: C.white,
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
                    <Text style={{ fontWeight: "bold", color: C.dark }}>
                      {item.action}
                    </Text>
                  </View>
                  <Text
                    style={{ color: C.green, fontWeight: "bold", fontSize: 13 }}
                  >
                    {item.points}
                  </Text>
                </View>
              ))}
            </View>
          )}

          {activeTab === "rewards" && (
            <View style={{ gap: 10 }}>
              <Text style={{ color: C.gray, fontSize: 13, marginBottom: 6 }}>
                You have{" "}
                <Text style={{ color: C.green, fontWeight: "bold" }}>
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
                      backgroundColor: C.white,
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
                      <Text style={{ fontWeight: "bold", color: C.dark }}>
                        {reward.name}
                      </Text>
                      <Text
                        style={{ color: C.green, fontSize: 13, marginTop: 2 }}
                      >
                        {reward.points} points
                      </Text>
                    </View>
                    <TouchableOpacity
                      style={{
                        backgroundColor: canRedeem ? C.green : "#E2E8F0",
                        paddingHorizontal: 16,
                        paddingVertical: 8,
                        borderRadius: 20,
                      }}
                      disabled={!canRedeem}
                      onPress={() =>
                        Alert.alert(
                          "Redeem Reward",
                          `Redeem ${reward.name} for ${reward.points} points?`,
                          [
                            { text: "Cancel", style: "cancel" },
                            {
                              text: "Redeem",
                              onPress: () =>
                                Alert.alert(
                                  "Success! 🎉",
                                  `Your ${reward.name} reward has been requested. Our team will be in touch shortly.`,
                                ),
                            },
                          ],
                        )
                      }
                    >
                      <Text
                        style={{
                          color: canRedeem ? C.white : "#94A3B8",
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
                      backgroundColor: isCurrentTier ? "#F0FDF4" : C.white,
                      borderRadius: 16,
                      padding: 16,
                      borderWidth: isCurrentTier ? 2 : 1,
                      borderColor: isCurrentTier ? C.green : "#E2E8F0",
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
                            backgroundColor: C.green,
                            borderRadius: 12,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                          }}
                        >
                          <Text
                            style={{
                              color: C.white,
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
                      style={{ color: C.gray, fontSize: 12, marginBottom: 10 }}
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
            backgroundColor: C.white,
            borderRadius: 16,
            padding: 20,
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: C.dark,
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
            <Text style={{ fontWeight: "bold", color: C.dark, fontSize: 15 }}>
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
            <FontAwesome5 name="phone" size={18} color={C.green} />
            <Text style={{ fontWeight: "bold", color: C.dark, fontSize: 15 }}>
              Request a Call
            </Text>
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <View
          style={{
            marginHorizontal: 20,
            marginBottom: 20,
            backgroundColor: C.white,
            borderRadius: 16,
            overflow: "hidden",
            elevation: 2,
          }}
        >
          <Text
            style={{
              fontSize: 16,
              fontWeight: "bold",
              color: C.dark,
              padding: 16,
              paddingBottom: 8,
            }}
          >
            Account
          </Text>

          {/* Personal Information */}
          <TouchableOpacity
            onPress={() => setShowPersonalInfo(true)}
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
              <FontAwesome5 name="user" size={16} color={C.gray} />
            </View>
            <Text style={{ flex: 1, color: C.dark, fontSize: 15 }}>
              Personal Information
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Member Benefits → switches to tiers tab */}
          <TouchableOpacity
            onPress={() => setActiveTab("tiers")}
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
              <FontAwesome5 name="star" size={16} color={C.gray} />
            </View>
            <Text style={{ flex: 1, color: C.dark, fontSize: 15 }}>
              Member Benefits
            </Text>
            <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
          </TouchableOpacity>

          {/* Email Subscriptions — Switch toggle */}
          <View
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
              <Ionicons name="mail-outline" size={18} color={C.gray} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: C.dark, fontSize: 15 }}>
                Email Subscriptions
              </Text>
              <Text style={{ color: C.gray, fontSize: 11, marginTop: 1 }}>
                {emailSubscribed
                  ? "Receiving promos & updates"
                  : "Not subscribed"}
              </Text>
            </View>
            <Switch
              value={emailSubscribed}
              onValueChange={handleEmailToggle}
              disabled={savingEmail}
              trackColor={{ false: "#E2E8F0", true: C.green }}
              thumbColor={C.white}
            />
          </View>

          {/* Sign Out */}
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

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Modals */}
      <AvatarPickerModal
        visible={showAvatarPicker}
        currentAvatarId={avatarId}
        onClose={() => setShowAvatarPicker(false)}
        onSelectPreset={handleSavePresetAvatar}
        onUploadCustom={handleUploadCustomPhoto}
        saving={savingAvatar}
      />
      <PersonalInfoModal
        visible={showPersonalInfo}
        profile={profile}
        onClose={() => setShowPersonalInfo(false)}
        onSaved={refreshProfile}
      />
    </SafeAreaView>
  );
}

// ─── Shared input styles ──────────────────────────────────────────────────────
const labelStyle: any = {
  fontSize: 11,
  fontWeight: "bold",
  color: "#64748B",
  marginBottom: 6,
  letterSpacing: 1,
};

const inputStyle: any = {
  borderWidth: 1,
  borderColor: "#E2E8F0",
  borderRadius: 10,
  padding: 14,
  backgroundColor: "#F8FAFC",
  color: "#0F172A",
  fontSize: 15,
};
