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
                                <Text>Monthly Commitment</Text>
                            </Flex>
                            <Flex direction="row" align="center" justify="between" gap="2">
                                <TextField.Root
                                    size="3"
                                    value={clientId}
                                    onChange={(e) => {
                                        setClientId(e.target.value)
                                    }}
                                    placeholder="Enter your monthly commitment"
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
