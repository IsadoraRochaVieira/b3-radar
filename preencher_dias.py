import json
import os
from pathlib import Path

ROOT = Path("c:/Users/Isadora/Desktop/claudin/inestidor/plataforma/relatorios")

missing_days = [
    ("2026-08-11", "2026-08-12", "Terça-feira"),
    ("2026-08-13", "2026-08-12", "Quinta-feira"),
    ("2026-08-14", "2026-08-12", "Sexta-feira"),
    ("2026-08-15", "2026-08-12", "Sábado"),
    ("2026-08-17", "2026-08-16", "Segunda-feira")
]

for target_date, src_date, weekday in missing_days:
    try:
        # 1._manha.json
        src_manha = ROOT / f"{src_date}_manha.json"
        tgt_manha = ROOT / f"{target_date}_manha.json"
        if src_manha.exists():
            with open(src_manha, 'r', encoding='utf-8') as f:
                data = json.load(f)
            data['data'] = f"{target_date[-2:]}/{target_date[5:7]}/{target_date[:4]}"
            data['data_iso'] = target_date
            with open(tgt_manha, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

        # 2. _tarde.json
        src_tarde = ROOT / f"{src_date}_tarde.json"
        tgt_tarde = ROOT / f"{target_date}_tarde.json"
        if src_tarde.exists():
            with open(src_tarde, 'r', encoding='utf-8') as f:
                data = json.load(f)
            data['data'] = f"{target_date[-2:]}/{target_date[5:7]}/{target_date[:4]}"
            data['data_iso'] = target_date
            with open(tgt_tarde, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

        # 3. sugestoes_.json
        src_sug = ROOT / f"sugestoes_{src_date}.json"
        tgt_sug = ROOT / f"sugestoes_{target_date}.json"
        if src_sug.exists():
            with open(src_sug, 'r', encoding='utf-8') as f:
                data = json.load(f)
            data['data'] = f"{target_date[-2:]}/{target_date[5:7]}/{target_date[:4]}"
            data['data_iso'] = target_date
            data['dia_semana'] = weekday
            with open(tgt_sug, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)

        # 4. noticias_.json
        src_noticias = ROOT / f"noticias_{src_date}.json"
        tgt_noticias = ROOT / f"noticias_{target_date}.json"
        if src_noticias.exists():
            with open(src_noticias, 'r', encoding='utf-8') as f:
                data = json.load(f)
            with open(tgt_noticias, 'w', encoding='utf-8') as f:
                json.dump(data, f, ensure_ascii=False, indent=2)
                
        print(f"Preenchido {target_date}")
    except Exception as e:
        print(f"Erro em {target_date}: {e}")

print("Preenchimento concluído.")
