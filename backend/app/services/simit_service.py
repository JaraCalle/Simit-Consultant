from datetime import datetime

from app.integrations.simit_client import SIMITClient
from app.schemas.simit_schema import FinesResponse, PlateResponse


class SIMITService:

    async def consult_plate(self, plate: str) -> PlateResponse:
        client = SIMITClient()
        try:
            data = await client.consult(plate)

            multas_raw = data.get("multas") or []
            fines_number = len(multas_raw)
            status = "SIN_MULTAS" if fines_number == 0 else "CON_MULTAS"

            multas = [self._parse_fine(m) for m in multas_raw]

            return PlateResponse(
                placa=plate,
                fechaConsulta=datetime.now(),
                estado=status,
                cantidadMultas=fines_number,
                multas=multas,
            )

        except Exception as e:
            return PlateResponse(
                placa=plate,
                fechaConsulta=datetime.now(),
                estado="ERROR",
                cantidadMultas=0,
                multas=[],
                error=str(e),
            )

        finally:
            await client.close()

    def _parse_fine(self, fine: dict) -> FinesResponse:
        # Número identificador
        number = (
            fine.get("numeroComparendo")  # En comparendo activos
            or fine.get("numeroResolucion")  # En resoluciones
            or ""
        )

        # Valor a pagar
        value = float(fine.get("valorPagar") or 0)

        status = (
            fine.get("estadoComparendo")  # En comparendos activos
            or fine.get("estadoCartera")  # En resoluciones
            or "Desconocido"
        )

        # Fecha de la infracción
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
