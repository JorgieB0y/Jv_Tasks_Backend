import React, { Fragment } from 'react'
import NewProjectForm from '../components/NewProjectForm'

const NewProject = () => {

  return (
    <Fragment>
      <h1 className='text-4xl font-black text-center'> Create New Project </h1>

      <div className='mt-10 flex justify-center'>
        <NewProjectForm /> 
      </div>
    </Fragment>
  )
}

export default NewProject