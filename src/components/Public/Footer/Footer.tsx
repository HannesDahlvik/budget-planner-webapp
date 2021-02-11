import React from 'react'
import './Footer.scss'

// Chakra UI
import { Button, Flex, Text } from '@chakra-ui/react'
import { Link } from '@reach/router'

const Footer = () => {
    return (
        <Flex
            as="footer"
            align="center"
            justify="space-around"
            id="contact"
            className="footer"
        >
            <Flex direction="column" w="360px">
                <Text fontSize="2xl" fontWeight="700" mb={3}>Footer</Text>
                <Text>Lorem ipsum dolor sit amet consectetur adipisicing elit. Ipsa eos vitae earum aperiam mollitia fuga, temporibus minus. Dolor aliquid ullam tenetur incidunt obcaecati voluptate autem.</Text>
            </Flex>
            <Flex>
                <Link to="/dashboard"><Button colorScheme="blue">Dashboard</Button></Link>
            </Flex>
        </Flex>
    )
}

export default Footer