import firebase from 'firebase'
import { FinancialData } from '../types'
import ErrorHandler from './ErrorHandler'

const getPaymentsAndSubscriptionsData = async () => {
    const data: FinancialData[] = []
    await firebase.firestore().collection('financial_data').doc(firebase.auth().currentUser?.uid).collection('payments').get()
        .then((res) => {
            res.forEach((doc) => {
                let obj: any = doc.data()
                obj.id = doc.id
                obj.type = 'payments'
                data.push(obj)
            })
        })
        .catch(err => new ErrorHandler(err.message))
    await firebase.firestore().collection('financial_data').doc(firebase.auth().currentUser?.uid).collection('subscriptions').get()
        .then((res) => {
            res.forEach((doc) => {
                let obj: any = doc.data()
                obj.id = doc.id
                obj.type = 'subscriptions'
                data.push(obj)
            })
        })
        .catch(err => new ErrorHandler(err.message))
    return data
}

export default getPaymentsAndSubscriptionsData