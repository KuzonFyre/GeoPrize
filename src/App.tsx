import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom"
import './App.css'
import { ApiContext } from "./contexts/api"
import { Api } from "./lib/api"
import React from 'react'
import ReactDOM from 'react-dom/client'
import { Root} from './pages/Root'
import {Login} from './pages/Login'
import {Signup} from './pages/Signup'
import {Contract} from './pages/Contract'
import { CreateContract } from './pages/CreateContract'


const router = createBrowserRouter([
  {
    path: '/',
    element: <Root />,
    children: [
      {
        path: 'create-contract/',
        element: <CreateContract />
      },
      {
        path: 'login/',
        element: <Login />
      },
      {
        path: 'signup/',
        element: <Signup />
      },
      {
        path: 'contract/',
        element: <Contract />
      }
    ]
  }
])
export const App = () => {
  const [api, setApi] = useState(new Api());
  return (
    <>
    <ApiContext.Provider value = {api}>
      <RouterProvider router={router} />
    </ApiContext.Provider>
    </>
  )
}
