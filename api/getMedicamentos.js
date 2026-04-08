import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const gistId = process.env.GITHUB_GIST_ID;
    const token = process.env.GITHUB_TOKEN;
    const fileName = process.env.GITHUB_FILENAME || "medicines.json";

    const response = await axios.get(`https://api.github.com/gists/${gistId}`, {
      headers: {
        Authorization: `token ${token}`
      }
    });

    const gist = response.data;
    const file = gist.files && (gist.files[fileName] || Object.values(gist.files)[0]);
    
    if (!file) throw new Error('Arquivo não encontrado no gist');

    let jsonText = file.content;
  
    if (file.truncated && file.raw_url) {
      const rawResp = await axios.get(file.raw_url, { 
        headers: { Authorization: `token ${token}` } 
      });
      jsonText = typeof rawResp.data === 'string' ? rawResp.data : JSON.stringify(rawResp.data);
    }

    const parsed = JSON.parse(jsonText);
    
    return res.status(200).json({
      medicamentos: parsed.medicamentos || parsed,
      hora: parsed.hora || gist.updated_at
    });

  } catch (error) {
    return res.status(500).json({ error: "Erro ao buscar dados do GitHub" });
  }
}