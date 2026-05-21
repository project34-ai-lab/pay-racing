# 05-ui-design-system.md

# UI Design System — Pay Racing (PRC) 🏎️💨

## Purpose

เอกสารนี้กำหนด visual direction, mood & tone, art direction, interaction pattern, motion behavior, component style, และ UI rules ของ Pay Racing Web Application

เป้าหมายคือให้ Codex และ AI implementation worker เข้าใจชัดเจนว่า Pay Racing ไม่ใช่ UI แบบ finance app, dashboard app หรือ enterprise system

Pay Racing ต้องให้ความรู้สึกเหมือน:

> “เกมแข่งรถสายเปย์สำหรับกลุ่มเพื่อนที่กำลังเที่ยวด้วยกัน”

ระบบต้องสนุก เร็ว กวน มีม และใช้งานง่ายมากบนมือถือ

---

# Core UI Identity

Pay Racing UI ต้องมีบุคลิก:

* funny
* fast
* loud
* energetic
* playful
* meme-able
* chaotic but usable
* arcade racing inspired
* mobile-first
* friend-group friendly

ระบบต้องหลีกเลี่ยงความรู้สึกแบบ:

* corporate
* fintech
* banking
* accounting
* enterprise dashboard
* boring admin panel
* serious productivity tool

---

# Art Direction

## Main Art Direction

Pay Racing ใช้ art direction แบบ:

> Retro Arcade Racing + Road Trip Chaos + Meme Energy

ภาพรวมควรให้อารมณ์เหมือน:

* เกมแข่งรถตู้อาร์เคดยุค 90s-2000s
* dashboard รถแข่ง
* ปั๊มน้ำมันกลางทาง
* road trip กับเพื่อน
* sticker meme ใน group chat
* racing poster / speed line / comic reaction
* energy drink chaos
* “ใครเปย์หนักสุดในทริปนี้วะ”

---

# Visual References

Codex ควรใช้ reference เหล่านี้เป็น mood inspiration เท่านั้น  
ห้าม copy asset, logo, character, หรือ copyrighted UI โดยตรง

## Reference Mood

* Initial D — mountain racing energy, speed, night road feeling
* OutRun — retro arcade road trip feeling
* Mario Kart — playful racing chaos
* Crazy Taxi — loud arcade city energy
* Wangan Midnight — highway speed and dashboard tension
* old arcade racing cabinet UI — big numbers, bold labels, dramatic feedback
* Thai road trip culture — ปั๊มน้ำมัน, คาเฟ่, หมูกระทะ, รีสอร์ต, ทางด่วน
* LINE sticker energy — ขำ กวน เข้าใจเร็ว

---

# Design Keywords

ใช้ keywords เหล่านี้เป็น design compass:

* Racing
* Damage
* Overtake
* Speed
* Turbo
* Drift
* Chaos
* Pay
* Friend Trip
* Meme
* Arcade
* Neon
* Dashboard
* Finish Line

---

# Mood & Tone

## Desired Feeling

ผู้ใช้ควรรู้สึกว่า:

* เปิด link แล้วอยากลองเล่นทันที
* ระบบดูไม่เครียด
* การลงค่าใช้จ่ายกลายเป็นเรื่องขำ
* leaderboard ทำให้เพื่อนแซวกันได้
* จบทริปแล้วเคลียร์เงินง่ายและไม่ awkward

---

## UI Copy Tone

ข้อความใน UI ต้องเหมือนเพื่อนคุยกัน

ใช้ภาษา:

* สั้น
* กวน
* มี energy
* อ่านเร็ว
* เข้าใจเร็ว
* ไม่เป็นทางการเกินไป

---

## Good Copy Examples

ใช้แนวนี้:

