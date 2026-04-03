# BasiQ Platform

Full-stack Next.js application with:
- **Public shop** — IT services storefront with booking modal (no payments, discovery call only)
- **Admin portal** — manage clients and setups (protected, obfuscated URL)
- **Client portal** — clients view their setup progress in real time
- **ClickUp sync** — two-way status synchronisation with independent step tracking

---

## Stack

| | |
|---|---|
| Framework | Next.js 14 (App Router, JavaScript) |
| Database | Supabase (PostgreSQL) |
| Auth | JWT (jose) + bcrypt + TOTP 2FA |
| Styling | Tailwind CSS + DM Sans font |
| Hosting | Vercel |
| Domain | Namecheap → Vercel DNS |
| Integrations | ClickUp API + Webhooks, Cloudflare |

---

## Quick Start

### 1. Install dependencies
```bash
npm install
```

### 2. Set up Supabase
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** and run the contents of `supabase-schema.sql`
3. Run the migrations below for step tracking columns
4. Copy your project URL and keys

#### Required DB migrations
```sql
-- Independent step tracking
ALTER TABLE setups ADD COLUMN completed_steps int4[] NOT NULL DEFAULT '{}';
ALTER TABLE setups ADD COLUMN active_steps    int4[] NOT NULL DEFAULT '{}';

-- Migrate existing sequential data
UPDATE setups
SET completed_steps = (
  SELECT COALESCE(array_agg(n ORDER BY n), '{}')
  FROM generate_series(1, GREATEST(current_step - 1, 0)) AS n
)
WHERE current_step > 1;
```

### 3. Configure environment variables
```bash
cp .env.example .env.local
```
Fill in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

JWT_SECRET=generate-a-long-random-string-here
ADMIN_SESSION_MAX_AGE=28800

CLICKUP_API_TOKEN=pk_xxx
CLICKUP_WORKSPACE_ID=your_workspace_id
CLICKUP_LIST_ID=your_list_id
CLICKUP_WEBHOOK_SECRET=random-secret

NEXT_PUBLIC_APP_URL=https://yourdomain.com

