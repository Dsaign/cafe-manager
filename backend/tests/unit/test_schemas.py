import pytest
from app.models.recipes.schemas import RecipeBase, RecipeCreate, RecipeResponse
from pydantic import ValidationError


class TestRecipeSchemas:
    """Test cases for Recipe Pydantic schemas."""
    
    @pytest.mark.unit
    def test_recipe_base_valid_data(self):
        """Test RecipeBase with valid data."""
        data = {"name": "Test Recipe", "description": "Test description"}
        recipe = RecipeBase(**data)
        
        assert recipe.name == "Test Recipe"
        assert recipe.description == "Test description"
    
    @pytest.mark.unit
    def test_recipe_base_optional_description(self):
        """Test RecipeBase with optional description."""
        data = {"name": "Test Recipe"}
        recipe = RecipeBase(**data)
        
        assert recipe.name == "Test Recipe"
        assert recipe.description is None
    
    @pytest.mark.unit
    def test_recipe_base_empty_name_should_work(self):
        """Test RecipeBase allows empty name (validation is on RecipeCreate)."""
        data = {"name": "", "description": "Test description"}
        recipe = RecipeBase(**data)
        
        assert recipe.name == ""
        assert recipe.description == "Test description"


class TestRecipeCreate:
    """Test cases for RecipeCreate schema."""
    
    @pytest.mark.unit
    def test_recipe_create_valid_data(self):
        """Test RecipeCreate with valid data."""
        data = {"name": "Test Recipe", "description": "Test description"}
        recipe = RecipeCreate(**data)
        
        assert recipe.name == "Test Recipe"
        assert recipe.description == "Test description"
    
    @pytest.mark.unit
    def test_recipe_create_name_validation_empty(self):
        """Test RecipeCreate name validation with empty string."""
        data = {"name": "", "description": "Test description"}
        
        with pytest.raises(ValidationError) as exc_info:
            RecipeCreate(**data)
        
        assert "Name cannot be empty" in str(exc_info.value)
    
    @pytest.mark.unit
    def test_recipe_create_name_validation_whitespace(self):
        """Test RecipeCreate name validation with whitespace only."""
        data = {"name": "   ", "description": "Test description"}
        
        with pytest.raises(ValidationError) as exc_info:
            RecipeCreate(**data)
        
        assert "Name cannot be empty" in str(exc_info.value)
    
    @pytest.mark.unit
    def test_recipe_create_name_validation_valid_with_spaces(self):
        """Test RecipeCreate name validation with valid name containing spaces."""
        data = {"name": "  Valid Recipe Name  ", "description": "Test description"}
        recipe = RecipeCreate(**data)
        
        # The validator should strip and accept valid names
        assert recipe.name == "  Valid Recipe Name  "  # Assuming validator doesn't auto-strip
        assert recipe.description == "Test description"
    
    @pytest.mark.unit
    def test_recipe_create_missing_name(self):
        """Test RecipeCreate with missing name field."""
        data = {"description": "Test description"}
        
        with pytest.raises(ValidationError) as exc_info:
            RecipeCreate(**data)
        
        # Should raise validation error for missing required field
        assert "name" in str(exc_info.value)
    
    @pytest.mark.unit
    def test_recipe_create_missing_description(self):
        """Test RecipeCreate with missing description field."""
        data = {"name": "Test Recipe"}
        
        with pytest.raises(ValidationError) as exc_info:
            RecipeCreate(**data)
        
        # Should raise validation error for missing required field
        assert "description" in str(exc_info.value)


class TestRecipeResponse:
    """Test cases for RecipeResponse schema."""
    
    @pytest.mark.unit
    def test_recipe_response_valid_data(self):
        """Test RecipeResponse with valid data."""
        data = {
            "id": 1,
            "name": "Test Recipe",
            "description": "Test description"
        }
        recipe = RecipeResponse(**data)
        
        assert recipe.id == 1
        assert recipe.name == "Test Recipe"
        assert recipe.description == "Test description"
    
    @pytest.mark.unit
    def test_recipe_response_missing_id(self):
        """Test RecipeResponse with missing ID field."""
        data = {"name": "Test Recipe", "description": "Test description"}
        
        with pytest.raises(ValidationError) as exc_info:
            RecipeResponse(**data) # type: ignore
        
        assert "id" in str(exc_info.value)
    
    @pytest.mark.unit
    def test_recipe_response_invalid_id_type(self):
        """Test RecipeResponse with invalid ID type."""
        data = {
            "id": "not_an_integer",
            "name": "Test Recipe",
            "description": "Test description"
        }
        
        with pytest.raises(ValidationError) as exc_info:
            RecipeResponse(**data) # type: ignore
        
        assert "id" in str(exc_info.value)
    
    @pytest.mark.unit
    def test_recipe_response_optional_description(self):
        """Test RecipeResponse with optional description."""
        data = {"id": 1, "name": "Test Recipe"}
        recipe = RecipeResponse(**data)
        
        assert recipe.id == 1
        assert recipe.name == "Test Recipe"
        assert recipe.description is None


class TestSchemaCompatibility:
    """Test compatibility between different schemas."""
    
    @pytest.mark.unit
    def test_recipe_create_to_response_conversion(self):
        """Test converting RecipeCreate data to RecipeResponse."""
        create_data = {"name": "Test Recipe", "description": "Test description"}
        recipe_create = RecipeCreate(**create_data)
        
        # Simulate what happens after database save (adding ID)
        response_data = {
            "id": 1,
            "name": recipe_create.name,
            "description": recipe_create.description
        }
        recipe_response = RecipeResponse(**response_data)
        
        assert recipe_response.id == 1
        assert recipe_response.name == recipe_create.name
        assert recipe_response.description == recipe_create.description
    
    @pytest.mark.unit
    def test_recipe_base_inheritance(self):
        """Test that RecipeResponse properly inherits from RecipeBase."""
        # RecipeResponse should have all RecipeBase fields plus id
        base_fields = set(RecipeBase.model_fields.keys())
        response_fields = set(RecipeResponse.model_fields.keys())
        
        # Response should include all base fields
        assert base_fields.issubset(response_fields)
        
        # Response should have additional 'id' field
        assert "id" in response_fields
        assert "id" not in base_fields
