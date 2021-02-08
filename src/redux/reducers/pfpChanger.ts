const pfpChanger = (state = { value: false }, action: any) => {
    switch (action.type) {
        case 'closePfpChanger':
            return { value: state.value = action.newState }
        case 'openPfpChanger':
            return { value: state.value = action.newState }
        default:
            return state
    }
}

export default pfpChanger