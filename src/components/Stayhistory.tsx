import { FontAwesome5, Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
    ActivityIndicator,
    Modal,
    Text,
    TouchableOpacity,
    View
} from "react-native";
import { supabase } from "../lib/supabase";

const G = "#14532D";
const GOLD = "#C89B3C";
const GRAY = "#64748B";
const BORDER = "#E2E8F0";
const BG = "#F8FAFC";
const DARK = "#0F172A";

interface CheckInRecord {
  id: string;
  guest_id: string;
  checked_in_at: string;
  points_awarded: number;
  action: string;
  staff_note: string | null;
  room_number: string | null;
  room_type: string | null;
}

interface Stay {
  checkIn: CheckInRecord;
  checkOut: CheckInRecord | null;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleDateString("en-PH", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function getNights(checkIn: string, checkOut: string | null) {
  if (!checkOut) return null;
  const diff = new Date(checkOut).getTime() - new Date(checkIn).getTime();
  return Math.max(1, Math.round(diff / (1000 * 60 * 60 * 24)));
}

// ─── Detail Modal ──────────────────────────────────────────────────────────────
function StayDetailModal({
  stay,
  visible,
  onClose,
}: {
  stay: Stay | null;
  visible: boolean;
  onClose: () => void;
}) {
  if (!stay) return null;
  const nights = getNights(
    stay.checkIn.checked_in_at,
    stay.checkOut?.checked_in_at ?? null,
  );
  const totalPoints =
    (stay.checkIn.points_awarded ?? 0) + (stay.checkOut?.points_awarded ?? 0);

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
          {/* Handle */}
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

          {/* Header */}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 12,
              marginBottom: 20,
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor: "#F0FDF4",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <FontAwesome5 name="bed" size={20} color={G} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: "900", color: DARK }}>
                {stay.checkIn.room_type || "VS Hotel"}
              </Text>
              {stay.checkIn.room_number && (
                <Text style={{ color: GRAY, fontSize: 13, marginTop: 2 }}>
                  Room {stay.checkIn.room_number}
                </Text>
              )}
            </View>
            {stay.checkOut ? (
              <View
                style={{
                  backgroundColor: "#F0FDF4",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: "#86EFAC",
                }}
              >
                <Text style={{ color: G, fontWeight: "700", fontSize: 12 }}>
                  Completed
                </Text>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: "#FEF3C7",
                  borderRadius: 12,
                  paddingHorizontal: 10,
                  paddingVertical: 4,
                  borderWidth: 1,
                  borderColor: "#FDE68A",
                }}
              >
                <Text
                  style={{ color: "#B45309", fontWeight: "700", fontSize: 12 }}
                >
                  Active
                </Text>
              </View>
            )}
          </View>

          {/* Details */}
          <View
            style={{
              backgroundColor: BG,
              borderRadius: 16,
              padding: 16,
              gap: 12,
              marginBottom: 16,
              borderWidth: 1,
              borderColor: BORDER,
            }}
          >
            <Row
              icon="sign-in-alt"
              label="Check-In"
              value={formatDateTime(stay.checkIn.checked_in_at)}
            />
            <Divider />
            <Row
              icon="sign-out-alt"
              label="Check-Out"
              value={
                stay.checkOut
                  ? formatDateTime(stay.checkOut.checked_in_at)
                  : "Still checked in"
              }
              valueColor={stay.checkOut ? DARK : GOLD}
            />
            {nights && (
              <>
                <Divider />
                <Row
                  icon="moon"
                  label="Nights"
                  value={`${nights} night${nights > 1 ? "s" : ""}`}
                />
              </>
            )}
            {totalPoints > 0 && (
              <>
                <Divider />
                <Row
                  icon="star"
                  label="Points Earned"
                  value={`+${totalPoints} VS Points`}
                  valueColor={G}
                />
              </>
            )}
            {stay.checkIn.staff_note && (
              <>
                <Divider />
                <Row
                  icon="sticky-note"
                  label="Staff Note"
                  value={stay.checkIn.staff_note}
                />
              </>
            )}
          </View>

          <TouchableOpacity
            onPress={onClose}
            style={{
              backgroundColor: G,
              borderRadius: 30,
              paddingVertical: 14,
              alignItems: "center",
            }}
          >
            <Text style={{ color: "#fff", fontWeight: "800", fontSize: 15 }}>
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

