import { Flex, Text, Heading, Button, TextField } from '@radix-ui/themes';
import Logo from "@/components/Logo";

export default function Code({ onAccept }: { onAccept: () => void }) {


    return (
        <Flex direction="column" justify="center" className="h-screen p-6">
            <Flex direction="column">
                <Flex direction="column" align="center" gap="3">
                    <Logo />
                    <Heading size="6" mt="3">Welcome to KWSP!</Heading>
                    <Text weight="bold">Enter meeting code.</Text>
                    <TextField.Root size="3" mt="6" mb="6" maxLength={8} className="text-center code-input" />
                </Flex>

                <Flex direction="column" gap="6" mt="3">
                    <Button size="4" className="w-full" onClick={onAccept}>Start</Button>
                </Flex>
            </Flex>
        </Flex >
    );
}