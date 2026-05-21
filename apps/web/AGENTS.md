# AGENTS.md

# Codex Agent Instructions — Pay Racing Web 🏎️💨

## Purpose

ไฟล์นี้คือคำสั่งปฏิบัติการหลักสำหรับ Codex และ AI implementation workers ที่ทำงานภายใน `apps/web`

Codex ต้องอ่านไฟล์นี้ก่อนเริ่มงานทุกครั้ง

เป้าหมายคือให้ implementation ฝั่ง web:

* ตรงกับ product direction
* ไม่หลุด architecture
* mobile-first จริง
* fun จริง
* reviewable
* maintainable
* production-oriented
* ไม่กลายเป็น generic dashboard

---

# Required Context

ก่อน implement งานใด ๆ ใน `apps/web` ต้องอ่านและยึดตามเอกสารเหล่านี้:

## Root Engineering Docs

* `docs/01-engineering-principles.md`
* `docs/02-architecture-principles.md`
* `docs/03-prompting-guide.md`
* `docs/04-review-checklist.md`
* `docs/05-git-strategy.md`

## Project Context Docs

* `docs/06-project-direction.md`
* `docs/07-domain-language.md`

## Web Service Docs

* `docs/web/01-requirements.md`
* `docs/web/02-design.md`
* `docs/web/03-codex-rules.md`
* `docs/web/04-tasks.md`
* `docs/web/05-ui-design-system.md`

ห้าม implement โดยไม่ align กับ docs เหล่านี้

---

# Product Identity

Pay Racing ไม่ใช่ finance app  
Pay Racing ไม่ใช่ accounting tool  
Pay Racing ไม่ใช่ enterprise dashboard

Pay Racing คือ:

> เกมแข่งรถสายเปย์สำหรับกลุ่มเพื่อนที่กำลังเที่ยวด้วยกัน

ทุก UI และ interaction ต้อง preserve:

* fun
* speed
* meme energy
* racing identity
* mobile-first feeling
* friend-group chaos
* low friction

ถ้า implementation ทำให้ระบบดูเหมือนระบบบัญชีหรือ admin dashboard แปลว่าผิดทาง

---

# Operating Role

Codex ทำหน้าที่เป็น:

* senior frontend implementation worker
* TypeScript implementation agent
* UI implementation worker
* refactor worker
* test worker

Codex ไม่ใช่:

* product owner
* system architect หลัก
* product designer ที่เปลี่ยน identity เอง
* คนเพิ่ม feature ตามใจ

---

# Architecture Boundaries

## Current App Architecture

`apps/web` คือ frontend application หลักของระบบ

ระบบใช้:

* Vite
* React
* TypeScript strict mode
* Tailwind CSS
* Zustand
* Framer Motion
* Supabase client
* LocalStorage anonymous identity

ไม่มี custom backend API service ใน MVP

Architecture flow:

```txt
apps/web
→ Supabase client
→ Supabase DB / Realtime
```

ไม่ใช่:

```txt
apps/web
→ apps/api
→ database
```

---

# Hard Constraints

Codex ห้าม:

* เพิ่ม custom backend service
* เพิ่ม auth system
* เพิ่ม login/register flow
* เพิ่ม payment gateway
* เพิ่ม admin dashboard
* เพิ่ม enterprise RBAC
* เพิ่ม receipt upload
* เพิ่ม banking integration
* เพิ่ม complex account system
* เปลี่ยน product tone เป็น finance/corporate
* สร้าง UI แบบ generic SaaS dashboard
* rewrite architecture โดยไม่ได้สั่ง
* เพิ่ม dependency หนักโดยไม่จำเป็น
* ใช้ `any`

---

# Implementation Principles

## Small Scoped Changes

ทุกงานควรทำเป็น small, reviewable change

ห้าม implement หลาย phase พร้อมกัน

Prefer:

* one task
* one concern
* predictable diff
* easy review

Avoid:

* giant PR
* rewrite ทั้ง app
* unrelated refactor
* feature creep

---

