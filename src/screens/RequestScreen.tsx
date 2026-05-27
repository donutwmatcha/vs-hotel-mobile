import {
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import React, { useEffect, useState } from "react";
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
import { useAuth } from "../context/AuthContext";
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

interface Review {
  id: string;
  rating: number;
  comment: string;
  created_at: string;
  points_awarded: number;
}

function StarRow({ rating, size = 14 }: { rating: number; size?: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((s) => (
        <Ionicons
          key={s}
          name={rating >= s ? "star" : "star-outline"}
          size={size}
          color={C.gold}
        />
      ))}
    </View>
  );
}

export default function RequestScreen() {
  const { user, profile, lastCheckOut } = useAuth();
  const [activeTab, setActiveTab] = useState<
    "request" | "feedback" | "history"
  >("request");

  // Request state
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null,
  );
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [roomNumber, setRoomNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);

  // Feedback state
  const [rating, setRating] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [commentLoading, setCommentLoading] = useState(false);

  // History state
  const [reviews, setReviews] = useState<Review[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);

  // Check if user already reviewed this checkout
  const [alreadyReviewed, setAlreadyReviewed] = useState(false);

  useEffect(() => {
    if (activeTab === "history") fetchReviews();
  }, [activeTab]);

  // Check if already reviewed after this checkout
  useEffect(() => {
    if (user && lastCheckOut) checkIfReviewed();
  }, [user, lastCheckOut]);

  async function checkIfReviewed() {
    if (!user || !lastCheckOut) return;
    const { data } = await supabase
      .from("guest_reviews")
      .select("id")
      .eq("guest_id", user.id)
      .gte("created_at", lastCheckOut.checked_in_at)
      .limit(1);
    setAlreadyReviewed((data?.length ?? 0) > 0);
  }

  async function fetchReviews() {
    if (!user) return;
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase
        .from("guest_reviews")
        .select("*")
        .eq("guest_id", user.id)
        .order("created_at", { ascending: false });
      if (!error) setReviews(data ?? []);
    } catch (e) {
      console.log("Error fetching reviews:", e);
    } finally {
      setHistoryLoading(false);
    }
  }

  const resetRequest = () => {
    setSelectedCategory(null);
    setSelectedOption(null);
    setRoomNumber("");
    setNotes("");
  };

  async function handleSubmitRequest() {
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
  }

  async function handleSubmitFeedback() {
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
      // Save to guest_feedback
      const { error: fbError } = await supabase.from("guest_feedback").insert({
        rating,
        comment: commentText.trim(),
        created_at: new Date().toISOString(),
      });
      if (fbError) throw fbError;

      // Save to guest_reviews (with guest_id for history) and award 20 points
      if (user && profile) {
        await supabase.from("guest_reviews").insert({
          guest_id: user.id,
          rating,
          comment: commentText.trim(),
          points_awarded: 20,
          created_at: new Date().toISOString(),
        });
        await supabase
          .from("profiles")
          .update({
            points: (profile.points ?? 0) + 20,
          })
          .eq("id", user.id);
      }

      Alert.alert(
        "Thank You! 🎉",
        "Your feedback helps us serve you better. You've earned +20 VS Points!",
        [
          {
            text: "Done",
            onPress: () => {
              setRating(0);
              setCommentText("");
              setAlreadyReviewed(true);
            },
          },
        ],
      );
    } catch (err: any) {
      Alert.alert("Error", err.message || "Could not submit feedback.");
    } finally {
      setCommentLoading(false);
    }
  }

  function formatDate(iso: string) {
    const d = new Date(iso);
    return (
      d.toLocaleDateString("en-PH", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }) +
      " • " +
      d.toLocaleTimeString("en-PH", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      })
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={["top"]}>
      <StatusBar barStyle="light-content" backgroundColor={C.green} />

      {/* ── Header ── */}
      <View style={styles.headerBlock}>
        <View style={styles.header}>
          <Text style={styles.headerEyebrow}>How can we help?</Text>
          <Text style={styles.headerTitle}>Requests & Feedback</Text>
        </View>

        {/* 3 tabs */}
        <View style={styles.tabRow}>
          <TouchableOpacity
            style={[styles.tab, activeTab === "request" && styles.tabActive]}
            onPress={() => setActiveTab("request")}
          >
            <MaterialCommunityIcons
              name="bell-ring-outline"
              size={14}
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
              Request
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "feedback" && styles.tabActive]}
            onPress={() => setActiveTab("feedback")}
          >
            <Ionicons
              name="chatbubble-outline"
              size={13}
              color={
                activeTab === "feedback" ? C.white : "rgba(255,255,255,0.6)"
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "feedback" && styles.tabTextActive,
              ]}
            >
              Feedback
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.tab, activeTab === "history" && styles.tabActive]}
            onPress={() => setActiveTab("history")}
          >
            <Ionicons
              name="time-outline"
              size={14}
              color={
                activeTab === "history" ? C.white : "rgba(255,255,255,0.6)"
              }
            />
            <Text
              style={[
                styles.tabText,
                activeTab === "history" && styles.tabTextActive,
              ]}
            >
              My Reviews
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Content ── */}
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
          {/* ── REQUEST TAB ── */}
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

          {/* ── FEEDBACK TAB ── */}
          {activeTab === "feedback" && (
            <>
              {/* Not logged in */}
              {!user ? (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={44}
                    color={C.grayLight}
                  />
                  <Text
                    style={{
                      color: C.dark,
                      fontSize: 15,
                      marginTop: 12,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Sign in to leave a review
                  </Text>
                  <Text
                    style={{
                      color: C.gray,
                      fontSize: 13,
                      marginTop: 6,
                      textAlign: "center",
                    }}
                  >
                    You need an account to submit feedback and earn VS Points.
                  </Text>
                </View>
              ) : /* Not checked out yet */
              !lastCheckOut ? (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Ionicons name="bed-outline" size={44} color={C.grayLight} />
                  <Text
                    style={{
                      color: C.dark,
                      fontSize: 15,
                      marginTop: 12,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    No checkout yet
                  </Text>
                  <Text
                    style={{
                      color: C.gray,
                      fontSize: 13,
                      marginTop: 6,
                      textAlign: "center",
                    }}
                  >
                    You can leave a review after your checkout is processed by
                    the front desk.
                  </Text>
                </View>
              ) : /* Already reviewed this checkout */
              alreadyReviewed ? (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Ionicons name="checkmark-circle" size={44} color={C.green} />
                  <Text
                    style={{
                      color: C.dark,
                      fontSize: 15,
                      marginTop: 12,
                      fontWeight: "600",
                      textAlign: "center",
                    }}
                  >
                    Review submitted!
                  </Text>
                  <Text
                    style={{
                      color: C.gray,
                      fontSize: 13,
                      marginTop: 6,
                      textAlign: "center",
                    }}
                  >
                    You've already left a review for your latest stay. Thank
                    you!
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActiveTab("history")}
                    style={{
                      marginTop: 16,
                      backgroundColor: C.green,
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: C.white,
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      View My Reviews
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                /* Can review */
                <>
                  {/* Points hint */}
                  <View
                    style={{
                      backgroundColor: "#F0FDF4",
                      borderRadius: 12,
                      padding: 14,
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      marginBottom: 20,
                      borderWidth: 1,
                      borderColor: "#BBF7D0",
                    }}
                  >
                    <FontAwesome5 name="star" size={16} color={C.green} solid />
                    <Text
                      style={{
                        flex: 1,
                        color: C.green,
                        fontSize: 13,
                        fontWeight: "600",
                      }}
                    >
                      Leave a review and earn{" "}
                      <Text style={{ fontWeight: "800" }}>+20 VS Points!</Text>
                    </Text>
                  </View>

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
                    onPress={handleSubmitFeedback}
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
                        <Text style={styles.submitBtnText}>
                          Submit Feedback
                        </Text>
                      </View>
                    )}
                  </TouchableOpacity>
                </>
              )}
            </>
          )}

          {/* ── HISTORY TAB ── */}
          {activeTab === "history" && (
            <>
              {!user ? (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Ionicons
                    name="lock-closed-outline"
                    size={40}
                    color={C.gray}
                  />
                  <Text
                    style={{
                      color: C.gray,
                      fontSize: 15,
                      marginTop: 12,
                      textAlign: "center",
                    }}
                  >
                    Sign in to see your review history
                  </Text>
                </View>
              ) : historyLoading ? (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <ActivityIndicator color={C.green} size="large" />
                  <Text style={{ color: C.gray, marginTop: 12 }}>
                    Loading reviews...
                  </Text>
                </View>
              ) : reviews.length === 0 ? (
                <View style={{ alignItems: "center", paddingVertical: 40 }}>
                  <Ionicons
                    name="chatbubble-ellipses-outline"
                    size={44}
                    color={C.grayLight}
                  />
                  <Text
                    style={{
                      color: C.gray,
                      fontSize: 15,
                      marginTop: 12,
                      textAlign: "center",
                      fontWeight: "600",
                    }}
                  >
                    No reviews yet
                  </Text>
                  <Text
                    style={{
                      color: C.gray,
                      fontSize: 13,
                      marginTop: 6,
                      textAlign: "center",
                    }}
                  >
                    Leave a review after your stay and earn +20 VS Points!
                  </Text>
                  <TouchableOpacity
                    onPress={() => setActiveTab("feedback")}
                    style={{
                      marginTop: 16,
                      backgroundColor: C.green,
                      paddingHorizontal: 24,
                      paddingVertical: 12,
                      borderRadius: 20,
                    }}
                  >
                    <Text
                      style={{
                        color: C.white,
                        fontWeight: "700",
                        fontSize: 14,
                      }}
                    >
                      Leave a Review
                    </Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={{ gap: 14 }}>
                  <Text
                    style={{ color: C.gray, fontSize: 13, marginBottom: 4 }}
                  >
                    {reviews.length} review{reviews.length !== 1 ? "s" : ""}{" "}
                    submitted
                  </Text>
                  {reviews.map((review) => (
                    <View
                      key={review.id}
                      style={{
                        backgroundColor: C.white,
                        borderRadius: 16,
                        padding: 16,
                        shadowColor: "#000",
                        shadowOpacity: 0.05,
                        shadowRadius: 6,
                        elevation: 2,
                      }}
                    >
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          alignItems: "flex-start",
                          marginBottom: 8,
                        }}
                      >
                        <StarRow rating={review.rating} size={16} />
                        <View
                          style={{
                            backgroundColor: "#F0FDF4",
                            borderRadius: 20,
                            paddingHorizontal: 10,
                            paddingVertical: 4,
                            flexDirection: "row",
                            alignItems: "center",
                            gap: 4,
                          }}
                        >
                          <FontAwesome5
                            name="star"
                            size={10}
                            color={C.green}
                            solid
                          />
                          <Text
                            style={{
                              color: C.green,
                              fontSize: 11,
                              fontWeight: "700",
                            }}
                          >
                            +{review.points_awarded} pts
                          </Text>
                        </View>
                      </View>
                      <Text
                        style={{
                          color: C.dark,
                          fontSize: 14,
                          lineHeight: 20,
                          marginBottom: 10,
                        }}
                      >
                        {review.comment}
                      </Text>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          gap: 6,
                        }}
                      >
                        <Ionicons
                          name="time-outline"
                          size={12}
                          color={C.gray}
                        />
                        <Text style={{ color: C.gray, fontSize: 11 }}>
                          {formatDate(review.created_at)}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              )}
            </>
          )}

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: C.green },
  headerBlock: { backgroundColor: C.green, paddingBottom: 12 },
  header: { paddingHorizontal: 20, paddingTop: 12, paddingBottom: 16 },
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
  tabRow: { flexDirection: "row", paddingHorizontal: 20, gap: 8 },
  tab: {
    flex: 1,
    flexDirection: "row",
    paddingVertical: 10,
    borderRadius: 10,
    backgroundColor: C.greenLight,
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
  },
  tabActive: { backgroundColor: C.gold },
  tabText: { fontSize: 11, fontWeight: "600", color: "rgba(255,255,255,0.7)" },
  tabTextActive: { color: C.white },
  scroll: {
    flex: 1,
    backgroundColor: C.offWhite,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
  },
  scrollContent: { paddingTop: 24, paddingHorizontal: 20 },
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
