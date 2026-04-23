import re
from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel, field_validator, model_validator

# 3 letras + 2 dígitos + 1 carácter alfanumérico opcional
PLATE_REGEX = re.compile(r"^[A-Z]{3}[0-9]{2}[A-Z0-9]?$")


def _validate_plate_format(plate: str) -> str:
    """Normaliza y valida el formato de una placa colombiana."""
    normalized = plate.strip().upper()
    if not PLATE_REGEX.match(normalized):
        raise ValueError(
            f"'{plate}' no es una placa válida. "
            "El formato esperado es 3 letras + 2 números + 1 "
            "alfanumérico opcional (ej: ABC12, ABC123)."
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

    @classmethod
    def from_dict(cls, data: dict) -> "FinesResponse":
        return cls(
            numero=str(data["numero"]),
            valor=float(data["valor"]),
            estado=str(data["estado"]),
            fecha=date.fromisoformat(str(data["fecha"])),
        )


class PlateResponse(BaseModel):
    placa: str
    tipoConsulta: str
    fechaConsulta: datetime
    estado: str
    cantidadMultas: int
    multas: List[FinesResponse] = []
    error: Optional[str] = None


class BulkRequest(BaseModel):
    placas: List[str]
    placas_invalidas: List[str] = []

    @field_validator("placas", mode="before")
    @classmethod
    def validate_plates(cls, v: List[str]) -> List[str]:
        if not v:
            raise ValueError("La lista de placas no puede estar vacía.")
        return v

    @model_validator(mode="after")
    def split_valid_invalid(self) -> "BulkRequest":
        validas = []
        invalidas = []
        for plate in self.placas:
            try:
                validas.append(_validate_plate_format(plate))
            except ValueError:
                invalidas.append(plate.strip().upper())
        self.placas = validas
        self.placas_invalidas = invalidas
        return self


class BulkResponse(BaseModel):
    total: int
    exitosas: int
    fallidas: int
    placas: List[PlateResponse]
    placas_invalidas: List[str] = []
