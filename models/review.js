const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connection');

// create our Review model
class Review extends Model {
    static upvote(body, models) {
        return models.Vote.create({
            user_id: body.user_id,
            review_id: body.review_id
        }).then(() => {
            return Review.findOne({
                where: {
                    id: body.review_id
                },
                attributes: [
                    'id',
                    'review_url',
                    'title',
                    'created_at',
                    [
                        sequelize.literal('(SELECT COUNT(*) FROM vote WHERE review.id = vote.review_id)'),
                        'vote_count'
                    ]
                ]
            });
        });
    }
}

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
            validate: {
                isURL: true
            }
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