# Lista de Medicamentos — CAPS II Leste

Site público que mostra quais medicamentos estão disponíveis no **CAPS II Leste**
(Centro de Atenção Psicossocial), em Teresina - PI.

O objetivo é simples e concreto: **evitar que alguém se desloque até a unidade para
descobrir que o remédio não está lá.** A pessoa consulta pelo celular, na rua, antes
de sair de casa.

- **No ar:** <https://list-of-medicines.vercel.app/>
- **Mantido por:** Equipe SAME — CAPS II Leste, Teresina - PI

---

## Índice

1. [O que o site faz](#o-que-o-site-faz)
2. [Como funciona](#como-funciona)
3. [O formato dos dados](#o-formato-dos-dados) ← leia antes de editar a lista
4. [Rodando localmente](#rodando-localmente)
5. [Variáveis de ambiente](#variáveis-de-ambiente)
6. [Publicação](#publicação)
7. [Decisões de projeto](#decisões-de-projeto)
8. [Segurança](#segurança)
9. [Privacidade](#privacidade)
10. [Limitações conhecidas](#limitações-conhecidas)
11. [Estrutura de pastas](#estrutura-de-pastas)
12. [Sobre esta documentação](#sobre-esta-documentação)

---

## O que o site faz

**Abertura.** Uma tela de entrada com a identidade do CAPS aparece enquanto a lista é
buscada no servidor. Para o usuário é uma abertura agradável; para a engenharia, ela
cobre o tempo de carregamento dos dados.

**Busca em tempo real.** Não há botão de buscar: a pessoa digita e a lista filtra a cada
tecla. A busca ignora acentos, então "acido" encontra "Ácido Valpróico".

**Duas listas.** Um botão alterna entre *Medicamentos ativos* (o que está disponível
agora) e *Todos os medicamentos* (tudo que a unidade oferece, disponível ou não). Assim
a pessoa distingue "acabou o estoque" de "aqui não tem esse remédio".

**Detalhes por medicamento.** Tocar no nome expande um cartão com nomes de fantasia,
dosagem, tipo e a situação (disponível ou em falta).

**Data da última atualização** fixa no topo da lista, para a pessoa saber a que dia
aquela informação se refere.

**Ajuda (botão ⓘ).** Abre um painel com quatro abas:

| Aba | Conteúdo |
|---|---|
| Dúvidas | Perguntas frequentes já respondidas |
| Como usar | Tour guiado que percorre a tela explicando cada parte |
| Privacidade e cookies | O que o site faz com os dados de quem consulta |
| Autor | E-mail para relatar problemas do site |

**Rodapé** com endereço, telefone (abre o WhatsApp com mensagem pronta), e-mail e link
para o Google Maps.

---

## Como funciona

```
  Navegador                 Vercel                        GitHub
 ┌──────────┐   fetch    ┌──────────────────────┐      ┌──────────────┐
 │  React   │ ─────────► │ /api/getMedicamentos │ ───► │  Gist (JSON) │
 │  (Vite)  │ ◄───────── │  função serverless   │ ◄─── │              │
 └──────────┘   JSON     └──────────────────────┘      └──────────────┘
                          ▲ cache do Edge
                          └ 5 min de frescor
```

A lista de medicamentos vive num **GitHub Gist privado**, não num banco de dados. Quem
atualiza edita o gist; o site reflete a mudança sem deploy.

O navegador **nunca fala com o GitHub**. Ele chama `/api/getMedicamentos`, uma função
serverless que roda na Vercel, e é ela quem usa o token para ler o gist. Duas razões:

1. **O token nunca chega ao navegador.** Se o front chamasse a API do GitHub direto,
   qualquer pessoa leria o token no código da página.
2. **O cache do Edge absorve o tráfego.** A resposta fica 5 minutos em cache
   compartilhado, então o GitHub é chamado cerca de 12 vezes por hora,
   independentemente de quantas pessoas acessem o site.

**Stack:** React 19 + Vite 7 no front (com React Compiler), função serverless em Node
na Vercel. Sem banco de dados, sem autenticação, sem back-end próprio.

---

## O formato dos dados

> **Esta é a parte mais importante do documento.** Um erro aqui derruba a lista para
> todo mundo, e o site não avisa que algo está errado — ele simplesmente mostra a lista
> vazia ou uma tela em branco.

O arquivo dentro do gist deve ser um JSON neste formato:

```json
{
  "hora": "18/08/2026",
  "medicamentos": [
    {
      "id": 1,
      "name": "Amitryl 25mg",
      "status": 1,
      "namefantasiaone": "",
      "namefantasiatwo": "",
      "dosagem": "25mg",
      "tipo": "comprimido"
    }
  ]
}
```

### Campos

| Campo | Tipo | Obrigatório | Observação |
|---|---|---|---|
| `name` | texto | sim | Nome exibido na lista e usado na busca |
| `status` | **número** | sim | `1` = disponível · `0` = em falta |
| `dosagem` | texto | — | Exibido no cartão expandido |
| `tipo` | texto | — | comprimido, cápsula, líquido, injetável… |
| `namefantasiaone` | texto | — | Nome comercial; use `""` se não houver |
| `namefantasiatwo` | texto | — | Segundo nome comercial |
| `id` | número | — | Não é usado pelo site |
| `hora` | texto | — | Fica fora da lista, no topo do JSON |

### Três armadilhas

**1. `status` é comparado ao número `1`, de forma estrita.**
Escrever `"1"` (com aspas), `true`, `0` ou `2` faz o medicamento ser tratado como **em
falta** e sumir da lista padrão. Não há aviso: o item simplesmente desaparece.

**2. Se faltar a chave `medicamentos`, a tela fica em branco.**
O site também aceita um array puro no lugar do objeto. Mas se você mandar um **objeto**
sem a chave `medicamentos`, o código tenta filtrar um objeto como se fosse lista, dá erro
durante a renderização e — como não há tratamento para isso — a página abre vazia, sem
mensagem de erro.

**3. Se o nome do arquivo não bater, o site pega o arquivo errado em silêncio.**
A variável `GITHUB_FILENAME` diz qual arquivo do gist ler. Se esse nome não existir, o
código cai no **primeiro arquivo do gist**, sem log e sem aviso. O site passa a exibir
outro conteúdo e ninguém percebe. Se o gist tiver mais de um arquivo, confira o nome.

### Convenção para o campo `tipo`

Hoje há três grafias para a mesma coisa na lista real: `injetável`, `Injetável` e
`injetavel`. Isso não quebra nada porque o campo só é exibido, mas **padronize em
minúsculas e com acento** — no dia em que alguém agrupar ou filtrar por tipo, essas
variações contam como categorias diferentes.

### Quando a mudança aparece no site

Depois de salvar o gist, a atualização **não é instantânea**: o cache do Edge pode
continuar servindo a versão anterior por até **5 minutos**, e por mais 10 minutos ele
serve a versão antiga enquanto busca a nova em segundo plano. Se você acabou de editar e
o site não mudou, espere alguns minutos antes de suspeitar de erro.

---

## Rodando localmente

```bash
yarn install
cp .env.example .env    # depois preencha GITHUB_GIST_ID e GITHUB_TOKEN
yarn dev
```

O `yarn dev` sobe o front **e** a função `/api/getMedicamentos` na mesma porta. Isso não
é comportamento padrão do Vite: existe um plugin em [`vite.config.js`](vite.config.js)
que monta os handlers de `api/` no servidor de desenvolvimento. Sem ele, o Vite
devolveria o código-fonte da função como texto e o site quebraria ao tentar interpretá-lo
como JSON.

### Scripts

| Comando | O que faz |
|---|---|
| `yarn dev` | Front + API, na mesma porta. **É o que você quer no dia a dia.** |
| `yarn build` | Gera o site estático em `dist/` |
| `yarn lint` | ESLint. É o único gate de qualidade do projeto |
| `yarn preview` | Serve o `dist/`. ⚠️ **Não serve a API** — veja abaixo |
| `yarn api` | `vercel dev` — roda no runtime real da Vercel |

> ⚠️ **`yarn preview` não serve `/api`.** O plugin só atua no servidor de
> desenvolvimento. Se você abrir o preview, a tela mostra *"Erro ao buscar medicamentos"*
> — isso é esperado, não é o build quebrado. Para conferir o build com dados, use
> `yarn api`.

> **`yarn api` exige `vercel login` e `vercel link`** e carrega as variáveis pelo próprio
> CLI da Vercel, não pelo plugin do Vite.

### Requisito de versão do Node

O projeto **não fixa** uma versão (`package.json` não tem `engines`). O piso vem das
dependências: o Vite 7 exige Node `^20.19.0 || >=22.12.0`. Qualquer Node 20.19+, 22.12+
ou mais recente funciona.

---

## Variáveis de ambiente

Copie `.env.example` para `.env` e preencha. O `.env` é ignorado pelo git e **nunca vai
para o deploy**.

| Variável | Obrigatória | Descrição |
|---|---|---|
| `GITHUB_GIST_ID` | sim | ID do gist — o trecho final da URL do gist |
| `GITHUB_TOKEN` | sim | Token do GitHub com acesso de leitura ao gist |
| `GITHUB_FILENAME` | não | Nome do arquivo dentro do gist (padrão: `medicines.json`) |

Se `GITHUB_GIST_ID` ou `GITHUB_TOKEN` faltarem, a função falha antes de qualquer chamada
de rede — mas o cliente recebe a mesma mensagem genérica de sempre. O motivo real fica só
no log do servidor.

### Sobre o token

Use um **fine-grained token com a permissão `Gists: Read-only`**.

Não use um PAT clássico: o escopo `gist` de um token clássico concede **leitura e
escrita em todos os gists da conta**, muito além do que a aplicação precisa. Não existe
escopo somente-leitura em PAT clássico — só a versão fine-grained oferece isso.

### Local e produção são ambientes separados

O `.env` vale só na sua máquina. A produção lê de **Vercel → Settings → Environment
Variables**. Os dois já divergiram antes, com o site no ar funcionando e o ambiente local
quebrado. Ao investigar uma falha, **descubra primeiro em qual dos dois ela acontece**
antes de mexer no código.

---

## Publicação

Hospedado na Vercel, com deploy automático a cada push na `main`.

O [`vercel.json`](vercel.json) contém **apenas cabeçalhos HTTP** — não há
`buildCommand`, `outputDirectory` nem `rewrites`. O build funciona pela detecção
automática de projeto Vite feita pela Vercel.

Para publicar em outra conta:

1. Importe o repositório na Vercel (ela detecta Vite sozinha)
2. Cadastre `GITHUB_GIST_ID` e `GITHUB_TOKEN` nas Environment Variables, marcando o
   ambiente **Production**
3. A versão de Node das funções é escolhida no painel do projeto, já que o
   `package.json` não fixa `engines`

O diretório `dist/` é artefato de build, está ignorado pelo git e não deve ser commitado.

---

## Decisões de projeto

Registro do **porquê** de escolhas que parecem estranhas à primeira vista.

**A lista vive num Gist, não num banco.** Quem mantém a lista é a equipe do SAME, não um
programador. Editar um arquivo JSON é um processo que a equipe consegue tocar sem
depender de deploy nem de painel administrativo.

**Cache de 5 minutos com `stale-if-error` de 24 horas.** O cache existe para dois fins:
manter o token longe do limite de 5.000 requisições por hora do GitHub e, se o GitHub
cair, continuar servindo a última lista boa por até um dia. Para quem procura remédio,
ver a lista de ontem é muito melhor que ver "erro de conexão".

**O tour guiado é carregado sob demanda.** A biblioteca `intro.js` só é baixada quando a
pessoa abre "Como usar". Ela pesa cerca de 65 KB e a maioria dos visitantes nunca usa o
tour.

**Sem `backdrop-filter` nos cartões da lista.** O efeito de vidro fosco obrigava o
navegador a refazer o desfoque a cada quadro da rolagem, em todos os cartões
simultaneamente. Em Android intermediário — boa parte do público — isso travava o scroll.
A opacidade maior compensa visualmente sem custo.

**Unidades `dvh` em vez de `vh`.** `vh` sempre vale a viewport "grande" do celular, o que
fazia a barra de endereço cobrir conteúdo e o teclado empurrar a lista para fora da tela.

**O plugin de dev lê o `.env` do disco a cada requisição** em vez de usar o `loadEnv` do
Vite. O `loadEnv` dá prioridade ao que já está em `process.env` sobre o arquivo; como o
Vite reinicia o servidor no mesmo processo, valores antigos sobreviviam ao restart e
sobrescreviam o que você tinha acabado de salvar.

---

## Segurança

**O token fica no servidor.** O navegador só conhece `/api/getMedicamentos`. Nenhuma
credencial chega ao cliente.

**Cabeçalhos HTTP** definidos em [`vercel.json`](vercel.json): Content-Security-Policy,
`X-Frame-Options: DENY`, `X-Content-Type-Options: nosniff`, `Referrer-Policy`,
`Permissions-Policy` (câmera, microfone e geolocalização negados),
`Cross-Origin-Opener-Policy` e `Cross-Origin-Resource-Policy`.

**A CSP é restritiva:** `script-src 'self'` sem `unsafe-inline`, `connect-src 'self'`,
`object-src 'none'`, `base-uri 'none'`, `frame-ancestors 'none'`.

Três esclarecimentos, porque é fácil atribuir à CSP mais do que ela faz:

- A CSP restringe as conexões que **esta página** faz. Ela não impede que outro site ou
  um `curl` consuma `/api/getMedicamentos`. O que impede leitura cross-origin no
  navegador é a **ausência de cabeçalhos CORS** na função.
- A CSP **não bloqueia** os estilos que o React aplica via `style={{...}}`, porque eles
  são definidos por CSSOM e não como atributo no HTML.
- **Não há relatório de violações** (`report-uri`/`report-to`). Uma violação de CSP
  aparece apenas no console do usuário final; ninguém é notificado.

**O rate limit é best-effort, não proteção.** A função limita 60 requisições por minuto
por IP, mas o contador vive na memória de cada instância serverless: a Vercel cria várias
sob carga, cada uma com o próprio contador, e um ataque distribuído passa por cima. Além
disso ele fica inoperante em `yarn dev`, e quando o cabeçalho de IP não chega todos os
clientes caem numa chave compartilhada.

O teto é generoso de propósito: no CAPS e em UBSs muita gente sai pelo mesmo IP, e
bloquear uma sala inteira de pessoas seria pior que o abuso evitado.

**A defesa real contra abuso é o cache** — com o Edge respondendo, a função raramente é
acordada. Se houver abuso de verdade, o caminho é o firewall da Vercel, que roda antes
da função e tem estado compartilhado.

---

## Privacidade

O site **não usa cookies, não usa `localStorage` nem `sessionStorage`, não tem analytics
e não tem rastreadores**. Não pede nome, CPF, telefone ou e-mail, e não há login. O que a
pessoa digita na busca é filtrado no próprio aparelho e nunca é enviado ao servidor.

> **Isto é um compromisso assumido com o usuário**, escrito na aba "Privacidade e
> cookies" do site. Se algum dia for adicionado Google Analytics, pixel ou qualquer
> script de terceiro, **o texto do FAQ precisa ser corrigido junto** — e a CSP também,
> que hoje bloqueia scripts externos. Deixar os dois dessincronizados transforma uma
> informação verdadeira em declaração falsa a quem usa um serviço público de saúde.

O texto do FAQ é uma descrição técnica honesta do comportamento do código, não uma peça
jurídica revisada. Sendo o CAPS um serviço público de saúde sujeito à LGPD, vale
validação de quem responde juridicamente pela unidade.

---

## Limitações conhecidas

Lista honesta do que está em aberto, para ninguém descobrir sozinho depois.

**Bugs**

- O endereço no rodapé **não é clicável**: o link é renderizado sem destino. O tour
  guiado tem um passo apontando para ele ("Localização do CAPS II LESTE") que não leva a
  lugar nenhum. Os outros três contatos funcionam.
- Um JSON fora do formato esperado pode deixar a **tela em branco**, sem mensagem,
  porque não há tratamento de erro de renderização.
- Não há botão de tentar novamente: se a busca falhar, só recarregando a página.

**Acessibilidade**

- O botão ⓘ é um `<span>` com clique, sem papel semântico, sem foco por teclado e sem
  rótulo para leitor de tela.
- Os cartões de medicamento são `<div>` com clique, sem suporte a teclado.
- O campo de busca não tem rótulo associado.
- O painel de ajuda usa `<ul>` contendo `<div>`, aninhamento inválido.
- O painel de FAQ, esse sim, foi feito com `aria-expanded`, `aria-controls` e `inert` no
  conteúdo fechado.

**Qualidade**

- **Não há testes automatizados nem CI.** O único gate é `yarn lint`.
- `showallMedicines` tem nome invertido: quando é `true`, mostra **só os ativos**. Há
  três estados booleanos que mudam sempre juntos e poderiam ser um só.
- O texto "ultima atualização" aparece sem acento na tela.
- O campo `hora` é exibido cru, exatamente como está no gist.

**Não testado**

- O comportamento do teclado no **iOS Safari**. O ajuste de layout foi verificado
  simulando o Android, que encolhe a viewport; o iOS sobrepõe o teclado e pode se
  comportar de outro jeito.

---

## Estrutura de pastas

```
├── api/
│   └── getMedicamentos.js    Função serverless: lê o gist, cacheia, limita taxa
├── src/
│   ├── App.jsx               Componente principal: busca, filtro, layout
│   ├── App.css               Estilos globais e de layout
│   ├── assets/               Fonte, logos e imagem de carregamento
│   ├── styles/
│   │   └── introjs-theme.css Tema do tour, carregado sob demanda
│   └── components/
│       ├── Loader/           Tela de abertura
│       ├── MedicineCard/     Cartão expansível de medicamento
│       ├── ModalFAQ/         Dica "Dúvidas e suporte" (some após 7s)
│       ├── FaqMenu/          Painel de ajuda com as quatro abas
│       ├── CardFaq/          Aba expansível do painel
│       ├── CardSimple/       Par pergunta/resposta
│       ├── Detail/           Linha rótulo/valor do cartão
│       └── Link/             Âncora com target e rel padronizados
├── public/                   favicon e imagem de compartilhamento
├── index.html                HTML raiz e meta tags
├── vercel.json               Cabeçalhos HTTP e CSP
├── vite.config.js            Build + plugin que serve api/ em desenvolvimento
└── .env.example              Modelo das variáveis de ambiente
```

Existe também uma **apresentação** do projeto, publicada em
<https://pradojvictor.github.io/apresenta-o-SAME/>. Ela vive em outro repositório —
quem clonar este projeto não a recebe.

---

## Sobre esta documentação (autor)

Este README foi escrito com o **Claude Code**, a ferramenta de linha de comando da
Anthropic, em conjunto com o autor do projeto. Ele substituiu o texto padrão que vinha
do template do Vite e que nunca havia sido preenchido.

O conteúdo não saiu de suposição: o código foi lido e auditado arquivo por arquivo, e
cada afirmação aqui tem correspondência no que está implementado. A auditoria corrigiu
várias descrições que pareciam certas e não eram — entre elas, atribuir à CSP proteções
que na verdade vêm da ausência de CORS, e prometer um "token somente leitura" que o tipo
de token em uso não oferece. Foi assim também que apareceram o link sem destino no
rodapé e o risco de tela em branco com JSON fora do formato, ambos registrados em
[Limitações conhecidas](#limitações-conhecidas).

A mesma ferramenta foi usada antes neste repositório em trabalho de código: revisão de codigo como retirada de codigo morte e classes, ajustes de responsividade e
acessibilidade,e otimização de imagens. Todo o código foi revisado e publicado
pelo autor.

---

© 2026 CAPS II Leste — Equipe SAME · Teresina - PI
