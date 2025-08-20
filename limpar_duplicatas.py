#!/usr/bin/env python3
"""
Script para identificar e remover funções duplicadas entre siop_utils.py e core/web_actions.py
"""

import re
import ast

def extrair_funcoes(arquivo):
    """Extrai nomes de funções de um arquivo Python"""
    try:
        with open(arquivo, 'r', encoding='utf-8') as f:
            conteudo = f.read()
        
        # Parse do AST para encontrar definições de função
        tree = ast.parse(conteudo)
        funcoes = []
        
        for node in ast.walk(tree):
            if isinstance(node, ast.FunctionDef):
                funcoes.append(node.name)
        
        return funcoes
    except Exception as e:
        print(f"Erro ao processar {arquivo}: {e}")
        return []

def main():
    print("🔍 Analisando funções duplicadas...")
    
    # Extrair funções de ambos os arquivos
    funcoes_siop_utils = extrair_funcoes('siop_utils.py')
    funcoes_web_actions = extrair_funcoes('core/web_actions.py')
    
    print(f"📁 siop_utils.py: {len(funcoes_siop_utils)} funções")
    print(f"📁 core/web_actions.py: {len(funcoes_web_actions)} funções")
    
    # Encontrar duplicatas
    duplicatas = set(funcoes_siop_utils) & set(funcoes_web_actions)
    
    if duplicatas:
        print(f"\n🚨 Funções duplicadas encontradas ({len(duplicatas)}):")
        for func in sorted(duplicatas):
            print(f"   - {func}")
        
        print("\n💡 Recomendações:")
        print("   - Manter versões em core/web_actions.py (mais modernas)")
        print("   - Remover versões de siop_utils.py")
        print("   - Atualizar imports nos fluxos para usar core/")
        
    else:
        print("\n✅ Nenhuma função duplicada encontrada!")
    
    # Mostrar funções únicas em cada arquivo
    print(f"\n📊 Resumo:")
    print(f"   Funções únicas em siop_utils.py: {len(funcoes_siop_utils) - len(duplicatas)}")
    print(f"   Funções únicas em core/web_actions.py: {len(funcoes_web_actions) - len(duplicatas)}")
    print(f"   Total de duplicatas: {len(duplicatas)}")

if __name__ == "__main__":
    main()
