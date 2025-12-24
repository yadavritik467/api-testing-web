import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'
import './index.css'
import Sidebar from './layouts/Sidebar'
import Loader from './ui/Loader'

const Login = lazy(() => import('./pages/Login'))
const Signup = lazy(() => import('./pages/Signup'))

const Home = lazy(() => import('./pages/Home'))
const Collection = lazy(() => import('./pages/Collection'))

const App = () => {
  return (
    <div className="w-full bg-gradient-to-br from-indigo-50 via-blue-50 to-indigo-100 h-[100vh]">
      <ToastContainer />
      <div className="grid grid-cols-12">
        <div className="col-span-3">
          <Sidebar />
        </div>
        <div className="col-span-9 overflow-y-scroll h-[100vh]">
          <Suspense
            fallback={
              <div className="w-screen h-screen flex justify-center items-center">
                {' '}
                <Loader />{' '}
              </div>
            }
          >
            <Routes>
              <Route
                path="/collection/:collectionId"
                element={<Collection />}
              />
              <Route
                path="/collection/:collectionId/request"
                element={<Home />}
              />

              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
            </Routes>
          </Suspense>
        </div>
      </div>
    </div>
  )
}

export default App