* “บันทึกรายการเรียบร้อยแล้ว”
* “ใครเปย์หนักสุดตอนนี้?”
* “ล้อฟรีกระเป๋าฉีก 💸”
* “มินแซงขึ้นอันดับ 1 แล้ว!”
* “บันทึกรายการเลย 🚗✨”
* “เปิดทริปใหม่ 🏁”
* “ปิดสนาม สรุปยอด!”
* “จ่ายครบแล้ว แยกย้ายนอน 🟢”
* “หมูกระทะทำพิษอีกแล้ว 🍖”
* “เติมน้ำมันที กระเป๋าสั่นเลย 🔥”
* “Trip: กาญจนบุรี”
* “code: PVXS-UMVQ”
* “Creator: DriftNoi”
* “Member: RouteRider”

---

## Bad Copy Examples

ห้ามใช้แนวนี้:

* “Expense created successfully”
* “Transaction completed”
* “Payment status updated”
* “Financial summary generated”
* “User profile saved”
* “Submit form”
* “Data synchronized”

---

# Visual Style

## Overall Look

UI ควรเป็น:

* dark-first
* high contrast
* colorful accent
* racing dashboard inspired
* rounded but bold
* playful
* readable on mobile

ไม่ควรเป็น:

* minimal white SaaS
* plain dashboard
* spreadsheet-like
* banking app style

---

# Color Direction

## Base Colors

ใช้ dark background เป็นหลัก:

* asphalt black
* midnight navy
* deep charcoal
* dark racing cockpit

## Accent Colors

ใช้สี accent แบบ arcade/racing:

* turbo red
* neon yellow
* electric blue
* toxic green
* hot orange
* purple glow

## Usage Rules

* ใช้ red/orange สำหรับ action สำคัญ เช่น “เหยียบคันเร่ง”
* ใช้ green สำหรับ payment completed
* ใช้ yellow/gold สำหรับ leader / creator / top spender badges
* ใช้ blue/purple สำหรับ realtime/sync feeling
* หลีกเลี่ยงสีเทาจืด ๆ แบบ enterprise dashboard

---

# Typography Direction

## Typography Feeling

ตัวอักษรควร:

* bold
* punchy
* readable
* arcade-friendly
* mobile-readable

## Recommended Style

* Headline: extra bold / black weight
* Numbers: large, digital-feeling, strong contrast
* Body: readable Thai-friendly font
* Buttons: bold, short, high impact

## Font Guidance

ถ้าใช้ Google Fonts หรือ system fonts ให้เลือกแนว:

* Thai readable
* thick enough for mobile
* not too formal
* not too cute จนอ่านยาก

แนะนำแนว font:

* Noto Sans Thai
* IBM Plex Sans Thai
* Prompt
* Chakra Petch สำหรับ racing/digital feeling ในบางจุด

ใช้ font ไม่เกิน 2 families

---

# Layout Principles

## Mobile-First

ออกแบบสำหรับ mobile portrait ก่อนเสมอ

Primary screen width:

* 360px
* 390px
* 414px

Desktop เป็น secondary enhancement

---

## One-Hand Usage

ปุ่มสำคัญควรอยู่ในตำแหน่งที่นิ้วโป้งแตะง่าย

หลีกเลี่ยง action สำคัญที่อยู่สูงเกินไปหรือเล็กเกินไป

---

## Screen Density

UI ต้อง energetic แต่ห้ามรกจนใช้งานยาก

ให้ใช้หลัก:

* big number
* short label
* obvious action
* clear hierarchy
* fewer decisions

---

# Main Screen Composition

Main dashboard ควรมีลำดับ visual priority:

1. Total Damage Gauge
2. Leaderboard
3. Add Expense Button
4. Damage Logs
5. Finish Trip Action

Share link card:

* แสดงลิงก์ครบถ้วน
* มีปุ่ม `คัดลอกลิงก์` แบบแตะครั้งเดียว
* มี success feedback สั้น ๆ หลังคัดลอก
* แสดงเฉพาะ role `Creator`

Delete trip card:

* แสดงเฉพาะ role `Creator`
* วางล่างสุดของหน้า room เป็น `Danger Zone`
* ปุ่ม `ลบทริปนี้` ต้องใช้โทนสี danger ชัดเจน
* ต้องมี confirm modal ก่อน execute เสมอ (`ตกลง` / `ยกเลิก`)
* ใน confirm modal ปุ่ม action ต้อง full-width และเรียงบน-ล่าง

