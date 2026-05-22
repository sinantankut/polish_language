# Polish Platform Foundation Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:subagent-driven-development` for the recommended execution path, or `superpowers:executing-plans` for inline execution. Implement this plan task-by-task, keep the checkbox state current, and stop at the review checkpoints before continuing.

## Goal

Build the deployable foundation for the Polish learning platform: Vercel-compatible app structure, Supabase configuration, invite-only authentication, admin-generated invitations, A1-C1 learning shell with A2-B1 active content, and declension-first data contracts. This slice should make the app usable as a private multi-user platform without implementing AI exercise generation yet.

## Non-Goals

- Do not copy, paraphrase, or recreate copyrighted textbook exercises.
- Do not implement learner-triggered AI generation.
- Do not preserve Marek/chat as a primary product surface.
- Do not hardcode Supabase URLs, keys, database passwords, OpenAI keys, or DeepSeek keys.
- Do not build full C1 curriculum in this slice; show the structure and leave later levels locked/empty.

## Architecture Summary

Keep the existing Vite + React + TypeScript frontend. Add Supabase as the durable auth/data layer, with browser-safe access only through `VITE_` env vars. Add Vercel-compatible API handlers under `api/`, backed by shared server modules in `src/server/`. Keep the existing Express server as a local development adapter while moving production-facing logic into reusable handlers.

The app shell should become curriculum-first:

- `Learn`: CEFR map from A1-C1, with A2-B1 populated first.
- `Cases`: declension tables and practice entry points.
- `Review`: progress and spaced-practice placeholder.
- `Admin`: invitation and content-generation workflow placeholder, visible only to admins.

## Files To Touch

- `package.json`
- `README.md`
- `.env.example`
- `vercel.json`
- `server.ts`
- `api/health.ts`
- `api/admin/invites.ts`
- `src/App.tsx`
- `src/config/env.ts`
- `src/config/env.test.ts`
- `src/lib/supabaseClient.ts`
- `src/platform/auth/AuthProvider.tsx`
- `src/platform/auth/AuthGate.tsx`
- `src/platform/auth/authTypes.ts`
- `src/platform/schema.ts`
- `src/platform/schema.test.ts`
- `src/platform/admin/invitesClient.ts`
- `src/server/http.ts`
- `src/server/supabaseAdmin.ts`
- `src/server/auth/requireAdmin.ts`
- `src/server/auth/requireAdmin.test.ts`
- `src/server/handlers/health.ts`
- `src/server/handlers/adminInvites.ts`
- `src/server/handlers/adminInvites.test.ts`
- `src/data/curriculumSeed.ts`
- `src/data/declensionTables.ts`
- `src/components/PlatformShell.tsx`
- `src/components/LearnMap.tsx`
- `src/components/DeclensionTables.tsx`
- `src/components/AdminStudio.tsx`
- `src/components/ReviewHome.tsx`
- `src/test/setup.ts`
- `vitest.config.ts`
- `supabase/migrations/202605220001_platform_foundation.sql`
- `supabase/bootstrap-admin.sql`

## Dependencies

Add only the dependencies needed for the foundation:

```json
{
  "dependencies": {
    "@supabase/supabase-js": "^2.49.0",
    "zod": "^3.24.0"
  },
  "devDependencies": {
    "@testing-library/jest-dom": "^6.6.0",
    "@testing-library/react": "^16.2.0",
    "jsdom": "^25.0.0",
    "vitest": "^3.0.0"
  }
}
```

If newer compatible versions are installed by the package manager, keep the lockfile result unless it causes lint/test/build failure.

## Task 1: Prepare A Real Working Checkout

- [ ] Run `git rev-parse --show-toplevel`.
- [ ] If it fails because the current local folder only contains planning docs, clone the GitHub repo into a dedicated working checkout instead of overwriting local planning files.

Suggested fallback:

```bash
git clone https://github.com/sinantankut/polish_language.git /private/tmp/polish_language-work
cd /private/tmp/polish_language-work
```

- [ ] Create a branch:

```bash
git switch -c platform-foundation
```

