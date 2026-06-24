# 🐳 Docker, FinanceApp (Multizone)

Este guia explica como rodar o projeto inteiro (host + 2 microfrontends + API mock)
dentro de **um único container Docker**, em modo desenvolvimento.

> **Por que 1 container?** O projeto usa **Next.js Multizones**. A coordenação de
> deploy (em grupo) confirmou: _"no caso de quem for usar multizones, não precisam
> ser mais de um container, pode ser um só. E não precisa disponibilizar o docker em
> produção, pode ser em desenvolvimento"_. É exatamente o que este setup faz.

---

## 1. Pré-requisitos

- **Docker Desktop** instalado e **rodando**
  (Windows/Mac: https://www.docker.com/products/docker-desktop/).
- Os **3 repositórios clonados lado a lado** na mesma pasta:

  ```
  faculdade/
  ├── tech-challenge/        ← host (shell) + este Dockerfile + compose
  ├── mfe-auth/              ← microfrontend de autenticação
  └── mfe-transactions/      ← microfrontend de transações
  ```

  > Isso é obrigatório: os MFEs declaram `"tech-challenger": "file:../tech-challenge"`,
  > então os 3 precisam estar irmãos. Por isso o build usa a **pasta-pai** como contexto.

---

## 2. Como rodar

A partir da pasta **`tech-challenge`**:

```bash
docker compose up --build
```

Aguarde o build (na 1ª vez baixa a imagem do Node e instala as dependências dos 3
projetos, pode levar alguns minutos). Quando aparecer o log do `next` pronto, abra:

👉 **http://localhost:3000** (a API fica em **http://localhost:3000/api**)

O fluxo: você cai no shell (host), faz login/cadastro (servido pelo `mfe-auth` sob
`/auth`) e acessa as transações (servido pelo `mfe-transactions` sob `/transacoes`),
tudo na mesma URL `localhost:3000`, porque o host faz **proxy** dos MFEs.

Para parar: `Ctrl+C` e depois `docker compose down`.

---

## 3. O que cada arquivo faz

| Arquivo | Papel |
|---|---|
| `Dockerfile` | Imagem única: copia os 3 repos, roda `npm ci` em cada um e sobe `npm run dev:docker`. |
| `Dockerfile.dockerignore` | Mantém o contexto enxuto (ignora `node_modules`, `.next`, e os outros projetos da pasta-pai). |
| `docker-compose.yml` | Orquestra o serviço `app` e publica a porta **3000** (a API fica em `/api`). |
| `dev:docker` (script no `package.json`) | Igual ao `dev`, mas força `next dev -H 0.0.0.0` para o host ser acessível de fora do container. |

---

## 4. Como funciona por dentro

Dentro do **mesmo** container rodam 3 processos (via `concurrently`):

| Processo | Porta | Acesso |
|---|---|---|
| Host / shell (Next) + **API em `/api`** | `3000` | **publicada** → navegador |
| `mfe-auth` (basePath `/auth`) | `4001` | interna, o host proxia via `localhost:4001` |
| `mfe-transactions` (basePath `/transacoes`) | `4002` | interna, o host proxia via `localhost:4002` |

> **A API não é mais um `json-server` separado.** Ela virou Route Handlers do Next em
> `src/app/api/[...path]` (um mini json-server). Os dados ficam em `mock/db.json` e são
> lidos/gravados via filesystem, **persiste no local/Docker** e cai pra memória
> (efêmero) só na Vercel.

**Por que tudo "simplesmente funciona" num container só:** todos os processos
compartilham o mesmo `localhost`, então o proxy do multizone (`localhost:4001/4002`)
resolve sem configuração de rede. E como a API é `/api` (mesma origem do host), as
chamadas do navegador caem direto no host, sem CORS, sem porta extra.

O roteamento multizone está em [`next.config.ts`](./next.config.ts) (`rewrites`):
`/auth/*` → mfe-auth, `/transacoes/*` → mfe-transactions.

---

## 5. Comandos úteis

```bash
docker compose up --build        # builda e sobe (use após mudar dependências)
docker compose up                # sobe sem rebuildar
docker compose up -d             # sobe em background (detached)
docker compose logs -f           # acompanha os logs
docker compose down              # para e remove o container
docker compose build --no-cache  # rebuild limpo (se algo bugar no cache)
```

### Mudei o código, e agora?
Esta imagem **copia** o código no build (não usa volume). Então, ao alterar arquivos,
rode `docker compose up --build` de novo. _(Se quiser hot-reload com o código montado,
dá pra adicionar `volumes:` no compose, peça que eu configuro.)_

### Persistir os dados entre rebuilds
A API (`/api`) grava em `mock/db.json` **dentro do container**, as mudanças persistem
enquanto o container vive, mas se perdem ao recriar a imagem. Para gravar direto no seu
arquivo local (persistir entre rebuilds), adicione no `docker-compose.yml`:

```yaml
    volumes:
      - ./mock/db.json:/app/tech-challenge/mock/db.json
```

---

## 6. Troubleshooting

- **`docker: command not found`** → Docker Desktop não está instalado ou não está no PATH. Instale e reabra o terminal.
- **Porta 3000 em uso** → feche o `npm run dev` local antes, ou mude o mapeamento no compose (ex.: `"3001:3000"`).
- **Build falha em `npm ci`** → confirme que os 3 repos estão clonados lado a lado e que os `package-lock.json` estão commitados.
- **Página em branco / MFE não carrega** → veja `docker compose logs -f`; confira se os processos `mfe-auth` e `mfe-tx` subiram.

---

## 7. Deploy na nuvem (Vercel), trilha SEPARADA do Docker

> ⚠️ **A Vercel NÃO roda o seu container Docker.** Ela faz o build nativo do Next.js.
> O Docker acima é só o entregável de **containerização** (rodar/testar local). O deploy
> de produção é feito nativamente, com **um projeto Vercel por repositório** (multizone).

São **3 projetos Vercel** (host + 2 MFEs). **Não precisa mais de Render**, a API agora é
`/api` dentro do host, então roda nativo na Vercel (escrita é efêmera no serverless, ok p/ demo).

**Ordem recomendada:**

1. **mfe-auth** → novo projeto na Vercel (root = repo `tech-challenge-mfe-auth`).
   - Sem env obrigatória (o cliente já usa `/api` por padrão).
   - Resultado: `https://<mfe-auth>.vercel.app/auth`.

2. **mfe-transactions** → idem (root = repo `tech-challenge-mfe-transactions`).
   - Resultado: `https://<mfe-transactions>.vercel.app/transacoes`.

3. **host (tech-challenge)** → novo projeto na Vercel, root = repo `tech-challenge`.
   Env vars (lidas no `next.config.ts` nos `rewrites()`):
   - `MFE_AUTH_URL = https://<mfe-auth>.vercel.app`
   - `MFE_TX_URL   = https://<mfe-transactions>.vercel.app`

   A API (`/api`) vive **neste** projeto. As chamadas do navegador (inclusive a partir
   das zonas `/auth` e `/transacoes`) caem no host porque o multizone mantém tudo na
   mesma origem.

> **Observações:**
> - Abra sempre pela **URL do host** (é ela que faz o proxy das zonas).
> - Escrita (cadastro novo) **não persiste** na Vercel (serverless). Leitura e login com
>   usuários "seedados" no `mock/db.json` funcionam normalmente. Para persistência real,
>   troque o `mock/db.json` por um banco gerenciado (Neon/Mongo Atlas).
> - `mock/server.mjs` e `mock/package.json` ficaram como **legado** (json-server), não
>   são usados pelo app nem pelo deploy; pode ignorar ou remover.