---

# Component Design Rules

## Buttons

Buttons ต้อง:

* ใหญ่
* แตะง่าย
* มี energy
* label สั้น
* visual feedback ชัด

Primary button example:

* “บันทึกรายการเลย 🚗✨”
* “+ ออกตังค์”
* “ปิดสนาม 🏁”

Button style:

* rounded-xl หรือ rounded-2xl
* bold text
* strong shadow/glow
* active scale feedback
* high contrast

---

## Cards

Cards ควรเหมือน racing panels หรือ dashboard panels

Style:

* dark surface
* subtle border
* glow accent
* rounded corners
* strong inner spacing
* clear title

ไม่ควรเป็น plain white card

---

## Total Damage Gauge

Gauge คือ hero component

ต้อง:

* ใหญ่
* เด่น
* อ่านยอดรวมได้ทันที
* มี emotional label
* มี racing/dashboard feeling

ตัวอย่าง content:

```txt
TOTAL DAMAGE
฿ 8,420
ล้อฟรีกระเป๋าฉีก 💸
```

Possible visual:

* speedometer-inspired
* digital counter
* glowing meter
* animated number count-up

---

## Leaderboard

Leaderboard คือสนามแข่งหลัก

ต้องแสดง:

* member ranking
* nickname
* total paid
* number of paid stages
* creator/member status badge
* top spender badge (rank 1-3)
  * rank 1 = gold cup color
  * rank 2 = silver cup color
  * rank 3 = bronze cup color
* car/racer identity

ควรมี:

* animated reorder
* overtake feedback
* car icon / racing marker
* rank badge
* playful status

ตัวอย่าง:

```txt
#1 [trophy: gold] Gold Cup • 🏁 Creator: Min — ฿3,200 — จ่ายไปแล้ว 4 ด่าน
#2 [trophy: silver] Silver Cup • 🤝 Member: Ohm — ฿2,100 — กำลังตามมา
#3 [trophy: bronze] Bronze Cup • 🤝 Member: Prae — ฿980 — ยังประหยัดอยู่
```

---

## Damage Logs

Damage Logs ต้องไม่เหมือน accounting table

ควรเป็น feed / battle log / race log

กติกา interaction:

* Creator/Member ลบได้เฉพาะรายการที่ตัวเองสร้าง
* ไม่รองรับ edit รายการ
* ถ้ากรอกผิดให้ลบแล้วเพิ่มใหม่

ตัวอย่าง:

```txt
🍖 หมูกระทะทำพิษ — ฿1,290 — มินออกไปก่อน
🔥 น้ำมันพ่นไฟ — ฿1,000 — โอมรับจบ
🏰 ซุกหัวนอน — ฿3,500 — แพรปาดไป
```

ควรเรียงจากยอดสูงไปต่ำใน MVP

---

## Add Expense Modal

Modal ต้องออกแบบเหมือน quick racing action

Requirements:

* เต็มจอหรือเกือบเต็มจอบน mobile
* ใช้ปุ่มใหญ่
* input ใหญ่
* category เห็นชัด
* submit button ใหญ่มาก

Flow:

```txt
amount
→ category and/or custom label
→ submit
```

ห้ามใส่ field เยอะ

กติกา input:

* `category` ไม่บังคับถ้ามี custom label
* custom label ไม่บังคับถ้ามี `category`
* ต้องมีอย่างน้อยหนึ่งอย่างระหว่าง `category` หรือ custom label

---

## Expense Category Buttons

Category buttons ต้อง emoji-first

MVP categories:

* ⛽ ค่าน้ำมัน / ค่าเดินทาง
* 🍽️ ค่าอาหาร / เครื่องดื่ม
* 🏨 ค่าที่พัก
* ☕ กาแฟ / ของว่าง
* 🎟️ ค่าเข้า / ค่าบัตร
* 🚕 ค่าเดินทางในเมือง
* 🧰 ค่าอุปกรณ์ / ค่าเช่า
* 🧾 ค่าใช้จ่ายจิปาถะ

Style:

* large tap area
* emoji ใหญ่
* selected state ชัด
* playful label

