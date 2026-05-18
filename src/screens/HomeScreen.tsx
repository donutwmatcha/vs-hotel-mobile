// src/screens/HomeScreen.tsx
import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import {
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
import MembershipBanner from "../components/MembershipBanner";
import RoomsSection from "../components/RoomsSection";
import { supabase } from "../lib/supabase";

// ─── Brand colors ─────────────────────────────────────────────────────────────
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
  { id: "1", image: require("../assets/promos/advisory.jpg") },
  { id: "2", image: require("../assets/promos/mlbb_rewards.jpg") },
  { id: "3", image: require("../assets/promos/summer_coolers.jpg") },
  { id: "4", image: require("../assets/promos/forever_queen_promo.jpg") },
  { id: "5", image: require("../assets/promos/splash_and_play.jpg") },
  { id: "6", image: require("../assets/promos/mothers_day_greeting.jpg") },
];

const EVENTS = [
  {
    id: "1",
    date: "MAY 18",
    day: "SUN",
    title: "Mother's Day Brunch Buffet",
    description: "Celebrate Mom with our special brunch spread at VS Dining.",
    tag: "Dining",
    color: "#C89B3C",
    iconName: "utensils",
  },
  {
    id: "2",
    date: "MAY 24",
    day: "SAT",
    title: "Live Acoustic Night",
    description: "Unwind with live music at the VS Lounge every Saturday.",
    tag: "Entertainment",
    color: "#14532D",
    iconName: "music",
  },
  {
    id: "3",
    date: "MAY 31",
    day: "SAT",
    title: "Splash & Play Weekend",
    description: "Kids' pool activities and summer fun for the whole family.",
    tag: "Leisure",
    color: "#0369A1",
    iconName: "swimmer",
  },
];

const NOTIFICATIONS = [
  { id: "1", text: "Your booking for May 20 is confirmed!", unread: true },
  { id: "2", text: "Flash Sale: 20% off this weekend!", unread: true },
  { id: "3", text: "Your review was posted. Thank you!", unread: false },
];

const DEALS = [
  {
    iconName: "bolt",
    label: "Flash Sale",
    title: "20% Off All Rooms",
    subtitle: "This weekend only • Ends May 18",
  },
  {
    iconName: "moon",
    label: "Night Owl Deal",
    title: "Book After 9PM, Save 15%",
    subtitle: "App exclusive • Limited slots",
  },
  {
    iconName: "gift",
    label: "Anniversary Promo",
    title: "Stay 2 Nights, Get 1 Free",
    subtitle: "Valid May 20–31 only",
  },
];

