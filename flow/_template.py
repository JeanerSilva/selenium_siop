# -*- coding: utf-8 -*-
"""
Template para criar novos fluxos no SIOP Bot

COMO USAR:
1. Copie este arquivo para flow/nome_do_seu_fluxo.py
2. Substitua 'MinhaAtividade' pelo nome da sua classe
3. Substitua 'minha_atividade' pelos nomes dos seus métodos
4. Adicione os XPaths necessários em config/elementos.json
5. Adicione as URLs necessárias em config/urls.json
6. Exporte o fluxo em flow/__init__.py
7. Crie um script de execução (opcional)

EXEMPLO DE USO:
    import flow
    flow.minha_atividade("1234").acessa().busca().lista()
"""

import siop_utils as sb


class MinhaAtividade:
    """
    Template para gerenciar operações relacionadas à minha atividade.
    
    Substitua esta descrição pela descrição real da sua funcionalidade.
    """
    
    def __init__(self, codigo: str):
        """
        Inicializa o fluxo com o código necessário.
        
        Args:
            codigo (str): Código da atividade (obrigatório)
            
        Raises:
            ValueError: Se o código estiver vazio ou inválido
        """
        if not codigo or not str(codigo).strip():
            raise ValueError("❌ Código é obrigatório e não pode estar vazio.")
        
        self.codigo = codigo
        print(f"🚀 Iniciando fluxo para atividade: {self.codigo}")
    
    def acessa(self):
        """
        Navega para a página da atividade.
        
        Returns:
            self: Para permitir encadeamento de métodos
        """
        print(f"🌐 Acessando página da atividade {self.codigo}...")
        
        # Navega para a URL mapeada em config/urls.json
        sb.acessa("ppa->minha_atividade")
        
        # Seleciona ano/perfil e entra no iframe que contém o campo alvo
        # O item "meu.campo.codigo" deve estar mapeado em config/elementos.json
        sb.seleciona_ano_e_perfil_e_muda_de_frame("meu.campo.codigo")
        
        print(f"✅ Página da atividade {self.codigo} acessada com sucesso!")
        return self
    
    def busca(self):
        """
        Executa a busca pela atividade.
        
        Returns:
            self: Para permitir encadeamento de métodos
        """
        print(f"🔍 Executando busca para atividade {self.codigo}...")
        
        # Preenche o campo de código
        sb.preenche_input("Código da Atividade", "meu.campo.codigo", self.codigo)
        
        # Clica no botão de busca
        sb.clica_botao_tipo("Procurar", "submit")
        
        print(f"✅ Busca executada para atividade {self.codigo}!")
        return self
    
    def lista(self):
        """
        Lista os resultados da busca.
        
        Returns:
            self: Para permitir encadeamento de métodos
        """
        print(f"📋 Listando resultados para atividade {self.codigo}...")
        
        # Aguarda a tabela de resultados carregar
        # O item "minha.tabela.resultados" deve estar mapeado em config/elementos.json
        sb.aguarda_tabela("Resultados da Atividade", "minha.tabela.resultados")
        
        print(f"✅ Resultados listados para atividade {self.codigo}!")
        return self
    
    def salva(self):
        """
        Salva as alterações na atividade.
        
        Returns:
            self: Para permitir encadeamento de métodos
        """
        print(f"💾 Salvando alterações para atividade {self.codigo}...")
        
        # Clica no botão de salvar
        sb.clica_botao_tipo("Salvar", "submit")
        
        print(f"✅ Alterações salvas para atividade {self.codigo}!")
        return self
    
    def limpa(self):
        """
        Limpa os campos do formulário.
        
        Returns:
            self: Para permitir encadeamento de métodos
        """
        print(f"🧹 Limpando formulário da atividade {self.codigo}...")
        
        # Clica no botão de limpar
        sb.clica_botao_tipo("Limpar", "submit")
        
        print(f"✅ Formulário limpo para atividade {self.codigo}!")
        return self
    
    def exporta(self):
        """
        Exporta os resultados da atividade.
        
        Returns:
            self: Para permitir encadeamento de métodos
        """
        print(f"📤 Exportando resultados da atividade {self.codigo}...")
        
        # Aguarda a tabela carregar
        sb.aguarda_tabela("Resultados da Atividade", "minha.tabela.resultados")
        
        # Clica no botão de exportar
        sb.clica_botao_tipo("Exportar...", "button")
        
        print(f"✅ Resultados exportados da atividade {self.codigo}!")
        return self


# Exemplo de uso do template:
if __name__ == "__main__":
    """
    Exemplo de como usar este fluxo.
    
    Para testar, execute:
        python flow/_template.py
    """
    try:
        # Cria uma instância do fluxo
        atividade = MinhaAtividade("1234")
        
        # Executa o fluxo completo
        atividade.acessa().busca().lista()
        
        print("✅ Fluxo executado com sucesso!")
        
    except Exception as e:
        print(f"❌ Erro durante execução: {e}")
        raise
