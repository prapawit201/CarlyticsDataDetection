const db = require("../database/Db");
const Sequelize = require("sequelize");

const Car = db.define(
  "Car",
  {
    carId: {
      type: Sequelize.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    chasisNo: {
      type: Sequelize.STRING,
    },
    plateNo: {
      type: Sequelize.STRING,
    },
    obdId: {
      type: Sequelize.STRING,
    },
    brandId: {
      type: Sequelize.STRING,
    },
    driverId: {
      type: Sequelize.STRING,
    },
    modelId: {
      type: Sequelize.STRING,
    },
    year: {
      type: Sequelize.STRING,
    },
    image: {
      type: Sequelize.STRING,
    },
    enterpriseId: {
      type: Sequelize.STRING,
    },
    status:{
      type: Sequelize.INTEGER,
    }
  },
  {
    freezeTableName: true,
    timestamps: false,
  }
);
module.exports = Car;