function Row({
  icon,
  label,
  value,
  valueColor = DARK,
}: {
  icon: string;
  label: string;
  value: string;
  valueColor?: string;
}) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
      <FontAwesome5
        name={icon as any}
        size={13}
        color={GRAY}
        style={{ width: 16 }}
      />
      <Text style={{ color: GRAY, fontSize: 13, flex: 1 }}>{label}</Text>
      <Text
        style={{
          color: valueColor,
          fontSize: 13,
          fontWeight: "600",
          flexShrink: 1,
          textAlign: "right",
        }}
      >
        {value}
      </Text>
    </View>
  );
}

function Divider() {
  return <View style={{ height: 1, backgroundColor: BORDER }} />;
}

// ─── Stay Card ─────────────────────────────────────────────────────────────────
function StayCard({ stay, onPress }: { stay: Stay; onPress: () => void }) {
  const isActive = !stay.checkOut;
  const nights = getNights(
    stay.checkIn.checked_in_at,
    stay.checkOut?.checked_in_at ?? null,
  );
  const totalPoints =
    (stay.checkIn.points_awarded ?? 0) + (stay.checkOut?.points_awarded ?? 0);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={0.8}
      style={{
        backgroundColor: "#fff",
        borderRadius: 16,
        padding: 16,
        borderWidth: isActive ? 2 : 1,
        borderColor: isActive ? G : BORDER,
        gap: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOpacity: 0.06,
        shadowRadius: 6,
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: isActive ? "#F0FDF4" : BG,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FontAwesome5 name="bed" size={16} color={isActive ? G : GRAY} />
          </View>
          <View>
            <Text style={{ fontWeight: "800", color: DARK, fontSize: 15 }}>
              {stay.checkIn.room_type || "VS Hotel Stay"}
            </Text>
            {stay.checkIn.room_number && (
              <Text style={{ color: GRAY, fontSize: 12, marginTop: 1 }}>
                Room {stay.checkIn.room_number}
              </Text>
            )}
          </View>
        </View>

        {isActive ? (
          <View
            style={{
              backgroundColor: "#F0FDF4",
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: "#86EFAC",
            }}
          >
            <Text style={{ color: G, fontWeight: "700", fontSize: 11 }}>
              ● Active
            </Text>
          </View>
        ) : (
          <View
            style={{
              backgroundColor: BG,
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderWidth: 1,
              borderColor: BORDER,
            }}
          >
            <Text style={{ color: GRAY, fontWeight: "600", fontSize: 11 }}>
              Completed
            </Text>
          </View>
        )}
      </View>

      {/* Date row */}
      <View
        style={{
          flexDirection: "row",
          gap: 16,
          backgroundColor: BG,
          borderRadius: 10,
          padding: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: GRAY,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            CHECK-IN
          </Text>
          <Text
            style={{
              color: DARK,
              fontSize: 13,
              fontWeight: "600",
              marginTop: 2,
            }}
          >
            {formatDate(stay.checkIn.checked_in_at)}
          </Text>
        </View>
        <View
          style={{
            width: 1,
            backgroundColor: BORDER,
            marginVertical: 2,
          }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: GRAY,
              fontSize: 10,
              fontWeight: "700",
              letterSpacing: 0.5,
            }}
          >
            CHECK-OUT
          </Text>
          <Text
            style={{
              color: stay.checkOut ? DARK : GOLD,
              fontSize: 13,
              fontWeight: "600",
              marginTop: 2,
            }}
          >
            {stay.checkOut
              ? formatDate(stay.checkOut.checked_in_at)
              : "Still here 👋"}
          </Text>
        </View>
        {nights && (
          <>
            <View
              style={{ width: 1, backgroundColor: BORDER, marginVertical: 2 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: GRAY,
                  fontSize: 10,
                  fontWeight: "700",
                  letterSpacing: 0.5,
                }}
              >
                NIGHTS
              </Text>
              <Text
                style={{
                  color: DARK,
                  fontSize: 13,
                  fontWeight: "600",
                  marginTop: 2,
                }}
              >
                {nights}
              </Text>
            </View>
          </>
        )}
      </View>

      {/* Points + chevron */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {totalPoints > 0 ? (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              backgroundColor: "#F0FDF4",
              borderRadius: 10,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}
          >
            <FontAwesome5 name="star" size={11} color={G} solid />
            <Text style={{ color: G, fontWeight: "700", fontSize: 12 }}>
              +{totalPoints} VS Points earned
            </Text>
          </View>
        ) : (
          <View />
        )}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <Text style={{ color: GRAY, fontSize: 12 }}>Details</Text>
          <Ionicons name="chevron-forward" size={14} color={GRAY} />
        </View>
      </View>
    </TouchableOpacity>
  );
}

// ─── Main Component ────────────────────────────────────────────────────────────
export default function StayHistory({ userId }: { userId: string }) {
  const [stays, setStays] = useState<Stay[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStay, setSelectedStay] = useState<Stay | null>(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchStays();

    // Real-time subscription
    const channel = supabase
      .channel(`stay_history:${userId}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "check_ins",
          filter: `guest_id=eq.${userId}`,
        },
        () => {
          fetchStays();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  async function fetchStays() {
    try {
      const { data, error } = await supabase
        .from("check_ins")
        .select("*")
        .eq("guest_id", userId)
        .order("checked_in_at", { ascending: false });

      if (error) throw error;
      if (!data) return;

      // Pair check-ins with their check-outs
      const checkIns = data.filter((r) => r.action === "Check-In");
      const checkOuts = data.filter((r) => r.action === "Check-Out");

      const paired: Stay[] = checkIns.map((ci) => {
        // Find the closest check-out after this check-in
        const matchingOut =
          checkOuts
            .filter(
              (co) => new Date(co.checked_in_at) > new Date(ci.checked_in_at),
            )
            .sort(
              (a, b) =>
                new Date(a.checked_in_at).getTime() -
                new Date(b.checked_in_at).getTime(),
            )[0] ?? null;

        return { checkIn: ci, checkOut: matchingOut };
      });

      setStays(paired);
    } catch (err) {
      console.log("StayHistory fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <ActivityIndicator color={G} style={{ marginTop: 40 }} />;
  }

  if (stays.length === 0) {
    return (
      <View
        style={{
          backgroundColor: "#fff",
          borderRadius: 16,
          padding: 40,
          alignItems: "center",
          gap: 12,
          borderWidth: 1,
          borderColor: BORDER,
        }}
      >
        <FontAwesome5 name="bed" size={40} color="#CBD5E1" />
        <Text
          style={{
            color: GRAY,
            fontSize: 15,
            fontWeight: "600",
            textAlign: "center",
          }}
        >
          No stays yet
        </Text>
        <Text style={{ color: "#94A3B8", fontSize: 13, textAlign: "center" }}>
          Your stay history will appear here after your first check-in.
        </Text>
      </View>
    );
  }

  return (
    <View style={{ gap: 12 }}>
      <Text style={{ color: GRAY, fontSize: 13, marginBottom: 4 }}>
        {stays.length} stay{stays.length !== 1 ? "s" : ""} on record
      </Text>
      {stays.map((stay, i) => (
        <StayCard
          key={stay.checkIn.id}
          stay={stay}
          onPress={() => {
            setSelectedStay(stay);
            setShowModal(true);
          }}
        />
      ))}

      <StayDetailModal
        stay={selectedStay}
        visible={showModal}
        onClose={() => {
          setShowModal(false);
          setSelectedStay(null);
        }}
      />
    </View>
  );
}
