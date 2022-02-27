const Author = require('../models/Author');

exports.authorLoggedInProcess = async (req, res) => {
    if (!req.user) return res.status(200).json(null);

    const { id } = req.user;
    const user = await Author.findOne({ userId: id }).populate({ path: 'projectsOwned' });
    return res.status(200).json(user);
};

exports.editProfileImageProcess = async (req, res) => {
    const id = req.params.id;
    const { profileImage } = req.body;
    if (!profileImage) return res.status(400).json({ message: 'Send the image url' });
    const editedAuthor = await Author.findByIdAndUpdate(id, { profileImage }, { new: true });
    return res.status(202).json({ message: 'Author updated', editedAuthor });
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
    return res.status(202).json({ message: 'Author updated', editedAuthor });
};
