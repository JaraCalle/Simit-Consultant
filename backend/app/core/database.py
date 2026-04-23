from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from sqlalchemy.exc import OperationalError, SQLAlchemyError
from fastapi import HTTPException
from app.core.config import settings

try:
    engine = create_engine(settings.POSTGRES_URL, pool_pre_ping=True)
except OperationalError as e:
    raise RuntimeError(f"No se pudo conectar a la base de datos: {e}")

SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    except OperationalError:
        raise HTTPException(
            status_code=503,
            detail="Base de datos no disponible. Intenta más tarde.",
        )
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error interno de base de datos: {e}",
        )
    finally:
        db.close()
