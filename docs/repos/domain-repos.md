---
description: "Domain repos in Devux.js — shared data access layers within a domain, reusable across multiple endpoints."
---

# Domain Repos

Domain repos are shared data access layers within a domain. For shared concepts like constraint handling and repo structure, see the [Repos Overview](/docs/repos/).

## When to Use

- Data operations shared across multiple endpoints in a domain
- Queries reused in multiple use-cases
- Data access needed by both use-cases and domain services

## Always Transactional

Domain repos extend `TransactionalRepo` and use `this.trx`. They run within the transaction context of the calling use-case.

## Creating

1. Run the CLI:
```bash
pnpm devux
```

2. Select **"Domain Repos"** → **"Create"**

3. Choose the target domain

4. Enter repo details:
   - Repo name (kebab-case, e.g., `find-customer-by-id`)
   - Operation type (read, write, delete)

## Adding as Dependency

To use a domain repo in a use-case or domain service:

1. Run **"Endpoints"** → **"Manage dependencies"** (for use-cases)

   Or **"Domain Services"** → **"Manage dependencies"** (for domain services)

2. Select **"Domain repos"** → **"Add"**

3. Choose the domain repo

## Location

```
domains/{domain}/repos/{repo}/
├── {repo}.repo.ts
├── {repo}.repo.zod.schemas.ts
└── tests/
    └── {repo}.repo.test.ts
```
