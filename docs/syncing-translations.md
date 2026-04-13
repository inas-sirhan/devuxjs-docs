---
description: "Syncing translations in Devux.js — generate i18n translation files from error codes used in API responses."
---

# Syncing Translations

Generate translation files from your error codes.

## Usage

```bash
pnpm sync:translations
```

This command:
1. Scans all error code files across domains
2. Validates error codes are unique
3. Generates translation files for each configured language

## When to Run

Run this command after:
- Adding new error codes to a domain
- Creating a new domain with error codes
- Adding shared error codes

## How it Works

The command scans:
- `packages/shared/src/shared-core/zod/validation.error-codes.ts` - validation errors
- `packages/shared/src/shared-app/shared.app.error-codes.ts` - shared app errors
- `packages/shared/src/shared-app/domains/{domain}/{domain}.error-codes.ts` - domain-specific errors

## Generated Output

Translation files are generated at:
```
packages/shared/src/translation/translations/{language}.translations.ts
```

Example output:
```typescript
export const enTranslations = {
    // Validation
    'validation_required': 'This field is required',
    'validation_too_short': 'Value is too short',

    // Customers
    'customer_not_found': 'Customer not found',
    'customer_already_exists': 'Customer already exists',
} as const;
```

## Adding Translations

After running the command:
1. Open the generated translation file
2. Fill in the translation values for each error code
3. Existing translations are preserved when regenerating
