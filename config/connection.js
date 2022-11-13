// import Sequelize
const Sequelize = require('sequelize');

// use env vars for db name, user, and pass
require('dotenv').config();

// create connection to rms database
let sequelize;
if (process.env.JAWSDB_URL) {
    sequelize = new Sequelize(process.env.JAWSDB_URL, process.env.JAWSDB_USER, process.env.JAWSDB_PW, {
        dialect: 'mysql',
        dialectOptions: {
            multipleStatements: true
        }
    });
} else {
    sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PW, {
        host: 'localhost',
        dialect: 'mysql',
        port: 3306,
        dialectOptions: {
            multipleStatements: true
        }
    });
}

module.exports = sequelize;