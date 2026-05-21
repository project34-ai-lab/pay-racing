# 01-requirements.md

# Web Requirements — Pay Racing (PRC) 🏎️💨

## Purpose

เอกสารนี้กำหนด functional requirements และ user interaction requirements ของ Pay Racing Web Application

เป้าหมายของระบบคือ:

* frictionless trip expense coordination
* real-time shared experience
* emotional and meme-driven interaction
* mobile-first usage
* ultra-fast interaction flow

ระบบนี้ถูกออกแบบเป็น:

> mobile-first realtime social trip experience

ไม่ใช่ traditional finance application

---

# Product Goals

ระบบต้องสามารถ:

* สร้างทริปได้เร็ว
* แชร์เพื่อนเข้าทริปได้ทันที
* เพิ่มค่าใช้จ่ายได้ในไม่กี่วินาที
* sync ข้อมูลแบบ real-time
* สรุปยอดจบทริปได้ง่าย
* รวมรายชื่อ PromptPay เพื่อคัดลอกโอนได้เร็ว
* ใช้งานได้ฟรี
* ใช้งานได้บน mobile browser โดยไม่ install app

## Product Language Scope (MVP 1.0)

เพื่อให้ใช้ได้กับหลายกิจกรรม (ทริป, ร้านเหล้า, กินข้าว, อีเวนต์กลุ่มเพื่อน):

* UI copy ฝั่งผู้ใช้ให้ใช้คำกลาง เช่น `อีเวนต์`, `กิจกรรม`, `ผู้สร้างอีเวนต์`, `สมาชิก`
* คงชื่อแบรนด์ `Pay Racing` และโทนสนุกแบบเล่นกับเพื่อน
* คง technical domain เดิมในโค้ด เช่น `tripId`, route `/trip/:tripId` เพื่อเลี่ยง breaking change

---

# Core Product Requirements

## 1. No Login System

ระบบต้องไม่มี:

* registration
* email verification
* password
* OTP
* account onboarding

Identity ใช้ผ่าน:

* nickname
* local browser identity
* local member token

---

# 2. Mobile-First Experience

ระบบถูกออกแบบสำหรับ mobile browser เป็นหลัก

UI ต้อง optimize สำหรับ:

* thumb interaction
* portrait orientation
* one-hand usage
* quick interaction
* unstable mobile internet

Desktop support เป็น secondary concern

---

# 3. Real-Time Shared Experience

ผู้ใช้งานทุกคนใน trip ต้องเห็นข้อมูล shared ร่วมกันแบบ real-time

ตัวอย่าง:

* expense ใหม่
* leaderboard changes
* member join
* settlement confirmation

เมื่อ member ใหม่เข้าห้องที่มีคนอยู่ก่อนแล้ว:

* ต้องเห็นสมาชิกที่อยู่ในห้องเดิมได้ภายใน flow realtime เดียวกัน
* ต้องเห็นรายการ expense และยอดรวมที่ห้องมีอยู่แล้วได้ (ไม่เห็นเฉพาะรายการที่เพิ่มหลังเข้า)

Real-time sync เป็น core requirement

## Realtime Safety Requirements (MVP Lock)

งานที่แตะ `realtime / shared state / trip lifecycle` ต้องผ่านเงื่อนไขนี้เสมอ:

* ต้องมี event contract ชัดเจน (name + payload + source + dedupe rule)
* ต้องไม่ทำให้ flow เดิม regress (create/join/rejoin/delete trip, add/delete expense)
* ต้องมี rollback หรือ fail-safe เมื่อ publish ไม่สำเร็จ
* ต้องระบุ source-of-truth ของ state ให้ชัด (realtime/store/local snapshot)
* ต้องรองรับ rejoin/reconnect โดยไม่สร้าง event loop
* ต้องมี regression checklist ก่อนปิดงาน

---

# 4. Fast Interaction Flow

Core actions ต้องทำได้เร็วที่สุด

Target interaction:

* add expense ภายใน ~3 วินาที
* join trip ภายใน ~10 วินาที
* settlement understanding ภายในไม่กี่วินาที

หลีกเลี่ยง:

* long forms
* deep navigation
* multi-step workflows

---

# User Roles

ระบบ intentionally ไม่มี complex RBAC

---

## Creator 🏁

### Definition

คนที่สร้าง trip เป็นคนแรก

### Capabilities

* create trip
* share trip link
* add expense
* delete trip (creator only)
* end trip
* confirm payment

### Notes

