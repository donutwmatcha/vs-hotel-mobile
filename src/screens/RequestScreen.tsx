import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const C = {
  green: "#14532D",
  greenLight: "#1a6b3c",
  greenMint: "#EAF4EE",
  gold: "#B8860B",
  goldLight: "#D4A017",
  white: "#FFFFFF",
  offWhite: "#F7F9F7",
  gray: "#6B7280",
  grayLight: "#E5E7EB",
  dark: "#111827",
  red: "#EF4444",
};

type Category = {
  id: string;
  label: string;
  icon: (color: string) => React.ReactNode;
  color: string;
  options: string[];
};

const CATEGORIES: Category[] = [
  {
    id: "housekeeping",
    label: "Housekeeping",
    icon: (color) => (
      <MaterialCommunityIcons name="bed-king-outline" size={28} color={color} />
    ),
    color: "#2D6A4F",
    options: [
      "Room Cleaning",
      "Extra Towels",
      "Extra Pillows / Blanket",
      "Toiletries Refill",
      "Laundry Pickup",
      "Turndown Service",
    ],
  },
  {
    id: "guest_services",
    label: "Guest Services",
    icon: (color) => (
      <MaterialCommunityIcons name="bell-outline" size={28} color={color} />
    ),
    color: "#B8860B",
    options: [
      "Room Service (Food)",
      "Wake-Up Call",
      "Airport Transfer",
      "Taxi / Transport",
      "Baby Cot / Extra Bed",
      "Luggage Assistance",
    ],
  },
  {
    id: "maintenance",
    label: "Maintenance",
    icon: (color) => (
      <MaterialCommunityIcons name="wrench-outline" size={28} color={color} />
    ),
    color: "#374151",
    options: [
      "AC Not Working",
      "Hot Water Issue",
      "TV / Remote Issue",
      "Wi-Fi Problem",
      "Light / Electrical",
      "Plumbing Issue",
    ],
  },
  {
    id: "help",
    label: "Help / Inquiry",
    icon: (color) => (
      <Ionicons name="chatbubble-ellipses-outline" size={26} color={color} />
    ),
    color: "#6B7280",
    options: [
      "Booking Question",
      "Billing / Receipt",
      "Lost & Found",
      "Check-out Assistance",
      "Other Inquiry",
    ],
  },
];

const Chip = ({
  label,
  selected,
  onPress,
}: {
  label: string;
  selected: boolean;
  onPress: () => void;
}) => (
  <TouchableOpacity
    style={[styles.chip, selected && styles.chipSelected]}
    onPress={onPress}
    activeOpacity={0.8}
  >
    <Text style={[styles.chipText, selected && styles.chipTextSelected]}>
      {label}
    </Text>
  </TouchableOpacity>
);

