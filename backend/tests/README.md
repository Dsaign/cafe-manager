# Testes do Café Manager Backend

Este documento descreve como executar e trabalhar com os testes automatizados do backend do Café Manager.

## Estrutura dos Testes

```
tests/
├── __init__.py
├── conftest.py              # Configurações e fixtures globais
├── unit/                    # Testes unitários
│   ├── __init__.py
│   ├── test_recipes.py      # Testes unitários para receitas
│   ├── test_schemas.py      # Testes para esquemas Pydantic
│   └── test_helpers.py      # Testes para funções auxiliares
└── integration/             # Testes de integração
    ├── __init__.py
    └── test_recipes.py      # Testes de integração para receitas
```

## Configuração

### 1. Instalar Dependências

```bash
# Dependências de produção
pip install -r requirements.txt

# Dependências de desenvolvimento (incluindo pytest)
pip install -r requirements-dev.txt
```

### 2. Configuração do Ambiente

Certifique-se de que o arquivo `.env` está configurado corretamente com as variáveis de ambiente necessárias.

## Executar Testes

### Usando Make (Recomendado)

```bash
# Executar todos os testes
make test

# Executar apenas testes unitários
make test-unit

# Executar apenas testes de integração
make test-integration

# Executar testes com cobertura
make test-cov

# Executar apenas testes relacionados a receitas
make test-recipes
```

### Usando pytest Diretamente

```bash
# Todos os testes
pytest -v

# Testes unitários
pytest -v -m unit

# Testes de integração
pytest -v -m integration

# Testes específicos
pytest -v tests/unit/test_recipes.py

# Com cobertura
pytest --cov=app --cov-report=html --cov-report=term-missing
```

## Tipos de Testes

### Testes Unitários
- **Localização**: `tests/unit/`
- **Propósito**: Testar funções e métodos individuais de forma isolada
- **Características**:
  - Usam mocks para isolar dependências
  - Executam rapidamente
  - Testam lógica de negócio específica
  - Marcados com `@pytest.mark.unit`

### Testes de Integração
- **Localização**: `tests/integration/`
- **Propósito**: Testar a integração entre componentes
- **Características**:
  - Usam banco de dados em memória (SQLite)
  - Testam endpoints completos da API
  - Verificam fluxos CRUD completos
  - Marcados com `@pytest.mark.integration`

## Fixtures Disponíveis

### `db_session`
- Fornece uma sessão de banco de dados em memória para testes
- Cria e destrói o banco para cada teste

### `client`
- Cliente de teste FastAPI configurado
- Usa o banco de dados de teste

### `sample_recipe_data`
- Dados de exemplo para criar receitas

### `sample_recipe`
- Receita criada no banco de dados de teste

### `multiple_recipes`
- Múltiplas receitas criadas no banco de dados de teste

## Exemplos de Uso

### Teste Unitário Simples

```python
@pytest.mark.unit
def test_get_recipes_success(self):
    # Arrange
    mock_db = Mock()
    mock_recipes = [Mock(id=1, name="Café")]
    mock_db.query.return_value.all.return_value = mock_recipes
    
    # Act
    result = get_recipes(mock_db)
    
    # Assert
    assert result == mock_recipes
```

### Teste de Integração

```python
@pytest.mark.integration
def test_create_recipe_success(self, client, sample_recipe_data):
    response = client.post("/recipes/", json=sample_recipe_data)
    
    assert response.status_code == 201
    assert response.json()["name"] == sample_recipe_data["name"]
```

## Cobertura de Testes

Para gerar relatório de cobertura:

```bash
make test-cov
```

O relatório HTML será gerado em `htmlcov/index.html`.

## Boas Práticas

1. **Nomeação**: Use nomes descritivos que expliquem o que está sendo testado
2. **Arrange-Act-Assert**: Organize testes com esta estrutura clara
3. **Isolamento**: Testes unitários devem ser independentes
4. **Dados de Teste**: Use fixtures para dados consistentes
5. **Marcadores**: Use `@pytest.mark.unit` e `@pytest.mark.integration`

## Executar Testes em CI/CD

Para integração contínua, use:

```bash
pytest --cov=app --cov-report=xml --cov-fail-under=80
```

Isso irá falhar se a cobertura for menor que 80%.

## Troubleshooting

### Problemas Comuns

1. **Erro de Import**: Certifique-se de que o PYTHONPATH está configurado
2. **Banco de Dados**: Verifique se o SQLite está disponível
3. **Dependências**: Execute `pip install -r requirements-dev.txt`

### Debug de Testes

```bash
# Executar com output detalhado
pytest -v -s

# Parar no primeiro erro
pytest -x

# Executar apenas testes que falharam
pytest --lf
```
