function CurrencyFormatter(num: number): string {
    const localStorageSettings: any = localStorage.getItem('settings')
    const localStorageExchangerates: any = localStorage.getItem('exchangerates')

    const settings = JSON.parse(localStorageSettings)
    const exchangerates = JSON.parse(localStorageExchangerates)
    const selectedCurrency = settings.currency[0]

    const numberFormat = new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: selectedCurrency
    })

    if (selectedCurrency !== 'EUR') {
        num = Number((num * exchangerates[selectedCurrency]).toFixed(2))
        return numberFormat.format(num)
    } else {
        return numberFormat.format(num)
    }
}

export default CurrencyFormatter