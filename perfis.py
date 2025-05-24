import os

perfil_path = r"C:\Users\1765 IRON\AppData\Local\Microsoft\Edge\User Data\selenium"

print("Perfis encontrados:")
for pasta in os.listdir(perfil_path):
    full_path = os.path.join(perfil_path, pasta)
    if os.path.isdir(full_path) and any(
        fname in os.listdir(full_path)
        for fname in ["Preferences", "Cookies", "History"]
    ):
        print("-", pasta)
