export type FinancialData = {
    amount: number
    date: string
    id: string
    title: string
    type: string
    year?: number
    recurrences?: number
}

export type CalendarData = {
    amount?: string
    end: Date
    start: Date
    title: string
}