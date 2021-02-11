import React from 'react'
import './Public.scss'

// Router
import * as ROUTES from '../../constants/routes';

// Components
import Navbar from '../../components/Public/Navbar/Navbar';
import Footer from '../../components/Public/Footer/Footer';

// Pages
import Home from '../../pages/Home/Home';
import Donate from '../../pages/Donate/Donate';

const Public = (props: any) => {
    return (
        <div className="root">
            <Navbar isSmall={true} />

            <div className="public-page wrapper">
                {props.children}
            </div>

            <Footer />
        </div>
    )
}

export default Public