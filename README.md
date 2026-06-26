# Worklo — Blockchain Assignment

Welcome to the Worklo Blockchain Assignment!

Worklo is a PSA (Professional Services Automation) platform for managing projects, tasks, time tracking, and client relationships. In this exercise you'll add a simple on-chain reward feature to the existing codebase.

Everything runs locally on a Hardhat node. No real funds, no wallets, no risk.

Focus on quality over completeness. Submit what you have when time is up.

If you have any questions, feel free to reach out — we're happy to clarify anything.

## Time Consideration     

This assignment is scoped for 3–4 hours. If you hit that limit, submit what you have and use README.md to describe what you'd finish next.

## Getting Started

You'll need Node.js 18+ and a free Supabase project.

```bash
# 1. Fork this repo and clone your fork
npm install

# 2. Set up environment variables
cp .env.local.template .env.local
# Fill in your Supabase URL and keys in .env.local

# 3. Run the database schema
# → Supabase dashboard → SQL Editor → paste and run supabase/schema.sql

# 4. Start a local Hardhat node (separate terminal)
npx hardhat node

# 5. Start the dev server
npm run dev              # Next.js on http://localhost:3000
```

## Task Overview

**1. Contract** — Write a minimal ERC-20 using OpenZeppelin where only the `owner` can `mint(address to, uint256 amount)`. Deploy to the local Hardhat node.

**2. API Route** — Add `POST /api/tasks/[taskId]/reward` under `app/api/tasks/[taskId]/` (follow the existing route pattern in `app/api/roles/route.js`). Authenticate, fetch the task, call `mint()` via `ethers.js`, save `tx_hash` to Supabase, return `{ txHash }`.

**3. Frontend** — On the project detail page, next to each completed task: a **"Reward WPT"** button, a loading state while the tx is in flight, and a **"Rewarded"** badge with the `txHash` on success. Use `apiFetch` from `lib/api-config.ts`.

## How We Evaluate 

- Contract correctness and access control
- Backend route following existing auth and error handling patterns
- Frontend states: loading, success, error
- Code quality and consistency with the existing codebase
- README clarity

## Submission Guidelines

Don't open a PR to this repo. Share your fork URL.

In your forked repository, include a README that explains:

- How to run your project.
- What you'd improve or do differently if you had more time.

Make sure your code runs locally based on the instructions in your README.




## Task Completed 

## What I Built

### 1. Smart Contract — `hardhat/contracts/WorkloPointToken.sol`
- ERC-20 token contract using OpenZeppelin
- Only the contract owner can call `mint(address to, uint256 amount)`
- Deployed to local Hardhat node via `hardhat/scripts/deploy.ts`

### 2. Database — `supabase/schema.sql`
- Added `task_rewards` table to store on-chain reward history per task
- Linked to `tasks` and `auth.users` via foreign keys
- `UNIQUE(task_id)` constraint prevents double-rewarding the same task


### 3. API Route — `app/api/tasks/[taskId]/reward/route.js`
- Added **"Reward WPT"** button next to each completed task
- Loading spinner while the transaction is in flight
- **"Rewarded ✓"** badge with truncated `txHash` on success
- Error state with retry option on failure
- On page load, already-rewarded tasks show the badge using DB data


### 5. Bug Fix — `lib/animation-variants.ts`

- Created missing `animation-variants.ts` file that was causing a build error on startup


## Known Issues (Would Fix With More Time)

- **Linting errors across the codebase** — The existing project has 654 ESLint errors and 806 warnings spread across many components (e.g. `@typescript-eslint/no-explicit-any`, `no-unused-vars`, `no-require-imports`).
- **Build errors** — The production build fails due to missing service modules (`@/lib/account-service`, `@/lib/user-approval-service`) that are imported in the original codebase but never provided.

