import React from 'react'
import ReactDOM from 'react-dom'
import config from './config'

// App
import App from './App'

// Chakra UI
import { ChakraProvider, CSSReset } from '@chakra-ui/react'

// Firebase
import { FirebaseAppProvider } from 'reactfire'

// Redux
import store from './redux/store'
import { Provider } from 'react-redux'

// Toastify
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';

// CSS
import './css/style.scss'
import './css/box-model.css'

console.clear()

ReactDOM.render((
    <ChakraProvider>
        <FirebaseAppProvider firebaseConfig={config.firebaseConfig}>
            <Provider store={store}>
                <App />
                <CSSReset />
                <ToastContainer
                    hideProgressBar={true}
                />
            </Provider>
        </FirebaseAppProvider>
    </ChakraProvider>
), document.getElementById('root'))