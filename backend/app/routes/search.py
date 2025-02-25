from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from app.database.database import get_db
from app.dao.dao_blog import BlogSearchDAO

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/blogs")
async def search_blogs( q: str = Query(..., description="Search query"), db: AsyncSession = Depends(get_db)):

    search_dao = BlogSearchDAO(db)
    return await search_dao.search_blogs(
        search_query=q
    )