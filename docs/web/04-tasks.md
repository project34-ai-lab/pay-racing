# 04-tasks.md

# Tasks — Pay Racing (PRC) 🏎️💨

## Purpose

เอกสารนี้ใช้สำหรับ:

* define implementation phases
* break down tasks ให้ reviewable
* reduce AI implementation chaos
* control feature scope
* guide Codex execution order

ทุก task ต้อง:

* scoped
* reviewable
* testable
* incremental

ห้าม implement everything-at-once

---

# MVP Philosophy

Pay Racing MVP ต้อง prioritize:

* fun
* speed
* realtime feeling
* mobile-first usability
* emotional interaction
* frictionless flow

มากกว่า:

* perfect architecture
* advanced features
* scalability fantasy
* over-engineering

---

# MVP Success Criteria

MVP ถือว่าสำเร็จเมื่อ:

* create trip ได้
* join trip ได้
* realtime sync ทำงาน
* add expense flow เร็ว
* leaderboard สนุก
* settlement ถูกต้อง
* PromptPay list + copy flow ใช้งานได้
* mobile UX ใช้งานจริงได้
* กลุ่มเพื่อนใช้งานจริงแล้ว “สนุก”

---

# Implementation Strategy

ใช้แนวทาง:

```txt
foundation
→ shell
→ trip flow
→ realtime
→ expense flow
→ leaderboard
→ settlement
→ polish
```

ทุก phase ต้อง stable ก่อนขยับ phase ต่อไป

## Regression Matrix (Mandatory For Realtime/DB Patches)

เมื่อมีการแก้ไขจุดที่แตะ realtime/shared state/trip lifecycle ต้อง rerun scenario นี้ก่อนปิดงาน:

* creator สร้างทริปใหม่จากหน้า `/` แล้วเข้า room ได้
* member เปิดลิงก์ทริปใหม่ครั้งแรกต้องเข้าหน้า join ก่อน
* member join สำเร็จแล้ว creator/member เห็นสมาชิกและรายการตรงกัน
* creator/member เพิ่มรายการและลบเฉพาะรายการของตัวเองได้ และยอด recalculation ตรงกันทุกเครื่อง
* member ปิด browser แล้วกลับเข้าลิงก์ trip เดิมต้อง sync state ต่อได้
* creator ลบทริปแล้วสมาชิกทุกคนถูกพาออก และลิงก์ trip เดิมแสดงหน้าแจ้งเตือน/redirect ตามกติกา

---

# Phase 0 — Project Foundation

## Goal

เตรียม frontend foundation และ development environment

---

## Task 0.1 — Initialize Project

### Requirements

* setup Vite + React + TypeScript
* enable strict TypeScript
* setup folder structure
* clean starter template
* setup absolute imports

### Acceptance Criteria

* project run ได้
* build ผ่าน
* no starter boilerplate leftover

---

## Task 0.2 — Setup Styling System

### Requirements

* install Tailwind CSS
* setup base theme
* setup dark-first tokens
* setup typography foundation
* setup spacing conventions

### Acceptance Criteria

* Tailwind ใช้งานได้
* dark background foundation พร้อม
* responsive layout ใช้งานได้

---

## Task 0.3 — Setup Core Libraries

### Requirements

ติดตั้ง:

* Zustand
* Framer Motion
* React Router
* Zod
* React Hook Form

### Acceptance Criteria

* libraries integrate ได้
* no type issues
* no unused setup

---

## Task 0.4 — Setup Base Architecture

### Requirements

สร้าง structure:

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

### Acceptance Criteria

* structure clear
* import paths stable
* architecture consistent

---

# Phase 1 — Mobile App Shell

## Goal

สร้าง mobile-first shell และ visual identity ของระบบ

---

## Task 1.1 — Build App Layout

### Requirements

* mobile-first shell
* safe-area support
* dark racing background
* global layout wrapper
* responsive centered layout

### Acceptance Criteria

* mobile layout stable
* safe area works
* desktop fallback acceptable

---

## Task 1.2 — Setup Design Tokens

### Requirements

define:

* colors
* spacing
* typography
* shadows
* glow effects
* motion timing

### Acceptance Criteria

