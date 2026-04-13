---
description: "Guide — create your first domain in Devux.js using the CLI."
---

# Create Your First Domain

This guide walks you through creating your first domain in Devux.

## Prerequisites

- Devux project set up
- CLI available via `pnpm devux`

## Steps

### 1. Open the CLI

```bash
pnpm devux
```

### 2. Select "Domains"

Use arrow keys to navigate and press Enter.

### 3. Select "Create"

### 4. Enter Domain Name

Enter a name in kebab-case (e.g., `customers`, `order-management`).

### 5. Done!

Your domain is created with the following structure:

```
apps/backend/src/domains/customers/
├── endpoints/
├── services/
└── repos/

packages/shared/src/shared-app/domains/customers/
├── customers.error-codes.ts
├── customers.constants.ts
└── zod-schemas/
    └── customers.base.zod.schema.ts
```

## Next Steps

- [Create Your First Endpoint](/docs/guide/first-endpoint)
