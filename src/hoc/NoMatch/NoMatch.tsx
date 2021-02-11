import React from 'react'
import './NoMatch.scss'

// Router
import { Link, useLocation } from '@reach/router'

// Chakra UI
import { Button, Code, Divider } from '@chakra-ui/react'

interface Props {
    default?: any
    isDashboard?: boolean
}

function NoMatch(props: Props) {
    const location = useLocation()

    return (
        <div className={`no-match-wrapper ${!props.isDashboard ? 'no-match-wrapper-public' : ''}`}>
            <div className="center">
                <h1>404</h1>
                <h3>No match for <Code style={{ fontSize: '100%', margin: '10px 0' }}>{location.pathname}</Code></h3>
                <Divider mb={4} />
                {props.isDashboard ? (
                    <Link to="/dashboard/frontpage"><Button size="lg" as="button" colorScheme="blue">DASHBOARD</Button></Link>
                ) : (
                        <Link to="/"><Button size="lg" as="button" colorScheme="blue">HOME</Button></Link>
                    )}
            </div>
        </div>
    )
}

export default NoMatch