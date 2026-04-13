# Dependency Injection

Devux uses [Inversify](https://inversify.io/) for dependency injection. The CLI generates all the DI boilerplate - tokens, bindings, and inject functions - so you don't have to.

## How It Works

Every component in Devux (use-cases, repos, services) is registered in a DI container with a unique token. When a component needs a dependency, it uses an auto-generated inject function to declare that dependency.

### Tokens and Inject Functions

The CLI generates a pair for each component:

```typescript
// Auto-generated in __internals__
export const CreateCustomerRepoDiToken = defineDiToken('CreateCustomerRepo');
export const injectCreateCustomerRepo = createInjectFn(CreateCustomerRepoDiToken);
```

The token is a unique symbol that identifies the component. The inject function is a property decorator that tells Inversify what to inject.

### Using Dependencies

In your code, you use the generated inject function as a decorator:

```typescript
@fullInjectable()
export class CreateCustomerUseCase extends TransactionalUseCase<CreateCustomerRequest> {

    @injectCreateCustomerRepo() private readonly createCustomerRepo!: ICreateCustomerRepo;
    @injectCreateCustomerPresenter() private readonly presenter!: ICreateCustomerPresenter;

    protected override async _execute(input: CreateCustomerRequest): Promise<void> {
        const result = await this.createCustomerRepo.execute({ ... });
        // ...
    }
}
```

The `!` after the property name tells TypeScript the property will be initialized (by Inversify).

## The `@fullInjectable()` Decorator

Every class that participates in DI must be decorated with `@fullInjectable()`:

```typescript
@fullInjectable()
export class CreateCustomerUseCase extends TransactionalUseCase<...> {
    // ...
}
```

This decorator combines two Inversify features:
- `@injectable()` - marks the class as injectable
- `@injectFromBase()` - inherits dependencies from base classes

The second part is crucial. Base classes like `TransactionalUseCase` have their own dependencies (transaction manager, database connection, etc.). Without `@injectFromBase()`, those dependencies wouldn't be injected into your subclass.

## Two Containers

Devux uses two containers with different scopes:

### AppContainer (Global)

Created once at startup. Holds singletons shared across all requests:

- Database connection pool
- Core hooks
- Global app services

```typescript
// Global bindings happen at startup
appContainer.bindGlobalSingleton<IDatabaseConnectionPool>(
    DatabaseConnectionPoolDiToken,
    DatabaseConnectionPool
);
```

### RequestContainer (Per-Request)

Created fresh for each HTTP request. Holds components specific to that request:

- Controllers, validators, presenters
- Use-cases
- Repos
- Domain services
- Request-scoped app services

```typescript
// Request bindings happen per request
requestContainer.bindRequestSingleton<ICreateCustomerUseCase>(
    CreateCustomerUseCaseDiToken,
    CreateCustomerUseCase
);
```

The request container has the app container as its parent, so request-scoped components can inject global singletons.

## Bindings

The CLI generates binding setup functions for each component:

```typescript
// Auto-generated
export function setupCreateCustomerBindings(requestContainer: RequestContainer) {
    requestContainer.bindRequestSingleton<ICreateCustomerController>(
        CreateCustomerControllerDiToken, CreateCustomerController
    );
    requestContainer.bindRequestSingleton<ICreateCustomerValidator>(
        CreateCustomerValidatorDiToken, CreateCustomerValidator
    );
    requestContainer.bindRequestSingleton<ICreateCustomerPresenter>(
        CreateCustomerPresenterDiToken, CreateCustomerPresenter
    );
    requestContainer.bindRequestSingleton<ICreateCustomerUseCase>(
        CreateCustomerUseCaseDiToken, CreateCustomerUseCase
    );
    setupCreateCustomerRepoBindings(requestContainer);
}
```

These are called automatically when a request comes in for that endpoint.

## Why This Design?

**Type safety** – inject functions are typed, so you can't inject the wrong thing.

**No string tokens** – using symbols prevents typos and collisions.

**Automatic inheritance** – `@fullInjectable()` ensures base class dependencies work correctly.

**Clear scoping** – request-scoped by default prevents accidental state sharing between requests.

**Zero boilerplate** – the CLI generates everything, you just use the inject functions.

## Adding Dependencies

When you need to use a repo or service in your use-case, the CLI can add it:

```bash
pnpm devux
# Select "Modify Endpoint"
# Select the endpoint
# Select "Add Dependencies"
# Choose what to add
```

The CLI updates both your use-case file (adding the inject decorator and property) and the bindings file.

Or manually:

```typescript
// 1. Import the inject function
import { injectCalculatePricingService } from '@/__internals__/domains/...';

// 2. Add the property with decorator
@injectCalculatePricingService() private readonly pricingService!: ICalculatePricingService;

// 3. Update bindings (if not auto-wired)
```

## Interfaces

Devux generates interfaces for all components. You inject by interface, not by concrete class:

```typescript
@injectCreateCustomerRepo() private readonly repo!: ICreateCustomerRepo;
//                                                    ^ Interface, not class
```

This supports the dependency inversion principle and makes testing easier - you can mock the interface without touching the real implementation.
