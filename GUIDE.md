# TanStack Start on Cloudflare Workers - Deployment Guide

This guide explains the deployment process, configuration management, and CI/CD setup for this TanStack Start application deployed on Cloudflare Workers.

## Dynamic Configuration (`wrangler.jsonc`)

This project uses a dynamic configuration system to manage Cloudflare bindings (KV, D1, Environment Variables) across different environments (Local, Staging, Production).

Instead of editing `wrangler.json` directly, you should edit **`wrangler.jsonc`**.

### How it works

1. **`wrangler.jsonc`**: This is your template file. It supports comments (`//`, `/* */`) and placeholders (`${VARIABLE_NAME}`).
2. **`scripts/gen-wrangler.js`**: This script runs before dev/build commands. It reads `wrangler.jsonc`, substitutes placeholders with actual values, and generates the standard `wrangler.json` used by Cloudflare.

### Using Placeholders

In `wrangler.jsonc`, you can define values using the `${VARIABLE_NAME}` syntax:

```jsonc
{
  "name": "my-app",
  "kv_namespaces": [
    {
      "binding": "MY_KV",
      "id": "${KV_ID}"
    }
  ],
  "vars": {
    "API_URL": "${API_URL}"
  }
}
```

## Local Development

For local development, create a `.dev.vars` file in the root directory (based on `.dev.vars.example`).

```env
# .dev.vars
KV_ID=xxxxxxxxxxxx
API_URL=http://localhost:3000
```

When you run `pnpm dev` or `pnpm preview`, the script will:
1. Read `.dev.vars`.
2. Replace `${KV_ID}` and `${API_URL}` in `wrangler.jsonc`.
3. Generate `wrangler.json`.

**Note:** If a variable is missing in `.dev.vars`, the script might remove the corresponding binding to prevent errors, or warn you.

## CI/CD Deployment

In CI/CD environments (GitHub Actions, GitLab CI, Bitbucket Pipelines), the values are read from the CI/CD environment variables.

### Environment Variable Naming

To support multiple environments (Staging vs. Production) using the same pipeline, the script looks for variables with specific prefixes:

1. **Specific Environment Prefix**: `STAGING_KV_ID` (if environment is `staging`)
2. **Direct Name**: `KV_ID` (fallback)

#### Example:
If you are deploying to **Production**:
- The script looks for `PRODUCTION_KV_ID`.
- If found, it uses that value.
- If not found, it looks to `KV_ID`.

This allows you to set a default `KV_ID` for all environments, or override it specifically for `PRODUCTION_` or `STAGING_`.

### Automatic Binding Cleanup

If a placeholder cannot be resolved (e.g., you haven't defined `STAGING_DB_ID` and didn't define `DB_ID`), the script is smart enough to **remove that binding completely** from the generated `wrangler.json`.

This means you can have a `wrangler.jsonc` with bindings for D1, KV, and R2, but if you only provide variables for KV in your Staging environment, the D1 and R2 bindings will be omitted for that deployment, preventing "Invalid Binding" errors.

## Setting up CI/CD

### 1. Cloudflare API Token
You need a Cloudflare API Token with permissions to deploy Workers.
- Go to Cloudflare Dashboard -> My Profile -> API Tokens.
- Create a token with "Edit Cloudflare Workers" template.
- Add "Account - Cloudflare Pages - Edit" and others as needed.
- Save this as `CLOUDFLARE_API_TOKEN` in your CI/CD secrets.
- Also save your `CLOUDFLARE_ACCOUNT_ID`.

### 2. Configure Environment Variables
Add your application secrets to your CI/CD repository secrets.
- `KV_ID` / `PRODUCTION_KV_ID`
- `DATABASE_ID` / `STAGING_DATABASE_ID`
- etc.

### 3. Pipelines

This project comes with pre-configured pipelines for:
- **Bitbucket Pipelines** (`bitbucket-pipelines.yml`)
- **GitLab CI** (`.gitlab-ci.yml`)
- **GitHub Actions** (in `.github/workflows/`)

These pipelines are set up to:
1. Install dependencies (`pnpm install`).
2. Generate `wrangler.json` for the specific environment (`node scripts/gen-wrangler.js production`).
3. Build the application (`pnpm build`).
4. Deploy to Cloudflare (`wrangler deploy`).
