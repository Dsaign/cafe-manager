from unittest.mock import Mock, patch

import pytest
from app.models.recipes import recipes
from app.models.recipes.schemas import RecipeCreate
from app.services.recipes import (
    create_recipe,
    delete_recipe,
    get_recipe_by_id,
    get_recipes,
    update_recipe,
)
from fastapi import HTTPException


class TestGetRecipes:
    """Test cases for get_recipes endpoint."""
    
    @pytest.mark.unit
    def test_get_recipes_success(self):
        """Test successful retrieval of all recipes."""
        # Arrange
        mock_db = Mock()
        mock_recipes = [
            Mock(id=1, name="Café Espresso", description="Forte"),
            Mock(id=2, name="Cappuccino", description="Suave")
        ]
        mock_db.query.return_value.all.return_value = mock_recipes
        
        # Act
        result = get_recipes(mock_db)
        
        # Assert
        assert result == mock_recipes
        mock_db.query.assert_called_once_with(recipes.Recipe)
        mock_db.query.return_value.all.assert_called_once()
    
    @pytest.mark.unit
    def test_get_recipes_empty_list(self):
        """Test retrieval when no recipes exist."""
        # Arrange
        mock_db = Mock()
        mock_db.query.return_value.all.return_value = []
        
        # Act
        result = get_recipes(mock_db)
        
        # Assert
        assert result == []
        mock_db.query.assert_called_once_with(recipes.Recipe)


class TestGetRecipeById:
    """Test cases for get_recipe_by_id endpoint."""
    
    @pytest.mark.unit
    def test_get_recipe_by_id_success(self):
        """Test successful retrieval of recipe by ID."""
        # Arrange
        mock_db = Mock()
        mock_recipe = Mock(id=1, name="Café Espresso", description="Forte")
        mock_db.query.return_value.filter.return_value.first.return_value = mock_recipe
        
        # Act
        result = get_recipe_by_id(1, mock_db)
        
        # Assert
        assert result == mock_recipe
        mock_db.query.assert_called_once_with(recipes.Recipe)
    
    @pytest.mark.unit
    def test_get_recipe_by_id_not_found(self):
        """Test recipe not found scenario."""
        # Arrange
        mock_db = Mock()
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            get_recipe_by_id(999, mock_db)
        
        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Recipe not found"


class TestCreateRecipe:
    """Test cases for create_recipe endpoint."""
    
    @pytest.mark.unit
    @patch('app.services.recipes.add_and_commit')
    def test_create_recipe_success(self, mock_add_and_commit):
        """Test successful recipe creation."""
        # Arrange
        mock_db = Mock()
        mock_add_and_commit.return_value = True
        payload = RecipeCreate(name="Novo Café", description="Descrição")
        
        # Act
        result = create_recipe(payload, mock_db)
        
        # Assert
        assert result.name == payload.name
        assert result.description == payload.description
        mock_add_and_commit.assert_called_once()
    
    @pytest.mark.unit
    @patch('app.services.recipes.add_and_commit')
    def test_create_recipe_failure(self, mock_add_and_commit):
        """Test recipe creation failure."""
        # Arrange
        mock_db = Mock()
        mock_add_and_commit.return_value = False
        payload = RecipeCreate(name="Novo Café", description="Descrição")
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            create_recipe(payload, mock_db)
        
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Failed to create recipe"


class TestUpdateRecipe:
    """Test cases for update_recipe endpoint."""
    
    @pytest.mark.unit
    @patch('app.services.recipes.add_and_commit')
    def test_update_recipe_success(self, mock_add_and_commit):
        """Test successful recipe update."""
        # Arrange
        mock_db = Mock()
        mock_recipe = Mock(id=1, name="Old Name", description="Old Description")
        mock_db.query.return_value.filter.return_value.first.return_value = mock_recipe
        mock_add_and_commit.return_value = True
        payload = RecipeCreate(name="New Name", description="New Description")
        
        # Act
        result = update_recipe(1, payload, mock_db)
        
        # Assert
        assert result.name == payload.name
        assert result.description == payload.description
        mock_add_and_commit.assert_called_once_with(mock_db, mock_recipe)
    
    @pytest.mark.unit
    def test_update_recipe_not_found(self):
        """Test update when recipe not found."""
        # Arrange
        mock_db = Mock()
        mock_db.query.return_value.filter.return_value.first.return_value = None
        payload = RecipeCreate(name="New Name", description="New Description")
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            update_recipe(999, payload, mock_db)
        
        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Recipe not found"
    
    @pytest.mark.unit
    @patch('app.services.recipes.add_and_commit')
    def test_update_recipe_commit_failure(self, mock_add_and_commit):
        """Test update failure during commit."""
        # Arrange
        mock_db = Mock()
        mock_recipe = Mock(id=1, name="Old Name", description="Old Description")
        mock_db.query.return_value.filter.return_value.first.return_value = mock_recipe
        mock_add_and_commit.return_value = False
        payload = RecipeCreate(name="New Name", description="New Description")
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            update_recipe(1, payload, mock_db)
        
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Failed to update recipe"


class TestDeleteRecipe:
    """Test cases for delete_recipe endpoint."""
    
    @pytest.mark.unit
    def test_delete_recipe_success(self):
        """Test successful recipe deletion."""
        # Arrange
        mock_db = Mock()
        mock_recipe = Mock(id=1, name="Recipe to Delete")
        mock_db.query.return_value.filter.return_value.first.return_value = mock_recipe
        
        # Act
        result = delete_recipe(1, mock_db)
        
        # Assert
        assert result is None
        mock_db.delete.assert_called_once_with(mock_recipe)
        mock_db.commit.assert_called_once()
    
    @pytest.mark.unit
    def test_delete_recipe_not_found(self):
        """Test delete when recipe not found."""
        # Arrange
        mock_db = Mock()
        mock_db.query.return_value.filter.return_value.first.return_value = None
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            delete_recipe(999, mock_db)
        
        assert exc_info.value.status_code == 404
        assert exc_info.value.detail == "Recipe not found"
    
    @pytest.mark.unit
    def test_delete_recipe_invalid_id(self):
        """Test delete with invalid ID."""
        # Arrange
        mock_db = Mock()
        
        # Act & Assert
        with pytest.raises(HTTPException) as exc_info:
            delete_recipe(0, mock_db)
        
        assert exc_info.value.status_code == 400
        assert exc_info.value.detail == "Recipe ID must be provided"
