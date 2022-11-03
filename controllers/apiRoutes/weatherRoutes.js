const router = require('express').Router();
const { Weather } = require('../../models');

// get weather by beach_id
router.get('/:id', (req, res) => {
    Weather.findAll({
        where: {
            beach_id: req.params.id
        }
    })
        .then(dbWeatherData => {
            if (!dbWeatherData || dbWeatherData.length < 1) {
                res.status(404).json({ message: 'No weather found with this beach id' });
                return;
            }
            res.json(dbWeatherData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        })
});

