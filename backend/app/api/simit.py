from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.schemas.simit_schema import (
    BulkRequest,
    BulkResponse,
    PlateRequest,
    PlateResponse,
)
from app.services.simit_service import SIMITService

router = APIRouter(
    prefix="/consultas",
    tags=["Consultas"],
)


@router.post(
    "",
    response_model=PlateResponse,
    status_code=201,
    summary="Crear una consulta individual",
    description="Consulta el estado de multas de una placa y persiste el resultado.",
)
async def create_consulta(
    body: PlateRequest,
    db: Session = Depends(get_db),
) -> PlateResponse:
    return await SIMITService(db).consult_plate(body.placa)


@router.post(
    "/bulk",
    response_model=BulkResponse,
    status_code=201,
    summary="Crear consultas masivas en paralelo",
    description=(
        "Consulta múltiples placas en paralelo. "
        "Si una falla, retorna el error en ese item y continúa con las demás."
    ),
)
async def create_consultas_bulk(
    body: BulkRequest,
    db: Session = Depends(get_db),
) -> BulkResponse:
    return await SIMITService(db).consult_bulk(body.placas)


@router.get(
    "",
    response_model=list[PlateResponse],
    summary="Listar historial de consultas",
    description="Retorna todas las consultas históricas realizadas con paginación.",
)
def get_consultas(
    skip: int = 0,
    limit: int = 100,
    db: Session = Depends(get_db),
) -> list[PlateResponse]:
    return SIMITService(db).get_all(skip=skip, limit=limit)
