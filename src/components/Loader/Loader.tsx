import React from 'react'
import './Loader.scss'

// Chakra UI
import { Spinner } from '@chakra-ui/react'

interface Props {
    isListLoader?: boolean
}

const Loader = (props: Props) => {
    return (
        <div className={`loader-wrapper ${props.isListLoader ? 'is-list-loader' : ''}`}>
            <Spinner
                size="xl"
                color="blue.500"
            />
        </div>
    )
}

export default Loader