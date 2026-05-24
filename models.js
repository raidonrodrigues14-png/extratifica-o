const { DataTypes } = require('sequelize');
const { getDb } = require('./db');

const sequelize = getDb();

const Gestante = sequelize.define('Gestante', {
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  cns: { type: DataTypes.STRING, allowNull: false, unique: true },
  idade: DataTypes.INTEGER,
  ubs: DataTypes.STRING,
  classificacao: {
    type: DataTypes.ENUM('habitual', 'vigilancia', 'compartilhado', 'maternidade'),
    defaultValue: 'habitual'
  },
  fatores: { type: DataTypes.JSONB, defaultValue: [] },
  data_consulta: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW }
}, { tableName: 'gestantes', timestamps: true });

const Crianca = sequelize.define('Crianca', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  crianca: { type: DataTypes.TEXT, allowNull: false },
  mae: { type: DataTypes.TEXT, allowNull: false },
  telefone: { type: DataTypes.TEXT }
}, { 
  tableName: 'extratifica',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false
});

module.exports = { Gestante, Crianca, sequelize };