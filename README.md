# TanStack Start on Cloudflare Workers

A modern starter template combining **TanStack Start** (React) with **Cloudflare Workers**, featuring dynamic configuration management and enterprise-grade CI/CD setups.

## Features

- 🚀 **TanStack Start**: Full-stack React framework with file-based routing and SSR.
- ☁️ **Cloudflare Workers**: Deploy server-side code to the edge.
- ⚙️ **Dynamic Configuration**: `wrangler.jsonc` support with environment-variable injection for Local, Staging, and Production (KV, D1, etc.).
- 🔄 **CI/CD Ready**: Pre-configured pipelines for GitHub Actions, GitLab CI, and Bitbucket.
- 🎨 **Tailwind CSS v4**: for styling.

---

## Getting Started

### 1. Install Dependencies

```bash
pnpm install
```

### 2. Configure Local Environment

Copy the example variables file to `.dev.vars`. This file is used to inject secrets into `wrangler.json` for local development.

```bash
cp .dev.vars.example .dev.vars
```

Edit `.dev.vars` to include your local keys (if any).

### 3. Run Development Server

```bash
pnpm dev
```
This runs the Vite dev server.

### 4. Preview Worker Locally

To test the actual Cloudflare Worker build locally (closer to production behavior):

```bash
pnpm preview
```

---

## Deployment & Configuration

**For a detailed guide on deployment, environment variables, and CI/CD pipelines, please read [GUIDE.md](./GUIDE.md).**

### Key Concept: `wrangler.jsonc`

We use a `wrangler.jsonc` file (JSON with comments) as the source of truth. The `scripts/gen-wrangler.js` script automatically generates the standard `wrangler.json` before builds, injecting the correct environment variables for the target environment (Local vs. Staging vs. Production).

---

## Project Structure

- `src/routes/`: File-based routing for TanStack Router.
- `scripts/gen-wrangler.js`: Utility to generate `wrangler.json` from `wrangler.jsonc`.
- `wrangler.jsonc`: The master configuration file for Cloudflare Workers.

---

## TanStack Features

### Routing
This project uses [TanStack Router](https://tanstack.com/router). The initial setup is a file based router. Which means that the routes are managed as files in `src/routes`.

#### Adding A Route
To add a new route to your application just add another a new file in the `./src/routes` directory. TanStack will automatically generate the content of the route file for you.

#### Adding Links
To use SPA (Single Page Application) navigation you will need to import the `Link` component from `@tanstack/react-router`.

```tsx
import { Link } from "@tanstack/react-router";

// Usage
<Link to="/about">About</Link>
```

### Data Fetching
There are multiple ways to fetch data in your application. You can use TanStack Query to fetch data from a server. But you can also use the `loader` functionality built into TanStack Router to load the data for a route before it's rendered.

```tsx
const peopleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/people",
  loader: async () => {
    const response = await fetch("https://swapi.dev/api/people");
    return response.json();
  },
  component: () => {
    const data = peopleRoute.useLoaderData();
    return <ul>{data.results.map(p => <li key={p.name}>{p.name}</li>)}</ul>;
  },
});
```

### State Management
TanStack Store provides a great starting point for your project state management needs.

```tsx
import { useStore } from "@tanstack/react-store";
import { Store } from "@tanstack/store";

const countStore = new Store(0);

function App() {
  const count = useStore(countStore);
  return (
    <button onClick={() => countStore.setState((n) => n + 1)}>
      Count: {count}
    </button>
  );
}
```

## Learn More

- [TanStack Documentation](https://tanstack.com)
- [Cloudflare Workers Documentation](https://developers.cloudflare.com/workers/)
