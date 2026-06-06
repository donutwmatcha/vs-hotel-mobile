// src/screens/HomeScreen.tsx
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useFocusEffect } from "expo-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Dimensions,
  Image,
  Linking,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import RoomsSection from "../components/RoomsSection";
import { useAuth } from "../context/AuthContext";

const C = {
  green: "#14532D",
  gold: "#C89B3C",
  white: "#FFFFFF",
  lavender: "#F0EEF5",
  offWhite: "#F5F5F5",
};

function getWeatherInfo(code: number): { label: string; iconName: string } {
  if (code === 0) return { label: "Clear Sky", iconName: "sunny" };
  if (code <= 2) return { label: "Partly Cloudy", iconName: "partly-sunny" };
  if (code === 3) return { label: "Overcast", iconName: "cloudy" };
  if (code <= 49) return { label: "Foggy", iconName: "cloud" };
  if (code <= 59) return { label: "Drizzle", iconName: "rainy" };
  if (code <= 69) return { label: "Rainy", iconName: "rainy" };
  if (code <= 79) return { label: "Snowy", iconName: "snow" };
  if (code <= 84) return { label: "Rain Showers", iconName: "rainy" };
  if (code <= 99) return { label: "Thunderstorm", iconName: "thunderstorm" };
  return { label: "Unknown", iconName: "thermometer" };
}

const { width } = Dimensions.get("window");

const PROMOS = [
  {
    id: "1",
    image: {
      uri: "https://res.cloudinary.com/dadshpos1/image/upload/v1780473723/june-cinema_juo313.jpg",
    },
  },
  {
    id: "2",
    image: {
      uri: "https://res.cloudinary.com/dadshpos1/image/upload/v1780501885/pride26_xaar8x.jpg",
    },
  },
  {
    id: "3",
    image: {
      uri: "https://res.cloudinary.com/dadshpos1/image/upload/v1780501886/nacho_a6ljf9.jpg",
    },
  },
  {
    id: "4",
    image: {
      uri: "https://res.cloudinary.com/dadshpos1/image/upload/v1780501894/father_s-day_cslkws.jpg",
    },
  },
];

const REVIEWS = [
  {
    name: "JUICE",
    date: "March 04, 2026",
    title: "First try staycation",
    review:
      "It was my first time to try go in on a staycation and VS hotel did not disappoint me. I was surprised that the room that I book was actually so large and I have it all for one night. I'll definitely go back.",
  },
  {
    name: "MARC",
    date: "March 09, 2026",
    title: "Best Sleep this Year",
    review:
      "One of the best is my sleep as it gave me deep, serene and nice sleep during my stay. No insects roaming as well the facility is so clean.",
  },
  {
    name: "MARILOU",
    date: "March 16, 2026",
    title: "Amazing stay in VS Hotel",
    review:
      "The Housekeeping supervisor is very helpful and has a very excellent customer service. The facility is very clean and smells good. It is really value for your money!",
  },
  {
    name: "MYRA",
    date: "March 18, 2026",
    title: "Great Hotel!",
    review:
      "My son and daughter enjoy the bath tub. No one bother us and staff are courteous. Fast check in and check out. Over all I want to stay here again.",
  },
  {
    name: "MARILYN",
    date: "April 08, 2026",
    title: "Worthwhile Stay",
    review:
      "Our family thoroughly enjoyed the amenities that VS Hotel offers. It was a wonderful experience that fostered family bonding and created special moments of togetherness for the kids.",
  },
  {
    name: "GENALYNE",
    date: "April 09, 2026",
    title: "Exceptional",
    review:
      "The location was perfect for shopping, well maintained bathrooms. The staff were friendly and attentive, making the overall experience seamless. Great value for money.",
  },
];

