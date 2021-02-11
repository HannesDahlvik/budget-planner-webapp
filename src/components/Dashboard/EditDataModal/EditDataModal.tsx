import React from 'react'
import { useAuth, useFirestore } from 'reactfire'
import store from '../../../redux/store'

// Chakra UI
import { Button, FormControl, FormLabel, Input, Modal, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, ModalOverlay } from '@chakra-ui/react'

// Utils
import ErrorHandler from '../../../utils/ErrorHandler'
import { toast } from 'react-toastify'

const EditDataModal = (props: any) => {
    const firestore = useFirestore()
    const auth = useAuth()

    const [title, setTitle] = React.useState<any>()
    const [amount, setAmount] = React.useState<any>()
    const [date, setDate] = React.useState<any>()

    React.useEffect(() => {
        if (props.data) {
            setTitle(props.data.title)
            setAmount(Math.abs(props.data.amount))
            setDate(props.data.date)
        }
    }, [props.data]);

    const closeModal = () => {
        store.dispatch({ type: 'closeEditDataModal', newVal: false })
    }

    const handleSave = () => {
        firestore.collection('financial_data').doc(auth.currentUser?.uid).collection(props.data.type).doc(props.data.id).update({
            title,
            amount: -Math.abs(amount),
            date
        })
            .then(() => toast.success(`Changed ${title} successfully!`))
            .catch((err: Error) => new ErrorHandler(err.message))
        store.dispatch({ type: 'closeEditDataModal', newVal: false })
    }

    return (
        <Modal isOpen={props.isOpen} onClose={closeModal}>
            <ModalOverlay />
            <ModalContent>
                <ModalHeader>Edit {props.type}</ModalHeader>
                <ModalCloseButton onClick={closeModal} />
                <ModalBody pb={6}>
                    <>
                        <FormControl className="my1">
                            <FormLabel htmlFor="title">Title</FormLabel>
                            <Input value={title} id="title" type="text" placeholder="e.g. Gas" onInput={(e: any) => setTitle(e.target.value)} isRequired={true} />
                        </FormControl>

                        <FormControl className="my1">
                            <FormLabel htmlFor="amount">Amount</FormLabel>
                            <Input value={amount} id="amount" type="number" placeholder="e.g. 123" onInput={(e: any) => setAmount(e.target.value)} isRequired={true} />
                        </FormControl>
                        <FormControl className="my1">
                            <FormLabel htmlFor="selectedDate">Pick date</FormLabel>
                            <Input value={date} id="selectedDate" type="date" onChange={(e: any) => setDate(e.target.value)} isRequired={true} />
                        </FormControl>
                    </>
                </ModalBody>
                <ModalFooter>
                    <Button mr={3} onClick={closeModal}>Cancel</Button>
                    <Button colorScheme="blue" onClick={handleSave}>Save</Button>
                </ModalFooter>
            </ModalContent>
        </Modal >
    )
}

export default EditDataModal