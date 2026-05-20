import { Ionicons } from "@expo/vector-icons";
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
import { SafeAreaView } from "react-native-safe-area-context";
import { supabase } from "../lib/supabase";

export default function SignInScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignIn() {
    if (!email || !password) {
      Alert.alert("Please fill in all fields.");
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (data.user) {
        Alert.alert("Welcome Back! 👋", "You have successfully logged in.", [
          { text: "Continue", onPress: () => router.replace("/") },
        ]);
      }
    } catch (error: any) {
      Alert.alert("Log In Failed", error.message);
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
              paddingBottom: 40,
              paddingHorizontal: 20,
              alignItems: "center",
            }}
          >
            {/* Back button */}
            <TouchableOpacity
              onPress={() => router.back()}
              style={{
                alignSelf: "flex-start",
                marginBottom: 24,
                flexDirection: "row",
                alignItems: "center",
                gap: 6,
              }}
            >
              <Ionicons name="arrow-back" size={22} color="#86EFAC" />
            </TouchableOpacity>

            <Text style={{ color: "white", fontSize: 28, fontWeight: "bold" }}>
              Welcome Back
            </Text>
            <Text
              style={{
                color: "#86EFAC",
                marginTop: 4,
                fontSize: 14,
                textAlign: "center",
              }}
            >
              Log in to access your VS Points and exclusive deals
            </Text>
          </View>

          <View style={{ paddingHorizontal: 20, paddingTop: 30, gap: 16 }}>
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
              <Text style={labelStyle}>PASSWORD</Text>
              <View style={{ position: "relative" }}>
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="Your password"
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

            <TouchableOpacity style={{ alignSelf: "flex-end" }}>
              <Text
                style={{ color: "#1B4332", fontWeight: "bold", fontSize: 13 }}
              >
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleSignIn}
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
                {loading ? "Logging In..." : "Log In"}
              </Text>
            </TouchableOpacity>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 12,
                marginVertical: 8,
              }}
            >
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#E2E8F0" }}
              />
              <Text style={{ color: "#94A3B8", fontSize: 13 }}>or</Text>
              <View
                style={{ flex: 1, height: 1, backgroundColor: "#E2E8F0" }}
              />
            </View>

            <View
              style={{
                backgroundColor: "#F0EEF5",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1,
                borderColor: "#1B4332",
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#1B4332",
                  marginBottom: 8,
                }}
              >
                Not a member yet?
              </Text>
              <Text
                style={{
                  color: "#4B5563",
                  fontSize: 13,
                  lineHeight: 20,
                  marginBottom: 12,
                }}
              >
                Join for free and unlock exclusive rates, VS Points, and secret
                deals only available on the app.
              </Text>
              <TouchableOpacity
                onPress={() => router.push("/signup")}
                style={{
                  backgroundColor: "#B8860B",
                  paddingVertical: 12,
                  borderRadius: 30,
                  alignItems: "center",
                }}
              >
                <Text
                  style={{ color: "white", fontWeight: "bold", fontSize: 15 }}
                >
                  Join for Free
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={() => router.replace("/")}
              style={{
                alignItems: "center",
                paddingVertical: 12,
                marginBottom: 40,
              }}
            >
              <Text style={{ color: "#94A3B8", fontSize: 13 }}>
                Continue as Guest
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
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
