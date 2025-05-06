"use client";

import { useState } from "react";
import { useMeeting } from "@/context/MeetingContext"
import { useSession } from "@/context/SessionContext";
import { Button, TextField, Select, Card, Flex, Text, Heading, RadioGroup } from "@radix-ui/themes";
import { toast } from "react-toastify"

export default function NewMeeting() {
    const [meetingName, setMeetingName] = useState("Meeting");
    const [userDetails, setUserDetails] = useState(null);
    const [playAudioOn, setPlayAudioOn] = useState("Default");
    const [startOn, setStartOn] = useState("Client device");

    const [clientId, setClientId] = useState("");
    const [clientLanguage, setClientLanguage] = useState("Malay");
    const { setMeetingDetails } = useSession();

    const { startMeeting } = useMeeting();

    // Generate a meeting ID whenever clientLanguage, clientId, or meetingName changes
    // useEffect(() => {
    //     const now = new Date();
    //     const yearMonthDate = now.toISOString().slice(2, 10).replace(/-/g, "");
    //     const hourMinute = now.toTimeString().slice(0, 5).replace(/:/g, "");
    //     const randomString = Math.random().toString(36).substring(2, 6);
    //     const meetingId = `meet_${yearMonthDate}-${hourMinute}_${randomString}`;

    //     setMeetingDetails({
    //         meetingId,
    //         meetingName,
    //         clientId,
    //         language: clientLanguage,
    //     });
    // }, [meetingName, clientId, clientLanguage, setMeetingDetails]);

    const fetchUserDetails = async () => {
        if (!clientId) {
            toast.error("Please enter a valid User EPF No.");
            return;
        }
        const userpayload = JSON.stringify({ user_id: clientId });
        console.log("Payload:", userpayload); // Log the payload for debugging
        try {
            const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/kwspcore/verifyuser`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: userpayload, // Send user_id as payload
            });
            if (!response.ok) {
                toast.error("Failed to fetch user details");
                console.error("Failed to fetch user details");
                return;
            }
            const userDetails = await response.json();

            // Store user details in sessionStorage
            setUserDetails(userDetails);
            setMeetingName(`Meeting with ${userDetails.name}`); // Set the meeting name to the user's name
            sessionStorage.setItem("userDetails", JSON.stringify(userDetails));
            toast.success("User details fetched and stored successfully!");

        } catch (error) {
            toast.error("Failed to fetch user details. Please try again.");
            console.error("Error fetching user details:", error);
        }
    };


    const handleMeetingDetails = () => {
        const now = new Date();
        const yearMonthDate = now.toISOString().slice(2, 10).replace(/-/g, "");
        const hourMinute = now.toTimeString().slice(0, 5).replace(/:/g, "");
        const randomString = Math.random().toString(36).substring(2, 6);
        const meetingId = `meet_${yearMonthDate}-${hourMinute}_${randomString}`;

        // // Update session context with meeting details
        // setMeetingDetails({
        //     meetingId,
        //     meetingName,
        //     clientId,
        //     language: clientLanguage,
        // });

        // // Start the meeting
        // startMeeting();

        const meetingDetails = {
            meetingId,
            meetingName,
            clientId,
            language: clientLanguage
        }
        setMeetingDetails(meetingDetails); // Update session context with meeting details

        const existingDetails = JSON.parse(sessionStorage.getItem("userDetails") || "{}");
        sessionStorage.setItem("userDetails", JSON.stringify({ ...existingDetails, meetingDetails }));

        startMeeting();
    };

    const languageOptions = [
        { label: "Malay", value: "Malay" },
        { label: "English", value: "English" },
        { label: "Bangla", value: "Bangla" },
        { label: "Nepali", value: "Nepali" },
    ];

    const microphoneOptions = [
        { label: "Default", value: "Default", default: true },
        { label: "Headset", value: "Headset" },
        { label: "Another Microphone", value: "AnotherMicrophone" },
    ];

    return (
        <Flex direction="column" align="center" justify="center" className="min-h-[calc(100vh-73px)] brand-bg-light-gray">
            <Flex direction="column" align="center" gap="6" className="w-full max-w-md">
                <Heading as="h1" size="8" weight="medium">
                    New meeting
                </Heading>
                <Card size="4" className="w-full">
                    <Flex direction="column" gap="4">
                        <Flex direction="column" gap="2">
                            <Flex direction="row" align="center" gap="2">
                                <Text>User EPF No.</Text>
                            </Flex>
                            <Flex direction="row" align="center" justify="between" gap="2">
                                <TextField.Root
                                    size="3"
                                    value={clientId}
                                    onChange={(e) => {
                                        setClientId(e.target.value)
                                    }}
                                    placeholder="Enter KWSP number"
                                    className="!w-full"
                                />
                                <Button
                                    variant="surface"
                                    size="3"
                                    onClick={fetchUserDetails}
                                    className="!cursor-pointer"
                                >
                                    Fetch details
                                </Button>
                            </Flex>
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text>Meeting name</Text>
                            <TextField.Root
                                size="3"
                                value={meetingName}
                                onChange={(e) => setMeetingName(e.target.value)}
                                placeholder="Enter meeting name"
                            />
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text>Client language</Text>
                            <Select.Root value={clientLanguage}
                                onValueChange={(value) => {
                                    setClientLanguage(value); // Update local state
                                }}
                                size="3">
                                <Select.Trigger id="client-language" />
                                <Select.Content>
                                    <Select.Group>
                                        <Select.Label>Languages</Select.Label>
                                        {languageOptions.map((option) => (
                                            <Select.Item key={option.value} value={option.value}>
                                                {option.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text>Microphone</Text>
                            <Select.Root value={playAudioOn} onValueChange={setPlayAudioOn} size="3">
                                <Select.Trigger id="play-audio-on" />
                                <Select.Content>
                                    <Select.Group>
                                        {microphoneOptions.map((option) => (
                                            <Select.Item
                                                key={option.value}
                                                value={option.value}
                                                {...(option.default ? { "data-default": "true" } : {})}
                                            >
                                                {option.label}
                                            </Select.Item>
                                        ))}
                                    </Select.Group>
                                </Select.Content>
                            </Select.Root>
                        </Flex>
                        <Flex direction="column" gap="2">
                            <Text>Start on</Text>
                            <RadioGroup.Root value={startOn} onValueChange={setStartOn} size="3">
                                <Flex direction="row" gap="2">
                                    <RadioGroup.Item value="Client device" className="!cursor-pointer">
                                        <Text>Client device</Text>
                                    </RadioGroup.Item>
                                    <RadioGroup.Item value="Work device" className="!cursor-pointer">
                                        <Text>Work device</Text>
                                    </RadioGroup.Item>
                                </Flex>
                            </RadioGroup.Root>
                        </Flex>
                    </Flex>
                </Card>
                <Button variant="solid" size="4" className="!w-full !cursor-pointer" onClick={handleMeetingDetails}>
                    Start meeting
                </Button>
            </Flex>
        </Flex>
    );
}