---
phase: 01-foundation
plan: 01
title: "Project Scaffold"
type: execute
wave: 1
depends_on: []
files_modified:
  - package.json
  - tsconfig.json
  - postcss.config.mjs
  - next.config.ts
  - .gitignore
  - .env.example
  - .env.local
autonomous: true
requirements:
  - FOUND-01
  - FOUND-09
  - FOUND-10

must_haves:
  truths:
    - "`npm run dev` starts cleanly on localhost with zero TypeScript errors"
    - "All animation and data libraries are installed at pinned exact versions"
    - "TypeScript strict mode is enabled and the project compiles"
    - "`.env.local` is gitignored; `.env.example` documents all required env vars"
    - "Git repo is initialized with correct `.gitignore` excluding `.env.local`, `node_modules`, `.next`"
  artifacts:
    - path: "package.json"
      provides: "All dependencies at pinned versions"
      contains: "framer-motion, gsap, @gsap/react, lenis, @tsparticles/react, @tsparticles/slim, react-type-animation, server-only"
    - path: "tsconfig.json"
      provides: "TypeScript strict mode config"
      contains: "\"strict\": true"
    - path: "postcss.config.mjs"
      provides: "Tailwind v4 PostCSS integration"
      contains: "@tailwindcss/postcss"
    - path: ".gitignore"
      provides: "Security — env files and build artifacts excluded from git"
      contains: ".env.local"
    - path: ".env.example"
      provides: "Documentation of required environment variables"
      contains: "GITHUB_TOKEN"
  key_links:
    - from: "postcss.config.mjs"
      to: "node_modules/@tailwindcss/postcss"
      via: "PostCSS plugin resolution"
      pattern: "@tailwindcss/postcss"
    - from: "tsconfig.json"
      to: "src/"
      via: "paths alias @/*"
      pattern: "\"@/\\*\""
---

<objective>
Initialize the Next.js 15 App Router project with all required dependencies installed at pinned exact versions, TypeScript strict mode enabled, Tailwind v4 configured via PostCSS, and Git initialized with a secure `.gitignore`.

Purpose: Every subsequent plan builds on this scaffold. Installing wrong versions, misconfiguring TypeScript, or leaving `.env.local` unguarded creates cascading problems that are expensive to fix mid-phase.

Output: A running Next.js dev server, all packages in `node_modules`, `tsconfig.json` with `strict: true`, `postcss.config.mjs` with `@tailwindcss/postcss`, `.gitignore` protecting secrets, and `.env.example` documenting required tokens.
</objective>

<execution_context>
@E:/Dev/Portfolios/jms-folio/CLAUDE.md
</execution_context>

<context>
@E:/Dev/Portfolios/jms-folio/.planning/ROADMAP.md
@E:/Dev/Portfolios/jms-folio/.planning/REQUIREMENTS.md

<interfaces>
<!-- Key constraints for this scaffold. No prior code to import from. -->

Required exact package versions (pin these — do not use caret or tilde):
  framer-motion: 12.38.0
  gsap: 3.15.0
  @gsap/react: 2.1.2
  lenis: 1.3.23
  @tsparticles/react: 3.0.0
  @tsparticles/slim: 3.9.1
  react-type-animation: 3.2.0
  server-only: (latest patch — no semver instability risk)
  tailwindcss: 4.2.4
  @tailwindcss/postcss: 4.2.4

Rejected packages (do NOT install):
  @studio-freight/lenis — abandoned, use `lenis` instead
  @tsparticles/nextjs — beta, unstable
  @octokit/rest — 150KB overhead for a single fetch
  tailwindcss@3.x — maintenance mode

tsconfig paths alias required:
  "@/*": ["./src/*"]

Next.js init flags:
  --typescript --tailwind --app --src-dir --no-git --import-alias "@/*"

postcss.config.mjs MUST use v4 syntax:
  { "@tailwindcss/postcss": {} }   ← correct
  { "tailwindcss": {} }            ← WRONG — this is v3 syntax, will fail

There must be NO tailwind.config.js or tailwind.config.ts at project root.
Tailwind v4 config lives entirely in CSS via @theme blocks (done in Plan 02).
</interfaces>
</context>

<tasks>

