const express = require('express');
const router = express.Router();
const { isAuth, catchErrs } = require('../middlewares');

const { authorLoggedInProcess, editAuthorProcess, editProfileImageProcess } = require('../controllers/author');

router.get('/', authorLoggedInProcess);
router.patch('/profileImage/:id', isAuth, catchErrs(editProfileImageProcess));
router.patch('/:id', isAuth, catchErrs(editAuthorProcess));

module.exports = router;
