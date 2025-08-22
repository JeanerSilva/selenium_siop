# 🚀 SIOP Bot - Guia para Desenvolvedores

> **Automação inteligente para o SIOP com arquitetura modular e extensível**

Este projeto permite automatizar tarefas repetitivas no SIOP (Sistema de Informações Orçamentárias) através de uma arquitetura bem estruturada que facilita a criação de novos fluxos e funcionalidades.

## 🎯 **Por que usar este projeto?**

✅ **Arquitetura limpa**: Separação clara entre infraestrutura e lógica de negócio  
✅ **Fácil extensão**: Padrões consistentes para criar novos fluxos  
✅ **Configuração centralizada**: XPaths e URLs em arquivos JSON  
✅ **Tratamento robusto de erros**: Esperas inteligentes para DOM e jQuery  
✅ **Reutilização**: Componentes modulares que podem ser combinados  

## 🏗️ **Arquitetura do Projeto**

```
siop-bot/
├── 🎯 core/                    # Infraestrutura e utilitários
│   ├── driver_manager.py       # Gerencia o navegador Edge
│   ├── element_manager.py      # Carrega configurações JSON
│   ├── web_actions.py          # Ações web de alto nível
│   └── utils.py                # Funções utilitárias
├── 📋 flow/                    # Fluxos de negócio (SUA ÁREA!)
│   ├── programa.py             # Exemplo: gerenciar programas
│   ├── objetivo_especifico.py  # Exemplo: gerenciar objetivos
│   └── pac.py                  # Exemplo: atualização em lote
├── ⚙️ config/                  # Configurações
│   ├── elementos.json          # Mapeia itens → XPaths
│   ├── urls.json               # Mapeia atividades → URLs
│   └── config.py               # Parâmetros gerais
└── 🚀 siop_bot.py              # Orquestrador principal
```

## 🚀 **Primeiros Passos**

### 1. **Configuração Inicial**

Edite `config/config.py` com suas configurações:

```python
# config/config.py
URL_BASE = "https://seu-siop.gov.br"  # URL base do SIOP
ANO_PADRAO = "2024"                   # Ano padrão para operações
PERFIL_PADRAO = "Controle de Qualidade - SEPLAN"  # Perfil padrão

# Configurações do Edge
EDGE_DIR = r"%LOCALAPPDATA%\Microsoft\Edge\User Data"
PERFIL_EDGE_PADRAO = "Default"
DRIVER_DIR = r"C:\SEPLAN\siop-bot\drivers\edge"
```

### 2. **Mapear Elementos da Interface**

Adicione XPaths em `config/elementos.json`:

```json
[
  {
    "item": "meu.campo.codigo",
    "xpath": "//input[@id='form:codigo' and @type='text']"
  },
  {
    "item": "meu.botao.salvar",
    "xpath": "//button[@type='submit' and contains(text(),'Salvar')]"
  }
]
```

### 3. **Mapear URLs**

Adicione caminhos em `config/urls.json`:

```json
[
  {
    "atividade": "ppa->minha_atividade",
    "url": "/siop/ppa/minha-atividade"
  }
]
```

## 🛠️ **Como Criar uma Nova Funcionalidade**

### **Passo 1: Criar o Fluxo**

Crie um arquivo em `flow/` seguindo o padrão:

```python
# flow/minha_atividade.py
import siop_utils as sb

class minha_atividade:
    """Gerencia operações relacionadas à minha atividade"""
    
    def __init__(self, codigo: str):
        if not codigo or not str(codigo).strip():
            raise ValueError("❌ Código é obrigatório e não pode estar vazio.")
        self.codigo = codigo
    
    def acessa(self):
        """Navega para a página da atividade"""
        sb.acessa("ppa->minha_atividade")
        sb.seleciona_ano_e_perfil_e_muda_de_frame("meu.campo.codigo")
        return self
    
    def busca(self):
        """Busca por código"""
        sb.preenche_input("Código", "meu.campo.codigo", self.codigo)
        sb.clica_botao_tipo("Procurar", "submit")
        return self
    
    def salva(self):
        """Salva alterações"""
        sb.clica_botao_tipo("Salvar", "submit")
        return self
    
    def lista(self):
        """Lista resultados"""
        sb.aguarda_tabela("Resultados", "minha.tabela.resultados")
        return self
```