Creator ไม่มี admin privilege พิเศษ

Role นี้มีไว้เพื่อ:

* emotional identity
* social recognition

UI label guidance:

* role label ในระบบใช้ `ผู้สร้างอีเวนต์` และ `สมาชิก`

---

## Member 🤝

### Definition

สมาชิกคนอื่นที่เข้าร่วม trip

### Capabilities

* join trip
* add expense
* end trip
* confirm payment

ทุกคนมีสิทธิ์ใกล้เคียงกัน

---

# Functional Requirements

---

# Feature Group 1 — Trip Lifecycle

## Create Trip

### Requirements

ผู้ใช้ต้องสามารถ:

* กดสร้าง trip ใหม่ได้ทันที
* ตั้งชื่อ trip แบบสั้น ๆ ได้ (เช่น จังหวัด/ชื่อทริป)
* ระบุผู้สร้างอีเวนต์ก่อนเข้าห้องได้จากหน้าเดียวกัน
* ระบุ PromptPay ของผู้สร้างอีเวนต์จากหน้าเดียวกัน (required)
* PromptPay ของ Creator ต้องเป็นตัวเลขล้วน และยาวได้เฉพาะ 10 หรือ 13 หลัก
* ได้ unique trip URL
* มีปุ่มคัดลอกลิงก์ trip บน mobile
* ได้ QR code สำหรับแชร์
* เข้าสู่ trip room อัตโนมัติ

หมายเหตุการแสดงผล:

* การ์ดแชร์ลิงก์และปุ่มคัดลอกลิงก์ แสดงเฉพาะ role `Creator`
* ปุ่ม `ลบทริปนี้` แสดงเฉพาะ role `Creator` และวางไว้โซนล่างสุดของหน้าห้อง

### Notes

ระบบไม่ต้องถามข้อมูลเยอะก่อนสร้าง trip

---

## Join Trip

### Requirements

ผู้ใช้ต้องสามารถ:

* join ผ่าน URL
* join ผ่าน QR code
* ตั้งชื่อ Member
* กรอก PromptPay ก่อนเข้าทริป (required)
* เข้าใช้งานได้ทันที

### Persistence

ระบบต้อง remember identity ผ่าน LocalStorage เฉพาะเพื่อเก็บตัวตนของ browser

### Join Entry Rule (สำคัญ)

* ถ้า `Member` เปิดลิงก์แชร์ที่ `tripId` เดิมและเคย join ห้องนี้แล้ว ให้เข้าห้องได้ทันที
* ถ้า `Member` เปิดลิงก์แชร์ที่ `tripId` ใหม่ (ห้องใหม่) ต้องเข้าหน้า join ก่อนเสมอ
* สำหรับห้องใหม่ ผู้ใช้ต้องกรอก `สมาชิก` และ `PromptPay` ก่อน join
* UX ต้องไม่แว้บหน้า room ก่อน redirect ไป join
* ห้าม publish สถานะ `member_joined` ของห้องใหม่จนกว่าจะกด join สำเร็จ
* เมื่อมี `member_joined` event ใหม่ (eventId ใหม่) ระบบต้องอนุญาตให้ backfill ข้อมูลซ้ำได้ แม้เป็นสมาชิกคู่เดิม เพื่อกัน state หายตอน re-join

---

## Rejoin Trip

### Requirements

หากผู้ใช้กลับเข้ามาด้วย browser เดิม:

* ระบบควรจำ identity เดิมได้
* แต่ flow join จากลิงก์แชร์ใหม่ยังต้องผ่านหน้า join ตามกติกาข้างบน

---

## Delete Trip (Creator only)

### Requirements

* creator ต้องสามารถลบทริปที่ตัวเองสร้างได้จากหน้า trip room
* ก่อนลบต้องมี modal ยืนยันแบบ 2 ทางเลือก `ตกลง` / `ยกเลิก`
* ปุ่มลบต้องเป็น visual danger ชัดเจน (เตือนว่ามีความเสี่ยง)
* เมื่อลบทริป:
  * เคลียร์ snapshot/local trip state ของทริปนั้น
  * เคลียร์ creator mapping ของทริปนั้น
  * ถ้าทริปนั้นเป็น last active trip ให้ล้างค่า last active ด้วย
  * ส่ง realtime event เพื่อแจ้งสมาชิกคนอื่นให้ออกจากห้อง

### Acceptance

