from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Optional
from database import get_db
from .dao import BlogSearchDAO

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/blogs")
async def search_blogs(
    q: str = Query(..., description="Search query"),
    category_id: Optional[int] = Query(None, description="Category ID filter"),
    page: int = Query(1, ge=1, description="Page number"),
    page_size: int = Query(10, ge=1, le=100, description="Items per page"),
    db: AsyncSession = Depends(get_db)
):
    """
    Search blogs by title, content, or category.
    Supports multi-word search and pagination.
    """
    search_dao = BlogSearchDAO(db)
    return await search_dao.search_blogs(
        search_query=q,
        category_id=category_id,
        page=page,
        page_size=page_size
    )
