# Next Version Plans

More features coming soon!

## Planned Features

### Mocking System

A comprehensive mocking system for frontend development without a running backend:

- **Auto-generated MSW handlers** – Type-safe [MSW](https://mswjs.io/) request handlers generated from your OpenAPI spec
- **Backend mock mode** – Each use-case can implement an `executeMock()` method that returns mock data
- **Environment-based routing** – Framework automatically routes to mock implementations when `MOCK_MODE=true`
- **Zero frontend changes** – Same API client works against real or mock backend

This enables frontend developers to work independently, speeds up UI development, and makes demos/testing easier.

### Service Mocking System

Environment-based service mocking for development and testing without touching production code:

- **`mocks.config.ts`** – Central configuration mapping service tokens to mock implementations
- **Per-environment control** – Different mocks for development, test, staging
- **Automatic rebinding** – Framework rebinds services at startup based on config
- **Zero code changes** – Real services untouched, mocks live separately

```typescript
// mocks.config.ts
export const mocks = {
    development: {
        [EmailServiceDiToken]: MockEmailService,
        [PaymentServiceDiToken]: MockPaymentService,
    },
    test: {
        [EmailServiceDiToken]: MockEmailService,
    }
};
```

Useful for: local development without external APIs, testing with predictable responses, demos without real side effects.

### Database & ORM Support

Currently Devux supports Kysely (query builder) and Drizzle (migrations). We're planning to expand database support:

- **Drizzle ORM** – Full ORM support, not just migrations
- **Prisma** – Out of the box support
- **Mongoose** – MongoDB support

### Authentication & Authorization

Built-in opinionated auth, with official plugins for flexibility:

- Session management (JWT, cookie sessions, etc.)
- Role-based access control
- Authentication strategies

### Security

Built-in security middleware and configuration:

- Rate limiting
- CSRF protection

### Custom Validation Error Messages

Support for field-specific error codes for better UX and translations.

Currently, validation errors return generic codes:
```json
{ "path": "email", "code": "too_short" }
```

Planned support for custom error codes:
```json
{ "path": "email", "code": "email_too_short" }
```

This makes frontend error-to-message mapping cleaner and enables proper i18n support.

### Framework Tests

Comprehensive test suite for the framework's core components.

### Codebase Improvements

- JSDoc comments for functions and classes
- Possible minor refactoring (folder structure, naming conventions)

## Current Limitations

<!-- Add current limitations here -->

## Feedback

Have ideas or feature requests? We'd love to hear from you.
