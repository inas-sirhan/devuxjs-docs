# Create Your First Service

This guide walks you through creating services in Devux.

## Domain Service

Use for shared business logic within a domain.

### Steps

1. Run `pnpm devux`
2. Select "Domain Services"
3. Select "Create"
4. Choose the target domain
5. Enter service name (kebab-case, e.g., `calculate-pricing`)

### Result

```
apps/backend/src/domains/orders/services/calculate-pricing/
├── calculate-pricing.ts              ← Your service logic
└── tests/
    └── calculate-pricing.test.ts

packages/shared/src/shared-app/domains/orders/zod-schemas/calculate-pricing/
└── calculate-pricing.zod.schema.ts   ← Input/output schemas
```

## App Service

Use for cross-cutting concerns (email, logging, etc.) that span multiple domains.

### Steps

1. Run `pnpm devux`
2. Select "App Services"
3. Select "Create"
4. Enter service name (kebab-case, e.g., `email-service`)
5. Choose scope: **Request scoped** or **Global**

### Result

```
apps/backend/src/app-services/email-service/
├── email-service.ts
├── email-service.interface.ts
└── tests/
    └── email-service.test.ts
```

See [App Services](/docs/services/app-services) for when to use each scope.

## Next Steps

- [Create Your First Repo](/docs/guide/first-repo)
- [Adding Dependencies](/docs/guide/adding-dependencies)
