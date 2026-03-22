# DigitalOcean App Platform — Deployment Guide

Complete instructions for deploying the Decision Making Lab from scratch on DigitalOcean App Platform. This covers all three apps and the managed database.

---

## Architecture Overview

The platform consists of **three separate App Platform apps** and one **managed PostgreSQL database**:

| App | Repo | Runtime | Port |
|-----|------|---------|------|
| DecisionLab | `jrmst102/decisionlab` (source: `/app`) | Next.js / Docker | 3000 |
| Negotiation Sim | `jrmst102/negotiationsim` | FastAPI / Docker | 8080 |
| Scenario Manager | `jrmst102/scenariomanager` | FastAPI / Docker | 8080 |

| Database | Engine | Version |
|----------|--------|---------|
| Managed PostgreSQL | PG | 16 |

---

## Step 1: Create the Managed Database

1. Go to **DigitalOcean → Databases → Create Database Cluster**
2. Choose **PostgreSQL 16**
3. Select the **Basic (Dev)** plan (`db-s-dev-database`) or higher
4. Region: **NYC** (same region as your apps)
5. Name it something like `decisionlab-db`
6. Once created, copy the **Connection String** — you'll need it as `DATABASE_URL`

The connection string looks like:
```
postgresql://doadmin:<password>@<host>:25060/<dbname>?sslmode=require
```

---

## Step 2: Deploy DecisionLab (Next.js)

### Create the App

1. Go to **DigitalOcean → Apps → Create App**
2. Source: **GitHub** → repo `jrmst102/decisionlab`, branch `main`
3. **Source Directory**: `/app`
4. **Build Method**: Dockerfile (it will auto-detect `app/Dockerfile`)
5. HTTP Port: `3000`
6. Plan: Basic or Professional ($5–$12/mo)
7. Region: NYC

### Environment Variables

Set these under **Settings → App-Level Environment Variables**:

| Variable | Scope | Type | Value |
|----------|-------|------|-------|
| `DATABASE_URL` | Run Time | Secret | Connection string from Step 1 |
| `JWT_SECRET` | Run Time | Secret | `openssl rand -base64 32` |
| `TOOL_SSO_SECRET` | Run Time | Secret | Shared secret for Negotiation Sim SSO |
| `TOOL_SSO_SECRET_SCENARIO_SIM` | Run Time | Secret | Separate secret for Scenario Manager SSO |
| `NODE_ENV` | Run & Build | Plain | `production` |

> **Generate secrets** with: `openssl rand -base64 32`

### What Happens on Deploy

The Dockerfile builds the Next.js app, then `start.sh` runs:
1. `npx prisma migrate deploy` — applies database migrations
2. `npx tsx prisma/seed.ts` — seeds users, school, course, tools (idempotent upserts)
3. `node server.js` — starts Next.js

### Verify

- Visit the app URL (e.g., `https://decisionlab-app-xxxxx.ondigitalocean.app`)
- Login with admin: `jm10697@nyu.edu` / `LimeKoala1!`
- Check that all 6 tools appear on the dashboard

---

## Step 3: Deploy Negotiation Sim (FastAPI)

### Create the App

1. **Apps → Create App**
2. Source: **GitHub** → repo `jrmst102/negotiationsim`, branch `main`
3. **Build Method**: Dockerfile
4. HTTP Port: `8080`
5. Plan: Basic ($5/mo)
6. Region: NYC

### Environment Variables

| Variable | Scope | Type | Value |
|----------|-------|------|-------|
| `SESSION_SECRET` | Run Time | Secret | `openssl rand -base64 32` |
| `OPENAI_API_KEY` | Run Time | Secret | Your OpenAI API key |
| `OPENAI_MODEL` | Run Time | Plain | `gpt-4o-mini` |
| `OPENAI_MAX_TOKENS` | Run Time | Plain | `2000` |
| `TOOL_SSO_SECRET` | Run Time | Secret | **Same value** as DecisionLab's `TOOL_SSO_SECRET` |

### Verify

- Visit the app URL (e.g., `https://negotiationsim-xxxxx.ondigitalocean.app`)
- You should see the Negotiation Sim login page
- SSO login will work once DecisionLab's tool URL is configured

---

## Step 4: Deploy Scenario Manager (FastAPI)

### Create the App

1. **Apps → Create App**
2. Source: **GitHub** → repo `jrmst102/scenariomanager`, branch `main`
3. **Build Method**: Dockerfile
4. HTTP Port: `8080`
5. Plan: Basic ($5/mo)
6. Region: NYC

### Environment Variables

| Variable | Scope | Type | Value |
|----------|-------|------|-------|
| `TOOL_SSO_SECRET_SCENARIO_SIM` | Run Time | Secret | **Same value** as DecisionLab's `TOOL_SSO_SECRET_SCENARIO_SIM` |

