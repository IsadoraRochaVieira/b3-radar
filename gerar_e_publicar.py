"""
Roda toda manhã via Task Scheduler.
1. Executa o analisador_b3_4.py
2. Converte o output em JSON estruturado
3. Salva em relatorios/YYYY-MM-DD.json
4. Faz git add + commit + push → Vercel publica automaticamente
"""

import subprocess
import json
import os
import sys
import re
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent
ANALISADOR = ROOT.parent / "analisador_b3_4.py"
RELATORIOS_DIR = ROOT / "relatorios"
RELATORIOS_DIR.mkdir(exist_ok=True)

hoje = datetime.now().strftime("%Y-%m-%d")
hora = datetime.now().strftime("%H:%M")


def rodar_analisador():
    print(f"[{hora}] Rodando analisador...")
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    result = subprocess.run(
        [sys.executable, "-X", "utf8", str(ANALISADOR)],
        capture_output=True, text=True, env=env, encoding="utf-8"
    )
    return result.stdout + result.stderr


def parse_output(output: str) -> dict:
    """Extrai dados estruturados do output do analisador."""
    candidatos = []
    plano = []

    # Extrai ativos do ranking
    # Padrão: linha com ticker, score, preço, RSI etc.
    blocos = re.split(r'\n(?=🟢|🟡|⚪|🔴)', output)
    for bloco in blocos:
        linhas = bloco.strip().splitlines()
        if not linhas:
            continue
        primeira = linhas[0]

        # Detecta classificação
        if '🟢' in primeira:
            acao = 'COMPRAR'
        elif '🟡' in primeira:
            acao = 'OBSERVAR'
        elif '🔴' in primeira:
            acao = 'EVITAR'
        else:
            acao = 'NEUTRO'

        # Extrai ticker e score
        m_ticker = re.search(r'\b([A-Z]{4}\d{1,2})\b', primeira)
        m_score = re.search(r'Score:\s*(\d+)', primeira)
        if not m_ticker:
            continue

        ticker = m_ticker.group(1)
        score = int(m_score.group(1)) if m_score else 0

        # Linha de preço/indicadores
        preco = rsi = pl = None
        for l in linhas[1:]:
            m_preco = re.search(r'Preço:\s*R\$\s*([\d,.]+)', l)
            m_rsi = re.search(r'RSI:\s*([\d.]+)', l)
            m_pl = re.search(r'P/L:\s*([\d.]+)', l)
            if m_preco: preco = m_preco.group(1).replace(',', '.')
            if m_rsi: rsi = float(m_rsi.group(1))
            if m_pl: pl = float(m_pl.group(1))

        if score >= 40 and acao != 'EVITAR':
            candidatos.append({
                "ticker": ticker,
                "nome": ticker,
                "score": score,
                "acao": acao,
                "preco": preco,
                "rsi": rsi,
                "pl": pl,
                "tese": None,
                "risco": None,
                "entrada": preco,
                "stop": None,
                "alvo": None,
            })

    # Extrai sugestão de alocação (plano)
    alocacao = re.findall(
        r'(🟢|🟡|⚪)\s+([A-Z]{4}\d{1,2})\s+R\$\s*([\d,. ]+)\s+\(\d+%\)',
        output
    )
    for _, ticker, valor in alocacao:
        plano.append({
            "ativo": ticker,
            "acao": "COMPRAR",
            "valor": f"R$ {valor.strip()}",
            "entrada": "-",
            "stop": "-",
            "alvo": "-",
        })

    # Resumo curto automático
    tops = [c["ticker"] for c in candidatos[:3]]
    resumo = f"Destaques: {', '.join(tops)}" if tops else "Sem candidatos acima do limiar hoje."

    return {
        "data": datetime.now().strftime("%d/%m/%Y"),
        "data_iso": hoje,
        "resumo": resumo,
        "resumo_curto": resumo,
        "resumo_executivo": "",
        "macro": {
            "ibovespa": "-",
            "ibovespa_var": 0,
            "dolar": "-",
            "selic": "14,25",
            "brent": "-",
        },
        "tops": [{"ticker": c["ticker"], "score": c["score"]} for c in candidatos[:5]],
        "candidatos": candidatos,
        "plano": plano,
        "output_raw": output[:3000],
    }


def salvar_json(dados: dict):
    destino = RELATORIOS_DIR / f"{hoje}.json"
    with open(destino, "w", encoding="utf-8") as f:
        json.dump(dados, f, ensure_ascii=False, indent=2)
    print(f"[OK] Salvo em {destino}")
    return destino


def git_push():
    print("[GIT] Fazendo commit e push...")
    cmds = [
        ["git", "-C", str(ROOT), "add", "-A"],
        ["git", "-C", str(ROOT), "commit", "-m", f"relatorio: {hoje}"],
        ["git", "-C", str(ROOT), "push"],
    ]
    for cmd in cmds:
        r = subprocess.run(cmd, capture_output=True, text=True)
        if r.returncode != 0 and "nothing to commit" not in r.stdout + r.stderr:
            print(f"[ERRO] {' '.join(cmd)}: {r.stderr}")
        else:
            print(f"[OK] {' '.join(cmd[2:])}")


if __name__ == "__main__":
    output = rodar_analisador()
    dados = parse_output(output)
    salvar_json(dados)
    git_push()
    print(f"\n✅ Relatório {hoje} publicado com sucesso!")