- [ ] Confirm the branch starts from GitHub `main` and that the spec/plan docs are available from the repo or copied in intentionally.

Review checkpoint:

- [ ] No local planning files were destroyed.
- [ ] The implementation workspace is a real git checkout.

## Task 2: Add Test Tooling And Package Scripts

- [ ] Update `package.json` with the dependencies above.
- [ ] Add scripts:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
  },
});
```

- [ ] Create `src/test/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] Run:

```bash
npm install
npm run lint
npm run test
```

Expected result:

- `npm run lint` should still pass or reveal only pre-existing TypeScript issues that must be fixed before continuing.
- `npm run test` should pass with no tests or with initial smoke tests added below.

## Task 3: Add Environment Configuration Without Secrets

- [ ] Create `.env.example` with placeholders only:

```bash
VITE_SUPABASE_URL=
VITE_SUPABASE_PUBLISHABLE_KEY=
SUPABASE_SERVICE_ROLE_KEY=
AI_PROVIDER=openai
OPENAI_API_KEY=
DEEPSEEK_API_KEY=
AI_GENERATION_ENABLED=false
APP_BASE_URL=http://localhost:5173
```

- [ ] Create `src/config/env.ts`:

```ts
import { z } from 'zod';

const browserEnvSchema = z.object({
  VITE_SUPABASE_URL: z.string().url(),
  VITE_SUPABASE_PUBLISHABLE_KEY: z.string().min(1),
});

export type BrowserEnv = z.infer<typeof browserEnvSchema>;

export function getBrowserEnv(env: ImportMetaEnv = import.meta.env): BrowserEnv {
  return browserEnvSchema.parse({
    VITE_SUPABASE_URL: env.VITE_SUPABASE_URL,
    VITE_SUPABASE_PUBLISHABLE_KEY: env.VITE_SUPABASE_PUBLISHABLE_KEY,
  });
}
```

- [ ] Create `src/config/env.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { getBrowserEnv } from './env';

describe('getBrowserEnv', () => {
  it('accepts valid browser-safe Supabase configuration', () => {
    expect(
      getBrowserEnv({
        VITE_SUPABASE_URL: 'https://example.supabase.co',
        VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
      } as ImportMetaEnv),
    ).toEqual({
      VITE_SUPABASE_URL: 'https://example.supabase.co',
      VITE_SUPABASE_PUBLISHABLE_KEY: 'publishable-key',
    });
  });

  it('rejects missing values', () => {
    expect(() => getBrowserEnv({} as ImportMetaEnv)).toThrow();
  });
});
```

Review checkpoint:

- [ ] The actual Supabase URL/key values from chat are not committed.
- [ ] No database password appears in any file.
- [ ] Service-role key is referenced only as an env var name.

## Task 4: Add Platform Schema Contracts

- [ ] Create `src/platform/schema.ts`:

```ts
import { z } from 'zod';

export const cefrLevelSchema = z.enum(['A1', 'A2', 'B1', 'B2', 'C1']);
export type CefrLevel = z.infer<typeof cefrLevelSchema>;

export const appRoleSchema = z.enum(['learner', 'admin']);
export type AppRole = z.infer<typeof appRoleSchema>;

export const invitationStatusSchema = z.enum(['pending', 'accepted', 'revoked']);
export type InvitationStatus = z.infer<typeof invitationStatusSchema>;

export const caseIdSchema = z.enum([
  'nominative',
  'genitive',
  'dative',
  'accusative',
  'instrumental',
  'locative',
  'vocative',
]);
export type CaseId = z.infer<typeof caseIdSchema>;

export const profileSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  displayName: z.string().nullable(),
  role: appRoleSchema,
  cefrGoal: cefrLevelSchema.default('B1'),
});
export type Profile = z.infer<typeof profileSchema>;

export const invitationSchema = z.object({
  id: z.string().uuid(),
  email: z.string().email(),
  status: invitationStatusSchema,
  createdBy: z.string().uuid().nullable(),
  acceptedBy: z.string().uuid().nullable(),
  createdAt: z.string(),
  acceptedAt: z.string().nullable(),
});
export type Invitation = z.infer<typeof invitationSchema>;

export const adminInviteRequestSchema = z.object({
  email: z.string().email().transform((email) => email.trim().toLowerCase()),
});
export type AdminInviteRequest = z.infer<typeof adminInviteRequestSchema>;
```

