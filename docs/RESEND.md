# Apartment inquiry email with Resend on Vercel

The inquiry form posts to **`/api/inquiry`**, a Vercel serverless function that sends mail with [Resend](https://resend.com/). The **Resend API key never ships to the browser**—only server-side env vars on Vercel (or `vercel dev` locally).

## 1. Resend account and domain

1. Sign up at [resend.com](https://resend.com/) and open the dashboard.
2. **Domains** → add your domain (e.g. `panorama-zabiny.cz`) and add the DNS records Resend shows.
3. After verification, you can send from an address like `Poptávky <poptavky@yourdomain.com>`.

For quick tests only, Resend may allow sending from `onboarding@resend.dev` to your own account email—check current Resend docs for limits.

## 2. Environment variables

Set these in the **Vercel** project → **Settings** → **Environment variables** (and in `.env.local` when using `vercel dev`):

| Variable | Where it’s used | Example |
|----------|------------------|---------|
| `RESEND_API_KEY` | Server only (`api/inquiry.ts`) | `re_...` from Resend **API Keys** |
| `RESEND_FROM_EMAIL` | `from` field (must be from a verified domain) | `Panorama <poptavky@yourdomain.com>` |
| `INQUIRY_TO_EMAIL` | Inbox that receives leads | `info@yourdomain.com` |

Do **not** prefix these with `VITE_`—they must stay server-side.

Copy from `.env.example` at the repo root and fill in values.

## 3. Local development

- **`npm run dev`** (Vite only): there is **no** `/api` route, so submit will fail unless you point the client at a deployed API (see below).
- **`vercel dev`** (recommended for full stack): installs [Vercel CLI](https://vercel.com/docs/cli), run from the project root:

  ```bash
  npx vercel dev
  ```

  Load the URL Vercel prints (often `http://localhost:3000`). The form will hit `/api/inquiry` on the same origin.

### Point plain Vite at a deployed API

If you only run `npm run dev` but want to test against a **preview deployment** that already has the API:

1. Create `.env.local`:

   ```env
   VITE_INQUIRY_API_BASE_URL=https://your-preview.vercel.app
   ```

2. Restart Vite. The client will `POST` to `https://your-preview.vercel.app/api/inquiry`.

Leave `VITE_INQUIRY_API_BASE_URL` unset in production on Vercel so the browser uses a relative `/api/inquiry` on your live domain.

## 4. Deploy on Vercel

1. Connect the Git repo and deploy (framework: **Vite** is auto-detected).
2. Add the three env vars above for **Production** (and **Preview** if you use previews).
3. Redeploy after changing env vars.

The `api/inquiry.ts` file is deployed as a Node serverless function at **`/api/inquiry`**.

## 5. Production checklist (push to `main` → your domain)

Follow this order once; after that, new deploys from `main` keep working as long as env vars stay set.

### A. Git and Vercel project

1. Push your code to GitHub/GitLab/Bitbucket (e.g. merge to **`main`**).
2. In [Vercel](https://vercel.com/) → **Add New** → **Project** → import that repo.
3. **Framework preset**: Vite (auto). **Root**: repo root. **Build command**: `npm run build` (default). **Output**: `dist` (default).
4. Deploy once (even before env vars) to confirm the site builds.

### B. Resend (sending + “from” address)

1. Create a [Resend](https://resend.com/) account.
2. **API Keys** → create a key → copy it (starts with `re_`). You will paste this as **`RESEND_API_KEY`** on Vercel.
3. **Domains** → **Add domain** → enter the domain you send from (often the same as your site, e.g. `panorama-zabiny.cz`).
4. At your **DNS provider** (where the domain is registered), add exactly the DNS records Resend shows (usually TXT + MX or CNAME). Save and wait until Resend shows the domain as **Verified** (can take a few minutes to hours).
5. Decide two addresses:
   - **`RESEND_FROM_EMAIL`** — the visible sender (must use your **verified** domain), e.g. `Panorama Žabiny <poptavky@panorama-zabiny.cz>`.
   - **`INQUIRY_TO_EMAIL`** — **your** inbox where you want every form submission (can be the same domain or Gmail, etc.). This is only stored in Vercel env; users never see it.

### C. Environment variables on Vercel (this makes the form actually send mail)

1. Vercel → your project → **Settings** → **Environment variables**.
2. Add these three for **Production** (and optionally **Preview** if you test PR previews):

   | Name | Value (example) |
   |------|------------------|
   | `RESEND_API_KEY` | `re_xxxxxxxx` from Resend |
   | `RESEND_FROM_EMAIL` | `Panorama <poptavky@your-domain.cz>` (must match verified domain) |
   | `INQUIRY_TO_EMAIL` | `you@your-domain.cz` ← **where leads arrive** |

3. Save, then **Deployments** → open the latest deployment → **⋯** → **Redeploy** (env vars apply on the next build/runtime; redeploy ensures a clean pick-up).

### D. Custom domain on Vercel

1. **Settings** → **Domains** → add `yourdomain.cz` and `www.yourdomain.cz` if you use both.
2. Follow Vercel’s DNS instructions at your registrar (usually A/CNAME to Vercel). Wait until SSL shows valid.
3. No extra code change: the form uses **`/api/inquiry`** on the **same origin**, so it works on `https://yourdomain.cz` automatically.

### E. Smoke test

1. Open `https://yourdomain.cz` (or the `.vercel.app` URL until DNS is ready).
2. Open an apartment → **inquiry** → fill the form → submit.
3. Check **`INQUIRY_TO_EMAIL`** inbox (and spam). Replies from your mail app will use **Reply-To** = the customer’s email.

### If something fails

- **503 / “not configured”** on submit → one of the three env vars is missing or typo’d in Vercel Production; redeploy after fixing.
- **Resend error / bounced** → `RESEND_FROM_EMAIL` must use a domain **verified** in Resend; check Resend **Logs**.
- **Works on `*.vercel.app` but not custom domain** → DNS/SSL not finished; wait or fix records in Vercel **Domains**.

After a failed submit, the form now shows a **second line** with a technical message from the API (e.g. `invalid_from_address: …`). Use that to fix Resend/Vercel settings. Common cases:

| Message contains | What to do |
|------------------|------------|
| `invalid_from_address` | `RESEND_FROM_EMAIL` must use your **verified** domain (e.g. `…@panoramazabiny.cz`). |
| `missing_api_key` / `invalid_api_key` | Fix `RESEND_API_KEY` in Vercel; redeploy. |
| `empty_body` | Request never reached the function body (rare); check Vercel → **Functions** → `/api/inquiry` exists after deploy. |
| `404` / “serverless API may be missing” | Latest deploy didn’t include `api/inquiry.ts` or project **Root Directory** in Vercel is wrong. |

Vercel → **Deployments** → **Functions** tab: confirm `api/inquiry` is listed. **Logs** show server `console.error` from Resend.

## 6. Troubleshooting

| Symptom | What to check |
|--------|----------------|
| “Form is not configured” / HTTP 503 | Missing `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, or `INQUIRY_TO_EMAIL` in Vercel (or `.env.local` for `vercel dev`). |
| Resend rejects `from` | Domain not verified in Resend; `from` must use that domain. |
| 404 on `/api/inquiry` | Not running on Vercel (or `vercel dev`); or SPA rewrite catching `/api`—Vercel usually routes `/api/*` to functions first. |
| CORS errors | Unusual for same-origin POST; if you call another origin, configure CORS on the function or use `VITE_INQUIRY_API_BASE_URL` only for dev. |

Official references: [Resend — Send with Node.js](https://resend.com/docs/send-with-nodejs), [Vercel — Serverless Functions](https://vercel.com/docs/functions), [Vercel — Environment variables](https://vercel.com/docs/projects/environment-variables).
