const { Sequelize, DataTypes } = require("sequelize");
const sequelize = require("../instances/instance")

const AppControl = sequelize.define("app_machine_control_stock", {
    id: {
       type: DataTypes.INTEGER,
       autoIncrement: true
    },
    serial_no:{
        type: DataTypes.STRING(20),
        primaryKey: true,
    },
    width:{
        type: DataTypes.FLOAT
    },
    thickness:{
        type: DataTypes.FLOAT
    },
    status:{
        type: DataTypes.STRING(10)
    },
    registered_at:{
        type: DataTypes.TIME
    },
  },{
    freezeTableName: true,
    timestamps: false,
    createdAt: false,
    updatedAt: false
  });
  
  (async () => {
    await sequelize.sync({ force: false });
    // Code here
  })();

  module.exports = AppControl;