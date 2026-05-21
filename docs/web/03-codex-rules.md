# 03-codex-rules.md

# Codex Rules — Pay Racing (PRC) 🏎️💨

## Purpose

เอกสารนี้กำหนด implementation rules, architectural constraints, UI rules, และ operational guardrails สำหรับ Codex และ AI implementation workers

เป้าหมายคือ:

* ลด implementation drift
* รักษา product identity
* รักษา architecture consistency
* ป้องกัน over-engineering
* ป้องกัน generic enterprise UI
* ทำให้ implementation reviewable และ predictable

Codex ต้องอ่านเอกสารนี้ก่อน implementation ทุกครั้ง

---

# Core Operating Principle

Codex ไม่ใช่ product designer  
และไม่ใช่ system architect หลัก

Codex มีหน้าที่:

* implement
* refine
* improve
* preserve direction

ภายใต้ architecture และ product direction ที่กำหนดไว้แล้ว

Codex ห้าม:

* redesign product identity เอง
* invent architecture ใหม่เอง
* เพิ่ม feature นอก scope
* เปลี่ยน UX direction เอง
* เปลี่ยน domain language เอง

---

# Project Identity Rules

## Pay Racing Is NOT

ห้ามทำให้ระบบกลายเป็น:

* finance dashboard
* banking app
* accounting software
* enterprise admin panel
* CRUD management system
* boring SaaS dashboard

---

## Pay Racing MUST Feel Like

ทุก implementation ต้อง reinforce feeling แบบ:

* arcade racing
* road trip chaos
* meme energy
* friend-group interaction
* playful competition
* fast mobile interaction

---

# Architecture Rules

## Keep Architecture Lightweight

ห้ามเพิ่ม architecture complexity โดยไม่จำเป็น

หลีกเลี่ยง:

* unnecessary abstraction
* enterprise patterns
* premature scalability
* generic framework layering
* over-separated architecture
* microservice mindset
* CQRS/event sourcing complexity
* giant shared utility systems

ระบบนี้ intentionally lightweight

---

## Frontend-First Philosophy

ระบบนี้เป็น:

* frontend-first
* client-heavy
* realtime synchronized
* mobile-first

Codex ห้ามพยายาม:

* convert ไป SSR
* เพิ่ม backend complexity
* เพิ่ม traditional API architecture
* เพิ่ม auth server
* เพิ่ม admin backend

โดยไม่มี explicit instruction

---

## Prefer Explicit Structures

ห้ามซ่อน business flow ผ่าน:

* magic hooks
* implicit side effects
* hidden shared state
* overly generic helpers

logic ต้อง:

* explicit
* readable
* reviewable
* predictable

---

# TypeScript Rules

## Strict TypeScript Required

ห้ามใช้:

```ts
any
```

ห้าม bypass typing โดยไม่จำเป็น

ต้อง define:

* domain types
* payload types
* realtime event types
* component props
* store contracts

---

## Domain Types First

ก่อน implement feature ใหม่:

* define types
* define contracts
* define state shape

แล้วค่อย implement UI

---

# State Management Rules

## Zustand Rules

ใช้ Zustand แยกตาม concern

ตัวอย่าง:

* trip store
* expense store
* settlement store
* realtime store

---

## Avoid Giant Global Store

ห้ามสร้าง:

* mega store
* god state
* giant context provider

state ต้อง localized เท่าที่เหมาะสม

---

## Local UI State

ใช้ local component state สำหรับ:

* modal visibility
* animation state
* temporary form interaction
* transient UI state

ไม่ต้องยัดทุกอย่างเข้า global store

---

# Component Rules

## Components Must Stay Small

component ควร:

* มี responsibility เดียว
* readable
* composable
* mobile-friendly

หลีกเลี่ยง:

* giant component
* business logic heavy component
* 500-line JSX file

---

## UI Components Should Be Dumb

Reusable components ควร:

* focus ที่ presentation
* รับ props ชัดเจน
* ไม่มี hidden business logic

---

## Feature Logic Belongs To Modules

logic ควรอยู่ใน:

* modules/
* hooks/
* services/
* stores/

ไม่ใช่กระจายมั่วใน component tree

---

# Realtime Rules

## Realtime Feeling Is Core

