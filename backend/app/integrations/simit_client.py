import asyncio
import hashlib
import json
import time
from typing import Union

import httpx

from app.core.config import settings
from app.utils import is_prime

BASE_HEADERS = {
    "User-Agent": "Mozilla/5.0",
    "Accept": "application/json, text/plain, */*",
    "Accept-Language": "es-CO,es;q=0.9,en;q=0.8",
    "Origin": "https://consultasimit.fcm.org.co",
    "Referer": "https://www.fcm.org.co/simit/estado-cuenta",
}


class SIMITClient:

    def __init__(self):
        self.client = httpx.AsyncClient(headers=BASE_HEADERS)

    async def close(self):
        await self.client.aclose()

    def _solve_pow(self, question: str, timestamp: int) -> dict[str, Union[str, int]]:
        nonce = 1
        while True:
            nonce += 1
            obj = {
                "question": question,
                "time": timestamp,
                "nonce": nonce,
            }
            payload = json.dumps(obj, separators=(",", ":"))
            digest = hashlib.sha256(payload.encode()).hexdigest()
            if digest.startswith("0000") and is_prime(nonce):
                return obj

    async def _get_challenge(self) -> tuple[str, int]:
        timestamp = int(time.time())

        resp = await self.client.post(
            settings.CAPTCHA_URL,
            data={"endpoint": "question"},
            timeout=10,
        )
        resp.raise_for_status()

        data = resp.json()
        return data["data"]["question"], timestamp

    async def _solve_captcha(self) -> dict[str, str]:
        loop = asyncio.get_event_loop()

        question, timestamp = await self._get_challenge()

        solution = await loop.run_in_executor(
            None, self._solve_pow, question, timestamp
        )

        return {
            "response": json.dumps([solution], separators=(",", ":")),
            "consumidor": "1",
        }

    async def consult(self, plate: str) -> dict:
        plate = plate.strip().upper()

        captcha = await self._solve_captcha()

        payload = {
            "filtro": plate,
            "reCaptchaDTO": captcha,
        }

        resp = await self.client.post(
            f"{settings.SIMIT_BASE}/consulta",
            json=payload,
            timeout=15,
        )

        resp.raise_for_status()
        return resp.json()
