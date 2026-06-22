# StorePilot AI

Manage a Shopify store through chat. Standalone Next.js 15 SaaS (own auth + Stripe billing) that
connects to Shopify via OAuth and runs merchant operations through an approval-gated AI pipeline.

> **Scaffold status.** The spine is implemented (models, encryption, auth, the agent pipeline,
> Shopify GraphQL client, Stripe wiring, dashboard + chat UI). Integration edges that need your
> credentials or further work are marked `TODO` in the code. Fill `.env`, then extend.

## Quick start
```bash
npm install
cp .env.example .env.local   # then fill values
npm run dev                  # http://localhost:3000
```
Generate secrets:
```bash
openssl rand -base64 32   # NEXTAUTH_SECRET
openssl rand -hex 32      # ENCRYPTION_KEY (must be 64 hex chars)
```
Verify DB + models: visit `/api/health` → `{ "ok": true, "organizations": 0 }`.

## How the core works
1. Merchant sends a message in **/chat**.
2. `actions/chat.ts` runs the read-only pipeline (`lib/agents`): intent parser → planner.
3. A **plan** is returned and shown as an approval card. Nothing has touched Shopify yet.
4. Merchant clicks **Approve** → `actions/approval.ts` → `validator` → `executor`.
5. The **executor** (`lib/agents/executor.ts`) is the only code holding a decrypted token. It
   calls Shopify and writes an **audit log** row.

## Phase map
| Phase | Where |
|---|---|
| 1 System architecture | this README + `lib/agents` |
| 2 Database schema | `models/`, `lib/db/` |
| 3 Authentication | `lib/auth.ts`, `actions/auth.ts`, `app/(auth)/*`, `app/api/auth/*` |
| 4 Shopify connect | `lib/shopify/*`, `app/api/shopify/*`, `actions/shopify.ts`, `lib/encryption.ts` |
| 5 Dashboard | `app/(dashboard)/dashboard` |
| 6 AI chat | `app/(dashboard)/chat`, `lib/ai/*`, `app/api/chat` |
| 7 Product/inventory mgmt | `lib/agents/executor.ts`, `lib/shopify/mutations.ts` |
| 8 SEO assistant | extend planner prompt + add `seo.update` mutation |
| 9 Store audit | `app/(dashboard)/audit` + a server action using `ShopifyClient` |
| 10 Billing (parked) | `lib/stripe.ts`, `actions/billing.ts`, `app/api/stripe/*` — dormant until Stripe env is set |
| 11 Admin panel | `app/admin/*` |
| 12 Deployment | Vercel + MongoDB Atlas + Stripe webhook URL |

## Key TODOs before launch
- Email service for verification + password reset (`actions/auth.ts`, `forgot-password`).
- (Optional) Register Shopify webhooks (`app/uninstalled`, `products/update`) per connected store.
- Resolve `inventoryItemId` / `locationId` in the inventory executor branch.
- Implement `product.update` and `seo.update` mutations.
- Build the audit-engine server action (Phase 9).
- Set the Stripe webhook secret and point Stripe at `/api/stripe/webhook`.
- Make your first superadmin: set a user's `role` to `superadmin` in MongoDB.

## How stores connect
Two paths, both saved through the same `persistStore` service (claim check + plan limit + encryption):

1. **One-click OAuth (recommended).** Create one app in your free Shopify Partner account and set
   `SHOPIFY_API_KEY` / `SHOPIFY_API_SECRET` (these identify *your app*, not a store). Merchants enter
   their domain, approve the install on Shopify, and land back connected — they never paste anything.
   Flow: `app/api/shopify/install` → Shopify → `app/api/shopify/callback`.
2. **Manual token (fallback).** If the OAuth keys aren't set, merchants create a custom app in their
   own admin and paste its `shpat_…` token on the Stores page. `verifyShopToken` validates it live.

The Stores page shows both; OAuth is primary and degrades gracefully to the token form.

## Billing
Off by default. Accounts run on Starter limits (enforced in `lib/usage.ts`). The Stripe code is in the
repo but dormant until you set the Stripe env vars — see the parked block in `.env.example`.
