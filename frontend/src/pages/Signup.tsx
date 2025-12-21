import { useState } from 'react'
import { AiFillEye } from 'react-icons/ai'
import { IoIosEyeOff } from 'react-icons/io'
import { Link, useNavigate } from 'react-router-dom'
// import axiosInstance from "../interceptor/interceptor";
import Loader from '../ui/Loader'
import axios from 'axios'

const Signup = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [number, setNumber] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await axios.post('/api/v1/srop-signup', {
        name,
        email,
        password,
        number,
      })
      if (data) {
        navigate('/')
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
          onClick={() => navigate('/')}
          className="bg-[#3167F2] text-white px-6 py-2.5 rounded-[5px] font-semibold hover:shadow-lg transition-all duration-300 hover:-translate-y-0.5"
        >
          Login
        </button>
      </header>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row items-center justify-between gap-12 lg:gap-16 w-[80%] max-sm:w-[90%] mx-auto">
        {/* Login Form */}
        <div className="w-full lg:w-1/2 max-w-md">
          <div className="">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-3">
              Sign Up
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              Hi, New Here <span className="inline-block">👋</span>
            </p>

            {/* Email Input */}
            <form onSubmit={handleSignup}>
              <div className="mb-5">
                <label
                  className="block text-gray-900 font-semibold mb-2"
                  htmlFor="name"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full bg-[#BCCEFF] border-0 rounded-[5px] px-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
              <div className="mb-5">
                <label
                  className="block text-gray-900 font-semibold mb-2"
                  htmlFor="name"
                >
                  Number
                </label>
                <input
                  id="number"
                  type="text"
                  placeholder="Enter your number"
                  value={number}
                  maxLength={10}
                  onChange={(e) => {
                    const value = e.target.value

                    // Allow only numbers (0-9)
                    if (/^[0-9]*$/.test(value)) {
                      setNumber(value)
                    }
                  }}
                  className="w-full bg-[#BCCEFF] border-0 rounded-[5px] px-4 py-3.5 text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                  required
                />
              </div>
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

              {/* Signup Button */}
              <button
                type="submit"
                className="w-full bg-[#3167F2] text-white font-semibold py-3.5 px-4 rounded-[5px] transition-all duration-300 hover:-translate-y-1 flex justify-center items-center"
              >
                {loading ? <Loader /> : 'Signup'}
              </button>
            </form>

            {/* Sign Up Link */}
            <p className="text-center text-sm text-gray-600 my-6">
              Already have an account?{' '}
              <Link
                to={'/'}
                className="font-semibold text-blue-600 hover:text-blue-700"
              >
                Login
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

export default Signup
