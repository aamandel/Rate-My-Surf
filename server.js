const express = require('express');
const routes = require('./controllers');
const sequelize = require('./config/connection');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

const helpers = require('./utils/helpers');

// use express middleware
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// express session and sequelizestore
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const sess = {
    secret: 'Super secret secret',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};
app.use(session(sess));

//express handlebars setup
const exphbs = require('express-handlebars');
const hbs = exphbs.create({ helpers });
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', __dirname + '/views');

// turn on routes
app.use(routes);

// turn on connection to db and server
sequelize.query('SET FOREIGN_KEY_CHECKS = 1')
    .then(sequelize.sync({ force: false }).then(() => {
        app.listen(PORT, () => console.log('Now listening on port:' + PORT));
    }));