# MyPharmacy API Documentation

This directory contains the OpenAPI/Swagger documentation for the MyPharmacy API, organized following best practices.

## Structure

```
swagger/
├── openapi.yaml              # Main OpenAPI specification file
├── components/
│   ├── schemas/              # Data models and schemas
│   │   ├── users/            # User-related schemas
│   │   │   ├── index.yaml    # Index of user schemas
│   │   │   ├── user.yaml     # Base User schema
│   │   │   └── register.yaml # Registration-specific schemas
│   │   ├── errors.yaml       # Error response schemas
│   │   └── index.yaml        # Index of all schemas
│   └── responses/            # HTTP response definitions
│       ├── 400.yaml          # Bad Request responses
│       ├── 401.yaml          # Unauthorized responses
│       ├── 403.yaml          # Forbidden responses
│       ├── 404.yaml          # Not Found responses
│       ├── 409.yaml          # Conflict responses
│       ├── 429.yaml          # Too Many Requests responses
│       ├── 500.yaml          # Internal Server Error responses
│       └── index.yaml        # Index of all responses
└── paths/                    # API endpoint definitions
    └── auth/                 # Authentication endpoints
        └── register.yaml     # User registration endpoint
```

## Best Practices Applied

1. **Modular Structure**: Each schema and response is in its own file for better maintainability
2. **Logical Grouping**: Related schemas are grouped in folders (e.g., `users/`)
3. **Reusability**: Common schemas like `User` can be referenced from multiple places
4. **Index Files**: Each folder has an `index.yaml` for easy imports
5. **Clear Naming**: Files are named descriptively (e.g., `register.yaml`, `user.yaml`)

## Adding New Schemas

1. Create a new file in the appropriate schema folder
2. Define your schema following OpenAPI 3.0 specification
3. Add a reference to the new file in the folder's `index.yaml`
4. Use `$ref` to reference schemas in your API paths

## Adding New Endpoints

1. Create a new YAML file in the appropriate `paths/` subfolder
2. Define your endpoint following OpenAPI 3.0 specification
3. Reference existing schemas using `$ref`
4. Add the path reference to the main `openapi.yaml`

## Viewing Documentation

The Swagger UI is available at: `http://localhost:3000/api-docs`

## Current Coverage

- ✅ User Registration (`POST /api/users/register`)
- 🔄 User Login (planned)
- 🔄 User Logout (planned)
- 🔄 Current User (planned)
- 🔄 Token Refresh (planned)
- 🔄 Google OAuth (planned)
- 🔄 Avatar Update (planned)
