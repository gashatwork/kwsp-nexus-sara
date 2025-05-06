import React, { useState, useEffect } from "react";
import { Flex, Box, Heading, Text, Button, SegmentedControl, Separator, DropdownMenu, Dialog, DataList, Card, Avatar } from "@radix-ui/themes";
import { IconStopwatch, IconMicrophone, IconLayoutList, IconColumns2, IconInfoSquareRounded } from "@tabler/icons-react";

interface SubTitleBarProps {
    onViewChange?: (view: string) => void;
}

const SubTitleBar: React.FC<SubTitleBarProps> = ({ onViewChange }) => {
    const [elapsed, setElapsed] = useState<number>(0);
    const [showProfile, setShowProfile] = useState<boolean>(false);

    const microphoneOptions = [
        { label: "Default", value: "Default", default: true },
        { label: "Headset", value: "Headset" },
        { label: "Another Microphone", value: "AnotherMicrophone" },
    ];

    // Find the default microphone to display on trigger
    const defaultMic = microphoneOptions.find(option => option.default)?.label || "Select microphone";

    // Format elapsed seconds to mm:ss
    const formatTime = (seconds: number): string => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            setElapsed(prev => prev + 1);
        }, 1000);

        return () => clearInterval(intervalId);
    }, []);

    return (
        <>
            <header className="border-b border-gray-300 bg-white py-1">
                <Flex className="container">
                    <Flex justify="between" align="center" my="4" className="w-full">
                        <Flex justify="start" align="center" gap="2" className="w-full">
                            <Heading as="h1" size="4" weight="medium">
                                Meeting with Abdul Aziz
                            </Heading>

                            <IconInfoSquareRounded size={24} className="brand-blue !cursor-pointer" onClick={() => setShowProfile(true)} />
                        </Flex>

                        <Flex align="center" gap="4">
                            <Flex align="center" gap="2">
                                <IconStopwatch size={24} className="brand-blue" />
                                <Text className="w-[50px]">{formatTime(elapsed)}</Text>
                                <Separator orientation="vertical" size="1" />
                                <DropdownMenu.Root>
                                    <DropdownMenu.Trigger>
                                        <Flex align="center" gap="2" className="!cursor-pointer">
                                            <IconMicrophone size={24} className="brand-blue" />
                                            <Text>{defaultMic}</Text>
                                        </Flex>
                                    </DropdownMenu.Trigger>
                                    <DropdownMenu.Content sideOffset={5}>
                                        {microphoneOptions.map((option) => (
                                            <DropdownMenu.Item
                                                key={option.value}
                                                {...(option.default ? { "data-default": "true" } : {})}
                                            >
                                                {option.label}
                                            </DropdownMenu.Item>
                                        ))}
                                    </DropdownMenu.Content>
                                </DropdownMenu.Root>
                            </Flex>
                            <SegmentedControl.Root
                                defaultValue="list"
                                size="2"
                                onValueChange={(value) => onViewChange && onViewChange(value)}
                            >
                                <SegmentedControl.Item value="list" className="!cursor-pointer">
                                    <IconLayoutList size={16} className="brand-blue" />
                                </SegmentedControl.Item>
                                <SegmentedControl.Item value="lists" className="!cursor-pointer">
                                    <IconColumns2 size={16} className="brand-blue" />
                                </SegmentedControl.Item>
                            </SegmentedControl.Root>
                            <Button variant="soft" className="!cursor-pointer" color="red">
                                End meeting
                            </Button>
                        </Flex>
                    </Flex>
                </Flex>
            </header>
            <Dialog.Root open={showProfile} onOpenChange={setShowProfile}>
                <Dialog.Content className="w-full max-w-[700px]">
                    <Dialog.Title>Client profile</Dialog.Title>
                    <Dialog.Description>
                        <Box>
                            <Card mt="6" mb="3">
                                <Flex gap="3" align="center">
                                    <Avatar
                                        size="5"
                                        src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=256&h=256&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                                        radius="full"
                                        fallback="AA"
                                    />
                                    <Box>
                                        <Text as="div" size="2" weight="bold">
                                            Abdul Aziz
                                        </Text>
                                        <Text as="div" size="2" color="gray">
                                            EPF ID: 12345
                                        </Text>
                                    </Box>
                                </Flex>
                            </Card>
                        </Box>
                        <Flex direction="row" gap="6" justify="between" className="p-6">
                            <Box>
                                <DataList.Root>
                                    <DataList.Item>
                                        <DataList.Label>Gender</DataList.Label>
                                        <DataList.Value>Male</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Age</DataList.Label>
                                        <DataList.Value>35</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Citizenship</DataList.Label>
                                        <DataList.Value>Non-Resident</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Religion</DataList.Label>
                                        <DataList.Value>Islam</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Savings Range</DataList.Label>
                                        <DataList.Value>RM 600 - RM 800</DataList.Value>
                                    </DataList.Item>
                                </DataList.Root>
                            </Box>
                            <Box>
                                <DataList.Root>
                                    <DataList.Item>
                                        <DataList.Label>Account Type</DataList.Label>
                                        <DataList.Value>Conventional</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>CSIK</DataList.Label>
                                        <DataList.Value>iSaraan</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Total Contributions</DataList.Label>
                                        <DataList.Value>MYR 10,000</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Total Withdrawals</DataList.Label>
                                        <DataList.Value>MYR 2,000</DataList.Value>
                                    </DataList.Item>
                                    <DataList.Item>
                                        <DataList.Label>Balance</DataList.Label>
                                        <DataList.Value>MYR 8,000</DataList.Value>
                                    </DataList.Item>
                                </DataList.Root>
                            </Box>
                        </Flex>
                    </Dialog.Description>
                    <Flex gap="3" mt="4" justify="end">
                        <Dialog.Close>
                            <Button variant="soft" color="gray" className="!cursor-pointer">
                                Close
                            </Button>
                        </Dialog.Close>
                    </Flex>
                </Dialog.Content>
            </Dialog.Root>
        </>
    );
};

export default SubTitleBar;