import React from 'react'
import './NoMatch.scss'

// Router
import { Link, useLocation } from 'react-router-dom'

// Chakra UI
import { Button, Divider } from '@chakra-ui/react'

function NoMatch() {
    const location = useLocation()

    return (
        <div className="no-match-wrapper">
            <div className="center">
                <h1>404</h1>
                <h3>No match for <code>{location.pathname}</code></h3>
                <Divider mb={4} />
                <Link to="/"><Button size="lg" as="button" colorScheme="blue">HOME</Button></Link>
            </div>
        </div>
    )
}

export default NoMatch