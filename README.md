# IOIT Social Network

Event-only social network built with Next.js + TypeScript + pnpm.

## Local setup

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Quality checks

```bash
pnpm lint
pnpm typecheck
pnpm build
```

## Vercel CLI deploy

This repo is linked to Vercel project `delbytes-projects/ioit-social-network`.

Preview deploy:

```bash
pnpm dlx vercel --target preview
```

Production deploy:

```bash
pnpm dlx vercel --prod
```

## CI workflow

GitHub Actions workflow is in `.github/workflows/ci.yml` and includes:

1. Lint check (`pnpm lint`)
2. TypeScript check (`pnpm typecheck`)
3. Vercel preview deployment check (build + deploy preview)

Required repository secret:

1. `VERCEL_TOKEN`

`VERCEL_ORG_ID` and `VERCEL_PROJECT_ID` are already configured in CI for this linked project.
