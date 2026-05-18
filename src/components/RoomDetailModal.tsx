import React, { useState } from "react";
import {
  Dimensions,
  Image,
  Linking,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Room } from "../constants/rooms";

const { width: SW } = Dimensions.get("window");

const C = {
  green: "#1B4332",
  greenLight: "#2D6A4F",
  gold: "#C89B3C",
  goldLight: "#D4A017",
  white: "#FFFFFF",
  offWhite: "#F8FAFC",
  gray: "#64748B",
  grayLight: "#E5E7EB",
  dark: "#0D1B12",
};

interface Props {
  room: Room | null;
  visible: boolean;
  onClose: () => void;
}

export default function RoomDetailModal({ room, visible, onClose }: Props) {
  const [activeImage, setActiveImage] = useState(0);
  const [selectedRateIndex, setSelectedRateIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<"facilities" | "rates">(
    "facilities",
  );

  if (!room) return null;

  const selectedRate = room.rates[selectedRateIndex];

  const handleBook = () => {
    onClose();
    Linking.openURL(
      "https://www.swiftbook.io/inst/#home?propertyId=363MjIpd9DKOxXNT5Koe1JFI0MzQ=&JDRN=Y",
    ).catch(() => {});
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={s.container}>
        {/* ── MAIN SCROLL — everything inside, no gap ── */}
        <ScrollView
          style={s.scroll}
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          {/* Hero Image */}
          <View style={s.galleryWrap}>
            <Image
              source={room.gallery[activeImage] ?? room.image}
              style={s.heroImage}
              resizeMode="cover"
            />
            <TouchableOpacity style={s.closeBtn} onPress={onClose}>
              <Text style={s.closeBtnText}>✕</Text>
            </TouchableOpacity>
            <View style={s.imageCounter}>
              <Text style={s.imageCounterText}>
                {activeImage + 1} / {room.gallery.length}
              </Text>
            </View>
          </View>

          {/* Thumbnail Strip */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={s.thumbRow}
          >
            {room.gallery.map((img, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveImage(i)}
                activeOpacity={0.8}
              >
                <Image
                  source={img}
                  style={[s.thumb, i === activeImage && s.thumbActive]}
                  resizeMode="cover"
                />
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Room Info */}
          <View style={s.content}>
            <Text style={s.roomName}>{room.name}</Text>
            <Text style={s.description}>{room.description}</Text>

            {/* Quick Specs */}
            <View style={s.specsRow}>
              <View style={s.spec}>
                <Text style={s.specIcon}>📐</Text>
                <Text style={s.specValue}>{room.size}</Text>
                <Text style={s.specLabel}>Size</Text>
              </View>
              <View style={s.specDivider} />
              <View style={s.spec}>
                <Text style={s.specIcon}>🛏</Text>
                <Text style={s.specValue}>{room.bedding}</Text>
                <Text style={s.specLabel}>Bedding</Text>
              </View>
              <View style={s.specDivider} />
              <View style={s.spec}>
                <Text style={s.specIcon}>👤</Text>
                <Text style={s.specValue}>Up to {room.capacity}</Text>
                <Text style={s.specLabel}>Guests</Text>
              </View>
            </View>

            {/* Tabs */}
            <View style={s.tabs}>
              <TouchableOpacity
                style={[s.tab, activeTab === "facilities" && s.tabActive]}
                onPress={() => setActiveTab("facilities")}
              >
                <Text
                  style={[
                    s.tabText,
                    activeTab === "facilities" && s.tabTextActive,
                  ]}
                >
                  Facilities
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.tab, activeTab === "rates" && s.tabActive]}
                onPress={() => setActiveTab("rates")}
              >
                <Text
                  style={[s.tabText, activeTab === "rates" && s.tabTextActive]}
                >
                  Rates
                </Text>
              </TouchableOpacity>
            </View>

            {/* Facilities Tab */}
            {activeTab === "facilities" && (
              <View style={s.section}>
                {room.facilities.map((fac) => (
                  <View key={fac.category} style={s.facilityGroup}>
                    <Text style={s.facilityCategory}>{fac.category}</Text>
                    <View style={s.facilityItems}>
                      {fac.items.map((item) => (
                        <View key={item} style={s.facilityItem}>
                          <Text style={s.facilityDot}>✓</Text>
                          <Text style={s.facilityText}>{item}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                ))}
              </View>
            )}

            {/* Rates Tab */}
            {activeTab === "rates" && (
              <View style={s.section}>
                {room.rates.map((rate, i) => (
                  <TouchableOpacity
                    key={rate.name}
                    style={[
                      s.rateCard,
                      i === selectedRateIndex && s.rateCardActive,
                    ]}
                    onPress={() => setSelectedRateIndex(i)}
                    activeOpacity={0.85}
                  >
                    <View style={s.rateHeader}>
                      <View style={{ flex: 1 }}>
                        <Text
                          style={[
                            s.rateName,
                            i === selectedRateIndex && s.rateNameActive,
                          ]}
                        >
                          {rate.name}
                        </Text>
                        <Text style={s.ratePrice}>
                          ₱{rate.pricePerNight.toLocaleString()}
                          <Text style={s.ratePerNight}> /night</Text>
                        </Text>
                      </View>
                      <View
                        style={[
                          s.radioOuter,
                          i === selectedRateIndex && s.radioOuterActive,
                        ]}
                      >
                        {i === selectedRateIndex && (
                          <View style={s.radioInner} />
                        )}
                      </View>
                    </View>
                    <View style={s.inclusionsList}>
                      {rate.inclusions.map((inc) => (
                        <View key={inc} style={s.inclusionItem}>
                          <Text style={s.inclusionDot}>•</Text>
                          <Text style={s.inclusionText}>{inc}</Text>
                        </View>
                      ))}
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}

            <View style={{ height: 20 }} />
          </View>
        </ScrollView>

        {/* ── FOOTER — always visible at bottom ── */}
        <View style={s.footer}>
          <View>
            <Text style={s.footerRateName}>{selectedRate.name}</Text>
            <Text style={s.footerPrice}>
              ₱{selectedRate.pricePerNight.toLocaleString()}
              <Text style={s.footerPerNight}> /night</Text>
            </Text>
          </View>
          <TouchableOpacity style={s.bookBtn} onPress={handleBook}>
            <Text style={s.bookBtnText}>Book Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: C.offWhite },
  scroll: { flex: 1 },

  // Gallery
  galleryWrap: { position: "relative" },
  heroImage: { width: SW, height: 220 },
  closeBtn: {
    position: "absolute",
    top: 14,
    right: 14,
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: { color: C.white, fontSize: 14, fontWeight: "700" },
  imageCounter: {
    position: "absolute",
    bottom: 12,
    right: 14,
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  imageCounterText: { color: C.white, fontSize: 12, fontWeight: "600" },

  // Thumbnails
  thumbRow: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    gap: 8,
    backgroundColor: C.white,
  },
  thumb: {
    width: 56,
    height: 56,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "transparent",
  },
  thumbActive: { borderColor: C.gold },

  // Content
  content: {
    padding: 20,
    paddingTop: 16,
  },
  roomName: { fontSize: 24, fontWeight: "900", color: C.dark, marginBottom: 6 },
  description: {
    fontSize: 13,
    color: C.gray,
    lineHeight: 20,
    marginBottom: 16,
  },

  // Specs
  specsRow: {
    flexDirection: "row",
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  spec: { flex: 1, alignItems: "center", gap: 3 },
  specIcon: { fontSize: 20 },
  specValue: {
    fontSize: 13,
    fontWeight: "700",
    color: C.dark,
    textAlign: "center",
  },
  specLabel: { fontSize: 11, color: C.gray },
  specDivider: { width: 1, backgroundColor: C.grayLight, marginHorizontal: 8 },

  // Tabs
  tabs: {
    flexDirection: "row",
    backgroundColor: C.grayLight,
    borderRadius: 12,
    padding: 4,
    marginBottom: 16,
  },
  tab: { flex: 1, paddingVertical: 9, borderRadius: 10, alignItems: "center" },
  tabActive: { backgroundColor: C.white },
  tabText: { fontSize: 14, fontWeight: "600", color: C.gray },
  tabTextActive: { color: C.green, fontWeight: "800" },

  // Section
  section: { gap: 12 },

  // Facilities
  facilityGroup: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  facilityCategory: {
    fontSize: 12,
    fontWeight: "800",
    color: C.green,
    letterSpacing: 0.5,
    textTransform: "uppercase",
    marginBottom: 8,
  },
  facilityItems: { gap: 5 },
  facilityItem: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  facilityDot: { color: C.gold, fontWeight: "700", fontSize: 13 },
  facilityText: { fontSize: 13, color: C.gray, flex: 1 },

  // Rates
  rateCard: {
    backgroundColor: C.white,
    borderRadius: 14,
    padding: 14,
    borderWidth: 2,
    borderColor: "transparent",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  rateCardActive: { borderColor: C.green },
  rateHeader: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  rateName: { fontSize: 15, fontWeight: "800", color: C.dark, marginBottom: 2 },
  rateNameActive: { color: C.green },
  ratePrice: { fontSize: 20, fontWeight: "900", color: C.gold },
  ratePerNight: { fontSize: 13, fontWeight: "400", color: C.gray },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: C.grayLight,
    alignItems: "center",
    justifyContent: "center",
  },
  radioOuterActive: { borderColor: C.green },
  radioInner: {
    width: 11,
    height: 11,
    borderRadius: 6,
    backgroundColor: C.green,
  },
  inclusionsList: { gap: 4 },
  inclusionItem: { flexDirection: "row", gap: 6, alignItems: "flex-start" },
  inclusionDot: { color: C.gold, fontWeight: "700", marginTop: 1 },
  inclusionText: { fontSize: 12, color: C.gray, flex: 1, lineHeight: 18 },

  // Footer
  footer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: C.white,
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderTopWidth: 1,
    borderTopColor: C.grayLight,
  },
  footerRateName: { fontSize: 11, color: C.gray, marginBottom: 2 },
  footerPrice: { fontSize: 20, fontWeight: "900", color: C.green },
  footerPerNight: { fontSize: 12, fontWeight: "400", color: C.gray },
  bookBtn: {
    backgroundColor: C.gold,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
  },
  bookBtnText: { color: C.white, fontWeight: "800", fontSize: 15 },
});
