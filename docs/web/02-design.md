# 02-design.md

# Web Design — Pay Racing (PRC) 🏎️💨

## Purpose

เอกสารนี้กำหนด architecture direction, frontend structure, state flow, UI structure, และ implementation boundaries ของ Pay Racing Web Application

เป้าหมายคือ:

* maintainable frontend structure
* fast mobile-first experience
* realtime shared interaction
* low-friction architecture
* AI-friendly implementation structure
* production-oriented simplicity

ระบบนี้ intentionally หลีกเลี่ยง architecture complexity ที่ไม่จำเป็น

---

# Core Architecture Direction

Pay Racing ใช้ architecture แบบ:

* frontend-first
* client-heavy
* realtime synchronized
* mobile-first
* low-infrastructure
* lightweight operational model

ระบบ intentionally ไม่มี:

* traditional backend API layer
* complex server orchestration
* enterprise architecture patterns
* microservices
* SSR complexity

---

# Frontend Stack

## Core Stack

* React
* TypeScript (strict mode)
* Vite
* Tailwind CSS
* Zustand
* Framer Motion

---

# Realtime Infrastructure

## Realtime Backend Layer

ระบบใช้ lightweight realtime backend layer สำหรับ:

* trip synchronization
* member synchronization
* realtime expense updates
* settlement synchronization

Backend layer มีหน้าที่เพียง:

* persist shared state
* sync realtime events
* maintain trip continuity

ระบบไม่ใช้ backend business orchestration หนัก

---

# Architecture Philosophy

## Simplicity Over Cleverness

Architecture ต้อง remain:

* understandable
* lightweight
* predictable
* reviewable

หลีกเลี่ยง:

* over-abstraction
* enterprise layering
* speculative scalability
* unnecessary generic systems

---

# Application Structure

## High-Level Structure

```txt
apps/web/
├── src/
│   ├── app/
│   ├── pages/
│   ├── layouts/
│   ├── components/
│   ├── modules/
│   ├── stores/
│   ├── services/
│   ├── lib/
│   ├── hooks/
│   ├── types/
│   ├── utils/
│   ├── constants/
│   └── styles/
```

---

# Layer Responsibilities

---

# app/

ใช้สำหรับ:

* app bootstrap
* providers
* router setup
* global initialization

ห้ามใส่ business logic

---

# pages/

ใช้สำหรับ:

* route-level screens
* page composition
* module orchestration

pages ต้อง remain lightweight

---

# layouts/

ใช้สำหรับ:

* shared layout structure
* safe-area handling
* screen wrappers
* navigation containers

---

# components/

ใช้สำหรับ reusable UI components

ตัวอย่าง:

* buttons
* cards
* gauges
* modals
* leaderboard items
* animated labels

components ต้อง:

* reusable
* UI-focused
* low business awareness

---

# modules/

modules เป็น core feature layer ของระบบ

ตัวอย่าง:

```txt
modules/
├── trip/
├── expense/
├── leaderboard/
├── settlement/
├── member/
└── realtime/
```

แต่ละ module ควรมี:

```txt
module-name/
├── components/
├── hooks/
├── services/
├── stores/
├── types/
├── utils/
└── views/
```

---

# stores/

ใช้ Zustand stores

แบ่งตาม concern

ตัวอย่าง:

* trip store
* member store
* expense store
* settlement store
* realtime connection store

หลีกเลี่ยง giant global store

---

# services/

ใช้สำหรับ:

* realtime communication
* persistence layer
* PromptPay directory composition
* synchronization
* external SDK integration

services ห้าม contain UI logic

---

# lib/

ใช้สำหรับ:

* external library wrappers
* backend client setup
* utility adapters

ตัวอย่าง:

* realtime client
* copy-to-clipboard utilities
* local persistence adapters

---

# hooks/

ใช้สำหรับ:

* reusable interaction logic
* derived UI behavior
* mobile interaction helpers

หลีกเลี่ยง hooks ที่ซ่อน business complexity มากเกินไป

---

# types/

ใช้สำหรับ:

* domain types
* DTO types
* shared interfaces
* realtime payload contracts

strict typing เป็น mandatory

---

# utils/

ใช้สำหรับ:

