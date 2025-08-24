import { createContext, useContext, useEffect, useState } from "react";
import { AuthContext } from "./AuthContext";
import toast from "react-hot-toast";

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(false);
  const [unseenMessage, setUnseenMessage] = useState({});
  const { socket, axios } = useContext(AuthContext);

  // ✅ Get all users
  const getUsers = async () => {
    try {
      const { data } = await axios.get("/api/messages/users");
      if (data.success) {
        setUsers(data.user);
        setUnseenMessage(data.unseenMessage);
        console.log("✅ Users loaded:", data);
      } else {
        setUsers(data); // fallback
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Get messages with a user
  const getMessages = async (userId) => {
    try {
      const { data } = await axios.get(`/api/messages/${userId}`);
      if (data.success) {
        setMessages(data.messages);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  // ✅ Send message (always send payload object)
  const sendMessage = async ({ text = "", image = null }) => {
    try {
      if (!selectedUser) return;

      // 🔹 build correct payload
      const payload = {
        text: text.trim(),
        image,
      };

      console.log("📤 Sending payload:", payload);

      const { data } = await axios.post(
        `/api/messages/send/${selectedUser._id}`,
        payload,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`, // add if using JWT
          },
        }
      );

      if (data.success) {
        setMessages((prev) => [...prev, data.newMessage]);
      } else {
        toast.error(data.message || "Failed to send message");
      }
    } catch (error) {
      console.error("❌ Send message error:", error.response?.data || error);
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ✅ Subscribe to socket messages
  const subscribeToMessages = () => {
    if (!socket) return;

    socket.on("newMessage", (newMessage) => {
      if (selectedUser && newMessage.senderId === selectedUser._id) {
        newMessage.seen = true;
        setMessages((prev) => [...prev, newMessage]);
        axios.put(`/api/messages/mark/${newMessage._id}`);
      } else {
        setUnseenMessage((prev) => ({
          ...prev,
          [newMessage.senderId]: prev[newMessage.senderId]
            ? prev[newMessage.senderId] + 1
            : 1,
        }));
      }
    });
  };

  // ✅ Unsubscribe correctly
  const unsubscribeFromMessages = () => {
    if (socket) socket.off("newMessage");
  };

  useEffect(() => {
    subscribeToMessages();
    return () => unsubscribeFromMessages();
  }, [socket, selectedUser]);

  const chatValue = {
    messages,
    users,
    selectedUser,
    getUsers,
    setMessages,
    sendMessage,
    setSelectedUser,
    unseenMessage,
    setUnseenMessage,
    getMessages,
  };

  return (
    <ChatContext.Provider value={chatValue}>
      {children}
    </ChatContext.Provider>
  );
};
