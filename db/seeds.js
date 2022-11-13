const sequelize = require("../config/connection");
// routes are required to show sequelize the models
const routes = require('../controllers');
const fs = require("fs");
require('dotenv').config();

const schemaQuery = fs.readFileSync("db/schema.sql", {
    encoding: "utf-8",
});

const seedsQuery = fs.readFileSync("db/seeds.sql", {
    encoding: "utf-8",
})

// if JawsDB is available
if (process.env.JAWSDB_URL) {
    // use the database
    sequelize.query('USE ' + process.env.JAWSDB_DB).then(() => {
        // then sync the models using sequelize
        sequelize.sync({ force: true }).then(() => {
            // then seed the datase
            sequelize.query(seedsQuery);
        });
    });
} else {
    // initialize the empty rms_db database
    sequelize.query(schemaQuery).then(() => {
        // then sync the models using sequelize
        sequelize.sync({ force: true }).then(() => {
            // then seed the datase
            sequelize.query(seedsQuery);
        });
    });
}

