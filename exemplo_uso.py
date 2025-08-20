"""
Exemplo de uso da nova arquitetura SIOP Bot
"""
from core import DriverManager, ElementManager, WebActions
from config import config
import flow


def exemplo_basico():
    """Exemplo básico de uso da nova arquitetura"""
    print("🚀 Exemplo básico de uso da nova arquitetura")
    
    # Cria instâncias dos componentes
    driver_manager = DriverManager(config)
    element_manager = ElementManager(config)
    
    try:
        # Inicializa o driver
        driver_manager.iniciar_driver()
        
        # Cria ações web
        web_actions = WebActions(driver_manager, element_manager, config)
        
        # Exemplo de uso das ações
        print("✅ Driver inicializado e ações web criadas!")
        
        # Aqui você pode usar web_actions para navegar
        # web_actions.acessa("ppa->objetivo_específico")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        driver_manager.encerrar_driver()


def exemplo_fluxo_pac():
    """Exemplo de uso do fluxo PAC"""
    print("📋 Exemplo de uso do fluxo PAC")
    
    try:
        # Executa fluxo PAC 2024
        flow.atualizar_pac_em_lote(
            exercicio="2024",
            pasta="./exemplo_arquivos",
            data_referencia="31/12/2024",
            reiniciar_driver_entre_arquivos=False,
            apaga_antes=False
        )
        print("✅ Fluxo PAC executado com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro no fluxo PAC: {e}")


def exemplo_completo():
    """Exemplo completo de uso da arquitetura"""
    print("🏗️ Exemplo completo de uso da arquitetura")
    
    # Cria instâncias
    driver_manager = DriverManager(config)
    element_manager = ElementManager(config)
    
    try:
        # Inicializa
        driver_manager.iniciar_driver()
        web_actions = WebActions(driver_manager, element_manager, config)
        
        print("✅ Sistema inicializado!")
        
        # Exemplo de operações
        # web_actions.espera(2)
        # web_actions.acessa("ppa->programa")
        
        print("✅ Operações executadas!")
        
    except Exception as e:
        print(f"❌ Erro: {e}")
    finally:
        driver_manager.encerrar_driver()


if __name__ == "__main__":
    print("🎯 Exemplos de uso da nova arquitetura SIOP Bot")
    print("=" * 50)
    
    # Descomente os exemplos que deseja executar
    # exemplo_basico()
    # exemplo_fluxo_pac()
    # exemplo_completo()
    
    print("\n✅ Exemplos concluídos!")
    print("\n💡 Para executar os exemplos, descomente as chamadas acima.")
