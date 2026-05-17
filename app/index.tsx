import { useRouter } from "expo-router";
import React, { useEffect } from "react";
// เพิ่ม Text เข้าไปในคอมโพเนนต์ที่ดึงมาจาก react-native
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

export default function index() {
  // --- เพิ่มบรรทัดนี้เข้าไปเพื่อให้โค้ดเดิมเรียกใช้งาน router ได้อย่างถูกต้อง ---
  const router = useRouter();
  // ------------------------------------------------------------------

  // หน่วงเวลา 3 วินาทีแล้วเปิดไป /run แบบย้อนกลับไม่ได้
  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/run");
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // .................................................
  return (
    <View style={styles.container}>
      <Image
        source={require("@/assets/images/man.png")}
        style={styles.runlogo}
      />
      <Text style={styles.runtitle1}>Run Tracker</Text>
      <Text style={styles.runtitle2}>วิ่งเพื่อสุขภาพ</Text>
      <ActivityIndicator
        size="large"
        color="#1619ec"
        style={{ marginTop: 20 }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  // --- โค้ดเดิมของคุณ (ห้ามเปลี่ยน) ---
  runtitle2: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
    fontFamily: "Kanit_400Regular",
  },
  runtitle1: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Kanit_700Bold",
  },
  runlogo: {
    width: 200,
    height: 200,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // ---------------------------------

  // เพิ่มสไตล์ที่ JSX เรียกหา เพื่อไม่ให้โค้ดพังและดึงสไตล์เดิมมาผูกให้ถูกต้อง
  runtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Kanit_700Bold", // ดึงฟอนต์หนาตามเจตนาของ runtitle1
  },
});