function fmt(iso: string, type: "time" | "date") {
  const d = new Date(iso);
  if (type === "time")
    return d.toLocaleTimeString("en-PH", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  return d.toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function HomeScreen() {
  const { user, profile, lastCheckIn, lastCheckOut, refreshProfile } =
    useAuth();
  const [currentPromo, setCurrentPromo] = useState(0);
  const [weather, setWeather] = useState<{
    temp: string;
    label: string;
    iconName: string;
  } | null>(null);
  const lastCheckOutId = useRef<string | null>(null);
  const reviewPromptShown = useRef(false);
  const scrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);

  const userName = profile?.first_name ?? null;
  const userPoints = profile?.points ?? null;
  const memberRank =
    (profile?.points ?? 0) >= 5000
      ? "Platinum Member"
      : (profile?.points ?? 0) >= 1000
        ? "Gold Member"
        : "Silver Member";

  const isCheckedIn = !!lastCheckIn && !lastCheckOut;

  useFocusEffect(
    useCallback(() => {
      mainScrollRef.current?.scrollTo({ y: 0, animated: false });
      refreshProfile();
      fetchWeather();
      reviewPromptShown.current = false;
    }, []),
  );

  useEffect(() => {
    if (
      lastCheckOut &&
      lastCheckOut.id !== lastCheckOutId.current &&
      !reviewPromptShown.current &&
      user
    ) {
      lastCheckOutId.current = lastCheckOut.id;
      reviewPromptShown.current = true;
      setTimeout(() => {
        Alert.alert(
          "Thanks for staying with us! \uD83C\uDFE8",
          "We hope you had a wonderful time. Would you like to leave a review? You'll earn +20 VS Points!",
          [
            { text: "Maybe Later", style: "cancel" },
            {
              text: "Leave a Review \u2B50",
              onPress: () => router.push("/request"),
            },
          ],
        );
      }, 1000);
    }
  }, [lastCheckOut, user]);

  async function fetchWeather() {
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=14.676&longitude=121.0437&current_weather=true&temperature_unit=celsius&timezone=Asia%2FManila",
      );
      const data = await res.json();
      const { temperature, weathercode } = data.current_weather;
      const info = getWeatherInfo(weathercode);
      setWeather({ temp: `${Math.round(temperature)}\u00B0C`, ...info });
    } catch {
      setWeather({ temp: "--\u00B0C", label: "N/A", iconName: "thermometer" });
    }
  }

  function handlePromoScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / width);
    setCurrentPromo(index);
  }

  function getGreeting() {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning,";
    if (hour < 18) return "Good Afternoon,";
    return "Good Evening,";
  }

  return (
    <ScrollView
      ref={mainScrollRef}
      style={{ flex: 1, backgroundColor: C.white }}
    >
      {/* HEADER */}
      <View
        style={{
          backgroundColor: C.green,
          paddingTop: 34,
          paddingBottom: 4,
          paddingLeft: 0,
          paddingRight: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={require("../assets/images/main-logo-white.png")}
          style={{ width: 480, height: 90, marginLeft: -150 }}
          resizeMode="contain"
        />
      </View>

      {/* HERO */}
      <View style={{ position: "relative" }}>
        <Image
          source={{
            uri: "https://res.cloudinary.com/dadshpos1/image/upload/v1780225673/bookbyjune1_sxfwil.png",
          }}
          style={{ width: "100%", height: 280 }}
          resizeMode="cover"
        />
        <View
          style={{ position: "absolute", bottom: -22, alignSelf: "center" }}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.swiftbook.io/inst/#home?propertyId=363MjIpd9DKOxXNT5Koe1JFI0MzQ=&JDRN=Y",
              ).catch(() => {})
            }
            style={{
              backgroundColor: C.gold,
              paddingVertical: 14,
              paddingHorizontal: 40,
              borderRadius: 30,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
              shadowColor: "#000",
              shadowOpacity: 0.3,
              shadowRadius: 8,
              elevation: 6,
            }}
          >
            <FontAwesome5 name="calendar-check" size={14} color={C.white} />
            <Text style={{ color: C.white, fontWeight: "bold", fontSize: 16 }}>
              Book Now
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* GREETING CARD */}
      <View style={{ paddingHorizontal: 16, paddingTop: 40, paddingBottom: 8 }}>
        <View
          style={{
            backgroundColor: C.white,
            borderRadius: 16,
            borderWidth: 1.5,
            borderColor: C.green,
            padding: 18,
            shadowColor: "#000",
            shadowOpacity: 0.06,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            <View style={{ flex: 1, marginRight: 12 }}>
              <Text
                style={{
                  fontSize: 11,
                  fontWeight: "800",
                  color: C.green,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                  marginBottom: 6,
                }}
              >
                VS Hotel Member
              </Text>
              <Text style={{ fontSize: 14, color: "#475569" }}>
                {getGreeting()}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 6,
                  marginTop: 2,
                }}
              >
                <Text
                  style={{ fontSize: 26, fontWeight: "900", color: "#0F172A" }}
                >
                  {userName ?? "Guest"}!
                </Text>
                <Ionicons name="sparkles" size={20} color={C.gold} />
              </View>
              <Text style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                {userPoints !== null
                  ? `${userPoints} VS Points`
                  : "0 VS Points"}
              </Text>
            </View>
            <View
              style={{
                alignItems: "center",
                backgroundColor: C.offWhite,
                borderRadius: 12,
                paddingHorizontal: 14,
                paddingVertical: 10,
                minWidth: 90,
              }}
            >
              <Ionicons
                name={(weather?.iconName ?? "thermometer") as any}
                size={28}
                color={C.green}
              />
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: "800",
                  color: "#0F172A",
                  marginTop: 4,
                }}
              >
                {weather ? weather.temp : "--\u00B0C"}
              </Text>
              <Text
                style={{
                  fontSize: 11,
                  color: "#64748B",
                  marginTop: 2,
                  textAlign: "center",
                }}
              >
                {weather ? weather.label : "Loading..."}
              </Text>
            </View>
          </View>
          {userName ? (
            <View
              style={{
                backgroundColor: C.green,
                borderRadius: 30,
                paddingVertical: 12,
                marginTop: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FontAwesome5 name="star" size={14} color={C.gold} solid />
              <Text style={{ color: C.white, fontWeight: "800", fontSize: 15 }}>
                {memberRank}
              </Text>
            </View>
          ) : (
            <TouchableOpacity
              onPress={() => router.push("/signin")}
              style={{
                backgroundColor: C.green,
                borderRadius: 30,
                paddingVertical: 12,
                marginTop: 16,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
              }}
            >
              <FontAwesome5 name="sign-in-alt" size={14} color={C.gold} />
              <Text style={{ color: C.white, fontWeight: "800", fontSize: 15 }}>
                Sign in to see your points
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* CHECK-IN STATUS */}
      {userName && (
        <View
          style={{
            marginHorizontal: 16,
            marginTop: 12,
            marginBottom: 8,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 3,
          }}
        >
          <View
            style={{
              backgroundColor: isCheckedIn
                ? C.green
                : lastCheckOut
                  ? "#DC2626"
                  : "#64748B",
              paddingHorizontal: 16,
              paddingVertical: 12,
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: isCheckedIn
                  ? "#86EFAC"
                  : lastCheckOut
                    ? "#FCA5A5"
                    : "#CBD5E1",
              }}
            />
            <Text style={{ color: C.white, fontWeight: "800", fontSize: 14 }}>
              {isCheckedIn
                ? "Currently Checked In"
                : lastCheckOut
                  ? "Checked Out"
                  : "Not Currently Checked In"}
            </Text>
          </View>
          <View style={{ backgroundColor: C.white, padding: 16, gap: 10 }}>
            {!lastCheckIn && !lastCheckOut ? (
              <Text
                style={{
                  color: "#64748B",
                  fontSize: 13,
                  textAlign: "center",
                  paddingVertical: 4,
                }}
              >
                Your check-in status will appear here once the front desk scans
                your QR code.
              </Text>
            ) : (
              <>
                {lastCheckIn && (
                  <>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          fontWeight: "600",
                        }}
                      >
                        Checked In
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#0F172A",
                          fontWeight: "700",
                        }}
                      >
                        {fmt(lastCheckIn.checked_in_at, "date")}{" "}
                        {fmt(lastCheckIn.checked_in_at, "time")}
                      </Text>
                    </View>
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 12,
                          color: "#64748B",
                          fontWeight: "600",
                        }}
                      >
                        Points Earned
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: C.green,
                          fontWeight: "700",
                        }}
                      >
                        +{lastCheckIn.points_awarded} VS Points
                      </Text>
                    </View>
                    {lastCheckIn.room_type && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#64748B",
                            fontWeight: "600",
                          }}
                        >
                          Room Type
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#0F172A",
                            fontWeight: "700",
                          }}
                        >
                          {lastCheckIn.room_type}
                        </Text>
                      </View>
                    )}
                    {lastCheckIn.room_number && (
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#64748B",
                            fontWeight: "600",
                          }}
                        >
                          Room Number
                        </Text>
                        <Text
                          style={{
                            fontSize: 12,
                            color: "#0F172A",
                            fontWeight: "700",
                          }}
                        >
                          Room {lastCheckIn.room_number}
                        </Text>
                      </View>
                    )}
                  </>
                )}
                {lastCheckIn && lastCheckOut && (
                  <View style={{ height: 1, backgroundColor: "#F1F5F9" }} />
                )}
                {lastCheckOut && (
                  <View
                    style={{
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#64748B",
                        fontWeight: "600",
                      }}
                    >
                      Checked Out
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: "#DC2626",
                        fontWeight: "700",
                      }}
                    >
                      {fmt(lastCheckOut.checked_in_at, "date")}{" "}
                      {fmt(lastCheckOut.checked_in_at, "time")}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        </View>
      )}

      {/* ROOMS */}
      <RoomsSection />

      {/* JUNE / PROMOS */}
      <View style={{ backgroundColor: C.lavender, paddingTop: 30 }}>
        <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
          <Text
            style={{
              fontSize: 11,
              fontWeight: "800",
              color: "#64748B",
              letterSpacing: 2,
              textTransform: "uppercase",
              marginBottom: 2,
            }}
          >
            What's On This Month
          </Text>
          <Text
            style={{
              fontSize: 52,
              fontWeight: "900",
              color: C.green,
              letterSpacing: -2,
              lineHeight: 56,
            }}
          >
            JUNE
          </Text>
          <Text style={{ fontSize: 14, color: "#64748B", marginTop: 2 }}>
            Events, promos and more at VS Hotel
          </Text>
        </View>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handlePromoScroll}
          style={{ marginBottom: 12 }}
        >
          {PROMOS.map((promo) => (
            <View
              key={promo.id}
              style={{
                width: width - 40,
                marginHorizontal: 20,
                borderRadius: 20,
                overflow: "hidden",
              }}
            >
              <Image
                source={promo.image}
                style={{ width: "100%", height: 300 }}
                resizeMode="contain"
              />
            </View>
          ))}
        </ScrollView>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginBottom: 30,
            gap: 8,
          }}
        >
          {PROMOS.map((_, i) => (
            <View
              key={i}
              style={{
                width: currentPromo === i ? 20 : 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: currentPromo === i ? C.green : "#D1FAE5",
              }}
            />
          ))}
        </View>
      </View>

      {/* GUEST REVIEWS */}
      <View
        style={{
          paddingVertical: 30,
          paddingTop: 40,
          backgroundColor: C.green,
        }}
      >
        <Text
          style={{
            textAlign: "center",
            fontSize: 28,
            fontWeight: "bold",
            color: C.white,
            paddingHorizontal: 20,
          }}
        >
          GUEST REVIEWS
        </Text>
        <Text
          style={{
            textAlign: "center",
            color: "#86EFAC",
            marginTop: 8,
            paddingHorizontal: 24,
            lineHeight: 22,
            fontStyle: "italic",
          }}
        >
          Explore firsthand hotel experiences from cozy beds to top-notch
          service.
        </Text>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            gap: 12,
            marginTop: 20,
            paddingHorizontal: 20,
          }}
        >
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.tripadvisor.com/UserReviewEdit-g298574-d23833786-VS_Hotel-Quezon_City_Metro_Manila_Luzon.html",
              ).catch(() => {})
            }
            style={{
              flex: 1,
              borderWidth: 2,
              borderColor: C.white,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              gap: 6,
            }}
          >
            <FontAwesome5 name="smile" size={18} color={C.white} />
            <Text
              style={{
                color: C.white,
                fontWeight: "bold",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {"HOW DID YOU\nENJOY YOUR STAY?"}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://us1.list-manage.com/survey?u=2dc85a100274ce1d29cb7076c&id=8f0146ae40&attribution=false",
              ).catch(() => {})
            }
            style={{
              flex: 1,
              borderWidth: 2,
              borderColor: C.white,
              borderRadius: 12,
              paddingVertical: 12,
              alignItems: "center",
              gap: 6,
            }}
          >
            <FontAwesome5 name="edit" size={18} color={C.white} />
            <Text
              style={{
                color: C.white,
                fontWeight: "bold",
                fontSize: 12,
                textAlign: "center",
              }}
            >
              {"HOW SHOULD\nWE IMPROVE?"}
            </Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: 20,
            marginTop: 24,
            gap: 16,
            paddingBottom: 30,
          }}
        >
          {REVIEWS.map((review, i) => (
            <View
              key={i}
              style={{
                backgroundColor: C.lavender,
                borderRadius: 16,
                padding: 20,
                width: 280,
                shadowColor: "#000",
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <FontAwesome5 name="quote-left" size={22} color={C.green} />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: "bold",
                  color: "#0F172A",
                  marginTop: 8,
                }}
              >
                {review.title}
              </Text>
              <Text
                style={{
                  color: "#475569",
                  marginTop: 8,
                  lineHeight: 20,
                  fontSize: 13,
                }}
              >
                {review.review}
              </Text>
              <View style={{ flexDirection: "row", gap: 2, marginTop: 10 }}>
                {[1, 2, 3, 4, 5].map((s) => (
                  <FontAwesome5
                    key={s}
                    name="star"
                    size={10}
                    color={C.gold}
                    solid
                  />
                ))}
              </View>
              <Text
                style={{
                  color: "#0F172A",
                  fontWeight: "bold",
                  marginTop: 8,
                  fontSize: 13,
                }}
              >
                {review.name}
              </Text>
              <Text style={{ color: "#64748B", fontSize: 12 }}>
                {"Reviewed " + review.date}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 20 }} />
    </ScrollView>
  );
}
