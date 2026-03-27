interface Env {
  SUPABASE_URL: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, Prefer, Range, If-None-Match, accept-profile',
  'Access-Control-Max-Age': '86400',
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    // CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, { status: 204, headers: CORS_HEADERS })
    }

    const url = new URL(request.url)
    const targetUrl = `${env.SUPABASE_URL}${url.pathname}${url.search}`

    const headers = new Headers(request.headers)
    headers.delete('Host')

    const response = await fetch(targetUrl, {
      method: request.method,
      headers,
      body: request.body,
    })

    const responseHeaders = new Headers(response.headers)
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, value)
    }

    responseHeaders.delete('Content-Security-Policy');

    const myCSP = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' blob: data: https://apis.google.com https://accounts.google.com https://www.gstatic.com https://ssl.gstatic.com https://www.google.com https://static.cloudflareinsights.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://accounts.google.com https://growth.stockcast.com.br https://*.sentry.io",
      "frame-src 'self' https://accounts.google.com https://*.supabase.co",
      "base-uri 'self' https://accounts.google.com",
      "img-src 'self' data: https://*.googleusercontent.com https://www.gstatic.com",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://www.gstatic.com",
      "font-src 'self' https://fonts.gstatic.com"
    ].join('; ');
    responseHeaders.set('Content-Security-Policy', myCSP);

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  },
}
