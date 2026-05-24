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
  id: { type: DataTypes.UUID, defaultValue: DataTypes.UUIDV4, primaryKey: true },
  nome: { type: DataTypes.STRING, allowNull: false },
  nome_mae: { type: DataTypes.STRING, allowNull: false },
  telefone: DataTypes.STRING,
  ubs: DataTypes.STRING,
  risco: { type: DataTypes.ENUM('HABITUAL', 'INTERMEDIÁRIO', 'ALTO'), defaultValue: 'HABITUAL' },
  data_consulta: { type: DataTypes.DATEONLY, defaultValue: DataTypes.NOW },
  data_retorno: DataTypes.DATEONLY,
  fatores_alto: { type: DataTypes.JSONB, defaultValue: [] },
  fatores_inter: { type: DataTypes.JSONB, defaultValue: [] }
}, { tableName: 'criancas', timestamps: true });

module.exports = { Gestante, Crianca, sequelize };