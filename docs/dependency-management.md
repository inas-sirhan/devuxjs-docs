# Dependency Management

Devux tracks all dependencies between components in a registry. The CLI handles adding and removing dependencies, updating both the code and the registry automatically.

## What Can Depend on What

Not all components can depend on each other. Here are the allowed dependencies:

| Component | Can Depend On |
|-----------|---------------|
| **Use-Case** | Domain repos, domain services, app services |
| **Domain Service** | Domain repos, other domain services, app services |
| **Endpoint Repo** | App services only |
| **Domain Repo** | App services only |
| **App Service** | Other app services, public core services (with scope rules) |

Repos are intentionally restricted - they should only do database operations and not contain business logic that requires other repos or services.

## Adding Dependencies

### To a Use-Case

```bash
pnpm devux
# Select "Endpoints"
# Select "Manage dependencies"
# Choose the endpoint
# Select "Add dependency"
# Choose dependency type (Domain Repos, Domain Services, App Services)
# Select the specific dependency
```

The CLI:
1. Updates the registry
2. Adds the import and inject decorator to your use-case file
3. Adds bindings if needed
4. Regenerates the tester class

### To a Domain Service

```bash
pnpm devux
# Select "Domain Services"
# Select "Manage dependencies"
# Choose the service
# Select "Add dependency"
```

### To an App Service

```bash
pnpm devux
# Select "App Services"
# Select "Manage dependencies"
# Choose the service
# Select "Add dependency"
```

App services can only depend on other app services (with scope restrictions - global services can't depend on request-scoped services).

## Removing Dependencies

```bash
pnpm devux
# Select the component type (Endpoints, Domain Services, etc.)
# Select "Manage dependencies"
# Choose the component
# Select "Remove dependency"
# Select the dependency to remove
```

The CLI:
1. Updates the registry
2. Removes the import and inject decorator from the file
3. Removes bindings if no longer needed
4. Regenerates the tester class

## Base Class Dependencies

Add dependencies to base classes to make them available to all components of that type.

```bash
pnpm devux
# Select "Base Classes"
# Select "Add dependency"
# Choose: Use Case Base, Repo Base, or Domain Service Base
# Select an app service to add
```

When you add a dependency to a base class:
- All use-cases (or repos, or services) get access to it
- You don't need to add it individually to each component
- The dependency is injected via the base class

**Example:** Add a logging service to `UseCaseBase` so every use-case can use `this.logger`.

### Restrictions

- Only app services can be added to base classes
- Can't add the same dependency to both a base class and an individual component
- Core services (database pool, core hooks) are built-in and can't be removed

## Dependency Registry

Devux maintains a registry at `apps/backend/src/core/cli/injectables-registry/injectables-registry.json` that tracks:

- All injectables (use-cases, repos, services)
- Their types and domains
- Their dependencies
- What depends on them (dependents)

The CLI uses this registry to:
- Validate dependency additions
- Track what needs updating when dependencies change
- Regenerate testers with correct mock types

## Scope Rules for App Services

When app services depend on each other, scope matters:

| Service Scope | Can Depend On |
|---------------|---------------|
| Request-scoped | Global and request-scoped services |
| Global | Global services only |

A global (singleton) service can't depend on a request-scoped service because the singleton is created once at startup, before any request context exists.

## What Happens When You Add a Dependency

1. **Registry update** – The dependency is recorded in the registry

2. **Code update** – The CLI adds:
   ```typescript
   import { injectEmailService } from '@/__internals__/app-services/email-service/email-service.inversify.tokens';
   import type { IEmailService } from '@/app-services/email-service/email-service.interface';

   @fullInjectable()
   export class CreateCustomerUseCase extends TransactionalUseCase<...> {
       @injectEmailService() private readonly emailService!: IEmailService;
       // ...
   }
   ```

3. **Bindings update** – If needed, adds the setup call to the bindings file:
   ```typescript
   export function setupCreateCustomerBindings(requestContainer: RequestContainer) {
       // ...
       setupEmailServiceBindings(requestContainer);  // Added
   }
   ```

4. **Tester regeneration** – The tester class is regenerated to include the new dependency in its type definitions, enabling type-safe mocking.

## Circular Dependencies

The CLI doesn't allow circular dependencies. If A depends on B, B can't depend on A. The registry tracks the dependency graph and prevents cycles.

## Inspecting Dependencies

View what depends on what:

```bash
pnpm devux
# Select "List & Inspect"
# Select "Inspect an injectable"
# Choose a component
```

This shows:
- The component's dependencies
- What depends on it (dependents)
- Its type and domain
