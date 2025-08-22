# -*- coding: utf-8 -*-
"""
Script de diagnóstico para conflitos PowerBI + Edge WebDriver

Este script ajuda a identificar e resolver problemas relacionados ao PowerBI
que podem afetar o funcionamento do Edge WebDriver no Windows.
"""

import subprocess
import time
import os
import sys


def verificar_processos_powerbi():
    """Verifica se há processos do PowerBI em execução"""
    print("🔍 Verificando processos do PowerBI...")
    
    try:
        # Verifica processos do PowerBI
        result = subprocess.run([
            "powershell", "-Command",
            "Get-Process | Where-Object {$_.ProcessName -like '*powerbi*' -or $_.ProcessName -like '*PBIDesktop*'} | Select-Object ProcessName, Id, CPU, WorkingSet | Format-Table -AutoSize"
        ], capture_output=True, text=True, shell=True)
        
        if result.stdout.strip():
            print("⚠️  PROCESSOS DO POWERBI DETECTADOS:")
            print(result.stdout)
            return True
        else:
            print("✅ Nenhum processo do PowerBI encontrado.")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao verificar processos: {e}")
        return False


def verificar_processos_edge():
    """Verifica se há processos do Edge em execução"""
    print("\n🔍 Verificando processos do Edge...")
    
    try:
        result = subprocess.run([
            "powershell", "-Command",
            "Get-Process | Where-Object {$_.ProcessName -like '*edge*' -or $_.ProcessName -like '*msedge*'} | Select-Object ProcessName, Id, CPU, WorkingSet | Format-Table -AutoSize"
        ], capture_output=True, text=True, shell=True)
        
        if result.stdout.strip():
            print("⚠️  PROCESSOS DO EDGE DETECTADOS:")
            print(result.stdout)
            return True
        else:
            print("✅ Nenhum processo do Edge encontrado.")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao verificar processos: {e}")
        return False


def verificar_processos_webview2():
    """Verifica se há processos do WebView2 em execução"""
    print("\n🔍 Verificando processos do WebView2...")
    
    try:
        result = subprocess.run([
            "powershell", "-Command",
            "Get-Process | Where-Object {$_.ProcessName -like '*webview*' -or $_.ProcessName -like '*msedgewebview*'} | Select-Object ProcessName, Id, CPU, WorkingSet | Format-Table -AutoSize"
        ], capture_output=True, text=True, shell=True)
        
        if result.stdout.strip():
            print("⚠️  PROCESSOS DO WEBVIEW2 DETECTADOS:")
            print(result.stdout)
            return True
        else:
            print("✅ Nenhum processo do WebView2 encontrado.")
            return False
            
    except Exception as e:
        print(f"❌ Erro ao verificar processos: {e}")
        return False


def fechar_processos_powerbi():
    """Tenta fechar todos os processos do PowerBI"""
    print("\n🔄 Tentando fechar processos do PowerBI...")
    
    try:
        # Fecha PowerBI Desktop
        subprocess.run([
            "powershell", "-Command",
            "Stop-Process -Name '*powerbi*' -Force -ErrorAction SilentlyContinue"
        ], shell=True)
        
        # Fecha PBIDesktop
        subprocess.run([
            "powershell", "-Command",
            "Stop-Process -Name '*PBIDesktop*' -Force -ErrorAction SilentlyContinue"
        ], shell=True)
        
        # Fecha processos relacionados
        subprocess.run([
            "powershell", "-Command",
            "Stop-Process -Name '*PowerBI*' -Force -ErrorAction SilentlyContinue"
        ], shell=True)
        
        print("✅ Comandos de fechamento executados.")
        time.sleep(2)
        
        # Verifica se ainda há processos
        if verificar_processos_powerbi():
            print("⚠️  Ainda há processos do PowerBI ativos.")
            return False
        else:
            print("✅ PowerBI fechado com sucesso!")
            return True
            
    except Exception as e:
        print(f"❌ Erro ao fechar PowerBI: {e}")
        return False


