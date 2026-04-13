# Create Your First Endpoint

This guide walks you through creating your first endpoint in Devux.

## Prerequisites

- A domain created (see [Create Your First Domain](/docs/guide/first-domain))

## Steps

### 1. Open the CLI

```bash
pnpm devux
```

### 2. Select "Endpoints"

### 3. Select "Create"

### 4. Choose Your Domain

Select the domain where you want to create the endpoint.

### 5. Enter Endpoint Details

- **Endpoint ID**: kebab-case name (e.g., `create-customer`)
- **Route**: The URL path (e.g., `/customers`)
- **HTTP Method**: GET, POST, PUT, PATCH, or DELETE
- **Transactional**: Whether to use database transactions
- **Create a repo**: Optionally create an endpoint repo at the same time

### 6. Done!

Your endpoint is created with:

```
apps/backend/src/domains/customers/endpoints/create-customer/
├── create-customer.use-case.ts       ← Your business logic
├── create-customer.responses.ts      ← Response definitions
├── create-customer.route.config.ts   ← Route configuration
└── tests/
    ├── create-customer.use-case.test.ts
    └── create-customer.e2e.test.ts

packages/shared/src/shared-app/domains/customers/zod-schemas/create-customer/
└── create-customer.zod.schema.ts     ← Request/response schemas
```

The controller, validator, and presenter are auto-generated in `__internals__`.

## Next Steps

- [Create a Service](/docs/guide/first-service)
- [Create a Repo](/docs/guide/first-repo)
