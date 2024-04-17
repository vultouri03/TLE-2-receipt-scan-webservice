import express from "express";
import { createWorker } from "tesseract.js";
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from "fs"

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

//creates a router which loads the routes
const router = express.Router();

//the get route it sends back a check to show that the app is working
router.get("/", async(req, res) => {
    res.json("we are classefied")
})

//post requests creates an empty categories array and loads the data from the request so that it can be used with tesseract.js
router.post("/classify", async(req, res)=> {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    let categories = {
        "dairy": 0,
        "meat": 0,
        "drinks": 0,
        "vegetables": 0,
        "wheats": 0,
        "spices": 0,
        "sauces": 0
    };

    

    //checks if the image base 64 has been sent
    if (req.body.image) {
        const image = req.body.image;

        const imageData = Buffer.from(image, 'base64');

        // Save the image to a temporary file
        const tempImagePath = path.join(__dirname, 'temp', 'temp_image.jpg');
        fs.writeFileSync(tempImagePath, imageData);

    // Read the image and set to text
    (async () => {
        const worker = await createWorker('eng');
        const ret = await worker.recognize(tempImagePath);
        console.log(ret.data.text);
        await worker.terminate();

        //todo add gpt to read this text


        // Remove the temporary image file after reading it
        await fs.unlinkSync(tempImagePath);

    })();
    } else {
        //fills the array with dummy data in case the image hasn't been sent yet
        categories.dairy += 10;
    }



    res.json(categories)

})

//exports the router
export default router