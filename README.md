# React Buffet Calculator

เว็บคำนวณค่าอาหารบุฟเฟต์ สร้างด้วย React + Vite

## เงื่อนไขการคำนวณ
- ผู้ใหญ่ 299 บาท/คน
- เด็ก 89 บาท/คน
- น้ำรีฟิล 29 บาท/คน (คิดทั้งผู้ใหญ่และเด็ก)
- น้ำเปล่าขวดละ 10 บาท
- น้ำอัดลมขวดละ 25 บาท
- ส่วนลด 0%, 10%, 15%, 20% คิดจากค่าอาหารเท่านั้น ไม่รวมเครื่องดื่ม
- เมื่อเลือกน้ำรีฟิล ช่องจำนวนขวดจะถูกปิดใช้งาน
- จำนวนคนและจำนวนขวดต้องเป็นจำนวนเต็มตั้งแต่ 0 ขึ้นไป และต้องมีผู้ใช้บริการอย่างน้อย 1 คน

## วิธีเปิดใช้งานบนเครื่อง
ต้องติดตั้ง Node.js เวอร์ชัน LTS ก่อน

```bash
npm install
npm run dev
```

เปิด URL ที่ Vite แสดงใน Terminal (โดยทั่วไปคือ http://localhost:5173)

## ทดสอบก่อนส่ง
```bash
npm run build
```
ถ้าสร้างโฟลเดอร์ `dist` สำเร็จ แสดงว่า build ผ่าน

## ส่ง GitHub
1. สร้าง Repository ใหม่บน GitHub ชื่อ `react_buffet_app`
2. แตกไฟล์ ZIP นี้ แล้วเปิด Terminal ในโฟลเดอร์โปรเจกต์
3. รันคำสั่ง:

```bash
git init
git add .
git commit -m "Create React buffet calculator"
git branch -M main
git remote add origin https://github.com/ชื่อผู้ใช้ของคุณ/react_buffet_app.git
git push -u origin main
```

## Deploy ด้วย Vercel
1. เข้า https://vercel.com และ Sign up / Log in ด้วย GitHub
2. กด Add New > Project แล้ว Import Repository `react_buffet_app`
3. Framework Preset เลือก Vite (Vercel มักตรวจจับให้อัตโนมัติ)
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. กด Deploy แล้วรอจนเสร็จ จะได้ URL สำหรับส่งอาจารย์

## โครงสร้างไฟล์
```text
react_buffet_app/
├── index.html
├── package.json
├── README.md
└── src/
    ├── App.jsx
    ├── App.css
    └── main.jsx
```

หมายเหตุ: โลโก้ในตัวอย่างเป็นข้อความ/สัญลักษณ์จำลอง เนื่องจากภาพอ้างอิงไม่มีไฟล์โลโก้ต้นฉบับแยกต่างหาก สามารถเปลี่ยนใน `src/App.jsx` ส่วน `restaurant-logo` ได้
