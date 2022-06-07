import React, { Fragment } from 'react'
import { Outlet, Navigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'
import Spinner from '../components/Spinner.jsx'
import Header from '../components/Header'
import Sidebar from '../components/Sidebar'

const SecuredRoute = () => {

    const { auth, userLoading } = useAuth();

    if (userLoading) return <Spinner />

  return (
    <Fragment>
        {auth._id ? (
          <div className='bg-gray-100'>
            <Header /> 

            <div className='md:flex md:min-h-screen'>
              <Sidebar />

              <main className='flex-1 p-10'>
                <Outlet />
              </main>
            </div>
          </div>
        ) : <Navigate to="/" /> }
    </Fragment>
  )
}

export default SecuredRoute