* member ไม่เห็นปุ่มลบทริป
* creator กดยืนยันแล้วกลับหน้า `/` ทันที
* สมาชิกที่อยู่ห้องเดียวกันถูกพาออกจากห้องเมื่อได้รับ event ลบทริป
* redirect หลังลบทริปต้องกลับไปหน้า create trip (`/`) ด้วย URL ที่ clean ไม่มี query ของทริปเดิม
* ถ้าเปิดลิงก์ของทริปที่ถูกลบแล้ว ต้องเจอหน้าแจ้งว่าไม่มีทริปนี้แล้ว พร้อมปุ่มกลับหน้า create trip
* หน้าแจ้งเตือนทริปที่ถูกลบต้องมี auto-redirect 5 วินาที (ถ้าไม่กดปุ่มกลับเอง)

---

# Feature Group 2 — Main Dashboard

Main dashboard เป็น core screen ของระบบ

---

## Total Damage Gauge

### Requirements

ต้องแสดง:

* total expense amount
* emotional damage level
* meme status message

### UX Requirements

* large visual impact
* highly visible
* mobile readable

---

## Leaderboard

### Requirements

ต้องแสดง:

* member ranking
* total paid amount
* payment activity
* creator/member indicator
* top spender indicator (rank 1-3)

### Real-Time Behavior

เมื่อมี expense ใหม่:

* leaderboard ต้อง update ทันที
* ranking ต้อง reorder ได้
* support overtake animation

---

## Damage Logs

### Requirements

ต้องแสดง:

* expense amount
* payer
* category
* timestamp
* playful category identity
* delete action (เฉพาะรายการที่ member คนนั้นสร้างเอง)

### Editing Rule

* ไม่รองรับการแก้ไขรายการ (no edit)
* ถ้ากรอกผิด ให้ลบแล้วเพิ่มใหม่เท่านั้น

### Ordering

เรียงจาก:

* highest expense → lowest expense

### Recalculation Rule

* เมื่อลบรายการ ต้องคำนวณ Total Damage / Leaderboard / Settlement ใหม่ทันที
* การลบต้อง sync ข้ามสมาชิกในห้องผ่าน realtime (`expense_deleted`) ทันที
* ถ้าส่ง realtime ไม่สำเร็จ ฝั่งคนกดลบต้อง rollback รายการกลับ เพื่อไม่ให้ state แยกจากคนอื่น

---

# Feature Group 3 — Add Expense Flow

Add Expense เป็น core interaction ของระบบ

---

## Open Expense Modal

### Requirements

ผู้ใช้สามารถเปิด add expense modal ได้จาก main screen

Modal ต้อง:

* mobile optimized
* thumb friendly
* minimal distraction

---

## Expense Input

### Requirements

ต้องสามารถ:

* กรอกจำนวนเงิน
* เลือก category
* กรอกรายการเพิ่มเติมเองได้
* เลือกอย่างเดียว / กรอกอย่างเดียว / เลือกและกรอกพร้อมกัน ได้ทั้งหมด
* ต้องมีอย่างน้อยหนึ่งอย่างระหว่าง `category` หรือ `รายการเพิ่มเติม`
* submit ได้รวดเร็ว

### UX Requirements

* large numpad feeling
* big touch targets
* minimal typing
* no unnecessary fields

---

## Expense Categories

MVP categories:

* ⛽ ค่าน้ำมัน / ค่าเดินทาง
* 🍽️ ค่าอาหาร / เครื่องดื่ม
* 🏨 ค่าที่พัก
* ☕ กาแฟ / ของว่าง
* 🎟️ ค่าเข้า / ค่าบัตร
* 🚕 ค่าเดินทางในเมือง
* 🧰 ค่าอุปกรณ์ / ค่าเช่า
* 🧾 ค่าใช้จ่ายจิปาถะ

---

## Expense Submission

เมื่อ submit สำเร็จ:

* realtime sync ทุก client
* update leaderboard
* update damage logs
* update total damage
* trigger emotional feedback

---

# Feature Group 4 — Settlement Flow

Settlement เป็น final trip experience

---

## End Trip

### Requirements

สมาชิกคนใดก็ได้สามารถ:

* trigger settlement
* lock trip summary state

## Settlement Calculation

ระบบต้องสามารถ:

* calculate net balances
* minimize transfer count
* generate settlement instructions
* แสดงเป็น list เดียวที่อ่านง่าย (ใครโอนให้ใคร / จำนวนเงิน / สถานะ / PromptPay ผู้รับ)

### Example

แทนที่จะ:

