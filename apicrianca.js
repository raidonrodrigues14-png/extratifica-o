export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const SUPABASE_URL = process.env.SUPABASE_URL;
  const SUPABASE_KEY = process.env.SUPABASE_KEY;

  const headers = {
    'apikey': SUPABASE_KEY,
    'Authorization': `Bearer ${SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    'Prefer': 'return=representation'
  };

  try {
    // GET — listar ou buscar
    if (req.method === 'GET') {
      const { busca, id } = req.query;

      // Histórico de uma criança específica
      if (id) {
        const resp = await fetch(`${SUPABASE_URL}/rest/v1/extratifica?id=eq.${id}`, { headers });
        const data = await resp.json();
        return res.json({ success: true, data });
      }

      // Busca por nome
      let url = `${SUPABASE_URL}/rest/v1/extratifica?order=id.desc`;
      if (busca) {
        url += `&crianca=ilike.*${busca}*`;
      }
      const resp = await fetch(url, { headers });
      const data = await resp.json();
      return res.json({ success: true, data });
    }

    // POST — criar novo registro
    if (req.method === 'POST') {
      const { crianca, mae, telefone, risco, data_retorno, wpp } = req.body;
      if (!crianca || !mae) {
        return res.status(400).json({ error: 'Nome da criança e da mãe são obrigatórios' });
      }
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/extratifica`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ crianca, mae, telefone: telefone || '', risco: risco || '', data_retorno: data_retorno || null, wpp: wpp || 'PENDENTE' })
      });
      const data = await resp.json();
      return res.status(201).json({ success: true, data });
    }

    // PUT — editar registro
    if (req.method === 'PUT') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID obrigatório' });
      const { crianca, mae, telefone, risco, data_retorno, wpp } = req.body;
      const resp = await fetch(`${SUPABASE_URL}/rest/v1/extratifica?id=eq.${id}`, {
        method: 'PATCH',
        headers,
        body: JSON.stringify({ crianca, mae, telefone, risco, data_retorno, wpp })
      });
      const data = await resp.json();
      return res.json({ success: true, data });
    }

    // DELETE — excluir registro
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'ID obrigatório' });
      await fetch(`${SUPABASE_URL}/rest/v1/extratifica?id=eq.${id}`, {
        method: 'DELETE',
        headers
      });
      return res.json({ success: true });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro interno', detalhes: error.message });
  }
};
