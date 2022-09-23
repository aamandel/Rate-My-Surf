const router = require('express').Router();

const apiRoutes = require('./apiRoutes');
const homeRoutes = require('./home-routes.js');

// use the home routes
router.use('/', homeRoutes);

// use the api routes
router.use('/api', apiRoutes);

// any undefined routes result in 404
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;