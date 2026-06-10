import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import * as FileSystem from "expo-file-system/legacy";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
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
import { useAuth } from "../context/AuthContext";
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

const VALID_IDS = [
  "Philippine Passport",
  "Driver's License",
  "SSS ID",
  "GSIS ID",
  "PhilHealth ID",
  "Postal ID",
  "Voter's ID / COMELEC",
  "PRC ID",
  "Senior Citizen ID",
  "PWD ID",
  "National ID (PhilSys)",
  "School ID",
  "Company ID",
  "Other Government ID",
];

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

function IDTypeModal({
  visible,
  onClose,
  onSelect,
  selected,
}: {
  visible: boolean;
  onClose: () => void;
  onSelect: (id: string) => void;
  selected: string;
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
            maxHeight: "70%",
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
              marginBottom: 16,
            }}
          >
            Select ID Type
          </Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {VALID_IDS.map((id) => (
              <TouchableOpacity
                key={id}
                onPress={() => {
                  onSelect(id);
                  onClose();
                }}
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  paddingVertical: 14,
                  borderBottomWidth: 1,
                  borderBottomColor: BORDER,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    borderWidth: 2,
                    borderColor: selected === id ? G : BORDER,
                    backgroundColor: selected === id ? G : "transparent",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {selected === id && (
                    <View
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: "#fff",
                      }}
                    />
                  )}
                </View>
                <Text
                  style={{
                    fontSize: 15,
                    color: selected === id ? G : "#0F172A",
                    fontWeight: selected === id ? "700" : "400",
                  }}
                >
                  {id}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

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

export default function SignUpScreen() {
  const { refreshProfile } = useAuth();
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

  // Birthday
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [birthMonth, setBirthMonth] = useState(1);
  const [birthDay, setBirthDay] = useState(1);
  const [birthYear, setBirthYear] = useState(2000);
  const [birthdateConfirmed, setBirthdateConfirmed] = useState(false);

  // ID
  const [showIDTypePicker, setShowIDTypePicker] = useState(false);
  const [idType, setIdType] = useState("");
  const [idPhotoUri, setIdPhotoUri] = useState<string | null>(null);
  const [uploadingId, setUploadingId] = useState(false);

  const birthdateDisplay = birthdateConfirmed
    ? `${MONTHS[birthMonth - 1]} ${birthDay}, ${birthYear}`
    : null;
  const birthdateForDB = `${birthYear}-${String(birthMonth).padStart(2, "0")}-${String(birthDay).padStart(2, "0")}`;

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
        : null,
    confirmPassword: !confirmPassword
      ? "Please confirm your password."
      : confirmPassword !== password
        ? "Passwords do not match."
        : null,
    idType: !idType ? "Please select an ID type." : null,
    idPhoto: !idPhotoUri ? "Please upload a photo of your valid ID." : null,
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

  async function pickIDPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        "Permission needed",
        "Please allow access to your photo library.",
      );
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setIdPhotoUri(result.assets[0].uri);
      touch("idPhoto");
    }
  }

  async function takeIDPhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert("Permission needed", "Please allow camera access.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) {
      setIdPhotoUri(result.assets[0].uri);
      touch("idPhoto");
    }
  }

  function showIDOptions() {
    Alert.alert("Upload Valid ID", "Choose how to add your ID photo", [
      { text: "Take Photo", onPress: takeIDPhoto },
      { text: "Choose from Gallery", onPress: pickIDPhoto },
      { text: "Cancel", style: "cancel" },
    ]);
  }

  async function uploadIDPhoto(userId: string): Promise<string | null> {
    if (!idPhotoUri) return null;
    try {
      setUploadingId(true);
      const fileName = `${userId}/valid-id.jpg`;
      const base64 = await FileSystem.readAsStringAsync(idPhotoUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const byteArray = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0));
      const { error } = await supabase.storage
        .from("id-uploads")
        .upload(fileName, byteArray, {
          contentType: "image/jpeg",
          upsert: true,
        });
      if (error) throw error;
      const { data } = supabase.storage
        .from("id-uploads")
        .getPublicUrl(fileName);
      return data.publicUrl;
    } catch (err: any) {
      console.log("ID upload error:", err);
      return null;
    } finally {
      setUploadingId(false);
    }
  }

  async function handleSignUp() {
    const allFields = [
      "firstName",
      "lastName",
      "email",
      "phone",
      "birthdate",
      "password",
      "confirmPassword",
      "idType",
      "idPhoto",
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
        const randomAvatarId = Math.floor(Math.random() * 10) + 1;
        const idPhotoUrl = await uploadIDPhoto(data.user.id);
        await supabase
          .from("profiles")
          .update({
            birthdate: birthdateForDB,
            avatar_id: randomAvatarId,
            id_photo_url: idPhotoUrl,
            id_type: idType,
          })
          .eq("id", data.user.id);
        router.replace("/");
        refreshProfile();
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

          {/* Benefits */}
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
            {/* Name */}
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
              <FieldError msg={showError("password")} />
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

            {/* Valid ID Section */}
            <View
              style={{
                backgroundColor: "#F8FAFC",
                borderRadius: 16,
                padding: 16,
                borderWidth: 1.5,
                borderColor:
                  (touched["idType"] && errors["idType"]) ||
                  (touched["idPhoto"] && errors["idPhoto"])
                    ? RED
                    : BORDER,
                gap: 14,
              }}
            >
              <View
                style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
              >
                <FontAwesome5 name="id-card" size={18} color={G} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      fontWeight: "800",
                      color: "#0F172A",
                      fontSize: 15,
                    }}
                  >
                    Valid ID Required
                  </Text>
                  <Text style={{ color: GRAY, fontSize: 12, marginTop: 2 }}>
                    Required for hotel guest verification
                  </Text>
                </View>
              </View>

              {/* ID Type */}
              <View>
                <FieldLabel text="ID TYPE" required />
                <TouchableOpacity
                  onPress={() => setShowIDTypePicker(true)}
                  style={[
                    inp,
                    {
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 10,
                      borderColor:
                        touched["idType"] && errors["idType"] ? RED : BORDER,
                    },
                  ]}
                >
                  <FontAwesome5
                    name="id-badge"
                    size={14}
                    color={idType ? G : "#94A3B8"}
                  />
                  <Text
                    style={{
                      flex: 1,
                      color: idType ? "#0F172A" : "#94A3B8",
                      fontSize: 15,
                    }}
                  >
                    {idType || "Select your ID type..."}
                  </Text>
                  <Ionicons name="chevron-forward" size={16} color="#94A3B8" />
                </TouchableOpacity>
                <FieldError msg={showError("idType")} />
              </View>

              {/* ID Photo */}
              <View>
                <FieldLabel text="ID PHOTO" required />
                {idPhotoUri ? (
                  <View>
                    <Image
                      source={{ uri: idPhotoUri }}
                      style={{
                        width: "100%",
                        height: 180,
                        borderRadius: 12,
                        marginBottom: 8,
                      }}
                      resizeMode="cover"
                    />
                    <View style={{ flexDirection: "row", gap: 8 }}>
                      <TouchableOpacity
                        onPress={showIDOptions}
                        style={{
                          flex: 1,
                          backgroundColor: G,
                          borderRadius: 10,
                          paddingVertical: 10,
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Ionicons
                          name="refresh-outline"
                          size={14}
                          color="#fff"
                        />
                        <Text
                          style={{
                            color: "#fff",
                            fontWeight: "700",
                            fontSize: 13,
                          }}
                        >
                          Retake
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => setIdPhotoUri(null)}
                        style={{
                          flex: 1,
                          backgroundColor: "#FEE2E2",
                          borderRadius: 10,
                          paddingVertical: 10,
                          alignItems: "center",
                          flexDirection: "row",
                          justifyContent: "center",
                          gap: 6,
                        }}
                      >
                        <Ionicons name="trash-outline" size={14} color={RED} />
                        <Text
                          style={{
                            color: RED,
                            fontWeight: "700",
                            fontSize: 13,
                          }}
                        >
                          Remove
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={showIDOptions}
                    style={{
                      borderWidth: 2,
                      borderColor:
                        touched["idPhoto"] && errors["idPhoto"] ? RED : BORDER,
                      borderStyle: "dashed",
                      borderRadius: 12,
                      padding: 28,
                      alignItems: "center",
                      gap: 10,
                      backgroundColor: "#FAFAFA",
                    }}
                  >
                    <FontAwesome5
                      name="id-card"
                      size={32}
                      color={
                        touched["idPhoto"] && errors["idPhoto"]
                          ? RED
                          : "#94A3B8"
                      }
                    />
                    <Text
                      style={{
                        color:
                          touched["idPhoto"] && errors["idPhoto"]
                            ? RED
                            : "#64748B",
                        fontWeight: "600",
                        fontSize: 14,
                      }}
                    >
                      Upload ID Photo
                    </Text>
                    <Text
                      style={{
                        color: "#94A3B8",
                        fontSize: 12,
                        textAlign: "center",
                      }}
                    >
                      Take a photo or choose from gallery{"\n"}Make sure the ID
                      is clear and readable
                    </Text>
                  </TouchableOpacity>
                )}
                <FieldError msg={showError("idPhoto")} />
              </View>

              <View
                style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: 10,
                  padding: 12,
                  flexDirection: "row",
                  gap: 8,
                }}
              >
                <Ionicons
                  name="shield-checkmark-outline"
                  size={16}
                  color="#B45309"
                  style={{ marginTop: 1 }}
                />
                <Text
                  style={{
                    flex: 1,
                    fontSize: 12,
                    color: "#92400E",
                    lineHeight: 18,
                  }}
                >
                  Your ID is kept confidential and used only for guest
                  verification purposes.
                </Text>
              </View>
            </View>

            {/* Submit */}
            <TouchableOpacity
              onPress={handleSignUp}
              disabled={loading || uploadingId}
              style={{
                backgroundColor: loading || uploadingId ? "#94A3B8" : G,
                paddingVertical: 16,
                borderRadius: 30,
                alignItems: "center",
                marginTop: 8,
              }}
            >
              <Text
                style={{ color: "white", fontWeight: "bold", fontSize: 18 }}
              >
                {loading
                  ? "Creating Account..."
                  : uploadingId
                    ? "Uploading ID..."
                    : "Create Account"}
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
      <IDTypeModal
        visible={showIDTypePicker}
        onClose={() => setShowIDTypePicker(false)}
        onSelect={(id) => {
          setIdType(id);
          touch("idType");
        }}
        selected={idType}
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
