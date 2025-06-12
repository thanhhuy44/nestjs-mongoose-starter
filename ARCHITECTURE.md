# Clean Architecture Overview

## Architecture Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     Presentation Layer                       │
│                  (Controllers, Guards, Pipes)                │
├─────────────────────────────────────────────────────────────┤
│                     Application Layer                        │
│                   (Services, Use Cases)                      │
├─────────────────────────────────────────────────────────────┤
│                      Domain Layer                            │
│                  (Entities, Interfaces)                      │
├─────────────────────────────────────────────────────────────┤
│                  Infrastructure Layer                        │
│              (Repositories, External Services)               │
└─────────────────────────────────────────────────────────────┘
```

## Request Flow

```
Client Request
    │
    ▼
┌─────────────────┐
│   Middleware    │ (CORS, Auth, etc.)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Guards      │ (Authentication, Authorization)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Interceptors   │ (Logging, Transform)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│     Pipes       │ (Validation, Transform)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Controller    │ (HTTP Layer)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Service      │ (Business Logic)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Repository    │ (Data Access)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│    Database     │ (MongoDB)
└─────────────────┘
```

## Module Structure

```
users/
├── controllers/
│   └── users.controller.ts       # HTTP endpoints
├── services/
│   └── users.service.ts          # Business logic
├── repositories/
│   └── users.repository.ts       # Data access
├── entities/
│   └── user.entity.ts            # Domain model
├── dto/
│   ├── create-user.dto.ts        # Input validation
│   ├── update-user.dto.ts        # Input validation
│   └── user-response.dto.ts     # Output formatting
└── users.module.ts               # Module definition
```

## Dependency Direction

```
Controller ──depends on──> Service Interface
    │                          │
    │                          ▼
    │                      Service ──depends on──> Repository Interface
    │                          │                          │
    │                          │                          ▼
    └──────── uses ───────> DTOs                   Repository
                               │                          │
                               │                          ▼
                               └────── maps to ────> Entity
```

## Key Principles

1. **Dependency Inversion**: High-level modules don't depend on low-level modules
2. **Single Responsibility**: Each class has one reason to change
3. **Interface Segregation**: Clients shouldn't depend on interfaces they don't use
4. **Open/Closed**: Open for extension, closed for modification

## Benefits

- **Testability**: Easy to mock dependencies
- **Maintainability**: Clear separation of concerns
- **Scalability**: Easy to add new features
- **Flexibility**: Easy to change implementations