from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.support.ui import Select
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
from selenium.common.exceptions import TimeoutException, NoSuchElementException
import time

def preencher_input_por_id(driver, wait, descricao, element_id, texto):
    """Preenche um campo de input por ID."""
    try:
        print(f"🕓 Aguardando campo '{descricao}'...")
        input_element = wait.until(EC.visibility_of_element_located((By.ID, element_id)))
        input_element.clear()
        input_element.send_keys(texto)
        print(f"✅ Campo '{descricao}' preenchido com '{texto}'.")
    except TimeoutException:
        _registrar_erro(driver, descricao, element_id)

def preenche_seletor_por_id(driver, wait, descricao, element_id, texto_visivel, tentativas=2, delay=1):
    """Seleciona uma opção visível em um <select> por ID."""
    try:
        print(f"🕓 Aguardando campo '{descricao}'...")
        wait.until(EC.visibility_of_element_located((By.ID, element_id)))
        print(f"✅ Campo '{descricao}' localizado.")

        for tentativa in range(tentativas):
            try:
                select_element = driver.find_element(By.ID, element_id)
                Select(select_element).select_by_visible_text(texto_visivel)
                print(f"✅ Opção '{texto_visivel}' selecionada no campo '{descricao}'.")
                return
            except StaleElementReferenceException:
                print(f"⚠️ Tentativa {tentativa + 1} falhou (stale). Retentando após {delay}s...")
                time.sleep(delay)

        print(f"❌ Falha ao selecionar '{texto_visivel}' em '{descricao}' após {tentativas} tentativas.")
    except TimeoutException:
        _registrar_erro(driver, descricao, element_id)

def clicar_botao(driver, wait, texto="Procurar"):
    """Clica em um botão do tipo submit com determinado texto."""
    try:
        print(f"🕓 Aguardando botão '{texto}'...")
        botao = wait.until(
            EC.visibility_of_element_located(
                (By.XPATH, f'//input[@type="submit" and @value="{texto}"]')
            )
        )
        try:
            botao.click()
            print(f"✅ Botão '{texto}' clicado com sucesso.")
        except Exception:
            print(f"⚠️ Clique padrão falhou. Usando JavaScript...")
            driver.execute_script("arguments[0].click();", botao)
            print(f"✅ Botão '{texto}' clicado via JavaScript.")
    except TimeoutException:
        print(f"❌ Botão '{texto}' não encontrado.")
        driver.save_screenshot(f"erro_botao_{texto.lower()}.png")

def _registrar_erro(driver, descricao, element_id):
    print(f"❌ Timeout ao localizar o campo '{descricao}' com id='{element_id}'")
    driver.save_screenshot(f"erro_{descricao.lower().replace(' ', '_')}.png")
    with open(f"erro_{descricao.lower().replace(' ', '_')}.html", "w", encoding="utf-8") as f:
        f.write(driver.page_source)
    raise TimeoutException(f"Campo '{descricao}' com id='{element_id}' não encontrado.")


def preenche_seletor_por_xpath(driver, wait, descricao, xpath, texto_visivel, tentativas=2, delay=1):
    try:
        print(f"🕓 Aguardando campo '{descricao}'...")
        wait.until(EC.presence_of_element_located((By.XPATH, xpath)))
        print(f"✅ Campo '{descricao}' localizado.")

        for tentativa in range(tentativas):
            try:
                select_element = driver.find_element(By.XPATH, xpath)
                Select(select_element).select_by_visible_text(texto_visivel)
                print(f"✅ Opção '{texto_visivel}' selecionada no campo '{descricao}'.")
                return
            except StaleElementReferenceException:
                print(f"⚠️ Tentativa {tentativa+1} falhou no campo '{descricao}' (stale). Retentando após {delay}s...")
                time.sleep(delay)

        print(f"❌ Não foi possível selecionar '{texto_visivel}' em '{descricao}' após {tentativas} tentativas.")
    except TimeoutException:
        print(f"❌ Timeout ao localizar o campo '{descricao}'.")
        driver.save_screenshot(f"erro_{descricao.lower().replace(' ', '_')}.png")
        with open(f"erro_{descricao.lower().replace(' ', '_')}.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
        raise

def aguardar_login_manual(wait, driver, timeout=1200):
    try:
        print("🕵️ Verificando se é necessário login manual...")

        # Verifica se o botão de login gov.br está presente
        botao_login = wait.until(
            EC.presence_of_element_located(
                (By.XPATH, '//button[contains(., "Entrar com") and contains(., "gov.br")]')
            )
        )

        if botao_login.is_displayed():
            print(f"🔒 Login não detectado. Aguardando até {timeout} segundos para que o usuário entre com gov.br...")

            # Espera até que o botão de login desapareça (indicando que o login foi feito)
            inicio = time.time()
            while time.time() - inicio < timeout:
                try:
                    driver.find_element(By.XPATH, '//button[contains(., "Entrar com") and contains(., "gov.br")]')
                    time.sleep(2)  # aguarda antes de verificar novamente
                except NoSuchElementException:
                    print("✅ Botão de login desapareceu.")
                    time.sleep(20)  # aguarda mais um pouco para garantir que o login foi concluído
                    return

 
            print("⚠️ Tempo limite para login manual atingido.")
        else:
            print("✅ Usuário já está logado (botão de login não visível).")

    except TimeoutException:
        print("✅ Login não parece necessário (botão não apareceu dentro do tempo esperado).")