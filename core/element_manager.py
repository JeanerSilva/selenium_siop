import json
import os
from pathlib import Path
from typing import Dict, List, Any


class ElementManager:
    """Gerencia elementos e URLs dos arquivos JSON de configuração"""
    
    def __init__(self, config):
        self.config = config
        self._elementos = None
        self._urls = None
        self._load_elements()
        self._load_urls()
    
    def _load_elements(self):
        """Carrega elementos do arquivo elementos.json"""
        elementos_path = self.config.BASE_DIR / "config" / "elementos.json"
        try:
            with open(elementos_path, "r", encoding="utf-8") as f:
                self._elementos = json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Arquivo elementos.json não encontrado em {elementos_path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Erro ao decodificar elementos.json: {e}")
    
    def _load_urls(self):
        """Carrega URLs do arquivo urls.json"""
        urls_path = self.config.BASE_DIR / "config" / "urls.json"
        try:
            with open(urls_path, "r", encoding="utf-8") as f:
                self._urls = json.load(f)
        except FileNotFoundError:
            raise FileNotFoundError(f"Arquivo urls.json não encontrado em {urls_path}")
        except json.JSONDecodeError as e:
            raise ValueError(f"Erro ao decodificar urls.json: {e}")
    
    def get_xpath_elemento(self, elemento: str) -> str:
        """Retorna o xpath de um elemento específico"""
        for elem in self._elementos:
            if elem["item"] == elemento:
                xpath = elem.get("xpath")
                if not xpath:
                    raise ValueError(f"Elemento '{elemento}' não tem xpath definido.")
                return xpath
        raise ValueError(f"Elemento '{elemento}' não encontrado.")
    
    def get_xpath_elemento_parametrizado(self, nome_item: str, **kwargs) -> str:
        """Retorna xpath parametrizado substituindo placeholders"""
        for elem in self._elementos:
            if elem["item"] == nome_item:
                xpath_template = elem.get("xpath")
                if not xpath_template:
                    raise ValueError(f"Elemento '{nome_item}' não tem xpath definido.")
                
                for key, value in kwargs.items():
                    xpath_template = xpath_template.replace(f"${{{key}}}", str(value))
                return xpath_template
        raise ValueError(f"Elemento '{nome_item}' não encontrado.")
    
    def get_url(self, atividade: str) -> str:
        """Retorna URL para uma atividade específica"""
        for item in self._urls:
            if item["atividade"] == atividade:
                return item["url"]
        raise ValueError(f"URL para atividade '{atividade}' não encontrada.")
    
    def get_all_elements(self) -> List[Dict[str, Any]]:
        """Retorna todos os elementos carregados"""
        return self._elementos.copy()
    
    def get_all_urls(self) -> List[Dict[str, Any]]:
        """Retorna todas as URLs carregadas"""
        return self._urls.copy()
    
    def reload_elements(self):
        """Recarrega elementos do arquivo JSON"""
        self._load_elements()
    
    def reload_urls(self):
        """Recarrega URLs do arquivo JSON"""
        self._load_urls()
