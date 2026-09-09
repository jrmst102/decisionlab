# Decision Making Lab

An open collection of interactive decision-making and strategy tools built for
the NYU School of Professional Studies by
[Dr. Jose Mendoza](https://www.jose-mendoza.com).

The portal is publicly accessible at its root URL. Visitors can launch any live
lab or inspect its source code without creating an account or entering a
username and password.

## Lab Collection

| Lab | Focus | Application | Source |
| --- | --- | --- | --- |
| AHP Studio | Multi-criteria decision analysis | [Open app](https://ahpstudio.com) | [GitHub](https://github.com/jrmst102/ahpstudio) |
| Airlines Sim | Competitive airline strategy | [Open app](https://airlines-sim.com) | [GitHub](https://github.com/jrmst102/airline_sim) |
| Dynamic Pricing Sandbox | Dynamic pricing strategy | [Open app](https://pricingsandbox.com) | [GitHub](https://github.com/jrmst102/dynamic_sandbox) |
| Negotiation Sim | AI-supported negotiation practice | [Open app](https://negotiationsim-lofem.ondigitalocean.app) | [GitHub](https://github.com/jrmst102/negotiationsim) |
| Scenario Sim | Scenario planning under uncertainty | [Open app](https://scenariomanager-6m53a.ondigitalocean.app) | [GitHub](https://github.com/jrmst102/scenariomanager) |

Decision Trees is planned as a future addition. The portal itself is also
[available on GitHub](https://github.com/jrmst102/decisionlab).

## Features

- Public, login-free access to the complete live lab collection
- Direct application and GitHub repository links on every lab card
- Responsive, accessible interface for desktop and mobile devices
- NYU Violet, approved supporting colors, and Montserrat/Verdana typography
- Official responsive NYU logo assets with unmodified proportions
- MIT-licensed portal and applications
- Protected legacy administration and course-management routes

## NYU Brand System

The interface follows NYU visual identity guidance:

- NYU Violet: `#57068C`
- Deep Violet: `#330662`
- Ultra Violet: `#8900E1`, used sparingly
- Light Violet and neutral colors for supporting surfaces
- Montserrat with Verdana and system sans-serif fallbacks
- Official long and short NYU logo artwork from [`docs/logos`](docs/logos)

The logo artwork is displayed without recoloring, rearranging, distortion, or
additional lockups.

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
require a database or login credentials.

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
