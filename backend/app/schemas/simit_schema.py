from datetime import date, datetime
from typing import List, Optional

from pydantic import BaseModel


class PlateRequest(BaseModel):
    placa: str


class FinesResponse(BaseModel):
    numero: str
    valor: float
    estado: str
    fecha: date


class PlateResponse(BaseModel):
    placa: str
    fechaConsulta: datetime
    estado: str
    cantidadMultas: float
    multas: List[FinesResponse] = []
    error: Optional[str] = None


class BulkRequest(BaseModel):
    placas: List[str]


class BulkResponse(BaseModel):
    placas: List[PlateResponse]
