import type React from "react"
import "@radix-ui/themes/styles.css";
import "/styles/globals.css";
import type { Metadata, Viewport } from "next";
import { Theme } from "@radix-ui/themes";
import { ToastContainer, Zoom } from 'react-toastify';
import { SessionProvider } from "@/context/SessionContext";
import { AuthProvider } from "@/context/AuthContext";
import { ChatProvider } from "@/context/ChatContext";

export const metadata: Metadata = {
  title: "KWSP EPF Voice Nexus",
  description: "A voice-based interaction system with multiple actors",
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html>
      <body>
        <Theme
          accentColor="indigo"
          grayColor="gray"
          radius="full"
          panelBackground="solid"
        >
          <AuthProvider>
            <SessionProvider>
              <ChatProvider>{children}</ChatProvider>
            </SessionProvider>
          </AuthProvider>
        </Theme>
        <ToastContainer transition={Zoom} position="top-center" theme="light" closeButton={false} hideProgressBar />
      </body>
    </html>
  )
}