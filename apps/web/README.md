# Pay Racing Web

Frontend MVP for Pay Racing (mobile-first realtime trip expense chaos app).

## Requirements

- Node.js 24+ (recommended)
- pnpm 10+

## Environment Variables

Use `apps/web/.env` as the default runtime env file.
(`.env.example` is only a template reference.)

Required keys:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_ANON_KEY`

If env values are missing, the app still runs in local/demo mode but realtime sync stays offline with a friendly status message.

## Scripts

```bash
pnpm install
pnpm dev
pnpm dev:host
pnpm typecheck
pnpm build
pnpm preview
pnpm preview:host
```

`dev:host` / `preview:host` are for testing from real phones on the same Wi‑Fi.

## Local Device Review (iPhone Safari / Android Chrome)

1. Start host mode:

```bash
pnpm dev:host
```

2. Find your computer LAN IP (for example `192.168.1.40`).
3. Open on phone:
   - `http://<LAN_IP>:4173`
4. Test flow checklist:
   - landing -> input trip + creator + promptpay -> create trip -> trip room
   - join via copied URL in second device/tab -> member form (with trip/code badge) -> trip room
   - creator taps `คัดลอกลิงก์` in share card on mobile (member won't see this card)
   - add expense modal (keyboard, amount input, category tap targets)
   - leaderboard reorder + overtake feedback
   - settlement cards, PromptPay list readability/copy flow, payment confirm sync
5. Repeat with Safari and Chrome.

If the phone cannot connect, check local firewall rules and ensure both devices are on the same network.

## Realtime Troubleshooting (Local Review)

If users join the same trip URL but don't see each other or data does not sync:

1. Confirm all devices use the same URL (same `tripId` exactly).
2. Confirm all devices are on the same network.
3. Open browser console and check realtime debug logs:
   - `[PRC][Supabase] Supabase client created ...`
   - `[PRC][Realtime] Lifecycle status: SUBSCRIBED`
   - `[PRC][Realtime] [trip:XXXX-XXXX] status: SUBSCRIBED`
   - `[PRC][Realtime] [trip:XXXX-XXXX] publish expense_created => ok`
   - `[PRC][Realtime] [trip:XXXX-XXXX] recv expense_created (...)`
   - `[PRC][Realtime] UI status => connected`
4. If status stays `offline/reconnecting`, verify `.env` values and outbound internet access to Supabase from each device.
5. Supabase broadcast in this MVP is live-event sync (ephemeral), not shared database history persistence.
   If someone joins late, they receive new events after joining but not older events from before they subscribed.
6. App keeps a per-device local trip snapshot (expenses + member names) for refresh/reopen continuity on that same browser.
   Cross-device history still depends on users being online in the same realtime session.
7. Join visibility uses realtime presence (`member_joined`), so if realtime is offline each device will only see local actions.
8. Role/status UI follows trip context:
   - creator badge: `Creator`
   - joiner badge: `Member`
   - leaderboard badge: `Gold Cup` / `Silver Cup` / `Bronze Cup` for rank 1-3 (color-coded by rank).
   - join entry rule:
     - same trip code already joined before -> enter room directly
     - new trip code -> must go through join form (`Member` + `PromptPay`) first
9. Damage Logs deletion rule:
   - users can delete only their own expense entries
   - edit is not supported; delete then add a new one
   - deleting an entry recalculates totals/leaderboard/settlement immediately.
10. Trip deletion rule:
   - only `Creator` sees `ลบทริปนี้` (danger zone card at bottom)
   - action requires confirm modal (`ตกลง` / `ยกเลิก`)
   - deleting publishes realtime `trip_deleted` so active members are navigated out of the room
   - local snapshot + creator mapping + matching last-active-trip are cleared for that trip.

## Deployment Notes

Static output from `pnpm build` is in `apps/web/dist` and can be deployed to:

- Vercel
- Netlify
- GitHub Pages

Set the same `VITE_*` variables in your deployment environment.
