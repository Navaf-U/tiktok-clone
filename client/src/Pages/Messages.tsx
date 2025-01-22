import NavBar from "@/components/NavBar";
import axiosErrorManager from "@/utilities/axiosErrorManager";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
// import { useContext } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { TiArrowLeft } from "react-icons/ti";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserProfilePicture from "@/components/shared/UserProfilePicture";
import axiosInstance from "@/utilities/axiosInstance";
// import { UserContext } from "@/context/UserProvider";
import { socket } from "@/hooks/useConnectSocket";

interface User {
  _id: string;
  username: string;
  email: string;
  profile: string;
  bio: string;
  role: string;
}

interface Message {
  _id: string;
  message: string;
  senderId: {
    _id: string;
    username: string
  }
  receiverId: {
    _id: string;
    username: string
  }
  createdAt: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  lastMessage: string;
  username: string;
  profile: string;
  userId: string;
}

function Messages(): JSX.Element {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get("u") || "";
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  // const userContext = useContext(UserContext);
  // const { currUser } = userContext || {};
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {

    const fetchConversations = async () => {
      try {
        const { data } = await axiosInstance.get("/user/messages");
        setConversations(data);
        console.log(data,"CONVERS")
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    fetchConversations();
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      if (!username) return setUser(null);
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/profile/${username}`
        );
        setUser(data);
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    fetchUser();
  }, [username]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!user?._id) return setMessages([]);
      try {
        const { data } = await axiosInstance.get(`/user/messages/${user._id}`);
        setMessages(data);
        scrollToBottom();
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    fetchMessages();
  }, [user]);

  const sendMessage = async () => {
    if (!message.trim() || !user?._id) return;

    try {
      const { data } = await axiosInstance.post(`/user/messages/`, {
        receiverId: user._id,
        message: message.trim(),
      });

      setMessages((prev) => [...prev, data]);
      setMessage("");
      scrollToBottom();
      const index = conversations.findIndex((c) => c.userId === user._id);
      const updatedConversations = [...conversations];
      if (index !== -1) {
        updatedConversations[index].lastMessage = data.message;
        setConversations(updatedConversations);
      }
    } catch (error) {
      console.error(axiosErrorManager(error));
    }
  };

  useEffect(() => {
    socket.on("newMessage", (data: Message) => {
      if (data.senderId.username === username) {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      }
    });
    return () => {
      socket.off("newMessage");
    };
  }, [username]);
  const selectConversation = (username: string) => {
    setSearchParams({ u: username });
  };



  return (
    <div className="min-h-screen bg-black">
      <NavBar />
      <div className="w-full pt-16 flex justify-center gap-4">
        <div>
          <TiArrowLeft
            onClick={() => navigate(-1)}
            className="text-[#b5b5b5] bg-[#1c1c1c] rounded-full mt-3 p-1 cursor-pointer hover:bg-[#2c2c2c]"
            size={35}
          />
        </div>

        <div className="w-[300px] h-[500px] rounded-md bg-[#262626] overflow-hidden">
          <div className="flex mx-5 mt-2 justify-between items-center">
            <p className="font-semibold text-[23px] text-white">Messages</p>
            <IoSettingsOutline
              className="mt-1 text-white cursor-pointer hover:text-gray-300"
              size={25}
            />
          </div>
          <div className="mt-4 overflow-y-auto h-[440px] custom-scrollbar">
            {conversations.map((conv) => (
              <div
              key={conv._id}
              onClick={() => selectConversation(conv.username)}
              className={`flex items-center p-3 hover:bg-[#303030] cursor-pointer transition-colors ${
                  username === conv.username ? "bg-[#303030]" : ""
                }`}
              >
                <UserProfilePicture
                  profile={conv.profile}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-white font-medium">{conv.username}</p>
                  {conv.lastMessage && (
                    <p className="text-gray-400 text-sm truncate">
                      {conv.lastMessage}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

       <div className="w-[600px] h-[500px] rounded-md bg-[#262626] flex flex-col overflow-hidden">
          {user ? (
            <>
              <div className="p-4 border-b border-[#363636]">
                <div className="flex items-center">
                  <UserProfilePicture
                    profile={user.profile}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <p className="ml-3 text-white font-medium">{user.username}</p>
                </div>
              </div>
              <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                <div className="flex flex-col space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg._id}
                      className={`flex ${
                        msg.receiverId.username === username ? "justify-end" : "justify-star"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] p-3 rounded-lg ${
                          msg.receiverId.username === username
                            ? "bg-[#00a1c9] text-white"
                            : "bg-[#363636] text-white"
                        }`}
                      >
                        {msg.message}
                      </div>
                    </div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
              </div>
              <div className="p-4 border-t border-[#363636]">
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Send a message..."
                    className="flex-1 bg-[#363636] text-white rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-pink-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="bg-pink-500 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-400">
              Select a conversation to start messaging
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Messages;
