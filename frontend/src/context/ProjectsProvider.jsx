import { createContext, useEffect, useState } from 'react'
import axiosClient from '../config/axiosClient'
import { useNavigate } from 'react-router-dom'
import io from 'socket.io-client'

const ProjectsContext = createContext();

let socket;

const ProjectsProvider = ({children}) => {

  const [projects, setProjects] = useState([]);
  const [alert, setAlert] = useState({});
  const [project, setProject] = useState({});
  const [loading, setLoading] = useState(false);
  const [modalTaskForm, setModalTaskForm] = useState(false);
  const [deleteModalTaskForm, setDeleteModalTaskForm] = useState(false);
  const [deleteCollaboratorModalForm, setDeleteCollaboratorModalTaskForm] = useState(false)
  const [search, setSearch] = useState(false); 
  const [task, setTask] = useState({});
  const [collaborator, setCollaborator] = useState({})

  const navigate = useNavigate();

  const displayAlert = (alert) => {
      
    setAlert(alert);

    setTimeout(() => {
      setAlert({})
    }, 5000)
  }

  useEffect(() => {
    fetchProjects();
  }, [])

  useEffect(() => {
    socket = io(import.meta.env.VITE_BACKEND_URL)
  }, [])

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.get('/projects', config)
      setProjects(data)
      
    } catch (error) {
      console.log(error)
    }
  }

  const submitProject = async (project) => {

    if (project.id) {
      await editProject(project);
    } else {
      await newProject(project);
    }

  }

  const editProject = async (project) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.put(`/projects/${project.id}`, project, config)

      const updatedProjects = projects.map(project => project._id === data._id ? data : project)
      
      setProjects(updatedProjects);

      setAlert({
        message: 'Project has been updated',
        error: false
      })

      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000)

    } catch (error) {
      console.log(error)
    }
  }

  const newProject = async (project) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.post('/projects', project, config);
      setProjects([...projects, data])

      setAlert({
        message: 'New Project Was Created',
        error: false
      })

      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000)

    } catch (error) {
      console.log(error)
    }
  }

  const deleteProject = async (id) => {
    try { 
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.delete(`/projects/${id}`, config)
      
      const updatedProjects = projects.filter(project => project._id !== id)

      setProjects(updatedProjects);

      setAlert({
        message: data.message,
        error: false
      })

      setTimeout(() => {
        setAlert({});
        navigate('/projects');
      }, 3000)

    } catch (error) {
      console.log(error)
      setAlert({
        message: 'There was an error deleting the project',
        error: true
      })
    }
  }

  const getProject = async (id) => {

    setLoading(true)

    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.get(`/projects/${id}`, config);

      setProject(data);
    } catch (error) {
      console.log(error)
      setAlert({
        error: true,
        message: error.response.data.message,
      })
    } finally {
      setLoading(false)
      setAlert({})
    }
  }

  const handleModalTaskForm = () => {
    // Toggle modal window
    setModalTaskForm(!modalTaskForm);
    // Set task state to empty
    setTask({})
  }

  const handleDeleteModalTaskForm = (task) => {
    setTask(task)
    setDeleteModalTaskForm(!deleteModalTaskForm)
  }


  const handleModalEditTaskForm = (task) => {
    setTask(task)
    setModalTaskForm(true)
  }

  const submitTask = async (task) => {
    if (task?.id) {
      await editTask(task)
    } else {
      await createNewTask(task)
    }
  }
  
  const createNewTask = async (task) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      // POST Api call to MongoDB 
      const { data } = await axiosClient.post('/tasks', task, config)
      // Reset any alert 
      setAlert({})
      // Close the Modal task form 
      setModalTaskForm(false)
      // Pass data to event in socket io
      socket.emit('create task', data)

    } catch (error) {
      console.log(error)
    }
  }

  const editTask = async (task) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const {data} = await axiosClient.put(`/tasks/${task.id}`, task, config)

      socket.emit('edit task', data)

      setAlert({})
      setModalTaskForm(false)

    } catch (error) {
      console.log(error)
    }
  }

  const deleteTask = async () => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const {data} = await axiosClient.delete(`/tasks/${task._id}`, config)

      socket.emit('delete task', task)

      setAlert({
        error: false,
        message: data.message,
      })

      setDeleteModalTaskForm(false)
    
      setTimeout(() => {
        setAlert({})
      }, 3000)

    } catch (error) {
      console.log(error)
    }
  }

  const searchCollaborator = async (email) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.post('/projects/collaborators', {email}, config)

      setLoading(true)

      setCollaborator(data)
      setAlert({})
      
    } catch (error) {
      setAlert({
        error: true,
        message: error.response.data.message
      })

      setTimeout(() => {
        setAlert({})
      }, 3000)
    } finally {
      setLoading(false)
    }
  }

  const addCollaborator = async (email) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.post(`/projects/collaborators/${project._id}`, {email}, config);

      displayAlert({
        error: false,
        message: data.message
      })

      setCollaborator({})

    } catch (error) {
      displayAlert({
        error: true,
        message: error.response.data.message,
      })
      console.log(error)
    }
  }

  const handleDeleteCollaboratorModalTaskForm = (collaborator) => {
    // Toggle the Modal 
    setDeleteCollaboratorModalTaskForm(!deleteCollaboratorModalForm);

    // Set collaborator in State
    setCollaborator(collaborator)
  }

  const deleteCollaborator = async (collaborator) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.post(`projects/delete-collaborators/${project._id}`, {id: collaborator._id}, config)

      // Modify React state with updated database info
      const updatedProject = {...project}
      updatedProject.collaborators = updatedProject.collaborators.filter(collabMember => collabMember._id !== collaborator._id)
      setProject(updatedProject)

      // Handle display response 
      displayAlert({
        error: false,
        message: data.message,
      })

      // Reset collaborator state
      setCollaborator({})
      // Close the delete collaborator modal
      setDeleteCollaboratorModalTaskForm(false)

    } catch (error) {
      console.log(error)
    }
  }

  const completeTask = async (id) => {
    try {
      const token = localStorage.getItem('token')

      if (!token) {
        return 
      }

      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}` 
        }  
      }

      const { data } = await axiosClient.post(`/tasks/status/${id}`, {}, config)

      socket.emit('complete task', data)

    } catch (error) {
      console.log(error)
    }
  }

  const handleSearch = () => {
    setSearch(!search);
  }

  // Socket io methods
  const submitTasksToProject = (task) => {
    // Make a copy of the entire project
    const updatedProject = {...project}
    // Add new task to the array of projects tasks
    updatedProject.tasks = [...updatedProject.tasks, task]
    // Change current Project state to be our updated project
    setProject(updatedProject)
  }

  const updatedDeletedTask = (task) => {
    // Copy the current project
    const updatedProject = {...project}
    // Update the tasks to remove the selected task
    updatedProject.tasks = updatedProject.tasks.filter(localTask => localTask._id !== task._id)
    // Update the project state
    setProject(updatedProject)
    // Update the task state
    setTask({})
  }

  const editedTaskUpdate = (task) => {
    const updatedProject = {...project}
    updatedProject.tasks = updatedProject.tasks.map(taskState => taskState._id === task._id ? task : taskState)
    setProject(updatedProject)
  }

  const updatedCompletedTask = (task) => {
    const updatedProject = { ...project }
    updatedProject.tasks = updatedProject.tasks.map(stateTask => stateTask._id === task._id ? task : stateTask)
    setProject(updatedProject)
    setTask({})
  }

  const projectsCloseSession = () => {
    setProjects([])
    setAlert({})
    setProject({})
    setTask({})
  }

  return (
    <ProjectsContext.Provider
      value={{
        loading,
        projects,
        alert,
        project,
        modalTaskForm,
        deleteModalTaskForm,
        deleteCollaboratorModalForm,
        task,
        collaborator,
        search,
        fetchProjects,
        displayAlert,
        submitProject,
        getProject,
        deleteProject,
        handleModalTaskForm,
        submitTask,
        handleModalEditTaskForm,
        handleDeleteModalTaskForm,
        handleDeleteCollaboratorModalTaskForm,
        deleteTask,
        searchCollaborator,
        addCollaborator,
        deleteCollaborator,
        completeTask,
        handleSearch,
        submitTasksToProject,
        updatedDeletedTask,
        editedTaskUpdate,
        updatedCompletedTask,
        projectsCloseSession,
      }}
    >
      {children}
    </ProjectsContext.Provider>
  )
}

export {
  ProjectsProvider
}

export default ProjectsContext;