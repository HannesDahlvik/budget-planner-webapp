import React from 'react'
import { useAuth, useDatabase } from 'reactfire'

// Types
import { FinancialData } from '../../../types'

import { format } from 'date-fns'

// Chakra UI
import { Box, Button, Grid, Skeleton, Stat, StatArrow, StatGroup, StatHelpText, StatLabel, StatNumber } from '@chakra-ui/react'
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons'

// Chart
import Chart from 'react-apexcharts'
import { ApexOptions } from 'apexcharts'
import checkNumber from '../../../utils/checkNumber'

// Utils
import ErrorHandler from '../../../utils/ErrorHandler'
import CurrencyFormatter from '../../../utils/CurrencyFormatter'
import DataModal from '../../../components/Dashboard/DataModal/DataModal'
import Loader from '../../../components/Loader/Loader'
import store from '../../../redux/store'
import getPaymentsAndSubscriptionsData from '../../../utils/getPaymentsAndSubscriptionsData'

const Frontpage = React.memo((props: any) => {
    const database = useDatabase()
    const auth = useAuth()

    const [readyToRender, setReadyToRender] = React.useState(false)

    const [dialogs, setDialogs] = React.useState([false, false, false, false])
    const [selectedYear, setSelectedYear] = React.useState<any>(new Date().getFullYear())
    const [monthlyTotal, setMonthlyTotal] = React.useState(0)
    const [selectedMonth, setSelectedMonth] = React.useState()
    const [selectedDate, setSelectedDate] = React.useState<any>()

    const [renderChart, setRenderChart] = React.useState(false)

    const [salary, setSalary] = React.useState(0)
    const [expences, setExpences] = React.useState(0)

    const [paymentsData, setPaymentsData] = React.useState()
    const [subscriptionsData, setSubscriptionsData] = React.useState()

    const [chartOptions, setChartOptions] = React.useState<ApexOptions>()
    const [chartSeries, setChartSeries] = React.useState<ApexAxisChartSeries>()

    React.useEffect(() => {
        getData()
        initChart()
    }, [selectedYear, dialogs[0], dialogs[1], dialogs[2], dialogs[3]])

    React.useEffect(() => {
        store.subscribe(() => {
            setDialogs(store.getState().dataModal.value)
        })
    }, [])

    // Year changer
    const prevYear = async () => {
        let selectedYearInstance = await selectedYear
        selectedYearInstance--
        await setSelectedYear(selectedYearInstance)
    }

    const nextYear = async () => {
        let selectedYearInstance = await selectedYear
        selectedYearInstance++
        await setSelectedYear(selectedYearInstance)
    }

    const resetDate = async () => {
        const d = new Date()
        setSelectedMonth(checkNumber(d.getMonth()))
        setSelectedYear(d.getFullYear())
    }

    const getData = async () => {
        await database.ref(`${auth.currentUser?.uid}/salary`).on('value', (snapshot: any) => {
            setSalary(snapshot.val() * 12)
        })
    }

    const handleDialogOpen = (index: any) => {
        let tempArr = [false, false, false, false]
        tempArr[index] = true
        store.dispatch({ type: 'setOpenModal', newArr: tempArr })
        setDialogs(tempArr)
        setSelectedDate(format(Date.now(), 'yyyy-MM-dd'))
    }

    const initChart = async () => {
        getPaymentsAndSubscriptionsData()
            .then((res: FinancialData[]) => {
                const moneyUsageArr: any = Array.from({ length: 12 }).fill(0)
                const subscriptionsData: any = Array.from({ length: 12 }).fill(0)
                const paymentsData: any = Array.from({ length: 12 }).fill(0)

                res.map((row: FinancialData) => {
                    if (row.type === 'subscriptions') {
                        if (row.year === selectedYear) {
                            let subscriptions: any = Array.from({ length: 12 }).fill(0)
                            if (row.recurrences)
                                for (let i = 0; i < subscriptions.length; i++) {
                                    if (i % (12 / row.recurrences) === 0) subscriptions[i] = Number(Math.abs(row.amount))
                                }

                            for (let i = 0; i < 12; i++) {
                                subscriptionsData[i] += parseFloat(String(Math.abs(subscriptions[i])))
                                moneyUsageArr[i] += parseFloat(String(Math.abs(row.amount)))
                            }
                        }

                    } else {
                        if ((row.date).split('-')[0] == selectedYear) {
                            const month = parseInt(row.date.split('-')[1])
                            paymentsData[month - 1] += parseFloat(String(Math.abs(row.amount)))
                            moneyUsageArr[month - 1] += parseFloat(String(Math.abs(row.amount)))
                        }
                    }
                })

                calculateCurrentMonthTotal(res, subscriptionsData)
                calculateExpences(paymentsData, subscriptionsData)

                moneyUsageArr.map((row: number, i: number) => {
                    moneyUsageArr[i] = parseFloat(row.toFixed(2))
                })

                let payments: any = paymentsData
                let subscriptions: any = subscriptionsData
                for (let i: number = 0; i < 12; i++) {
                    payments[i] = parseFloat(payments[i].toFixed(2))
                    subscriptions[i] = parseFloat(subscriptions[i].toFixed(2))
                }

                setPaymentsData(payments)
                setSubscriptionsData(subscriptions)

                const getMinMaxValues = (func: any, array: any[]) => func.apply(Math, array)
                const minimum = getMinMaxValues(Math.min, paymentsData)
                const maximum = getMinMaxValues(Math.max, moneyUsageArr)

                setChartOptions({
                    chart: {
                        toolbar: { show: false },
                        foreColor: '#808080'
                    },
                    tooltip: {
                        enabled: true,
                        theme: 'dark',
                    },
                    dataLabels: { enabled: false },
                    xaxis: { categories: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"] },
                    yaxis: {
                        min: minimum,
                        max: maximum + 10
                    }
                })
                setChartSeries([
                    {
                        name: "Payments",
                        data: paymentsData
                    },
                    {
                        name: "Subscriptions",
                        data: subscriptionsData
                    }
                ])
                setRenderChart(true)
                setReadyToRender(true)
            })
            .catch((err: Error) => new ErrorHandler(err.message))
    }

    const calculateCurrentMonthTotal = (data: FinancialData[], subscriptionsData: number[]) => {
        let monthlyTotal: number = 0
        data.map((row: FinancialData) => {
            if (row.type === 'payments') {
                let date: string[] | string = row.date.split('-')
                date = `${date[1]}/${date[0]}`
                const checkDate: string = `${checkNumber(new Date().getMonth() + 1)}/${selectedYear}`
                if (date === checkDate) monthlyTotal += row.amount
            }
        })
        monthlyTotal += -Math.abs(subscriptionsData[new Date().getMonth()])
        setMonthlyTotal(Number(monthlyTotal.toFixed(2)))
    }

    const calculateExpences = async (paymentsData: number[], subscriptionsData: number[]) => {
        let expences: number = 0
        paymentsData.map((row: number) => expences += row)
        subscriptionsData.map((row: number) => expences += row)
        setExpences(-Math.abs(Number(expences)))
    }

    if (readyToRender) {
        return (
            <div className="dashboard-frontpage">
                <Grid templateColumns="1fr" p={4} gap={5}>
                    <Box borderWidth="1px" rounded="lg" overflow="hidden">
                        <Box>
                            <div className="month-changer px4 py2">
                                <ChevronLeftIcon onClick={() => prevYear()} />
                                <p style={{ cursor: 'pointer' }} onClick={resetDate}>{selectedYear}</p>
                                <ChevronRightIcon onClick={() => nextYear()} />
                            </div>
                        </Box>
                    </Box>
                </Grid>
                <Grid templateColumns="1fr 1fr" p={6} gap={5} templateRows="200px">
                    <Box borderWidth="1px" rounded="lg" overflow="hidden">
                        <Box className="h-100">
                            <Grid templateColumns="repeat(2, 1fr)" className="h-100" style={{ alignItems: 'center' }}>
                                <Button colorScheme="green" className="m2" onClick={() => handleDialogOpen(0)}>Add payment</Button>
                                <Button colorScheme="green" className="m2" onClick={() => handleDialogOpen(1)}>Add subscription</Button>
                                <Button colorScheme="blue" className="m2" onClick={() => handleDialogOpen(2)}>Add received payment</Button>
                                <Button colorScheme="blue" className="m2" onClick={() => handleDialogOpen(3)}>Edit salary</Button>
                            </Grid>
                            {<DataModal open={dialogs[0]} title="Add payment" type="payments" negOrPos="negative" index={0} />}
                            {<DataModal open={dialogs[1]} title="Add subscription" type="subscriptions" negOrPos="negative" index={1} />}
                            {<DataModal open={dialogs[2]} title="Add received payment" type="payments" negOrPos="positive" index={2} />}
                            {<DataModal open={dialogs[3]} title="Edit salary" type="salary" negOrPos="positive" index={3} />}
                        </Box>
                    </Box>
                    <Box borderWidth="1px" rounded="lg" overflow="hidden">
                        <Box p={4} className="h-100">
                            <StatGroup>
                                <Grid gridTemplateColumns="1fr 1fr" gridTemplateRows="1fr 1fr" className="w-100">
                                    <Stat>
                                        <StatLabel>Yearly income</StatLabel>
                                        <StatHelpText>
                                            {salary !== null ? (
                                                <>
                                                    <StatNumber>{CurrencyFormatter(salary)}</StatNumber>
                                                    <StatArrow type={(salary % 100) > 0 ? 'increase' : 'decrease'} />
                                                    {(salary % 100).toFixed(2)}%
                                                    </>
                                            ) : (
                                                    <>
                                                        <Skeleton height="35px" />
                                                        <Skeleton mt={1} height="15px" />
                                                    </>
                                                )}
                                        </StatHelpText>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Yearly expences</StatLabel>
                                        <StatHelpText>
                                            {expences !== null ? (
                                                <>
                                                    <StatNumber>{CurrencyFormatter(expences)}</StatNumber>
                                                    <StatArrow type={(expences % 100) > 0 ? 'increase' : 'decrease'} />
                                                    {(expences % 100).toFixed(2)}%
                                                    </>
                                            ) : (
                                                    <>
                                                        <Skeleton height="35px" />
                                                        <Skeleton mt={1} height="15px" />
                                                    </>
                                                )}
                                        </StatHelpText>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Yearly profit</StatLabel>
                                        <StatHelpText>
                                            {(salary || expences) !== null ? (
                                                <>
                                                    <StatNumber>{CurrencyFormatter(salary + expences)}</StatNumber>
                                                    <StatArrow type={(salary % expences) > 0 ? 'increase' : 'decrease'} />
                                                    {(salary % expences).toFixed(2)}%
                                                    </>
                                            ) : (
                                                    <>
                                                        <Skeleton height="35px" />
                                                        <Skeleton mt={1} height="15px" />
                                                    </>
                                                )}
                                        </StatHelpText>
                                    </Stat>
                                    <Stat>
                                        <StatLabel>Month total</StatLabel>
                                        <StatHelpText>
                                            {monthlyTotal !== null ? (
                                                <>
                                                    <StatNumber>{CurrencyFormatter(monthlyTotal)}</StatNumber>
                                                    <StatArrow type="decrease" />
                                                    {(monthlyTotal % 100).toFixed(2)}%
                                                    </>
                                            ) : (
                                                    <>
                                                        <Skeleton height="35px" />
                                                        <Skeleton mt={1} height="15px" />
                                                    </>
                                                )}
                                        </StatHelpText>
                                    </Stat>
                                </Grid>
                            </StatGroup>
                        </Box>
                    </Box>
                </Grid>
                <Grid templateColumns="1fr" p={6} gap={5} templateRows="350px">
                    <Box borderWidth="1px" rounded="lg" overflow="hidden">
                        <Box p={4} className="h-100">
                            {renderChart ? (
                                <Chart
                                    height="100%"
                                    options={chartOptions}
                                    series={chartSeries}
                                    type="area"
                                />
                            ) : (
                                    <Skeleton height="100%" />
                                )}
                        </Box>
                    </Box>
                </Grid>
            </div>
        )
    } else {
        return <Loader />
    }
})

export default Frontpage