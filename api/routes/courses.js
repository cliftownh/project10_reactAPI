const express = require('express');
const router = express.Router();
const { Course } = require('../models');
const authenticate = require('./authenticateUser');
const { check, validationResult } = require('express-validator');

// GET list of courses
router.get('/', (req, res, next) => {
    Course.findAll({
        attributes: { exclude: ['createdAt', 'updatedAt'] }
    })
    .then(courses => {
        if (courses) {
            res.json(courses);
        } else {
            const error = new Error('Could not find courses.');
            error.status = 400;
            next(error);
        }
        }).catch(err => res.json(err));
});

// GET course by id
router.get('/:id', (req, res, next) => {
    Course.findByPk(req.params.id, 
        { attributes: { exclude: ['createdAt', 'updatedAt'] } })
    .then((course) => {
        if (course) {
            res.json(course);
        } else {
            const error = new Error('No course was found.');
            error.status = 404;
            next(error);
        }
        }).catch(err => res.json(err));
});

// POST create course
router.post('/', authenticate, [
  check('title')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please enter a course title'),
  check('description')
    .exists({ checkNull: true, checkFalsy: true })
    .withMessage('Please enter a course description')
], (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array().map(error => error.msg));
    } else {
        Course.findOne({ where: {title: req.body.title} })
        .then(course => {
            if (course) {
                let errMsg = ['This course already exists'];
                return res.status(400).json(errMsg);
            } else {
                const { id } = req.currentUser;
                req.body.userId = id;
            
                Course.create(req.body)
                .then((course) => {
                    if (!course) {
                        const error = new Error('No course was created.');
                        error.status = 400;
                        next(error);
                    } else {
                        res.location(`/api/courses/${course.id}`);
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
    }).catch(err => res.json(err));
    }
});

// PUT update course
router.put('/:id', authenticate, [
    check('title')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please enter a course title'),
    check('description')
      .exists({ checkNull: true, checkFalsy: true })
      .withMessage('Please enter a course description')
  ], (req, res, next) => {

    const { id } = req.currentUser;
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json(errors.array().map(error => error.msg));
    } else {
        Course.findByPk(req.params.id)
        .then((course) => {
            const updateCourse = () => {
                if (course.userId === id) {
                    course.update(req.body)
                    .then(() => res.status(204).end())
                    .catch((err) => {
                        if (err.name === "SequelizeValidationError") {
                            const error = new Error(err.message);
                            error.status = 400;
                            next(error);
                        }
                    });
                } else {
                    const error = new Error('Sorry, you are not authorized to edit this course.');
                    error.status = 403;
                    next(error);
                }
            };
            
            if (!course) {
                const error = new Error('No course was found.');
                error.status = 404;
                next(error);
            } else {
                Course.findOne({ where: {title: req.body.title} })
                .then(courseTitle => {
                    if (courseTitle) {
                        if (courseTitle.id === course.id) {
                            updateCourse();
                        } else {
                            let errMsg = ['This course already exists'];
                            return res.status(400).json(errMsg);
                        }
                    } else {
                        updateCourse();
                    }
                }).catch(err => res.json(err));
            }
        }).catch(err => res.sendStatus(500).json(err));
    }
});

// DELETE a course
router.delete('/:id', authenticate, (req, res, next) => {
    const { id } = req.currentUser;

    Course.findByPk(req.params.id).then((course) => {
      if (course) {
          if (course.userId === id) {
            course.destroy();
            res.status(204).end();
          } else {
            const error = new Error('Sorry, you are not authorized to delete this course.');
            error.status = 403;
            next(error);
          } 
      } else {
        const error = new Error('No course was found.');
        error.status = 404;
        next(error);
      }
    }).catch((error) => next(error));
});

module.exports = router;