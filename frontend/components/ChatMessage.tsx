import { Card, Text, Flex, Button, IconButton, DropdownMenu, Switch } from "@radix-ui/themes";
import { IconPencil, IconReload, IconDots } from "@tabler/icons-react";
import { useEffect, useState } from "react";
import useApproveMessage from "@/hooks/useApproveMessage";
import { toast } from "react-toastify";

interface ChatMessageProps {
    message: {
        //type: string;
        sender: string;
        time: string;
        content: string;
    };
    isCombined: boolean;
    onDelete: (messageId: string) => void; // Callback to delete the message
    onEdit: (messageId: string, newContent: string) => void; // Callback to edit the message
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, isCombined, onDelete, onEdit }) => {

    const [messageLanguage, setMessageLanguage] = useState('Original');

    const { approveMessage } = useApproveMessage(); // Use the custom hook to approve messages
    const [isEditing, setIsEditing] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // Manage isLoading here
    const [editedContent, setEditedContent] = useState(message.content); // Define state for edited content

    const handleAccept = async () => {
        const sessionData = localStorage.getItem("voiceNexusSession");
        if (!sessionData) {
            throw new Error("Session data is missing in localStorage");
        }
        const { meetingId, clientId } = JSON.parse(sessionData);

        setIsLoading(true); // Set loading state
        try {
            await approveMessage(meetingId, clientId, message.content);
            toast.success("Message approved successfully!");
        } catch (error) {
            console.error("Error approving message:", error);
        } finally {
            setIsLoading(false); // Reset loading state
        }
    };

    const handleDiscard = () => {
        onDelete(message.time); // Use the unique `time` as an identifier
    };

    const handleSimplify = () => {
        setIsEditing(true);
        setEditedContent("Simplified content..."); // Example simplified content
    };

    const handleExpand = () => {
        setIsEditing(true);
        setEditedContent("Expanded content..."); // Example expanded content
    };

    const handleSaveEdit = () => {
        onEdit(message.time, editedContent); // Save the edited content
        setIsEditing(false);
    };

    const cardClass = () => {
        if (message.sender === "KWSP Employee") {
            return 'card-ai bg-blue-100';
        }
        if (message.sender === "AiMessageNew") {
            return 'card-ai card-ai-new bg-blue-100';
        }
        return '';
    }

    const wrapperStyle = isCombined
        ? {
            alignSelf: message.sender === "Client" ? "flex-start" : "flex-end",
            maxWidth: "60%",
        }
        : {};

    const handleMessageLanguageChange = (checked: boolean) => {
        setMessageLanguage(checked ? 'English' : 'Original');
    };

    useEffect(() => {
        setMessageLanguage('English');
    }, []);

    return (
        <div style={wrapperStyle}>
            <Card className={cardClass()}>
                <Flex gap="2" justify="between" align="center">
                    <Text as="div" size="2" color="gray">
                        {message.sender} - {message.time}
                    </Text>
                    {message.sender === "Client" && (
                        <Flex gap="2" align="center">
                            <Text as="div" size="2" className="brand-blue">{messageLanguage}</Text>
                            <Switch
                                size="1"
                                onCheckedChange={handleMessageLanguageChange}
                                checked={messageLanguage === 'English'}
                                className="!cursor-pointer"
                            />
                        </Flex>
                    )}
                </Flex>
                {isEditing ? (
                    <div>
                        <textarea
                            value={editedContent}
                            onChange={(e) => setEditedContent(e.target.value)}
                            className="w-full border rounded p-2"
                        />
                        <Button onClick={handleSaveEdit} className="mt-2">Save</Button>
                    </div>
                ) : (
                    <Text as="div">{message.content}</Text>
                )}
                {message.sender === "AiMessageNew" && (
                    <Flex gap="2" justify="end" mt="2">
                        <Button
                            className="!cursor-pointer"
                            onClick={handleAccept}
                            disabled={isLoading}
                        >
                            {isLoading ? "Processing..." : "Accept"}
                        </Button>
                        <IconButton variant="surface" className="!cursor-pointer" aria-label="Edit">
                            <IconPencil size={22} />
                        </IconButton>
                        <IconButton variant="surface" className="!cursor-pointer" aria-label="Regenerate">
                            <IconReload size={22} />
                        </IconButton>
                        <DropdownMenu.Root>
                            <DropdownMenu.Trigger>
                                <IconButton variant="surface" className="!cursor-pointer" aria-label="More options">
                                    <IconDots size={22} />
                                </IconButton>
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Content>
                                <DropdownMenu.Item onSelect={handleDiscard}>Discard</DropdownMenu.Item>
                                <DropdownMenu.Item onSelect={handleSimplify}>Simplify</DropdownMenu.Item>
                                <DropdownMenu.Item onSelect={handleExpand}>Expand</DropdownMenu.Item>
                            </DropdownMenu.Content>
                        </DropdownMenu.Root>
                    </Flex>
                )}
            </Card>
        </div>
    );
};

export default ChatMessage;