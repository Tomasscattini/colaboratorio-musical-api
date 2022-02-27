const Author = require('../models/Author');
const Project = require('../models/Project');

exports.getProjectsProcess = async (req, res) => {
    // const { currentPage = 1, pageSize = 10 } = req.query;

    const projects = await Project.find({ privacyStatus: 'public' });
    if (!projects) return res.status(404).send({ message: 'Projects not found' });

    res.status(200).send({ documents: projects, totals: 0, pagination: {} });
};

exports.getProjectProcess = async (req, res) => {
    const { id } = req.params;
    const project = await Project.findById(id);
    if (!project) return res.status(404).send({ message: 'Project not found' });

    res.status(200).send(project);
};

exports.createProjectProcess = async (req, res) => {
    const projectProperties = ['authorId', 'privacyStatus'];
    if (!req.body.authorId) return res.status(400).send({ message: 'Missing properties' });

    const author = Author.findById(req.body.authorId);
    if (!author) return res.status(404).send({ message: 'Author does not exist' });

    const newProject = {};
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

    const projectProperties = ['privacyStatus'];
    const propertiesToEdit = {};
    projectProperties.forEach((property) => {
        if (!req.body[property]) return;
        propertiesToEdit[property] = req.body[property];
    });
    const editedProject = await Project.findByIdAndUpdate(id, { ...propertiesToEdit }, { new: true });
    return res.status(202).json({ message: 'Project updated', editedProject });
};

exports.deleteProjectProcess = async (req, res) => {
    const projectId = req.params.id;
    if (!projectId) return res.status(400).send({ message: 'Specify the project to delete' });

    const deletedProject = await Project.findByIdAndDelete(projectId);
    if (!deletedProject) return res.status(404).send({ message: 'Project not found' });

    const authorId = deletedProject?.authorId;
    if (authorId) await Author.findByIdAndUpdate(authorId, { $pull: { projectsOwned: projectId } }, { new: true });
    res.status(200).json({ message: 'Project deleted' });
};
