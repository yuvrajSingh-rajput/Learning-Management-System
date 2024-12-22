import React from 'react'
import Navbar from '@/components/Navbar'
import { Outlet } from 'react-router-dom'

function MainLayout() {
  return (
    <div>
        <Navbar />
        <div>
            <Outlet/>
        </div>
    </div>
  )
}

export default MainLayout