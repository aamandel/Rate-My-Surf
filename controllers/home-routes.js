const router = require('express').Router();
const sequelize = require('../config/connection');
const apiFunctions = require('../utils/apiFunctions.js');

const { Review, User, Comment, Beach, County } = require('../models');

router.get('/', (req, res) => {
    Review.findAll({
        limit: 4,
        attributes: [
            'id',
            'body',
            'title',
            'beach_id',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'review_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            },
            {
                model: Beach,
                attributes: ['id', 'name'],
            }
        ],
        subQuery: true,
        order: sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id) DESC'),
    })
        .then(dbReviewData => {
            // pass serialized array of review objects into the homepage template
            const reviews = dbReviewData.map(review => review.get({ plain: true }));
            County.findAll({
                attributes: [
                    'id',
                    'name'
                ]
            }).then(dbCountyData => {
                // pass serialized array of county objects into the homepage template
                const counties = dbCountyData.map(county => county.get({ plain: true }));
                // render homepage template
                res.render('homepage', {
                    reviews,
                    counties,
                    loggedIn: req.session.loggedIn
                });
            })
                .catch(err => {
                    console.log(err);
                    res.status(500).json(err);
                })

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/login', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    // retrieve county data for navbar
    County.findAll({
        attributes: [
            'id',
            'name'
        ]
    }).then(dbCountyData => {
        // pass serialized array of county objects into the template
        const counties = dbCountyData.map(county => county.get({ plain: true }));
        res.render('login', {
            counties
        });
    });


});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }
    // retrieve county data for navbar
    County.findAll({
        attributes: [
            'id',
            'name'
        ]
    }).then(dbCountyData => {
        // pass serialized array of county objects into the template
        const counties = dbCountyData.map(county => county.get({ plain: true }));
        res.render('signup', {
            counties
        });
    });

});

router.get('/county/:id', (req, res) => {
    County.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'name',
        ],
        include: [
            {
                model: Beach,
                attributes: [
                    'id',
                    'name'
                ]
            }
        ]
    }).then(dbCountyData => {
        // serialize the data for this county
        const thisCounty = dbCountyData.get({ plain: true });
        // retrieve additional county data for navbar
        County.findAll({
            attributes: [
                'id',
                'name'
            ]
        }).then(dbCountiesData => {
            // serialize array of county objects
            const counties = dbCountiesData.map(county => county.get({ plain: true }));
            // pass data to template
            res.render('single-county', {
                thisCounty,
                counties,
                loggedIn: req.session.loggedIn
            });
        });
    });

});

router.get('/beach/:id', (req, res) => {
    Beach.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'name',
            'longitude',
            'latitude'
        ],
        include: [
            {
                model: Review,
                attributes: [
                    'id',
                    'title',
                    'body',
                    'beach_id',
                    'user_id',
                    'created_at',
                    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE reviews.id = vote.review_id)'), 'vote_count']

                ],
                include: [
                    {
                        model: User,
                        attributes: ['username']
                    },
                    {
                        model: Comment,
                        attributes: ['id', 'comment_text', 'review_id', 'user_id', 'created_at'],
                        include: {
                            model: User,
                            attributes: ['username']
                        }
                    }
                ]
            }
        ]
    })
        .then(dbBeachData => {
            if (!dbBeachData) {
                res.status(404).json({ message: 'No beach found with this id' });
                return;
            }

            // serialize the data
            const beach = dbBeachData.get({ plain: true });
            apiFunctions.loadData(beach.longitude, beach.latitude, beach.id)
                .then(apiData => {
                    console.log("api data retrieved:");
                    console.log(apiData);

                    // retrieve county data for navbar
                    County.findAll({
                        attributes: [
                            'id',
                            'name'
                        ]
                    }).then(dbCountyData => {
                        // serialize array of county objects
                        const counties = dbCountyData.map(county => county.get({ plain: true }));
                        // pass data to template
                        res.render('single-beach', {
                            beach,
                            apiData,
                            counties,
                            loggedIn: req.session.loggedIn
                        });
                    });
                });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

router.get('/review/:id', (req, res) => {
    Review.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'title',
            'body',
            'beach_id',
            'user_id',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'), 'vote_count']
        ],
        include: [
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'review_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbReviewData => {
            if (!dbReviewData) {
                res.status(404).json({ message: 'No review found with this id' });
                return;
            }

            // serialize the review data
            const review = dbReviewData.get({ plain: true });

            // retrieve county data for navbar
            County.findAll({
                attributes: [
                    'id',
                    'name'
                ]
            }).then(dbCountyData => {
                // seriealize the county data
                const counties = dbCountyData.map(county => county.get({ plain: true }));
                // pass data to template
                res.render('single-review', {
                    review,
                    counties,
                    loggedIn: req.session.loggedIn
                });
            });

        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;