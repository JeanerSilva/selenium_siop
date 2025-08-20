import subprocess
import time
import os
import re
from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.edge.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.action_chains import ActionChains
from selenium.common.exceptions import SessionNotCreatedException
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException, NoSuchElementException


class DriverManager:
    """Gerencia o driver do navegador Edge com configurações específicas"""
    
    def __init__(self, config):
        self.config = config
        self.driver = None
        self.wait = None
        self.actions = None
        self.jquery = config.JQUERY
        
    def iniciar_driver(self, tentativas=3, delay=5):
        """Inicia o driver Edge com configurações específicas"""
        edge_options = Options()
        edge_driver_path = self.config.DRIVER_DIR
        
        print("Atenção, você precisa já estar logado no SIOP")
        print(f"Driver edge: {edge_driver_path}")
        
        service = Service(
            executable_path=str(edge_driver_path),
            log_path="logs/edge_driver.log",
            service_args=["--verbose"],
            creationflags=subprocess.CREATE_NO_WINDOW
        )
        
        caminho = os.path.expandvars(self.config.EDGE_DIR)
        caminho_ajustado = re.sub(r'\\+', r'\\\\', caminho)
        argumento = f'--user-data-dir={caminho_ajustado}'
        edge_options.add_argument(argumento)
        edge_options.add_argument(f'--profile-directory={self.config.PERFIL_EDGE_PADRAO}')

        for tentativa in range(1, tentativas + 1):
            try:
                print(f"🚀 Tentativa {tentativa} de iniciar o Edge...")
                self.driver = webdriver.Edge(service=service, options=edge_options)
                self.wait = WebDriverWait(self.driver, 120)
                self.actions = ActionChains(self.driver)
                print("✅ Edge iniciado com sucesso.")
                return self.driver, self.wait
            except SessionNotCreatedException as e:
                print(f"❌ Erro ao iniciar Edge (tentativa {tentativa}): {e}")
                if tentativa < tentativas:
                    time.sleep(delay)
                    
        raise RuntimeError("❌ Falha ao iniciar o Edge após múltiplas tentativas.")
    
    def encerrar_driver(self):
        """Encerra o driver atual"""
        if self.driver:
            self.driver.quit()
            self.driver = None
            self.wait = None
            self.actions = None
    
    def finalizar_navegador(self):
        """Finaliza processos do Edge via PowerShell"""
        print("🕓 Verificando se o navegador está aberto ...")
        try:
            subprocess.run([
                "powershell", "-Command",
                "Stop-Process -Name 'msedge' -Force -ErrorAction SilentlyContinue"
            ], check=True)
            print("🧹 Edge encerrado com sucesso antes da execução.")
        except subprocess.CalledProcessError:
            print("⚠️ Não foi possível encerrar processos do Edge ou nenhum processo estava ativo.")
    
    def get_driver(self):
        """Retorna o driver atual"""
        return self.driver
    
    def get_wait(self):
        """Retorna o WebDriverWait atual"""
        return self.wait
    
    def get_actions(self):
        """Retorna o ActionChains atual"""
        return self.actions
    
    def is_jquery_enabled(self):
        """Retorna se o jQuery está habilitado"""
        return self.jquery
