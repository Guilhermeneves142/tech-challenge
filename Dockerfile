# ──────────────────────────────────────────────────────────────
#  FinanceApp — Container único (modo desenvolvimento)
#
#  Sobe os 3 processos do multizone num só container, via
#  `concurrently` (mesmo fluxo do `npm run dev` local):
#    - host / shell .............. http://localhost:3000
#    - mfe-auth (basePath /auth) . interno :4001  (proxiado pelo host)
#    - mfe-transactions (/transacoes) interno :4002 (proxiado pelo host)
#  A API agora vive nas Route Handlers do host em /api (não há mais
#  json-server). Persiste em mock/db.json dentro do container.
#
#  IMPORTANTE: o contexto de build é a PASTA-PAI (../), porque os
#  MFEs declaram `"tech-challenger": "file:../tech-challenge"`. Com
#  os 3 repositórios lado a lado dentro da imagem, essa dependência
#  resolve naturalmente.
# ──────────────────────────────────────────────────────────────
FROM node:22-slim

# Evita que o pacote `playwright` (devDep do host) baixe o Chromium no
# postinstall — não é usado para rodar a app e só pesaria o build.
ENV PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=1

# Pasta raiz que vai conter os 3 projetos como irmãos (igual ao disco)
WORKDIR /app

# 1) Copia os 3 projetos (o .dockerignore mantém o contexto enxuto)
COPY tech-challenge ./tech-challenge
COPY mfe-auth ./mfe-auth
COPY mfe-transactions ./mfe-transactions

# 2) Instala as dependências de cada projeto.
#    O file:../tech-challenge dos MFEs resolve pois os repos são irmãos aqui.
RUN cd tech-challenge && npm ci \
 && cd ../mfe-auth && npm ci \
 && cd ../mfe-transactions && npm ci

# 3) Trabalhamos a partir do host (ele orquestra os outros via concurrently)
WORKDIR /app/tech-challenge

# 3000 = shell/host (única porta que o navegador acessa; a API está em /api)
EXPOSE 3000

# `dev:docker` força o host a escutar em 0.0.0.0 (necessário para o
# mapeamento de portas do Docker funcionar).
CMD ["npm", "run", "dev:docker"]
