import React from 'react'
import './OtherAuth.scss'

// Icons
import { FaGoogle } from 'react-icons/fa'

// Router
import { useHistory } from 'react-router-dom'

// Chakra UI
import { Button, Divider } from '@chakra-ui/react'

// Firebase
import { useAuth } from 'reactfire'
import firebase from 'firebase'

// Utils
import ErrorHandler from '../../utils/ErrorHandler'

function OtherAuth() {
    const auth = useAuth()
    const history = useHistory()

    async function doLoginWithGoogle() {
        const provider = new firebase.auth.GoogleAuthProvider()
        auth.signInWithPopup(provider)
            .then(() => history.push('/dashboard'))
            .catch((err) => new ErrorHandler(err.message))
    }

    return (
        <div className="other-auth-wrapper mt3">
            <div className="other-auth-divider">
                <Divider className="other-auth-divider-element" />
                <p>OR</p>
                <Divider className="other-auth-divider-element" />
            </div>

            <div className="other-auth mt3">
                <Button variant="solid" colorScheme="red" size="lg" onClick={() => doLoginWithGoogle()}>
                    <FaGoogle fontSize="32px" />
                </Button>
            </div>
        </div>
    )
}

export default OtherAuth