* pure utility functions
* formatting
* settlement calculation
* sorting
* lightweight helpers

utility functions ต้อง remain pure whenever possible

---

# State Management Design

## Zustand Strategy

ใช้ Zustand สำหรับ:

* trip state
* member state
* expense state
* realtime state
* settlement state

---

# State Rules

## Local UI State

ใช้ local component state สำหรับ:

* modal visibility
* input interactions
* animations
* temporary UI state

---

## Shared Application State

ใช้ Zustand สำหรับ:

* current trip
* members
* expenses
* settlement state
* realtime synchronization

---

## Persistence State

ใช้ LocalStorage สำหรับ:

* member token
* nickname
* promptpay info
* last active trip

---

# Realtime Design

## Realtime Philosophy

Realtime feeling เป็น core emotional mechanic ของระบบ

ผู้ใช้งานต้องรู้สึกว่า:

> “ทุกคนอยู่ในสนามเดียวกัน”

---

# Realtime Event Types

ตัวอย่าง event:

* member_joined
* expense_created
* expense_deleted
* trip_deleted
* leaderboard_updated
* payment_confirmed

event naming ต้อง explicit และ predictable

Realtime contracts ต้องระบุครบ:

* event name
* payload schema
* event source (เช่น `join` / `presence`)
* dedupe key strategy
* retry / rollback behavior

---

# Synchronization Rules

## Realtime Updates Must Feel Fast

เมื่อมี action สำเร็จ:

* UI update ทันที
* optimistic feeling
* smooth animation
* emotional feedback
* สำหรับ `expense_deleted` ถ้า broadcast ล้มเหลว ต้อง rollback local delete เพื่อคง single-source state ในห้อง
* publish realtime ต้องไม่ block ด้วย channel status cache เพียงอย่างเดียว ให้ลองส่งจริงและ retry อย่างน้อย 1 ครั้งเมื่อส่งไม่ผ่าน
* ถ้าพบ trip channel ค้างในสถานะที่ไม่ใช่ `SUBSCRIBED` ต้องทิ้ง channel เก่าแล้วสร้างใหม่ก่อนใช้งานต่อ

เมื่อมี member ใหม่เข้าห้อง:

* ห้องต้อง backfill state สำคัญ (อย่างน้อย expense list ที่มีอยู่) ให้ผู้เข้ามาใหม่
* dedupe สำหรับ reply/backfill ต้องอิง `eventId` ของ `member_joined` (ไม่ใช่แค่ member pair) เพื่อรองรับ re-join ห้องเดิมได้ถูกต้อง
* แยก `member_joined` source เป็น `join` และ `presence` โดยให้ presence reply ตอบกลับเฉพาะ event source=`join` เพื่อป้องกัน loop ตอบกันไปมา

## Realtime Invariants (Must Hold)

* สมาชิกทุกคนใน trip เดียวกันต้อง converge ไป state เดียวกันเสมอ
* owner-only actions (เช่นลบ expense) ต้อง enforce ได้ทั้งฝั่ง UI และ runtime guard
* action สำคัญที่ publish ไม่สำเร็จต้องไม่ทิ้ง local state เพี้ยนจากคนอื่น
* trip ถูกลบแล้วต้องไม่มี path ที่พากลับไปใช้งาน trip เดิมแบบเงียบ ๆ
* flow join/rejoin ต้องไม่สร้าง event ping-pong หรือ infinite loop

---

## Reconnect Gracefully

หาก network หลุด:

* preserve local state
* reconnect automatically
* resync trip data
* avoid user panic

## Realtime Stability Fix Notes (MVP)

ปัญหาที่แก้แล้ว:

* member re-join แล้วเกิด log/event วิ่งซ้ำไม่หยุด (loop)
* บางจังหวะลบรายการแล้วสมาชิกคนอื่นไม่อัปเดตทันที
* trip channel ค้างสถานะ (ไม่ `SUBSCRIBED`) ทำให้ publish fail เป็นพัก ๆ

แนวทางที่ใช้แก้:

