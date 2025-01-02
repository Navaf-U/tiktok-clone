import { useToast } from "../hooks/use-toast";
import axiosErrorManager from "../utilities/axiosErrorManager";
import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { ReactNode } from "react";


interface User {
  _id: string;
  email: string;
  username: string;
  profile: string;
  bio: string;
  role: string;
}



interface UserContextType {
  currUser: User | null;
  LoginUser: (emailOrUsername: string, password: string) => Promise<void>;
  UserRegister: (username: string, email: string, password: string , dob : object) => Promise<void>;
  logoutUser: () => void;
  setCurrUser: React.Dispatch<React.SetStateAction<User | null>>;
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  modalType: "login" | "signup";
  setModalType: React.Dispatch<React.SetStateAction<"login" | "signup">>;
  showUserEdit: boolean;
  setShowUserEdit: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<"login" | "signup">("login");
  const [showUserEdit, setShowUserEdit] = useState(false);
  const {toast} = useToast()
  
  
  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = localStorage.getItem("currUser");
    if (token && user) {
      setCurrUser(JSON.parse(user));
    }
  }, []);
  
  const LoginUser: (
    emailOrUsername: string,
    password: string
  ) => Promise<void> = async (emailOrUsername, password) => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        emailOrUsername,
        password,
      });
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("currUser", JSON.stringify(res.data.user));
      setCurrUser(res.data.user);
      setShowModal(false);
      console.log(currUser)
      toast({
        title: "Success",
        description: "You are now logged in!",
      });

    } catch (err) {
      console.log("YOO")
       toast({
        title: "Login Failed",
        description: axiosErrorManager(err) || "An unknown error occurred.",
      });
      console.log(axiosErrorManager(err))
    }
  };

  const UserRegister : (
    username: string,
    email:string,
    password: string,
    dob : object
  ) => Promise<void> = async (username, email , password,dob) => {
   
    try {
      await axios.post("http://localhost:3000/auth/register", {
        username,
        email,
        password,
        dob
      });
      setModalType("login");
      toast({
        title: "Success",
        description: "You are now registered!",
      });

    } catch (err) {
       toast({
        title: "Register Failed",
        description: axiosErrorManager(err) || "An unknown error occurred.",
      });
    }
  }
  const logoutUser: () => void = () => {
    const confirm = window.confirm("Are you sure you want to logout?");
    if (confirm) {
      localStorage.removeItem("token");
      localStorage.removeItem("currUser");
      setCurrUser(null);
    }
  };


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
    logoutUser
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
