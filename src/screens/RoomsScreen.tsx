import { useFocusEffect } from "expo-router";
import React, { useCallback, useRef, useState } from "react";
import { FlatList, Linking, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RoomCard } from "../components/RoomCard";
import RoomDetailModal from "../components/RoomDetailModal";
import { Room, ROOMS } from "../constants/rooms";

export const RoomsScreen = () => {
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  useFocusEffect(
    useCallback(() => {
      flatListRef.current?.scrollToOffset({ offset: 0, animated: false });
    }, []),
  );

  function handleRoomPress(room: Room) {
    setSelectedRoom(room);
    setModalVisible(true);
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F8FAFC" }}>
      <View style={{ padding: 20, paddingBottom: 10 }}>
        <Text style={{ fontSize: 32, fontWeight: "800", color: "#14532D" }}>
          Our Rooms
        </Text>
        <Text style={{ fontSize: 16, color: "#64748B", marginTop: 4 }}>
          Choose your perfect stay
        </Text>
      </View>

      <FlatList
        ref={flatListRef}
        data={ROOMS}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <RoomCard room={item} onPress={() => handleRoomPress(item)} />
        )}
        contentContainerStyle={{ padding: 20, paddingTop: 10 }}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={
          <TouchableOpacity
            onPress={() =>
              Linking.openURL(
                "https://www.swiftbook.io/inst/#home?propertyId=363MjIpd9DKOxXNT5Koe1JFI0MzQ=&JDRN=Y",
              ).catch(() => {})
            }
            style={{
              backgroundColor: "#C89B3C",
              paddingVertical: 14,
              paddingHorizontal: 35,
              borderRadius: 30,
              alignSelf: "center",
              marginTop: 10,
              marginBottom: 30,
            }}
          >
            <Text style={{ color: "white", fontWeight: "bold", fontSize: 16 }}>
              BOOK NOW
            </Text>
          </TouchableOpacity>
        }
      />

      <RoomDetailModal
        room={selectedRoom}
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
};
