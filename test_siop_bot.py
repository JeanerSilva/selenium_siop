"""
Testes para a nova arquitetura SIOP Bot
"""
import unittest
from unittest.mock import Mock, patch, MagicMock
from core import DriverManager, ElementManager, WebActions
from core import extrai_numero_pac, monta_objetivo
from config import config


class TestCoreUtils(unittest.TestCase):
    """Testa utilitários do core"""
    
    def test_extrai_numero_pac(self):
        """Testa extração de número PAC de nomes de arquivo"""
        # Casos válidos
        self.assertEqual(extrai_numero_pac("PAC123.xlsx"), 123)
        self.assertEqual(extrai_numero_pac("arquivo_PAC456_v2.xlsx"), 456)
        self.assertEqual(extrai_numero_pac("PAC_789_final.xlsx"), 789)
        
        # Casos inválidos
        self.assertIsNone(extrai_numero_pac("arquivo.xlsx"))
        self.assertIsNone(extrai_numero_pac("PAC.xlsx"))
        self.assertIsNone(extrai_numero_pac(""))
    
    def test_monta_objetivo(self):
        """Testa montagem de código de objetivo"""
        self.assertEqual(monta_objetivo(1), "0001")
        self.assertEqual(monta_objetivo(123), "0123")
        self.assertEqual(monta_objetivo(9999), "9999")


class TestElementManager(unittest.TestCase):
    """Testa o gerenciador de elementos"""
    
    def setUp(self):
        """Configuração inicial para cada teste"""
        self.mock_config = Mock()
        self.mock_config.BASE_DIR = "/fake/path"
        
        # Mock dos arquivos JSON
        self.mock_elementos = [
            {"item": "test_element", "xpath": "//div[@id='test']"},
            {"item": "param_element", "xpath": "//span[@id='${numero}']"}
        ]
        
        self.mock_urls = [
            {"atividade": "test_activity", "url": "/test/url"}
        ]
    
    @patch('builtins.open')
    @patch('json.load')
    def test_load_elements(self, mock_json_load, mock_open):
        """Testa carregamento de elementos"""
        mock_json_load.return_value = self.mock_elementos
        
        element_manager = ElementManager(self.mock_config)
        
        # Verifica se os elementos foram carregados
        self.assertEqual(element_manager.get_xpath_elemento("test_element"), "//div[@id='test']")
    
    def test_get_xpath_elemento_parametrizado(self):
        """Testa obtenção de xpath parametrizado"""
        # Mock do carregamento
        with patch.object(ElementManager, '_load_elements') as mock_load:
            mock_load.return_value = None
            element_manager = ElementManager.__new__(ElementManager)
            element_manager.config = self.mock_config
            element_manager._elementos = self.mock_elementos
            
            # Testa substituição de parâmetros
            xpath = element_manager.get_xpath_elemento_parametrizado("param_element", numero=123)
            self.assertEqual(xpath, "//span[@id='123']")


class TestDriverManager(unittest.TestCase):
    """Testa o gerenciador de driver"""
    
    def setUp(self):
        """Configuração inicial para cada teste"""
        self.mock_config = Mock()
        self.mock_config.DRIVER_DIR = "/fake/driver/path"
        self.mock_config.EDGE_DIR = "%LOCALAPPDATA%\\Microsoft\\Edge\\User Data"
        self.mock_config.PERFIL_EDGE_PADRAO = "Default"
        self.mock_config.JQUERY = True
    
    @patch('subprocess.run')
    def test_finalizar_navegador(self, mock_subprocess):
        """Testa finalização do navegador"""
        driver_manager = DriverManager(self.mock_config)
        driver_manager.finalizar_navegador()
        
        # Verifica se o comando PowerShell foi chamado
        mock_subprocess.assert_called_once()
    
    def test_is_jquery_enabled(self):
        """Testa configuração do jQuery"""
        driver_manager = DriverManager(self.mock_config)
        self.assertTrue(driver_manager.is_jquery_enabled())


class TestWebActions(unittest.TestCase):
    """Testa as ações web"""
    
    def setUp(self):
        """Configuração inicial para cada teste"""
        self.mock_config = Mock()
        self.mock_config.URL_BASE = "http://test.com"
        self.mock_config.ANO_PADRAO = "2024"
        self.mock_config.PERFIL_PADRAO = "Teste"
        
        self.mock_driver_manager = Mock()
        self.mock_driver_manager.get_driver.return_value = Mock()
        self.mock_driver_manager.get_wait.return_value = Mock()
        self.mock_driver_manager.get_actions.return_value = Mock()
        self.mock_driver_manager.is_jquery_enabled.return_value = True
        
        self.mock_element_manager = Mock()
        self.mock_element_manager.get_url.return_value = "/test/url"
        
        self.web_actions = WebActions(
            self.mock_driver_manager, 
            self.mock_element_manager, 
            self.mock_config
        )
    
    def test_acessa(self):
        """Testa acesso a URL"""
        self.web_actions.acessa("test_activity")
        
        # Verifica se a URL foi construída corretamente
        self.mock_element_manager.get_url.assert_called_once_with("test_activity")
        self.mock_driver_manager.get_driver.return_value.get.assert_called_once_with("http://test.com/test/url")


if __name__ == '__main__':
    # Executa os testes
    unittest.main(verbosity=2)
