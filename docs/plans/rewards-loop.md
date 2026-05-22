# Plan: Close the Points → Rewards Loop

> Status: proposed. Lives in `docs/plans/`. Promote items to `docs/calendar-roadmap.md` when shipped.

## Why this matters

Today, points are a vanity number. Kids see them climb on the scoreboard and that's it. The 2-week novelty curve is real — once "watch number go up" wears off, the chore engine has no second-stage motivator.

Skylight, Cozi, and the rest of the family-ops space all converged on the same answer: **points have to buy something.** This plan closes that loop with the minimum surface area needed to make rewards feel real, without turning into an economy simulator.

## Objectives (ranked)

1. **A point must be redeemable for something tangible within the week it was earned.** Otherwise it's not a reward, it's a leaderboard.
2. **Kids initiate redemption; parents approve.** Mirrors the real-world dynamic and reuses the existing `verified_by` / `verified_at` fields already in the schema.
3. **Catalog is editable by parents without code.** Lesson learned from `event-rules.ts` — anything that needs to grow over time has to live in the DB with an admin UI.
4. **The scoreboard becomes a "wallet."** Earned − Redeemed = Balance. One glance answers "what can I afford?"
5. **No real money, no gift cards, no third-party integrations.** Rewards are things parents already give: screen time, allowance, a treat, picking the movie. Software just tracks them.

## Non-goals (explicit skip list)

- Tiered/seasonal rewards, badges, achievements — feature creep
- Trading points between kids — opens disputes, no upside
- Auto-redemption (e.g. "10 pts/day auto-converts to 20 min screen time") — removes the moment of agency that makes redemption rewarding
- Refunds / clawbacks of redeemed points — once approved, it's spent
- Pricing inflation, supply/demand modeling — not a game economy

## Data model

Two new tables. Keep them flat.

```sql
-- The catalog of things kids can buy
CREATE TABLE IF NOT EXISTS rewards (
  id SERIAL PRIMARY KEY,
  household_id INT NOT NULL DEFAULT 1,
  label TEXT NOT NULL,                -- "30 min extra screen time"
  emoji TEXT,                         -- "📺"
  cost_points INT NOT NULL,
  description TEXT,                   -- optional fine print
  available_to INT REFERENCES family_members(id),  -- NULL = anyone
  active BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Every redemption attempt, including pending/denied
CREATE TABLE IF NOT EXISTS point_redemptions (
  id SERIAL PRIMARY KEY,
  reward_id INT NOT NULL REFERENCES rewards(id),
  member_id INT NOT NULL REFERENCES family_members(id),
  cost_points INT NOT NULL,           -- snapshot at redemption time
  status TEXT NOT NULL DEFAULT 'pending',  -- pending | approved | denied
  requested_at TIMESTAMP NOT NULL DEFAULT NOW(),
  resolved_at TIMESTAMP,
  resolved_by INT REFERENCES family_members(id),
  note TEXT                           -- optional parent note ("after dinner")
);

CREATE INDEX IF NOT EXISTS point_redemptions_member_status ON point_redemptions(member_id, status);
```

**Balance calc** (extend the existing scoreboard UNION):
```
balance = SUM(earned points) − SUM(approved redemptions.cost_points)
```
Pending redemptions don't debit. Denied don't debit. This matters: a kid shouldn't lose their balance while waiting for approval.

## Surfaces to build

### 1. Admin: `/calendar/admin` → Rewards catalog tab
- List rewards (label, emoji, cost, who it's for, active toggle)
- Add/edit/delete rewards
- Inline only — no modal. Match the existing TaskForm pattern.
- Suggested starter catalog seeded on first visit:
  - 📺 30 min extra screen time — 20 pts
  - 🍦 Ice cream after dinner — 15 pts
  - 🎬 Pick the family movie — 25 pts
  - 💵 $5 allowance — 50 pts
  - 🛌 Stay up 30 min late (weekend) — 30 pts

### 2. Kid: `/calendar/kid/[name]` → "Spend points" section
- Below today's tasks, a horizontally-scrolling row of reward cards
- Each card shows emoji, label, cost, and either a "Redeem ✨" button (afford) or a greyed-out "X more pts" hint
- Tapping redeem fires confetti, posts to `/api/calendar/redemptions`, optimistically shows "⏳ Waiting for parent approval" state
- Pending redemptions stay visible until approved/denied — gives the kid something to track

### 3. Admin: Approval inbox
- Top of `/calendar/admin` shows a "Redemptions awaiting approval" panel when pending count > 0
- One-tap Approve / Deny per row
- Approving auto-debits balance (no second step)
- Push the same panel into `/calendar/scoreboard` for Brittany's discovery path — she doesn't need to dig into admin to grant a reward

### 4. Scoreboard: Wallet view
- Each member row currently shows: name, points, bar
- Add: `Earned · Redeemed · Balance` micro-stats under the bar
- Last 5 redemptions in a collapsible "Recent rewards" feed (matches the "Activity feed" roadmap item — kill two birds)

## API surface

```
GET    /api/calendar/rewards                 → Reward[]
POST   /api/calendar/rewards            (admin)
PUT    /api/calendar/rewards            (admin)
DELETE /api/calendar/rewards?id=X       (admin)

GET    /api/calendar/redemptions?member_id=X&status=pending|approved|all
POST   /api/calendar/redemptions             { reward_id, member_id }
PATCH  /api/calendar/redemptions        (admin) { id, status: approved|denied, note? }
```

Server-side balance check on POST: reject if `earned − approved < reward.cost_points`. Optimistic UI on the kid side can pretend it succeeded for the confetti moment, then sync on response.

## Sequencing (build order)

Each step ships independently. Don't batch.

1. **DB migration + admin catalog UI.** No kid-facing surface yet. Just let Matt seed the catalog. ~2 hrs.
2. **Kid redemption flow (pending state only).** Kid can request; nothing approves yet. Tests the visual + emotional design. ~2 hrs.
3. **Admin approval inbox.** First end-to-end loop. ~1.5 hrs.
4. **Scoreboard wallet view + activity feed.** Public-facing summary. ~2 hrs.
5. **Brittany discovery path on scoreboard** (approval panel mirrored from admin). ~30 min.

Total: ~8 hrs of focused work. Stop after step 3 if the kids aren't engaging with it — the rest is polish.

## What we'll learn

PostHog events to add up front:
- `reward_redemption_requested` (member_id, reward_id, cost_points)
- `reward_redemption_approved` / `_denied` (resolution_time_ms)
- `reward_catalog_viewed` (with no redemption — measures browsing vs spending)
- `scoreboard_wallet_viewed`

After 2 weeks, the questions are: do kids redeem within 24hrs of earning? Is there one reward that dominates (signal to add more)? Are pending redemptions piling up (signal that parents aren't checking)? Watch the session replays — the kid pages are PostHog-instrumented already.

## Open questions for Matt

- Should denied redemptions show a reason field, or stay terse? (Risk: reasons turn into negotiations.)
- Cap on simultaneous pending redemptions per kid? (Suggest: 3. Prevents spam-tapping.)
- Should some rewards be "request only" (no cost, just asking permission for something)? Out of scope here, but mention it once and decide.
