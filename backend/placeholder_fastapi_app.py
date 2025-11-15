from fastapi import FastAPI

app = FastAPI()

@app.get("/health")
def read_health():
    """
    A simple health check endpoint.
    """
    return {"status": "ok"}