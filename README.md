<<<<<<< HEAD
# TransitOps Backend

TransitOps is a production-oriented transport management backend built with FastAPI, SQLAlchemy 2.0, PostgreSQL, Alembic, and JWT authentication.

## Tech Stack

- Python 3.12
- FastAPI
- SQLAlchemy 2.0 ORM
- Alembic
- PostgreSQL
- Pydantic v2
- JWT authentication
- Passlib + bcrypt
- Docker and Docker Compose
- Pytest

## Features

- JWT access and refresh token authentication
- Role-based access control
- Vehicle, driver, trip, maintenance, fuel log, and expense management
- Trip dispatch, completion, and cancellation workflows
- Maintenance-driven vehicle status transitions
- Dashboard KPIs and analytics reports
- Async database access
- Repository and service layers
- Global exception handling
- Pagination, search, filtering, and sorting
- Alembic migrations
- Dockerized deployment

## Folder Structure

- `app/main.py` - FastAPI app factory and router registration
- `app/config/` - settings and logging configuration
- `app/database/` - async engine, session, and declarative base
- `app/models/` - SQLAlchemy ORM models
- `app/schemas/` - Pydantic request and response models
- `app/crud/` - repository layer
- `app/services/` - business logic and domain rules
- `app/routers/` - API endpoints
- `app/middleware/` - exception handling and request logging
- `app/auth/` - password hashing, token helpers, and auth dependencies
- `app/utils/` - shared helpers
- `app/core/` - enums, exceptions, seed data, and response models
- `tests/` - pytest suite
- `alembic/` - migration environment and revisions
- `docker/` - container entrypoint scripts

## Installation

1. Create and activate a Python 3.12 virtual environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Copy the example environment file:

```bash
copy .env.example .env
```

4. Update `.env` with your PostgreSQL credentials and secret key.

## Running Locally

Start the API:

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Running With Docker

Start PostgreSQL and the API:

```bash
docker compose up --build
```

The backend will run on `http://localhost:8000` and PostgreSQL on `localhost:5432`.

## Database Migration

Create and apply migrations:

```bash
alembic upgrade head
```

If you change the schema, generate a new migration and then upgrade again.

## API Documentation

FastAPI generates documentation automatically:

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Environment Variables

- `ENVIRONMENT` - runtime environment name
- `DEBUG` - enables debug mode
- `DATABASE_URL` - async PostgreSQL connection string
- `TEST_DATABASE_URL` - async test database connection string
- `SECRET_KEY` - JWT signing key
- `ACCESS_TOKEN_EXPIRE_MINUTES` - access token lifetime
- `REFRESH_TOKEN_EXPIRE_DAYS` - refresh token lifetime
- `CORS_ORIGINS` - allowed CORS origins
- `LOG_LEVEL` - application log level

## Coding Standards

- Follow PEP 8.
- Use SQLAlchemy 2.0 style ORM.
- Keep routes thin and move business logic into services.
- Use repository classes for database access.
- Prefer async APIs end to end.
- Validate input with Pydantic schemas.
- Return structured API responses.
- Avoid duplicated logic by sharing helpers in `core/` and `utils/`.
- Keep error handling centralized in the global exception handler.

## Testing

Run the test suite:

```bash
pytest
```

The current suite covers:

- Authentication
- Vehicle CRUD
- Driver CRUD
- Trip validations and transitions
- Maintenance transitions
- Dashboard KPIs

## Notes

- Default roles are seeded on application startup.
- All authenticated endpoints expect a JWT access token in the `Authorization: Bearer <token>` header.
- Trip and maintenance actions enforce the business rules documented in the project requirements.
=======
# ODOO---2026
>>>>>>> c3ba20f6ff4f86db249ab71f05be2297706495a0
