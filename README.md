# Stockcast Supabase API Proxy

A Cloudflare Worker that acts as a reverse proxy for Supabase API requests, adding CORS support for cross-origin access.

## Features

- **CORS Support**: Enables cross-origin requests from any domain
- **Request Forwarding**: Transparently proxies requests to Supabase
- **Edge Deployment**: Runs on Cloudflare's global edge network for low latency
- **Preflight Handling**: Properly handles OPTIONS requests for CORS preflight

## Tech Stack

- **Runtime**: Cloudflare Workers
- **Language**: TypeScript
- **Testing**: Vitest with Cloudflare Workers pool
- **CLI**: Wrangler

## Prerequisites

- Node.js (v18 or higher)
- npm
- Cloudflare account with a configured domain

## Installation

```bash
npm install
```

## Configuration

### 1. Set the Supabase URL Secret

```bash
npx wrangler secret put SUPABASE_URL
```

Enter your Supabase URL when prompted (e.g., `https://your-project.supabase.co`).

### 2. Configure Cloudflare DNS

Add the following DNS record in your Cloudflare dashboard:

| Type | Name | Content | Proxy |
|------|------|---------|-------|
| AAAA | stockcast-api | 100:: | ON (orange cloud) |

This creates the endpoint: `stockcast-api.jebertacchi.eng.br`

### 3. Update Route (Optional)

If using a different domain, update `wrangler.jsonc`:

```jsonc
{
  "routes": [
    {
      "pattern": "your-subdomain.your-domain.com/*",
      "zone_name": "your-domain.com"
    }
  ]
}
```

## Development

Start the local development server:

```bash
npm run dev
```

## Testing

Run the test suite:

```bash
npm test
```

## Deployment

Deploy to Cloudflare Workers:

```bash
npm run deploy
```

## Usage

Once deployed, make requests to your proxy endpoint:

```bash
# Example: Query a Supabase table
curl "https://stockcast-api.jebertacchi.eng.br/rest/v1/your_table" \
  -H "Authorization: Bearer YOUR_SUPABASE_ANON_KEY" \
  -H "apikey: YOUR_SUPABASE_ANON_KEY"
```

The proxy forwards all requests to your Supabase instance while adding CORS headers to the response.

## CORS Headers

The proxy adds the following headers to all responses:

| Header | Value |
|--------|-------|
| Access-Control-Allow-Origin | * |
| Access-Control-Allow-Methods | GET, POST, OPTIONS |
| Access-Control-Allow-Headers | Content-Type, Authorization |
| Access-Control-Max-Age | 86400 |

## Project Structure

```
stockcast-supabase-api-proxy/
├── src/
│   └── index.ts          # Main proxy worker
├── test/
│   └── index.spec.ts     # Test suite
├── wrangler.jsonc        # Cloudflare Workers config
├── tsconfig.json         # TypeScript config
├── vitest.config.mts     # Test runner config
└── package.json          # Dependencies and scripts
```

## Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start local development server |
| `npm start` | Alias for `npm run dev` |
| `npm test` | Run test suite |
| `npm run deploy` | Deploy to Cloudflare Workers |
| `npm run cf-typegen` | Generate Cloudflare TypeScript types |

## License

ISC
