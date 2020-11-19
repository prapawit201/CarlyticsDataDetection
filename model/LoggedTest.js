const Sequelize = require("sequelize");
const db = require("../database/Db");

const LoggedTest = db.define(
  "Logged",
  {
    LoggedId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    obdId:{
      type: Sequelize.STRING,
    },
    lat: {
      type: Sequelize.STRING,
    },
    long: {
      type: Sequelize.STRING,
    },
    Speed: {
      type: Sequelize.STRING,
    },
    RPM: {
      type: Sequelize.STRING,
    },
    time: {
      type: Sequelize.STRING,
    },
    IncidentType: {
      type: Sequelize.STRING,
    },
    enterpriseId:{
      type: Sequelize.STRING,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
module.exports = LoggedTest;
