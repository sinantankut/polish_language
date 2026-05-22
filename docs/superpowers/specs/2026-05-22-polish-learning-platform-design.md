# Polish Learning Platform Design

Date: 2026-05-22
Repository: `sinantankut/polish_language`
Status: Approved design draft

## Purpose

Build the existing Polish language app into a multi-user learning platform for structured Polish study. The first release should focus on curriculum, declension mastery, durable progress, and admin-reviewed exercise generation. It should not include conversational chat in the first build.

The platform should support a full A1-C1 course map, but only A2-B1 content needs to be populated at first.

## Current Project Context

The GitHub repo is a Vite/React app with an Express `server.ts`. The current app has:

- A hard-coded `POLISH_LESSONS` array in `src/data.ts`.
- Client-side progress stored in `localStorage`.
- Gemini-backed API routes for grammar checking, grammar explanation, chat, and exercise generation.
- Existing UI sections for dashboard, lessons, grammar sandbox, pronunciation, and chat.

The redesign should preserve useful React/Vite pieces, but the learning structure, data model, auth, and AI provider layer should be rebuilt around the platform direction.

## Product Direction

Use Approach A: redesign the learning platform information architecture and lesson UI while keeping the current Vite/React foundation where practical.

Primary navigation:

- `Learn`
- `Declensions`
- `Review`
- `Profile`
- `Admin Studio` for admins only

Marek/chat is intentionally out of scope for the first release.

## Deployment And Backend

The production app should be served from Vercel, with GitHub as the source repository and Supabase as the backend.

Architecture:

- GitHub repo deploys to Vercel.
- Vercel serves the React app and server/API handlers.
- Supabase provides auth, Postgres, roles, and progress persistence.
- Server-side API code owns AI provider calls, admin-only generation, schema validation, and service-role Supabase operations.
- Client code reads only browser-safe configuration, published curriculum, and the logged-in user's own progress.

The existing Express API should evolve toward Vercel-compatible API handlers rather than remaining a local-only long-running server.

## Access Model

Registration is invite-only by email.

Behavior:

- Admins add allowed email addresses.
- A learner can authenticate only if their email is in the invitation/allowlist.
- Profiles are created after successful invited-email sign-in.
- Learners receive the default learner role.
- Admin role is controlled separately and protected server-side.

The design should avoid public registration and reusable invite codes in the first release.

## Secrets And Environment Variables

Do not commit credentials, database passwords, Supabase service-role keys, or AI provider keys.

Use environment variables, for example:

- `VITE_SUPABASE_URL`
- `VITE_SUPABASE_PUBLISHABLE_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`
- `DEEPSEEK_API_KEY`
- `AI_PROVIDER`
- `AI_MODEL`

Browser-safe Supabase configuration can use `VITE_` variables. Service-role keys, database passwords, and AI keys must remain server-only in Vercel environment variables and local `.env.local`.

## Data Model

The Supabase schema should separate access, curriculum, exercises, progress, and AI generation metadata.

Access:

- `invited_emails`
- `profiles`
- `roles`

Curriculum:

- `levels`
- `units`
- `grammar_topics`
- `declension_tables`

Exercises:

- `exercise_templates`
- `exercise_sets`
- `exercise_items`
- `answer_keys`

Progress:

- `attempts`
- `mistakes`
- `case_skill_scores`
- `review_queue`

AI/admin generation:

- `generation_jobs`
- `prompt_versions`
- `review_events`

Published exercise items should be versioned or mostly immutable so learner attempts remain interpretable. Draft items can be edited freely before publication.

Declension tables should be structured data, not images. Store case, number, gender class, animacy/personhood, endings, examples, trigger notes, and exceptions.

## Curriculum Scope

Scaffold the platform for:

- A1
- A2
- B1
- B2
- C1

Populate A2-B1 first.

The attached textbooks should inform topic sequence and exercise format taxonomy, not provide copied content. Initial source-informed A2-B1 topics include:

- self-presentation and personal data
- instrumental case
- genitive case
- accusative singular and plural
- dative and pronoun practice
- locative case
- vocative
- imperatives
- modal expressions
- movement verbs
- holidays and cultural topics
- impersonal forms
- conjunctions
- aspect
- conditionals
- passive participles
- idiomatic and advanced vocabulary expansion

