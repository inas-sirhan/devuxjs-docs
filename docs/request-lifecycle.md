---
description: "Request lifecycle in Devux.js — how an HTTP request flows through the controller, validator, use-case, and presenter layers."
---

# Request Lifecycle

<!-- TODO: Add detailed diagrams -->

## Overview

When a request hits your Devux API, it flows through several layers in a specific order. Understanding this flow helps you know where to put your code.

## The Flow

```
HTTP Request
     │
     ▼
┌─────────────┐
│ Controller  │  ← Receives request, orchestrates flow
└─────────────┘
     │
     ▼
┌─────────────┐
│  Validator  │  ← Validates input (Zod schema)
└─────────────┘
     │
     ▼
┌─────────────┐
│  Use-Case   │  ← Business logic (calls repos/services)
└─────────────┘
     │
     ▼
┌─────────────┐
│  Presenter  │  ← Formats output for response
└─────────────┘
     │
     ▼
HTTP Response
```

## Step by Step

### 1. Controller

- Receives the HTTP request
- Extracts data from request (body, params, query)
- Calls the validator
- Calls the use-case
- Calls the presenter
- Sends the response

### 2. Validator

- Receives raw input data
- Validates against Zod schema
- Returns typed, validated data
- Throws validation error if invalid

### 3. Use-Case

- Receives validated input
- Executes business logic
- Calls repos for data access
- Calls services for additional operations
- Returns result (or throws business error)

### 4. Presenter

- Receives use-case output
- Transforms to response format
- Handles success/error formatting
- Returns final response body

## Error Handling

Errors at any layer bubble up and are caught by the controller, which formats them appropriately:

- **Validation errors** → 400 Bad Request
- **Business errors** → 4xx (depends on error type)
- **Unexpected errors** → 500 Internal Server Error

## Transaction Boundaries

The use-case is wrapped in a database transaction. If the use-case throws, all database operations are rolled back automatically.
