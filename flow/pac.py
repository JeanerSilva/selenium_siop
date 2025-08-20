import os
from pathlib import Path
from core import extrai_numero_pac, monta_objetivo, criar_pasta_se_nao_existe, renomear_arquivo_processado
from .objetivo_especifico import objetivo_especifico


class pac_lote:
    def __init__(self, exercicio: str, pasta: str, data_referencia: str, reiniciar_driver_entre_arquivos: bool = True, apaga_antes: bool = True):
        if not exercicio or not str(exercicio).strip():
            raise ValueError("❌ Parâmetro 'exercicio' é obrigatório e não pode estar vazio.")
        if not pasta or not str(pasta).strip():
            raise ValueError("❌ Parâmetro 'pasta' é obrigatório e não pode estar vazio.")
        if not data_referencia or not str(data_referencia).strip():
            raise ValueError("❌ Parâmetro 'data_referencia' é obrigatório e não pode estar vazio.")

        self.exercicio = exercicio
        self.pasta = pasta
        self.data_referencia = data_referencia
        self.reiniciar_driver_entre_arquivos = reiniciar_driver_entre_arquivos
        self.apaga_antes = apaga_antes

    def atualizar(self):
        # Importa aqui para evitar dependência circular
        import siop_utils as sb
        
        print(f"🧭 Iniciando atualização PAC em lote | exercicio={self.exercicio} | pasta={self.pasta} | data_ref={self.data_referencia} | apaga_antes={self.apaga_antes} | reinicia_driver={self.reiniciar_driver_entre_arquivos}")
        sb.define_exercicio(self.exercicio)
        criar_pasta_se_nao_existe("prints")

        path = Path(self.pasta)
        arquivos = sorted(path.glob("*.xlsx"))
        print(f"📂 Pasta analisada: {path}")
        print(f"📝 Total de arquivos .xlsx encontrados: {len(arquivos)}")
        if not arquivos:
            print("⚠️ Nenhum arquivo encontrado.")
            return

        processados = 0
        pulados_enviados = 0
        pulados_sem_numero = 0

        for arq in arquivos:
            print(f"\n➡️ Iniciando processamento: {arq.name}")
            if arq.name.startswith("enviado."):
                pulados_enviados += 1
                print(f"⏭️ Pulando (prefixo 'enviado.'): {arq.name}")
                continue

            num = extrai_numero_pac(arq.name)
            if num is None:
                pulados_sem_numero += 1
                print(f"⏭️ Pulando (sem número PAC no nome): {arq.name}")
                continue

            objetivo = monta_objetivo(num)
            arquivo = str(path / arq.name)
            print(f"🎯 Objetivo montado: {objetivo} | Arquivo: {arquivo}")

            fluxo = objetivo_especifico(objetivo)\
                .acessa()\
                .lista()\
                .seleciona_objetivo_listado()

            if self.apaga_antes:
                print("🗑️ Apagando arquivo PAC anterior (se existir)...")
                fluxo = fluxo.apaga_arquivo_pac()

            print("⬆️ Enviando novo arquivo PAC...")
            fluxo.adiciona_arquivo_pac(
                f"OE {objetivo}: Ações do Novo PAC (Data de referência: {self.data_referencia}).",
                arquivo,
                objetivo,
                self.exercicio,
            )

            print(f"✅ OE {objetivo} atualizado com sucesso.")
            processados += 1

            # Renomeia arquivo para indicar que foi processado
            renomear_arquivo_processado(arq)

            if self.reiniciar_driver_entre_arquivos:
                print("🔁 Reiniciando driver para próximo arquivo...")
                sb.encerra()
                sb.finaliza_navegador()
                sb.iniciar_driver()

        print("\n📊 Resumo da execução:")
        print(f"   ✅ Processados: {processados}")
        print(f"   ⏭️ Pulados (já enviados): {pulados_enviados}")
        print(f"   ⏭️ Pulados (sem número PAC): {pulados_sem_numero}")
        print("🏁 Fim da atualização PAC em lote.")
        return self


def atualizar_pac_em_lote(exercicio: str, pasta: str, data_referencia: str, reiniciar_driver_entre_arquivos: bool = True, apaga_antes: bool = True):
    return pac_lote(exercicio, pasta, data_referencia, reiniciar_driver_entre_arquivos, apaga_antes).atualizar()


