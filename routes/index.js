const router = require('express').Router();

const apiRoutes = require('./apiRoutes');

// use the api routes
router.use('/api', apiRoutes);

// any undefined routes result in 404
router.use((req, res) => {
    res.status(404).end();
});

module.exports = router;