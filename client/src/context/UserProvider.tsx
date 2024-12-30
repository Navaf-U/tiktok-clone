import axios from "axios";
import { createContext, useState } from "react";
import { ReactNode } from "react";

interface User {
  _id: string;
  email: string;
  username: string;
  role: string;
}

interface UserContextType {
  currUser: User | null;
  LoginUser: (emailOrUsername: string, password: string) => Promise<void>;
  setCurrUser: React.Dispatch<React.SetStateAction<User | null>>;
  showLogin: boolean;
  setShowLogin: React.Dispatch<React.SetStateAction<boolean>>;
}

export const UserContext = createContext<UserContextType | undefined>(
  undefined
);

interface UserProviderProps {
  children: ReactNode;
}

function UserProvider({ children }: UserProviderProps): JSX.Element {
  const [currUser, setCurrUser] = useState<User | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const LoginUser: (
    emailOrUsername: string,
    password: string
  ) => Promise<void> = async (emailOrUsername, password) => {
    const res = await axios.post("http://localhost:3000/auth/login", {
      emailOrUsername,
      password,
    });
    console.log(res.data);
  };

  const value: UserContextType = {
    currUser,
    setCurrUser,
    LoginUser,
    showLogin,
    setShowLogin,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export default UserProvider;
