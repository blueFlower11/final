// const { DataTypes } = require("sequelize");
// const sequelize = require("./db");

// const Boards = sequelize.define("Boards", {
//     step: { type: DataTypes.INTEGER },
//     board: { type: DataTypes.STRING },
//     p00: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p01: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p02: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p10: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p11: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p12: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p20: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p21: { type: DataTypes.INTEGER, defaultValue: 1 },
//     p22: { type: DataTypes.INTEGER, defaultValue: 1 },
//   });
  
//   module.exports = Boards;

const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Smart = sequelize.define("smart", {
  step: { type: DataTypes.INTEGER },
  board: { type: DataTypes.STRING },
  p00: { type: DataTypes.INTEGER, defaultValue: 1 },
  p01: { type: DataTypes.INTEGER, defaultValue: 1 },
  p02: { type: DataTypes.INTEGER, defaultValue: 1 },
  p10: { type: DataTypes.INTEGER, defaultValue: 1 },
  p11: { type: DataTypes.INTEGER, defaultValue: 1 },
  p12: { type: DataTypes.INTEGER, defaultValue: 1 },
  p20: { type: DataTypes.INTEGER, defaultValue: 1 },
  p21: { type: DataTypes.INTEGER, defaultValue: 1 },
  p22: { type: DataTypes.INTEGER, defaultValue: 1 },
}, {
    tableName: "smart",
    timestamps: false
});

const Stupid = sequelize.define("stupid", {
  step: { type: DataTypes.INTEGER },
  board: { type: DataTypes.STRING },
  p00: { type: DataTypes.INTEGER, defaultValue: 1 },
  p01: { type: DataTypes.INTEGER, defaultValue: 1 },
  p02: { type: DataTypes.INTEGER, defaultValue: 1 },
  p10: { type: DataTypes.INTEGER, defaultValue: 1 },
  p11: { type: DataTypes.INTEGER, defaultValue: 1 },
  p12: { type: DataTypes.INTEGER, defaultValue: 1 },
  p20: { type: DataTypes.INTEGER, defaultValue: 1 },
  p21: { type: DataTypes.INTEGER, defaultValue: 1 },
  p22: { type: DataTypes.INTEGER, defaultValue: 1 },
}, {
    tableName: "stupid",
    timestamps: false
});

module.exports = { Smart, Stupid };
