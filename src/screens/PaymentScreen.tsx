import * as ImagePicker from "expo-image-picker";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Colors as C } from "../constants/theme";

export default function PaymentScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  async function handlePickImage() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission required",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission required", "Please allow access to your camera.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 1,
    });
    if (!result.canceled) setImage(result.assets[0].uri);
  }

  function handleSubmit() {
    if (!image) {
      Alert.alert("Please upload your proof of payment first.");
      return;
    }
    setSubmitted(true);
  }

  // ── Success Screen ──────────────────────────────────────────────────────────
  if (submitted) {
    return (
      <View style={styles.successWrap}>
        <Text style={styles.successEmoji}>✅</Text>
        <Text style={styles.successTitle}>Payment Submitted!</Text>
        <Text style={styles.successBody}>
          We have received your proof of payment. Our team will verify it and
          confirm your booking shortly.
        </Text>
        <Text style={styles.successContact}>
          For inquiries:{"\n"}+63 917 825 9938{"\n"}reservations@vshotel.com.ph
        </Text>
        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.backBtn}
        >
          <Text style={styles.backBtnText}>Back to Home</Text>
        </TouchableOpacity>
      </View>
    );
  }

  // ── Main Screen ─────────────────────────────────────────────────────────────
  return (
    <ScrollView ref={scrollRef} style={styles.scroll}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backLink}>
          <Text style={styles.backLinkText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Payment</Text>
        <Text style={styles.headerSub}>
          Upload your proof of payment to confirm your booking
        </Text>
      </View>

      <View style={styles.body}>
        {/* How to Pay */}
        <View style={styles.howToCard}>
          <Text style={styles.howToTitle}>📋 How to Pay</Text>
          <Text style={styles.howToText}>
            1. Transfer payment to our bank account:{"\n"}
            {"   "}🏦 BDO — 1234 5678 9012{"\n"}
            {"   "}Account Name: VS Hotel Corp.{"\n\n"}
            2. Take a screenshot of your payment confirmation{"\n\n"}
            3. Upload it below and tap Submit
          </Text>
        </View>

        {/* Upload Section */}
        <View>
          <Text style={styles.uploadLabel}>Proof of Payment</Text>

          {image ? (
            <View>
              <Image
                source={{ uri: image }}
                style={styles.previewImage}
                resizeMode="contain"
              />
              <TouchableOpacity
                onPress={() => setImage(null)}
                style={styles.removeBtn}
              >
                <Text style={styles.removeBtnText}>✕ Remove & Re-upload</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Text style={styles.uploadEmoji}>🧾</Text>
              <Text style={styles.uploadHint}>
                Upload a screenshot or photo of your payment receipt
              </Text>
            </View>
          )}

          {/* Pick / Camera buttons */}
          <View style={styles.uploadBtnRow}>
            <TouchableOpacity
              onPress={handlePickImage}
              style={[styles.uploadBtn, { backgroundColor: C.green }]}
            >
              <Text style={styles.uploadBtnIcon}>🖼️</Text>
              <Text style={styles.uploadBtnText}>Choose from Gallery</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleTakePhoto}
              style={[styles.uploadBtn, { backgroundColor: C.dark }]}
            >
              <Text style={styles.uploadBtnIcon}>📷</Text>
              <Text style={styles.uploadBtnText}>Take a Photo</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleSubmit}
          style={[
            styles.submitBtn,
            { backgroundColor: image ? C.gold : C.gray },
          ]}
        >
          <Text style={styles.submitBtnText}>
            {image ? "Submit Payment" : "Upload Receipt First"}
          </Text>
        </TouchableOpacity>

        <Text style={styles.disclaimer}>
          Your booking will be confirmed within 24 hours after payment
          verification.{"\n"}For urgent inquiries, call +63 917 825 9938
        </Text>
      </View>
    </ScrollView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  scroll: {
    flex: 1,
    backgroundColor: C.lavender,
  },

  // Header
  header: {
    backgroundColor: C.green,
    paddingTop: 50,
    paddingBottom: 24,
    paddingHorizontal: 20,
  },
  backLink: { marginBottom: 16 },
  backLinkText: { color: C.greenMint, fontSize: 16 },
  headerTitle: { color: C.white, fontSize: 24, fontWeight: "bold" },
  headerSub: { color: C.goldLight, marginTop: 4, fontSize: 14 },

  // Body
  body: { padding: 20, gap: 20 },

  // How to pay card
  howToCard: {
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: C.gold,
  },
  howToTitle: {
    fontWeight: "bold",
    color: C.green,
    marginBottom: 8,
    fontSize: 15,
  },
  howToText: { color: C.gray, fontSize: 13, lineHeight: 22 },

  // Upload
  uploadLabel: {
    fontWeight: "bold",
    color: C.dark,
    fontSize: 16,
    marginBottom: 12,
  },
  uploadPlaceholder: {
    borderWidth: 2,
    borderColor: C.grayLight,
    borderStyle: "dashed",
    borderRadius: 16,
    padding: 40,
    alignItems: "center",
    backgroundColor: C.white,
    marginBottom: 12,
  },
  uploadEmoji: { fontSize: 40, marginBottom: 12 },
  uploadHint: {
    color: C.gray,
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
  },
  previewImage: {
    width: "100%",
    height: 300,
    borderRadius: 16,
    marginBottom: 12,
  },
  removeBtn: {
    borderWidth: 1.5,
    borderColor: "#DC2626",
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: "center",
    marginBottom: 8,
  },
  removeBtnText: { color: "#DC2626", fontWeight: "bold" },

  uploadBtnRow: { flexDirection: "row", gap: 12 },
  uploadBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    gap: 4,
  },
  uploadBtnIcon: { fontSize: 20 },
  uploadBtnText: { color: C.white, fontWeight: "bold", fontSize: 13 },

  // Submit
  submitBtn: {
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: "center",
    marginTop: 8,
  },
  submitBtnText: { color: C.white, fontWeight: "bold", fontSize: 18 },

  disclaimer: {
    color: C.gray,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 20,
  },

  // Success
  successWrap: {
    flex: 1,
    backgroundColor: C.lavender,
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
  },
  successEmoji: { fontSize: 60 },
  successTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: C.green,
    marginTop: 20,
    textAlign: "center",
  },
  successBody: {
    color: C.gray,
    marginTop: 10,
    textAlign: "center",
    lineHeight: 22,
  },
  successContact: {
    color: C.gray,
    marginTop: 16,
    textAlign: "center",
    fontSize: 13,
    lineHeight: 20,
  },
  backBtn: {
    marginTop: 30,
    backgroundColor: C.green,
    paddingVertical: 14,
    paddingHorizontal: 40,
    borderRadius: 30,
  },
  backBtnText: { color: C.white, fontWeight: "bold", fontSize: 16 },
});
