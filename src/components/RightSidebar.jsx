import React from 'react'
import assets, { imagesDummyData } from '../assets/chat-app-assets/assets'

const RightSidebar = ({ selectedUser }) => {
    return selectedUser && (
        <div className={`bg-gradient-to-b from-[#1a163c]/80 to-[#2a245c]/80 backdrop-blur-md text-white w-full h-full relative overflow-y-auto flex flex-col ${selectedUser ? "max-md:hidden" : ""}`}>
            {/* User Profile Section */}
            <div className="pt-8 flex flex-col items-center gap-4 text-center px-6">
                <div className="relative">
                    <img 
                        src={selectedUser?.profilepic || assets.avatar_icon} 
                        alt={selectedUser.fullName} 
                        className='w-24 h-24 rounded-full object-cover border-4 border-purple-500/30 shadow-lg' 
                    />
                    <div className="absolute bottom-2 right-2 w-4 h-4 rounded-full bg-green-500 border-2 border-white"></div>
                </div>
                
                <div className="flex flex-col items-center gap-1">
                    <h1 className='text-xl font-semibold text-white flex items-center gap-2'>
                        {selectedUser.fullName}
                        <span className='w-2 h-2 rounded-full bg-green-500 animate-pulse'></span>
                    </h1>
                    <p className='text-gray-300 text-sm'>{selectedUser.bio || "No bio available"}</p>
                </div>
            </div>

            <hr className='border-[#ffffff20] my-6 mx-6' />

            {/* Media Section */}
            <div className="px-6">
                <div className="flex items-center justify-between mb-4">
                    <p className="text-sm font-medium text-white">Media</p>
                    <span className="text-xs text-gray-400 bg-[#ffffff10] px-2 py-1 rounded-full">
                        {imagesDummyData.length} items
                    </span>
                </div>
                <div className="grid grid-cols-3 gap-3">
                    {imagesDummyData.map((url, index) => (
                        <div 
                            key={index} 
                            onClick={() => window.open(url)} 
                            className="cursor-pointer rounded-lg overflow-hidden group relative aspect-square"
                        >
                            <img 
                                src={url} 
                                alt={`Media ${index + 1}`} 
                                className='w-full h-full object-cover transition-transform duration-300 group-hover:scale-110' 
                            />
                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300"></div>
                        </div>
                    ))}
                </div>
            </div>

           
           

            {/* Logout Button */}
            <div className="mt-auto p-6">
                <button className='w-full bg-gradient-to-r from-pink-500 to-violet-600 text-white font-medium py-3 px-6 rounded-xl cursor-pointer hover:from-pink-600 hover:to-violet-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5'>
                    Logout
                </button>
            </div>
        </div>
    )
}

export default RightSidebar