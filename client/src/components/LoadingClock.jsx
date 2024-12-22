import React from 'react'
import {ClockLoader} from 'react-spinners'

const LoadingClock = () => {
  return (
    <div className='h-screen flex justify-center items-center bg-white'><ClockLoader /></div>
  )
}

export default LoadingClock;