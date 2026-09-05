import json
import os
import re
import urllib.request
from datetime import datetime
from pathlib import Path

ROOT = Path(__file__).parent.parent
BLOG_DIR = ROOT / "caryoblog" / "public" / "data"
BLOG_DIR.mkdir(parents=True, exist_ok=True)

def chamar_gemini(prompt: str) -> str | None:
    key = os.environ.get("GEMINI_API_KEY")
    if not key:
        print("ERRO: GEMINI_API_KEY não definida.")
        return None
    
    payload = json.dumps({
        "contents": [{"parts": [{"text": prompt}]}],
        "generationConfig": {"temperature": 0.8, "maxOutputTokens": 4000},
    }).encode()
    url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={key}"
    
    try:
        req = urllib.request.Request(url, data=payload, headers={"Content-Type": "application/json"})
        with urllib.request.urlopen(req, timeout=120) as r:
            d = json.loads(r.read())
            return d["candidates"][0]["content"]["parts"][0]["text"].strip()
    except Exception as e:
        print(f"Erro ao chamar Gemini: {e}")
        return None

def gerar_posts_blog():
    print(f"[{datetime.now().strftime('%H:%M:%S')}] Iniciando Geração do Blog...")
    
    prompt = """Você é o Redator Principal do 'Caryo Blog', uma plataforma de ensino 'do zero a analista top' que mistura Mercado Financeiro, Programação (Python/TI), Dados e Inteligência Artificial.
Sua missão de hoje é escrever 10 posts (artigos curtos de blog) em português, muito divertidos, ácidos, inteligentes e didáticos.

Gere exatamente 10 postagens cobrindo os seguintes temas (distribua aleatoriamente):
- Finanças Básicas (entendo P/L, ROE, balanços da CVM, candlesticks)
- Certificações (Dicas para CNPI-T, CPA, CEA)
- Python para Traders (como usar Pandas, yfinance)
- IA e Trading (Machine learning no mercado, Spike Predictor)

Retorne EXCLUSIVAMENTE um JSON válido contendo um array de objetos. Não inclua Markdown, crases ou explicações fora do JSON.
Formato exato:
[
  {
    "id": "post-1",
    "titulo": "Entendendo o ROE como um Hacker",
    "categoria": "Finanças Básicas",
    "autor": "Caryo AI",
    "conteudo": "Parágrafo 1.\\n\\nParágrafo 2.\\n\\nParágrafo 3."
  },
  ...
]"""

    resposta = chamar_gemini(prompt)
    if not resposta:
        print("Falha na geração dos posts.")
        return
    
    # Limpar markdown do JSON se a IA retornar com crases
    resposta = re.sub(r"^```json", "", resposta).strip()
    resposta = re.sub(r"```$", "", resposta).strip()
    
    try:
        posts = json.loads(resposta)
    except Exception as e:
        print(f"Erro ao parsear JSON retornado pela IA: {e}")
        print(f"Retorno foi: {resposta[:500]}...")
        return
        
    hoje = datetime.now().strftime("%Y-%m-%d")
    arquivo_saida = BLOG_DIR / f"posts_{hoje}.json"
    
    # Adicionar metadados de data aos posts
    for post in posts:
        post["data"] = hoje
        
    with open(arquivo_saida, "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)
        
    print(f"[OK] 10 posts gerados e salvos em {arquivo_saida}")
    
    latest = BLOG_DIR / "latest.json"
    with open(latest, "w", encoding="utf-8") as f:
        json.dump({"arquivo": f"posts_{hoje}.json", "data": hoje, "posts": posts}, f, ensure_ascii=False, indent=2)
    print(f"[OK] latest.json atualizado.")

    import subprocess
    print("[GIT] Fazendo commit e push do Caryoblog...")
    for repo in [ROOT / "caryoblog"]:
        if (repo / ".git").exists() or (ROOT / ".git").exists():
            subprocess.run(["git", "-C", str(repo), "add", "-A"], check=False)
            subprocess.run(["git", "-C", str(repo), "commit", "-m", f"blog: publicando 10 posts do dia {hoje}"], check=False)
            subprocess.run(["git", "-C", str(repo), "push"], check=False)
    print(f"[OK] Blog do dia {hoje} no ar!")

if __name__ == "__main__":
    gerar_posts_blog()
