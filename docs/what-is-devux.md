---
title: Devux.js – Full-Stack TypeScript Framework for Node.js | Inas Sirhan
titleTemplate: false
---

# What is Devux?

Devux is an opinionated framework for Node.js and TypeScript, designed for building maintainable and highly testable full-stack web applications with type-safe RESTful APIs. It enforces clean architecture, provides end-to-end type safety, speeds up development, and improves developer experience.

<div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
  <div style="display: flex; align-items: center; gap: 8px;"><img src="/profpic.jpg" alt="Inas Sirhan" style="width: 64px; height: 64px; border-radius: 50%;"><span>Created by <a href="https://linkedin.com/in/inas-sirhan" target="_blank">Inas Sirhan</a></span></div>
  <span style="display: none; align-items: center; gap: 6px; opacity: 0.5; cursor: not-allowed;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="#FF0000"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg><span>See it in action (Coming Soon)</span></span>
  <a href="https://github.com/inas-sirhan/devuxjs" target="_blank" style="display: flex; align-items: center; gap: 6px; text-decoration: none;"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/></svg><span>View on GitHub</span></a>
</div>

## Key Features

- **End-to-end type safety** – A single source of truth for types across the stack, eliminating drift and type mismatches
- **Clean architecture** – Business logic remains pure and decoupled from HTTP, database, and other infrastructure concerns. Each layer is independently testable with mockable dependencies
- **CLI code generation** – Boilerplate, naming, wiring, and structure are generated automatically, keeping the focus on business logic rather than setup
- **Automatic validation** – Besides standard request validation, the framework validates inputs and outputs across managed layers (such as database I/O and API responses) during development, catching bugs that TypeScript can't
- **Dependency injection** – Declare and manage each layer's dependencies via the CLI. The framework handles all wiring and resolution
- **Powerful & type-safe testing** – Out-of-the-box support for unit, integration, and E2E tests. The framework generates ready-to-use test files and utilities specific to each endpoint and layer. Zero setup required, dependencies wired automatically, and mocking is fully type-safe. Focus solely on writing the actual test cases
- **Dependency visualization** – Auto-generated graphs showing each endpoint's dependencies across all its layers
- **Managed HTTP layer** – The framework manages the full request lifecycle: runs access control checks, parses body and query params, validates input, calls your use-case with typed data, and sends the response. Lifecycle hooks let you run logic at any point during the request, and built-in monitoring tracks request performance out of the box
- **Type-safe database queries** – Define your database schema in TypeScript, generate migrations from code, and write queries with full type inference
- **Transaction management** – Database transactions are automatically managed by the framework, giving database layers direct access to the transaction connection. Serialization and deadlock errors trigger automatic retries, and isolation level, access mode, and max retries are configurable per endpoint
- **Auto-generated OpenAPI spec** – API documentation generated from your request and response schemas, viewable in the browser
- **Auto-generated API clients** – Type-safe frontend clients generated from the OpenAPI spec. No manual code needed
- **Request context propagation** – Access request-scoped data (user ID, session, request ID) from anywhere in the flow. No manual passing required
- **Monorepo structure** – Share types, schemas, utilities, and any other code between frontend and backend. No code duplication
- **i18n support** – Generate translation files from error codes used in API responses

## Problems it Solves

- **Type drift** between frontend and backend – shared Zod schemas ensure consistency
- **Unhandled errors** – result pattern with exhaustive checking forces handling all cases
- **SQL injection** – type-safe query builders, no raw SQL
- **Forgetting validation** – automatic validation layer, impossible to skip
- **Transaction leaks** – framework manages commit/rollback, no forgotten open transactions
- **Tight coupling** – enforced dependency injection for testable code
- **Inconsistent code structure** – enforced clean architecture patterns
- **Boilerplate fatigue** – CLI generates all the repetitive code, no more copy-paste

## Who is it for?

Devux is for developers who want:
- Type safety from database to UI
- Full-stack TypeScript with zero drift between frontend and backend
- Clean architecture without the setup overhead
- Easily testable code with auto-generated [testers](/docs/testers) and type-safe mocking
- Dependency injection and IoC built-in
- Rapid development with code generation
- A smooth, frictionless developer experience
