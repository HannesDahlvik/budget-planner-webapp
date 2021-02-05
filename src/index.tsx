import React from 'react'
import ReactDOM from 'react-dom'
import config from './config'

// App
import App from './App'

// Redux
import { store } from './redux/store'
import { Provider } from 'react-redux'

// Firebase
import { FirebaseAppProvider } from 'reactfire'

ReactDOM.render((
    <FirebaseAppProvider firebaseConfig={config.firebaseConfig}>
        <Provider store={store}>
            <App />
        </Provider>
    </FirebaseAppProvider>
), document.getElementById('root'))