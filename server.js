import express from "express"
import router from "./router.js";

//creates a basic express app
const app = express();

//allows the use of json and urlencoded requests
app.use(express.json());
app.use(express.urlencoded({
    extended: false
}));

//loads the routes from the /classify url
app.use("/classify", router)




// Post a base64String decode it to image and read image
app.post('/process-base64', (req, res) => {
    
});

//opens the app on port 8000
app.listen("8000")