### **Passo 2: Exportar o Fluxo**

Adicione em `flow/__init__.py`:

```python
# flow/__init__.py
from .minha_atividade import minha_atividade

__all__ = [
    # ... outros fluxos
    "minha_atividade",
]
```

### **Passo 3: Criar Script de Execução**

```python
# executa_minha_atividade.py
from siop_bot import SiopBot

def main():
    bot = SiopBot()
    try:
        bot.inicializar()
        
        # Use o fluxo
        import flow
        flow.minha_atividade("1234").acessa().busca().lista()
        
    finally:
        bot.finalizar()

if __name__ == "__main__":
    main()
```

## 📚 **Exemplos Práticos**

### **Exemplo 1: Acessar e Listar Programa**

```python
import flow

# Encadeamento de métodos (fluent interface)
flow.programa("1144").acessa().lista()

# Ou passo a passo
programa = flow.programa("1144")
programa.acessa()
programa.lista()
```

### **Exemplo 2: Atualização em Lote**

```python
import flow

# Atualiza PACs de 2024 sem apagar arquivos
flow.atualizar_pac_em_lote(
    exercicio="2024",
    pasta=r"C:\minha\pasta\com\arquivos",
    data_referencia="31/12/2024",
    apaga_antes=False,
    reiniciar_driver_entre_arquivos=True
)
```

### **Exemplo 3: Fluxo Personalizado**

```python
import flow

# Combina múltiplos fluxos
def meu_fluxo_completo():
    # 1. Acessa programa
    programa = flow.programa("1144").acessa()
    
    # 2. Lista objetivos específicos
    objetivos = flow.objetivos_especificos().acessa().lista()
    
    # 3. Acessa um objetivo específico
    objetivo = flow.objetivo_especifico("0001").acessa()
    
    return "Fluxo concluído!"

# Executa
resultado = meu_fluxo_completo()
```

## 🔧 **Funções Disponíveis**

### **Navegação e Acesso**
- `sb.acessa("atividade")` - Navega para URL mapeada
- `sb.seleciona_ano_e_perfil_e_muda_de_frame("item_alvo")` - Seleciona ano/perfil e entra no iframe

### **Interação com Elementos**
- `sb.preenche_input("Descrição", "item.xpath", "valor")` - Preenche campos
- `sb.clica_botao_tipo("Descrição", "tipo")` - Clica em botões
- `sb.seleciona_opcao("Descrição", "item.xpath", "valor")` - Seleciona opções

### **Esperas e Verificações**
- `sb.aguarda_elemento("Descrição", "xpath")` - Aguarda elemento aparecer
- `sb.aguarda_tabela("Descrição", "item.tabela")` - Aguarda tabela carregar
- `sb.aguarda_jquery()` - Aguarda jQuery ficar inativo

### **Utilitários**
- `sb.extrai_numero_pac(arquivo)` - Extrai número do PAC do nome do arquivo
- `sb.monta_objetivo(numero)` - Monta string de objetivo no formato SIOP

## 🎨 **Padrões de Código**

### **1. Nomenclatura**
```python
# ✅ BOM: Nomes descritivos
class objetivo_especifico:
    def acessa(self): ...
    def lista(self): ...
    def exporta(self): ...

# ❌ EVITAR: Nomes genéricos
class obj:
    def a(self): ...
    def l(self): ...
```

### **2. Encadeamento de Métodos**
```python
# ✅ BOM: Retorna self para encadeamento
def acessa(self):
    sb.acessa("ppa->objetivo")
    return self

def lista(self):
    sb.clica_botao_tipo("Procurar", "submit")
    return self

# Uso: flow.objetivo("0001").acessa().lista()
```