Realtime ไม่ใช่ optional enhancement

ทุก feature ที่เกี่ยวกับ:

* expense
* leaderboard
* settlement
* payment confirmation

ต้อง support realtime feeling

---

## Realtime Event Naming

event naming ต้อง explicit

ตัวอย่าง:

```txt
expense_created
expense_deleted
trip_deleted
member_joined
payment_confirmed
```

ห้ามใช้:

```txt
updateData
syncEvent
message
```

---

## Realtime/DB Patch Protocol (Mandatory)

เมื่อแก้งานที่แตะ `realtime`, `trip lifecycle`, `shared state`, `local snapshot`:

* ต้องอ่าน docs ที่เกี่ยวข้องก่อนทุกครั้ง (`docs/web/01`, `docs/web/02`, `docs/web/03`, `docs/web/04`, `apps/web/AGENTS.md`)
* ต้องอธิบาย event contract ที่เกี่ยวข้องก่อนลงมือแก้ (name/payload/source/dedupe/retry)
* ต้องทำ impact analysis กับ scenario เดิมที่เคยผ่านแล้ว
* patch ต้อง minimal scope และ reviewable
* หลังแก้เสร็จต้อง sync docs ทันที

---

## Reconnect Gracefully

หาก realtime หลุด:

* preserve local identity
* reconnect automatically
* resync state safely
* avoid full-page panic reload

---

## Hook Safety Rules (Runtime Stability)

* ห้ามวาง React hooks หลัง conditional return
* ห้ามทำให้ hook order เปลี่ยนตาม state transition
* หน้า route ที่รับ realtime event ได้ (room/join) ต้องคง hook topology ตลอดอายุ component

---

## Regression Gate (Required Before Close)

ขั้นต่ำต้องเช็ก:

* create trip → join member → sync expense create/delete
* rejoin link เดิม (trip เดิม) แล้ว sync ต่อได้
* open link trip ใหม่ (trip ใหม่) แล้วต้องผ่าน join flow ใหม่
* creator delete trip แล้วทุกคนออกจากห้อง + old link behavior ถูกต้อง

---

# Mobile-First Rules

## Mobile Is Primary

ทุก UI decision ต้อง optimize mobile ก่อน

design target:

* thumb interaction
* portrait mode
* 360-414px width
* one-hand usage

Desktop support เป็น secondary enhancement

---

## Big Tap Targets Required

buttons, categories, actions ต้อง:

* แตะง่าย
* spacing ชัด
* readable

ห้ามใช้:

* tiny action buttons
* dense desktop tables
* small click targets

---

# UI Identity Rules

## Avoid Generic SaaS UI

Codex ห้าม generate UI แบบ:

* admin dashboard template
* sidebar-heavy enterprise UI
* plain white SaaS layout
* spreadsheet-looking interface

---

## Use Racing & Meme Energy

UI ต้อง reinforce:

* racing
* speed
* damage
* overtake
* chaos
* friend interaction

---

## Use Playful Copy

ห้ามใช้ copy แบบ generic enterprise app

---

## Allowed Examples

```txt
บันทึกรายการเรียบร้อยแล้ว
มินแซงขึ้นอันดับ 1 🚗💨
ปิดสนาม 🏁
```

---

## Forbidden Examples

```txt
Expense created successfully
Submit form
Update completed
Financial summary generated
```

---

# Motion & Animation Rules

## Framer Motion Is Mandatory For Important Motion

ใช้ Framer Motion สำหรับ:

* page transitions
* modal transitions
* leaderboard animations
* overtake animations
* gauge animations
* settlement reveal

---

## Motion Must Feel Fast

motion ต้อง:

* quick
* responsive
* readable
* lightweight

---

## Avoid Heavy Motion

ห้าม:

* long cinematic animations
* excessive particle systems
* heavy canvas rendering
* laggy transitions
* motion that blocks interaction

---

## Performance-Aware Animation

Animation ต้อง optimize mobile performance

prefer animating:

* transform
* opacity

หลีกเลี่ยง animation ที่ trigger layout reflow หนักโดยไม่จำเป็น :contentReference[oaicite:0]{index=0}

---

## Motion Purpose Rule

ทุก animation ต้องมี purpose

allowed purposes:

