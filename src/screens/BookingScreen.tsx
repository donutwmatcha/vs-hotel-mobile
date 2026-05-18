import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
  Alert,
  Image,
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import { SafeAreaView } from "react-native-safe-area-context";
import { ROOMS } from "../constants/rooms";

const AVAILABILITY: Record<string, Record<string, number>> = {
  "standard-junior": {
    "2026-05-23": 14,
    "2026-05-24": 14,
    "2026-05-25": 14,
    "2026-05-26": 14,
    "2026-05-27": 14,
    "2026-05-28": 14,
  },
  "standard-queen": {
    "2026-05-23": 14,
    "2026-05-24": 14,
    "2026-05-25": 14,
    "2026-05-26": 14,
    "2026-05-27": 14,
    "2026-05-28": 14,
  },
  "premium-queen": {
    "2026-05-23": 14,
    "2026-05-24": 14,
    "2026-05-25": 14,
    "2026-05-26": 14,
    "2026-05-27": 14,
    "2026-05-28": 14,
  },
  king: {
    "2026-05-23": 14,
    "2026-05-24": 14,
    "2026-05-25": 14,
    "2026-05-26": 14,
    "2026-05-27": 14,
    "2026-05-28": 14,
  },
  family: {
    "2026-05-23": 14,
    "2026-05-24": 14,
    "2026-05-25": 14,
    "2026-05-26": 14,
    "2026-05-27": 14,
    "2026-05-28": 14,
  },
  suite: {
    "2026-05-23": 14,
    "2026-05-24": 14,
    "2026-05-25": 14,
    "2026-05-26": 14,
    "2026-05-27": 14,
    "2026-05-28": 14,
  },
};

const TOTAL_SLOTS = 14;

function isRoomFullyBooked(roomId: string, checkIn: string, checkOut: string) {
  const availability = AVAILABILITY[roomId] || {};
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    if ((availability[dateStr] || 0) >= TOTAL_SLOTS) return true;
  }
  return false;
}

function getRemainingSlots(roomId: string, checkIn: string, checkOut: string) {
  const availability = AVAILABILITY[roomId] || {};
  const start = new Date(checkIn);
  const end = new Date(checkOut);
  let minRemaining = TOTAL_SLOTS;
  for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
    const dateStr = d.toISOString().split("T")[0];
    const booked = availability[dateStr] || 0;
    minRemaining = Math.min(minRemaining, TOTAL_SLOTS - booked);
  }
  return minRemaining;
}

function formatDisplay(dateStr: string) {
  if (!dateStr) return "Select date";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-PH", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getDatesInRange(start: string, end: string) {
  const dates: Record<string, any> = {};
  const s = new Date(start);
  const e = new Date(end);
  for (let d = new Date(s); d <= e; d.setDate(d.getDate() + 1)) {
    const str = d.toISOString().split("T")[0];
    if (str === start) {
      dates[str] = { startingDay: true, color: "#14532D", textColor: "white" };
    } else if (str === end) {
      dates[str] = { endingDay: true, color: "#14532D", textColor: "white" };
    } else {
      dates[str] = { color: "#86EFAC", textColor: "#14532D" };
    }
  }
  return dates;
}

function getNights(checkIn: string, checkOut: string) {
  if (!checkIn || !checkOut) return 0;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(0, Math.round(diff / (1000 * 60 * 60 * 24)));
}