### Verify

- Visit the app URL (e.g., `https://scenariomanager-xxxxx.ondigitalocean.app`)
- You should see the Scenario Manager login page

---

## Step 5: Update Tool URLs in DecisionLab

After all three apps are deployed, you need to update the App Platform URLs in the codebase.

### Files to Update

**`app/src/lib/tools.ts`** — Hardcoded tool URLs used as fallback in the UI:
```typescript
// Find these lines and replace with your actual App Platform URLs:
url: "https://negotiationsim-xxxxx.ondigitalocean.app"
url: "https://scenariomanager-xxxxx.ondigitalocean.app"
```

**`app/prisma/seed.ts`** — Tool URLs seeded into the database:
```typescript
// Same URLs as above:
url: "https://negotiationsim-xxxxx.ondigitalocean.app"
url: "https://scenariomanager-xxxxx.ondigitalocean.app"
```

After updating, commit and push to trigger a redeployment:
```bash
git add -A
git commit -m "Update tool URLs for new deployment"
git push origin main
```

---

## SSO Authentication Flow

DecisionLab uses JWT-based SSO to launch tools:

1. User clicks "Launch" on a tool in DecisionLab
2. DecisionLab signs a JWT containing `{userId, email, role, tool}` with the tool's secret
3. User is redirected to the tool's `/auth/sso?token=<jwt>` endpoint
4. The tool verifies the JWT, creates/finds the user, sets a session cookie, and redirects to its dashboard

### Per-Tool Secrets

The launch route checks for a tool-specific env var first, then falls back:

| Tool Slug | Env Var Checked First | Fallback |
|-----------|-----------------------|----------|
| `negotiation-sim` | `TOOL_SSO_SECRET_NEGOTIATION_SIM` | `TOOL_SSO_SECRET` |
| `scenario-sim` | `TOOL_SSO_SECRET_SCENARIO_SIM` | `TOOL_SSO_SECRET` |

This means each tool can have its own secret, or they can share one via `TOOL_SSO_SECRET`.

---

## External Tools (No SSO)

These tools are hosted externally and don't use SSO — they open as direct links:

| Tool | URL |
|------|-----|
| AHP Studio | `https://ahp-studio.decisionlab.app` |
| Airlines Sim | `https://airlines-sim.decisionlab.app` |
| Dynamic Pricing Sandbox | `https://dynamic-pricing.decisionlab.app` |

These URLs are configured in `app/src/lib/tools.ts` and `app/prisma/seed.ts`.

---

## User Provisioning

### DecisionLab Users
All 28 users (1 admin, 1 professor, 26 students) are seeded automatically via `prisma/seed.ts` on every deployment. The seed uses upserts, so it's safe to run multiple times.

### Tool Users
Both Negotiation Sim and Scenario Manager provision users via their `scripts/provision_demo.py` scripts. These contain the same 28-user classlist. Users are also auto-created on first SSO login.

---

## Redeployment Checklist

If you delete everything and start fresh:

- [ ] Create managed PostgreSQL 16 database
- [ ] Deploy DecisionLab app (source: `/app`, Dockerfile, port 3000)
- [ ] Set DecisionLab env vars: `DATABASE_URL`, `JWT_SECRET`, `TOOL_SSO_SECRET`, `TOOL_SSO_SECRET_SCENARIO_SIM`, `NODE_ENV`
- [ ] Deploy Negotiation Sim app (Dockerfile, port 8080)
- [ ] Set Negotiation Sim env vars: `SESSION_SECRET`, `OPENAI_API_KEY`, `OPENAI_MODEL`, `TOOL_SSO_SECRET`
- [ ] Deploy Scenario Manager app (Dockerfile, port 8080)
- [ ] Set Scenario Manager env var: `TOOL_SSO_SECRET_SCENARIO_SIM`
- [ ] Copy the new App Platform URLs for Negotiation Sim and Scenario Manager
- [ ] Update URLs in `app/src/lib/tools.ts` and `app/prisma/seed.ts`
- [ ] Commit, push, and wait for DecisionLab to redeploy
- [ ] Verify SSO login works for both tools
- [ ] Verify admin login at DecisionLab: `jm10697@nyu.edu` / `LimeKoala1!`

---

## Useful Commands

```bash
# Generate a strong secret
openssl rand -base64 32

# Check app logs (DigitalOcean CLI)
doctl apps logs <app-id> --type run

# Force redeploy
doctl apps create-deployment <app-id>

# List your apps
doctl apps list
```

---

## Current Deployment (v1.1)

| App | URL |
|-----|-----|
| DecisionLab | `https://decisionlab-app-v4qgx.ondigitalocean.app` |
| Negotiation Sim | `https://negotiationsim-lofem.ondigitalocean.app` |
| Scenario Manager | `https://scenariomanager-6m53a.ondigitalocean.app` |
