const bcrypt = require('bcrypt');
const Author = require('../models/Author');
const Project = require('../models/Project');
const User = require('../models/User');
const passport = require('../config/passport');
// const { confirmationEmail } = require('../config/nodemailer');

const { deconstructFullName } = require('../utils/helpers');

exports.loginProcess = (req, res, next) => {
    passport.authenticate('local', (err, user, failureDetails) => {
        if (err) {
            return res.status(500).json({ message: 'Something went wrong authenticating user', type: 'server' });
        }
        if (!user) {
            return res.status(401).json({ ...failureDetails, type: 'all' });
        }

        req.login(user, async (err) => {
            if (err) {
                return res.status(500).json({ message: 'Something went wrong authenticating user', type: 'server' });
            }
            const { id, role } = user;
            const author = await Author.findOne({ userId: id });
            res.status(200).json({ ...author?._doc, role });
        });
    })(req, res, next);
};

exports.signupProcess = async (req, res) => {
    const { email, fullName, password } = req.body;
    if (!email || !password || !fullName) {
        return res.status(406).json({
            message: 'Indicate email, password and full name',
            type: 'data'
        });
    }
    const user = await User.findOne({ email });
    if (user) {
        return res.status(406).json({
            message: 'Username already exist',
            type: 'email'
        });
    }
    const salt = bcrypt.genSaltSync(12);
    const hashPass = bcrypt.hashSync(password, salt);
    const authUser = await User.create({
        email,
        password: hashPass
    });
    const userId = authUser?._id?.toString();

    const { firstName, lastName } = deconstructFullName(fullName);

    const newAuthor = await Author.create({
        email,
        userId,
        firstName,
        lastName
    });
    // await confirmationEmail(email, id);
    res.status(201).json({ ...newAuthor?._doc, role: authUser?.role });
};

// exports.confirmSignupProcess = async (req, res, next) => {
//     const { email, id } = req.params;
//     const user = await User.findOne({ email });
//     if (!user) return res.status(404).json({ message: 'user not found' });
//     if (id !== user._id.toString()) return res.status(400).json({ message: 'Confirm your email' });
//     await User.findByIdAndUpdate(user._id, { confirmed: true }, { new: true });
//     res.redirect(process.env.FRONTENDPOINT + '/confirmed');
// };

exports.changePasswordProcess = async (req, res) => {
    const id = req.user.id;
    let { password } = await User.findById(id);
    const { newPassword, oldPassword } = req.body;
    if (!oldPassword || !newPassword) {
        return res.status(400).json({ message: 'Specify your current password and a new one', type: 'password' });
    } else if (!bcrypt.compareSync(oldPassword, password)) {
        return res.status(400).json({ message: 'Wrong password', type: 'oldPassword' });
    } else {
        const salt = bcrypt.genSaltSync(12);
        const hashPass = bcrypt.hashSync(newPassword, salt);
        await User.findByIdAndUpdate(id, { password: hashPass });
        return res.status(202).json({ message: 'Password succesfully updated' });
    }
};

exports.logoutProcess = (req, res) => {
    req.logout();
    res.status(200).json({ message: 'User logged out' });
};

exports.deleteAccountProcess = async (req, res) => {
    const authUserId = req.user?.id;
    const { deletedata } = req.query;

    const deletedUser = await User.findByIdAndDelete(authUserId);
    if (!deletedUser) res.status(404).json({ message: 'User not found', type: 'data' });

    if (deletedata) {
        const deletedAuthor = await Author.findOneAndDelete({ userId: deletedUser.id });
        await Project.deleteMany({ authorId: deletedAuthor.id });
    }

    res.status(200).json({ message: 'Account successfully deleted' });
};
