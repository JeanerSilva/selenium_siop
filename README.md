# 🚀 SIOP Bot - Nova Arquitetura

## 📁 Estrutura

```
siop-bot/
├── core/                          # 🎯 Módulo principal
│   ├── __init__.py               # Exporta componentes principais
│   ├── driver_manager.py         # Gerencia driver Edge
│   ├── element_manager.py        # Gerencia elementos JSON
│   ├── web_actions.py            # Executa ações web
│   └── utils.py                  # Utilitários específicos
├── flow/                         # 📋 Fluxos de negócio
│   ├── __init__.py               # Exporta fluxos
│   ├── pac.py                    # Fluxo de atualização PAC
│   ├── programa.py               # Fluxo de programa individual
│   ├── programas.py              # Fluxo de listagem de programas
│   ├── objetivo_especifico.py    # Fluxo de objetivo específico
│   ├── objetivos_especificos.py  # Fluxo de listagem de objetivos
│   ├── entrega.py                # Fluxo de entrega individual
│   ├── entregas.py               # Fluxo de listagem de entregas
│   └── ...                       # Outros fluxos
├── config/                       # ⚙️ Configurações
│   ├── config.py                 # Configuração principal
│   ├── elementos.json            # Elementos da interface
│   └── urls.json                 # URLs das atividades
├── siop_bot.py                   # 🚀 Arquivo principal refatorado
├── carrega_pac.py                # 🎯 Script específico para carregamento PAC
├── exemplo_uso.py                # 📚 Exemplos de uso
├── test_siop_bot.py              # 🧪 Testes unitários
├── run_tests.py                  # 🏃 Script de execução de testes
└── requirements.txt               # 📦 Dependências atualizadas
```

## 🎯 Como Usar

### Execução Principal
```bash
python siop_bot.py
```

### Execução Específica (PAC 2024)
```bash
python carrega_pac.py
```

### Execução Automática
```bash
python siop_bot.py /y
python carrega_pac.py /y
```

### Executar Testes
```bash
python run_tests.py
# ou
pytest test_siop_bot.py -v
```

## 🧪 Criando Novos Fluxos

### Fluxo Básico
```python
from core import WebActions, ElementManager
from config import config

class MeuNovoFluxo:
    def __init__(self, web_actions: WebActions, element_manager: ElementManager):
        self.web_actions = web_actions
        self.element_manager = element_manager
    
    def executar(self):
        # Seu fluxo aqui
        self.web_actions.acessa("minha_atividade")
        # ...
```

### Script Específico
```python
# meu_script.py
from siop_bot import SiopBot

def main():
    bot = SiopBot()
    try:
        bot.inicializar()
        bot.executar_meu_fluxo()  # seu método personalizado
    except Exception as e:
        print(f"❌ Erro: {e}")
        raise
    finally:
        bot.finalizar()

if __name__ == "__main__":
    main()
```

## 🎯 Benefícios da Nova Arquitetura

### ✅ Testável
- Cada componente pode ser testado isoladamente
- Mock objects fáceis de criar
- Testes unitários independentes

### ✅ Manutenível
- Responsabilidades claras e separadas
- Código organizado e legível
- Fácil de debugar

### ✅ Extensível
- Fácil adicionar novos fluxos
- Novos componentes sem afetar existentes
- Arquitetura modular

### ✅ Reutilizável
- Componentes podem ser reutilizados
- Dependências injetadas
- Baixo acoplamento

### ✅ Padrões
- Segue princípios SOLID
- Clean Architecture
- Dependency Injection

## 🔄 Migração

### O que mudou:
1. **`siop_utils.py`** → **`core/`** (módulos separados)
2. **Variáveis globais** → **Injeção de dependências**
3. **Imports circulares** → **Arquitetura limpa**
4. **Funções soltas** → **Classes organizadas**
5. **Importação tardia** → **Evita dependências circulares**

### O que permaneceu:
1. **Fluxos existentes** continuam funcionando
2. **Configurações** mantidas
3. **Funcionalidades** preservadas
4. **Interface** similar

## 🚀 Próximos Passos

1. **Teste a nova arquitetura**:
   ```bash
   python run_tests.py
   ```

2. **Execute a aplicação completa**:
   ```bash
   python siop_bot.py
   ```

3. **Execute carregamento específico**:
   ```bash
   python carrega_pac.py
   ```

4. **Explore os exemplos**:
   ```bash
   python exemplo_uso.py
   ```

5. **Crie novos fluxos** seguindo o padrão estabelecido

## 🔧 Resolução de Problemas

### Importação Circular Resolvida
- **Problema**: `siop_utils.py` importava `siop_bot.py` no topo
- **Solução**: Importação tardia de `main()` apenas quando necessário
- **Resultado**: Scripts específicos como `carrega_pac.py` funcionam independentemente

### Compatibilidade com Fluxos Existentes
- Os fluxos em `flow/` continuam usando `siop_utils` (sb)
- O driver é injetado do `core/` para o `sb` durante inicialização
- Funcionalidade preservada com arquitetura limpa

## 📁 Scripts Disponíveis

### Scripts Principais
- **`siop_bot.py`**: Aplicação completa com todos os fluxos
- **`carrega_pac.py`**: Script específico para carregamento PAC 2024

### Scripts de Desenvolvimento
- **`exemplo_uso.py`**: Exemplos de uso da nova arquitetura
- **`test_siop_bot.py`**: Testes unitários
- **`run_tests.py`**: Executor de testes automatizado

### Scripts de Configuração
- **`pytest.ini`**: Configuração para testes
- **`requirements.txt`**: Dependências atualizadas

## 📚 Documentação Adicional

- **`exemplo_uso.py`**: Exemplos práticos de uso
- **`test_siop_bot.py`**: Testes unitários
- **`run_tests.py`**: Script de execução de testes
- **`pytest.ini`**: Configuração do pytest
- **`carrega_pac.py`**: Exemplo de script específico

---

## 🎉 Conclusão

A aplicação agora está muito mais profissional e fácil de manter! Os problemas de importação circular foram resolvidos, permitindo criar scripts específicos como `carrega_pac.py` sem conflitos. Você pode continuar desenvolvendo novos fluxos seguindo o padrão estabelecido, com a confiança de que a arquitetura é sólida, testável e livre de dependências circulares.

**Principais conquistas:**
- ✅ Código organizado e legível
- ✅ Arquitetura testável
- ✅ Dependências claras
- ✅ Fácil manutenção
- ✅ Padrões profissionais
- ✅ Imports circulares eliminados
- ✅ Scripts específicos funcionando
- ✅ Compatibilidade com fluxos existentes
