const passport = require('passport');

exports.catchErrs = (ctl) => (req, res, next) => ctl(req, res).catch(next);

exports.isAuth = (req, res, next) => {
    passport.authenticate('jwt', { session: false })(req, res, next);
};

exports.checkRole = (role) => (req, res, next) => {
    if (role.includes(req.user.role)) return next();
    return res.status(403).json({ message: "You don't have enough privileges for this action" });
};
