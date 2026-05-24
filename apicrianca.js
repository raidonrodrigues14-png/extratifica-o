export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  try {
    if (req.method === 'GET') {
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/extratifica?order=id.desc`, {
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`
        }
      });
      const data = await resp.json();
      return res.json({ success: true, data });
    }

    if (req.method === 'POST') {
      const { crianca, mae, telefone } = req.body;
      if (!crianca || !mae) {
        return res.status(400).json({ error: 'Nome da criança e da mãe são obrigatórios' });
      }
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/extratifica`, {
        method: 'POST',
        headers: {
          'apikey': SUPABASE_KEY,
          'Authorization': `Bearer ${SUPABASE_KEY}`,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({ crianca, mae, telefone: telefone || '' })
      });
      const data = await resp.json();
      return res.status(201).json({ success: true, data });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro interno', detalhes: error.message });
  }
};