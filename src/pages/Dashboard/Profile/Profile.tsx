import React from 'react'

// Firebase
import { useAuth, useDatabase, useFirestore, useStorage } from 'reactfire'
import firebase from 'firebase'

// CSS
import 'react-image-crop/dist/ReactCrop.css';
import './Profile.scss'
import { useNavigate } from '@reach/router';


import Chart from 'react-apexcharts'

// Chakra UI
import { Box, Button, FormControl, FormLabel, Grid, Image, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import { MdClose, MdEdit } from 'react-icons/md'

// Components
import PFPChanger from '../../../components/Dashboard/PFPChanger/PFPChanger';

// Utils
import _ from 'lodash'
import getPaymentsAndSubscriptionsData from '../../../utils/getPaymentsAndSubscriptionsData';
import store from '../../../redux/store';
import ErrorHandler from '../../../utils/ErrorHandler'
import { ApexOptions } from 'apexcharts';

const Profile = (props: any) => {
    const auth = useAuth()
    const database = useDatabase()

    const [currencies, setCurrencies] = React.useState<any>([
        {
            value: 'EUR',
            label: '€',
        },
        {
            value: 'CAD',
            label: '$'
        },
        {
            value: 'HKD',
            label: '$'
        },
        {
            value: 'ISK',
            label: 'kr'
        },
        {
            value: 'PHP',
            label: '₱'
        },
        {
            value: 'DKK',
            label: 'Kr.'
        },
        {
            value: 'HUF',
            label: 'Ft'
        },
        {
            value: 'CZK',
            label: 'Kč'
        },
        {
            value: 'AUD',
            label: 'A$'
        },
        {
            value: 'RON',
            label: 'lei'
        },
        {
            value: 'SEK',
            label: 'kr'
        },
        {
            value: 'IDR',
            label: 'Rp'
        },
        {
            value: 'INR',
            label: '₹'
        },
        {
            value: 'BRL',
            label: 'R$'
        },
        {
            value: 'RUB',
            label: '₽'
        },
        {
            value: 'HRK',
            label: 'kn'
        },
        {
            value: 'JPY',
            label: '¥',
        },
        {
            value: 'THB',
            label: '฿'
        },
        {
            value: 'CHF',
            label: 'CHf'
        },
        {
            value: 'SGD',
            label: 'S$'
        },
        {
            value: 'PLN',
            label: 'zł'
        },
        {
            value: 'BGN',
            label: 'Лв'
        },
        {
            value: 'TRY',
            label: '₺'
        },
        {
            value: 'CNY',
            label: '¥'
        },
        {
            value: 'NOK',
            label: 'kr'
        },
        {
            value: 'NZD',
            label: '$'
        },
        {
            value: 'ZAR',
            label: 'R'
        },
        {
            value: 'USD',
            label: '$',
        },
        {
            value: 'MXN',
            label: '$'
        },
        {
            value: 'ILS',
            label: '₪'
        },
        {
            value: 'GBP',
            label: '£'
        },
        {
            value: 'KRW',
            label: '₩'
        },
        {
            value: 'MYR',
            label: 'RM'
        }
    ])
    const [currency, setCurrency] = React.useState<any>(['EUR', '€'])
    const [dateFormat, setDateFormat] = React.useState<any>('dd/MM/yyyy')
    const [dateFormats, setDateFormats] = React.useState<any>(["dd/MM/yyyy", "MM/dd/yyyy"])
    const [showChangeUsername, setShowChangeUsername] = React.useState(false)
    const [showAvatarEditButton, setShowAvatarEditButton] = React.useState(false)
    const [showChangeAvatarModal, setShowChangeAvatarModal] = React.useState(false)
    const [username, setUsername] = React.useState<any>('')

    const [deletingUser, setDeletingUser] = React.useState(false)

    const [displayName, setDisplayName] = React.useState<any>(auth.currentUser?.displayName)
    const [avatarUrl, setAvatarUrl] = React.useState<any>()

    const [chartOptions, setChartOptions] = React.useState<ApexOptions>()
    const [chartSeries, setChartSeries] = React.useState<ApexAxisChartSeries>()

    const [renderChart, setRenderChart] = React.useState(false)

    React.useEffect(() => {
        setAvatarUrl(auth.currentUser?.photoURL)
    }, [auth.currentUser?.photoURL])

    React.useEffect(() => {
        initChart()
        setAvatarUrl(auth.currentUser?.photoURL)
        store.subscribe(() => {
            setShowChangeAvatarModal(store.getState().pfpChanger.value)
        })
    }, [])

    const initChart = () => {
        getPaymentsAndSubscriptionsData()
            .then((data: any) => {
                let tempData: any = []
                const labels: any = []
                const series: any = []
                data.map((row: any, i: number) => {
                    if (row.type === 'payments') {
                        if (!tempData[i % tempData.length]) {
                            tempData.push({
                                title: row.title,
                                amount: row.amount
                            })
                        } else if (!tempData[i]) {
                            tempData[i] = {
                                title: row.title,
                                amount: row.amount
                            }
                        }
                    }
                })

                tempData.sort((a: any, b: any) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
                const groupAndMap = (items: any, itemKey: any, childKey: any) => {
                    return _.map(_.groupBy(items, itemKey), (obj, key) => ({
                        [itemKey]: key,
                        [childKey]: obj
                    }))
                }

                let epicData: any = groupAndMap(tempData, 'title', 'amount')
                epicData.map((row: any) => {
                    let rowAmount = 0
                    row.amount.map((amount: any) => rowAmount += amount.amount)
                    row.amount = Number(rowAmount.toFixed(2))
                })
                epicData = epicData.sort((a: any, b: any) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0)).slice(0, 5)
                    .map((row: any) => {
                        labels.push(row.title)
                        series.push(Math.abs(row.amount))
                    })

                const theme = localStorage.getItem('theme')

                setChartOptions({
                    chart: {
                        height: 300
                    },
                    stroke: {
                        width: 1.5,
                        colors: theme === 'light' ? ['#eee'] : ['#333']
                    },
                    labels: labels,
                    legend: {
                        show: true,
                        position: 'bottom',
                        labels: {
                            colors: theme === 'light' ? ['#333'] : ['#fff']
                        }
                    }
                })

                setChartSeries(series)
                setRenderChart(true)
            })
            .catch((err: Error) => new ErrorHandler(err.message))
    }

    const changeDisplayName = (e: Event) => {
        e.preventDefault()
        auth.currentUser?.updateProfile({
            displayName: username
        })
        setDisplayName(username)
        setShowChangeUsername(false)
    }

    const submitSettingsChange = async (e: any, type: string) => {
        e.preventDefault()

        const ref = database.ref(`${auth.currentUser?.uid}/settings`)
        switch (type) {
            case 'currency': {
                let currency = (e.target.value).split('-')
                setCurrency([currency[0], currency[1]])
                ref.update({ currency: currency })
                break
            }
            case 'date': {
                setDateFormat(e.target.value)
                ref.update({ dateFormat: e.target.value })
                break
            }
            default:
                break
        }

        const settingsForLocalstorage = {
            currency: currency,
            dateFormat: dateFormat
        }
        localStorage.setItem('settings', JSON.stringify(settingsForLocalstorage))
    }

    return (
        <>
            {showChangeAvatarModal ? (
                <PFPChanger isOpen={showChangeAvatarModal} />
            ) : <></>}

            {deletingUser ? (
                <DeletingUserModal isOpen={deletingUser} />
            ) : <></>}

            <div className="dashboard-profile h-100">
                <Grid templateColumns="1fr" p={6} className="h-100 dashboard-column">
                    <Box borderWidth="1px" rounded="lg" overflow="hidden" className="w-100">
                        <div className="avatar-wrapper w-100">
                            <Image
                                src={avatarUrl ? avatarUrl : 'http://via.placeholder.com/300'}
                                borderRadius="50%"
                                w="100%"
                                onMouseEnter={() => setShowAvatarEditButton(true)}
                                onMouseLeave={() => setShowAvatarEditButton(false)}
                                alt="Avatar"
                            />
                            {showAvatarEditButton ? (
                                <div
                                    onClick={() => setShowChangeAvatarModal(true)}
                                    onMouseEnter={() => setShowAvatarEditButton(true)}
                                    onMouseLeave={() => setShowAvatarEditButton(false)}
                                    className="avatar-edit-button"
                                >
                                    <Box as={MdEdit} size="48px"></Box>
                                </div>
                            ) : (
                                    <></>
                                )}
                        </div>

                        <div className="h-100 changer-wrapper">
                            {showChangeUsername ? (
                                <>
                                    <form onSubmit={(e: any) => changeDisplayName(e)}>
                                        <Box display="flex" justifyContent="center" alignItems="center">
                                            <Button variant="solid" colorScheme="red" onClick={() => setShowChangeUsername(false)}><Box as={MdClose} fontSize="32px"></Box></Button>
                                            <Input defaultValue={displayName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} className="mx1" />
                                            <Button variant="solid" colorScheme="blue" onClick={(e: any) => changeDisplayName(e)}><Box as={MdEdit} fontSize="32px"></Box></Button>
                                        </Box>
                                    </form>
                                </>
                            ) : (
                                    <Box display="flex" justifyContent="center" alignItems="center">
                                        <Text fontSize="24px">{displayName}</Text>
                                        <Box onClick={() => setShowChangeUsername(true)} as={MdEdit} className="ml1" fontSize="24px" cursor="pointer"></Box>
                                    </Box>
                                )}
                        </div>
                    </Box>
                </Grid>
                <Grid templateColumns="1fr" templateRows="1fr 1fr" p={6} gap={5} className="h-100 dashboard-column">
                    <Box borderWidth="1px" rounded="lg" overflow="hidden" className="w-100">
                        <Box p={4} className="h-100" display="flex" flexDirection="column" justifyContent="space-between">
                            <Box>
                                <FormControl className="my2">
                                    {currency ? (
                                        <>
                                            <FormLabel htmlFor="currency">Currency</FormLabel>
                                            <Select id="currency" value={`${currency[0]}-${currency[1]}`} onChange={(e) => submitSettingsChange(e, 'currency')}>
                                                {currencies.map((row: any, i: number) => (<option key={i} value={`${row.value}-${row.label}`}>{row.value}, {row.label}</option>))}
                                            </Select>
                                        </>
                                    ) : (<></>)}
                                </FormControl>

                                <FormControl className="my2">
                                    {dateFormat ? (
                                        <>
                                            <FormLabel htmlFor="date-format">Date format</FormLabel>
                                            <Select id="date-format" value={dateFormat} onChange={(e) => submitSettingsChange(e, 'date')}>
                                                {dateFormats.map((row: any, i: number) => (<option key={i}>{row}</option>))}
                                            </Select>
                                        </>
                                    ) : (<></>)}
                                </FormControl>
                            </Box>
                            <Button
                                width="100%"
                                colorScheme="blue"
                                style={{ marginTop: 'auto' }}
                                onClick={() => {
                                    if (deletingUser === true) setDeletingUser(false)
                                    else setDeletingUser(true)
                                }}
                            >
                                Delete user
                                </Button>
                        </Box>
                    </Box>
                    <Box borderWidth="1px" rounded="lg" overflow="hidden" className="w-100" display="flex" justifyContent="center" alignItems="center">
                        <Box p={4}>
                            {renderChart ? (
                                <Chart
                                    height="350px"
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="pie"
                                />
                            ) : (<Skeleton height="350px" />)}
                        </Box>
                    </Box>
                </Grid>
            </div>
        </>
    )
}

export default Profile

const DeletingUserModal = React.memo((props: any) => {
    const auth = useAuth()
    const firestore = useFirestore()
    const database = useDatabase()
    const navigate = useNavigate()

    const [password, setPassword] = React.useState('')

    const [showInsertPassword, setShowInsertPassword] = React.useState(false)

    const [deletingUser, setDeletingUser] = React.useState(false)
    const [showSureButton1, setShowSureButton1] = React.useState(true)
    const [showSureButton2, setShowSureButton2] = React.useState(false)
    const [showSureButton3, setShowSureButton3] = React.useState(false)
    const [showSureButton4, setShowSureButton4] = React.useState(false)

    React.useEffect(() => {
        setDeletingUser(props.isOpen)
    }, [props.isOpen])

    const deleteUser = () => {
        if (auth.currentUser) {
            auth.currentUser.delete()
                .then(() => {
                    firestore.collection('financial_data').doc(auth.currentUser?.uid).delete()
                        .catch((err: Error) => new ErrorHandler(err.message))
                    database.ref(auth.currentUser?.uid).remove()
                        .then(() => {
                            navigate('/')
                        })
                        .catch((err: Error) => new ErrorHandler(err.message))
                })
                .catch((err: Error) => {
                    new ErrorHandler(err.message)
                    setShowSureButton4(true)
                    setShowInsertPassword(true)
                })
        }
    }

    const actuallyDeleteUser = () => {
        const email: any = auth.currentUser?.email
        const credential = firebase.auth.EmailAuthProvider.credential(email, password)
        auth.currentUser?.reauthenticateWithCredential(credential)
            .then(() => {
                firestore.collection('financial_data').doc(auth.currentUser?.uid).delete()
                    .catch((err: Error) => new ErrorHandler(err.message))
                database.ref(auth.currentUser?.uid).remove()
                    .then(() => {
                        navigate('/')
                    })
                    .catch((err: Error) => new ErrorHandler(err.message))
            })
            .catch((err: Error) => new ErrorHandler(err.message))
    }

    return (
        <Modal
            isOpen={deletingUser}
            onClose={() => setDeletingUser(false)}
            isCentered
        >
            <ModalOverlay />
            <ModalContent textAlign="center">
                <ModalHeader>Delete user?</ModalHeader>
                <ModalCloseButton onClick={() => setDeletingUser(false)} />
                <ModalBody p={10}>
                    {showInsertPassword ? (
                        <>
                            <Input
                                placeholder="Insert current user password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                mb={6}
                            />
                        </>
                    ) : <></>}

                    <Button mr={3} onClick={() => setDeletingUser(false)}>Cancel</Button>
                    {showSureButton1
                        ? <Button onClick={() => {
                            setShowSureButton1(false)
                            setShowSureButton2(true)
                        }} colorScheme="red">Are you sure?</Button>
                        : <></>
                    }
                    {showSureButton2
                        ? <Button onClick={() => {
                            setShowSureButton2(false)
                            setShowSureButton3(true)
                        }} colorScheme="red">Are you like sure sure?</Button>
                        : <></>
                    }
                    {showSureButton3
                        ? <Button onClick={() => deleteUser()} colorScheme="red">Alight click me then.</Button>
                        : <></>
                    }
                    {showSureButton4
                        ? <Button onClick={() => actuallyDeleteUser()}>CLICK MEEE!!!</Button>
                        : <></>
                    }
                </ModalBody>
            </ModalContent>
        </Modal>
    )
})