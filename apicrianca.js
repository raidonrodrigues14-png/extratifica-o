import { Sequelize, DataTypes } from 'sequelize';

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
  pool: { max: 1, min: 0, acquire: 30000, idle: 10000 }
});

const Crianca = sequelize.define('Crianca', {
  id:       { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  crianca:  { type: DataTypes.TEXT, allowNull: false },
  mae:      { type: DataTypes.TEXT, allowNull: false },
  telefone: { type: DataTypes.TEXT }
}, {
  tableName: 'extratifica',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

export default async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    await sequelize.authenticate();

    if (req.method === 'GET') {
      const criancas = await Crianca.findAll({ order: [['id', 'DESC']] });
      return res.json({ success: true, data: criancas });
    }

    if (req.method === 'POST') {
      const { crianca, mae, telefone } = req.body;
      if (!crianca || !mae) {
        return res.status(400).json({ error: 'Nome da criança e da mãe são obrigatórios' });
      }
      const nova = await Crianca.create({ crianca, mae, telefone: telefone || '' });
      return res.status(201).json({ success: true, data: nova });
    }

    return res.status(405).json({ error: 'Método não permitido' });

  } catch (error) {
    console.error('Erro:', error);
    return res.status(500).json({ error: 'Erro interno', detalhes: error.message });
  }
};