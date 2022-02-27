const Author = require('../models/Author');
const Project = require('../models/Project');

exports.getProjectsProcess = async (req, res) => {
    // const { currentPage = 1, pageSize = 10 } = req.query;
    const workStatusOptions = {
        0: 'composing',
        1: 'published'
    };
    const status = req.query?.status;
    const filters = [{ privacyStatus: 'public' }];
    if (status && status !== '-1') filters.push({ workStatus: workStatusOptions[status] });

    const projects = await Project.find({ $and: filters });
    if (!projects) return res.status(404).send({ message: 'Projects not found' });

    res.status(200).send({ documents: projects, totals: 0, pagination: {} });
};

exports.getProjectProcess = async (req, res) => {
    const { id } = req.params;

    const authUserId = req.user?.id;
    const projectOwner = await Author.findOne({ $and: [{ userId: authUserId }, { projectsOwned: id }] });

    const project = await Project.findById(id);
    if (!project) return res.status(404).send({ message: 'Project not found' });
    if (project.privacyStatus === 'private' && !projectOwner)
        return res.status(403).send({ message: "You cannot see someone else's private project" });

    res.status(200).send(project);
};

exports.createProjectProcess = async (req, res) => {
    const authUserId = req.user?.id;
    const author = await Author.findOne({ userId: authUserId });
    if (!author) return res.status(404).send({ message: 'Author does not exist' });

    const projectProperties = ['privacyStatus', 'workStatus'];
    const newProject = { authorId: author.id };
    projectProperties.forEach((property) => {
        if (!req.body[property]) return;
        newProject[property] = req.body[property];
    });
    const project = await Project.create(newProject);
    await Author.findByIdAndUpdate(newProject.authorId, { $push: { projectsOwned: project._id } });
    res.status(201).send({ message: 'Project succesfully created', project });
};

exports.editProjectProcess = async (req, res) => {
    const id = req.params?.id;
    if (!id) return res.status(400).send({ message: 'Specify the project to edit' });

    const authUserId = req.user?.id;
    const projectOwner = await Author.findOne({ $and: [{ userId: authUserId }, { projectsOwned: id }] });
    if (!projectOwner) return res.status(403).send({ message: "You cannot edit someone else's projects" });

    const projectProperties = ['headVersion', 'privacyStatus', 'workStatus'];
    const propertiesToEdit = {};
    projectProperties.forEach((property) => {
        if (!req.body[property]) return;
        propertiesToEdit[property] = req.body[property];
    });
    const editedProject = await Project.findByIdAndUpdate(id, { ...propertiesToEdit }, { new: true });
    if (!editedProject) return res.status(404).send({ message: 'Project not found' });

    return res.status(202).json({ message: 'Project successfully updated', editedProject });
};

exports.deleteProjectProcess = async (req, res) => {
    const projectId = req.params.id;
    if (!projectId) return res.status(400).send({ message: 'Specify the project to delete' });

    const authUserId = req.user?.id;
    const projectOwner = await Author.findOne({ $and: [{ userId: authUserId }, { projectsOwned: projectId }] });
    if (!projectOwner) return res.status(403).send({ message: "You cannot delete someone else's projects" });

    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) return res.status(404).send({ message: 'Project not found' });

    const authorId = deletedProject?.authorId;
    if (authorId) await Author.findByIdAndUpdate(authorId, { $pull: { projectsOwned: projectId } }, { new: true });
    res.status(200).json({ message: 'Project successfully deleted' });
};