- [ ] Create `src/platform/schema.test.ts`:

```ts
import { describe, expect, it } from 'vitest';
import { adminInviteRequestSchema, caseIdSchema, cefrLevelSchema } from './schema';

describe('platform schema', () => {
  it('supports the planned CEFR range', () => {
    expect(cefrLevelSchema.options).toEqual(['A1', 'A2', 'B1', 'B2', 'C1']);
  });

  it('contains all seven Polish cases', () => {
    expect(caseIdSchema.options).toHaveLength(7);
  });

  it('normalizes invited email addresses', () => {
    expect(adminInviteRequestSchema.parse({ email: 'USER@EXAMPLE.COM' }).email).toBe(
      'user@example.com',
    );
  });
});
```

## Task 5: Add Supabase Database Migration

- [ ] Create `supabase/migrations/202605220001_platform_foundation.sql`.
- [ ] Use invite/profile/progress tables that support invite-only access, admin role checks, and later curriculum work:

```sql
create type public.app_role as enum ('learner', 'admin');
create type public.invitation_status as enum ('pending', 'accepted', 'revoked');
create type public.cefr_level as enum ('A1', 'A2', 'B1', 'B2', 'C1');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  display_name text,
  role public.app_role not null default 'learner',
  cefr_goal public.cefr_level not null default 'B1',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.invitations (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  status public.invitation_status not null default 'pending',
  created_by uuid references auth.users(id) on delete set null,
  accepted_by uuid references auth.users(id) on delete set null,
  created_at timestamptz not null default now(),
  accepted_at timestamptz
);

create table public.learning_progress (
  user_id uuid not null references auth.users(id) on delete cascade,
  unit_id text not null,
  status text not null default 'not_started',
  accuracy numeric(5,2),
  updated_at timestamptz not null default now(),
  primary key (user_id, unit_id)
);

alter table public.profiles enable row level security;
alter table public.invitations enable row level security;
alter table public.learning_progress enable row level security;

create or replace function public.current_user_role()
returns public.app_role
language sql
security definer
set search_path = public
stable
as $$
  select role from public.profiles where id = auth.uid()
$$;

create policy "profiles_select_own_or_admin"
on public.profiles
for select
using (id = auth.uid() or public.current_user_role() = 'admin');

create policy "profiles_update_own"
on public.profiles
for update
using (id = auth.uid())
with check (id = auth.uid());

create policy "invitations_admin_all"
on public.invitations
for all
using (public.current_user_role() = 'admin')
with check (public.current_user_role() = 'admin');

create policy "learning_progress_own"
on public.learning_progress
for all
using (user_id = auth.uid())
with check (user_id = auth.uid());
```

- [ ] Add a profile creation trigger only if it can safely map an authenticated user to a pending invitation:

```sql
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if not exists (
    select 1
    from public.invitations
    where email = lower(new.email)
      and status in ('pending', 'accepted')
  ) then
    raise exception 'Email address is not invited';
  end if;

  insert into public.profiles (id, email)
  values (new.id, lower(new.email))
  on conflict (id) do nothing;

  update public.invitations
  set status = 'accepted',
      accepted_by = new.id,
      accepted_at = coalesce(accepted_at, now())
  where email = lower(new.email)
    and status = 'pending';

  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();
```

Implementation note:

- If Supabase rejects `raise exception` behavior on `auth.users` creation in this environment, keep the app-level invite check and document the dashboard setting that disables public signups. Do not silently allow public registration.

- [ ] Create `supabase/bootstrap-admin.sql` with placeholders only:

```sql
-- Replace the placeholder email in the Supabase SQL editor after the first admin accepts an invite.
update public.profiles
set role = 'admin'
where email = '<ADMIN_EMAIL>';
```

Review checkpoint:

- [ ] RLS is enabled on every public table.
- [ ] Only admins can manage invitations.
- [ ] Learners can only read/write their own progress.

