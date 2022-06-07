import React, { Fragment, useEffect } from 'react'
import CollaboratorForm from '../components/CollaboratorForm'
import useProjects from '../hooks/useProjects'
import { useParams } from 'react-router-dom'
import Spinner from '../components/Spinner'

const NewCollaborator = () => {

    const { getProject, project, collaborator, loading, addCollaborator } = useProjects();
    const params = useParams();

    useEffect(() => {
        getProject(params.id)
    }, [])

    if (loading) return <Spinner /> 
    
  return (
    <Fragment>
        <h1 className='text-4xl font-black '>
            Add collaborator to {project.name}
        </h1>

        <div className='mt-10 flex justify-start'>
            <CollaboratorForm />
        </div>

        {loading ? <Spinner /> : collaborator?._id && (
            <div className='flex justify-start mt-10'>
                <div className='bg-white py-10 px-5 md:w-1/2 rounded-lg shadow w-full'>
                    <h2 className='mb-10 text-2xl font-bold'>Collaborator:</h2>

                    <div className='flex justify-between'>
                        <p>
                            {collaborator.name}
                        </p>

                        <button
                            type='button' 
                            className='bg-orange-main hover:bg-orange-500 py-1 px-2 text-white uppercase font-bold cursor-pointer transition-colors rounded'
                            onClick={() => addCollaborator(collaborator.email)}
                        >
                            Add to Project </button>
                    </div>
                </div>
            </div>
        )}
    </Fragment>
  )
}

export default NewCollaborator