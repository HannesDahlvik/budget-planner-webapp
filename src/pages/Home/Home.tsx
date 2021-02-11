import React from 'react'
import './Home.scss'

import { Link } from "@reach/router"

// Chakra UI
import { Button, Text } from '@chakra-ui/react'

const Home = (props: any) => {
    return (
        <>
            <div className="home">
                <div className="section">
                    <div className="home-header">
                        <Text fontSize="5xl" fontWeight="700">Our mission is to make you save money</Text>
                        <Text variant="subtitle1">Made by <a href="http://hannesdahlvik.fi" rel="noreferrer" target="_blank">Hannes Dahlvik</a></Text>
                        <div className="home-header-buttons">
                            <Link to="/dashboard"><Button colorScheme="blue">DASHBOARD</Button></Link>
                            <Link to="/donate"><Button colorScheme="blue">DONATE</Button></Link>
                        </div>
                    </div>
                </div>
            </div>

            <div style={{ height: '25vh' }} className="page-section about-section" id="about">
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