## Task 6: Add Supabase Clients

- [ ] Create `src/lib/supabaseClient.ts`:

```ts
import { createClient } from '@supabase/supabase-js';
import { getBrowserEnv } from '@/src/config/env';

const env = getBrowserEnv();

export const supabase = createClient(
  env.VITE_SUPABASE_URL,
  env.VITE_SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);
```

- [ ] Create `src/server/supabaseAdmin.ts`:

```ts
import { createClient } from '@supabase/supabase-js';

export function createSupabaseAdminClient() {
  const url = process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRoleKey) {
    throw new Error('Missing Supabase server configuration');
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}
```

Review checkpoint:

- [ ] `SUPABASE_SERVICE_ROLE_KEY` appears only in server-side files.
- [ ] Browser code imports only `src/lib/supabaseClient.ts`.

## Task 7: Add Vercel-Compatible HTTP Handler Pattern

- [ ] Create `src/server/http.ts`:

```ts
export type JsonResponse<T = unknown> = {
  status: number;
  body: T;
};

export type ApiRequest<TBody = unknown> = {
  method: string;
  headers: Record<string, string | string[] | undefined>;
  body?: TBody;
};
```

- [ ] Create `src/server/handlers/health.ts`:

```ts
import type { JsonResponse } from '../http';

export function healthHandler(): JsonResponse {
  return {
    status: 200,
    body: {
      ok: true,
      app: 'polish-language-platform',
    },
  };
}
```

- [ ] Create `api/health.ts`:

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { healthHandler } from '../src/server/handlers/health';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const response = healthHandler();
  res.status(response.status).json(response.body);
}
```

- [ ] If `@vercel/node` types are needed, add `@vercel/node` to `devDependencies`.
- [ ] Update `server.ts` so local `/api/health` uses the same `healthHandler`.
- [ ] Keep the existing Gemini endpoints working locally for now, but mark them as legacy and do not expose them as the foundation for the new AI layer.

- [ ] Create `vercel.json`:

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist"
}
```

Expected result:

- Local Express dev server and Vercel function both share health logic.
- Future admin/AI APIs can follow the same handler pattern.

## Task 8: Implement Admin Authorization Helper

- [ ] Create `src/server/auth/requireAdmin.ts`:

```ts
import type { ApiRequest } from '../http';
import { createSupabaseAdminClient } from '../supabaseAdmin';

export async function requireAdmin(req: ApiRequest) {
  const authHeader = req.headers.authorization;
  const token = Array.isArray(authHeader)
    ? authHeader[0]?.replace(/^Bearer\s+/i, '')
    : authHeader?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return { ok: false as const, status: 401, message: 'Missing authorization token' };
  }

  const supabaseAdmin = createSupabaseAdminClient();
  const { data: userResult, error: userError } = await supabaseAdmin.auth.getUser(token);

  if (userError || !userResult.user) {
    return { ok: false as const, status: 401, message: 'Invalid authorization token' };
  }

  const { data: profile, error: profileError } = await supabaseAdmin
    .from('profiles')
    .select('role')
    .eq('id', userResult.user.id)
    .single();

  if (profileError || profile?.role !== 'admin') {
    return { ok: false as const, status: 403, message: 'Admin access required' };
  }

  return { ok: true as const, user: userResult.user };
}
```

- [ ] Create `src/server/auth/requireAdmin.test.ts` with mocked Supabase admin client.
- [ ] Test missing token, invalid token, non-admin, and admin paths.

Review checkpoint:

- [ ] Admin checks are server-side.
- [ ] Client-side hiding of admin UI is treated as convenience only, not security.

## Task 9: Implement Admin-Generated Invitations

- [ ] Create `src/server/handlers/adminInvites.ts`:

