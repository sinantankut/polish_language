import {FormEvent, useState} from 'react';
import {Loader2, MailPlus, WandSparkles} from 'lucide-react';
import {inviteLearner} from '../platform/admin/invitesClient';

export function AdminStudio() {
  const [email, setEmail] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);
    setMessage(null);

    try {
      const invite = await inviteLearner(email);
      setMessage(`${invite.email} is pending.`);
      setEmail('');
    } catch (inviteError) {
      setError(
        inviteError instanceof Error ? inviteError.message : 'Invitation failed',
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-2xl font-semibold text-stone-950">Admin</h2>
        <p className="mt-1 text-sm text-stone-600">
          Invite learners and prepare reviewed exercise sets.
        </p>
      </div>

      <div className="grid gap-4 lg:grid-cols-[420px_1fr]">
        <form onSubmit={submit} className="rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <MailPlus className="h-5 w-5 text-red-700" />
            <h3 className="font-semibold text-stone-950">Invite learner</h3>
          </div>
          <label className="mt-5 block space-y-2 text-sm font-medium text-stone-800">
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-md border border-stone-300 px-3 py-2 outline-none focus:border-red-700"
              required
            />
          </label>
          <button
            type="submit"
            disabled={submitting}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-md bg-red-700 px-4 py-2.5 font-semibold text-white hover:bg-red-800 disabled:cursor-not-allowed disabled:bg-stone-400"
          >
            {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            Send invite
          </button>
          {message ? <p className="mt-3 text-sm font-medium text-emerald-700">{message}</p> : null}
          {error ? <p className="mt-3 text-sm font-medium text-red-700">{error}</p> : null}
        </form>

        <div className="rounded-lg border border-stone-200 bg-white p-5">
          <div className="flex items-center gap-2">
            <WandSparkles className="h-5 w-5 text-red-700" />
            <h3 className="font-semibold text-stone-950">Generation queue</h3>
          </div>
          <div className="mt-5 grid gap-3">
            {['A2 genitive drills', 'B1 movement contrasts', 'Instrumental role prompts'].map(
              (item) => (
                <div
                  key={item}
                  className="flex items-center justify-between gap-3 border-b border-stone-100 py-3 text-sm last:border-b-0"
                >
                  <span className="font-medium text-stone-800">{item}</span>
                  <span className="rounded-full bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-800">
                    draft
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
