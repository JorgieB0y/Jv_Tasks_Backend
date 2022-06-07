import { Fragment, useState  } from "react"
import { Link } from "react-router-dom"
import axios from "axios"
import Alert from "../components/Alert"
import axiosClient from "../config/axiosClient"

const ForgotPassword = () => {

  const [email, setEmail] = useState('')
  const [alert, setAlert] = useState({})

  const onChange = (event) => {
    event.preventDefault()
    setEmail(event.target.value)
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (email === "" || email.length < 6) {
      setAlert({
        error: true,
        message: "Must be a valid email address"
      })  

      return 
    } 

    try {
      const { data } = await axiosClient.post(`/users/forgot-password`, { email })

      setAlert({
        message: data.message,
        error: false,
      })  

      // Reset Form
      setEmail('')
    } catch (error) {

      setAlert({
        error: true,
        message: error.response.data.message
      })

    }

  }

  const { message } = alert;

  return (
    <Fragment>
      <h1 
        className='text-orange-main font-black text-6xl capitalize text-center'
      > <span className='text-slate-700'>Restore</span> your password
      </h1>

      {message && <Alert alert={alert} />}
      
      <form className='my-10 bg-white shadow-md rounded-lg px-10 py-5' onSubmit={handleSubmit}>
        <div className='my-5'>
          <label className='uppercase text-gray-600 block text-xl font-bold' htmlFor='email'> Reset Instructions: </label>
          <input 
            id='email'
            type='email'
            placeholder='you@email.com'
            className='w-full mt-3 p-3 border rounded-xl bg-gray-50'
            value={email}
            onChange={onChange}
          />
        </div>

        <input 
          type='submit'
          value='Reset Password'
          className="w-full bg-orange-button text-white shadow font-bold uppercase rounded-xl py-3 mb-3 hover:cursor-pointer hover:bg-orange-main transition-colors"
        />
      </form>

      <nav className='lg:flex lg:justify-between'>
          <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/register" >  
            Don't have an account? It's free!
          </Link>

          <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/" >  
            Log In 
          </Link>
      </nav>
    </Fragment>
  )
}

export default ForgotPassword