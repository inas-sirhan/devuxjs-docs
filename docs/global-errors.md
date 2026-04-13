# Global Errors

Devux provides a set of global API errors that are automatically handled by the framework. These are defined in the shared package and available to both frontend and backend.

## Core Errors

These errors are built into the framework and should not be modified.

### Validation

Thrown automatically when request validation fails against the endpoint's Zod schema.

| Error | Status | Description |
|-------|--------|-------------|
| `ValidationError` | 422 | Request validation failed. Includes `validationErrors` array with field-level details. |

### File Upload

Thrown automatically when file upload constraints are violated.

| Error | Status | Description |
|-------|--------|-------------|
| `FileUploadExceededPartCount` | 400 | Too many parts in multipart request. |
| `FileUploadExceededMaxFileSize` | 413 | File exceeds maximum allowed size. |
| `FileUploadExceededMaxFilesCount` | 400 | Too many files uploaded. |
| `FileUploadExceededFieldNameMaxSize` | 400 | Field name too long. |
| `FileUploadExceededFieldValueMaxSize` | 400 | Field value too long. |
| `FileUploadExceededMaxFieldsCount` | 400 | Too many fields in request. |
| `FileUploadUnexpectedFile` | 400 | Unexpected file field in request. |
| `FileUploadInvalidFileType` | 415 | File type not allowed. |

### Unexpected

Thrown when an unhandled error occurs.

| Error | Status | Description |
|-------|--------|-------------|
| `UnexpectedError` | 500 | An unexpected server error occurred. |

## Adding Custom Errors

Add your own global errors in `packages/shared/src/shared-app/api-errors/api-errors.ts`. Use `defineApiError` to define new errors:

```typescript
export const ApiErrors = {
    ...CoreApiErrors,

    // Add your custom errors here

    NotAuthenticated: defineApiError({
        statusCode: 401,
        errorType: 'authentication',
        errorCode: 'not_authenticated',
    }),

    NotAuthorized: defineApiError({
        statusCode: 403,
        errorType: 'authorization',
        errorCode: 'not_authorized',
    }),

    RateLimitExceeded: defineApiError({
        statusCode: 429,
        errorType: 'rate_limit',
        errorCode: 'rate_limit_exceeded',
    }),
} as const;
```

**Usage:**

```typescript
ApiErrors['NotAuthenticated'].throw(); // throws
const error = ApiErrors['NotAuthorized'].create(); // creates instance
```

All global API errors extend the `ApiError` class. Use `instanceof` and `errorType` to check for specific errors:

```typescript
if (error instanceof ApiError && error.errorType === 'authentication') {
    // handle authentication error
}
```

Each `ApiError` has `statusCode` and `body` properties for sending HTTP responses:

```typescript
if (error instanceof ApiError) {
    res.status(error.statusCode).json(error.body);
}
```

## Frontend Type Guards

The shared package exports helper functions for type-safe error handling.

### isApiError

Check if an axios error is a known API error:

```typescript
import { isApiError } from '@shared/api-errors';

try {
  await axios.post('/api/login', credentials);
} catch (error) {
  if (isApiError(error)) {
    // error.response.data is typed as ApiErrorPayload
    console.log(error.response.data.errorCode);
  }
}
```

### isErrorCode / isErrorType

Check for specific error codes or types:

```typescript
import { isErrorCode, isErrorType } from '@shared/api-errors';

try {
  await axios.post('/api/cities', data);
} catch (error) {
  if (isErrorCode(error, 'not_authenticated')) {
    navigate('/login');
    return;
  }

  if (isErrorType(error, 'validation')) {
    showValidationErrors(error);
    return;
  }
}
```

### getApiErrorData

Safely extract error data:

```typescript
import { getApiErrorData } from '@shared/api-errors';

const errorData = getApiErrorData(error);
if (errorData) {
  showToast(`Error: ${errorData.errorCode}`);
}
```

## Global Axios Interceptor

Handle global errors centrally using an interceptor with your state management (Zustand, Redux, etc.):

```typescript
import { isApiError } from '@shared/api-errors';
import { useErrorStore } from './stores/error-store';

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (isApiError(error)) {
      useErrorStore.getState().setError(error.response.data);
    }
    return Promise.reject(error);
  }
);
```

Components can then react to the error state and show modals, redirect, etc.

## React Query Integration

```typescript
import { useQuery } from '@tanstack/react-query';
import { isApiError, isErrorCode } from '@shared/api-errors';

function CitiesPage() {
  const { data, error, isLoading } = useQuery({
    queryKey: ['cities'],
    queryFn: () => axios.get('/api/cities').then(res => res.data),
  });

  if (error) {
    if (isErrorCode(error, 'not_authenticated')) {
      return <RedirectToLogin />;
    }
    return <ErrorMessage>Something went wrong</ErrorMessage>;
  }

  return <CitiesList cities={data} />;
}
```
