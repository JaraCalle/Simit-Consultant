import uuid

from sqlalchemy import Column, DateTime, Integer, String
from sqlalchemy.dialects.postgresql import JSONB, UUID

from app.core.database import Base


# pylint: disable=too-few-public-methods
class Consultas(Base):
    __tablename__ = "Consultas"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    placa = Column(String(6), nullable=False)
    fecha = Column(DateTime(timezone=True), nullable=False)
    tipo = Column(String, nullable=False)
    estado = Column(String, nullable=False)
    respuesta_cruda = Column(JSONB, nullable=True)
    multas = Column(JSONB, nullable=True)
    cantidad_multas = Column(Integer, nullable=True)
    mensaje_error = Column(String, nullable=True)
