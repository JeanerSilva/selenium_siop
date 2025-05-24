from selenium import webdriver
from selenium.webdriver.edge.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.webdriver.support import expected_conditions as EC
import time
import subprocess
from siop_utils import preencher_input_por_id, preenche_seletor_por_id, clicar_botao, preenche_seletor_por_xpath, aguardar_login_manual

def iniciar_driver():
 # Finaliza instâncias anteriores do Edge
    try:
        subprocess.run([
            "powershell", "-Command",
            "Stop-Process -Name 'msedge' -Force -ErrorAction SilentlyContinue"
        ], check=True)
        print("🧹 Edge encerrado com sucesso antes da execução.")
    except subprocess.CalledProcessError:
        print("⚠️ Não foi possível encerrar processos do Edge ou nenhum processo estava ativo.")

    edge_options = Options()
    edge_options.add_argument(r'--user-data-dir=C:\\Users\\1765 IRON\\AppData\\Local\\Microsoft\\Edge\\User Data')
    edge_options.add_argument('--profile-directory=Profile 1')
    #edge_options.add_argument('--start-maximized')
    #edge_options.add_argument("--user-data-dir=C:/SEPLAN/edge_profile_clean")
    #edge_options.add_argument("--disable-features=RendererCodeIntegrity")


    return webdriver.Edge(options=edge_options)
    

def main():
    driver = iniciar_driver()
    wait = WebDriverWait(driver, 10)
    driver.get("https://www.siop.planejamento.gov.br/modulo/main/index.html#/150")

    aguardar_login_manual(wait, driver)

    preenche_seletor_por_xpath(driver, wait, "Exercício", '//label[contains(text(), "Exercício")]/following-sibling::div/select', "2025")
    preenche_seletor_por_xpath(driver, wait, "Perfil", '//label[contains(text(), "Perfil")]/following-sibling::div/select', "SEPLAN")

    wait.until(EC.presence_of_element_located((By.TAG_NAME, "iframe")))
    driver.switch_to.frame(driver.find_elements(By.TAG_NAME, "iframe")[0])
    print("✅ Container principal carregado.")

    preencher_input_por_id(driver, wait, "Objetivo Específico",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:txtPesquisaObjetivoCodigo", "1234"
    )
    preenche_seletor_por_id(driver, wait, "Programa",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoPrograma",
        "1144 - Agropecuária Sustentável"
    )
    preenche_seletor_por_id(driver, wait, "Órgão",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoOrgao",
        "22000 - Ministério da Agricultura e Pecuária"
    )
    preenche_seletor_por_id(driver, wait, "Origem",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoTipoInclusao", "PPA"
    )
    preenche_seletor_por_id(driver, wait, "Momento",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoMomento", "Base de Partida"
    )
    preenche_seletor_por_id(driver, wait, "Alterado",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoAlterado", "Alterado"
    )
    preenche_seletor_por_id(driver, wait, "Excluído",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoExcluido", "Não Excluído"
    )
    preenche_seletor_por_id(driver, wait, "Novo",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoNovo", "Novo"
    )
    preenche_seletor_por_id(driver, wait, "Validado",
        "form:subTelaPesquisa:subTelaPesquisaObjetivoEspecifico:cmbPesquisaObjetivoValidado", "Validado"
    )

    clicar_botao(driver, wait, texto="Procurar")

    time.sleep(20)
    driver.quit()

if __name__ == "__main__":
    main()
