"use client";

import { useState, useEffect } from "react";
import { Flex, Card, ScrollArea } from "@radix-ui/themes";
import SubTitleBar from "../SubTitleBar";
import ChatMessage from "../ChatMessage";
import ActionBar from "../ActionBar";
import { useChat } from "@/context/ChatContext";

export default function ChatSplit() {
    const { messages: initialMessages } = useChat(); // Use the shared chat context
    interface ChatMessageType {
        type: string;
        sender: string;
        time: string;
        content: string;
    }

    const [messages, setMessages] = useState<ChatMessageType[]>([]); // Initialize with an empty array
    const [isCombined, setIsCombined] = useState(true);


    useEffect(() => {
        if (initialMessages && initialMessages.length > 0) {
            const mappedMessages = initialMessages.map(msg => ({
                ...msg,
                type: msg.type || "defaultType", // Provide a default type or derive it accordingly
                content: msg.content || "", // Ensure content is always a string
            }));
            setMessages(mappedMessages);
        }
    }, [initialMessages]);

    const handleDeleteMessage = (messageId: string) => {
        setMessages((prevMessages) => {
            const updatedMessages = prevMessages.filter((msg) => msg.time !== messageId);
            sessionStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // Update session storage
            return updatedMessages;
        });
    };

    const handleEditMessage = (messageId: string, newContent: any) => {
        setMessages((prevMessages) => {
            const updatedMessages = prevMessages.map((msg) =>
                msg.time === messageId ? { ...msg, content: newContent } : msg
            );
            sessionStorage.setItem("chatMessages", JSON.stringify(updatedMessages)); // Update session storage
            return updatedMessages;
        });
    };
    // // Filter messages for the employee view
    // const clientMessages = messages.filter((message) => message.sender === "Client");
    // const otherMessages = messages.filter(
    //     (message) => message.sender === "AiMessageNew" || message.sender === "KWSP Employee"
    // );

    // const chatMessages = [
    //     {
    //         type: "Client",
    //         sender: "Abdul Aziz",
    //         time: "14:45",
    //         content:
    //             "What are the key steps I should take to start planning for my retirement effectively?",
    //     },
    //     {
    //         type: "AIGenerated",
    //         sender: "AI generated",
    //         time: "14:45",
    //         content:
    //             "To start planning for retirement, consider setting clear financial goals, creating a budget, and contributing to a retirement account like i-Saraang.",
    //     },
    //     {
    //         type: "Client",
    //         sender: "Abdul Aziz",
    //         time: "14:45",
    //         content:
    //             "How can I ensure that I have enough savings to maintain my current lifestyle after retirement?",
    //     },
    //     {
    //         type: "Employee",
    //         sender: "You",
    //         time: "14:45",
    //         content:
    //             "It's important to regularly review your retirement plan, adjust for inflation, and diversify your investments to ensure long-term stability.",
    //     },
    //     {
    //         type: "AiGeneratedNew",
    //         sender: "AI generated",
    //         time: "14:45",
    //         content:
    //             "You can use retirement calculators to estimate your savings needs and consult a financial advisor for personalized advice.",
    //     },
    // ];

    return (
        <Flex direction="column" className="min-h-[calc(100vh-73px)] brand-bg-light-gray">
            <SubTitleBar onViewChange={(value) => setIsCombined(value === "list")} />
            <Flex direction="column" mt="4" className="container">
                {isCombined ? (
                    // Combined view
                    <Card>
                        <ScrollArea scrollbars="vertical" type="always" className="flex-grow" style={{ height: "calc(100vh - 220px)" }}>
                            <Flex direction="column" gap="4" m="4">
                                {messages.map((message, index) => (
                                    <ChatMessage
                                        key={index}
                                        message={message}
                                        isCombined={isCombined}
                                        onDelete={handleDeleteMessage}
                                        onEdit={handleEditMessage}
                                    />
                                ))}
                            </Flex>
                        </ScrollArea>
                    </Card>
                ) : (
                    // Split view
                    <Card>
                        <Flex gap="6">
                            <ScrollArea scrollbars="vertical" className="flex-grow" style={{ height: "calc(100vh - 220px)" }}>
                                <Flex direction="column" gap="4" m="4">
                                    {messages
                                        .filter((message) => message.sender === "Client")
                                        .map((message, index) => (
                                            <ChatMessage
                                                key={index}
                                                message={message}
                                                isCombined={isCombined}
                                                onDelete={handleDeleteMessage}
                                                onEdit={handleEditMessage}
                                            />
                                        ))}
                                </Flex>
                            </ScrollArea>
                            <ScrollArea scrollbars="vertical" className="flex-grow" style={{ height: "calc(100vh - 220px)" }}>
                                <Flex direction="column" gap="4" m="4">
                                    {messages
                                        .filter(
                                            (message) =>
                                                message.sender === "KWSP Employee" ||
                                                message.sender === "AiMessageNew" ||
                                                message.sender === "Employee"
                                        )
                                        .map((message, index) => (
                                            <ChatMessage
                                                key={index}
                                                message={message}
                                                isCombined={isCombined}
                                                onDelete={handleDeleteMessage}
                                                onEdit={handleEditMessage}
                                            />
                                        ))}
                                </Flex>
                            </ScrollArea>
                        </Flex>
                    </Card>
                )}

                {/* Action Bar */}
                <ActionBar />

            </Flex>
        </Flex>
    );
}