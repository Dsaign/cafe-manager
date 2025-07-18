import logging
from typing import List

from app.models.recipes import recipes
from app.models.recipes.schemas import RecipeCreate, RecipeResponse
from fastapi import APIRouter, Depends, HTTPException
from fastapi import status as f_status_code
from helpers import add_and_commit, get_db
from sqlalchemy.orm import Session

logger = logging.getLogger(__name__)

recipe_router = APIRouter(prefix="/recipes", tags=["recipes"])

@recipe_router.get("/", response_model=List[RecipeResponse])
def get_recipes(db: Session = Depends(get_db)):
    logger.info("Fetching all recipes")
    return db.query(recipes.Recipe).all()

@recipe_router.get("/{id}", response_model=RecipeResponse)
def get_recipe_by_id(id: int, db: Session = Depends(get_db)):
    logger.info(f"Fetching recipe with ID {id}")
    recipe = db.query(recipes.Recipe).filter(recipes.Recipe.id == id).first()
    if not recipe:
        logger.warning(f"Recipe with ID {id} not found")
        raise HTTPException(
            status_code=f_status_code.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    return recipe

@recipe_router.post("/", response_model=RecipeResponse, status_code=f_status_code.HTTP_201_CREATED)
def create_recipe(payload: RecipeCreate, db: Session = Depends(get_db)):
    logger.info(f"Creating new recipe: {payload.name}")
    new_recipe = recipes.Recipe(name=payload.name, description=payload.description)
    
    if not add_and_commit(db, new_recipe):
        logger.error("Failed to create recipe")
        raise HTTPException(
            status_code=f_status_code.HTTP_400_BAD_REQUEST,
            detail="Failed to create recipe"
        )
    
    logger.info(f"Recipe created with ID {new_recipe.id}")
    return new_recipe

@recipe_router.put("/{id}", response_model=RecipeResponse, status_code=f_status_code.HTTP_200_OK)
def update_recipe(id: int, payload: RecipeCreate, db: Session = Depends(get_db)):
    logger.info(f"Updating recipe with ID {id}")
    recipe = db.query(recipes.Recipe).filter(recipes.Recipe.id == id).first()
    
    if not recipe:
        logger.warning(f"Recipe with ID {id} not found")
        raise HTTPException(
            status_code=f_status_code.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    recipe.name = payload.name
    recipe.description = payload.description

    if not add_and_commit(db, recipe):
        logger.error(f"Failed to update recipe with ID {id}")
        raise HTTPException(
            status_code=f_status_code.HTTP_400_BAD_REQUEST,
            detail="Failed to update recipe"
        )
    
    logger.info(f"Recipe with ID {id} updated successfully")
    return recipe

@recipe_router.delete("/{id}", status_code=f_status_code.HTTP_204_NO_CONTENT)
def delete_recipe(id: int, db: Session = Depends(get_db)):
    logger.info(f"Deleting recipe with ID {id}")
    recipe = db.query(recipes.Recipe).filter(recipes.Recipe.id == id).first()
    
    if not recipe:
        logger.warning(f"Recipe with ID {id} not found")
        raise HTTPException(
            status_code=f_status_code.HTTP_404_NOT_FOUND,
            detail="Recipe not found"
        )
    
    db.delete(recipe)
    db.commit()
    
    logger.info(f"Recipe with ID {id} deleted successfully")
    return
