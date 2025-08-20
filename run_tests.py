#!/usr/bin/env python3
"""
Script para executar testes da nova arquitetura SIOP Bot
"""
import subprocess
import sys
import os


def executar_testes_unitarios():
    """Executa testes unitários"""
    print("🧪 Executando testes unitários...")
    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "test_siop_bot.py", 
            "-v", 
            "--tb=short"
        ], capture_output=True, text=True)
        
        print("✅ Testes unitários concluídos!")
        if result.stdout:
            print("\n📋 Saída dos testes:")
            print(result.stdout)
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Erro ao executar testes: {e}")
        return False


def executar_testes_com_cobertura():
    """Executa testes com relatório de cobertura"""
    print("📊 Executando testes com cobertura...")
    try:
        result = subprocess.run([
            sys.executable, "-m", "pytest", 
            "test_siop_bot.py", 
            "--cov=core",
            "--cov-report=html",
            "--cov-report=term-missing",
            "-v"
        ], capture_output=True, text=True)
        
        print("✅ Testes com cobertura concluídos!")
        if result.stdout:
            print("\n📋 Relatório de cobertura:")
            print(result.stdout)
        
        return result.returncode == 0
        
    except Exception as e:
        print(f"❌ Erro ao executar testes com cobertura: {e}")
        return False


def limpar_arquivos_temporarios():
    """Limpa arquivos temporários de teste"""
    print("🧹 Limpando arquivos temporários...")
    
    arquivos_para_remover = [
        ".coverage",
        "htmlcov",
        "__pycache__",
        "*.pyc",
        "*.pyo"
    ]
    
    for arquivo in arquivos_para_remover:
        if os.path.exists(arquivo):
            if os.path.isdir(arquivo):
                import shutil
                shutil.rmtree(arquivo)
            else:
                os.remove(arquivo)
            print(f"🗑️ Removido: {arquivo}")
    
    print("✅ Limpeza concluída!")


def main():
    """Função principal"""
    print("🎯 Executor de Testes - SIOP Bot")
    print("=" * 40)
    
    # Verifica se pytest está instalado
    try:
        import pytest
        print("✅ pytest encontrado!")
    except ImportError:
        print("❌ pytest não encontrado. Instalando...")
        subprocess.run([sys.executable, "-m", "pip", "install", "pytest", "pytest-cov", "pytest-mock"])
        print("✅ pytest instalado!")
    
    # Executa testes
    sucesso_unitarios = executar_testes_unitarios()
    sucesso_cobertura = executar_testes_com_cobertura()
    
    # Limpa arquivos temporários
    limpar_arquivos_temporarios()
    
    # Resumo
    print("\n📊 Resumo dos Testes:")
    print(f"   Testes Unitários: {'✅' if sucesso_unitarios else '❌'}")
    print(f"   Testes com Cobertura: {'✅' if sucesso_cobertura else '❌'}")
    
    if sucesso_unitarios and sucesso_cobertura:
        print("\n🎉 Todos os testes passaram!")
        return 0
    else:
        print("\n⚠️ Alguns testes falharam!")
        return 1


if __name__ == "__main__":
    sys.exit(main())
