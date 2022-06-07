import React from 'react'
import { Link } from 'react-router-dom'
import Search from './Search'
import useProjects from '../hooks/useProjects'

const Header = () => {

    const { handleSearch } = useProjects();

  return (
    <header className='px-4 py-5 bg-white border-b'>

        <div className='sm:flex sm:justify-between'>

            <h2 className='md:mb-0 mb-2 text-4xl text-center text-orange-main font-black'>
                JV Tasks
            </h2>

            <div className='flex flex-col sm:flex-row items-center gap-4'>
                <button
                    type='button' 
                    className='font-bold uppercase'
                    onClick={handleSearch}
                > Search Project </button>

                <Link to='/projects' className='font-bold uppercase'> Projects </Link>

                <button 
                    type='button' 
                    className='text-white text-sm bg-orange-main p-3 rounded-md uppercase font-bold'
                > Sign Out </button>

                <Search /> 
            </div>
        </div>
    </header>
  )
}

export default Header