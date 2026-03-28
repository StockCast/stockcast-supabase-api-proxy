interface Env {
  SUPABASE_URL: string
}

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': 'https://app-beta.stockcast.com.br',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, x-client-info, apikey, Prefer, Range, If-None-Match, accept-profile, x-supabase-api-version',
  'Access-Control-Allow-Credentials': 'true',
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
      redirect: 'manual', // prevent Worker to follow Google link
    })

    const responseHeaders = new Headers(response.headers)
    for (const [key, value] of Object.entries(CORS_HEADERS)) {
      responseHeaders.set(key, value)
    }

    return new Response(response.body, {
      status: response.status,
      headers: responseHeaders,
    })
  },
}
