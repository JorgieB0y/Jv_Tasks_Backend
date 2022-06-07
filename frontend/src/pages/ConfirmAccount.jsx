import { Fragment, useState, useEffect } from "react"
import { useParams, Link } from 'react-router-dom'
import axios from 'axios'
import Alert from '../components/Alert.jsx'
import axiosClient from '../../src/config/axiosClient.jsx'

const ConfirmAccount = () => {

  const [alert, setAlert] = useState({})
  const [confirmedAccount, setConfirmedAccount] = useState(false)

  const params = useParams();
  const { id } = params;

  useEffect(() => {
    const confirmAccount = async () => {
      try {
        const url = `/users/confirm/${id} ` 
        const { data } = await axiosClient(url)
        setAlert({
          message: data.message,
          error: false
        })
        setConfirmedAccount(true)
      } catch (error) {
        setAlert({
          message: error.response.data.message,
          error: true
        })
      }
    }

    confirmAccount()
  }, [])

  const { message } = alert; 

  return (
    <Fragment>
      <h1 
        className='text-orange-main font-black text-6xl capitalize text-center'
      > <span className='text-slate-700'>Confirm account</span> and start managing your projects
      </h1>

      <div className="mt-20 md:mt-5">
        {message && <Alert alert={alert} />}

        {confirmedAccount && (
          <nav>
            <Link className='block text-center my-5 text-slate-500 uppercase text-sm' to="/" >  
              You're all set! Log In here
            </Link>
        </nav>
        )}
      </div>
    </Fragment>
  )
}

export default ConfirmAccount