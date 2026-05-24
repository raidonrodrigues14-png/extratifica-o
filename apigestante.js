const { Gestante } = require('../lib/models');

module.exports = async (req, res) => {
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Listar gestantes
    if (req.method === 'GET') {
      const { page = 1, limit = 10, ubs } = req.query;
      const offset = (page - 1) * limit;
      
      let where = {};
      if (ubs) where.ubs = ubs;
      
      const { count, rows } = await Gestante.findAndCountAll({
        where,
        limit: parseInt(limit),
        offset: parseInt(offset),
        order: [['createdAt', 'DESC']]
      });
      
      return res.json({
        success: true,
        total: count,
        page: parseInt(page),
        totalPages: Math.ceil(count / limit),
        data: rows
      });
    }
    
    // POST: Salvar nova gestante
    if (req.method === 'POST') {
      const { nome, cns, idade, ubs, classificacao, fatores } = req.body;
      
      if (!nome || !cns) {
        return res.status(400).json({ error: 'Nome e CNS são obrigatórios' });
      }
      
      const gestante = await Gestante.create({
        nome, cns, idade, ubs, classificacao, fatores,
        data_consulta: new Date().toISOString().split('T')[0]
      });
      
      return res.status(201).json({
        success: true,
        message: 'Gestante cadastrada com sucesso!',
        data: gestante
      });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro interno do servidor' });
  }
};