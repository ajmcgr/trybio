export const allowedOrigins = [
  'https://trybio.ai',
  'https://www.trybio.ai',
  'http://localhost:3000',
];

export function getCorsHeaders(origin: string | null) {
  return {
    'Access-Control-Allow-Origin': '*',
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  };
}

export function okOptions(req: Request) {
  const headers = getCorsHeaders(req.headers.get('origin'));
  return new Response('ok', { status: 200, headers });
}
