"""
Configuração para testes da nova arquitetura SIOP Bot
"""
from pathlib import Path

# Configurações de teste
TEST_CONFIG = {
    "URL_BASE": "http://localhost:8000",  # URL de teste
    "ANO_PADRAO": "2024",
    "PERFIL_PADRAO": "Teste",
    "PERFIL_EDGE_PADRAO": "Default",
    "EDGE_DIR": r'%LOCALAPPDATA%\\Microsoft\\Edge\\User Data',
    "BASE_DIR": Path(__file__).resolve().parent,
    "DRIVER_DIR": Path(__file__).resolve().parent / "drivers" / "edge" / "msedgedriver.exe",
    "JQUERY": True
}

# Configurações de teste para fluxos
TEST_FLOW_CONFIG = {
    "exercicio": "2024",
    "pasta": "./test_files",
    "data_referencia": "31/12/2024",
    "reiniciar_driver_entre_arquivos": False,
    "apaga_antes": False
}
