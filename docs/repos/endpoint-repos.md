# Endpoint Repos

Endpoint repos are data access layers specific to a single endpoint. For shared concepts like constraint handling and repo structure, see the [Repos Overview](/docs/repos/).

## When to Use

- Data operations unique to one endpoint
- Simple CRUD that isn't shared elsewhere
- Queries specific to a single use-case

## Creating

1. Run the CLI:
```bash
pnpm devux
```

2. Select **"Endpoints"** → **"Manage dependencies"**

3. Choose the target endpoint

4. Select **"Endpoint repos"** → **"Create"**

5. Enter repo details:
   - Repo name (kebab-case)
   - Operation type (read, write, delete)

::: info Note
When creating an endpoint, you're asked "Generate default repo?" - this creates a repo with the same name as the endpoint.
:::

## Location

```
domains/{domain}/endpoints/{endpoint}/repos/{repo}/
├── {repo}.repo.ts
├── {repo}.repo.zod.schemas.ts
└── tests/
    └── {repo}.repo.test.ts
```
