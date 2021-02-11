import React from 'react'

import { Link, useLocation } from "@reach/router";

const NavLink = ({ partial = true, ...props }: any) => {
    const location = useLocation()

    return (
        <Link
            {...props}
            className={props.to === location.pathname ? 'active' : ''}
        />
    )
}

export default NavLink