import React from 'react'
import { useAuth } from 'reactfire'
import './Navbar.scss'

// Chakra UI
import { Box, Button, Flex, Heading, Text, useColorMode } from '@chakra-ui/react'
import { MoonIcon, SunIcon } from '@chakra-ui/icons'
import { Link } from '@reach/router'

interface Props {
    isSmall: boolean
}

const Navbar = (props: Props) => {
    const { colorMode, toggleColorMode } = useColorMode()

    const [user, setUser] = React.useState(null)
    const auth = useAuth()

    React.useEffect(() => {
        const navbarWrapperElement: any = document.querySelector('.navbar-wrapper')
        if (props.isSmall === true) {
            navbarWrapperElement.style.height = '64px'
            navbarWrapperElement.classList.add('navbar-active')
        } else {
            window.addEventListener('scroll', () => {
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
        }

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
            className="navbar-wrapper"
            padding="0 !important"
        >
            <Box
                display="flex"
                className="wrapper"
            >
                <Flex align="center" mr={5} flexGrow={1}>
                    <Heading as="h1" size="lg" letterSpacing={"-.1rem"}>
                        <Link to="/">
                            Budget planner
                        </Link>
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
                >
                    <MenuItems>About</MenuItems>
                    <MenuItems>How it works</MenuItems>
                    <Button
                        variant="ghost"
                        onClick={toggleColorMode}
                        w={10}
                        mr={25}
                        _hover={{
                            bgColor: 'rgba(255, 255, 255, 0.1)'
                        }}
                    >
                        {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
                    </Button>
                </Box>


                <Box mt={{ base: 4, md: 0 }}>
                    {user ? (
                        <>
                            <Link to="/dashboard"><Button variant="outline" colorScheme="gray">Dashboard</Button></Link>
                            <Button onClick={() => auth.signOut()} variant="outline" colorScheme="gray" ml={4}>Logout</Button>
                        </>
                    ) : (
                            <>
                                <Link to="/login"><Button bg="transparent" border="1px">Log in</Button></Link>
                                <Link to="/signup"><Button bg="transparent" border="1px" ml={4}>Sign up</Button></Link>
                            </>
                        )}
                </Box>
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