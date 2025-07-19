<div align="center">
<h2> ☕ Café Manager</h2>
<strong>Transformando a gestão de cafeterias com tecnologia e inteligência artificial</strong>
<br /><br />
   
[![Frontend](https://img.shields.io/badge/Frontend-React%20%2B%20TypeScript-blue)](frontend/)
[![Backend](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-green)](backend/)
[![Tests](https://img.shields.io/badge/Tests-pytest-orange)](backend/tests/)
[![License](https://img.shields.io/badge/License-MIT-purple)](LICENSE)
</div>

<br />

> **Controle de fluxo financeiro e logístico para cafeterias**


## 📋 Sobre o Projeto

O **Café Manager** é um sistema web desenvolvido para auxiliar proprietários de cafeterias no controle eficiente de:

- 📦 **Gestão de Estoque**: Controle de matérias-primas e insumos
- 💰 **Fluxo Financeiro**: Acompanhamento de custos e preços
- 👥 **Fornecedores**: Cadastro e gestão de fornecedores
- 📊 **Relatórios**: Análises detalhadas de desempenho
- 🍽️ **Receitas**: Gestão de produtos e seus ingredientes
- 🤖 **Automação com IA**: Funcionalidades inteligentes para otimização

### 🎯 Principais Funcionalidades

1. **Controle de Matérias-Primas**
   - Cadastro de ingredientes com preços e unidades
   - Controle de estoque em tempo real
   - Alertas de reposição automáticos

2. **Gestão de Receitas**
   - Criação de receitas com ingredientes
   - Cálculo automático de custos
   - Sugestão de preços de venda

3. **Análise Financeira**
   - Histórico de preços
   - Relatórios de lucratividade
   - Projeções de custos

4. **Automação Inteligente (IA)**
   - Previsão de demanda baseada em histórico
   - Otimização de compras de insumos
   - Sugestões de cardápio baseadas em sazonalidade
   - Alertas inteligentes de reposição
   - Análise de tendências de consumo


## 🏗️ Arquitetura

### 📁 Estrutura de Diretórios

```
cafe-manager/
├── 🎨 frontend/    # Interface do usuário
├── ⚙️  backend/    # API e lógica de negócio
├── 🧪 tests/       # Testes automatizados
├── 📊 docs/        # Documentação
└── 🔧 .github/     # CI/CD e workflows
```

## 🎨 Frontend

### 🚀 Tecnologias Principais

| Tecnologia | Descrição |
|------------|-----------|
| **React** | Biblioteca para interfaces de usuário |
| **TypeScript** | Tipagem estática para JavaScript |
| **Vite** | Build tool moderno e rápido |
| **React Router** | Roteamento client-side |
| **TanStack Query** | Gerenciamento de estado servidor |


### 🎯 UI/UX Framework

| Componente | Tecnologia | Propósito |
|------------|------------|-----------|
| **Design System** | Radix UI + shadcn/ui | Componentes acessíveis e customizáveis |
| **Estilização** | Tailwind CSS | CSS utility-first |
| **Ícones** | Lucide React | Biblioteca de ícones moderna |
| **Gráficos** | Recharts | Visualização de dados |
| **Formulários** | React Hook Form | Gerenciamento de formulários |
| **Temas** | next-themes | Suporte a tema claro/escuro |

### 📱 Funcionalidades Frontend

- ✅ Interface responsiva e moderna
- ✅ Dashboard com métricas em tempo real
- ✅ Gestão completa de receitas e ingredientes
- ✅ Relatórios visuais interativos
- ✅ Tema claro/escuro
- ✅ Formulários validados
- ✅ Notificações toast


## ⚙️ Backend

### 🚀 Tecnologias Principais

| Tecnologia | Versão | Descrição |
|------------|--------|-----------|
| **FastAPI** | Framework web moderno para APIs |
| **Python** | Linguagem de programação |
| **SQLAlchemy** | ORM para banco de dados |
| **Pydantic** | Validação de dados e serialização |
| **Uvicorn** | Servidor ASGI |


### 🗄️ Banco de Dados & ORM

- **SQLAlchemy**: ORM para abstração do banco de dados
- **SQLite/PostgreSQL**: Suporte a múltiplos SGBDs
- **Alembic**: Migrações de schema (futuro)


### 🔐 Recursos Backend

- ✅ API RESTful completa
- ✅ Validação automática de dados
- ✅ Documentação automática (Swagger/OpenAPI)
- ✅ Logging estruturado
- ✅ Tratamento de erros padronizado
- ✅ CORS configurado


### 📊 Estrutura da API

```
/api
├── 🍽️ /recipes          # Gestão de receitas
├── 📦 /raw-materials    # Matérias-primas
├── 👥 /suppliers        # Fornecedores  
├── 📈 /reports          # Relatórios
└── 🤖 /ai               # Endpoints de IA
```

## 🧪 Testes e Qualidade

### 🔬 Framework de Testes

| Ferramenta | Uso | Cobertura |
|------------|-----|-----------|
| **pytest** | Testes unitários e integração | Backend |
| **pytest-cov** | Cobertura de código | 80%+ |
| **FastAPI TestClient** | Testes de API | Endpoints |
| **SQLite Memory** | Banco para testes | Integração |


### 📋 Tipos de Teste

- **Unitários**: Lógica de negócio isolada
- **Integração**: Fluxos completos da API
- **Schema**: Validação de dados Pydantic
- **E2E**: Fluxos de usuário (futuro)

```bash
# Executar todos os testes
make test

# Apenas testes unitários
make test-unit

# Com cobertura
make test-cov
```


## 🤖 Automação e Inteligência Artificial

### 🧠 Casos de Uso da IA

1. **Previsão de Demanda**
   - Análise de padrões históricos de vendas
   - Previsão de consumo por período
   - Otimização de estoque

2. **Gestão Inteligente de Compras**
   - Sugestões automáticas de reposição
   - Otimização de pedidos por fornecedor
   - Análise de preços e qualidade

3. **Análise de Cardápio**
   - Sugestões baseadas em sazonalidade
   - Análise de rentabilidade por produto
   - Recomendações de novos itens

4. **Otimização Financeira**
   - Análise de custos variáveis
   - Sugestões de preços competitivos
   - Identificação de oportunidades de economia


### 🔮 Futuras Implementações de IA

- 📱 Chatbot para atendimento ao cliente
- 📊 Análise preditiva de tendências
- 🎯 Personalização de ofertas
- 📈 Machine Learning para precificação dinâmica


## 🚀 Como Executar

### 📋 Pré-requisitos

- **Node.js** 18+
- **Python** 3.11+
- **pip** ou **poetry**

### ⚡ Início Rápido

1. **Clone o repositório**
   ```bash
   git clone https://github.com/Dsaign/cafe-alchemy-dash.git
   cd cafe-manager
   ```

2. **Backend**
   ```bash
   cd backend
   
   # Criar ambiente virtual
   python -m venv venv
   source venv/bin/activate  # Linux/Mac
   # venv\Scripts\activate   # Windows
   
   # Instalar dependências
   make install-dev
   
   # Configurar ambiente
   cp .env.example .env
   
   # Executar servidor
   uvicorn main:app --reload
   ```

3. **Frontend**
   ```bash
   cd frontend
   
   # Instalar dependências
   npm install
   
   # Executar em desenvolvimento
   npm run dev
   ```

4. **Acessar aplicação**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - Documentação: http://localhost:8000/docs


## 📝 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.



