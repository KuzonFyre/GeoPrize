import { useState } from 'react'
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom"
import './App.css'
import { ApiContext } from "./contexts/api"
import { Api } from "./lib/api"
import { Root} from './pages/Root'
import {Login} from './pages/Login'
import {Signup} from './pages/Signup'
import {Contract} from './pages/Contract'
import { CreateContract } from './pages/CreateContract'
import { Contracts } from './pages/Contracts'
import { Home } from './pages/Home'

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
        path: 'contracts/',
        element: <Contracts />
      },
      {
        path: 'contract/:address/:to/:from/',
        element: <Contract />
      },
      {
        path: '/',
        element: <Home/>
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
