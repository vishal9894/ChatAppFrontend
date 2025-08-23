import React, { useState } from 'react'
import assets, { userDummyData } from '../assets/chat-app-assets/assets'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ selectedUser, setselectedUser }) => {
    const navigate = useNavigate()
    const [searchTerm, setSearchTerm] = useState('')
    const [showMenu, setShowMenu] = useState(false)
    
    // Filter users based on search term
    const filteredUsers = userDummyData.filter(user => 
        user.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    
    return (
        <div className={`bg-gradient-to-b from-[#1a163c] to-[#2a245c] h-full p-5 rounded-r-xl overflow-y-auto text-white shadow-xl ${selectedUser ? "max-md:hidden" : ""}`}>
            {/* Header section */}
            <div className="pb-6 border-b border-[#ffffff15]">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <img src={assets.logo} alt="logo" className='w-10 h-10' />
                        <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">ChatApp</h1>
                    </div>
                    
                    <div className="relative">
                        <div 
                            className="p-2 rounded-full hover:bg-[#ffffff15] cursor-pointer transition-colors"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <img src={assets.menu_icon} alt="menu" className='w-5 h-5' />
                        </div>
                        
                        {showMenu && (
                            <div className="absolute top-full right-0 z-20 w-40 p-3 rounded-xl bg-[#342b5a] border border-[#ffffff20] text-gray-100 shadow-lg mt-2">
                                <p 
                                    className="p-2 rounded-md hover:bg-[#ffffff10] transition-colors cursor-pointer"
                                    onClick={() => {
                                        navigate('/profile')
                                        setShowMenu(false)
                                    }}
                                >
                                    Edit Profile
                                </p>
                                <hr className='my-2 border-t border-[#ffffff15]' />
                                <p className='p-2 rounded-md hover:bg-[#ffffff10] transition-colors cursor-pointer text-sm'>
                                    Logout
                                </p>
                            </div>
                        )}
                    </div>
                </div>
                
                {/* Search bar */}
                <div className="flex bg-[#ffffff10] rounded-full items-center gap-3 py-3 px-4 mt-5 backdrop-blur-sm border border-[#ffffff10] transition-all focus-within:border-purple-400/30">
                    <img src={assets.search_icon} alt="search" className='w-4 opacity-70' />
                    <input 
                        type="text" 
                        className='bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1' 
                        placeholder='Search users...' 
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>
            
            {/* Users list */}
            <div className="mt-4 flex flex-col gap-1">
                {filteredUsers.length > 0 ? (
                    filteredUsers.map((user, i) => (
                        <div  
                            onClick={() => setselectedUser(user)}
                            key={user._id} 
                            className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[#ffffff15] ${
                                selectedUser?._id === user._id ? 'bg-[#6c5ce7] shadow-md' : ''
                            }`}
                        >
                            <div className="relative">
                                <img 
                                    src={user?.profilePic || assets.avatar_icon} 
                                    alt={user.fullName} 
                                    className='w-12 h-12 rounded-full object-cover border-2 border-[#ffffff20]' 
                                />
                                <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${i < 3 ? 'bg-green-400' : 'bg-gray-500'}`}></div>
                            </div>
                            
                            <div className="flex flex-col flex-1 min-w-0">
                                <p className="font-medium truncate">{user.fullName}</p>
                                <span className={`text-xs ${i < 3 ? 'text-green-400' : 'text-gray-400'}`}>
                                    {i < 3 ? 'Online' : 'Offline'}
                                </span>
                            </div>
                            
                            {i > 2 && (
                                <div className="text-xs text-gray-400 bg-[#ffffff10] rounded-full px-2 py-1">
                                    {i}h ago
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="text-center py-6 text-gray-400">
                        No users found
                    </div>
                )}
            </div>
        </div>
    )
}

export default Sidebar