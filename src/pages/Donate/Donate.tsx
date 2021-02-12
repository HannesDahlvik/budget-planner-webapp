import React from 'react'

// Chakra UI
import { Box, Flex, Heading } from '@chakra-ui/react'

const Donate = (props: any) => {
    return (
        <Flex width="full" align="center" justifyContent="center">
            <Box p={8} maxWidth="600px" className="w-100" borderWidth={1} borderRadius={8} boxShadow="lg">
                <Box textAlign="center">
                    <Heading mb={10}>Donate</Heading>
                    <form action="https://www.paypal.com/donate" method="post" target="_top">
                        <input type="hidden" name="business" value="hannes.dahlvik@gmail.com" />
                        <input type="hidden" name="currency_code" value="EUR" />
                        <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_donate_LG.gif" name="submit" title="PayPal - The safer, easier way to pay online!" alt="Donate with PayPal button" />
                    </form>
                </Box>
            </Box>
        </Flex>
    )
}

export default Donate