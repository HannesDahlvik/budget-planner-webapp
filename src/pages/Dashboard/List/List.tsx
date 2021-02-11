import React from 'react'
import { useAuth, useFirestore } from 'reactfire'
import store from '../../../redux/store'

// Components
import Loader from '../../../components/Loader/Loader'

// Chakra UI
import { Box, CloseButton, Tab, Table, TabList, TabPanel, TabPanels, Tabs, Tbody, Td, Text, Th, Thead, Tr } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon, EditIcon } from '@chakra-ui/icons'

import { toast } from 'react-toastify'

// Utils
import ErrorHandler from '../../../utils/ErrorHandler'
import checkNumber from '../../../utils/checkNumber'
import CurrencyFormatter from '../../../utils/CurrencyFormatter'
import getPaymentsAndSubscriptionsData from '../../../utils/getPaymentsAndSubscriptionsData'
import { format } from 'date-fns'
import EditDataModal from '../../../components/Dashboard/EditDataModal/EditDataModal'



const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]

const List = (props: any) => {
    const [allData, setAllData] = React.useState<any>()

    const [paymentsData, setPaymentsData] = React.useState<any>(null)
    const [subscriptionsData, setSubscriptionsData] = React.useState<any>(null)

    const [selectedMonth, setSelectedMonth] = React.useState<any>()
    const [selectedYear, setSelectedYear] = React.useState<any>()

    React.useEffect(() => {
        const d = new Date()
        setSelectedMonth(checkNumber(d.getMonth()))
        setSelectedYear(d.getFullYear())
        getData()
        store.subscribe(() => {
            if (store.getState().productChange.value) {
                getData()
                store.dispatch({ type: 'productChange', newState: false })
            }

            if (!store.getState().editDataModal.value) {
                getData()
            }
        })
    }, [])

    React.useEffect(() => {
        if (selectedMonth) {
            updateData()
        }
    }, [selectedMonth, selectedYear, allData])

    const getData = () => {
        setAllData([])
        getPaymentsAndSubscriptionsData()
            .then((data: any) => {
                setAllData(data)
            })
            .catch(err => new ErrorHandler(err.message))
    }

    const prevMonth = async () => {
        let selectedMonthInstance: any = selectedMonth
        let selectedYearInstance: any = selectedYear

        if (selectedMonth > 0) {
            selectedMonthInstance = selectedMonth - 1
        } else {
            selectedMonthInstance = 11
            selectedYearInstance--
        }
        await setSelectedMonth(checkNumber(selectedMonthInstance))
        await setSelectedYear(selectedYearInstance)
    }

    const nextMonth = async () => {
        let selectedMonthInstance: any = selectedMonth
        let selectedYearInstance: any = selectedYear

        if (selectedMonth < 11) {
            selectedMonthInstance++
        } else {
            selectedMonthInstance = 0
            selectedYearInstance++
        }
        await setSelectedMonth(checkNumber(selectedMonthInstance))
        await setSelectedYear(selectedYearInstance)
    }

    const resetDate = async () => {
        const d = new Date()
        await setSelectedMonth(checkNumber(d.getMonth()))
        await setSelectedYear(d.getFullYear())
    }

    const updateData = () => {
        const paymentsData: any = []
        const subscriptionsData: any = []
        allData.map((row: any) => {
            if (row.type === 'subscriptions') {
                if (row.year === selectedYear) {
                    subscriptionsData.push(row)
                }
            }
            if (row.type === 'payments') {
                let date = row.date.split('-')
                date = `${date[1]}/${date[0]}`
                const checkDate = `${checkNumber(Number(selectedMonth) + 1)}/${selectedYear}`
                if (checkDate === date) {
                    if (row.type === 'payments') paymentsData.push(row)
                    else subscriptionsData.push(row)
                }
            }
        })

        paymentsData.sort((a: any, b: any) => {
            const aDate: any = new Date(a.date)
            const bDate: any = new Date(b.date)
            return aDate - bDate
        })
        subscriptionsData.sort((a: any, b: any) => {
            const aDate: any = new Date(a.date)
            const bDate: any = new Date(b.date)
            return aDate - bDate
        })

        setPaymentsData(paymentsData)
        setSubscriptionsData(subscriptionsData)
    }

    return (
        <>
            <div className="month-changer px4 py2">
                <ChevronLeftIcon onClick={() => prevMonth()} />
                <p style={{ cursor: 'pointer' }} onClick={resetDate}>{months[Number(selectedMonth)]}, {selectedYear}</p>
                <ChevronRightIcon onClick={() => nextMonth()} />
            </div>
            <Tabs className="dashboard-list" isFitted variant="enclosed">
                <TabList mb="1em">
                    <Tab
                        _focus={{ borderColor: 'transparent' }}
                    >Payments</Tab>
                    <Tab
                        _focus={{ borderColor: 'transparent' }}
                    >Subscriptions</Tab>
                </TabList>
                <TabPanels>
                    <TabPanel padding={0}>
                        <PaymentsList data={paymentsData} />
                    </TabPanel>
                    <TabPanel padding={0}>
                        <SubscriptionsList data={subscriptionsData} />
                    </TabPanel>
                </TabPanels>
            </Tabs>
        </>
    )
}

