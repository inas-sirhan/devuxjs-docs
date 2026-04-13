---
description: "Dependency visualizer in Devux.js — interactive graph of all endpoints and their dependencies, filterable by domain and method."
---

# Visualizer

Devux includes a built-in dependency visualizer that generates an interactive HTML page showing your endpoints and their dependencies.

## Running the Visualizer

```bash
pnpm visualize
```

Or through the CLI:
```bash
pnpm devux
# Select "Visualize"
```

This generates a `visualization.html` file and opens it in your browser.

## Features

### Dependency Graphs

Each endpoint shows a flowchart of its dependencies - from the use-case down to repos, domain services, and app services. You can see at a glance what each endpoint depends on.

### Filtering

- **By domain** – focus on a specific domain
- **By endpoint** – view a single endpoint
- **By HTTP method** – show only GET, POST, etc.

### Toggle Options

- **Show Core** – include/exclude core services from the graph
- **Show CVP** – show Controller, Validator, and Presenter nodes
- **Show Scope** – display `[g]` (global) or `[r]` (request-scoped) for app/core services

### Visual Indicators

**Badges:**
- HTTP method (GET, POST, etc.)
- Transactional / Non-transactional
- File upload endpoints

**Colors:**
- Blue - Use-Case
- Orange - Endpoint Repo
- Pink - Domain Repo
- Green - Domain Service
- Yellow - App Service
- Gray - Core Service

**Arrows:**
- Solid line - direct dependency
- Dashed line - inherited from base class
