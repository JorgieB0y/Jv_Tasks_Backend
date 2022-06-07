import React from 'react'
import useProjects from '../hooks/useProjects';

const Collaborator = ({collaborator}) => {

  const { name, email } = collaborator;

  const { handleDeleteCollaboratorModalTaskForm } = useProjects();

  return (
    <div className='border-b p-5 flex justify-between items-center row'>
        <div>
          <p>
            {name}
          </p>
          <p className='text-sm text-gray-700'>
            {email}
          </p>
        </div>

        <div>
            <button
              className='bg-orange-600 px-5 py-2 text-white upperacase font-bold text-sm rounded-lg hover:bg-orange-700 transition-colors'
              onClick={() => handleDeleteCollaboratorModalTaskForm(collaborator)}
            >
              Delete
            </button>
        </div>
    </div>
  )
}

export default Collaborator