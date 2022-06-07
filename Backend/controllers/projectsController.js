import Project from "../models/Project.js";
import Task from "../models/Task.js";
import User from "../models/User.js";

const fetchProjects = async (req, res) => {
    /* Mongoose will fetch projects where the Project's value for projectOwner matches the user passed in the request */
    const projects = await Project.find({
        '$or' : [
            {collaborators: {$in: req.user}},
            {projectOwner: {$in: req.user}},

        ]
    }).select("-tasks")  

    try {
        res.json(projects)
    } catch (error) {
        console.log(`Something went wrong fetching projects: ${error.message}`)
        res.status(401).json({ message: error.message})
    }
}

const fetchProject = async (req, res) => {
    const { id } = req.params;

    // Will create a project 'populated' with the tasks and collaborators references 
    const project = await Project.findById(id).populate({path: 'tasks', populate: {path: 'completedBy', select: 'name'}}).populate('collaborators', 'email name') // Get Project by id & populate Array tasks

    // Validate if the project exists or not
    if (!project) {
        const error = new Error('Project not found')
        return res.status(404).json({ message: error.message })
    }

    // Validate that the user has ownership of the project and isn't a collaborator of the project
    if (project.projectOwner.toString() !== req.user._id.toString() && !project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString()) ) {
        const error = new Error('You do not have permission to view that project')
        return res.status(401).json({ message: error.message })
    } 
    
    // Return both objects inside the same json response 
    res.json(
        project
    )
}

const createNewProject = async (req, res) => {
    const project = new Project(req.body); // Make new project instance with the body of the json
    project.projectOwner = req.user._id; // Assign the id of the User as the Project's Owner

    try {
        const storeProject = await project.save() // Save new project in database
        res.json(storeProject)
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: error.message})
    }
}

const editProject = async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id) // Get Project by id

    // Validate if the project exists or not
    if (!project) {
        const error = new Error('Project not found')
        return res.status(404).json({ message: error.message })
    }

    // Validate that the user has ownership of the project
    if (project.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error('You do not have permission to edit that project')
        return res.status(401).json({ message: error.message })
    }

    project.name = req.body.name || project.name;
    project.description = req.body.description || project.description;
    project.client = req.body.client || project.client;
    project.dueDate = req.body.dueDate || project.dueDate;

    try {
        const updatedProject = await project.save()
        res.json(updatedProject)
    } catch (error) {
        res.status(403).json({ message: error.message })
    }
}

const deleteProject = async (req, res) => {
    const { id } = req.params;

    const project = await Project.findById(id) // Get Project by id

    // Validate if the project exists or not
    if (!project) {
        const error = new Error('Project not found')
        return res.status(404).json({ message: error.message })
    }

    // Validate that the user has ownership of the project
    if (project.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error('You do not have permission to delete that project')
        return res.status(401).json({ message: error.message })
    }

    try {
        await project.deleteOne(); // Mongoose method to delete from Mongo
        res.json({ message: "Project was deleted!"})
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: `Could not delete project. Reason: ${error.message}`})
    }
}

const searchCollaborator = async(req, res) => {
   const { email } = req.body;
   const user = await User.findOne({email}).select('-confirmed -createdAt -password -token -updatedAt -__v')

    if (!user) {
        const error = new Error('User does not exist')
        return res.status(404).json({message: error.message})
    }

    res.json(user)
}

const addCollaborator = async (req, res) => {
    const project = await Project.findById(req.params.id);

    // If Project doesn't exist
    if (!project) {
        const error = new Error('Project does not exist')
        return res.status(404).json({error: error.message});
    }

    // Only the Project Owner can add collaborators
    if (project.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error('Only project owner can add collaborators')
        return res.status(403).json({error: error.message});
    }

    // Check to see if User exists
    const { email } = req.body;
    const user = await User.findOne({email}).select('-confirmed -createdAt -password -token -updatedAt -__v')

        if (!user) {
            const error = new Error('User does not exist')
            return res.status(404).json({message: error.message})
        }

    // Verify Project Owner is not the same as the Collaborator 
    if (project.projectOwner.toString() === user._id.toString()) {
        const error = new Error('Collaborator is Project Owner')
        return res.status(401).json({message: error.message});
    }

    // Verify collaborator isn't already in the project
    if (project.collaborators.includes(user._id)) {
        const error = new Error('Collaborator is already added in this project')
        return res.status(401).json({message: error.message});
    }

    // Add collaborator to project collaborators 
    project.collaborators.push(user._id)
    await project.save()
    res.json({message: 'Collaborator added to project'})
    
}

const deleteCollaborator = async (req, res) => {
    const project = await Project.findById(req.params.id);

    // If Project doesn't exist
    if (!project) {
        const error = new Error('Project does not exist')
        return res.status(404).json({error: error.message});
    }

    // Only the Project Owner can delete collaborators
    if (project.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error('Only project owner can delete collaborators')
        return res.status(403).json({error: error.message});
    }

    // Delete collaborator from collaborators array and save the collection
    project.collaborators.pull(req.body.id)
    await project.save()
    res.json({message: 'Collaborator was deleted from project'})

}

export {
    fetchProjects,
    fetchProject,
    createNewProject,
    editProject,
    deleteProject,
    searchCollaborator,
    addCollaborator,
    deleteCollaborator,
}