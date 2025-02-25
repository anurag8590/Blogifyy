from fastapi import APIRouter, Depends, HTTPException, status
from typing import List
from app.dao.dao_category import CategoryDAO
from app.schemas.schema_category import CategoryResponseDTO, CategoryCreateDTO, CategoryUpdateDTO
from app.dao.get_dao import get_category_dao

router = APIRouter(prefix="/categories", tags=["categories"])

@router.post("/", response_model=CategoryResponseDTO)
async def create_category(category: CategoryCreateDTO, dao_category : CategoryDAO = Depends(get_category_dao)):

    try:
        new_category = await dao_category.create_category(
            name=category.name,
            description=category.description
        )
        return new_category
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail= f"Error creating category{e}") from e

@router.get("/", response_model=List[CategoryResponseDTO])
async def get_categories(dao_category : CategoryDAO = Depends(get_category_dao)):

    try:
        categories = await dao_category.get_all_categories()
        return categories
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving categories") from e

@router.get("/{category_id}", response_model=CategoryResponseDTO)
async def get_category_by_id(category_id: int, dao_category : CategoryDAO = Depends(get_category_dao)):

    try:
        category = await dao_category.get_category_by_id(category_id)
        if category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
        return category
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error retrieving category") from e

@router.put("/{category_id}", response_model=CategoryResponseDTO)
async def update_category(category_id: int, category: CategoryUpdateDTO, dao_category : CategoryDAO = Depends(get_category_dao)):

    try:
        existing_category = await dao_category.get_category_by_id(category_id)
        if existing_category is None:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

        updated_category = await dao_category.update_category(
            category_id=category_id,
            name=category.name,
            description=category.description
        )
        return updated_category
    except Exception as e:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail="Error updating category") from e