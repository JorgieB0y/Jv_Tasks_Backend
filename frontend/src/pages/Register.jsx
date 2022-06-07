import React, { Fragment, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import Alert from '../components/Alert'
import axiosClient from '../config/axiosClient.jsx'

const Register = () => {

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmed, setConfirm] = useState('')
  const [alert, setAlert] = useState({})

  const handleSubmit = async (event) => {
    event.preventDefault()

    // Validate all form fields are not empty
    if([name, email, password, confirmed].includes('')) {
      setAlert({
        message: "All fields are required",
        error: true
      })

      return
    } 

    if(password !== confirmed) {
      setAlert({
        message: "Oops! Seems your passwords don't match",
        error: true
      })

      return
    }

    if(password.length <= 6) {
      setAlert({
        message: "Your password is too short",
        error: true
      })

      return
    }

    setAlert({})

    // Create user in Database
    try {
      const { data } = await axiosClient.post('/users', {
        name, 
        email,
        password
      })

      setAlert({
        message: `${data.message}`,
        error: false
      })

      // Reset User states to reset the form 

      setName('')
      setEmail('')
      setPassword('')
      setConfirm('')

    } catch (error) {
      console.log(error)
      setAlert({
        message: `${error.response.data.message}`,
        error: true
      })
    }
  }

  const { message } = alert;

  return (
    <Fragment>
      <h1 
        className='text-orange-main font-black text-6xl capitalize text-center'
      > <span className='text-slate-700'>Register</span> to Manage your projects
      </h1>

      {message && <Alert alert={alert} />}
      
      <form className='my-10 bg-white shadow-md rounded-lg px-10 py-5' onSubmit={handleSubmit} >

        <div className='my-5'>
            <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='name'> Name: </label>
            <input 
              id='name'
              type='text'
              placeholder='George V'
              className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
              value={name}
              onChange={event => setName(event.target.value)}
            />
          </div>
        
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='email'> Email: </label>
          <input 
            id='email'
            type='email'
            placeholder='you@email.com'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={event => setEmail(event.target.value)}
          />
        </div>

        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='password'> Password: </label>
          <input 
            id='password'
            type='password'
            placeholder='Your super safe password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={password}
            onChange={event => setPassword(event.target.value)}
          />
        </div>

        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='passwordRepeat'> Confirm Password: </label>
          <input 
            id='passwordRepeat'
            type='password'
            placeholder='Confirm your super safe password'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={confirmed}
            onChange={event => setConfirm(event.target.value)}
          />
        </div>

        <input 
          type='submit'
          value='Register'
          className="w-full bg-orange-button text-white shadow font-bold uppercase rounded-xl py-3 mb-3 hover:cursor-pointer hover:bg-orange-main transition-colors"
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
          <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/" >  
            Already have an account? Log In
          </Link>

          <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/Forgot-Password" >  
            Forgot Password
          </Link>
      </nav>
    </Fragment>
  )
}

export default Register