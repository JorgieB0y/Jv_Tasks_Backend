import React, {useState} from 'react'
import Alert from './Alert'
import useProjects from '../hooks/useProjects'
import Spinner from './Spinner'

const CollaboratorForm = () => {

    const [email, setEmail] = useState('')

    const { searchCollaborator, alert, loading, displayAlert } = useProjects();

    const handleSubmit = (event) => {
        event.preventDefault();

        if (email === '') {
            displayAlert({
                error: true,
                message: 'Please insert a valid Email address'
            })

            return
        }

        searchCollaborator(email);
        
    } 

    const {message} = alert;

    if (loading) return <Spinner />

  return (
    <form 
        className='bg-white py-10 px-5 w-full md:w-1/2 rounded-lg shadow'
        onSubmit={handleSubmit}
    >
         <div className='mb-5'>
            <label 
                className='text-gray-700 uppercase font-bold text-sm' 
                htmlFor="email">
                Collaborator Email:
            </label>

            {message && <Alert alert={alert} />}

            <input 
                className='border-2 w-full p-2 mt-2 placeholder-gray-400 rounded-md' 
                id='email' 
                type="email" 
                placeholder='your-email@gmail.com' 
                value={email}
                onChange={event => setEmail(event.target.value)}
            />
        </div>
        <input type="submit" className="bg-orange-main hover:bg-orange-500 w-full p-3 text-white uppercase font-bold cursor-pointer transition-colors rounded" value="Search Collaborator" />
    </form>
  )
}

export default CollaboratorForm