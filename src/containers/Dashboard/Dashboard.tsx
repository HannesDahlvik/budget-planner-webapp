import React from 'react'
import { useAuth, useDatabase } from 'reactfire'
import './Dashboard.scss'

// Router
import { Link } from '@reach/router'
import NavLink from '../../components/NavLink/NavLink'

// Components
import Loader from '../../components/Loader/Loader'

// Chakra UI
import { Button, Divider, Grid, Text, useColorMode } from '@chakra-ui/react'

// Utils
import ErrorHandler from '../../utils/ErrorHandler'

const Dashboard = (props: any) => {
    const database = useDatabase()
    const auth = useAuth()
    const links = [
        {
            title: 'Frontpage',
            url: '/dashboard/frontpage',
            active: false
        },
        {
            title: 'Calendar',
            url: '/dashboard/calendar',
            active: false
        },
        {
            title: 'List',
            url: '/dashboard/list',
            active: false
        },
        {
            title: 'Calculator',
            url: '/dashboard/calculator',
            active: false
        },
        {
            divider: true
        },
        {
            title: 'Profile',
            url: '/dashboard/profile',
            active: false
        }
    ]
    const [settings, setSettings] = React.useState()
    const [readyToRender, setReadyToRender] = React.useState(false)

    React.useEffect(() => {
        database.ref(`${auth.currentUser?.uid}/settings`)
            .once('value', (res: firebase.default.database.DataSnapshot) => {
                localStorage.setItem('settings', JSON.stringify(res.val()))
                setSettings(res.val())
            })
            .catch((err: Error) => new ErrorHandler(err.message))
        fetch('https://api.exchangeratesapi.io/latest').then(res => res.json().then((data) => {
            localStorage.setItem('exchangerates', JSON.stringify(data.rates))
            setReadyToRender(true)
        }))
    }, [auth.currentUser?.uid, database])

    if (readyToRender) {
        return (
            <>
                <Grid className="dashboard-wrapper">
                    <div className="sidebar">
                        <div className="sidebar-top">
                            <Text
                                fontSize="24px"
                                fontWeight="700"
                            >
                                <Link to="/">
                                    {auth.currentUser?.displayName}
                                </Link>
                            </Text>
                        </div>
                        <div className="sidebar-content">
                            {links.map((row: any, i: number) => {
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
                                            {row.title}
                                        </NavLink>
                                    )
                                }
                            })}
                            <Link
                                to="/"
                                onClick={() => auth.signOut()}
                            >
                                Logout
                            </Link>
                        </div>
                        <div className="sidebar-bottom">
                            <ThemeToggler />
                        </div>
                    </div>
                    <div className="dashboard">
                        {props.children}
                    </div>
                </Grid>
            </>
        )
    } else {
        return <Loader />
    }
}

export default Dashboard

function ThemeToggler() {
    const { colorMode, toggleColorMode } = useColorMode();

    return (
        <Button size="sm" onClick={toggleColorMode}>
            Toggle {colorMode === "light" ? "Dark" : "Light"}
        </Button>
    )
}