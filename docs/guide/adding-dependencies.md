---
description: "Guide — add dependencies in Devux.js by injecting services and repos into your use-cases via the CLI."
---

# Adding Dependencies

This guide shows you how to inject services and repos into your use-cases.

## Overview

Devux uses dependency injection (Inversify) to wire up your components. You don't instantiate classes manually - you declare what you need using inject decorators and the framework provides it.

## Adding a Repo to a Use-Case

### Steps

1. Run `pnpm devux`
2. Select "Endpoints"
3. Select "Manage dependencies"
4. Choose the endpoint
5. Select "Add dependency"
6. Choose the repo to inject

### Result

The CLI adds the inject decorator and property to your use-case:

```typescript
import { injectGetCustomerByEmailRepo } from '@/__internals__/domains/customers/repos/get-customer-by-email/get-customer-by-email.repo.inversify.tokens';

@fullInjectable()
export class CreateCustomerUseCase extends TransactionalUseCase<CreateCustomerRequest> {

    @injectGetCustomerByEmailRepo() private readonly getCustomerByEmailRepo!: IGetCustomerByEmailRepo;

    protected override async _execute(input: CreateCustomerRequest): Promise<void> {
        // Now you can use this.getCustomerByEmailRepo.execute(...)
    }
}
```

## Adding a Service to a Use-Case

### Steps

1. Run `pnpm devux`
2. Select "Endpoints"
3. Select "Manage dependencies"
4. Choose the endpoint
5. Select "Add dependency"
6. Choose the service to inject (domain service or app service)

### Result

```typescript
import { injectEmailService } from '@/__internals__/app-services/email-service/email-service.inversify.tokens';

@fullInjectable()
export class CreateCustomerUseCase extends TransactionalUseCase<CreateCustomerRequest> {

    @injectEmailService() private readonly emailService!: IEmailService;

    protected override async _execute(input: CreateCustomerRequest): Promise<void> {
        // Now you can use this.emailService
    }
}
```

## Multiple Dependencies

You can inject as many dependencies as needed:

```typescript
@fullInjectable()
export class CreateOrderUseCase extends TransactionalUseCase<CreateOrderRequest> {

    @injectCreateOrderRepo() private readonly createOrderRepo!: ICreateOrderRepo;
    @injectCalculatePricingService() private readonly pricingService!: ICalculatePricingService;
    @injectEmailService() private readonly emailService!: IEmailService;

    protected override async _execute(input: CreateOrderRequest): Promise<void> {
        const pricing = await this.pricingService.execute({ items: input.items });
        const order = await this.createOrderRepo.execute({ ...input, total: pricing.data.total });
        await this.emailService.sendOrderConfirmation(input.email, order.data);
    }
}
```

## Type Safety

All dependencies are type-safe:
- Inject functions are typed to their interface
- Import statements are added automatically
- The tester class is regenerated with the new dependency
