"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

interface ChatMessage {
    type: string;
    sender: string;
    content?: string;
    audioUrl?: string;
    time: string;
}

interface ChatContextType {
    messages: ChatMessage[];
    addMessage: (message: ChatMessage) => void
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: React.ReactNode }) {
    // const [messages, setMessages] = useState<ChatMessage[]>([]);

    // const addMessage = (message: ChatMessage) => {
    //     setMessages((prev) => [...prev, message]);
    // };

    // const GROUP_NAME = "groupname-1"; // Replace with your group name
    // const USER_ID = "testuser"; // Replace with your user ID

    const isInitialized = useRef(false); // Track if sessionStorage has been initialized
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!isInitialized.current) {
            // Only run this block once
            const savedMessages = sessionStorage.getItem("chatMessages");
            if (savedMessages) {
                setMessages(JSON.parse(savedMessages));
            }
            isInitialized.current = true;
        }
    }, []); // Empty dependency array ensures this runs only once

    const addMessage = (message: ChatMessage) => {
        setMessages((prev) => {
            const updatedMessages = [...prev, message];
            sessionStorage.setItem("chatMessages", JSON.stringify(updatedMessages));
            return updatedMessages;
        });
    };


    useEffect(() => {
        let socket: WebSocket;

        // Module-scope variables for audio handling
        let audioBuffers: ArrayBuffer[] = [];
        let receivingAudio = false;

        const fetchWebSocketURL = async (meetingId: string, clientId: string) => {
            try {
                const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/chat/negotiate?user_id=${clientId}&group_name=${meetingId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch WebSocket URL");
                }

                const { url: NEGOTIATED_URL } = await response.json();

                socket = new WebSocket(NEGOTIATED_URL, "json.webpubsub.azure.v1");

                // Set binaryType to handle ArrayBuffers
                socket.binaryType = "arraybuffer";

                socket.onopen = () => {
                    console.log("✅ Connected to WebPubSub");

                    const joinGroupMsg = {
                        type: "joinGroup",
                        group: meetingId,
                        ackId: 1,
                    };
                    socket.send(JSON.stringify(joinGroupMsg));
                };

                socket.onmessage = (event) => {
                    // —— TEXT MESSAGE —— or JSON with base64 audio chunks
                    let msg: any;
                    try {
                        msg = JSON.parse(event.data);
                    } catch (err) {
                        console.error("❌ Non-JSON message, ignoring:", err);
                        return;
                    }

                    console.log("📦 WebSocket message:", msg);

                    switch (msg.type) {
                        case "message":
                            if (msg.data && msg.dataType === "binary") {
                                // Audio chunk received as base64
                                if (!receivingAudio) {
                                    receivingAudio = true;
                                    audioBuffers = [];
                                }
                                const binaryData = Uint8Array.from(atob(msg.data), (c) => c.charCodeAt(0));
                                audioBuffers.push(binaryData.buffer);
                            } else if (msg.data.message === "AudioChunk Successfully sent") {
                                // All audio chunks received
                                if (!receivingAudio) {
                                    console.warn("⚠️ Received 'AudioChunk Successfully sent' but no buffers were collected.");
                                    return;
                                }

                                // Assemble and play
                                const blob = new Blob(audioBuffers, { type: "audio/wav" });
                                const url = URL.createObjectURL(blob);
                                console.log("Audio Blob URL:", url);
                                addMessage({
                                    sender: "KWSP Employee",
                                    audioUrl: url,
                                    time: new Date().toLocaleTimeString(),
                                    type: ""
                                });

                                // Reset state
                                receivingAudio = false;
                                audioBuffers = [];
                            } else {
                                // Plain text chat
                                addMessage({
                                    sender: msg.data.sender || "Unknown",
                                    content: msg.data.message || "",
                                    time: new Date().toLocaleTimeString(),
                                    type: ""
                                });
                            }
                            break;

                        case "ack":
                            console.log(`✅ Ack for ${msg.ackId}`);
                            break;

                        default:
                            console.log("ℹ️ Other message:", msg);
                    }
                };


                socket.onerror = (error) => {
                    console.error("❌ WebSocket error:", error);
                };

                socket.onclose = () => {
                    console.log("❌ WebSocket connection closed");
                };
            } catch (error) {
                console.error("❌ Error fetching WebSocket URL:", error);
            }
        };

        const initializeWebSocket = () => {
            const sessionData = localStorage.getItem("voiceNexusSession");
            if (sessionData) {
                try {
                    const { meetingId, clientId } = JSON.parse(sessionData);
                    if (meetingId && clientId) {
                        fetchWebSocketURL(meetingId, clientId);
                    } else {
                        console.warn("⚠️ meetingId or clientId is missing in session data.");
                    }
                } catch (error) {
                    console.error("❌ Failed to parse session data from localStorage:", error);
                }
            } else {
                console.warn("⚠️ No session data found in localStorage.");
            }
        };

        const reconnectWebSocket = () => {
            console.log("🔔 Session updated or storage event detected. Reconnecting WebSocket.");
            if (socket) {
                socket.close();
            }
            initializeWebSocket();
        };

        const handleStorageEvent = (event: StorageEvent) => {
            if (event.key === "voiceNexusSession") {
                console.log("📦 Storage event detected. Key changed:", event.key);
                reconnectWebSocket();
            }
        };

        // Initialize WebSocket on mount
        initializeWebSocket();

        // Listen to sessionUpdated (same tab) and storage (other tabs)
        window.addEventListener("sessionUpdated", reconnectWebSocket);
        window.addEventListener("storage", handleStorageEvent);

        return () => {
            if (socket) {
                socket.close();
            }

            window.removeEventListener("sessionUpdated", reconnectWebSocket);
            window.removeEventListener("storage", handleStorageEvent);
        };
    }, []);

    return (
        <ChatContext.Provider value={{ messages, addMessage }}>
            {children}
        </ChatContext.Provider>
    );
}

export function useChat() {
    const context = useContext(ChatContext);
    if (!context) {
        throw new Error("useChat must be used within a ChatProvider");
    }
    return context;
}