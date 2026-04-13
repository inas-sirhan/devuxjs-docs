# Domain Services

Domain services are reusable orchestrators of business logic. They coordinate calls to repos and app services, encapsulating complex operations that are shared across multiple use-cases.

## When to Use

- Business logic shared between multiple endpoints in a domain
- Complex operations that involve multiple repos or app services
- Reusable domain-specific rules and calculations

## Rules

- **Always transactional** – domain services run within the transaction context of the calling use-case
- **Can use domain repos** – shared repos within the domain
- **Can have private repos** – domain service repos, specific to this service
- **Can use app services** – send an email, access user context, etc.
- **Can call other domain services** – but no circular dependencies allowed
- **No access to presenter** – only use-cases present responses
- **No access to commit/rollback** – use-cases control the transaction

Domain services use the [result pattern](/docs/result-pattern) to communicate success or failure. The calling use-case decides how to proceed (commit, rollback, etc.).

## Creating

1. Run the CLI:
```bash
pnpm devux
```

2. Select **"Domain Services"** → **"Create"**

3. Choose the target domain

4. Enter service name (kebab-case, e.g., `price-calculator`)

## Structure

```
domains/{domain}/services/{service}/
├── {service}.ts                    # Implementation
├── {service}.zod.schemas.ts        # Input/output schemas
├── repos/                          # Private repos (optional)
└── tests/
    └── {service}.test.ts
```

## Zod Schemas

Define input and output schemas in `{service}.zod.schemas.ts`:

```typescript
export const priceCalculatorInputZodSchema = zodStrictPick(ordersBaseZodSchema, {
    customerId: true,
    items: true,
});

export const priceCalculatorOutputZodSchema = zodResult({
    data: createZodObject({
        subtotal: z.number(),
        discount: z.number(),
        total: z.number(),
    }),
    errorCodes: [CustomersErrorCodes['CustomerNotFound']],
});
```

## Implementation

```typescript
@fullInjectable()
export class PriceCalculator extends DomainService<PriceCalculatorInput, PriceCalculatorOutput> implements IPriceCalculator {

    @injectGetCustomerDiscountRepo() private readonly getCustomerDiscountRepo!: IGetCustomerDiscountRepo;

    protected override async _execute(input: PriceCalculatorInput): Promise<PriceCalculatorOutput> {
        const discountResult = await this.getCustomerDiscountRepo.execute({
            customerId: input.customerId
        });

        if (discountResult.success === false) {
            if (discountResult.errorCode === CustomersErrorCodes['CustomerNotFound']) {
                return { success: false, errorCode: CustomersErrorCodes['CustomerNotFound'] };
            }
            assertNeverReached(discountResult.errorCode);
        }

        const subtotal = input.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        const discount = subtotal * discountResult.data.discountRate;

        return {
            success: true,
            data: {
                subtotal,
                discount,
                total: subtotal - discount,
            },
        };
    }

    protected override getServiceInputZodSchema() {
        return priceCalculatorInputZodSchema;
    }

    protected override getServiceOutputZodSchema() {
        return priceCalculatorOutputZodSchema;
    }
}
```

## Performance Threshold

Domain services have a default slow operation threshold (see [Core Config](/docs/core-config)). Override `getDurationThresholdMillis()` for operations that legitimately take longer:

```typescript
protected override getDurationThresholdMillis(): number {
    return 300; // Custom threshold for this service
}
```

## Adding Dependencies

To add repos or app services to a domain service:

1. Run **"Domain Services"** → **"Manage dependencies"**
2. Select the domain and service
3. Add the dependency

## Usage in Use-Case

```typescript
@fullInjectable()
export class CreateOrderUseCase extends TransactionalUseCase<CreateOrderRequest> {
    @injectCreateOrderPresenter() private readonly presenter!: ICreateOrderPresenter;
    @injectPriceCalculator() private readonly priceCalculator!: IPriceCalculator;
    @injectCreateOrderRepo() private readonly createOrderRepo!: ICreateOrderRepo;

    protected override async _execute(input: CreateOrderRequest): Promise<void> {
        const priceResult = await this.priceCalculator.execute({
            customerId: input.customerId,
            items: input.items,
        });

        if (priceResult.success === false) {
            if (priceResult.errorCode === CustomersErrorCodes['CustomerNotFound']) {
                await this.rollback();
                return this.presenter.present('CustomerNotFound');
            }
            assertNeverReached(priceResult.errorCode);
        }

        // Use-case handles commit/rollback, not the domain service
        const orderResult = await this.createOrderRepo.execute({
            customerId: input.customerId,
            total: priceResult.data.total,
        });

        // ...
    }
}
```
