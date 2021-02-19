import React from 'react'
import './Home.scss'

// Routing
import { Link } from "@reach/router"
import { Heading, Link as ALink } from '@chakra-ui/react'

// Chakra UI
import { Button, Text } from '@chakra-ui/react'

const Home = (props: any) => {
    return (
        <>
            <div className="home">
                <div className="home-header">
                    <Heading as="h2" fontSize="6xl" mb={4}>Our goal is to make you save money</Heading>
                    <Text fontSize="2xl">Made by <ALink href="https://hannesdahlvik.fi/" target="_blank" color="teal.500">Hannes Dahlvik</ALink></Text>
                    <div className="home-header-buttons">
                        <Link to="/dashboard"><Button size="lg" colorScheme="blue">DASHBOARD</Button></Link>
                        <Link to="/donate"><Button size="lg" colorScheme="blue">DONATE</Button></Link>
                    </div>
                </div>
            </div>

            <div style={{ height: '25vh' }} className="page-section about-section" id="about">
                <Text fontSize="4xl" fontWeight="700" mb={3}>About</Text>
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