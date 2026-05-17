import { supabase } from "@/services/supabase";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";
import { useFocusEffect } from "@react-navigation/native";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// 1️⃣ กำหนด Type สำหรับข้อมูลการวิ่งแต่ละรายการ
type RunItem = {
  id: number;
  location: string;
  distance: number;
  time_of_day: string;
  run_date: string;
  image_url: string;
};

export default function Run() {
  // 2️⃣ ประกาศ State สำหรับเก็บรายการข้อมูลการวิ่งและสถานะโหลด
  const [runs, setRuns] = React.useState<RunItem[]>([]);
  const [loading, setLoading] = React.useState(true);

  // 3️⃣ ฟังก์ชันดึงข้อมูลทั้งหมดจาก Supabase Table "runs"
  const fetchRuns = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("runs")
      .select("*")
      .order("run_date", { ascending: false }); // เรียงจากวันล่าสุดก่อน

    if (!error && data) {
      setRuns(data as RunItem[]);
    }
    setLoading(false);
  };

  // 4️⃣ ใช้ useFocusEffect เพื่อดึงข้อมูลใหม่ทุกครั้งที่หน้านี้ถูกโฟกัส
  //    ครอบคลุมทั้งตอนเปิดครั้งแรก และตอนกลับมาจากหน้า add.tsx
  useFocusEffect(
    React.useCallback(() => {
      fetchRuns();
    }, []),
  );

  // 5️⃣ ฟังก์ชัน Render การ์ดแต่ละรายการในรายการ FlatList
  const renderItem = ({ item }: { item: RunItem }) => (
    <View style={styles.card}>
      {/* รูปภาพสถานที่ */}
      <Image source={{ uri: item.image_url }} style={styles.cardImage} />

      {/* ข้อมูลการวิ่ง */}
      <View style={styles.cardContent}>
        <Text style={styles.locationText} numberOfLines={1}>
          {item.location}
        </Text>
        <Text style={styles.dateText}>
          {new Date(item.run_date).toLocaleDateString("th-TH", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </Text>
        <Text style={styles.timeOfDayText}>{item.time_of_day}</Text>
      </View>

      {/* ระยะทาง */}
      <View style={styles.distanceBadge}>
        <Text style={styles.distanceText}>{item.distance} km</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ส่วนแสดงรูป Logo */}
      <Image
        source={require("@/assets/images/man.png")}
        style={styles.runlogo}
      />

      {/* ส่วนแสดงรายการข้อมูลการวิ่ง */}
      {loading ? (
        <ActivityIndicator
          size="large"
          color="#1889da"
          style={{ marginTop: 40 }}
        />
      ) : (
        <FlatList
          data={runs}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>ยังไม่มีข้อมูลการวิ่ง</Text>
          }
        />
      )}

      {/* ปุ่มเปิดไปหน้าจอ /add */}
      <TouchableOpacity
        style={styles.addBtn}
        onPress={() => router.push("/add")}
      >
        <FontAwesome6 name="add" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  runlogo: {
    width: 125,
    height: 125,
    alignSelf: "center",
    marginTop: 30,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingBottom: 160, // เว้นพื้นที่ให้ปุ่ม + ด้านล่าง
    paddingTop: 10,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    borderRadius: 12,
    marginBottom: 12,
    overflow: "hidden",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  cardImage: {
    width: 90,
    height: 80,
    resizeMode: "cover",
  },
  cardContent: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  locationText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 15,
    color: "#222",
  },
  dateText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 12,
    color: "#888",
    marginTop: 2,
  },
  timeOfDayText: {
    fontFamily: "Kanit_400Regular",
    fontSize: 12,
    color: "#1889da",
    marginTop: 2,
  },
  distanceBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 10,
    backgroundColor: "#e8f4fd",
    borderRadius: 8,
  },
  distanceText: {
    fontFamily: "Kanit_700Bold",
    fontSize: 13,
    color: "#1889da",
  },
  emptyText: {
    textAlign: "center",
    fontFamily: "Kanit_400Regular",
    color: "#aaa",
    marginTop: 40,
    fontSize: 15,
  },
  addBtn: {
    position: "absolute",
    bottom: 80,
    right: 50,
    width: 60,
    height: 60,
    backgroundColor: "#1619ec",
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
});
