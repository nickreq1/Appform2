# Equity One Loan Portal

A complete loan application portal for brokers and borrowers, built with Next.js 16, TypeScript, Tailwind CSS, and PostgreSQL.

## Features

- 🔐 **Authentication** — JWT-based login/signup with role-based access (Borrower, Broker, Admin)
- 📋 **Multi-Step Application Form** — 6-step guided form covering personal info, employment, loan details, property, assets/liabilities, and review
- 📊 **User Dashboard** — Application history with status tracking
- 🛡️ **Admin Panel** — View all applications, filter by status, search, export CSV
- 📁 **File Uploads** — Upload supporting documents (PDF, images, Word docs)
- 🔄 **Status Management** — Full status history and audit trail

## Quick Start

### Prerequisites
- Node.js 18+
- PostgreSQL database

### Setup

1. **Clone and install dependencies:**
   ```bash
   cd loan-portal
   npm install
   ```

2. **Configure environment:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your database URL and JWT secret
   ```

3. **Set up the database:**
   ```bash
   npx prisma migrate dev --name init
   npx prisma generate
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Open** [http://localhost:3000](http://localhost:3000)

### Local demo mode (no database required)

If you just want to click through the portal locally, run the app without `DATABASE_URL` and use the demo access buttons on `/auth/login`.

```bash
cd loan-portal
npm install
npm run dev
```

Demo mode is enabled automatically in non-production when no database is configured. It provides local-only demo borrower, broker, and admin access so you can test the portal without creating accounts or setting up PostgreSQL first.

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string |
| `JWT_SECRET` | Secret key for JWT signing (use a long random string) |
| `NEXT_PUBLIC_APP_URL` | Application URL |
| `UPLOAD_DIR` | Directory for file uploads (default: `./uploads`) |
| `DEMO_MODE` | Optional override for local demo mode (`true` or `false`) |

## Production Deployment

### Vercel

This repository keeps the Next.js app in the `loan-portal/` subdirectory.

1. Import the `nickreq1/Appform2` repository into Vercel.
2. Set the **Root Directory** to `loan-portal`.
3. Configure the required environment variables from `.env.example`.
4. Provision a PostgreSQL database and set `DATABASE_URL`.
5. Run Prisma migrations in production with:
   ```bash
   npx prisma migrate deploy
   ```

### Root-level npm commands

If your hosting platform builds from the repository root, you can use the root scripts that proxy to `loan-portal`:

```bash
npm install
npm run build
npm run start
```

### File uploads on serverless hosting

The current upload implementation writes files to the local filesystem. That works for local development and for hosts that provide persistent disk storage via `UPLOAD_DIR`, but serverless platforms such as Vercel do not provide durable local storage. For a production Vercel deployment, wire uploads to an external object store before relying on persisted uploaded files.

## User Roles

| Role | Permissions |
|------|-------------|
| **BORROWER** | Create/edit/view own applications, upload documents |
| **BROKER** | Same as borrower + update application status |
| **ADMIN** | Full access to all applications + admin panel |

## Creating an Admin User

After running migrations, create an admin via the Prisma Studio or directly update the role:

```bash
npx prisma studio
# Set a user's role to ADMIN
```

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: JWT + bcrypt
- **Validation**: Zod

## API Endpoints

### Auth
- `POST /api/auth/register` — Register new user
- `POST /api/auth/login` — Login
- `POST /api/auth/logout` — Logout
- `GET /api/auth/me` — Get current user

### Applications
- `GET /api/applications` — List user's applications
- `POST /api/applications` — Create application
- `GET /api/applications/:id` — Get application details
- `PUT /api/applications/:id` — Update application
- `DELETE /api/applications/:id` — Delete draft application
- `PUT /api/applications/:id/status` — Update status (broker/admin)
- `POST /api/applications/:id/upload` — Upload document

### Admin
- `GET /api/admin/applications` — List all applications (admin only)
- `GET /api/admin/applications/export` — Export CSV (admin only)

## HubSpot Integration

HubSpot integration is prepared for future connection. When ready, add the HubSpot API key to `.env.local` and implement the submission webhook in the status update handler.
