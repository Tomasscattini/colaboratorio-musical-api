const express = require('express');
const router = express.Router();
const { isAuth, catchErrs } = require('../middlewares');

const {
    createProjectProcess,
    deleteProjectProcess,
    editProjectProcess,
    getProjectProcess,
    getProjectsProcess
} = require('../controllers/project');

router.get('/', catchErrs(getProjectsProcess));
router.get('/:id', isAuth, catchErrs(getProjectProcess));
router.post('/', isAuth, catchErrs(createProjectProcess));
router.patch('/:id', isAuth, catchErrs(editProjectProcess));
router.delete('/:id', isAuth, catchErrs(deleteProjectProcess));

module.exports = router;
