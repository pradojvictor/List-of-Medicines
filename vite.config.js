import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { pathToFileURL } from 'node:url'
import { resolve } from 'node:path'
import { readFileSync, existsSync } from 'node:fs'

/*
 * Lê o .env direto do disco.
 *
 * Não usamos o loadEnv do Vite aqui de propósito: ele dá prioridade ao que já
 * está em process.env sobre o que está no arquivo. Como o Vite reinicia o
 * servidor no mesmo processo, process.env sobrevive ao restart — e valores
 * antigos acabariam sobrescrevendo os que você acabou de salvar no .env.
 */
function readDotenv(root) {
  const out = {};
  for (const name of ['.env', '.env.local']) {
    const file = resolve(root, name);
    if (!existsSync(file)) continue;

    for (const raw of readFileSync(file, 'utf8').split('\n')) {
      const line = raw.trim();
      if (!line || line.startsWith('#')) continue;

      const eq = line.indexOf('=');
      if (eq === -1) continue;

      const key = line.slice(0, eq).trim().replace(/^export\s+/, '');
      let value = line.slice(eq + 1).trim();

      const quoted = (value.startsWith('"') && value.endsWith('"')) ||
                     (value.startsWith("'") && value.endsWith("'"));
      if (quoted) value = value.slice(1, -1);

      out[key] = value;
    }
  }
  return out;
}

/*
 * O `vite dev` não executa as funções de api/ — ele serviria o arquivo como
 * texto, e o cliente quebraria ao chamar .json() nesse conteúdo. Este plugin
 * monta os handlers de api/ no servidor de desenvolvimento, adaptando o
 * req/res do Node para a assinatura que a Vercel usa.
 *
 * Só roda em `vite dev` (apply: 'serve'); não afeta o build de produção.
 */
function devApi() {
  return {
    name: 'dev-api',
    apply: 'serve',
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = (req.url || '').split('?')[0];
        if (!url.startsWith('/api/')) return next();

        // Relido a cada request: editar o .env passa a valer sem reiniciar,
        // e nunca sobra valor velho de uma carga anterior.
        Object.assign(process.env, readDotenv(server.config.root));

        const file = resolve(server.config.root, `.${url}.js`);

        // Cache-busting para o handler recarregar quando api/*.js muda.
        const href = `${pathToFileURL(file).href}?t=${Date.now()}`;

        // Adapta o ServerResponse do Node para a API do handler da Vercel.
        res.status = (code) => { res.statusCode = code; return res; };
        res.json = (body) => {
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(body));
          return res;
        };

        try {
          const mod = await import(href);
          await mod.default(req, res);
        } catch (error) {
          console.error(`[dev-api] ${url}:`, error);
          if (!res.headersSent) res.status(500).json({ error: 'Erro na função (ver terminal)' });
        }
      });
    },
  };
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      babel: {
        plugins: [['babel-plugin-react-compiler']],
      },
    }),
    devApi(),
  ],
})