<task type="auto">
  <name>Task 1: Scaffold Next.js 15 App Router project with TypeScript and Tailwind v4</name>
  <files>
    package.json,
    tsconfig.json,
    postcss.config.mjs,
    next.config.ts,
    src/app/layout.tsx,
    src/app/page.tsx,
    src/app/globals.css
  </files>
  <action>
    Step 1 — Check if package.json already exists at E:/Dev/Portfolios/jms-folio/package.json. If no package.json exists, scaffold via:

    ```bash
    cd "E:/Dev/Portfolios/jms-folio"
    npx create-next-app@15 . --typescript --tailwind --app --src-dir --no-git --import-alias "@/*"
    ```

    If package.json already exists (project was manually scaffolded), skip the create-next-app step.

    Step 2 — Read tsconfig.json. Verify it contains "strict": true. If not present, add it under "compilerOptions". The compilerOptions block must have:
    - "strict": true
    - "paths": { "@/*": ["./src/*"] }
    - "module": "esnext" (or "es2022" — both acceptable for Next.js App Router)
    - "moduleResolution": "bundler"

    Step 3 — Read postcss.config.mjs (or postcss.config.js). Verify it uses the Tailwind v4 PostCSS adapter, not the v3 pattern. Replace its contents if needed:

    ```js
    // postcss.config.mjs
    const config = {
      plugins: {
        "@tailwindcss/postcss": {},
      },
    };
    export default config;
    ```

    Do NOT use "tailwindcss": {} as the plugin key — that is v3 syntax and fails with v4.

    Step 4 — Delete tailwind.config.js or tailwind.config.ts if either exists at the project root. Tailwind v4 configuration lives in CSS via @theme — no config file is needed or wanted.

    Step 5 — Set next.config.ts to a minimal config:

    ```ts
    import type { NextConfig } from 'next'

    const nextConfig: NextConfig = {
      reactStrictMode: true,
    }

    export default nextConfig
    ```
  </action>
  <verify>
    <automated>cd "E:/Dev/Portfolios/jms-folio" && npx tsc --noEmit 2>&1 | head -20</automated>
  </verify>
  <done>
    - `npx tsc --noEmit` exits with code 0 (no TypeScript errors)
    - `postcss.config.mjs` contains `"@tailwindcss/postcss"` as the plugin key
    - `tsconfig.json` contains `"strict": true`
    - `tsconfig.json` contains `"@/*": ["./src/*"]` path alias
    - No `tailwind.config.js` or `tailwind.config.ts` exists at project root
  </done>
</task>

<task type="auto">
  <name>Task 2: Install all dependencies at pinned exact versions</name>
  <files>
    package.json
  </files>
  <action>
    Read E:/Dev/Portfolios/jms-folio/package.json first to see which packages are already installed and at what versions. Then install any that are missing or at wrong versions.

    Run these commands from the project root E:/Dev/Portfolios/jms-folio:

    ```bash
    # Animation core — EXACT versions, no caret prefix
    npm install --save-exact framer-motion@12.38.0 gsap@3.15.0 @gsap/react@2.1.2 lenis@1.3.23

    # Particle effects
    npm install --save-exact @tsparticles/react@3.0.0 @tsparticles/slim@3.9.1

    # Typing effect
    npm install --save-exact react-type-animation@3.2.0

    # Server-only guard (enforces lib/github.ts stays server-side at build time)
    npm install server-only

    # Tailwind v4 PostCSS adapter (dev dep)
    npm install --save-dev --save-exact @tailwindcss/postcss@4.2.4 tailwindcss@4.2.4
    ```

    After installing, verify package.json dependencies section contains all required packages. The animation packages must not have caret (^) or tilde (~) prefixes — minor version bumps to framer-motion and gsap can silently break animation behavior.

    Do NOT install: @studio-freight/lenis (abandoned), @tsparticles/nextjs (beta), @octokit/rest (overkill), motion (use framer-motion), or any GSAP Club plugins.
  </action>
  <verify>
    <automated>cd "E:/Dev/Portfolios/jms-folio" && node -e "const p = require('./package.json'); const deps = {...p.dependencies, ...p.devDependencies}; const required = ['framer-motion','gsap','@gsap/react','lenis','@tsparticles/react','@tsparticles/slim','react-type-animation','server-only']; const missing = required.filter(r => !deps[r]); console.log(missing.length === 0 ? 'ALL DEPS PRESENT' : 'MISSING: ' + missing.join(', '))"</automated>
  </verify>
  <done>
    - Node script prints `ALL DEPS PRESENT`
    - `framer-motion` version in `package.json` is exactly `12.38.0` (no `^`)
    - `gsap` version in `package.json` is exactly `3.15.0` (no `^`)
    - `lenis` version in `package.json` is exactly `1.3.23` (no `^`)
    - `@gsap/react` version in `package.json` is exactly `2.1.2` (no `^`)
    - `server-only` is present in dependencies (any patch version is fine)
  </done>
</task>