Declension practice should remain cross-cutting across units through a dedicated declension atlas and review queue.

## Learner Flow

Learner path:

1. Sign in with invited email.
2. Choose or resume a level.
3. Open an A2-B1 unit.
4. Study a concise grammar explanation and relevant declension table.
5. Work through examples.
6. Complete a curated exercise set.
7. Receive feedback.
8. See weak cases scheduled into review.

Each lesson should use a consistent rhythm:

- grammar explanation
- declension table where relevant
- examples
- exercises
- feedback
- review scheduling based on mistakes

## Admin Flow

Admin path:

1. Add invited learner emails.
2. Create or edit curriculum units.
3. Select a grammar topic and exercise templates.
4. Generate an exercise batch with an AI provider.
5. Review, edit, approve, or reject generated items.
6. Publish approved exercises to learners.

Admin Studio is required for the first release, but it can be utilitarian. It should prioritize correctness, reviewability, and publishing state over visual polish.

## AI Generation Workflow

AI generation is admin-only in the first release. Learners should not trigger on-demand AI generation yet.

Generation pipeline:

1. Admin selects unit, grammar topic, and templates.
2. Server creates a `generation_job`.
3. Provider adapter calls OpenAI or DeepSeek.
4. Response is validated against a strict schema.
5. Grammar-focused QA checks metadata and answers.
6. Generated items remain drafts.
7. Admin reviews, edits, approves, rejects, and publishes.

Use a single internal generation interface. OpenAI and DeepSeek should be adapters behind that interface. Store provider, model, prompt version, and status on each generation job.

Generated exercise contract:

- exercise type
- target grammar
- case, number, gender, animacy/personhood, trigger metadata
- learner-facing prompt
- options or input shape
- correct answer
- explanation
- difficulty level
- distractor rationale where relevant
- review status

Prompts must require original sentences, original names, and original scenarios. The PDFs should guide structure only.

## Exercise Types

First declension-focused exercise types:

- case identification: which case and why
- ending selection: choose the correct noun/adjective ending
- transformation: convert a noun phrase into a target case
- trigger matching: match verb/preposition to required case
- sentence repair: find and correct a wrong form
- production prompt: write a constrained sentence

The system should support multiple-choice, fill-in-the-blank, transformation, short-answer, and sentence-production formats.

## Review And Progress

Learner attempts should record:

- exercise item
- submitted answer
- correctness
- mistake category
- targeted case metadata
- timestamp

Mistakes should update `case_skill_scores` and feed a `review_queue`. The first review algorithm can be simple: schedule missed case/gender/number combinations for later practice, with more frequent review for repeated misses.

## Verification

Verification layers:

- Type checking for frontend and API code.
- Database migration checks.
- RLS/policy tests for invited access and user-owned progress.
- AI contract tests for schema-valid generated JSON.
- Browser checks for sign-in, lesson study, exercise completion, admin generation/review/publish, and review queue behavior.

Do not claim Vercel/Supabase integration works until it is deployed and checked against the real environment.

## First Release Scope

In scope:

- Vercel deployment from GitHub.
- Supabase auth with invited emails only.
- Profiles and roles.
- A1-C1 scaffold.
- A2-B1 populated first.
- Structured declension atlas.
- Curated exercise sets.
- Progress persistence.
- Mistake-based review queue.
- Admin Studio for invitations, generation, review, and publishing.
- OpenAI/DeepSeek provider abstraction for admin-generated exercises.

Out of scope:

- Marek/chat.
- Payments.
- Public registration.
- Classroom management.
- Full C1 content.
- Learner-triggered AI generation.
- Replicating textbook pages or answer keys.

## Success Criteria

An invited learner can sign in on the Vercel deployment, study an A2-B1 lesson, complete declension-focused exercises, and see weak cases appear in review.

An admin can add an invited email, generate original draft exercises, edit and approve them, publish them, and see them appear for learners.

The deployed app uses Supabase for durable state and Vercel environment variables for secrets.
