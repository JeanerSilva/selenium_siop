import re
import pandas as pd
from pathlib import Path
from typing import Optional


def extrai_numero_pac(nome_arquivo: str) -> Optional[int]:
    """Extrai número do PAC de um nome de arquivo"""
    m = re.search(r'PAC[^0-9]*([0-9]+)', nome_arquivo, flags=re.IGNORECASE)
    return int(m.group(1)) if m else None


def monta_objetivo(n: int) -> str:
    """Monta código do objetivo específico com 4 dígitos"""
    return f"{n:04d}"


def abrir_excel(arquivo: str, aba: str):
    """Abre arquivo Excel e retorna DataFrame"""
    return pd.read_excel(arquivo, sheet_name=aba)


def listar_arquivos_excel(pasta: str, padrao: str = "*.xlsx") -> list:
    """Lista arquivos Excel em uma pasta"""
    path = Path(pasta)
    return sorted(path.glob(padrao))


def renomear_arquivo_processado(arquivo: Path, prefixo: str = "enviado.") -> bool:
    """Renomeia arquivo para indicar que foi processado"""
    try:
        novo_nome = arquivo.with_name(f"{prefixo}{arquivo.name}")
        arquivo.rename(novo_nome)
        print(f"✅ Arquivo renomeado: {novo_nome}")
        return True
    except Exception as e:
        print(f"⚠️ Não consegui renomear {arquivo.name}: {e}")
        return False


def criar_pasta_se_nao_existe(pasta: str) -> None:
    """Cria pasta se ela não existir"""
    Path(pasta).mkdir(parents=True, exist_ok=True)
