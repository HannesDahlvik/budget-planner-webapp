import React from 'react'
import './Public.scss'

// Components
import Navbar from '../../components/Public/Navbar/Navbar';
import Footer from '../../components/Public/Footer/Footer';
import { useLocation } from '@reach/router';

const Public = (props: any) => {
    const location = useLocation()

    return (
        <div className="root">
            <Navbar isSmall={true} />

            <div className={`public-page ${location.pathname !== '/' ? 'wrapper' : ''}`}>
                {props.children}
            </div>

            <Footer />
        </div>
    )
}

export default Public