## Preserve Existing Behavior

หากมี behavior เดิมอยู่แล้ว:

* ห้ามเปลี่ยนโดยไม่จำเป็น
* ห้าม refactor นอก scope
* ห้ามเปลี่ยน UX flow เอง

---

## Inspect Existing Patterns First

ก่อนสร้าง pattern ใหม่:

* ดู folder structure เดิม
* ดู component conventions เดิม
* ดู naming conventions เดิม
* reuse pattern เท่าที่เหมาะสม

---

# TypeScript Rules

## Strict TypeScript Required

ห้ามใช้:

```ts
any
```

ต้องใช้ explicit types สำหรับ:

* domain entities
* component props
* Zustand stores
* Supabase payloads
* realtime events
* settlement outputs
* form data
* local storage state

---

## Define Types Before Logic

ก่อน implement feature ใหม่ ให้ define:

* domain type
* state shape
* input contract
* output contract

แล้วค่อย implement UI หรือ service logic

---

# Folder Structure Rules

ใช้ structure ตามนี้เป็นหลัก:

```txt
src/
├── app/
├── pages/
├── layouts/
├── components/
├── modules/
├── stores/
├── services/
├── hooks/
├── lib/
├── types/
├── utils/
├── constants/
└── styles/
```

ห้ามสร้าง folder structure ใหม่มั่ว ๆ โดยไม่มีเหตุผล

---

# Module Rules

Feature logic ควรอยู่ใน `modules/`

ตัวอย่าง module:

```txt
modules/
├── trip/
├── member/
├── expense/
├── leaderboard/
├── settlement/
└── realtime/
```

แต่ละ module อาจมี:

```txt
components/
hooks/
services/
stores/
types/
utils/
views/
```

ใช้เท่าที่จำเป็น  
ห้าม over-structure ถ้า feature ยังเล็ก

---

# Component Rules

Components ต้อง:

* small
* readable
* mobile-first
* responsibility เดียว
* props ชัด
* ไม่มี hidden business logic

Reusable UI components ควรอยู่ใน:

```txt
src/components/
```

Feature components ควรอยู่ใน:

```txt
src/modules/<feature>/components/
```

---

# State Management Rules

ใช้ Zustand สำหรับ shared app state เช่น:

* current trip
* local member
* expenses
* leaderboard
* realtime state
* settlement state

ใช้ local state สำหรับ:

* modal open/close
* temporary input
* animation state
* transient UI behavior

ห้ามสร้าง giant global store

---

# Supabase Rules

Supabase ใช้สำหรับ:

* shared trip persistence
* members persistence
* expenses persistence
* settlement confirmations
* realtime sync

Supabase ไม่ได้ใช้สำหรับ:

* auth
* payment
* server-side business orchestration
* enterprise account management

Supabase client setup ควร isolate อยู่ใน:

```txt
src/lib/
```

หรือ

```txt
src/services/
```

ห้ามกระจาย Supabase calls มั่วทั่ว component tree

---

# LocalStorage Rules

LocalStorage ใช้สำหรับ:

* member token
* nickname
* PromptPay info
* last active trip

LocalStorage ไม่ใช่ source of truth ของ shared trip data

ต้องมี wrapper/adapter ที่ชัดเจน  
ห้ามเรียก `localStorage` กระจายมั่วทุก component

---

# Realtime Rules

Realtime เป็น core product experience

ต้อง support:

* expense_created
* member_joined
* trip_finished
* payment_confirmed

Realtime implementation ต้อง:

* event naming ชัด
* reconnect ได้
* avoid duplicate handling
* update UI smoothly
* preserve local identity

---

# Settlement Rules

Settlement calculation ต้องเป็น pure function เท่าที่ทำได้

ควรอยู่ใน:

```txt
src/modules/settlement/utils/
```

หรือใกล้เคียง

ต้องรองรับ:

* calculate member balances
* minimize transfer count
* return readable settlement instructions

Pay Racing ไม่ processเงินจริง

ระบบทำได้แค่:

