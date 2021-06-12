from typing import Optional

from fastapi import FastAPI

import meross

app = FastAPI()


@app.on_event("startup")
async def startup_event():
    await meross.init()


@app.get("/status/{item_id}")
async def read_root(item_id: str):
    plug = meross.getPlugs(item_id)
    status = await meross.getStatus(plug)
    return {
        "plug": plug.name,
        "status":  status
    }


@app.post("/status/{item_id}")
async def read_item(item_id: str, status: bool):
    plug = meross.getPlugs(item_id)
    await meross.setStatus(plug, status)
    return {"item_id": item_id, "status": status}