* feedback
* orientation
* emotional reinforcement
* realtime emphasis
* interaction clarity

ห้ามใส่ animation เพื่อ “โชว์เท่” อย่างเดียว

---

# Styling Rules

## Tailwind CSS Only

ใช้ Tailwind CSS เป็น styling system หลัก

หลีกเลี่ยง:

* inline style จำนวนมาก
* mixed styling approaches
* CSS chaos

---

## Dark-First UI

Pay Racing ใช้ dark-first visual identity

ห้าม generate:

* bright white fintech dashboard
* sterile enterprise look

---

# UX Rules

## 3-Second Expense Rule

expense flow ต้องเร็วมาก

target:

```txt
tap
→ amount
→ category
→ submit
```

ห้ามเพิ่ม:

* unnecessary fields
* long forms
* confirmation walls
* complex setup

---

## Frictionless Over Feature Richness

ถ้าต้องเลือกระหว่าง:

* feature complexity
* fast interaction

ให้ prioritize fast interaction ก่อน

---

# Settlement Rules

## Settlement Must Be Easy To Read

settlement screen ต้อง:

* readable in seconds
* low cognitive load
* clear payment direction
* minimal confusion

---

## Payment Boundary

Codex ห้าม:

* integrate payment gateway
* implement banking logic
* processเงินจริง
* store banking credentials

Pay Racing มีหน้าที่เพียง:

* calculate
* coordinate
* aggregate PromptPay list + copy flow
* confirm socially

---

# Dependency Rules

## Avoid Heavy Dependencies

ก่อนเพิ่ม package ใหม่:

ต้องถาม:

* ใช้ native solution ได้ไหม?
* package นี้จำเป็นจริงไหม?
* bundle size จะหนักไหม?
* mobile performance จะเสียไหม?

---

## Allowed Dependency Direction

prefer:

* lightweight
* focused
* actively maintained
* mobile-friendly

---

# Performance Rules

## Mobile Performance Is Critical

ระบบต้อง:

* load fast
* feel responsive
* animate smoothly
* work on mid-range phones

---

## Avoid Over-Rendering

หลีกเลี่ยง:

* unnecessary rerenders
* giant derived state
* animation-triggered rerender storms
* state explosion

---

# File Structure Rules

## Respect Existing Structure

Codex ห้าม:

* invent random folder structures
* duplicate patterns
* create parallel architecture styles

ก่อนสร้างใหม่:

* inspect existing patterns
* reuse conventions
* preserve consistency

---

# Naming Rules

## Naming Must Be Explicit

prefer:

```txt
ExpenseLeaderboard
SettlementSummary
DamageGauge
TripRealtimeStatus
```

avoid:

```txt
DataCard
Manager
Helper
Thing
Utils
```

---

# Reviewability Rules

## Small Scoped Changes Preferred

Codex ต้อง prefer:

* small changes
* isolated commits
* focused implementation
* reviewable diff

หลีกเลี่ยง giant refactor โดยไม่จำเป็น

---

# Forbidden Behaviors

Codex ห้าม:

* redesign product identity
* introduce enterprise UI
* replace architecture direction
* add unnecessary abstractions
* convert app into CRUD dashboard
* add auth system
* add admin panel
* add unnecessary backend
* add feature creep
* ignore mobile-first direction
* ignore domain language
* replace playful copy with corporate wording

---

# First Principle During Implementation

หากไม่แน่ใจว่า implementation direction ถูกหรือไม่ ให้ถามตัวเองว่า:

> “สิ่งนี้ยังรู้สึกเหมือนเกมแข่งรถสายเปย์ของกลุ่มเพื่อนอยู่ไหม?”

ถ้าคำตอบคือ “ไม่”
แปลว่า implementation กำลัง drift ออกจาก Pay Racing identity

---

# Final Codex Direction

Codex ต้อง preserve:

* fun
* speed
* simplicity
* meme energy
* realtime feeling
* mobile-first interaction
* playful chaos
* racing identity

พร้อมกับรักษา:

* maintainability
* readability
* performance
* reviewability
* architectural consistency

Pay Racing ไม่ต้อง perfect  
แต่ต้อง:

> สนุก ใช้ง่าย และมี personality ตั้งแต่เปิดหน้าจอแรก
