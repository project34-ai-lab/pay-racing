# 07-domain-language.md

# Domain Language — Pay Racing (PRC) 🏎️💨

## Purpose

เอกสารนี้ใช้กำหนดภาษาและความหมายกลางของระบบ Pay Racing

เป้าหมายคือให้:

* human
* AI systems
* implementation logic
* UI
* documentation
* product behavior

ใช้คำศัพท์และความเข้าใจตรงกันเสมอ

คำศัพท์ในเอกสารนี้ถือเป็น canonical language ของระบบ

---

# Core Product Language

Pay Racing ไม่ใช้ภาษาของระบบบัญชีหรือระบบการเงินแบบจริงจัง

ระบบใช้ภาษาที่มี:

* racing energy
* playful feeling
* meme tone
* friend-group atmosphere

ภาษาที่ใช้ควร:

* สนุก
* เข้าใจง่าย
* เป็นธรรมชาติ
* ไม่ corporate
* ไม่เป็นทางการเกินไป

---

# Core Domain Entities

## Trip

### Meaning

ห้องทริปชั่วคราวสำหรับกลุ่มเพื่อนที่ใช้ร่วมกันระหว่างการเดินทาง

Trip เป็น root entity หลักของระบบ

ทุกข้อมูลจะผูกอยู่ภายใต้ trip เดียวเสมอ

### Example

* ทริปหัวหิน
* ทริปเชียงใหม่
* outing company
* road trip

### Important Notes

* Trip มีอายุชั่วคราว
* ไม่ใช่ permanent workspace
* ไม่มี ownership แบบ enterprise
* ทุกคนใน trip มีสิทธิ์เท่าเทียมกัน

---

## Driver 👑

### Meaning

คนที่สร้าง trip เป็นคนแรก

### Role

ไม่มี admin privilege แบบระบบ enterprise

Driver มีไว้เพื่อ:

* symbolic ownership
* emotional identity
* visual recognition

### UI Representation

* crown icon 👑
* steering wheel metaphor
* “คนเปิดสนามแข่ง”

---

## Passenger 🚗

### Meaning

สมาชิกคนอื่นที่ join เข้ามาใน trip

### Notes

Passenger ทุกคน:

* มีสิทธิ์เท่าเทียม
* เพิ่ม expense ได้
* ปิด trip ได้
* เห็นข้อมูลทั้งหมดเหมือนกัน

ระบบ intentionally ไม่มี role hierarchy ซับซ้อน

---

## Pit Stop

### Meaning

รายการค่าใช้จ่ายแต่ละครั้งที่เกิดขึ้นระหว่างทริป

ระบบหลีกเลี่ยงคำว่า:

* transaction
* invoice
* accounting entry

เพราะ tone ของระบบไม่ใช่ financial software

### Examples

* เติมน้ำมัน
* กินหมูกระทะ
* คาเฟ่
* ค่าที่พัก

---

## Damage 💸

### Meaning

ยอดค่าใช้จ่ายรวมของทริป

ใช้แทนคำว่า:

* total expense
* total cost

เพื่อรักษา emotional tone ของระบบ

### Example Copy

* “ล้อฟรีกระเป๋าฉีก”
* “ความเสียหายรวม”
* “ตู้ ATM เคลื่อนที่”

---

## Leaderboard 🏁

### Meaning

ตารางจัดอันดับคนที่ออกเงินมากที่สุดใน trip

จัดเรียงตาม:

* total paid amount
* payment activity

### Purpose

Leaderboard เป็น:

* emotional mechanic
* social mechanic
* meme mechanic

ไม่ใช่ระบบแข่งขันจริงจัง

---

## Overtake

### Meaning

เหตุการณ์ที่ผู้เล่นคนหนึ่งขึ้นอันดับบน leaderboard หลังจากออกเงินเพิ่ม

### Importance

Overtake เป็น core emotional feedback ของระบบ

ควรมี:

* animation
* motion
* exaggerated feedback
* sound effect support ในอนาคต

---

## Damage Log

### Meaning

รายการประวัติค่าใช้จ่ายทั้งหมดใน trip

### Ordering

เรียงจาก:

* ค่าใช้จ่ายสูง → ต่ำ

เพื่อเพิ่ม emotional impact

---

# Expense Categories

หมวดหมู่หลักของระบบใช้ emoji-first approach

---

## 🔥 Fuel Burn

### Meaning

ค่าเดินทาง / ค่าน้ำมัน / ค่าเดินทางระหว่างทริป

### Examples

