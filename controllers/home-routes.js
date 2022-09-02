const router = require('express').Router();
const sequelize = require('../config/connection');
const { Review, User, Comment } = require('../models');

router.get('/', (req, res) => {
    Review.findAll({
        attributes: [
            'id',
            'body',
            'title',
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
            res.render('homepage', { reviews });
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;