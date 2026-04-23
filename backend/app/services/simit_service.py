import asyncio
from datetime import datetime, timedelta, timezone
from typing import cast

from app.integrations.simit_client import SIMITClient
from app.models.consulta import Consultas
from app.repositories.consulta_repository import ConsultaRepository, ConsultaCreateDTO
from app.schemas.simit_schema import (
    BulkResponse,
    FinesResponse,
    PlateResponse,
)

COLOMBIA_TZ = timezone(timedelta(hours=-5))


class SIMITService:

    def __init__(self, db) -> None:
        self.repository = ConsultaRepository(db)

    # Consulta individual
    async def consult_plate(self, plate: str, is_bulk: bool = False) -> PlateResponse:
        client = SIMITClient()
        try:
            consult_data = await client.consult(plate)
            multas_raw = consult_data.get("multas") or []
            fines_number = len(multas_raw)
            fines = [self._parse_fine(m) for m in multas_raw]
            status = "EXITOSO"
            error = None
        except Exception as e:
            consult_data = None
            status = "ERROR"
            fines_number = 0
            fines = []
            error = str(e)
        finally:
            await client.close()

        consult = self.repository.create(ConsultaCreateDTO(
            plate=plate,
            tipo="MASIVA" if is_bulk else "INDIVIDUAL",
            status=status,
            data=consult_data,
            fines=[f.model_dump(mode="json") for f in fines],
            fines_number=fines_number,
            error=error,
        ))

        return self._to_response(consult)


    # Consulta masiva
    async def consult_bulk(self, plates: list[str], invalid_plates: list[str] = []) -> BulkResponse:
        results: list[PlateResponse] = list(await asyncio.gather(
            *[self.consult_plate(plate, is_bulk=True) for plate in plates]
        ))

        for plate in invalid_plates:
            results.append(PlateResponse(
                placa=plate,
                tipoConsulta="MASIVA",
                fechaConsulta=datetime.now(tz=COLOMBIA_TZ),
                estado="FORMATO_INVALIDO",
                cantidadMultas=0,
                multas=[],
                error=f"Formato de placa inválido. Se esperan 3 letras + 2 números + 1 alfanumérico opcional (ej: ABC12, ABC123)",
            ))

        successful = sum(1 for r in results if r.error is None)
        failed = len(results) - successful

        return BulkResponse(
            total=len(results),
            exitosas=successful,
            fallidas=failed,
            placas=results,
        )

    # Historico
    def get_all(self, skip: int = 0, limit: int = 100) -> list[PlateResponse]:
        consultas = self.repository.get_all(skip=skip, limit=limit)
        return [self._to_response(c) for c in consultas]

    def _to_response(self, consult: Consultas) -> PlateResponse:
        return PlateResponse(
            placa=str(consult.placa),
            tipoConsulta=str(consult.tipo),
            fechaConsulta=datetime.fromisoformat(str(consult.fecha)).astimezone(
                COLOMBIA_TZ
            ),
            estado=str(consult.estado),
            cantidadMultas=int(str(consult.cantidad_multas or 0)),
            multas=[
                FinesResponse.from_dict(m)
                for m in cast(list[dict], consult.multas or [])
            ],
            error=(
                str(consult.mensaje_error)
                if consult.mensaje_error is not None
                else None
            ),
        )

    def _parse_fine(self, fine: dict) -> FinesResponse:
        number = fine.get("numeroComparendo") or fine.get("numeroResolucion") or ""
        value = float(fine.get("valorPagar") or 0)
        status = (
            fine.get("estadoComparendo") or fine.get("estadoCartera") or "Desconocido"
        )
        raw_date = fine.get("fechaComparendo", "")
        try:
            date = datetime.strptime(raw_date.split(" ")[0], "%d/%m/%Y").date()
        except (ValueError, AttributeError):
            date = datetime.now().date()

        return FinesResponse(
            numero=number,
            valor=value,
            estado=status,
            fecha=date,
        )
