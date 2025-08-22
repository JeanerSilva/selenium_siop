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
        
    def _verificar_conflitos_powerbi(self):
        """Verifica e resolve conflitos com PowerBI que podem afetar o Edge"""
        try:
            import subprocess
            result = subprocess.run([
                "powershell", "-Command", 
                "Get-Process | Where-Object {$_.ProcessName -like '*powerbi*' -or $_.ProcessName -like '*PBIDesktop*'} | Select-Object ProcessName, Id"
            ], capture_output=True, text=True, shell=True)
            
            if "PowerBI" in result.stdout or "PBIDesktop" in result.stdout:
                print("⚠️  ATENÇÃO: PowerBI detectado em execução!")
                print("💡 O PowerBI pode causar conflitos com o Edge WebDriver")
                print("   Recomendado: Feche o PowerBI antes de executar o bot")
                
                resposta = input("Deseja tentar fechar o PowerBI automaticamente? (s/n): ").strip().lower()
                if resposta in ['s', 'sim', 'y', 'yes']:
                    print("🔄 Tentando fechar PowerBI...")
                    subprocess.run([
                        "powershell", "-Command",
                        "Stop-Process -Name '*powerbi*' -Force -ErrorAction SilentlyContinue; Stop-Process -Name '*PBIDesktop*' -Force -ErrorAction SilentlyContinue"
                    ], shell=True)
                    print("✅ PowerBI fechado. Aguardando 3 segundos...")
                    time.sleep(3)
                else:
                    print("ℹ️ Continuando sem fechar PowerBI...")
                    
        except Exception as e:
            print(f"⚠️ Não foi possível verificar conflitos com PowerBI: {e}")
    
    def iniciar_driver(self, tentativas=3, delay=5):
        """Inicia o driver Edge com configurações específicas"""
        edge_options = Options()
        edge_driver_path = self.config.DRIVER_DIR
        
        print("Atenção, você precisa já estar logado no SIOP")
        print(f"Driver edge: {edge_driver_path}")
        
        # Verifica conflitos com PowerBI antes de iniciar
        self._verificar_conflitos_powerbi()
        
        # Configurações específicas para Windows - resolve DevToolsActivePort
        edge_options.add_argument("--no-sandbox")
        edge_options.add_argument("--disable-dev-shm-usage")
        edge_options.add_argument("--disable-gpu")
        edge_options.add_argument("--disable-extensions")
        edge_options.add_argument("--disable-plugins")
        edge_options.add_argument("--disable-images")
        edge_options.add_argument("--disable-javascript")
        edge_options.add_argument("--disable-web-security")
        edge_options.add_argument("--allow-running-insecure-content")
        edge_options.add_argument("--disable-features=VizDisplayCompositor")
        
        # Opções específicas para resolver DevToolsActivePort no Windows
        edge_options.add_argument("--remote-debugging-port=0")  # Porta aleatória
        
        # Opções específicas para evitar conflitos com PowerBI/WebView2
        edge_options.add_argument("--disable-web-security")
        edge_options.add_argument("--disable-features=VizDisplayCompositor")
        edge_options.add_argument("--disable-software-rasterizer")
        edge_options.add_argument("--disable-threaded-animation")
        edge_options.add_argument("--disable-threaded-scrolling")
        edge_options.add_argument("--disable-checker-imaging")
        edge_options.add_argument("--disable-new-content-rendering-timeout")
        edge_options.add_argument("--disable-hang-monitor")
        edge_options.add_argument("--disable-prompt-on-repost")
        edge_options.add_argument("--disable-client-side-phishing-detection")
        edge_options.add_argument("--disable-component-update")
        edge_options.add_argument("--disable-domain-reliability")
        edge_options.add_argument("--disable-features=NetworkService,NetworkServiceLogging")
        edge_options.add_argument("--disable-background-timer-throttling")
        edge_options.add_argument("--disable-backgrounding-occluded-windows")
        edge_options.add_argument("--disable-renderer-backgrounding")
        edge_options.add_argument("--disable-features=TranslateUI")
        edge_options.add_argument("--disable-ipc-flooding-protection")
        edge_options.add_argument("--no-first-run")
        edge_options.add_argument("--no-default-browser-check")
        edge_options.add_argument("--disable-background-networking")
        edge_options.add_argument("--disable-component-extensions-with-background-pages")
        edge_options.add_argument("--metrics-recording-only")
        edge_options.add_argument("--no-report-upload")
        
        # Tenta usar perfil existente se configurado
        try:
            if hasattr(self.config, 'EDGE_DIR') and self.config.EDGE_DIR:
                caminho = os.path.expandvars(self.config.EDGE_DIR)
                if os.path.exists(caminho):
                    caminho_ajustado = re.sub(r'\\+', r'\\\\', caminho)
                    argumento = f'--user-data-dir={caminho_ajustado}'
                    edge_options.add_argument(argumento)
                    
                    if hasattr(self.config, 'PERFIL_EDGE_PADRAO') and self.config.PERFIL_EDGE_PADRAO:
                        edge_options.add_argument(f'--profile-directory={self.config.PERFIL_EDGE_PADRAO}')
                    print(f"✅ Usando perfil Edge: {caminho}")
                else:
                    print(f"⚠️ Diretório de perfil não encontrado: {caminho}")
            else:
                print("ℹ️ Usando perfil padrão do Edge")
        except Exception as e:
            print(f"⚠️ Erro ao configurar perfil Edge: {e}")
            print("ℹ️ Continuando com perfil padrão")
        
        service = Service(
            executable_path=str(edge_driver_path),
            log_path="logs/edge_driver.log",
            service_args=["--verbose"],
            creationflags=subprocess.CREATE_NO_WINDOW
        )

        for tentativa in range(1, tentativas + 1):
            try:
                print(f"🚀 Tentativa {tentativa} de iniciar o Edge...")
                
                # Verifica se o driver existe
                if not os.path.exists(edge_driver_path):
                    raise FileNotFoundError(f"Driver não encontrado: {edge_driver_path}")
                
                self.driver = webdriver.Edge(service=service, options=edge_options)
                self.wait = WebDriverWait(self.driver, 120)
                self.actions = ActionChains(self.driver)
                print("✅ Edge iniciado com sucesso.")
                return self.driver, self.wait
                
            except SessionNotCreatedException as e:
                print(f"❌ Erro ao iniciar Edge (tentativa {tentativa}): {e}")
                
                # Dicas específicas para Windows
                if "DevToolsActivePort" in str(e):
                    print("💡 Dica: Este erro é comum no Windows. Tente:")
                    print("   1. Fechar todas as instâncias do Edge")
                    print("   2. Verificar se a versão do msedgedriver.exe é compatível")
                    print("   3. Executar como administrador se necessário")
                
                if tentativa < tentativas:
                    print(f"⏳ Aguardando {delay} segundos antes da próxima tentativa...")
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
