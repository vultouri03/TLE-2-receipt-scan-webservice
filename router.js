import express from "express";

//creates a router which loads the routes
const router = express.Router();

//the get route it sends back a check to show that the app is working
router.get("/", async(req, res) => {
    res.json("we are classefied")
})

//post requests creates an empty categories array and loads the data from the request so that it can be used with tesseract.js
router.post("/", async(req, res)=> {
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


    const image = req.body.image;


    //checks if the image base 64 has been sent
    if (req.body.image) {
        console.log("hello world")
        console.log(atob(image));
    } else {
        //fills the array with dummy data in case the image hasn't been sent yet
        categories.dairy += 10;
    }



    res.json(categories)

})

//exports the router
export default router