from pydantic import BaseModel


class RecipeBase(BaseModel):
    name: str
    description: str | None = None

class RecipeCreate(RecipeBase):
    pass

class RecipeResponse(RecipeBase):
    id: int

    class Config:
        from_attributes = True  # Updated for Pydantic v2
