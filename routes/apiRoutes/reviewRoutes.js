const router = require('express').Router();
const { Review, User, Vote, Comment } = require("../../models");
const sequelize = require('../../config/connection');

// get all reviews
router.get('/', (req, res) => {
    Review.findAll({
        attributes: [
            'id',
            'review_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'), 'vote_count']
        ],
        order: [['created_at', 'DESC']],
        include: [
            // include the Comment model:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'review_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            // include the user who made the review:
            {
                model: User,
                attributes: ['username']
            }
        ]
    })
        .then(dbReviewData => res.json(dbReviewData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// get a specific review
router.get('/:id', (req, res) => {
    Review.findOne({
        where: {
            id: req.params.id
        },
        attributes: [
            'id',
            'review_url',
            'title',
            'created_at',
            [sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'), 'vote_count']
        ],
        include: [
            // include the Comment model:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'review_id', 'user_id', 'created_at'],
                include: {
                    model: User,
                    attributes: ['username']
                }
            },
            // include the user who made the review:
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
            res.json(dbReviewData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// create new review
router.post('/', (req, res) => {
    // expects {title: 'Taskmaster goes public!', review_url: 'https://taskmaster.com/press', user_id: 1}
    Review.create({
        title: req.body.title,
        review_url: req.body.review_url,
        user_id: req.body.user_id
    })
        .then(dbReviewData => res.json(dbReviewData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// upvote a review: PUT /api/reviews/upvote
router.put('/upvote', (req, res) => {
    // custom static method created in models/review.js
    Review.upvote(req.body, { Vote })
        .then(updatedReviewData => res.json(updatedReviewData))
        .catch(err => {
            console.log(err);
            res.status(400).json(err);
        });
});

// update review title
router.put('/:id', (req, res) => {
    Review.update(
        {
            title: req.body.title
        },
        {
            where: {
                id: req.params.id
            }
        }
    )
        .then(dbReviewData => {
            if (!dbReviewData) {
                res.status(404).json({ message: 'No review found with this id' });
                return;
            }
            res.json(dbReviewData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// delete a review
router.delete('/:id', (req, res) => {
    Review.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbReviewData => {
            if (!dbReviewData) {
                res.status(404).json({ message: 'No review found with this id' });
                return;
            }
            res.json(dbReviewData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;
