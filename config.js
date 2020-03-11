const Sequelize = require('sequelize');

const sequelize = new Sequelize('db1', 'root', 'agile123', {
    host: 'localhost',
    dialect: 'mysql',
    operatorsAliases: false,
  
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    },
  });
  
  sequelize
    .authenticate()
    .then(() => {
      console.log('Connection has been established successfully.'); // eslint-disable-line no-console
    })
    .catch((err) => {
      console.error('Unable to connect to the database:', err); // eslint-disable-line no-console
    });

module.exports = sequelize