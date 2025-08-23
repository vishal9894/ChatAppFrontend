import React, { useRef, useState, useEffect } from 'react'
import assets, { messagesDummyData } from '../assets/chat-app-assets/assets'
import { formatMessageTime } from '../lib/utils'

const ChatContainer = ({ selectedUser, setselectedUser }) => {
  const scrollEnd = useRef()
  const [message, setMessage] = useState('')

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [messagesDummyData])

  const handleSendMessage = () => {
    if (message.trim() !== '') {
      // In a real app, you would send the message to your backend here
      console.log("Sending message:", message)
      setMessage('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSendMessage()
    }
  }

  return selectedUser ? (
    <div className='h-full flex flex-col bg-gradient-to-br from-[#0f0b2e] to-[#1f1b45]'>
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-r from-[#1a163c]/80 to-[#2a245c]/80 backdrop-blur-md border-b border-[#ffffff15]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={assets.profile_martin} 
              alt="Profile" 
              className='w-10 h-10 rounded-full object-cover border-2 border-purple-500/50 shadow-lg' 
            />
            <span className='absolute bottom-0 right-0 w-3 h-3 rounded-full bg-green-500 border-2 border-[#1a163c]'></span>
          </div>
          <div>
            <p className='text-white font-semibold'>Vishal</p>
            <p className='text-xs text-green-400 flex items-center gap-1'>
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
              Online
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setselectedUser(null)} 
            className="p-2 rounded-full hover:bg-[#ffffff15] transition-all duration-200 md:hidden"
          >
            <img src={assets.arrow_icon} alt="Back" className='w-5 h-5 opacity-80' />
          </button>
          <button className="p-2 rounded-full hover:bg-[#ffffff15] transition-all duration-200">
            <img src={assets.help_icon} alt="Help" className='w-5 h-5 opacity-80' />
          </button>
        </div>
      </div>
      
      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-4 bg-chat-pattern">
        <div className="flex flex-col gap-4 pb-4">
          {messagesDummyData.map((msg, index) => {
            const isCurrentUser = msg.senderId === '985959dkf443'
            
            return (
              <div 
                key={index} 
                className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fadeIn`}
              >
                <div className={`flex gap-3 max-w-xs lg:max-w-md ${isCurrentUser ? 'flex-row-reverse' : ''}`}>
                  {/* Avatar */}
                  <div className="flex flex-col items-end justify-end">
                    <img 
                      src={isCurrentUser ? assets.profile_martin : assets.avatar_icon} 
                      alt="Avatar" 
                      className='w-8 h-8 rounded-full object-cover border-2 border-[#ffffff20]' 
                    />
                  </div>
                  
                  {/* Message Content */}
                  <div className="flex flex-col">
                    {msg.image ? (
                      <div className={`mb-1 ${isCurrentUser ? 'text-right' : 'text-left'}`}>
                        <img 
                          src={msg.image} 
                          alt="Shared" 
                          className='max-w-full md:max-w-xs rounded-2xl border border-[#ffffff15] shadow-md' 
                        />
                      </div>
                    ) : (
                      <div className={`p-3 rounded-2xl shadow-md ${isCurrentUser 
                        ? 'bg-gradient-to-r from-purple-600 to-blue-600 rounded-br-md' 
                        : 'bg-[#2a245c] border border-[#ffffff15] rounded-bl-md'
                      }`}>
                        <p className="text-white text-sm leading-relaxed">{msg.text}</p>
                      </div>
                    )}
                    
                    {/* Timestamp */}
                    <p className={`text-xs mt-1 px-1 ${isCurrentUser ? 'text-right text-purple-300' : 'text-left text-gray-400'}`}>
                      {formatMessageTime(msg.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
          <div ref={scrollEnd}></div>
        </div>
      </div>
      
      {/* Message Input */}
      <div className="p-4 bg-gradient-to-r from-[#1a163c]/80 to-[#2a245c]/80 backdrop-blur-md border-t border-[#ffffff10]">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-[#ffffff10] border border-[#ffffff15] px-4 rounded-full">
            <input 
              type="text" 
              placeholder='Type a message...' 
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className='flex-1 text-sm p-2 border-none rounded-lg outline-none text-white placeholder-gray-400 bg-transparent'
            />
            <input type="file" id='image' accept='image/png, image/jpeg' hidden />
            <label htmlFor="image" className="cursor-pointer">
              <img src={assets.gallery_icon} alt="Attach image" className='w-5 opacity-80 hover:opacity-100 transition-opacity' />
            </label>
          </div>
          <button 
            onClick={handleSendMessage}
            disabled={message.trim() === ''}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-md"
          >
            <img src={assets.send_button} alt="Send" className='w-5 h-5' />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-5 text-gray-400 bg-gradient-to-br from-[#0f0b2e] to-[#1f1b45] max-md:hidden p-8">
      <div className="relative">
        <div className="absolute -inset-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-full blur-xl"></div>
        <img src={assets.logo_icon} alt="Logo" className='w-24 h-24 relative z-10' />
      </div>
      <h2 className='text-2xl font-bold text-white'>Chat Anytime, Anywhere</h2>
      <p className="text-center text-gray-300 max-w-md">
        Select a conversation from the sidebar to start messaging with your friends and colleagues.
      </p>
      <div className="mt-4 flex gap-2">
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '0ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '200ms' }}></div>
        <div className="w-2 h-2 rounded-full bg-purple-500 animate-bounce" style={{ animationDelay: '400ms' }}></div>
      </div>
    </div>
  )
}

export default ChatContainer