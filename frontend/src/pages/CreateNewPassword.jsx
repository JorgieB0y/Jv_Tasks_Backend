import { Fragment, useState, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import Alert from '../components/Alert.jsx'
import axiosClient from '../config/axiosClient.jsx'

const CreateNewPassword = () => {

  const [validToken, setValidToken] = useState(false)
  const [password, setNewPassword] = useState('')
  const [modifiedPassword, setModifiedPassword] = useState(false)
  const [alert, setAlert] = useState({})

  const params = useParams()
  const { token } = params;

  useEffect(() => {
    const verifyToken = async () => {
      try {
        const response = await axiosClient(`/users/forgot-password/${token}`) 

        if (response.status === 200) {
          setValidToken(true)
        } 
      } catch (error) {
        setValidToken(false)

        setAlert({
          message: error.message,
          error: true
        })
      }
    }

    verifyToken()
  }, [])  

  const onChangePassword = (event) => {
    event.preventDefault()

    setNewPassword(event.target.value)
  }

  const onSubmit = async (event) => {
    event.preventDefault();

    if (password.trim() === '' || password.length < 6) {
      setAlert({
        message: 'Password has to be at least 6 characters long',
        error: true
      })

      return
    }

    try {
      const url = `/users/forgot-password/${token}`

      const { data } = await axiosClient.post(url, { password });
      
      setAlert({
        message: `${data.message}`,
        error: false
      })

      setModifiedPassword(true)
    } catch (error) {
      setAlert({
        message: error.message,
        error: true
      })
    }

  }

  
  const { message } = alert;

  return (
    <Fragment>
        <h1 
          className='text-orange-main font-black text-6xl capitalize text-center'
        > <span className='text-slate-700'>Restore password.</span> don't lose your projects
        </h1>

        { message && (
          <Alert 
            alert={alert}
          />
        ) }
        
        { validToken ? 
            <form className='my-10 bg-white shadow-md rounded-lg px-10 py-5' onSubmit={onSubmit} >
              <div className='my-5'>
                <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='password'> New Password: </label>
                <input 
                  id='password'
                  type='password'
                  value={password}
                  onChange={onChangePassword}
                  placeholder='Your new super safe password'
                  className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
                />
              </div>

              <input 
                type='submit'
                value='Set New Password'
                className="w-full bg-orange-button text-white shadow font-bold uppercase rounded-xl py-3 mb-3 hover:cursor-pointer hover:bg-orange-main transition-colors"
              />
            </form> : 
              
            null
          }

          {modifiedPassword && (
            <nav>
              <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/" >  
                You're all set! Log In here
              </Link>
          </nav>
          )}
      </Fragment>
  )
}

export default CreateNewPassword