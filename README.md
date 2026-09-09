# Decision Making Lab

Open decision-making tools for the NYU School of Professional Studies, built by
[Dr. Jose Mendoza](https://www.jose-mendoza.com). No account is required.

## Lab Collection

| Lab | Focus | Application | Source |
| --- | --- | --- | --- |
| AHP Studio | Multi-criteria decision analysis | [Open app](https://ahpstudio.com) | [GitHub](https://github.com/jrmst102/ahpstudio) |
| Airlines Sim | Competitive airline strategy | [Open app](https://airlines-sim.com) | [GitHub](https://github.com/jrmst102/airline_sim) |
| Dynamic Pricing Sandbox | Dynamic pricing strategy | [Open app](https://pricingsandbox.com) | [GitHub](https://github.com/jrmst102/dynamic_sandbox) |
| Negotiation Sim | AI-supported negotiation practice | [Open app](https://negotiationsim-lofem.ondigitalocean.app) | [GitHub](https://github.com/jrmst102/negotiationsim) |
| Scenario Sim | Scenario planning under uncertainty | [Open app](https://scenariomanager-6m53a.ondigitalocean.app) | [GitHub](https://github.com/jrmst102/scenariomanager) |

Decision Trees is planned. [View the portal source](https://github.com/jrmst102/decisionlab).

## Features

- No login required
- Direct application and source links
- Responsive, accessible interface
- NYU colors, typography, and official logos
- MIT-licensed projects
- Protected administration routes

## NYU Brand System

The interface uses:

- NYU Violet: `#57068C`
- Deep Violet: `#330662`
- Ultra Violet: `#8900E1`
- Montserrat with Verdana and system fallbacks
- Official NYU logos from [`docs/logos`](docs/logos)

## Tech Stack

- Next.js 16 App Router and TypeScript
- React 19
- Tailwind CSS 4
- Lucide React icons
- PostgreSQL 16 and Prisma 7 for protected management features
- JWT cookies for protected administrative routes
- Docker and DigitalOcean App Platform deployment

## Project Structure

```text
app/                            # Decision Making Lab portal
├── public/                     # Static assets, including NYU web logos
├── prisma/                     # Database schema, migrations, and seed data
└── src/
    ├── app/
    │   ├── page.tsx            # Public lab directory
    │   ├── (authenticated)/    # Protected management/course pages
    │   └── api/                # Internal API routes
    ├── components/             # Shared interface components
    ├── lib/                    # Tool definitions, auth, and database access
    └── proxy.ts                # Public/protected route boundary
docs/
├── logos/                      # Original supplied NYU logo files
└── *.md                        # Product and integration documentation
services/                       # Application git submodules
```

## Local Development

### Requirements

- Node.js 20 or newer
- npm

### Run the public portal

```bash
git clone https://github.com/jrmst102/decisionlab.git
cd decisionlab/app
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public portal does not
require a database.

### Production build

Generate the Prisma client before creating a complete production build:

```bash
cd app
npm install
npm run db:generate
npm run build
```

### Optional management environment

Protected administration and course-management features additionally require a
PostgreSQL database and the values documented in [`app/.env.example`](app/.env.example).

```bash
cd app
cp .env.example .env
npm run db:push
npm run db:seed
npm run dev
```

## Available Scripts

Run these commands from `app/`:

| Command | Description |
| --- | --- |
| `npm run dev` | Start the development server |
| `npm run build` | Create an optimized production build |
| `npm run start` | Start the production server |
| `npm run lint` | Run ESLint |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Create and apply development migrations |
| `npm run db:push` | Apply the schema without creating a migration |
| `npm run db:seed` | Seed development data |
| `npm run db:studio` | Open Prisma Studio |

## Deployment

The portal is configured for Docker-based deployment from the `app/` directory.
See [`docs/digitalocean-deployment.md`](docs/digitalocean-deployment.md) for the
DigitalOcean App Platform setup and service-specific environment variables.

## Contact

Dr. Jose Mendoza — [jose.mendoza@nyu.edu](mailto:jose.mendoza@nyu.edu) —
[www.jose-mendoza.com](https://www.jose-mendoza.com)

## License

This project is available under the [MIT License](LICENSE).
