import userManager from "@/components/shared/userManager";
import axiosErrorManager from "../utilities/axiosErrorManager.ts";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "@/utilities/axiosInstance.ts";
interface User {
  _id: string;
  email: string;
  username: string;
  profile: string;
  bio: string;
  role: string;
}

interface Comment {
  user: string;
  text: string;
  _id: string;
  createdAt: string;
}
interface Post {
  _id: string;
  username: string;
  file: string;
  likes: string[];
  comments: Comment[];
  favorites: string[];
  date: number;
  description: string;
}

interface UserContextType {
  currUser: User | null;
  LoginUser: (emailOrUsername: string, password: string) => Promise<void>;
  UserRegister: (
    username: string,
    email: string,
    password: string,
    dob: object
  ) => Promise<void>;
  logoutUser: () => void;
  setCurrUser: React.Dispatch<React.SetStateAction<User | null>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: "login" | "signup";
  setModalType: React.Dispatch<React.SetStateAction<"login" | "signup">>;
  showUserEdit: boolean;
  setShowUserEdit: React.Dispatch<React.SetStateAction<boolean>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  isLoading: boolean;
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>;
  followsShow: boolean;
  setFollowsShow: React.Dispatch<React.SetStateAction<boolean>>;
  showAccountDelete: boolean;
  setShowAccountDelete: React.Dispatch<React.SetStateAction<boolean>>;
}

// eslint-disable-next-line react-refresh/only-export-components
export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showModal, setShowModal] = useState<boolean>(false);
  const [modalType, setModalType] = useState<"login" | "signup">("login");
  const [showUserEdit, setShowUserEdit] = useState<boolean>(false);
  const [showAccountDelete, setShowAccountDelete] = useState<boolean>(false);
  const [followsShow, setFollowsShow] = useState<boolean>(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.getItem("token");
    const user = localStorage.getItem("currUser");
    if (user) {
      setCurrUser(JSON.parse(user));
    }
  }, []);

  useEffect(() => {
    userManager.setUserUpdater(setCurrUser);
    return () => {
      userManager.setUserUpdater(() => null);
    };
  }, [currUser]);

  const LoginUser: (
    emailOrUsername: string,
    password: string
  ) => Promise<void> = async (emailOrUsername, password) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/auth/login`,
        {
          emailOrUsername,
          password,
        },
        { withCredentials: true }
      );
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currUser", JSON.stringify(res.data.user));
      setCurrUser(res.data.user);
      setShowModal(false);
      navigate("/");
    } catch (err) {
      const errorMessage = axiosErrorManager(err);
      throw new Error(errorMessage);
    }
  };

  const UserRegister: (
    username: string,
    email: string,
    password: string,
    dob: object
  ) => Promise<void> = async (username, email, password, dob) => {
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/auth/register`, {
        username,
        email,
        password,
        dob,
      });
      setModalType("login");
    } catch (err) {
      const errorMessage = axiosErrorManager(err);
      throw new Error(errorMessage);
    }
  };

  const logoutUser: () => void = async () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      if (currUser) {
        await axiosInstance.post("/auth/logout");
        localStorage.removeItem("token");
        localStorage.removeItem("currUser");
        setCurrUser(null);
        setShowModal(false);
        navigate("/");
      }
    }
  };

  useEffect(() => {
    const getAllPosts = async () => {
      try {
        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/user/posts`
        );
        setPosts(data);
      } catch (error) {
        console.error(axiosErrorManager(error));
      }
    };
    getAllPosts();
  }, []);
  const value: UserContextType = {
    currUser,
    setCurrUser,
    LoginUser,
    showModal,
    setShowModal,
    modalType,
    setModalType,
    UserRegister,
    showUserEdit,
    setShowUserEdit,
    logoutUser,
    posts,
    setPosts,
    isLoading,
    setIsLoading,
    followsShow,
    setFollowsShow,
    showAccountDelete,
    setShowAccountDelete,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
