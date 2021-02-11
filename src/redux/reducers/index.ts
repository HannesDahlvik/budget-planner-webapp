import { combineReducers } from "redux"

// Reducers
import dataModal from './dataModal'
import pfpChanger from './pfpChanger'
import productChange from './productChange'
import editDataModal from './editDataModal'

export default combineReducers({ dataModal, pfpChanger, productChange, editDataModal })