import React from 'react'

// Router
import { Redirect, Route } from 'react-router-dom'

// Firebase
import { useAuth } from 'reactfire'

const PrivateRoute = ({ children, ...rest }: any) => {
    const auth = useAuth()

    return (
        <Route
            {...rest}
            render={() =>
                auth.currentUser ? (
                    children
                ) : (
                        <Redirect
                            to={{
                                pathname: '/login'
                            }}
                        />
                    )
            }
        />
    )
}

export default PrivateRoute