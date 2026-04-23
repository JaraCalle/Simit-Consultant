from fastapi import APIRouter

from app.schemas.simit_schema import (
    PlateRequest,
    PlateResponse,
    BulkRequest,
    BulkResponse,
)
from app.services.simit_service import SIMITService

router = APIRouter(
    prefix="/simit",
    tags=["SIMIT"],
)

service = SIMITService()


@router.post(
    "/placa",
    response_model=PlateResponse,
    summary="Consultar una placa",
    description="Retorna el estado de multas de una placa individual.",
)
async def get_plate(body: PlateRequest) -> PlateResponse:
    return await service.consult_plate(body.placa)


@router.post(
    "/placas/bulk",
    response_model=BulkResponse,
    summary="Consultar múltiples placas en paralelo",
    description=(
        "Recibe una lista de placas y consulta todas en paralelo. "
        "Si una falla, retorna el error en ese item y continúa con las demás."
    ),
)
async def get_bulk_plates(body: BulkRequest) -> BulkResponse:
    return await service.consult_bulk(body.placas)