export default function BookingScreen() {
  const todayStr = new Date().toISOString().split("T")[0];
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [calendarVisible, setCalendarVisible] = useState(false);
  const [selectingFor, setSelectingFor] = useState<"checkIn" | "checkOut">(
    "checkIn",
  );
  const [adults, setAdults] = useState(2);
  const [children, setChildren] = useState(0);
  const [roomCount, setRoomCount] = useState(1);
  const [promoCode, setPromoCode] = useState("");
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [selectedRate, setSelectedRate] = useState<string | null>(null);
  const [confirmed, setConfirmed] = useState(false);

  const scrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      scrollRef.current?.scrollTo({ y: 0, animated: false });
    }, []),
  );

  const nights = getNights(checkIn, checkOut);
  const markedDates =
    checkIn && checkOut
      ? getDatesInRange(checkIn, checkOut)
      : checkIn
        ? {
            [checkIn]: {
              startingDay: true,
              endingDay: true,
              color: "#14532D",
              textColor: "white",
            },
          }
        : {};

  const selectedRoomData = ROOMS.find((r) => r.id === selectedRoomId);
  const selectedRateData = selectedRoomData?.rates.find(
    (r) => r.name === selectedRate,
  );
  const totalPrice =
    selectedRoomData && selectedRateData
      ? selectedRateData.pricePerNight * Math.max(nights, 1) * roomCount
      : 0;

  function handleDayPress(day: any) {
    const selected = day.dateString;
    if (selectingFor === "checkIn") {
      setCheckIn(selected);
      setCheckOut("");
      setSelectingFor("checkOut");
    } else {
      if (selected <= checkIn) {
        Alert.alert("Check-out must be after check-in.");
        return;
      }
      setCheckOut(selected);
      setCalendarVisible(false);
      setSelectingFor("checkIn");
    }
  }

  function handleSelectRoom(id: string) {
    if (!checkIn || !checkOut) {
      Alert.alert("Please select check-in and check-out dates first.");
      return;
    }
    if (isRoomFullyBooked(id, checkIn, checkOut)) return;
    if (selectedRoomId === id) {
      setSelectedRoomId(null);
      setSelectedRate(null);
    } else {
      setSelectedRoomId(id);
      setSelectedRate(null);
    }
  }

  function handleBook() {
    if (!checkIn || !checkOut) {
      Alert.alert("Please select check-in and check-out dates.");
      return;
    }
    if (!selectedRoomId) {
      Alert.alert("Please select a room first.");
      return;
    }
    if (!selectedRate) {
      Alert.alert("Please select a rate/package.");
      return;
    }
    setConfirmed(true);
  }

  // ── Confirmed Screen ──────────────────────────────────────────────────────
  if (confirmed && selectedRoomData && selectedRateData) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <ScrollView
          contentContainerStyle={{ padding: 30, alignItems: "center" }}
        >
          <View style={{ marginTop: 20, alignItems: "center" }}>
            <Text style={{ fontSize: 50 }}>✅</Text>
            <Text
              style={{
                fontSize: 26,
                fontWeight: "bold",
                color: "#14532D",
                marginTop: 20,
                textAlign: "center",
              }}
            >
              Booking Confirmed!
            </Text>
            <Text
              style={{
                color: "#4B5563",
                marginTop: 10,
                textAlign: "center",
                lineHeight: 22,
              }}
            >
              Thank you for choosing VS Hotel. We look forward to welcoming you!
            </Text>
          </View>

          <View
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 16,
              padding: 24,
              marginTop: 30,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#0F172A",
                marginBottom: 16,
              }}
            >
              Booking Summary
            </Text>
            <Row label="Room" value={selectedRoomData.name} />
            <Row label="Package" value={selectedRateData.name} />
            <Row label="Check In" value={formatDisplay(checkIn)} />
            <Row label="Check Out" value={formatDisplay(checkOut)} />
            <Row label="Nights" value={`${nights}`} />
            <Row label="Rooms" value={`${roomCount}`} />
            <Row
              label="Guests"
              value={`${adults} Adults, ${children} Children`}
            />
            {promoCode ? <Row label="Promo Code" value={promoCode} /> : null}
            <View
              style={{
                borderTopWidth: 1,
                borderTopColor: "#E2E8F0",
                marginTop: 12,
                paddingTop: 12,
              }}
            >
              <Row
                label="Total"
                value={`PHP ${totalPrice.toLocaleString()}`}
                bold
              />
            </View>
            <Text
              style={{
                color: "#14532D",
                fontWeight: "bold",
                marginTop: 16,
                marginBottom: 8,
              }}
            >
              Package Inclusions:
            </Text>
            {selectedRateData.inclusions.map((inc, i) => (
              <Text key={i} style={{ color: "#4B5563", marginBottom: 4 }}>
                ✓ {inc}
              </Text>
            ))}
          </View>

          <Text
            style={{
              color: "#6B7280",
              marginTop: 20,
              textAlign: "center",
              fontSize: 13,
            }}
          >
            For inquiries: +63917-825-9938{"\n"}reservations@vshotel.com.ph
          </Text>

          <TouchableOpacity
            onPress={() => router.push("/payment")}
            style={{
              marginTop: 30,
              backgroundColor: "#C89B3C",
              paddingVertical: 14,
              paddingHorizontal: 40,
              borderRadius: 30,
              width: "100%",
              alignItems: "center",
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              Proceed to Payment 💳
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setConfirmed(false);
              setSelectedRoomId(null);
              setSelectedRate(null);
              setCheckIn("");
              setCheckOut("");
            }}
            style={{
              marginTop: 12,
              paddingVertical: 14,
              alignItems: "center",
              marginBottom: 120,
            }}
          >
            <Text style={{ color: "#64748B", fontSize: 14 }}>
              Book Another Room
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // ── Main Screen ───────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
      {/* Calendar Modal */}
      <Modal visible={calendarVisible} animationType="slide" transparent>
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
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              padding: 20,
            }}
          >
            <Text
              style={{
                fontSize: 18,
                fontWeight: "bold",
                color: "#0F172A",
                marginBottom: 4,
              }}
            >
              {selectingFor === "checkIn"
                ? "Select Check-in Date"
                : "Select Check-out Date"}
            </Text>
            <Text style={{ color: "#64748B", marginBottom: 16 }}>
              {selectingFor === "checkOut"
                ? "Tap a date after your check-in"
                : "Tap your arrival date"}
            </Text>
            <Calendar
              onDayPress={handleDayPress}
              minDate={selectingFor === "checkOut" ? checkIn : todayStr}
              markingType="period"
              markedDates={markedDates}
              theme={{
                todayTextColor: "#14532D",
                selectedDayBackgroundColor: "#14532D",
                arrowColor: "#14532D",
                dotColor: "#14532D",
              }}
            />
            <TouchableOpacity
              onPress={() => {
                setCalendarVisible(false);
                setSelectingFor("checkIn");
              }}
              style={{
                marginTop: 16,
                padding: 14,
                backgroundColor: "#F1F5F9",
                borderRadius: 12,
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#64748B", fontWeight: "bold" }}>
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <ScrollView ref={scrollRef} style={{ flex: 1 }}>
        {/* Header */}
        <View
          style={{
            backgroundColor: "#14532D",
            paddingTop: 20,
            paddingBottom: 20,
            paddingHorizontal: 20,
          }}
        >
          <Text style={{ color: "white", fontSize: 24, fontWeight: "bold" }}>
            Book Your Stay
          </Text>
          <Text style={{ color: "#86EFAC", marginTop: 4 }}>
            VS Hotel Convention Center
          </Text>
        </View>

        <View style={{ padding: 20, gap: 16 }}>
          {/* Dates */}
          <View style={{ flexDirection: "row", gap: 12 }}>
            <TouchableOpacity
              onPress={() => {
                setSelectingFor("checkIn");
                setCalendarVisible(true);
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: checkIn ? "#14532D" : "#E2E8F0",
                borderRadius: 10,
                padding: 12,
                backgroundColor: "#F8FAFC",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#64748B",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                CHECK IN
              </Text>
              <Text
                style={{ color: checkIn ? "#0F172A" : "#94A3B8", fontSize: 15 }}
              >
                {checkIn ? formatDisplay(checkIn) : "Select date"}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                if (!checkIn) {
                  Alert.alert("Select check-in date first.");
                  return;
                }
                setSelectingFor("checkOut");
                setCalendarVisible(true);
              }}
              style={{
                flex: 1,
                borderWidth: 1,
                borderColor: checkOut ? "#14532D" : "#E2E8F0",
                borderRadius: 10,
                padding: 12,
                backgroundColor: "#F8FAFC",
              }}
            >
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "bold",
                  color: "#64748B",
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                CHECK OUT
              </Text>
              <Text
                style={{
                  color: checkOut ? "#0F172A" : "#94A3B8",
                  fontSize: 15,
                }}
              >
                {checkOut ? formatDisplay(checkOut) : "Select date"}
              </Text>
            </TouchableOpacity>
          </View>

          {nights > 0 && (
            <Text style={{ color: "#14532D", fontWeight: "bold" }}>
              {nights} Night{nights > 1 ? "s" : ""}
            </Text>
          )}

          {/* Guests */}
          <View
            style={{
              backgroundColor: "#F8FAFC",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text
              style={{ fontWeight: "bold", color: "#0F172A", marginBottom: 12 }}
            >
              Guests & Rooms
            </Text>
            <Counter
              label="Adults"
              value={adults}
              min={1}
              max={10}
              onChange={setAdults}
            />
            <Counter
              label="Children"
              value={children}
              min={0}
              max={6}
              onChange={setChildren}
            />
            <Counter
              label="Rooms"
              value={roomCount}
              min={1}
              max={5}
              onChange={setRoomCount}
            />
          </View>

          {/* Promo */}
          <View>
            <Text
              style={{
                fontSize: 11,
                fontWeight: "bold",
                color: "#64748B",
                marginBottom: 6,
                letterSpacing: 1,
              }}
            >
              PROMO CODE
            </Text>
            <TextInput
              value={promoCode}
              onChangeText={setPromoCode}
              placeholder="Enter promo code"
              style={{
                borderWidth: 1,
                borderColor: "#E2E8F0",
                borderRadius: 10,
                padding: 12,
                backgroundColor: "#F8FAFC",
                color: "#0F172A",
              }}
              placeholderTextColor="#94A3B8"
            />
          </View>
        </View>

        {/* Room Selection */}
        <View style={{ paddingHorizontal: 20 }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              color: "#0F172A",
              marginBottom: 4,
            }}
          >
            Select a Room
          </Text>
          {(!checkIn || !checkOut) && (
            <Text style={{ color: "#94A3B8", fontSize: 13, marginBottom: 16 }}>
              Select your dates to check availability
            </Text>
          )}
          {checkIn && checkOut && (
            <Text style={{ color: "#64748B", fontSize: 13, marginBottom: 16 }}>
              Showing availability for {formatDisplay(checkIn)} →{" "}
              {formatDisplay(checkOut)}
            </Text>
          )}

          {ROOMS.map((room) => {
            const isSelected = selectedRoomId === room.id;
            const fullyBooked =
              checkIn && checkOut
                ? isRoomFullyBooked(room.id, checkIn, checkOut)
                : false;
            const remaining =
              checkIn && checkOut
                ? getRemainingSlots(room.id, checkIn, checkOut)
                : TOTAL_SLOTS;

            return (
              <View key={room.id}>
                <TouchableOpacity
                  onPress={() => handleSelectRoom(room.id)}
                  disabled={fullyBooked}
                  style={{
                    borderRadius: 16,
                    borderWidth: 2,
                    borderColor: fullyBooked
                      ? "#E2E8F0"
                      : isSelected
                        ? "#14532D"
                        : "#E2E8F0",
                    marginBottom: isSelected ? 0 : 16,
                    overflow: "hidden",
                    backgroundColor: fullyBooked
                      ? "#F8FAFC"
                      : isSelected
                        ? "#F0FDF4"
                        : "#fff",
                    opacity: fullyBooked ? 0.6 : 1,
                  }}
                >
                  <Image
                    source={room.image}
                    style={{ width: "100%", height: 180 }}
                    resizeMode="cover"
                  />

                  {fullyBooked && (
                    <View
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        right: 0,
                        height: 180,
                        backgroundColor: "rgba(0,0,0,0.45)",
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <View
                        style={{
                          backgroundColor: "#DC2626",
                          paddingHorizontal: 20,
                          paddingVertical: 8,
                          borderRadius: 20,
                        }}
                      >
                        <Text
                          style={{
                            color: "white",
                            fontWeight: "bold",
                            fontSize: 16,
                          }}
                        >
                          Fully Booked
                        </Text>
                      </View>
                    </View>
                  )}

                  <View style={{ padding: 16 }}>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 18,
                          fontWeight: "bold",
                          color: fullyBooked ? "#94A3B8" : "#14532D",
                        }}
                      >
                        {room.name}
                      </Text>
                      {isSelected && !fullyBooked && (
                        <TouchableOpacity
                          onPress={() => {
                            setSelectedRoomId(null);
                            setSelectedRate(null);
                          }}
                          style={{
                            backgroundColor: "#FEE2E2",
                            borderRadius: 20,
                            paddingHorizontal: 12,
                            paddingVertical: 6,
                          }}
                        >
                          <Text
                            style={{
                              color: "#DC2626",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            ✕ Deselect
                          </Text>
                        </TouchableOpacity>
                      )}
                    </View>

                    <Text style={{ color: "#64748B", marginTop: 4 }}>
                      {room.size} • Max {room.capacity} guests
                    </Text>

                    {checkIn && checkOut && !fullyBooked && (
                      <Text
                        style={{
                          color: remaining <= 3 ? "#DC2626" : "#14532D",
                          fontSize: 12,
                          marginTop: 4,
                          fontWeight: "bold",
                        }}
                      >
                        {remaining} slot{remaining !== 1 ? "s" : ""} remaining
                      </Text>
                    )}

                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginTop: 12,
                      }}
                    >
                      <View>
                        <Text
                          style={{
                            color: "#94A3B8",
                            fontSize: 12,
                            textDecorationLine: "line-through",
                          }}
                        >
                          PHP {room.price.toLocaleString()}/night
                        </Text>
                        <Text style={{ color: "#94A3B8", fontSize: 12 }}>
                          From PHP{" "}
                          {Math.min(
                            ...room.rates.map((r) => r.pricePerNight),
                          ).toLocaleString()}
                          /night
                        </Text>
                      </View>
                      {isSelected && (
                        <View
                          style={{
                            backgroundColor: "#14532D",
                            borderRadius: 20,
                            paddingHorizontal: 16,
                            paddingVertical: 8,
                          }}
                        >
                          <Text style={{ color: "white", fontWeight: "bold" }}>
                            Selected ✓
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>
                </TouchableOpacity>

                {/* Rate Selection */}
                {isSelected && !fullyBooked && (
                  <View
                    style={{
                      backgroundColor: "#F0FDF4",
                      borderWidth: 2,
                      borderTopWidth: 0,
                      borderColor: "#14532D",
                      borderBottomLeftRadius: 16,
                      borderBottomRightRadius: 16,
                      padding: 16,
                      marginBottom: 16,
                    }}
                  >
                    <Text
                      style={{
                        fontWeight: "bold",
                        color: "#0F172A",
                        marginBottom: 12,
                      }}
                    >
                      Choose a Package
                    </Text>
                    {room.rates.map((rate, i) => {
                      const isRateSelected = selectedRate === rate.name;
                      const rateTotal =
                        rate.pricePerNight * Math.max(nights, 1) * roomCount;
                      return (
                        <TouchableOpacity
                          key={i}
                          onPress={() =>
                            setSelectedRate(isRateSelected ? null : rate.name)
                          }
                          style={{
                            borderRadius: 12,
                            borderWidth: 2,
                            borderColor: isRateSelected ? "#14532D" : "#E2E8F0",
                            backgroundColor: isRateSelected
                              ? "#14532D"
                              : "#fff",
                            padding: 14,
                            marginBottom: 10,
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              justifyContent: "space-between",
                              alignItems: "center",
                              marginBottom: 6,
                            }}
                          >
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: isRateSelected ? "white" : "#14532D",
                                flex: 1,
                              }}
                            >
                              {rate.name}
                            </Text>
                            <Text
                              style={{
                                fontWeight: "bold",
                                color: isRateSelected ? "white" : "#0F172A",
                                fontSize: 15,
                              }}
                            >
                              PHP {rateTotal.toLocaleString()}
                            </Text>
                          </View>
                          <Text
                            style={{
                              color: isRateSelected ? "#86EFAC" : "#94A3B8",
                              fontSize: 11,
                              marginBottom: 6,
                            }}
                          >
                            PHP {rate.pricePerNight.toLocaleString()}/night ×{" "}
                            {Math.max(nights, 1)} night{nights > 1 ? "s" : ""} ×{" "}
                            {roomCount} room{roomCount > 1 ? "s" : ""}
                          </Text>
                          {rate.inclusions.map((inc, j) => (
                            <Text
                              key={j}
                              style={{
                                color: isRateSelected ? "#86EFAC" : "#64748B",
                                fontSize: 13,
                                marginBottom: 2,
                              }}
                            >
                              ✓ {inc}
                            </Text>
                          ))}
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Spacer — clears sticky button + floating tab bar */}
        <View style={{ height: 160 }} />
      </ScrollView>

      {/* Sticky Bottom Button */}
      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 12,
          paddingBottom: 16,
          backgroundColor: "#fff",
          borderTopWidth: 1,
          borderTopColor: "#E2E8F0",
          shadowColor: "#000",
          shadowOpacity: 0.08,
          shadowRadius: 8,
          elevation: 8,
        }}
      >
        <TouchableOpacity
          onPress={handleBook}
          style={{
            backgroundColor:
              selectedRoomId && selectedRate ? "#14532D" : "#94A3B8",
            paddingVertical: 16,
            borderRadius: 30,
            alignItems: "center",
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 18 }}>
            {selectedRoomId && selectedRate
              ? `Book Now — PHP ${totalPrice.toLocaleString()}`
              : selectedRoomId
                ? "Select a Package"
                : !checkIn || !checkOut
                  ? "Select Dates First"
                  : "Select a Room to Book"}
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

function Counter({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: 12,
      }}
    >
      <Text style={{ color: "#0F172A", fontSize: 16 }}>{label}</Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 16 }}>
        <TouchableOpacity
          onPress={() => onChange(Math.max(min, value - 1))}
          style={{
            backgroundColor: "#E2E8F0",
            borderRadius: 20,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0F172A" }}>
            −
          </Text>
        </TouchableOpacity>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "bold",
            width: 24,
            textAlign: "center",
          }}
        >
          {value}
        </Text>
        <TouchableOpacity
          onPress={() => onChange(Math.min(max, value + 1))}
          style={{
            backgroundColor: "#E2E8F0",
            borderRadius: 20,
            width: 36,
            height: 36,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={{ fontSize: 20, fontWeight: "bold", color: "#0F172A" }}>
            +
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

function Row({
  label,
  value,
  bold,
}: {
  label: string;
  value: string;
  bold?: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 8,
      }}
    >
      <Text style={{ color: "#64748B" }}>{label}</Text>
      <Text style={{ fontWeight: bold ? "bold" : "normal", color: "#0F172A" }}>
        {value}
      </Text>
    </View>
  );
}
