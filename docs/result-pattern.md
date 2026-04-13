# Result Pattern

The result pattern is a core concept used throughout Devux. Instead of throwing errors, operations return a discriminated union with `success` as the discriminator. This forces explicit handling of both success and error cases - you can't accidentally ignore errors.

## Why Use It?

- **Type safety** – TypeScript knows exactly what errors are possible
- **Explicit error handling** – can't forget to handle errors
- **No try/catch boilerplate** – errors are values, not exceptions
- **Exhaustive checking** – compiler ensures all cases are handled

## Result Utilities

### zodResult

Use when returning data with possible errors:

```typescript
const outputSchema = zodResult({
    data: zodStrictPick(customersBaseZodSchema, { name: true, phone: true }),
    errorCodes: [CustomersErrorCodes['CustomerNotFound']],
});

// Returns: { success: true, data: {...} } | { success: false, errorCode: 'customer_not_found' }
```

### zodResultNoData

Use for operations that don't return data but can still error (updates, deletes):

```typescript
const outputSchema = zodResultNoData({
    errorCodes: [
        CustomersErrorCodes['CustomerNotFound'],
        CustomersErrorCodes['CustomerNameAlreadyInUse'],
    ],
});

// Returns: { success: true } | { success: false, errorCode: 'customer_not_found' | 'customer_name_already_in_use' }
```

### zodResultNoError

Use when errors are impossible (e.g., list queries that always return something, even if empty):

```typescript
const outputSchema = zodResultNoError({
    data: createZodObject({ customers: z.array(...) }),
});

// Returns: { success: true, data: {...} } | { success: false, errorCode: never }
```

### zodResultVoid

Use when there's no data and no errors:

```typescript
const outputSchema = zodResultVoid();

// Returns: { success: true } | { success: false, errorCode: never }
```

## Handling Results

When you receive a result, check `success` first:

```typescript
const result = await this.getCustomerRepo.execute(input);

if (result.success === false) {
    if (result.errorCode === CustomersErrorCodes['CustomerNotFound']) {
        await this.rollback();
        return this.presenter.present('CustomerNotFound');
    }
    assertNeverReached(result.errorCode);
}

// Success - result.data is available here with full type safety
await this.commit();
return this.presenter.present('CustomerRetrieved', result.data);
```

## Exhaustive Error Handling

Use `assertNeverReached()` to ensure you handle every possible error code. If you miss one, TypeScript will error at compile time.

```typescript
const result = await this.getCustomerRepo.execute(input);

if (result.success === false) {
    if (result.errorCode === CustomersErrorCodes['CustomerNotFound']) {
        await this.rollback();
        return this.presenter.present('CustomerNotFound');
    }
    if (result.errorCode === CustomersErrorCodes['CustomerInactive']) {
        await this.rollback();
        return this.presenter.present('CustomerInactive');
    }
    // TypeScript error if there are unhandled error codes
    assertNeverReached(result.errorCode);
}
```

If you add a new error code to a repo or service but forget to handle it, TypeScript catches it at compile time.

## Where It's Used

- **[Repos](/docs/repos/)** – all repos return results
- **[Domain Services](/docs/services/domain-services)** – services return results to use-cases