* น้ำมันรถ
* ค่าทางด่วน
* ค่าที่จอดรถ

---

## 🍖 Food Rampage

### Meaning

ค่าอาหาร / คาเฟ่ / ของกิน

### Examples

* หมูกระทะ
* ชาบู
* กาแฟ
* ขนม

---

## 🏰 Safe House

### Meaning

ค่าที่พัก

### Examples

* โรงแรม
* รีสอร์ต
* Airbnb

---

## 🎪 Chaos Activities

### Meaning

กิจกรรมบันเทิงหรือค่าใช้จ่ายระหว่างเที่ยว

### Examples

* คาราโอเกะ
* บาร์
* ค่าเข้าสถานที่
* กิจกรรมท่องเที่ยว

---

# Settlement Language

## Finish Line 🏁

### Meaning

ขั้นตอนสรุปยอดและปิด trip

### Notes

ระบบใช้คำที่สื่อถึง:

* การจบ race
* การเข้าเส้นชัย
* การเคลียร์สนาม

แทนคำว่า:

* billing
* reconciliation
* payment processing

---

## Settlement

### Meaning

กระบวนการคำนวณว่า:

* ใครต้องจ่ายใคร
* จำนวนเท่าไหร่

โดย optimize ให้จำนวนการโอนน้อยที่สุด

---

## PromptPay QR

### Meaning

QR Code สำหรับให้ผู้ใช้ scan จ่ายเงินจริงผ่าน mobile banking ของตัวเอง

### Important Boundary

Pay Racing:

* ไม่รับเงิน
* ไม่ hold เงิน
* ไม่ process payment
* ไม่เป็น payment gateway

ระบบมีหน้าที่เพียง:

* คำนวณยอด
* สร้าง QR
* ช่วย coordinate การจ่ายเงิน

---

## Payment Confirmation 🟢

### Meaning

สถานะที่ผู้ใช้กด confirm หลังจากโอนเงินจริงเสร็จแล้ว

### Notes

Confirmation เป็น social confirmation

ไม่ใช่ bank verification

ระบบ trust ผู้ใช้งานเป็นหลัก

---

# Identity Language

## Racer Tag

### Meaning

ชื่อเล่นของผู้ใช้งานใน trip

### Characteristics

* lightweight
* temporary
* social
* fun

ระบบ intentionally ไม่มี:

* account username
* profile system
* social identity system

---

## Member Token

### Meaning

anonymous identifier ที่เก็บไว้ใน LocalStorage ของ browser

ใช้เพื่อ:

* remember identity
* reconnect to trip
* preserve local session

ไม่ใช่ account system

---

# UX Language Principles

## UI Copy Should Feel Like Friends Talking

ข้อความในระบบควร:

* playful
* conversational
* energetic
* meme-friendly

หลีกเลี่ยง:

* enterprise wording
* banking wording
* robotic notifications

---

# Preferred Tone Examples

## Good Examples ✅

* “บรื๊นนนน! มินแซงขึ้นอันดับ 1 แล้ว!”
* “กระเป๋ากำลังไหม้ 🔥”
* “เติมน้ำมันอีกด่าน”
* “ซัดหมูกระทะไป 1,290 บาท”
* “สนามนี้ใครเปย์หนักสุด?”

---

## Bad Examples ❌

* “Expense created successfully”
* “Transaction completed”
* “User payment status updated”
* “Financial summary generated”

---

# Domain Rules

## 1. Fun Over Formality

หากต้องเลือกระหว่าง:

* formal clarity
* playful emotional clarity

ให้ prioritize emotional clarity ก่อนเสมอ

ตราบใดที่ยังเข้าใจง่าย

---

## 2. Frictionless Language

ข้อความควร:

* อ่านเร็ว
* เข้าใจเร็ว
* mobile-friendly
* thumb-speed friendly

หลีกเลี่ยงข้อความยาวหรือซับซ้อน

---

## 3. Social Energy Matters

ทุก interaction ควรให้ความรู้สึกว่า:

> “เพื่อนกำลังเล่นอะไรสนุก ๆ ด้วยกัน”

ไม่ใช่:

> “กำลังใช้งานระบบบัญชี”

---

# Final Language Direction

Pay Racing คือ:

* เกมแข่งรถสายเปย์
* social expense chaos simulator
* meme-powered trip coordination tool

ดังนั้นภาษาของระบบควรช่วย reinforce:

* fun
* speed
* chaos
* friendship
* emotional memory
* playful competition

ในทุกจุดของ product experience