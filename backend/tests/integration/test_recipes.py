import pytest
from fastapi import status


class TestRecipesIntegration:
    """Integration tests for recipes endpoints."""
    
    @pytest.mark.integration
    def test_get_recipes_empty(self, client):
        """Test GET /recipes with empty database."""
        response = client.get("/recipes/")
        
        assert response.status_code == status.HTTP_200_OK
        assert response.json() == []
    
    @pytest.mark.integration
    def test_get_recipes_with_data(self, client, multiple_recipes):
        """Test GET /recipes with existing data."""
        response = client.get("/recipes/")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert len(data) == 3
        assert all("id" in recipe for recipe in data)
        assert all("name" in recipe for recipe in data)
        assert all("description" in recipe for recipe in data)
    
    @pytest.mark.integration
    def test_get_recipe_by_id_success(self, client, sample_recipe):
        """Test GET /recipes/{id} with valid ID."""
        response = client.get(f"/recipes/{sample_recipe.id}")
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_recipe.id
        assert data["name"] == sample_recipe.name
        assert data["description"] == sample_recipe.description
    
    @pytest.mark.integration
    def test_get_recipe_by_id_not_found(self, client):
        """Test GET /recipes/{id} with non-existent ID."""
        response = client.get("/recipes/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Recipe not found"
    
    @pytest.mark.integration
    def test_create_recipe_success(self, client, sample_recipe_data):
        """Test POST /recipes with valid data."""
        response = client.post("/recipes/", json=sample_recipe_data)
        
        assert response.status_code == status.HTTP_201_CREATED
        data = response.json()
        assert data["name"] == sample_recipe_data["name"]
        assert data["description"] == sample_recipe_data["description"]
        assert "id" in data
    
    @pytest.mark.integration
    def test_create_recipe_invalid_data(self, client):
        """Test POST /recipes with invalid data."""
        invalid_data = {"name": "", "description": "Valid description"}
        response = client.post("/recipes/", json=invalid_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.integration
    def test_create_recipe_missing_fields(self, client):
        """Test POST /recipes with missing required fields."""
        invalid_data = {"description": "Missing name field"}
        response = client.post("/recipes/", json=invalid_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.integration
    def test_update_recipe_success(self, client, sample_recipe):
        """Test PUT /recipes/{id} with valid data."""
        update_data = {
            "name": "Updated Recipe Name",
            "description": "Updated description"
        }
        
        response = client.put(f"/recipes/{sample_recipe.id}", json=update_data)
        
        assert response.status_code == status.HTTP_200_OK
        data = response.json()
        assert data["id"] == sample_recipe.id
        assert data["name"] == update_data["name"]
        assert data["description"] == update_data["description"]
    
    @pytest.mark.integration
    def test_update_recipe_not_found(self, client):
        """Test PUT /recipes/{id} with non-existent ID."""
        update_data = {
            "name": "Updated Recipe Name",
            "description": "Updated description"
        }
        
        response = client.put("/recipes/999", json=update_data)
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Recipe not found"
    
    @pytest.mark.integration
    def test_update_recipe_invalid_data(self, client, sample_recipe):
        """Test PUT /recipes/{id} with invalid data."""
        invalid_data = {"name": "", "description": "Valid description"}
        
        response = client.put(f"/recipes/{sample_recipe.id}", json=invalid_data)
        
        assert response.status_code == status.HTTP_422_UNPROCESSABLE_ENTITY
    
    @pytest.mark.integration
    def test_delete_recipe_success(self, client, sample_recipe):
        """Test DELETE /recipes/{id} with valid ID."""
        response = client.delete(f"/recipes/{sample_recipe.id}")
        
        assert response.status_code == status.HTTP_204_NO_CONTENT
        
        # Verify recipe is deleted
        get_response = client.get(f"/recipes/{sample_recipe.id}")
        assert get_response.status_code == status.HTTP_404_NOT_FOUND
    
    @pytest.mark.integration
    def test_delete_recipe_not_found(self, client):
        """Test DELETE /recipes/{id} with non-existent ID."""
        response = client.delete("/recipes/999")
        
        assert response.status_code == status.HTTP_404_NOT_FOUND
        assert response.json()["detail"] == "Recipe not found"
    
    @pytest.mark.integration
    def test_delete_recipe_invalid_id(self, client):
        """Test DELETE /recipes/{id} with invalid ID (0)."""
        response = client.delete("/recipes/0")
        
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert response.json()["detail"] == "Recipe ID must be provided"


class TestRecipesCRUDFlow:
    """Integration tests for complete CRUD flow."""
    
    @pytest.mark.integration
    def test_complete_crud_flow(self, client):
        """Test complete CRUD operations flow."""
        # 1. Create a recipe
        create_data = {
            "name": "Test CRUD Recipe",
            "description": "Recipe for testing CRUD operations"
        }
        
        create_response = client.post("/recipes/", json=create_data)
        assert create_response.status_code == status.HTTP_201_CREATED
        created_recipe = create_response.json()
        recipe_id = created_recipe["id"]
        
        # 2. Read the created recipe
        get_response = client.get(f"/recipes/{recipe_id}")
        assert get_response.status_code == status.HTTP_200_OK
        recipe_data = get_response.json()
        assert recipe_data["name"] == create_data["name"]
        assert recipe_data["description"] == create_data["description"]
        
        # 3. Update the recipe
        update_data = {
            "name": "Updated CRUD Recipe",
            "description": "Updated description for CRUD testing"
        }
        
        update_response = client.put(f"/recipes/{recipe_id}", json=update_data)
        assert update_response.status_code == status.HTTP_200_OK
        updated_recipe = update_response.json()
        assert updated_recipe["name"] == update_data["name"]
        assert updated_recipe["description"] == update_data["description"]
        
        # 4. Delete the recipe
        delete_response = client.delete(f"/recipes/{recipe_id}")
        assert delete_response.status_code == status.HTTP_204_NO_CONTENT
        
        # 5. Verify recipe is deleted
        final_get_response = client.get(f"/recipes/{recipe_id}")
        assert final_get_response.status_code == status.HTTP_404_NOT_FOUND
    
    @pytest.mark.integration
    def test_list_recipes_after_operations(self, client):
        """Test listing recipes after various operations."""
        # Initially empty
        response = client.get("/recipes/")
        assert response.status_code == status.HTTP_200_OK
        assert len(response.json()) == 0
        
        # Create multiple recipes
        recipes_to_create = [
            {"name": "Recipe 1", "description": "Description 1"},
            {"name": "Recipe 2", "description": "Description 2"},
            {"name": "Recipe 3", "description": "Description 3"},
        ]
        
        created_ids = []
        for recipe_data in recipes_to_create:
            response = client.post("/recipes/", json=recipe_data)
            assert response.status_code == status.HTTP_201_CREATED
            created_ids.append(response.json()["id"])
        
        # Check if all recipes are listed
        response = client.get("/recipes/")
        assert response.status_code == status.HTTP_200_OK
        recipes = response.json()
        assert len(recipes) == 3
        
        # Delete one recipe
        delete_response = client.delete(f"/recipes/{created_ids[0]}")
        assert delete_response.status_code == status.HTTP_204_NO_CONTENT
        
        # Check if recipe count is reduced
        response = client.get("/recipes/")
        assert response.status_code == status.HTTP_200_OK
        recipes = response.json()
        assert len(recipes) == 2
