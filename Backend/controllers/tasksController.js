import Task from "../models/Task.js";
import Project from "../models/Project.js";

const createNewTask = async (req, res) => {
    
    const { project } = req.body;

    const taskProject = await Project.findById(project);

    if (!taskProject) {
        const error = new Error('Project was not found')
        return res.status(404).json({ message: error.message })
    }

    if (taskProject.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error('Invalid Access')
        res.status(403).json({ message: error.message })
    }

    try {
        const newTask = await Task(req.body);
        await newTask.save()
        await taskProject.tasks.push(newTask._id)
        await taskProject.save()
        return res.json(newTask)
    } catch (error) {
        console.log(error)
        res.status(401).json({ message: `Could not create new task: ${error.message}` })
    }

} 

const getTask = async (req, res) => {
    const { id } = req.params;

    const fetchTask = await Task.findById(id).populate("project")

    if (!fetchTask) {
        const error = new Error('Task does not exist')
        return res.status(404).json({ message: error.message })
    }
    
    if (fetchTask.project.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error('Invalid user permission')
        return res.status(403).json({ message: error.message })
    } else {
        return res.json(fetchTask)
    }

} 

const updateTask = async (req, res) => {
    const { id } = req.params;

    const fetchTask = await Task.findById(id).populate("project")

    if (!fetchTask) {
        const error = new Error('Task does not exist')
        return res.status(404).json({ message: error.message })
    }
    
    if (fetchTask.project.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error('Invalid user permission')
        return res.status(403).json({ message: error.message })
    }

    fetchTask.name = req.body.name || fetchTask.name;
    fetchTask.description = req.body.description || fetchTask.description;
    fetchTask.priority = req.body.priority || fetchTask.priority;
    fetchTask.status = req.body.status || fetchTask.status;
    fetchTask.dueDate = req.body.dueDate || fetchTask.dueDate;

    try {
        const storedTask = await fetchTask.save()
        res.json(storedTask)
    } catch (error) {
        return res.status(401).json({ message: error.message })
    }
} 

const deleteTask = async (req, res) => {
    const { id } = req.params;

    const fetchTask = await Task.findById(id).populate("project") // populate method will get the project object for that Task

    if (!fetchTask) {
        const error = new Error('Task does not exist')
        return res.status(404).json({ message: error.message })
    }
    
    if (fetchTask.project.projectOwner.toString() !== req.user._id.toString()) {
        const error = new Error(`Invalid User permission`)
        return res.status(403).json({ message: error.message })
    }

    try {
        // Delte task reference from Project's tasks array
        const project = await Project.findById(fetchTask.project)
        project.tasks.pull(fetchTask._id)
        await Promise.allSettled([await project.save(), await fetchTask.deleteOne()]);
        // Delete task from Task collection
        await fetchTask.deleteOne();
        // Succesful response from API
        res.json({ message: "Task was deleted 👍"})
        console.log(`Project with id: ${id} was deleted`)
    } catch (error) {
        console.log(error)
        res.status(403).json({ message: `Could not delete Task. Reason: ${error.message}`})
    }
} 

const changeTaskStatus = async (req, res) => {
    const { id } = req.params

    // Search Task and populate project object
    const task = await Task.findById(id).populate("project")

    // If task doesn't exist
    if (!task) {
        const error = new Error('Task was not found')
        return res.status(404).json({message: error.message})
    }

    // Check collaborator / Project Ownership to toggle status
    if (task.project.projectOwner.toString() !== req.user._id.toString() && !task.project.collaborators.some(collaborator => collaborator._id.toString() === req.user._id.toString())) {
        const error = new Error(`Invalid User permission`)
        return res.status(403).json({ message: error.message })
    }

    // Toggle task status & assign who completed the task
    task.status = !task.status
    task.completedBy = req.user._id
    // Save task on Mongo and return the task as JSON
    await task.save() 
    // Once task has been saved, we hit the api again to populate who it was completed by AFTER saving the task 
    const savedTask = await Task.findById(id).populate("project").populate("completedBy")
    // Respond with the Saved Task after having saved the completedBy parameter
    res.json(savedTask)
} 

export {
    createNewTask,
    getTask,
    updateTask,
    deleteTask,
    changeTaskStatus
}