# DECISION MAKING LAB

## Web Application Portal — Project Specifications

**Version 1.1 | March 2026**

**Prepared by:** Dr. Jose Mendoza
**Course:** Competitive Strategy

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Overview](#2-project-overview)
3. [System Architecture](#3-system-architecture)
4. [User Roles and Permissions](#4-user-roles-and-permissions)
5. [Lab Tools](#5-lab-tools)
6. [User Interface Design](#6-user-interface-design)
7. [Authentication and Single Sign-On](#7-authentication-and-single-sign-on)
8. [Course and School Management](#8-course-and-school-management)
9. [Administration Features](#9-administration-features)
10. [Information Pages](#10-information-pages)
11. [Branding and Visual Design](#11-branding-and-visual-design)
12. [Technical Stack and Infrastructure](#12-technical-stack-and-infrastructure)
13. [Database Schema](#13-database-schema)
14. [API Endpoints](#14-api-endpoints)
15. [Security Requirements](#15-security-requirements)
16. [Deployment and DevOps](#16-deployment-and-devops)
17. [Future Considerations](#17-future-considerations)

---

## 1. Executive Summary

The Decision Making Lab is a web-based portal designed to provide unified access to a suite of existing, independently developed decision-making and strategy simulation tools used in competitive strategy courses. The platform serves as a centralized gateway for students, professors, and administrators across multiple courses and institutions.

All six lab tools — AHP Studio, Airlines Sim, Scenario Sim, Decision Trees, Negotiation Sim, and Dynamic Pricing Sandbox — are already built and operational. This project's scope is limited to the portal itself: a Single Sign-On (SSO) access layer with role-based access control, course management capabilities, and a clean, icon-driven user interface built around NYU's official brand identity. The portal does not include the development or modification of the tools themselves.

---

## 2. Project Overview

### 2.1 Purpose

The Decision Making Lab portal consolidates access to six existing, independently developed decision-making and strategy simulation tools under a single, unified platform. The tools are already built and in use; this project focuses exclusively on the portal layer that provides SSO authentication, user and course management, and a centralized launch point. It eliminates the need for separate credentials and login flows across tools, providing a seamless academic experience.

### 2.2 Scope

The scope of this project covers the portal and access management layer only. It does not include the development, modification, or maintenance of the six lab tools, which are pre-existing applications.

**In Scope:**

- A responsive web application with SSO authentication
- Role-based user management (Admin, Professor, Student)
- SSO integration with six existing lab tools via embedded frames or external redirect
- Course and school organizational hierarchy
- Tool assignment at the user and group level
- Administrative dashboard for user, course, and tool management
- Static information pages (Terms, Privacy, About, Academic Use, Contact)

**Out of Scope:**

- Development or modification of AHP Studio, Airlines Sim, Scenario Sim, Decision Trees, Negotiation Sim, or Dynamic Pricing Sandbox
- Hosting or infrastructure for the individual tools (each tool maintains its own hosting)
- Content creation within the tools (simulations, datasets, exercises)

### 2.3 Key Stakeholders

| Role | Name / Entity | Responsibility |
|------|---------------|----------------|
| Project Owner | Dr. Jose Mendoza | Requirements, approval, academic direction |
| Development | TBD (GitHub Collaborators) | Design, coding, testing, deployment |
| Hosting | DigitalOcean | Cloud infrastructure |

---

## 3. System Architecture

### 3.1 High-Level Architecture

The Decision Making Lab follows a modern three-tier architecture:

- **Presentation Layer:** A responsive Single Page Application (SPA) using a modern JavaScript framework (React or Next.js), styled to NYU brand guidelines.
- **Application Layer:** A RESTful API backend (Node.js/Express or equivalent) handling authentication, authorization, user management, course management, and tool access routing.
- **Data Layer:** A relational database (PostgreSQL) for persistent storage of users, courses, schools, enrollments, and tool assignments.

### 3.2 Integration Architecture

All six lab tools are pre-existing, independently hosted applications. The portal connects to them as an access and authentication layer. Each tool integrates with the portal through one of the following methods, depending on what the tool's existing architecture supports:

1. **Embedded iframe:** The tool is rendered within the portal's interface, with session tokens passed via URL parameters or postMessage API.
2. **External redirect with SSO token:** The user is redirected to the tool's own domain with a signed JWT token for seamless authentication.
3. **API-based integration:** The portal communicates with the tool's existing backend API to provision user accounts and manage sessions.

The specific integration method for each tool will be determined during the implementation phase based on a technical review of each tool's existing capabilities and APIs. Minor modifications to the tools' authentication layers may be required to accept the portal's SSO tokens; any such changes are coordinated separately from this project.

### 3.3 Tool Technical Summary

The following table summarizes the current technology stack and hosting of each tool, relevant to integration planning:

| Tool | Backend | Frontend | Auth Mechanism | Data Storage | Hosting |
|------|---------|----------|----------------|--------------|---------|
| AHP Studio | Node.js / Express | React 18 | JWT + httpOnly cookies | DigitalOcean Spaces (S3) | DO App Platform |
| Airlines Sim | Python / FastAPI | Jinja2 + Plotly.js | bcrypt + signed session cookies | CSV via DO Spaces (S3) | DO App Platform |
| Negotiation Sim | Python / FastAPI | Jinja2 server-rendered | bcrypt + signed session cookies | CSV via DO Spaces (S3) | DO App Platform |
| Dynamic Pricing Sandbox | React 19 (SPA) | React 19 + Recharts | Session-based auth | localStorage + serverless proxy | DO App Platform |
| Scenario Sim | TBD | TBD | TBD | TBD | TBD |
| Decision Trees | TBD | TBD | TBD | TBD | TBD |

---

## 4. User Roles and Permissions

### 4.1 Role Definitions

| Role | Description | Key Capabilities |
|------|-------------|------------------|
| **Admin** | Full system administrator with unrestricted access to all portal functions. | Manage all users, courses, schools, and tools. View analytics. Configure system settings. |
| **Professor** | Course instructor who manages students within their assigned courses. | Create/manage courses. Add/remove students. Assign tools to students. View course roster and activity. |
| **Student** | End user who accesses assigned tools within enrolled courses. | View and launch assigned tools. Access course materials. Update own profile. |

### 4.2 Permission Matrix

| Action | Admin | Professor | Student |
|--------|-------|-----------|---------|
| Create/delete schools | ✓ | ✗ | ✗ |
| Create/edit/delete courses | ✓ | ✓ (own) | ✗ |
| Add/remove users | ✓ | ✓ (own courses) | ✗ |
| Assign tools to users/groups | ✓ | ✓ (own courses) | ✗ |
| Access all tools | ✓ | ✓ | Assigned only |
| View system analytics | ✓ | ✗ | ✗ |
| View course roster | ✓ | ✓ (own) | ✗ |
| Edit own profile | ✓ | ✓ | ✓ |
| Launch assigned tools | ✓ | ✓ | ✓ |

---

## 5. Lab Tools

The portal provides access to the following six existing decision-making tools. Each tool is already developed, hosted, and operational independently of the portal. The portal's role is to serve as the unified entry point, displaying each tool as a distinctive icon on the main dashboard and handling authentication via SSO.

### 5.1 AHP Studio

- **URL:** [www.ahpstudio.com](https://www.ahpstudio.com)
- **Version:** 1.1.9 (First Stable Release)
- **Description:** A web-based decision support application implementing the Analytic Hierarchy Process (AHP). Enables structured multi-criteria decision making through pairwise comparisons, priority computation, consistency analysis, and sensitivity analysis.
- **Key Features:** Wizard-style pairwise comparisons with progress tracking; up to 10 criteria with 6 sub-criteria each and 12 alternatives; participant participation via shareable tokenized links with optional PIN protection and anonymous mode; Kendall's W consensus measurement with chi-squared test; multi-round Delphi iteration for convergence; real-time WebSocket status updates; eigenvector priority computation with automatic consistency ratio checking; global synthesis with normalized and idealized rankings; sensitivity analysis for rank reversal detection; printable decision report with AI-generated narrative summaries; AI consistency coaching and smart validation.
- **Tech Stack:** Node.js/Express backend, React 18 frontend, DigitalOcean Spaces (S3-compatible, no database), JWT authentication with httpOnly cookies, OpenAI API for LLM features (optional, graceful degradation).
- **Status:** Existing web application, independently hosted on DigitalOcean App Platform.
- **Repository:** `github.com/jrmst102/ahpstudio`
- **SSO Integration Notes:** Currently uses JWT with httpOnly cookies and bcryptjs hashing. Portal SSO can likely integrate via a shared JWT secret or token exchange endpoint. The existing `/api/v1/auth/login` endpoint and admin user management API provide hooks for programmatic account provisioning.

### 5.2 Airlines Sim

- **URL:** [www.airlines-sim.com](https://www.airlines-sim.com)
- **Version:** 1.12
- **Description:** A competitive airline industry simulation where student teams manage virtual airlines across multiple rounds. Teams make strategic decisions on flight capacity, business and leisure pricing, branding investment, and product strategy level, then compete on market share, revenue, and profitability.
- **Key Features:** Unified web application with shared login routing to Admin or Team dashboards; 5 decision variables per round (flights/day, business price, leisure price, branding level, product strategy); multi-round simulation lifecycle (create, start, advance rounds, end) with admin controls; interactive charts (pie, bar, line) via Plotly.js; printable final report; team performance view with auto-refresh; simulation management CLI for create, list, lock, unlock, and remove operations; user management with roles (Admin, Professor, TA, User); 32-scenario test suite with dual-layer verification.
- **Tech Stack:** Python/FastAPI backend, Jinja2 server-rendered templates with Plotly.js charts, CSV-backed data via DigitalOcean Spaces (S3-compatible) with local filesystem fallback, bcrypt + itsdangerous signed session cookies.
- **Status:** Existing web application, independently hosted on DigitalOcean App Platform.
- **Repository:** `github.com/jrmst102/airline_sim`
- **SSO Integration Notes:** Currently uses bcrypt password hashing with itsdangerous signed session cookies. Multi-simulation authentication already supports simulation-scoped login. Portal SSO will likely use external redirect with token exchange. The existing `/health` endpoint can serve as a connectivity check.

### 5.3 Scenario Sim

- **Description:** A scenario planning simulation tool that allows students to develop, analyze, and compare multiple future scenarios for strategic decision making under uncertainty.
- **Status:** Existing application; domain and hosting details to be confirmed.
- **Integration:** Portal integration method to be determined based on technical review of the tool's current architecture.

### 5.4 Decision Trees

- **Description:** An interactive decision tree builder and analyzer. Students construct decision trees with probability nodes, calculate expected values, perform sensitivity analysis, and visualize optimal decision paths.
- **Status:** Existing application; domain and hosting details to be confirmed.
- **Integration:** Portal integration method to be determined based on technical review of the tool's current architecture.

### 5.5 Negotiation Sim

- **URL:** Domain not yet assigned.
- **Version:** 1.2 (Class Session Mode)
- **Description:** A web-based negotiation simulation for the Competitive Strategy course. Students negotiate a Brand Partnership deal through structured rounds, receiving AI-powered feedback and scoring against an objective rubric. Supports both asynchronous homework mode (individual student vs. AI counterpart) and synchronous class session mode (instructor-paced, group-based, human-vs-human negotiations).
- **Key Features:** Brand Partnership scenario with 8 negotiable term fields across 3 rounds; AI counterpart (GPT-4 Mini) with fixed persona, hidden priorities, and conversation memory; objective scoring rubric — Economic Value (40%), Strategic Alignment (30%), Relationship Preservation (20%), Information Management (10%); anonymized leaderboard with auto-generated aliases (instructor sees real name mapping); 3-submission cap per round; class session mode with teams of 2–6, instructor-controlled timed rounds (pause/resume/extend), human-human pairing with AI as evaluator, and configurable counterpart modes (ALL_HH, ALL_HA, MIXED); dual leaderboards for homework and class session scores.
- **Tech Stack:** Python 3.12/FastAPI backend, Jinja2 server-rendered HTML, custom CSS, CSV data via DigitalOcean Spaces (S3) or local filesystem, OpenAI GPT-4 Mini for AI counterpart and evaluation, bcrypt + itsdangerous signed session cookies.
- **Status:** Existing web application, independently hosted on DigitalOcean App Platform.
- **Repository:** `github.com/jrmst102/negotiationsim`
- **SSO Integration Notes:** Currently uses bcrypt + itsdangerous signed session cookies with multi-simulation auth. Structure is similar to Airlines Sim. Portal SSO will likely use external redirect with token exchange.

### 5.6 Dynamic Pricing Sandbox

- **URL:** Domain not yet assigned.
- **Version:** 1.2.0
- **Description:** An educational browser-based simulation for learning dynamic pricing strategy. Students adjust prices in real time, observe demand shifts, apply promotional tactics, and maximize revenue across four progressively challenging industry scenarios (E-Commerce, Airline Seats, Hotel, Event Tickets).
- **Key Features:** Four scenarios with varying price elasticity unlocked sequentially (60%+ pricing efficiency to advance); configurable tick pacing (Deliberate at 5 min/tick, Standard at 1 min/tick, Fast/Hard at 2 sec/tick); competitor price display with competitive pressure affecting demand; promotional tools (discounts 5–25%, campaigns including Social Media Blast, Email Campaign, Influencer Partnership, Loyalty Reward); scenario-specific bundles; collapsible decision-support panel with elasticity indicator, revenue trend, price sensitivity, demand forecast, competitor delta, and inventory burn rate; AI-generated post-scenario strategy analysis via Anthropic Claude (serverless proxy); printable PDF report; persistent score tracking with challenge retake; scenario briefing screens with context, objectives, competitor intel, and strategic hints.
- **Tech Stack:** React 19 SPA with Recharts for charting, Tailwind CSS 3, shared `@jrmst102/ui-kit` and `@jrmst102/shared-config` packages (GitHub Package Registry), Anthropic Claude API via DigitalOcean Functions serverless proxy, session-based authentication with protected routes.
- **Status:** Existing web application, independently hosted on DigitalOcean App Platform.
- **Repository:** `github.com/jrmst102/dynamic_sandbox`
- **SSO Integration Notes:** Currently uses its own session-based authentication with protected routes. As a React SPA, it can potentially be embedded via iframe within the portal. Portal SSO integration will require either a token-based auth handshake or iframe postMessage communication. The `@jrmst102/auth-client` package it uses may facilitate a shared authentication approach across tools built on the same component library.

---

## 6. User Interface Design

### 6.1 Main Dashboard (Home Screen)

The main screen is the primary interface after login. It displays the available lab tools as large, visually distinct icons in a responsive grid layout. The design prioritizes clarity and ease of use.

**Dashboard Layout:**

- **Header bar:** Application logo (Decision Making Lab), user name and avatar, notifications bell, and profile/logout dropdown menu.
- **Tool grid area:** A centered grid of six tool icons (3×2 at desktop, responsive stacking on smaller screens). Each icon consists of a square card with a distinctive graphic icon, the tool name below, and a brief one-line description. Only tools assigned to the current user are displayed.
- **Course selector:** If the user is enrolled in multiple courses, a dropdown or tab bar at the top of the tool grid allows switching between course contexts.
- **Footer:** Copyright notice (© 2026 by Dr. Jose Mendoza) and links to Terms and Conditions, About, Privacy Policy, Academic Use Policy, and Contact.

### 6.2 Tool Card Specifications

- Card dimensions: Responsive, approximately 200×200px at desktop resolution.
- Icon: Unique SVG or high-resolution PNG icon representing each tool.
- Tool name: Displayed below the icon in bold text.
- Hover state: Subtle elevation shadow and border color change to NYU Violet.
- Click action: Opens the tool via the configured integration method (iframe overlay, new tab, or embedded panel).

### 6.3 Navigation Structure

The application uses a top navigation bar with the following structure:

- Logo and application name (left-aligned)
- Primary navigation links: Dashboard, My Courses, Help (center or left)
- User menu (right-aligned): Profile, Settings, Logout
- For Admin and Professor roles, an additional "Admin" or "Manage" link appears in the primary navigation.

### 6.4 Footer

The footer appears on all pages and contains:

- **Copyright text:** © 2026 by Dr. Jose Mendoza
- **Navigation links:** Terms and Conditions, About, Privacy Policy, Academic Use Policy, Contact
- **Footer background:** NYU Violet or dark variant
- **Footer text color:** White

---

## 7. Authentication and Single Sign-On

### 7.1 Authentication Method

Users authenticate using their email address as the primary identifier. The system supports the following authentication flows:

- **Email and password:** Standard email/password login with secure password hashing (bcrypt or Argon2).
- **Magic link (optional):** Passwordless login via a one-time email link.
- **OAuth 2.0 (future):** Integration with institutional identity providers (Google Workspace, Microsoft Azure AD).

### 7.2 Single Sign-On (SSO) to Tools

Once authenticated to the portal, users gain access to their assigned tools without additional login prompts. The SSO mechanism works as follows:

1. User logs into the Decision Making Lab portal.
2. Upon launching a tool, the portal generates a signed JWT token containing the user's identity, role, and course context.
3. The token is passed to the tool either via URL parameter (for redirects) or postMessage API (for iframes).
4. The tool validates the token against a shared secret or public key and establishes the user's session.

**Tool-Specific SSO Considerations:**

| Tool | Current Auth | Recommended SSO Approach |
|------|-------------|--------------------------|
| AHP Studio | JWT + httpOnly cookies | Token exchange via existing JWT infrastructure |
| Airlines Sim | bcrypt + signed session cookies | External redirect with portal-signed JWT |
| Negotiation Sim | bcrypt + signed session cookies | External redirect with portal-signed JWT |
| Dynamic Pricing Sandbox | Session-based auth (`@jrmst102/auth-client`) | iframe postMessage or shared auth-client package |
| Scenario Sim | TBD | TBD |
| Decision Trees | TBD | TBD |

### 7.3 Session Management

- **Session duration:** Configurable, default 8 hours.
- **Refresh tokens:** Issued alongside access tokens to enable seamless session renewal.
- **Concurrent sessions:** Users may have multiple active sessions (e.g., laptop and mobile).
- **Session revocation:** Admins can force-logout any user.

---

## 8. Course and School Management

### 8.1 Organizational Hierarchy

The platform supports a multi-level organizational structure:

- **School:** The top-level entity (e.g., NYU Stern, NYU Tandon). Each school can have multiple courses.
- **Course:** A course belongs to a school and a professor. Courses have a name, code, semester/term, and a list of enrolled students.
- **Student:** A student is enrolled in one or more courses and may belong to courses across different schools.

### 8.2 Course Management Features

- Create, edit, archive, and delete courses.
- Assign a professor (or multiple professors) to a course.
- Enroll students individually or via bulk CSV/Excel import.
- Assign specific tools to the entire course or to individual students within the course.
- Set course start and end dates to control access windows.

### 8.3 Multi-Course Enrollment

Students can be enrolled in multiple courses simultaneously. When a student logs in, the dashboard displays a course selector that allows them to switch context. Each course context shows only the tools assigned for that course. A student's global tool set is the union of all tools assigned across all active course enrollments.

---

## 9. Administration Features

### 9.1 User Management

- Add users individually (email, name, role) or in bulk via CSV upload.
- Edit user profile information and role.
- Activate, deactivate, or delete user accounts.
- Reset passwords and force logout.
- Search and filter users by name, email, role, school, or course.

### 9.2 Tool Assignment

Admins and professors can assign tools at the following levels:

- **Course-level:** All students in a course receive access to a set of tools.
- **Individual-level:** Specific students can be granted or revoked access to specific tools, overriding course-level defaults.
- **Tool groups:** Predefined bundles of tools (e.g., "Strategy Fundamentals" = AHP Studio + Decision Trees, "Full Lab" = all six tools) that can be assigned as a unit.

### 9.3 Dashboard Analytics (Admin)

- Total users by role, school, and course.
- Active sessions and login frequency.
- Tool usage statistics (launches per tool, per course, per student).
- Course enrollment counts and trends.

---

## 10. Information Pages

The following static pages are accessible from the footer on all pages. They do not require authentication to view.

### 10.1 Terms and Conditions

Outlines the terms of use for the Decision Making Lab portal, including acceptable use policies, intellectual property provisions, limitation of liability, and dispute resolution. Content to be provided by the project owner.

### 10.2 About

Describes the mission and purpose of the Decision Making Lab, the pedagogical rationale behind the selected tools, and background information on the project creator, Dr. Jose Mendoza.

### 10.3 Privacy Policy

Details how user data is collected, stored, processed, and protected. Includes information about cookies, analytics, third-party tool data sharing, and data retention policies. Must comply with applicable privacy regulations (FERPA, GDPR where applicable).

### 10.4 Academic Use Policy

Specifies the intended academic use of the platform, guidelines for academic integrity when using the tools, and policies regarding data generated during simulations and exercises.

### 10.5 Contact

Provides a contact form and/or email address for technical support, academic inquiries, and general questions. May include links to additional support resources or FAQ.

---

## 11. Branding and Visual Design

### 11.1 Color Palette

The application uses the official NYU color palette as its primary design system:

| Color Name | HEX | RGB | Usage |
|------------|-----|-----|-------|
| **NYU Violet** | #57068C | R87 G6 B140 | Primary brand color |
| **Ultra Violet** | #8900E1 | R137 G0 B225 | Accents, hover states |
| **Dark Violet** | #330662 | R51 G6 B98 | Headers, dark backgrounds |
| **Light Violet** | #EEE6F3 | R238 G230 B243 | Backgrounds, cards |
| **Black** | #000000 | R0 G0 B0 | Body text |
| **White** | #FFFFFF | R255 G255 B255 | Page backgrounds |

### 11.2 Typography

- **Primary font:** A clean sans-serif typeface (e.g., Montserrat or Verdana as NYU-recommended fallbacks).
- **Headings:** Bold weight, NYU Violet color.
- **Body text:** Regular weight, black or dark gray (#404040).
- **Font sizes:** H1 (28px), H2 (22px), H3 (18px), Body (16px), Small (14px).

### 11.3 Design Principles

- **Clean and modern:** Generous whitespace, card-based layouts, and subtle shadows.
- **Accessible:** WCAG 2.1 AA compliance. Minimum 3:1 contrast ratio for all text elements. Keyboard navigable.
- **Responsive:** Fully functional on desktop, tablet, and mobile devices.
- **Consistent:** Uniform spacing, alignment, and component styling across all pages.

---

## 12. Technical Stack and Infrastructure

### 12.1 Recommended Technology Stack

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Frontend | Next.js (React) | SSR support, excellent DX, wide ecosystem |
| Backend / API | Node.js with Express or Next.js API routes | JavaScript full-stack, fast development |
| Database | PostgreSQL | Robust relational database, ACID compliance |
| ORM | Prisma | Type-safe queries, migrations, schema management |
| Authentication | NextAuth.js or custom JWT | Flexible auth with email/password and OAuth |
| Hosting | DigitalOcean App Platform or Droplet | Reliable, cost-effective cloud hosting |
| Source Control | GitHub | Version control, CI/CD, collaboration |
| CSS Framework | Tailwind CSS | Utility-first, customizable to NYU palette |

---

## 13. Database Schema

### 13.1 Core Entities

The following entity-relationship model defines the core data structures.

#### Users

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique user identifier |
| email | VARCHAR(255) | Unique, Not Null | Login email address |
| password_hash | VARCHAR(255) | Not Null | Bcrypt/Argon2 hash |
| first_name | VARCHAR(100) | Not Null | User first name |
| last_name | VARCHAR(100) | Not Null | User last name |
| role | ENUM | Not Null | admin \| professor \| student |
| is_active | BOOLEAN | Default: true | Account active status |
| created_at | TIMESTAMP | Auto | Account creation date |
| updated_at | TIMESTAMP | Auto | Last modification date |

#### Schools

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique school identifier |
| name | VARCHAR(255) | Not Null | School name |
| code | VARCHAR(20) | Unique | Short code (e.g., STERN) |
| created_at | TIMESTAMP | Auto | Creation date |

#### Courses

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique course identifier |
| school_id | UUID | Foreign Key | References Schools.id |
| professor_id | UUID | Foreign Key | References Users.id |
| name | VARCHAR(255) | Not Null | Course name |
| code | VARCHAR(20) | Not Null | Course code (e.g., STRT-6000) |
| semester | VARCHAR(20) | Not Null | Term (e.g., Fall 2026) |
| start_date | DATE | | Course start date |
| end_date | DATE | | Course end date |
| is_active | BOOLEAN | Default: true | Active status |

#### Tools

| Field | Type | Constraints | Description |
|-------|------|-------------|-------------|
| id | UUID | Primary Key | Unique tool identifier |
| name | VARCHAR(100) | Not Null | Display name (e.g., AHP Studio) |
| slug | VARCHAR(50) | Unique, Not Null | URL-safe identifier (e.g., ahp-studio) |
| url | VARCHAR(500) | Not Null | Tool base URL |
| icon_path | VARCHAR(255) | | Path to tool icon asset |
| description | TEXT | | Short description for dashboard card |
| auth_method | ENUM | Not Null | jwt_exchange \| redirect \| iframe \| tbd |
| is_active | BOOLEAN | Default: true | Availability status |
| created_at | TIMESTAMP | Auto | Creation date |

### 13.2 Junction Tables

The system uses junction tables to model many-to-many relationships: `course_enrollments` (linking users to courses), `tool_assignments` (linking tools to courses or individual users), and `tool_groups` (predefined bundles of tools). Additional tables include `sessions` for managing authentication state and `audit_log` for tracking administrative actions.

---

## 14. API Endpoints

### 14.1 Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Authenticate user with email/password |
| POST | `/api/auth/logout` | End user session |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/forgot-password` | Initiate password reset flow |
| POST | `/api/auth/reset-password` | Complete password reset with token |

### 14.2 Users

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List users (paginated, filterable) |
| POST | `/api/users` | Create new user |
| GET | `/api/users/:id` | Get user details |
| PUT | `/api/users/:id` | Update user |
| DELETE | `/api/users/:id` | Deactivate or delete user |
| POST | `/api/users/bulk-import` | Import users via CSV |

### 14.3 Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | List courses |
| POST | `/api/courses` | Create course |
| GET | `/api/courses/:id` | Get course details |
| PUT | `/api/courses/:id` | Update course |
| POST | `/api/courses/:id/enroll` | Enroll students |
| DELETE | `/api/courses/:id/enroll/:userId` | Remove student from course |
| POST | `/api/courses/:id/tools` | Assign tools to course |

### 14.4 Tools

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/tools` | List all tools |
| POST | `/api/tools/:id/launch` | Generate SSO token and launch tool |
| GET | `/api/tools/assigned` | Get tools assigned to current user |

---

## 15. Security Requirements

- All traffic served over HTTPS with TLS 1.2+ encryption.
- Passwords hashed using bcrypt (cost factor 12) or Argon2id.
- JWT tokens signed with RS256 (asymmetric) for tool SSO.
- CSRF protection on all state-changing endpoints.
- Rate limiting on authentication endpoints (e.g., 5 attempts per minute per IP).
- Input validation and sanitization on all API endpoints.
- SQL injection prevention via parameterized queries (enforced by ORM).
- XSS protection via Content Security Policy headers and output encoding.
- Role-based access control (RBAC) enforced at both API and UI levels.
- FERPA compliance for handling student educational records.
- Regular dependency audits via GitHub Dependabot or npm audit.
- Audit logging for all administrative actions (user creation, role changes, tool assignments).

---

## 16. Deployment and DevOps

### 16.1 Hosting Environment

**Platform:** DigitalOcean

The application will be deployed on DigitalOcean using either the App Platform (for managed deployments) or a Droplet (for full server control). This is consistent with the hosting of all existing tools, which are already deployed on DigitalOcean App Platform. The recommended setup includes:

- A DigitalOcean Droplet or App Platform instance running the Next.js application.
- A managed PostgreSQL database (DigitalOcean Managed Databases).
- DigitalOcean Spaces for static asset storage (tool icons, user uploads).
- A load balancer with SSL termination for HTTPS.

### 16.2 CI/CD Pipeline

**Repository:** GitHub

The development workflow follows a GitHub-based CI/CD pipeline:

1. Developers push code to feature branches on GitHub.
2. Pull requests trigger automated tests (unit, integration) via GitHub Actions.
3. Code review and approval by at least one team member.
4. Merge to main triggers automated deployment to staging environment.
5. Manual promotion from staging to production after verification.

### 16.3 Environment Strategy

- **Development:** Local development environment with Docker Compose.
- **Staging:** DigitalOcean environment mirroring production for QA testing.
- **Production:** Live environment accessible at the chosen domain.

---

## 17. Future Considerations

The following features and enhancements are outside the current scope but should be considered for future iterations:

- OAuth/SAML integration with institutional identity providers (NYU SSO, Google Workspace, Azure AD) for streamlined campus-wide authentication.
- In-app messaging and announcements system for professors to communicate with enrolled students.
- Tool usage analytics dashboard with visual charts showing engagement metrics per student, course, and tool.
- API for third-party tool developers to register new tools and integrate with the portal's SSO system.
- Mobile-native applications (iOS/Android) for improved mobile experience beyond responsive web.
- LTI (Learning Tools Interoperability) integration for compatibility with Learning Management Systems such as Canvas, Blackboard, and Moodle.
- Gamification features including badges, leaderboards, and progress tracking across tools.
- Multi-language support for international campuses and students.
- Unified `@jrmst102/auth-client` package extended to serve as a shared SSO client library across all tools built on the React/Node.js stack.

---

*© 2026 by Dr. Jose Mendoza*
