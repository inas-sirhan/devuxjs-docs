# Add a Database Layer

Continuing from [1. Simple Example](/docs/getting-started) — let's read the books from a real database.

## Prerequisites

- [PostgreSQL](https://www.postgresql.org/) installed and running

## Create a Database

Create a new PostgreSQL database (if you don't have one already):

```bash
psql -U postgres
```

```sql
CREATE DATABASE mydb;
```

The `public` schema is created by default — no extra setup needed.

## Add DATABASE_URL to .env

Open `apps/backend/.env` and add your connection string:

```
DATABASE_URL=postgresql://username:password@localhost:5432/mydb
```

Replace:
- `username` / `password` — your PostgreSQL credentials (default user is often `postgres`)
- `mydb` — the database name you created above

---

## Define the Schema

Create `src/infrastructure/database/drizzle/tables/books/books.drizzle.table.ts`:

```typescript
import { createDrizzleTable } from '@/core/tools/drizzle/drizzle.utils';
import { text } from 'drizzle-orm/pg-core';

export const booksTable = createDrizzleTable('books', (col, utils) => [
    col('id', utils.integerPrimaryKey),
    col('title', text, c => c.notNull()),
], (_table) => [

]);
```

---

## Sync the Database

From the project root (or `cd apps/backend` first):

```bash
pnpm -F backend sync:db
# or
cd apps/backend && pnpm sync:db
```

Follow the prompts:

1. **What do you want to sync?** → `Both (Drizzle + Kysely)`
2. **Which environment?** → `Development`

This pushes your schema to the database and generates fully typed Kysely query types.

---

## Create a Repo

Open the CLI:

```bash
pnpm devux
```

Navigate to **Endpoints** → **get-books** → **Create repo** → name it `get-books`.

The CLI generates the repo file and wires everything up.

---

## Fill in the Repo

Open `domains/books/endpoints/get-books/repos/get-books/get-books.repo.ts`:

```typescript
protected override async _execute(_input: GetBooksRepoInput): Promise<GetBooksRepoOutput> {
    // fill in your query here
    const books = await this.db
        .selectFrom('books')
        .select(['id', 'title'])
        .execute();

    return {
        success: true,
        data: { books },
    };
}
```

---

## Add the Repo to the Use-Case

In the CLI, go to **Endpoints** → **get-books** → **Add dependency** → select `GetBooksRepo`.

The CLI injects it into your use-case automatically:

```typescript
@injectGetBooksRepo() private readonly getBooksRepo!: IGetBooksRepo;
```

---

## Use It in the Use-Case

Open `domains/books/endpoints/get-books/get-books.use-case.ts` and update `_execute`:

```typescript
protected override async _execute(_input: GetBooksRequest): Promise<void> {
    const result = await this.getBooksRepo.execute({});

    if (result.success === false) {
        // compile & runtime error if any case is unhandled
        assertNeverReached(result.errorCode);
    }

    return this.presenter.present('Success', result.data);
}
```

---

### Try It

```bash
pnpm dev
```

```
GET http://localhost:3000/api/books
```

Books are now fetched from the database.
