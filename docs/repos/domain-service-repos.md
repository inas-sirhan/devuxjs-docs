# Domain Service Repos

Domain service repos are private data access layers specific to a [domain service](/docs/services/domain-services). They encapsulate database operations that are internal to a particular service.

For shared concepts like constraint handling and repo structure, see the [Repos Overview](/docs/repos/).

## When to Use

- Data operations specific to a domain service
- Queries that support service-level business logic
- Data access that should be private to the service (not shared)

## Always Transactional

Domain service repos extend `TransactionalRepo` and use `this.trx`. They run within the transaction context of the use-case that calls the service.

## Creating

1. Run the CLI:
```bash
pnpm devux
```

2. Select **"Domain Services"** → **"Manage service repos"**

3. Choose the target domain and service

4. Select **"Create repo"**

5. Enter repo details:
   - Repo name (kebab-case, e.g., `get-discount-rules`)
   - Operation type (read, write, delete)

## Location

```
domains/{domain}/services/{service}/repos/{repo}/
├── {repo}.repo.ts
├── {repo}.repo.zod.schemas.ts
└── tests/
    └── {repo}.repo.test.ts
```

## Difference from Domain Repos

| Domain Repos | Domain Service Repos |
|--------------|---------------------|
| Shared across use-cases and domain services | Private to one domain service |
| Located in `domains/{domain}/repos/` | Located in `domains/{domain}/services/{service}/repos/` |

Use domain service repos when the data access is an internal implementation detail of the service, not something that should be shared.
