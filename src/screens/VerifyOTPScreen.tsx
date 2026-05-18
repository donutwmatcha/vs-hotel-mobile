// src/screens/VerifyOTPScreen.tsx
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { supabase } from "../lib/supabase";

export default function VerifyOTPScreen() {
  const params = useLocalSearchParams();
  const email = Array.isArray(params.email) ? params.email[0] : params.email;

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleVerify() {
    if (!email) {
      Alert.alert("Missing Email", "Please sign up again.");
      router.replace("/signup");
      return;
    }

    if (!otp || otp.length < 6) {
      Alert.alert("Please enter the 6-digit code.");
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "signup",
      });

      if (error) throw error;

      Alert.alert(
        "Email Verified! ✅",
        "Your account is now active. Welcome to VS Hotel!",
        [{ text: "Continue", onPress: () => router.replace("/") }],
      );
    } catch (error: any) {
      Alert.alert("Verification Failed", error.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!email) {
      Alert.alert("Missing Email", "Please sign up again.");
      router.replace("/signup");
      return;
    }

    try {
      const { error } = await supabase.auth.resend({
        type: "signup",
        email,
      });

      if (error) throw error;

      Alert.alert("Code Resent!", "Please check your email for a new code.");
    } catch (error: any) {
      Alert.alert("Error", error.message);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View
          style={{
            backgroundColor: "#14532D",
            paddingTop: 50,
            paddingBottom: 40,
            paddingHorizontal: 20,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 50, marginBottom: 16 }}>📧</Text>

          <Text
            style={{
              color: "white",
              fontSize: 24,
              fontWeight: "bold",
              textAlign: "center",
            }}
          >
            Check Your Email
          </Text>

          <Text
            style={{
              color: "#86EFAC",
              marginTop: 8,
              fontSize: 14,
              textAlign: "center",
              lineHeight: 20,
            }}
          >
            We sent a 6-digit verification code to{"\n"}
            <Text style={{ fontWeight: "bold", color: "white" }}>
              {email || "your email"}
            </Text>
          </Text>
        </View>

        <View style={{ padding: 30, gap: 20 }}>
          <View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "#64748B",
                marginBottom: 6,
                letterSpacing: 1,
                textAlign: "center",
              }}
            >
              ENTER VERIFICATION CODE
            </Text>

            <TextInput
              value={otp}
              onChangeText={(text) => setOtp(text.replace(/[^0-9]/g, ""))}
              placeholder="000000"
              keyboardType="number-pad"
              maxLength={6}
              style={{
                borderWidth: 2,
                borderColor: otp.length === 6 ? "#14532D" : "#E2E8F0",
                borderRadius: 16,
                padding: 20,
                fontSize: 36,
                fontWeight: "bold",
                textAlign: "center",
                letterSpacing: 12,
                color: "#0F172A",
                backgroundColor: "#F8FAFC",
              }}
              placeholderTextColor="#94A3B8"
            />
          </View>

          <TouchableOpacity
            onPress={handleVerify}
            disabled={loading || otp.length !== 6}
            style={{
              backgroundColor: otp.length === 6 ? "#14532D" : "#94A3B8",
              paddingVertical: 16,
              borderRadius: 30,
              alignItems: "center",
              opacity: loading ? 0.7 : 1,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
              {loading ? "Verifying..." : "Verify Email"}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleResend}
            disabled={loading}
            style={{ alignItems: "center" }}
          >
            <Text style={{ color: "#64748B", fontSize: 14 }}>
              Didn't receive the code?{" "}
              <Text style={{ color: "#14532D", fontWeight: "bold" }}>
                Resend
              </Text>
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => router.replace("/signup")}
            style={{ alignItems: "center" }}
          >
            <Text style={{ color: "#94A3B8", fontSize: 13 }}>
              Wrong email? Go back to Sign Up
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