export default List

const PaymentsList = (props: any) => {
    const auth = useAuth()
    const firestore = useFirestore()

    const [showEditDataModal, setShowEditDataModal] = React.useState(false)
    const [editDataModalData, setEditDataModalData] = React.useState<any>()

    React.useEffect(() => {
        store.subscribe(() => {
            setShowEditDataModal(store.getState().editDataModal.value)
        })
    }, [])

    const removeFromList = async (id: any, type: any) => {
        await firestore.collection('financial_data').doc(auth.currentUser?.uid).collection(type).doc(id).delete()
            .then(() => {
                toast.success('Payment successfully deleted!')
                store.dispatch({ type: 'productChange', newState: true })
            })
            .catch((err: Error) => new ErrorHandler(err.message))
    }

    const editData = (data: any) => {
        setEditDataModalData(data)
        store.dispatch({ type: 'setOpenEditDataModal', newVal: true })
        setShowEditDataModal(true)
    }

    if (props.data) {
        if (props.data.length > 0) {
            return (
                <>
                    {showEditDataModal ? (
                        <EditDataModal data={editDataModalData} isOpen={showEditDataModal} />
                    ) : <></>}

                    <Table
                        variant="simple"
                        size="sm"
                    >
                        <Thead>
                            <Tr>
                                <Th>Edit</Th>
                                <Th>Title</Th>
                                <Th>Date</Th>
                                <Th>Amount</Th>
                                <Th>Remove</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {props.data.map((row: any, i: number) => (
                                <Tr key={i}>
                                    <Td
                                        onClick={() => editData(row)}
                                        pl={30}
                                    >
                                        <EditIcon style={{ cursor: 'pointer' }} />
                                    </Td>
                                    <Td>{row.title}</Td>
                                    <Td>{format(new Date(row.date), 'dd/MM/yyyy')}</Td>
                                    <Td>{CurrencyFormatter(row.amount)}</Td>
                                    <Td
                                        onClick={() => removeFromList(row.id, row.type)}
                                        pl={30}
                                    ><CloseButton /></Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </>
            )
        } else {
            return (
                <Box p={6} display="flex" justifyContent="center" alignItems="center" className="h-100">
                    <Text fontSize="4xl">No payments found.</Text>
                </Box>
            )
        }
    } else {
        return <Loader />
    }
}

const SubscriptionsList = (props: any) => {
    const auth = useAuth()
    const firestore = useFirestore()

    const [showEditDataModal, setShowEditDataModal] = React.useState(false)
    const [editDataModalData, setEditDataModalData] = React.useState<any>()

    React.useEffect(() => {
        store.subscribe(() => {
            setShowEditDataModal(store.getState().editDataModal.value)
        })
    }, [])

    const removeFromList = async (id: any, type: any) => {
        await firestore.collection('financial_data').doc(auth.currentUser?.uid).collection(type).doc(id).delete()
            .then(() => {
                toast.success('Payment successfully deleted!')
                store.dispatch({ type: 'productChange', newState: true })
            })
            .catch((err: Error) => new ErrorHandler(err.message))
    }

    const editData = (data: any) => {
        setEditDataModalData(data)
        store.dispatch({ type: 'setOpenEditDataModal', newVal: true })
        setShowEditDataModal(true)
    }

    if (props.data) {
        if (props.data.length > 0) {
            return (
                <>
                    {showEditDataModal ? (
                        <EditDataModal data={editDataModalData} isOpen={showEditDataModal} />
                    ) : <></>}

                    <Table
                        variant="simple"
                        size="sm"
                    >
                        <Thead>
                            <Tr>
                                <Th>Edit</Th>
                                <Th>Title</Th>
                                <Th>Recurrences</Th>
                                <Th>Amount</Th>
                                <Th>Remove</Th>
                            </Tr>
                        </Thead>
                        <Tbody>
                            {props.data.map((row: any, i: number) => (
                                <Tr key={i}>
                                    <Td
                                        onClick={() => editData(row)}
                                        pl={30}
                                    >
                                        <EditIcon style={{ cursor: 'pointer' }} />
                                    </Td>
                                    <Td>{row.title}</Td>
                                    <Td>{row.recurrences}</Td>
                                    <Td>{CurrencyFormatter(row.amount)}</Td>
                                    <Td
                                        onClick={() => removeFromList(row.id, row.type)}
                                        pl={30}
                                    >
                                        <CloseButton />
                                    </Td>
                                </Tr>
                            ))}
                        </Tbody>
                    </Table>
                </>
            )
        } else {
            return (
                <Box p={6} display="flex" justifyContent="center" alignItems="center" className="h-100">
                    <Text fontSize="4xl">No subscriptions found.</Text>
                </Box>
            )
        }
    } else {
        return <Loader />
    }
}