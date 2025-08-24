import React, { useContext, useEffect, useState } from 'react';
import assets from '../assets/chat-app-assets/assets';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/AuthContext';
import { ChatContext } from '../../context/ChatContext';

const Sidebar = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState('');
  const [showMenu, setShowMenu] = useState(false);

  const { getUsers, users, selectedUser, setSelectedUser, unseenMessage = {} } =
    useContext(ChatContext);
  const { logout, onlineUsers } = useContext(AuthContext);

  // Search filter
  const filteredUsers = input.trim()
    ? users.filter((user) => {
        const name = user?.fullName?.toLowerCase() || '';
        return name.includes(input.toLowerCase());
      })
    : users;

  // ✅ Fetch users only once when component mounts
  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div
      className={`bg-gradient-to-b from-[#1a163c] to-[#2a245c] h-full p-5 rounded-r-xl overflow-y-auto text-white shadow-xl ${
        selectedUser ? '' : ''
      }`}
    >
      {/* Header */}
      <div className="pb-6 border-b border-[#ffffff15]">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              ChatApp
            </h1>
          </div>

          <div className="relative">
            <div
              className="p-2 rounded-full hover:bg-[#ffffff15] cursor-pointer transition-colors"
              onClick={() => setShowMenu((prev) => !prev)}
            >
              <img src={assets.menu_icon} alt="menu" className="w-5 h-5" />
            </div>

            {showMenu && (
              <div className="absolute top-full right-0 z-20 w-40 p-3 rounded-xl bg-[#342b5a] border border-[#ffffff20] text-gray-100 shadow-lg mt-2">
                <p
                  className="p-2 rounded-md hover:bg-[#ffffff10] transition-colors cursor-pointer"
                  onClick={() => {
                    navigate('/profile');
                    setShowMenu(false);
                  }}
                >
                  Edit Profile
                </p>
                <hr className="my-2 border-t border-[#ffffff15]" />
                <p
                  onClick={() => logout()}
                  className="p-2 rounded-md hover:bg-[#ffffff10] transition-colors cursor-pointer text-sm"
                >
                  Logout
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Search bar */}
        <div className="flex bg-[#ffffff10] rounded-full items-center gap-3 py-3 px-4 mt-5 backdrop-blur-sm border border-[#ffffff10] transition-all focus-within:border-purple-400/30">
          <img
            src={assets.search_icon}
            alt="search"
            className="w-4 opacity-70"
          />
          <input
            type="text"
            className="bg-transparent border-none outline-none text-white text-sm placeholder-[#c8c8c8] flex-1"
            placeholder="Search users..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
        </div>
      </div>

      {/* Users list */}
      <div className="mt-4 flex flex-col gap-1">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <div
              onClick={() => setSelectedUser(user)} // ✅ fixed function name
              key={user._id}
              className={`relative flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all hover:bg-[#ffffff15] ${
                selectedUser?._id === user._id ? 'bg-[#6c5ce7] shadow-md' : ''
              }`}
            >
              <div className="relative">
                <img
                  src={user?.profilePic || assets.avatar_icon}
                  alt={user.fullName}
                  className="w-12 h-12 rounded-full object-cover border-2 border-[#ffffff20]"
                />
                {/* Online/Offline Indicator */}
                <div
                  className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
                    onlineUsers.includes(user._id)
                      ? 'bg-green-400'
                      : 'bg-gray-500'
                  }`}
                ></div>
              </div>

              <div className="flex flex-col flex-1 min-w-0">
                <p className="font-medium truncate">{user.fullName}</p>
                <span
                  className={`text-xs ${
                    onlineUsers.includes(user._id)
                      ? 'text-green-400'
                      : 'text-gray-400'
                  }`}
                >
                  {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                </span>
              </div>

              {/* Unseen messages */}
              {unseenMessage[user._id] > 0 && (
                <span className="ml-auto bg-pink-500 text-white text-xs font-bold rounded-full w-6 h-6 flex items-center justify-center">
                  {unseenMessage[user._id]}
                </span>
              )}
            </div>
          ))
        ) : (
          <div className="text-center py-6 text-gray-400">No users found</div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
