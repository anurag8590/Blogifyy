from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database.database import create_table
from app.routes import blog,user




@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        print("Creating database tables...")
        await create_table()
        print("Database tables created successfully")
    except Exception as e:
        print(f"Error creating database tables: {e}")
        raise
    
    yield  
    print("Shutting down...")


app = FastAPI(
    title="Blogifyy",
    lifespan=lifespan
)


app.include_router(blog.router,tags=["blogs"])
app.include_router(user.router,tags=["User"])