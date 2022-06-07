import React, { Fragment, useEffect } from 'react'
import useProjects from '../hooks/useProjects.jsx'
import { ProjectPreview } from '../components/ProjectPreview'
import Spinner from '../components/Spinner.jsx'

const Projects = () => {

  const { projects, loading, fetchProjects } = useProjects()

  if (loading) return <Spinner />

  useEffect(() => {
    fetchProjects()
  }, [])

  return (
    <Fragment>
      <h1 className='text-3xl font-black'>
        Projects
      </h1>

      <div className='bg-white shadow mt-10 rounded-lg'>
        {projects.length === 0 ? 
          <p className='mt-5 p-5 text-center text-gray-600 uppercase'>There are no projects</p>
        : 
        projects.map(project => (
            <ProjectPreview 
              key={project._id}
              project={project}
            />
          ))}
      </div>
    </Fragment>
  )
}

export default Projects