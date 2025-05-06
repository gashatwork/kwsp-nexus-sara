"use client"

import React, { createContext, useContext, useState } from "react"

interface MeetingContextType {
    meetingStarted: boolean
    clientConnected: boolean
    startMeeting: () => void
    setClientConnected: (connected: boolean) => void
    resetMeeting: () => void
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined)

export const MeetingProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [meetingStarted, setMeetingStarted] = useState(false)
    const [clientConnected, setClientConnected] = useState(false)

    const startMeeting = () => {
        setMeetingStarted(true)
    }

    const resetMeeting = () => {
        setMeetingStarted(false)
        setClientConnected(false)
    }

    return (
        <MeetingContext.Provider 
            value={{ 
                meetingStarted, 
                clientConnected, 
                startMeeting, 
                setClientConnected,
                resetMeeting 
            }}
        >
            {children}
        </MeetingContext.Provider>
    )
}

export const useMeeting = () => {
    const context = useContext(MeetingContext)
    if (context === undefined) {
        throw new Error("useMeeting must be used within a MeetingProvider")
    }
    return context
}