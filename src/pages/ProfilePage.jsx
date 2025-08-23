import React, { useContext, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import assets from '../assets/chat-app-assets/assets'
import { AuthContext } from '../../context/AuthContext'
import toast from 'react-hot-toast'

const ProfilePage = () => {
  const [selectedImg, setSelectedImg] = useState(null)
  const navigate = useNavigate()
  const { authUser, updateProfile } = useContext(AuthContext)
  const [name, setName] = useState('')
  const [bio, setBio] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [isInitializing, setIsInitializing] = useState(true)
  const [profilePic, setProfilePic] = useState('')

  // Initialize form with user data
  useEffect(() => {
    if (authUser) {
      setName(authUser.fullName || '')
      setBio(authUser.bio || '')
      setProfilePic(authUser.profilePic || '')
    }
    setIsInitializing(false)
  }, [authUser])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    // Validate inputs
    if (!name.trim()) {
      toast.error("Name is required")
      return
    }
    
    if (!bio.trim()) {
      toast.error("Bio is required")
      return
    }
    
    setIsLoading(true)
    
    try {
      let updateData = { fullName: name, bio }
      
      if (selectedImg) {
        const reader = new FileReader()
        reader.onloadend = async () => {
          try {
            updateData.profilePic = reader.result
            const result = await updateProfile(updateData)
            
            if (result && result.success) {
              // Update local state with new data
              setProfilePic(result.user.profilePic || reader.result)
              setSelectedImg(null)
              toast.success("Profile updated successfully!")
            } else {
              toast.error(result?.message || "Failed to update profile")
            }
          } catch (error) {
            console.error('Error updating profile:', error)
            toast.error("Failed to update profile")
          } finally {
            setIsLoading(false)
          }
        }
        reader.onerror = () => {
          toast.error("Error reading image file")
          setIsLoading(false)
        }
        reader.readAsDataURL(selectedImg)
      } else {
        const result = await updateProfile(updateData)
        
        if (result && result.success) {
          // Update local profile pic if it was returned from backend
          if (result.user && result.user.profilePic) {
            setProfilePic(result.user.profilePic)
          }
          toast.success("Profile updated successfully!")
        } else {
          toast.error(result?.message || "Failed to update profile")
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error("Failed to update profile")
      setIsLoading(false)
    }
  }

  const handleImageChange = (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    // Check if file is an image
    if (!file.type.startsWith('image/')) {
      toast.error("Please select an image file")
      return
    }
    
    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("File size too large. Please select an image under 5MB.")
      return
    }
    
    setSelectedImg(file)
    
    // Preview the image immediately
    const reader = new FileReader()
    reader.onload = (e) => {
      setProfilePic(e.target.result)
    }
    reader.readAsDataURL(file)
  }

  // Show loading while initializing
  if (isInitializing) {
    return (
      <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center'>
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!authUser) {
    navigate('/login')
    return null
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center p-4'>
      <div className="bg-white/95 backdrop-blur-md w-full max-w-4xl text-gray-800 flex max-lg:flex-col rounded-2xl overflow-hidden shadow-xl border border-gray-200">
        {/* Form Section */}
        <div className="flex-1 p-8">
          <form onSubmit={handleSubmit} className='flex flex-col gap-6'>
            <div className="flex items-center justify-between mb-6">
              <h2 className='text-2xl font-bold text-gray-800'>Profile Details</h2>
              <button
                type="button"
                onClick={() => navigate('/')}
                className="text-gray-500 hover:text-gray-700 transition-colors p-2 rounded-lg hover:bg-gray-100"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Profile Image Upload */}
            <div className="form-group">
              <label className='block text-sm font-medium text-gray-700 mb-3'>Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 rounded-full bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden">
                    <img
                      src={profilePic || assets.avatar_icon}
                      alt="Profile"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                  {selectedImg && (
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedImg(null)
                        setProfilePic(authUser.profilePic || '')
                      }}
                      className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 rounded-full text-white text-sm flex items-center justify-center hover:bg-red-600 transition-colors shadow-md"
                    >
                      ×
                    </button>
                  )}
                </div>
                <div className="flex-1">
                  <input
                    onChange={handleImageChange}
                    type="file"
                    id="avatar"
                    accept=".png, .jpg, .jpeg, .webp"
                    className="hidden"
                  />
                  <label
                    htmlFor="avatar"
                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl text-gray-700 cursor-pointer hover:bg-gray-100 transition-colors text-center text-sm font-medium shadow-sm"
                  >
                    {selectedImg ? 'Change Image' : 'Upload Profile Image'}
                  </label>
                  <p className="text-xs text-gray-500 mt-2">JPG, PNG, WebP (Max 5MB)</p>
                </div>
              </div>
            </div>

            {/* Name Input */}
            <div className="form-group">
              <label htmlFor="name" className='block text-sm font-medium text-gray-700 mb-2'>Your Name</label>
              <div className="relative">
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  id="name"
                  required
                  placeholder="Enter your name"
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
                />
                <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
            </div>

            {/* Bio Textarea */}
            <div className="form-group">
              <label htmlFor="bio" className='block text-sm font-medium text-gray-700 mb-2'>Profile Bio</label>
              <div className="relative">
                <textarea
                  onChange={(e) => setBio(e.target.value)}
                  value={bio}
                  id="bio"
                  required
                  placeholder="Write something about yourself..."
                  rows={4}
                  className="w-full px-4 py-3 pl-10 bg-gray-50 border border-gray-300 rounded-xl text-gray-800 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all resize-none"
                />
                <svg className="w-5 h-5 absolute left-3 top-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <p className="text-xs text-gray-500 mt-2">{bio.length}/150 characters</p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-6">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors font-medium shadow-sm"
              >
                Back to Chat
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className={`flex-1 px-6 py-3 bg-gray-700 text-white rounded-xl font-medium shadow-md transition-all ${
                  isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-600 hover:-translate-y-0.5'
                }`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                    Saving...
                  </div>
                ) : (
                  'Save Changes'
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview Section */}
        <div className="flex-1 bg-gradient-to-br from-gray-50 to-gray-100 p-8 flex flex-col items-center justify-center max-lg:hidden border-l border-gray-200">
          <div className="text-center">
            <div className="relative mb-6">
              <div className="w-32 h-32 rounded-full bg-white border-4 border-gray-200 mx-auto overflow-hidden shadow-md">
                <img
                  src={profilePic || assets.avatar_icon}
                  alt="Profile Preview"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white shadow-sm"></div>
            </div>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">{name || 'Your Name'}</h3>
            <p className="text-gray-600 text-sm mb-4 max-w-xs mx-auto leading-relaxed">
              {bio || 'Your bio will appear here...'}
            </p>
            <div className="flex justify-center gap-2">
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
              <div className="w-2 h-2 rounded-full bg-gray-400"></div>
              <div className="w-2 h-2 rounded-full bg-blue-400"></div>
            </div>
            
            {/* Stats Preview */}
            <div className="mt-8 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-lg font-semibold text-gray-800">128</div>
                  <div className="text-xs text-gray-500">Friends</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-800">24</div>
                  <div className="text-xs text-gray-500">Groups</div>
                </div>
                <div>
                  <div className="text-lg font-semibold text-gray-800">1.2K</div>
                  <div className="text-xs text-gray-500">Messages</div>
                </div>
              </div>
            </div>
            
            {/* Update Status */}
            <div className="mt-6 p-3 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-xs text-blue-700">
                {selectedImg ? 'New image selected' : 'Profile up to date'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage