from functools import lru_cache

from pydantic import Field
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=False,
        extra="ignore",
    )

    project_name: str = "TransitOps"
    api_v1_prefix: str = "/api/v1"
    environment: str = Field(default="development", alias="ENVIRONMENT")
    debug: bool = False

    database_url: str = Field(
        default="postgresql+asyncpg://postgres:postgres@db:5432/transitops",
        alias="DATABASE_URL",
    )
    test_database_url: str = Field(
        default="sqlite+aiosqlite:///./transitops_test.db",
        alias="TEST_DATABASE_URL",
    )

    secret_key: str = Field(default="change-me", alias="SECRET_KEY")
    access_token_expire_minutes: int = 60
    refresh_token_expire_days: int = 7
    algorithm: str = "HS256"

    cors_origins: list[str] = ["*"]
    log_level: str = "INFO"


@lru_cache(maxsize=1)
def get_settings() -> Settings:
    return Settings()
