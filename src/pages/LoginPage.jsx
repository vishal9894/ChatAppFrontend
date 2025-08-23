import React, { useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/chat-app-assets/assets';
import { AuthContext } from '../../context/AuthContext';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)
  const { login, authUser } = useContext(AuthContext)
  const navigate = useNavigate()

  // Redirect if already authenticated
  useEffect(() => {
    if (authUser) {
      navigate('/');
    }
  }, [authUser, navigate]);

  const onsubmitHandler = async (event) => {
    event.preventDefault();
    
    // Validate all required fields
    if (currentState === 'Sign up') {
      if (!fullName.trim()) {
        toast.error("Full name is required");
        return;
      }
      if (!email.trim()) {
        toast.error("Email is required");
        return;
      }
      if (!password.trim()) {
        toast.error("Password is required");
        return;
      }
      if (isDataSubmitted && !bio.trim()) {
        toast.error("Bio is required");
        return;
      }
    }
    
    if (currentState === 'Sign up' && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }
    
    // Proceed with API call
    login(currentState === "Sign up" ? 'signup' : "login", {
      fullName, 
      email, 
      password, 
      bio
    });
  }

  // The rest of your component remains exactly the same...
  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center gap-8 sm:justify-evenly max-sm:flex-col p-4'>
      {/* Logo Section */}
      <div className='flex flex-col items-center'>
        <img src={assets.logo_big} alt="Chat App Logo" className='w-[min(30vw,250px)] mb-4' />
        <h1 className='text-3xl font-bold text-gray-800 mb-2'>Chat App</h1>
        <p className='text-gray-600 text-center max-w-md'>Connect with friends and the world around you</p>
      </div>

      {/* Form Section */}
      <div className='bg-white/90 backdrop-blur-md rounded-xl shadow-lg border border-gray-200 p-8 w-full max-w-md'>
        <form onSubmit={onsubmitHandler} className='flex flex-col gap-6'>
          <div className='flex justify-between items-center mb-2'>
            <h2 className='font-semibold text-2xl text-gray-800'>{currentState}</h2>
            {isDataSubmitted && (
              <button 
                type="button" 
                onClick={() => setIsDataSubmitted(false)}
                className='p-2 rounded-full hover:bg-gray-100 transition-colors'
              >
                <img src={assets.arrow_icon} alt="Back" className='w-5 h-5' />
              </button>
            )}
          </div>

          {currentState === 'Sign up' && !isDataSubmitted && (
            <div className='relative'>
              <input 
                type="text" 
                onChange={(e) => setFullName(e.target.value)} 
                value={fullName} 
                className='w-full p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pl-10' 
                placeholder='Full Name' 
                required 
              />
              <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          )}

          {!isDataSubmitted && (
            <>
              <div className='relative'>
                <input 
                  onChange={(e) => setEmail(e.target.value)} 
                  value={email} 
                  type="email" 
                  placeholder='Email Address' 
                  required 
                  className='w-full p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pl-10' 
                />
                <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              
              <div className='relative'>
                <input 
                  onChange={(e) => setPassword(e.target.value)} 
                  value={password} 
                  type="password" 
                  placeholder='Password' 
                  required 
                  className='w-full p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pl-10' 
                />
                <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
            </>
          )}

          {currentState === "Sign up" && isDataSubmitted && (
            <div className='relative'>
              <textarea 
                onChange={(e) => setBio(e.target.value)} 
                value={bio} 
                required 
                className='w-full p-3 bg-gray-50 border border-gray-300 text-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all pl-10 min-h-[120px]' 
                placeholder='Tell us about yourself...'
              ></textarea>
              <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          )}

          <button 
            type='submit' 
            className='py-3 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-opacity-50'
          >
            {currentState === "Sign up" ? (isDataSubmitted ? "Complete Sign Up" : "Continue") : 'Login Now'}
          </button>
          
          <div className="flex items-start gap-3 text-sm">
            <input 
              type="checkbox" 
              className='mt-1 w-4 h-4 text-blue-500 bg-gray-100 border-gray-300 rounded focus:ring-blue-400 focus:ring-offset-gray-100' 
              required 
            />
            <p className='text-gray-600'>Agree to the <span className='text-blue-500 hover:text-blue-600 cursor-pointer'>terms of use</span> & <span className='text-blue-500 hover:text-blue-600 cursor-pointer'>privacy policy</span>.</p>
          </div>
          
          <div className="text-center pt-4 border-t border-gray-200">
            {currentState === "Sign up" ? (
              <p className='text-gray-600 text-sm'>
                Already have an account?{' '}
                <span onClick={() => setCurrentState("Login")} className='font-medium text-blue-500 hover:text-blue-600 cursor-pointer'>
                  Login here
                </span>
              </p>
            ) : (
              <p className='text-gray-600 text-sm'>
                Create an account{' '}
                <span onClick={() => setCurrentState("Sign up")} className='font-medium text-blue-500 hover:text-blue-600 cursor-pointer'>
                  Click here
                </span>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  )
}

export default LoginPage