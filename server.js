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

const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');

// Post a base64String decode it to image and read image
app.post('/process-base64', (req, res) => {
    const base64String = req.body.base64String; // Assuming you're sending the Base64 string in the request body
    const imageData = Buffer.from(base64String, 'base64');

    // Save the image to a temporary file
    const tempImagePath = path.join(__dirname, 'temp', 'temp_image.jpg');
    fs.writeFileSync(tempImagePath, imageData);

    // Read the image and set to text
    (async () => {
        const worker = await createWorker('eng');
        const ret = await worker.recognize(tempImagePath);
        console.log(ret.data.text);
        await worker.terminate();
        // ret.data.text = image text data
        res.send(ret.data.text)
        // Remove the temporary image file after reading it
        await fs.unlinkSync(tempImagePath);
    })();
});

//opens the app on port 8000
app.listen("8000")