* A จ่าย B
* B จ่าย C
* C จ่าย D

ระบบควร optimize ให้เหลือ transaction น้อยที่สุด

---

## PromptPay Directory

### Requirements

ต้องสามารถ:

* แสดงรายชื่อ PromptPay ของสมาชิกในทริป
* แสดง nickname + หมายเลข PromptPay
* มีปุ่มคัดลอกต่อรายการสำหรับมือถือ
* มีปุ่มแก้ไข PromptPay ต่อรายการ
* แก้ไขได้เฉพาะเจ้าของ PromptPay นั้นเท่านั้น
* ตอนบันทึก PromptPay ต้อง validate เป็นตัวเลขล้วน และยาวเฉพาะ 10 หรือ 13 หลัก
* UX การแก้ไขต้องเปิดเป็น modal form พร้อม input เต็ม + ปุ่ม `บันทึก` / `ยกเลิก` สำหรับ mobile-first

### Sync Rule

* เมื่อเจ้าของแก้ PromptPay สำเร็จ ค่าใหม่ต้องอัปเดตทุกจุดที่ใช้ข้อมูลนี้ (รายการ PromptPay + settlement instructions) และต้อง sync ไปสมาชิกคนอื่นในทริป

### Important Notes

ระบบ:

* ไม่ process payment
* ไม่ hold money
* ไม่ verify banking transaction

ระบบเป็นเพียง:

* coordination layer

---

## Payment Confirmation

### Requirements

ผู้ใช้สามารถ:

* mark payment as completed
* ปุ่มยืนยันการโอนต้องกดได้เฉพาะ `payer` ของรายการนั้นเท่านั้น
* สมาชิกคนอื่นในห้องเห็นสถานะได้ แต่กดยืนยันแทนไม่ได้

### Persistence Rule

* เมื่อรายการถูกยืนยันว่าโอนแล้ว (`completed`) สถานะต้องคงอยู่เมื่อ rejoin ทริปเดิม
* สถานะการโอนต้อง sync ข้ามสมาชิกในห้องเหมือนกัน

### Notes

Confirmation เป็น trust-based confirmation

ไม่ใช่ bank verification

---

# Feature Group 5 — Realtime Synchronization

Realtime เป็น core infrastructure requirement

---

## Required Realtime Events

ระบบต้อง sync:

* member join
* expense creation
* leaderboard updates
* settlement updates
* payment confirmations

---

## Connection Recovery

หาก connection หลุด:

* app ต้อง recover state ได้
* reconnect gracefully
* preserve local identity

---

# Feature Group 6 — Persistence

---

## Local Persistence

ระบบต้อง persist:

* member token
* nickname
* promptpay info
* current trip reference

ผ่าน LocalStorage

---

## Shared Persistence

ระบบต้อง persist shared trip state ผ่าน realtime backend layer

---

# Non-Functional Requirements

---

# Performance

ระบบต้อง:

* โหลดเร็ว
* usable บน mobile network
* responsive
* smooth animation

---

# Accessibility

ระบบควร:

* readable บน mobile
* usable ด้วยนิ้วโป้ง
* มี contrast เพียงพอ
* ไม่ cluttered

---

# Emotional UX

ระบบต้อง maintain:

* fun feeling
* playful tone
* meme energy
* social interaction energy

ทุก interaction ต้อง avoid enterprise feeling

---

# Explicit Non-Goals

MVP จะไม่รองรับ:

* account system
* social profiles
* friend system
* payment gateway
* receipt upload
* advanced accounting
* tax handling
* admin dashboard
* enterprise workflows
* banking integrations
* multi-trip management system

---

# MVP Completion Criteria

MVP ถือว่าสำเร็จเมื่อ:

* create/join trip ได้
* realtime sync ทำงาน
* add expense flow เร็วและ stable
* leaderboard realtime ทำงาน
* settlement calculation ถูกต้อง
* PromptPay list + copy flow ใช้งานได้
* mobile UX ใช้งานจริงได้
* ใช้งานกับกลุ่มเพื่อนจริงได้
* friction ต่ำ
* experience สนุก

---

# Final Requirement Direction

Pay Racing ต้องให้ความรู้สึกว่า:

> “เปิด link แล้วเล่นได้เลย”

ไม่ใช่:

> “เริ่ม onboarding financial platform”

ทุก requirement ต้อง preserve:

* simplicity
* speed
* emotional value
* friend-group energy
* meme-driven interaction
* mobile-first experience
