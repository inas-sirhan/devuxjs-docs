# Automatic Validation

Devux takes validation a step further. Request payloads are always validated - that's standard. But Devux also validates internal layers (repos, domain services, responses) during development, catching bugs early before they reach production.

## What Gets Validated

Every layer in Devux validates both what goes in and what comes out:

- **Endpoints** – request payload validated before reaching the use-case, response validated before being sent to the client
- **Repos** – input and output validated
- **Domain Services** – input and output validated

This means you catch mistakes everywhere - not just at the API boundary.

## Why Validate Everything?

Well, first you need to know about a TypeScript limitation.

TypeScript uses structural typing - meaning types are compatible as long as required properties exist. Extra properties? TypeScript doesn't care. And the "excess property checking" that would catch this only works on direct object literals, not variables:

```typescript
type User = { name: string };
const data = { name: 'inas', password: '1234' };

const user: User = data; // No error - 'password' slips through

function getUser(): User {
    return data; // No error - 'password' slips through
}
```

Why does this matter? For example, think about what happens in your repos:

**On input** – extra properties can sneak into your database, suddenly you're saving fields you never intended to.

**On output** – you might return more than you should. Imagine querying a user and accidentally returning their password, or internal fields that shouldn't be exposed. Even if it's not sensitive, you're still returning data you're not supposed to.

Besides that, validation becomes even more critical when you have to type a query result yourself - for example, when writing raw SQL to optimize queries your ORM can't handle. Now you can also have missing fields or wrong types (like a number coming back as a string).

### How do we fix this?

Since TypeScript can't catch these at compile time, Devux catches them at runtime using strict Zod schemas everywhere. Every input and output is validated against its schema - not just for extra or missing fields, but actual types too. A number that came back as a string? Caught.

During development, you'll see validation errors the moment something doesn't match. No silent data leaks, no unexpected fields in your database.

## Development-Only

Request validation always runs - Devux never skips validating request payloads. But internal layer validation (repo I/O, domain service I/O, response validation) runs only in non-production environments. In production, these are skipped to save performance - bugs would have already been caught during development and testing (see [Testers](/docs/testers)).

## Benefits

- **Catches what TypeScript misses** – extra properties, wrong types at runtime
- **Early failure** – invalid data caught before it propagates
- **Dev-time feedback** – mistakes caught during development, not production
- **Zero production overhead** – internal validation skipped in production (request validation always runs)

<br>

---

::: info Note
When request payload validation fails, Devux responds with a `ValidationError` error containing field-level details. See [Global Errors](/docs/global-errors).
:::
