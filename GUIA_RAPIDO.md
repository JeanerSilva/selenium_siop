# 🚀 Guia Rápido - SIOP Bot

> **Referência rápida para desenvolvedores**

## 📋 **Comandos Essenciais**

### **Executar Fluxos Existentes**
```bash
# Fluxo PAC 2024
python executa_carrega_pac.py /y

# Abrir programa
python executa_abre_programa.py /y

# Aplicação completa
python siop_bot.py /y
```

### **Testar Funcionalidades**
```bash
# Teste unitário
python -m pytest test_siop_bot.py -v

# Teste com cobertura
python run_tests.py
```

## 🎯 **Estrutura de um Novo Fluxo**

### **1. Classe Básica**
```python
class meu_fluxo:
    def __init__(self, parametro: str):
        if not parametro:
            raise ValueError("❌ Parâmetro obrigatório")
        self.parametro = parametro
    
    def acessa(self):
        sb.acessa("ppa->minha_atividade")
        sb.seleciona_ano_e_perfil_e_muda_de_frame("meu.campo.principal")
        return self
    
    def executa(self):
        sb.preenche_input("Campo", "meu.campo.principal", self.parametro)
        sb.clica_botao_tipo("Ação", "submit")
        return self
```

### **2. Configurações JSON**
```json
// config/elementos.json
{
  "item": "meu.campo.principal",
  "xpath": "//input[@id='campo' and @type='text']"
}

// config/urls.json
{
  "atividade": "ppa->minha_atividade",
  "url": "/siop/ppa/minha-atividade"
}
```

### **3. Exportar Fluxo**
```python
# flow/__init__.py
from .meu_fluxo import meu_fluxo
__all__ = [..., "meu_fluxo"]
```

## 🔧 **Funções Mais Usadas**

| Função | Descrição | Exemplo |
|--------|-----------|---------|
| `sb.acessa("atividade")` | Navega para URL | `sb.acessa("ppa->programa")` |
| `sb.preenche_input("desc", "item", "valor")` | Preenche campo | `sb.preenche_input("Código", "ppa.programa.codigo", "1144")` |
| `sb.clica_botao_tipo("desc", "tipo")` | Clica botão | `sb.clica_botao_tipo("Procurar", "submit")` |
| `sb.aguarda_elemento("desc", "xpath")` | Aguarda elemento | `sb.aguarda_elemento("Tabela", "//table")` |
| `sb.aguarda_tabela("desc", "item")` | Aguarda tabela | `sb.aguarda_tabela("Resultados", "tabela.resultados")` |

## 📁 **Arquivos Importantes**

- `flow/_template.py` - Template para novos fluxos
- `executa_template.py` - Template para scripts de execução
- `config/elementos.json` - Mapeia itens → XPaths
- `config/urls.json` - Mapeia atividades → URLs
- `core/web_actions.py` - Todas as ações web disponíveis

## 🚨 **Troubleshooting Rápido**

| Problema | Solução |
|----------|---------|
| Edge não inicia | Feche Edge, verifique versão do driver |
| Elemento não encontrado | Verifique XPath no DevTools (F12) |
| Timeout | Aumente timeout ou use `aguarda_jquery()` |
| Iframe não encontrado | Verifique item alvo em `elementos.json` |

## 💡 **Padrões de Código**

### **✅ BOM**
```python
def acessa(self):
    sb.acessa("ppa->objetivo")
    return self  # Para encadeamento

def __init__(self, codigo: str):
    if not codigo:
        raise ValueError("❌ Código obrigatório")
```

### **❌ EVITAR**
```python
def a(self):
    driver.find_element(By.XPATH, "//input")  # XPath hard-coded
    return None  # Sem encadeamento
```

## 🎯 **Exemplo Completo**

```python
# flow/exemplo.py
import siop_utils as sb

class exemplo:
    def __init__(self, codigo: str):
        if not codigo:
            raise ValueError("❌ Código obrigatório")
        self.codigo = codigo
    
    def acessa(self):
        sb.acessa("ppa->exemplo")
        sb.seleciona_ano_e_perfil_e_muda_de_frame("exemplo.campo")
        return self
    
    def busca(self):
        sb.preenche_input("Código", "exemplo.campo", self.codigo)
        sb.clica_botao_tipo("Procurar", "submit")
        return self

# Uso: flow.exemplo("123").acessa().busca()
```

---

**🎉 Agora você tem tudo para criar suas funcionalidades!**

**📚 Para mais detalhes, consulte o README.md completo.**
