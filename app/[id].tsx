import { supabase } from "@/services/supabase";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function RunDetail() {
  const { id } = useLocalSearchParams();

  const [location, setLocation] = React.useState("");
  const [distance, setDistance] = React.useState("");
  const [timeOfDay, setTimeOfDay] = React.useState("เช้า");
  const [imageUri, setImageUri] = React.useState<string | null>(null);

  useEffect(() => {
    const fetchRunDetail = async () => {
      const { data, error } = await supabase
        .from("runs")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        Alert.alert("คำเตือน", "ไม่สามารถดึงข้อมูลได้ กรุณาลองใหม่");
        return;
      }

      if (data) {
        setLocation(data.location || "");
        setDistance(data.distance !== null ? data.distance.toString() : "");
        setTimeOfDay(data.time_of_day || "เช้า");
        setImageUri(data.image_url || null);
      }
    };

    fetchRunDetail();
  }, [id]);

  const handleUpdate = async () => {
    if (!location || !distance) {
      Alert.alert("กรุณากรอกข้อมูลสถานที่และระยะทางให้ครบถ้วน");
      return;
    }

    const { error: updateError } = await supabase
      .from("runs")
      .update({
        location,
        distance: parseFloat(distance),
        time_of_day: timeOfDay,
      })
      .eq("id", id);

    if (updateError) {
      Alert.alert("เกิดข้อผิดพลาด: " + updateError.message);
      return;
    }

    Alert.alert("สำเร็จ", "บันทึกการแก้ไขเรียบร้อยแล้ว", [
      { text: "ตกลง", onPress: () => router.back() },
    ]);
  };

  const handleDelete = () => {
    Alert.alert("ยืนยันการลบ", "คุณต้องการลบรายการวิ่งนี้ใช่หรือไม่?", [
      { text: "ยกเลิก", style: "cancel" },
      {
        text: "ลบรายการ",
        style: "destructive",
        onPress: async () => {
          const { error: deleteError } = await supabase
            .from("runs")
            .delete()
            .eq("id", id);

          if (deleteError) {
            Alert.alert("ไม่สามารถลบข้อมูลได้: " + deleteError.message);
            return;
          }

          Alert.alert("สำเร็จ", "ลบรายการวิ่งเรียบร้อยแล้ว", [
            { text: "ตกลง", onPress: () => router.back() },
          ]);
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="chevron-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>รายละเอียดการวิ่ง</Text>
      </View>

      {/* รูปภาพ */}
      {imageUri ? (
        <Image
          source={{ uri: imageUri }}
          style={styles.imgRun}
          resizeMode="cover"
        />
      ) : (
        <View style={[styles.imgRun, styles.imgPlaceholder]}>
          <Ionicons name="image-outline" size={48} color="#b6b6b6" />
        </View>
      )}

      {/* ฟอร์ม */}
      <View style={styles.detailContainer}>
        <Text style={styles.titleShow}>สถานที่วิ่ง</Text>
        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="เช่น สวนลุมพินี"
          style={styles.inputValue}
        />

        <Text style={styles.titleShow}>ระยะทาง (กิโลเมตร)</Text>
        <TextInput
          value={distance}
          onChangeText={setDistance}
          placeholder="เช่น 5.2"
          keyboardType="numeric"
          style={styles.inputValue}
        />

        <Text style={styles.titleShow}>ช่วงเวลา</Text>
        <View style={{ flexDirection: "row", marginBottom: 20 }}>
          {["เช้า", "เย็น"].map((t) => (
            <TouchableOpacity
              key={t}
              style={[
                styles.todBtn,
                { backgroundColor: timeOfDay === t ? "#1889da" : "#e6e6e6" },
              ]}
              onPress={() => setTimeOfDay(t)}
            >
              <Text
                style={{
                  fontFamily: "Kanit_400Regular",
                  color: timeOfDay === t ? "#fff" : "#4d4d4d",
                }}
              >
                {t}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.saveBtn} onPress={handleUpdate}>
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#fff" }}>
            บันทึกการแก้ไข
          </Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteBtn} onPress={handleDelete}>
          <Ionicons
            name="trash-bin-sharp"
            size={20}
            color="#ee0707"
            style={{ marginRight: 6 }}
          />
          <Text style={{ fontFamily: "Kanit_700Bold", color: "#ee0707" }}>
            ลบรายการนี้
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  header: {
    backgroundColor: "#1889da",
    paddingTop: 50,
    paddingBottom: 16,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
  },
  backBtn: { marginRight: 10 },
  headerTitle: {
    color: "#fff",
    fontSize: 18,
    fontFamily: "Kanit_700Bold",
  },
  imgRun: { width: "100%", height: 250 },
  imgPlaceholder: {
    backgroundColor: "#e6e6e6",
    justifyContent: "center",
    alignItems: "center",
  },
  detailContainer: {
    backgroundColor: "#fff",
    marginTop: -30,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  titleShow: {
    fontFamily: "Kanit_700Bold",
    marginBottom: 10,
    color: "#333",
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
  todBtn: {
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  saveBtn: {
    backgroundColor: "#1889da",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  deleteBtn: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 25,
    paddingBottom: 30,
  },
});
