
from typing import List

from app.models.recipes import recipes
from app.models.recipes.schemas import RecipeCreate, RecipeResponse
from fastapi import APIRouter, Depends, HTTPException
from fastapi import status as f_status_code
from helpers import add_and_commit, get_db
from sqlalchemy.orm import Session

recipe_router = APIRouter(prefix="/recipes", tags=["recipes"])

@recipe_router.get("/", response_model=List[RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):
    return db.query(recipes.Recipe).all()

@recipe_router.get("/{id}")
def get_recipe_from_id(id: int, db: Session = Depends(get_db)):
    recipe = db.query(recipes.Recipe).filter(recipes.Recipe.id == id).first()
    if recipe is None:
        raise HTTPException(status_code=f_status_code.HTTP_404_NOT_FOUND, detail="Recipe not found")
    return recipe

@recipe_router.post("/", status_code=f_status_code.HTTP_201_CREATED)
def post_recipes(payload: RecipeCreate, db: Session = Depends(get_db)):
    new_recipe = recipes.Recipe(name=payload.name, description=payload.description)
    if not add_and_commit(db, new_recipe):
        raise HTTPException(
            status_code=f_status_code.HTTP_400_BAD_REQUEST, 
            detail="Failed to create recipe"
        )
    return {"message": "Recipe created", "id": new_recipe.id}

@recipe_router.put("/{id}", status_code=f_status_code.HTTP_200_OK)
def update_recipes(id: int):
    return {"message": f"recipe {id} updated"}

@recipe_router.delete("/{id}", status_code=f_status_code.HTTP_204_NO_CONTENT)
def delete_recipes(id: int):
    return {"message": f"{id} recipe deleted"}