const Beach = require('./beach')
const County = require('./county')
const User = require('./user');
const Review = require('./review');
const Vote = require('./vote');
const Comment = require('./comment');

// create associations

// counties have many beaches
County.hasMany(Beach, {
    foreignKey: 'county_id'
})
// beaches belong to one county
Beach.belongsTo(County, {
    foreignKey: 'county_id'
})
// beaches have many reviews
Beach.hasMany(Review, {
    foreignKey: 'beach_id'
})
// reviews belong to one beach
Review.belongsTo(Beach, {
    foreignKey: 'beach_id'
})
// users have many reviews
User.hasMany(Review, {
    foreignKey: 'user_id'
});
// reviews belong to one user
Review.belongsTo(User, {
    foreignKey: 'user_id',
});

// users vote on many reviews
User.belongsToMany(Review, {
    through: Vote,
    as: 'voted_reviews',
    foreignKey: 'user_id'
});
// reviews have many users who voted on them
Review.belongsToMany(User, {
    through: Vote,
    as: 'voted_reviews',
    foreignKey: 'review_id'
});

// a vote belongs to a single user
Vote.belongsTo(User, {
    foreignKey: 'user_id'
});

// a vote belongs to a single review
Vote.belongsTo(Review, {
    foreignKey: 'review_id'
});

// a user has many votes
User.hasMany(Vote, {
    foreignKey: 'user_id'
});

// a review has many votes
Review.hasMany(Vote, {
    foreignKey: 'review_id'
});

// a comment belongs to a user
Comment.belongsTo(User, {
    foreignKey: 'user_id'
});

// a comment belongs to a review
Comment.belongsTo(Review, {
    foreignKey: 'review_id'
});

// a user has many comments
User.hasMany(Comment, {
    foreignKey: 'user_id'
});

// a review has many comments
Review.hasMany(Comment, {
    foreignKey: 'review_id'
});

module.exports = { Beach, County, User, Review, Vote, Comment };