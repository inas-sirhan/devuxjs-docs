# Syncing API

Generate the OpenAPI spec and type-safe API clients from your endpoint schemas.

## Usage

```bash
pnpm sync:api
```

## Generated Output

The command generates:
- `apps/backend/api/openapi.json` - OpenAPI spec
- `apps/backend/api/api.fetch.ts` - Fetch client for e2e tests
- `packages/shared/src/api/api.react-query.ts` - React Query + Axios client for frontend

## API Clients

### Fetch Client (E2E Testing)

A fetch-based client for e2e tests, generated at `apps/backend/api/api.fetch.ts`. Supports passing a custom fetch instance (e.g., fetch-cookie for session handling).

```typescript
import { Api } from '@/api/api.fetch';

const response = await Api.getCustomer(fetch, { customerId: '123' });
```

### React Query + Axios Client (Frontend)

A full-featured client with React Query hooks for frontend apps.

```typescript
import { Api } from '@packages/shared/api/api.react-query';

function CustomerPage({ customerId }: { customerId: string }) {
    const { data, isLoading, error } = Api.useGetCustomer({ customerId });

    if (isLoading) return <div>Loading...</div>;

    return <div>{data.name}</div>;
}
```

## When to Run

Run this command after:
- Creating new endpoints
- Modifying endpoint schemas or responses
- Changing route configurations

You can also add it to your build process or CI/CD pipeline to ensure the API client is always in sync.
