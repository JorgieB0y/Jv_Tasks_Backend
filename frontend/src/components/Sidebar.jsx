import React from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

const Sidebar = () => {

    const { auth } = useAuth();

  return (
    <aside className='md:w-1/3 lg:w-1/4 xl:w-1/5 px-5 py-10'>
        <p className='text-xl font-bold'>
            Hello {auth.name}
        </p>

        <Link to='create-project' className='bg-orange-main w-full p-3 mt-3 text-center text-white uppercase font-bold rounded-md block'>
            Create New project
        </Link>
    </aside>
  )
}

export default Sidebar