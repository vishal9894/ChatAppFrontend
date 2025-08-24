import React, { useRef, useState, useEffect, useContext, useCallback } from "react";
import assets from "../assets/chat-app-assets/assets";
import { formatMessageTime } from "../lib/utils";
import { ChatContext } from "../../context/ChatContext";
import { AuthContext } from "../../context/AuthContext";

const ChatContainer = () => {
  const scrollEnd = useRef();
  const [message, setMessage] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);

  const { selectedUser, setSelectedUser, messages, sendMessage, getMessages } =
    useContext(ChatContext);
  const { authUser, onlineUsers } = useContext(AuthContext);

  // Auto scroll
  useEffect(() => {
    if (scrollEnd.current) {
      scrollEnd.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  // Fetch messages when user changes
  const fetchMessages = useCallback(async () => {
    if (selectedUser && getMessages) {
      setIsLoading(true);
      try {
        await getMessages(selectedUser._id);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setIsLoading(false);
      }
    }
  }, [selectedUser, getMessages]);

  useEffect(() => {
    fetchMessages();
  }, [selectedUser?._id]);

  // Send Message
  const handleSendMessage = async () => {
    if ((message.trim() !== "" || image) && sendMessage) {
      try {
        await sendMessage(selectedUser._id, {
          text: message.trim(),
          image: imagePreview,
        });
        setMessage("");
        setImage(null);
        setImagePreview(null);
      } catch (error) {
        console.error("Failed to send message:", error);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File too large (max 5MB).");
      return;
    }

    setImage(file);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImage(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const isOnline =
    selectedUser && onlineUsers && onlineUsers.includes(selectedUser._id);

  return selectedUser ? (
    <div className="h-full flex flex-col bg-gradient-to-br from-[#0d0b28] to-[#1b1640]">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10 bg-black/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img
              src={selectedUser.profilePic || assets.avatar_icon}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover border-2 border-purple-500/50"
            />
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#1a163c] ${
                isOnline ? "bg-green-500" : "bg-gray-500"
              }`}
            ></span>
          </div>
          <div>
            <p className="text-white font-semibold">
              {selectedUser.fullName || "Unknown User"}
            </p>
            <p
              className={`text-xs ${
                isOnline ? "text-green-400" : "text-gray-400"
              }`}
            >
              {isOnline ? "Online" : "Offline"}
            </p>
          </div>
        </div>
        <button
          onClick={() => setSelectedUser(null)}
          className="p-2 rounded-full hover:bg-white/10 md:hidden"
        >
          <img src={assets.arrow_icon} alt="Back" className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full text-purple-400">
            Loading messages...
          </div>
        ) : messages && messages.length > 0 ? (
          messages.map((msg, index) => {
            const isCurrentUser = msg.senderId === authUser._id;

            return (
              <div
                key={msg._id || index}
                className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`flex flex-col max-w-xs lg:max-w-md ${
                    isCurrentUser ? "items-end" : "items-start"
                  }`}
                >
                  {/* Image */}
                  {msg.image && (
                    <img
                      src={msg.image}
                      alt="Shared"
                      className="max-w-xs rounded-2xl border border-white/10 shadow-md mb-1"
                    />
                  )}

                  {/* Text */}
                  <div
                    className={`p-3 rounded-2xl text-sm ${
                      isCurrentUser
                        ? "bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-br-md"
                        : "bg-[#2a245c] text-gray-200 rounded-bl-md"
                    }`}
                  >
                    {msg.text && msg.text.trim() !== "" ? (
                      <p className="leading-relaxed">{msg.text}</p>
                    ) : msg.image ? null : (
                      <p className="italic opacity-70">Empty message</p>
                    )}
                  </div>

                  {/* Timestamp */}
                  <span className="text-xs text-gray-400 mt-1">
                    {formatMessageTime(msg.createdAt)}
                  </span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <img
              src={assets.logo_icon}
              alt="Logo"
              className="w-16 h-16 opacity-50 mb-4"
            />
            <p>No messages yet. Start a conversation!</p>
          </div>
        )}
        <div ref={scrollEnd}></div>
      </div>

      {/* Image Preview */}
      {imagePreview && (
        <div className="px-4 pt-2 relative">
          <div className="bg-white/10 rounded-lg p-2 inline-block relative">
            <img
              src={imagePreview}
              alt="Preview"
              className="w-20 h-20 object-cover rounded-md"
            />
            <button
              onClick={removeImage}
              className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full text-white text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-white/10 bg-black/20 backdrop-blur">
        <div className="flex items-center gap-3">
          <div className="flex-1 flex items-center bg-white/10 px-4 rounded-full">
            <input
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 text-sm p-2 text-white bg-transparent outline-none"
            />
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              hidden
              onChange={handleImageSelect}
            />
            <label
              htmlFor="image"
              className="cursor-pointer ml-2 hover:opacity-100 opacity-70"
            >
              <img
                src={assets.gallery_icon}
                alt="Attach"
                className="w-5 h-5"
              />
            </label>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={(message.trim() === "" && !image) || isLoading}
            className="p-3 rounded-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white disabled:opacity-50"
          >
            <img src={assets.send_button} alt="Send" className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center gap-5 text-gray-400 bg-gradient-to-br from-[#0f0b2e] to-[#1f1b45] max-md:hidden p-8">
      <img src={assets.logo_icon} alt="Logo" className="w-24 h-24 opacity-80" />
      <h2 className="text-2xl font-bold text-white">Chat Anytime, Anywhere</h2>
      <p className="text-center text-gray-300 max-w-md">
        Select a conversation to start chatting with friends and colleagues.
      </p>
    </div>
  );
};

export default ChatContainer;
