import asyncio
import os
from decouple import config

from meross_iot.http_api import MerossHttpClient
from meross_iot.manager import MerossManager

EMAIL = config('MEROSS_EMAIL')
PASSWORD = config('MEROSS_PASSWORD')


def getPlugs(uuid):
    for i in plugs:
        # print(f"plugs[{i}] uuid:{i.uuid}")
        if i.uuid == uuid:
            return i


async def getStatus(plug):
    return{
        "status": plug.is_on(channel=0),
        "powerInfo": await plug.async_get_instant_metrics(channel=0)
    }


async def setStatus(plug, status):
    if status:
        await plug.async_turn_on(channel=0)
    else:
        await plug.async_turn_off(channel=0)
    return


async def init():
    global plugs
    # Setup the HTTP client API from user-password
    http_api_client = await MerossHttpClient.async_from_user_password(email=EMAIL, password=PASSWORD)

    # Setup and start the device manager
    manager = MerossManager(http_client=http_api_client)
    await manager.async_init()

    # Retrieve all the MSS310 devices that are registered on this account
    await manager.async_device_discovery()
    plugs = manager.find_devices(device_type="mss310")
