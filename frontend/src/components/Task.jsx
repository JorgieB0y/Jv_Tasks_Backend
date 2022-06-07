import React, { Fragment, useEffect } from 'react'
import { dateFormatter } from '../helpers/dateFormatter.jsx'
import useProjects from '../hooks/useProjects.jsx';
import useAdmin from '../hooks/useAdmin.jsx';

let socket;

const Task = ({task}) => {

    const { name, description, dueDate, priority, status, _id, completedBy } = task;

    const { handleModalEditTaskForm, handleDeleteModalTaskForm, completeTask, updatedCompletedTask } = useProjects();
    const admin = useAdmin();

  return (
    <Fragment>
        <div className='flex border-b p-5 flex justify-between items-center'>
            <div className='flex flex-col items-start'>
                <p className='mb-1 text-xl'>{name}</p>
                <p className='mb-1 text-md text-gray-700'>{description}</p>
                <p className='mb-1 text-sm text-gray-600 uppercase font-bold'>{priority}</p>
                <p className='mb-1 text-md'>{dateFormatter(dueDate)}</p>
                {status ? <p className='text-xs italic text-white bg-green-400 rounded-md py-1 px-2'>Completed by <span className='font-bold text-white'>{completedBy.name}</span></p> : null }
            </div>

            <div className='flex flex-col lg:flex-row gap-2'>
                {admin && (
                    <button 
                        className='bg-orange-600 px-5 py-2 text-white upperacase font-bold text-sm rounded-lg hover:bg-orange-700 transition-colors'
                        onClick={() => handleModalEditTaskForm(task)}                
                    > Edit 
                    </button>
                )}


                <button 
                    className={`${status ? 'bg-green-400' : 'bg-red-600'} px-5 py-2 text-white upperacase font-bold text-sm rounded-lg hover:bg-green-700 transition-colors`}
                    onClick={() => completeTask(_id)}
                    > {status ? 'Complete' : 'Incomplete'} 
                </button>

                {admin && (
                    <button 
                        className='bg-orange-600 px-5 py-2 text-white upperacase font-bold text-sm rounded-lg hover:bg-orange-700 transition-colors'
                        onClick={() => handleDeleteModalTaskForm(task)}
                    >  Delete
                    </button>
                )}
            </div>
        </div>
    </Fragment>
  )
}

export default Task