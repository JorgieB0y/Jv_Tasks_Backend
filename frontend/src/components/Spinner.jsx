import React, { Fragment } from 'react'
import '../styles/SpinnerStyles.css'

const Spinner = () => {
  return (
    <Fragment>
        <div className='spinnerContainer'>
          <div className="lds-ring"><div></div><div></div><div></div><div></div></div>
        </div>
    </Fragment>
  )
}

export default Spinner