import React from 'react'
import './Loader.scss'

// Chakra UI
import { Spinner } from '@chakra-ui/react'

const Loader = () => {
    return (
        <div className="loader-wrapper">
            <Spinner
                size="xl"
                color="blue.500"
            />
        </div>
    )
}

export default Loader