import React from 'react'
import 'react-image-crop/dist/ReactCrop.css';
import './Profile.scss'
import { useAuth, useDatabase, useStorage } from 'reactfire'

import _ from 'lodash'

import Chart from 'react-apexcharts'

// Chakra UI
import { Box, Button, FormControl, FormLabel, Grid, Image, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, ModalOverlay, Select, Skeleton, Spinner, Text, useDisclosure } from '@chakra-ui/react'
import { MdClose, MdEdit } from 'react-icons/md'
import ErrorHandler from '../../../utils/ErrorHandler'
import { toast } from 'react-toastify';
import PFPChanger from '../../../components/Dashboard/PFPChanger/PFPChanger';
import store from '../../../redux/store';
import Loader from '../../../components/Loader/Loader';
import { ApexOptions } from 'apexcharts';
import getPaymentsAndSubscriptionsData from '../../../utils/getPaymentsAndSubscriptionsData';

const Profile = (props: any) => {
    const auth = useAuth()
    const database = useDatabase()
    const storage = useStorage()

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

    if (avatarUrl) {
        return (
            <>
                {showChangeAvatarModal ? (
                    <PFPChanger isOpen={showChangeAvatarModal} />
                ) : (<></>)}

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
                            <Box p={4}>
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
    } else {
        return <Loader />
    }
}

export default Profile