import React from 'react'
import { useAuth } from 'reactfire'
import { SidebarLinks } from '../../../types'
import './Sidebar.scss'

// Routing
import { Link } from '@reach/router'

// Chakra UI
import { Avatar, Divider, Flex, Text } from '@chakra-ui/react'
import NavLink from '../../NavLink/NavLink'
import { MdDashboard } from 'react-icons/md'
import { CalendarIcon } from '@chakra-ui/icons'
import { FaCalculator, FaThList } from 'react-icons/fa'
import { IoLogOut } from 'react-icons/io5'

const Sidebar = () => {
    const auth = useAuth()
    const links: SidebarLinks[] = [
        {
            title: 'Frontpage',
            url: '/dashboard/frontpage',
            active: false,
            icon: <MdDashboard />
        },
        {
            title: 'Calendar',
            url: '/dashboard/calendar',
            active: false,
            icon: <CalendarIcon />
        },
        {
            title: 'List',
            url: '/dashboard/list',
            active: false,
            icon: <FaThList />
        },
        {
            title: 'Calculator',
            url: '/dashboard/calculator',
            active: false,
            icon: <FaCalculator />
        },
        {
            divider: true
        }
    ]

    const [displayName, setDisplayName] = React.useState<any>('')
    const [photoURL, setPhotoURL] = React.useState<any>('')

    React.useEffect(() => {
        setDisplayName(auth.currentUser?.displayName)
        setPhotoURL(auth.currentUser?.photoURL)
    }, [auth.currentUser])

    return (
        <div className="sidebar">
            <div className="sidebar-inner">
                {photoURL && displayName ? (
                    <Link to="/dashboard/profile">
                        <Flex
                            alignItems="center"
                            flexDirection="column"
                            className="sidebar-top"
                        >
                            <Avatar
                                name={displayName}
                                src={photoURL}
                                size="xl"
                            />
                            <Text
                                mt={4}
                                fontSize="24px"
                                fontWeight="700"
                            >
                                {auth.currentUser?.displayName}
                            </Text>
                        </Flex>
                    </Link>
                ) : <></>}
                <div className="sidebar-content">
                    {links.map((row: SidebarLinks, i: number) => {
                        if (row.divider) {
                            return <Divider
                                my={4}
                                key={i}
                            />
                        } else {
                            return (
                                <NavLink
                                    to={row.url}
                                    key={i}
                                >
                                    <Text className="sidebar-navlink">
                                        {row.icon}
                                        {row.title}
                                    </Text>
                                </NavLink>
                            )
                        }
                    })}
                    <NavLink
                        to="/"
                        onClick={() => auth.signOut()}
                    >
                        <Text className="sidebar-navlink">
                            <IoLogOut style={{ fontSize: '28px' }} />
                            Logout
                        </Text>
                    </NavLink>
                </div>
            </div>
        </div>
    )
}

export default Sidebar