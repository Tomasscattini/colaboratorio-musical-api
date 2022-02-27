const express = require('express');
const router = express.Router();
const { isAuth, catchErrs } = require('../middlewares');

const {
    changePasswordProcess,
    // confirmSignupProcess,
    deleteAccountProcess,
    loginProcess,
    logoutProcess,
    signupProcess
} = require('../controllers/auth');

router.post('/changePassword', isAuth, catchErrs(changePasswordProcess));
// router.get('/confirm/:email/:id', catchErrs(confirmSignupProcess));
router.delete('/delete', isAuth, catchErrs(deleteAccountProcess));
router.post('/login', loginProcess);
router.get('/logout', logoutProcess);
router.post('/signup', signupProcess);

module.exports = router;
