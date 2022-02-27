const express = require('express');
const router = express.Router();
const { isAuth, catchErrs } = require('../middlewares');

const {
    loginProcess,
    signupProcess,
    // confirmSignupProcess,
    changePasswordProcess,
    logoutProcess
} = require('../controllers/auth');

router.post('/login', loginProcess);
router.post('/signup', signupProcess);
// router.get('/confirm/:email/:id', catchErrs(confirmSignupProcess));
router.post('/changePassword', isAuth, catchErrs(changePasswordProcess));
router.get('/logout', logoutProcess);

module.exports = router;
