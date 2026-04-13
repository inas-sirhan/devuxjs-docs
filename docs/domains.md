# Domains

A domain groups related functionality together.

**Backend:**
- **Endpoints** – API routes for this domain
- **Services** – Shared business logic layer
- **Repos** – Shared data access layer

**Shared (with frontend):**
- **Zod Schemas** – Validation schemas for endpoints
- **Error Codes** – Domain-specific error codes
- **Types** – Shared TypeScript types
- **Constants** – Shared constants
- **Utils** – Shared utility functions

The CLI automatically generates the entire folder structure, boilerplate files, and proper naming conventions - you just provide the domain name and focus on your business logic.

## Creating a Domain

1. Run the CLI:
```bash
pnpm devux
```

2. Select **"Domains"**

3. Select **"Create"**

4. Enter your domain name in kebab-case (e.g., `customers`, `order-management`)

That's it! The CLI creates all folders, files, and wires everything together. No manual file creation needed.

## Domain Structure

Example for a domain named `customers`:

**Backend:**
```
apps/backend/src/domains/customers/
├── endpoints/
├── repos/
└── services/
```

**Shared (with frontend):**
```
packages/shared/src/shared-app/domains/customers/
├── customers.error-codes.ts
├── customers.constants.ts
├── customers.types.ts
├── customers.utils.ts
└── zod-schemas/
    ├── customers.zod.field-validators.ts
    └── customers.base.zod.schema.ts
```

All of these files are auto-generated with the correct naming, imports, and structure. You just fill in your domain-specific logic.

## Error Codes

Define domain-specific error codes in `{domain}.error-codes.ts`:

```typescript
// customers.error-codes.ts
import { defineErrorCodes } from '@packages/shared-core/utils/define-error-codes';

export const CustomersErrorCodes = defineErrorCodes({
    InvalidCustomerId: 'invalid_customer_id',
    InvalidCustomerType: 'invalid_customer_type',
    CustomerNotFound: 'customer_not_found',
    CustomerNameAlreadyInUse: 'customer_name_already_in_use',
});
```

Error codes must be in `snake_case` format.

### Auto-Generated Translations

```bash
pnpm sync:translations
```

This auto-generates translation files for all error codes across all domains.

## Schema System

### Field Validators

Define reusable validators for each field in `{domain}.zod.field-validators.ts`:

```typescript
// customers.zod.field-validators.ts
export const zodCustomerId = createZodUniqueId(CustomersErrorCodes.InvalidCustomerId);
export const zodCustomerName = zodPersonName;
export const zodCustomerPhone = zodMobilePhone;
export const zodCustomerType = createZodEnum(CustomersTypes, CustomersErrorCodes.InvalidCustomerType);
```

Use utilities like `createZodUniqueId`, `createZodEnum`, `zodString`, `zodInteger`, `zodPositiveNumber` from `shared.core.zod.utils` and `shared.core.zod.field-validators`.

### Base Schema

Combine field validators into a domain base schema in `{domain}.base.zod.schema.ts`:

```typescript
// customers.base.zod.schema.ts
const shape = {
    customerId: zodCustomerId,
    name: zodCustomerName,
    phone: zodCustomerPhone,
    type: zodCustomerType,
};

export const customersBaseZodSchema = createZodObject(shape);
export type CustomersBase = z.infer<typeof customersBaseZodSchema>;
```
