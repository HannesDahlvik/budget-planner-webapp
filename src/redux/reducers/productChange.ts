const productChange = (state = { value: false }, action: any) => {
    switch (action.type) {
        case 'productChange':
            return { value: state.value = action.newState }
        default:
            return state
    }
}

export default productChange