"use client"

import { useAuth } from "@/context/AuthContext"
import Link from "next/link"
import { useState } from "react"
import Logo from "./Logo"

export default function TitleBar() {
  const { user, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b brand-border-gold bg-white py-1">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Logo />
        </div>

        <div className="ml-4">
          <h1 className="text-brand-blue font-semibold text-lg">Voice Nexus</h1>
        </div>

        <div className="flex flex-1 items-center justify-end space-x-2">
          {user && (
            <div className="flex items-center">
              <span className="text-sm text-muted-foreground mr-4">
                Logged in as <span className="font-medium text-brand-blue">{user.name}</span>
              </span>
              {/* <Button
                variant="outline"
                size="sm"
                onClick={logout}
                className="border-brand-blue text-brand-blue hover:bg-brand-blue hover:text-white"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button> */}
            </div>
          )}

          <div className="md:hidden">
            {/* <Button variant="ghost" size="sm" onClick={() => setMenuOpen(!menuOpen)} className="text-brand-blue">
              <Menu className="h-5 w-5" />
            </Button> */}
          </div>
        </div>
      </div>

      {menuOpen && (
        <div className="md:hidden border-t p-4">
          <nav className="flex flex-col space-y-2">
            <Link href="/" className="text-sm font-medium text-brand-blue" onClick={() => setMenuOpen(false)}>
              Home
            </Link>
            {user && user.role !== "user" && (
              <Link href="/employee" className="text-sm font-medium text-brand-blue" onClick={() => setMenuOpen(false)}>
                Employee Dashboard
              </Link>
            )}
            {user && user.role === "admin" && (
              <Link href="/admin" className="text-sm font-medium text-brand-blue" onClick={() => setMenuOpen(false)}>
                Admin Panel
              </Link>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}

