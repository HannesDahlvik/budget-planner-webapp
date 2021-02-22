import React from 'react'
import { useAuth, useDatabase } from 'reactfire'
import './Dashboard.scss'

// Components
import Loader from '../../components/Loader/Loader'

// Chakra UI
import { Grid } from '@chakra-ui/react'

// Utils
import ErrorHandler from '../../utils/ErrorHandler'
import Sidebar from '../../components/Dashboard/Sidebar/Sidebar'

const Dashboard = (props: any) => {
    const database = useDatabase()
    const auth = useAuth()
    const [readyToRender, setReadyToRender] = React.useState(false)

    React.useEffect(() => {
        database.ref(`${auth.currentUser?.uid}/settings`)
            .once('value', (res: firebase.default.database.DataSnapshot) => {
                localStorage.setItem('settings', JSON.stringify(res.val()))
            })
            .catch((err: Error) => new ErrorHandler(err.message))
        fetch('https://api.exchangeratesapi.io/latest').then(res => res.json().then((data) => {
            localStorage.setItem('exchangerates', JSON.stringify(data.rates))
            setReadyToRender(true)
        }))
    }, [auth.currentUser?.uid, database])

    if (readyToRender) {
        return (
            <>
                <Grid
                    templateColumns="1fr 5fr"
                    className="dashboard-wrapper"
                >
                    <Sidebar />
                    <div className="dashboard">
                        {props.children}
                    </div>
                </Grid>
            </>
        )
    } else {
        return <Loader />
    }
}

export default Dashboard
