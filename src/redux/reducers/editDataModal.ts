const editDataModal = (state = { value: false }, action: any) => {
    switch (action.type) {
        case 'closeEditDataModal':
            return { value: state.value = action.newVal }
        case 'setOpenEditDataModal':
            return { value: state.value = action.newVal }
        default:
            return state
    }
}

export default editDataModal