* reusable design tokens ready
* visual consistency possible

---

## Task 1.3 — Build Base UI Components

### Components

* Button
* Card
* Modal
* Input
* Badge
* AnimatedCounter
* RealtimeStatus

### Acceptance Criteria

* reusable
* mobile-friendly
* playful visual identity
* dark-first styling

---

## Task 1.4 — Setup Motion Foundation

### Requirements

* page transition helpers
* modal motion
* button press animation
* list reorder animation utilities

### Acceptance Criteria

* Framer Motion integrated
* motion smooth on mobile
* no heavy animation lag

---

# Phase 2 — Trip Lifecycle

## Goal

ทำให้ผู้ใช้ create/join trip ได้จริง

---

## Task 2.1 — Create Trip Flow

### Requirements

* create trip action
* input trip name on create screen
* input creator name on create screen
* optional creator PromptPay input on create screen
* generate trip ID
* redirect to trip room
* generate share URL

### Acceptance Criteria

* trip create ได้
* URL usable
* reload แล้วยังเข้า trip ได้

---

## Task 2.2 — Join Trip Flow

### Requirements

* join via URL
* member name setup
* required PromptPay input
* persist local identity

### Acceptance Criteria

* join flow เร็ว
* no login required
* local identity persist ได้

---

## Task 2.3 — Local Identity System

### Requirements

persist:

* member token
* nickname
* promptpay info
* current trip reference

ผ่าน LocalStorage

### Acceptance Criteria

* refresh แล้ว identity ไม่หาย
* rejoin ได้อัตโนมัติ

---

# Phase 3 — Realtime Infrastructure

## Goal

สร้าง realtime shared trip experience

---

## Task 3.1 — Setup Realtime Client

### Requirements

* setup realtime backend connection
* connection lifecycle handling
* reconnect handling

### Acceptance Criteria

* realtime connection stable
* reconnect works

---

## Task 3.2 — Realtime Event System

### Requirements

support events:

* member_joined
* expense_created
* expense_deleted
* trip_deleted
* settlement_updated
* payment_confirmed

### Acceptance Criteria

* clients sync realtime ได้
* no duplicate events
* predictable event naming

### Stability Notes (Implemented)

* เพิ่ม `member_joined` source (`join` / `presence`) เพื่อลด loop ตอน re-join
* presence reply ตอบเฉพาะ source=`join`
* expense backfill ตอบเฉพาะ source=`join`
* publish path รองรับ retry เมื่อ send attempt แรกไม่สำเร็จ
* รองรับการทิ้ง stale trip channel แล้ว subscribe ใหม่อัตโนมัติ

---

## Task 3.3 — Realtime Status Indicator

### Requirements

show states:

* connected
* reconnecting
* offline

### Acceptance Criteria

* user understand connection state
* status not intrusive

---

# Phase 4 — Main Dashboard

## Goal

สร้าง core gameplay/dashboard experience

---

## Task 4.1 — Build Total Damage Gauge

### Requirements

* large total expense display
* emotional labels
* animated count-up
* dashboard-style visual

### Acceptance Criteria

* visually impactful
* mobile readable
* realtime update works

---

## Task 4.2 — Build Leaderboard

### Requirements

show:

* ranking
* nickname
* total paid
* creator/member role badge
* playful status

### Acceptance Criteria

* realtime reorder works
* mobile readable
* racing feeling exists

---

## Task 4.3 — Build Damage Logs

### Requirements

show:

* amount
* category
* payer
* timestamp
* playful labels

### Acceptance Criteria

* feed readable
* emotional tone preserved

---

# Phase 5 — Add Expense Flow

## Goal

สร้าง core interaction loop ของระบบ

---

## Task 5.1 — Build Add Expense Modal

### Requirements

* mobile-first modal
* large amount input
* category selection
* optional custom expense label input
* require at least one: category or custom label
* fast interaction flow

### Acceptance Criteria

* usable one-handed
* minimal friction
* no unnecessary fields

---

## Task 5.2 — Expense Submission Flow

### Requirements

on submit:

* create expense
* sync realtime
* update leaderboard
* update damage logs
* trigger emotional feedback

### Acceptance Criteria

