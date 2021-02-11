import React from 'react'

// Routing
import { Router, useNavigate } from "@reach/router"
import PrivateRoute from './hoc/PrivateRoute/PrivateRoute'
import * as ROUTES from './constants/routes';

// Firebase
import 'firebase/analytics'
import 'firebase/auth'
import { useAnalytics, useAuth } from 'reactfire'

// Containers
import Public from './containers/Public/Public'
import Dashboard from './containers/Dashboard/Dashboard'

// Pages
import Login from './pages/Login/Login';
import Signup from './pages/Signup/Signup';

import Home from './pages/Home/Home';
import Donate from './pages/Donate/Donate';

// Dashboard Pages
import Frontpage from './pages/Dashboard/Frontpage/Frontpage';
import Calendar from './pages/Dashboard/Calendar/Calendar'
import List from './pages/Dashboard/List/List';
import Profile from './pages/Dashboard/Profile/Profile';

// Components
import Loader from './components/Loader/Loader'
import NoMatch from './hoc/NoMatch/NoMatch';

const App = () => {
    const auth = useAuth()
    const [user, setUser]: any = React.useState<any>(null)
    const [readyToRender, setReadyToRender] = React.useState(false)

    useAnalytics()
    React.useEffect(() => {
        auth.onAuthStateChanged((state) => {
            if (state) setUser(state)
            else setUser(null)
            setReadyToRender(true)
        })
    }, [])

    if (readyToRender) {
        return (
            <Router>
                <NoMatch default isDashboard={false} />
                <Login path={ROUTES.LOG_IN} />
                <Signup path={ROUTES.SIGN_UP} />
                {/* <Route path={ROUTES.PASSWORD_FORGET} component={ForgotPassword} exact /> */}
                <Public path={ROUTES.PUBLIC}>
                    <NoMatch default isDashboard={false} />
                    <Home path="/" />
                    <Donate path="/donate" />
                </Public>
                <PrivateRoute as={Dashboard} path="/dashboard">
                    <NoMatch default isDashboard={true} />
                    <Frontpage path="frontpage" />
                    <Calendar path="calendar" />
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