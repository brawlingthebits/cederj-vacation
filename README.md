
# quero-ferias-cederj

Calculadora de notas do CEDERJ feita em Flask. Ela mostra quanto você precisa tirar na AP2 para fechar média 6 e, se não der, quanto precisa na AP3 para chegar a 5.

No ar em https://quero-ferias-cederj.fly.dev/

## Cursos

### Computação

O site abre em Computação, onde a AD vale 20% e a AP vale 80%:

- `/`: quanto você precisa tirar na AP2 para fechar média 6 (o cálculo roda no servidor, em `/calculate`).
- `/ap3.html`: com N1 e N2 do SCA, se você já passou ou quanto precisa na AP3 para chegar a 5.

Regra: N1 e N2 = (AD×2 + AP×8)/10; N = (N1 + N2)/2; se N ≥ 6, aprovado. Senão, NF = [MAIOR(N1, N2) + AP3]/2.

### Biblioteconomia

A seleção de curso leva a Biblioteconomia, onde a AD vale 40% e a AP vale 60%:

- `/biblioteconomia.html`: quanto você precisa tirar na AP2 (ou na AP, em disciplinas de 30h) para fechar média 6.
- `/biblioteconomia-ap3.html`: com N1 e N2 do SCA, se você já passou ou quanto precisa na AP3 para chegar a 5.

Nas duas telas você escolhe a carga horária da disciplina:

- **60h (regra #19)**: N1 e N2 = (AD×4 + AP×6)/10; N = (N1 + N2)/2; se N ≥ 6, aprovado. Senão, NF = [MAIOR(N1, N2) + AP3]/2.
- **30h (regras #37 e #38)**: só uma AD e uma AP; N = (AD×4 + AP×6)/10; NF = (N + AP3)/2.

## Estrutura

- `app.py`: servidor Flask, API de cálculo e cabeçalhos de segurança.
- `gunicorn.conf.py`: configuração do servidor de produção.
- `*.html`: as quatro páginas.
- `static/computacao.*` e `static/computacao-ap*.js`: visual de fliperama e scripts de Computação.
- `static/biblioteconomia.*` e `static/biblioteconomia-ap*.js`: visual de fichário e scripts de Biblioteconomia.
- `static/fonts/`: fontes hospedadas no próprio site, com as licenças.
- `static/assets/`: ícones do rodapé.

## Rodando localmente

Precisa de Python 3.10 ou mais novo.

```bash
python3 -m venv venv
source venv/bin/activate  # No Windows: venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

Acesse `http://localhost:8080`. O `python app.py` usa o servidor de desenvolvimento do Flask. Para rodar como em produção (não funciona no Windows):

```bash
gunicorn --config gunicorn.conf.py app:app
```

## Deploy no Fly.io

O `fly.toml` fica fora do Git (está no `.gitignore`). Com o `flyctl` instalado e logado, na raiz do projeto:

```bash
flyctl deploy -a quero-ferias-cederj
```

O `Dockerfile` usa Python 3.13, roda com um usuário sem privilégios e sobe o site com o gunicorn na porta 8080.

## Segurança

- **CSP estrita**: scripts, estilos e fontes só vêm do próprio site. Não há script nem estilo inline, e o site não pode ser aberto dentro de iframes.
- **Outros cabeçalhos**: HSTS, `X-Content-Type-Options`, `Referrer-Policy: no-referrer`, `Permissions-Policy` e `Cross-Origin-Opener-Policy`/`Cross-Origin-Resource-Policy`. O cabeçalho `Server` não revela a versão.
- **API**: aceita só JSON de até 1KB, com exatamente os campos esperados e números finitos entre 0 e 10 (texto, `true` e `NaN` são recusados). Erros voltam em JSON, sem detalhes internos, e as respostas não ficam em cache.
- **Servidor**: gunicorn em vez do servidor de desenvolvimento do Flask, com limites de tamanho de requisição.
- **Dependências**: fixadas em `requirements.txt` e checadas com `pip-audit`.
- **Privacidade**: as fontes são servidas pelo próprio site, então nenhuma visita é repassada ao Google.

## Créditos

- Fontes: Press Start 2P, VT323, Courier Prime e Libre Caslon Display (SIL Open Font License); Special Elite e Homemade Apple (Apache License 2.0). As licenças estão em `static/fonts/`.
- Ícones de e-mail, GitHub e LinkedIn: [Icons8](https://icons8.com).
