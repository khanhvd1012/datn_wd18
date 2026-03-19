import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  email: string;
  username: string;
  avatar?: string;
  role?: string;
}

interface UserContextType {
  user: User | null;
  setUser: (u: User | null) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {}
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(JSON.parse(localStorage.getItem("user") || "null"));
  return <UserContext.Provider value={{ user, setUser }}>{children}</UserContext.Provider>;
};

export const useUser = () => useContext(UserContext);