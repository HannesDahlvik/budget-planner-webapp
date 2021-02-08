import React from 'react'
import OtherAuth from '../../components/OtherAuth/OtherAuth'

// Router
import { useHistory } from 'react-router-dom'

// Firebase
import { useAuth } from 'reactfire'

// Chakra UI
import { Alert, AlertDescription, AlertIcon, Box, Button, Flex, FormControl, FormLabel, Grid, GridItem, Heading, Input, InputGroup, InputRightElement, Link, Spinner, Text } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'

const Login = () => {
    const auth = useAuth()
    const history = useHistory()
    const [email, setEmail] = React.useState('')
    const [password, setPassword] = React.useState('')
    const [error, setError] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)
    const [showPassword, setShowPassword] = React.useState(false)

    const handlePasswordVisibility = () => setShowPassword(!showPassword)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true);
        try {
            await auth.signInWithEmailAndPassword(email, password)
                .then(() => {
                    setIsLoading(false);
                    history.push('/dashboard')
                })
        } catch (error) {
            setError('Invalid username or password');
            setIsLoading(false);
            setEmail('');
            setPassword('');
        }
    }

    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={8} maxWidth="400px" className="auth-wrapper" borderWidth={1} borderRadius={8} boxShadow="lg">
                {auth.currentUser ? (
                    <Box textAlign="center">
                        <Text>Logged in as {auth.currentUser?.email}!</Text>
                        <Button
                            colorScheme="orange"
                            variant="outline"
                            width="full"
                            mt={4}
                            onClick={() => auth.signOut()}
                        >
                            Sign out
                        </Button>
                        <Button
                            colorScheme="blue"
                            variant="outline"
                            width="full"
                            mt={4}
                            onClick={() => history.push('/dashboard')}
                        >
                            Dashboard
                        </Button>
                    </Box>
                ) : (
                        <>
                            <Box textAlign="center">
                                <Heading>Login</Heading>
                            </Box>
                            <Box my={4} textAlign="left">
                                <form onSubmit={(e: any) => handleSubmit(e)}>
                                    {error && <ErrorMessage message={error} />}
                                    <FormControl isRequired>
                                        <FormLabel>Email</FormLabel>
                                        <Input
                                            type="email"
                                            placeholder="test@test.com"
                                            size="lg"
                                            onChange={(event) => setEmail(event.currentTarget.value)}
                                        />
                                    </FormControl>
                                    <FormControl isRequired mt={6} mb={4}>
                                        <FormLabel>Password</FormLabel>
                                        <InputGroup>
                                            <Input
                                                type={showPassword ? 'text' : 'password'}
                                                placeholder="*******"
                                                size="lg"
                                                onChange={event => setPassword(event.currentTarget.value)}
                                            />
                                            <InputRightElement width="3rem">
                                                <Button h="1.5rem" size="sm" onClick={handlePasswordVisibility}>
                                                    {showPassword ? <ViewOffIcon /> : <ViewIcon />}
                                                </Button>
                                            </InputRightElement>
                                        </InputGroup>
                                    </FormControl>

                                    <Grid>
                                        <GridItem>
                                            <Link href="/pw-forget" variant="body2">
                                                Forgot password?
                                            </Link>
                                        </GridItem>
                                        <GridItem>
                                            <Link href="/signup" variant="body2">
                                                {"Don't have an account? Sign Up"}
                                            </Link>
                                        </GridItem>
                                    </Grid>

                                    <Button
                                        type="submit"
                                        colorScheme="blue"
                                        variant="outline"
                                        width="full"
                                        mt={4}
                                    >
                                        {isLoading ? (
                                            <Spinner color="blue.500" size="md" thickness="3px" />
                                        ) : (
                                                'Login'
                                            )}
                                    </Button>
                                </form>

                                <OtherAuth />
                            </Box>
                        </>
                    )}
            </Box>
        </Flex>
    )
}

export default Login

function ErrorMessage({ message }: any) {
    return (
        <Box my={4}>
            <Alert status="error" borderRadius={4}>
                <AlertIcon />
                <AlertDescription>{message}</AlertDescription>
            </Alert>
        </Box>
    );
}