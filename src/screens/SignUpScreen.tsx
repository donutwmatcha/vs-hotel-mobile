import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

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
          },
        },
      });

      if (error) throw error;

      if (data.user) {
        router.push({
          pathname: "/verify",
          params: { email },
        });
      }
    } catch (error: any) {
      Alert.alert("Sign Up Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            backgroundColor: "#14532D",
            paddingTop: 50,
            paddingBottom: 30,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() => router.back()}
            style={{ marginBottom: 16 }}
          >
            <Text style={{ color: "#86EFAC", fontSize: 16 }}>← Back</Text>
          </TouchableOpacity>
          <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
            Create Account
          </Text>
          <Text style={{ color: "#86EFAC", marginTop: 4, fontSize: 14 }}>
            Join VS Hotel and start earning points
          </Text>
        </View>

        <View
          style={{
            backgroundColor: "#F0FDF4",
            borderLeftWidth: 4,
            borderLeftColor: "#C89B3C",
            margin: 20,
            padding: 16,
            borderRadius: 12,
          }}
        >
          <Text
            style={{ fontWeight: "bold", color: "#14532D", marginBottom: 4 }}
          >
            🎁 Join for Free and Get:
          </Text>
          <Text style={{ color: "#4B5563", fontSize: 13, lineHeight: 20 }}>
            ✓ Exclusive member-only rates{"\n"}✓ VS Points on every stay{"\n"}✓
            Early access to flash sales{"\n"}✓ Birthday bonus points
          </Text>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 16 }}>
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
              backgroundColor: loading ? "#94A3B8" : "#14532D",
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: "center",
              marginTop: 8,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
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
              <Text style={{ color: "#14532D", fontWeight: "bold" }}>
                Sign In
              </Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
