---
description: "Guide — create your first repo in Devux.js for type-safe database operations."
---

# Create Your First Repo

This guide walks you through creating repositories in Devux.

## Endpoint Repo

Use when data operations are specific to one endpoint.

### Steps

1. Run `pnpm devux`
2. Select "Endpoints"
3. Select "Manage dependencies"
4. Choose the endpoint
5. Select "Add endpoint repo"
6. Enter repo name (kebab-case)

### Result

```
apps/backend/src/domains/customers/endpoints/create-customer/repos/create-customer/
├── create-customer.repo.ts           ← Your repo logic
└── tests/
    └── create-customer.repo.test.ts
```

## Domain Repo

Use when multiple endpoints need the same data operations.

### Steps

1. Run `pnpm devux`
2. Select "Domain Repos"
3. Select "Create"
4. Choose the target domain
5. Enter repo name (kebab-case)

### Result

```
apps/backend/src/domains/customers/repos/get-customer-by-email/
├── get-customer-by-email.repo.ts
└── tests/
    └── get-customer-by-email.repo.test.ts
```

## Using Kysely

All repos have access to the type-safe database client:

**In transactional repos:**
```typescript
protected override async _execute(input: Input): Promise<Output> {
    const customer = await this.trx  // Transaction connection
        .selectFrom('customers')
        .where('id', '=', input.id)
        .selectAll()
        .executeTakeFirst();

    return { success: true, data: customer };
}
```

**In non-transactional repos:**
```typescript
protected override async _execute(input: Input): Promise<Output> {
    const customer = await this.db  // Connection pool
        .selectFrom('customers')
        .where('id', '=', input.id)
        .selectAll()
        .executeTakeFirst();

    return { success: true, data: customer };
}
```

## Next Steps

- [Adding Dependencies](/docs/guide/adding-dependencies)
