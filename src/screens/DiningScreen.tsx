import { Text, View } from "react-native";

export default function DiningScreen() {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: "#111827",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text style={{ color: "white", fontSize: 28 }}>Dining Screen</Text>
    </View>
  );
}
