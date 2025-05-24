from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException, StaleElementReferenceException
import time

def selecionar_por_texto_visivel(driver, wait, descricao, element_id, texto_visivel, tentativas=2, delay=1):
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


def selecionar_por_texto_visivel_xpath(driver, wait, descricao, xpath, texto_visivel, tentativas=2, delay=1):
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


selecionar_por_texto_visivel_xpath(driver, wait, "Exercício", '//label[contains(text(), "Exercício")]/following-sibling::div/select', "2025")
selecionar_por_texto_visivel_xpath(driver, wait, "Perfil", '//label[contains(text(), "Perfil")]/following-sibling::div/select', "SEPLAN")

# Espera o iframe aparecer
wait.until(EC.presence_of_element_located((By.TAG_NAME, "iframe")))

# Pega todos os iframes
iframes = driver.find_elements(By.TAG_NAME, "iframe")
# Troca para o iframe correto (ajuste o índice conforme necessário)
driver.switch_to.frame(iframes[0])  # ou [1], [2], etc.
# pra voltar pro dom principal driver.switch_to.default_content()


# Agora pode acessar seu input
#wait.until(
#    EC.visibility_of_element_located((By.ID, "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:txtPesquisaObjetivoCodigo"))
#).send_keys("1234")


print("✅ Container principal carregado.")

# Preenche os campos de filtro

selecionar_por_texto_visivel(
    driver, wait, "Programa",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoPrograma",
    "1144 - Agropecuária Sustentável"
)

selecionar_por_texto_visivel(
    driver, wait, "Órgão",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoOrgao",
    "22000 - Ministério da Agricultura e Pecuária"
)

selecionar_por_texto_visivel(
    driver, wait, "Origem",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoTipoInclusao",
    "PPA"
)

selecionar_por_texto_visivel(
    driver, wait, "Momento",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoMomento",
    "Base de Partida"
)

selecionar_por_texto_visivel(
    driver, wait, "Alterado",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoAlterado",
    "Alterado"
)

selecionar_por_texto_visivel(
    driver, wait, "Excluído",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoExcluido",
    "Não Excluído"
)

selecionar_por_texto_visivel(
    driver, wait, "Novo",
    "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoNovo",
    "Novo"
)

selecionar_por_texto_visivel(
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
time.sleep(5)
driver.quit()
