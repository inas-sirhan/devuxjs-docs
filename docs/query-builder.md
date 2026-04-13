# Query Builder

Devux uses [Kysely](https://kysely.dev/) as the default query builder - a type-safe SQL query builder for TypeScript.

## Why Kysely?

- **Type-safe** – queries are fully typed based on your database schema
- **No code generation** – types are inferred, not generated
- **SQL-like syntax** – if you know SQL, you know Kysely
- **Lightweight** – no heavy ORM abstractions

## Usage in Repos

Inside repos, you access Kysely via:

- `this.trx` - in transactional repos
- `this.db` - in non-transactional repos

Both are fully typed Kysely instances based on your database schema.

```typescript
// select
const customer = await this.trx
    .selectFrom('customers')
    .where('id', '=', input.customerId)
    .select(['name', 'phone', 'type'])
    .executeTakeFirst();

// insert
await this.trx
    .insertInto('customers')
    .values({ name: input.name, email: input.email })
    .execute();

// update
await this.trx
    .updateTable('customers')
    .set({ name: input.name })
    .where('id', '=', input.customerId)
    .execute();

// delete
await this.trx
    .deleteFrom('customers')
    .where('id', '=', input.customerId)
    .execute();
```

## Learn More

See the [Kysely documentation](https://kysely.dev/docs/intro) for the full API reference.
