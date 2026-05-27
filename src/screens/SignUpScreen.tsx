import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

const G = "#14532D";
const GOLD = "#B8860B";
const RED = "#DC2626";
const GRAY = "#64748B";
const BORDER = "#E2E8F0";
const BG = "#F8FAFC";

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const DAYS = Array.from({ length: 31 }, (_, i) => i + 1);
const YEARS = Array.from(
  { length: 100 },
  (_, i) => new Date().getFullYear() - i,
);

// ─── Date Picker Modal ────────────────────────────────────────────────────────
function DatePickerModal({
  visible,
  onClose,
  onConfirm,
  month,
  day,
  year,
  setMonth,
  setDay,
  setYear,
}: {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
  month: number;
  day: number;
  year: number;
  setMonth: (v: number) => void;
  setDay: (v: number) => void;
  setYear: (v: number) => void;
}) {
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
            backgroundColor: "#fff",
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
              color: "#0F172A",
              marginBottom: 20,
            }}
          >
            Select Birthday
          </Text>

          <Text style={lbl}>MONTH</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {MONTHS.map((m, i) => (
                <TouchableOpacity
                  key={m}
                  onPress={() => setMonth(i + 1)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: month === i + 1 ? G : "#F1F5F9",
                    borderWidth: 1,
                    borderColor: month === i + 1 ? G : BORDER,
                  }}
                >
                  <Text
                    style={{
                      color: month === i + 1 ? "#fff" : GRAY,
                      fontWeight: "600",
                      fontSize: 13,
                    }}
                  >
                    {m}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={lbl}>DAY</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 16 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {DAYS.map((d) => (
                <TouchableOpacity
                  key={d}
                  onPress={() => setDay(d)}
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 21,
                    alignItems: "center",
                    justifyContent: "center",
                    backgroundColor: day === d ? G : "#F1F5F9",
                    borderWidth: 1,
                    borderColor: day === d ? G : BORDER,
                  }}
                >
                  <Text
                    style={{
                      color: day === d ? "#fff" : GRAY,
                      fontWeight: "600",
                    }}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <Text style={lbl}>YEAR</Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={{ marginBottom: 24 }}
          >
            <View style={{ flexDirection: "row", gap: 8 }}>
              {YEARS.map((y) => (
                <TouchableOpacity
                  key={y}
                  onPress={() => setYear(y)}
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 8,
                    borderRadius: 20,
                    backgroundColor: year === y ? G : "#F1F5F9",
                    borderWidth: 1,
                    borderColor: year === y ? G : BORDER,
                  }}
                >
                  <Text
                    style={{
                      color: year === y ? "#fff" : GRAY,
                      fontWeight: "600",
                    }}
                  >
                    {y}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          <TouchableOpacity
            onPress={onConfirm}
            style={{
              backgroundColor: G,
              borderRadius: 30,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
              Confirm Birthday
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onClose}
            style={{ paddingVertical: 10, alignItems: "center" }}
          >
            <Text style={{ color: GRAY, fontSize: 14 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

// ─── Field Label with asterisk ────────────────────────────────────────────────
function FieldLabel({ text, required }: { text: string; required?: boolean }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 6 }}>
      <Text style={lbl}>{text}</Text>
      {required && (
        <Text
          style={{ color: RED, fontSize: 13, fontWeight: "700", marginLeft: 2 }}
        >
          *
        </Text>
      )}
    </View>
  );
}

// ─── Error message ────────────────────────────────────────────────────────────
function FieldError({ msg }: { msg: string | null }) {
  if (!msg) return null;
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        marginTop: 4,
      }}
    >
      <Ionicons name="alert-circle" size={12} color={RED} />
      <Text style={{ color: RED, fontSize: 11, fontWeight: "600" }}>{msg}</Text>
    </View>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SignUpScreen() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Birthdate
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthYear, setBirthYear] = useState(2000);
  const [birthdateConfirmed, setBirthdateConfirmed] = useState(false);

  const birthdateDisplay = birthdateConfirmed
    ? `${MONTHS[birthMonth - 1]} ${birthDay}, ${birthYear}`
    : null;
  const birthdateForDB = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;

  // ─── Validation ─────────────────────────────────────────────────────────────
  const errors: Record<string, string | null> = {
    firstName: !firstName.trim()
      ? "First name is required."
      : firstName.trim().length < 2
        ? "At least 2 characters."
        : null,
    lastName: !lastName.trim()
      ? "Last name is required."
      : lastName.trim().length < 2
        ? "At least 2 characters."
        : null,
    email: !email.trim()
      ? "Email is required."
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
        ? "Enter a valid email address."
        : null,
    phone: !phone.trim()
      ? "Phone number is required."
      : !/^09\d{9}$/.test(phone.replace(/\s/g, ""))
        ? "Must be 11 digits starting with 09."
        : null,
    birthdate: !birthdateConfirmed ? "Birthday is required." : null,
    password: !password
      ? "Password is required."
      : password.length < 6
        ? "At least 6 characters."
        : password.length > 32
          ? "Maximum 32 characters."
          : null,
    confirmPassword: !confirmPassword
      ? "Please confirm your password."
      : confirmPassword !== password
        ? "Passwords do not match."
        : null,
  };

  const hasErrors = Object.values(errors).some(Boolean);

  function touch(field: string) {
    setTouched((prev) => ({ ...prev, [field]: true }));
  }

  function showError(field: string) {
    return touched[field] ? errors[field] : null;
  }

  function inputBorder(field: string) {
    return touched[field] && errors[field] ? RED : BORDER;
  }

  async function handleSignUp() {
    // Touch all fields to show all errors
    const allFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "birthdate",
      "password",
      "confirmPassword",
    ];
    setTouched(Object.fromEntries(allFields.map((f) => [f, true])));

    if (hasErrors) {
      Alert.alert("Please fix the errors before continuing.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName.trim(),
            last_name: lastName.trim(),
            phone: phone.trim(),
            birthdate: birthdateForDB,
          },
        },
      });
      if (error) throw error;
      if (data.user) {
        await supabase
          .from("profiles")
          .update({ birthdate: birthdateForDB })
          .eq("id", data.user.id);
        Alert.alert(
          "Welcome to VS Hotel! 🎉",
          "Your account has been created.",
          [{ text: "Continue", onPress: () => router.replace("/") }],
        );
      }
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#1B4332" }}
      edges={["top"]}
    >
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
          {/* Header */}
          <View
            style={{
              backgroundColor: "#1B4332",
              paddingTop: 12,
              paddingBottom: 30,
              paddingHorizontal: 20,
            }}
          >
            <TouchableOpacity
              onPress={() => router.back()}
              style={{ marginBottom: 16 }}
            >
              <Ionicons name="arrow-back" size={22} color="#86EFAC" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
              Create Account
            </Text>
            <Text style={{ color: "#86EFAC", marginTop: 4, fontSize: 14 }}>
              Join VS Hotel and start earning points
            </Text>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 10,
              }}
            >
              <Text style={{ color: RED, fontSize: 13, fontWeight: "700" }}>
                *
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.6)", fontSize: 12 }}>
                Required fields
              </Text>
            </View>
          </View>

          {/* Benefits card */}
          <View
            style={{
              backgroundColor: "#F0EEF5",
              borderLeftWidth: 4,
              borderLeftColor: GOLD,
              margin: 20,
              padding: 16,
              borderRadius: 12,
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
              <FontAwesome5 name="star" size={14} color={GOLD} solid />
              <Text
                style={{ fontWeight: "bold", color: "#1B4332", fontSize: 14 }}
              >
                Join for Free and Get:
              </Text>
            </View>
            {[
              "Exclusive member-only rates",
              "VS Points on every stay",
              "Early access to flash sales",
              "Birthday bonus points",
            ].map((perk, i) => (
              <View
                key={i}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                  marginBottom: 4,
                }}
              >
                <Ionicons name="checkmark-circle" size={16} color="#1B4332" />
                <Text style={{ color: "#4B5563", fontSize: 13 }}>{perk}</Text>
              </View>
            ))}
          </View>

          <View style={{ paddingHorizontal: 20, gap: 16 }}>
            {/* Name row */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <FieldLabel text="FIRST NAME" required />
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  onBlur={() => touch("firstName")}
                  placeholder="Juan"
                  style={[inp, { borderColor: inputBorder("firstName") }]}
                  placeholderTextColor="#94A3B8"
                />
                <FieldError msg={showError("firstName")} />
              </View>
              <View style={{ flex: 1 }}>
                <FieldLabel text="LAST NAME" required />
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  onBlur={() => touch("lastName")}
                  placeholder="Dela Cruz"
                  style={[inp, { borderColor: inputBorder("lastName") }]}
                  placeholderTextColor="#94A3B8"
                />
                <FieldError msg={showError("lastName")} />
              </View>
            </View>

            {/* Email */}
            <View>
              <FieldLabel text="EMAIL ADDRESS" required />
              <TextInput
                value={email}
                onChangeText={setEmail}
                onBlur={() => touch("email")}
                placeholder="juan@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={[inp, { borderColor: inputBorder("email") }]}
                placeholderTextColor="#94A3B8"
              />
              <FieldError msg={showError("email")} />
            </View>

            {/* Phone */}
            <View>
              <FieldLabel text="PHONE NUMBER" required />
              <TextInput
                value={phone}
                onChangeText={setPhone}
                onBlur={() => touch("phone")}
                placeholder="09XXXXXXXXX"
                keyboardType="phone-pad"
                maxLength={11}
                style={[inp, { borderColor: inputBorder("phone") }]}
                placeholderTextColor="#94A3B8"
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 4,
                }}
              >
                <FieldError msg={showError("phone")} />
                <Text style={{ fontSize: 11, color: GRAY }}>
                  {phone.replace(/\s/g, "").length}/11
                </Text>
              </View>
            </View>

            {/* Birthday */}
            <View>
              <FieldLabel text="BIRTHDAY" required />
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                onBlur={() => touch("birthdate")}
                style={[
                  inp,
                  {
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    borderColor:
                      touched["birthdate"] && errors["birthdate"]
                        ? RED
                        : BORDER,
                  },
                ]}
              >
                <FontAwesome5
                  name="birthday-cake"
                  size={16}
                  color={birthdateConfirmed ? G : "#94A3B8"}
                />
                <Text
                  style={{
                    flex: 1,
                    color: birthdateConfirmed ? "#0F172A" : "#94A3B8",
                    fontSize: 15,
                  }}
                >
                  {birthdateDisplay ?? "Select your birthday"}
                </Text>
                <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
              </TouchableOpacity>
              <FieldError
                msg={touched["birthdate"] ? errors["birthdate"] : null}
              />
            </View>

            {/* Password */}
            <View>
              <FieldLabel text="PASSWORD" required />
              <View style={{ position: "relative" }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  onBlur={() => touch("password")}
                  placeholder="Min 6 characters"
                  secureTextEntry={!showPassword}
                  style={[
                    inp,
                    { paddingRight: 60, borderColor: inputBorder("password") },
                  ]}
                  placeholderTextColor="#94A3B8"
                  maxLength={32}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: 14 }}
                >
                  <Text style={{ color: GRAY, fontSize: 13 }}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  marginTop: 4,
                }}
              >
                <FieldError msg={showError("password")} />
                <Text
                  style={{
                    fontSize: 11,
                    color: password.length > 32 ? RED : GRAY,
                  }}
                >
                  {password.length}/32
                </Text>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <FieldLabel text="CONFIRM PASSWORD" required />
              <View style={{ position: "relative" }}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  onBlur={() => touch("confirmPassword")}
                  placeholder="Repeat your password"
                  secureTextEntry={!showConfirm}
                  style={[
                    inp,
                    {
                      paddingRight: 60,
                      borderColor: inputBorder("confirmPassword"),
                    },
                  ]}
                  placeholderTextColor="#94A3B8"
                  maxLength={32}
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 14, top: 14 }}
                >
                  <Text style={{ color: GRAY, fontSize: 13 }}>
                    {showConfirm ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
              <FieldError msg={showError("confirmPassword")} />
              {/* Password match indicator */}
              {confirmPassword.length > 0 && (
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 4,
                    marginTop: 4,
                  }}
                >
                  <Ionicons
                    name={
                      confirmPassword === password
                        ? "checkmark-circle"
                        : "close-circle"
                    }
                    size={12}
                    color={confirmPassword === password ? "#16A34A" : RED}
                  />
                  <Text
                    style={{
                      fontSize: 11,
                      fontWeight: "600",
                      color: confirmPassword === password ? "#16A34A" : RED,
                    }}
                  >
                    {confirmPassword === password
                      ? "Passwords match"
                      : "Passwords do not match"}
                  </Text>
                </View>
              )}
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#94A3B8" : G,
                paddingVertical: 16,
                borderRadius: 30,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                {loading ? "Creating Account..." : "Create Account"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/signin")}
              style={{
                alignItems: "center",
                paddingVertical: 12,
                marginBottom: 40,
              }}
            >
              <Text style={{ color: GRAY, fontSize: 14 }}>
                Already have an account?{" "}
                <Text style={{ color: G, fontWeight: "bold" }}>Log In</Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <DatePickerModal
        visible={showDatePicker}
        onClose={() => setShowDatePicker(false)}
        onConfirm={() => {
          setBirthdateConfirmed(true);
          touch("birthdate");
          setShowDatePicker(false);
        }}
        month={birthMonth}
        day={birthDay}
        year={birthYear}
        setMonth={setBirthMonth}
        setDay={setBirthDay}
        setYear={setBirthYear}
      />
    </SafeAreaView>
  );
}

const lbl: any = {
  fontSize: 11,
  fontWeight: "bold",
  color: GRAY,
  letterSpacing: 1,
};
const inp: any = {
  borderWidth: 1,
  borderColor: BORDER,
  borderRadius: 10,
  padding: 14,
  backgroundColor: BG,
  color: "#0F172A",
  fontSize: 15,
};
