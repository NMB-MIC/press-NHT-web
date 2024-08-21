const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('machine_control', 'sa', 'sa@admin', {
    dialect: 'mssql',
    host: 'MIC-IOT-10',
    dialectOptions: {
      // Observe the need for this nested `options` field for MSSQL
      options: {
        instanceName: 'SQLEXPRESS'
      }
    }
  });

sequelize.authenticate()
    .then(() => {
        console.log('Connection has been established successfully.');
    })
    .catch((err) => {
        console.error('Unable to connect to the database:', err);
    });

module.exports = sequelize;