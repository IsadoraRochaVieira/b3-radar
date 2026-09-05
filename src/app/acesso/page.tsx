import type { Metadata } from 'next'

export const metadata: Metadata = { title: 'Acesso privado · Caryo Map', robots: { index: false, follow: false } }

export default async function AccessPage({ searchParams }: { searchParams: Promise<{ erro?: string; next?: string }> }) {
  const query = await searchParams
  return <main className="private-access">
    <div className="private-pequi" aria-hidden="true"><span>◉</span></div>
    <section className="private-card">
      <span className="private-kicker">AMBIENTE PRIVADO · DESENVOLVIMENTO</span><h1>Caryo <em>Map</em></h1>
      <p>O acesso público está temporariamente suspenso enquanto o projeto passa por revisão regulatória.</p>
      <form method="post" action="/api/access">
        <input type="hidden" name="next" value={query.next ?? '/painel'}/>
        <label htmlFor="password">Senha de acesso</label><input id="password" name="password" type="password" autoComplete="current-password" required autoFocus maxLength={128}/>
        {query.erro === 'senha' ? <p className="private-error" role="alert">Senha incorreta. Tente novamente.</p> : null}
        {query.erro === 'config' ? <p className="private-error" role="alert">O acesso ainda não foi configurado. Fale com a responsável pelo projeto.</p> : null}
        <button type="submit">Entrar no ambiente</button>
      </form>
      <small>Uso interno e de desenvolvimento. O acesso privado não representa autorização ou regularização perante a CVM.</small>
    </section>
  </main>
}
