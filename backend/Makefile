.PHONY: help install install-dev test test-unit test-integration test-cov lint format clean

help: ## Show this help message
	@echo 'Usage: make [target]'
	@echo ''
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "  %-15s %s\n", $$1, $$2}' $(MAKEFILE_LIST)

install: ## Install production dependencies
	pip install -r requirements.txt

install-dev: ## Install development dependencies
	pip install -r requirements.txt -r requirements-dev.txt

test: ## Run all tests
	pytest -v

test-unit: ## Run unit tests only
	pytest -v -m unit tests/unit/

test-integration: ## Run integration tests only
	pytest -v -m integration tests/integration/

test-cov: ## Run tests with coverage report
	pytest --cov=app --cov-report=html --cov-report=term-missing -v

lint: ## Run linting
	flake8 app/ tests/
	mypy app/

format: ## Format code
	black app/ tests/
	isort app/ tests/

clean: ## Clean up cache and temporary files
	find . -type d -name __pycache__ -exec rm -rf {} +
	find . -type f -name "*.pyc" -delete
	rm -rf .pytest_cache/
	rm -rf htmlcov/
	rm -rf .coverage

test-recipes: ## Run only recipe-related tests
	pytest -v tests/unit/test_recipes.py tests/integration/test_recipes.py tests/unit/test_schemas.py

test-watch: ## Run tests in watch mode (requires pytest-watch)
	ptw -- -v
