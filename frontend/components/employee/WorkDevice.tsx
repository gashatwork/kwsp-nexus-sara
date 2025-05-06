"use client";

import { Card, Flex, Text, Button, Heading, RadioCards } from "@radix-ui/themes";
import { useState } from "react";
import { IconDeviceMobile, IconDeviceTablet } from "@tabler/icons-react";

export default function WorkDevice() {
    const devices = [
        { type: "Mobile", name: "Office iPad Pro 11", isActive: false, icon: <IconDeviceMobile size={32} className="brand-gold" /> },
        { type: "Tablet", name: "Office iPad Mini 3", isActive: true, icon: <IconDeviceTablet size={32} className="brand-gold" /> },
    ];

    const [selectedDevice, setSelectedDevice] = useState(
        devices.find(device => device.isActive)?.name || devices[0].name
    );

    const handleStart = () => {
        console.log(`Selected device: ${selectedDevice}`);
    };

    return (
        <Flex direction="column" align="center" justify="center" className="min-h-[calc(100vh-73px)] brand-bg-light-gray">
            <Flex direction="column" align="center" gap="6" className="w-full max-w-md">
                <Heading as="h1" size="8" weight="medium">
                    Select device
                </Heading>
                <Card size="4" className="w-full">
                    <Flex direction="column" gap="4">
                        <Text size="4">
                            Work devices
                        </Text>
                        <Flex direction="column" gap="3">
                            {devices.map((device, index) => (
                                <RadioCards.Root
                                    key={index}
                                    onClick={() => setSelectedDevice(device.name)}
                                >
                                    <RadioCards.Item value={device.name} checked={selectedDevice === device.name} className="!cursor-pointer">
                                        <Flex align="center" gap="2" p="3">
                                            {device.icon}
                                            <Text size="4">
                                                {device.name}
                                            </Text>
                                        </Flex>
                                    </RadioCards.Item>
                                </RadioCards.Root>
                            ))}
                        </Flex>
                    </Flex>
                </Card>
                <Flex direction="row" justify="between" gap="3" className="w-full">
                    <Button variant="surface" size="4" onClick={() => console.log("Back clicked")} className="!cursor-pointer">
                        Back
                    </Button>
                    <Button variant="solid" size="4" onClick={handleStart} className="!cursor-pointer">
                        Start
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}