# App Services

App services are application-wide utilities that can be used across all domains. Unlike domain services (which belong to a specific domain), app services are global - they handle cross-cutting concerns and external integrations.

## When to Use App Services

Use app services for:

- **Cross-cutting concerns** – logging, caching, rate limiting
- **External integrations** – email providers, SMS, payment gateways
- **Shared utilities** – file storage, image processing, encryption

Don't use app services for business logic - that belongs in domain services.

## Creating an App Service

```bash
pnpm devux
# Select "App Services"
# Select "Create"
# Enter service name (kebab-case)
# Choose: Request scoped or Global
```

## Global vs Request-Scoped

When creating an app service, you choose its scope:

### Global (Singleton)

One instance shared across all requests. Use for stateless services or those managing shared resources.

```
┌─────────────────────────────────────┐
│           AppContainer              │
│  ┌─────────────────────────────┐   │
│  │      EmailService           │   │ ← Single instance
│  │  (sends emails via SMTP)    │   │
│  └─────────────────────────────┘   │
└─────────────────────────────────────┘
        ↑             ↑
    Request 1     Request 2        (same instance)
```

Good for:
- Connection pools (database, cache)
- External API clients
- Configuration services
- Logging services

### Request-Scoped

New instance created for each HTTP request. Use when the service needs request-specific state.

```
Request 1                     Request 2
    │                             │
    ▼                             ▼
┌────────────────┐         ┌────────────────┐
│ AuditService   │         │ AuditService   │
│ (user: alice)  │         │ (user: bob)    │
└────────────────┘         └────────────────┘
    (separate instances)
```

Good for:
- Audit logging (needs current user)
- Per-request caching
- Request-scoped context

## Example: Email Service (Global)

A typical global service for sending emails:

```typescript
// app-services/email-service/email-service.ts
import type { IEmailService } from './email-service.interface';
import { injectable } from 'inversify';

@injectable()
export class EmailService implements IEmailService {

    private readonly client: MailClient;

    constructor() {
        this.client = new MailClient({
            apiKey: process.env.MAIL_API_KEY,
        });
    }

    async sendWelcomeEmail(to: string, name: string): Promise<void> {
        await this.client.send({
            to,
            subject: 'Welcome!',
            template: 'welcome',
            data: { name },
        });
    }

    async sendPasswordReset(to: string, token: string): Promise<void> {
        await this.client.send({
            to,
            subject: 'Reset your password',
            template: 'password-reset',
            data: { token },
        });
    }
}
```

## Example: Audit Service (Request-Scoped)

A request-scoped service that needs access to the current request context:

```typescript
// app-services/audit-service/audit-service.ts
import type { IAuditService } from './audit-service.interface';
import { injectable } from 'inversify';
import { injectRequestContext } from '@/core/core-injectables/request-context/request-context.inversify.tokens';
import type { RequestContext } from '@/core/core-injectables/request-context/request-context.type';

@injectable()
export class AuditService implements IAuditService {

    @injectRequestContext() private readonly requestContext!: RequestContext;

    async log(action: string, details: Record<string, unknown>): Promise<void> {
        await auditLogs.insert({
            userId: this.requestContext.userId,
            action,
            details,
            timestamp: new Date(),
            ip: this.requestContext.req.ip,
        });
    }
}
```

## Using App Services

Inject app services into use-cases or other services:

```typescript
@fullInjectable()
export class CreateCustomerUseCase extends TransactionalUseCase<CreateCustomerRequest> {

    @injectEmailService() private readonly emailService!: IEmailService;
    @injectAuditService() private readonly auditService!: IAuditService;

    protected override async _execute(input: CreateCustomerRequest): Promise<void> {
        // Create customer...

        // Send welcome email
        await this.emailService.sendWelcomeEmail(input.email, input.name);

        // Log the action
        await this.auditService.log('customer_created', { customerId: customer.id });

        await this.commit();
    }
}
```

## Managing Dependencies

App services can depend on other app services or core services:

```bash
pnpm devux
# Select "App Services"
# Select "Manage dependencies"
# Select the service
# Add or remove dependencies
```

## Binding Differences

The CLI automatically sets up bindings based on the scope you choose:

**Global services** are bound in `app-services.setup.ts`:
```typescript
export function setupAllAppServices(appContainer: AppContainer) {
    setupEmailServiceBindings(appContainer);  // Global singleton
}
```

**Request-scoped services** are bound per-endpoint in the endpoint bindings:
```typescript
export function setupCreateCustomerBindings(requestContainer: RequestContainer) {
    setupAuditServiceBindings(requestContainer);  // Per-request
    // ...
}
```

## Testing App Services

The CLI generates a tester class for your app service:

```typescript
// In your test file
const tester = new EmailServiceTester();

// For global services, get the singleton
const emailService = tester.getGlobalService();

// For request-scoped services, get a new instance per test
const auditService = tester.getService();
```

See [Testers](/docs/testers) for more details.
