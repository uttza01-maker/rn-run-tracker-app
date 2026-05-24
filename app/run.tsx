import { supabase } from "@/services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useFocusEffect } from "expo-router";
import React, { useCallback, useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Run = {
  id: string;
  location: string;
  distance: number;
  time_of_day: string;
  run_date: string;
  image_url: string | null;
};

export default function RunScreen() {
  const [runs, setRuns] = useState<Run[]>([]);

  // ดึงข้อมูลใหม่ทุกครั้งที่กลับมาหน้านี้ (รองรับกรณีลบ/แก้ไขแล้วกลับมา)
  useFocusEffect(
    useCallback(() => {
      const fetchRuns = async () => {
        const { data, error } = await supabase
          .from("runs")
          .select("*")
          .order("run_date", { ascending: false });

        if (!error && data) {
          setRuns(data);
        }
      };

      fetchRuns();
    }, []),
  );

  const renderItem = ({ item }: { item: Run }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/${item.id}`)}
    >
      {/* รูปภาพด้านซ้าย */}
      {item.image_url ? (
        <Image
          source={{ uri: item.image_url }}
          style={styles.cardImage}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.cardImage, styles.cardImagePlaceholder]}>
          <Ionicons name="image-outline" size={28} color="#b6b6b6" />
        </View>
      )}

      {/* ข้อมูลด้านขวา */}
      <View style={styles.cardContent}>
        <Text style={styles.cardLocation} numberOfLines={1}>
          {item.location}
        </Text>
        <Text style={styles.cardDistance}>{item.distance} กม.</Text>
        <Text style={styles.cardMeta}>
          {item.time_of_day} · {item.run_date}
        </Text>
      </View>

      {/* ลูกศรชี้ขวา */}
      <Ionicons name="chevron-forward" size={20} color="#b6b6b6" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Ionicons name="walk" size={24} color="#fff" />
        <Text style={styles.headerTitle}>Run Tracker V.1.0.0</Text>
      </View>

      {/* รายการวิ่ง */}
      <FlatList
        data={runs}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="walk-outline" size={60} color="#ccc" />
            <Text style={styles.emptyText}>ยังไม่มีรายการวิ่ง</Text>
            <Text style={styles.emptySubText}>
              กดปุ่ม + เพื่อเพิ่มรายการแรก
            </Text>
          </View>
        }
      />

      {/* ปุ่ม + มุมขวาล่าง */}
      <TouchableOpacity style={styles.fab} onPress={() => router.push("/add")}>
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    backgroundColor: "#1889da",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Kanit_700Bold",
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: "row",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
    paddingRight: 12,
  },
  cardImage: {
    width: 90,
    height: 80,
  },
  cardImagePlaceholder: {
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  cardLocation: {
    fontFamily: "Kanit_700Bold",
    fontSize: 15,
    color: "#222",
    marginBottom: 3,
  },
  cardDistance: {
    fontFamily: "Kanit_700Bold",
    fontSize: 14,
    color: "#1889da",
    marginBottom: 3,
  },
  cardMeta: {
    fontFamily: "Kanit_400Regular",
    fontSize: 12,
    color: "#888",
  },
  fab: {
    position: "absolute",
    bottom: 30,
    right: 24,
    backgroundColor: "#1889da",
    width: 58,
    height: 58,
    borderRadius: 29,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
    elevation: 6,
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 80,
    gap: 8,
  },
  emptyText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 16,
    color: "#aaa",
  },
  emptySubText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 13,
    color: "#bbb",
  },
});
