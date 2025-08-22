# -*- coding: utf-8 -*-
"""
Template para criar scripts de execução de fluxos no SIOP Bot

COMO USAR:
1. Copie este arquivo para executa_nome_do_seu_fluxo.py
2. Substitua 'meu_fluxo' pelo nome da sua funcionalidade
3. Substitua 'MinhaAtividade' pelo nome da sua classe
4. Substitua '1234' pelos parâmetros reais
5. Execute: python executa_nome_do_seu_fluxo.py

EXEMPLO DE USO:
    python executa_template.py /y
"""

import sys
from siop_bot import SiopBot


def main():
    """
    Função principal que executa o fluxo personalizado.
    
    Esta função:
    1. Inicializa o SIOP Bot
    2. Executa seu fluxo personalizado
    3. Finaliza o bot adequadamente
    """
    print("🚀 Iniciando execução do meu fluxo personalizado...")
    
    # Cria uma instância do bot
    bot = SiopBot()
    
    try:
        # Inicializa o bot (abre o Edge, configura o driver)
        print("🔧 Inicializando SIOP Bot...")
        bot.inicializar()
        
        # ========================================
        # 🎯 AQUI VOCÊ COLOCA SEU FLUXO PERSONALIZADO
        # ========================================
        
        # Exemplo: importa e usa um fluxo
        import flow
        
        # Substitua 'MinhaAtividade' e '1234' pelos valores reais
        resultado = flow.minha_atividade("1234").acessa().busca().lista()
        
        # Exemplo: executa múltiplos fluxos
        # programa = flow.programa("1144").acessa().lista()
        # objetivo = flow.objetivo_especifico("0001").acessa().lista()
        
        # Exemplo: fluxo condicional
        # if alguma_condicao:
        #     flow.objetivo_especifico("0002").acessa().exporta()
        
        print("✅ Fluxo personalizado executado com sucesso!")
        
        # ========================================
        # FIM DO SEU FLUXO PERSONALIZADO
        # ========================================
        
    except Exception as e:
        print(f"❌ Erro durante execução: {e}")
        # Captura screenshot em caso de erro (opcional)
        try:
            if hasattr(bot, 'web_actions') and bot.web_actions:
                bot.web_actions.driver.save_screenshot("erro_meu_fluxo.png")
                print("📸 Screenshot de erro salvo como 'erro_meu_fluxo.png'")
        except:
            pass
        raise
    
    finally:
        # Sempre finaliza o bot adequadamente
        print("🔄 Finalizando SIOP Bot...")
        bot.finalizar()
        print("✅ SIOP Bot finalizado!")


def executar_automatico():
    """
    Executa o fluxo automaticamente sem confirmação.
    
    Útil para execuções em lote ou automatizadas.
    """
    print("🚀 Executando automaticamente...")
    main()


if __name__ == "__main__":
    # Verifica se deve executar automaticamente
    if len(sys.argv) > 1 and sys.argv[1].lower() == '/y':
        executar_automatico()
    else:
        # Solicita confirmação do usuário
        print("\n" + "="*60)
        print("🚀 EXECUTOR DE FLUXO PERSONALIZADO")
        print("="*60)
        print("\n⚠️  ATENÇÃO:")
        print("   - Você precisa estar previamente logado no SIOP")
        print("   - O navegador Microsoft Edge será fechado")
        print("   - Certifique-se de que todos os arquivos estão configurados")
        print("\n" + "="*60)
        
        resposta = input("\nDeseja continuar? (s/n): ").strip().lower()
        
        if resposta in ['s', 'sim', 'y', 'yes']:
            main()
        else:
            print("❌ Operação cancelada pelo usuário.")
            print("\n💡 Dica: Use '/y' para executar automaticamente:")
            print("   python executa_template.py /y")
