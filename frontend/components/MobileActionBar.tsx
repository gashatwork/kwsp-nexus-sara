import { Flex, Button } from '@radix-ui/themes';
import { IconKeyboard, IconMicrophone } from "@tabler/icons-react";

interface MobileActionBarProps {
    onType: () => void;
    onVoice: () => void;
}

export default function MobileActionBar({ onType, onVoice }: MobileActionBarProps) {
    return (
        <footer className="sticky bottom-0 z-50 w-full">
            <Flex justify="between" align="center" p="3" gap="3" className="border-t border-gray-200 flex-shrink-0">
                <Button size="4" variant="surface" className="!flex-1" onClick={onType}>
                    <IconKeyboard size={22} />
                    Type
                </Button>
                <Button size="4" variant="solid" className="!flex-1" onClick={onVoice}>
                    <IconMicrophone size={22} />
                    Speak
                </Button>
            </Flex>
        </footer>
    );
}