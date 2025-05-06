"use client";

import { useState, useRef } from 'react';
import { Flex, Text, Dialog, Card, ScrollArea, VisuallyHidden, TextArea } from '@radix-ui/themes';
import MobileTitleBar from "@/components/MobileTitleBar";
import MobileActionBar from "@/components/MobileActionBar";
import { useChat } from "@/context/ChatContext";
import Speak from "@/components/mobile/Speak";

export default function ChatPage() {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [textAreaOpen, setTextAreaOpen] = useState(false);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { messages } = useChat(); // Use the shared chat context

    // Filter messages for the mobile view (Migrant User)
    const filteredMessages = messages.filter(
        (message) => message.sender === "Client" || message.sender === "KWSP Employee"
    );

    console.log("Filtered Messages:", filteredMessages);

    // const lorem = "কার্যকরভাবে আমার অবসর গ্রহণের পরিকল্পনা শুরু করার জন্য আমার কী কী পদক্ষেপ নেওয়া উচিত?";
    // const lorem2 = "অবসর পরিকল্পনা শুরু করার জন্য, সুস্পষ্ট আর্থিক লক্ষ্য নির্ধারণ করা, একটি বাজেট তৈরি করা এবং i-Saraang এর মতো একটি অবসর হিসাবের দিকে অবদান রাখা বিবেচনা করুন।";
    const handleType = () => {
        setTextAreaOpen(true);
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    const handleVoice = () => {
        setDialogOpen(true);
    };

    return (
        <Flex direction="column" justify="center" className="h-screen">
            <MobileTitleBar />
            <ScrollArea
                size="2"
                scrollbars="vertical"
                className="flex-grow brand-bg-light-gray p-4"
            >
                <Flex direction="column" gap="3">
                    {filteredMessages.map((message, index) => (
                        <Flex
                            key={index}
                            direction="column"
                            align={message.sender === "Client" ? "start" : "end"}
                            className={message.sender === "Client" ? "max-w-[80%] self-start" : "max-w-[80%] self-end"}
                        >
                            <Card size="1" className={message.sender === "Client" ? "bg-gray-100" : "card-ai bg-blue-100"}>
                                <Text size="1" as="div" color="gray">
                                    {message.sender} - {message.time}
                                </Text>
                                {/* Show text if available */}
                                {message.content && (
                                    <Text size="2" style={{ marginTop: '0.5rem' }}>
                                        {message.content}
                                    </Text>
                                )}

                                {/* Show audio player if available */}
                                {message.audioUrl && (
                                    <audio
                                        controls
                                        src={message.audioUrl}
                                        style={{ marginTop: '0.5rem', width: '100%' }}
                                    />
                                )}
                            </Card>
                        </Flex>
                    ))}
                </Flex>
            </ScrollArea>
            <MobileActionBar onType={handleType} onVoice={handleVoice} />
            {/* Text area for typing messages */}
            <Flex direction="column" className={`fixed w-full bottom-0 border-t border-gray-200 brand-bg-light-gray ${textAreaOpen ? 'block' : 'hidden'} z-50`}>
                <TextArea size="3" rows={5} ref={textAreaRef} m="4" onBlur={() => setTextAreaOpen(false)} />
            </Flex>
            {/* Dialog for voice input */}
            <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                <Dialog.Content>
                    <VisuallyHidden>
                        <Dialog.Title>I'm listening...</Dialog.Title>
                    </VisuallyHidden>
                    <Speak onDone={() => setDialogOpen(false)} />
                </Dialog.Content>
            </Dialog.Root>
        </Flex>
    );
}