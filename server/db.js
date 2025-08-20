// const { Pool } = require('pg');

// const pool = new Pool({
//   connectionString: process.env.DATABASE_URL,
//   ssl: { rejectUnauthorized: false }
// });

// module.exports = pool;

// const { Sequelize } = require("sequelize");

// const sequelize = new Sequelize(process.env.DATABASE_URL, {
//   dialect: "postgres",
//   dialectOptions: {
//     ssl: {
//       require: true,
//       rejectUnauthorized: false,
//     },
//   },
//   logging: false,
// });

// module.exports = sequelize;

// db.js


const { Sequelize, DataTypes } = require('sequelize');

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  logging: false,
});

const commonFields = {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  step: { type: DataTypes.INTEGER, allowNull: false },
  board: { type: DataTypes.STRING },
  p00: { type: DataTypes.INTEGER, allowNull: false },
  p01: { type: DataTypes.INTEGER, allowNull: false },
  p02: { type: DataTypes.INTEGER, allowNull: false },
  p10: { type: DataTypes.INTEGER, allowNull: false },
  p11: { type: DataTypes.INTEGER, allowNull: false },
  p12: { type: DataTypes.INTEGER, allowNull: false },
  p20: { type: DataTypes.INTEGER, allowNull: false },
  p21: { type: DataTypes.INTEGER, allowNull: false },
  p22: { type: DataTypes.INTEGER, allowNull: false },
};

const modelOptions = (tableName) => ({
  tableName,
  timestamps: false,
  freezeTableName: true,
});

const Smart = sequelize.define('smart', commonFields, modelOptions('smart'));
const Stupid = sequelize.define('stupid', commonFields, modelOptions('stupid'));

module.exports = { sequelize, Smart, Stupid };