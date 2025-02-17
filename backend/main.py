from fastapi import FastAPI
from contextlib import asynccontextmanager
from app.database.database import create_table
from app.routes import blog,user,comments,category,search
from fastapi.middleware.cors import CORSMiddleware



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

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(blog.router)
app.include_router(user.router)
app.include_router(comments.router)
app.include_router(search.router)
app.include_router(category.router)