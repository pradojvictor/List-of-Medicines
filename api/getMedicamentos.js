/*
 * Limite de requisições por IP — BEST-EFFORT, não é proteção real.
 *
 * Em serverless cada instância tem a própria memória e a Vercel cria várias
 * sob carga, então um ataque distribuído passa por cima disto. Serve só para
 * conter enxurrada de uma origem só numa instância quente. A proteção de
 * verdade contra abuso é o Cache-Control mais abaixo (o Edge responde sem
 * nem acordar a função) e, se precisar de mais, o firewall da Vercel.
 *
 * O teto é generoso de propósito: no CAPS e em UBSs muita gente sai pelo
 * mesmo IP, e derrubar quem só quer consultar remédio seria pior que o abuso.
 */
const JANELA_MS = 60_000;
const MAX_POR_JANELA = 60;
const acessos = new Map();

function excedeuLimite(ip) {
  const agora = Date.now();
  const registro = acessos.get(ip);

  if (!registro || agora - registro.inicio > JANELA_MS) {
    acessos.set(ip, { inicio: agora, contagem: 1 });

    // Limpeza para o Map não crescer sem limite na instância.
    if (acessos.size > 5000) {
      for (const [chave, valor] of acessos) {
        if (agora - valor.inicio > JANELA_MS) acessos.delete(chave);
      }
    }
    return false;
  }

  registro.contagem += 1;
  return registro.contagem > MAX_POR_JANELA;
}

export default async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: "Método não permitido" });
  }

  const ip = String(req.headers['x-forwarded-for'] || '').split(',')[0].trim() || 'desconhecido';
  if (excedeuLimite(ip)) {
    res.setHeader('Retry-After', '60');
    return res.status(429).json({ error: "Muitas requisições. Tente novamente em instantes." });
  }

  try {
    const gistId = process.env.GITHUB_GIST_ID;
    const token = process.env.GITHUB_TOKEN;
    const fileName = process.env.GITHUB_FILENAME || "medicines.json";

    // Sem isso, um env var faltando vira "GET /gists/undefined" e um 500 sem pista.
    if (!gistId || !token) {
      throw new Error('GITHUB_GIST_ID ou GITHUB_TOKEN não configurados no ambiente');
    }

    const response = await fetch(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${token}`,
        Accept: 'application/vnd.github+json'
      }
    });

    if (!response.ok) {
      throw new Error(`API do GitHub respondeu ${response.status}`);
    }

    const gist = await response.json();
    const file = gist.files && (gist.files[fileName] || Object.values(gist.files)[0]);

    if (!file) throw new Error('Arquivo não encontrado no gist');

    let jsonText = file.content;

    if (file.truncated && file.raw_url) {
      const rawResp = await fetch(file.raw_url, {
        headers: { Authorization: `token ${token}` }
      });

      if (!rawResp.ok) {
        throw new Error(`raw_url do gist respondeu ${rawResp.status}`);
      }

      jsonText = await rawResp.text();
    }

    const parsed = JSON.parse(jsonText);

    // Servido pelo cache do Vercel por 5 min (e por mais 10 min enquanto revalida).
    // Mantém o token do GitHub longe do limite de 5.000 req/h mesmo sob tráfego alto.
    // stale-if-error: se o GitHub cair, o Edge continua servindo a última lista
    // boa por até 24h em vez de mostrar erro a quem procura remédio.
    res.setHeader(
      'Cache-Control',
      'public, s-maxage=300, stale-while-revalidate=600, stale-if-error=86400'
    );

    return res.status(200).json({
      medicamentos: parsed.medicamentos || parsed,
      hora: parsed.hora || gist.updated_at
    });

  } catch (error) {
    // A mensagem detalhada fica no log da Vercel; o cliente recebe só o genérico.
    console.error('getMedicamentos:', error);
    return res.status(500).json({ error: "Erro ao buscar dados do GitHub" });
  }
}
