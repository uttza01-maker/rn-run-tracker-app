import { supabase } from "@/services/supabase";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { router } from "expo-router";
import React from "react";
import {
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function Addtmp() {
  // 1️⃣ ส่วนการประกาศ State สำหรับจัดการข้อมูลในฟอร์ม (สถานที่, ระยะทาง, ช่วงเวลา, รูปภาพ)
  const [location, setLocation] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState("เช้า");
  const [imageUri, setImageUri] = React.useState<string | null>(null); // สำหรับใช้แสดงรูปพรีวิวบน UI
  const [base64Image, setBase64Image] = React.useState<string | null>(null); // สำหรับใช้ส่งไฟล์อัปโหลดไป Supabase

  // 2️⃣ ฟังก์ชันสำหรับการเปิดกล้องถ่ายภาพ (Camera Integration)
  const takePhoto = async () => {
    // 🔒 ขั้นตอนที่ 2.1: ขออนุญาตเข้าถึงกล้องถ่ายรูปของอุปกรณ์
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("ขออนุญาตเข้าถึงกล้องเพื่อถ่ายภาพหน่อยนะคร๊าบบบบบ");
      return;
    }

    // 📸 ขั้นตอนที่ 2.2: เปิดระบบกล้องถ่ายภาพพร้อมตั้งค่า Object Properties
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true, // เปิดโหมดให้ผู้ใช้ตัดครอปรูปภาพได้
      aspect: [4, 3], // กำหนดสัดส่วนภาพถ่ายเป็น 4:3
      quality: 0.5, // บีบอัดคุณภาพรูปภาพลง 50% เพื่อประหยัดพื้นที่ Storage
      base64: true, // เปิดโหมดแปลงไฟล์ภาพเป็น String Base64 สำหรับอัปโหลด
    });

    // 💾 ขั้นตอนที่ 2.3: เมื่อถ่ายเสร็จและกดยืนยัน ให้นำค่าไปเก็บลง State ที่เตรียมไว้
    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
      setBase64Image(result.assets[0].base64 || null);
    }
  };

  // 3️⃣ ฟังก์ชันการอัปโหลดไฟล์รูปภาพ และบันทึกข้อมูลทั้งหมดลงฐานข้อมูล Supabase
  const uploadData = async () => {
    // 🔍 ขั้นตอนที่ 3.1: ตรวจสอบความถูกต้องของข้อมูล (UI Validation)
    if (!location || !distance || !base64Image) {
      Alert.alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return;
    }

    // ⬆️ ขั้นตอนที่ 3.2: อัปโหลดรูปภาพไปยัง Supabase Storage
    const fileName = `run_${Date.now()}.jpg`; // สร้างชื่อไฟล์แบบ Dynamic ป้องกันชื่อซ้ำกัน

    const imageResponse = await fetch(`data:image/jpeg;base64,${base64Image}`);
    const imageBlob = await imageResponse.blob();

    const { error: uploadError } = await supabase.storage
      .from("run_bk") // ระบุชื่อ Bucket ที่สร้างไว้บนระบบ Cloud
      .upload(fileName, imageBlob, {
        contentType: "image/jpeg",
      });

    // 🚨 ขั้นตอนที่ 3.3: ตรวจสอบผลลัพธ์การอัปโหลดรูปภาพ
    if (uploadError) {
      Alert.alert("เกิดข้อผิดพลาดในการอัปโหลดรูปภาพ: " + uploadError.message);
      return;
    }

    // 🌐 ขั้นตอนที่ 3.4: ดึง URL สาธารณะ (Public URL) ของรูปภาพที่อัปโหลดสำเร็จมาใช้งาน
    const { data: publicUrlData } = supabase.storage
      .from("run_bk")
      .getPublicUrl(fileName);

    if (!publicUrlData?.publicUrl) {
      Alert.alert("เกิดข้อผิดพลาดในการดึง URL รูปภาพ");
      return;
    }

    const image_url = publicUrlData.publicUrl;

    // 📥 ขั้นตอนที่ 3.5: บันทึกข้อมูลเท็กซ์ฟิลด์ทั้งหมดพร้อมลิงก์รูปภาพลง Supabase Database Table
    const { error: insertError } = await supabase.from("runs").insert({
      location: location,
      distance: parseFloat(distance), // แปลงค่า String จาก TextInput ให้กลายเป็นตัวเลขทศนิยม (Float)
      time_of_day: timeOfDay,
      run_date: new Date().toISOString().split("T")[0], // ดึงเฉพาะวันที่ปัจจุบันในรูปแบบ YYYY-MM-DD
      image_url: image_url,
    });

    // 📢 ขั้นตอนที่ 3.6: ตรวจสอบความผิดพลาดในการบันทึกข้อมูลเข้า Table และสรุปผล
    if (insertError) {
      Alert.alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล: " + insertError.message);
      return;
    }

    // 🎉 หากสำเร็จทุกขั้นตอน แสดงกล่องข้อความเตือนและเด้งกลับหน้าหลัก
    Alert.alert("บันทึกข้อมูลสำเร็จ");
    router.back();
  }; // ปิดบล็อกฟังก์ชัน uploadData อย่างสมบูรณ์

  // 4️⃣ ส่วนของการ Render หน้าตาแอปพลิเคชัน (User Interface Layout)
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>เพิ่มสถานที่วิ่ง</Text>
      </View>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ padding: 20 }}>
        <View style={styles.card}>
          {/* Input: สถานที่วิ่ง */}
          <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
          <TextInput
            value={location}
            onChangeText={setLocation}
            placeholder="เช่น สวนลุมพินี"
            style={styles.inputValue}
          />

          {/* Input: ระยะทาง */}
          <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
          <TextInput
            value={distance}
            onChangeText={setDistance}
            placeholder="เช่น 5.2"
            keyboardType="numeric" // แสดงแผงคีย์บอร์ดเฉพาะตัวเลขและจุดทศนิยม
            style={styles.inputValue}
          />

          {/* Picker: เลือกช่วงเวลาวิ่ง */}
          <Text style={styles.titleShow}>ช่วงเวลา</Text>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <TouchableOpacity
              style={[
                styles.todBtn,
                {
                  backgroundColor: timeOfDay === "เช้า" ? "#1889da" : "#e6e6e6",
                },
              ]}
              onPress={() => setTimeOfDay("เช้า")}
            >
              <Text
                style={{ fontFamily: "Kanit_400Regular", color: "#4d4d4d" }}
              >
                เช้า
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.todBtn,
                {
                  backgroundColor: timeOfDay === "เย็น" ? "#1889da" : "#e6e6e6",
                },
              ]}
              onPress={() => setTimeOfDay("เย็น")}
            >
              <Text
                style={{ fontFamily: "Kanit_400Regular", color: "#4d4d4d" }}
              >
                เย็น
              </Text>
            </TouchableOpacity>
          </View>

          {/* กล่องเปิดกล้องเพื่อเลือกถ่ายภาพ */}
          <Text style={styles.titleShow}>รูปภาพสถานที่</Text>
          <TouchableOpacity style={styles.takePhotoBtn} onPress={takePhoto}>
            {imageUri ? (
              <Image
                source={{ uri: imageUri }}
                style={{ width: "100%", height: 200 }}
              />
            ) : (
              <View style={{ alignItems: "center" }}>
                <Ionicons name="camera-outline" size={30} color="#b6b6b6" />
                <Text
                  style={{ fontFamily: "Kanit_400Regular", color: "#b6b6b6" }}
                >
                  กดเพื่อถ่ายภาพ
                </Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        {/* ปุ่ม Submit บันทึกข้อมูลทั้งหมด */}
        <TouchableOpacity style={styles.saveBtn} onPress={uploadData}>
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#fff" }}>
            บันทึกข้อมูล
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

// 5️⃣ ส่วนการออกแบบรูปแบบความสวยงาม (StyleSheet CSS)
const styles = StyleSheet.create({
  todBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  saveBtn: {
    padding: 15,
    backgroundColor: "#1889da",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  takePhotoBtn: {
    width: "100%",
    height: 200,
    backgroundColor: "#e6e6e6",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  inputValue: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 15,
    marginBottom: 20,
    fontFamily: "Kanit_400Regular",
    backgroundColor: "#EFEFEF",
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
  },
  header: {
    backgroundColor: "#1889da",
    paddingTop: 40,
    paddingBottom: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    color: "#fff",
    fontFamily: "Kanit_700Bold",
    fontSize: 18,
  },
  backBtn: {
    position: "absolute",
    left: 16,
    top: 44,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
});
