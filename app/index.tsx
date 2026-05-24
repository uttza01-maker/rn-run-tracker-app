import { useRouter } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Image, StyleSheet, Text, View } from "react-native";

// 🌟 1. นำเข้าไลบรารีสำหรับโหลดฟอนต์ Kanit ของ Google เข้ามาเพิ่มในหน้านี้
import {
  Kanit_400Regular,
  Kanit_700Bold,
  useFonts,
} from "@expo-google-fonts/kanit";

export default function Index() {
  const router = useRouter();

  // 🌟 2. สั่งดาวน์โหลดฟอนต์เข้ามาในหน่วยความจำของมือถือ
  const [fontsLoaded, fontError] = useFonts({
    Kanit_400Regular,
    Kanit_700Bold,
  });

  // หน่วงเวลา 3 วินาทีแล้วเปิดไป /run แบบย้อนกลับไม่ได้
  useEffect(() => {
    // ⚠️ ตัวบล็อกระบบ: ตราบใดที่ฟอนต์ยังมาไม่ครบ และไม่มี Error แจ้งเตือน ให้เบรกระบบรอไว้ก่อน
    if (!fontsLoaded && !fontError) return;

    const timer = setTimeout(() => {
      router.replace("/run");
    }, 3000);

    return () => clearTimeout(timer);
  }, [router, fontsLoaded, fontError]); // ใส่ตัวแปรเฝ้าดูความพร้อมของระบบให้ครบ

  // 🌟 3. ตัวเซฟตี้กันแอปค้างหน้าขาว: ถ้าฟอนต์ยังโหลดไม่เสร็จ ให้หมุน ActivityIndicator รอก่อน
  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#1619ec" />
      </View>
    );
  }

  // 4. แสดงหน้าจอ Splash Layout สวยงามตามดีไซน์ของพี่เมื่อทุกอย่างพร้อมรัน
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
    backgroundColor: "#ffffff", // บังคับพื้นหลังสีขาวนวลสะอาดตา
  },
  // ---------------------------------

  runtitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    fontFamily: "Kanit_700Bold",
  },
});
