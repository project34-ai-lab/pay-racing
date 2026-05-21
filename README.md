# Pay Racing (PRC) 🏎️💨

> Trip expense chaos simulator disguised as a racing game.

Pay Racing (PRC) คือระบบหารเงินทริปแบบ Real-time สำหรับกลุ่มเพื่อน ที่ออกแบบมาเพื่อเปลี่ยน “ความวุ่นวายเรื่องหารเงิน” ให้กลายเป็นประสบการณ์ที่สนุก เร็ว และมี meme energy

ระบบนี้ intentionally ไม่ใช่:

* finance app
* accounting software
* banking platform
* enterprise dashboard

Pay Racing คือ:

> เกมแข่งรถสายเปย์สำหรับกลุ่มเพื่อนที่กำลังเที่ยวด้วยกัน 🚗💸

---

# Core Philosophy

Pay Racing prioritize:

* fun
* speed
* realtime feeling
* mobile-first interaction
* meme energy
* low friction

มากกว่า:

* enterprise features
* complex accounting
* heavy onboarding
* corporate UX

ผู้ใช้ควรสามารถ:

```txt
เปิด link
→ ตั้งชื่อเล่น
→ เริ่มลงค่าใช้จ่าย
```

ได้ภายในไม่กี่วินาที

---

# Main Features

## Trip Room

* create trip
* join via URL / QR
* realtime shared room
* anonymous local identity

---

## Real-Time Expense Chaos

* add expense in seconds
* realtime leaderboard
* damage logs
* overtake moments
* racing-themed interaction

---

## Settlement System

* auto balance calculation
* minimize transfer count
* PromptPay QR generation
* payment confirmation

Pay Racing ไม่ processเงินจริง

ระบบมีหน้าที่เพียง:

* calculate
* coordinate
* generate QR
* help friends settle easier

---

# Tech Stack

## Frontend

* React
* TypeScript
* Vite
* Tailwind CSS
* Zustand
* Framer Motion

## Realtime & Persistence

* Supabase Realtime
* Supabase Postgres

## Deployment

* Vercel
or
* Netlify
or
* GitHub Pages

---

# Monorepo Structure

```txt
pay-racing/
├── docs/
├── apps/
│   └── web/
└── README.md
```

---

# Documentation Strategy

## Group A — Engineering Standards

Shared engineering doctrine used across projects:

```txt
docs/
├── 01-engineering-principles.md
├── 02-architecture-principles.md
├── 03-prompting-guide.md
├── 04-review-checklist.md
└── 05-git-strategy.md
```

---

## Group B — Project Direction

Project-specific product and domain context:

```txt
docs/
├── 06-project-direction.md
└── 07-domain-language.md
```

---

## Group C — Service-Specific Docs

Frontend implementation docs:

```txt
docs/web/
├── 01-requirements.md
├── 02-design.md
├── 03-codex-rules.md
├── 04-tasks.md
└── 05-ui-design-system.md
```

---

# AI-Native Engineering Workflow

Project นี้ใช้แนวทาง:

> one-man AI engineering team

Roles:

* Human → Architect / Operator / Decision Maker
* ChatGPT → Senior AI Architect Copilot
* Codex → High-speed Implementation Swarm

Workflow:

```txt
Requirement
→ Design
→ Tasks
→ Docs Alignment
→ Codex Onboarding
→ Scoped Implementation
→ Review
→ Iterate
```

ไม่มีแนวทาง:

```txt
1 prompt
→ 1 complete app
```

เด็ดขาด

---

# AGENTS.md

Local implementation rules สำหรับ Codex อยู่ที่:

```txt
apps/web/AGENTS.md
```

Codex ต้องอ่านและ align กับ docs ทั้งหมดก่อน implementation

---

# Product Direction

Pay Racing ต้อง remain:

* lightweight
* realtime
* fun
* mobile-native
* meme-powered
* socially chaotic
* frictionless

แม้ระบบจะ evolve ต่อไปในอนาคต

---

# Current Status

Current Phase:

```txt
MVP Phase Complete (Foundation → Settlement)
```

Ready for:

```txt
Mobile QA + Performance Hardening
→ Realtime Reliability Pass
→ Production Deployment
```

---

# Final Direction

Pay Racing ไม่ได้พยายามเป็นระบบบัญชีที่ดีที่สุด

แต่พยายามเป็น:

> “ระบบที่ทำให้เพื่อนหัวเราะได้ แม้ตอนกำลังหารเงินกันอยู่” 🏁
