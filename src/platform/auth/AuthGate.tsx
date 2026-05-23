import {FormEvent, useState} from 'react';
import type {ReactNode} from 'react';
import {Loader2, LockKeyhole, Mail} from 'lucide-react';
import {useAuth} from './AuthProvider';

export function AuthGate({children}: {children: ReactNode}) {
  const auth = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  if (auth.loading) {
    return (
      <main className="min-h-screen bg-[#F7F3EA] text-stone-950">
        <div className="flex min-h-screen items-center justify-center">
          <Loader2 className="h-6 w-6 animate-spin text-red-700" />
        </div>
      </main>
    );
  }

  if (auth.session && auth.profile) {
    return <>{children}</>;
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setFormError(null);

    try {
      await auth.signInWithPassword(email, password);
    } catch (error) {
      setFormError(
        error instanceof Error
          ? error.message
          : 'Could not sign in.',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F7F3EA] text-stone-950">
      <div className="mx-auto grid min-h-screen max-w-6xl grid-cols-1 items-center gap-10 px-5 py-10 lg:grid-cols-[1fr_420px]">
        <section className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-white px-3 py-1 text-sm font-medium text-red-800">
            <LockKeyhole className="h-4 w-4" />
            Invite-only access
          </div>
          <div className="max-w-3xl space-y-5">
            <h1 className="text-4xl font-semibold tracking-normal text-stone-950 sm:text-5xl lg:text-6xl">
              Polish Language Platform
            </h1>
            <p className="text-lg leading-8 text-stone-700">
              A private workspace for structured Polish practice, case mastery,
              and reviewed AI-generated drills.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-3">
            {['A1-C1 map', 'Seven cases', 'Admin invites'].map((item) => (
              <div
                key={item}
                className="border-l-4 border-red-700 bg-white px-4 py-3 text-sm font-semibold text-stone-800 shadow-sm"
              >
                {item}
              </div>
            ))}
          </div>
        </section>

        <form
          onSubmit={submit}
          className="space-y-5 rounded-lg border border-stone-200 bg-white p-6 shadow-sm"
        >
          <div>
            <h2 className="text-xl font-semibold text-stone-950">
              Private sign-in
            </h2>
            <p className="mt-2 text-sm leading-6 text-stone-600">
              Enter your invited account credentials.
            </p>
          </div>

          <label className="block space-y-2 text-sm font-medium text-stone-800">
            <span>Email</span>
            <div className="flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 focus-within:border-red-700">
              <Mail className="h-4 w-4 text-stone-500" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
                required
              />
            </div>
          </label>

          <label className="block space-y-2 text-sm font-medium text-stone-800">
            <span>Password</span>
            <div className="flex items-center gap-2 rounded-md border border-stone-300 bg-white px-3 py-2 focus-within:border-red-700">
              <LockKeyhole className="h-4 w-4 text-stone-500" />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="min-w-0 flex-1 bg-transparent text-base outline-none"
                required
              />
            </div>
          </label>

          <button
            type="submit"
            disabled={submitting}
            className="inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-700 px-4 py-3 font-semibold text-white transition hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Sign in
          </button>

          {formError || auth.error ? (
            <p className="text-sm font-medium text-red-700">
              {formError ?? auth.error}
            </p>
          ) : null}
        </form>
      </div>
    </main>
  );
}
