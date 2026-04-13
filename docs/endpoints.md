---
description: "Endpoints in Devux.js — create type-safe API routes with auto-generated controllers, validators, presenters, and test files."
---

# Endpoints

Endpoints are API routes within a domain. Each endpoint follows clean architecture with a controller, validator, use-case, and presenter.

The CLI generates all the boilerplate - controllers, validators, presenters, interfaces, dependency injection setup, and test files. You only write business logic in the use-case and define your response schemas.

Both request and response are automatically validated - inputs via the endpoint schema, outputs via the presenter. Validation automatically runs during development so you catch mistakes early. Types are inferred directly from your Zod schemas, no duplication.

## Creating an Endpoint

1. Run the CLI:
```bash
pnpm devux
```

2. Select **"Endpoints"**

3. Select **"Create"**

4. Choose the target domain

5. Enter endpoint details:
   - Endpoint ID (kebab-case, e.g., `get-customer`, `create-order`)
   - HTTP method (GET, POST, PUT, PATCH, DELETE)
   - Is it transactional?
   - Generate default repo?

The CLI generates all the files you need with boilerplate filled in - all wired up and ready to use.

## Endpoint Structure

Example for an endpoint named `get-customer` under `customers` domain:
```
apps/backend/src/domains/customers/endpoints/get-customer/
├── get-customer.use-case.ts
├── get-customer.responses.ts
├── get-customer.route.config.ts
├── repos/
│   └── get-customer/
│       ├── get-customer.repo.ts
│       ├── get-customer.repo.zod.schemas.ts
│       └── tests/
│           └── get-customer.repo.test.ts
└── tests/
    ├── get-customer.use-case.test.ts
    └── get-customer.e2e.test.ts

packages/shared/src/shared-app/domains/customers/zod-schemas/get-customer/
└── get-customer.zod.schema.ts
```

All auto-generated with correct naming, imports, and structure. You just fill in your business logic.

## Components

### Endpoint Schema

Define the request schema in `{endpoint}.zod.schema.ts`. You can use various utilities:

```typescript
// get-customer.zod.schema.ts
export const getCustomerZodSchema = zodStrictPick(customersBaseZodSchema, {
    customerId: true,
});

export type GetCustomerRequest = z.infer<typeof getCustomerZodSchema>;
```

Other utilities: `zodStrictOmit`, `createZodObject`, `zodShapePick`, `.extend()`

```typescript
// Cross-domain endpoint example
createZodObject({
    ...zodShapePick(customersBaseZodSchema, { customerId: true }),
    ...zodShapePick(ordersBaseZodSchema, { orderId: true }),
})
```

This schema is automatically used for:
- **Request validation** – incoming requests are validated against this schema
- **Type inference** – `GetCustomerRequest` type is inferred and used throughout the endpoint
- **OpenAPI spec** – the schema is converted to OpenAPI format for documentation
- **Generated API client** – type-safe frontend clients are generated from the OpenAPI spec

### Route Config

Define the endpoint's URL path and options in `{endpoint}.route.config.ts`:

```typescript
// get-customer.route.config.ts
const customersPath = withCustomersRoutePath<GetCustomerRequest>();

export const getCustomerRouteConfig = defineRouteConfig({
    method: 'get',
    path: customersPath.param('customerId'),
});
```

**Path building:**
- `.static('segment')` - adds a static path segment (e.g., `/customers`)
- `.param('fieldName')` - adds a path parameter (e.g., `/:customerId`) - type-safe, only string/number fields are pickable

**Additional options:**
- `middlewares` - custom middlewares (`beforeAny`, `beforeRouteHandler`, `afterRouteHandler`)
- `queryParamsParser` - configure query parsing for GET/DELETE (parameterLimit, depthLimit, arrayLimit)
- `jsonBodyParser` - configure body parsing for POST/PUT/PATCH (maxBodySizeBytes)
- `isFileUpload` - enable file upload mode with `fileUploadConfig` (single, array, or fields mode)
- `summary`, `description`, `extraTags` - OpenAPI documentation

### Responses

Define your endpoint's business logic responses in `{endpoint}.responses.ts`. Each response represents a possible outcome of the operation.

```typescript
// get-customer.responses.ts
export const getCustomerResponses = {
    'CustomerNotFound': createErrorApiResponse({
        statusCode: 404,
        errorCode: CustomersErrorCodes['CustomerNotFound'],
        path: 'customerId' satisfies DottedPath<GetCustomerRequest>,
    }),

    'CustomerRetrieved': createSuccessApiResponse({
        statusCode: 200,
        dataSchema: zodStrictPick(customersBaseZodSchema, {
            name: true,
            phone: true,
            type: true,
        }),
    }),
} as const satisfies Responses;
```

Responses are automatically used for:
- **OpenAPI spec** – all response types and schemas are documented
- **Generated API client** – frontend clients have full type safety for all possible responses

Global responses (authentication, authorization, validation errors, etc.) are handled separately. See [Global Errors](/docs/global-errors).

