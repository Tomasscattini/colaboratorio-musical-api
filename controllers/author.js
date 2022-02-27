const Author = require('../models/Author');
const Project = require('../models/Project');

const { calculatePagination, calculateSkips } = require('../utils/helpers');

exports.getAuthorLoggedInProcess = async (req, res) => {
    if (!req.user) return res.status(200).json(null);

    const { id, role } = req.user;
    const user = await Author.findOne({ userId: id });
    res.status(200).json({ ...user._doc, role });
};

exports.getAuthorProjectsProcess = async (req, res) => {
    const { pageSize = 10, currentPage = 1 } = req.query;
    const skips = calculateSkips(parseInt(pageSize), parseInt(currentPage));

    const { id } = req.user;
    const { id: authorId } = await Author.findOne({ userId: id });
    if (!authorId) return res.status(404).json({ message: 'Author not found' });

    const totals = await Project.countDocuments({ authorId });
    const projects = await Project.find({ authorId }).skip(skips).limit(parseInt(pageSize));

    const pagination = calculatePagination(parseInt(pageSize), parseInt(currentPage), parseInt(totals));

    res.status(200).json({ documents: projects, totals, pagination });
};

exports.editProfileImageProcess = async (req, res) => {
    const id = req.params.id;
    const { profileImage } = req.body;
    if (!profileImage) return res.status(400).json({ message: 'Send the image url' });
    const editedAuthor = await Author.findByIdAndUpdate(id, { profileImage }, { new: true });
    return res.status(202).json({ message: 'Author successfully updated', editedAuthor });
};

exports.editAuthorProcess = async (req, res) => {
    const id = req.params?.id;

    const authUserId = req.user?.id;
    const { userId } = await Author.findById(id);
    if (authUserId?.toString() !== userId?.toString())
        return res.status(403).send({ message: "You cannot edit someone else's information" });

    const authorProperties = [
        'firstName',
        'instagramProfile',
        'lastName',
        'otherLink',
        'personalWebsite',
        'phoneNumber',
        'professionalRole',
        'profileImage',
        'spotifyProfile',
        'youtubeChannel'
    ];
    const propertiesToEdit = {};
    authorProperties.forEach((property) => {
        if (!req.body[property]) return;
        propertiesToEdit[property] = req.body[property];
    });
    const editedAuthor = await Author.findByIdAndUpdate(id, { ...propertiesToEdit }, { new: true });
    return res.status(202).json({ message: 'Author successfully updated', editedAuthor });
};
