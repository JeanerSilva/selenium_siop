from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import Select
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

import time

# Configuração inicial
driver = webdriver.Chrome()  # Ou Edge(), Firefox(), etc.

# Acesse a página
driver.get("https://www.siop.planejamento.gov.br/modulo/main/index.html#/150")

# Aguarde a renderização da página e do formulário
wait = WebDriverWait(driver, 90)

# Aguarda o campo "Exercício" estar disponível
select_exercicio = wait.until(EC.presence_of_element_located((By.XPATH, '//label[contains(text(), "Exercício")]/following-sibling::div/select')))
Select(select_exercicio).select_by_visible_text("2025")

# Aguarda o campo "Perfil" estar disponível
select_perfil = wait.until(EC.presence_of_element_located((By.XPATH, '//label[contains(text(), "Perfil")]/following-sibling::div/select')))
Select(select_perfil).select_by_visible_text("SEPLAN")

# Espera o botão de "Procurar" estar clicável e clica
# É necessário identificar o botão de busca corretamente na página real
botao_procurar = wait.until(EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Procurar")]')))
botao_procurar.click()

# Tempo para observar o resultado
time.sleep(10)

# Fechar navegador
driver.quit()
