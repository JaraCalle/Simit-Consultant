# External imports
import json
from pydantic import field_validator
from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    PROJECT_NAME: str = "Simit Consultant"
    VERSION: str = "0.1.0"
    API_STR: str = "/api"
    POSTGRES_URL: str = ""
    SIMIT_URL: str = ""

    BACKEND_CORS_ORIGINS: List[str] = ['["*"]']

    @field_validator("BACKEND_CORS_ORIGINS", mode="before")
    @classmethod
    def validate_cors_origins(cls, v):
        """Convierte string JSON a lista si es necesario"""
        if isinstance(v, list):
            return v
        try:
            return json.loads(v)
        except json.JSONDecodeError:
            return [item.strip() for item in v.split(",")]

    @property
    def cors_origins_list(self) -> List[str]:
        """Propiedad para obtener CORS como lista"""
        if isinstance(self.BACKEND_CORS_ORIGINS, list):
            return self.BACKEND_CORS_ORIGINS
        return [self.BACKEND_CORS_ORIGINS]

    class Config:  # pylint: disable=too-few-public-methods
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = True
        extra = "ignore"


settings = Settings()
