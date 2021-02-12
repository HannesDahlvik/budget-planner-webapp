import React from 'react'
import { useAuth } from 'reactfire'
import Firebase from 'firebase'

// Chakra UI
import { Alert, AlertDescription, AlertIcon, Box, Button, Flex, FormControl, FormLabel, Heading, Input, InputGroup, InputRightElement, Spinner } from '@chakra-ui/react'
import { ViewIcon, ViewOffIcon } from '@chakra-ui/icons'
import ErrorHandler from '../../../utils/ErrorHandler'
import { useNavigate } from '@reach/router'

const ForgotPassword = (props: any) => {
    const auth = useAuth()
    const navigate = useNavigate()
    const [email, setEmail] = React.useState('')
    const [error, setError] = React.useState('')
    const [isLoading, setIsLoading] = React.useState(false)

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setIsLoading(true)
        try {
            await auth.sendPasswordResetEmail(email)
                .then(() => navigate('/dashboard'))
                .catch((err: Error) => new ErrorHandler(err.message))
        } catch (error) {
            setError('Invalid username or password')
            setIsLoading(false)
            setEmail('')
        }
    }

    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={8} maxWidth="400px" className="auth-wrapper" borderWidth={1} borderRadius={8} boxShadow="lg">
                <Box textAlign="center">
                    <Heading>Reset password</Heading>
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
                </Box>
            </Box>
        </Flex>
    )
}

export default ForgotPassword

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