### **3. Tratamento de Erros**
```python
# ✅ BOM: Validações claras
def __init__(self, codigo: str):
    if not codigo or not str(codigo).strip():
        raise ValueError("❌ Código é obrigatório e não pode estar vazio.")
    self.codigo = codigo

# ✅ BOM: Mensagens informativas
print(f"✅ Objetivo '{self.codigo}' acessado com sucesso!")
```

### **4. Configuração Externa**
```python
# ✅ BOM: XPaths em JSON, não hard-coded
sb.preenche_input("Código", "meu.campo.codigo", valor)

# ❌ EVITAR: XPaths hard-coded
driver.find_element(By.XPATH, "//input[@id='codigo']")
```

## 🧪 **Testando Suas Funcionalidades**

### **Teste Manual**
```bash
# Execute seu script
python executa_minha_atividade.py

# Ou via linha de comando
python -c "
from siop_bot import SiopBot
bot = SiopBot()
bot.inicializar()
import flow
flow.minha_atividade('1234').acessa().busca()
bot.finalizar()
"
```

### **Teste Automatizado**
```python
# test_minha_atividade.py
import unittest
from unittest.mock import Mock, patch

class TestMinhaAtividade(unittest.TestCase):
    def setUp(self):
        self.atividade = flow.minha_atividade("1234")
    
    def test_inicializacao(self):
        self.assertEqual(self.atividade.codigo, "1234")
    
    def test_codigo_vazio(self):
        with self.assertRaises(ValueError):
            flow.minha_atividade("")

if __name__ == '__main__':
    unittest.main()
```

## 🚨 **Troubleshooting Comum**

### **1. Edge não inicia**
```
❌ Erro: DevToolsActivePort file doesn't exist
```
**Solução:**
- Feche todas as instâncias do Edge
- Verifique se `msedgedriver.exe` é da mesma versão do Edge
- Confirme caminhos em `config/config.py`

### **2. Elemento não encontrado**
```
❌ Erro: Não encontrei iframe contendo o elemento
```
**Solução:**
- Verifique XPath no DevTools (F12 → Elements → Ctrl+F)
- Confirme se o item está mapeado em `elementos.json`
- Teste se a URL está correta em `urls.json`

### **3. Timeout em elementos**
```
❌ Erro: Timeout ao localizar o campo
```
**Solução:**
- Aumente timeout em `aguarda_elemento()`
- Verifique se a página carregou completamente
- Use `aguarda_jquery()` se a página usa jQuery

## 📖 **Recursos Adicionais**

### **Documentação da API**
- `core/web_actions.py` - Todas as ações web disponíveis
- `core/utils.py` - Funções utilitárias
- `flow/` - Exemplos de implementação

### **Debugging**
```python
# Habilite logs detalhados
import logging
logging.basicConfig(level=logging.DEBUG)

# Capture screenshots em caso de erro
try:
    flow.minha_atividade("1234").acessa()
except Exception as e:
    driver.save_screenshot("erro.png")
    raise
```

### **Performance**
```python
# Reutilize instâncias do bot
bot = SiopBot()
bot.inicializar()

# Execute múltiplos fluxos
flow.programa("1144").acessa().lista()
flow.objetivo_especifico("0001").acessa().lista()

bot.finalizar()
```

## 🤝 **Contribuindo**

1. **Siga os padrões** estabelecidos nos exemplos
2. **Documente** suas funcionalidades
3. **Teste** antes de submeter
4. **Mantenha** XPaths e URLs nos arquivos de configuração
5. **Use** nomes descritivos e mensagens claras

---

## 🎉 **Próximos Passos**

Agora você tem tudo para criar suas próprias funcionalidades! Comece com um fluxo simples e vá expandindo. Se precisar de ajuda:

1. **Analise** os exemplos existentes em `flow/`
2. **Consulte** a documentação das funções em `core/web_actions.py`
3. **Teste** suas implementações passo a passo
4. **Compartilhe** suas soluções com a comunidade

**Boa sorte e happy coding! 🚀**
