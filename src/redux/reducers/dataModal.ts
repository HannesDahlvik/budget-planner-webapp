const dataModal = (state = { value: [false, false, false, false] }, action: any) => {
    switch (action.type) {
        case 'closeModals':
            return { value: state.value = action.newArr }
        case 'setOpenModal':
            return { value: state.value = action.newArr }
        default:
            return state
    }
}

export default dataModal
