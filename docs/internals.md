---
description: "__internals__ in Devux.js — framework-managed code for DI bindings, tokens, and wiring that you don't need to touch."
---

# __internals__

The `__internals__` folder contains framework-managed code that you typically don't need to touch.

## Location

```
apps/backend/src/__internals__/
```

## What's Inside

- **Dependency injection setup** – Container bindings and injectable registrations
- **Route registrations** – Endpoint routing configuration
- **Generated presenters** – Auto-generated presenter classes
- **Generated validators** – Auto-generated validation classes
- **Generated controllers** – Auto-generated controller classes

## Why It Exists

The CLI generates these files to wire up your endpoints automatically. This keeps your domain code clean and focused on business logic.

## Should You Edit It?

Generally, no. The CLI manages these files when you:
- Create endpoints
- Add/remove dependencies
- Delete endpoints

If you need to customize framework behavior, check the docs for the appropriate extension points instead of modifying internals directly.

## Regenerating

If internals get out of sync, you can regenerate them using the CLI. The CLI reads your domain code and regenerates the wiring.
