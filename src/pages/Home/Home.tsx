import React from 'react'
import { Link } from 'react-router-dom'
import './Home.scss'

// Chakra UI
import { Button, Stack, Text } from '@chakra-ui/react'

import * as ROUTES from '../../constants/routes'

// Components
import Navbar from '../../components/Public/Navbar/Navbar'

const Home = () => {
    return (
        <>
            <div className="home">
                <div className="section">
                    <div className="skewed"></div>
                    <div className="home-header">
                        <Text fontSize="5xl" fontWeight="700" as="h3">Our mission is to make you SAVE big money</Text>
                        <Text variant="subtitle1">Made by <a href="http://hannesdahlvik.fi" rel="noreferrer" target="_blank">Hannes Dahlvik</a></Text>
                        <div className="home-header-buttons">
                            <Link to="/dashboard"><Button colorScheme="teal">DASHBOARD</Button></Link>
                            <Button colorScheme="teal">DONATE</Button>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ height: '25vh' }} className="page-section" id="about">
                <Text fontSize="4xl" mb={3}>About</Text>
                <Text style={{ width: '500px', textAlign: 'center' }}>Budget planner is a tool for anybody who wants know how much money they use monthly and yearly</Text>
            </div>
            <div style={{ height: '50vh' }} className="page-section" id="how-it-works">
                <Text fontSize="4xl">How it works</Text>
                <Text>Coming soon...</Text>
            </div>
        </>
    )
}

export default Home