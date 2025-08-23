import React, { useState } from 'react'
import Sidebar from '../components/Sidebar'
import ChatContainer from '../components/ChatContainer'
import RightSidebar from '../components/RightSidebar'

const HomePage = () => {
  const [selectedUser, setselectedUser] = useState(false)

  return (
    <div className='w-full h-screen bg-gradient-to-br from-[#0f0c29] via-[#1a1642] to-[#24243e] p-4'>
      <div className="max-w-7xl mx-auto h-full flex items-center justify-center">
        <div className="glass-effect rounded-3xl overflow-hidden h-[95%] w-full max-w-6xl flex relative shadow-2xl border border-[#ffffff10]">
          {/* Left Sidebar */}
          <div className="w-1/4 min-w-[280px] max-w-[350px] border-r border-[#ffffff10]">
            <Sidebar selectedUser={selectedUser} setselectedUser={setselectedUser} />
          </div>
          
          {/* Main Chat Area */}
          <div className="flex-1 flex w-full flex-col">
            <ChatContainer selectedUser={selectedUser} setselectedUser={setselectedUser} />
          </div>
          
          {/* Right Sidebar */}
          <div className="w-1/4 min-w-[280px] max-w-[350px] border-l border-[#ffffff10]">
            <RightSidebar selectedUser={selectedUser} setselectedUser={setselectedUser} />
          </div>
        </div>
      </div>
    </div>
  )
}

export default HomePage