import type {VercelRequest, VercelResponse} from '@vercel/node';
import {healthHandler} from '../src/server/handlers/health';

export default function handler(_req: VercelRequest, res: VercelResponse) {
  const response = healthHandler({
    hasApiKey: !!process.env.GEMINI_API_KEY,
  });

  res.status(response.status).json(response.body);
}
