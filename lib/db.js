const { Sequelize } = require('sequelize');

let sequelize;

// Para Vercel, recomendamos PostgreSQL no Supabase (gratuito)
const getDb = () => {
  if (!sequelize) {
    sequelize = new Sequelize(process.env.DATABASE_URL, {
      dialect: 'postgres',
      logging: false,
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false
        }
      },
      pool: {
        max: 1,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    });
  }
  return sequelize;
};

module.exports = { getDb };