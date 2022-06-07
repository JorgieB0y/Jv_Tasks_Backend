import React, { Fragment, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import useProjects from '../hooks/useProjects';
import useAdmin from '../hooks/useAdmin';
import Spinner from '../components/Spinner';
import TaskModalForm from '../components/TaskModalForm';
import DeleteTaskModalForm from '../components/DeleteTaskModalForm';
import Alert from '../components/Alert';
import Task from '../components/Task';
import Collaborator from '../components/Collaborator.jsx'
import DeleteCollaboratorModal from '../components/DeleteCollaboratorModal';
// Import socket io's client
import io from 'socket.io-client';

// Declare a new socket variable
let socket;

const Project = () => {

  const params = useParams();
  const admin = useAdmin()

  const { alert, loading, project, getProject, handleModalTaskForm, submitTasksToProject, updatedDeletedTask, editedTaskUpdate, updatedCompletedTask } = useProjects() 

  const { name } = project;

  useEffect(() => {
    getProject(params.id);
  }, [])

  useEffect(() => {
    // Connect the socket to a url via the io method
    socket = io(import.meta.env.VITE_BACKEND_URL)

    // Emit a new connection to the backend with it's params
    socket.emit('open project', params.id)
  }, [])

  useEffect(() => {
    socket.on('created task', (newTask) => {
      if (newTask.project === project._id) {
        submitTasksToProject(newTask);
      }
    })

    socket.on('deleted task', (deletedTask) => {
      if (deletedTask.project === project._id) {
        updatedDeletedTask(deletedTask)
      }
    })

    socket.on('updated task', (updatedTask) => {
      if (updatedTask.project._id === project._id) {
        editedTaskUpdate(updatedTask)
      }
    })

    socket.on('completed task', (task) => {
      if (task.project._id === project._id) {
          updatedCompletedTask(task)
      }
  })
  })
  
  if (loading) return <Spinner />

  return (
    <Fragment>
      <div className='flex justify-between'>
      <h1 className='font-black text-4xl'>{name}</h1>

      {admin && (
        <div className='flex item-center gap-2 text-gray-400 hover:text-black text-center'>
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 hover:cursor-pointer" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" 
          />
        </svg>

          <Link className='uppercase font-bold' to={`/projects/edit/${params.id}`}>Edit</Link>
        </div>
      )}
      </div>

      {admin && (
        <button 
        type='button' 
        onClick={handleModalTaskForm}
        className='flex gap-2 itex-center text-sm px-5 py-3 mt-3 justify-center w-full md:w-auto rounded-lg uppercase font-bold bg-orange-main text-white text-center hover:bg-orange-500'
          > 
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
          </svg>
          New Task 
        </button>
      )}

      <p className='font-bold text-xl mt-10'>Project Tasks</p>

      {alert.message && <Alert alert={alert} />}

      <div className='bg-white shadow mt-10 rounded-lg'>
        {project.tasks?.length ? 
          project.tasks?.map(task => (
            <Task 
              key={task._id}
              task={task}
            />
          )) : 
          <p className='text-center my-5 p-10'>No tasks yet...</p>}
      </div>

      {admin && (
        <Fragment>
          <div className='flex items-center justify-between mt-10'>
            <p className='font-bold text-xl'>Collaborators</p>
            <Link 
              to={`/projects/add-collaborator/${project._id}`}
              className='text-gray-400 uppercase font-bold hover:text-black'
            >
              Add 
            </Link>
          </div>

          <div className='bg-white shadow mt-10 rounded-lg'>
            {project.collaborators?.length ? 
              project.collaborators?.map(collaborator => (
                <Collaborator 
                  key={collaborator._id}
                  collaborator={collaborator}
                />
              )) : 
              <p className='text-center my-5 p-10'>No collaborators yet...</p>}
          </div>
        </Fragment>
      )}

      <TaskModalForm />   
      <DeleteTaskModalForm />
      <DeleteCollaboratorModal />
    </Fragment>
  )
}

export default Project