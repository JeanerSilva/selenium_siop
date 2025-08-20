import time
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select, WebDriverWait
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException, NoSuchElementException


class WebActions:
    """Executa ações web com injeção de dependências"""
    
    def __init__(self, driver_manager, element_manager, config):
        self.driver_manager = driver_manager
        self.element_manager = element_manager
        self.config = config
        self.driver = driver_manager.get_driver()
        self.wait = driver_manager.get_wait()
        self.actions = driver_manager.get_actions()
        self.jquery = driver_manager.is_jquery_enabled()
    
    def acessa(self, url_key: str):
        """Acessa uma URL específica"""
        url = self.element_manager.get_url(url_key)
        full_url = self.config.URL_BASE + url
        self.driver.get(full_url)
        print(f"✅ Acessado: {full_url}")
    
    def aguarda_dom(self, timeout: int = 10):
        """Aguarda o DOM ficar completamente carregado"""
        print("🕓 Aguardando document.readyState = 'complete'...")
        for _ in range(timeout * 2):  # verifica a cada 0.5s
            try:
                pronto = self.driver.execute_script("return document.readyState === 'complete';")
                if pronto:
                    print("✅ DOM completamente carregado.")
                    return
            except Exception as e:
                print(f"⚠️ Erro ao verificar readyState (ignorado): {e}")
            time.sleep(0.5)
        print("⚠️ DOM não ficou pronto após timeout.")
    
    def aguarda_jquery(self, timeout: int = 10):
        """Aguarda o jQuery ficar inativo ou ausente"""
        print("🕓 Aguardando jQuery ficar inativo ou ausente...")
        for i in range(timeout * 2):  # verifica a cada 0.5s
            try:
                pronto = self.driver.execute_script("""
                    return (
                        typeof jQuery === 'undefined' || 
                        (typeof jQuery.active !== 'undefined' && jQuery.active === 0)
                    );
                """)
                if pronto:
                    print("✅ Ações do jQuery encerradas.")
                    return
            except Exception as e:
                print(f"⚠️ Erro ao verificar jQuery (ignorado): {e}")
            time.sleep(0.5)
        print("⚠️ jQuery ainda ativo (ou script falhou) após timeout.")
    
    def aguarda_elemento(self, descricao: str, xpath: str, timeout: int = None):
        """Aguarda um elemento aparecer na página"""
        if timeout is None:
            timeout = 120  # usa o timeout padrão do WebDriverWait
        
        local_wait = WebDriverWait(self.driver, timeout)
        print(f"🕓 Aguardando campo '{descricao}'...")
        
        try:
            elemento = local_wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
            if self.jquery:
                self.aguarda_jquery()
                print(f"✅ Campo '{descricao}' carregado e ações do jQuery já encerradas.")
            else:
                self.aguarda_dom()
                print(f"✅ Campo '{descricao}' carregado e ações do DOM já encerradas.")
            return elemento
        except TimeoutException:
            print(f"❌ Timeout ao localizar o campo '{descricao}' (xpath: {xpath})")
            self.driver.save_screenshot(f"erro_xpath_{descricao.lower().replace(' ', '_')}.png")
            raise
    
    def aguarda_elemento_opcional(self, descricao: str, xpath: str, timeout: int = 3):
        """Aguarda um elemento opcional (não falha se não encontrar)"""
        local_wait = WebDriverWait(self.driver, timeout)
        print(f"🕓 Aguardando campo '{descricao}'...")
        
        try:
            elemento = local_wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
            if self.jquery:
                self.aguarda_jquery()
                print(f"✅ Campo '{descricao}' carregado e ações do jQuery já encerradas.")
            else:
                self.aguarda_dom()
                print(f"✅ Campo '{descricao}' carregado e ações do DOM já encerradas.")
            return elemento
        except TimeoutException:
            print(f"⚠️ Campo opcional '{descricao}' não encontrado (xpath: {xpath}). Continuando fluxo.")
            return None
    
    def aguarda_tabela(self, descricao: str, tabela: str):
        """Aguarda uma tabela aparecer na página"""
        xpath = self.element_manager.get_xpath_elemento(tabela)
        self.aguarda_elemento(descricao, xpath)
    
    def aguarda_texto_no_elemento(self, descricao: str, xpath: str, texto: str):
        """Aguarda um texto específico aparecer em um elemento"""
        print(f"🕓 Aguardando campo '{descricao}'...")
        
        try:
            elemento = self.wait.until(EC.text_to_be_present_in_element((By.XPATH, xpath), texto))
            if self.jquery:
                self.aguarda_jquery()
                print(f"✅ Campo '{descricao}' carregado e ações do jQuery já encerradas.")
            else:
                self.aguarda_dom()
                print(f"✅ Campo '{descricao}' carregado e ações do DOM já encerradas.")
            return elemento
        except TimeoutException:
            print(f"❌ Timeout ao localizar o campo '{descricao}' (xpath: {xpath})")
            self.driver.save_screenshot(f"erro_xpath_{descricao.lower().replace(' ', '_')}.png")
            raise
    
    def clica_botao_tipo(self, texto: str, tipo: str):
        """Clica em um botão por tipo e valor"""
        try:
            print(f"🕓 Aguardando botão '{texto}'...")
            botao = self.wait.until(
                EC.visibility_of_element_located(
                    (By.XPATH, f'//input[@type="{tipo}" and @value="{texto}"]')
                )
            )
            try:
                botao.click()
                print(f"✅ Botão '{texto}' clicado com sucesso.")
            except Exception:
                print(f"⚠️ Clique padrão falhou. Usando JavaScript...")
                self.driver.execute_script("arguments[0].click();", botao)
                print(f"✅ Botão '{texto}' clicado via JavaScript.")
        except TimeoutException:
            print(f"❌ Botão '{texto}' não encontrado.")
            self.driver.save_screenshot(f"erro_botao_{texto.lower()}.png")
    
    def clica_link(self, descricao: str, elemento: str, numero: int = 0):
        """Clica em um link específico"""
        if numero == 0:
            xpath = self.element_manager.get_xpath_elemento(elemento)
        else:
            xpath = self.element_manager.get_xpath_elemento_parametrizado(elemento, numero=numero)
        
        try:
            elemento_web = self.aguarda_elemento(descricao, xpath)
            elemento_web.click()
            print("✅ Link clicado com sucesso.")
        except Exception as e:
            print(f"❌ Erro ao clicar no link: {e}")
    
    def clica_link_opcional(self, descricao: str, elemento: str, numero: int = 0):
        """Clica em um link opcional (não falha se não encontrar)"""
        xpath = self.element_manager.get_xpath_elemento(elemento)
        elemento_web = self.aguarda_elemento_opcional(descricao, xpath)
        
        if elemento_web:
            elemento_web.click()
            print("✅ Link clicado com sucesso.")
        else:
            print("Elemento não encontrado.")
        return elemento_web
    
    def clica_link_por_texto_inicial(self, texto_inicial: str):
        """Clica em um link que começa com um texto específico"""
        print(f"🕓 Procurando link que começa com: '{texto_inicial}'...")
        xpath = f"//a[starts-with(normalize-space(text()), '{texto_inicial}')]"

        try:
            link = self.aguarda_elemento(f"Link '{texto_inicial}'", xpath)
            try:
                link.click()
                print("✅ Link clicado com sucesso.")
            except Exception as e:
                mensagem_curta = str(e).split("\n")[0]
                print(f"⚠️ Clique normal falhou: {mensagem_curta}")
                self.driver.execute_script("arguments[0].click();", link)
                print("✅ Link clicado via JavaScript.")
        except Exception as e:
            print(f"❌ Erro ao localizar ou clicar no link: {e}")
    
    def preenche_input(self, descricao: str, elemento: str, texto: str):
        """Preenche um campo de input"""
        xpath = self.element_manager.get_xpath_elemento(elemento)
        
        try:
            input_element = self.aguarda_elemento(descricao, xpath)
            print(f"✅ Campo '{descricao}' localizado.")
            input_element.clear()
            input_element.send_keys(texto)
            print(f"✅ Campo '{descricao}' preenchido com '{texto}'.")
        except StaleElementReferenceException:
            print(f"⚠️ Elemento '{descricao}' ficou obsoleto. Tentando localizar novamente...")
            input_element = self.aguarda_elemento(descricao, xpath)
            input_element.clear()
            input_element.send_keys(texto)
            print(f"✅ Campo '{descricao}' preenchido após nova tentativa.")
        except Exception:
            self._registrar_erro(descricao, xpath)
    
    def preenche_seletor(self, descricao: str, xpath: str, texto_visivel: str, tentativas: int = 3, delay: int = 2):
        """Preenche um campo select com uma opção específica"""
        for tentativa in range(1, tentativas + 1):
            try:
                print(f"🕓 Tentativa {tentativa} - aguardando campo '{descricao}' para preencher com {texto_visivel}...")
                self.aguarda_elemento(descricao, xpath)
                print(f"✅ Campo '{descricao}' localizado.")
                
                select_element = self.driver.find_element(By.XPATH, xpath)
                Select(select_element).select_by_visible_text(texto_visivel)
                print(f"✅ Opção '{texto_visivel}' selecionada no campo '{descricao}'.")
                return
            except (NoSuchElementException, StaleElementReferenceException) as e:
                print(f"⚠️ Tentativa {tentativa} falhou ao preencher '{descricao}': {type(e).__name__}")
                if tentativa < tentativas:
                    time.sleep(delay)
            except TimeoutException:
                print(f"❌ Timeout ao localizar o campo '{descricao}' (xpath: {xpath})")
                self.driver.save_screenshot(f"erro_{descricao.lower().replace(' ', '_')}.png")
                with open(f"erro_{descricao.lower().replace(' ', '_')}.html", "w", encoding="utf-8") as f:
                    f.write(self.driver.page_source)
                raise
            except Exception as e:
                print(f"❌ Erro inesperado na tentativa {tentativa} ao preencher '{descricao}': {e}")
                if tentativa < tentativas:
                    time.sleep(delay)

        raise RuntimeError(f"❌ Falha ao selecionar '{texto_visivel}' no campo '{descricao}' após {tentativas} tentativas.")
    
    def seleciona_ano_e_perfil_e_muda_de_frame(self, elemento: str):
        """Seleciona ano e perfil e muda para o frame do elemento"""
        xpath_exercicio = self.element_manager.get_xpath_elemento("exercicio")
        self.aguarda_elemento("Exercício", xpath_exercicio)
        self.preenche_seletor("Exercício", xpath_exercicio, self.config.ANO_PADRAO)
        
        xpath_perfil = self.element_manager.get_xpath_elemento("perfil")
        self.aguarda_elemento("Perfil", xpath_perfil)
        self.preenche_seletor("Perfil", xpath_perfil, self.config.PERFIL_PADRAO)
        
        self.entra_frame_com_elemento("Campo 'Objetivo Específico'", elemento)
    
    def seleciona_seletor(self, descricao: str, elemento: str, texto_visivel: str):
        """Seleciona uma opção em um seletor"""
        xpath = self.element_manager.get_xpath_elemento(elemento)
        self.aguarda_elemento(descricao, xpath)
        self.preenche_seletor(descricao, xpath, texto_visivel)
    
    def entra_frame_com_elemento(self, descricao_alvo: str, item_json_xpath: str, timeout: int = 30):
        """Troca para o iframe que contém o elemento identificado"""
        alvo_xpath = self.element_manager.get_xpath_elemento(item_json_xpath)
        self.driver.switch_to.default_content()
        self.aguarda_dom()

        # Espera haver ao menos 1 iframe na página
        WebDriverWait(self.driver, timeout).until(
            EC.presence_of_all_elements_located((By.TAG_NAME, "iframe"))
        )
        iframes = self.driver.find_elements(By.TAG_NAME, "iframe")
        print(f"🔎 Procurando iframe que contém '{descricao_alvo}'. Total iframes: {len(iframes)}")

        for idx, fr in enumerate(iframes):
            try:
                self.driver.switch_to.frame(fr)
                # dá até 5s por iframe para achar o alvo
                WebDriverWait(self.driver, 5).until(
                    EC.presence_of_element_located((By.XPATH, alvo_xpath))
                )
                if self.jquery:
                    self.aguarda_jquery()
                print(f"✅ Entrou no iframe #{idx} que contém '{descricao_alvo}'.")
                return
            except TimeoutException:
                self.driver.switch_to.default_content()
                continue

        # Se chegar aqui, não achou
        self.driver.switch_to.default_content()
        raise TimeoutException(f"❌ Não encontrei iframe contendo '{descricao_alvo}'.")
    
    def _registrar_erro(self, descricao: str, xpath: str):
        """Registra erro com screenshot e HTML"""
        print(f"❌ Timeout ao localizar o campo '{descricao}' com xpath='{xpath}'")
        self.driver.save_screenshot(f"erro_{descricao.lower().replace(' ', '_')}.png")
        with open(f"erro_{descricao.lower().replace(' ', '_')}.html", "w", encoding="utf-8") as f:
            f.write(self.driver.page_source)
        raise TimeoutException(f"Campo '{descricao}' com xpath='{xpath}' não encontrado.")
    
    def espera(self, tempo: int):
        """Espera um tempo específico com contador visual"""
        print(f"🕓 Aguardando {tempo} segundos ...")
        for i in range(tempo):
            print(f"\r⏳ {i + 1}/{tempo} segundos", end='', flush=True)
            time.sleep(1)
        print("\n✅ Concluído.")
    
    def clica_na_tela(self, x: int, y: int):
        """Clica em coordenadas específicas da tela"""
        self.actions.move_by_offset(x, y).click().perform()
    
    def digita(self, texto: str):
        """Digita texto na posição atual"""
        self.actions.send_keys(texto).perform()
    
    def clica_na_tela_e_digita(self, x: int, y: int, texto: str):
        """Clica em coordenadas e digita texto"""
        self.actions.move_by_offset(x, y).click().send_keys(texto).perform()
    
    def debug_contexto(self, limite: int = 15):
        """Debug do contexto atual da página"""
        script = r"""
        const max = arguments[0] || 15;
        const all = document.querySelectorAll('*');
        const res = [];
        const inIframe = (window.self !== window.top);
        res.push({
            tipo: '__header__',
            contexto: inIframe ? 'iframe' : 'default_content',
            frameId: inIframe && window.frameElement ? window.frameElement.id || null : null,
            frameName: inIframe && window.frameElement ? window.frameElement.name || null : null,
            titulo: document.title || '',
            url: location.href,
            total: all.length
        });
        const n = Math.min(max, all.length);
        for (let i = 0; i < n; i++) {
            const e = all[i];
            res.push({
                tag: e.tagName.toLowerCase(),
                id: e.id || '',
                class: (e.className && e.className.toString) ? e.className.toString() : '',
                text: (e.textContent || '').trim().slice(0, 120)
            });
        }
        return res;
        """
        data = self.driver.execute_script(script, int(limite))
        header = data[0]
        print(f"🔎 DOM atual: total={header['total']} elementos | contexto={header['contexto']} | "
              f"frameId={header['frameId']} | frameName={header['frameName']}")
        
        # Lista amostra
        for i, row in enumerate(data[1:], start=1):
            print(f"{i:02d}. <{row['tag']} id='{row['id']}' class='{row['class']}'>  txt='{row['text']}'")
    
    def contexto_atual(self):
        """Retorna informações sobre o contexto atual (iframe ou página principal)"""
        frame = self.driver.execute_script("return self.frameElement")
        if frame is None:
            print("🧭 Contexto: default_content (página principal).")
            return {"contexto": "default_content", "frame_id": None, "frame_name": None}
        else:
            info = {
                "contexto": "iframe",
                "frame_id": frame.get_attribute("id"),
                "frame_name": frame.get_attribute("name"),
            }
            print(f"🧭 Contexto: iframe id={info['frame_id']} name={info['frame_name']}")
            return info
