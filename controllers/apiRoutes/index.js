const router = require('express').Router();

const userRoutes = require('./userRoutes.js');
const reviewRoutes = require('./reviewRoutes.js');
const commentRoutes = require('./commentRoutes.js');
const countyRoutes = require('./countyRoutes.js');
const beachRoutes = require('./beachRoutes.js');

router.use('/users', userRoutes);
router.use('/reviews', reviewRoutes);
router.use('/comments', commentRoutes);
router.use('/counties', countyRoutes);
router.use('/beaches', beachRoutes);

module.exports = router;