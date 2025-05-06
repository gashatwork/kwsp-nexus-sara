"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

// type Language = "Malay" | "English" | "Bangla" | "Nepali"
type LanguageCode = "ms" | "en" | "bn" | "ne"
type Actor = "user" | "employee" | "ai"

interface SessionState {
  sessionId: string
  currentActor: Actor
  clientId: string | null; // Add clientId here
  userAudio: Blob | null
  transcription: string
  aiResponse: string
  isRecording: boolean
  isProcessing: boolean
  isApproved: boolean
  userFormData: Record<string, string>
  user_id: string | null
  chatroom_id: string | null
  user_name: string | null
}

interface SessionContextType {
  session: SessionState
  setActor: (actor: Actor) => void
  setUserDetails: (user_id: string, chatroom_id: string, user_name: string) => void
  setMeetingDetails: (details: { meetingId?: string; language?: string; clientId?: string; meetingName?: string }) => void
  startRecording: () => void
  stopRecording: (audioBlob: Blob) => void
  updateTranscription: (text: string) => void
  updateAIResponse: (text: string) => void
  approveResponse: () => void
  rejectResponse: () => void
  updateUserFormData: (key: string, value: string) => void
  resetSession: () => void
}

const defaultSessionState: SessionState = {
  sessionId: "",
  currentActor: "user",
  clientId: null, // Initialize clientId as null
  userAudio: null,
  transcription: "",
  aiResponse: "",
  isRecording: false,
  isProcessing: false,
  isApproved: false,
  userFormData: {},
  user_id: null,
  chatroom_id: null,
  user_name: null,
}

const SessionContext = createContext<SessionContextType | undefined>(undefined)

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {


  const [session, setSession] = useState<SessionState>(() => {
    // Try to load from localStorage on client side
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("voiceNexusSession")
      if (saved) {
        try {
          const parsed = JSON.parse(saved)
          // We can't store Blob in localStorage, so userAudio will be null
          return { ...parsed, userAudio: null }
        } catch (e) {
          console.error("Failed to parse session from localStorage", e)
        }
      }
    }

    // Generate a new session ID
    return {
      ...defaultSessionState,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    }
  })

  // Save session to localStorage whenever it changes
  useEffect(() => {
    // We need to exclude the Blob from what we save
    const { userAudio, ...sessionWithoutBlob } = session
    localStorage.setItem("voiceNexusSession", JSON.stringify(sessionWithoutBlob))
  }, [session])

  const setActor = (actor: Actor) => {
    setSession((prev) => ({ ...prev, currentActor: actor }))
  }

  // const setLanguage = (language: string) => {
  //   setSession((prev) => ({ ...prev, language }))
  // }

  const startRecording = () => {
    setSession((prev) => ({ ...prev, isRecording: true }))
  }

  const stopRecording = (audioBlob: Blob) => {
    setSession((prev) => ({
      ...prev,
      isRecording: false,
      userAudio: audioBlob,
      isProcessing: true,
    }))

    // In a real app, you would send the audio to your backend here
    // and then update the transcription when it comes back
  }

  const updateTranscription = (text: string) => {
    setSession((prev) => ({
      ...prev,
      transcription: text,
      isProcessing: false,
    }))
  }

  const updateAIResponse = (text: string) => {
    setSession((prev) => ({ ...prev, aiResponse: text }))
  }

  const approveResponse = () => {
    setSession((prev) => ({ ...prev, isApproved: true }))
    // In a real app, you would send the approved response to your backend here
    // for TTS processing
  }

  const rejectResponse = () => {
    setSession((prev) => ({ ...prev, aiResponse: "", isApproved: false }))
  }

  const updateUserFormData = (key: string, value: string) => {
    setSession((prev) => ({
      ...prev,
      userFormData: { ...prev.userFormData, [key]: value },
    }))
  }

  const resetSession = () => {
    setSession({
      ...defaultSessionState,
      sessionId: `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`,
    })
  }
  
  const setUserDetails = (user_id: string, chatroom_id: string, user_name: string) => {
    setSession((prev) => ({ ...prev, user_id, chatroom_id, user_name }))
  }

  const setMeetingDetails = (details: { meetingId?: string; language?: string; clientId?: string; meetingName?: string }) => {
    setSession((prev) => {
      const updatedSession = { ...prev, ...details };

       // 🔥 Dispatch custom event AFTER updating session state
    setTimeout(() => {
      window.dispatchEvent(new CustomEvent("sessionUpdated"));
    }, 0);

      return updatedSession;
    });
};


  return (
    <SessionContext.Provider
      value={{
        session,
        setActor,
        setUserDetails,
        setMeetingDetails,
        startRecording,
        stopRecording,
        updateTranscription,
        updateAIResponse,
        approveResponse,
        rejectResponse,
        updateUserFormData,
        resetSession,
      }}
    >
      {children}
    </SessionContext.Provider>
  )
}

export const useSession = () => {
  const context = useContext(SessionContext)
  if (context === undefined) {
    throw new Error("useSession must be used within a SessionProvider")
  }
  return context
}

