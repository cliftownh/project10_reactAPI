const express = require('express');
const router = express.Router();
const { User } = require('../models');
const bcrypt = require('bcryptjs');
const authenticate = require('./authenticateUser');
const { check, validationResult } = require('express-validator');

// GET currently authenticated user
router.get('/', authenticate, (req, res, next) => {
    if (!req.currentUser) {
        const error = new Error('No user is signed in.')
        error.status = 400;
        next(error);
    } else {
        const { id, firstName, lastName, emailAddress } = req.currentUser;

        res.json({
            id: id,
            name: `${firstName} ${lastName}`,
            username: emailAddress
        });
    }
});

// GET user by id
router.get('/:id', (req, res, next) => {
    User.findByPk(req.params.id, 
        { attributes: { exclude: ['password', 'createdAt', 'updatedAt'] } })
    .then((user) => {
        if (user) {
            const { id, firstName, lastName, emailAddress } = user;
            res.json({
                id: id,
                name: `${firstName} ${lastName}`,
                username: emailAddress
            });
        } else {
            const error = new Error('No user was found.');
            error.status = 404;
            next(error);
        }
    }).catch(err => res.json(err));
});

// POST create user
router.post('/', [
  check('firstName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please enter a first name'),
  check('lastName')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please enter a last name'),
  check('emailAddress')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please enter a valid email address'),
  check('password')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please enter a password')
], (req, res, next) => {

    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array().map(error => error.msg) });
    }

    const { emailAddress } = req.body;
    const emailReg = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const isValidEmail = (email) => {
        return emailReg.test(email);
    };

    if (!isValidEmail(emailAddress)) {
        return res.status(400).json({errors: ['This is not a valid email address']});
    } else {
        User.findAll({ attributes: ['emailAddress'] })
        .then((emails) => {
            for (let i = 0; i < emails.length; i++ ) {
                if (emails[i].emailAddress === emailAddress) {                    
                    return res.status(400).json({errors: ['This email address belongs to an existing user.']})
                }
            }
        })
        .catch((err => next(err)));

        let hashedPw = bcrypt.hashSync(req.body.password);
        req.body.password = hashedPw;

        User.create(req.body)
        .then((user) => {
            if (!user) {
                const error = new Error('No user was created.');
                error.status = 400;
                next(error);
            } else {
                res.location('/');
                res.status(201).end();
            }
        }).catch((err) => {
            if (err.name === "SequelizeValidationError") {
                const error = new Error(err.message);
                error.status = 400;
                next(error);
            }
        });
    }
});

module.exports = router;