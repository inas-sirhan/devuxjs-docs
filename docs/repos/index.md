---
description: "Repos in Devux.js — data access layers for database operations with type-safe queries and the result pattern."
---

# Repos

Repos are data access layers that handle database operations. They encapsulate queries and return results using the [result pattern](/docs/result-pattern).

There are three types of repos:

- **[Endpoint Repos](/docs/repos/endpoint-repos)** – specific to a single endpoint
- **[Domain Repos](/docs/repos/domain-repos)** – shared across multiple endpoints in a domain
- **[Domain Service Repos](/docs/repos/domain-service-repos)** – specific to a domain service

All repos share the same patterns and concepts described below.

## Transactional vs Non-Transactional Repos

There are two types of repos:

- **Transactional Repos** – use `this.trx`, a single transaction connection shared across all repos in the use-case
- **Non-Transactional Repos** – use `this.db`, the connection pool where each query runs independently

Transaction management is handled by Devux - you just use `this.trx` or `this.db` out of the box.

**Domain repos** and **domain service repos** are always transactional, as they operate within a use-case's transaction context.

**Endpoint repos** follow the transactional mode of their parent endpoint - transactional endpoints can only have transactional repos, and non-transactional endpoints can only have non-transactional repos.

## Constraint Violation Handling

Database constraint violations (unique keys, foreign keys) are common. Instead of catching errors manually, repos let you map constraint names to error codes automatically.

### Unique Key Violations

When an insert or update violates a unique constraint, map it to an error code:

```typescript
@fullInjectable()
export class CreateCustomerRepo extends TransactionalRepo<...> {

    protected override getUniqueKeyViolationErrorMap() {
        return {
            'customers_email_unique': CustomersErrorCodes['CustomerEmailAlreadyExists'],
        };
    }
}
```

Now if the database throws a unique constraint error for `customers_email_unique`, the repo automatically returns `{ success: false, errorCode: 'customer_email_already_exists' }` instead of throwing.

### Foreign Key Violations

When an insert, update, or delete violates a foreign key constraint:

```typescript
@fullInjectable()
export class CreateOrderRepo extends TransactionalRepo<...> {

    protected override getForeignKeyViolationErrorMap() {
        return {
            'orders_customer_id_fkey': OrdersErrorCodes['CustomerNotFound'],
        };
    }
}
```

This handles cases like inserting an order with a non-existent customer ID - instead of a raw database error, you get a clean `{ success: false, errorCode: 'customer_not_found' }`.

## Repo Structure

All repos follow the same file structure:

```
{repo-name}/
├── {repo-name}.repo.ts           # Implementation
├── {repo-name}.repo.zod.schemas.ts   # Input/output schemas
└── tests/
    └── {repo-name}.repo.test.ts  # Tests
```

### Zod Schemas

Define input and output schemas in `{repo}.repo.zod.schemas.ts`:

```typescript
// get-customer.repo.zod.schemas.ts
export const getCustomerRepoInputZodSchema = zodStrictPick(customersBaseZodSchema, {
    customerId: true,
});

export const getCustomerRepoOutputZodSchema = zodResult({
    data: zodStrictPick(customersBaseZodSchema, {
        name: true,
        phone: true,
        type: true,
    }),
    errorCodes: [CustomersErrorCodes['CustomerNotFound']],
});
```

### Repo Implementation

The CLI generates the repo class structure in `{repo}.repo.ts`. You write the `_execute` method and optionally the constraint violation maps:

```typescript
// get-customer.repo.ts
@fullInjectable()
export class GetCustomerRepo extends TransactionalRepo<GetCustomerRepoInput, GetCustomerRepoOutput> implements IGetCustomerRepo {

    // structure and types auto generated - you just write the implementation
    protected override async _execute(input: GetCustomerRepoInput): Promise<GetCustomerRepoOutput> {
        // example using kysely
        const customer = await this.trx
            .selectFrom('customers')
            .where('id', '=', input.customerId)
            .select(['name', 'phone', 'type'])
            .executeTakeFirst();

        if (customer === undefined) {
            return { success: false, errorCode: CustomersErrorCodes['CustomerNotFound'] };
        }

        return { success: true, data: customer };
    }

    // auto generated
    protected override getRepoInputZodSchema() {
        return getCustomerRepoInputZodSchema;
    }

    // auto generated
    protected override getRepoOutputZodSchema() {
        return getCustomerRepoOutputZodSchema;
    }
}
```

## Performance Threshold

Repos have a default slow operation threshold (see [Core Config](/docs/core-config)). Override `getDurationThresholdMillis()` for operations that legitimately take longer:

```typescript
protected override getDurationThresholdMillis(): number {
    return 200; // Custom threshold for this repo
}
```
