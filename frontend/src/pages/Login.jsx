import React, { Fragment, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axiosClient from '../config/axiosClient'
import Alert from '../components/Alert.jsx'
import useAuth from '../hooks/useAuth'

const Login = () => {

  // State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [alert, setAlert] = useState({})

  const { setAuth } = useAuth();

  const navigate = useNavigate();


  // Validation and Helpers
  const onChangeEmail = (event) => {
    event.preventDefault()

    setEmail(event.target.value);
  }

  const onChangePassword = (event) => {
    event.preventDefault()

    setPassword(event.target.value);
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if ([email, password].includes('')){
      setAlert({
        message: 'Both fields are required',
        error: true
      })

      return 
    }

    try {
      // API call to login
      const { data } = await axiosClient.post('/users/login', { email, password })
      
      // Store response data in LocalStorage
      localStorage.setItem('token', data.token)
      
      // Set user data in Auth context
      setAuth(data)

      // Send user to projects page
      navigate('/projects');

      // Clear Alert
      setAlert({})
    } catch (error) {
      console.log(error)
      // setAlert({
      //   message: `${error.response.data.message}`,
      //   error: true
      // })
    }

  }

  const { message } = alert;

  return (
    <Fragment>
      <h1 
        className='text-orange-main font-black text-6xl capitalize text-center'
      > <span className='text-slate-700'>Login</span> to Manage your projects
      </h1>

      {message && <Alert alert={alert} />}
      
      <form className='my-10 bg-white shadow-md rounded-lg px-10 py-5' onSubmit={handleSubmit}>
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='email'> Email: </label>
          <input 
            id='email'
            type='email'
            value={email}
            onChange={onChangeEmail}
            placeholder='you@email.com'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
          />
        </div>

        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='password'> Password: </label>
          <input 
            id='password'
            type='password'
            value={password}
            onChange={onChangePassword}
            placeholder='Your super safe password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
          />
        </div>

        <input 
          type='submit'
          value='Log In'
          className="w-full bg-orange-button text-white shadow font-bold uppercase rounded-xl py-3 mb-3 hover:cursor-pointer hover:bg-orange-main transition-colors"
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
          <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/register" >  
            Don't have an account? It's free!
          </Link>

          <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/Forgot-Password" >  
            Forgot Password
          </Link>
      </nav>
    </Fragment>
  )
}

export default Login