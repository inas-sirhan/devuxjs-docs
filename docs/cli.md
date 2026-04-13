---
description: "The Devux.js CLI — generate endpoints, services, repos, and manage dependencies from an interactive menu-driven interface."
---

# Using the CLI

The Devux CLI is your main tool for generating code and managing your project. It's an interactive menu-driven interface powered by [@clack/prompts](https://github.com/bombshell-dev/clack).

## Starting the CLI

```bash
pnpm devux
```

This opens the main menu where you select what you want to work with.

## Main Menu

```
What do you want to work with?
○ Domains
○ Endpoints
○ Domain Repos
○ Domain Services
○ App Services
○ Base Classes
○ List & Inspect
○ Visualize          (Open endpoints dependency graph in browser)
```

Press `Esc` at any submenu to go back.

## Domains

Create and manage domain folders (top-level business groupings).

```
Domains - What do you want to do?
○ Create
○ Rename     (currently disabled)
○ Delete
```

**Create** prompts for a kebab-case name and creates the domain folder structure.

**Delete** removes the domain and all its endpoints, repos, and services. It will warn you about what will be deleted.

## Endpoints

Create and manage API endpoints.

```
Endpoints - What do you want to do?
○ Create
○ Rename     (currently disabled)
○ Delete
○ Manage dependencies
```

### Creating an Endpoint

The CLI will prompt you for:

1. **Domain** – which domain this endpoint belongs to
2. **Endpoint ID** – unique identifier in kebab-case (e.g., `create-customer`)
3. **Route** – the HTTP path (e.g., `/customers`)
4. **HTTP Method** – GET, POST, PUT, PATCH, DELETE
5. **Transactional** – whether to use database transactions
6. **Create a repo** – optionally create an endpoint repo at the same time

Generated files:
- Use-case, controller, validator, presenter
- Route configuration
- Zod schemas (request/response)
- Test files
- Tester class

### Managing Dependencies

Add or remove dependencies (repos, services) to an endpoint:

```
Manage "create-customer" - What do you want to do?
○ Add dependency
○ Remove dependency
○ Add endpoint repo
○ Delete endpoint repo
```

**Add dependency** lets you add:
- Domain repos from any domain
- Domain services from any domain
- App services

**Add endpoint repo** creates a new repo specifically for this endpoint.

## Domain Repos

Repos shared across multiple endpoints within a domain.

```
Domain Repos - What do you want to do?
○ Create
○ Rename     (currently disabled)
○ Delete
○ Manage dependencies
```

### Creating a Domain Repo

Prompts for:
1. Domain selection
2. Repo name (kebab-case)

Creates the repo files, schemas, and tester.

## Domain Services

Shared business logic within a domain.

```
Domain Services - What do you want to do?
○ Create
○ Rename     (currently disabled)
○ Delete
○ Manage dependencies
○ Manage service repos
```

### Creating a Domain Service

Prompts for:
1. Domain selection
2. Service name (kebab-case)

Creates the service files, schemas, and tester.

### Service Repos

Domain services can have their own repos (service repos):

```
Manage "calculate-pricing" service repos - What do you want to do?
○ Add service repo
○ Delete service repo
```

## App Services

Application-wide services (cross-cutting concerns).

```
App Services - What do you want to do?
○ Create
○ Rename     (currently disabled)
○ Delete
○ Manage dependencies
```

### Creating an App Service

Prompts for:
1. Service name (kebab-case)
2. Scope - **Request scoped** or **Global**

See [App Services](/docs/services/app-services) for when to use each scope.

## Base Classes

Manage dependencies at the base class level - affecting all components of that type.

```
Base Classes - What do you want to do?
○ Add dependency
○ Remove dependency
```

This is useful when you want to add a dependency to all use-cases, all repos, or all services at once.

## List & Inspect

View your project's injectables and their dependencies.

```
List & Inspect - What do you want to do?
○ List all injectables
○ Inspect an injectable
```

**List all** shows all registered components grouped by type.

**Inspect** shows details about a specific injectable:
- Its dependencies
- What depends on it (dependents)
- Its type and domain

## Visualize

Opens an interactive HTML visualization of your endpoints and their dependencies in your browser.

See [Visualizer](/docs/visualizer) for more details.

## Other CLI Commands

Outside the interactive menu, you also have:

```bash
# Sync API client from OpenAPI spec
pnpm api:sync

# Sync translations
pnpm i18n:sync

# Open the visualizer directly
pnpm visualize
```

## Naming Conventions

All names must be in **kebab-case**:
- ✅ `create-customer`
- ✅ `order-management`
- ✅ `calculate-pricing`
- ❌ `createCustomer`
- ❌ `Create_Customer`

The CLI automatically converts to PascalCase for class names, camelCase for variables, etc.

## Error Recovery

If the CLI fails mid-operation, your working tree may be in an incomplete state. Reset with:

```bash
git restore . && git clean -fd
```

Then run the CLI again.
