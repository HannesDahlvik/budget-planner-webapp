import React from 'react'

// Types
import { FinancialData } from '../../../types';

// Router
import { Link } from '@reach/router';

// Firebase
import { useAuth, useDatabase } from 'reactfire'

// CSS
import 'react-image-crop/dist/ReactCrop.css';
import './Profile.scss'

import Chart from 'react-apexcharts'

// Chakra UI
import { Box, Button, FormControl, FormLabel, Grid, Image, Input, Select, Skeleton, Text } from '@chakra-ui/react'
import { MdClose, MdEdit } from 'react-icons/md'

// Components
import PFPChanger from '../../../components/Dashboard/PFPChanger/PFPChanger';

// Utils
import _ from 'lodash'
import getPaymentsAndSubscriptionsData from '../../../utils/getPaymentsAndSubscriptionsData';
import store from '../../../redux/store';
import ErrorHandler from '../../../utils/ErrorHandler'
import { ApexOptions } from 'apexcharts';
import Loader from '../../../components/Loader/Loader';
import currencies from './currencies.json'

const Profile = (props: any) => {
    const auth = useAuth()
    const database = useDatabase()

    const [readyToRender, setReadyToRender] = React.useState(false)

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
    const [chartSeries, setChartSeries] = React.useState<ApexAxisChartSeries>([])

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
                let tempData: any[] = []
                const labels: any[] = []
                const series: any[] = []
                data.map((row: FinancialData, i: number) => {
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
                    } else {
                        if (row.recurrences)
                            tempData.push({
                                title: row.title,
                                amount: row.amount * row.recurrences
                            })
                    }
                })

                tempData.sort((a: any, b: any) => (a.title > b.title) ? 1 : ((b.title > a.title) ? -1 : 0))
                const groupAndMap = (items: any, itemKey: any, childKey: any) => {
                    return _.map(_.groupBy(items, itemKey), (obj, key) => ({
                        [itemKey]: key,
                        [childKey]: obj
                    }))
                }

                let finalData: any = groupAndMap(tempData, 'title', 'amount')
                finalData.map((row: any) => {
                    let rowAmount = 0
                    row.amount.map((amount: any) => rowAmount += amount.amount)
                    row.amount = Number(rowAmount.toFixed(2))
                })
                finalData.sort((a: any, b: any) => (a.amount > b.amount) ? 1 : ((b.amount > a.amount) ? -1 : 0)).slice(0, 5)
                    .map((row: any) => {
                        labels.push(row.title)
                        series.push(Math.abs(row.amount))
                    })

                const theme = localStorage.getItem('chakra-ui-color-mode')

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

                if (series.length > 0) {
                    setChartSeries(series)
                    setRenderChart(true)
                }
                setReadyToRender(true)
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

            {readyToRender ? (
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
                                                <Input w={'250px'} defaultValue={displayName} onChange={(e: React.ChangeEvent<HTMLInputElement>) => setUsername(e.target.value)} className="mx1" />
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
                            </Box>
                        </Box>
                        <Box borderWidth="1px" rounded="lg" overflow="hidden" className="w-100" display="flex" justifyContent="center" alignItems="center">
                            <Box p={4} width="100%">
                                {renderChart
                                    ? <Chart height="350px" options={chartOptions} series={chartSeries} type="pie" />
                                    : chartSeries.length === 0 ? (
                                        <Box align="center">
                                            <Text>Go to frontpage and add some data!</Text>
                                            <Link to="/dashboard/frontpage">
                                                <Button mt={3}>Frontpage</Button>
                                            </Link>
                                        </Box>
                                    )
                                        : (
                                            <Skeleton height="350px" />
                                        )
                                }
                            </Box>
                        </Box>
                    </Grid>
                </div>
            ) : (
                    <Loader />
                )}
        </>
    )
}

export default Profile