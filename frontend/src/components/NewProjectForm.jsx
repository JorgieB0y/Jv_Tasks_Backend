import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import useProjects from '../hooks/useProjects.jsx';
import Alert from './Alert.jsx';

const NewProjectForm = () => {

    const params = useParams();

    const [name, setName] = useState('')
    const [id, setID] = useState(null)
    const [description, setDescription] = useState('')
    const [dueDate, setDueDate] = useState('')
    const [client, setClient] = useState('')

    const { alert, displayAlert, submitProject, project } = useProjects();

    useEffect(() => {
        if (params.id && project.name) {
            // Edit mode
            setID(project._id)
            setName(project.name)
            setDescription(project.description)
            setDueDate(project.dueDate.split('T')[0])
            setClient(project.client)
        } else {
            // New Project 
        }
    }, [params.id])

    const handleSubmit = async (event) => {
        event.preventDefault()

        if ([name, description, dueDate, client].includes('')) {
            displayAlert({
                error: true,
                message: 'Fields can not be empty'
            })

            return 
        }

        // Pass data to provider
        await submitProject({
            id,
            name,
            description,
            dueDate,
            client
        });

        setID(null)
        setName('')
        setDescription('')
        setDueDate('')
        setClient('')
    }

    const { message } = alert; 

  return (
    <form 
        className='bg-white shadow rounded-lg py-10 px-5 md:w-1/2'
        onSubmit={handleSubmit}
    >
        {message && <Alert alert={alert} />}

        <div className='mb-5'>
            <label htmlFor="name" className='text-gray-700 uppercase font-bold text-sm'>Project Name</label>
            <input 
                id="name" 
                type="text" 
                value={name} 
                onChange={e => setName(e.target.value)} 
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
                placeholder='My super awesome project'/>
        </div>

        <div className='mb-5'>
            <label htmlFor="description" className='text-gray-700 uppercase font-bold text-sm'>Project Description</label>
            <textarea 
                id="description"
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
                placeholder='Create a super awesome project'/>
        </div>

        <div className='mb-5'>
            <label htmlFor="due-date" className='text-gray-700 uppercase font-bold text-sm'>Due Date</label>
            <input 
                id="due-date" 
                type="date" 
                value={dueDate} 
                onChange={e => setDueDate(e.target.value)} 
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' />
        </div>

        <div className='mb-5'>
            <label htmlFor="client-name" className='text-gray-700 uppercase font-bold text-sm'>Client Name</label>
            <input 
                id="client-name" 
                type="text" 
                value={client} 
                onChange={e => setClient(e.target.value)} 
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
                placeholder='Elon Musk'/>
        </div>

        <input
            type='submit'
            value={params.id ? 'Update Project' : 'Create New Project'}
            className='bg-orange-main w-full rounded-md text-white uppercase p-3 font-bold cursor-pointer hover:bg-orange-500 transition-colors'
        />
    </form>
  )
}

export default NewProjectForm