import type {VercelRequest, VercelResponse} from '@vercel/node';
import {createInvitationHandler} from '../../src/server/handlers/adminInvites';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const response = await createInvitationHandler({
    method: req.method ?? 'GET',
    headers: req.headers,
    body: req.body,
  });

  res.status(response.status).json(response.body);
}
