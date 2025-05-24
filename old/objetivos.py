from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import time

# Inicia o navegador
driver = webdriver.Chrome()

# Etapa 1: Acessa o domínio principal (obrigatório para adicionar cookies)
driver.get("https://www.siop.planejamento.gov.br")

print(f"driver.current_url {driver.current_url}")


# Etapa 2: Adiciona os cookies manualmente
cookies = [
    {"name": "JSESSIONID", "value": "D3E5E89F921E0F9ECC75DB2C69B96E5A.producao_siop_psap01"},
    {"name": "bconn", "value": "_dvhrB4YyO6sqSTiSztXbw:1:acquired"},
    {"name": "updates", "value": ""},
    {"name": "ice.lease", "value": "1748094904469"},
    {"name": "ice.sessions", "value": ""}
]

for cookie in cookies:
    driver.add_cookie(cookie)

# Etapa 3: Vai para a página com sessão já autenticada
driver.get("https://www.siop.planejamento.gov.br/modulo/main/index.html#/150")

# Etapa 4: Aguarda a página carregar e interage com os campos
wait = WebDriverWait(driver, 10)

# Campo "Exercício"
select_exercicio = wait.until(EC.presence_of_element_located((By.XPATH, '//label[contains(text(), "Exercício")]/following-sibling::div/select')))
Select(select_exercicio).select_by_visible_text("2025")

# Campo "Perfil"
select_perfil = wait.until(EC.presence_of_element_located((By.XPATH, '//label[contains(text(), "Perfil")]/following-sibling::div/select')))
Select(select_perfil).select_by_visible_text("SEPLAN")

# Botão "Procurar"
botao_procurar = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Procurar")]')))
botao_procurar.click()

# Tempo para visualizar o resultado
time.sleep(10)

# Finaliza
driver.quit()
