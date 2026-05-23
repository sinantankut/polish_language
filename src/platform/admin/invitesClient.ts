import {supabase} from '../../lib/supabaseClient';

export async function inviteLearner(email: string) {
  const {data} = await supabase.auth.getSession();
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
    body: JSON.stringify({email}),
  });

  if (!response.ok) {
    const body = await response.json().catch(() => ({}));
    throw new Error(body.error ?? 'Invitation failed');
  }

  return response.json() as Promise<{email: string; status: 'pending'}>;
}
