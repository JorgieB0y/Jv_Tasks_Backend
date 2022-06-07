import React from 'react'
import { Link } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export const ProjectPreview = ({project}) => {

    const { auth } = useAuth()

    const { name, _id, client, projectOwner } = project;

  return (
    <div className='flex-col md:flex-row border-b p-5 flex justify-between'>
        <div className='flex items-center gap-3'>
          <p className='flex-1 font-bold'>{name}
              <span className='text-gray-500 text-sm uppercase pl-3'>{client}</span>
          </p>

          {auth._id !== projectOwner && (
            <p className='p-1 text-white bg-green-400 font-bold rounded-lg uppercase text-xs'>Collaborator</p>
          )}
        </div>

        <Link className='text-gray-600 hover:text-orange-main font-bold uppercase' to={`${_id}`}>Manage</Link>
    </div>
  )
}
