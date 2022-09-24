const router = require('express').Router();
const sequelize = require('../config/connection');
const apiFunctions = require('../utils/apiFunctions');
const { Review, User, Comment, Beach } = require('../models');

router.get('/', (req, res) => {
    console.log(req.session);
    Review.findAll({
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
            }
        ]
    })
        .then(dbReviewData => {
            // pass serialized array of review objects into the homepage template
            const reviews = dbReviewData.map(review => review.get({ plain: true }));
            res.render('homepage', {
                reviews,
                loggedIn: req.session.loggedIn
            });
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

    res.render('login');
});

router.get('/signup', (req, res) => {
    if (req.session.loggedIn) {
        res.redirect('/');
        return;
    }

    res.render('signup');
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
                    [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE id = vote.review_id)'), 'vote_count']
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
            apiFunctions.load_api(beach.longitude, beach.latitude);
            // pass data to template
            res.render('single-beach', {
                beach,
                loggedIn: req.session.loggedIn
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

            // serialize the data
            const review = dbReviewData.get({ plain: true });

            // pass data to template
            res.render('single-review', {
                review,
                loggedIn: req.session.loggedIn
            });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;