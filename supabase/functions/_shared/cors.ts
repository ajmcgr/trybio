export const allowedOrigins = [
  'https://trybio.ai',
  'https://www.trybio.ai',
  'http://localhost:3000',
  'http://localhost:8080',
];

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowOrigin = origin && allowedOrigins.includes(origin)
    ? origin
    : allowedOrigins[0];

  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,PATCH,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

export function handleOptions(req: Request): Response {
  const headers = getCorsHeaders(req.headers.get('origin'));
  return new Response('ok', { status: 200, headers });
}
