import { Flex, Text, Switch } from '@radix-ui/themes';
import { IconStopwatch, IconVolume } from "@tabler/icons-react";

export default function MobileTitleBar() {
    return (
        <header className="sticky top-0 z-50 w-full">
            <Flex justify="between" align="center" p="3" className="border-b brand-border-gold flex-shrink-0">
                <Flex align="center" gap="2">
                    <IconStopwatch size={22} className="brand-blue" />
                    <Text size="2">00:15</Text>
                </Flex>
                <Flex align="center" gap="3">
                    <IconVolume size={22} className="brand-blue" />
                    <Text size="2">Listen</Text>
                    <Switch defaultChecked size="3" radius="full" />
                </Flex>
            </Flex>
        </header>
    )
}