```ts
import type { ApiRequest, JsonResponse } from '../http';
import { adminInviteRequestSchema } from '@/src/platform/schema';
import { requireAdmin } from '../auth/requireAdmin';
import { createSupabaseAdminClient } from '../supabaseAdmin';

export async function createInvitationHandler(
  req: ApiRequest,
): Promise<JsonResponse> {
  if (req.method !== 'POST') {
    return { status: 405, body: { error: 'Method not allowed' } };
  }

  const admin = await requireAdmin(req);
  if (!admin.ok) {
    return { status: admin.status, body: { error: admin.message } };
  }

  const parsed = adminInviteRequestSchema.safeParse(req.body);
  if (!parsed.success) {
    return { status: 400, body: { error: 'Invalid email address' } };
  }

  const supabaseAdmin = createSupabaseAdminClient();

  const { error: inviteRowError } = await supabaseAdmin
    .from('invitations')
    .upsert(
      {
        email: parsed.data.email,
        status: 'pending',
        created_by: admin.user.id,
      },
      { onConflict: 'email' },
    );

  if (inviteRowError) {
    return { status: 500, body: { error: 'Could not create invitation' } };
  }

  const { error: authInviteError } = await supabaseAdmin.auth.admin.inviteUserByEmail(
    parsed.data.email,
  );

  if (authInviteError) {
    return { status: 500, body: { error: 'Invitation saved, but email could not be sent' } };
  }

  return { status: 201, body: { email: parsed.data.email, status: 'pending' } };
}
```

- [ ] Create `api/admin/invites.ts`:

```ts
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createInvitationHandler } from '../../src/server/handlers/adminInvites';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const response = await createInvitationHandler({
    method: req.method ?? 'GET',
    headers: req.headers,
    body: req.body,
  });

  res.status(response.status).json(response.body);
}
```

- [ ] Add Express local adapter for `POST /api/admin/invites` in `server.ts`.
- [ ] Add handler tests for 401, 403, invalid email, Supabase row failure, email failure, and success.

Expected result:

- There is no public registration API.
- Invites are admin-generated only.

## Task 10: Add Client Auth Provider And Invite-Only Gate

- [ ] Create `src/platform/auth/authTypes.ts`:

```ts
import type { Session, User } from '@supabase/supabase-js';
import type { Profile } from '../schema';

export type AuthState = {
  session: Session | null;
  user: User | null;
  profile: Profile | null;
  loading: boolean;
  signInWithEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
};
```

- [ ] Create `src/platform/auth/AuthProvider.tsx` using `supabase.auth.getSession`, `onAuthStateChange`, profile fetch, and `signInWithOtp` with user creation disabled:

```ts
await supabase.auth.signInWithOtp({
  email,
  options: {
    shouldCreateUser: false,
  },
});
```

- [ ] Create `src/platform/auth/AuthGate.tsx`:

```tsx
import { FormEvent, useState } from 'react';
import { useAuth } from './AuthProvider';

export function AuthGate({ children }: { children: React.ReactNode }) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);

  if (auth.loading) return <main className="auth-screen">Loading...</main>;
  if (auth.session && auth.profile) return <>{children}</>;

  async function submit(event: FormEvent) {
    event.preventDefault();
    await auth.signInWithEmail(email);
    setSent(true);
  }

  return (
    <main className="auth-screen">
      <form onSubmit={submit} className="auth-panel">
        <h1>Polish Language Platform</h1>
        <p>Private access for invited learners.</p>
        <label>
          Email
          <input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </label>
        <button type="submit">Send sign-in link</button>
        {sent ? <p>Check your email for the private sign-in link.</p> : null}
      </form>
    </main>
  );
}
```

Implementation note:

- Keep the visible copy focused on private access. Do not use "register", "create account", or public signup language.

## Task 11: Add Curriculum And Declension Seed Data

- [ ] Create `src/data/curriculumSeed.ts` with original metadata only:

