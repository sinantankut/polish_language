# Polish Language Platform

Private, invite-only Polish learning platform with a Supabase backend, Vercel-ready API handlers, and an A1-C1 curriculum shell focused first on A2-B1 case practice.

## Local Setup

Install dependencies:

```bash
npm install
```

Create `.env.local` with browser-safe Supabase values:

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

The app also accepts these aliases:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your-publishable-key
```

Run locally:

```bash
npm run dev
```

## Supabase Setup

Apply the migration in `supabase/migrations/202605220001_platform_foundation.sql`.

If your direct Supabase connection string uses `db.<project-ref>.supabase.co:5432` and your network cannot route IPv6, use the Session pooler connection string from the Supabase dashboard instead. Supabase documents that direct database connections are IPv6-only by default, while pooler connection strings support IPv4.

Bootstrap the first admin with `supabase/bootstrap-admin.sql` by replacing `<ADMIN_EMAIL>` locally. Do not commit real emails or credentials.

Server-side invite emails require:

```bash
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

Keep this value only in local `.env.local` and Vercel environment variables.

## Checks

```bash
npm run lint
npm run test
npm run build
```

## Vercel

Set these environment variables in Vercel:

```bash
VITE_SUPABASE_URL
VITE_SUPABASE_PUBLISHABLE_KEY
SUPABASE_SERVICE_ROLE_KEY
APP_BASE_URL
```

AI generation is planned behind reviewed admin workflows:

```bash
AI_PROVIDER
OPENAI_API_KEY
DEEPSEEK_API_KEY
AI_GENERATION_ENABLED
```
