"use client"

import { useState } from "react"
import { Button, Card, TextField, Flex, Text, Heading, Box } from "@radix-ui/themes"
import { toast } from "react-toastify"
import Logo from "@/components/Logo"
import { useAuth } from "@/context/AuthContext"

export default function LoginForm() {
    const { login } = useAuth()
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoggingIn(true)

        try {
            const success = await login(username, password);
            if (success) {
                toast.success("Login successful!")
            } else {
                toast.error("Invalid username or password. Try 'employee' with password 'password'.")
            }
        } catch (error) {
            toast.error("An error occurred during login. Please try again.")
        } finally {
            setIsLoggingIn(false)
        }
    }

    return (
        <form onSubmit={handleLogin}>
            <Flex direction="column" align="center" justify="center" className="h-screen brand-bg-light-blue">
                <Flex direction="column" align="center" gap="6" className="w-full max-w-sm">
                    <Flex direction="column" align="center">
                        <Logo />
                        <Heading size="8" mt="4" weight="medium">Voice Nexus</Heading>
                        <Heading size="3">Employee Portal</Heading>
                    </Flex>
                    <Card size="4">
                        <Flex direction="column" gap="4">
                            <Heading size="6">Sign In</Heading>
                            <Text>Enter your credentials to access the system</Text>

                            <Flex direction="column" gap="2">
                                <Text as="label" htmlFor="username" weight="medium">Username</Text>
                                <TextField.Root
                                    size="3"
                                    id="username"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </Flex>

                            <Flex direction="column" gap="2">
                                <Text as="label" htmlFor="password" weight="medium">Password</Text>
                                <TextField.Root
                                    size="3"
                                    id="password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </Flex>
                        </Flex>
                        <Box mt="2" />
                    </Card>
                    <Button type="submit" size="4" disabled={isLoggingIn} className="!cursor-pointer !w-full">
                        {isLoggingIn ? "Logging in..." : "Login"}
                    </Button>
                </Flex>
            </Flex>
        </form>
    )
}