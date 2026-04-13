# Core Config

Core configuration options are defined in `apps/backend/src/infrastructure/core/core.config.ts`.

## Database Transaction Settings

| Option | Default | Description |
|--------|---------|-------------|
| `transactionMaxAttempts` | 5 | Max retries for serialization/deadlock errors |
| `baseDelayBetweenTransactionRetriesMillis` | 50 | Base delay between retry attempts |

## Performance Thresholds

Thresholds for slow operation detection. When exceeded, the corresponding [Core Hook](/docs/core-hooks) fires.

| Option | Default | Description |
|--------|---------|-------------|
| `repoDurationThresholdMillis` | 50 | Repo slow threshold |
| `domainServiceDurationThresholdMillis` | 100 | Domain service slow threshold |
| `useCaseDurationThresholdMillis` | 200 | Use-case slow threshold |

Each use-case, repo, or domain service can override `getDurationThresholdMillis()` for a custom threshold:

```typescript
protected override getDurationThresholdMillis(): number {
    return 500; // Custom threshold for this operation
}
```

## Request Parsing

### JSON Body Parser

| Option | Default | Description |
|--------|---------|-------------|
| `jsonBodyParser.maxBodySizeBytes` | 200 KB | Max request body size |

### Query Params Parser

| Option | Default | Description |
|--------|---------|-------------|
| `queryParamsParser.parameterLimit` | 50 | Max number of parameters |
| `queryParamsParser.depthLimit` | 5 | Max nesting depth |
| `queryParamsParser.arrayLimit` | 10 | Max array length |

### File Upload

| Option | Default | Description |
|--------|---------|-------------|
| `fileUpload.maxFieldValueSizeBytes` | 1 KB | Max field value size |
| `fileUpload.maxFieldNameSizeBytes` | 100 | Max field name size |

## Environment

| Option | Description |
|--------|-------------|
| `isProduction` | `true` when `NODE_ENV === 'production'` |
| `isTesting` | `true` when `NODE_ENV === 'test'` |

## API Sync

| Option | Description |
|--------|-------------|
| `syncApi` | `true` when `SYNC_API === 'true'` - triggers OpenAPI spec and client generation |

## Generator Options

Options that affect what the CLI generates when you create endpoints, repos, etc. Set these to `true` if you want the generated code to include placeholder fields you'll fill in later.

### Route Config

| Option | Default | Description |
|--------|---------|-------------|
| `generateMiddlewares` | false | Include middlewares block in generated route config |
| `generateSummary` | false | Generate OpenAPI summary |
| `generateDescription` | false | Generate OpenAPI description |
| `generateExtraTags` | false | Generate extra tags |

With all options enabled, a generated route config looks like:

```typescript
export const createCustomerRouteConfig = defineRouteConfig({
    method: 'post',
    path: customersPath,
    middlewares: {},      // generateMiddlewares: true
    summary: '',          // generateSummary: true
    description: '',      // generateDescription: true
    extraTags: [],        // generateExtraTags: true
});
```

With defaults (all false), these fields are omitted.

### Responses

| Option | Default | Description |
|--------|---------|-------------|
| `generateDescription` | false | Generate response descriptions |

When enabled, response definitions include a description placeholder:

```typescript
export const createCustomerResponses = {
    customerCreated: {
        statusCode: 201,
        schema: createCustomerResponseZodSchema,
        description: '',  // generateDescription: true
    },
};
```

### Repo

| Option | Default | Description |
|--------|---------|-------------|
| `generateUniqueKeyViolationErrorMap` | true | Generate unique constraint error mapping |
| `generateForeignKeyViolationErrorMap` | false | Generate foreign key error mapping |

When enabled, repos include placeholder methods for mapping database constraint errors to your error codes:

```typescript
// generateUniqueKeyViolationErrorMap: true
protected override getUniqueKeyViolationErrorMap() {
    return {
        // 'constraint_name': ErrorCodes['YourErrorCode'],
    };
}

// generateForeignKeyViolationErrorMap: true
protected override getForeignKeyViolationErrorMap() {
    return {
        // 'constraint_name': ErrorCodes['YourErrorCode'],
    };
}
```