---

## Settlement Screen

Settlement screen ต้อง:

* สรุปเร็ว
* อ่านง่าย
* ไม่เหมือนใบแจ้งหนี้
* มี finish line energy
* รายการโอนหลายคู่ต้องอยู่ใน list ภายในการ์ดหลักเดียวกัน

ตัวอย่าง:

```txt
🏁 เข้าเส้นชัยแล้ว!

โอมหยอดให้มิน
฿420

คัดลอก PromptPay แล้วกลับมากดเขียวได้เลย
```

---

## PromptPay Directory Display

PromptPay section ต้อง:

* แสดง list อ่านง่ายแบบ mobile
* show recipient/member name
* show PromptPay number ชัด
* มีปุ่มคัดลอกแต่ละรายการ
* มี instruction สั้น

Settlement instruction list ต้อง:

* แสดง `ใครโอนให้ใคร` ชัดเจน
* แสดงจำนวนเงิน + สถานะ
* แสดง PromptPay ของผู้รับ
* มีปุ่มคัดลอก PromptPay ต่อรายการ

ลำดับในหน้าสรุปยอด:

* แสดง `รายการโอนสรุปยอด` ก่อน
* ตามด้วย `รายชื่อ PromptPay ในอีเวนต์`

Boundary copy:

```txt
Pay Racing แค่ช่วยสรุปยอดและรวม PromptPay
โอนเงินจริงผ่านแอปธนาคารของแต่ละคน
```

---

# Motion & Animation

## Motion Framework

ใช้ Framer Motion เป็นหลัก

Motion ต้อง support:

* page transition
* modal transition
* leaderboard reorder
* overtake animation
* button press
* damage count-up
* settlement reveal

---

# Motion Principles

Motion ต้อง:

* สนุก
* เร็ว
* readable
* ไม่เวียนหัว
* ไม่ delay task
* ไม่ทำให้ app หนัก

หลีกเลี่ยง animation ที่:

* slow เกิน
* decorative-only มากเกิน
* block interaction
* ทำให้ mobile lag

---

# Recommended Motion Patterns

## Button Press

* scale down เล็กน้อย
* quick spring back
* optional vibration-like feel

## Add Expense Success

* small screen shake
* speed line / burst effect
* short success copy
* leaderboard update

## Leaderboard Overtake

เมื่อ ranking เปลี่ยน:

* item move smoothly
* top item glow
* overtake message
* optional smoke/speed effect

## Damage Gauge Update

เมื่อยอดรวมเพิ่ม:

* count up number
* glow pulse
* damage message update
* subtle shake เมื่อยอดสูงมาก

## Modal Open

* slide up from bottom
* spring motion
* mobile-native feeling

## Settlement Reveal

* finish flag feeling
* staggered reveal
* clear pay instructions

---

# Animation Timing Guidance

ใช้ timing โดยประมาณ:

* micro interaction: 100-180ms
* modal transition: 200-320ms
* leaderboard reorder: 300-500ms
* success burst: 400-700ms
* page transition: 200-350ms

ห้ามทำ animation ยาวจนผู้ใช้รู้สึกช้า

---

# Sound Direction

MVP ยังไม่จำเป็นต้องมี sound

แต่ design ควรเผื่ออนาคตสำหรับ:

* engine rev
* coin/cash sound
* drift sound
* finish flag sound
* overtake sound

ถ้าเพิ่ม sound ในอนาคต:

* ต้อง default off หรือ user-controlled
* ห้าม auto-play รบกวน
* ต้องเหมาะกับ mobile browser limitations

---

# Icon & Emoji Direction

ใช้ emoji เป็น part of product identity ได้

Emoji ใช้เพื่อ:

* reduce reading time
* create meme feeling
* make categories memorable
* increase emotional expression

ใช้ emoji อย่างมีระบบ  
ไม่ spam จนรก

Favicon guideline:

* ใช้สัญลักษณ์แนว racing/energy ที่อ่านง่ายบนแท็บ browser
* โทนสีสอดคล้องกับระบบ (dark base + accent)

---

# Visual Effects

Allowed effects:

