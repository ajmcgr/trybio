export const allowedOrigins = [
  'https://trybio.ai',
  'https://www.trybio.ai',
  'http://localhost:3000',
];

export function getCorsHeaders(origin: string | null) {
  const allowOrigin = origin || '*';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-api-version',
  };
}

export function okOptions(req: Request) {
  const headers = getCorsHeaders(req.headers.get('origin'));
  return new Response(null, { status: 204, headers });
}
