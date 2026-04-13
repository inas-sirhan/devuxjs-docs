# Core Hooks

Core Hooks are lifecycle callbacks that let you react to framework events. Use them for logging, monitoring, alerting, or custom error handling.

## Setup

Implement the `ICoreHooks` interface in `apps/backend/src/infrastructure/core/core-hooks.ts`:

```typescript
import type { ICoreHooks } from '@/core/core-injectables/core-hooks/core-hooks.interface';

export class CoreHooks implements ICoreHooks {

    public onSerializationError(context: SerializationErrorContext): void {
        // Log serialization conflicts
    }

    public onDeadlockError(context: DeadlockErrorContext): void {
        // Log database deadlocks
    }

    public onTransactionStartError(context: TransactionStartErrorContext): void {
        // Log transaction failures
    }

    public onSafeRollbackError(context: SafeRollbackErrorContext): void {
        // Log rollback failures
    }

    public onSlowUseCase(context: SlowUseCaseContext): void {
        // Alert on slow use-cases
    }

    public onSlowRepo(context: SlowRepoContext): void {
        // Alert on slow repos
    }

    public onSlowDomainService(context: SlowDomainServiceContext): void {
        // Alert on slow domain services
    }

    public onValidationError(context: ValidationErrorContext): void {
        // Log validation failures
    }
}
```

## Available Hooks

### Error Hooks

| Hook | When it fires |
|------|---------------|
| `onSerializationError` | Transaction serialization conflict (retryable) |
| `onDeadlockError` | Database deadlock detected (retryable) |
| `onTransactionStartError` | Failed to start a transaction |
| `onSafeRollbackError` | Rollback failed |
| `onValidationError` | Request validation failed |

Error hooks receive context including the request, error details, and retry information (attempt number, max attempts).

### Performance Hooks

| Hook | When it fires |
|------|---------------|
| `onSlowUseCase` | Use-case execution exceeded threshold |
| `onSlowRepo` | Repo execution exceeded threshold |
| `onSlowDomainService` | Domain service execution exceeded threshold |

Performance hooks receive context including execution time and the configured threshold.

## Example: Logging

```typescript
public onSlowRepo(context: SlowRepoContext): void {
    console.warn(
        `Slow repo: ${context.repoName} took ${context.executionTimeMillis}ms ` +
        `(threshold: ${context.durationThresholdMillis}ms)`
    );
}

public onDeadlockError(context: DeadlockErrorContext): void {
    console.error(
        `Deadlock detected (attempt ${context.attemptNumber}/${context.maxAttempts}):`,
        context.error
    );
}
```
