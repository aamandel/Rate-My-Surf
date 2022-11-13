// import Sequelize
const Sequelize = require('sequelize');

// use env vars for db name, user, and pass
require('dotenv').config();

// create connection to rms database
let sequelize;
if (process.env.JAWSDB_URL) {
    console.log("connecting to JawsDB");
    sequelize = new Sequelize(process.env.JAWSDB_DB, process.env.JAWSDB_USER, process.env.JAWSDB_PW, {
        host: process.env.JAWSDB_HOST,
        dialect: 'mysql',
        port: 3306,
        dialectOptions: {
            multipleStatements: true
        }
    });
} else {
    console.log("connecting to localhost");
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