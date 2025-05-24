from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
import time

def selecionar_por_texto_visivel(driver, wait, descricao, xpath, texto_visivel, tentativas=2, delay=1):
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

# Configuração do Edge
edge_options = Options()
edge_options.add_argument(r'--user-data-dir=C:\\Users\\1765 IRON\\AppData\\Local\\Microsoft\\Edge\\User Data')
edge_options.add_argument('--profile-directory=Profile 1')  # Perfil "selenium"
edge_options.add_argument('--start-maximized')

driver = webdriver.Edge(options=edge_options)
wait = WebDriverWait(driver, 10)

# Abre o SIOP
driver.get("https://www.siop.planejamento.gov.br/modulo/main/index.html#/150")
time.sleep(5)

# Preenche os campos de filtro
selecionar_por_texto_visivel(driver, wait, "Exercício", '//label[contains(text(), "Exercício")]/following-sibling::div/select', "2025")
selecionar_por_texto_visivel(driver, wait, "Perfil", '//label[contains(text(), "Perfil")]/following-sibling::div/select', "SEPLAN")
selecionar_por_texto_visivel(driver, wait, "Programa", '//label[contains(text(), "Programa")]/following-sibling::select', "1144 - Agropecuária Sustentável")
selecionar_por_texto_visivel(driver, wait, "Órgão", '//label[contains(text(), "Órgão")]/following-sibling::select', "22000 - Ministério da Agricultura e Pecuária")
selecionar_por_texto_visivel(driver, wait, "Origem", '//label[contains(text(), "Origem")]/following-sibling::select', "PPA")
selecionar_por_texto_visivel(driver, wait, "Momento", '//label[contains(text(), "Momento")]/following-sibling::select', "Base de Partida")
selecionar_por_texto_visivel(driver, wait, "Alterado", '//select[@id="form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoAlterado"]', "Alterado")
selecionar_por_texto_visivel(driver, wait, "Excluído", '//select[@id="form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoExcluido"]', "Não Excluído")
selecionar_por_texto_visivel(driver, wait, "Novo", '//select[@id="form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoNovo"]', "Novo")
selecionar_por_texto_visivel(driver, wait, "Validado", '//select[@id="form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoValidado"]', "Validado")

# Clica no botão "Procurar"
try:
    print("🕓 Aguardando botão 'Procurar'...")
    botao_procurar = wait.until(EC.visibility_of_element_located((By.XPATH, '//input[@type="submit" and @value="Procurar"]')))
    try:
        botao_procurar.click()
        print("✅ Botão 'Procurar' clicado com sucesso.")
    except Exception as e:
        print("⚠️ Clique padrão falhou, tentando via JavaScript...")
        driver.execute_script("arguments[0].click();", botao_procurar)
        print("✅ Botão 'Procurar' clicado via JavaScript.")
except TimeoutException:
    print("❌ Botão 'Procurar' não encontrado.")
    driver.save_screenshot("erro_botao_procurar.png")

# Aguarda resultados aparecerem (opcional)
time.sleep(5)
driver.quit()
