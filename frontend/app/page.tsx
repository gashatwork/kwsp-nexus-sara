"use client"

import { useAuth } from "@/context/AuthContext"
import { MeetingProvider } from "@/context/MeetingContext"
import TitleBar from "@/components/TitleBar"
import MeetingFlow from "@/components/employee/MeetingFlow"
import LoginForm from "@/components/login/LoginForm"

export default function EmployeePage() {
  const { user } = useAuth()

  if (!user || user.role !== "employee") {
    return <LoginForm />
  }

  return (
    <MeetingProvider>
      <TitleBar />
      <MeetingFlow />
    </MeetingProvider>
  )

}