from fastapi import APIRouter, Depends, HTTPException, Query
from app.dao.get_dao import get_blog_dao
from app.dao.dao_blog import BlogDAO

router = APIRouter(prefix="/search", tags=["search"])

@router.get("/blogs")
async def search_blogs(q: str = Query(..., description="Search query"), dao_blog: BlogDAO = Depends(get_blog_dao)):
    try:
        results = await dao_blog.search_blogs(search_query=q)
        return results
    except Exception as e:
        raise HTTPException(status_code=500,detail="An error occurred while searching blogs")