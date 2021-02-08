import React from 'react'

// Chakra UI
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay, NumberDecrementStepper, NumberIncrementStepper, NumberInput, NumberInputField, NumberInputStepper } from '@chakra-ui/react'
import { toast } from 'react-toastify'
import ErrorHandler from '../../../utils/ErrorHandler'
import { useAuth, useDatabase, useFirestore } from 'reactfire'
import checkNumber from '../../../utils/checkNumber'
import store from '../../../redux/store'

interface Props {
    open: boolean
    title: string
    type: string
    negOrPos: string
    index: number
}

const DataModal = (props: Props) => {
    const firestore = useFirestore()
    const auth = useAuth()
    const database = useDatabase()

    let [title, setTitle] = React.useState('')
    let [amount, setAmount] = React.useState<any>()
    let [selectedDate, setSelectedDate] = React.useState('')

    React.useEffect(() => {
        setSelectedDate(`${new Date().getFullYear()}-${checkNumber(new Date().getMonth() + 1)}-${checkNumber(new Date().getDate())}`)
    }, [])

    const handleDialogClose = () => {
        let newArray = [false, false, false, false]
        store.dispatch({ type: 'closeModals', newArr: newArray })
    }

    const handleSave = (e: any) => {
        e.preventDefault()
        const localStorageSettings: any = localStorage.getItem('settings')
        const localStorageExchangerates: any = localStorage.getItem('exchangerates')

        const settings = JSON.parse(localStorageSettings)
        const exchangerates = JSON.parse(localStorageExchangerates)

        if (settings.currency[0] !== 'EUR') amount = Number((amount / exchangerates[settings.currency[0]]).toFixed(2))
        else amount = Number(amount)

        if (props.negOrPos === 'negative') amount = amount - (amount * 2)

        if (props.type === 'salary') {
            database.ref(`${auth.currentUser?.uid}/salary`).set(amount)
                .then(() => toast.success('Saved successfully'))
                .catch((err: Error) => new ErrorHandler(err.message))
        } else {
            const data = {
                title: title,
                amount: amount,
                date: selectedDate
            }
            const ref = firestore.collection('financial_data').doc(`${auth.currentUser?.uid}`).collection(props.type)
            ref.add(data)
                .then(() => toast.success('Saved successfully'))
                .catch((err: Error) => new ErrorHandler(err.message))
        }
        handleDialogClose()
    }

    return (
        <Modal
            isOpen={props.open}
            onClose={handleDialogClose}
        >
            <form onSubmit={handleSave}>
                <ModalOverlay />
                <ModalContent>
                    <ModalHeader>{props.title}</ModalHeader>
                    <ModalCloseButton onClick={handleDialogClose} />
                    <ModalBody pb={6}>
                        {props.type !== 'salary'
                            ? (
                                <FormControl className="my1">
                                    <FormLabel htmlFor="title">Title</FormLabel>
                                    <Input
                                        id="title"
                                        type="text"
                                        placeholder="e.g. Gas"
                                        onInput={(e: any) => setTitle(e.target.value)}
                                        isRequired
                                    />
                                </FormControl>
                            )
                            : <></>
                        }

                        <FormControl className="my1">
                            <FormLabel htmlFor="amount">Amount</FormLabel>
                            <NumberInput clampValueOnBlur={false}>
                                <NumberInputField onChange={(e: any) => setAmount(e.target.value)} />
                                <NumberInputStepper>
                                    <NumberIncrementStepper />
                                    <NumberDecrementStepper />
                                </NumberInputStepper>
                            </NumberInput>
                        </FormControl>

                        {props.type !== 'salary'
                            ? (
                                <FormControl className="my1">
                                    <FormLabel htmlFor="selectedDate">Pick date</FormLabel>
                                    <Input
                                        value={selectedDate}
                                        id="selectedDate"
                                        type="date"
                                        onChange={(e: any) => setSelectedDate(e.target.value)}
                                        isRequired
                                    />
                                </FormControl>
                            )
                            : <></>
                        }
                    </ModalBody>

                    <ModalFooter>
                        <Button mr={3} onClick={handleDialogClose}>Cancel</Button>
                        <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                    </ModalFooter>
                </ModalContent>
            </form>
        </Modal>
    )
}

export default DataModal