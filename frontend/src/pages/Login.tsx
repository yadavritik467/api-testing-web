import { useState } from 'react'
import { AiFillEye } from 'react-icons/ai'
import { IoIosEyeOff } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
// import { chatbot_front_url } from "../AppUrl";
// import axiosInstance from "../interceptor/interceptor";
import Loader from '../ui/Loader'
import axios from 'axios'

const Login = () => {
  const [email, setEmail] = useState('')

  const [password, setPassword] = useState('')

  const [rememberMe, setRememberMe] = useState(false)

  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleLogin = async (e: any) => {
    e.preventDefault()

    setLoading(true)

    try {
      const { data } = await axios.post('/api/v1/srop-login', {
        email,
        password,
      })
      if (data?.token) {
        // window.location.href = `${chatbot_front_url}/?page=dashboard&token=${encodeURIComponent(
        //   data?.token
        // )}`;
        setLoading(false)
      }
    } catch (error) {
      console.log('err in login', error)
      setLoading(false)
    }
  }

  return (
    <div className="h-screen overflow-y-scroll">
      {/* Header */}
      <header className="flex justify-between items-center w-[80%] max-sm:w-[90%] mx-auto">
        <div className="flex items-center gap-3">
          <img
            src="/images/logo.png"
            className="w-[200px] h-[100px] object-contain"
            alt=""
          />
        </div>
        <button
          onClick={() => navigate('/signup')}
          className="bg-[#3167F2] text-white px-6 py-2.5 rounded-[5px] font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          Sign Up
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-[80%] max-sm:w-[90%] mx-auto">
        {/* Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Login now
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Hi, Welcome back <span className="inline-block">👋</span>
            </p>

            {/* Email Input */}
            <form onSubmit={handleLogin}>
              <div className="mb-5">
                <label
                  className="block text-gray-900 font-semibold mb-2"
                  htmlFor="email"
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#BCCEFF] border-0 rounded-[5px] px-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>

              {/* Password Input */}
              <div className="mb-4">
                <label
                  className="block text-gray-900 font-semibold mb-2"
                  htmlFor="password"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#BCCEFF] border-0 rounded-[5px] px-4 py-3.5 pr-12 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:text-gray-900"
                  >
                    {!showPassword ? (
                      <IoIosEyeOff size={20} />
                    ) : (
                      <AiFillEye size={20} />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between mb-6">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    Remember Me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-700"
                >
                  Forgot Password?
                </a>
              </div>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-[#3167F2] text-white font-semibold py-3.5 px-4 rounded-[5px] transition-all duration-300 hover:-translate-y-1 flex justify-center items-center"
              >
                {loading ? <Loader /> : 'Login'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Not registered yet?{' '}
              <Link
                to={'/signup'}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Create an account
              </Link>
            </p>
          </div>
        </div>

        {/* Illustration */}
        <div className="w-full lg:w-1/2 flex justify-center items-center">
          <img
            src="/images/login.png"
            className="w-full h-[500px] max-sm:h-[300px] object-contain"
          />
        </div>
      </div>
    </div>
  )
}

export default Login
