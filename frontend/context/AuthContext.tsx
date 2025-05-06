"use client"

import { createContext, useContext, useState, useEffect } from "react"

type UserRole = "user" | "employee" | "admin"

interface User {
  id: string
  name: string
  role: UserRole
}

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (username: string, password: string) => Promise<boolean>
  logout: () => void
}

const PREDEFINED_USERS: Record<string, User> = {
  user: { id: "1", name: "Regular User", role: "user" },
  employee: { id: "2", name: "Support Staff", role: "employee" },
  admin: { id: "3", name: "Administrator", role: "admin" },
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  login: async () => false,
  logout: () => { },
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const storedUser = localStorage.getItem("voiceNexusUser")
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (e) {
        console.error("Failed to parse user from localStorage", e)
      }
    }
  }, [])

  const login = async (username: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    if (PREDEFINED_USERS[username] && password === "password") {
      console.log('Login successful PREDEFINED_USERS[username]:', PREDEFINED_USERS[username])
      const loggedInUser = PREDEFINED_USERS[username]
      console.log('Login successful:', loggedInUser)
      setUser(loggedInUser)
      localStorage.setItem("voiceNexusUser", JSON.stringify(loggedInUser))
      setIsLoading(false)
      return true;
    }

    setIsLoading(false)
    return false
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("voiceNexusUser")
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

