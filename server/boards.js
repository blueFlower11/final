const { DataTypes } = require("sequelize");
const sequelize = require("./db"); // your db connection

const Boards = sequelize.define("Boards", {
  step: DataTypes.INTEGER,
  board: DataTypes.STRING,
  p00: DataTypes.INTEGER,
  p01: DataTypes.INTEGER,
  p02: DataTypes.INTEGER,
  p10: DataTypes.INTEGER,
  p11: DataTypes.INTEGER,
  p12: DataTypes.INTEGER,
  p20: DataTypes.INTEGER,
  p21: DataTypes.INTEGER,
  p22: DataTypes.INTEGER,
  win: DataTypes.INTEGER,
  lose: DataTypes.INTEGER
});