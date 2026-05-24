# 🏃‍♂️ Run Tracker App (แอปพลิเคชันบันทึกกิจกรรมการวิ่งเพื่อสุขภาพ)

แอปพลิเคชันบนมือถือสําหรับบันทึกและติดตามกิจกรรมการวิ่ง พัฒนาขึ้นด้วย **React Native (Expo Router)** ร่วมกับระบบฐานข้อมูล **Supabase (Database & Storage)** เพื่อช่วยผู้ใช้งานจัดเก็บข้อมูลสถานที่ ระยะทาง ช่วงเวลา พร้อมแนบรูปถ่ายจากกล้องจริงขึ้นสู่ระบบ Cloud ได้แบบ Real-time

---

## 📱 หน้าจอและการทำงานของแอปพลิเคชัน (Application Features)

### 1. หน้าจอ Splash Screen (`app/index.tsx`)
* แสดงโลโก้ออนบอร์ดดิ้งอนิเมชันต้อนรับผู้ใช้งาน พร้อมล้อหมุนโหลดฟอนต์ระบบ (`Kanit`) 
* ระบบหน่วงเวลาอัตโนมัติ 3 วินาที (Splash Timeout) ก่อนดึงหน้าหลักขึ้นมาแสดงผลทดแทน
<br>
<img src="https://github.com/user-attachments/assets/86d924d8-25e3-4252-b904-2f0331f167a3" width="280" alt="Splash Screen" />

---

### 2. หน้าจอหลักรายการวิ่ง (`app/run.tsx`)
* ดึงรายการประวัติการวิ่งทั้งหมดจาก Supabase มาแสดงผลในรูปแบบ List Card สวยงาม
* แสดงข้อมูลสถานที่ รูปภาพสแนปช็อต และมีปุ่มลอย (Floating Action Button) สำหรับกดไปหน้าเพิ่มกิจกรรมใหม่
<br>
<img src="https://github.com/user-attachments/assets/b0610bcb-26e4-4d8c-b3a1-4023a9773616" width="280" alt="Run List Screen" />

---

### 3. หน้าจอรายละเอียดและแก้ไข (`app/[id].tsx`)
* **Read:** แสดงรายละเอียดเชิงลึกของรายการวิ่งนั้นๆ พร้อมภาพถ่ายสถานที่จริงแบบ Dynamic
* **Update:** ฟอร์มรับข้อมูลแก้ไขชื่อสถานที่, ปรับเปลี่ยนระยะทาง และเลือกช่วงเวลาวิ่ง (เช้า/เย็น)
* **Delete:** ปุ่มถังขยะยิงคำสั่งลบข้อมูล (Delete) ออกจาก Supabase Database พร้อมระบบ Alert ยืนยันความปลอดภัยก่อนลบ
<br>
<img src="https://github.com/user-attachments/assets/fcb7eadf-a902-4954-b3d9-6755acd4bda7" width="280" alt="Run Detail & Edit Screen" />

---

### 4. หน้าจอเพิ่มสถานที่วิ่งใหม่ (`app/add.tsx`)
* **Camera Integration:** เชื่อมต่อระบบสิทธิ์ฮาร์ดแวร์เพื่อเปิดกล้องถ่ายภาพ (ใช้คลัง `expo-image-picker`)
* **Image Upload:** บีบอัดรูปภาพและแปลงเป็นไฟล์เพื่ออัปโหลดขึ้นไปเก็บที่ **Supabase Storage Bucket** (`run_bk`)
* **Data Insertion:** นำ Public URL รูปภาพ และรายละเอียดฟอร์มบันทึกลงตารางฐานข้อมูล
<br>
<img src="https://github.com/user-attachments/assets/747fd92a-0cd0-4931-a072-75343bd6fc4a" width="280" alt="Add Run Screen" />

---

## 🛠️ เทคโนโลยีที่เลือกใช้ (Tech Stack)

* **Frontend Framework:** React Native (Expo SDK 51+)
* **Navigation:** Expo Router (File-based Routing)
* **Backend as a Service (BaaS):** Supabase
    * **Supabase Database:** สำหรับเก็บตารางข้อมูลกิจกรรม (`runs`)
    * **Supabase Storage:** สำหรับเก็บไฟล์รูปภาพสถานที่วิ่ง (`run_bk` Bucket)
* **UI Components:** React Native ขุมพลังภายใน และไอคอนกราฟิกจาก `@expo/vector-icons (Ionicons)`
* **Typography:** Google Fonts (`Kanit_400Regular`, `Kanit_700Bold`) ผ่านระบบ `expo-font`

---

## 🚀 วิธีการติดตั้งเพื่อนำไปรันบนเครื่องคอมพิวเตอร์ของคุณ (Installation Guide)

### 1. คัดลอกคลังซอร์สโค้ด (Git Clone)
เปิดระบบ Terminal ของคุณแล้วพิมพ์คำสั่งดึงโปรเจกต์ลงมาในเครื่องคอมพิวเตอร์:
```bash
git clone [https://github.com/uttza01-maker/rn-run-tracker-app.git](https://github.com/uttza01-maker/rn-run-tracker-app.git)
