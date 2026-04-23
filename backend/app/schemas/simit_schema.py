import re
from datetime import datetime, date
from pydantic import BaseModel, field_validator
from typing import List, Optional

# 3 letras + 2 dígitos + 1 carácter alfanumérico opcional
PLATE_REGEX = re.compile(r"^[A-Z]{3}[0-9]{2}[A-Z0-9]?$")


def _validate_plate_format(plate: str) -> str:
    """Normaliza y valida el formato de una placa colombiana."""
    normalized = plate.strip().upper()
    if not PLATE_REGEX.match(normalized):
        raise ValueError(
            f"'{plate}' no es una placa válida. "
            "El formato esperado es 3 letras + 2 números + 1 alfanumérico opcional (ej: ABC12, ABC123)."
        )
    return normalized


class PlateRequest(BaseModel):
    placa: str

    @field_validator("placa")
    @classmethod
    def validate_plate(cls, v: str) -> str:
        return _validate_plate_format(v)


class FinesResponse(BaseModel):
    numero: str
    valor: float
    estado: str
    fecha: date


class PlateResponse(BaseModel):
    placa: str
    fechaConsulta: datetime
    estado: str
    cantidadMultas: int
    multas: List[FinesResponse] = []
    error: Optional[str] = None


class BulkRequest(BaseModel):
    placas: List[str]

    @field_validator("placas")
    @classmethod
    def validate_plates(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("La lista de placas no puede estar vacía.")

        validated = []
        errors = []
        for plate in v:
            try:
                validated.append(_validate_plate_format(plate))
            except ValueError as e:
                errors.append(str(e))

        if errors:
            raise ValueError(f"Placas inválidas: {'; '.join(errors)}")

        return validated


class BulkResponse(BaseModel):
    total: int
    exitosas: int
    fallidas: int
    placas: List[PlateResponse]