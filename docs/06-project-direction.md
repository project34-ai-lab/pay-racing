# 06-project-direction.md

# Project Direction — Pay Racing (PRC) 🏎️💨

## Project Overview

Pay Racing (PRC) คือระบบหารเงินทริปแบบ Real-time ที่ออกแบบมาเพื่อกลุ่มเพื่อนสนิทที่เดินทางท่องเที่ยวด้วยกัน

ระบบมีเป้าหมายเพื่อเปลี่ยนกิจกรรมที่น่าเบื่อและน่าอึดอัดอย่าง “การจดบัญชีทริป” และ “การทวงเงิน” ให้กลายเป็นประสบการณ์ที่สนุก รวดเร็ว และเต็มไปด้วยพลังของการเล่นสนุกในกลุ่มเพื่อน

Pay Racing ไม่ใช่ระบบบัญชี  
ไม่ใช่ระบบการเงิน  
และไม่ใช่แอป FinTech

Pay Racing คือ:

> “Trip expense coordination game disguised as a racing game”

---

# Core Philosophy

## Fun-First Over Finance-First

ระบบนี้ให้ความสำคัญกับ:

* emotional experience
* friend-group interaction
* meme energy
* playful competition
* frictionless usage

มากกว่าความเป็นทางการแบบระบบบัญชี

ผู้ใช้งานไม่ควรรู้สึกเหมือนกำลัง “ทำบัญชี”

แต่ควรรู้สึกเหมือนกำลังเล่นเกมแข่งรถสายเปย์ร่วมกับเพื่อน

---

# Product Identity

Pay Racing มีบุคลิกดังนี้:

* chaotic but lovable
* playful
* loud
* fast
* meme-able
* mobile-native
* social
* lightweight
* emotional

หลีกเลี่ยงบุคลิกแบบ:

* corporate
* fintech
* accounting software
* enterprise dashboard
* overly serious UI

---

# Product Goal

เป้าหมายหลักของระบบคือ:

* ทำให้การหารเงินทริป “ง่ายที่สุด”
* ลด friction ให้ต่ำที่สุด
* ใช้งานได้ทันทีผ่าน browser
* ไม่ต้อง install application
* ไม่ต้อง login
* ไม่ต้องจำ password
* ไม่ต้อง onboarding ซับซ้อน
* แชร์ link แล้วเริ่มเล่นได้ทันที

---

# Target Users

กลุ่มผู้ใช้งานหลัก:

* กลุ่มเพื่อนสนิท
* คนทำงาน
* มนุษย์เงินเดือน
* กลุ่มเที่ยว road trip
* กลุ่ม outing ขนาดเล็ก

ช่วงอายุโดยประมาณ:

* 25-45 ปี

ขนาดกลุ่มที่เหมาะสม:

* 3-8 คน

ระบบนี้ออกแบบมาสำหรับ “กลุ่มที่มี trust กันระดับหนึ่ง”

ไม่ใช่ระบบสำหรับ public financial coordination ขนาดใหญ่

---

# Primary Usage Scenario

ตัวอย่างสถานการณ์หลัก:

* ทริปหัวหิน
* ทริปเชียงใหม่
* ทริปต่างจังหวัด 2-3 วัน
* road trip
* outing office
* คาเฟ่ hopping
* ทริปสายกิน

ระหว่างทางจะมีค่าใช้จ่ายเกิดขึ้นตลอดเวลา เช่น:

* ค่าน้ำมัน
* ค่าอาหาร
* ค่าคาเฟ่
* ค่าที่พัก
* ค่ากิจกรรม

Pay Racing ถูกออกแบบมาเพื่อจัดการ “trip chaos” เหล่านี้แบบ real-time

---

# Core Product Principles

## 1. Frictionless First

ทุก interaction ต้องเร็วที่สุด

ผู้ใช้ควรสามารถ:

* เปิด link
* ตั้งชื่อเล่น
* เริ่มใช้งาน

ได้ภายในไม่กี่วินาที

หลีกเลี่ยง:

* registration
* OTP
* email verification
* password setup
* onboarding flow ซับซ้อน

---

## 2. Mobile-First By Default

ระบบถูกออกแบบสำหรับ mobile browser เป็นหลัก

ทุก UX decision ต้อง prioritize:

* thumb interaction
* large tap targets
* fast readability
* one-hand usage
* unstable network conditions

Desktop support เป็น secondary concern

---

## 3. Emotional Feedback Matters

ระบบควรตอบสนองด้วย emotional feedback เสมอ

ตัวอย่าง:

* overtake animation
* playful copywriting
* racing metaphors
* exaggerated reactions
* meme-friendly moments

ระบบไม่ควรตอบสนองแบบ generic business application

---

## 4. Real-Time Feeling Is Core

ผู้ใช้งานทุกคนควรรู้สึกว่า:

> “เราอยู่ในทริปเดียวกันจริง ๆ”

Leaderboard, logs, และ expense updates ควร sync แบบ real-time

Real-time interaction เป็น core emotional mechanic ของระบบ

---

## 5. Simplicity Over Feature Explosion

ระบบนี้ intentionally limited

หลีกเลี่ยง feature ที่เพิ่ม complexity โดยไม่เพิ่ม emotional value เช่น:

* advanced accounting
* detailed bookkeeping
* complex permissions
* enterprise workflows
* payment gateway integration
* banking integrations
* excessive settings

---

# Product Scope (MVP)

## Included In MVP

### Trip Flow

* create trip
* join via link / QR
* set nickname
* optional PromptPay setup

### Expense Flow

* add expense
* category selection
* real-time updates
* leaderboard ranking
* expense logs

### Settlement Flow

* calculate balances
* minimize transfers
* generate PromptPay QR
* payment confirmation

### Experience Layer

* racing theme
* meme copywriting
* animated leaderboard
* emotional UI feedback

---

# Explicit Non-Goals

Pay Racing จะไม่พยายามเป็น:

* accounting software
* bookkeeping platform
* banking app
* payment gateway
* ERP
* expense management suite
* tax system
* enterprise finance tool

---

# Technical Direction

ระบบใช้แนวทาง:

* frontend-first
* mobile-first
* lightweight realtime architecture
* no-login identity model
* free-tier infrastructure
* static deployment
* low operational cost

Priority สูงสุดคือ:

* simplicity
* speed
* accessibility
* fun
* operational continuity

---

# Long-Term Direction

เป้าหมายระยะยาวไม่ใช่การแข่ง feature กับระบบ enterprise

แต่คือการสร้าง:

> lightweight social operational tools with strong emotional identity

Pay Racing ควร remain:

* fun
* lightweight
* fast
* memorable
* easy to share
* easy to use

แม้ระบบจะ evolve ต่อไปในอนาคต

---

# Final Direction

Pay Racing คือ:

* ระบบหารเงินทริป
* เกมแข่งรถสายเปย์
* social chaos simulator
* meme-powered operational tool

ที่ถูกออกแบบมาเพื่อ:

> “เปลี่ยนความวุ่นวายเรื่องเงินระหว่างเพื่อน ให้กลายเป็นส่วนหนึ่งของความสนุกในทริป”