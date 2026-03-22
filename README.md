# Decision Making Lab

A web portal providing unified SSO access to decision-making and strategy simulation tools for academic courses. Built for NYU Stern's Competitive Strategy program by Dr. Jose Mendoza.

## Overview

The Decision Making Lab consolidates six simulation tools under one platform with role-based access control, course management, and centralized tool launching via SSO.

### Lab Tools

| Tool | Status | URL | Auth Method |
|------|--------|-----|-------------|
| AHP Studio | Active | ahpstudio.com | JWT Exchange |
| Airlines Sim | Active | airlines-sim.com | Redirect |
| Dynamic Pricing Sandbox | Active | pricingsandbox.com | Iframe |
| Negotiation Sim | Coming Soon | — | TBD |
| Scenario Sim | Coming Soon | — | TBD |
| Decision Trees | Coming Soon | — | TBD |

### User Roles

- **Admin** — Full platform management: users, courses, schools, tools
- **Professor** — Course management, student enrollment, tool assignment
- **Student** — Access assigned tools, view enrolled courses

## Tech Stack

- **Framework:** Next.js 16 (App Router, TypeScript)
- **Database:** PostgreSQL 16 with Prisma 7 ORM
- **Auth:** JWT (jose library), bcryptjs password hashing, httpOnly cookies
- **Styling:** Tailwind CSS v4, NYU brand palette (Violet #57068C)
- **Icons:** Lucide React
- **Deployment:** DigitalOcean App Platform (Docker)

## Project Structure

```
app/
├── prisma/                  # Schema, migrations, seed script
├── src/
│   ├── app/                 # Next.js App Router pages & API routes
│   │   ├── (authenticated)/ # Protected pages (dashboard, admin, courses, etc.)
│   │   ├── api/             # REST API endpoints
│   │   └── *.tsx            # Public pages (login, about, terms, etc.)
│   ├── components/          # Shared UI components
│   ├── generated/prisma/    # Generated Prisma client
│   └── lib/                 # Auth, DB client, tool definitions
├── .do/app.yaml             # DigitalOcean App Platform config
├── Dockerfile               # Multi-stage Docker build
└── docker-compose.yml       # Local development with Docker
```

## Getting Started

### Prerequisites

- Node.js 20+
- PostgreSQL 16 (or Docker)

### Local Development

1. **Clone and install:**
   ```bash
   cd app
   npm install
   ```

2. **Set up environment:**
   ```bash
   cp .env.example .env
   # Edit .env with your DATABASE_URL and JWT_SECRET
   ```

3. **Start PostgreSQL** (via Docker):
   ```bash
   docker run -d --name decisionlab-db \
     -e POSTGRES_USER=decisionlab \
     -e POSTGRES_PASSWORD=decisionlab2026 \
     -e POSTGRES_DB=decisionlab \
     -p 5433:5432 postgres:16-alpine
   ```

4. **Run migrations and seed:**
   ```bash
   npx prisma migrate dev
   npx tsx prisma/seed.ts
   ```

5. **Start dev server:**
   ```bash
   npm run dev
   ```

6. **Open** http://localhost:3000

### Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| Admin | admin@decisionlab.com | AdminPass2026! |
| Professor | professor@decisionlab.com | ProfPass2026! |
| Student | student@decisionlab.com | StudentPass2026! |

### Docker Compose (Full Stack)

```bash
cd app
docker compose up --build
```

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/api/auth/login` | Email/password login |
| POST | `/api/auth/logout` | Clear session |
| GET | `/api/auth/me` | Current user info |
| GET/POST | `/api/users` | List/create users (admin) |
| GET/PUT/DELETE | `/api/users/[id]` | User CRUD (admin) |
| GET/POST | `/api/courses` | List/create courses |
| GET/PUT | `/api/courses/[id]` | Course details/update |
| POST | `/api/courses/[id]/enroll` | Bulk enroll students |
| POST | `/api/courses/[id]/tools` | Assign tools to course |
| GET | `/api/tools` | List all active tools |
| GET | `/api/tools/assigned` | User's assigned tools |
| POST | `/api/tools/[id]/launch` | Generate SSO token & launch URL |
| GET/POST | `/api/schools` | List/create schools (admin) |

## Deployment

### DigitalOcean App Platform

The app includes a `.do/app.yaml` spec for DigitalOcean deployment:

```bash
doctl apps create --spec app/.do/app.yaml
```

Set production environment variables:
- `DATABASE_URL` — Managed PostgreSQL connection string
- `JWT_SECRET` — Strong random secret
- `TOOL_SSO_SECRET` — Secret for tool SSO tokens

### Manual Docker

```bash
cd app
docker build -t decisionlab .
docker run -p 3000:3000 \
  -e DATABASE_URL="postgresql://..." \
  -e JWT_SECRET="..." \
  decisionlab
```

## Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm start` | Start production server |
| `npm run db:generate` | Regenerate Prisma client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:push` | Push schema to DB (no migration) |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

## License

See [LICENSE](LICENSE) for details.
