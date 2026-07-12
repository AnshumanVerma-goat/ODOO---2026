# Transit

Transit is a full-stack monorepo with a FastAPI backend and a separate frontend workspace.

## Repository Tree

```text
/
├── backend/
│   ├── app/
│   ├── alembic/
│   ├── tests/
│   ├── Dockerfile
│   ├── alembic.ini
│   ├── pytest.ini
│   ├── requirements.txt
│   ├── .env.example
│   └── README.md
├── docker/
├── frontend/
├── docker-compose.yml
├── README.md
└── .gitignore
```

## Backend Setup

```bash
cd backend
pip install -r requirements.txt
copy .env.example .env
```

Update `backend/.env` with your local values before running the app.

## Run Locally

```bash
cd backend
python -m uvicorn app.main:app --reload
```

The API will be available at `http://127.0.0.1:8000`.

## Run With Docker

```bash
docker compose up --build
```

The backend runs on `http://localhost:8000` and PostgreSQL on `localhost:5432`.

## Database Migrations

```bash
cd backend
alembic upgrade head
```

If you change the schema, generate a new migration before upgrading again.

## API Docs

- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Testing

```bash
cd backend
python -m pytest
```

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

## Notes

- Default roles are seeded on application startup.
- All authenticated endpoints expect a JWT access token in the `Authorization: Bearer <token>` header.
- Trip and maintenance actions enforce the project business rules.
