import { toast } from "react-toastify"

class ErrorHandler {
    constructor(errorMessage: string) {
        toast.error(errorMessage)
    }
}

export default ErrorHandler