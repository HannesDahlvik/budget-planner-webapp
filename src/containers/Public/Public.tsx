import React from 'react'

// Router
import { BrowserRouter, Route, Switch } from 'react-router-dom'
import * as ROUTES from '../../constants/routes';

// Components
import Navbar from '../../components/Public/Navbar/Navbar';
import Footer from '../../components/Public/Footer/Footer';

// Pages
import Home from '../../pages/Home/Home';

const Public = () => {
    return (
        <>
            <Navbar />

            <Home />

            <Footer />
        </>
    )
}

export default Public