```ts
import type { CefrLevel, CaseId } from '@/src/platform/schema';

export type CurriculumUnit = {
  id: string;
  level: CefrLevel;
  title: string;
  focus: string;
  cases: CaseId[];
  status: 'available' | 'planned' | 'locked';
};

export const curriculumLevels: CefrLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1'];

export const curriculumUnits: CurriculumUnit[] = [
  {
    id: 'a2-identity-instrumental',
    level: 'A2',
    title: 'Identity and professions',
    focus: 'Instrumental case after identity and role expressions',
    cases: ['instrumental'],
    status: 'available',
  },
  {
    id: 'a2-quantity-genitive',
    level: 'A2',
    title: 'Quantity, absence, and possession',
    focus: 'Genitive after numbers, negation, and possession patterns',
    cases: ['genitive'],
    status: 'available',
  },
  {
    id: 'b1-motion-accusative-locative',
    level: 'B1',
    title: 'Motion and location',
    focus: 'Accusative for direction and locative for static location',
    cases: ['accusative', 'locative'],
    status: 'available',
  },
  {
    id: 'b2-style-register',
    level: 'B2',
    title: 'Register and precision',
    focus: 'Planned advanced syntax and style work',
    cases: [],
    status: 'planned',
  },
  {
    id: 'c1-argumentation',
    level: 'C1',
    title: 'Argumentation and nuance',
    focus: 'Planned academic and professional Polish',
    cases: [],
    status: 'planned',
  },
];
```

- [ ] Create `src/data/declensionTables.ts` with compact original tables:

```ts
import type { CaseId } from '@/src/platform/schema';

export type DeclensionRow = {
  caseId: CaseId;
  polishName: string;
  questions: string[];
  coreUses: string[];
  nounHints: string[];
};

export const declensionRows: DeclensionRow[] = [
  {
    caseId: 'nominative',
    polishName: 'mianownik',
    questions: ['kto?', 'co?'],
    coreUses: ['subject', 'dictionary form'],
    nounHints: ['baseline form before case changes'],
  },
  {
    caseId: 'genitive',
    polishName: 'dopełniacz',
    questions: ['kogo?', 'czego?'],
    coreUses: ['absence', 'quantity', 'possession', 'negation'],
    nounHints: ['watch masculine animate/inanimate and plural endings'],
  },
  {
    caseId: 'dative',
    polishName: 'celownik',
    questions: ['komu?', 'czemu?'],
    coreUses: ['recipient', 'beneficiary', 'experiencer'],
    nounHints: ['common after giving, helping, and feeling patterns'],
  },
  {
    caseId: 'accusative',
    polishName: 'biernik',
    questions: ['kogo?', 'co?'],
    coreUses: ['direct object', 'direction after movement'],
    nounHints: ['masculine animate often matches genitive'],
  },
  {
    caseId: 'instrumental',
    polishName: 'narzędnik',
    questions: ['kim?', 'czym?'],
    coreUses: ['tool', 'role', 'identity', 'with someone'],
    nounHints: ['often follows forms of być for professions and roles'],
  },
  {
    caseId: 'locative',
    polishName: 'miejscownik',
    questions: ['o kim?', 'o czym?'],
    coreUses: ['location', 'topic after selected prepositions'],
    nounHints: ['always prepositional in modern Polish'],
  },
  {
    caseId: 'vocative',
    polishName: 'wołacz',
    questions: ['o!'],
    coreUses: ['direct address'],
    nounHints: ['highly visible in names, titles, and formal address'],
  },
];
```

Review checkpoint:

- [ ] Seed data is original and structural.
- [ ] A1-C1 exists in the UI model.
- [ ] Only A2-B1 content is marked available.

## Task 12: Build The Platform Shell

- [ ] Preserve the current single-file app before replacing it. Prefer moving it to `src/legacy/LegacyTutorApp.tsx` if any logic is still useful.
- [ ] Update `src/App.tsx`:

```tsx
import { AuthGate } from '@/src/platform/auth/AuthGate';
import { AuthProvider } from '@/src/platform/auth/AuthProvider';
import { PlatformShell } from '@/src/components/PlatformShell';

export default function App() {
  return (
    <AuthProvider>
      <AuthGate>
        <PlatformShell />
      </AuthGate>
    </AuthProvider>
  );
}
```

