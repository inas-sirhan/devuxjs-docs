# Testers

Devux auto-generates type-safe tester classes for every component you create. Testers set up the DI container, handle mocking, and provide a clean API for writing unit tests.

## What Gets Generated

When you create an endpoint, repo, or service, the CLI generates:

1. A **test file** with a basic test skeleton
2. A **tester class** in `__internals__` that handles all the testing infrastructure

```
domains/customers/endpoints/create-customer/
├── tests/
│   ├── create-customer.use-case.test.ts    ← Your test file
│   └── create-customer.e2e.test.ts         ← E2E test file
└── ...

__internals__/domains/customers/endpoints/create-customer/
└── create-customer.tester.ts               ← Generated tester
```

## Using Testers

### Basic Use-Case Test

```typescript
import { describe, it, expect } from 'vitest';
import { CreateCustomerTester } from '@/__internals__/domains/customers/endpoints/create-customer/create-customer.tester';

describe('create-customer use-case', () => {
    it('should create a customer', async () => {
        const tester = new CreateCustomerTester();

        const result = await tester.execute(
            { name: 'John', email: 'john@example.com' },  // Input
            'customerCreated'                             // Expected response key
        );

        expect(result.statusCode).toBe(201);
        expect(result.data.name).toBe('John');
    });
});
```

The `execute()` method:
1. Creates fresh DI containers
2. Applies any mocked dependencies
3. Runs the full use-case flow (controller → validator → use-case → presenter)
4. Returns the response, validated against the response schema

### Testing Error Cases

```typescript
it('should fail when email already exists', async () => {
    const tester = new CreateCustomerTester();

    // Replace the repo to simulate existing email
    tester.replace('create-customer-repo').withValue({
        execute: async () => ({
            success: false,
            errorCode: CustomersErrorCodes['CustomerEmailAlreadyExists'],
        }),
    });

    const result = await tester.execute(
        { name: 'John', email: 'existing@example.com' },
        'customerEmailAlreadyExists'
    );

    expect(result.statusCode).toBe(409);
});
```

### Testing API Errors

```typescript
it('should return ValidationError for invalid input', async () => {
    const tester = new CreateCustomerTester();

    const result = await tester.execute(
        { name: '', email: 'invalid' },  // Invalid input
        ApiError,                         // Error class
        'ValidationError'                // API error key
    );

    expect(result.statusCode).toBe(400);
});
```

## Replacing Dependencies

Testers provide type-safe dependency replacement:

### Replace with a Value

```typescript
tester.replace('create-customer-repo').withValue({
    execute: async (input) => ({
        success: true,
        data: { id: '123', ...input },
    }),
});
```

### Replace with a Class

```typescript
class MockRepo implements ICreateCustomerRepo {
    async execute(input: CreateCustomerRepoInput): Promise<CreateCustomerRepoOutput> {
        return { success: true, data: { id: 'mock-id', ...input } };
    }
}

tester.replace('create-customer-repo').withClass(MockRepo);
```

### Clear Replacements

```typescript
// Clear a specific replacement
tester.clearReplacement('create-customer-repo');

// Clear all replacements
tester.clearAllReplacements();
```

## Global Replacements

For dependencies you want to mock across all tests (like external services):

```typescript
// In your test setup file (e.g., vitest.setup.ts)
import { TesterGlobalReplacements } from '@/core/testers/tester.global-replacements';

TesterGlobalReplacements.replace('email-service').withValue({
    sendWelcomeEmail: async () => {},
    sendPasswordReset: async () => {},
});
```

Global replacements are applied to all testers automatically. You can opt out per-tester:

```typescript
const tester = new CreateCustomerTester();
tester.setIgnoreGlobals(true);
```

## Transactional Testers

For transactional use-cases, the tester automatically verifies transaction state:

- **2xx responses** → transaction must be committed
- **4xx/5xx responses** → transaction must be rolled back

```typescript
const tester = new CreateCustomerTester();

// This automatically checks transaction was committed
const result = await tester.execute(
    { name: 'John', email: 'john@example.com' },
    'customerCreated'
);

// You can also check manually
expect(tester.getTransactionState()).toBe('committed');
```

### Skip Transaction Check

For special cases where you need to skip the automatic check:

```typescript
tester.skipNextStatusCodeToTransactionStateCheck();
const result = await tester.execute(...);
```

### Use Mock Transaction Manager

For unit tests where you don't want actual database transactions:

```typescript
tester.useMockDatabaseTransactionManager(true);
```

## Repo Testers

Test repos in isolation:

```typescript
import { CreateCustomerRepoTester } from '@/__internals__/domains/customers/endpoints/create-customer/repos/create-customer/create-customer.repo.tester';

describe('create-customer repo', () => {
    it('should insert a customer', async () => {
        const tester = new CreateCustomerRepoTester();

        const result = await tester.execute({
            name: 'John',
            email: 'john@example.com',
        });

        expect(result.success).toBe(true);
        expect(result.data.id).toBeDefined();
    });
});
```

## Domain Service Testers

Test domain services:

```typescript
import { CalculatePricingTester } from '@/__internals__/domains/orders/services/calculate-pricing/calculate-pricing.tester';

describe('calculate-pricing service', () => {
    it('should calculate price with discount', async () => {
        const tester = new CalculatePricingTester();

        const result = await tester.execute({
            items: [{ productId: '1', quantity: 2 }],
            discountCode: 'SAVE10',
        });

        expect(result.success).toBe(true);
        expect(result.data.discount).toBe(10);
    });
});
```

## App Service Testers

Test app services:

```typescript
import { EmailServiceTester } from '@/__internals__/app-services/email-service/email-service.tester';

describe('email-service', () => {
    it('should send welcome email', async () => {
        const tester = new EmailServiceTester();
        const service = tester.getService();

        await service.sendWelcomeEmail('john@example.com', 'John');

        // Assert email was sent (depends on your implementation)
    });
});
```

## E2E Tests

The CLI also generates E2E test files that use the synced API client:

```typescript
import { describe, it, expect } from 'vitest';
import fetchCookie from 'fetch-cookie';
import { Api } from '@api/api.fetch';

const customFetch = fetchCookie(fetch);

describe('create-customer e2e', () => {
    it('should create a customer via HTTP', async () => {
        const response = await Api.createCustomer(customFetch, {
            name: 'John',
            email: 'john@example.com',
        });

        expect(response.statusCode).toBe(201);
    });
});
```

Run `pnpm api:sync` first to generate the API client.

## Accessing Dependencies

After executing, you can access resolved dependencies:

```typescript
const tester = new CreateCustomerTester();
await tester.execute({ ... }, 'customerCreated');

// Get the presenter to check what was called
const presenter = tester.get('create-customer-presenter');
```

## Regenerating Testers

Testers are regenerated automatically when you:
- Add/remove dependencies to a component
- Modify the component's type (transactional ↔ non-transactional)

You can also regenerate manually via the CLI:
```bash
pnpm devux
# Select "Regenerate"
# Select what to regenerate
```
