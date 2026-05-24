const { Crianca } = require('../lib/models');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    // GET: Listar crianças
    if (req.method === 'GET') {
      const criancas = await Crianca.findAll();
      return res.json({ success: true, data: criancas });
    }
    
    // POST: Salvar criança
    if (req.method === 'POST') {
      // Recebe as variáveis do formulário frontend
      const { crianca, mae, telefone } = req.body;
      
      // Validação baseada nas colunas reais do banco
      if (!crianca || !mae) {
        return res.status(400).json({ error: 'Nome da criança e da mãe são obrigatórios' });
      }
      
      // O Sequelize precisa mapear exatamente os campos crianca, mae e telefone
      const novaCrianca = await Crianca.create({
        crianca, 
        mae, 
        telefone: telefone || ''
      });
      
      return res.status(201).json({
        success: true,
        message: 'Criança cadastrada com sucesso!',
        data: novaCrianca
      });
    }
    
    return res.status(405).json({ error: 'Método não permitido' });
    
  } catch (error) {
    console.error('Erro detalhado no servidor:', error);
    return res.status(500).json({ error: 'Erro interno do servidor', detalhes: error.message });
  }
};