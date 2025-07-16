from pydantic import BaseModel, field_validator


class RecipeBase(BaseModel):
    name: str
    description: str | None = None

class RecipeCreate(BaseModel):
    name: str
    description: str

    @field_validator("name")
    def name_not_empty(cls, v):
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v

class RecipeResponse(RecipeBase):
    id: int

    class Config:
        from_attributes = True  # Updated for Pydantic v2
