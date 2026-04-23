from datetime import datetime, timedelta, timezone
from typing import List, Union
from sqlalchemy.orm import Session
from app.models.consulta import Consultas

COLOMBIA_TZ = timezone(timedelta(hours=-5))


class ConsultaCreateDTO:
    def __init__(
        self,
        plate: str = "",
        tipo: str = "",
        status: str = "",
        data: Union[dict, None] = None,
        fines: Union[List[dict], None] = None,
        fines_number: Union[int, None] = None,
        error: Union[str, None] = None,
    ) -> None:
        self.plate = plate
        self.tipo = tipo
        self.status = status
        self.data = data
        self.fines = fines or []
        self.fines_number = fines_number
        self.error = error


class ConsultaRepository:

    def __init__(self, db: Session) -> None:
        self.db = db

    def get_all(self, skip: int = 0, limit: int = 100) -> List[Consultas]:
        return self.db.query(Consultas).offset(skip).limit(limit).all()

    def create(self, dto: ConsultaCreateDTO) -> Consultas:
        db_consult = Consultas(
            placa=dto.plate,
            fecha=datetime.now(COLOMBIA_TZ),
            tipo=dto.tipo,
            estado=dto.status,
            respuesta_cruda=dto.data,
            multas=dto.fines,
            cantidad_multas=dto.fines_number,
            mensaje_error=dto.error,
        )
        self.db.add(db_consult)
        self.db.commit()
        self.db.refresh(db_consult)
        return db_consult
