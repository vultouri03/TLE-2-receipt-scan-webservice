var express = require('express');
var app = express();
const { createWorker } = require('tesseract.js');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');

// Body-parser middleware to parse JSON and urlencoded request bodies
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Set app to listen to port 3000
app.listen(3000, function () {
    console.log('Example app listening on port 3000 !');
});

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