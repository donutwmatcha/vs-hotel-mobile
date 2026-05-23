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

          {/* Month */}
          <Text style={labelStyle}>MONTH</Text>
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
                    backgroundColor: month === i + 1 ? "#14532D" : "#F1F5F9",
                    borderWidth: 1,
                    borderColor: month === i + 1 ? "#14532D" : "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      color: month === i + 1 ? "#fff" : "#64748B",
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

          {/* Day */}
          <Text style={labelStyle}>DAY</Text>
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
                    backgroundColor: day === d ? "#14532D" : "#F1F5F9",
                    borderWidth: 1,
                    borderColor: day === d ? "#14532D" : "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      color: day === d ? "#fff" : "#64748B",
                      fontWeight: "600",
                    }}
                  >
                    {d}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>

          {/* Year */}
          <Text style={labelStyle}>YEAR</Text>
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
                    backgroundColor: year === y ? "#14532D" : "#F1F5F9",
                    borderWidth: 1,
                    borderColor: year === y ? "#14532D" : "#E2E8F0",
                  }}
                >
                  <Text
                    style={{
                      color: year === y ? "#fff" : "#64748B",
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
              backgroundColor: "#14532D",
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
            <Text style={{ color: "#64748B", fontSize: 14 }}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

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

  // Birthdate
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthYear, setBirthYear] = useState(2000);
  const [birthdateConfirmed, setBirthdateConfirmed] = useState(false);

  const birthdateDisplay = birthdateConfirmed
    ? `${MONTHS[birthMonth - 1]} ${birthDay}, ${birthYear}`
    : null;

  // Format as YYYY-MM-DD for Supabase
  const birthdateForDB = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;

  async function handleSignUp() {
    if (
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword
    ) {
      Alert.alert("Please fill in all fields.");
      return;
    }
    if (!birthdateConfirmed) {
      Alert.alert("Please select your birthday.");
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      Alert.alert("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            phone,
            birthdate: birthdateForDB,
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        // Also update profiles table with birthdate
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
              style={{
                marginBottom: 16,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="arrow-back" size={22} color="#86EFAC" />
            </TouchableOpacity>
            <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
              Create Account
            </Text>
            <Text style={{ color: "#86EFAC", marginTop: 4, fontSize: 14 }}>
              Join VS Hotel and start earning points
            </Text>
          </View>

          {/* Benefits card */}
          <View
            style={{
              backgroundColor: "#F0EEF5",
              borderLeftWidth: 4,
              borderLeftColor: "#B8860B",
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
              <FontAwesome5 name="star" size={14} color="#B8860B" solid />
              <Text
                style={{ fontWeight: "bold", color: "#1B4332", fontSize: 14 }}
              >
                Join for Free and Get:
              </Text>
            </View>
            <View style={{ gap: 4 }}>
              {[
                "Exclusive member-only rates",
                "VS Points on every stay",
                "Early access to flash sales",
                "Birthday bonus points",
              ].map((perk, i) => (
                <View
                  key={i}
                  style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
                >
                  <Ionicons name="checkmark-circle" size={16} color="#1B4332" />
                  <Text style={{ color: "#4B5563", fontSize: 13 }}>{perk}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={{ paddingHorizontal: 20, gap: 16 }}>
            {/* Name row */}
            <View style={{ flexDirection: "row", gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>FIRST NAME</Text>
                <TextInput
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Juan"
                  style={inputStyle}
                  placeholderTextColor="#94A3B8"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={labelStyle}>LAST NAME</Text>
                <TextInput
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Dela Cruz"
                  style={inputStyle}
                  placeholderTextColor="#94A3B8"
                />
              </View>
            </View>

            {/* Email */}
            <View>
              <Text style={labelStyle}>EMAIL ADDRESS</Text>
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="juan@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                style={inputStyle}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Phone */}
            <View>
              <Text style={labelStyle}>PHONE NUMBER</Text>
              <TextInput
                value={phone}
                onChangeText={setPhone}
                placeholder="+63 917 000 0000"
                keyboardType="phone-pad"
                style={inputStyle}
                placeholderTextColor="#94A3B8"
              />
            </View>

            {/* Birthday */}
            <View>
              <Text style={labelStyle}>BIRTHDAY</Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                style={[
                  inputStyle,
                  { flexDirection: "row", alignItems: "center", gap: 10 },
                ]}
              >
                <FontAwesome5
                  name="birthday-cake"
                  size={16}
                  color={birthdateConfirmed ? "#14532D" : "#94A3B8"}
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
            </View>

            {/* Password */}
            <View>
              <Text style={labelStyle}>PASSWORD</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="At least 6 characters"
                  secureTextEntry={!showPassword}
                  style={inputStyle}
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={{ position: "absolute", right: 14, top: 14 }}
                >
                  <Text style={{ color: "#64748B", fontSize: 13 }}>
                    {showPassword ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Confirm Password */}
            <View>
              <Text style={labelStyle}>CONFIRM PASSWORD</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder="Repeat your password"
                  secureTextEntry={!showConfirm}
                  style={inputStyle}
                  placeholderTextColor="#94A3B8"
                />
                <TouchableOpacity
                  onPress={() => setShowConfirm(!showConfirm)}
                  style={{ position: "absolute", right: 14, top: 14 }}
                >
                  <Text style={{ color: "#64748B", fontSize: 13 }}>
                    {showConfirm ? "Hide" : "Show"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading}
              style={{
                backgroundColor: loading ? "#94A3B8" : "#1B4332",
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
              <Text style={{ color: "#64748B", fontSize: 14 }}>
                Already have an account?{" "}
                <Text style={{ color: "#1B4332", fontWeight: "bold" }}>
                  Log In
                </Text>
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
