import sys
import core
from core import DriverManager, ElementManager, WebActions
from config import config
import flow
import siop_utils as sb


class SiopBot:
    """Classe principal que orquestra a aplicação SIOP"""
    
    def __init__(self):
        self.config = config
        self.driver_manager = DriverManager(config)
        self.element_manager = ElementManager(config)
        self.web_actions = None  # Será inicializado após o driver
        
    def inicializar(self):
        """Inicializa o driver e as ações web"""
        print("🚀 Inicializando SIOP Bot...")
        self.driver_manager.iniciar_driver()
        self.web_actions = WebActions(self.driver_manager, self.element_manager, self.config)
        # Sincroniza driver do core com utilitário legado (sb) usado pelos fluxos
        sb.driver = self.driver_manager.get_driver()
        sb.wait = self.driver_manager.get_wait()
        sb.actions = self.driver_manager.get_actions()
        sb.jquery = getattr(self.config, "JQUERY", True)
        print("✅ SIOP Bot inicializado com sucesso!")
        
    def executar_fluxo_pac_2024(self):
        """Executa fluxo de atualização PAC para 2024 (sem apagar arquivo)"""
        print("📋 Executando fluxo PAC 2024...")
        flow.atualizar_pac_em_lote(
            exercicio="2024",
            #pasta=r"C:\SEPLAN\siop-bot\xls\altera\Dezembro - 2024",
            pasta=r"C:\SEPLAN\Planilhas xls para alteração SIOP\teste\Dezembro - 2024 - Original\amostra",
            data_referencia="31/12/2024",
            reiniciar_driver_entre_arquivos=True,
            apaga_antes=False,
        )
        print("✅ Fluxo PAC 2024 concluído!")
        
    
        
    def executar_abre_programa(self):
        """Executa fluxos de exemplo comentados no código original"""
        print("📋 Executando fluxos de exemplo...")
        
        # Exemplo de programa
        flow.programa("1144").acessa().lista()
        
        # Exemplo de programas
        # flow.programas().acessa().seleciona_nao_excluido().lista()
        
        # Exemplo de objetivos específicos
        # flow.objetivos_especificos().acessa().seleciona_nao_excluido().lista()
        
        # Exemplo de entregas
        # flow.entregas().acessa().seleciona_nao_excluido().lista()
        
        print("✅ Fluxos de exemplo concluídos!")
        
    def finalizar(self):
        """Finaliza a aplicação"""
        print("🔄 Finalizando SIOP Bot...")
        if self.web_actions:
            self.web_actions.espera(10)
        # Encerra via utilitário legado para garantir que o driver ativo (possivelmente reiniciado nos fluxos) seja fechado
        try:
            sb.encerra()
        except Exception:
            pass
        try:
            sb.finaliza_navegador()
        except Exception:
            pass
        print("✅ SIOP Bot finalizado!")
        
    def executar(self):
        """Executa o fluxo principal da aplicação"""
        try:
            self.inicializar()
            
            # Executa os fluxos principais
            self.executar_fluxo_pac_2024()
            
            # Para executar fluxos de exemplo, descomente a linha abaixo:
            # self.executar_fluxos_exemplo()
            
        except Exception as e:
            print(f"❌ Erro durante execução: {e}")
            raise
        finally:
            self.finalizar()


def main():
    """Função principal que inicia a aplicação"""
    bot = SiopBot()
    bot.executar()


def executar_automatico():
    """Executa a aplicação automaticamente sem confirmação"""
    print("🚀 Executando automaticamente...")
    bot = SiopBot()
    bot.executar()


if __name__ == "__main__":
    # Verifica se deve executar automaticamente
    if len(sys.argv) > 1 and sys.argv[1].lower() == '/y':
        executar_automatico()
    else:
        # Solicita confirmação do usuário
        resposta = input("\n⚠️ Você precisa estar previamente logado no SIOP.\n\n"
                        "O navegador Microsoft Edge será fechado. Deseja continuar? (s/n): ").strip().lower()
        if resposta == 's':
            main()
        else:
            print("Operação cancelada pelo usuário.")
