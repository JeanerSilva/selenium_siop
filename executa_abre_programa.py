import sys
from siop_bot import SiopBot


def main():
    bot = SiopBot()
    try:
        bot.inicializar()
        bot.executar_fluxos_exemplo()
    except Exception as e:
        print(f"❌ Erro durante execução: {e}")
        raise
    finally:
        bot.finalizar()


if __name__ == "__main__":
    # Execução não interativa com '/y'
    if len(sys.argv) > 1 and sys.argv[1].lower() == '/y':
        main()
    else:
        resposta = input("\n⚠️ Você precisa estar previamente logado no SIOP.\n\n"
                        "O navegador Microsoft Edge será fechado. Deseja continuar? (s/n): ").strip().lower()
        if resposta == 's':
            main()
        else:
            print("Operação cancelada pelo usuário.")


