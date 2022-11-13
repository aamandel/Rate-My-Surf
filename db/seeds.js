const sequelize = require("../config/connection");
// routes are required to show sequelize the models
const routes = require('../controllers');
const fs = require("fs");

const schemaQuery = fs.readFileSync("db/schema.sql", {
    encoding: "utf-8",
});

const seedsQuery = fs.readFileSync("db/seeds.sql", {
    encoding: "utf-8",
})

// initialize the empty rms_db database
sequelize.query(schemaQuery).then(() => {
    // then sync the models using sequelize
    sequelize.sync({ force: true }).then(() => {
        // then seed the datase
        sequelize.query(seedsQuery);
    });
});
