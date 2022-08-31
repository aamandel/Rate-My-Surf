const router = require('express').Router();
const { User, Review, Vote, Comment } = require("../../models");

// Get all users: GET /api/users
router.get('/', (req, res) => {
    // Access our User model and run .findAll() method)
    User.findAll({ attributes: { exclude: ['password'] } })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Get user by ID: GET /api/users/1
router.get('/:id', (req, res) => {
    User.findOne({
        attributes: { exclude: ['password'] },
        where: {
            id: req.params.id
        },
        include: [
            {
                model: Review,
                attributes: ['id', 'title', 'beach_id', 'created_at']
            },
            // include the Comment model:
            {
                model: Comment,
                attributes: ['id', 'comment_text', 'created_at'],
                include: {
                    model: Review,
                    attributes: ['title']
                }
            },
            // include the Review model:
            {
                model: Review,
                attributes: ['title'],
                through: Vote,
                as: 'voted_reviews'
            }
        ]
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Create user: POST /api/users
router.post('/', (req, res) => {
    // expects {username: 'MyName', email: 'exampleemail@gmail.com', password: 'mypass1234'}
    User.create({
        username: req.body.username,
        email: req.body.email,
        password: req.body.password
    })
        .then(dbUserData => res.json(dbUserData))
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Login: POST /api/users/login
router.post('/login', (req, res) => {
    // expects {email: 'exampleemail@gmail.com', password: 'mypass1234'}
    User.findOne({
        where: {
            email: req.body.email
        }
    }).then(dbUserData => {
        if (!dbUserData) {
            res.status(400).json({ message: 'No user with that email address!' });
            return;
        }
        const validPassword = dbUserData.checkPassword(req.body.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Incorrect password!' });
            return;
        }
        res.json({ user: dbUserData, message: 'You are now logged in!' });
    });
});

// Update user: PUT /api/users/1
router.put('/:id', (req, res) => {
    // expects {username: 'MyName', email: 'exampleemail@gmail.com', password: 'mypass1234'}

    // if req.body has exact key/value pairs to match the model, use `req.body` instead
    User.update(req.body, {
        individualHooks: true,
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData[0]) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

// Remove user from db: DELETE /api/users/1
router.delete('/:id', (req, res) => {
    User.destroy({
        where: {
            id: req.params.id
        }
    })
        .then(dbUserData => {
            if (!dbUserData) {
                res.status(404).json({ message: 'No user found with this id' });
                return;
            }
            res.json(dbUserData);
        })
        .catch(err => {
            console.log(err);
            res.status(500).json(err);
        });
});

module.exports = router;