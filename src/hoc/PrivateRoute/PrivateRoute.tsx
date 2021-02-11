import React from 'react'

// Router
import { Redirect, useLocation } from '@reach/router'

// Firebase
import { useAuth } from 'reactfire'

const PrivateRoute = (props: any) => {
    const location = useLocation()
    const auth = useAuth()
    let { as: Comp } = props;

    return auth.currentUser
        ? <Comp {...props} />
        : <Redirect from={location.pathname} to="/login" noThrow />
}

export default PrivateRoute