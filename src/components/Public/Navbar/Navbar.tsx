import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from 'reactfire'
import './Navbar.scss'

// Chakra UI
import { Box, Button, Flex, Heading, Text } from '@chakra-ui/react'

const Navbar = (props: any) => {
    const [user, setUser] = React.useState(null)
    const auth = useAuth()

    React.useEffect(() => {
        window.addEventListener('scroll', () => {
            const navbarWrapperElement: any = document.querySelector('.navbar-wrapper')
            if (navbarWrapperElement) {
                if (window.scrollY > 150) {
                    navbarWrapperElement.style.height = '64px'
                    navbarWrapperElement.classList.add('navbar-active')
                } else {
                    navbarWrapperElement.style.height = '128px'
                    navbarWrapperElement.classList.remove('navbar-active')
                }
            }
        })

        auth.onAuthStateChanged((user: any) => {
            if (user) setUser(user)
            else setUser(null)
        })
    }, [])

    return (
        <Flex
            as="nav"
            align="center"
            justify="space-between"
            wrap="wrap"
            bg="teal.500"
            color="white"
            className="navbar-wrapper"
            {...props}
        >
            <Flex align="center" mr={5}>
                <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
                    Budget planner
                </Heading>
            </Flex>

            <Box display={{ base: "block", md: "none" }}>
                <svg
                    fill="white"
                    width="12px"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <title>Menu</title>
                    <path d="M0 3h20v2H0V3zm0 6h20v2H0V9zm0 6h20v2H0v-2z" />
                </svg>
            </Box>

            <Box
                width={{ sm: "full", md: "auto" }}
                display="flex"
                alignItems="center"
                flexGrow={1}
            >
                <MenuItems>About</MenuItems>
                <MenuItems>How it works</MenuItems>
            </Box>

            <Box mt={{ base: 4, md: 0 }}>
                {user ? (
                    <>
                        <Link to="/dashboard"><Button variant="outline" colorScheme="gray.500">Dashboard</Button></Link>
                        <Button onClick={() => auth.signOut()} variant="outline" colorScheme="gray.500" ml={4}>Logout</Button>
                    </>
                ) : (
                        <>
                            <Link to="/signup"><Button bg="transparent" border="1px">Sign up</Button></Link>
                            <Link to="/login"><Button bg="transparent" border="1px" ml={4}>Log in</Button></Link>
                        </>
                    )}
            </Box>
        </Flex>
    )
}

export default Navbar

function scrollTo(element: any) {
    element = element.replace(/\s+/g, '-').toLowerCase()
    const el = document.getElementById(element)
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' })
}

const MenuItems = ({ children }: any) => (
    <Text onClick={() => scrollTo(children)} cursor="pointer" mt={{ base: 4, md: 0 }} mr={6} display="block">
        {children}
    </Text>
)