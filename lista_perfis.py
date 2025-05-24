import json
import os

# Caminho para o arquivo "Local State"
local_state_path = r'C:\Users\1765 IRON\AppData\Local\Microsoft\Edge\User Data\Local State'

def listar_perfis(local_state_path):
    if not os.path.exists(local_state_path):
        print("❌ Arquivo Local State não encontrado.")
        return

    with open(local_state_path, encoding='utf-8') as f:
        data = json.load(f)

    perfis = data.get("profile", {}).get("info_cache", {})
    if not perfis:
        print("❌ Nenhum perfil encontrado.")
        return

    print("📄 Perfis encontrados:\n")
    for pasta, info in perfis.items():
        nome = info.get("name", "(sem nome)")
        print(f"→ Nome exibido: {nome:<20} | Pasta: {pasta}")

if __name__ == "__main__":
    listar_perfis(local_state_path)