* แยก `member_joined` เป็น source `join` และ `presence`
* ให้ presence reply ตอบกลับเฉพาะ event source=`join` เพื่อหยุด ping-pong loop
* backfill expense ตอบเฉพาะ `join` event
* publish event ใช้ send จริง + retry 1 ครั้งเมื่อ attempt แรกไม่ `ok`
* ถ้าเจอ cached trip channel ที่สถานะไม่พร้อม ให้ทิ้ง channel เดิมแล้วสร้างใหม่
* เมื่อ `expense_deleted` publish fail ให้ rollback local delete ทันที เพื่อลด state divergence
* หลีกเลี่ยงการวาง React hooks หลัง conditional return ในหน้า room/join เพื่อลดโอกาส crash ตอน receive `trip_deleted`

## Realtime Change Policy (Before Any New Patch)

ก่อนแก้จุดใหม่ที่แตะ realtime/db:

* อ่าน `docs/web/01-requirements.md`, `docs/web/02-design.md`, `docs/web/03-codex-rules.md`, `apps/web/AGENTS.md`
* ทำ impact check ว่าจุดที่แก้จะกระทบ scenario เดิมหรือไม่
* patch แบบ minimal scope, ไม่ย้ายสถาปัตยกรรมใหญ่
* รัน regression matrix ชุดเดิมทุกครั้งก่อนปิดงาน

---

# Trip Deletion Flow (Creator only)

```txt
Creator taps "ลบทริปนี้"
→ confirm modal (ตกลง / ยกเลิก)
→ publish trip_deleted
→ clear local snapshot + local trip bindings
→ navigate back to "/" (clean URL)
→ other members receive trip_deleted and are navigated out to "/" (clean URL)
```

ถ้าใครเปิดลิงก์ของ trip เดิมที่ถูกลบไปแล้ว:

* หน้า `/trip/:tripId` และ `/trip/:tripId/join` ต้องแสดง deleted-trip notice
* มีปุ่มกลับหน้า create trip
* มี countdown 5 วินาทีแล้ว redirect กลับ `/` อัตโนมัติ

Design rules:

* delete CTA อยู่ล่างสุดของ trip room ใน danger card
* ใช้สี danger ชัดเจน + copy เตือนผลกระทบ
* ห้ามให้ member เรียก action นี้ได้

---


# Trip Identity Design

## Anonymous Identity Model

ระบบ intentionally ไม่มี account system

Identity ใช้:

* member token
* nickname
* browser persistence

---

# Local Identity Flow

```txt
browser
→ generate member token
→ persist local identity
→ reconnect automatically
```

---

# Trip Header Design

Trip header ต้องแสดง:

* trip name (เช่น กาญจนบุรี)
* trip code (เช่น PVXS-UMVQ)

แนวทาง:

* badge เดียวสองบรรทัด
* บรรทัดบนเน้นชื่อทริป
* บรรทัดล่างตัวเล็กสำหรับ code

## Entry Screens

* `/` เป็นหน้า create trip
  * fields: `ชื่ออีเวนต์`, `ผู้สร้างอีเวนต์`, `PromptPay (required)`
* `/trip/:tripId/join?name=...` เป็นหน้า join trip
  * fields: `สมาชิก`, `PromptPay (required)`
  * มี badge แสดง trip name + code จาก URL
  * ถ้าเป็น trip เดิมที่เคย join แล้ว สามารถเข้า room ได้ทันที
  * ถ้าเป็น trip ใหม่ (code ใหม่) ต้องเข้า join หน้านี้ก่อนเสมอสำหรับ role `Member`
  * redirect ไป join ต้องทำแบบไม่ render room ให้ผู้ใช้เห็นก่อน (no room flash)

# Expense Flow Design

## 3-Second Interaction Principle

Expense flow ถูก optimize สำหรับ:

* one-hand usage
* thumb interaction
* minimal thinking
* fast completion

---

# Expense Submission Flow

```txt
tap add expense
→ enter amount
→ select category
→ submit
→ realtime sync
→ leaderboard update
→ emotional feedback
```

---

# Settlement Algorithm Design

## Settlement Philosophy

Settlement ต้อง:

* เข้าใจง่าย
* transaction น้อยที่สุด
* อ่านเร็วบนมือถือ
* ไม่ซับซ้อน

---

# Settlement Strategy

ใช้:

* balance calculation
* greedy minimization approach

เป้าหมายคือ:

* minimize transfer count
* reduce confusion
* simplify group settlement

