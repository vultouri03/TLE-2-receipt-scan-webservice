import express from "express";
import { createWorker } from "tesseract.js";
import path from 'path';
import { fileURLToPath } from 'url';
import * as fs from "fs"
import { ChatOpenAI } from "@langchain/openai"
import { HumanMessage, SystemMessage, AIMessage } from "@langchain/core/messages"
import { error } from "console";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory


const model = new ChatOpenAI({
    temperature: 0.8,
    maxRetries: 10,
    azureOpenAIApiKey: process.env.AZURE_OPENAI_API_KEY,
    azureOpenAIApiVersion: process.env.OPENAI_API_VERSION,
    azureOpenAIApiInstanceName: process.env.INSTANCE_NAME,
    azureOpenAIApiDeploymentName: process.env.ENGINE_NAME,
})

let categories = {"categories": [
    {
        "name": "wheats",
        "amount": 0
    },
    {
        "name": "meat",
        "amount": 0
    },
    {
        "name": "drinks",
        "amount": 0
    },
    {
        "name": "spices",
        "amount": 0
    },
    {
        "name": "dairy",
        "amount": 0
    },
    {
        "name": "vegetables",
        "amount": 0
    },
    {
        "name": "sauces",
        "amount": 0
    }

]
};

const prompt = "Can you categorize these words in the following categories, wheays, meat, drinks, spices, dairy, vegetables, sauces:"
const prompt2 = "please only return the counted values like this :" + `${JSON.stringify(categories)}` + "don't give me an explanation why"


let receiptList = [
    {
        
    }
]

//creates a router which loads the routes
const router = express.Router();



//the get route it sends back a check to show that the app is working
router.get("/", async(req, res) => {
    res.json("we are classefied");
})


//post route for sending status callbacks
router.post("/status", async(req, res) => {
    let reqFound = false
    let reqNumber;

    //compares the id that is send, and returns the status for that request
    if(req.body.id){
    for(let i = 0; i < receiptList.length; i++) {
        //checks if the id is found
        if (req.body.id === receiptList[i].receiptId) {
            reqFound = true
            reqNumber = i
        } 
        }
        //sends back the id's status or none wether the id is found or not
        if (reqFound) {
            res.json(receiptList[reqNumber].status)
        } else {
            res.json("NONE")
        }
    } else {
    //sends back an error if the request has no status code
    res.json("NONE")
}
})

//post requests creates an empty categories array and loads the data from the request so that it can be used with tesseract.js
router.post("/classify", async(req, res)=> {
    let response;
    categories = {
        "dairy": 0,
        "meat": 0,
        "drinks": 0,
        "vegetables": 0,
        "wheats": 0,
        "spices": 0,
        "sauces": 0
    };
    
    //creates a new status item
    if(req.body.id) {
        receiptList.push({"receiptId": req.body.id,
    "status": "PROCESSING"})
    }

    //checks if the image base 64 has been sent
    if (req.body.image) {
        //sets the status text to classifying
        for(let i = 0; i < receiptList.length; i++) {
            if (req.body.id === receiptList[i].receiptId) {
                receiptList[i].status = "CLASSIFYING"
            }
        }
        let image = req.body.image;

        image = image.replace("data:image/png;base64,", "")

        const imageData = Buffer.from(image, 'base64');

        // Save the image to a temporary file
        const tempImagePath = path.join(__dirname, 'temp', 'temp_image.jpg');
        fs.writeFileSync(tempImagePath, imageData);

    // Read the image and set to text
    (async () => {
        
        const worker = await createWorker('nld');
        const ret = await worker.recognize(tempImagePath);
        console.log(ret.data.text);
        response = ret.data.text
        await worker.terminate();

        //todo add gpt to read this text
        for(let i = 0; i < receiptList.length; i++) {
            if (req.body.id === receiptList[i].receiptId) {
                receiptList[i].status = "CATEGORIZING"
            }
        }
        let categoryItems =await categorizeProducts(ret.data.text)
        console.log(categoryItems.content);
        try {response = JSON.parse(categoryItems.content)}

        catch{
            error()
        }
        res.json(response)

        // Remove the temporary image file after reading it
        await fs.unlinkSync(tempImagePath);


    })();
    } else {
        //fills the array with dummy data in case the image hasn't been sent yet
        categories.dairy += 10;
    }

    //sets the status text to success
    for(let i = 0; i < receiptList.length; i++) {
        if (req.body.id === receiptList[i].receiptId) {
            receiptList[i].status = "SUCCESS"
        }
    }

})

async function categorizeProducts(products) {
    return await model.invoke(prompt + products + prompt2)
}

//exports the router
export default router