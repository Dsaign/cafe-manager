import pytest
from app.database import Base
from app.models.recipes import recipes
from fastapi.testclient import TestClient
from helpers import get_db
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from sqlalchemy.pool import StaticPool

# Database setup for tests
SQLALCHEMY_DATABASE_URL = "sqlite:///:memory:"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    connect_args={"check_same_thread": False},
    poolclass=StaticPool,
)
TestingSessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


@pytest.fixture(scope="function")
def db_session():
    """Create a fresh database session for each test."""
    Base.metadata.create_all(bind=engine)
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()
        Base.metadata.drop_all(bind=engine)


@pytest.fixture(scope="function")
def client(db_session):
    """Create a test client with dependency override."""
    from main import app
    
    def override_get_db():
        try:
            yield db_session
        finally:
            pass
    
    app.dependency_overrides[get_db] = override_get_db
    
    with TestClient(app) as test_client:
        yield test_client
    
    app.dependency_overrides.clear()


@pytest.fixture
def sample_recipe_data():
    """Sample recipe data for testing."""
    return {
        "name": "Café Espresso",
        "description": "Um delicioso café espresso tradicional"
    }


@pytest.fixture
def sample_recipe(db_session, sample_recipe_data):
    """Create a sample recipe in the database."""
    recipe = recipes.Recipe(**sample_recipe_data)
    db_session.add(recipe)
    db_session.commit()
    db_session.refresh(recipe)
    return recipe


@pytest.fixture
def multiple_recipes(db_session):
    """Create multiple recipes for testing."""
    recipes_data = [
        {"name": "Café Espresso", "description": "Café forte e concentrado"},
        {"name": "Cappuccino", "description": "Café com leite vaporizado"},
        {"name": "Latte", "description": "Café suave com muito leite"},
    ]
    
    created_recipes = []
    for recipe_data in recipes_data:
        recipe = recipes.Recipe(**recipe_data)
        db_session.add(recipe)
        created_recipes.append(recipe)
    
    db_session.commit()
    
    for recipe in created_recipes:
        db_session.refresh(recipe)
    
    return created_recipes
