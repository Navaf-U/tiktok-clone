import NavBar from "@/components/NavBar";
import axiosErrorManager from "@/utilities/axiosErrorManager.ts";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { useContext } from "react";
import { IoSettingsOutline } from "react-icons/io5";
import { TiArrowLeft } from "react-icons/ti";
import { useNavigate, useSearchParams } from "react-router-dom";
import UserProfilePicture from "@/components/shared/UserProfilePicture";
import axiosInstance from "@/utilities/axiosInstance.ts";
import { UserContext } from "@/context/UserProvider";
import { useSocketContext } from "@/context/SocketProvider";
import { PiPaperPlaneTiltFill } from "react-icons/pi";
import MobileBottomBar from "@/components/sidebars/MobileBottomBar";

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
    username: string;
  };
  receiverId: {
    _id: string;
    username: string;
  };
  createdAt: string;
  read: boolean;
}

interface Conversation {
  _id: string;
  lastMessage: {
    message: string;
  };
  username: string;
  profile: string;
  userId: string;
}

function Messages(): JSX.Element {
  const { socket } = useSocketContext();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const username = searchParams.get("u") || "";
  const [message, setMessage] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const userContext = useContext(UserContext);
  const { currUser } = userContext || {};
  const [user, setUser] = useState<User | null>(null);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  };

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const { data } = await axiosInstance.get<Conversation[]>(
          "/user/messages"
        );
        setConversations(data);
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };

    fetchConversations();
  }, []);

  useEffect(() => {
    socket?.on("newMessage", (data: Message) => {
      const existingConversation = conversations.find(
        (conv) => conv._id === data?.senderId?._id
      );

      if (!existingConversation) {
        const newConversation: Conversation = {
          _id: data.senderId._id,
          lastMessage: { message: data.message },
          username: data.senderId.username,
          profile: "",
          userId: data.senderId._id,
        };
        setConversations((prev) => [...prev, newConversation]);
      } else {
        setConversations((prev) =>
          prev.map((conv) =>
            conv.userId === data.senderId._id
              ? { ...conv, lastMessage: { message: data.message } }
              : conv
          )
        );
      }

      if (
        data.senderId.username === username ||
        (user && data.senderId._id === user._id)
      ) {
        setMessages((prev) => [...prev, data]);
        scrollToBottom();
      }
    });

    return () => {
      socket?.off("newMessage");
    };
  }, [username, user, conversations, socket]);

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
  }, [username, user?._id]);

  useEffect(() => {
    const fetchMessages = async () => {
      if (username === currUser?.username) return;
      if (!user?._id) return setMessages([]);
      try {
        const { data } = await axiosInstance.get(`/user/messages/${user._id}`);
        setMessages(data);
        if (data.length > 0) {
          scrollToBottom();
        }
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    fetchMessages();
  }, [currUser?.username, user, username]);

  const sendMessage = async () => {
    if (!message.trim() || !user?._id) return;
    if (username === currUser?.username) return;
    try {
      const { data } = await axiosInstance.post(`/user/messages/`, {
        receiverId: user?._id,
        message: message?.trim(),
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

  const selectConversation = (username: string) => {
    setSearchParams({ u: username });
  };

  useEffect(() => {
    setMessage("");
  }, [username]);

  return (
    <div className="min-h-screen  md:mb-0 bg-black">
      <NavBar />
      <div className="fixed z-30 bottom-[-1px] w-full md:hidden">
        <MobileBottomBar />
      </div>
      <div className="w-full flex pt-14 md:pt-16 h-screen  md:h-screen justify-center gap-4">
        <div>
          <TiArrowLeft
            onClick={() => navigate(-1)}
            className="hidden md:flex text-[#b5b5b5] bg-[#1c1c1c] rounded-full mt-3 p-1 cursor-pointer hover:bg-[#2c2c2c]"
            size={35}
          />
        </div>

        <div className="w-[80px] md:w-[300px] ms-[-12px] mb-14 md:h-[530px] rounded-md bg-[#262626] overflow-hidden">
          <div className="flex mx-5 mt-2 justify-between items-center">
            <p className="font-semibold text-[23px] text-white hidden md:flex">
              Messages
            </p>
            <IoSettingsOutline
              className="mt-1 text-white cursor-pointer hover:text-gray-300 hidden md:flex"
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
                  className="md:w-12 md:h-12 w-10 h-7 rounded-full object-cover"
                />
                <div className="ml-3 flex-1 min-w-0">
                  <p className="text-white hidden md:flex font-medium">
                    {conv.username}
                  </p>
                  {conv.lastMessage && (
                    <p className="text-gray-400 hidden md:flex text-sm truncate">
                      {typeof conv.lastMessage === "string"
                        ? conv.lastMessage
                        : conv.lastMessage.message}{" "}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="w-[400px] me-0.5 md:me-0 ms-[-13px] md:ms-0 md:w-[600px] relative mb-14 md:h-[530px] rounded-md bg-[#262626] flex flex-col overflow-hidden">
          {user ? (
            <>
              <div className="p-4 border-b border-[#363636]">
                <div
                  className="flex items-center"
                  onClick={() => navigate(`/profile/${user.username}`)}
                >
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
                        msg.receiverId.username === username
                          ? "justify-end"
                          : "justify-start"
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
              <div className="md:p-4">
                <div className="flex items-center gap-2 w-full relative bottom-1.5">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                    placeholder="Send a message..."
                    className=" bg-[#363636] text-white ps-5 rounded-lg px-2 ms-[-5px] md:ms-0 md:px-6 w-full md:w-[450px] md:flex-1 md:py-2.5 py-1.5 focus:outline-none md:focus:ring-1 md:focus:ring-pink-500"
                  />
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="bg-pink-500 hidden md:flex text-white px-6 py-2.5 rounded-lg font-medium hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Send
                  </button>
                  <button
                    onClick={sendMessage}
                    disabled={!message.trim()}
                    className="md:hidden"
                  >
                    <PiPaperPlaneTiltFill
                      color={message.trim() ? "#ff2b56" : "white"}
                      size={25}
                    />
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
