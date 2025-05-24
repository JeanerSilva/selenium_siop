from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait, Select
from selenium.webdriver.support import expected_conditions as EC
import time

edge_options = Options()
edge_options.add_argument(r'--user-data-dir=C:\Users\1765 IRON\AppData\Local\Microsoft\Edge\User Data')
edge_options.add_argument('--profile-directory=Profile 1')
edge_options.add_argument('--start-maximized')
edge_options.add_experimental_option("excludeSwitches", ["enable-automation"])

driver = webdriver.Edge(options=edge_options)
driver.get("https://www.siop.planejamento.gov.br/modulo/main/index.html#/150")

wait = WebDriverWait(driver, 60)

select_exercicio = wait.until(
    EC.presence_of_element_located((By.XPATH, '//label[contains(text(), "Exercício")]/following-sibling::div/select'))
)
Select(select_exercicio).select_by_visible_text("2025")

select_perfil = wait.until(
    EC.presence_of_element_located((By.XPATH, '//label[contains(text(), "Perfil")]/following-sibling::div/select'))
)
Select(select_perfil).select_by_visible_text("SEPLAN")

botao_procurar = wait.until(
    EC.element_to_be_clickable((By.XPATH, '//button[contains(text(), "Procurar")]'))
)
botao_procurar.click()

time.sleep(10)
driver.quit()
