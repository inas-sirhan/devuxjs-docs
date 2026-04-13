# Scopes

Devux uses two types of scopes for dependency injection:

## Global

One instance (singleton) or a constant value shared across all requests.

## Request Scoped

New instance created per HTTP request.

## Examples

**Request scoped:**
- Use-cases
- All repo types
- Domain services
- Controllers, validators, presenters

**Global:**
- Database connection pool

::: info Note
Scopes become more relevant when working with [App Services](/docs/services/app-services), where you choose between global and request scoped based on your needs.
:::
