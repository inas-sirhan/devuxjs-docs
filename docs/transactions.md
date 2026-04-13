# Transaction Management

Devux handles database transactions automatically when you use `TransactionalUseCase`. Transactions are scoped to the use-case - all database operations within a use-case share the same transaction connection, and the framework handles commit, rollback, and retries.

## Transactional vs Non-Transactional

When creating an endpoint, you choose whether it needs a transaction:

**TransactionalUseCase** – for endpoints that modify data. All repos in the use-case share the same transaction.

**NonTransactionalUseCase** – for read-only endpoints or those that don't need transactional guarantees.

```typescript
// Transactional - all operations are atomic
@fullInjectable()
export class TransferFundsUseCase extends TransactionalUseCase<TransferFundsRequest> {
    protected override async _execute(input: TransferFundsRequest): Promise<void> {
        await this.debitRepo.execute({ accountId: input.fromId, amount: input.amount });
        await this.creditRepo.execute({ accountId: input.toId, amount: input.amount });
        // Both succeed or both fail
        await this.commit();
    }
}
```

## Isolation Levels

You must specify the isolation level by overriding `getIsolationLevel()`:

| Level | Description |
|-------|-------------|
| `read-committed` | Default. Sees only committed data. Best for most operations. |
| `repeatable-read` | Same reads return same results within the transaction. Use when you read a value and make decisions based on it. |
| `serializable` | Strongest guarantee. Transactions execute as if they were serial. Use for financial operations or when absolute consistency is required. |

```typescript
protected override getIsolationLevel(): TransactionIsolationLevel {
    return 'read-committed';
}
```

## Access Modes

You must specify the access mode by overriding `getAccessMode()`:

| Mode | Description |
|------|-------------|
| `read-only` | Transaction will only read data. Database can optimize. |
| `read-write` | Transaction will modify data. |

```typescript
protected override getAccessMode(): TransactionAccessMode {
    return 'read-write';
}
```

## Commit and Rollback

You must explicitly commit or rollback before your use-case completes:

```typescript
protected override async _execute(input: CreateOrderRequest): Promise<void> {
    const result = await this.createOrderRepo.execute(input);

    if (result.success === false) {
        if (result.errorCode === OrdersErrorCodes['OutOfStock']) {
            await this.rollback();
            return this.presenter.present('OutOfStock');
        }
        assertNeverReached(result.errorCode);
    }

    await this.commit();
    return this.presenter.present('OrderCreated', result.data);
}
```

If your use-case completes without committing or rolling back, the framework automatically rolls back and throws an error. This prevents accidental partial commits.

## Automatic Retry

Devux automatically retries transactions on deadlock or serialization errors. This is common in high-concurrency scenarios where two transactions conflict.

### How Retries Work

1. Transaction starts
2. Your code executes
3. If a deadlock or serialization error occurs:
   - The transaction is rolled back
   - A delay is applied (exponential backoff with jitter)
   - The entire operation is retried
4. If max attempts are reached, an error is thrown

### Retry Configuration

Override these methods in your use-case to customize retry behavior:

```typescript
protected override getTransactionMaxAttempts(): number {
    return 5; // Default from coreConfig.transactionMaxAttempts
}

protected override getTransactionBaseDelayMillis(): number {
    return 50; // Default from coreConfig.baseDelayBetweenTransactionRetriesMillis
}
```

The actual delay uses exponential backoff with jitter:
```
delay = baseDelay * 2^(attempt-1) + random(0, baseDelay)
```

For example, with base delay of 50ms:
- Attempt 2: ~50-100ms
- Attempt 3: ~100-150ms
- Attempt 4: ~200-250ms
- Attempt 5: ~400-450ms

## Shared Transaction Connection

All repos in a transactional use-case share the same transaction connection through `this.trx`:

```typescript
// In your repo
protected override async _execute(input: CreateOrderRepoInput): Promise<CreateOrderRepoOutput> {
    const order = await this.trx  // <-- Transaction connection
        .insertInto('orders')
        .values(input)
        .returningAll()
        .executeTakeFirstOrThrow();

    return { success: true, data: order };
}
```

This ensures all operations are part of the same transaction - if any repo operation fails, they all roll back together.

## Error Handling

Devux detects and handles specific PostgreSQL errors:

| Error | Code | Behavior |
|-------|------|----------|
| Serialization failure | 40001 | Automatic retry |
| Deadlock detected | 40P01 | Automatic retry |
| Unique violation | 23505 | No retry, mapped to error code via `getUniqueKeyViolationErrorMap()` |
| Foreign key violation | 23503 | No retry, mapped to error code via `getForeignKeyViolationErrorMap()` |

Serialization and deadlock errors trigger retries. Constraint violations are handled by your error code mappings in repos (see [Repos](/docs/repos/)).

## Core Hooks

The framework calls [Core Hooks](/docs/core-hooks) to let you monitor transaction errors:

- `onTransactionStartError` - failed to start transaction
- `onSerializationError` - serialization failure (will retry)
- `onDeadlockError` - deadlock detected (will retry)
- `onSafeRollbackError` - rollback failed during error recovery

Use these hooks for logging and monitoring.

## RLS and Session Variables

Override `onTransactionStarted()` in your `DatabaseTransactionManager` to set Row-Level Security policies or session variables:

```typescript
// In infrastructure/core/database/database-transaction-manager.ts
protected override async onTransactionStarted(): Promise<void> {
    // Set RLS variables for multi-tenancy
    await this.connection
        .executeQuery(sql`SET app.tenant_id = ${this.requestContext.tenantId}`.compile(this.connection));
}
```

This runs after the transaction starts but before your use-case code executes.
