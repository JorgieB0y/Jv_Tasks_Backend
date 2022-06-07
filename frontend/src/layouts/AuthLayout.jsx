import { Fragment } from 'react'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    
    <Fragment>
        <main className='container mx-auto p-5 mt-5 md:mt-20 md:flex md:justify-center'>
          <div className='md:w-2/3 lg:w-1/2'>
            <Outlet /> 
          </div>
        </main>
    </Fragment>

  )
}

export default AuthLayout