* realtime update works
* no duplicated expense
* fast UI feedback

---

## Task 5.3 — Overtake Animation

### Requirements

when ranking changes:

* animate reorder
* highlight overtake
* show playful feedback

### Acceptance Criteria

* smooth motion
* emotionally satisfying
* no layout chaos

---

# Phase 6 — Settlement System

## Goal

จบทริปและเคลียร์เงินได้จริง

---

## Task 6.1 — Settlement Calculation Engine

### Requirements

* calculate balances
* minimize transfer count
* readable output

### Acceptance Criteria

* calculation correct
* transfer count optimized
* mobile readable

---

## Task 6.2 — Build Settlement Screen

### Requirements

show:

* who pays whom
* amount
* finish line UI
* payment status

### Acceptance Criteria

* understandable in seconds
* low cognitive load

---

## Task 6.3 — PromptPay Directory

### Requirements

* แสดงรายชื่อ PromptPay ของสมาชิกในทริป
* show member nickname + PromptPay number
* tap-to-copy ต่อรายการ

### Acceptance Criteria

* copy-to-pay flow works on mobile
* recipient info readable

---

## Task 6.4 — Payment Confirmation

### Requirements

* mark payment completed
* realtime sync confirmation

### Acceptance Criteria

* confirmation sync works
* UI clearly updated

---

# Phase 7 — Polish & Emotional UX

## Goal

เพิ่ม personality และ fun factor

---

## Task 7.1 — Add Playful Copywriting

### Requirements

replace generic wording with:

* racing tone
* meme energy
* playful interaction

### Acceptance Criteria

* no generic enterprise wording remains

---

## Task 7.2 — Add Motion Polish

### Requirements

polish:

* transitions
* leaderboard motion
* gauge reactions
* modal feeling

### Acceptance Criteria

* UI feels alive
* motion not overwhelming

---

## Task 7.3 — Empty / Error / Loading States

### Requirements

add:

* funny loading text
* friendly errors
* playful empty states

### Acceptance Criteria

* no boring generic states

---

# Phase 8 — Production Readiness

## Goal

ทำให้ระบบพร้อมใช้งานจริงในวงเพื่อน

---

## Task 8.1 — Mobile QA

### Requirements

test on:

* iPhone
* Android
* Chrome mobile
* Safari mobile

### Acceptance Criteria

* layout stable
* no broken modal
* keyboard behavior acceptable

---

## Task 8.2 — Performance Review

### Requirements

check:

* bundle size
* animation smoothness
* rerender issues
* loading speed

### Acceptance Criteria

* smooth on mid-range phones
* no obvious lag

---

## Task 8.3 — Realtime Stability Review

### Requirements

test:

* reconnect
* multiple users
* duplicate updates
* reload behavior

### Acceptance Criteria

* trip continuity reliable
* reconnect stable

---

## Task 8.4 — Production Deploy

### Requirements

deploy static app:

* Vercel
or
* Netlify
or
* GitHub Pages

### Acceptance Criteria

* public URL accessible
* realtime works in production
* mobile usage stable

---

# Post-MVP Ideas (Not Now)

ห้าม implement ใน MVP:

* account system
* social profile
* payment gateway
* receipt upload
* trip history dashboard
* AI assistant
* push notifications
* offline sync engine
* admin system
* multi-tenant architecture
* advanced analytics

---

# Task Execution Rules

## Important Rules For Codex

* implement phase-by-phase
* avoid giant PRs
* preserve mobile-first direction
* preserve product personality
* do not redesign architecture
* do not add feature creep
* keep implementation reviewable

---

# Final Task Direction

Pay Racing MVP ไม่ได้วัดความสำเร็จที่จำนวน feature

แต่วัดที่:

* คนเปิดแล้วเล่นได้ทันที
* กลุ่มเพื่อนใช้งานจริงแล้วสนุก
* จบทริปแล้วเคลียร์เงินง่าย
* UI มี personality
* realtime feeling ดี
* mobile UX smooth
* friction ต่ำมาก

หากระบบ “สนุกจนเพื่อนอยากแชร์ต่อ”

แปลว่า MVP มาถูกทางแล้ว 🏎️💨
