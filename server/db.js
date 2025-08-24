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

const Statistics = sequelize.define('statistics', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  ip: { type: DataTypes.STRING, allowNull: false, unique: true },
  smartW: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  smartD: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  smartL: { type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  stupidW:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  stupidD:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
  stupidL:{ type: DataTypes.INTEGER, allowNull: false, defaultValue: 0 },
}, modelOptions('statistics'));

module.exports = { sequelize, Smart, Stupid, Statistics };