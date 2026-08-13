export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
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
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');

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
