# BasiQ Platform

Full-stack Next.js application with:
- **Public shop** — Health & Beauty e-commerce storefront
- **Admin portal** — manage clients and setups (protected, custom path)
- **Client portal** — clients view their setup progress
- **ClickUp sync** — two-way status synchronisation

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
3. Copy your project URL and keys

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
CLICKUP_API_TOKEN=pk_xxx
CLICKUP_LIST_ID=your_list_id
CLICKUP_WEBHOOK_SECRET=random-secret
NEXT_PUBLIC_APP_URL=https://yourdomain.com
NEXT_PUBLIC_ADMIN_SEGMENT=dashboard-x7k2m
```

### 4. Seed admin accounts
```bash
node scripts/seed-admins.js
```
Then change the default passwords immediately.

### 5. Run locally
```bash
npm run dev
```

---

## Routes

### Public shop
| Route | Page |
|---|---|
| `/` | Homepage — product grid |
| `/products/[slug]` | Product detail |
| `/pages/privacy-policy` | Privacy Policy |
| `/pages/terms-of-service` | Terms of Service |
| `/pages/refund-policy` | Refund Policy |
| `/pages/shipping-policy` | Shipping Policy |

### Client portal
| Route | Page |
|---|---|
| `/login` | Client login (username + password) |
| `/client/dashboard` | All setups |
| `/client/setup/[id]` | Setup detail with progress tracker |

### Admin portal
| Route | Page |
|---|---|
| `/admin/login` | Admin login (email + password + 2FA) |
| `/dashboard-x7k2m/clients` | All clients |
| `/dashboard-x7k2m/clients/new` | Create client |
| `/dashboard-x7k2m/clients/[id]` | Client detail + setups |
| `/dashboard-x7k2m/clients/[id]/setups/new` | Create setup |
| `/dashboard-x7k2m/clients/[id]/setups/[setupId]` | Edit setup, manage steps |

> The admin segment `dashboard-x7k2m` is configured in `.env.local` as `NEXT_PUBLIC_ADMIN_SEGMENT`. Change it to anything you want.

---

## Security

- Unauthenticated access to admin/client routes returns **404** (not 401)
- Admin login: email + password → TOTP 2FA (Google Authenticator)
- Rate limiting: 5 failed attempts → 15 min lockout
- JWT in httpOnly cookies (not localStorage)
- Robots.txt blocks all internal routes from indexing
- All API routes use service role key server-side only

### Setting up 2FA for admins
1. Admin logs in with email + password
2. Go to `/dashboard-x7k2m/setup-2fa` (add this page if needed)
3. Scan the QR code with Google Authenticator / Authy
4. Enter the 6-digit code to confirm

---

## ClickUp Integration

### Two-way sync:
- **Our admin → ClickUp**: When you change a step in the admin panel, the ClickUp task status updates automatically
- **ClickUp → Our DB**: When status changes in ClickUp, a webhook fires and updates our database

### Setting up the webhook:
1. In ClickUp: Settings → Integrations → Webhooks
2. Add webhook URL: `https://yourdomain.com/api/clickup/webhook`
3. Events: `taskStatusUpdated`
4. Copy the secret and add to `.env.local` as `CLICKUP_WEBHOOK_SECRET`

---

## Deploy to Vercel

```bash
npm install -g vercel
vercel
```

Add all `.env.local` variables to Vercel's environment variables in the dashboard.

### Connect Namecheap domain
1. In Vercel: Project → Settings → Domains → Add `yourdomain.com`
2. Vercel shows you DNS records to add
3. In Namecheap: Domain → Advanced DNS → add the records Vercel gives you
4. Wait 5–30 min for propagation

### Cloudflare (recommended)
1. Add your domain to Cloudflare (free plan)
2. Change Namecheap nameservers to Cloudflare's
3. In Cloudflare: add Vercel's A/CNAME records
4. Enable "Proxied" (orange cloud) for DDoS protection + WAF

---

## Customisation

### Change shop name/brand
Edit `app/(shop)/layout.js` — change `LumiGlow` to your brand.

### Add/edit products
Edit `lib/products.js` — add products to the array.

### Change setup types or steps
Edit `lib/setups.js` — modify the `SETUP_TYPES` object.

### Change admin URL path
In `.env.local`, change `NEXT_PUBLIC_ADMIN_SEGMENT` to any string.
Also update `middleware.js` matcher if needed.

### Change Notion guide links
Edit `lib/setups.js` — update the `NOTION_LINKS` object.
