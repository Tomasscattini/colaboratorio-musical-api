const express = require('express');
const router = express.Router();
const { isAuth, catchErrs } = require('../middlewares');

const {
    editAuthorProcess,
    editProfileImageProcess,
    getAuthorLoggedInProcess,
    getAuthorProjectsProcess
} = require('../controllers/author');

router.get('/', getAuthorLoggedInProcess);
router.get('/projects', isAuth, catchErrs(getAuthorProjectsProcess));
router.patch('/profileImage/:id', isAuth, catchErrs(editProfileImageProcess));
router.patch('/:id', isAuth, catchErrs(editAuthorProcess));

module.exports = router;
