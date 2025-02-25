from fastapi import APIRouter, Depends, Query
from app.dao.get_dao import get_blog_dao
from app.dao.dao_blog import BlogDAO

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/blogs")
async def search_blogs( q: str = Query(..., description="Search query"), dao_blog : BlogDAO = Depends(get_blog_dao)):

    return await dao_blog.search_blogs(
        search_query=q
    )