export default function RequestScreen() {
  const [activeTab, setActiveTab] = useState<"request" | "comment">("request");
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  const resetRequest = () => {
    setSelectedCategory(null);
    setSelectedOption(null);
    setRoomNumber("");
    setNotes("");
  };

  const handleSubmitRequest = async () => {
    if (!selectedCategory) {
      Alert.alert("Missing Info", "Please select a request type.");
      return;
    }
    if (!selectedOption) {
      Alert.alert("Missing Info", "Please choose a specific request.");
      return;
    }
    if (!roomNumber.trim()) {
      Alert.alert("Missing Info", "Please enter your room number.");
      return;
    }

    setLoading(true);
    try {
      const { error } = await supabase.from("guest_requests").insert({
        category: selectedCategory.id,
        option: selectedOption,
        room_number: roomNumber.trim(),
        notes: notes.trim() || null,
        status: "pending",
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      Alert.alert(
        "Request Sent!",
        "Our team has received your request and will attend to you shortly.",
        [{ text: "OK", onPress: resetRequest }],
      );
    } catch (err: any) {
      Alert.alert(
        "Error",
        err.message || "Could not submit request. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitComment = async () => {
    if (rating === 0) {
      Alert.alert("Missing Rating", "Please give us a star rating.");
      return;
    }
    if (!commentText.trim()) {
      Alert.alert(
        "Missing Comment",
        "Please write your feedback before submitting.",
      );
      return;
    }

    setCommentLoading(true);
    try {
      const { error } = await supabase.from("guest_feedback").insert({
        rating,
        comment: commentText.trim(),
        created_at: new Date().toISOString(),
      });
      if (error) throw error;
      Alert.alert("Thank You!", "Your feedback helps us serve you better.", [
        {
          text: "Done",
          onPress: () => {
            setRating(0);
            setCommentText("");
          },
        },
      ]);
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not submit feedback.");
    } finally {
      setCommentLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor={C.green} />

      {/* ── Green header block ── */}
      <View style={styles.headerBlock}>
        {/* Header text only — headphone icon removed */}
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>How can we help?</Text>
          <Text style={styles.headerTitle}>Requests & Feedback</Text>
        </View>

        {/* Tab Toggle inside green block so no gap */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "request" && styles.tabActive]}
            onPress={() => setActiveTab("request")}
          >
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={16}
              color={
                activeTab === "request" ? C.white : "rgba(255,255,255,0.6)"
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "request" && styles.tabTextActive,
              ]}
            >
              Make a Request
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "comment" && styles.tabActive]}
            onPress={() => setActiveTab("comment")}
          >
            <Ionicons
              name="chatbubble-outline"
              size={15}
              color={
                activeTab === "comment" ? C.white : "rgba(255,255,255,0.6)"
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "comment" && styles.tabTextActive,
              ]}
            >
              Leave Feedback
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Scrollable content ── */}
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: C.offWhite }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          style={styles.scroll}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {activeTab === "request" && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Your Room Number</Text>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="key-outline"
                    size={18}
                    color={C.gray}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.inputWithIcon}
                    placeholder="e.g. 302"
                    placeholderTextColor={C.gray}
                    value={roomNumber}
                    onChangeText={setRoomNumber}
                    keyboardType="number-pad"
                  />
                </View>
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Request Type</Text>
                <View style={styles.categoryGrid}>
                  {CATEGORIES.map((cat) => {
                    const isActive = selectedCategory?.id === cat.id;
                    return (
                      <TouchableOpacity
                        key={cat.id}
                        style={[
                          styles.categoryCard,
                          isActive && styles.categoryCardActive,
                        ]}
                        onPress={() => {
                          setSelectedCategory(cat);
                          setSelectedOption(null);
                        }}
                        activeOpacity={0.85}
                      >
                        <View style={styles.categoryIconWrap}>
                          {cat.icon(isActive ? C.green : C.gray)}
                        </View>
                        <Text
                          style={[
                            styles.categoryLabel,
                            isActive && styles.categoryLabelActive,
                          ]}
                        >
                          {cat.label}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {selectedCategory && (
                <View style={styles.section}>
                  <Text style={styles.sectionLabel}>
                    {selectedCategory.label} — Choose one
                  </Text>
                  <View style={styles.chipWrap}>
                    {selectedCategory.options.map((opt) => (
                      <Chip
                        key={opt}
                        label={opt}
                        selected={selectedOption === opt}
                        onPress={() => setSelectedOption(opt)}
                      />
                    ))}
                  </View>
                </View>
              )}

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  Additional Notes (optional)
                </Text>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="pencil-outline"
                    size={18}
                    color={C.gray}
                    style={[
                      styles.inputIcon,
                      { alignSelf: "flex-start", marginTop: 14 },
                    ]}
                  />
                  <TextInput
                    style={[styles.inputWithIcon, styles.textarea]}
                    placeholder="Any specific details for our team..."
                    placeholderTextColor={C.gray}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    numberOfLines={3}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[styles.submitBtn, loading && styles.submitBtnDisabled]}
                onPress={handleSubmitRequest}
                disabled={loading}
                activeOpacity={0.9}
              >
                {loading ? (
                  <ActivityIndicator color={C.white} />
                ) : (
                  <View style={styles.submitBtnInner}>
                    <Ionicons name="send-outline" size={18} color={C.white} />
                    <Text style={styles.submitBtnText}>Send Request</Text>
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}

          {activeTab === "comment" && (
            <>
              <View style={styles.section}>
                <Text style={styles.sectionLabel}>
                  How was your experience?
                </Text>
                <View style={styles.starsRow}>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <TouchableOpacity
                      key={star}
                      onPress={() => setRating(star)}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={rating >= star ? "star" : "star-outline"}
                        size={38}
                        color={rating >= star ? C.gold : C.grayLight}
                      />
                    </TouchableOpacity>
                  ))}
                </View>
                {rating > 0 && (
                  <Text style={styles.ratingLabel}>
                    {
                      ["", "Poor", "Fair", "Good", "Great", "Excellent!"][
                        rating
                      ]
                    }
                  </Text>
                )}
              </View>

              <View style={styles.section}>
                <Text style={styles.sectionLabel}>Your Comments</Text>
                <View style={styles.inputRow}>
                  <Ionicons
                    name="create-outline"
                    size={18}
                    color={C.gray}
                    style={[
                      styles.inputIcon,
                      { alignSelf: "flex-start", marginTop: 14 },
                    ]}
                  />
                  <TextInput
                    style={[styles.inputWithIcon, styles.textareaLarge]}
                    placeholder="Tell us about your stay — what you loved or how we can improve..."
                    placeholderTextColor={C.gray}
                    value={commentText}
                    onChangeText={setCommentText}
                    multiline
                    numberOfLines={6}
                    textAlignVertical="top"
                  />
                </View>
              </View>

              <TouchableOpacity
                style={[
                  styles.submitBtn,
                  commentLoading && styles.submitBtnDisabled,
                ]}
                onPress={handleSubmitComment}
                disabled={commentLoading}
                activeOpacity={0.9}
              >
                {commentLoading ? (
                  <ActivityIndicator color={C.white} />
                ) : (
                  <View style={styles.submitBtnInner}>
                    <Ionicons
                      name="checkmark-circle-outline"
                      size={18}
                      color={C.white}
                    />
                    <Text style={styles.submitBtnText}>Submit Feedback</Text>
                  </View>
                )}
              </TouchableOpacity>
            </>
          )}

          <View style={{ height: 20 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  // SafeAreaView bg matches offWhite so no green bleed at bottom
  safe: { flex: 1, backgroundColor: C.green },

  // Single green block for header + tabs — no gap, no bar
  headerBlock: {
    backgroundColor: C.green,
    paddingBottom: 12,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 16,
  },
  headerEyebrow: {
    fontSize: 12,
    color: C.goldLight,
    letterSpacing: 2,
    textTransform: "uppercase",
    fontWeight: "600",
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: C.white,
    marginTop: 2,
  },

  // Tabs
  tabRow: {
    flexDirection: "row",
    paddingHorizontal: 20,
    gap: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: C.greenLight,
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  tabActive: { backgroundColor: C.gold },
  tabText: { fontSize: 12, fontWeight: "600", color: "rgba(255,255,255,0.7)" },
  tabTextActive: { color: C.white },

  // Scroll
  scroll: {
    flex: 1,
    backgroundColor: C.offWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: {
    paddingTop: 24,
    paddingHorizontal: 20,
  },

  section: { marginBottom: 24 },
  sectionLabel: {
    fontSize: 13,
    fontWeight: "700",
    color: C.dark,
    marginBottom: 10,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },

  inputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: C.grayLight,
  },
  inputIcon: { paddingLeft: 14 },
  inputWithIcon: {
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 12,
    fontSize: 15,
    color: C.dark,
  },
  textarea: { height: 80 },
  textareaLarge: { height: 140 },

  categoryGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  categoryCard: {
    width: "47%",
    backgroundColor: C.white,
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 12,
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: C.grayLight,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  categoryCardActive: { borderColor: C.green, backgroundColor: C.greenMint },
  categoryIconWrap: { marginBottom: 8 },
  categoryLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.gray,
    textAlign: "center",
  },
  categoryLabelActive: { color: C.green },

  chipWrap: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  chip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: C.white,
    borderWidth: 1.5,
    borderColor: C.grayLight,
  },
  chipSelected: { backgroundColor: C.green, borderColor: C.green },
  chipText: { fontSize: 13, color: C.gray, fontWeight: "500" },
  chipTextSelected: { color: C.white, fontWeight: "700" },

  starsRow: { flexDirection: "row", gap: 8, marginBottom: 6 },
  ratingLabel: { fontSize: 14, fontWeight: "700", color: C.gold, marginTop: 4 },

  submitBtn: {
    backgroundColor: C.green,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
    shadowColor: C.green,
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 10,
    elevation: 5,
  },
  submitBtnDisabled: { opacity: 0.6 },
  submitBtnInner: { flexDirection: "row", alignItems: "center", gap: 8 },
  submitBtnText: {
    color: C.white,
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.5,
  },
});
