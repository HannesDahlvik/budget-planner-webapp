import { combineReducers } from "redux"

// Reducers
import dataModal from './dataModal'
import pfpChanger from './pfpChanger'
import productChange from './productChange'

export default combineReducers({ dataModal, pfpChanger, productChange })