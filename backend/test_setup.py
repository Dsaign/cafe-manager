"""
Arquivo de exemplo para executar e validar os testes.
Execute este arquivo para verificar se a configuração está correta.
"""

import os
import subprocess
import sys


def run_command(command, description):
    """Execute um comando e mostra o resultado."""
    print(f"\n{'='*50}")
    print(f"🔍 {description}")
    print(f"{'='*50}")
    
    try:
        result = subprocess.run(
            command,
            shell=True,
            capture_output=True,
            text=True,
            cwd=os.path.dirname(os.path.abspath(__file__))
        )
        
        if result.returncode == 0:
            print("✅ Sucesso!")
            if result.stdout:
                print(f"Output:\n{result.stdout}")
        else:
            print("❌ Falhou!")
            if result.stderr:
                print(f"Erro:\n{result.stderr}")
            if result.stdout:
                print(f"Output:\n{result.stdout}")
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Erro ao executar comando: {e}")
        return False


def main():
    """Função principal para testar a configuração."""
    print("🧪 Verificando configuração de testes do Café Manager")
    
    # Lista de comandos para testar
    tests = [
        ("python -c 'import pytest; print(f\"pytest version: {pytest.__version__}\")'", 
         "Verificando se pytest está instalado"),
        
        ("python -c 'from app.models.recipes import recipes; print(\"✅ Import do modelo Recipe funcionou\")'", 
         "Testando imports dos modelos"),
        
        ("python -c 'from app.services.recipes import recipe_router; print(\"✅ Import do router funcionou\")'", 
         "Testando imports do router"),
        
        ("python -c 'from helpers import get_db, add_and_commit; print(\"✅ Import dos helpers funcionou\")'", 
         "Testando imports dos helpers"),
        
        ("pytest --version", 
         "Verificando versão do pytest"),
        
        ("pytest tests/ --collect-only -q", 
         "Coletando testes disponíveis"),
        
        ("pytest tests/unit/test_schemas.py -v --tb=short", 
         "Executando testes dos schemas"),
        
        ("pytest tests/unit/test_helpers.py -v --tb=short", 
         "Executando testes dos helpers"),
    ]
    
    results = []
    
    for command, description in tests:
        success = run_command(command, description)
        results.append((description, success))
    
    # Resumo
    print(f"\n{'='*50}")
    print("📊 RESUMO DOS TESTES")
    print(f"{'='*50}")
    
    for description, success in results:
        status = "✅" if success else "❌"
        print(f"{status} {description}")
    
    successful = sum(1 for _, success in results if success)
    total = len(results)
    
    print(f"\n🎯 Resultado: {successful}/{total} testes passaram")
    
    if successful == total:
        print("\n🎉 Todos os testes de configuração passaram!")
        print("Você pode executar os testes com:")
        print("  make test                 # Todos os testes")
        print("  make test-unit           # Apenas testes unitários")
        print("  make test-integration    # Apenas testes de integração")
        print("  pytest -v                # Usando pytest diretamente")
    else:
        print(f"\n⚠️  {total - successful} teste(s) falharam. Verifique a configuração.")
        return 1
    
    return 0


if __name__ == "__main__":
    sys.exit(main())
