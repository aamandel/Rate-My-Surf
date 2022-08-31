const router = require('express').Router();
const { Beach } = require('../../models');

// get all beaches
router.get('/', (req, res) => {
    Beach.findAll({})
        .then(dbBeachData => res.json(dbBeachData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get beaches by county id
router.get('/:id', (req, res) => {
    Beach.findAll({
        where: {
            county_id: req.params.id
        }
    })
        .then(dbBeachData => {
            if (!dbBeachData || dbBeachData.length < 1) {
                res.status(404).json({ message: 'No beach found with this county id' });
                return;
            }
            res.json(dbBeachData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

module.exports = router;