import React from 'react'

// Routing
import { Redirect, Router } from "@reach/router"
import PrivateRoute from './hoc/PrivateRoute/PrivateRoute'
import * as ROUTES from './constants/routes';

// Firebase
import 'firebase/analytics'
import 'firebase/auth'
import { useAnalytics, useAuth } from 'reactfire'

// Containers
import Public from './containers/Public/Public'
import Dashboard from './containers/Dashboard/Dashboard'

// Global Pages
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';
import NoMatch from './hoc/NoMatch/NoMatch';

// Public Pages
import Home from './pages/Home/Home';
import Donate from './pages/Donate/Donate';

// Dashboard Pages
import Frontpage from './pages/Dashboard/Frontpage/Frontpage';
import CalendarPage from './pages/Dashboard/Calendar/Calendar';
import List from './pages/Dashboard/List/List';
import Profile from './pages/Dashboard/Profile/Profile';

// Components
import Loader from './components/Loader/Loader'
import ForgotPassword from './components/Public/ForgotPassword/ForgotPassword';

const App = () => {
    const auth = useAuth()
    const [readyToRender, setReadyToRender] = React.useState(false)

    useAnalytics()
    React.useEffect(() => {
        auth.onAuthStateChanged(() => setReadyToRender(true))
    }, [auth])

    if (readyToRender) {
        return (
            <Router>
                <NoMatch default isDashboard={false} />

                <Login path={ROUTES.LOG_IN} />
                <Signup path={ROUTES.SIGN_UP} />
                <ForgotPassword path={ROUTES.PASSWORD_FORGET} />

                <Public path={ROUTES.PUBLIC}>
                    <NoMatch default isDashboard={false} />
                    <Home path={ROUTES.PUBLIC} />
                    <Donate path={ROUTES.DONATE} />
                </Public>

                <Redirect from="/dashboard" to="/dashboard/frontpage" noThrow />
                <PrivateRoute as={Dashboard} path="/dashboard">
                    <NoMatch default isDashboard={true} />
                    <Frontpage path="frontpage" />
                    <CalendarPage path="calendar" />
                    <List path="list" />
                    <Profile path="profile" />
                </PrivateRoute>
            </Router>
        )
    } else {
        return <Loader />
    }
}

export default App