export default function HomeScreen() {
  const [currentPromo, setCurrentPromo] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);
  const [userPoints, setUserPoints] = useState<number | null>(null);
  const [memberRank, setMemberRank] = useState<string>("Silver Member");
  const [unreadCount, setUnreadCount] = useState(
    NOTIFICATIONS.filter((n) => n.unread).length,
  );
  const [weather, setWeather] = useState<{
    temp: string;
    label: string;
    iconName: string;
  } | null>(null);

  const scrollRef = useRef<ScrollView>(null);
  const mainScrollRef = useRef<ScrollView>(null);

  useFocusEffect(
    useCallback(() => {
      mainScrollRef.current?.scrollTo({ y: 0, animated: false });
      fetchUser();
      fetchWeather();
    }, []),
  );

  async function fetchWeather() {
    try {
      const res = await fetch(
        "https://api.open-meteo.com/v1/forecast?latitude=14.676&longitude=121.0437&current_weather=true&temperature_unit=celsius&timezone=Asia%2FManila",
      );
      const data = await res.json();
      const { temperature, weathercode } = data.current_weather;
      const info = getWeatherInfo(weathercode);
      setWeather({ temp: `${Math.round(temperature)}°C`, ...info });
    } catch {
      setWeather({ temp: "--°C", label: "N/A", iconName: "thermometer" });
    }
  }

  async function fetchUser() {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      const firstName = user.user_metadata?.first_name;
      setUserName(firstName || user.email?.split("@")[0] || null);
      setUserPoints(120);
    } else {
      setUserName(null);
      setUserPoints(null);
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
      {/* ── HEADER: Logo + Bell ── */}
      <View
        style={{
          backgroundColor: C.green,
          paddingTop: 34,
          paddingBottom: 4, // thinner bottom padding
          paddingLeft: -10, // no left padding so logo hugs the edge
          paddingRight: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Image
          source={require("../assets/images/main-logo-white.png")}
          style={{ width: 450, height: 70, marginLeft: -150 }}
          resizeMode="contain"
        />
        <TouchableOpacity
          onPress={() => setShowNotifications(!showNotifications)}
          style={{
            backgroundColor: "rgba(255,255,255,0.15)",
            borderRadius: 12,
            padding: 8,
            position: "relative",
          }}
        >
          <Ionicons
            name={showNotifications ? "notifications" : "notifications-outline"}
            size={24}
            color={C.white}
          />
          {unreadCount > 0 && (
            <View
              style={{
                position: "absolute",
                top: 4,
                right: 4,
                backgroundColor: "#EF4444",
                borderRadius: 10,
                width: 16,
                height: 16,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text style={{ color: C.white, fontSize: 9, fontWeight: "bold" }}>
                {unreadCount}
              </Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      {/* Notifications Dropdown */}
      {showNotifications && (
        <View
          style={{
            backgroundColor: C.white,
            marginHorizontal: 16,
            borderRadius: 16,
            overflow: "hidden",
            shadowColor: "#000",
            shadowOpacity: 0.15,
            shadowRadius: 8,
            elevation: 6,
            zIndex: 99,
          }}
        >
          <Text
            style={{
              fontWeight: "bold",
              color: C.green,
              padding: 14,
              borderBottomWidth: 1,
              borderBottomColor: "#F1F5F9",
              fontSize: 14,
            }}
          >
            Notifications
          </Text>
          {NOTIFICATIONS.map((n) => (
            <View
              key={n.id}
              style={{
                flexDirection: "row",
                alignItems: "center",
                paddingHorizontal: 14,
                paddingVertical: 12,
                borderBottomWidth: 1,
                borderBottomColor: "#F8FAFC",
                backgroundColor: n.unread ? C.lavender : C.white,
                gap: 10,
              }}
            >
              <Ionicons
                name={n.unread ? "ellipse" : "ellipse-outline"}
                size={8}
                color={n.unread ? C.green : "#CBD5E1"}
              />
              <Text style={{ color: "#0F172A", fontSize: 13, flex: 1 }}>
                {n.text}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            onPress={() => {
              setUnreadCount(0);
              setShowNotifications(false);
            }}
            style={{
              padding: 12,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
              gap: 6,
            }}
          >
            <Ionicons name="checkmark-done" size={14} color="#64748B" />
            <Text style={{ color: "#64748B", fontSize: 12 }}>
              Mark all as read
            </Text>
          </TouchableOpacity>
        </View>
      )}

      {/* ── HERO VIDEO — clean, no overlay ── */}
      <View style={{ position: "relative" }}>
        <Video
          source={require("../assets/videos/HOTEL-AVP.mp4")}
          style={{ width: "100%", height: 280 }}
          resizeMode={ResizeMode.COVER}
          shouldPlay
          isLooping
          isMuted
        />
        {/* Book Now floating below video */}
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

      {/* ── GREETING CARD ── */}
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
          {/* Top row: left info + right weather */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "flex-start",
            }}
          >
            {/* Left: label + greeting + name + points */}
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
              {/* Name + icon */}
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
              {/* Points */}
              <Text style={{ fontSize: 13, color: "#64748B", marginTop: 4 }}>
                {userPoints !== null
                  ? `${userPoints} VS Points`
                  : "0 VS Points"}
              </Text>
            </View>

            {/* Right: Weather*/}
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
                {weather ? weather.temp : "--°C"}
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

          {/* Member rank pill — full width */}
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

      {/* ── JOIN BANNER + ROOMS ── */}
      <RoomsSection />

      {/* ── EVENTS ── */}
      <View
        style={{
          paddingVertical: 30,
          paddingHorizontal: 20,
          backgroundColor: C.lavender,
        }}
      >
        <Text
          style={{
            fontSize: 11,
            fontWeight: "bold",
            color: "#64748B",
            letterSpacing: 2,
            textTransform: "uppercase",
            marginBottom: 4,
          }}
        >
          What's Happening
        </Text>
        <Text
          style={{
            fontSize: 26,
            fontWeight: "bold",
            color: C.green,
            marginBottom: 20,
          }}
        >
          Upcoming Events
        </Text>
        {EVENTS.map((event) => (
          <TouchableOpacity
            key={event.id}
            style={{
              flexDirection: "row",
              backgroundColor: C.white,
              borderRadius: 16,
              marginBottom: 14,
              overflow: "hidden",
              borderWidth: 1,
              borderColor: "#E2E8F0",
            }}
          >
            <View
              style={{
                backgroundColor: event.color,
                width: 70,
                alignItems: "center",
                justifyContent: "center",
                paddingVertical: 16,
                gap: 4,
              }}
            >
              <FontAwesome5
                name={event.iconName}
                size={16}
                color="rgba(255,255,255,0.8)"
              />
              <Text
                style={{ color: C.white, fontSize: 18, fontWeight: "bold" }}
              >
                {event.date.split(" ")[1]}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.8)", fontSize: 11 }}>
                {event.date.split(" ")[0]}
              </Text>
              <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: 10 }}>
                {event.day}
              </Text>
            </View>
            <View style={{ flex: 1, padding: 14, justifyContent: "center" }}>
              <View
                style={{
                  backgroundColor: event.color + "20",
                  borderRadius: 6,
                  paddingHorizontal: 8,
                  paddingVertical: 2,
                  alignSelf: "flex-start",
                  marginBottom: 6,
                }}
              >
                <Text
                  style={{
                    color: event.color,
                    fontSize: 10,
                    fontWeight: "bold",
                    letterSpacing: 1,
                  }}
                >
                  {event.tag.toUpperCase()}
                </Text>
              </View>
              <Text
                style={{ fontWeight: "bold", color: "#0F172A", fontSize: 15 }}
              >
                {event.title}
              </Text>
              <Text style={{ color: "#64748B", fontSize: 12, marginTop: 4 }}>
                {event.description}
              </Text>
            </View>
            <View style={{ justifyContent: "center", paddingRight: 14 }}>
              <Ionicons name="chevron-forward" size={18} color="#CBD5E1" />
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── PROMOS ── */}
      <View style={{ paddingVertical: 30, backgroundColor: C.offWhite }}>
        <Text
          style={{
            textAlign: "center",
            fontSize: 14,
            color: "#4B5563",
            letterSpacing: 2,
            textTransform: "uppercase",
            paddingHorizontal: 20,
          }}
        >
          Exclusive for the Month of
        </Text>
        <Text
          style={{
            textAlign: "center",
            fontSize: 48,
            fontWeight: "900",
            color: C.green,
            letterSpacing: -1,
            marginTop: -4,
          }}
        >
          MAY
        </Text>
        <ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={handlePromoScroll}
          style={{ marginTop: 20 }}
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
            marginTop: 16,
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
        <TouchableOpacity
          onPress={() => router.push("/booking")}
          style={{
            marginTop: 24,
            backgroundColor: C.gold,
            paddingVertical: 14,
            paddingHorizontal: 35,
            borderRadius: 30,
            alignSelf: "center",
            flexDirection: "row",
            alignItems: "center",
            gap: 8,
            shadowColor: "#000",
            shadowOpacity: 0.2,
            shadowRadius: 6,
            elevation: 4,
          }}
        >
          <FontAwesome5 name="calendar-check" size={14} color={C.white} />
          <Text style={{ color: C.white, fontWeight: "bold", fontSize: 16 }}>
            Book Now
          </Text>
        </TouchableOpacity>
      </View>

      {/* ── GUEST REVIEWS ── */}
      <View
        style={{
          paddingVertical: 30,
          paddingTop: 40,
          backgroundColor: C.green,
          marginTop: 20,
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
              )
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
              HOW DID YOU{"\n"}ENJOY YOUR STAY?
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://us1.list-manage.com/survey?u=2dc85a100274ce1d29cb7076c&id=8f0146ae40&attribution=false",
              )
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
              HOW SHOULD{"\n"}WE IMPROVE?
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
          {[
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
          ].map((review, i) => (
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
                Reviewed {review.date}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* ── MEMBERSHIP BANNER ── */}
      <MembershipBanner
        userName={userName}
        userPoints={userPoints}
        memberRank={memberRank}
      />

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}
