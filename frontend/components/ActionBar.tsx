import { useState, useEffect, useRef } from "react";
import { Container, Card, Flex, Text, TextField, TextArea, IconButton, Badge } from "@radix-ui/themes";
import { IconMicrophone, IconMicrophoneFilled, IconPlus, IconX, IconArrowRight } from "@tabler/icons-react";
import { toast } from "react-toastify"
import useApproveMessage from "@/hooks/useApproveMessage";

export default function ActionBar() {
    const [showTextArea, setShowTextArea] = useState(false);
    const [message, setMessage] = useState('');
    const [textAreaTitle, setTextAreaTitle] = useState('AI Generated');
    const [textAreaStatus, setTextAreaStatus] = useState('Not send');
    const [textAreaEditing, setTextAreaEditing] = useState('Editing');
    const [textAreaAction, setTextAreaAction] = useState('Text');
    const [showVolumeTwo, setShowVolumeTwo] = useState(true);
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const { approveMessage } = useApproveMessage(); // Use the custom hook to approve messages

    const handleShowTextArea = () => {
        setTextAreaAction("Text");
        setTextAreaTitle("You");
        setTextAreaEditing("");
        setShowTextArea(true);
        setTimeout(() => {
            textAreaRef.current?.focus();
        }, 0);
    };

    const handleSendMessage = async () => {
        const sessionData = localStorage.getItem("voiceNexusSession");
        setMessage("");
        setShowTextArea(false);
        if (!sessionData) {
            throw new Error("Session data is missing in localStorage");
        }
        const { meetingId, clientId } = JSON.parse(sessionData);

        // setIsLoading(true); // Set loading state
        try {
            await approveMessage(meetingId, clientId, message);
            toast.success("Message approved successfully!");
        } catch (error) {
            console.error("Error approving message:", error);
        } finally {
            // setIsLoading(false); // Reset loading state
        }
    };

    const handleRecommendProduct = async () => {
        const sessionData = localStorage.getItem("voiceNexusSession");
        const chatMessages = localStorage.getItem("chatMessages");
    
        if (!sessionData || !chatMessages) {
            toast.error("Required session data is missing.");
            return;
        }
    
        const { meetingId, clientId } = JSON.parse(sessionData);
    
        try {
            const response = await fetch("/api/recommend-product", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    meetingId,
                    clientId,
                    chatMessages: JSON.parse(chatMessages),
                }),
            });
    
            if (!response.ok) {
                throw new Error("Failed to recommend product");
            }
    
            const result = await response.json();
            toast.success("Product recommended successfully!");
            console.log("Recommendation result:", result);
        } catch (error) {
            console.error("Error recommending product:", error);
            toast.error("Failed to recommend product.");
        }
    };

    const handleRecordAudio = () => {
        setTextAreaAction('Audio');
        setTextAreaTitle("I'm listening...");
        setTextAreaEditing("");
        setShowTextArea(true);
        console.log("Recording audio...");
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setShowVolumeTwo(prev => !prev);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <Container className="fixed bottom-10 left-0 right-0 z-10 max-w-[800px] mx-auto">
            {showTextArea && (
                <Card variant="ghost" size="2" className="brand-bg-light-gray shadow-lg" mb="8" mx="2">
                    <Flex direction="column" gap="3">
                        <Flex justify="between" align="center">
                            <Flex justify="between" width="100%" align="center" gap="2" mr="4">
                                <Text size="4" weight="medium">
                                    {textAreaTitle}
                                    {textAreaEditing && (
                                        <span className="text-sm text-gray-500"> / {textAreaEditing}</span>
                                    )}
                                </Text>
                                <Badge color="indigo">{textAreaStatus}</Badge>
                            </Flex>
                            <IconButton variant="ghost" className="!cursor-pointer" onClick={() => setShowTextArea(false)}>
                                <IconX size={20} />
                            </IconButton>
                        </Flex>
                        <form onSubmit={handleSendMessage}>
                            <TextArea
                                size="3"
                                ref={textAreaRef}
                                placeholder="Type your detailed message here..."
                                value={message}
                                rows={10}
                                onChange={(e) => setMessage(e.target.value)}
                                onKeyDown={(e) => {
                                    if (e.key === "Enter" && !e.shiftKey) {
                                        e.preventDefault();
                                        handleSendMessage();
                                    }
                                }}
                            />
                        </form>
                        {textAreaAction === 'Audio' && (
                            <div className="absolute right-8 bottom-8 inline-flex items-center justify-center">
                                <div
                                    className="absolute inline-flex h-8 w-8 rounded-full brand-bg-blue opacity-25 animate-ping"
                                    style={{ animationDuration: '2s' }}
                                ></div>
                                <div className="relative">
                                    {showVolumeTwo ? (
                                        <IconMicrophone size={32} className="brand-gold" />
                                    ) : (
                                        <IconMicrophoneFilled size={32} className="brand-gold" />
                                    )}
                                </div>
                            </div>
                        )}
                    </Flex>
                </Card>
            )}

            {/* Input Section */}
            <Card
                variant="ghost"
                className="!rounded-full brand-bg-light-gray shadow-lg"
            >
                <Flex align="center" gap="2">
                            {/* New Recommend Product Button */}
                            <IconButton
        className="!cursor-pointer !rounded-full brand-bg-light-gray hover:shadow-md flex items-center justify-center px-3 py-2"
        onClick={handleRecommendProduct}
        style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: "40px",
            minWidth: "120px",
            borderRadius: "20px",
            border: "1px solid #e0e0e0",
        }}
    >
        <Text size="3" weight="medium" className="text-yellow-500">
            Recommend Product
        </Text>
    </IconButton>

                    <TextField.Root
                        size="3"
                        placeholder="Type a message"
                        onClick={handleShowTextArea}
                        readOnly={showTextArea}
                        className="flex-grow"
                    >
                        <TextField.Slot>
                            <IconPlus className="brand-blue" />
                        </TextField.Slot>
                    </TextField.Root>
                    {showTextArea ? (
                        <IconButton className="!cursor-pointer" onClick={handleSendMessage}>
                            <IconArrowRight size={20} />
                        </IconButton>
                    ) : (
                        <IconButton onClick={handleRecordAudio} className="!cursor-pointer">
                            <IconMicrophone size={20} />
                        </IconButton>
                    )}
                </Flex>
            </Card>
        </Container>
    );
}