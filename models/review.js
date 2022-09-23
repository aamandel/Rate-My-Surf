const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');
const Vote = require('./vote');

// create our Review model
class Review extends Model {
    // define method for upvoting reviews
    static upvote(body, models) {
        // Try to find vote in database
        return Vote.findOne({
            where: {
                user_id: body.user_id,
                review_id: body.review_id
            }
        })
            .then(result => {
                return (result !== null);
            })
            .then(exists => {
                // if vote already exists, delete vote
                if (exists) {
                    return Vote.destroy({
                        where: {
                            user_id: body.user_id,
                            review_id: body.review_id
                        }
                    })
                        // update the vote count
                        .then(() => {
                            this.updateVoteCount(body);
                        })
                        .catch(err => {
                            console.log(err);
                        });
                }
                // if the vote does not exist, create it
                else {
                    return models.Vote.create({
                        user_id: body.user_id,
                        review_id: body.review_id
                    })
                        // update the vote count
                        .then(() => {
                            this.updateVoteCount(body);
                        });
                }
            });
    }

    // update vote count
    static updateVoteCount = (body) => {
        return Review.findOne({
            where: {
                id: body.review_id
            },
            attributes: [
                'id',
                'title',
                'body',
                'beach_id',
                'user_id',
                'created_at',
                [
                    sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'),
                    'vote_count'
                ]
            ]
        });
    }
}
/*if (alreadyExists) {
    console.log('----------------------------------------------------- wtf');
    return Vote.destroy({
        where: {
            user_id: body.user_id,
            review_id: body.review_id
        }
    })
        .then(() => {
            return Review.findOne({
                where: {
                    id: body.review_id
                },
                attributes: [
                    'id',
                    'title',
                    'body',
                    'beach_id',
                    'user_id',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'),
                        'vote_count'
                    ]
                ]
            });
        })
        .catch(err => {
            console.log(err);
        });
} else {
    console.log('hell0??? ---------------------------------');
    return models.Vote.create({
        user_id: body.user_id,
        review_id: body.review_id
    })
        .then(() => {
            return Review.findOne({
                where: {
                    id: body.review_id
                },
                attributes: [
                    'id',
                    'title',
                    'body',
                    'beach_id',
                    'user_id',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'),
                        'vote_count'
                    ]
                ]
            })
                .then(data => {
                    console.log('--------------------------');
                    console.log(data);
                });
        });
}

}
}*/

// create fields/columns for Review model
Review.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false
        },
        body: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        beach_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'beach',
                key: 'id'
            }
        },
        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        },
        image: {
            type: DataTypes.STRING,
            allowNull: true
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscored: true,
        modelName: 'review'
    }
);

module.exports = Review;