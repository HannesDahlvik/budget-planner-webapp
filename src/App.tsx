import React from 'react'

// Routing
import {
    BrowserRouter, Route, Switch
} from 'react-router-dom'
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
            <BrowserRouter>
                <Switch>
                    <Route path={ROUTES.LOG_IN} component={Login} exact />
                    <Route path={ROUTES.SIGN_UP} component={Signup} exact />
                    <Route path={ROUTES.PUBLIC} component={Public} exact />
                    <PrivateRoute path={ROUTES.DASHBOARD}><Dashboard /></PrivateRoute>
                    {/* <Route path={ROUTES.PASSWORD_FORGET} component={ForgotPassword} exact /> */}
                    <Route path="*" component={NoMatch} />
                </Switch>
            </BrowserRouter>
        )
    } else {
        return <Loader />
    }
}

export default App