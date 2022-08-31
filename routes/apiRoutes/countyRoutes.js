const router = require('express').Router();
const { County } = require('../../models');

// get all counties
router.get('/', (req, res) => {
    County.findAll({})
        .then(dbCountyData => res.json(dbCountyData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;