* glow
* speed lines
* confetti-lite
* smoke puff
* shake
* pulse
* rank highlight
* neon border

Avoid:

* heavy particle systems
* huge video backgrounds
* complex canvas effects
* effects that hurt performance

---

# Empty States

Empty state ต้อง playful

Examples:

```txt
ยังไม่มีรายการค่าใช้จ่าย ลองเพิ่มรายการแรกได้เลย 🐢
เริ่มออกตังค์คนแรก แล้วอีเวนต์จะคึกขึ้นทันที 🔥
```

Avoid:

```txt
No data available
```

---

# Loading States

Loading ต้องไม่ boring

Examples:

```txt
กำลังสตาร์ทเครื่องยนต์...
กำลังเปิดสนาม...
กำลังเรียกเพื่อนเข้าพิท...
```

Avoid:

```txt
Loading...
```

---

# Error States

Error ต้อง friendly และ recoverable

Examples:

```txt
สัญญาณหลุดเหมือนรถตกหลุม ลองใหม่อีกที
สนามยังไม่พร้อม ลอง refresh ดูเพื่อน
หาทริปนี้ไม่เจอ อาจเข้าผิดสนาม
```

Avoid:

```txt
Unexpected error occurred
Internal server error
Request failed
```

---

# Realtime Status UI

ควรมี realtime status แบบไม่กวน

States:

* connected
* reconnecting
* offline
* synced

Example copy:

```txt
🟢 อยู่ในสนามเดียวกัน
🟡 กำลังต่อสัญญาณใหม่
🔴 หลุดจากสนามชั่วคราว
```

---

# Accessibility Rules

แม้ UI จะสนุก แต่ต้องใช้งานจริงได้

ต้องรักษา:

* text readable
* contrast เพียงพอ
* tap target ใหญ่พอ
* ไม่พึ่งสีอย่างเดียว
* animation ไม่ทำให้เวียนหัว
* number formatting ชัดเจน

---

# Responsive Rules

## Mobile

Primary layout:

* single column
* bottom action area
* large CTA
* vertical scroll acceptable
* sticky add expense button acceptable

## Desktop

Desktop layout เป็น enhancement ได้ เช่น:

* centered mobile frame
* wider dashboard
* two-column layout

แต่ห้ามทำให้ mobile experience แย่ลง

---

# UI Anti-Patterns

ห้ามทำ UI แบบนี้:

* plain CRUD dashboard
* table-first accounting layout
* enterprise admin sidebar
* tiny buttons
* long forms
* over-serious finance copy
* too many settings
* too many menu levels
* boring empty state
* generic toast messages

---

# Implementation Guidance For Codex

Codex ต้อง:

* ใช้ Tailwind CSS เป็น styling หลัก
* ใช้ Framer Motion สำหรับ motion ที่สำคัญ
* สร้าง component แยกตาม responsibility
* ทำ UI mobile-first ก่อน
* ใช้ playful copy ตาม domain language
* หลีกเลี่ยง generic business wording
* หลีกเลี่ยง over-designed enterprise UI
* รักษา performance บนมือถือ
* ไม่เพิ่ม dependency หนักโดยไม่จำเป็น

---

# First UI Milestone

UI version แรกควรมี:

* mobile shell
* dark racing background
* total damage gauge
* leaderboard card
* damage log list
* add expense modal
* category buttons
* settlement screen
* realtime status indicator
* playful copywriting

ยังไม่ต้อง perfect  
แต่ต้อง feel like Pay Racing ตั้งแต่ version แรก

---

# Final UI Direction

Pay Racing UI ต้องทำให้ผู้ใช้รู้สึกว่า:

> “นี่ไม่ใช่แอปหารเงิน นี่คือสนามแข่งของคนเปย์หนักประจำทริป”

ทุก component ต้องช่วย reinforce:

* fun
* speed
* chaos
* friendship
* meme energy
* mobile ease
* racing identity

หาก UI ดูเหมือน finance dashboard แปลว่าผิดทาง

หาก UI ทำให้เพื่อนอยากแซวกัน แปลว่าถูกทาง
