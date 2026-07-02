"""
Roda toda manhã via Task Scheduler.
1. Executa o analisador_b3_4.py
2. Coleta dados macro ao vivo (Selic, Dólar, Brent, Ibovespa)
3. Roda backtesting das sugestões anteriores
4. Salva tudo em relatorios/YYYY-MM-DD.json
5. Faz git push → Vercel publica automaticamente
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

sys.path.insert(0, str(ROOT))
from macro_ao_vivo import coletar_macro
from backtesting import rodar_backtest_completo


def rodar_analisador() -> str:
    print(f"[{hora}] Rodando analisador...")
    env = os.environ.copy()
    env["PYTHONIOENCODING"] = "utf-8"
    result = subprocess.run(
        [sys.executable, "-X", "utf8", str(ANALISADOR)],
        capture_output=True, text=True, env=env, encoding="utf-8"
    )
    return result.stdout + result.stderr


def parse_output(output: str) -> list:
    """Extrai candidatos estruturados do output do analisador."""
    candidatos = []
    blocos = re.split(r'\n(?=🟢|🟡|⚪|🔴)', output)

    for bloco in blocos:
        linhas = bloco.strip().splitlines()
        if not linhas:
            continue
        primeira = linhas[0]

        if '🟢' in primeira:
            acao = 'COMPRAR'
        elif '🟡' in primeira:
            acao = 'OBSERVAR'
        elif '🔴' in primeira:
            acao = 'EVITAR'
        else:
            acao = 'NEUTRO'

        m_ticker = re.search(r'\b([A-Z]{4}\d{1,2})\b', primeira)
        m_score = re.search(r'Score:\s*(\d+)', primeira)
        if not m_ticker:
            continue

        ticker = m_ticker.group(1)
        score = int(m_score.group(1)) if m_score else 0

        preco = rsi = pl = atr = None
        pontos = []

        for l in linhas[1:]:
            if re.match(r'\s*•', l):
                pontos.append(l.strip().lstrip('•').strip())
                continue
            m = re.search(r'Preço:\s*R\$\s*([\d,.]+)', l)
            if m: preco = m.group(1).replace(',', '.')
            m = re.search(r'RSI:\s*([\d.]+)', l)
            if m: rsi = float(m.group(1))
            m = re.search(r'P/L:\s*([\d.]+)', l)
            if m: pl = float(m.group(1))
            m = re.search(r'ATR:\s*([\d.]+)%', l)
            if m: atr = float(m.group(1))

        entrada = float(preco) if preco else None
        stop = round(entrada * (1 - (atr or 2.5) * 2 / 100), 2) if entrada and atr else None
        alvo = round(entrada * 1.15, 2) if entrada else None

        candidatos.append({
            "ticker": ticker,
            "nome": ticker,
            "score": score,
            "acao": acao,
            "preco": preco,
            "rsi": rsi,
            "pl": pl,
            "atr": atr,
            "pontos": pontos,
            "tese": None,
            "risco": None,
            "entrada": str(entrada) if entrada else None,
            "stop": str(stop) if stop else None,
            "alvo": str(alvo) if alvo else None,
        })

    return candidatos


def montar_plano(candidatos: list) -> list:
    plano = []
    capital_disponivel = 8500
    aprovados = [c for c in candidatos if c["score"] >= 40 and c["acao"] != "EVITAR"]
    if not aprovados:
        return plano
    por_ativo = round(capital_disponivel / len(aprovados), 2)
    for c in aprovados:
        plano.append({
            "ativo": c["ticker"],
            "acao": "COMPRAR",
            "valor": f"R$ {por_ativo:,.2f}".replace(",", "X").replace(".", ",").replace("X", "."),
            "entrada": f"R$ {c['entrada']}" if c.get("entrada") else "-",
            "stop": f"R$ {c['stop']}" if c.get("stop") else "-",
            "alvo": f"R$ {c['alvo']}" if c.get("alvo") else "-",
        })
    return plano


def salvar_relatorio(dados: dict):
    destino = RELATORIOS_DIR / f"{hoje}.json"
    destino.write_text(json.dumps(dados, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] Salvo em {destino}")


def git_push():
    print("[GIT] Fazendo commit e push...")
    cmds = [
        ["git", "-C", str(ROOT), "add", "-A"],
        ["git", "-C", str(ROOT), "commit", "-m", f"relatorio: {hoje} | auto-push"],
        ["git", "-C", str(ROOT), "push"],
    ]
    for cmd in cmds:
        r = subprocess.run(cmd, capture_output=True, text=True)
        saida = r.stdout + r.stderr
        if "nothing to commit" in saida:
            print(f"  [INFO] Nada a commitar.")
        elif r.returncode != 0:
            print(f"  [ERRO] {saida.strip()}")
        else:
            print(f"  [OK] {' '.join(cmd[2:])}")


if __name__ == "__main__":
    print("=" * 55)
    print(f"  B3 RADAR — {datetime.now().strftime('%d/%m/%Y %H:%M')}")
    print("=" * 55)

    # 1. Analisador técnico
    output = rodar_analisador()
    candidatos = parse_output(output)
    aprovados = [c for c in candidatos if c["score"] >= 40 and c["acao"] != "EVITAR"]
    tops = sorted(candidatos, key=lambda x: x["score"], reverse=True)[:5]
    print(f"[OK] {len(candidatos)} ativos analisados, {len(aprovados)} candidatos.")

    # 2. Macro ao vivo
    macro = coletar_macro()

    # 3. Backtesting
    metricas_bt = rodar_backtest_completo(aprovados, hoje)

    # 4. Montar plano
    plano = montar_plano(aprovados)

    # 5. Semáforo de risco semanal
    vix = macro.get("vix", 20)
    ibov_var = macro.get("ibovespa_var", 0) or 0
    try:
        vix = float(vix)
    except (TypeError, ValueError):
        vix = 20
    if vix >= 30 or abs(ibov_var) >= 3:
        semaforo = "vermelho"
    elif vix >= 22 or abs(ibov_var) >= 1.5:
        semaforo = "amarelo"
    else:
        semaforo = "verde"

    # 6. Pick da semana — melhor candidato COMPRAR com maior score
    pick_semana = None
    compras = [c for c in aprovados if c.get("acao") == "COMPRAR"]
    if compras:
        pick_semana = sorted(compras, key=lambda x: x["score"], reverse=True)[0]

    # 7. Resumo automático
    tickers_top = [c["ticker"] for c in aprovados[:3]]
    resumo = (
        f"Ibovespa {macro.get('ibovespa', '-')} ({ibov_var:+.2f}%). "
        f"Destaques: {', '.join(tickers_top) if tickers_top else 'nenhum acima do limiar'}. "
        f"Taxa de acerto histórica: {metricas_bt.get('taxa_acerto', 0)}%."
    )

    relatorio = {
        "data": datetime.now().strftime("%d/%m/%Y"),
        "data_iso": hoje,
        "resumo": resumo,
        "resumo_curto": ", ".join(tickers_top) if tickers_top else "Sem candidatos hoje",
        "resumo_executivo": "",
        "semaforo": semaforo,
        "pick_semana": pick_semana,
        "macro": macro,
        "tops": [{"ticker": c["ticker"], "score": c["score"]} for c in tops],
        "candidatos": aprovados,
        "plano": plano,
        "backtesting": metricas_bt,
        "output_raw": output[:3000],
    }

    salvar_relatorio(relatorio)
    git_push()

    print(f"\n✅ Relatório {hoje} publicado!")
    print(f"   Taxa de acerto: {metricas_bt.get('taxa_acerto', 0)}% | "
          f"Retorno médio: {metricas_bt.get('retorno_medio_pct', 0):+.2f}%")