### Use-Case

The use-case in `{endpoint}.use-case.ts` contains your business logic.

Use-cases can depend on repos (data access), domain services, and app services. See [Managing Dependencies](#managing-dependencies).

**Transactional use-case** (most common):

```typescript
// get-customer.use-case.ts
@fullInjectable()
export class GetCustomerUseCase extends TransactionalUseCase<GetCustomerRequest> {
    @injectGetCustomerPresenter() private readonly presenter!: IGetCustomerPresenter;
    @injectGetCustomerRepo() private readonly getCustomerRepo!: IGetCustomerRepo;

    protected override getIsolationLevel(): TransactionIsolationLevel {
        return 'read-committed';
    }

    protected override getAccessMode(): TransactionAccessMode {
        return 'read-only'; // or 'read-write' for mutations
    }

    protected override async _assertCanAccess(): Promise<void> {
        // Authorization logic
    }

    protected override async _execute(input: GetCustomerRequest): Promise<void> {
        // Business logic
        // Call this.rollback() or this.commit() first, then this.presenter.present()
    }
}
```

**Isolation levels:** ([PostgreSQL docs](https://www.postgresql.org/docs/current/transaction-iso.html))

| Level | Use When |
|-------|----------|
| `read-committed` | Default. Good for most operations. |
| `repeatable-read` | Need consistent reads within the transaction. |
| `serializable` | Absolute consistency required. |

**Access modes:**

| Mode | Use When |
|------|----------|
| `read-only` | Only reading data. Database can optimize. |
| `read-write` | Modifying data. |

**Automatic retry on conflicts:**

The framework automatically retries transactions on deadlocks and serialization errors - common in high-concurrency scenarios. Retries use exponential backoff with jitter. Configure via `getTransactionMaxAttempts()` and `getTransactionBaseDelayMillis()` overrides, or globally in [Core Config](/docs/core-config).

**Monitoring:**

When transactions fail or take too long, [Core Hooks](/docs/core-hooks) are called (`onDeadlockError`, `onSerializationError`, `onSlowUseCase`) so you can log and monitor.

See [Transaction Management](/docs/transactions) for full details.

**Non-transactional use-case**:

Use non-transactional use-cases when you don't need a database transaction - for example, logout endpoints, single read queries, operations that only call external services, etc.

```typescript
@fullInjectable()
export class LogoutUseCase extends NonTransactionalUseCase<LogoutRequest> {
    @injectLogoutPresenter() private readonly presenter!: ILogoutPresenter;
    @injectSessionService() private readonly sessionService!: ISessionService;

    protected override async _assertCanAccess(): Promise<void> {
        // Authorization logic
    }

    protected override async _execute(input: LogoutRequest): Promise<void> {
        // Business logic (no transaction context)
    }
}
```

Non-transactional use-cases can use endpoint repos (non-transactional) and app services. Domain repos and domain services are not available as they require a transaction context.

**Performance threshold:**

Use-cases have a default slow operation threshold (see [Core Config](/docs/core-config)). Override `getDurationThresholdMillis()` for operations that legitimately take longer:

```typescript
protected override getDurationThresholdMillis(): number {
    return 500; // Custom threshold for this use-case
}
```

### Presenter
The presenter is auto-injected into every use-case and fully managed by the framework. It's automatically generated based on your responses file - you just use it out of the box.

Call `this.presenter.present()` to send responses:

```typescript
protected override async _execute(input: GetCustomerRequest): Promise<void> {
    const result = await this.getCustomerRepo.execute(input);

    if (result.success === false) {
        if (result.errorCode === CustomersErrorCodes['CustomerNotFound']) {
            await this.rollback();
            return this.presenter.present('CustomerNotFound');
        }
        assertNeverReached(result.errorCode);
    }

    await this.commit();
    return this.presenter.present('CustomerRetrieved', result.data);
}
```

The presenter is fully type-safe. The first argument must be a valid response key, and the second argument (if needed) is typed based on that response's schema.

Repos use the result pattern with a `success` discriminator - check `result.success` before accessing `result.data`. Use `assertNeverReached()` to ensure all error codes are handled. See [Repos](/docs/repos/endpoint-repos) for more details.

### Controller, Validator & Response Handling
Routing, validation, and response handling are automatically managed by the framework. When you call `this.presenter.present('Key')`, the framework automatically sends the HTTP response based on the status code and schema defined in your responses file.

Use-cases are fully decoupled from HTTP concerns - you just focus on business logic. This separation improves developer experience and allows testing business logic in isolation.

## Managing Dependencies

Select **"Endpoints"** → **"Manage dependencies"** to add or remove:

- **Endpoint repos** – Create or delete endpoint repos for this endpoint
- **Domain repos** – Add or remove domain repos as dependencies
- **Domain services** – Add or remove domain services as dependencies
- **App services** – Add or remove app services as dependencies

The CLI automatically handles all the wiring - updating imports, adding or removing dependencies as class properties, and regenerating testers. See [Testers](/docs/testers) for more details.
