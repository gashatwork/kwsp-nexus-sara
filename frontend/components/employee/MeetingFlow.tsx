"use client"

import { useMeeting } from "@/context/MeetingContext"
import NewMeeting from "./NewMeeting"
import ClientDevice from "./ClientDevice"
import Chat from "./Chat"

export default function MeetingFlow() {
    const { meetingStarted, clientConnected } = useMeeting()

    if (!meetingStarted) {
        return <NewMeeting />
    }

    if (!clientConnected) {
        return <ClientDevice />
    }

    return <Chat />
}