## Payment Confirmation Interaction

* action `โอนแล้ว กดเขียว` เป็น payer-only action
* member อื่นเห็นสถานะได้แต่กดยืนยันแทนไม่ได้
* payment status ต้อง persist ใน trip snapshot เพื่อให้ rejoin แล้วสถานะไม่ย้อนกลับ
* realtime `payment_confirmed` ยังเป็นช่อง sync live ระหว่างสมาชิกในห้อง

---

# PromptPay Directory Design

## Directory Philosophy

ระบบรวมรายชื่อ PromptPay เพื่อ:

* reduce friction
* copy-and-pay flow ที่เร็วบนมือถือ
* support Thai user behavior

Language rule สำหรับ MVP 1.0:

* copy ฝั่ง UI ให้ใช้คำกลางเช่น `อีเวนต์` หรือ `กิจกรรม` เพื่อรองรับหลาย event type
* คงโครงสร้าง technical domain เดิม (`tripId`, routes, realtime event names) เพื่อไม่กระทบ business flow

## Directory Interaction Rules

* ปุ่มแก้ไข PromptPay แสดงเฉพาะเจ้าของรายการ
* owner สามารถแก้เลข PromptPay ของตัวเองผ่าน modal form
* ตอนบันทึกต้องผ่าน validation: ตัวเลขล้วน และ 10 หรือ 13 หลักเท่านั้น
* เมื่อแก้สำเร็จต้อง update จาก source เดียวกัน (`member` state) เพื่อให้ค่าใหม่สะท้อนทั้ง directory และ settlement instructions
* หลังแก้สำเร็จต้อง broadcast realtime presence update เพื่อให้สมาชิกใน room เห็นค่าใหม่ตรงกัน

ระบบ intentionally ไม่ integrate payment gateway

---

# UI Architecture Direction

## UI Personality

UI ต้องมี feeling:

* arcade racing
* road trip energy
* meme culture
* playful chaos
* mobile-native

---

# UI Rules

หลีกเลี่ยง UI feeling แบบ:

* enterprise dashboard
* fintech app
* accounting software
* corporate admin panel

---

# Motion Design Direction

Motion มีบทบาทสำคัญ

ตัวอย่าง:

* overtake animations
* leaderboard transitions
* modal transitions
* playful motion feedback

Motion ต้อง:

* smooth
* readable
* lightweight
* not overwhelming

หมายเหตุ:

* ห้ามผูก motion กับ business logic/state transition สำคัญ

---

# Responsive Design Direction

## Mobile Is Primary

Breakpoint decision ต้อง prioritize mobile ก่อนเสมอ

design for:

* 360px width
* thumb zones
* safe areas
* mobile keyboard behavior

desktop layout เป็น secondary enhancement

---

# Error Handling Design

## Error UX Should Stay Friendly

ระบบต้อง avoid:

* scary errors
* technical language
* enterprise alerts

ควรใช้:

* lightweight explanations
* friendly recovery messaging
* calm interaction flow

---

# Offline & Recovery Direction

ระบบไม่ใช่ offline-first เต็มรูปแบบ

แต่ควร:

* preserve local identity
* recover gracefully
* avoid data loss feeling
* tolerate unstable mobile networks

---

# Technical Constraints

## Explicit Constraints

MVP intentionally avoids:

* complex auth
* SSR
* backend-heavy architecture
* microservices
* complex caching systems
* advanced synchronization engines
* enterprise-grade abstractions

---

# Performance Direction

ระบบต้อง prioritize:

* fast startup
* fast interaction
* lightweight bundle
* responsive animation
* minimal loading friction

---

# Design Completion Criteria

Architecture ถือว่าสำเร็จเมื่อ:

* structure เข้าใจง่าย
* modules แยกชัด
* realtime flow predictable
* mobile UX smooth
* AI implementation reviewable
* maintainability สูง
* no over-engineering
* friction ต่ำ

---

# Final Design Direction

Pay Racing ต้อง remain:

* fun
* lightweight
* realtime
* emotional
* mobile-native
* meme-friendly
* socially chaotic

ในขณะที่ architecture ยัง:

* stable
* maintainable
* scalable enough
* reviewable
* AI-friendly
