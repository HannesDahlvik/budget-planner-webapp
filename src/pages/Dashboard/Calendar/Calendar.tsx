import React from 'react'
import './Calendar.scss'
import { useAuth, useFirestore } from 'reactfire'

// Types
import { CalendarData, FinancialData } from '../../../types'

// CSS
import 'react-big-calendar/lib/css/react-big-calendar.css'

import format from 'date-fns/format'
import parse from 'date-fns/parse'
import startOfWeek from 'date-fns/startOfWeek'
import getDay from 'date-fns/getDay'

// Utils
import ErrorHandler from '../../../utils/ErrorHandler'
import CurrencyFormatter from '../../../utils/CurrencyFormatter'
import checkNumber from '../../../utils/checkNumber'

// Components
import Loader from '../../../components/Loader/Loader'
import { Calendar, dateFnsLocalizer } from 'react-big-calendar'

const locales = {
    'en-US': require('date-fns/locale/en-US'),
}
const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
})

const CalendarPage = React.memo((props: any) => {
    const [events, setEvents] = React.useState<CalendarData[]>()
    const firestore = useFirestore()
    const auth = useAuth()

    const getPaymentsAndSubscriptionsData = async () => {
        const data: FinancialData[] = []
        await firestore.collection('financial_data').doc(auth.currentUser?.uid).collection('payments').get()
            .then((res: firebase.default.firestore.QuerySnapshot) => {
                res.forEach((doc: firebase.default.firestore.QueryDocumentSnapshot) => {
                    let obj: any = doc.data()
                    obj.id = doc.id
                    obj.type = 'payments'
                    data.push(obj)
                })
            })
            .catch((err: Error) => new ErrorHandler(err.message))
        await firestore.collection('financial_data').doc(auth.currentUser?.uid).collection('subscriptions').get()
            .then((res: firebase.default.firestore.QuerySnapshot) => {
                res.forEach((doc: firebase.default.firestore.QueryDocumentSnapshot) => {
                    let obj: any = doc.data()
                    obj.id = doc.id
                    obj.type = 'subscriptions'
                    data.push(obj)
                })
            })
            .catch((err: Error) => new ErrorHandler(err.message))
        return data
    }

    React.useEffect(() => {
        getPaymentsAndSubscriptionsData()
            .then((data: FinancialData[]) => {
                const calendarData: CalendarData[] = []
                data.map((row: any) => {
                    if (row.type === 'subscriptions') {
                        let subscriptions = Array.from({ length: 12 }).fill(0)
                        for (let i = 0; i < subscriptions.length; i++) {
                            if (i % (12 / row.recurrences) === 0) {
                                subscriptions[i] = Number(row.amount)
                            }
                        }
                        subscriptions.map((amount: number | any, i: number) => {
                            if (amount < 0) {
                                const dataObj: CalendarData = {
                                    title: `${row.title}, ${CurrencyFormatter(row.amount)}`,
                                    start: new Date(`${new Date().getFullYear()}-${checkNumber(i + 1)}-${1}`),
                                    end: new Date(`${new Date().getFullYear()}-${checkNumber(i + 1)}-${1}`)
                                }
                                calendarData.push(dataObj)
                            }
                        })
                    }

                    if (row.type !== 'subscriptions') {
                        const dataObj: CalendarData = {
                            title: `${row.title}, ${CurrencyFormatter(row.amount)}`,
                            start: new Date(row.date),
                            end: new Date(row.date)
                        }
                        calendarData.push(dataObj)
                    }
                })
                setEvents(calendarData)
            })
            .catch((err: Error) => new ErrorHandler(err.message))
    }, [])

    if (events) {
        return (
            <Calendar
                className="dashboard-calendar"
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
            />
        )
    } else {
        return <Loader />
    }
})

export default CalendarPage