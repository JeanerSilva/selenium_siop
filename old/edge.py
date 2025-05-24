from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
import time

def preencher_input_por_id(driver, wait, descricao, element_id, texto):
    try:
        print(f"🕓 Aguardando campo '{descricao}'...")
        input_element = wait.until(EC.visibility_of_element_located((By.ID, element_id)))
        input_element.clear()
        input_element.send_keys(texto)
        print(f"✅ Campo '{descricao}' preenchido com '{texto}'.")
    except TimeoutException:
        print(f"❌ Timeout ao localizar o campo '{descricao}' com id='{element_id}'")
        driver.save_screenshot(f"erro_{descricao.lower().replace(' ', '_')}.png")
        with open(f"erro_{descricao.lower().replace(' ', '_')}.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
        raise


def preenche_seletor_por_id(driver, wait, descricao, element_id, texto_visivel, tentativas=2, delay=1):
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
                print(f"⚠️ Tentativa {tentativa + 1} falhou no campo '{descricao}' (stale). Retentando após {delay}s...")
                time.sleep(delay)

        print(f"❌ Não foi possível selecionar '{texto_visivel}' em '{descricao}' após {tentativas} tentativas.")
    except TimeoutException:
        print(f"❌ Timeout ao localizar o campo '{descricao}'.")
        driver.save_screenshot(f"erro_{descricao.lower().replace(' ', '_')}.png")
        with open(f"erro_{descricao.lower().replace(' ', '_')}.html", "w", encoding="utf-8") as f:
            f.write(driver.page_source)
        raise


def preenche_seletor_por_spath(driver, wait, descricao, xpath, texto_visivel, tentativas=2, delay=1):
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

preenche_seletor_por_spath(driver, wait, "Exercício", '//label[contains(text(), "Exercício")]/following-sibling::div/select', "2025")
preenche_seletor_por_spath(driver, wait, "Perfil", '//label[contains(text(), "Perfil")]/following-sibling::div/select', "SEPLAN")

# Espera o iframe aparecer
wait.until(EC.presence_of_element_located((By.TAG_NAME, "iframe")))

# Pega todos os iframes
iframes = driver.find_elements(By.TAG_NAME, "iframe")
# Troca para o iframe correto (ajuste o índice conforme necessário)
driver.switch_to.frame(iframes[0])  # ou [1], [2], etc.
# pra voltar pro dom principal driver.switch_to.default_content()

print("✅ Container principal carregado.")

# Preenche os campos de filtro

preencher_input_por_id(driver, wait,
    descricao="Objetivo Específico",
    element_id="form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:txtPesquisaObjetivoCodigo",
    texto="1234"
)

preenche_seletor_por_id(
    driver, wait, "Programa",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoPrograma",
    "1144 - Agropecuária Sustentável"
)

preenche_seletor_por_id(
    driver, wait, "Órgão",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoOrgao",
    "22000 - Ministério da Agricultura e Pecuária"
)

preenche_seletor_por_id(
    driver, wait, "Origem",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoTipoInclusao",
    "PPA"
)

preenche_seletor_por_id(
    driver, wait, "Momento",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoMomento",
    "Base de Partida"
)

preenche_seletor_por_id(
    driver, wait, "Alterado",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoAlterado",
    "Alterado"
)

preenche_seletor_por_id(
    driver, wait, "Excluído",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoExcluido",
    "Não Excluído"
)

preenche_seletor_por_id(
    driver, wait, "Novo",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoNovo",
    "Novo"
)

preenche_seletor_por_id(
    driver, wait, "Validado",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoValidado",
    "Validado"
)

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
time.sleep(20)
driver.quit()
