"use client";

import { useState, useEffect } from "react";
import { Card, Flex, Text, Button, Link, Heading, Separator } from "@radix-ui/themes";
import { QRCodeSVG } from "qrcode.react";
import { IconDevices } from "@tabler/icons-react";
import { useMeeting } from "@/context/MeetingContext";
import { useRouter } from "next/navigation";

export default function ClientDevice() {
    const websiteUrl = "https://www.kwsp.gov.my/nexus";
    const [generatedCode, setGeneratedCode] = useState('');
    const { setClientConnected } = useMeeting();
    const route = useRouter();

    const handleSimulateScan = () => {
        // Simulate QR code scanning
        setClientConnected(true);
    };

    const handleSimulateClient = () => {
        // Simulate opening the client app
        route.push("/mobile");
    };
    const generateCode = () => {
        // Simple random code generator (example: 8-character alphanumeric)
        const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
        let code = "";
        for (let i = 0; i < 8; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return code;
    };

    // Generate code when page loads
    useEffect(() => {
        setGeneratedCode(generateCode());
    }, []);

    const handleGetNewCode = () => {
        const newCode = generateCode();
        console.log("New code generated:", newCode);
        setGeneratedCode(newCode);
    };

    return (
        <Flex direction="column" align="center" justify="center" className="min-h-[calc(100vh-73px)] brand-bg-light-gray">
            <Flex direction="column" align="center" gap="6" className="w-full max-w-[700px]">
                <Heading as="h1" size="8" weight="medium">
                    Welcome to KWSP!
                </Heading>
                <Text as="p" size="3" align="center">
                    You will join the meeting by one of the options below.
                </Text>
                <Card size="4">
                    <Heading as="h2" size="4" mb="6" className="text-center">
                        Two Easy Ways to Access the Meeting
                    </Heading>
                    <Flex direction="row" justify="between" align="stretch" gap="4">
                        <Flex direction="column" align="center" gap="2" className="w-[300px]" mb="6">
                            <Text as="p" size="4" mb="6" weight="medium">
                                Scan QR code
                            </Text>
                            <QRCodeSVG value={`${websiteUrl}/${generatedCode}`} size={150} />
                        </Flex>
                        <Flex>
                            <Separator orientation="vertical" size="4" />
                        </Flex>
                        <Flex direction="column" align="center" gap="2" className="w-[300px]">
                            <Text as="p" size="4" mb="6" weight="medium">
                                To visit a website
                            </Text>
                            <IconDevices size={72} className="brand-gold" />
                            <Link href={websiteUrl} target="_blank" rel="noopener noreferrer">
                                {websiteUrl}
                            </Link>
                            <Text as="p" size="7" mt="4">
                                {generatedCode}
                            </Text>
                        </Flex>
                    </Flex>
                </Card>
                <Flex direction="row" justify="between" gap="3" className="w-full">
                    <Button variant="surface" size="4" onClick={() => console.log("Back clicked")} className="!cursor-pointer">
                        Back
                    </Button>
                    <Button variant="surface" size="4" onClick={handleGetNewCode} className="!cursor-pointer">
                        Get new code
                    </Button>
                    <Button variant="surface" size="4" onClick={handleSimulateClient} className="!cursor-pointer">
                        Open client app
                    </Button>
                    <Button variant="solid" size="4" onClick={handleSimulateScan} className="!cursor-pointer">
                        Start meeting
                    </Button>
                </Flex>
            </Flex>
        </Flex>
    );
}