<task type="auto">
  <name>Task 3: Configure Git, .gitignore, and .env.example</name>
  <files>
    .gitignore,
    .env.example,
    .env.local
  </files>
  <action>
    Step 1 — Check if .gitignore already exists. If yes, read it and append any missing entries. If no, create it. The .gitignore MUST contain all of the following:

    ```
    # Dependencies
    node_modules/
    /.pnp
    .pnp.js

    # Build output
    /.next/
    /out/
    /build

    # Environment variables — NEVER commit these
    .env.local
    .env.*.local
    .env.production

    # OS / editor artifacts
    .DS_Store
    *.pem
    Thumbs.db

    # Debug logs
    npm-debug.log*
    yarn-debug.log*
    yarn-error.log*

    # Vercel
    .vercel

    # TypeScript
    *.tsbuildinfo
    next-env.d.ts
    ```

    Step 2 — Create .env.example (safe to commit — no real values):

    ```
    # GitHub API credentials
    # Get a personal access token at: https://github.com/settings/tokens
    # Required scopes: public_repo (read-only is sufficient)
    GITHUB_TOKEN=your_github_personal_access_token_here
    GITHUB_USERNAME=your_github_username_here
    ```

    Step 3 — Create .env.local with placeholder values (gitignored — never committed):

    ```
    # Real values go here — this file is never committed
    GITHUB_TOKEN=ghp_placeholder_replace_with_real_token
    GITHUB_USERNAME=juanmanuelsilva06
    ```

    The real GITHUB_TOKEN must be supplied by the developer from their GitHub Settings. The placeholder allows the build to run; actual GitHub API calls will fail until a real token is set.

    Step 4 — Verify git is initialized:

    ```bash
    cd "E:/Dev/Portfolios/jms-folio"
    git init 2>/dev/null || echo "Already a git repo"
    ```
  </action>
  <verify>
    <automated>cd "E:/Dev/Portfolios/jms-folio" && grep -q "\.env\.local" .gitignore && grep -q "GITHUB_TOKEN" .env.example && grep -q "GITHUB_USERNAME" .env.example && echo "GITIGNORE_AND_ENVEXAMPLE_OK"</automated>
  </verify>
  <done>
    - `.gitignore` contains `.env.local`, `node_modules/`, and `/.next/`
    - `.env.example` contains `GITHUB_TOKEN` and `GITHUB_USERNAME` as keys with no real values
    - `.env.local` exists locally (not committed)
    - `git status` does not show `.env.local` as a tracked file
  </done>
</task>

</tasks>

<threat_model>
## Trust Boundaries

| Boundary | Description |
|----------|-------------|
| developer machine → git remote | `.env.local` must never cross this boundary |
| server build → client bundle | `GITHUB_TOKEN` must never appear in client-side JS |

## STRIDE Threat Register

| Threat ID | Category | Component | Disposition | Mitigation Plan |
|-----------|----------|-----------|-------------|-----------------|
| T-01-01 | Information Disclosure | `.env.local` / `GITHUB_TOKEN` | mitigate | `.gitignore` excludes `.env.local`; `server-only` package is installed so any accidental client import of `lib/github.ts` causes a build-time error |
| T-01-02 | Information Disclosure | `next.config.ts` env exposure | accept | `GITHUB_TOKEN` has no `NEXT_PUBLIC_` prefix — Next.js never exposes it to the client bundle |
| T-01-03 | Tampering | `package.json` dependency versions | mitigate | Exact version pinning (`--save-exact`) prevents npm from silently upgrading animation libraries to behaviorally breaking versions |
</threat_model>

<verification>
After all three tasks complete, verify the full scaffold works:

```bash
cd "E:/Dev/Portfolios/jms-folio"

# TypeScript must compile clean
npx tsc --noEmit

# All required packages must be present
node -e "const p = require('./package.json'); const d = {...p.dependencies,...p.devDependencies}; ['framer-motion','gsap','@gsap/react','lenis','@tsparticles/react','@tsparticles/slim','react-type-animation','server-only'].forEach(r => console.log(d[r] ? 'OK ' + r : 'MISSING ' + r))"

# Security: .env.local must be gitignored
grep ".env.local" .gitignore
```
</verification>

<success_criteria>
1. `npm run dev` starts without errors — TypeScript and Tailwind v4 compile cleanly
2. `package.json` lists `framer-motion@12.38.0`, `gsap@3.15.0`, `@gsap/react@2.1.2`, `lenis@1.3.23` at exact versions (no caret)
3. `tsconfig.json` has `"strict": true` and `"@/*": ["./src/*"]` path alias
4. `postcss.config.mjs` uses `"@tailwindcss/postcss": {}` (v4 syntax — no `tailwind.config.js`)
5. `.gitignore` protects `.env.local`; `.env.example` documents `GITHUB_TOKEN` and `GITHUB_USERNAME`
6. `server-only` package is installed (prerequisite for Plan 03's `lib/github.ts`)
</success_criteria>

<output>
After completion, create `E:/Dev/Portfolios/jms-folio/.planning/phases/01-foundation/01-scaffold-SUMMARY.md` with:
- What was scaffolded (fresh init vs. existing project)
- Exact versions installed (copy from final package.json)
- Any deviations from the plan
- Whether git was initialized or was already initialized
</output>
