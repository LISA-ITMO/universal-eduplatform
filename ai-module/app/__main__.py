from fastapi import FastAPI
from app.routes.theme import router as theme_router
from app.routes.test import router as test_router
from app.config import db
from app.models.theme import Theme

def create_tables():
    db.connect(reuse_if_open=True)
    db.create_tables([Theme])
    db.close()

app = FastAPI()

# Include theme routes
app.include_router(theme_router, prefix="/theme", tags=["theme"])
# Include test routes
app.include_router(test_router, prefix="/tests", tags=["tests"])

create_tables()

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        app,
        host="0.0.0.0",
        port=8000,
    )