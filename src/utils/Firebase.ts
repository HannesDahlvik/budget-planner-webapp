import app from "firebase/app";
import "firebase/auth";
import "firebase/database";
import config from "../config";

class Firebase {
    auth: app.auth.Auth
    db: app.database.Database

    constructor() {
        app.initializeApp(config.firebaseConfig)

        this.auth = app.auth()
        this.db = app.database()
    }
}

export default Firebase