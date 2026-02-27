# T04 - API Client Module

## Goal

A thin, typed wrapper around the Figma REST API that handles auth headers, error responses, and rate limit feedback. All commands use this instead of calling `fetch` directly.

## Background

- Base URL: `https://api.figma.com`
- Auth header: `X-Figma-Token: <pat>`
- Rate limit: Tier 1 -- 15 requests/min for most endpoints. The API returns `429` when exceeded.
- Types available from `@figma/rest-api-spec` (dev dependency only, not bundled)

## Expected Outcome

- A `figmaFetch(path, params?)` function that:
  - Reads the token from config automatically
  - Attaches the auth header
  - Accepts query params as a plain object (handles URL encoding)
  - Returns typed response data on success
  - On `401`: throws with "Invalid token. Run `figma auth set <token>`"
  - On `404`: throws with "Not found: <path>"
  - On `429`: throws with "Rate limit exceeded. Figma allows 15 requests/min."
  - On other errors: throws with the API's error message
- No third-party HTTP library -- native `fetch` only

## Verification

1. Call with a valid token and endpoint -- returns parsed JSON
2. Call with no config file present -- throws auth error before making any network call
3. Mock a `401` response -- error message references `figma auth set`
4. Mock a `429` response -- error message mentions rate limit and 15 req/min
5. Query params passed as object are correctly URL-encoded in the request
6. TypeScript types from `@figma/rest-api-spec` are used for response shapes where available
