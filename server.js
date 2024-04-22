import express from "express"
import router from "./router.js";
import cors from "cors"

//creates a basic express app
const app = express();

//allows the use of json and urlencoded requests
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));
app.use(cors())



//loads the routes from the /classify url
app.use("/", router)



//opens the app on port 8000
app.listen("8000")