def fechar_processos_edge():
    """Tenta fechar todos os processos do Edge"""
    print("\n🔄 Tentando fechar processos do Edge...")
    
    try:
        # Fecha Edge
        subprocess.run([
            "powershell", "-Command",
            "Stop-Process -Name '*msedge*' -Force -ErrorAction SilentlyContinue"
        ], shell=True)
        
        # Fecha WebView2
        subprocess.run([
            "powershell", "-Command",
            "Stop-Process -Name '*msedgewebview*' -Force -ErrorAction SilentlyContinue"
        ], shell=True)
        
        print("✅ Comandos de fechamento executados.")
        time.sleep(2)
        
        # Verifica se ainda há processos
        if verificar_processos_edge() or verificar_processos_webview2():
            print("⚠️  Ainda há processos do Edge ativos.")
            return False
        else:
            print("✅ Edge fechado com sucesso!")
            return True
            
    except Exception as e:
        print(f"❌ Erro ao fechar Edge: {e}")
        return False


def limpar_portas_debug():
    """Tenta limpar portas de debug que podem estar ocupadas"""
    print("\n🧹 Tentando limpar portas de debug...")
    
    try:
        # Lista portas em uso
        result = subprocess.run([
            "powershell", "-Command",
            "netstat -ano | findstr :9222"
        ], capture_output=True, text=True, shell=True)
        
        if result.stdout.strip():
            print("⚠️  Porta 9222 (debug Edge) está em uso:")
            print(result.stdout)
            
            # Tenta matar processos usando a porta
            subprocess.run([
                "powershell", "-Command",
                "netstat -ano | findstr :9222 | ForEach-Object { ($_ -split '\\s+')[4] } | ForEach-Object { Stop-Process -Id $_ -Force -ErrorAction SilentlyContinue }"
            ], shell=True)
            
            print("✅ Tentativa de liberar porta 9222 executada.")
        else:
            print("✅ Porta 9222 está livre.")
            
    except Exception as e:
        print(f"❌ Erro ao verificar portas: {e}")


def executar_diagnostico_completo():
    """Executa diagnóstico completo"""
    print("=" * 60)
    print("🔍 DIAGNÓSTICO POWERBI + EDGE WEBCDRIVER")
    print("=" * 60)
    
    # Verifica processos
    powerbi_ativo = verificar_processos_powerbi()
    edge_ativo = verificar_processos_edge()
    webview2_ativo = verificar_processos_webview2()
    
    # Verifica portas
    limpar_portas_debug()
    
    print("\n" + "=" * 60)
    print("📊 RESUMO DO DIAGNÓSTICO")
    print("=" * 60)
    
    if powerbi_ativo:
        print("❌ PowerBI está ativo - PODE CAUSAR CONFLITOS!")
        print("💡 Recomendado: Feche o PowerBI antes de executar o bot")
    else:
        print("✅ PowerBI não está ativo")
    
    if edge_ativo or webview2_ativo:
        print("❌ Edge/WebView2 está ativo - PODE CAUSAR CONFLITOS!")
        print("💡 Recomendado: Feche o Edge antes de executar o bot")
    else:
        print("✅ Edge/WebView2 não está ativo")
    
    if not powerbi_ativo and not edge_ativo and not webview2_ativo:
        print("\n🎉 AMBIENTE LIMPO!")
        print("✅ Você pode executar o bot agora")
    else:
        print("\n⚠️  AMBIENTE COM CONFLITOS!")
        print("❌ Resolva os conflitos antes de executar o bot")
    
    return not (powerbi_ativo or edge_ativo or webview2_ativo)


def main():
    """Função principal"""
    if len(sys.argv) > 1 and sys.argv[1].lower() == '/auto':
        # Modo automático - tenta resolver tudo
        print("🚀 MODO AUTOMÁTICO - Tentando resolver conflitos...")
        
        if verificar_processos_powerbi():
            fechar_processos_powerbi()
        
        if verificar_processos_edge() or verificar_processos_webview2():
            fechar_processos_edge()
        
        limpar_portas_debug()
        time.sleep(3)
        
        # Verifica novamente
        executar_diagnostico_completo()
        
    else:
        # Modo interativo
        executar_diagnostico_completo()
        
        if verificar_processos_powerbi():
            resposta = input("\nDeseja fechar o PowerBI automaticamente? (s/n): ").strip().lower()
            if resposta in ['s', 'sim', 'y', 'yes']:
                fechar_processos_powerbi()
        
        if verificar_processos_edge() or verificar_processos_webview2():
            resposta = input("\nDeseja fechar o Edge automaticamente? (s/n): ").strip().lower()
            if resposta in ['s', 'sim', 'y', 'yes']:
                fechar_processos_edge()


if __name__ == "__main__":
    print("💡 Dica: Use '/auto' para modo automático:")
    print("   python diagnostico_powerbi.py /auto")
    print()
    
    main()