* calculate
* generate PromptPay QR
* show instructions
* social confirmation

---

# PromptPay QR Rules

QR generation ต้องเป็น client-side

ห้าม integrate payment gateway

QR UI ต้องแสดง:

* recipient nickname
* amount
* QR code
* short instruction

ต้องมี boundary copy ว่า:

> Pay Racing แค่ช่วยสรุปยอดและสร้าง QR การโอนเงินจริงทำผ่านแอปธนาคารของแต่ละคน

---

# UI Rules

## Mobile First

Mobile portrait คือ primary target

ต้อง optimize สำหรับ:

* 360px
* 390px
* 414px
* one-hand usage
* thumb interaction
* unstable mobile network

---

## Dark Racing Identity

UI ต้องเป็น dark-first racing arcade style

ห้ามใช้:

* plain white SaaS layout
* finance dashboard look
* enterprise sidebar
* table-first accounting UI

---

## Playful Copy Required

ใช้ copy ที่ playful และมี racing/meme energy

Allowed examples:

```txt
บรื๊นนนน! เพิ่มค่าเสียหายแล้ว
ใครเปย์หนักสุดตอนนี้?
ปิดสนาม 🏁
ล้อฟรีกระเป๋าฉีก 💸
```

Forbidden examples:

```txt
Expense created successfully
Submit
Transaction completed
Financial summary
```

---

# Motion Rules

ใช้ Framer Motion สำหรับ motion สำคัญ:

* modal transition
* button press
* leaderboard reorder
* overtake animation
* damage gauge count-up
* settlement reveal

Motion ต้อง:

* quick
* fun
* readable
* mobile-safe
* ไม่ทำให้ flow ช้า

ห้าม heavy animation ที่ทำให้ mobile lag

---

# Styling Rules

ใช้ Tailwind CSS เป็นหลัก

ห้าม:

* inline style จำนวนมาก
* mixed styling systems
* CSS chaos
* random visual style ต่อ component

Visual consistency ต้องตาม:

```txt
docs/web/05-ui-design-system.md
```

---

# UX Rules

## 3-Second Expense Flow

Add expense flow ต้องเป็น:

```txt
tap
→ amount
→ category
→ submit
```

ห้ามเพิ่ม:

* required description
* store name
* multi-step confirmation
* unnecessary fields

---

## Frictionless First

ถ้า feature ทำให้ผู้ใช้:

* คิดเยอะขึ้น
* กรอกเยอะขึ้น
* แตะเยอะขึ้น
* เสียเวลามากขึ้น

ให้ถือว่าเสี่ยงต่อ product identity

---

# Testing & Validation Rules

หลัง implement ควร validate:

* TypeScript compile ผ่าน
* build ผ่าน
* mobile layout ไม่พัง
* main flow ใช้งานได้
* realtime ไม่ duplicate
* settlement calculation ถูก
* no generic enterprise copy
* no accidental feature creep

---

# Review Checklist Before Finishing Task

ก่อนจบงาน Codex ต้องตรวจว่า:

* task scope ตรงกับที่สั่งไหม
* ไม่มี unrelated refactor
* ไม่มี new architecture drift
* ไม่มี `any`
* UI ยังสนุกไหม
* mobile-first ยังดีไหม
* domain language ยังถูกไหม
* performance ยังดีไหม
* implementation reviewable ไหม

---

# Preferred Work Style

Codex ควรตอบ/ทำงานแบบ:

* concise
* implementation-focused
* clear about files changed
* clear about validation
* no unnecessary explanation
* no speculative features

---

# Final Instruction

ทุกครั้งที่ implement ให้ถามตัวเองว่า:

> “นี่คือสนามแข่งสายเปย์ของกลุ่มเพื่อน หรือกลายเป็นระบบบัญชีแล้ว?”

ถ้าคำตอบเริ่มเอนไปทางระบบบัญชี ให้หยุดและปรับกลับทันที

Pay Racing ต้อง remain:

* funny
* fast
* lightweight
* realtime
* mobile-native
* meme-powered
* emotionally memorable