# Obfuscated URL segments — change to any random string
NEXT_PUBLIC_ADMIN_SEGMENT=dashboard-x7k2m
NEXT_PUBLIC_ADMIN_LOGIN_SEGMENT=n3r8v5
NEXT_PUBLIC_CLIENT_LOGIN_SEGMENT=xk7p2q
```

### 4. Seed admin accounts
```bash
node scripts/seed-admins.js
```
Change the default passwords immediately after.

### 5. Run locally
```bash
npm run dev
```

---

## Routes

### Public shop
| Route | Page |
|---|---|
| `/` | Homepage — services grid |
| `/products/[slug]` | Service detail + booking modal |
| `/pages/privacy-policy` | Privacy Policy |
| `/pages/terms-of-service` | Terms of Service |
| `/pages/refund-policy` | Refund Policy |
| `/pages/shipping-policy` | Shipping Policy |

> Product pages have a **booking modal** (name, surname, phone, email). No payment buttons anywhere on the site — only discovery call booking.

### Client portal
| Route | Page |
|---|---|
| `/$CLIENT_LOGIN_SEGMENT` | Client login (username + password) |
| `/client/dashboard` | All active and completed setups |
| `/client/setup/[id]` | Setup detail — progress tracker with step states |

### Admin portal
| Route | Page |
|---|---|
| `/$ADMIN_LOGIN_SEGMENT` | Admin login (email + password + 2FA) |
| `/$ADMIN_SEGMENT/clients` | All clients |
| `/$ADMIN_SEGMENT/clients/new` | Create client |
| `/$ADMIN_SEGMENT/clients/[id]` | Client detail + setups |
| `/$ADMIN_SEGMENT/clients/[id]/setups/new` | Create setup |
| `/$ADMIN_SEGMENT/clients/[id]/setups/[setupId]` | Edit setup, manage steps |
| `/$ADMIN_SEGMENT/setup-2fa` | Configure TOTP 2FA |

> All three segments (`ADMIN_SEGMENT`, `ADMIN_LOGIN_SEGMENT`, `CLIENT_LOGIN_SEGMENT`) are set in `.env.local` and can be any random string. Accessing the wrong URL returns 404.

---

## Security

- Unauthenticated access to admin/client routes returns **404** (not 401 — doesn't reveal route existence)
- Login URLs are obfuscated via env vars — not guessable from the browser
- Admin login: email + password → TOTP 2FA (Google Authenticator / Authy)
- Rate limiting: 5 failed attempts → 15 min lockout
- JWT stored in httpOnly cookies (not localStorage)
- Robots.txt blocks all internal routes from indexing
- All API routes use service role key server-side only

### Setting up 2FA for admins
1. Log in with email + password
2. Go to `/$ADMIN_SEGMENT/setup-2fa`
3. Scan the QR code with Google Authenticator or Authy
4. Enter the 6-digit code to confirm

---

## Step Tracking

Each setup has three independent step arrays stored in the database:

| Field | Type | Description |
|---|---|---|
| `completed_steps` | `int4[]` | Steps marked as done (green ✓) |
| `active_steps` | `int4[]` | Steps currently in progress (blue ▶) |
| `action_step` | `int4` | Single step requiring client action (orange !) |

Steps can be toggled in **any order** — no sequential constraint. `current_step` is auto-computed as the first uncompleted step and kept for ClickUp backwards compatibility.

### ClickUp subtask statuses
| Condition | ClickUp status |
|---|---|
| Step in `completed_steps` | `complete` |
| Step in `active_steps` | `in progress` |
| Everything else | `to do` |

---

## ClickUp Integration

### Two-way sync
- **Admin → ClickUp**: changing steps/status in the admin panel updates the ClickUp task and all subtasks automatically
- **ClickUp → DB**: status changes in ClickUp fire a webhook that updates the database

### Setting up the webhook
1. In ClickUp: **Settings → Integrations → Webhooks**
2. Add webhook URL: `https://yourdomain.com/api/clickup/webhook`
3. Events: `taskStatusUpdated`
4. Copy the secret → add to `.env.local` as `CLICKUP_WEBHOOK_SECRET`

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add all `.env.local` variables to **Vercel → Project → Settings → Environment Variables**.

### Connect Namecheap domain
1. Vercel: Project → Settings → Domains → Add `yourdomain.com`
2. Copy the DNS records Vercel provides
3. Namecheap: Domain → Advanced DNS → add those records
4. Wait 5–30 min for propagation

### Cloudflare (recommended)
1. Add your domain to Cloudflare (free plan)
2. Change Namecheap nameservers to Cloudflare's
3. In Cloudflare: add Vercel's A/CNAME records with "Proxied" (orange cloud)
4. Enables DDoS protection + WAF for free

---

## Customisation

### Change brand / shop name
Edit `app/(shop)/layout.js`.

### Add or edit services
Edit `lib/products.js` — add entries to the `products` array.

### Change setup types or steps
Edit `lib/setups.js` — modify the `SETUP_TYPES` object.

### Change obfuscated URL paths
Update the three segment env vars in `.env.local`:
```
NEXT_PUBLIC_ADMIN_SEGMENT
NEXT_PUBLIC_ADMIN_LOGIN_SEGMENT
NEXT_PUBLIC_CLIENT_LOGIN_SEGMENT
```
Then rename the corresponding folders:
- `app/(auth)/xk7p2q/` → new client login slug
- `app/(auth)/n3r8v5/` → new admin login slug
- `app/(admin)/dashboard-x7k2m/` → new admin dashboard slug

### Change Notion guide links
Edit `lib/setups.js` — update the `NOTION_LINKS` object.
