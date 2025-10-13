const ALLOWED_ORIGINS = [
  'https://trybio.ai',
  'https://www.trybio.ai',
  'http://localhost:3000',
  'http://localhost:8080',
];

export function getCorsHeaders(origin: string | null): Record<string, string> {
  const allowedOrigin = origin && ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
  
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    'Vary': 'Origin',
  };
}

export function handleOptions(req: Request): Response {
  const headers = getCorsHeaders(req.headers.get('origin'));
  return new Response(null, { 
    status: 200, 
    headers 
  });
}