- [ ] Create `src/components/PlatformShell.tsx` with tabs for `Learn`, `Cases`, `Review`, and `Admin`.
- [ ] Hide `Admin` unless `profile.role === 'admin'`.
- [ ] Create `src/components/LearnMap.tsx` using `curriculumLevels` and `curriculumUnits`.
- [ ] Create `src/components/DeclensionTables.tsx` using `declensionRows`.
- [ ] Create `src/components/ReviewHome.tsx` as a sparse but real progress surface.
- [ ] Create `src/components/AdminStudio.tsx` with invitation UI and "AI generation queue" placeholder.

UI constraints:

- Keep the app as a usable learning dashboard, not a landing page.
- Avoid nested cards.
- Use icons from `lucide-react` for nav/buttons where helpful.
- Make case tables dense and readable on mobile.
- Do not add explanatory marketing copy about the app itself.

## Task 13: Add Admin Invite Client

- [ ] Create `src/platform/admin/invitesClient.ts`:

```ts
import { supabase } from '@/src/lib/supabaseClient';

export async function inviteLearner(email: string) {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;

  if (!token) {
    throw new Error('You must be signed in as an admin.');
  }

  const response = await fetch('/api/admin/invites', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ email }),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Invitation failed');
  }

  return response.json();
}
```

- [ ] Wire `AdminStudio` invite form to `inviteLearner`.
- [ ] Show success/error states.
- [ ] Do not expose service-role data in client responses.

## Task 14: Update Documentation And Vercel Configuration Notes

- [ ] Update `README.md` from AI Studio starter copy to Polish platform setup.
- [ ] Include local commands:

```bash
npm install
npm run dev
npm run lint
npm run test
npm run build
```

- [ ] Include Supabase setup:
  - Apply `supabase/migrations/202605220001_platform_foundation.sql`.
  - Disable public/self-service signup in Supabase Auth settings if available.
  - Invite the first admin from Supabase dashboard or service role.
  - Run `supabase/bootstrap-admin.sql` with a real admin email in the SQL editor.
- [ ] Include Vercel env var names only:
  - `VITE_SUPABASE_URL`
  - `VITE_SUPABASE_PUBLISHABLE_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`
  - `APP_BASE_URL`
  - Later AI vars: `AI_PROVIDER`, `OPENAI_API_KEY`, `DEEPSEEK_API_KEY`, `AI_GENERATION_ENABLED`
- [ ] Do not include actual values.

## Task 15: Verification

- [ ] Run static checks:

```bash
npm run lint
npm run test
npm run build
```

- [ ] Run local app:

```bash
npm run dev
```

- [ ] Open the local URL and verify:
  - Unauthenticated visitors see only the invite-only sign-in screen.
  - There is no visible public registration path.
  - With a mocked/session test or real invited account, the app shell renders.
  - `Learn` shows A1-C1 levels.
  - A2-B1 units are available and B2-C1 are planned/locked.
  - `Cases` shows all seven Polish cases.
  - `Admin` is hidden for learner profiles.
  - `Admin` is visible for admin profiles.
  - Admin invite form calls `/api/admin/invites`.
  - `/api/health` returns `{ ok: true }`.

- [ ] If Vercel connector/CLI is available, verify deployment settings:
  - Project is linked to the GitHub repo.
  - Build command is `npm run build`.
  - Output directory is `dist`.
  - Required env vars are configured in Vercel.

## Final Review Checklist

- [ ] No secret values are committed.
- [ ] The platform has no public registration path.
- [ ] Invite creation requires server-side admin verification.
- [ ] Service-role Supabase key is never imported into browser code.
- [ ] The new UI is a learning dashboard, not a landing page.
- [ ] A1-C1 structure exists, with only A2-B1 populated.
- [ ] Declension tables are original structural learning aids.
- [ ] Existing Gemini code is no longer the conceptual center of the app.
- [ ] `npm run lint`, `npm run test`, and `npm run build` pass or failures are documented with exact errors.

## Follow-Up Plans After This Slice

After this foundation lands, create separate plans for:

- AI provider harness with OpenAI and DeepSeek adapters.
- Admin exercise-generation workflow with review/publish states.
- Full curriculum authoring model and Supabase-backed exercise attempts.
- Declension trainer with adaptive drills and spaced repetition.
- Vercel production deployment and GitHub PR workflow.
