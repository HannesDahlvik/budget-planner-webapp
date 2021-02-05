import React from 'react'

// Firebase
import 'firebase/analytics'
import { useAnalytics } from 'reactfire';

const App = () => {
    useAnalytics()

    return (
        <div>

        </div>
    )
}

export default App